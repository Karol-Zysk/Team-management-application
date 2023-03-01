import React, { useContext } from "react";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";

import { AccountContext } from "../context/AccountContext";
import { useNavigate } from "react-router";
import { baseUrl } from "../utils/origin";
import axios from "axios";

const LogoutButton = () => {
  const { cleanAfterLogout } = useContext(AccountContext);
  const toast = useToast();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${baseUrl}/auth/logout`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
        },
      });

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      cleanAfterLogout();

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
      bg="facebook.400"
      color="white"
      rounded="xl"
      border="2px"
      _hover={{ bg: "facebook.200", color: "black", borderColor: "black" }}
      borderColor="white"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
