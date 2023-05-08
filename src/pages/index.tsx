import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Sidebar from "~/components/Sidebar";
import Calendar from "~/components/Calendar";

const Home: NextPage = () => {

  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      void router.push('/login');
    },
  })

  if (status === "loading") {
    return <h1>Loading...</h1>
  }

  return (
    <>
      <Head>
        <title>PROFFICE: Schedule smarter</title>
        <meta name="description" content="PROFFICE: Schedule smarter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Sidebar>
          <Calendar />
        </Sidebar>
      </main>
    </>
  );
};

export default Home;
