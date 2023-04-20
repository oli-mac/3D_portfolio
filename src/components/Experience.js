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
                    position="Intern"  
                    companyLink="http://www.aii.et/"
                    company="ethiopian artificial intelligence institute"
                    time="2022-Present"
                    address= "Addis Ababa, eT" 
                    work="As an intern at one of the country's leading research institutions on AI, I had the opportunity 
                    to work alongside brilliant minds in the field. I gained hands-on experience with cutting-edge technology
                     and contributed to projects with real-world applications. This experience opened doors to exciting 
                     career opportunities."
                
                />
                <Details 
                    position="Co Founder Ceo"  
                    companyLink="http://www.DaguEthioED.com"
                    company="DaguEthioED"
                    time="2023-present"
                    address= "Addis Ababa, eT" 
                    work="Our company envisions a future where the next generation is empowered 
                    with information to shape the world of technology. We aim to host informative events that spark curiosity 
                    and promote learning, featuring prominent speakers in the tech industry. Our slogan, Empowering the Next 
                    Generation with Information, reflects our commitment to providing valuable insights and knowledge that 
                    will enable young people to make informed decisions about their future in tech."
                
                />
                <Details 
                    position="Founder & Team Leader"  
                    companyLink="/"
                    company="BIT AI and Cybersecurity Club"
                    time="2022-present"
                    address= "Addis Ababa, eT" 
                    work="As the founder and team leader of the AI and Cybersecurity Club at Bahir Dar Institute of 
                    Technology, I gained valuable leadership and technical skills. By organizing events, workshops, 
                    and projects, I fostered a culture of innovation and learning among members. my passion for AI and cybersecurity and inspired me to pursue a career in the field."
                />
                <Details 
                    position="CTO"  
                    companyLink="/"
                    company="BroLine INC"
                    time="2020-2022"
                    address= "Addis Ababa, eT" 
                    work="Develop technical aspects of the Company's Strategy Lead New Projects From Conceptualization to deployment Create Overall Technology Standards and Practices"
                />
                <Details 
                    position="Software Engineer"  
                    companyLink="/"
                    company="Telet Tech"
                    time="2022-Present"
                    address= "Addis Ababa, eT" 
                    work="As a founder and CEO of a software start-up, Telet Tech  is a visionary leader who inspires 
                    innovation and fosters a collaborative culture. Telet Tech'S strategic decisions and leadership 
                    have propelled the company to success, creating jobs and driving growth in the tech industry."
                
                />
            </ul>
        </div>

        
    </div>
  )
}

export default Experience