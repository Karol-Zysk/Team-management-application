import { EditIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import EditModal from "../components/EditEmployeeModal";
import { AccountContext, UserData } from "../context/AccountContext";
import { Employee } from "../interfaces/EmployeeInterface";
import { useQuery } from "react-query";
import { baseUrl } from "../utils/origin";
import PageTitle from "../components/PageTitle";
import Layout from "../components/Layout";

const Employees = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState<Employee>();
  const { error, user } = useContext(AccountContext);

  function handleCloseModal() {
    setIsOpen(false);
  }

  function handleOpenModal(employee: Employee) {
    setIsOpen(true);
    setId(employee);
  }

  const {
    data: employees = [],
    isLoading,
    isError,
    refetch,
  } = useQuery("employees", async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("You're not logged in!");
    }

    const response = await fetch(`${baseUrl}/employees`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Error: ${data.message}`);
      throw new Error(data.message);
    }

    return data;
  });

  if (isError) {
    return <Box>{error}</Box>;
  }

  const activeUser = user as UserData;

  if (isLoading) {
    return (
      <Box>
        <Spinner />
      </Box>
    );
  }

  return (
    <Layout title={`${activeUser.companyName} Team`}>
      <Table fontSize={["smaller", "md"]} w={["min", "100%"]} variant="striped">
        <Thead w={["min", "100%"]}>
          <Tr>
            <Th w={["min", "max-content"]} boxShadow="md">
              Lp.
            </Th>
            <Th w={["min", "max-content"]} boxShadow="md">
              Clockify Name
            </Th>
            <Th w={["min", "max-content"]} boxShadow="md">
              first name
            </Th>
            <Th w={["min", "max-content"]} boxShadow="md">
              last name
            </Th>
            <Th w={["min", "max-content"]} boxShadow="md">
              email
            </Th>
            <Th w={["min", "max-content"]} boxShadow="md">
              hourly rate
            </Th>
            <Th w={["min", "max-content"]} boxShadow="md">
              Avatar
            </Th>
            <Th w={["min", "max-content"]} boxShadow="md">
              Edit
            </Th>
            <Th w={["min", "max-content"]} boxShadow="md">
              Report
            </Th>
          </Tr>
        </Thead>
        <Tbody w="max-content" h="min-content">
          {employees.map((employee: Employee, index: number) => {
            return (
              <Tr w="max-content" key={employee.id}>
                <Td
                  borderRight="1px"
                  boxShadow="md"
                  borderColor="blackAlpha.100"
                >
                  {index + 1}.
                </Td>
                <Td
                  borderRight="1px"
                  boxShadow="md"
                  borderColor="blackAlpha.100"
                >
                  {employee.clockifyName}
                </Td>
                <Td boxShadow="md">{employee.firstName}</Td>
                <Td boxShadow="md">{employee.lastName}</Td>
                <Td boxShadow="md">{employee.email}</Td>
                <Td boxShadow="md">{employee.hourlyRate} zł/h</Td>
                <Td boxShadow="md">
                  <Avatar h="8" src={`${employee.profilePicture}`} />
                </Td>
                <Td boxShadow="md">
                  <EditIcon
                    cursor="pointer"
                    fontSize={["md", "md", "xl"]}
                    onClick={() => handleOpenModal(employee)}
                  />
                </Td>
                <Td boxShadow="md">
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
            refetch={refetch}
          />
        )}
      </Table>
    </Layout>
  );
};

export default Employees;
