import GlobalContextProvider from "../state/context/GlobalContext";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <GlobalContextProvider>
      <Toaster />
      <Component {...pageProps} />
    </GlobalContextProvider>
  );
}

export default MyApp;
