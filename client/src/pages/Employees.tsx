import { EditIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
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
import { AccountContext } from "../context/AccountContext";
import { Employee } from "../interfaces/EmployeeInterface";
import { useQuery } from "react-query";

const Employees = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState("");
  const { error } = useContext(AccountContext);

  function handleCloseModal() {
    setIsOpen(false);
  }

  function handleOpenModal(employeeId: string) {
    setIsOpen(true);
    setId(employeeId);
  }

  const {
    data: employees = [],
    isLoading,
    isError,
  } = useQuery("employees", async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("You're not logged in!");
    }

    const response = await fetch(
      "https://clock-app-uyb3.onrender.com/api/v1/employees",
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );

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

  if (isLoading) {
    return (
      <Box>
        <Spinner />
      </Box>
    );
  }

  return (
    <Table mt="20" variant="striped">
      <Thead>
        <Tr>
          <Th boxShadow="md">Clockify Name</Th>
          <Th boxShadow="md">first name</Th>
          <Th boxShadow="md">last name</Th>
          <Th boxShadow="md">email</Th>
          <Th boxShadow="md">hourly rate</Th>
          <Th boxShadow="md">Avatar</Th>
          <Th boxShadow="md">Edit</Th>
          <Th boxShadow="md">Report</Th>
        </Tr>
      </Thead>
      <Tbody h="min-content">
        {employees.map((employee: Employee) => {
          return (
            <Tr key={employee.id}>
              <Td borderRight="1px" boxShadow="md" borderColor="blackAlpha.100">
                {employee.clockifyName}
              </Td>
              <Td boxShadow="md">{employee.firstName}</Td>
              <Td boxShadow="md">{employee.lastName}</Td>
              <Td boxShadow="md">{employee.email}</Td>
              <Td boxShadow="md">{employee.hourlyRate} zł/h</Td>
              <Td boxShadow="md">
                <Image h="12" src={`${employee.profilePicture}`} />
              </Td>
              <Td boxShadow="md">
                <EditIcon
                  cursor="pointer"
                  fontSize={["md", "md", "xl"]}
                  onClick={() => handleOpenModal(employee.id)}
                />
              </Td>
              <Td boxShadow="md">
                <Link to={`/employees/${employee.id}`}>
                  <Button
                    border="1px"
                    color="gray.500"
                    boxShadow="md"
                    borderColor="gray.300"
                    _hover={{ bg: "gray.200" }}
                    leftIcon={<InfoIcon />}
                    size="sm"
                  >
                    Report
                  </Button>
                </Link>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
      <EditModal
        handleCloseModal={handleCloseModal}
        employeeId={id}
        employee={employees}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </Table>
  );
};

export default Employees;
