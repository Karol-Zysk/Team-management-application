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
  useColorModeValue,
} from "@chakra-ui/react";
import { TeamReport } from "../../interfaces/SalaryReportInterface";

interface TeamSalaryProps {
  salaryReport: TeamReport;
}

const TeamSalaryReport: React.FC<TeamSalaryProps> = ({ salaryReport }) => {
  const { employees, id, reportName } = salaryReport;

  const shadow = useColorModeValue(
    "4px 4px 4px 2px  black",
    "2px 2px 1px 2px  white"
  );

  const bg = useColorModeValue("#f6f6f6", "gray.800");

  return (
    <Flex
      display="clumn"
      px={[0, 4, 16]}
      py={[8, 16]}
      w="95%"
      bg={["none", bg]}
      opacity={1}
      boxShadow={["none", shadow]}
    >
      <Flex mx={[-4, 0]} px={[4]} align="center" mb={2}>
        <Text fontSize="xl" fontWeight="bold">
          {reportName}
        </Text>
      </Flex>

      <Box p={[0, 8]} overflowX={["scroll", "auto"]}>
        <Text px={[0, 4]} fontSize="xl" mb="8" fontWeight="bold">
          Employees:
        </Text>
        <Table size={["sm"]} fontSize={["smaller", "md"]} variant="striped">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Hourly Rate</Th>
              <Th>Hours Worked</Th>
              <Th pl="0">Salary</Th>
            </Tr>
          </Thead>
          <Tbody fontSize="sm">
            {employees.map((member, index) => (
              <Tr key={index}>
                <Td fontWeight="semibold">{member.clockifyName}</Td>
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
                <Td>{member.hoursWorked}</Td>

                <Td pl="0">
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
      </Box>
    </Flex>
  );
};

export default TeamSalaryReport;
