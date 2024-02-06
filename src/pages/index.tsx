// pages/index.tsx
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MainContent } from "@/context/main";

const Home = () => {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        // Content for authenticated users
        <MainContent session={session} />
      ) : (
        // Content for non-authenticated users
        <>
          <p>You are not signed in.</p>
          <Link href="api/auth/signin">
            <button>Sign In</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Home;
