import React, { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import AnimatedText from "@/components/AnimatedText";
import { GithubIcon } from "@/components/Icon";
import TransitionEffect from "@/components/TransitionEffect";
import SEO from "@/components/SEO";
import SanityImage from "@/components/SanityImage";

const toArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

const ProjectActions = ({ link, github, actionLabel }) => {
  if (!link && !github) return null;

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      {github ? (
        <a href={github} target="_blank" className="w-8 md:w-7" aria-label="GitHub repository">
          <GithubIcon />
        </a>
      ) : null}
      {link ? (
        <a
          href={link}
          target="_blank"
          className="rounded-lg border border-solid border-dark/15 bg-dark/80 p-2 px-4 text-sm font-semibold text-light transition-colors hover:bg-dark dark:border-light/15 dark:bg-light/80 dark:text-dark dark:hover:bg-light"
        >
          {actionLabel}
        </a>
      ) : null}
    </div>
  );
};

const TagList = ({ tags }) => {
  const safeTags = toArray(tags);

  if (!safeTags.length) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {safeTags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className="rounded-full border border-solid border-dark/10 bg-light/20 px-2.5 py-1 text-xs font-semibold text-dark/70 backdrop-blur-md dark:border-light/10 dark:bg-light/[0.04] dark:text-light/70"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

const CATEGORY_ALL = "All Projects";
const GENERAL_CATEGORIES = ["ML / AI", "Software", "Data", "Other"];

const getProjectCategory = (project) => {
  const searchableText = [
    project.title,
    project.type,
    project.period,
    project.summary,
    ...toArray(project.details),
    ...toArray(project.tags),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    /\b(ai|ml|llm|nlp|eeg)\b/.test(searchableText) ||
    searchableText.includes("machine learning") ||
    searchableText.includes("deep learning") ||
    searchableText.includes("computer vision") ||
    searchableText.includes("neural") ||
    searchableText.includes("diagnosis") ||
    searchableText.includes("seizure")
  ) {
    return "ML / AI";
  }

  if (
    searchableText.includes("data") ||
    searchableText.includes("analytics") ||
    searchableText.includes("dashboard") ||
    searchableText.includes("efcd") ||
    searchableText.includes("national-scale")
  ) {
    return "Data";
  }

  if (
    /\b(api|web|app|ui|ux)\b/.test(searchableText) ||
    searchableText.includes("software") ||
    searchableText.includes("full-stack") ||
    searchableText.includes("react") ||
    searchableText.includes("flutter") ||
    searchableText.includes("fastapi") ||
    searchableText.includes("platform")
  ) {
    return "Software";
  }

  return "Other";
};

const ProjectTabs = ({ categories, selectedCategory, onSelect }) => (
  <div className="mx-[20%] mb-10 w-auto overflow-hidden rounded-2xl border border-solid border-light/45 bg-light/20 p-2 shadow-[0_18px_45px_rgba(27,27,27,0.05)] backdrop-blur-2xl dark:border-light/10 dark:bg-dark/20 dark:shadow-[0_18px_45px_rgba(0,0,0,0.18)] lg:mx-0 lg:w-full">
    <div className="flex justify-center gap-2 overflow-x-auto lg:justify-start">
      {categories.map((category) => {
        const isActive = selectedCategory === category.name;

        return (
          <button
            type="button"
            key={category.name}
            onClick={() => onSelect(category.name)}
            className={`flex min-w-max items-center gap-2 rounded-xl border border-solid px-4 py-2.5 text-sm font-semibold transition-colors ${
              isActive
                ? "border-primary/40 bg-primary/15 text-dark dark:border-primaryDark/40 dark:bg-primaryDark/10 dark:text-light"
                : "border-transparent text-dark/65 hover:border-dark/10 hover:bg-light/25 dark:text-light/65 dark:hover:border-light/10 dark:hover:bg-light/[0.05]"
            }`}
          >
            <span>{category.name}</span>
            <span className="rounded-full border border-solid border-dark/10 px-2 py-0.5 text-xs text-dark/50 dark:border-light/10 dark:text-light/50">
              {category.count}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

const ProjectImage = ({ project, className = "" }) => {
  if (!project.image) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden rounded-xl border border-solid border-dark/10 bg-light/20 p-5 text-center text-dark backdrop-blur-md dark:border-light/10 dark:bg-light/[0.03] dark:text-light ${className}`}
      >
        <div>
          <p className="text-xs font-semibold uppercase text-primaryDark dark:text-primary">{project.period}</p>
          <h3 className="mt-3 text-xl font-bold leading-tight">{project.title}</h3>
        </div>
      </div>
    );
  }

  const image = (
    <SanityImage
      image={project.image}
      alt={project.title}
      width={1000}
      className="h-full w-full object-cover"
      motionImage
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    />
  );

  if (!project.link) {
    return <div className={`overflow-hidden rounded-xl border border-solid border-dark/10 dark:border-light/10 ${className}`}>{image}</div>;
  }

  return (
    <a
      href={project.link}
      target="_blank"
      className={`cursor-pointer overflow-hidden rounded-xl border border-solid border-dark/10 dark:border-light/10 ${className}`}
    >
      {image}
    </a>
  );
};

const Project = ({ project, actionLabel }) => {
  const details = toArray(project.details);

  return (
    <article className="relative flex h-full min-h-[640px] w-full flex-col items-center justify-start overflow-hidden rounded-2xl border border-solid border-light/45 bg-light/25 p-4 shadow-[0_18px_45px_rgba(27,27,27,0.07)] backdrop-blur-2xl dark:border-light/10 dark:bg-dark/20 dark:shadow-[0_18px_45px_rgba(0,0,0,0.24)] xs:min-h-0">
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/35 via-white/[0.08] to-transparent dark:from-white/[0.08] dark:via-white/[0.03]" />
      <ProjectImage project={project} className="relative h-44 w-full lg:h-52 md:h-64 sm:h-56" />

      <div className="relative mt-4 flex w-full flex-1 flex-col items-start justify-between">
        <div className="flex w-full flex-1 flex-col">
          <span className="text-base font-medium text-primary dark:text-primaryDark md:text-base">
            {project.type}
          </span>
          <h2 className="my-2 min-h-[64px] w-full text-left text-xl font-bold leading-tight lg:min-h-0 md:text-2xl">
            {project.title}
          </h2>
          <span className="min-h-[44px] text-sm font-semibold text-dark/60 dark:text-light/60 lg:min-h-0">
            {project.period}
          </span>
          <p className="my-3 text-sm font-medium text-dark/90 dark:text-light/90">{project.summary}</p>
          {details.length ? (
            <ul className="list-disc space-y-2 pl-5 text-sm font-medium text-dark/70 dark:text-light/70">
              {details.map((detail, index) => (
                <li key={`${detail}-${index}`}>{detail}</li>
              ))}
            </ul>
          ) : null}
          <TagList tags={project.tags} />
        </div>
        <ProjectActions link={project.link} github={project.github} actionLabel={actionLabel} />
      </div>
    </article>
  );
};

const Projects = ({ page, projects = [], siteSettings }) => {
  const categories = useMemo(() => {
    const counts = projects.reduce((acc, project) => {
      const category = getProjectCategory(project);
      acc.set(category, (acc.get(category) || 0) + 1);
      return acc;
    }, new Map());

    return [
      { name: CATEGORY_ALL, count: projects.length },
      ...GENERAL_CATEGORIES.filter((category) => counts.has(category)).map((name) => ({
        name,
        count: counts.get(name),
      })),
    ];
  }, [projects]);

  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_ALL);
  const filteredProjects = useMemo(
    () =>
      selectedCategory === CATEGORY_ALL
        ? projects
        : projects.filter((project) => getProjectCategory(project) === selectedCategory),
    [projects, selectedCategory]
  );

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

          <ProjectTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />

          <div className="grid w-full grid-cols-4 gap-x-6 gap-y-10 2xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 md:gap-y-10">
            {filteredProjects.map((project) => (
              <div className="flex h-full" key={project.title}>
                <Project project={project} actionLabel={page.actionLabel} />
              </div>
            ))}
          </div>
        </Layout>
      </main>
    </>
  );
};

export default Projects;
