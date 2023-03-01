import { useQuery } from "react-query";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Flex,
  Text,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../context/AccountContext";
import {
  SalaryReportInterface,
  TeamReport,
} from "../../interfaces/SalaryReportInterface";
import { baseUrl } from "../../utils/origin";
import ApiClient from "../../utils/ApiClient";

const ReportsHistory = () => {
  const { setSalaryReport } = useContext(AccountContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<TeamReport[]>([]);
  const [error, setError] = useState(null);

  const toast = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const apiClient = new ApiClient();
    try {
      const response = await apiClient.get<TeamReport[]>("/salary");
      setReports(response);

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

  async function deleteReport(id: string, event: any) {
    const apiClient = new ApiClient();
    event.preventDefault();
    try {
      await apiClient.delete(`/salary/report/${id}`);

      setReports((reports) => {
        return reports.filter((report) => report.id !== id);
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the salary report.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error(error);
    }
  }

  const reportsPerPage = 4;
  const totalPages = Math.ceil(reports.length / reportsPerPage);
  const indexOfLastProject = currentPage * reportsPerPage;
  const indexOfFirstProject = indexOfLastProject - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstProject, indexOfLastProject);

  if (loading)
    return (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.300"
        color="facebook.400"
      />
    );
  if (error) return <div>Something went wrong...</div>;

  return (
    <Flex
      flexDirection="column"
      w={{ base: "full", md: "max-content" }}
      mt="12"
    >
      <Text fontWeight="bold" fontSize="2xl" mb="6">
        Reports History
      </Text>
      <Table w="full" variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th>Report Name</Th>
          </Tr>
        </Thead>
        <Tbody h="min-content">
          {currentReports.map((report: TeamReport) => {
            return (
              <Tr
                opacity="0.7"
                cursor="pointer"
                _hover={{ opacity: 1, transition: "ease" }}
                key={report.id}
              >
                <Td
                  onClick={() => {
                    setSalaryReport(report);
                  }}
                >
                  {report.reportName}
                </Td>
                <Td>
                  <Button
                    size={["sm"]}
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
                    onClick={() => deleteReport(report.id, event)}
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </Button>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Flex justifyContent="center" alignItems="center" mt="4">
        {Array.from({ length: totalPages }).map((_, i) => (
          <Button
            key={i}
            variant={i + 1 === currentPage ? "solid" : "ghost"}
            colorScheme="blue"
            mx="1"
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </Flex>
    </Flex>
  );
};

export default ReportsHistory;
