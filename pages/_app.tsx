import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import Dashboard from "../components/dashboard";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <ChakraProvider>
        <Dashboard>
          <Component {...pageProps} />
        </Dashboard>
      </ChakraProvider>
    </SessionProvider>
  );
}
