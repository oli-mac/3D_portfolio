import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export default {
  api: {
    projectId: process.env.VITE_SANITY_PROJECT_ID,
    dataset: process.env.VITE_SANITY_DATASET || "production",
  },
};
