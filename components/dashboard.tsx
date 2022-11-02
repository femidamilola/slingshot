import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3BottomLeftIcon,
  BellIcon,
  CalendarIcon,
  ChartBarIcon,
  CodeBracketIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FaGithub, FaSignOutAlt } from "react-icons/fa";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@chakra-ui/react";

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "/api/auth/signout" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard(props: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: HomeIcon,
      current: props.title == "Dashboard",
    },
    {
      name: "Projects",
      href: "projects",
      icon: FolderIcon,
      current: props.title == "Projects",
    },
    {
      name: "Requirements",
      href: "requirements",
      icon: CodeBracketIcon,
      current: props.title == "Requirements",
    },
    //   { name: "Documents", href: "#", icon: InboxIcon, current: false },
    //   { name: "Reports", href: "#", icon: ChartBarIcon, current: false },
  ];

  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>

      {session && (
        <div className="bg-gray-50">
          <Button
            colorScheme="red"
            leftIcon={<FaSignOutAlt />}
            onClick={() => signOut()}
          >
            Logout
          </Button>
          {props.children}
        </div>
      )}
      {!session && (
        <div className="bg-gray-50">
          <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
            <div className="py-4">You are not signed in</div>

            <div className="py-4">
              <Button
                colorScheme="purple"
                leftIcon={<FaGithub />}
                onClick={() => signIn("github")}
              >
                Github
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
