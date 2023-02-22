import { Box, Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import { useContext, useState } from "react";
import DateInputs from "../components/DateInputs";
import ReportsHistory from "../components/Employee/EmployeeReportsHistory";
import TeamSalaryReport from "../components/Employee/TeamSalaryReport";
import { AccountContext } from "../context/AccountContext";
import { motion } from "framer-motion";
import { baseUrl } from "../utils/origin";
import Layout from "../components/Layout";

const EmployeesSalariesReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { salaryReport, setSalaryReport } = useContext(AccountContext);

  const toast = useToast();

  const handleGenerateReport = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");

      setLoading(true);
      const response = await fetch(`${baseUrl}/salary/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ start: startDate, end: endDate }),
      });
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
    <Layout title="Employees Salary Report">
      <Flex w="full" justify="space-between">
        <Flex display="column" minW="35%" maxW="35%">
          <Text mb="6" fontWeight="semibold" fontSize="2xl">
            Enter the dates for which you want the report to be calculated.
          </Text>
          <DateInputs
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            handleGenerateReport={handleGenerateReport}
          />
          <Flex w="100%">
            <ReportsHistory />
          </Flex>
        </Flex>
        <Flex w={{ base: "full", md: "60%" }}>
          {loading ? (
            <Spinner />
          ) : (
            salaryReport && (
              <TeamSalaryReport
                salaryReport={salaryReport!}
              />
            )
          )}
        </Flex>
      </Flex>
    </Layout>
  );
};
export default EmployeesSalariesReport;
