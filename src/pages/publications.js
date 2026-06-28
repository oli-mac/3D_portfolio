import React from "react";
import Layout from "@/components/Layout";
import AnimatedText from "@/components/AnimatedText";
import TransitionEffect from "@/components/TransitionEffect";
import SEO from "@/components/SEO";

const PublicationCard = ({ publication }) => (
  <article className="relative flex h-full min-h-[380px] flex-col overflow-hidden rounded-2xl border border-solid border-light/45 bg-light/25 p-5 shadow-[0_18px_45px_rgba(27,27,27,0.07)] backdrop-blur-2xl dark:border-light/10 dark:bg-dark/20 dark:shadow-[0_18px_45px_rgba(0,0,0,0.24)] xs:min-h-0 xs:p-4">
    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/35 via-white/[0.08] to-transparent dark:from-white/[0.08] dark:via-white/[0.03]" />
    <span className="relative text-base font-medium text-primary dark:text-primaryDark">
      {publication.journal}
    </span>
    <h2 className="relative mt-4 text-xl font-bold leading-tight md:text-2xl">{publication.title}</h2>
    <span className="relative mt-3 inline-block text-sm font-semibold text-dark/60 dark:text-light/60">{publication.date}</span>
    <p className="relative mt-5 text-sm font-medium leading-relaxed text-dark/75 dark:text-light/75">
      {publication.summary}
    </p>
    <div className="relative mt-auto flex flex-wrap gap-2 pt-6">
      {publication.tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-solid border-dark/10 bg-light/20 px-2.5 py-1 text-xs font-semibold text-dark/70 backdrop-blur-md dark:border-light/10 dark:bg-light/[0.04] dark:text-light/70"
        >
          {tag}
        </span>
      ))}
    </div>
  </article>
);

const Publications = ({ page, publications = [], siteSettings }) => {
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
            {publications.map((publication) => (
              <PublicationCard key={publication.title} publication={publication} />
            ))}
          </div>
        </Layout>
      </main>
    </>
  );
};

export default Publications;
