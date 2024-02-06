// pages/_app.tsx
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import "../styles/main.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      {/* Rest of your _app.tsx content */}
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
