import React from "react";
import Layout from "@/components/Layout";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import AnimatedText from "@/components/AnimatedText";
import TransitionEffect from "@/components/TransitionEffect";
import SEO from "@/components/SEO";

const FocusCard = ({ page }) => (
  <article className="relative mx-auto w-[95%] rounded-3xl rounded-br-2xl border border-solid border-dark bg-light p-12 shadow-2xl dark:border-light dark:bg-dark lg:p-8 xs:rounded-2xl xs:rounded-br-3xl xs:p-4">
    <div className="absolute -right-3 top-0 -z-10 h-[103%] w-[101%] rounded-[2.5rem] rounded-br-3xl bg-dark dark:bg-light xs:-right-2 xs:h-[102%] xs:w-full xs:rounded-l-[1.5rem]" />
    <span className="text-xl font-medium text-primary dark:text-primaryDark xs:text-base">{page.focusRole}</span>
    <h2 className="my-3 text-4xl font-bold dark:text-light sm:text-3xl xs:text-2xl">{page.focusTitle}</h2>
    <p className="font-semibold text-dark/60 dark:text-light/60">{page.focusMeta}</p>
    <p className="mt-5 font-medium text-dark dark:text-light">{page.focusBody}</p>
    <div className="mt-6 flex flex-wrap gap-4">
      {page.focusPrimaryCtaHref ? (
        <a
          href={page.focusPrimaryCtaHref}
          className="rounded-lg bg-dark px-6 py-2 text-lg font-semibold text-light dark:bg-light dark:text-dark sm:text-base"
        >
          {page.focusPrimaryCtaLabel}
        </a>
      ) : null}
      {page.focusSecondaryCtaHref ? (
        <a href={page.focusSecondaryCtaHref} className="text-lg font-semibold underline md:text-base">
          {page.focusSecondaryCtaLabel}
        </a>
      ) : null}
    </div>
  </article>
);

const Articles = ({ page, siteSettings }) => {
  return (
    <>
      <SEO
        title={page.seo?.title || siteSettings.seo?.title}
        description={page.seo?.description || siteSettings.seo?.description}
      />
      <TransitionEffect />
      <main className="w-full mb-16 flex flex-col items-center justify-center overflow-hidden dark:text-light">
        <Layout className="pt-16 px-0">
          <AnimatedText
            text={page.headline}
            className="mb-16 lg:!text-7xl sm:mb-8 sm:!text-6xl xs:!text-4xl"
          />
          <ul className="grid grid-cols-2 gap-16 lg:flex lg:flex-col">
            <Education heading={page.educationHeading} items={page.education} />
            <Experience heading={page.experienceHeading} items={page.experience} />
          </ul>
          <h2 className="font-bold text-4xl w-full text-center my-16 mt-32">{page.focusHeading}</h2>
          <FocusCard page={page} />
        </Layout>
      </main>
    </>
  );
};

export default Articles;
