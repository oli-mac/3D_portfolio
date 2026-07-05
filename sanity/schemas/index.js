const imageWithAlt = {
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    {
      name: "alt",
      title: "Alt text",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
  ],
};

const navLink = {
  name: "navLink",
  title: "Navigation Link",
  type: "object",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() },
    { name: "href", title: "Href", type: "string", validation: (Rule) => Rule.required() },
    { name: "sortOrder", title: "Sort Order", type: "number" },
  ],
};

const socialLink = {
  name: "socialLink",
  title: "Social Link",
  type: "object",
  fields: [
    { name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() },
    {
      name: "icon",
      title: "Icon",
      type: "string",
      options: {
        list: [
          { title: "Twitter", value: "twitter" },
          { title: "GitHub", value: "github" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "Pinterest", value: "pinterest" },
          { title: "Dribbble", value: "dribbble" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    { name: "href", title: "Href", type: "url", validation: (Rule) => Rule.required() },
    { name: "sortOrder", title: "Sort Order", type: "number" },
  ],
};

const seo = {
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "description", title: "Description", type: "text", rows: 3 },
  ],
};

const statistic = {
  name: "statistic",
  title: "Statistic",
  type: "object",
  fields: [
    { name: "value", title: "Value", type: "number", validation: (Rule) => Rule.required() },
    { name: "suffix", title: "Suffix", type: "string" },
    { name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() },
    { name: "sortOrder", title: "Sort Order", type: "number" },
  ],
};

const textSection = {
  name: "textSection",
  title: "Text Section",
  type: "object",
  fields: [
    { name: "heading", title: "Heading", type: "string", validation: (Rule) => Rule.required() },
    {
      name: "body",
      title: "Body",
      type: "text",
      rows: 5,
      description: "Legacy single-body field. Use Paragraphs for new long-form posts.",
    },
    {
      name: "paragraphs",
      title: "Paragraphs",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description: "Add one or more paragraphs for this section.",
    },
    {
      name: "images",
      title: "Optional Section Images",
      type: "array",
      of: [{ type: "imageWithAlt" }],
      description: "Upload screenshots, diagrams, or supporting images for this section.",
    },
    { name: "sortOrder", title: "Sort Order", type: "number" },
  ],
  preview: {
    select: {
      title: "heading",
      media: "images.0",
    },
  },
};

const siteSettings = {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() },
    { name: "logoText", title: "Logo Text", type: "string", validation: (Rule) => Rule.required() },
    { name: "contactEmail", title: "Contact Email", type: "email", validation: (Rule) => Rule.required() },
    { name: "hireMeLabel", title: "Hire Me Label", type: "string" },
    { name: "resumeLabel", title: "Resume Label", type: "string" },
    { name: "contactLabel", title: "Contact Label", type: "string" },
    { name: "resumeFile", title: "Resume File", type: "file" },
    { name: "navLinks", title: "Navigation Links", type: "array", of: [{ type: "navLink" }] },
    { name: "socialLinks", title: "Social Links", type: "array", of: [{ type: "socialLink" }] },
    { name: "footerCopyrightText", title: "Footer Copyright Text", type: "string" },
    { name: "footerCreditText", title: "Footer Credit Text", type: "string" },
    { name: "sayHelloLabel", title: "Say Hello Label", type: "string" },
    { name: "sayHelloHref", title: "Say Hello Href", type: "string" },
    { name: "seo", title: "SEO Defaults", type: "seo" },
  ],
};

const homePage = {
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    { name: "headline", title: "Headline", type: "string", validation: (Rule) => Rule.required() },
    { name: "intro", title: "Intro", type: "text", rows: 4, validation: (Rule) => Rule.required() },
    { name: "profileImage", title: "Profile Image", type: "imageWithAlt" },
    { name: "decorativeImage", title: "Decorative Image", type: "imageWithAlt" },
    { name: "seo", title: "SEO", type: "seo" },
  ],
};

const aboutPage = {
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    { name: "headline", title: "Headline", type: "string", validation: (Rule) => Rule.required() },
    { name: "eyebrow", title: "Eyebrow", type: "string" },
    { name: "paragraphs", title: "Paragraphs", type: "array", of: [{ type: "text" }] },
    { name: "profileImage", title: "Profile Image", type: "imageWithAlt" },
    { name: "stats", title: "Stats", type: "array", of: [{ type: "statistic" }] },
    { name: "skillsHeading", title: "Skills Heading", type: "string" },
    { name: "skillsCenterLabel", title: "Skills Center Label", type: "string" },
    { name: "testimonialsHeading", title: "Testimonials Heading", type: "string" },
    { name: "seo", title: "SEO", type: "seo" },
  ],
};

const credentialsPage = {
  name: "credentialsPage",
  title: "Credentials Page",
  type: "document",
  fields: [
    { name: "headline", title: "Headline", type: "string", validation: (Rule) => Rule.required() },
    { name: "educationHeading", title: "Education Heading", type: "string" },
    { name: "experienceHeading", title: "Experience Heading", type: "string" },
    { name: "focusHeading", title: "Focus Heading", type: "string" },
    { name: "focusRole", title: "Focus Role", type: "string" },
    { name: "focusTitle", title: "Focus Title", type: "string" },
    { name: "focusMeta", title: "Focus Meta", type: "string" },
    { name: "focusBody", title: "Focus Body", type: "text", rows: 4 },
    { name: "focusPrimaryCtaLabel", title: "Focus Primary CTA Label", type: "string" },
    { name: "focusPrimaryCtaHref", title: "Focus Primary CTA Href", type: "string" },
    { name: "focusSecondaryCtaLabel", title: "Focus Secondary CTA Label", type: "string" },
    { name: "focusSecondaryCtaHref", title: "Focus Secondary CTA Href", type: "string" },
    { name: "education", title: "Education", type: "array", of: [{ type: "educationItem" }] },
    { name: "experience", title: "Experience", type: "array", of: [{ type: "experienceItem" }] },
    { name: "seo", title: "SEO", type: "seo" },
  ],
};

const routePage = {
  name: "routePage",
  title: "Route Page",
  type: "document",
  fields: [
    {
      name: "routeKey",
      title: "Route Key",
      type: "string",
      options: {
        list: [
          { title: "Projects", value: "projects" },
          { title: "Blog", value: "blog" },
          { title: "Publications", value: "publications" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    { name: "headline", title: "Headline", type: "string", validation: (Rule) => Rule.required() },
    { name: "actionLabel", title: "Card Action Label", type: "string" },
    { name: "backLinkLabel", title: "Back Link Label", type: "string" },
    { name: "seo", title: "SEO", type: "seo" },
  ],
};

const educationItem = {
  name: "educationItem",
  title: "Education Item",
  type: "object",
  fields: [
    { name: "type", title: "Type", type: "string", validation: (Rule) => Rule.required() },
    { name: "time", title: "Time", type: "string" },
    { name: "address", title: "Address", type: "string" },
    { name: "info", title: "Info", type: "text", rows: 4 },
    { name: "sortOrder", title: "Sort Order", type: "number" },
  ],
};

const experienceItem = {
  name: "experienceItem",
  title: "Experience Item",
  type: "object",
  fields: [
    { name: "position", title: "Position", type: "string", validation: (Rule) => Rule.required() },
    { name: "company", title: "Company", type: "string" },
    { name: "companyLink", title: "Company Link", type: "string" },
    { name: "time", title: "Time", type: "string" },
    { name: "address", title: "Address", type: "string" },
    { name: "work", title: "Work", type: "text", rows: 4 },
    { name: "sortOrder", title: "Sort Order", type: "number" },
  ],
};

const project = {
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() },
    { name: "type", title: "Type", type: "string" },
    { name: "period", title: "Period", type: "string" },
    { name: "featured", title: "Featured", type: "boolean" },
    { name: "summary", title: "Summary", type: "text", rows: 4 },
    { name: "details", title: "Details", type: "array", of: [{ type: "string" }] },
    { name: "tags", title: "Tags", type: "array", of: [{ type: "string" }] },
    { name: "image", title: "Image", type: "imageWithAlt" },
    { name: "link", title: "External Link", type: "string" },
    { name: "github", title: "GitHub Link", type: "string" },
    { name: "sortOrder", title: "Sort Order", type: "number" },
  ],
};

const blogPost = {
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    { name: "date", title: "Date", type: "string" },
    { name: "readTime", title: "Read Time", type: "string" },
    { name: "category", title: "Category", type: "string" },
    { name: "excerpt", title: "Excerpt", type: "text", rows: 3 },
    { name: "image", title: "Image", type: "imageWithAlt" },
    { name: "sections", title: "Sections", type: "array", of: [{ type: "textSection" }] },
    { name: "sortOrder", title: "Sort Order", type: "number" },
    { name: "seo", title: "SEO", type: "seo" },
  ],
};

const blogReaction = {
  name: "blogReaction",
  title: "Blog Reaction",
  type: "document",
  fields: [
    {
      name: "post",
      title: "Blog Post",
      type: "reference",
      to: [{ type: "blogPost" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "reaction",
      title: "Reaction",
      type: "string",
      options: {
        list: [
          { title: "Thumbs Up", value: "thumbsUp" },
          { title: "Thumbs Down", value: "thumbsDown" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    { name: "name", title: "Display Name", type: "string", validation: (Rule) => Rule.required() },
    { name: "comment", title: "Comment", type: "text", rows: 4 },
    {
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "pending",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    { name: "visitorHash", title: "Visitor Hash", type: "string", readOnly: true },
    { name: "createdAt", title: "Created At", type: "datetime", readOnly: true },
    { name: "updatedAt", title: "Updated At", type: "datetime", readOnly: true },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "comment",
      postTitle: "post.title",
    },
    prepare({ title, subtitle, postTitle }) {
      return {
        title: title || "Blog reaction",
        subtitle: [postTitle, subtitle].filter(Boolean).join(" - "),
      };
    },
  },
};

const publication = {
  name: "publication",
  title: "Publication",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() },
    { name: "journal", title: "Journal", type: "string" },
    { name: "date", title: "Date", type: "string" },
    { name: "summary", title: "Summary", type: "text", rows: 4 },
    { name: "tags", title: "Tags", type: "array", of: [{ type: "string" }] },
    { name: "link", title: "Optional Link", type: "string" },
    { name: "sortOrder", title: "Sort Order", type: "number" },
  ],
};

const skill = {
  name: "skill",
  title: "Skill",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: ["AI / ML", "Software", "Platform & Tools", "Data"],
      },
    },
    { name: "x", title: "X Position", type: "string" },
    { name: "y", title: "Y Position", type: "string" },
    { name: "sortOrder", title: "Sort Order", type: "number" },
  ],
};

const testimonial = {
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() },
    { name: "role", title: "Role/Title", type: "string" },
    { name: "quote", title: "Quote", type: "text", rows: 4 },
    { name: "image", title: "Image", type: "imageWithAlt" },
    { name: "sortOrder", title: "Sort Order", type: "number" },
  ],
};

export const schemaTypes = [
  imageWithAlt,
  navLink,
  socialLink,
  seo,
  statistic,
  textSection,
  educationItem,
  experienceItem,
  siteSettings,
  homePage,
  aboutPage,
  credentialsPage,
  routePage,
  project,
  blogPost,
  blogReaction,
  publication,
  skill,
  testimonial,
];
