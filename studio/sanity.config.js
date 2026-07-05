import { defineConfig, definePlugin } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "../sanity/schemas/index.js";
import MarkdownBlogImporter from "./MarkdownBlogImporter.jsx";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.VITE_SANITY_DATASET ||
  "production";

if (!projectId) {
  throw new Error(
    "Missing SANITY_STUDIO_PROJECT_ID. Add it to studio/.env or export it before running npm run studio."
  );
}

const markdownBlogImporterTool = definePlugin({
  name: "markdown-blog-importer",
  tools: [
    {
      name: "markdown-blog-importer",
      title: "Import Blog Markdown",
      component: MarkdownBlogImporter,
    },
  ],
});

export default defineConfig({
  name: "portfolio",
  title: "Olyad Portfolio CMS",
  projectId,
  dataset,
  plugins: [structureTool(), markdownBlogImporterTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
