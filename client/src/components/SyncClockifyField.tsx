import { Box, Button, ButtonGroup, Text } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AccountContext } from "../context/AccountContext";
import { Employee } from "../interfaces/EmployeeInterface";

const SyncClockifyField = () => {
  const [employee, setEmployee] = useState<Employee[]>([]);
  const { isActive, setError, setIsSync } = useContext(AccountContext);

  const handleSyncronize = async (event: any) => {
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
      <Text fontSize={["md", "md", "xl"]} mb="5">
        With a valid API key, you can synchronize your database with Clockify
        API and use most of the application's features.
      </Text>
      <ButtonGroup w="70%" justifyContent="left" alignContent="right" mt="4">
        <Button
          size={["sm", "md", "lg"]}
          onClick={handleSyncronize}
          isDisabled={!isActive}
        >
          Synchronize
        </Button>
      </ButtonGroup>
      {employee.length !== 0 && (
        <Text mt="3" fontSize={["md", "md", "xl"]} color="lightgreen" mb="5">
          Udało się zsynchronizować {employee.length} pracowników
        </Text>
      )}
    </Box>
  );
};
export default SyncClockifyField;
