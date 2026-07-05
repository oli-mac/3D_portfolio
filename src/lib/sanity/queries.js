import { sanityClient } from "./client";
import { hasSanityConfig } from "./config";

const imageFields = `{
  ...,
  asset,
  "assetUrl": asset->url
}`;

const seoFields = `{
  title,
  description
}`;

export const portfolioQuery = `{
  "siteSettings": *[_type == "siteSettings"][0]{
    name,
    logoText,
    contactEmail,
    hireMeLabel,
    resumeLabel,
    contactLabel,
    "resumeUrl": resumeFile.asset->url,
    navLinks[] | order(sortOrder asc) {
      title,
      href
    },
    socialLinks[] | order(sortOrder asc) {
      label,
      icon,
      href
    },
    footerCopyrightText,
    footerCreditText,
    sayHelloLabel,
    sayHelloHref,
    seo ${seoFields}
  },
  "homePage": *[_type == "homePage"][0]{
    headline,
    intro,
    profileImage ${imageFields},
    decorativeImage ${imageFields},
    seo ${seoFields}
  },
  "aboutPage": *[_type == "aboutPage"][0]{
    headline,
    eyebrow,
    paragraphs,
    profileImage ${imageFields},
    stats[] | order(sortOrder asc) {
      value,
      suffix,
      label
    },
    skillsHeading,
    skillsCenterLabel,
    testimonialsHeading,
    seo ${seoFields}
  },
  "credentialsPage": *[_type == "credentialsPage"][0]{
    headline,
    educationHeading,
    experienceHeading,
    focusHeading,
    focusRole,
    focusTitle,
    focusMeta,
    focusBody,
    focusPrimaryCtaLabel,
    focusPrimaryCtaHref,
    focusSecondaryCtaLabel,
    focusSecondaryCtaHref,
    education[] | order(sortOrder asc) {
      type,
      time,
      address,
      info
    },
    experience[] | order(sortOrder asc) {
      position,
      company,
      companyLink,
      time,
      address,
      work
    },
    seo ${seoFields}
  },
  "routePages": *[_type == "routePage"]{
    routeKey,
    headline,
    actionLabel,
    backLinkLabel,
    seo ${seoFields}
  },
  "projects": *[_type == "project"] | order(sortOrder asc) {
    title,
    categories,
    category,
    type,
    period,
    featured,
    summary,
    details,
    tags,
    image ${imageFields},
    link,
    github
  },
  "blogPosts": *[_type == "blogPost"] | order(sortOrder asc) {
    _id,
    title,
    "slug": slug.current,
    date,
    readTime,
    category,
    excerpt,
    image ${imageFields},
    sections[] | order(sortOrder asc) {
      heading,
      body,
      paragraphs,
      images[] ${imageFields}
    },
    "reactionCounts": {
      "thumbsUp": count(*[_type == "blogReaction" && post._ref == ^._id && reaction == "thumbsUp"]),
      "thumbsDown": count(*[_type == "blogReaction" && post._ref == ^._id && reaction == "thumbsDown"])
    },
    "comments": *[
      _type == "blogReaction" &&
      post._ref == ^._id &&
      status == "approved" &&
      defined(comment) &&
      comment != ""
    ] | order(createdAt desc) {
      _id,
      name,
      comment,
      reaction,
      createdAt
    },
    seo ${seoFields}
  },
  "publications": *[_type == "publication"] | order(sortOrder asc) {
    title,
    journal,
    date,
    summary,
    tags,
    link
  },
  "skills": *[_type == "skill"] | order(sortOrder asc) {
    name,
    category,
    x,
    y
  },
  "testimonials": *[_type == "testimonial"] | order(sortOrder asc) {
    name,
    role,
    quote,
    image ${imageFields}
  }
}`;

export const getPortfolioData = async () => {
  if (!hasSanityConfig || !sanityClient) {
    throw new Error("Missing VITE_SANITY_PROJECT_ID or VITE_SANITY_DATASET.");
  }

  try {
    return await sanityClient.fetch(portfolioQuery);
  } catch (error) {
    throw new Error(
      `Sanity content request failed. Check that your Sanity project allows this browser origin in API > CORS, then restart the dev server. Original error: ${error.message}`
    );
  }
};

export const getRoutePage = (routePages = [], routeKey) =>
  routePages.find((page) => page.routeKey === routeKey);
