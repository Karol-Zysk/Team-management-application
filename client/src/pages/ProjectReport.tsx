import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import Layout from "../components/Layout";
import DateInputs from "../components/DateInputs";
import PageTitle from "../components/PageTitle";
import ProjectReportCard from "../components/Projects/ProjectReportCard";
import { AccountContext } from "../context/AccountContext";
import { baseUrl } from "../utils/origin";
import { Project, ProjectReport } from "../interfaces/ProjectReportInterface";
import ProjectSvg from "../components/ProjectSvg";
import ApiClient from "../utils/ApiClient";

const ProjectsReport = () => {
  useEffect(() => {
    return () => {
      handleGetProject();
    };
  }, []);

  const { projectReport, setProjectReport } = useContext(AccountContext);
  const [startDate, setStartDate] = useState("");
  const [project, setProject] = useState<Project | undefined>();
  const [timeEstimate, setTimeEstimate] = useState("");
  const [budgetEstimate, setBudgetEstimate] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { id } = useParams();

  const handleGetProject = async () => {
    const apiClient = new ApiClient();
    const response = await apiClient.get<Project>(`/projects/${id}`);
    try {
      setProject(response);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      console.error(err.message);
      toast({
        title: "Error",
        description: `${err.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const apiClient = new ApiClient();
      const response = await apiClient.post<ProjectReport>(
        `/projects/report/${id}`,
        {
          timeEstimate: Number(timeEstimate),
          budgetEstimate: Number(budgetEstimate),
          note,
          start: startDate,
        }
      );

      setProjectReport(response);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
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
    <Layout title={`Create ${project?.name ? project.name : "Project"} Report`}>
      <Flex justify="space-between" w="full" direction={["column", "row"]}>
        <Flex w="min" direction="column">
          <FormLabel fontSize={["lg", "2xl"]} htmlFor="timeEstimate">
            Time Estimate
          </FormLabel>
          <VStack mt="2" h="min-content" flexDirection="row" align="center">
            <Input
              id="timeEstimate"
              w="min"
              placeholder={`Time Estimate`}
              mr="3"
              bg="white"
              color="black"
              size={["sm", "md"]}
              _placeholder={{ opacity: 0.8, color: "gray.500" }}
              value={timeEstimate}
              onChange={(e) => setTimeEstimate(e.target.value)}
            />
            <Text fontWeight="semibold" fontSize={["md", "lg"]}>
              hours
            </Text>
          </VStack>
          <FormLabel fontSize={["lg", "2xl"]} mt="6" htmlFor="budgetEstimate">
            Budget Estimate
          </FormLabel>
          <VStack mt="2" h="min-content" flexDirection="row" align="center">
            <Input
              id="budgetEstimate"
              w="min"
              placeholder={`Budget Estimate`}
              mr="3"
              bg="white"
              color="black"
              size={["sm", "md"]}
              _placeholder={{ opacity: 0.8, color: "gray.500" }}
              value={budgetEstimate}
              onChange={(e) => setBudgetEstimate(e.target.value)}
            />
            <Text fontWeight="semibold" fontSize={["md", "lg"]}>
              PLN
            </Text>
          </VStack>{" "}
          <FormLabel fontSize={["lg", "2xl"]} mt="6" htmlFor="note">
            Note
          </FormLabel>
          <VStack mt="2" h="min-content" flexDirection="row" align="center">
            <Textarea
              id="note"
              bg="white"
              color="black"
              w="100%"
              h="max-content"
              placeholder={`Note...`}
              mr="3"
              size={["sm", "md"]}
              _placeholder={{ opacity: 0.8, color: "gray.500" }}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </VStack>{" "}
          <DateInputs
            startDate={startDate}
            setStartDate={setStartDate}
            handleGenerateReport={handleGenerateReport}
          />
        </Flex>
        <Flex w={["full", "60%"]} align="center" justify="center">
          {loading ? (
            <Spinner
              size="xl"
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.300"
              color="facebook.400"
            />
          ) : projectReport ? (
            <ProjectReportCard projectReport={projectReport} />
          ) : (
            <ProjectSvg />
          )}
        </Flex>
      </Flex>
    </Layout>
  );
};

export default ProjectsReport;
