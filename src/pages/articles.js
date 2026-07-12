import React from "react";
import Layout from "@/components/Layout";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import AnimatedText from "@/components/AnimatedText";
import TransitionEffect from "@/components/TransitionEffect";
import SEO from "@/components/SEO";
import {
  ArrowRightIcon,
  BrainIcon,
  CalendarIcon,
  DocumentStackIcon,
  LocationIcon,
  StarBadgeIcon,
  TerminalIcon,
} from "@/components/Icon";

const FocusCard = ({ page }) => (
  <article className="relative h-full overflow-hidden rounded-3xl rounded-br-2xl border border-solid border-dark bg-light p-12 shadow-2xl dark:border-light dark:bg-dark lg:p-8 xs:rounded-2xl xs:rounded-br-3xl xs:p-4">
    <div className="absolute -right-3 top-0 -z-10 h-[103%] w-[101%] rounded-[2.5rem] rounded-br-3xl bg-dark dark:bg-light xs:-right-2 xs:h-[102%] xs:w-full xs:rounded-l-[1.5rem]" />
    <BrainIcon className="pointer-events-none absolute -top-2 right-4 w-24 text-primary/10 dark:text-primaryDark/10 xs:hidden" />
    {page.focusEyebrow ? (
      <span className="text-sm font-bold uppercase tracking-widest text-primary dark:text-primaryDark">
        {page.focusEyebrow}
      </span>
    ) : null}
    <h2 className="my-3 text-5xl font-bold dark:text-light sm:text-3xl xs:text-2xl">{page.focusRole}</h2>
    {page.focusTitle ? (
      <p className="text-lg font-semibold italic text-dark/70 dark:text-light/70">{page.focusTitle}</p>
    ) : null}
    {page.focusDate || page.focusLocation ? (
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-wide text-dark/60 dark:text-light/60">
        {page.focusDate ? (
          <span className="flex items-center gap-1.5">
            <CalendarIcon className="w-4" />
            {page.focusDate}
          </span>
        ) : null}
        {page.focusDate && page.focusLocation ? <span className="h-1 w-1 rounded-full bg-dark/40 dark:bg-light/40" /> : null}
        {page.focusLocation ? (
          <span className="flex items-center gap-1.5">
            <LocationIcon className="w-4" />
            {page.focusLocation}
          </span>
        ) : null}
      </div>
    ) : null}
    <p className="mt-5 font-medium text-dark dark:text-light">{page.focusBody}</p>
    <div className="mt-6 flex flex-wrap gap-4">
      {page.focusPrimaryCtaHref ? (
        <a
          href={page.focusPrimaryCtaHref}
          className="flex items-center gap-2 rounded-lg bg-dark px-6 py-2 text-sm font-bold uppercase tracking-wide text-light dark:bg-light dark:text-dark"
        >
          {page.focusPrimaryCtaLabel}
          <ArrowRightIcon className="w-4" />
        </a>
      ) : null}
      {page.focusSecondaryCtaHref ? (
        <a
          href={page.focusSecondaryCtaHref}
          className="flex items-center gap-2 rounded-lg border border-solid border-dark px-6 py-2 text-sm font-bold uppercase tracking-wide dark:border-light dark:text-light"
        >
          {page.focusSecondaryCtaLabel}
          <DocumentStackIcon className="w-4" />
        </a>
      ) : null}
    </div>
  </article>
);

const SpecializationsCard = ({ heading, items }) =>
  items?.length ? (
    <article className="relative overflow-hidden rounded-3xl border border-solid border-dark bg-dark p-8 text-light shadow-2xl dark:border-light dark:bg-light dark:text-dark lg:p-6">
      <div className="absolute -right-2 top-0 -z-10 h-[103%] w-[101%] rounded-[2rem] bg-primary dark:bg-primaryDark" />
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold uppercase tracking-widest text-primary dark:text-primaryDark">
          {heading}
        </span>
        <StarBadgeIcon className="w-6" />
      </div>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 font-medium">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-light dark:bg-dark" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  ) : null;

const HighlightCard = ({ title, subtitle }) =>
  title ? (
    <article className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-solid border-dark/10 bg-dark/5 p-8 text-center dark:border-light/10 dark:bg-light/5 lg:p-6">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-dark text-light dark:bg-light dark:text-dark">
        <TerminalIcon className="w-6" />
      </span>
      <h3 className="text-lg font-bold uppercase tracking-wide dark:text-light">{title}</h3>
      {subtitle ? <p className="text-sm font-semibold text-dark/60 dark:text-light/60">{subtitle}</p> : null}
    </article>
  ) : null;

const Articles = ({ page, siteSettings }) => {
  return (
    <>
      <SEO
        title={page.seo?.title || siteSettings.seo?.title}
        description={page.seo?.description || siteSettings.seo?.description}
      />
      <TransitionEffect />
      <main className="w-full mb-16 flex flex-col items-center justify-center overflow-hidden dark:text-light">
        <Layout className="pt-16 px-10">
          <AnimatedText
            text={page.headline}
            className="mb-16 lg:!text-7xl sm:mb-8 sm:!text-6xl xs:!text-4xl"
          />
          <ul className="grid grid-cols-2 gap-16 lg:flex lg:flex-col">
            <Education heading={page.educationHeading} items={page.education} />
            <Experience heading={page.experienceHeading} items={page.experience} />
          </ul>
          <div className="mt-32 flex w-full flex-wrap items-end justify-between gap-4 border-b-4 border-dark pb-4 dark:border-light">
            <h2 className="text-4xl font-bold uppercase sm:text-3xl xs:text-2xl">{page.focusHeading}</h2>
            {page.focusStatusBadge ? (
              <span className="rounded-full bg-dark/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-dark/70 dark:bg-light/10 dark:text-light/70">
                {page.focusStatusBadge}
              </span>
            ) : null}
          </div>
          <div className="mt-8 grid w-full grid-cols-3 gap-8 lg:grid-cols-1">
            <div className="col-span-2 lg:col-span-1">
              <FocusCard page={page} />
            </div>
            <div className="flex flex-col gap-8">
              <SpecializationsCard heading={page.focusSpecializationsHeading} items={page.focusSpecializations} />
              <HighlightCard title={page.focusHighlightTitle} subtitle={page.focusHighlightSubtitle} />
            </div>
          </div>
        </Layout>
      </main>
    </>
  );
};

export default Articles;
