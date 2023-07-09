import React from 'react'
import '../styles/globals.css'
import {NextUIProvider} from "@nextui-org/react";

function Application({ Component, pageProps }) {
  return <NextUIProvider>
    <Component {...pageProps} />
  </NextUIProvider>
}

export default Application
