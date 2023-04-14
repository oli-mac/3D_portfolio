import React from 'react'
import Head from 'next/head'
import Layout from '@/components/Layout'
import AnimatedText from '@/components/AnimatedText'


const projects = () => {
  return (
    <>
      <Head>
          <title>Olyad Mulugeta| projects Page</title>
          <meta name="description" content="About me" />
      </Head>
      <main>
        <Layout>
          <AnimatedText text="Imagination Trumps Knowledge!"/>
        </Layout>
      </main>
    </>
  )
}

export default projects