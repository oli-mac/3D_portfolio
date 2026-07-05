import React, { useMemo, useState } from "react";
import { Box, Button, Card, Checkbox, Container, Flex, Grid, Heading, Spinner, Stack, Text, TextArea, TextInput, useToast } from "@sanity/ui";
import { useClient } from "sanity";
import { getImageKeyCandidatesForPath, getMarkdownImagePaths, parseMarkdownBlog } from "./markdownBlogParser.js";

const apiVersion = process.env.VITE_SANITY_API_VERSION || "2026-06-28";

const readTextFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });

const getFileCandidates = (file) => {
  const relativePath = file.webkitRelativePath || file.name;
  const cleanPath = relativePath.replace(/^\.?\//, "").replace(/\\/g, "/");
  const parts = cleanPath.split("/");

  return [cleanPath, parts[parts.length - 1]].filter(Boolean);
};

const getImageFileMap = (files) => {
  const map = new Map();

  files.forEach((file) => {
    getFileCandidates(file).forEach((candidate) => map.set(candidate, file));
  });

  return map;
};

const stopStudioFormEvent = (event) => {
  event.stopPropagation();
};

const getSectionImages = async ({ client, imageRefs, imageFileMap, uploadedAssets, warnings }) => {
  const images = [];

  for (const imageRef of imageRefs) {
    const candidates = getImageKeyCandidatesForPath(imageRef.path);
    const file = candidates.map((candidate) => imageFileMap.get(candidate)).find(Boolean);

    if (!file) {
      warnings.push(`No uploaded image matched ${imageRef.path}`);
      continue;
    }

    if (!uploadedAssets.has(file.name)) {
      const asset = await client.assets.upload("image", file, {
        filename: file.name,
        title: imageRef.alt || file.name,
      });
      uploadedAssets.set(file.name, asset);
    }

    images.push({
      _type: "image",
      _key: `${imageRef.path}-${images.length + 1}`.replace(/[^a-zA-Z0-9_-]/g, "-"),
      asset: {
        _type: "reference",
        _ref: uploadedAssets.get(file.name)._id,
      },
      alt: imageRef.alt || file.name,
    });
  }

  return images;
};

const buildBlogDocument = async ({ client, parsedPost, form, imageFiles, createDraft }) => {
  const imageFileMap = getImageFileMap(imageFiles);
  const uploadedAssets = new Map();
  const warnings = [];
  const highestSortOrder = await client.fetch(
    'coalesce(*[_type == "blogPost" && defined(sortOrder)] | order(sortOrder desc)[0].sortOrder, 0)'
  );
  const sortOrder = highestSortOrder + 1;
  const slug = form.slug.trim();
  const documentId = `${createDraft ? "drafts." : ""}blogPost-${slug}`;
  const sections = [];

  for (const section of parsedPost.sections) {
    const images = await getSectionImages({
      client,
      imageRefs: section.imageRefs,
      imageFileMap,
      uploadedAssets,
      warnings,
    });

    sections.push({
      _type: "textSection",
      _key: section._key,
      heading: section.heading,
      paragraphs: section.paragraphs,
      images: images.length ? images : undefined,
      sortOrder: section.sortOrder,
    });
  }

  return {
    document: {
      _id: documentId,
      _type: "blogPost",
      title: form.title.trim(),
      slug: { _type: "slug", current: slug },
      date: form.date.trim(),
      readTime: form.readTime.trim(),
      category: form.category.trim(),
      excerpt: form.excerpt.trim(),
      sections,
      sortOrder,
      seo: {
        _type: "seo",
        title: `${form.title.trim()} | Olyad Mulugeta`,
        description: form.excerpt.trim(),
      },
    },
    warnings,
  };
};

const MarkdownBlogImporter = () => {
  const client = useClient({ apiVersion });
  const toast = useToast();
  const [markdownFileName, setMarkdownFileName] = useState("");
  const [parsedPost, setParsedPost] = useState(null);
  const [form, setForm] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [createDraft, setCreateDraft] = useState(true);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [status, setStatus] = useState("");
  const [warnings, setWarnings] = useState([]);
  const [isImporting, setIsImporting] = useState(false);

  const requiredImagePaths = useMemo(() => (parsedPost ? getMarkdownImagePaths(parsedPost) : []), [parsedPost]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleMarkdownChange = async (event) => {
    event.stopPropagation();
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const markdown = await readTextFile(file);
      const nextParsedPost = parseMarkdownBlog(markdown, { fileName: file.name });
      setMarkdownFileName(file.name);
      setParsedPost(nextParsedPost);
      setForm({
        title: nextParsedPost.title,
        slug: nextParsedPost.slug,
        date: nextParsedPost.date,
        readTime: nextParsedPost.readTime,
        category: nextParsedPost.category,
        excerpt: nextParsedPost.excerpt,
      });
      setWarnings([]);
      setStatus(`Parsed ${nextParsedPost.sections.length} sections from ${file.name}.`);
    } catch (error) {
      setStatus("");
      setParsedPost(null);
      setForm(null);
      toast.push({ status: "error", title: "Could not parse Markdown", description: error.message });
    }
  };

  const handleImageChange = (event) => {
    event.stopPropagation();
    setImageFiles(Array.from(event.target.files || []));
  };

  const handleImport = async () => {
    if (!parsedPost || !form) return;

    setIsImporting(true);
    setStatus("Creating blog post in Sanity...");
    setWarnings([]);

    try {
      const { document, warnings: importWarnings } = await buildBlogDocument({
        client,
        parsedPost,
        form,
        imageFiles,
        createDraft,
      });

      if (replaceExisting) {
        await client.createOrReplace(document);
      } else {
        await client.create(document);
      }

      setWarnings(importWarnings);
      setStatus(`Created ${createDraft ? "draft" : "published"} blog post: ${document.title}`);
      toast.push({ status: "success", title: "Blog imported", description: document.title });
    } catch (error) {
      const conflictMessage = error.statusCode === 409 ? "A blog post with this slug already exists. Enable replace existing or change the slug." : error.message;
      setStatus("");
      toast.push({ status: "error", title: "Import failed", description: conflictMessage });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Container width={2}>
      <Box padding={4}>
        <Stack space={5}>
          <Stack space={3}>
            <Heading size={3}>Import Blog Markdown</Heading>
            <Text muted size={1}>
              Upload a Markdown file to create a Sanity blog post with title, excerpt, category, read time, sections, and optional matched images.
            </Text>
          </Stack>

          <Card border padding={4} radius={2}>
            <Stack space={4}>
              <Stack space={3}>
                <Text weight="semibold">Markdown file</Text>
                <input
                  accept=".md,.markdown,text/markdown,text/plain"
                  type="file"
                  onChange={handleMarkdownChange}
                  onClick={stopStudioFormEvent}
                  onInput={stopStudioFormEvent}
                  onProgress={stopStudioFormEvent}
                />
                {markdownFileName ? <Text muted size={1}>Selected: {markdownFileName}</Text> : null}
              </Stack>

              <Stack space={3}>
                <Text weight="semibold">Optional images</Text>
                <input
                  accept="image/*,.svg"
                  multiple
                  type="file"
                  onChange={handleImageChange}
                  onClick={stopStudioFormEvent}
                  onInput={stopStudioFormEvent}
                  onProgress={stopStudioFormEvent}
                />
                {requiredImagePaths.length ? (
                  <Text muted size={1}>
                    Markdown references: {requiredImagePaths.join(", ")}
                  </Text>
                ) : null}
                {imageFiles.length ? <Text muted size={1}>Uploaded image files: {imageFiles.length}</Text> : null}
              </Stack>
            </Stack>
          </Card>

          {form ? (
            <Card border padding={4} radius={2}>
              <Stack space={4}>
                <Heading size={2}>Review imported fields</Heading>

                <Grid columns={[1, 1, 2]} gap={4}>
                  <Stack space={2}>
                    <Text weight="semibold">Title</Text>
                    <TextInput value={form.title} onChange={(event) => updateForm("title", event.currentTarget.value)} />
                  </Stack>

                  <Stack space={2}>
                    <Text weight="semibold">Slug</Text>
                    <TextInput value={form.slug} onChange={(event) => updateForm("slug", event.currentTarget.value)} />
                  </Stack>

                  <Stack space={2}>
                    <Text weight="semibold">Date</Text>
                    <TextInput value={form.date} onChange={(event) => updateForm("date", event.currentTarget.value)} />
                  </Stack>

                  <Stack space={2}>
                    <Text weight="semibold">Read time</Text>
                    <TextInput value={form.readTime} onChange={(event) => updateForm("readTime", event.currentTarget.value)} />
                  </Stack>

                  <Stack space={2}>
                    <Text weight="semibold">Category</Text>
                    <TextInput value={form.category} onChange={(event) => updateForm("category", event.currentTarget.value)} />
                  </Stack>
                </Grid>

                <Stack space={2}>
                  <Text weight="semibold">Excerpt</Text>
                  <TextArea rows={4} value={form.excerpt} onChange={(event) => updateForm("excerpt", event.currentTarget.value)} />
                </Stack>

                <Card padding={3} radius={2} tone="transparent">
                  <Stack space={3}>
                    <Text size={1}>
                      Parsed sections: {parsedPost.sections.length}
                    </Text>
                    <Flex align="center" gap={3}>
                      <Checkbox checked={createDraft} onChange={(event) => setCreateDraft(event.currentTarget.checked)} />
                      <Text size={1}>Create as draft for review</Text>
                    </Flex>
                    <Flex align="center" gap={3}>
                      <Checkbox checked={replaceExisting} onChange={(event) => setReplaceExisting(event.currentTarget.checked)} />
                      <Text size={1}>Replace existing post with the same slug</Text>
                    </Flex>
                  </Stack>
                </Card>

                <Flex align="center" gap={3}>
                  <Button disabled={isImporting || !form.title || !form.slug} onClick={handleImport} text={isImporting ? "Importing..." : "Import to Sanity"} tone="primary" />
                  {isImporting ? <Spinner muted /> : null}
                </Flex>
              </Stack>
            </Card>
          ) : null}

          {status ? (
            <Card border padding={3} radius={2} tone="positive">
              <Text size={1}>{status}</Text>
            </Card>
          ) : null}

          {warnings.length ? (
            <Card border padding={3} radius={2} tone="caution">
              <Stack space={2}>
                {warnings.map((warning) => (
                  <Text key={warning} size={1}>
                    {warning}
                  </Text>
                ))}
              </Stack>
            </Card>
          ) : null}
        </Stack>
      </Box>
    </Container>
  );
};

export default MarkdownBlogImporter;
