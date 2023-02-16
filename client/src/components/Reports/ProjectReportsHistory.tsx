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
import { ProjectReport } from "../../interfaces/ProjectReportInterface";

const ProjectReportsHistory = () => {
  const { setProjectReport } = useContext(AccountContext);

  const { isLoading, isError, data } = useQuery("reports", async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("You're not logged in!");
    }
    const response = await fetch(
      "http://127.0.0.1:4000/api/v1/projects/reports",
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
  const reports = data as ProjectReport[];
  if (isLoading) return <Spinner />;
  if (isError) return <div>Something went wrong...</div>;

  return (
    <>
      {reports.length > 0 ? (
        <Flex flexDirection="column" mt="12">
          <Table w="max-content" variant="simple">
            <Thead>
              <Tr>
                <Th>Report Name</Th>
              </Tr>
            </Thead>
            <Tbody h="min-content">
              {data.map((report: ProjectReport) => {
                return (
                  <Tr
                    onClick={() => {
                      setProjectReport(report);
                    }}
                    opacity="0.7"
                    cursor="pointer"
                    _hover={{ opacity: 1, transition: "ease" }}
                    key={report.id}
                  >
                    <Td>{report.projectName}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Flex>
      ) : (
        "Already Empty"
      )}
    </>
  );
};

export default ProjectReportsHistory;
