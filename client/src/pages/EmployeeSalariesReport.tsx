import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { useParams } from "react-router";
import TeamSalaryReport from "../components/Reports/TeamSalaryReport";
import { AccountContext } from "../context/AccountContext";
import { Employee } from "../interfaces/EmployeeInterface";

const EmployeesSalariesReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [salaryReport, setSalaryReport] = useState(null);

  const toast = useToast();

  const handleGenerateReport = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");

      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:4000/api/v1/salary/report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ start: startDate, end: endDate }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        toast({
          title: "Error",
          description: `${data.message}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      const data = await response.json();

      setSalaryReport(data);

      setLoading(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      {" "}
      <Flex my={2}>
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
          <Button my={6} onClick={handleGenerateReport}>
            Report
          </Button>
        </FormControl>
      </Flex>
      <Box>
        {loading ? (
          <Spinner />
        ) : (
          salaryReport && (
            <TeamSalaryReport
              start={startDate}
              end={endDate}
              salaryReport={salaryReport!}
            />
          )
        )}
      </Box>
    </Box>
  );
};
export default EmployeesSalariesReport;
