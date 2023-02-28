import { EditIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditModal from "../components/Employee/EditEmployeeModal";
import { AccountContext, UserData } from "../context/AccountContext";
import { Employee } from "../interfaces/EmployeeInterface";
import { useQuery } from "react-query";
import { baseUrl } from "../utils/origin";
import Layout from "../components/Layout";
import ApiClient from "../utils/ApiClient";

const Employees = () => {
  const { error, user } = useContext(AccountContext);
  const [employees, setEmployees] = useState<Employee[]>();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState<Employee>();

  const color = useColorModeValue("black", "white");
  const bg = useColorModeValue("facebook.300", "gray.900");
  const bgHead = useColorModeValue("facebook.500", "black");
  const toast = useToast();

  function handleCloseModal() {
    setIsOpen(false);
  }

  function handleOpenModal(employee: Employee) {
    setIsOpen(true);
    setId(employee);
  }

  useEffect(() => {
    handleGetEmployees()
  }, [])

  const apiClient = new ApiClient();
  const handleGetEmployees = async () => {
    setIsLoading(true);
    const response = await apiClient.get<Employee[]>(`/employees`);
    try {
      setEmployees(response);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      console.error(err.message);
      toast({
        title: "Error",
        description: `${err.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const activeUser = user as UserData;

  if (isLoading) {
    return (
      <Flex minH="50vh" justify="center" align="center">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.300"
          color="facebook.400"
          size="xl"
        />
      </Flex>
    );
  }

  return (
    <Layout
      title={`${activeUser.companyName ? activeUser.companyName : "Your"} Team`}
    >
      <Box minH="50vh" mx={[-4, 0]} overflowX={["scroll", "auto"]}>
        <Table
          bg={bg}
          size={["sm"]}
          fontSize={["smaller", "md"]}
          variant="striped"
        >
          <Thead bg={bgHead} w={["min", "100%"]}>
            <Tr>
              <Th py="4" color={color}>
                Lp.
              </Th>
              <Th py="4" color={color}>
                Clockify Name
              </Th>
              <Th py="4" color={color}>
                first name
              </Th>
              <Th py="4" color={color}>
                last name
              </Th>
              <Th py="4" color={color}>
                email
              </Th>
              <Th py="4" color={color}>
                hourly rate
              </Th>
              <Th py="4" color={color}>
                Avatar
              </Th>
              <Th py="4" color={color}>
                Edit
              </Th>
              <Th py="4" color={color}>
                Report
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {employees?.map((employee: Employee, index: number) => {
              return (
                <Tr
                  color={useColorModeValue("black", "white")}
                  key={employee.id}
                >
                  <Td borderRight="1px" borderColor="blackAlpha.100">
                    {index + 1}.
                  </Td>
                  <Td borderRight="1px" borderColor="blackAlpha.100">
                    {employee.clockifyName}
                  </Td>
                  <Td>{employee.firstName}</Td>
                  <Td>{employee.lastName}</Td>
                  <Td>{employee.email}</Td>
                  <Td>{employee.hourlyRate} zł/h</Td>
                  <Td>
                    <Avatar h="8" src={`${employee.profilePicture}`} />
                  </Td>
                  <Td>
                    <EditIcon
                      cursor="pointer"
                      fontSize={["md", "md", "xl"]}
                      onClick={() => handleOpenModal(employee)}
                    />
                  </Td>
                  <Td>
                    <Link to={`/employees/${employee.id}`}>
                      <Button
                        size={["xs", "sm", "md"]}
                        bg="facebook.400"
                        color="white"
                        rounded="xl"
                        border="2px"
                        _hover={{
                          bg: "facebook.200",
                          color: "black",
                          borderColor: "black",
                        }}
                        borderColor="white"
                        leftIcon={<InfoIcon />}
                      >
                        Report
                      </Button>
                    </Link>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
          {id && (
            <EditModal
              handleCloseModal={handleCloseModal}
              employee={id!}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          )}
        </Table>
      </Box>
    </Layout>
  );
};

export default Employees;
