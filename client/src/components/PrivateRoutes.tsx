import { useContext } from "react";
import { AccountContext } from "../context/AccountContext";
import { Outlet, Navigate } from "react-router";

const useAuth = () => {
  const { user, isLoggedIn } = useContext(AccountContext);

  return isLoggedIn;
};

const PrivateRoutes = () => {
  const isAuth = useAuth();
  console.log(isAuth);

  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
