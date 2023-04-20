import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import project1 from "../../public/images/projects/portfolio-cover-image.jpg"
import project2 from "../../public/images/projects/agency-website-cover-image.jpg"
import { GithubIcon } from '@/components/Icon'
import Image from 'next/image'

const FramerImage = motion(Image);


const Project = ({type, title, img, summary}) => {
  return(
    <article className='w-full flex flex-col items-center justify-center
    rounded-2xl border border-solid border-dark bg-light shadow-2xl p-6 relative dark:bg-dark dark:border-light xs:p-4
    '>
        <div className='absolute top-0 -right-3 -z-10 w-[101%] h-[103%] rounded-[2rem] bg-dark rounded-br-3xl dark:bg-light 
        md:-right-2 md:w-[102%] xs:h-[102%] xs:rounded-[1.5rem]'/>
      <div  
      className='w-full cursor-pointer overflow-hidden rounded-lg'
      >
        <FramerImage src={img} alt={title} className='w-[60px] h-[60px] rounded-full'
           whileHover={{scale:1.05}}
           transition={{duration:0.2}}
        />
      </div>

      <div className='w-full flex flex-col items-start justify-between mt-4'>
        <span className='text-primary dark:text-primaryDark font-medium text-l lg:text-xs md:text-base'>{type}</span>
        <h2 className='my-0.5 w-full text-left text-l font-bold lg:text-sm'>{title}</h2>
        <p className='my-2 font-small text-dark dark:text-light sm:text-xs'>{summary}</p>

        
       
      </div>
    </article>
  )
}

const Testimonials = () => {
    return (
        <>
          
          <h2 className='font-bold text-8xl mt-24 mb-24 w-full text-center md:text-4xl md:mt-32 sm:text-3xl'>Testimonials</h2>
              <div className='flex flex-row lg:flex-col gap-8 xl:gap-x-16 lg:gap-y-4 md:gap-y-16 sm:gap-x-0'>
                <div className='col-span-6 sm:col-span-12'>
                    
                    <Project
                        title="Robotics Researcher at Ritsumeikan University"
                        summary="Remarkable Developer with exceptional dedication & adeptness in grasping intricate concepts effortlessly - a true asset to any team!"
                        type="Mulugeta solomon"
                        img={project1}
                      />
                </div>
                <div className='col-span-6 sm:col-span-12'>
                <Project
                        title=" React Portfolio Website"
                        summary="A professional portfolio website using React JS, Framer-motion, and Styled-components. It has smooth 
                        "
                        link="/"
                        type="Featured Project"
                        github="/"
                        img={project1}
                      />
                </div>
                <div className='col-span-6 sm:col-span-12'>
                <Project
                    title=" React Portfolio Website"
                    summary="A professional portfolio website using React JS, Framer-motion, and Styled-components. It has smooth 
                   "
                    link="/"
                    type="Featured Project"
                    github="/"
                    img={project2}
                    />
                </div>
                <div className='col-span-6 sm:col-span-12'>
                <Project
                        title="Mulugeta solomon"
                        summary="A professional portfolio website using React JS, Framer-motion, and Styled-components. It has smooth 
                       "
                        link="/"
                        type="Mulugeta solomon"
                        github="/"
                        img={project2}
                    />
                </div>

              </div>
        </>
      )
}

export default Testimonials