import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";

interface DateInputProps {
  startDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  endDate?: string;
  setEndDate?: React.Dispatch<React.SetStateAction<string>>;
  handleGenerateReport: () => Promise<void>;
}

const DateInputs: React.FC<DateInputProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleGenerateReport,
}) => {
  return (
    <Flex flexDirection="column" my={2}>
      <Flex direction="column">
        <Text fontSize={["lg", "xl"]} fontWeight="semibold" mb="4">
          {" "}
          {endDate ? "Time Period: from" : "Project Start Date"}
        </Text>
        <Flex>
          <FormControl>
            <FormLabel htmlFor="start-date">From</FormLabel>
            <Input
              bg="white"
              size={["sm", "sm", "md"]}
              color="blackAlpha.800"
              w="min-content"
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FormControl>
          {setEndDate && (
            <FormControl ml={4}>
              <FormLabel htmlFor="end-date">To</FormLabel>
              <Input
                bg="white"
                color="blackAlpha.800"
                size={["sm", "sm", "md"]}
                w="min-content"
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </FormControl>
          )}
        </Flex>
      </Flex>
      <Button
        size={["sm", "md", "lg"]}
        bg="facebook.400"
        color="white"
        w={["50%", "auto"]}
        rounded="xl"
        border="2px"
        _hover={{ bg: "facebook.200", color: "black", borderColor: "black" }}
        borderColor="white"
        my={6}
        onClick={handleGenerateReport}
      >
        Report
      </Button>
    </Flex>
  );
};
export default DateInputs;
