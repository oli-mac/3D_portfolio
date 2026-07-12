import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BrainIcon, CloudIcon, CodeIcon, DatabaseIcon } from "./Icon";

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
    name: "Software",
    match: ["react", "vite", "next", "flutter", "fastapi", "api", "javascript", "typescript", "frontend", "backend"],
  },
  {
    name: "Data",
    match: ["postgres", "postgresql", "sql", "database", "data", "pipeline", "analytics", "schema"],
  },
  {
    name: "Platform & Tools",
    match: ["docker", "kubernetes", "git", "github", "linux", "vercel", "cloud"],
  },
];

// Distinct hue per category so the graph, edges, and the legend all agree on
// what color means what — a single-hue opacity ramp (the old approach) makes
// a legend pointless since every category reads as "the same color."
const CATEGORY_STYLES = [
  {
    dot: "bg-[#3B82F6] dark:bg-[#60A5FA]",
    text: "text-[#3B82F6] dark:text-[#60A5FA]",
    textImportant: "!text-[#3B82F6] dark:!text-[#60A5FA]",
    edge: "stroke-[#3B82F6] dark:stroke-[#60A5FA]",
    chipBg: "bg-[#3B82F6]/10 dark:bg-[#60A5FA]/15",
    pillSolid: "border-[#3B82F6] bg-[#3B82F6] text-white dark:border-[#60A5FA] dark:bg-[#60A5FA] dark:text-dark",
    pillOutline: "border-[#3B82F6]/45 bg-light text-[#3B82F6] dark:border-[#60A5FA]/45 dark:bg-dark dark:text-[#60A5FA]",
  },
  {
    dot: "bg-[#22C55E] dark:bg-[#4ADE80]",
    text: "text-[#22C55E] dark:text-[#4ADE80]",
    textImportant: "!text-[#22C55E] dark:!text-[#4ADE80]",
    edge: "stroke-[#22C55E] dark:stroke-[#4ADE80]",
    chipBg: "bg-[#22C55E]/10 dark:bg-[#4ADE80]/15",
    pillSolid: "border-[#22C55E] bg-[#22C55E] text-white dark:border-[#4ADE80] dark:bg-[#4ADE80] dark:text-dark",
    pillOutline: "border-[#22C55E]/45 bg-light text-[#22C55E] dark:border-[#4ADE80]/45 dark:bg-dark dark:text-[#4ADE80]",
  },
  {
    dot: "bg-[#F97316] dark:bg-[#FB923C]",
    text: "text-[#F97316] dark:text-[#FB923C]",
    textImportant: "!text-[#F97316] dark:!text-[#FB923C]",
    edge: "stroke-[#F97316] dark:stroke-[#FB923C]",
    chipBg: "bg-[#F97316]/10 dark:bg-[#FB923C]/15",
    pillSolid: "border-[#F97316] bg-[#F97316] text-white dark:border-[#FB923C] dark:bg-[#FB923C] dark:text-dark",
    pillOutline: "border-[#F97316]/45 bg-light text-[#F97316] dark:border-[#FB923C]/45 dark:bg-dark dark:text-[#FB923C]",
  },
  {
    dot: "bg-[#A855F7] dark:bg-[#C084FC]",
    text: "text-[#A855F7] dark:text-[#C084FC]",
    textImportant: "!text-[#A855F7] dark:!text-[#C084FC]",
    edge: "stroke-[#A855F7] dark:stroke-[#C084FC]",
    chipBg: "bg-[#A855F7]/10 dark:bg-[#C084FC]/15",
    pillSolid: "border-[#A855F7] bg-[#A855F7] text-white dark:border-[#C084FC] dark:bg-[#C084FC] dark:text-dark",
    pillOutline: "border-[#A855F7]/45 bg-light text-[#A855F7] dark:border-[#C084FC]/45 dark:bg-dark dark:text-[#C084FC]",
  },
];

const CATEGORY_ICONS = {
  "AI / ML": BrainIcon,
  Software: CodeIcon,
  Data: DatabaseIcon,
  "Platform & Tools": CloudIcon,
};

const normalize = (value) => value.toLowerCase();

const groupSkills = (skills) => {
  const grouped = GROUPS.map((group, index) => ({ ...group, skills: [], styleIndex: index }));
  const fallback = grouped[grouped.length - 1];

  skills.forEach((skill) => {
    const normalized = normalize(skill.name || "");
    const group =
      grouped.find((item) => item.name === skill.category) ||
      grouped.find((item) => item.match.some((keyword) => normalized.includes(keyword))) ||
      fallback;

    group.skills.push(skill);
  });

  return grouped.filter((group) => group.skills.length);
};

// Deterministic 0..1 pseudo-random value per skill name, used to break the
// layout out of a perfectly mechanical fan/grid without it reshuffling on re-render.
const hashUnit = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 997) / 997;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const useIsCompact = () => {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isCompact;
};

const CATEGORY_ANGLES = [-90, 0, 90, 180]; // N, E, S, W

// Radial layout: root at the centre, categories at the compass points, skills
// fanned beyond their category with a jittered triple ring so dense categories
// (e.g. 13 AI/ML skills) don't collapse into one unreadable arc.
const buildRadialLayout = (groups) => {
  const nodes = [{ id: "root", type: "root", x: 50, y: 50 }];
  const edges = [];
  const rad = (deg) => (deg * Math.PI) / 180;

  groups.forEach((group, groupIndex) => {
    const angle = groups.length <= 4 ? CATEGORY_ANGLES[groupIndex] : -90 + (360 / groups.length) * groupIndex;
    const catId = `cat-${groupIndex}`;
    const catX = 50 + 33 * Math.cos(rad(angle));
    const catY = 50 + 30 * Math.sin(rad(angle));

    nodes.push({
      id: catId,
      type: "category",
      label: group.name,
      x: catX,
      y: catY,
      angle,
      tint: group.styleIndex,
    });
    edges.push({ id: `e-root-${catId}`, from: "root", to: catId, depth: 0, tint: group.styleIndex });

    const count = group.skills.length;
    const arc = clamp(count * 8, 26, 82);

    group.skills.forEach((skill, skillIndex) => {
      const t = count === 1 ? 0.5 : skillIndex / (count - 1);
      const skillAngle = angle - arc / 2 + arc * t;
      const jitter = hashUnit(skill.name);
      const ring = 1 + (skillIndex % 3) * 0.16;
      const rx = (38 + jitter * 5) * ring;
      const ry = (34 + jitter * 5) * ring;
      const skillId = `${catId}-skill-${skillIndex}`;

      nodes.push({
        id: skillId,
        type: "skill",
        label: skill.name,
        x: clamp(50 + rx * Math.cos(rad(skillAngle)), 5, 95),
        y: clamp(50 + ry * Math.sin(rad(skillAngle)), 6, 94),
        parent: catId,
        tint: group.styleIndex,
      });
      edges.push({ id: `e-${catId}-${skillId}`, from: catId, to: skillId, depth: 1, tint: group.styleIndex });
    });
  });

  return { nodes, edges, height: 100 };
};

// Vertical layout for narrow screens: root at the top, categories down a
// spine, skills branching left/right beneath each one. Height grows with
// content instead of forcing a fixed aspect ratio on a tall skill list.
const buildVerticalLayout = (groups) => {
  const nodes = [{ id: "root", type: "root", x: 50, y: 6 }];
  const edges = [];
  const rowHeight = 10;
  const blockGap = 9;
  let cursor = 21;

  groups.forEach((group, groupIndex) => {
    const catId = `cat-${groupIndex}`;
    const catY = cursor;

    nodes.push({
      id: catId,
      type: "category",
      label: group.name,
      x: 50,
      y: catY,
      tint: group.styleIndex,
    });
    edges.push({ id: `e-root-${catId}`, from: "root", to: catId, depth: 0, tint: group.styleIndex });

    const rows = Math.ceil(group.skills.length / 2) || 1;

    group.skills.forEach((skill, skillIndex) => {
      const row = Math.floor(skillIndex / 2);
      const side = skillIndex % 2 === 0 ? -1 : 1;
      const skillId = `${catId}-skill-${skillIndex}`;

      nodes.push({
        id: skillId,
        type: "skill",
        label: skill.name,
        x: 50 + side * 20,
        y: catY + rowHeight * (row + 1),
        parent: catId,
        tint: group.styleIndex,
      });
      edges.push({ id: `e-${catId}-${skillId}`, from: catId, to: skillId, depth: 1, tint: group.styleIndex });
    });

    cursor = catY + rowHeight * (rows + 1) + blockGap;
  });

  return { nodes, edges, height: cursor };
};

const edgePath = (from, to) => {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const cx = mx - dy * 0.16;
  const cy = my + dx * 0.16;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
};

const getActiveSets = (activeId, nodes, edges) => {
  const activeNodes = new Set();
  const activeEdges = new Set();
  if (!activeId) return { activeNodes, activeEdges };

  const node = nodes.find((item) => item.id === activeId);
  if (!node) return { activeNodes, activeEdges };

  activeNodes.add(node.id);

  if (node.type === "skill") {
    activeNodes.add(node.parent);
    activeNodes.add("root");
    edges.forEach((edge) => {
      if (edge.to === node.id || (edge.from === "root" && edge.to === node.parent)) {
        activeEdges.add(edge.id);
      }
    });
  } else if (node.type === "category") {
    activeNodes.add("root");
    edges.forEach((edge) => {
      if (edge.from === node.id || (edge.from === "root" && edge.to === node.id)) {
        activeEdges.add(edge.id);
        if (edge.from === node.id) activeNodes.add(edge.to);
      }
    });
  }

  return { activeNodes, activeEdges };
};

const GraphEdges = ({ edges, byId, activeEdges, hasActive, shouldReduceMotion }) => (
  <>
    {edges.map((edge, index) => {
      const from = byId.get(edge.from);
      const to = byId.get(edge.to);
      if (!from || !to) return null;

      const active = activeEdges.has(edge.id);
      const dimmed = hasActive && !active;
      const motionProps = shouldReduceMotion
        ? {}
        : {
            initial: { pathLength: 0, opacity: 0 },
            whileInView: { pathLength: 1, opacity: 1 },
            viewport: { once: true, margin: "-40px" },
            transition: { duration: 0.6, delay: edge.depth * 0.3 + index * 0.012, ease: "easeOut" },
          };

      return (
        <motion.path
          key={edge.id}
          d={edgePath(from, to)}
          fill="none"
          strokeWidth={active ? 0.5 : 0.28}
          strokeLinecap="round"
          className={`transition-[stroke,opacity] duration-200 ${
            active ? CATEGORY_STYLES[edge.tint].edge : "stroke-dark/15 dark:stroke-light/18"
          }`}
          style={{ opacity: dimmed ? 0.22 : active ? 0.95 : 0.7 }}
          {...motionProps}
        />
      );
    })}
  </>
);

const RootNode = ({ node, left, top, shouldReduceMotion }) => (
  <motion.div
    className="absolute -translate-x-1/2 -translate-y-1/2"
    style={{ left: `${left}%`, top: `${top}%` }}
    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.6 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.4 }}
  >
    <span
      className="absolute -inset-3 rounded-full bg-primary/10 blur-md dark:bg-primaryDark/10"
      aria-hidden="true"
    />
    <span className="relative block h-5 w-5 rounded-full bg-primary shadow-[0_0_0_5px_rgba(182,62,150,0.14)] dark:bg-primaryDark dark:shadow-[0_0_0_5px_rgba(88,230,217,0.14)] md:h-4 md:w-4" />
    <span className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap text-center text-sm font-bold uppercase tracking-wide text-dark dark:text-light md:text-xs">
      {node.label}
    </span>
  </motion.div>
);

const InteractiveNode = ({ node, left, top, isActive, isDimmed, onHover, onLeave, onToggle, delay, shouldReduceMotion }) => {
  const isCategory = node.type === "category";
  const style = CATEGORY_STYLES[node.tint];

  return (
    <motion.button
      type="button"
      className="group absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap outline-none"
      style={{ left: `${left}%`, top: `${top}%` }}
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay }}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={onLeave}
      onFocus={() => onHover(node.id)}
      onBlur={onLeave}
      onClick={() => onToggle(node.id)}
    >
      <span
        className={`block rounded-full border-solid font-bold uppercase tracking-wide backdrop-blur-sm transition-transform duration-200 group-focus-visible:ring-2 group-focus-visible:ring-offset-2 group-focus-visible:ring-primary/70 dark:group-focus-visible:ring-primaryDark/70 ${
          isCategory ? `border-2 px-4 py-1.5 text-[11px] ${style.pillSolid}` : `border px-3 py-1 text-[10px] ${style.pillOutline}`
        } ${isActive ? "scale-110" : ""}`}
        style={{ opacity: isDimmed ? 0.4 : 1 }}
      >
        {node.label}
      </span>
    </motion.button>
  );
};

const SkillDomainsLegend = ({ groups }) => (
  <div className="absolute bottom-5 right-5 z-10 rounded-xl border border-solid border-dark/10 bg-light/90 px-4 py-3 shadow-[0_8px_24px_rgba(27,27,27,0.08)] backdrop-blur-sm dark:border-light/10 dark:bg-dark/85 md:hidden">
    <p className="text-[11px] font-bold uppercase tracking-wide text-dark/70 dark:text-light/70">Skill Domains</p>
    <ul className="mt-2 flex flex-col gap-1.5">
      {groups.map((group) => (
        <li key={group.name} className="flex items-center gap-2 text-xs font-medium text-dark/80 dark:text-light/80">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${CATEGORY_STYLES[group.styleIndex].dot}`} />
          {group.name}
        </li>
      ))}
    </ul>
  </div>
);

const CategoryCard = ({ group }) => {
  const Icon = CATEGORY_ICONS[group.name];
  const style = CATEGORY_STYLES[group.styleIndex];
  const topSkills = group.skills.slice(0, 3).map((skill) => skill.name);

  return (
    <article className="rounded-2xl border border-solid border-dark/10 bg-light p-5 dark:border-light/10 dark:bg-dark">
      <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${style.chipBg}`}>
        {Icon ? <Icon className={`w-5 ${style.text}`} /> : null}
      </span>
      <h3 className="mt-4 text-lg font-bold dark:text-light">{group.name}</h3>
      <p className="mt-1.5 text-sm font-medium text-dark/60 dark:text-light/60">
        {group.skills.length} skill{group.skills.length === 1 ? "" : "s"}
        {topSkills.length ? `, including ${topSkills.join(", ")}` : ""}.
      </p>
    </article>
  );
};

const Skills = ({ heading, centerLabel, skills = [] }) => {
  const groups = useMemo(() => groupSkills(skills), [skills]);
  const nodeLabel = heading || centerLabel || "Skills";
  const isCompact = useIsCompact();
  const shouldReduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(null);

  const layout = useMemo(() => {
    const built = isCompact ? buildVerticalLayout(groups) : buildRadialLayout(groups);
    if (built.nodes[0]) built.nodes[0].label = nodeLabel;
    return built;
  }, [groups, isCompact, nodeLabel]);

  const byId = useMemo(() => new Map(layout.nodes.map((node) => [node.id, node])), [layout.nodes]);
  const { activeNodes, activeEdges } = useMemo(
    () => getActiveSets(activeId, layout.nodes, layout.edges),
    [activeId, layout.nodes, layout.edges]
  );

  const handleHover = useCallback((id) => setActiveId(id), []);
  const handleLeave = useCallback(() => setActiveId(null), []);
  const handleToggle = useCallback((id) => setActiveId((current) => (current === id ? null : id)), []);

  if (!groups.length) return null;

  return (
    <section className="mt-28 w-full md:mt-20">
      <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-[2rem] border border-solid border-dark/10 bg-light px-8 py-16 shadow-[0_18px_50px_rgba(27,27,27,0.1)] dark:border-light/10 dark:bg-dark dark:shadow-none lg:px-5 md:py-12 xs:px-3">
        <div
          className="pointer-events-none absolute inset-0 bg-[image:linear-gradient(to_right,rgba(0,0,0,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.045)_1px,transparent_1px)] bg-[size:28px_28px] dark:bg-[image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-5xl" style={{ aspectRatio: `100 / ${layout.height}` }}>
          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox={`0 0 100 ${layout.height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <GraphEdges
              edges={layout.edges}
              byId={byId}
              activeEdges={activeEdges}
              hasActive={Boolean(activeId)}
              shouldReduceMotion={shouldReduceMotion}
            />
          </svg>

          {layout.nodes.map((node, index) => {
            const left = node.x;
            const top = (node.y / layout.height) * 100;

            if (node.type === "root") {
              return (
                <RootNode key={node.id} node={node} left={left} top={top} shouldReduceMotion={shouldReduceMotion} />
              );
            }

            return (
              <InteractiveNode
                key={node.id}
                node={node}
                left={left}
                top={top}
                isActive={activeNodes.has(node.id)}
                isDimmed={Boolean(activeId) && !activeNodes.has(node.id)}
                onHover={handleHover}
                onLeave={handleLeave}
                onToggle={handleToggle}
                delay={node.type === "category" ? 0.25 : 0.4 + index * 0.006}
                shouldReduceMotion={shouldReduceMotion}
              />
            );
          })}
        </div>

        {!isCompact ? <SkillDomainsLegend groups={groups} /> : null}
      </div>

      {/* <div className="mt-8 grid grid-cols-4 gap-6 md:grid-cols-2 xs:grid-cols-1">
        {groups.map((group) => (
          <CategoryCard key={group.name} group={group} />
        ))}
      </div> */}
    </section>
  );
};

export default Skills;
