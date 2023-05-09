import { UserRole } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import Search from "~/components/Search";
import Sidebar from "~/components/Sidebar";

const Home: NextPage = () => {


    return (
        <>
            <Head>
                <title>Search Students</title>
                <meta name="description" content="PROFFICE: Schedule smarter" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Sidebar>
                    <Search role={UserRole.student}/>
                </Sidebar>
            </main>

        </>
    );
};

export default Home;
