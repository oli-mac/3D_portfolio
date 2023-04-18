import React, { useRef } from 'react'
import Layout from '@/components/Layout'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useMotionValue } from 'framer-motion'
import project1 from "../../public/images/projects/portfolio-cover-image.jpg"
import article1 from "../../public/images/articles/pagination component in reactjs.jpg"
import article2 from "../../public/images/articles/create loading screen in react js.jpg"
import { GithubIcon } from '@/components/Icon'
import { LinkArrow } from '@/components/Icon'

import Experience from '@/components/Experience'
import Education from '@/components/Education'


import AnimatedText from '@/components/AnimatedText'

const FramerImage = motion(Image);

const MovingImg = ({img, title,  link}) => {

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const imgRef = useRef(null);

    function handelMouse(event) {
        imgRef.current.style.display ="inline-block";
        x.set(event.pageX);
        y.set(-10);
        
    }
    function handelMouseLeave(event){
        imgRef.current.style.display ="none";
        x.set(0);
        y.set(0);
    }

    return(
        <Link  href={link} target='_blank'
        
        onMouseMove={handelMouse}
        onMouseLeave={handelMouseLeave}
        >
          <h2 className='capitalize text-xl font-semibold hover:underline'>{title}</h2>
            <FramerImage 
                style={{ x:x, y:y }}
                initial={{opacity:0}}
                whileInView={{opacity:1, transition:{duration:0.2}}}
            
            ref={imgRef} src={img} alt={title} className='z-10 w-96 h-auto hidden absolute rounded-lg'/>

        </Link>
    )
}

// const Articles = ({img, title, date,  link}) => {
//     return(
//         <motion.li 
//         initial={{y:200}}
//         whileInView={{y:0, transition:{duration:0.5, ease:"easeInOut"}}}
//         viewport={{once: true}}
//         className='relative w-full p-4 py-6 my-4 flex rounded-xl items-center justify-between bg-light text-dark
//         first:mt-0 border border-solid border-dark border-r-4 border-b-4'
//         >
//          <div className='absolute top-0 -right-3 -z-10 w-[101%] h-[103%] rounded-[2rem] bg-dark rounded-br-3xl
//          '/>
//         <MovingImg title={title} img={img} link={link} />
//         <Link  href={link} target='_blank'
//              className='w-full inline-block cursor-pointer overflow-hidden rounded-lg'
//         >
            
//         </Link>
       
//         <span className='text-primary font-semibold pl-4'>{date}</span>
//         </motion.li>
//     )
// }

const FeaturedProject = ({type, title, summary, img, link, github}) => {

    return(
      <article className='w-full flex items-center justify-between relative rounded-br-2xl
      rounded-3xl border border-solid border-dark bg-light shadow-2xl p-12 dark:bg-dark dark:border-light
      lg:flex-col lg:p-8 xs:rounded-2xl xs:rounded-br-3xl xs:p-4

      '>
          <div className='absolute top-0 -right-3 -z-10 w-[101%] h-[103%] rounded-[2.5rem] bg-dark rounded-br-3xl dark:bg-light
        xs:-right-2 xs:h-[102%] xs:w-full xs:rounded-l-[1.5rem]
        '/>
  
        <Link  href={link} target='_blank'
        className='w-1/2 cursor-pointer overflow-hidden rounded-lg lg:w-full'
        >
          <FramerImage src={img} alt={title} className='w-full h-auto'
             whileHover={{scale:1.05}}
             transition={{duration:0.2}}
             priority
              sizes='(max-width:768px) 100vw,
              (max-width:1200px) 50vw,50vw
              '
          />
        </Link>
  
        <div className='w-1/2 flex flex-col items-start justify-between pl-6 lg:w-full lg:pl-0 lg:pt-6'>
          <span className='text-primary font-medium text-xl dark:text-primaryDark xs:text-base'>{type}</span>
          <Link href={link} target='_blank' className='hover:underline underline-offset-2'>
            <h2 className='my-2 w-full text-left text-4xl font-bold dark:text-light sm:text-sm'>{title}</h2>
          </Link>
          <p className='my-2 font-medium text-dark dark:text-light'>{summary}</p>
          <div className='mt-2 flex items-center'>
          <Link href={link} target='_blank' className='ml-4 rounded-lg bg-dark text-light p-2 px-6 text-lg font-semibold 
          dark:bg-light dark:text-dark 
          sm:px-4 sm:text-base'>
            Visit Website
          </Link>
          </div>
        </div>
      </article>
    )
  }
  

// const FeaturedArticles = ({img, title, time, summary,  link}) => {
//     return(
//         <li className='relative col-span-1 w-full p-4 bg-light border border-solid border-dark rounded-2xl'>
//          <div className='absolute top-0 -right-3 -z-10 w-[101%] h-[103%] rounded-[2rem] bg-dark rounded-br-3xl'/>
//         <Link  href={link} target='_blank'
//              className='w-full inline-block cursor-pointer overflow-hidden rounded-lg'
//         >
//             <FramerImage src={img} alt={title} className='w-full h-auto'
//                 whileHover={{scale:1.05}}
//                 transition={{duration:0.2}}
//             />
//         </Link>
//         <Link  href={link} target='_blank'
//         >
//           <h2 className='my-2 mt-4 capitalize text-left text-2xl font-bold hover:underline'>{title}</h2>
//         </Link>
//         <p className='mb-2 text-sm'>{summary}</p>
//             <span className='text-primary font-semibold '>{time}</span>
//         </li>
//     )
// }



const articles = () => {
  return (
    <>
         <Head>
            <title>Olyad Mulugeta| Credentials</title>
            <meta name="description" content="About me" />
        </Head>
        <main className='w-full mb-16 flex flex-col items-center justify-center overflow-hidden dark:text-light'>
            <Layout className='pt-16 px-0'>
                <AnimatedText text="Hard Work Pays Off! " className='mb-16 lg:!text-7xl sm:mb-8 sm:!text-6xl xs:!text-4xl'/>
                <ul className='grid grid-cols-2 gap-16 lg:flex lg:flex-col'>
                    <Education />

                   
                    <Experience />

                </ul>
                <h2 className='font-bold text-4xl w-full text-center my-16 mt-32'>Current Fous</h2>
                <ul className='w-[95%] ml-10 lg:ml-0 gap-24 xl:gap-x-16 lg:gap-x-8 md:gap-y-24 sm:gap-x-0'>
                <FeaturedProject
                    title=" React Portfolio Website"
                    link="/"
                    summary="A professional portfolio website using React JS, Framer-motion, and Styled-components. It has smooth 
                        page transitions, cool background effects, unique design and it is mobile responsive."
                    type="Founder & Ceo"
                    github="/"
                    img={project1}
                />     
                </ul>
            </Layout>
        </main>
    </>
  )
}

export default articles