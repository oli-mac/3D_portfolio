import React, { useRef } from 'react'
import { useScroll } from 'framer-motion'
import { motion } from 'framer-motion'
import LiIcon from './LiIcon'

const Details = ({position, company, companyLink, time, address, work}) =>{
    const ref = useRef(null);
    return <li ref={ref} className='my-8 first:mt-0 last:mb-0 w-[85%] mx-auto flex flex-col items-center justify-between'>
        <LiIcon reference={ref}/>
        <motion.div
        initial={{y:50}}
        whileInView={{y:0}}
        transition={{duration:0.5, type:"spring"}}
        >
            <h3 className='capitalize font-bold text-xl xs:text-lg'>{position}&nbsp; <a className='text-primary dark:text-primaryDark capitalize' href={companyLink} target='_blank'>@{company}</a></h3>
            <span  className='capitalize font-medium text-dark/75 dark:text-light/75 xs:text-sm'>{time} | {address}</span>
            <p className='font-medium w-full md:text-sm'>
                {work}
            </p>
        </motion.div>
    </li>
}

const Experience = () => {

    const ref = useRef(null);
    const {scrollYProgress} = useScroll(
        {
            target: ref,
            offset: ["start end", "center start"]
        }
    );

  return (
    <div className='my-8'>
        <h2 className='font-bold text-4xl mb-8 w-full text-center dark:text-light md:text-6xl xs:text-4xl md:mb-16'>Experience</h2>
        
        <div ref={ref} className='w-full relative'>
            <motion.div style={{scaleY: scrollYProgress}} className='absolute left-9 top-0 w-[4px] h-full bg-dark origin-top dark:bg-light
            md:w-[2px] md:left-[30px] xs:left-[20px] 
            '/>

            <ul className='w-full flex flex-col items-start justify-between ml-8 xs:ml-2'>
                <Details 
                    position="Software Engineer"  
                    companyLink="www.olyadmulugeta.live"
                    company="Telet Tech"
                    time="2022-Present"
                    address= "Addis Ababa, eT" 
                    work="Worked on a team responsible for developing new features for Google's 
                    search engine, including improving the accuracy and relevance of search results and 
                    developing new tools for data analysis and visualization."
                
                />
                <Details 
                    position="Co Founder Ceo"  
                    companyLink="www.olyadmulugeta.live"
                    company="DaguEthioED"
                    time="2022-Present"
                    address= "Addis Ababa, eT" 
                    work="Worked on a team responsible for developing new features for Google's 
                    search engine, including improving the accuracy and relevance of search results and 
                    developing new tools for data analysis and visualization."
                
                />
                <Details 
                    position="Software Engineer"  
                    companyLink="www.olyadmulugeta.live"
                    company="Telet Tech"
                    time="2022-Present"
                    address= "Addis Ababa, eT" 
                    work="Worked on a team responsible for developing new features for Google's 
                    search engine, including improving the accuracy and relevance of search results and 
                    developing new tools for data analysis and visualization."
                
                />
                <Details 
                    position="Software Engineer"  
                    companyLink="www.olyadmulugeta.live"
                    company="Telet Tech"
                    time="2022-Present"
                    address= "Addis Ababa, eT" 
                    work="Worked on a team responsible for developing new features for Google's 
                    search engine, including improving the accuracy and relevance of search results and 
                    developing new tools for data analysis and visualization."
                
                />
                <Details 
                    position="Software Engineer"  
                    companyLink="www.olyadmulugeta.live"
                    company="Telet Tech"
                    time="2022-Present"
                    address= "Addis Ababa, eT" 
                    work="Worked on a team responsible for developing new features for Google's 
                    search engine, including improving the accuracy and relevance of search results and 
                    developing new tools for data analysis and visualization."
                
                />
            </ul>
        </div>

        
    </div>
  )
}

export default Experience