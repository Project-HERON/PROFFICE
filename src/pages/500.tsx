import { type NextPage } from "next";
import Head from "next/head";

import Sidebar from "~/components/Sidebar";
import Calendar from "~/components/Calendar";

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Oops... Something went very wrong...</title>
        <meta name="description" content="PROFFICE: Internal server error" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>500</h1>
      </main>
    </>
  );
};

export default Home;