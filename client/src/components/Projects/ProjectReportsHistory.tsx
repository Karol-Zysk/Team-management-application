import { useState, useContext, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Button,
} from "@chakra-ui/react";
import { AccountContext } from "../../context/AccountContext";
import { ProjectReport } from "../../interfaces/ProjectReportInterface";
import { baseUrl } from "../../utils/origin";
import ProjectModal from "./ProjectReportModal";

const ProjectReportsHistory = () => {
  const { setProjectReport, projectReport } = useContext(AccountContext);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState<ProjectReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [isOpen, setIsOpen] = useState(false);

  function handleCloseModal() {
    setIsOpen(false);
  }

  function handleOpenModal() {
    setIsOpen(true);
  }

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
    handleOpenModal();
  };

  const reportsPerPage = 6;
  const totalPages = Math.ceil(reports.length / reportsPerPage);
  const indexOfLastProject = currentPage * reportsPerPage;
  const indexOfFirstProject = indexOfLastProject - reportsPerPage;
  const currentProjects = reports.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  if (error) return <div>Something went wrong</div>;

  return (
    <>
      {reports.length > 0 ? (
        <Flex flexDirection="column">
          <Table w="100%" variant="striped" size="sm">
            <Thead>
              <Tr>
                <Th>Report Name</Th>
                <Th>Delete</Th>
              </Tr>
            </Thead>
            <Tbody h="min-content">
              {currentProjects.map((report: ProjectReport) => {
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
                        size={["xs", "sm"]}
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
            {projectReport && (
              <ProjectModal
                isOpen={isOpen}
                projectReport={projectReport}
                handleCloseModal={handleCloseModal}
              />
            )}
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
      ) : (
        "Project History Already Empty"
      )}
    </>
  );
};

export default ProjectReportsHistory;
