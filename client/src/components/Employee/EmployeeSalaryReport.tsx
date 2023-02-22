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
  salaryReport: {
    clockifyName,
    email,
    hourlyRate,
    hoursWorked,
    profilePicture,
    salary,
  },
  start,
  end,
}) => {
  const shadow = useColorModeValue(
    "4px 4px 4px 2px  black",
    "2px 2px 1px 2px  white"
  );

  const bg = useColorModeValue("#f6f6f6", "gray.800");

  return (
    <Flex
      transform={["none", "translate(30px,-20px)"]}
      display="column"
      px="8"
      py="12"
      w="100%"
      bg={bg}
      opacity={1}
      boxShadow={shadow}
    >
      <Flex
        w="full"
        direction={["column", "row"]}
        justify="space-between"
        align={["flex-start", "center"]}
      >
        <Text fontSize="3xl" fontWeight="semibold">
          {clockifyName}
        </Text>
        {profilePicture ? (
          <Image
            src={profilePicture}
            mr={[0, 12]}
            mb={[3, 0]}
            boxSize={["50px", "70px"]}
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
        <Text fontSize={["lg", "xl"]} fontWeight="bold">
          Email:{" "}
          <Text as="span" fontWeight="semibold">
            {email}
          </Text>
        </Text>
      </Box>
      <Box mt={2}>
        <Text fontSize={["lg", "xl"]} fontWeight="bold">
          Hours worked:{" "}
          <Text as="span" fontWeight="semibold">
            {hoursWorked ? hoursWorked : 0}
          </Text>
        </Text>
      </Box>
      <Box mt={2}>
        <Text fontSize={["lg", "xl"]} fontWeight="bold">
          Hourly rate:{" "}
          <Text as="span" fontWeight="semibold">
            {hourlyRate ? hourlyRate : 0}zł/h
          </Text>
        </Text>
      </Box>
      <Box mt={2} mb="12">
        <Text fontSize={["lg", "xl"]} fontWeight="bold">
          Time Period:{" "}
          <Text as="span" fontWeight="semibold">
            {start && end ? `from: ${start} to: ${end}` : "from the beggining"}
          </Text>
        </Text>
      </Box>
      <Box mt={2}>
        <Text fontSize={["lg", "xl"]} fontWeight="bold">
          Salary:{" "}
          <Text as="span" fontWeight="semibold">
            {salary ? Number(salary.toFixed(1)) : 0}zł
          </Text>
        </Text>
      </Box>
    </Flex>
  );
};

export default EmployeeSalaryReport;
