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
import EmployeeSalaryReport from "../components/Reports/EmployeeSalaryReport";
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
    handleGetEmployee(event);
  }, [id]);

  async function handleGetEmployee(event: any) {
    event.preventDefault();
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

    setLoading(true);
    const response = await fetch(`${baseUrl}/salary/${employee?.clockifyId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ start: startDate, end: endDate }),
    });
    const data = await response.json();
    setSalaryReport(data);

    setLoading(false);
  };

  return (
    <Flex
      p={8}
      display="flex"
      align="center"
      flexDirection="column"
      justifyContent="center"
    >
      <Heading mb={8}>Employee Report</Heading>
      <Flex w="full" flexDirection="row">
        <Box w="50%">
          <Text fontSize="lg" my={4}>
            <strong>First Name:</strong> {employee?.firstName}
          </Text>
          <Text fontSize="lg" my={4}>
            <strong>Last Name: </strong>
            {employee?.lastName}
          </Text>
          <Text fontSize="lg" my={4}>
            <strong>Hourly Rate:</strong> {employee?.hourlyRate}
          </Text>
          <Flex flexDirection="column" w="min-content" my={2}>
            <Box display="flex">
              <FormControl>
                <FormLabel htmlFor="start-date"> from</FormLabel>
                <Input
                  w="min-content"
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FormControl>
              <FormControl ml={4}>
                <FormLabel htmlFor="end-date">to</FormLabel>
                <Input
                  w="min-content"
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FormControl>
            </Box>
          </Flex>
          <Button my={6} onClick={handleGenerateReport}>
            Report
          </Button>
        </Box>
        <Box w="50%" p="12">
          {" "}
          <Box>
            {loading ? (
              <Spinner />
            ) : (
              salaryReport && (
                <EmployeeSalaryReport salaryReport={salaryReport!} />
              )
            )}
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default EmployeeDetails;
