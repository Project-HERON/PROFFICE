import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from 'next/image';
import loginPageImage from "../../assets/loginIllustration.png";
import outlookIcon from '../../assets/outlook-icon.png';
import logo from '../../assets/logo.png';
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
            <div className="flex justify-center items-center bg-gradient-to-r from-blue-500 to-cyan-400 h-screen">
                <div className="h-3/4 w-3/4 shadow-2xl rounded-xl bg-white py-6 px-4">
                    <div className="h-full">
                        <div className="grid grid-cols-2 h-full">

                            <div className="flex flex-col justify-center items-center">
                                <p className="text-3xl font-bold text-center text-blue-500">Welcome to our Office Hours Scheduling Application!</p>
                                <Image src={loginPageImage} alt='Welcome' />
                            </div>

                            <div className="flex flex-col justify-evenly items-center mx-6 rounded-lg shadow-xl">
                                    <div>
                                        <Image className="mx-6" src={logo} alt='Proffice' />
                                    </div>

                                    <div className="flex flex-col justify-center items-center">
                                        <button onClick={() => void signIn('azure-ad', { callbackUrl: '/' })} className="relative inline-flex items-center justify-center p-0.5 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                                            <span className="relative px-20 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                                <div className="flex gap-3">
                                                    <Image className="h-6 w-6" src={outlookIcon} alt='' />
                                                    <p className="">Sign in with Outlook</p>
                                                </div>
                                            </span>
                                        </button>
                                        <p className="mt-2 font-bold text-blue-400">Join Us!</p>
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>

        </>
    );
};

export default Home;
