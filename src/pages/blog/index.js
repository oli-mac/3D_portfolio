import React from "react";
import Layout from "@/components/Layout";
import AnimatedText from "@/components/AnimatedText";
import TransitionEffect from "@/components/TransitionEffect";
import SEO from "@/components/SEO";
import SanityImage from "@/components/SanityImage";

const fallbackBlogImages = [
  "/images/projects/ehocardio.jpg",
  "/images/projects/Dagu.png",
  "/images/projects/Enebla-c.png",
  "/images/articles/What%20is%20Redux%20with%20easy%20explanation.png",
];

const getCardImage = (post, index) =>
  post.image ||
  post.sections?.find((section) => section.images?.length)?.images?.[0] ||
  fallbackBlogImages[index % fallbackBlogImages.length];

const BlogCard = ({ post, index }) => {
  const cardImage = getCardImage(post, index);
  const isLocalImage = typeof cardImage === "string";

  return (
    <a
      href={`/blog/${post.slug}`}
      className="group relative flex h-[400px] flex-col justify-end overflow-hidden rounded-2xl border border-solid border-light/45 bg-light/25 shadow-[0_18px_45px_rgba(27,27,27,0.07)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(27,27,27,0.14)] dark:border-light/10 dark:bg-dark/20 dark:shadow-[0_18px_45px_rgba(0,0,0,0.24)] sm:h-[380px] xs:h-[360px]"
      aria-label={post.title}
    >
      {isLocalImage ? (
        <img
          src={cardImage}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <SanityImage
          image={cardImage}
          alt={post.title}
          width={900}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(248,247,246,0.5)_0%,rgba(248,247,246,0.12)_42%,transparent_76%)] dark:bg-[linear-gradient(to_top,rgba(27,27,27,0.74)_0%,rgba(27,27,27,0.28)_45%,transparent_76%)]" />
      <div className="relative w-full border-t border-solid border-white/35 bg-[linear-gradient(135deg,rgba(255,255,255,0.42),rgba(255,255,255,0.18))] p-5 shadow-[0_-16px_42px_rgba(27,27,27,0.1)] backdrop-blur-2xl transition-colors duration-300 group-hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.52),rgba(255,255,255,0.22))] dark:border-light/10 dark:bg-[linear-gradient(135deg,rgba(27,27,27,0.58),rgba(27,27,27,0.28))] dark:group-hover:bg-[linear-gradient(135deg,rgba(27,27,27,0.68),rgba(27,27,27,0.34))] xs:p-4">
        <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold uppercase tracking-wider">
          <span className="text-primary dark:text-primaryDark">{post.category}</span>
          <span className="normal-case tracking-normal text-dark/60 dark:text-light/60">{post.readTime}</span>
        </div>
        <h2 className="line-clamp-2 text-xl font-bold leading-tight text-dark drop-shadow-[0_1px_12px_rgba(255,255,255,0.35)] dark:text-light dark:drop-shadow-none md:text-2xl">
          {post.title}
        </h2>
        <p className="mt-4 text-sm font-semibold text-dark/60 dark:text-light/60">{post.date}</p>
      </div>
    </a>
  );
};

const Blog = ({ page, posts = [], siteSettings }) => {
  return (
    <>
      <SEO
        title={page.seo?.title || siteSettings.seo?.title}
        description={page.seo?.description || siteSettings.seo?.description}
      />
      <TransitionEffect />
      <main className="w-full mb-16 flex flex-col items-center justify-center dark:text-light">
        <Layout className="pt-16 pb-20 px-12">
          <AnimatedText
            text={page.headline}
            className="mb-16 lg:!text-7xl sm:mb-8 sm:!text-6xl xs:!text-4xl"
          />
          <div className="grid w-full grid-cols-4 gap-x-6 gap-y-10 2xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 md:gap-y-10">
            {posts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        </Layout>
      </main>
    </>
  );
};

export default Blog;
