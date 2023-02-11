import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Image,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../context/AccountContext";
import { Employee } from "../interfaces/EmployeeInterface";

const Employees = () => {
  const [employees, setEmployee] = useState<Employee[]>([]);
  const { setError, error } = useContext(AccountContext);

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
      console.error(err.message);
      setError(err.message);
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
        </Tr>
      </Thead>
      <Tbody>
        {employees.map((employee: Employee) => (
          <Tr key={employee.id}>
            <Td>{employee.clockifyName}</Td>
            <Td>{employee.firstName}</Td>
            <Td>{employee.lastName}</Td>
            <Td>{employee.email}</Td>
            <Td>{employee.hourlyRate}</Td>
            <Td>
              <Image h="12" src={`${employee.profilePicture}`} />
            </Td>
            <Td>
              <EditIcon fontSize="xl" />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default Employees;
