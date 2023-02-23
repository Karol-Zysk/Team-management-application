import { Box, Container, Flex, Spinner } from "@chakra-ui/react";
import { useContext } from "react";
import { Route, Routes } from "react-router";
import { AccountContext } from "../context/AccountContext";
import Main from "../pages/Main";
import Login from "../pages/Auth/Login";
import SignUp from "../pages/Auth/SignUp";
import AuthRoutes from "../utils/AuthRoutes";
import PrivateRoutes from "../utils/PrivateRoutes";
import Nav from "./Navbar";
import Employees from "../pages/Employees";
import EmployeeDetails from "../pages/EmployeeDetails";
import EmployeeSalariesReport from "../pages/EmployeeSalariesReport";
import Projects from "../pages/Projects";
import ProjectReport from "../pages/ProjectReport";
import Footer from "./Footer";

const Views = () => {
  const { user } = useContext(AccountContext);

  return (
    <Flex minH="100vh" direction="column">
      <Nav />

      <Flex direction="column" height="100%" flex="1">
        {user === null ? (
          <Flex flex="1" borderColor="gray.200" justify="center" align="center">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.300"
              color="facebook.400"
              size="xl"
            />
          </Flex>
        ) : (
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route path="/main" element={<Main />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/salaries" element={<EmployeeSalariesReport />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/employees/:id" element={<EmployeeDetails />} />
              <Route path="/projects/:id" element={<ProjectReport />} />
            </Route>

            <Route element={<AuthRoutes />} path="/">
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="*" element={<Login />} />
            </Route>
          </Routes>
        )}
      </Flex>

      <Footer />
    </Flex>
  );
};

export default Views;
