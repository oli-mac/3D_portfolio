import React, { useRef } from 'react'
import { useScroll } from 'framer-motion'
import { motion } from 'framer-motion'
import LiIcon from './LiIcon'

const Details = ({type, time, address, info}) =>{
    const ref = useRef(null);
    return <li ref={ref} className='my-8 first:mt-0 last:mb-0 w-[90%] mx-auto flex flex-col items-center justify-between'>
        <LiIcon reference={ref}/>
        <motion.div
        initial={{y:50}}
        whileInView={{y:0}}
        transition={{duration:0.5, type:"spring"}}
        >
            <h3 className='capitalize font-bold text-2xl sm:text-xl xs:text-lg'>{type}</h3>
            <span  className='capitalize font-medium text-dark/75 dark:text-light xs:text-sm'>{time} | <span className='text-primary dark:text-primaryDark'>{address}</span></span>
            <p className='font-medium w-full md:text-sm'>
                {info}
            </p>
        </motion.div>
    </li>
}

const Education = () => {

    const ref = useRef(null);
    const {scrollYProgress} = useScroll(
        {
            target: ref,
            offset: ["start end", "center start"]
        }
    );

  return (
    <div className='my-8'>
        <h2 className='font-bold text-4xl mb-8 w-full text-center dark:text-light md:text-6xl xs:text-4xl md:mb-16'>Education</h2>
        
        <div ref={ref} className='w-[100%] mx-auto relative'>
            <motion.div style={{scaleY: scrollYProgress}} className='absolute left-9 top-0 w-[4px] h-full bg-dark origin-top dark:bg-light
             md:w-[2px] md:left-[30px] xs:left-[20px]'/>

            <ul className='w-full flex flex-col items-start justify-between ml-10 xs:ml-2'>
                <Details 
                    type="Bachelor Of Science In SoftWare Engineering"  
                    time="2016-2020 "
                    address= "Bahirdar Institute Of Technology (MIT)" 
                    info="Relevant courses included Data Structures and Algorithms, Computer Systems Engineering, and Artificial 
                    Intelligence."
                
                />
               <Details 
                    type="Bachelor Of Science In SoftWare Engineering"  
                    time="2016-2020 "
                    address= "Bahirdar Institute Of Technology (MIT)" 
                    info="Relevant courses included Data Structures and Algorithms, Computer Systems Engineering, and Artificial 
                    Intelligence."
                
                />
                <Details 
                    type="Bachelor Of Science In SoftWare Engineering"  
                    time="2016-2020 "
                    address= "Bahirdar Institute Of Technology (MIT)" 
                    info="Relevant courses included Data Structures and Algorithms, Computer Systems Engineering, and Artificial 
                    Intelligence."
                
                />
            </ul>
        </div>

        
    </div>
  )
}

export default Education