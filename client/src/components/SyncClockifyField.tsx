import { Box, Button, ButtonGroup, Text } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AccountContext } from "../context/AccountContext";
import { Employee } from "../interfaces/EmployeeInterface";

const SyncClockifyField = () => {
  const [employee, setEmployee] = useState<Employee[]>([]);
  const { isActive, setError, setIsSync } = useContext(AccountContext);

  const handleSyncronize = async (event: any) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setError("You're not logged in!");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:4000/employees/syncclockify",
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(`Error: ${data.message}`);
        throw new Error(data.message);
      }

      const employee: Employee[] = data;

      setEmployee(employee);
      setIsSync(true);

      setError(null);
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
    }
  };

  return (
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
  );
};
export default SyncClockifyField;
