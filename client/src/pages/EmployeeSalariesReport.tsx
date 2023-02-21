import {
  Box,

  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
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
      <Box w="100%">
        <Text mb="6" fontWeight="semibold" fontSize="lg">
          Enter the dates for which you want the report to be calculated.
        </Text>
        <DateInputs
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          handleGenerateReport={handleGenerateReport}
        />
        <ReportsHistory />
      </Box>
      <Box w={{ base: "full", md: "min" }}>
        {loading ? (
          <Spinner />
        ) : (
          salaryReport && (
            <motion.div
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <TeamSalaryReport
                start={startDate}
                end={endDate}
                salaryReport={salaryReport!}
              />
            </motion.div>
          )
        )}
      </Box>
    </Layout>
  );
};
export default EmployeesSalariesReport;
