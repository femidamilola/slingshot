import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import Link from "next/link";

export default function Home({ projects }: any) {
  const { data: session } = useSession();
  console.log(projects);
  return (
    <>
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block">Welcome {session!.user!.name}</span>
          <span className="block text-indigo-600">
            You are a {session!.user!.type}
          </span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Link href="/projects">
              <span className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700">
                View Projects
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
        You have {projects} projects
      </div>
    </>
  );
}

export const getServerSideProps = async ({ req }: any) => {
  const token = req.headers.AUTHORIZATION;
  const session = await getSession({ req });
  let projects: number;
  if (session && session.user) {
    projects = (
      await prisma.project.findMany({
        where: {
          owner: { email: session!.user!.email! },
        },
      })
    ).length;
  } else {
    projects = 0;
  }
  return { props: { projects } };
};
