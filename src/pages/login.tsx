import { type NextPage } from "next";
import Head from "next/head";
import { Button } from '@chakra-ui/react';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Home: NextPage = () => {

    const router = useRouter();
    const { status } = useSession()

    if (status === "loading") {
        return <h1>Loading...</h1>
    }

    if(status === 'authenticated'){
        void router.push('/');
    }

    return (
        <>
            <Head>
                <title>PROFFICE: Login</title>
                <meta name="description" content="PROFFICE: Schedule smarter" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Button onClick={() => void signIn('azure-ad', { callbackUrl: '/' })}>Login</Button>
            </main>
        </>
    );
};

export default Home;
