import { useContext } from "react";
import { AccountContext } from "../context/AccountContext";
import { Outlet, Navigate } from "react-router";

const AuthRoutes = () => {
  const { isLoggedIn } = useContext(AccountContext);

  return !isLoggedIn ? <Outlet /> : <Navigate to="/main" />;
};

export default AuthRoutes;
