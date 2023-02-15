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
    <Box p={5} shadow="md" w="full" borderWidth="1px">
      <Flex align="center">
        {profilePicture ? (
          <Image src={profilePicture} mr={3} />
        ) : (
          <Box
            as={SunIcon}
            size="50px"
            mr={3}
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
        <Text>{hoursWorked}</Text>
      </Box>
      <Box mt={2}>
        <Text fontWeight="bold">Hourly rate:</Text>
        <Text>{hourlyRate}zł/h</Text>
      </Box>
      <Box mt={2}>
        <Text fontWeight="bold">Salary:</Text>
        <Text>{salary.toFixed(0)}zł</Text>
      </Box>
    </Box>
  );
};

export default EmployeeSalaryReport;
