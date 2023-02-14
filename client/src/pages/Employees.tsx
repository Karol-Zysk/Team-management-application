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
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EditModal from "../components/EditEmployeeModal";
import { AccountContext } from "../context/AccountContext";
import { Employee } from "../interfaces/EmployeeInterface";

const Employees = () => {
  const [employees, setEmployee] = useState<Employee[]>([]);
  const toast = useToast();
  const { setError, error } = useContext(AccountContext);
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState("");

  function handleCloseModal() {
    setIsOpen(false);
  }
  function handleOpenModal(employeeId: string) {
    setIsOpen(true);
    setId(employeeId);
  }

  useEffect(() => {
    return () => {
      handleGetEmployee(event);
    };
  }, []);
  async function handleGetEmployee(event: any) {
    event.preventDefault();
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setError("You're not logged in!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:4000/employees", {
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

      const employee: Employee[] = data;

      setEmployee(employee);

      setError(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: `${error}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  if (error) return <Box>{error}</Box>;
  if (employees.length === 0)
    return (
      <Box>
        <Spinner />
      </Box>
    );
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Clockify Name</Th>
          <Th>first name</Th>
          <Th>last name</Th>
          <Th>email</Th>
          <Th>hourly rate</Th>
          <Th>Avatar</Th>
          <Th>Edit</Th>
          <Th>Report</Th>
        </Tr>
      </Thead>
      <Tbody>
        {employees.map((employee: Employee) => {
          return (
            <Tr key={employee.id}>
              <Td>{employee.clockifyName}</Td>
              <Td>{employee.firstName}</Td>
              <Td>{employee.lastName}</Td>
              <Td>{employee.email}</Td>
              <Td>{employee.hourlyRate} zł/h</Td>
              <Td>
                <Image h="12" src={`${employee.profilePicture}`} />
              </Td>
              <Td>
                <EditIcon
                  cursor="pointer"
                  fontSize={["md", "md", "xl"]}
                  onClick={() => handleOpenModal(employee.id)}
                />
              </Td>
              <Td>
                <Link to={`/employees/${employee.id}`}>
                  <Button color="green.400">Salary Report</Button>
                </Link>
              </Td>
              <EditModal
                handleCloseModal={handleCloseModal}
                employeeId={id}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

export default Employees;
