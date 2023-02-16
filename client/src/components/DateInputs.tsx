import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
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
    <Flex flexDirection="column" w="min-content" p="2" my={2}>
      <Flex>
        <FormControl>
          <FormLabel htmlFor="start-date" mb="4">
            {endDate ? "Time Period: from" : "Project Start Date"}
          </FormLabel>
          <Input
            w="min-content"
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </FormControl>
        {setEndDate && (
          <FormControl ml={4}>
            <FormLabel htmlFor="end-date">to</FormLabel>
            <Input
              w="min-content"
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </FormControl>
        )}
      </Flex>
      <Button my={6} onClick={handleGenerateReport}>
        Report
      </Button>
    </Flex>
  );
};
export default DateInputs;
