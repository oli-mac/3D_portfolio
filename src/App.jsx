import React, { useCallback, useEffect, useMemo, useState } from "react";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { AnimatePresence } from "framer-motion";
import Home from "@/pages/index";
import About from "@/pages/About";
import Credentials from "@/pages/articles";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog/[slug]";
import Projects from "@/pages/projects";
import Publications from "@/pages/publications";
import { ErrorState, LoadingState } from "@/components/AppState";
import { getPortfolioData, getRoutePage } from "@/lib/sanity/queries";

const normalizePath = (path) => {
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "");
};

const NotFound = ({ siteSettings }) => {
  useEffect(() => {
    document.title = `Page Not Found | ${siteSettings?.name || "Portfolio"}`;
  }, [siteSettings?.name]);

  return (
    <main className="flex min-h-[60vh] w-full items-center justify-center px-8 text-center text-dark dark:text-light">
      <div>
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-4 text-xl font-medium">This page does not exist.</p>
      </div>
    </main>
  );
};

const resolveRoute = (path, data) => {
  const normalizedPath = normalizePath(path);
  const common = { siteSettings: data.siteSettings };

  if (normalizedPath === "/") return { Component: Home, props: { ...common, page: data.homePage } };
  if (normalizedPath === "/About") {
    return {
      Component: About,
      props: {
        ...common,
        page: data.aboutPage,
        skills: data.skills || [],
        testimonials: data.testimonials || [],
        featuredProject: (data.projects || []).find((project) => project.featured) || (data.projects || [])[0],
      },
    };
  }
  if (normalizedPath === "/articles") {
    return { Component: Credentials, props: { ...common, page: data.credentialsPage } };
  }
  if (normalizedPath === "/blog") {
    return {
      Component: Blog,
      props: {
        ...common,
        page: getRoutePage(data.routePages, "blog"),
        posts: data.blogPosts || [],
      },
    };
  }
  if (normalizedPath === "/projects") {
    return {
      Component: Projects,
      props: {
        ...common,
        page: getRoutePage(data.routePages, "projects"),
        projects: data.projects || [],
      },
    };
  }
  if (normalizedPath === "/publications") {
    return {
      Component: Publications,
      props: {
        ...common,
        page: getRoutePage(data.routePages, "publications"),
        publications: data.publications || [],
      },
    };
  }

  if (normalizedPath.startsWith("/blog/")) {
    const slug = normalizedPath.split("/").pop();
    const post = (data.blogPosts || []).find((item) => item.slug === slug);
    if (post) return { Component: BlogPost, props: { ...common, post, page: getRoutePage(data.routePages, "blog") } };
  }

  return { Component: NotFound, props: common };
};

const App = () => {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const loadPortfolioData = useCallback((isMounted = () => true) => {
    return getPortfolioData()
      .then((payload) => {
        if (isMounted()) {
          setData(payload);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted()) setError(err);
      });
  }, []);

  useEffect(() => {
    let mounted = true;
    const isMounted = () => mounted;

    loadPortfolioData(isMounted);

    return () => {
      mounted = false;
    };
  }, [loadPortfolioData]);

  useEffect(() => {
    let mounted = true;
    const isMounted = () => mounted;
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") loadPortfolioData(isMounted);
    };

    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      mounted = false;
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [loadPortfolioData]);

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const onClick = (event) => {
      const anchor = event.target.closest("a");
      if (!anchor) return;

      const url = new URL(anchor.href);
      const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
      const isDownload = anchor.hasAttribute("download");
      const isExternal = url.origin !== window.location.origin;
      const opensNewTab = anchor.target && anchor.target !== "_self";

      if (isModifiedClick || isDownload || isExternal || opensNewTab) return;

      event.preventDefault();
      const nextPath = normalizePath(url.pathname);
      window.history.pushState({}, "", `${nextPath}${url.search}${url.hash}`);
      setPath(nextPath);
      window.scrollTo({ top: 0, behavior: "instant" });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const resolvedRoute = useMemo(() => {
    if (!data) return null;
    return resolveRoute(path, data);
  }, [data, path]);

  if (error) {
    return (
      <main className="font-mont flex min-h-screen w-full flex-col bg-light dark:bg-dark">
        <ErrorState message={error.message} />
      </main>
    );
  }

  if (!resolvedRoute) {
    return (
      <main className="font-mont flex min-h-screen w-full flex-col bg-light dark:bg-dark">
        <LoadingState />
      </main>
    );
  }

  const { Component, props } = resolvedRoute;
  const siteSettings = data.siteSettings;

  return (
    <main className="font-mont flex min-h-screen w-full flex-col bg-light dark:bg-dark">
      <NavBar currentPath={path} onNavigate={setPath} settings={siteSettings} />
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <Component key={path} {...props} />
        </AnimatePresence>
      </div>
      <Footer settings={siteSettings} />
    </main>
  );
};

export default App;
