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

const TeamSalaryReport: React.FC<TeamSalaryProps> = ({
  salaryReport,
}) => {
  const { employees, id, reportName } = salaryReport;

  const shadow = useColorModeValue(
    "4px 4px 4px 2px  black",
    "2px 2px 1px 2px  white"
  );

  const bg = useColorModeValue("#f6f6f6", "gray.800");

  return (
    <Flex
      transform={["none", "translate(30px,-20px)"]}
      display="column"
      px="4"
      py="12"
      w="100%"
      bg={bg}
      opacity={1}
      boxShadow={shadow}
    >
      <Flex px="4" align="center" mb={5}>
        <Text fontSize="xl" fontWeight="bold">
          {reportName}
        </Text>
      </Flex>

      <Box mb={5}>
        <Text px="4" fontSize="xl" mb="8" fontWeight="bold">
          Employees:
        </Text>
        <Table w="100%" variant="striped">
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
                    {member.salary || (
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
