import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export const urlForImage = (source, options = {}) => {
  if (!builder || !source?.asset) return "";

  let url = builder.image(source).auto("format").fit("max");
  if (options.width) url = url.width(options.width);
  if (options.height) url = url.height(options.height);
  if (options.quality) url = url.quality(options.quality);

  return url.url();
};
