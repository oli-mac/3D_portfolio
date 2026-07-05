import React from "react";
import Layout from "@/components/Layout";
import AnimatedText from "@/components/AnimatedText";
import TransitionEffect from "@/components/TransitionEffect";
import SEO from "@/components/SEO";
import SanityImage from "@/components/SanityImage";
import BlogReactions from "@/components/BlogReactions";

const getSectionParagraphs = (section) => {
  if (section.paragraphs?.length) return section.paragraphs;
  if (!section.body) return [];
  return section.body.split(/\n{2,}/).filter(Boolean);
};

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
              {post.image && (
                <SanityImage
                  image={post.image}
                  width={1400}
                  className="mt-10 h-auto w-full rounded-lg border border-solid border-dark/10 shadow-xl dark:border-light/10"
                />
              )}
            </div>

            <div className="mt-14 space-y-14">
              {post.sections.map((section) => (
                <section key={section.heading} className="border-t border-solid border-dark/10 pt-10 dark:border-light/10">
                  <h2 className="text-3xl font-bold leading-tight lg:text-2xl">{section.heading}</h2>
                  <div className="mt-5 space-y-5">
                    {getSectionParagraphs(section).map((paragraph, index) => (
                      <p
                        key={`${section.heading}-${index}`}
                        className="text-lg font-medium leading-relaxed text-dark/75 dark:text-light/75 md:text-base"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {section.images?.length > 0 && (
                    <div className="mt-8 grid gap-5 sm:gap-4">
                      {section.images.map((image, index) => (
                        <figure key={image.asset?._ref || `${section.heading}-image-${index}`}>
                          <SanityImage
                            image={image}
                            width={1200}
                            className="h-auto w-full rounded-lg border border-solid border-dark/10 shadow-lg dark:border-light/10"
                          />
                          {image.alt && (
                            <figcaption className="mt-3 text-sm font-medium text-dark/55 dark:text-light/55">
                              {image.alt}
                            </figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>

            <BlogReactions post={post} />
          </article>
        </Layout>
      </main>
    </>
  );
};

export default BlogPost;
