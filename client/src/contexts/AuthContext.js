
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    // On mount, check localStorage for a logged in user
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setCurrentUser(storedUser);
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};
