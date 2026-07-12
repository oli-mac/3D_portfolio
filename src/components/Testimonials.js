import React from "react";
import { motion } from "framer-motion";
import SanityImage from "./SanityImage";

const Avatar = ({ image, name, dark = false }) => (
  <div className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full ${dark ? "bg-light/10" : "bg-[#F4E2D3]"}`}>
    {image ? (
      <SanityImage
        image={image}
        alt={name}
        width={120}
        className="h-full w-full rounded-full object-cover"
        motionImage
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 0.2 }}
      />
    ) : (
      <span className={`text-sm font-bold ${dark ? "text-light" : "text-dark"}`}>{name?.charAt(0) || "T"}</span>
    )}
  </div>
);

const QuoteMark = () => <span className="block text-4xl font-bold leading-none text-[#F05258]">&rdquo;</span>;

const Author = ({ testimonial, dark = false }) => (
  <div className="flex items-center gap-4">
    <Avatar image={testimonial?.image} name={testimonial?.name} dark={dark} />
    <div className="min-w-0">
      <h3 className={`truncate text-base font-bold leading-tight ${dark ? "text-light" : "text-dark"}`}>
        {testimonial?.name}
      </h3>
      <p className={`mt-1 text-sm font-medium leading-tight ${dark ? "text-light/65" : "text-dark/55"}`}>
        {testimonial?.role}
      </p>
    </div>
  </div>
);

const LogoBadge = ({ label, dark = false }) => (
  <div
    className={`flex h-9 w-9 items-center justify-center rounded-full text-lg font-black ${
      dark ? "bg-light/10 text-light/70" : "bg-dark/5 text-[#687085]"
    }`}
    aria-label={label}
  >
    {label}
  </div>
);

const TestimonialCard = ({ testimonial, className = "", metric, metricLabel, dark = false, compact = false }) => (
  <motion.article
    className={`flex min-h-full flex-col rounded-[1.75rem] p-9 shadow-[0_24px_50px_rgba(27,27,27,0.09)] ${
      dark ? "bg-dark text-light" : "bg-white text-dark"
    } ${compact ? "gap-5 p-8" : "gap-6"} ${className}`}
    whileHover={{ y: -6 }}
    transition={{ duration: 0.25 }}
  >
    {metric ? (
      <div className={compact ? "" : "mb-1"}>
        <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
          <span className={`text-6xl font-bold leading-none ${dark ? "text-light" : "text-dark"} ${compact ? "text-4xl" : ""}`}>
            {metric}
          </span>
          {metricLabel ? (
            <span className={`pb-2 text-xl font-bold leading-tight ${dark ? "text-light/80" : "text-[#2F3542]"} ${compact ? "text-base" : ""}`}>
              {metricLabel}
            </span>
          ) : null}
        </div>
      </div>
    ) : (
      <QuoteMark />
    )}

    {metric ? <QuoteMark /> : null}

    <p className={`max-w-[58ch] text-lg font-medium leading-relaxed ${dark ? "text-light/90" : "text-[#4B5565]"} ${compact ? "text-base" : ""}`}>
      &ldquo;{testimonial?.quote}&rdquo;
    </p>

    <div className="mt-auto flex items-end justify-between gap-5 pt-4">
      <Author testimonial={testimonial} dark={dark} />
      {!compact ? <LogoBadge label={dark ? "G" : "S"} dark={dark} /> : null}
    </div>
  </motion.article>
);

const RatingStrip = () => (
  <div className="mt-16 grid grid-cols-[1fr_auto_1fr] items-center gap-6 text-dark/75 lg:grid-cols-1 lg:justify-items-center lg:text-center">
    <p className="text-base font-medium">1500 satisfied clients love our services</p>
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_16px_35px_rgba(27,27,27,0.08)]">
        <span className="text-xl">&rdquo;</span>
      </div>
      <div className="text-left">
        <div className="text-lg leading-none text-dark">
          <span className="font-black tracking-normal">5 stars</span>
          <span className="ml-2 text-base font-medium text-dark/70">4.9</span>
        </div>
        <p className="mt-2 text-sm font-medium text-dark/55">Based on 1.5k reviews</p>
      </div>
    </div>
    <div className="flex justify-end">
      <span className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-base font-bold text-dark shadow-[0_16px_35px_rgba(27,27,27,0.07)]">
        View all reviews
        <span aria-hidden="true" className="text-xl leading-none">&#8599;</span>
      </span>
    </div>
  </div>
);

const Testimonials = ({ heading, testimonials = [] }) => {
  if (!testimonials.length) return null;

  const cards = [0, 1, 2, 3].map((index) => testimonials[index] || testimonials[index % testimonials.length]);

  return (
    <section className="mt-28 w-full rounded-[2.25rem] bg-[#F4F6F8] px-20 py-28 text-dark shadow-[0_30px_90px_rgba(27,27,27,0.08)] dark:bg-light/[0.04] dark:text-light xl:px-14 lg:px-8 md:mt-20 md:rounded-[1.5rem] md:py-20 sm:px-5">
      <div className="w-full">
        <div className="text-center">
          <div className="mx-auto mb-7 inline-flex items-center gap-2 text-sm font-bold text-dark dark:text-light">
            <span className="h-4 w-4 rounded-tl-md border-l-2 border-t-2 border-[#F05258]" />
            <span>{heading || "Testimonials"}</span>
            <span className="h-4 w-4 rounded-tr-md border-r-2 border-t-2 border-[#F05258]" />
          </div>
          <h2 className="text-5xl font-bold leading-tight tracking-normal text-dark dark:text-light md:text-4xl sm:text-3xl">
            Results that speaks volume
            <span className="block text-[#788195] dark:text-light/55">Read success stories</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg font-medium text-dark/60 dark:text-light/55">
            Find out how happy clients are raving about the work.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-6 lg:grid-cols-1 md:mt-14">
          <TestimonialCard
            testimonial={cards[0]}
            metric="8X"
            metricLabel="Increase in conversion rate"
            className="min-h-[520px] lg:min-h-[420px] sm:min-h-0"
          />

          <div className="grid gap-6">
            <TestimonialCard testimonial={cards[1]} metric="2X" metricLabel="Increase in lead generation" className="min-h-[260px]" />
            <div className="grid grid-cols-2 gap-6 md:grid-cols-1">
              <TestimonialCard testimonial={cards[2]} compact className="min-h-[260px]" />
              <TestimonialCard testimonial={cards[3]} compact dark className="min-h-[260px]" />
            </div>
          </div>
        </div>

        <RatingStrip />
      </div>
    </section>
  );
};

export default Testimonials;
