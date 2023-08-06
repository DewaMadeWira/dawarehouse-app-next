import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from '@/components/ui/toaster';
import { NavbarContext } from '@/context/NavbarContext';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
    const [navbarValue, setNavbarValue] = useState<
        'warehouse' | 'incoming' | 'outgoing' | 'item'
    >('warehouse');

    const router = useRouter();

    return (
        <AnimatePresence mode='wait'>
            <NavbarContext.Provider value={{ navbarValue, setNavbarValue }}>
                <motion.div
                    className='bg-bgBlack'
                    key={router.route}
                    initial={{  backgroundColor: '#171717', opacity: 0 }}
                    animate={{ backgroundColor: '#171717', opacity: 1 }}
                    exit={{  opacity: 0, backgroundColor: '#171717' }}
                    transition={{ delay: 0.3 }}
                >
                    <Component {...pageProps} />
                    <Toaster />
                </motion.div>
            </NavbarContext.Provider>
        </AnimatePresence>
    );
}
