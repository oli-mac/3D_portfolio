import Layout from "@/components/Layout";
import React, { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import Skills from "@/components/Skills";
import TransitionEffect from "@/components/TransitionEffect";
import Testimonials from "@/components/Testimonials";
import SEO from "@/components/SEO";
import SanityImage from "@/components/SanityImage";

const AnimatedNumbers = ({ value }) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 3000 });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current && latest.toFixed(0) <= value) {
        ref.current.textContent = latest.toFixed(0);
      }
    });

    return unsubscribe;
  }, [springValue, value]);

  return <span ref={ref}></span>;
};

const StatChip = ({ stat }) => (
  <div className="rounded-lg border border-solid border-dark/10 bg-light/80 p-3 backdrop-blur-xl dark:border-light/10 dark:bg-light/[0.05]">
    <span className="block text-3xl font-bold leading-none text-primary dark:text-primaryDark">
      <AnimatedNumbers value={stat.value} />
      {stat.suffix}
    </span>
    <span className="mt-1.5 block text-[11px] font-bold leading-tight text-dark/55 dark:text-light/60">{stat.label}</span>
  </div>
);

const FeaturedWork = ({ project }) => {
  if (!project) return null;

  return (
    <a href="/projects" className="group block">
      <div className="overflow-hidden rounded-xl border border-solid border-dark/10 bg-light/90 shadow-[0_18px_50px_rgba(27,27,27,0.1)] dark:border-light/10 dark:bg-light/[0.06]">
        {project.image ? (
          <SanityImage
            image={project.image}
            width={1000}
            className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-44 items-center justify-center bg-primary/10 p-6 text-center text-xl font-bold">
            {project.title}
          </div>
        )}
        <div className="p-5">
          <span className="text-xs font-bold uppercase text-primary dark:text-primaryDark">Featured Work</span>
          <h2 className="mt-2 text-xl font-bold text-dark dark:text-light">{project.title}</h2>
          <p className="mt-3 text-xs font-medium leading-relaxed text-dark/65 dark:text-light/65">
            {project.summary}
          </p>
        </div>
      </div>
    </a>
  );
};

const AboutHero = ({ page, siteSettings, featuredProject }) => {
  const paragraphs = page.paragraphs || [];
  const intro = paragraphs.slice(0, 2);
  const closing = paragraphs[paragraphs.length - 1];

  return (
    <section className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-light px-12 py-8 text-dark dark:bg-dark dark:text-light lg:min-h-0 lg:px-6 sm:px-4">
      <div className="relative grid min-h-[min(760px,calc(100vh-5rem))] w-full max-w-[1720px] grid-cols-12 overflow-hidden rounded-[2rem] border border-solid border-dark/10 bg-light shadow-[0_30px_90px_rgba(27,27,27,0.12)] dark:border-light/10 dark:bg-dark lg:min-h-0 lg:grid-cols-1">
        <div className="col-span-4 flex flex-col justify-between bg-light p-10 text-dark dark:bg-light/[0.04] lg:order-2 lg:min-h-[500px] md:p-8 xs:p-6">
          <div>
            <h1 className="max-w-[7ch] text-6xl font-bold leading-none tracking-normal xl:text-5xl md:text-5xl xs:text-4xl">
              {siteSettings.name}
            </h1>
            <p className="mt-4 max-w-sm text-2xl font-medium leading-tight text-dark/70 xl:text-xl xs:text-lg">
              {page.headline}
            </p>
          </div>

          <div className="max-w-sm">
            <span className="text-sm font-bold uppercase text-primaryDark dark:text-primary">{page.eyebrow}</span>
            {intro.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-sm font-medium leading-relaxed text-dark/70">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="col-span-4 flex items-end justify-center bg-primary/25 dark:bg-primaryDark/20 lg:order-1">
          <div className="relative flex min-h-[min(760px,calc(100vh-5rem))] w-full items-end justify-center overflow-hidden lg:min-h-[560px] md:min-h-[480px] sm:min-h-[400px]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-light/25 via-transparent to-primary/10 dark:from-light/10" />
            <SanityImage
              image={page.profileImage}
              width={1000}
              className="relative z-10 h-[100%] w-full object-contain object-bottom"
            />
          </div>
        </div>

        <div className="col-span-4 flex flex-col justify-between gap-5 bg-light p-10 dark:bg-light/[0.03] lg:order-3 md:p-8 xs:p-6">
          <div className="flex justify-end">
            <span className="rounded-lg border border-solid border-dark/10 px-4 py-2.5 text-sm font-bold uppercase text-dark/55 dark:border-light/10 dark:text-light/60">
              { siteSettings.name}
            </span>
          </div>

          <FeaturedWork project={featuredProject} />

          <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
            {(page.stats || []).map((stat) => (
              <StatChip key={stat.label} stat={stat} />
            ))}
          </div>

          <div className="rounded-xl border border-solid border-dark/10 bg-light/80 p-5 shadow-[0_12px_32px_rgba(27,27,27,0.06)] backdrop-blur-xl dark:border-light/10 dark:bg-light/[0.05]">
            <span className="text-sm font-bold uppercase text-primary dark:text-primaryDark">{siteSettings.contactLabel}</span>
            <p className="mt-4 text-xs font-medium leading-relaxed text-dark/65 dark:text-light/65">{closing}</p>
            {siteSettings.sayHelloHref ? (
              <a
                href={siteSettings.sayHelloHref}
                className="mt-6 inline-flex rounded-lg border border-solid border-primary/30 bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/20 dark:border-primaryDark/30 dark:bg-primaryDark/10 dark:text-primaryDark"
              >
                {siteSettings.sayHelloLabel}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

const About = ({ page, skills, testimonials, siteSettings, featuredProject }) => {
  return (
    <>
      <SEO
        title={page.seo?.title || siteSettings.seo?.title}
        description={page.seo?.description || siteSettings.seo?.description}
      />
      <TransitionEffect />
      <main className="flex w-full flex-col items-center justify-center overflow-x-hidden bg-light dark:bg-dark dark:text-light">
        <Layout className="!p-0 bg-light dark:bg-dark">
          <AboutHero page={page} siteSettings={siteSettings} featuredProject={featuredProject} />
          <div className="px-32 pb-20 xl:px-24 lg:px-16 md:px-12 sm:px-8">
            <Skills heading={page.skillsHeading} centerLabel={page.skillsCenterLabel} skills={skills} />
            <Testimonials heading={page.testimonialsHeading} testimonials={testimonials} />
          </div>
        </Layout>
      </main>
    </>
  );
};

export default About;
