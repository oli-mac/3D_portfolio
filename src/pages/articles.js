import React from 'react'
import Layout from '@/components/Layout'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import project1 from "../../public/images/projects/portfolio-cover-image.jpg"
import article1 from "../../public/images/articles/pagination component in reactjs.jpg"


import AnimatedText from '@/components/AnimatedText'

const FramerImage = motion(Image);

const FeaturedArticles = ({img, title, time, summary,  link}) => {
    return(
        <li className='relative col-span-1 w-full p-4 bg-light border border-solid border-dark rounded-2xl'>
         <div className='absolute top-0 -right-3 -z-10 w-[101%] h-[103%] rounded-[2rem] bg-dark rounded-br-3xl'/>
        <Link  href={link} target='_blank'
             className='w-full inline-block cursor-pointer overflow-hidden rounded-lg'
        >
            <FramerImage src={img} alt={title} className='w-full h-auto'
                whileHover={{scale:1.05}}
                transition={{duration:0.2}}
            />
        </Link>
        <Link  href={link} target='_blank'
             className='w-full cursor-pointer overflow-hidden rounded-lg'
        >
          <h2 className='my-2 capitalize text-left text-2xl font-bold hover:underline'>{title}</h2>
        </Link>
        <p className='mb-2 text-sm'>{summary}</p>
            <span className='text-primary font-semibold '>{time}</span>
        </li>
    )
}

const articles = () => {
  return (
    <>
         <Head>
            <title>Olyad Mulugeta| Articles</title>
            <meta name="description" content="About me" />
        </Head>
        <main className='w-full mb-16 flex flex-col items-center justify-center overflow-hidden'>
            <Layout className='pt-16 px-12'>
                <AnimatedText text="Words Can Change The World! " className='mb-16'/>
                <ul className='grid grid-cols-2 gap-16'>
                    <FeaturedArticles 
                    title="Build A Custom Pagination Component In Reactjs From Scratch"
                    summary="Learn how to build a custom pagination component in ReactJS from scratch. 
                    Follow this step-by-step guide to integrate Pagination component in your ReactJS project.
                    9 min read"
                    time="9 min"
                    link="/"
                    img={project1}
                    />
                    <FeaturedArticles 
                    title="Build A Custom Pagination Component In Reactjs From Scratch"
                    summary="Learn how to build a custom pagination component in ReactJS from scratch. 
                    Follow this step-by-step guide to integrate Pagination component in your ReactJS project.
                    9 min read"
                    time="9 min"
                    link="/"
                    img={article1}
                    />
                </ul>
            </Layout>
        </main>
    </>
  )
}

export default articles