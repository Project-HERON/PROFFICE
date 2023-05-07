/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import Image from 'next/image';
import loginPageImage from "../../assets/loginIllustration.png"
import outlookIcon from '../../assets/outlook-icon.png'
import logo from '../../assets/logo.png'
import { signIn } from "next-auth/react";

const loginPage: NextPage = () => {


  return (

    <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center items-center">
            <div className="flex justify-center items-center">
                <Image className="" src={logo} alt='Proffice'/>
            </div>
            <div className="mt-10 flex flex-col justify-center items-center">
                <p className="text-3xl font-bold">Welcome to our Office Hours Scheduling Application!</p>
                <p className="text-xl font-bold">Log in to connect with your professors and schedule your appointments.</p>
            </div>
            <div className="mt-10 flex justify-center items-center">
                <button onClick={() => signIn('azure-ad')} className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">            
                    <span className="relative px-20 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    <div className="flex gap-3">
                    <Image className="h-6 w-6" src={outlookIcon} alt=''/>
                    <p className="mt-0.5">Sign in with Outlook</p>
                    </div>
                    </span>
                </button>
            </div>
        </div>

        <div className="mt-32">
            <Image src={loginPageImage} alt='Welcome'/>
        </div>
    </div>
  );
};

export default loginPage;
