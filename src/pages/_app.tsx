import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from '@/components/ui/toaster';
import { NavbarContext } from '@/context/NavbarContext';
import { useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
    const [navbarValue, setNavbarValue] = useState<
        'warehouse' | 'incoming' | 'outgoing' | 'item'
    >('warehouse');

    return (
        <>
            <NavbarContext.Provider value={{navbarValue,setNavbarValue}}>
                <Component {...pageProps} />
                <Toaster />
            </NavbarContext.Provider>
        </>
    );
}
