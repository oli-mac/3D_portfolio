import AnimatedText from '@/components/AnimatedText'
import Layout from '@/components/Layout'
import Image from 'next/image'
import Head from 'next/head'
import React, { useRef } from 'react'
import ProfilePic from "../../public/images/profile/olyad.png"
import { useInView, useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Education from '@/components/Education'
import TransitionEffect from '@/components/TransitionEffect'


const AnimatedNumbers = ({value}) =>{
const ref = useRef(null)

const motionValue = useMotionValue(0);
const springValue = useSpring(motionValue, { duration: 3000 });
const isInView = useInView(ref, {once: true});

useEffect(() => {
  if(isInView){
    motionValue.set(value);
  }
}, [isInView, value, motionValue])

useEffect(() => {
    springValue.on("change", (latest) => {
        if(ref.current && latest.toFixed(0) <= value){
            ref.current.textContent = latest.toFixed(0);
        }
    })
  
}, [ springValue, value])


    return <span ref={ref}></span>
}


const About = () => {
  return (
    <>
        <Head>
            <title>Olyad Mulugeta| About Me</title>
            <meta name="description" content="About me" />
        </Head>
        <TransitionEffect />
        <main className='flex w-full flex-col items-center justify-center mb-16 dark:text-light'>
            <Layout className='pt-16 '>
                 <AnimatedText text='Passion Fuels Purpose! ' className='mb-16 lg:!text-7xl sm:!text-6xl xs:!text-4xl sm:mb-8'/>
                <div className='grid w-full grid-cols-8 gap-16 sm:gap-8'>
                    <div className='col-span-3 flex ml-4 flex-col items-start justify-start xl:col-span-4 md:order-2 md:col-span-8'>
                        <h2 className='mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light' > About Me</h2>
                        <p className='font-medium'>
                            {/* ===================================================== */}
                            Hi, I'm Olyad Mulugeta, a web developer, UI/UX designer and Software Engener with a passion for creating beautiful, functional, 
                            and user-centered digital experiences. With 4 years of experience in the field. I am always looking for 
                            new and innovative ways to bring my clients' visions to life.
                        </p>
                        <p className='my-4 font-medium'>
                            I believe that design is about more than just making things look pretty – it's about solving problems and 
                            creating intuitive, enjoyable experiences for users.        
                        </p>
                        <p className='font-medium'>
                            Whether I'm working on a website, mobile app, or 
                            other digital product, I bring my commitment to design excellence and user-centered thinking to 
                            every project I work on. I look forward to the opportunity to bring my skills and passion to your next project.
                        </p>
                    </div>
                    <div className=' col-span-3 relative h-max rounded-2xl border-2 border-solid border-dark bg-light p-8 dark:bg-dark dark:border-light
                    xl:col-span-4 md:order-1 md:col-span-8'>
                        <div className='absolute top-0 -right-3 -z-10 w-[102%] h-[103%] rounded-[2rem] bg-dark dark:bg-light'/>
                        <Image src={ProfilePic} alt="olyad Mulugeta" className="w-full h-auto rounded-2xl"
                        priority
                        sizes='(max-width:768px) 100vw,
                        (max-width:1200px) 50vw,33vw
                        '/>
                    </div>
                    <div className="col-span-2 flex flex-col items-end justify-between mr-16 xl:col-span-8 xl:flex-row xl:items-center md:order-3">
                       
                        <div className='flex flex-col items-end justify-center xl:items-center'>
                            <span className='inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl'><AnimatedNumbers value={10}/>+</span>
                            <h2 className='text-xl font-medium capitalize text-dark/75 dark:text-light/75 xl:text-center md:text-lg sm:text-base xs:text-sm'>Satisfied clients</h2>
                        </div>
                        <div className='flex flex-col items-end justify-center xl:items-center'>
                            <span className='inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl'><AnimatedNumbers value={15}/>+</span>
                            <h2 className='text-xl font-medium capitalize text-dark/75 dark:text-light/75 xl:text-center md:text-lg sm:text-base xs:text-sm'>Projects Completed</h2>
                        </div>
                        <div className='flex flex-col items-end justify-center xl:items-center'>
                            <span className='inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl'><AnimatedNumbers value={2}/>+</span>
                            <h2 className='text-xl font-medium capitalize text-dark/75 dark:text-light/75 xl:text-center md:text-lg sm:text-base xs:text-sm'>Yeard Of Experience</h2>
                        </div>
                    </div>
                </div>
                <Skills />
                {/* <Experience />
                <Education /> */}
            </Layout>
        </main>
    </>
  )
}

export default About