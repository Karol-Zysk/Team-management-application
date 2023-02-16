import React, { useContext } from "react";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";

import { AccountContext } from "../context/AccountContext";
import { useNavigate } from "react-router";
import { baseUrl } from "../utils/origin";

const LogoutButton = () => {
  const { setIsLoggedIn, setUser, setIsSync, setIsActive } =
    useContext(AccountContext);
  const toast = useToast();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${baseUrl}/auth/logout`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
        },
      });

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setIsLoggedIn(false);
      setUser({});
      setIsSync(false);
      setIsActive(false);

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
    <Button
      size={["sm", "md", "lg"]}
      onClick={handleLogout}
      background="grey.200"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
