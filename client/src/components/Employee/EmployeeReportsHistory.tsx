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
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../context/AccountContext";
import {
  SalaryReportInterface,
  TeamReport,
} from "../../interfaces/SalaryReportInterface";
import { baseUrl } from "../../utils/origin";

const ReportsHistory = () => {
  const { setSalaryReport } = useContext(AccountContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState<TeamReport[]>([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("You're not logged in!");
      }
      const response = await fetch(`${baseUrl}/salary`, {
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
      setIsLoading(false);
      setReports(data);
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  async function deleteReport(id: string, event: any) {
    event.preventDefault();
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("You're not logged in!");
      }
      await fetch(`${baseUrl}/salary/report/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      setReports((reports) => {
        return reports.filter((report) => report.id !== id);
      });
    } catch (error: any) {
      setError(error);
      console.error(error);
    }
  }

  const reportsPerPage = 4;
  const totalPages = Math.ceil(reports.length / reportsPerPage);
  const indexOfLastProject = currentPage * reportsPerPage;
  const indexOfFirstProject = indexOfLastProject - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstProject, indexOfLastProject);

  if (isLoading)
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
                    disabled={isLoading}
                  >
                    {isLoading ? "Deleting..." : "Delete"}
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
