import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import React, { useState } from "react";

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface Error {
  message: string;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | Error>("");

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
      const response = await fetch("http://127.0.0.1:4000/auth/signup", {
        method: "POST",
        headers: headers,
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.error) {
        setError(result.message);
        console.log(result.message);
      } else {
        localStorage.setItem("token", result.access_token);
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl isInvalid={Boolean(error)}>
        <FormLabel htmlFor="name">Name:</FormLabel>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
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
        <FormErrorMessage>{error}</FormErrorMessage>
        <Button mt={4} type="submit">
          Sign Up
        </Button>
      </FormControl>
    </form>
  );
};

export default SignUp;
