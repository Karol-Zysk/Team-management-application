import { Box, Button, ButtonGroup, Text } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AccountContext } from "../context/AccountContext";
import { Employee } from "../interfaces/EmployeeInterface";
import { motion } from "framer-motion";
import { baseUrl } from "../utils/origin";

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
      const response = await fetch(`${baseUrl}/employees/syncclockify`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Text color="green" fontSize={["sm", "sm", "md"]} mb="5">
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
          {employee.length !== 0 && (
            <Text
              mt="2"
              ml="6"
              fontSize={["md", "md", "xl"]}
              color="lightgreen"
            >
              {employee.length} new employees added.
            </Text>
          )}
        </ButtonGroup>
      </motion.div>
    </Box>
  );
};
export default SyncClockifyField;
