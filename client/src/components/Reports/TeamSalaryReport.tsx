import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { TeamReport } from "../../interfaces/SalaryReportInterface";

interface TeamSalaryProps {
  salaryReport: TeamReport;
  start: string;
  end: string;
}

const TeamSalaryReport: React.FC<TeamSalaryProps> = ({
  salaryReport,
  start,
  end,
}) => {
  const { createdAt, employees, id, reportName } = salaryReport;

  return (
    <Box p={5} shadow="md">
      <Flex align="center" mb={5}>
        <Text fontSize="lg" fontWeight="bold">
          Report: {reportName}
        </Text>
      </Flex>
      <Box mb={5}>
        <Text fontWeight="bold">Report ID:</Text> {id}
      </Box>

      <Box mb={5}>
        <Text fontWeight="bold">Data utworzenia:</Text> {createdAt}
      </Box>
      {start && end && (
        <Box mb={5}>
          <Text fontWeight="bold">Time period:</Text>from: {start}, to: {end}
        </Box>
      )}

      <Box mb={5}>
        <Text fontSize="2xl" mb="8" fontWeight="bold">
          Employees:
        </Text>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Hourly Rate</Th>
              <Th>Hours Worked</Th>
              <Th>Salary</Th>
            </Tr>
          </Thead>
          <Tbody>
            {employees.map((employee) => (
              <Tr key={employee.email}>
                <Td>
                  {employee.firstName} {employee.lastName}
                </Td>
                <Td>{employee.email}</Td>
                <Td>{employee.hourlyRate}zł/h</Td>
                <Td>{employee.hoursWorked}</Td>
                <Td>{employee.salary}zł</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default TeamSalaryReport;
