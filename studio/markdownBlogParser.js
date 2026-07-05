const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const SUMMARY_HEADING = /^##\s+Project Understanding Summary\s*$/im;
const HORIZONTAL_RULE = /^\s*---+\s*$/m;
const HEADING_ONE = /^#\s+(.+?)\s*$/m;
const HEADING_TWO = /^##\s+(.+?)\s*$/;
const IMAGE_PATTERN = /!\[([^\]]*)\]\(([^)]+)\)/g;

const stripMarkdownFormatting = (value = "") =>
  value
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/[ \t]+$/gm, "")
    .trim();

const slugify = (value = "") =>
  stripMarkdownFormatting(value)
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);

const normalizeImagePath = (value = "") =>
  value
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/^\.?\//, "")
    .replace(/\\/g, "/");

const getImageKeyCandidates = (path) => {
  const normalized = normalizeImagePath(path);
  const parts = normalized.split("/");
  const fileName = parts[parts.length - 1];

  return [normalized, fileName].filter(Boolean);
};

const parseSummary = (markdown) => {
  if (!SUMMARY_HEADING.test(markdown)) return {};

  const afterHeading = markdown.slice(markdown.search(SUMMARY_HEADING)).replace(SUMMARY_HEADING, "");
  const [summaryBlock] = afterHeading.split(HORIZONTAL_RULE);
  const summary = {};

  summaryBlock.split("\n").forEach((line) => {
    const match = line.match(/^\s*-\s+\*\*([^:]+):\*\*\s*(.+?)\s*$/);
    if (!match) return;
    summary[match[1].trim().toLowerCase()] = stripMarkdownFormatting(match[2]);
  });

  return summary;
};

const getMainMarkdown = (markdown) => {
  const parts = markdown.split(HORIZONTAL_RULE);
  const afterRule = parts.slice(1).join("\n---\n").trim();

  if (afterRule && HEADING_ONE.test(afterRule)) return afterRule;

  return markdown.replace(SUMMARY_HEADING, "").trim();
};

const getFirstParagraph = (sections) => {
  for (const section of sections) {
    const paragraph = section.paragraphs.find(Boolean);
    if (paragraph) return paragraph;
  }

  return "";
};

const getReadTime = (markdown) => {
  const words = stripMarkdownFormatting(markdown)
    .split(/\s+/)
    .filter(Boolean).length;

  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

const inferCategory = ({ title, summary }) => {
  const source = [
    title,
    summary["project name"],
    summary["main technologies"],
    summary["main features"],
    summary["suggested blog angle"],
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/(prefect|pipeline|data|postgres|sqlite|etl|warehouse|dataset)/.test(source)) return "Data Engineering";
  if (/(health|medical|clinical|rhd|eeg|seizure)/.test(source)) return "Healthcare AI";
  if (/(nlp|language|amharic|oromo|translation|llm)/.test(source)) return "NLP";
  if (/(flutter|react|fastapi|api|web|mobile|software)/.test(source)) return "Software Engineering";
  if (/(machine learning|deep learning|model|computer vision|ai)/.test(source)) return "Applied ML";

  return "Engineering";
};

const splitParagraphs = (lines) => {
  const paragraphs = [];
  let current = [];
  let inCodeBlock = false;

  const flush = () => {
    const value = stripMarkdownFormatting(current.join("\n"));
    if (value) paragraphs.push(value);
    current = [];
  };

  lines.forEach((line) => {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      current.push(line);
      return;
    }

    if (!inCodeBlock && !line.trim()) {
      flush();
      return;
    }

    current.push(line);
  });

  flush();
  return paragraphs;
};

const parseSectionBody = (rawLines) => {
  const images = [];
  const textLines = [];

  rawLines.forEach((line) => {
    const matches = [...line.matchAll(IMAGE_PATTERN)];
    if (matches.length) {
      matches.forEach((match) => {
        images.push({
          alt: stripMarkdownFormatting(match[1]),
          path: normalizeImagePath(match[2]),
        });
      });
      return;
    }

    textLines.push(line);
  });

  return {
    paragraphs: splitParagraphs(textLines),
    images,
  };
};

const parseSections = (markdownBody) => {
  const lines = markdownBody.split("\n");
  const sections = [];
  let current = null;

  lines.forEach((line) => {
    const headingMatch = line.match(HEADING_TWO);

    if (headingMatch) {
      if (current) sections.push(current);
      current = {
        heading: stripMarkdownFormatting(headingMatch[1]),
        lines: [],
      };
      return;
    }

    if (!current) return;
    current.lines.push(line);
  });

  if (current) sections.push(current);

  return sections
    .map((section, index) => {
      const body = parseSectionBody(section.lines);

      return {
        _type: "textSection",
        _key: `section-${index + 1}`,
        heading: section.heading,
        paragraphs: body.paragraphs,
        imageRefs: body.images,
        sortOrder: index + 1,
      };
    })
    .filter((section) => section.heading && (section.paragraphs.length || section.imageRefs.length));
};

export const parseMarkdownBlog = (markdown, options = {}) => {
  const normalizedMarkdown = markdown.replace(/\r\n/g, "\n").trim();
  const summary = parseSummary(normalizedMarkdown);
  const mainMarkdown = getMainMarkdown(normalizedMarkdown);
  const titleMatch = mainMarkdown.match(HEADING_ONE);
  const title = stripMarkdownFormatting(titleMatch?.[1] || summary["project name"] || options.fileName || "Untitled blog post");
  const body = titleMatch ? mainMarkdown.slice(titleMatch.index + titleMatch[0].length).trim() : mainMarkdown;
  const sections = parseSections(body);
  const excerpt = summary["one-sentence summary"] || getFirstParagraph(sections).slice(0, 220);
  const category = inferCategory({ title, summary });
  const slug = slugify(title) || slugify(options.fileName) || `imported-blog-${Date.now()}`;

  return {
    title,
    slug,
    date: MONTH_FORMATTER.format(new Date()),
    readTime: getReadTime(body),
    category,
    excerpt,
    sections,
    seo: {
      _type: "seo",
      title: `${title} | Olyad Mulugeta`,
      description: excerpt,
    },
  };
};

export const getMarkdownImagePaths = (post) => {
  const paths = new Set();

  post.sections.forEach((section) => {
    section.imageRefs.forEach((image) => {
      paths.add(image.path);
    });
  });

  return [...paths];
};

export const getImageKeyCandidatesForPath = getImageKeyCandidates;
