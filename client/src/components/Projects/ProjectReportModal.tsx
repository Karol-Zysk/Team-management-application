import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Heading,
  Text,
  useColorModeValue,
  Flex,
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { ProjectReport } from "../../interfaces/ProjectReportInterface";

type ProjectModalProps = {
  projectReport: ProjectReport;
  handleCloseModal: () => void;
  isOpen: boolean;
};

const ProjectModal: React.FC<ProjectModalProps> = ({
  projectReport,
  isOpen,
  handleCloseModal,
}) => {
  const {
    createdAt,
    active,
    budgetEstimate,
    memberships,
    projectStartDate,
    projectName,
    duration,
    expenses,
    note,
    summary,
    timeEstimate,
  } = projectReport;

  return (
    <Modal size={["2xl"]} isOpen={isOpen} onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent maxH="90vh" overflowY="scroll" p="4" border="2px">
        <ModalCloseButton />
        <ModalBody>
          <Flex display="clumn" opacity={1}>
            <Heading fontSize="2xl" fontWeight="semibold" mb={8}>
              {projectName}
            </Heading>

            <Text mb={["2", "1"]} fontSize={["sm", "md"]}>
              <strong>Start Date:</strong>{" "}
              {new Date(projectStartDate).toLocaleDateString()}{" "}
            </Text>
            <Text mb={["2", "1"]} fontSize={["sm", "md"]}>
              <strong>Total project time:</strong> {duration} h{" "}
            </Text>
            <Text mb={["2", "1"]} fontSize={["sm", "md"]}>
              <strong>Budget Estimate:</strong> {budgetEstimate} zł
            </Text>
            <Text mb={["2", "1"]} fontSize={["sm", "md"]}>
              {" "}
              <strong>Time Estimate:</strong> {timeEstimate} h
            </Text>
            <Text mb={["2", "1"]} fontSize={["sm", "md"]}>
              {" "}
              <strong>Expenses:</strong> {expenses}
              {" zł"}
            </Text>
            <Text mb={["2", "1"]} fontSize={["sm", "md"]}>
              {" "}
              <strong>Note:</strong> {note}
            </Text>
            <Box overflowX={["scroll", "auto"]}>
              {memberships.length > 0 ? (
                <>
                  <Text px="1" fontSize="md" mb="8" fontWeight="bold">
                    Employees:
                  </Text>
                  <Table
                    size={["sm"]}
                    fontSize={["smaller", "md"]}
                    variant="striped"
                  >
                    <Thead>
                      <Tr>
                        <Th>Member</Th>
                        <Th>Hours Worked</Th>
                        <Th>Hourly Rate</Th>
                        <Th>Salary</Th>
                      </Tr>
                    </Thead>
                    <Tbody fontSize="sm">
                      {memberships.map((member, index) => (
                        <Tr border="2px" key={index}>
                          <Td fontWeight="semibold">{member.clockifyName}</Td>
                          <Td>{member.hoursWorked}</Td>
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
                          <Td>
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
                </>
              ) : (
                <Flex p="1" my="1" border="2px" justify="center">
                  <Text
                    color="yellow.500"
                    fontWeight="semibold"
                    fontSize={["sm", "md"]}
                  >
                    No members ? Maybe wrong time period!
                  </Text>
                </Flex>
              )}
            </Box>
            <Box mt={6}>
              <Text mb={["2", "2"]} fontSize={["sm", "md"]}>
                <strong>Summary:</strong>
                <Text as="span" color={summary > 0 ? "green" : "red"}>
                  {" "}
                </Text>
                {summary} zł{" "}
              </Text>
              <Text mb={["2", "2"]} fontSize={["sm", "md"]}>
                <strong>Created At:</strong>{" "}
                {new Date(createdAt).toLocaleString()}{" "}
              </Text>
              <Text mb={["2", "2"]} fontSize={["sm", "md"]}>
                <strong>Active:</strong> {active ? "Yes" : "No"}
              </Text>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProjectModal;
