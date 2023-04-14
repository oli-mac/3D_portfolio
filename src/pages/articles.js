import React from 'react'
import Layout from '@/components/Layout'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import project1 from "../../public/images/projects/portfolio-cover-image.jpg"


import AnimatedText from '@/components/AnimatedText'

const FeaturedArticles = ({img, title, time, summary,  link}) => {
    return(
        <li>
        <Link  href={link} target='_blank'
             className='w-full cursor-pointer overflow-hidden rounded-lg'
        >
            <Image src={img} alt={title} className='w-full h-auto'/>
        </Link>
        <Link  href={link} target='_blank'
             className='w-full cursor-pointer overflow-hidden rounded-lg'
        >
          <h2 className='my-2 capitalize text-left text-2xl font-bold'>{title}</h2>
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
                <ul className='grid grid-col-2 gap-16'>
                    <FeaturedArticles 
                    title="Build A Custom Pagination Component In Reactjs From Scratch"
                    summary="Learn how to build a custom pagination component in ReactJS from scratch. 
                    Follow this step-by-step guide to integrate Pagination component in your ReactJS project.
                    9 min read"
                    time="9 min"
                    link="/"
                    img={project1}
                    />
                    <li>Featured Articles-2</li>
                </ul>
            </Layout>
        </main>
    </>
  )
}

export default articles