import React, { createContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  active: boolean;
}

interface AccountContextData {
  user: User | { active: boolean; name: string; id: string };
  isLoggedIn: boolean;
}

const AccountContext = createContext({}) as any;

const AccountContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | {} | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setIsLoggedIn(false);
      setUser({});
      return;
    }

    fetch(`http://127.0.0.1:4000/users/me`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode >= 400) {
          setUser({});
          setIsLoggedIn(false);
          return;
        }
        setUser(data);
        setIsLoggedIn(true);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUser({});
      });
    console.log(user);
  }, [isLoggedIn]);

  return (
    <AccountContext.Provider value={{ user, isLoggedIn, setIsLoggedIn }}>
      {children}
    </AccountContext.Provider>
  );
};

export { AccountContext, AccountContextProvider };
