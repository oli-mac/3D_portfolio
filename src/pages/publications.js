import React from "react";
import Layout from "@/components/Layout";
import AnimatedText from "@/components/AnimatedText";
import TransitionEffect from "@/components/TransitionEffect";
import SEO from "@/components/SEO";

const toArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

const PublicationCard = ({ publication }) => {
  const tags = toArray(publication.tags);

  return (
    <article className="group relative flex h-full min-h-[380px] flex-col justify-end overflow-hidden rounded-2xl border border-solid border-light/45 bg-light/25 shadow-[0_18px_45px_rgba(27,27,27,0.07)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(27,27,27,0.14)] dark:border-light/10 dark:bg-dark/20 dark:shadow-[0_18px_45px_rgba(0,0,0,0.24)] xs:min-h-[360px]">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(248,247,246,0.94)_0%,rgba(88,230,217,0.16)_42%,rgba(182,62,150,0.2)_100%)] dark:bg-[linear-gradient(145deg,rgba(27,27,27,0.96)_0%,rgba(88,230,217,0.12)_42%,rgba(182,62,150,0.22)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(135deg,rgba(255,255,255,0.58),rgba(255,255,255,0.08)_60%,rgba(27,27,27,0.04))] opacity-80 transition-transform duration-500 group-hover:scale-105 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(88,230,217,0.08)_60%,rgba(182,62,150,0.16))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(248,247,246,0.9)_0%,rgba(248,247,246,0.58)_45%,rgba(248,247,246,0.1)_78%,transparent_100%)] dark:bg-[linear-gradient(to_top,rgba(27,27,27,0.92)_0%,rgba(27,27,27,0.62)_45%,rgba(27,27,27,0.16)_78%,transparent_100%)]" />
      <div className="relative m-4 rounded-xl border border-solid border-white/45 bg-white/48 p-5 shadow-[0_18px_45px_rgba(27,27,27,0.08)] backdrop-blur-xl dark:border-light/10 dark:bg-dark/45 xs:m-3 xs:p-4">
        <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-primaryDark">
          {publication.journal}
        </span>
        <h2 className="mt-3 text-xl font-bold leading-tight text-dark dark:text-light md:text-2xl">{publication.title}</h2>
        <span className="mt-3 inline-block text-sm font-semibold text-dark/55 dark:text-light/55">{publication.date}</span>
        <p className="mt-4 line-clamp-4 text-sm font-medium leading-relaxed text-dark/75 dark:text-light/75">
          {publication.summary}
        </p>
        {tags.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="rounded-full border border-solid border-dark/10 bg-light/30 px-2.5 py-1 text-xs font-semibold text-dark/70 backdrop-blur-md dark:border-light/10 dark:bg-light/[0.06] dark:text-light/70"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
};

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
