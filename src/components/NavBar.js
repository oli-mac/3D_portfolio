import React, { useState } from "react";
import Logo from "./Logo";
import {
  DribbbleIcon,
  GithubIcon,
  LinkedInIcon,
  MoonIcon,
  PinterestIcon,
  SunIcon,
  TwitterIcon,
} from "./Icon";
import { motion } from "framer-motion";
import useThemeSwitcher from "./hooks/useThemeSwitcher";

const socialIconMap = {
  twitter: TwitterIcon,
  github: GithubIcon,
  linkedin: LinkedInIcon,
  pinterest: PinterestIcon,
  dribbble: DribbbleIcon,
};

const CustomLink = ({ href, title, currentPath, className = "" }) => {
  return (
    <a href={href} className={`${className} relative group`}>
      {title}
      <span
        className={`
          h-[1px] inline-block bg-dark absolute left-0 bottom-0.5
          group-hover:w-full transition-[width] ease duration-300
          ${currentPath === href ? "w-full" : "w-0"}
          dark:bg-light
        `}
      >
        &nbsp;
      </span>
    </a>
  );
};

const CustomMobileLink = ({ href, title, currentPath, className = "", toggle, onNavigate }) => {
  const handleClick = () => {
    toggle();
    window.history.pushState({}, "", href);
    onNavigate(href);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <button className={`${className} relative group text-light dark:text-dark my-2`} onClick={handleClick}>
      {title}
      <span
        className={`
          h-[1px] inline-block bg-light absolute left-0 bottom-0.5
          group-hover:w-full transition-[width] ease duration-300
          ${currentPath === href ? "w-full" : "w-0"}
          dark:bg-dark
        `}
      >
        &nbsp;
      </span>
    </button>
  );
};

const SocialLinks = ({ links = [], mobile = false }) => (
  <>
    {links.map((link) => {
      const Icon = socialIconMap[link.icon];
      if (!Icon) return null;

      return (
        <motion.a
          key={`${link.icon}-${link.href}`}
          href={link.href}
          target="_blank"
          aria-label={link.label}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
          className={`w-6 ${mobile ? "mx-3 sm:mx-1" : "mx-3"}`}
        >
          <Icon />
        </motion.a>
      );
    })}
  </>
);

const ThemeButton = ({ mode, setMode }) => (
  <button
    onClick={() => setMode(mode === "light" ? "dark" : "light")}
    className={`ml-3 flex items-center justify-center rounded-full p-1 ${
      mode === "light" ? "bg-dark text-light" : "bg-light text-dark"
    }`}
  >
    {mode === "dark" ? <SunIcon className={"fill-dark"} /> : <MoonIcon className={"fill-dark"} />}
  </button>
);

const NavBar = ({ currentPath = "/", onNavigate = () => {}, settings }) => {
  const [mode, setMode] = useThemeSwitcher();
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = settings?.navLinks || [];
  const socialLinks = settings?.socialLinks || [];

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full px-32 py-8 font-medium flex items-center justify-between dark:text-light relative z-10 lg:px-16 md:px-12 sm:px-8">
      <button className="flex-col justify-center items-center hidden lg:flex" onClick={handleClick}>
        <span
          className={`bg-dark dark:bg-light transition-all duration-300 ease-out block h-0.5 w-6 rounded-sm ${
            isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
          }`}
        />
        <span
          className={`bg-dark dark:bg-light transition-all duration-300 ease-out block h-0.5 w-6 rounded-sm my-0.5 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`bg-dark dark:bg-light transition-all duration-300 ease-out block h-0.5 w-6 rounded-sm ${
            isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
          }`}
        />
      </button>

      <div className="w-full flex justify-between items-center lg:hidden">
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {navLinks.map((link) => (
            <CustomLink key={link.href} href={link.href} title={link.title} currentPath={currentPath} />
          ))}
        </nav>
        <nav className="flex items-center justify-center flex-wrap">
          <SocialLinks links={socialLinks} />
          <ThemeButton mode={mode} setMode={setMode} />
        </nav>
      </div>

      {isOpen ? (
        <motion.div
          initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
          animate={{ scale: 1, opacity: 1 }}
          className="min-w-[70vw] flex flex-col justify-between z-30 items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark/90 dark:bg-light/75 rounded-lg backdrop-blur-md py-32"
        >
          <nav className="flex items-center flex-col justify-center">
            {navLinks.map((link) => (
              <CustomMobileLink
                key={link.href}
                href={link.href}
                title={link.title}
                currentPath={currentPath}
                toggle={handleClick}
                onNavigate={onNavigate}
              />
            ))}
          </nav>
          <nav className="flex items-center justify-center flex-wrap mt-2">
            <SocialLinks links={socialLinks} mobile />
            <ThemeButton mode={mode} setMode={setMode} />
          </nav>
        </motion.div>
      ) : null}

      <div className="absolute left-[50%] top-2 translate-x-[-50%]">
        <Logo text={settings?.logoText} />
      </div>
    </div>
  );
};

export default NavBar;
