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

  return (
    <Box mt="16" px={12} py="6" shadow={"dark-lg"}>
      <Box maxW="900px" m="0 auto">
        <Heading as="h1" size="lg" mb={5}>
          {projectName}
        </Heading>

        <Text mb="2" fontSize="md">
          <strong>Project Start Date:</strong>{" "}
          {new Date(projectStartDate).toLocaleDateString()}{" "}
        </Text>
        <Text mb="2" fontSize="md">
          <strong>Total project time:</strong> {duration} h{" "}
        </Text>
        <Text mb="2" fontSize="md">
          <strong>Budget Estimate:</strong> {budgetEstimate}{" "}
        </Text>
        <Text mb="2" fontSize="md">
          {" "}
          <strong>Time Estimate:</strong> {timeEstimate}{" "}
        </Text>
        <Text mb="2" fontSize="md">
          {" "}
          <strong>Expenses:</strong> {expenses}{" "}
        </Text>
        <Text mb="2" fontSize="md">
          {" "}
          <strong>Note:</strong> {note}
        </Text>
        <Table my="6">
          <Thead>
            <Tr>
              <Th>Member</Th>
              <Th>Hours Worked</Th>
              <Th>Hourly Rate</Th>
              <Th>Salary</Th>
            </Tr>
          </Thead>
          <Tbody>
            {memberships.map((member, index) => (
              <Tr key={index}>
                <Td fontWeight="bold">{member.clockifyName}</Td>
                <Td>{member.hoursWorked}</Td>
                <Td>
                  {member.hourlyRate || (
                    <Text fontWeight="bold" color="red.500">
                      0
                    </Text>
                  )}
                </Td>
                <Td>
                  {member.salary || (
                    <Text fontWeight="bold" color="red.500">
                      0
                    </Text>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Box mt={6}>
          <Text mb="4" fontSize="md">
            <strong>Summary:</strong>
            <Text as="span" color={summary > 0 ? "green" : "red"}>
              {" "}
            </Text>
            {summary} zł{" "}
          </Text>
          <Text fontSize="md" mb="4">
            <strong>Created At:</strong> {new Date(createdAt).toLocaleString()}{" "}
          </Text>
          <Text fontSize="md">
            <strong>Active:</strong> {active ? "Yes" : "No"}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectReportCard;
