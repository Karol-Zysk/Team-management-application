import { Box, Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import { useContext, useState } from "react";
import DateInputs from "../components/DateInputs";
import ReportsHistory from "../components/Employee/EmployeeReportsHistory";
import TeamSalaryReport from "../components/Employee/TeamSalaryReport";
import { AccountContext } from "../context/AccountContext";
import Layout from "../components/Layout";
import ApiClient from "../utils/ApiClient";
import { TeamReport } from "../interfaces/SalaryReportInterface";

const EmployeesSalariesReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { salaryReport, setSalaryReport } = useContext(AccountContext);

  const toast = useToast();

  const handleGenerateReport = async () => {
    const apiClient = new ApiClient();
    try {
      setLoading(true);
      const response = await apiClient.post<TeamReport>("/salary/report", {
        start: startDate,
        end: endDate,
      });
      setSalaryReport(response);

      setLoading(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `${error}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Layout title="Employees Salary Report">
      <Flex
        w="full"
        direction={["column", "column", "row"]}
        justify="space-between"
      >
        <Flex
          display="column"
          p={[0, 4, 0]}
          minW={["100%", "100%", "35%"]}
          maxW={["100%", "100%", "35%"]}
        >
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
        <Flex w={{ base: "full", md: "60%" }} align="center" justify="center">
          {loading ? (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.300"
              color="facebook.400"
              size="xl"
            />
          ) : (
            salaryReport && <TeamSalaryReport salaryReport={salaryReport!} />
          )}
        </Flex>
      </Flex>
    </Layout>
  );
};
export default EmployeesSalariesReport;
