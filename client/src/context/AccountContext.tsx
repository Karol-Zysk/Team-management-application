import { useToast } from "@chakra-ui/react";
import { createContext, ReactNode, useEffect, useState } from "react";

export interface UserData {
  id: string;
  email: string;
  name: string;
  active: boolean;
  sync: boolean;
}

interface AccountContextValue {
  user: UserData | {} | null;
  isLoggedIn: boolean;
  setUser: React.Dispatch<React.SetStateAction<UserData | {} | null>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isApiKeyValid: boolean;
  setIsApiKeyValid: React.Dispatch<React.SetStateAction<boolean>>;
  apiKey: string;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
  isActive: boolean | undefined;
  setIsActive: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  error: null | string;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setIsSync: React.Dispatch<React.SetStateAction<boolean>>;
  isSync: boolean;
}

const initialState: AccountContextValue = {
  user: null,
  isLoggedIn: false,
  setIsLoggedIn: () => false,
  setUser: () => {},
  isApiKeyValid: false,
  setIsApiKeyValid: () => false,
  apiKey: "",
  setApiKey: () => "",
  isActive: undefined,
  setIsActive: () => undefined,
  error: null,
  setError: () => null,
  setIsSync: () => false,
  isSync: false,
};

const AccountContext = createContext<AccountContextValue>(initialState);

const AccountContextProvider = ({ children }: { children: ReactNode }) => {
  const toast = useToast();
  const [user, setUser] = useState<UserData | {} | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isApiKeyValid, setIsApiKeyValid] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [isSync, setIsSync] = useState<boolean>(false);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return;

    try {
      const res = await fetch(`http://127.0.0.1:4000/auth/refresh`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${refreshToken}`,
        },
      });
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refreshToken);
        setUser(data);
        setIsLoggedIn(true);
      }
    } catch (error: any) {
      console.error(error);
      setIsLoggedIn(false);
      setError(error);
      toast({
        title: "Error",
        description: `${error}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

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
      .then((data: UserData | any) => {
        if (data.statusCode >= 400) {
          setUser({});
          setIsLoggedIn(false);
          return;
        }
        setUser(data);
        setIsActive(data.active);
        setIsSync(data.sync);

        setIsLoggedIn(true);
      })
      .catch((error) => {
        setIsLoggedIn(false);
        setUser({});
        setError(error);
        toast({
          title: "Error",
          description: `${error}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }, [isLoggedIn]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshAccessToken();
    }, 10 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <AccountContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        isApiKeyValid,
        setIsApiKeyValid,
        apiKey,
        setApiKey,
        isActive,
        setIsActive,
        error,
        setError,
        isSync,
        setIsSync,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export { AccountContext, AccountContextProvider };
