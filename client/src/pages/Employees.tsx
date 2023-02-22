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
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import EditModal from "../components/Employee/EditEmployeeModal";
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
    <Layout
      title={`${activeUser.companyName ? activeUser.companyName : "Your"} Team`}
    >
      <Box
        p="8"
        boxShadow={useColorModeValue("3px 3px 3px black", "3px 3px 3px  gray")}
        minH="50vh"
        bg={useColorModeValue("facebook.400", "black")}
        overflowX={["scroll", "auto"]}
      >
        <Table size={["sm"]} fontSize={["smaller", "md"]} variant="striped">
          <Thead
            color={useColorModeValue("black", "white")}
            w={["min", "100%"]}
          >
            <Tr>
              <Th color={useColorModeValue("black", "white")}>Lp.</Th>
              <Th color={useColorModeValue("black", "white")}>Clockify Name</Th>
              <Th color={useColorModeValue("black", "white")}>first name</Th>
              <Th color={useColorModeValue("black", "white")}>last name</Th>
              <Th color={useColorModeValue("black", "white")}>email</Th>
              <Th color={useColorModeValue("black", "white")}>hourly rate</Th>
              <Th color={useColorModeValue("black", "white")}>Avatar</Th>
              <Th color={useColorModeValue("black", "white")}>Edit</Th>
              <Th color={useColorModeValue("black", "white")}>Report</Th>
            </Tr>
          </Thead>
          <Tbody>
            {employees.map((employee: Employee, index: number) => {
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
              refetch={refetch}
            />
          )}
        </Table>
      </Box>
    </Layout>
  );
};

export default Employees;
