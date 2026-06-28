import React from 'react'
import Layout from './Layout'

const Footer = ({ settings }) => {
  return (
    <footer className='
        mt-auto w-full border-t-2 border-solid border-dark font-medium text-lg dark:text-light dark:border-light sm:text-base
    '>
        <Layout className='py-8 px-12 flex items-center justify-between lg:flex-col lg:py-6'>
            <span>{settings.footerCopyrightText}</span>

            <div className='flex items-center lg:py-2'>
                {settings.footerCreditText}<span className='text-primary dark:text-primaryDark text-2xl px-1'> &#9825;</span> by &nbsp;
                <a href={settings.sayHelloHref} className='underline underline-offset-2'>
                    {settings.name}</a>
            </div>
            <a href={settings.sayHelloHref} className='underline underline-offset-2'>{settings.sayHelloLabel}</a>
        </Layout>
    </footer>

  )
}

export default Footer
