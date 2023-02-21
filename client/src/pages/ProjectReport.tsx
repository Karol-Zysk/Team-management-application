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
import { Project } from "../interfaces/ProjectReportInterface";

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
    try {
      const accessToken = localStorage.getItem("access_token");

      setLoading(true);
      const response = await fetch(`${baseUrl}/projects/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
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

      if (data) setProject(data);

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Error",
        description: `${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGenerateReport = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");

      setLoading(true);
      const response = await fetch(`${baseUrl}/projects/report/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          timeEstimate: Number(timeEstimate),
          budgetEstimate: Number(budgetEstimate),
          note,
          start: startDate,
        }),
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

      setProjectReport(data);

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
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
    <Layout title={`Create ${project && project?.name} Report`}>
      <Flex w="min" direction="column" justify="space-between">
        <FormLabel fontSize={["lg", "2xl"]} htmlFor="timeEstimate">
          Time Estimate
        </FormLabel>
        <VStack mt="4" h="min-content" flexDirection="row" align="center">
          <Input
            id="timeEstimate"
            w="min"
            placeholder={`Time Estimate`}
            mr="3"
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
        <VStack mt="4" h="min-content" flexDirection="row" align="center">
          <Input
            id="budgetEstimate"
            w="min"
            placeholder={`Budget Estimate`}
            mr="3"
            size={["sm", "md"]}
            _placeholder={{ opacity: 0.8, color: "gray.500" }}
            value={budgetEstimate}
            onChange={(e) => setBudgetEstimate(e.target.value)}
          />
          <Text fontWeight="semibold" fontSize={["md", "lg"]}>
            PLN
          </Text>
        </VStack>{" "}
        <FormLabel mt="6" fontSize={["lg", "2xl"]} htmlFor="note">
          Note
        </FormLabel>
        <VStack my="4" h="min-content" flexDirection="row" align="center">
          <Textarea
            id="note"
            w="max-content"
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
      <Box border="2px">
        {loading ? (
          <Spinner />
        ) : (
          projectReport && <ProjectReportCard projectReport={projectReport!} />
        )}
      </Box>
    </Layout>
  );
};

export default ProjectsReport;
