import { type NextPage } from "next";
import Head from "next/head";
import { Button } from '@chakra-ui/react';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import LoadingSpinner from "~/components/LoadingSpinner";

const Home: NextPage = () => {

    const router = useRouter();
    const { status } = useSession()

    if (status === "loading") {
        return <LoadingSpinner />
    }

    if(status === 'authenticated'){
        void router.push('/');
    }

    return (
        <>
            <Head>
                <title>Login or sign up</title>
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
