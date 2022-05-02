import react, {useState, useEffect, createContext} from 'react';
export const UserContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    user: {
        id: "",
        name: "",
    }
  });