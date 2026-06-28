import React, { useMemo } from "react";
import { motion } from "framer-motion";

const GROUPS = [
  {
    name: "AI / ML",
    match: [
      "ai",
      "ml",
      "machine learning",
      "deep learning",
      "python",
      "pytorch",
      "tensorflow",
      "llm",
      "llms",
      "nlp",
      "computer vision",
      "mlops",
    ],
  },
  {
    name: "Data",
    match: ["postgres", "postgresql", "sql", "database", "data", "pipeline", "analytics", "schema"],
  },
  {
    name: "Software",
    match: ["react", "vite", "next", "flutter", "fastapi", "api", "javascript", "typescript", "frontend", "backend"],
  },
  {
    name: "Platform & Tools",
    match: ["docker", "kubernetes", "git", "github", "linux", "vercel", "cloud", "database", "sql"],
  },
];

const normalize = (value) => value.toLowerCase();

const groupSkills = (skills) => {
  const grouped = GROUPS.map((group) => ({ ...group, skills: [] }));
  const other = { name: "Platform & Tools", skills: [] };

  skills.forEach((skill) => {
    const name = skill.name || "";
    const normalized = normalize(name);
    const group =
      grouped.find((item) => item.name === skill.category) ||
      grouped.find((item) => item.match.some((keyword) => normalized.includes(keyword)));

    if (group) {
      group.skills.push(skill);
    } else {
      other.skills.push(skill);
    }
  });

  return [...grouped, other].filter((group) => group.skills.length);
};

const SkillPill = ({ name, index }) => (
  <motion.span
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.35, delay: index * 0.035 }}
    whileHover={{ y: -2 }}
    className="rounded-md border border-solid border-primary/35 bg-light/25 px-4 py-2 text-sm font-bold uppercase text-primary shadow-[inset_0_0_0_1px_rgba(182,62,150,0.08),0_8px_20px_rgba(27,27,27,0.06)] backdrop-blur-xl dark:border-primaryDark/35 dark:bg-light/[0.04] dark:text-primaryDark dark:shadow-[inset_0_0_0_1px_rgba(88,230,217,0.08),0_8px_20px_rgba(0,0,0,0.2)] xs:px-3 xs:py-1.5 xs:text-xs"
  >
    {name}
  </motion.span>
);

const SkillGroup = ({ group, index }) => (
  <motion.section
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.45, delay: index * 0.08 }}
    className="relative"
  >
    <h3 className="mb-5 text-center text-sm font-bold uppercase text-dark/55 dark:text-light/55">{group.name}</h3>
    <div className="flex flex-wrap justify-center gap-3">
      {group.skills.map((skill, skillIndex) => (
        <SkillPill key={skill.name} name={skill.name} index={skillIndex} />
      ))}
    </div>
  </motion.section>
);

const Connector = () => (
  <div className="pointer-events-none absolute left-1/2 top-[7.5rem] h-44 w-[72%] -translate-x-1/2 lg:w-[84%] md:hidden">
    <div className="absolute left-1/2 top-0 h-24 w-px -translate-x-1/2 bg-dark/15 dark:bg-light/15" />
    <div className="absolute left-0 right-0 top-24 h-px bg-dark/15 dark:bg-light/15" />
    <div className="absolute left-0 top-24 h-12 w-px bg-dark/15 dark:bg-light/15" />
    <div className="absolute left-1/3 top-24 h-12 w-px bg-dark/15 dark:bg-light/15" />
    <div className="absolute right-1/3 top-24 h-12 w-px bg-dark/15 dark:bg-light/15" />
    <div className="absolute right-0 top-24 h-12 w-px bg-dark/15 dark:bg-light/15" />
  </div>
);

const Skills = ({ heading, centerLabel, skills = [] }) => {
  const groups = useMemo(() => groupSkills(skills), [skills]);
  const nodeLabel = heading || centerLabel || "Skills";

  return (
    <section className="mt-28 w-full md:mt-20">
      <div className="relative mx-auto min-h-[560px] w-full max-w-7xl overflow-hidden bg-light px-10 py-14 dark:bg-dark lg:px-6 md:min-h-0 md:py-10 xs:px-4">
        <Connector />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="relative z-10 mx-auto flex w-max max-w-full items-center justify-center rounded-lg border border-solid border-primary/30 bg-light/35 px-12 py-5 text-2xl font-bold uppercase text-dark shadow-[0_14px_40px_rgba(27,27,27,0.08)] backdrop-blur-2xl dark:border-primaryDark/30 dark:bg-light/[0.04] dark:text-light md:px-7 md:py-4 md:text-xl xs:text-base"
        >
          {nodeLabel}
        </motion.div>

        <div className="relative z-10 mt-44 grid grid-cols-4 gap-x-8 gap-y-16 lg:grid-cols-2 md:mt-12 md:grid-cols-1 md:gap-y-12">
          {groups.map((group, index) => (
            <SkillGroup key={group.name} group={group} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
