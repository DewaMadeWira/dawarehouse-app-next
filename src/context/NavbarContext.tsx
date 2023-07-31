import { createContext } from 'react';

interface NavbarContextType {
    navbarValue: 'warehouse' | 'incoming' | 'outgoing' | 'item';
    setNavbarValue:Function
}

export const NavbarContext = createContext<NavbarContextType>({
    navbarValue: 'warehouse', setNavbarValue : ()=>{}
});
