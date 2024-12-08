import "@/styles/globals.css";
import Header from "@/components/header";
import { CartContextProvider } from "@/components/cart/CartContext";
import {SessionProvider} from "next-auth/react"

export default function App({ Component, pageProps:{ session, ...pageProps } }) {
  return (
    <>
      <SessionProvider session={session}>
      <CartContextProvider>
      <Header className={"fixed"} />
    <Component {...pageProps} />
      </CartContextProvider>
      </ SessionProvider> 
    </>
  ) ;
}
