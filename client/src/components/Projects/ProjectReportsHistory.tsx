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
  useToast,
} from "@chakra-ui/react";
import { AccountContext } from "../../context/AccountContext";
import { ProjectReport } from "../../interfaces/ProjectReportInterface";
import { baseUrl } from "../../utils/origin";
import ProjectModal from "./ProjectReportModal";
import ApiClient from "../../utils/ApiClient";

const ProjectReportsHistory = () => {
  const { setProjectReport, projectReport } = useContext(AccountContext);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState<ProjectReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useToast();
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
    const apiClient = new ApiClient();
    try {
      const response = await apiClient.get<ProjectReport[]>(
        "/projects/reports"
      );
      setReports(response);
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
      await apiClient.delete(`projects/report/${id}`);

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
