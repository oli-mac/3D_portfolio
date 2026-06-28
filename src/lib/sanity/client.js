import { createClient } from "@sanity/client";
import { hasSanityConfig, sanityConfig } from "./config";

export const sanityClient = hasSanityConfig
  ? createClient({
      projectId: sanityConfig.projectId,
      dataset: sanityConfig.dataset,
      apiVersion: sanityConfig.apiVersion,
      useCdn: sanityConfig.useCdn,
    })
  : null;
