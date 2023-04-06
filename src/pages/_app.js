import '@/styles/globals.css'
import {Montserrat} from "next/font/google"

const montserrat = Montserrat({
  subsets:['latin'],
  variable: "--font-mont",
});

export default function App({ Component, pageProps }) {
  return (

    <>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
     <main className={`${montserrat.variable} font-mont bg-light w-full min-h-screen`}>
      <Component {...pageProps} />
    </main>
    </>
    
 
  )
}
