import React from 'react'

import Link from 'next/link'
import Logo from './Logo'
import { useRouter } from 'next/router'
import  { TwitterIcon, DribbbleIcon, GithubIcon, LinkedInIcon, PinterestIcon } from './Icon'
import { motion } from 'framer-motion'

const CustomLink = ({href, title, className=""}) => {
    const router = useRouter();
    console.log(router)
    return(
        <Link href={href} className={`${className} relative group`}>
            {title}

            <span className={`
                h-[1px] 
                inline-block 
                w-0
                bg-dark 
                absolute 
                left-0 
                bottom-0.5
                group-hover:w-full transition-[width] ease duration-300
                ${router.asPath === href ? 'w-full' : 'w-0' }
            `}> &nbsp;</span>
        </Link>
    )
}

const NavBar = () => {
  return (
    <div
    className='w-full px-32 py-8 font-medium flex items-center justify-between'
    >
        <nav>
            <CustomLink href="/" title="Home " className='mr-4'/> 
            <CustomLink href="/About" title="About " className='mx-4'/> 
            <CustomLink href="/projects" title="Projects " className='mx-4'/> 
            <CustomLink href="/articles" title="Articles " className='ml-4'/> 
        </nav>
        {/* <Logo /> */}
        <nav className='flex items-center justify-center flex-wrap'>
            <motion.a 
                href="/" 
                target={'_blank'} 
                whileHover={{y: -2}}
                whileTap={{scale: 0.9}}
                className='w-6 mr-3'> 
                <TwitterIcon /> 
            </motion.a>
            <motion.a 
                href="https://github.com/oli-mac" 
                target={'_blank'}
                whileHover={{y: -2}}
                whileTap={{scale: 0.9}}
                className='w-6 mx-3'>
                    <GithubIcon /> 
            </motion.a>
            <motion.a 
                whileHover={{y: -2}}
                whileTap={{scale: 0.9}}
                className='w-6 mx-3'
                href="https://www.linkedin.com/in/olyad-mulugeta-79875621b/" 
                target={'_blank'}> 
                <LinkedInIcon /> 
            </motion.a>
            <motion.a 
                whileHover={{y: -2}}
                whileTap={{scale: 0.9}}
                className='w-6 mx-3'
                href="https://www.linkedin.com/in/olyad-mulugeta-79875621b/" 
                target={'_blank'}> 
                <PinterestIcon />
             </motion.a>
            <motion.a 
                whileHover={{y: -2}}
                whileTap={{scale: 0.9}}
                className='w-6 ml-3'
                href="https://www.linkedin.com/in/olyad-mulugeta-79875621b/" 
                target={'_blank'}> 
                <DribbbleIcon /> 
            </motion.a>
            {/* <Link href="/" target={'_blank'}>T</Link> */}
        </nav>
        
        <div className='absolute left-[50%] top-2 translate-x-[-50%]'>
            <Logo />
        </div>

    </div>
  )
}

export default NavBar