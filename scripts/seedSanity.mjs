import "dotenv/config";
import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const projectId = process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || "production";
const apiVersion = process.env.VITE_SANITY_API_VERSION || "2026-06-28";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error("Set VITE_SANITY_PROJECT_ID, VITE_SANITY_DATASET, and SANITY_WRITE_TOKEN before seeding.");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const local = (relativePath) => path.join(rootDir, relativePath);

const uploadAsset = async (kind, relativePath) => {
  const absPath = local(relativePath);
  const filename = path.basename(absPath);
  const asset = await client.assets.upload(kind, fs.createReadStream(absPath), { filename });
  return { _type: "reference", _ref: asset._id };
};

const imageField = async (relativePath, alt) => ({
  _type: "image",
  asset: await uploadAsset("image", relativePath),
  alt,
});

const fileField = async (relativePath) => ({
  _type: "file",
  asset: await uploadAsset("file", relativePath),
});

const createOrReplace = (doc) => client.createOrReplace(doc);

const navLinks = [
  { _type: "navLink", title: "Home", href: "/", sortOrder: 1 },
  { _type: "navLink", title: "About", href: "/About", sortOrder: 2 },
  { _type: "navLink", title: "Projects", href: "/projects", sortOrder: 3 },
  { _type: "navLink", title: "Credentials", href: "/articles", sortOrder: 4 },
  { _type: "navLink", title: "Blog", href: "/blog", sortOrder: 5 },
  { _type: "navLink", title: "Publications", href: "/publications", sortOrder: 6 },
];

const socialLinks = [
  { _type: "socialLink", label: "Twitter", icon: "twitter", href: "https://x.com/olyadmulugeta", sortOrder: 1 },
  { _type: "socialLink", label: "GitHub", icon: "github", href: "https://github.com/oli-mac", sortOrder: 2 },
  {
    _type: "socialLink",
    label: "LinkedIn",
    icon: "linkedin",
    href: "https://www.linkedin.com/in/olyad-mulugeta-79875621b/",
    sortOrder: 3,
  },
  {
    _type: "socialLink",
    label: "Pinterest",
    icon: "pinterest",
    href: "https://www.linkedin.com/in/olyad-mulugeta-79875621b/",
    sortOrder: 4,
  },
  {
    _type: "socialLink",
    label: "Dribbble",
    icon: "dribbble",
    href: "https://www.facebook.com/profile.php?id=100008821115355",
    sortOrder: 5,
  },
];

const projects = [
  {
    title: "Mela Agents",
    type: "AI-Powered Agentic Platform",
    period: "02/2025 - 12/2025",
    featured: true,
    summary:
      "A full-stack agentic platform that generates automated profiles for documents, countries, organizations, and individuals, with speech generation tailored to different contexts.",
    details: [
      "Scaled for research, media, and government workflows across multiple domains.",
      "Built around LLM-powered automation for profiling, synthesis, and communication tasks.",
    ],
    tags: ["LLM", "Agentic AI", "Full-Stack", "Speech Generation"],
  },
  {
    title: "CardioLens",
    type: "Interpretable Healthcare AI",
    period: "01/2022 - 01/2023",
    featured: true,
    image: ["public/images/projects/ehocardio.jpg", "CardioLens echocardiography project"],
    summary:
      "An interpretable AI framework for echocardiography-based early screening of rheumatic heart disease in resource-limited settings.",
    details: [
      "Improved diagnostic accuracy by 70% for early RHD screening.",
      "Segmented 5,000+ echocardiographic images for precise mitral regurgitation measurement.",
      "Aligned the model workflow with healthcare professionals and WHF diagnostic standards.",
    ],
    tags: ["Computer Vision", "Echocardiography", "Grad-CAM", "Healthcare AI"],
  },
  {
    title: "CortexAI",
    type: "EEG Seizure Detection",
    period: "09/2025 - 01/2026",
    featured: true,
    summary:
      "An end-to-end seizure detection system that transforms EEG signals into time-frequency images for CNN-based classification.",
    details: [
      "Optimized an EfficientNetV2-S model against LSTM, 1D-CNN, EEGNet, and Transformer baselines.",
      "Trained with 106,800 EEG segments plus hospital data for local clinical adaptation.",
      "Reached 96.57% accuracy on mixed test data and deployed real-time predictions with FastAPI and React.",
    ],
    tags: ["EEG", "EfficientNetV2", "FastAPI", "React"],
  },
  {
    title: "WheatWise",
    type: "Agricultural Computer Vision",
    period: "01/2024 - 12/2024",
    summary:
      "A deep learning system with a FastAPI backend and Flutter mobile app that helps farmers diagnose wheat leaf diseases from smartphone images.",
    details: [
      "Compiled 50,000+ annotated wheat leaf images across five common disease classes.",
      "Achieved 99.2% classification accuracy for automated wheat disease diagnosis.",
    ],
    tags: ["Flutter", "FastAPI", "Deep Learning", "Agritech"],
  },
  {
    title: "LeshAI",
    type: "Medical Object Detection",
    period: "09/2025 - 01/2026",
    summary:
      "A multiclass YOLOv11 detection pipeline for cutaneous leishmaniasis diagnosis from microscopic images.",
    details: [
      "Built and annotated 4,000 clinical and public-source images with parasite, healthy monocyte, and infected monocyte classes.",
      "Reached 76.3% mAP@0.5 and shipped a FastAPI backend with a Flutter mobile frontend.",
    ],
    tags: ["YOLOv11", "FastAPI", "Flutter", "Medical AI"],
  },
  {
    title: "Learn and Transcribe ET Lang V2",
    type: "Ethiopian Language NLP",
    period: "01/2023 - 12/2023",
    summary:
      "A low-resource NLP platform for Amharic and Afan Oromo OCR, transcription, voice synthesis, and translation.",
    details: [
      "Delivered OCR, transcription, speech synthesis, and translation through FastAPI and Flutter.",
      "Reached 95% speech intelligibility and reduced latency by 20% for low-resource devices.",
    ],
    tags: ["NLP", "OCR", "Speech Synthesis", "Flutter"],
  },
  {
    title: "EFCD",
    type: "Ethiopian Food Composition Database",
    period: "09/2025 - 01/2026",
    summary:
      "A national food database digitization project with a REST API, PostgreSQL data model, search, and retrieval-augmented discovery.",
    details: [
      "Served as backend engineer and project manager for the core API and relational schema.",
      "Implemented Elasticsearch, fuzzy autocomplete, RAG, Docker deployment, high availability, and automated backups.",
    ],
    tags: ["PostgreSQL", "Elasticsearch", "RAG", "Docker"],
  },
  {
    title: "Samaritan",
    type: "AI-Powered Medicine Identification",
    period: "Education Project",
    image: ["public/images/projects/Project-Samaritan.jpg", "Samaritan medicine identification app"],
    summary:
      "A medicine identification and tracking application that uses image recognition to identify medication and present drug information in a user-friendly format.",
    details: [
      "Connected AI-powered recognition with public medication information sources.",
      "Designed for practical medication tracking and patient-facing clarity.",
    ],
    tags: ["Flutter", "Computer Vision", "Healthcare"],
    github: "https://github.com/pegasuse-x/Project-Samaritan.git",
  },
  {
    title: "Enebla Customer",
    type: "Flutter Food Ordering App",
    period: "Education Project",
    image: ["public/images/projects/Enebla-c.png", "Enebla customer app"],
    summary:
      "A subscription-based restaurant ordering app that lets customers subscribe, order, and pay directly through the platform.",
    details: ["Built prepaid ordering, restaurant subscriptions, and customer-facing ordering flows."],
    tags: ["Flutter", "Payments", "Mobile App"],
    github: "https://github.com/Zagwe/enebla_customer.git",
  },
  {
    title: "Enebla User",
    type: "Flutter Restaurant Platform",
    period: "Education Project",
    image: ["public/images/projects/Enebla-u.png", "Enebla user app"],
    summary:
      "The restaurant-side experience for Enebla, helping restaurants manage a virtual storefront and interact with subscribed customers.",
    details: ["Supported order management, payments, and direct restaurant-customer interaction."],
    tags: ["Flutter", "Restaurant Tech", "Payments"],
    github: "https://github.com/Zagwe/enebla_user_app.git",
  },
  {
    title: "DaguEthioED",
    type: "Company Website and Community Platform",
    period: "2023 - Present",
    image: ["public/images/projects/Dagu.png", "DaguEthioED website"],
    summary:
      "A technology education initiative and web presence focused on empowering the next generation with information, events, and speaker-led learning.",
    details: ["Built a responsive company website and shaped the platform around technology education and community events."],
    tags: ["Leadership", "Web", "Community"],
    link: "https://DaguEthioED.tech",
    github: "https://github.com/DaguEthioED/dagu_website.git",
  },
  {
    title: "React Portfolio Website",
    type: "React Vite Portfolio",
    period: "Current",
    image: ["public/images/projects/portfolio-cover-image.jpg", "Portfolio website"],
    summary: "A responsive portfolio built with React, Vite, Tailwind CSS, Framer Motion, and a dark/light theme system.",
    details: ["Designed to present software engineering, machine learning, publications, and writing in one coherent experience."],
    tags: ["React", "Vite", "Tailwind", "Framer Motion"],
    github: "https://github.com/oli-mac/3D_portfolio.git",
  },
];

const blogPosts = [
  {
    slug: "interpretable-ai-rhd-screening",
    title: "Building interpretable AI for rheumatic heart disease screening",
    date: "May 2026",
    readTime: "5 min read",
    category: "Healthcare AI",
    excerpt:
      "What I learned while building an echocardiography workflow where model performance and clinical interpretability had to move together.",
    sections: [
      {
        heading: "Why interpretability mattered",
        body:
          "CardioLens was not only a computer vision project. It was a clinical workflow problem where doctors needed to understand why a model was highlighting a region before they could trust it in an early screening setting.",
      },
      {
        heading: "The technical path",
        body:
          "The work combined segmentation, echocardiographic measurement, and Grad-CAM-style visual explanations. Building the system forced the model pipeline to stay close to the diagnostic standard instead of optimizing accuracy in isolation.",
      },
      {
        heading: "What stayed with me",
        body:
          "The biggest lesson was that healthcare AI succeeds when the interface, model, and validation process help experts inspect the system. Accuracy opens the door, but interpretability keeps the conversation going.",
      },
    ],
  },
  {
    slug: "eeg-image-seizure-detection",
    title: "Turning EEG signals into image-based seizure detection models",
    date: "May 2026",
    readTime: "6 min read",
    category: "Deep Learning",
    excerpt:
      "How transforming EEG into time-frequency images made it possible to compare CNN approaches against traditional sequence models.",
    sections: [
      {
        heading: "From signal to image",
        body:
          "CortexAI started with a practical question: can EEG classification improve when raw signals are transformed into image-like representations? That framing opened the door to EfficientNetV2-S and transfer learning workflows.",
      },
      {
        heading: "Model comparison",
        body:
          "The system was evaluated against LSTM, 1D-CNN, EEGNet, and Transformer-based approaches. The image-based CNN path performed strongly while remaining practical enough to deploy behind a FastAPI service.",
      },
      {
        heading: "Deployment lesson",
        body:
          "A clinical model is only useful when it can serve predictions in a reliable interface. Connecting the model to a React frontend made evaluation easier for users who should not need to understand the full training stack.",
      },
    ],
  },
  {
    slug: "wheat-disease-fastapi-flutter",
    title: "Deploying wheat disease diagnosis to farmers with FastAPI and Flutter",
    date: "May 2026",
    readTime: "4 min read",
    category: "Applied ML",
    excerpt: "Notes from turning a high-accuracy wheat leaf classifier into a mobile workflow that could support field diagnosis.",
    sections: [
      {
        heading: "The field problem",
        body:
          "WheatWise focused on making plant disease diagnosis easier to access. The model had to work with smartphone images, and the application had to feel direct enough for farmers to use without extra technical steps.",
      },
      {
        heading: "System shape",
        body:
          "The project combined a FastAPI backend, a Flutter mobile app, and a dataset of more than 50,000 annotated wheat leaf images. The model reached 99.2% classification accuracy across common disease categories.",
      },
      {
        heading: "Product lesson",
        body:
          "A strong model still needs a simple capture, upload, and result flow. The deployment work mattered as much as training because the user experience decides whether the model reaches the field.",
      },
    ],
  },
  {
    slug: "ethiopian-language-nlp-tools",
    title: "Building NLP tools for Ethiopian languages",
    date: "May 2026",
    readTime: "5 min read",
    category: "NLP",
    excerpt:
      "What low-resource language work taught me about latency, accessibility, OCR, speech synthesis, and mobile-first deployment.",
    sections: [
      {
        heading: "Low-resource constraints",
        body:
          "Learn and Transcribe ET Lang V2 brought OCR, transcription, voice synthesis, and translation into one workflow for Amharic and Afan Oromo. Low-resource language work makes data quality, latency, and accessibility visible every day.",
      },
      {
        heading: "Designing for access",
        body:
          "The system targeted low-resource devices and reduced latency by 20%. Speech synthesis reached 95% intelligibility, which was especially important for users who benefit from audio access.",
      },
      {
        heading: "Engineering lesson",
        body:
          "The best NLP system is not only the one with the most capable model. It is the one that can handle real users, real device limits, and the languages people actually use.",
      },
    ],
  },
  {
    slug: "national-scale-data-products-efcd",
    title: "Lessons from building national-scale data products like EFCD",
    date: "May 2026",
    readTime: "4 min read",
    category: "Data Engineering",
    excerpt:
      "Backend and project-management lessons from designing APIs, search, backups, and data workflows for a national food composition database.",
    sections: [
      {
        heading: "A database is a product",
        body:
          "EFCD was a national food database digitization effort, but the engineering problem was broader than storing data. The system needed a clear REST API, reliable relational schema, search, backups, and long-term maintainability.",
      },
      {
        heading: "Search and retrieval",
        body:
          "Elasticsearch, fuzzy autocomplete, and RAG helped make the database discoverable. For public data products, search quality can determine whether people trust and repeatedly use the system.",
      },
      {
        heading: "Operational lesson",
        body:
          "Docker deployment, high availability, and automated backups were part of the core product, not afterthoughts. Data products earn trust by staying available and recoverable.",
      },
    ],
  },
];

const run = async () => {
  const resumeFile = await fileField("public/Resume.pdf");

  await createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    name: "Olyad Mulugeta",
    logoText: "OM",
    contactEmail: "contactolyad@gmail.com",
    hireMeLabel: "Hire Me",
    resumeLabel: "Resume",
    contactLabel: "Contact",
    resumeFile,
    navLinks,
    socialLinks,
    footerCopyrightText: `${new Date().getFullYear()} © All Rights Reserved.`,
    footerCreditText: "Made with",
    sayHelloLabel: "Say Hello",
    sayHelloHref: "https://olyadmulugeta.live",
    seo: {
      _type: "seo",
      title: "Olyad Mulugeta",
      description: "Machine Learning Engineer and Senior Software Engineer portfolio for Olyad Mulugeta.",
    },
  });

  await createOrReplace({
    _id: "homePage",
    _type: "homePage",
    headline: "Building AI Systems For Real-World Impact.",
    intro:
      "I am a Machine Learning Engineer and Senior Software Engineer building production ML systems, MLOps workflows, LLM-powered applications, and full-stack products across healthcare, NLP, computer vision, and data platforms. Explore my projects, credentials, publications, and writing on the systems I have built.",
    profileImage: await imageField("public/images/profile/olyad-prev.png", "Olyad Mulugeta"),
    decorativeImage: await imageField("public/images/svgs/miscellaneous_icons_1.svg", "Decorative light bulb"),
    seo: {
      _type: "seo",
      title: "Olyad Mulugeta",
      description: "Machine Learning Engineer and Senior Software Engineer portfolio for Olyad Mulugeta.",
    },
  });

  await createOrReplace({
    _id: "aboutPage",
    _type: "aboutPage",
    headline: "Passion Fuels Purpose!",
    eyebrow: "About Me",
    paragraphs: [
      "Hi, I'm Olyad Mulugeta, a Machine Learning Engineer and Senior Software Engineer focused on production ML systems, MLOps, LLM-powered applications, healthcare AI, NLP, and computer vision. I work across research, backend systems, data pipelines, model serving, and user-facing applications.",
      "At the Ethiopian Artificial Intelligence Institute, I help lead interpretable AI and natural language processing work, including systems for rheumatic heart disease screening, epileptic seizure detection from EEG, wheat disease diagnosis, and Ethiopian language tools.",
      "Whether I am building a FastAPI service, Flutter mobile app, React interface, Docker deployment, or Kubernetes-ready ML workflow, I care about systems that are accurate, interpretable, and useful in real environments.",
    ],
    profileImage: await imageField("public/images/profile/olyad.png", "Olyad Mulugeta"),
    stats: [
      { _type: "statistic", value: 7, suffix: "+", label: "AI systems", sortOrder: 1 },
      { _type: "statistic", value: 15, suffix: "+", label: "Projects Completed", sortOrder: 2 },
      { _type: "statistic", value: 1, suffix: "", label: "Peer-reviewed publication", sortOrder: 3 },
    ],
    skillsHeading: "Skills",
    skillsCenterLabel: "AI",
    testimonialsHeading: "Testimonials",
    seo: {
      _type: "seo",
      title: "Olyad Mulugeta | About Me",
      description: "About Olyad Mulugeta, Machine Learning Engineer and Senior Software Engineer.",
    },
  });

  await createOrReplace({
    _id: "credentialsPage",
    _type: "credentialsPage",
    headline: "Credentials Built Through Practice.",
    educationHeading: "Education",
    experienceHeading: "Experience",
    focusHeading: "Current Focus",
    focusRole: "Deputy Director, Interpretable AI and Natural Language Processing",
    focusTitle: "Ethiopian Artificial Intelligence Institute",
    focusMeta: "09/2023 - Present | Addis Ababa, Ethiopia",
    focusBody:
      "I currently work on interpretable AI, production ML systems, MLOps, and low-latency deployed applications across healthcare, NLP, and computer vision. Recent work includes echocardiography-based RHD screening, EEG seizure detection, wheat leaf disease classification, and Ethiopian language AI tools.",
    focusPrimaryCtaLabel: "View Projects",
    focusPrimaryCtaHref: "/projects",
    focusSecondaryCtaLabel: "View Publications",
    focusSecondaryCtaHref: "/publications",
    education: [
      {
        _type: "educationItem",
        type: "Bachelor of Science in Software Engineering",
        time: "01/2018 - 07/2023",
        address: "Bahir Dar Institute of Technology, Bahir Dar University",
        info: "Graduated with a CGPA of 3.7/4.0. Relevant coursework included algorithms and data structures, software design and architecture, database systems, object-oriented programming, networking, software testing and quality assurance, web development, mobile app development, AI, machine learning, cloud computing, and cybersecurity.",
        sortOrder: 1,
      },
    ],
    experience: [
      {
        _type: "experienceItem",
        position: "Deputy Director, Interpretable AI and Natural Language Processing",
        companyLink: "http://www.aii.et/",
        company: "Ethiopian Artificial Intelligence Institute",
        time: "09/2023 - Present",
        address: "Addis Ababa, Ethiopia",
        work: "Lead applied AI work across interpretable healthcare AI, NLP, computer vision, and production ML infrastructure. Recent systems include echocardiography-based RHD screening, EEG seizure detection, wheat leaf disease classification, and scalable ML pipelines that reduced training time by 27%.",
        sortOrder: 1,
      },
      {
        _type: "experienceItem",
        position: "Co-Founder and CEO",
        companyLink: "http://www.DaguEthioED.com",
        company: "DaguEthioED",
        time: "2023 - Present",
        address: "Addis Ababa, Ethiopia",
        work: "Our company envisions a future where the next generation is empowered with information to shape the world of technology. We aim to host informative events that spark curiosity and promote learning, featuring prominent speakers in the tech industry.",
        sortOrder: 2,
      },
      {
        _type: "experienceItem",
        position: "Founder & Team Leader",
        companyLink: "/",
        company: "BIT AI and Cybersecurity Club",
        time: "2022 - Present",
        address: "Bahir Dar, Ethiopia",
        work: "As the founder and team leader of the AI and Cybersecurity Club at Bahir Dar Institute of Technology, I gained valuable leadership and technical skills through events, workshops, and projects.",
        sortOrder: 3,
      },
      {
        _type: "experienceItem",
        position: "CTO",
        companyLink: "/",
        company: "BroLine INC",
        time: "2020 - 2022",
        address: "Addis Ababa, Ethiopia",
        work: "Led technical strategy, guided new projects from conceptualization to deployment, and created technology standards and practices for maintainable delivery.",
        sortOrder: 4,
      },
      {
        _type: "experienceItem",
        position: "Software Engineer",
        companyLink: "/",
        company: "Telet Tech",
        time: "2022 - Present",
        address: "Addis Ababa, Ethiopia",
        work: "Built software products, shaped technical direction, and supported a collaborative engineering culture focused on practical technology solutions.",
        sortOrder: 5,
      },
    ],
    seo: {
      _type: "seo",
      title: "Olyad Mulugeta | Credentials",
      description: "Education, experience, and current AI focus for Olyad Mulugeta.",
    },
  });

  const routePages = [
    {
      _id: "routePage-projects",
      _type: "routePage",
      routeKey: "projects",
      headline: "AI Systems Built For Real Work.",
      actionLabel: "Visit Project",
      seo: {
        _type: "seo",
        title: "Olyad Mulugeta | Projects",
        description: "Machine learning, MLOps, healthcare AI, NLP, Flutter, and full-stack software projects by Olyad Mulugeta.",
      },
    },
    {
      _id: "routePage-blog",
      _type: "routePage",
      routeKey: "blog",
      headline: "Notes From Building AI Systems.",
      actionLabel: "Read post",
      backLinkLabel: "Back to Blog",
      seo: {
        _type: "seo",
        title: "Olyad Mulugeta | Blog",
        description: "Experience notes on healthcare AI, EEG analysis, NLP, data engineering, and deployed machine learning systems.",
      },
    },
    {
      _id: "routePage-publications",
      _type: "routePage",
      routeKey: "publications",
      headline: "Research That Connects AI And Care.",
      seo: {
        _type: "seo",
        title: "Olyad Mulugeta | Publications",
        description: "Peer-reviewed publications and research by Olyad Mulugeta in AI, EEG signal analysis, and healthcare machine learning.",
      },
    },
  ];

  for (const doc of routePages) await createOrReplace(doc);

  for (const [index, project] of projects.entries()) {
    await createOrReplace({
      _id: `project-${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
      _type: "project",
      ...project,
      image: project.image ? await imageField(project.image[0], project.image[1]) : undefined,
      sortOrder: index + 1,
    });
  }

  for (const [index, post] of blogPosts.entries()) {
    await createOrReplace({
      _id: `blogPost-${post.slug}`,
      _type: "blogPost",
      ...post,
      slug: { _type: "slug", current: post.slug },
      sections: post.sections.map((section, sectionIndex) => ({
        _type: "textSection",
        ...section,
        sortOrder: sectionIndex + 1,
      })),
      sortOrder: index + 1,
      seo: {
        _type: "seo",
        title: `${post.title} | Olyad Mulugeta`,
        description: post.excerpt,
      },
    });
  }

  await createOrReplace({
    _id: "publication-eeg-survey",
    _type: "publication",
    title: "AI-Based Approaches for Analyzing EEG Signals to Identify Epileptic Seizures: A Survey",
    date: "24/02/2026",
    journal: "Applied Computational Intelligence and Soft Computing",
    summary:
      "A comprehensive survey of AI-based approaches for epileptic seizure analysis using EEG signals. The work synthesizes 86 peer-reviewed studies from 2014 to 2023 and reviews eleven public EEG datasets, highlighting dataset characteristics, applications, and implications for model performance.",
    tags: ["EEG", "Epileptic Seizures", "Survey", "Machine Learning"],
    sortOrder: 1,
  });

  const skills = [
    ["Python", "AI / ML"],
    ["PyTorch", "AI / ML"],
    ["TensorFlow", "AI / ML"],
    ["Scikit-learn", "AI / ML"],
    ["Transformers", "AI / ML"],
    ["LLMs", "AI / ML"],
    ["RAG", "AI / ML"],
    ["NLP", "AI / ML"],
    ["Computer Vision", "AI / ML"],
    ["YOLO", "AI / ML"],
    ["Tesseract OCR", "AI / ML"],
    ["MLOps", "AI / ML"],
    ["ML Pipelines", "AI / ML"],
    ["GPU Computing", "AI / ML"],
    ["FastAPI", "Software"],
    ["REST APIs", "Software"],
    ["React", "Software"],
    ["Vite", "Software"],
    ["Flutter", "Software"],
    ["Dart", "Software"],
    ["TypeScript", "Software"],
    ["Node.js", "Software"],
    ["PostgreSQL", "Data"],
    ["SQL", "Data"],
    ["Data Pipelines", "Data"],
    ["Database Schema Design", "Data"],
    ["Docker", "Platform & Tools"],
    ["Kubernetes", "Platform & Tools"],
    ["CI/CD Pipelines", "Platform & Tools"],
    ["AWS / GCP", "Platform & Tools"],
    ["Git", "Platform & Tools"],
    ["Linux", "Platform & Tools"],
  ];

  for (const [index, [name, category]] of skills.entries()) {
    await createOrReplace({
      _id: `skill-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      _type: "skill",
      name,
      category,
      sortOrder: index + 1,
    });
  }

  const testimonials = [
    {
      name: "Mulugeta Solomon",
      role: "Robotics Researcher at Ritsumeikan University",
      quote: "Olyad made my portfolio remarkable with exceptional dedication and expertise - a true asset to any team.",
      image: ["public/images/profile/mulugeta.jpg", "Mulugeta Solomon"],
    },
    {
      name: "Tarik Teshome",
      role: "Software Engineer",
      quote: "Effortlessly tackling intricate challenges, Olyad's exceptional dedication makes him a stellar software engineer and a great teammate.",
      image: ["public/images/profile/tarik.jpg", "Tarik Teshome"],
    },
    {
      name: "Michael Belachew",
      role: "Software Engineer",
      quote: "Our team is lucky to have Olyad. His expertise, dedication, and attitude make him a valuable software engineer.",
      image: ["public/images/profile/miki.jpg", "Michael Belachew"],
    },
  ];

  for (const [index, testimonial] of testimonials.entries()) {
    await createOrReplace({
      _id: `testimonial-${testimonial.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      _type: "testimonial",
      ...testimonial,
      image: await imageField(testimonial.image[0], testimonial.image[1]),
      sortOrder: index + 1,
    });
  }
};

run()
  .then(() => {
    console.log("Sanity seed complete.");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
