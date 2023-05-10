import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider as ReduxProvider } from 'react-redux'

import { api } from "~/utils/api";
import theme from "~/utils/theme";
import { store } from "~/store/store";

import "~/styles/globals.css";
import Modals from "~/components/modals";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <ReduxProvider store={store}>
          <Component {...pageProps} />
          <Modals />
        </ReduxProvider>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
