import Layout from "./Layout";

export const LoadingState = () => (
  <main className="flex min-h-[70vh] w-full items-center justify-center text-dark dark:text-light">
    <Layout className="py-24 text-center">
      <p className="text-xl font-semibold">Loading portfolio content...</p>
    </Layout>
  </main>
);

export const ErrorState = ({ message }) => (
  <main className="flex min-h-[70vh] w-full items-center justify-center text-dark dark:text-light">
    <Layout className="py-24 text-center">
      <h1 className="text-4xl font-bold">Content unavailable</h1>
      <p className="mx-auto mt-4 max-w-2xl font-medium text-dark/75 dark:text-light/75">{message}</p>
    </Layout>
  </main>
);
