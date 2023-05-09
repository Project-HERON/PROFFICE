import { UserRole } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import Search from "~/components/Search";
import Sidebar from "~/components/Sidebar";

const Home: NextPage = () => {


    return (
        <>
            <Head>
                <title>Search Professors</title>
                <meta name="description" content="PROFFICE: Schedule smarter" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Sidebar>
                    <Search role={UserRole.professor}/>
                </Sidebar>
            </main>

        </>
    );
};

export default Home;
