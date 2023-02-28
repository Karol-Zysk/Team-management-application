import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AccountContext } from "../../context/AccountContext";
import ApiClient, { ApiResponse, AuthResponse } from "../../utils/ApiClient";

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const apiClient = new ApiClient();
  const { setIsLoggedIn, error } = useContext(AccountContext);
  const [formData, setFormData] = useState<FormData>({
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
        "/auth/signin",
        formData
      );
      console.log(result);

      localStorage.setItem("access_token", result.access_token);

      localStorage.setItem("refresh_token", result.refreshToken);

      setIsLoggedIn(true);
      setTimeout(() => {
        navigate("/main");
      }, 500);
    } catch (error: any) {
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
      minH="75vh"
      spacing="1rem"
    >
      <Heading>Login</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl isInvalid={Boolean(error)}>
          <FormLabel htmlFor="email">Email:</FormLabel>
          <Input
            type="email"
            id="email"
            bg="white"
            color="black"
            name="email"
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
          <ButtonGroup pt="1rem">
            <Button size={["sm", "md", "lg"]} colorScheme="blue" type="submit">
              Log In
            </Button>
            <Button
              size={["sm", "md", "lg"]}
              onClick={() => navigate("/register")}
            >
              Create Account
            </Button>
          </ButtonGroup>
        </FormControl>
      </form>
    </VStack>
  );
};

export default Login;
