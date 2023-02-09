import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  FormLabel,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Employee } from "../interfaces/EmployeeInterface";

interface InputProps {
  error: any;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  active: boolean;
}

const ApiKeyInput: React.FC<InputProps> = ({ error, setError, active }) => {
  const [isApiKeyValid, setIsApiKeyValid] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>();

  const [employee, setEmployee] = useState<Employee[]>([]);
  const editInputKeyHandler = () => {
    setIsApiKeyValid(false);
    setIsActive(false);
  };

  useEffect(() => {
    setIsActive(active);
  }, []);

  const handleSyncronize = async (event: any) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setError("Nie jesteś zalogowany");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:4000/employees/syncclockify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            clockify_api_key: apiKey,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error: ${errorData.message}`);
        throw new Error(errorData.message);
      }
      const employee: Employee[] = await response.json();

      setEmployee(employee);
      console.log(employee);

      setError(null);
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
    }
  };
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setError("Nie jesteś zalogowany");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:4000/users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          clockify_api_key: apiKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error: ${errorData.message}`);
        throw new Error(errorData.message);
      }

      setIsApiKeyValid(true);
      setIsActive(true);
      setError(null);
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
    }
  };

  return (
    <>
      {!active && (
        <>
          <Text fontSize="2xl" mb="12">
            Aby W peni korzystać z naszej aplikacji prosimy Cię o wprowadzenie
            klucza api clockify
          </Text>
        </>
      )}
      <form onSubmit={handleSubmit}>
        <FormLabel htmlFor="clockifyApiKey">{`${
          active ? "Posiadasz ważny" : "Wprowadź ważny"
        } Clockify API Key`}</FormLabel>
        <VStack mt="4" h="min-content" flexDirection="row" align="center">
          <Input
            w="70%"
            id="clockifyApiKey"
            placeholder="Clockify API Key"
            mr="3"
            size="sm"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            isDisabled={isApiKeyValid || isActive}
          />
          {error && <Text color="red">{error}</Text>}
          {isActive || isApiKeyValid ? <CheckIcon color="green" /> : null}
        </VStack>
        <ButtonGroup w="70%" justifyContent="left" alignContent="right" mt="4">
          <Button isDisabled={isApiKeyValid || isActive} type="submit">
            Submit Api Key
          </Button>
          <Button onClick={editInputKeyHandler}>Edytuj Input</Button>
        </ButtonGroup>
      </form>
      <Box mt="12">
        <Text fontSize="xl" mb="5">
          Posiadając ważny klucz API możesz zsynchronizować swoją bazę z
          ClockifyAPI i korzystać z większości funkcji aplikacji
        </Text>
        <ButtonGroup w="70%" justifyContent="left" alignContent="right" mt="4">
          <Button onClick={handleSyncronize} isDisabled={!isActive}>
            Synchronicuj Bazę
          </Button>
        </ButtonGroup>
        {employee.length !== 0 && (
          <Text mt="3" fontSize="xl" color="lightgreen" mb="5">
            Udało się zsynchronizować {employee.length} pracowników
          </Text>
        )}
      </Box>
    </>
  );
};
export default ApiKeyInput;
