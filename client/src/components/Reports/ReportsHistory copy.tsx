import { useQuery } from "react-query";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useContext } from "react";
import { AccountContext } from "../../context/AccountContext";
import { TeamReport } from "../../interfaces/SalaryReportInterface";

const ReportsHistory = () => {
  const { setSalaryReport } = useContext(AccountContext);

  const { isLoading, isError, data } = useQuery("reports", async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("You're not logged in!");
    }
    const response = await fetch(
      "https://clock-app-uyb3.onrender.com/api/v1/salary",
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      console.error(`Error: ${data.message}`);
      throw new Error(data.message);
    }

    return data;
  });

  if (isLoading) return <Spinner />;
  if (isError) return <div>Something went wrong...</div>;

  return (
    <Flex flexDirection="column" mt="12">
      <Text fontWeight="bold" fontSize="2xl" mb="6">
        Reports History
      </Text>
      <Table w="max-content" variant="simple">
        <Thead>
          <Tr>
            <Th>Report Name</Th>
          </Tr>
        </Thead>
        <Tbody h="min-content">
          {data.map((report: TeamReport) => {
            return (
              <Tr
                onClick={() => {
                  setSalaryReport(report);
                }}
                opacity="0.7"
                cursor="pointer"
                _hover={{ opacity: 1, transition: "ease" }}
                key={report.id}
              >
                <Td>{report.reportName}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Flex>
  );
};

export default ReportsHistory;
