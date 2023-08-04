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
                    transition={{
                        duration: 0.3,
                    }}
                    initial='initialState'
                    animate='animateState'
                    exit='exitState'
                    variants={{
                        initialState: {
                            backgroundColor: '#171717',
                            opacity: 0,
                        },
                        animateState: {
                            backgroundColor: '#171717',
                            opacity: 1,
                        },
                        exitState: { backgroundColor: '#171717' },
                    }}
                >
                    <Component {...pageProps} />
                    <Toaster />
                </motion.div>
            </NavbarContext.Provider>
        </AnimatePresence>
    );
}
