import { Box, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { Route, Routes } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { AccountContext } from "../context/AccountContext";
import Main from "../pages/Home/Main";
import Login from "../pages/Login/Login";
import SignUp from "../pages/Login/SignUp";
import AuthRoutes from "./AuthRoutes";
import PrivateRoutes from "./PrivateRoutes";

const Views = () => {
  const { user } = useContext(AccountContext);

  return user === null ? (
    <Text>Loading...</Text>
  ) : (
    <Box border="2px" borderColor="gray.200">
      <Routes>
        <Route element={<PrivateRoutes />} path="/main">
          <Route path="/main" element={<Main />} />
        </Route>
        <Route element={<AuthRoutes />} path="/">
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="*" element={<Login />} />
        </Route>
      </Routes>
    </Box>
  );
};

export default Views;
