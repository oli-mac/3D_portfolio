import React from "react";
import Layout from "@/components/Layout";
import AnimatedText from "@/components/AnimatedText";
import TransitionEffect from "@/components/TransitionEffect";
import SEO from "@/components/SEO";

const BlogPost = ({ post, page, siteSettings }) => {
  return (
    <>
      <SEO title={post.seo?.title || `${post.title} | ${siteSettings.name}`} description={post.seo?.description || post.excerpt} />
      <TransitionEffect />
      <main className="w-full mb-16 flex flex-col items-center justify-center dark:text-light">
        <Layout className="pt-16 pb-20 px-12">
          <article className="mx-auto max-w-4xl">
            <a href="/blog" className="text-lg font-semibold underline md:text-base">
              {page.backLinkLabel}
            </a>
            <div className="mt-10">
              <AnimatedText
                text={post.title}
                className="mb-8 !text-6xl !text-left lg:!text-5xl md:!text-4xl sm:!text-3xl"
              />
              <div className="flex flex-wrap gap-3 text-sm font-semibold text-dark/60 dark:text-light/60">
                <span className="text-primary dark:text-primaryDark">{post.category}</span>
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
              <p className="mt-8 text-xl font-medium leading-relaxed text-dark/75 dark:text-light/75 md:text-lg">
                {post.excerpt}
              </p>
            </div>

            <div className="mt-12 space-y-10">
              {post.sections.map((section) => (
                <section
                  key={section.heading}
                  className="relative rounded-2xl border border-solid border-dark bg-light p-8 shadow-2xl dark:border-light dark:bg-dark xs:p-5"
                >
                  <div className="absolute -right-3 top-0 -z-10 h-[103%] w-[101%] rounded-[2rem] rounded-br-3xl bg-dark dark:bg-light md:-right-2 md:w-[102%] xs:h-[102%] xs:rounded-[1.5rem]" />
                  <h2 className="text-3xl font-bold lg:text-2xl">{section.heading}</h2>
                  <p className="mt-4 text-lg font-medium leading-relaxed text-dark/75 dark:text-light/75 md:text-base">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
          </article>
        </Layout>
      </main>
    </>
  );
};

export default BlogPost;
