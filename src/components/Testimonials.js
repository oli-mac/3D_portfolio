import React from "react";
import { motion } from "framer-motion";
import SanityImage from "./SanityImage";

const FramerImage = ({ image, alt }) => (
  <SanityImage
    image={image}
    alt={alt}
    width={120}
    className="w-[60px] h-[60px] rounded-full object-cover"
    motionImage
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.2 }}
  />
);

const Project = ({ name, role, image, quote }) => {
  return (
    <article className="w-full flex flex-col items-center justify-center rounded-2xl border border-solid border-dark bg-light shadow-2xl p-6 relative dark:bg-dark dark:border-light xs:p-4">
      <div className="absolute top-0 -right-3 -z-10 w-[101%] h-[103%] rounded-[2rem] bg-dark rounded-br-3xl dark:bg-light md:-right-2 md:w-[102%] xs:h-[102%] xs:rounded-[1.5rem]" />
      <div className="w-full cursor-pointer overflow-hidden rounded-lg">
        <FramerImage image={image} alt={name} />
      </div>

      <div className="w-full flex flex-col items-start justify-between mt-4">
        <span className="text-primary dark:text-primaryDark font-medium text-l lg:text-xs md:text-base">{name}</span>
        <h2 className="my-0.5 w-full text-left text-l font-bold lg:text-sm">{role}</h2>
        <p className="my-2 font-small text-dark dark:text-light sm:text-xs">{quote}</p>
      </div>
    </article>
  );
};

const Testimonials = ({ heading, testimonials = [] }) => {
  return (
    <>
      <h2 className="font-bold text-8xl mt-24 mb-24 w-full text-center md:text-4xl md:mt-32 sm:text-3xl">
        {heading}
      </h2>
      <div className="flex flex-row lg:flex-col gap-8 xl:gap-x-16 lg:gap-y-4 md:gap-y-16 sm:gap-x-0">
        {testimonials.map((testimonial) => (
          <div className="col-span-6 sm:col-span-12" key={testimonial.name}>
            <Project {...testimonial} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Testimonials;
