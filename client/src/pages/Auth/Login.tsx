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

interface FormData {
  email: string;
  password: string;
}

interface Error {
  message: string;
}

const Login: React.FC = () => {
  const { setIsLoggedIn, error, setError } = useContext(AccountContext);
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
      let headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Accept", "application/json");
      headers.append("Origin", "http://localhost:5173");
      const response = await fetch("http://127.0.0.1:4000/api/v1/auth/signin", {
        method: "POST",
        headers: headers,
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.error) {
        toast({
          title: "Error",
          description: `${result.message}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setError(result.message);
      } else {
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("refresh_token", result.refreshToken);
        setIsLoggedIn(true);

        setTimeout(() => {
          navigate("/main");
        }, 500);
      }
    } catch (error: any) {
      setError(error);
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
      h="70vh"
      spacing="1rem"
    >
      <Heading>Login</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl isInvalid={Boolean(error)}>
          <FormLabel htmlFor="email">Email:</FormLabel>
          <Input
            type="email"
            id="email"
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
