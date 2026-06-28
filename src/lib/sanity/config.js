export const sanityConfig = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || "2026-06-28",
  useCdn: import.meta.env.VITE_SANITY_USE_CDN === "true",
};

export const hasSanityConfig = Boolean(sanityConfig.projectId && sanityConfig.dataset);
