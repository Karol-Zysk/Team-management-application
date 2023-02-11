import React, { useContext } from "react";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";

import { AccountContext } from "../context/AccountContext";
import { useNavigate } from "react-router";

const LogoutButton = () => {
  const { setIsLoggedIn, setUser } = useContext(AccountContext);
  const toast = useToast();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("elo");
      const response = await fetch(`http://127.0.0.1:4000/auth/logout`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
        },
      });

      console.log();

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setIsLoggedIn(false);
      setUser({});
      setTimeout(() => {
        navigate("/");
      }, 500);

      toast({
        title: "Success",
        description: "You have successfully logged out.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while logging out.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Button onClick={handleLogout} background="grey.200">
      Logout
    </Button>
  );
};

export default LogoutButton;
