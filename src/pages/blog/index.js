import React from "react";
import Layout from "@/components/Layout";
import AnimatedText from "@/components/AnimatedText";
import TransitionEffect from "@/components/TransitionEffect";
import SEO from "@/components/SEO";

const BlogCard = ({ post, actionLabel }) => (
  <article className="relative flex h-full min-h-[360px] flex-col justify-between overflow-hidden rounded-2xl border border-solid border-light/45 bg-light/25 p-5 shadow-[0_18px_45px_rgba(27,27,27,0.07)] backdrop-blur-2xl dark:border-light/10 dark:bg-dark/20 dark:shadow-[0_18px_45px_rgba(0,0,0,0.24)] xs:min-h-0 xs:p-4">
    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/35 via-white/[0.08] to-transparent dark:from-white/[0.08] dark:via-white/[0.03]" />
    <div className="relative">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-dark/60 dark:text-light/60">
        <span className="text-primary dark:text-primaryDark">{post.category}</span>
        <span>{post.date}</span>
        <span>{post.readTime}</span>
      </div>
      <a href={`/blog/${post.slug}`} className="hover:underline underline-offset-2">
        <h2 className="mt-4 text-xl font-bold leading-tight md:text-2xl">{post.title}</h2>
      </a>
      <p className="mt-4 text-sm font-medium text-dark/75 dark:text-light/75">{post.excerpt}</p>
    </div>
    <a href={`/blog/${post.slug}`} className="relative mt-8 text-sm font-semibold underline underline-offset-4">
      {actionLabel}
    </a>
  </article>
);

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
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} actionLabel={page.actionLabel} />
            ))}
          </div>
        </Layout>
      </main>
    </>
  );
};

export default Blog;
