import { motion } from "framer-motion";
import { urlForImage } from "@/lib/sanity/image";

const SanityImage = ({ image, alt, width = 1200, quality = 85, className = "", motionImage = false, ...props }) => {
  const src = urlForImage(image, { width, quality });
  if (!src) return null;

  const resolvedAlt = alt || image?.alt || "";
  const ImageTag = motionImage ? motion.img : "img";

  return <ImageTag src={src} alt={resolvedAlt} className={className} {...props} />;
};

export default SanityImage;
