import Layout from "@/components/Layout";
import AnimatedText from "@/components/AnimatedText";
import { LinkArrow } from "@/components/Icon";
import HireMe from "@/components/HireMe";
import TransitionEffect from "@/components/TransitionEffect";
import SEO from "@/components/SEO";
import SanityImage from "@/components/SanityImage";

export default function Home({ page, siteSettings }) {
  return (
    <>
      <SEO
        title={page.seo?.title || siteSettings.seo?.title}
        description={page.seo?.description || siteSettings.seo?.description}
      />
      <TransitionEffect />
      <main className="flex items-center text-dark w-full min-h-screen dark:text-light">
        <Layout className="pt-0 md:pt-16 sm:pt-8">
          <div className="flex items-center justify-between w-full lg:flex-col">
            <div className="w-1/2 md:w-full">
              <SanityImage
                image={page.profileImage}
                width={900}
                className="w-full h-auto lg:hidden md:inline-block md:w-full"
              />
            </div>
            <div className="w-1/2 flex flex-col items-center self-center lg:w-full lg:text-center">
              <AnimatedText
                text={page.headline}
                className="!text-6xl !text-left xl:!text-5xl lg:!text-center lg:!text-6xl md:!text-5xl sm:!text-3xl"
              />
              <p className="my-4 text-base font-medium md:text-sm sm:text:xs">{page.intro}</p>
              <div className="flex items-center self-start mt-2 lg:self-center">
                {siteSettings.resumeUrl ? (
                  <a
                    className="flex items-center bg-dark text-light p-2.5 px-6 rounded-lg text-lg font-semibold hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-dark hover:dark:border-light dark:bg-light dark:text-dark hover:dark:bg-dark hover:dark:text-light md:p-2 md:px-4 md:text-base"
                    href={siteSettings.resumeUrl}
                    target="_blank"
                    download
                  >
                    {siteSettings.resumeLabel}
                    <LinkArrow className="w-6 ml-1" />
                  </a>
                ) : null}
                <a
                  className="ml-4 text-lg font-medium capitalize text-dark underline dark:text-light md:text-base"
                  href={`mailto:${siteSettings.contactEmail}`}
                  target="_blank"
                >
                  {siteSettings.contactLabel}
                </a>
              </div>
            </div>
          </div>
        </Layout>
        <HireMe email={siteSettings.contactEmail} label={siteSettings.hireMeLabel} />
        <div className="absolute right-8 bottom-8 inline-block w-24">
          <SanityImage image={page.decorativeImage} width={160} className="w-full h-auto" />
        </div>
      </main>
    </>
  );
}
