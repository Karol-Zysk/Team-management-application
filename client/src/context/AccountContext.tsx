import { useToast } from "@chakra-ui/react";
import { createContext, ReactNode, useEffect, useState } from "react";
import { ProjectReport } from "../interfaces/ProjectReportInterface";
import {
  SalaryReportInterface,
  TeamReport,
} from "../interfaces/SalaryReportInterface";
import ApiClient from "../utils/ApiClient";
import { baseUrl } from "../utils/origin";

export interface UserData {
  id: string;
  email: string;
  name: string;
  companyName: string;
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

  companyName: string;
  setCompanyName: React.Dispatch<React.SetStateAction<string>>;
  isActive: boolean | undefined;
  setIsActive: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  error: null | string;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  salaryReport: null | TeamReport;
  setSalaryReport: React.Dispatch<React.SetStateAction<TeamReport | null>>;
  projectReport: null | ProjectReport;
  setProjectReport: React.Dispatch<React.SetStateAction<ProjectReport | null>>;
  setIsSync: React.Dispatch<React.SetStateAction<boolean>>;
  isSync: boolean;
  cleanAfterLogout: () => void;
}

const initialState: AccountContextValue = {
  user: null,
  isLoggedIn: false,
  setIsLoggedIn: () => false,
  setUser: () => {},
  isApiKeyValid: false,
  setIsApiKeyValid: () => false,

  companyName: "",
  setCompanyName: () => "",
  isActive: undefined,
  setIsActive: () => undefined,
  error: null,
  setError: () => null,
  salaryReport: null,
  setSalaryReport: () => null,
  projectReport: null,
  setProjectReport: () => null,
  setIsSync: () => false,
  isSync: false,
  cleanAfterLogout: () => {},
};

const AccountContext = createContext<AccountContextValue>(initialState);

const AccountContextProvider = ({ children }: { children: ReactNode }) => {
  const toast = useToast();
  const [user, setUser] = useState<UserData | {} | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isApiKeyValid, setIsApiKeyValid] = useState<boolean>(false);

  const [companyName, setCompanyName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [isSync, setIsSync] = useState<boolean>(false);
  const [salaryReport, setSalaryReport] = useState<TeamReport | null>(null);
  const [projectReport, setProjectReport] = useState<ProjectReport | null>(
    null
  );

  const cleanAfterLogout = () => {
    setUser({});
    setIsLoggedIn(false);
    setIsSync(false);
    setIsActive(false);
    setCompanyName("");
    setIsApiKeyValid(false);
  };

  const refreshAccessToken = async () => {
    const apiClient = new ApiClient();
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return;

    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        throw new Error("You're not logged in!");
      }

      const response = await apiClient.get<any>("/auth/refresh", {
        headers: { authorization: `Bearer ${refreshToken}` },
      });
      const { data } = response;

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refreshToken);
        setIsLoggedIn(true);
      }
    } catch (error: any) {
      console.error(error);
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
      cleanAfterLogout();
      return;
    }

    fetch(`${baseUrl}/users/me`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data: UserData | any) => {
        if (data.statusCode >= 400) {
          cleanAfterLogout();
          return;
        }
        setUser(data);
        setIsActive(data.active);
        if (!data.active) setIsApiKeyValid(false);
        setIsApiKeyValid(false);
        if (data.companyName) setCompanyName(data.companyName);
        setCompanyName("");
        setIsSync(data.sync);

        setIsLoggedIn(true);
      })
      .catch((error) => {
        cleanAfterLogout();
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

        isActive,
        setIsActive,
        error,
        setError,
        salaryReport,
        setSalaryReport,
        projectReport,
        setProjectReport,
        isSync,
        setIsSync,
        companyName,
        setCompanyName,
        cleanAfterLogout,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export { AccountContext, AccountContextProvider };
