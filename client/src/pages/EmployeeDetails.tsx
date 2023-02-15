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
      const response = await fetch(
        `http://127.0.0.1:4000/api/v1/employees/${id}`,
        {
          method: "GET",
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
    const response = await fetch(
      `http://127.0.0.1:4000/api/v1/salary/${employee?.clockifyId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ start: startDate, end: endDate }),
      }
    );
    const data = await response.json();
    setSalaryReport(data);

    setLoading(false);
  };

  return (
    <Box p={8} display="flex" justifyContent="space-around">
      <Box display="flex" flexDirection="column">
        <Heading mb={8}>Employee details</Heading>
        <Text my={4}>First Name: {employee?.firstName}</Text>
        <Text my={4}>Last Name: {employee?.lastName}</Text>
        <Text my={4}>Hourly Rate: {employee?.hourlyRate}</Text>
      </Box>
      <Flex flexDirection="column" my={2}>
        <Box display="flex">
          <FormControl>
            <FormLabel htmlFor="start-date">Time Period: from</FormLabel>
            <Input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FormControl>
          <FormControl ml={4}>
            <FormLabel htmlFor="end-date">to</FormLabel>
            <Input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box>
          {" "}
          <Box>
            <Button my={6} onClick={handleGenerateReport}>
              Report
            </Button>
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
    </Box>
  );
};

export default EmployeeDetails;
