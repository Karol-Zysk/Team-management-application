import { useState, useContext, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Flex,
  Button,
} from "@chakra-ui/react";
import { AccountContext } from "../../context/AccountContext";
import { ProjectReport } from "../../interfaces/ProjectReportInterface";
import { baseUrl } from "../../utils/origin";

const ProjectReportsHistory = () => {
  const { setProjectReport } = useContext(AccountContext);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState<ProjectReport[]>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("You're not logged in!");
      }
      const response = await fetch(`${baseUrl}/projects/reports`, {
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
      setReports(data);
    } catch (error: any) {
      setError(error);
    } finally {
    }
  };

  async function deleteReport(id: string, event: any) {
    event.preventDefault();
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("You're not logged in!");
      }
      await fetch(`${baseUrl}/projects/report/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      setProjectReport(null);
      setReports((reports) => {
        return reports.filter((report) => report.id !== id);
      });
    } catch (error: any) {
      setError(error);
    }
  }

  const handleReportClick = (report: ProjectReport) => {
    setProjectReport(report);
  };

  if (error) return <div>Something went wrong</div>;

  return (
    <>
      {reports.length > 0 ? (
        <Flex flexDirection="column">
          <Table w="100%" variant="striped">
            <Thead>
              <Tr>
                <Th>Report Name</Th>
                <Th>Delete</Th>
              </Tr>
            </Thead>
            <Tbody h="min-content">
              {reports.map((report: ProjectReport) => {
                return (
                  <Tr
                    opacity="0.85"
                    cursor="pointer"
                    _hover={{ opacity: 1, transition: "ease" }}
                    key={report.id}
                  >
                    <Td onClick={() => handleReportClick(report)}>
                      {report.projectName}
                    </Td>
                    <Td>
                      <Button
                        size={["xs", "sm", "md"]}
                        bg="red.600"
                        color="white"
                        rounded="xl"
                        border="2px"
                        _hover={{
                          bg: "red.400",
                          color: "black",
                          borderColor: "black",
                        }}
                        borderColor="white"
                        onClick={() => deleteReport(report.id, event)}
                      >
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Flex>
      ) : (
        "Project History Already Empty"
      )}
    </>
  );
};

export default ProjectReportsHistory;
