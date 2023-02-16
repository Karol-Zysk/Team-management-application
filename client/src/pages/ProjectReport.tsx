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
import { useContext, useState } from "react";
import { useParams } from "react-router";
import DateInputs from "../components/DateInputs";
import ProjectReportCard from "../components/Reports/ProjectReportCard";
import { AccountContext } from "../context/AccountContext";

const ProjectsReport = () => {
  const { projectReport, setProjectReport } = useContext(AccountContext);
  const [startDate, setStartDate] = useState("");
  const [timeEstimate, setTimeEstimate] = useState("");
  const [budgetEstimate, setBudgetEstimate] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { id } = useParams();

  const handleGenerateReport = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");

      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:4000/api/v1/projects/report/${id}`,
        {
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
        }
      );
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
    <Flex w="full" p="12">
      <Box w="50%">
        <FormLabel htmlFor="timeEstimate">Time Estimate</FormLabel>
        <VStack mt="4" h="min-content" flexDirection="row" align="center">
          <Input
            w="min-content"
            id="timeEstimate"
            placeholder={`Time Estimate`}
            mr="3"
            type="number"
            size="sm"
            value={timeEstimate}
            onChange={(e) => setTimeEstimate(e.target.value)}
          />
          <Text>hours</Text>
        </VStack>
        <FormLabel mt="6" htmlFor="budgetEstimate">
          Budget Estimate`
        </FormLabel>
        <VStack mt="4" h="min-content" flexDirection="row" align="center">
          <Input
            w="min-content"
            id="budgetEstimate"
            placeholder="Budget Estimate"
            mr="3"
            type="number"
            size="sm"
            value={budgetEstimate}
            onChange={(e) => setBudgetEstimate(e.target.value)}
          />
          <Text>PLN</Text>
        </VStack>{" "}
        <FormLabel mt="6" htmlFor="note">
          Note
        </FormLabel>
        <VStack my="4" h="min-content" flexDirection="row" align="center">
          <Textarea
            w="70%"
            id="budgetEstimate"
            placeholder="Note about project"
            mr="3"
            size="sm"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </VStack>{" "}
        <DateInputs
          startDate={startDate}
          setStartDate={setStartDate}
          handleGenerateReport={handleGenerateReport}
        />
      </Box>
      <Box>
        {loading ? (
          <Spinner />
        ) : (
          projectReport && <ProjectReportCard projectReport={projectReport!} />
        )}
      </Box>
    </Flex>
  );
};

export default ProjectsReport;
