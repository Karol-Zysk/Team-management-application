import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { Route, Routes } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { AccountContext } from "../context/AccountContext";
import Main from "../pages/Main";
import Login from "../pages/Auth/Login";
import SignUp from "../pages/Auth/SignUp";
import AuthRoutes from "../utils/AuthRoutes";
import PrivateRoutes from "../utils/PrivateRoutes";
import Nav from "./Navbar";
import Employees from "../pages/Employees";

const Views = () => {
  const { user } = useContext(AccountContext);

  console.log(user);
  return (
    <Box minH="full" minW="full">
      <Nav />
      <Box w="100%" h="full" paddingX="20" paddingY="20" borderColor="gray.200">
        {user === null ? (
          <Flex
            w="100%"
            h="100%"
            borderColor="gray.200"
            justify="center"
            align="center"
          >
            <Spinner justifySelf="center" size="lg" />
          </Flex>
        ) : (
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route path="/main" element={<Main />} />
              <Route path="/employees" element={<Employees />} />
            </Route>
            <Route element={<AuthRoutes />} path="/">
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="*" element={<Login />} />
            </Route>
          </Routes>
        )}
      </Box>
    </Box>
  );
};

export default Views;
