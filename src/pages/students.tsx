import { UserRole } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import LoadingSpinner from "~/components/LoadingSpinner";
import Search from "~/components/Search";
import Sidebar from "~/components/Sidebar";

const Home: NextPage = () => {

    const router = useRouter();
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            void router.push('/login');
        },
    })

    if (status === "loading") {
        return <LoadingSpinner />
    }

    return (
        <>
            <Head>
                <title>Search Students</title>
                <meta name="description" content="PROFFICE: Schedule smarter" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Sidebar>
                    <Search role={UserRole.student} />
                </Sidebar>
            </main>

        </>
    );
};

export default Home;
