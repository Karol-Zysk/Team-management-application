import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AccountContext } from "../../context/AccountContext";
import ApiClient, { ApiResponse, AuthResponse } from "../../utils/ApiClient";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const { setIsLoggedIn, error } = useContext(AccountContext);
  const apiClient = new ApiClient();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const result: ApiResponse<AuthResponse> = await apiClient.post(
        "/auth/signup",
        formData
      );
      localStorage.setItem("access_token", result.access_token);
      localStorage.setItem("refresh_token", result.refreshToken);
      setIsLoggedIn(true);

      setTimeout(() => {
        navigate("/main");
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: `${error}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack
      w={{ base: "90%", md: "500px" }}
      m="auto"
      justify="center"
      minH="70vh"
      spacing="1rem"
    >
      <Heading>Sign Up</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl isInvalid={Boolean(error)}>
          <FormLabel htmlFor="name">Name:</FormLabel>
          <Input
            type="text"
            id="name"
            name="name"
            bg="white"
            color="black"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <FormLabel htmlFor="email">Email:</FormLabel>
          <Input
            type="email"
            id="email"
            name="email"
            bg="white"
            color="black"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FormLabel htmlFor="password">Password:</FormLabel>
          <Input
            type="password"
            id="password"
            name="password"
            bg="white"
            color="black"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <FormErrorMessage>{error}</FormErrorMessage>
          <ButtonGroup pt="1rem">
            <Button size={["sm", "md", "lg"]} colorScheme="blue" type="submit">
              Create Account
            </Button>
            <Button
              size={["sm", "md", "lg"]}
              onClick={() => navigate("/")}
              leftIcon={<ArrowBackIcon />}
            >
              Back
            </Button>
          </ButtonGroup>
        </FormControl>
      </form>
    </VStack>
  );
};

export default SignUp;
