import React from "react";
import {
  Box,
  Text,
  Image,
  Link,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { SunIcon } from "@chakra-ui/icons";
import { Employee } from "../../interfaces/EmployeeInterface";
import { SalaryReportInterface } from "../../interfaces/SalaryReportInterface";

interface ReportProps {
  salaryReport: SalaryReportInterface;
  end?: string;
  start?: string;
}

const EmployeeSalaryReport: React.FC<ReportProps> = ({
  salaryReport,
  start,
  end,
}) => {
  const {
    clockifyName,
    email,
    hourlyRate,
    hoursWorked,
    profilePicture,
    salary,
  } = salaryReport;

  return (
    <Flex
      display="clumn"
      px={[0, 4, 8]}
      py={[8, 12]}
      border={["none", "1px"]}
      w="100%"
      bg={["none"]}
      opacity={1}
      boxShadow={["none"]}
    >
      {" "}
      {!salaryReport.hoursWorked ? (
        <Flex justify="center">
          <Text fontSize={["xl", "2xl"]}>No data for this period!</Text>
        </Flex>
      ) : (
        <>
          <Flex
            w="full"
            justify="space-between"
            align={["flex-start", "center"]}
            mb={[4, 12]}
          >
            <Text fontSize={["xl", "2xl"]} fontWeight="semibold">
              {clockifyName}
            </Text>
            {profilePicture ? (
              <Image
                src={profilePicture}
                mb={[3, 0]}
                boxSize={["50px", "70px", "90px"]}
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
          </Flex>
          <Box mt={5}>
            <Text fontSize={["md", "lg"]} fontWeight="bold">
              Email:{" "}
              <Text as="span" fontWeight="semibold">
                {email}
              </Text>
            </Text>
          </Box>
          <Box mt={2}>
            <Text fontSize={["md", "lg"]} fontWeight="bold">
              Hours worked:{" "}
              <Text as="span" fontWeight="semibold">
                {hoursWorked ? hoursWorked : 0}
              </Text>
            </Text>
          </Box>
          <Box mt={2}>
            <Text fontSize={["md", "lg"]} fontWeight="bold">
              Hourly rate:{" "}
              <Text as="span" fontWeight="semibold">
                {hourlyRate ? hourlyRate : 0}zł/h
              </Text>
            </Text>
          </Box>
          <Box mt={2} mb="12">
            <Text fontSize={["md", "lg"]} fontWeight="bold">
              Time Period:{" "}
              <Text as="span" fontWeight="semibold">
                {start && end
                  ? `from: ${start} to: ${end}`
                  : "from the beggining"}
              </Text>
            </Text>
          </Box>
          <Box mt={2}>
            <Text fontSize={["md", "lg"]} fontWeight="bold">
              Salary:{" "}
              <Text as="span" fontWeight="semibold">
                {salary ? Number(salary.toFixed(1)) : 0}zł
              </Text>
            </Text>
          </Box>
        </>
      )}
    </Flex>
  );
};

export default EmployeeSalaryReport;
