import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import AnimatedText from "@/components/AnimatedText";
import { GithubIcon } from "@/components/Icon";
import TransitionEffect from "@/components/TransitionEffect";
import SEO from "@/components/SEO";
import SanityImage from "@/components/SanityImage";

const toArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

const fallbackProjectImages = [
  "/images/projects/ehocardio.jpg",
  "/images/projects/Dagu.png",
  "/images/projects/Enebla-c.png",
  "/images/projects/Project-Samaritan.jpg",
];

const CloseIcon = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M6 6l12 12M18 6 6 18"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const ProjectActions = ({ link, github, actionLabel, light = false }) => {
  if (!link && !github) return null;

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      {github ? (
        <a href={github} target="_blank" rel="noreferrer" className="w-8 md:w-7" aria-label="GitHub repository">
          <GithubIcon />
        </a>
      ) : null}
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className={`rounded-lg border border-solid p-2 px-4 text-sm font-semibold transition-colors ${
            light
              ? "border-dark/15 bg-dark/80 text-light hover:bg-dark"
              : "border-dark/15 bg-dark/80 text-light hover:bg-dark dark:border-light/15 dark:bg-light/80 dark:text-dark dark:hover:bg-light"
          }`}
        >
          {actionLabel}
        </a>
      ) : null}
    </div>
  );
};

const TagList = ({ tags, light = false }) => {
  const safeTags = toArray(tags);

  if (!safeTags.length) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {safeTags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className={`rounded-full border border-solid px-2.5 py-1 text-xs font-semibold backdrop-blur-md ${
            light
              ? "border-dark/10 bg-dark/[0.04] text-dark/70"
              : "border-dark/10 bg-light/20 text-dark/70 dark:border-light/10 dark:bg-light/[0.04] dark:text-light/70"
          }`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

const CATEGORY_ALL = "All Projects";
const GENERAL_CATEGORIES = ["ML / AI", "Fullstack", "Frontend", "Backend", "Data Science", "Other"];
const LEGACY_CATEGORY_MAP = {
  Software: ["Fullstack"],
  Data: ["Data Science"],
};

const getProjectCategories = (project) => {
  const selectedCategories = toArray(project.categories).filter((category) =>
    GENERAL_CATEGORIES.includes(category)
  );

  if (selectedCategories.length) return selectedCategories;

  if (GENERAL_CATEGORIES.includes(project.category)) return [project.category];
  if (LEGACY_CATEGORY_MAP[project.category]) return LEGACY_CATEGORY_MAP[project.category];

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

  const inferredCategories = [];

  if (
    /\b(ai|ml|llm|nlp|eeg)\b/.test(searchableText) ||
    searchableText.includes("machine learning") ||
    searchableText.includes("deep learning") ||
    searchableText.includes("computer vision") ||
    searchableText.includes("neural") ||
    searchableText.includes("diagnosis") ||
    searchableText.includes("seizure")
  ) {
    inferredCategories.push("ML / AI");
  }

  if (
    searchableText.includes("data") ||
    searchableText.includes("data science") ||
    searchableText.includes("analytics") ||
    searchableText.includes("dashboard") ||
    searchableText.includes("efcd") ||
    searchableText.includes("national-scale")
  ) {
    inferredCategories.push("Data Science");
  }

  if (
    searchableText.includes("frontend") ||
    /\b(ui|ux)\b/.test(searchableText) ||
    searchableText.includes("react") ||
    searchableText.includes("tailwind")
  ) {
    inferredCategories.push("Frontend");
  }

  if (
    searchableText.includes("backend") ||
    /\b(api|server|sql)\b/.test(searchableText) ||
    searchableText.includes("database") ||
    searchableText.includes("postgres") ||
    searchableText.includes("fastapi")
  ) {
    inferredCategories.push("Backend");
  }

  if (
    searchableText.includes("software") ||
    searchableText.includes("full-stack") ||
    searchableText.includes("fullstack") ||
    searchableText.includes("web") ||
    searchableText.includes("app") ||
    searchableText.includes("flutter") ||
    searchableText.includes("platform")
  ) {
    inferredCategories.push("Fullstack");
  }

  return inferredCategories.length ? [...new Set(inferredCategories)] : ["Other"];
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

const getProjectImage = (project, index = 0) => project.image || fallbackProjectImages[index % fallbackProjectImages.length];

const ProjectVisual = ({ project, index = 0, className = "" }) => {
  const image = getProjectImage(project, index);
  const isLocalImage = typeof image === "string";

  if (isLocalImage) {
    return <img src={image} alt={project.title} className={className} />;
  }

  return <SanityImage image={image} alt={project.title} width={1000} className={className} />;
};

const ProjectCard = ({ project, index, onOpen }) => (
  <button
    type="button"
    onClick={() => onOpen(project)}
    className="group relative w-full overflow-hidden rounded-2xl border border-solid border-light/45 bg-white text-left shadow-[0_18px_45px_rgba(27,27,27,0.07)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(27,27,27,0.14)] dark:border-light/10 dark:bg-dark/20 dark:shadow-[0_18px_45px_rgba(0,0,0,0.24)]"
    aria-label={`Open details for ${project.title}`}
  >
    <div className="bg-[#f7f7f5] p-6 dark:bg-dark/30 sm:p-4">
      <ProjectVisual
        project={project}
        index={index}
        className="block h-auto max-h-[270px] w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </div>
    <div className="relative w-full border-t border-solid border-white/35 bg-[linear-gradient(135deg,rgba(255,255,255,0.42),rgba(255,255,255,0.18))] p-5 shadow-[0_-16px_42px_rgba(27,27,27,0.1)] backdrop-blur-2xl transition-colors duration-300 group-hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.52),rgba(255,255,255,0.22))] dark:border-light/10 dark:bg-[linear-gradient(135deg,rgba(27,27,27,0.58),rgba(27,27,27,0.28))] dark:group-hover:bg-[linear-gradient(135deg,rgba(27,27,27,0.68),rgba(27,27,27,0.34))] xs:p-4">
      <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold uppercase tracking-wider">
        <span className="text-primary dark:text-primaryDark">{project.type}</span>
        <span className="normal-case tracking-normal text-dark/60 dark:text-light/60">{project.period}</span>
      </div>
      <h2 className="line-clamp-2 text-xl font-bold leading-tight text-dark drop-shadow-[0_1px_12px_rgba(255,255,255,0.35)] dark:text-light dark:drop-shadow-none md:text-2xl">
        {project.title}
      </h2>
    </div>
  </button>
);

const ProjectModal = ({ project, projectIndex, actionLabel, onClose }) => {
  useEffect(() => {
    if (!project) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose, project]);

  if (!project) return null;

  const details = toArray(project.details);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark/45 px-6 py-8 backdrop-blur-md dark:bg-dark/70 sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onMouseDown={onClose}
    >
      <div
        className="relative max-h-full w-full max-w-5xl overflow-hidden rounded-2xl border border-solid border-dark/10 bg-white text-dark shadow-[0_30px_90px_rgba(0,0,0,0.22)] dark:border-light/10"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-solid border-dark/10 bg-white/90 text-dark shadow-lg backdrop-blur-xl transition-colors hover:bg-white"
          aria-label="Close project details"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <div className="grid max-h-[88vh] overflow-y-auto lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[360px] overflow-hidden bg-[#f7f7f5] lg:min-h-full sm:min-h-[260px]">
            <ProjectVisual
              project={project}
              index={projectIndex}
              className="absolute inset-0 h-full w-full object-contain p-8 sm:p-5"
            />
          </div>

          <div className="p-8 sm:p-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold uppercase tracking-wider">
              <span className="text-primary">{project.type}</span>
              <span className="normal-case tracking-normal text-dark/55">{project.period}</span>
            </div>

            <h2 id="project-modal-title" className="mt-4 text-4xl font-bold leading-tight text-dark lg:text-3xl sm:text-2xl">
              {project.title}
            </h2>

            <p className="mt-5 text-base font-medium leading-relaxed text-dark/80">
              {project.summary}
            </p>

            {details.length ? (
              <ul className="mt-6 list-disc space-y-3 pl-5 text-sm font-medium leading-relaxed text-dark/70">
                {details.map((detail, index) => (
                  <li key={`${detail}-${index}`}>{detail}</li>
                ))}
              </ul>
            ) : null}

            <TagList tags={project.tags} light />
            <ProjectActions link={project.link} github={project.github} actionLabel={actionLabel} light />
          </div>
        </div>
      </div>
    </div>
  );
};

const Projects = ({ page, projects = [], siteSettings }) => {
  const categories = useMemo(() => {
    const counts = projects.reduce((acc, project) => {
      getProjectCategories(project).forEach((category) => {
        acc.set(category, (acc.get(category) || 0) + 1);
      });
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
  const [selectedProject, setSelectedProject] = useState(null);
  const filteredProjects = useMemo(
    () =>
      selectedCategory === CATEGORY_ALL
        ? projects
        : projects.filter((project) => getProjectCategories(project).includes(selectedCategory)),
    [projects, selectedCategory]
  );
  const selectedProjectIndex = selectedProject
    ? projects.findIndex((project) => project.title === selectedProject.title)
    : -1;

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
            {filteredProjects.map((project, index) => (
              <div className="flex h-full" key={project.title}>
                <ProjectCard project={project} index={index} onOpen={setSelectedProject} />
              </div>
            ))}
          </div>
        </Layout>
      </main>
      <ProjectModal
        project={selectedProject}
        projectIndex={selectedProjectIndex >= 0 ? selectedProjectIndex : 0}
        actionLabel={page.actionLabel}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};

export default Projects;
