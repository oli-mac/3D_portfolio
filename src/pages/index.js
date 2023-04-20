import Layout from '@/components/Layout'
import Head from 'next/head'
import Image from 'next/image'
import profilePic from "../../public/images/profile/olyad-prev.png"
import AnimatedText from '@/components/AnimatedText'
import Link from 'next/link'
import { LinkArrow } from '@/components/Icon'
import HireMe from '@/components/HireMe'
import lightBulb from "../../public/images/svgs/miscellaneous_icons_1.svg"
import TransitionEffect from '@/components/TransitionEffect'

export default function Home() {
  return (
    <>
      <Head>
        <title>Olyad Mulugeta</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <TransitionEffect/>
      <main className='flex items-center text-dark w-full min-h-screen dark:text-light'>
        <Layout className='pt-0 md:pt-16 sm:pt-8'>
          <div className='flex items-center justify-between w-full lg:flex-col'>
            <div className='w-1/2 md:w-full'>
              <Image src={profilePic} alt="Olyad Mulugeta" className='w-full h-auto lg:hidden md:inline-block md:w-full'
              priority
              sizes='(max-width:768px) 100vw,
              (max-width:1200px) 50vw,33vw
              '/>
            </div>
            <div className='w-1/2 flex flex-col items-center self-center lg:w-full lg:text-center'>
              <AnimatedText text="Turning Vision Into Reality with Technology." className='!text-6xl !text-left
              xl:!text-5xl lg:!text-center lg:!text-6xl md:!text-5xl sm:!text-3xl
              '/>
              <p className='my-4 text-base font-medium md:text-sm sm:text:xs'>
                  As a skilled full-stack developer and Flutter Mobile Application Development, I am dedicated to turning ideas into innovative applications. 
                  Explore my latest projects and Cridentials, showcasing my expertise in Full Stalk web development and Flutter Mobile Application Development.
              </p>
              <div className=' flex items-center self-start mt-2 lg:self-center'>
                <Link className='flex items-center bg-dark text-light p-2.5 px-6 
                rounded-lg text-lg font-semibold hover:bg-light hover:text-dark 
                border-2 border-solid border-transparent hover:border-dark 
                hover:dark:border-light dark:bg-light dark:text-dark hover:dark:bg-dark hover:dark:text-light
                md:p-2 md:px-4 md:text-base' href="/Resume.pdf" target='_blank' download={true}>
                  Resume<LinkArrow className="w-6 ml-1"/>
                  </Link>
                <Link className='ml-4 text-lg font-medium capitalize text-dark underline dark:text-light md:text-base' href="mailto:contactolyad@gmail.com" target='_blank'>Contact</Link>
              </div>
            </div>
          </div>

        </Layout>
        <HireMe />
        <div className='absolute right-8 bottom-8 inline-block w-24 '>
          <Image src={lightBulb} alt='Olad Mulugeta'className='w-full h-auto'/>
        </div>
      </main>
    </>
  )
}
