import {
  Box,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { ProjectReport } from "../../interfaces/ProjectReportInterface";

interface ProjectReportProps {
  projectReport: ProjectReport;
}

const ProjectReportCard: React.FC<ProjectReportProps> = ({ projectReport }) => {
  const {
    createdAt,
    active,
    budgetEstimate,
    memberships,
    projectStartDate,
    projectName,
    duration,
    expenses,
    note,
    summary,
    timeEstimate,
  } = projectReport;

  const shadow = useColorModeValue(
    "4px 4px 4px 2px  black",
    "2px 2px 1px 2px  white"
  );

  const bg = useColorModeValue("#f6f6f6", "gray.800");

  return (
    <Flex
      display="clumn"
      px={["0", "16"]}
      py={["8", "16"]}
      w="95%"
      bg={["none", bg]}
      opacity={1}
      boxShadow={["none", shadow]}
    >
      <Heading fontSize="2xl" fontWeight="semibold" mb={8}>
        {projectName}
      </Heading>

      <Text mb={["2", "4"]} fontSize={["md", "lg"]}>
        <strong>Start Date:</strong>{" "}
        {new Date(projectStartDate).toLocaleDateString()}{" "}
      </Text>
      <Text mb={["2", "4"]} fontSize={["md", "lg"]}>
        <strong>Total project time:</strong> {duration} h{" "}
      </Text>
      <Text mb={["2", "4"]} fontSize={["md", "lg"]}>
        <strong>Budget Estimate:</strong> {budgetEstimate} zł
      </Text>
      <Text mb={["2", "4"]} fontSize={["md", "lg"]}>
        {" "}
        <strong>Time Estimate:</strong> {timeEstimate} h
      </Text>
      <Text mb={["2", "4"]} fontSize={["md", "lg"]}>
        {" "}
        <strong>Expenses:</strong> {expenses}
        {" zł"}
      </Text>
      <Text mb={["2", "4"]} fontSize={["md", "lg"]}>
        {" "}
        <strong>Note:</strong> {note}
      </Text>
      <Box overflowX={["scroll", "auto"]}>
        {memberships.length > 0 ? (
          <>
            <Text px="4" fontSize="lg" mb="8" fontWeight="bold">
              Employees:
            </Text>
            <Table size={["sm"]} fontSize={["smaller", "md"]} variant="striped">
              <Thead>
                <Tr>
                  <Th>Member</Th>
                  <Th>Hours Worked</Th>
                  <Th>Hourly Rate</Th>
                  <Th>Salary</Th>
                </Tr>
              </Thead>
              <Tbody fontSize="sm">
                {memberships.map((member, index) => (
                  <Tr key={index}>
                    <Td fontWeight="semibold">{member.clockifyName}</Td>
                    <Td>{member.hoursWorked}</Td>
                    <Td>
                      <Text fontWeight="bold">
                        {member.hourlyRate || (
                          <Text as="span" color="red.500">
                            0
                          </Text>
                        )}{" "}
                        zł/h
                      </Text>
                    </Td>
                    <Td>
                      <Text fontWeight="semibold">
                        {member.salary.toFixed(2) || (
                          <Text as="span" color="red.500">
                            0
                          </Text>
                        )}{" "}
                        zł
                      </Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </>
        ) : (
          <Flex p="4" my="4" border="2px" justify="center">
            <Text
              color="yellow.500"
              fontWeight="semibold"
              fontSize={["md", "lg"]}
            >
              No members ? Maybe wrong time period!
            </Text>
          </Flex>
        )}
      </Box>
      <Box mt={6}>
        <Text mb={["2", "2"]} fontSize={["md", "lg"]}>
          <strong>Summary:</strong>
          <Text as="span" color={summary > 0 ? "green" : "red"}>
            {" "}
          </Text>
          {summary} zł{" "}
        </Text>
        <Text mb={["2", "2"]} fontSize={["md", "lg"]}>
          <strong>Created At:</strong> {new Date(createdAt).toLocaleString()}{" "}
        </Text>
        <Text mb={["2", "2"]} fontSize={["md", "lg"]}>
          <strong>Active:</strong> {active ? "Yes" : "No"}
        </Text>
      </Box>
    </Flex>
  );
};

export default ProjectReportCard;
