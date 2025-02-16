'use client'
import { createContext, useState, useEffect, useContext } from "react";

type UserContextType = {
    userType: string | null;
}

export const UserContext = createContext<UserContextType | null>(null);



export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [userType, setUserType] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserType = async () => {
            const response = await fetch(`http://localhost:3000/role/user-type`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const data = await response.json();

            setUserType(data.userType);
        };
        fetchUserType();
    }, []);


    useEffect(() => {
        console.log(userType);
    }, [userType]);


    return <UserContext.Provider value={{ userType }}>{children}</UserContext.Provider>;

};



