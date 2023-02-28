import { Box, Button, ButtonGroup, Spinner, Text } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AccountContext } from "../../context/AccountContext";
import { Employee } from "../../interfaces/EmployeeInterface";
import { motion } from "framer-motion";
import ApiClient from "../../utils/ApiClient";

const SyncClockifyField = () => {
  const [employee, setEmployee] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isActive, setIsSync } = useContext(AccountContext);

  const handleSyncronize = async (event: any) => {
    const apiClient = new ApiClient();

    try {
      setLoading(true);
      const response = await apiClient.post<Employee[]>(
        "employees/syncclockify"
      );
      setEmployee(response);
      setIsSync(true);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <Box mt="12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Text
          color="green.500"
          fontWeight="semibold"
          fontSize={["md", "md", "lg"]}
          mb="5"
        >
          With a valid API key, you can synchronize your database with Clockify
          API and use most of the application's features.
        </Text>
        <ButtonGroup
          w={["100%", "70%"]}
          justifyContent="left"
          alignContent="right"
          mt="4"
        >
          <Button
            size={["sm", "md", "lg"]}
            bg="facebook.400"
            color="white"
            rounded="xl"
            border="2px"
            _hover={{
              bg: "facebook.200",
              color: "black",
              borderColor: "black",
            }}
            borderColor="white"
            onClick={handleSyncronize}
            isDisabled={!isActive}
          >
            Synchronize
          </Button>
          {loading ? (
            <Spinner
              size={["sm", "lg"]}
              ml="4"
              mt="2"
              thickness="3px"
              speed="0.65s"
              emptyColor="gray.300"
              color="facebook.400"
            />
          ) : (
            employee.length !== 0 && (
              <Text
                fontWeight="semibold"
                mt="1"
                ml="12"
                fontSize={["md", "md", "xl"]}
                color="green.500"
              >
                {employee.length} new employees.
              </Text>
            )
          )}
        </ButtonGroup>
      </motion.div>
    </Box>
  );
};
export default SyncClockifyField;
