import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Spinner,
  Text,
  Heading,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import Layout from "../components/Layout";
import PageTitle from "../components/PageTitle";
import EmployeeSalaryReport from "../components/Employee/EmployeeSalaryReport";
import { AccountContext } from "../context/AccountContext";
import { Employee } from "../interfaces/EmployeeInterface";
import { baseUrl } from "../utils/origin";

const EmployeeDetails = ({}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [salaryReport, setSalaryReport] = useState(null);

  const { setError, error } = useContext(AccountContext);
  const toast = useToast();
  const { id } = useParams();

  const [employee, setEmployee] = useState<Employee>();

  useEffect(() => {
    handleGetEmployee();
  }, [id]);

  async function handleGetEmployee() {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setError("You're not logged in!");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/employees/${id}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`Error: ${data.message}`);
        throw new Error(data.message);
      }

      const employee: Employee = data;

      setEmployee(employee);

      setError(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: `${error}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  const handleGenerateReport = async () => {
    const accessToken = localStorage.getItem("access_token");
    try {
      setLoading(true);
      const response = await fetch(
        `${baseUrl}/salary/${employee?.clockifyId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ start: startDate, end: endDate }),
        }
      );
      if (response.status >= 400) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      setSalaryReport(data);

      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      console.error(err.message);
      setError(err.message);
      toast({
        title: "Error",
        description: `${err.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Layout title={`${employee?.clockifyName} Salary`}>
      <Flex direction={["column", "column", "row"]} w="full">
        <Box flexBasis={{ base: "100%", md: "50%" }}>
          <Text mb={[2, 4]} fontWeight="semibold" fontSize={["xl", "xl"]}>
            Enter the dates for which you want the report to be calculated.
          </Text>
          <Text fontSize={["md", "lg"]} my={[2, 2]}>
            <strong>ClockifyName:</strong> {employee?.clockifyName}
          </Text>
          <Text fontSize={["md", "lg"]} my={[2, 2]}>
            <strong>First Name:</strong> {employee?.firstName}
          </Text>
          <Text fontSize={["md", "lg"]} my={[2, 2]}>
            <strong>Last Name: </strong>
            {employee?.lastName}
          </Text>
          <Text fontSize={["md", "lg"]} my={[2, 2]}>
            <strong>Hourly Rate:</strong> {employee?.hourlyRate} zł/h
          </Text>

          <Flex flexDirection="column" w="min-content" my={2}>
            <Box display="flex">
              <FormControl>
                <FormLabel htmlFor="start-date">From</FormLabel>
                <Input
                  bg="white"
                  color="blackAlpha.800"
                  size={["sm", "sm", "md"]}
                  w="min-content"
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FormControl>
              <FormControl ml={4}>
                <FormLabel htmlFor="end-date">To</FormLabel>
                <Input
                  bg="white"
                  color="blackAlpha.800"
                  size={["sm", "sm", "md"]}
                  w="min-content"
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FormControl>
            </Box>
          </Flex>
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
            my={6}
            onClick={handleGenerateReport}
          >
            Report
          </Button>
        </Box>
        <Flex justify="center" w={["100%", "100%", "50%"]} h="100%">
          {loading ? (
            <Spinner />
          ) : (
            salaryReport && (
              <Box>
                <EmployeeSalaryReport
                  start={startDate}
                  end={endDate}
                  salaryReport={salaryReport}
                />
              </Box>
            )
          )}
        </Flex>
      </Flex>
    </Layout>
  );
};

export default EmployeeDetails;
