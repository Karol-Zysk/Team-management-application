import React from "react";
import { Box, Text, Image, Link, Flex } from "@chakra-ui/react";
import { SunIcon } from "@chakra-ui/icons";
import { Employee } from "../../interfaces/EmployeeInterface";
import { SalaryReportInterface } from "../../interfaces/SalaryReportInterface";

interface ReportProps {
  salaryReport: SalaryReportInterface;
}

const EmployeeSalaryReport: React.FC<ReportProps> = ({
  salaryReport: {
    clockifyName,
    email,
    hourlyRate,
    hoursWorked,
    profilePicture,
    salary,
  },
}) => {
  return (
    <Box shadow="md" borderWidth="1px" w="full">
      <Flex
        p={8}
        direction={["column", "row"]}
        align={["flex-start", "center"]}
      >
        {profilePicture ? (
          <Image
            src={profilePicture}
            mr={[0, 3]}
            mb={[3, 0]}
            boxSize="50px"
            borderRadius="full"
          />
        ) : (
          <Box
            as={SunIcon}
            size="50px"
            mr={[0, 3]}
            mb={[3, 0]}
            bg="gray.300"
            color="gray.700"
            borderRadius="full"
          />
        )}
        <Text fontSize="xl">{clockifyName}</Text>
      </Flex>
      <Box mt={5}>
        <Text fontWeight="bold">Email:</Text>
        <Link href={`mailto:${email}`}>{email}</Link>
      </Box>
      <Box mt={2}>
        <Text fontWeight="bold">Godziny pracy:</Text>
        <Text>{hoursWorked ? hoursWorked : 0}</Text>
      </Box>
      <Box mt={2}>
        <Text fontWeight="bold">Hourly rate:</Text>
        <Text>{hourlyRate ? hourlyRate : 0}zł/h</Text>
      </Box>
      <Box mt={2}>
        <Text fontWeight="bold">Salary:</Text>
        <Text>{salary ? Number(salary.toFixed(1)) : 0}zł</Text>
      </Box>
    </Box>
  );
};

export default EmployeeSalaryReport;
