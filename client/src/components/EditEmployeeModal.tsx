import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import { AccountContext } from "../context/AccountContext";
import { Employee } from "../interfaces/EmployeeInterface";
import { baseUrl } from "../utils/origin";

type ModalProps = {
  handleCloseModal: () => void;
  isOpen: boolean;
  employee: Employee;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<any, unknown>>;
};

const EditModal: React.FC<ModalProps> = ({
  employee,
  handleCloseModal,
  isOpen,
  setIsOpen,
  refetch,
}) => {
  const { setError, error } = useContext(AccountContext);
  const toast = useToast();

  const [currentEmployee, setCurrentEmployee] = useState<Employee>({
    ...(employee as Employee),
    firstName: employee.firstName,
    lastName: employee.lastName,
  });

  const [hourlyRate, setHourlyRate] = useState<number | string | null>();
  const [firstName, setFirstName] = useState<string | null>();
  const [lastName, setLastName] = useState<string | null>();
  const [profilePicture, setProfilePicture] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentEmployee(employee);
      setFirstName(currentEmployee.firstName || null);
      setLastName(currentEmployee.lastName || null);
      setHourlyRate(currentEmployee.hourlyRate || null);
      setProfilePicture(currentEmployee.profilePicture || null);
    }
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) {
      setCurrentEmployee({
        firstName: null,
        lastName: null,
        hourlyRate: null,
        clockifyName: null,
        profilePicture: null,
      });
    }
  }, [isOpen]);

  async function handleEditEmployee(event: any) {
    event.preventDefault();
    setIsLoading(true);
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setError("You're not logged in!");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/employees/${employee.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          hourlyRate: hourlyRate && hourlyRate,
          firstName: firstName && firstName,
          lastName: lastName && lastName,
          profilePicture: profilePicture && profilePicture,
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      setIsLoading(false);
      setIsOpen(false);
      setError(null);
      refetch();
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message);
      toast({
        title: "Error",
        description: `${err.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent p="8" border="2px">
        <ModalHeader>Edit {employee.clockifyName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleEditEmployee}>
            <FormControl>
              <FormLabel htmlFor="firstName">First Name</FormLabel>
              <Input
                id="firstName"
                type="text"
                value={firstName || currentEmployee.firstName!}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="lastName">Last Name</FormLabel>
              <Input
                id="lastName"
                type="text"
                value={lastName || currentEmployee.lastName!}
                onChange={(event) => setLastName(event.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="hourlyRate">Hourly Rate</FormLabel>
              <Input
                id="hourlyRate"
                type="number"
                value={hourlyRate || currentEmployee.hourlyRate!}
                onChange={(event) => {
                  const value = event.target.value;
                  setHourlyRate(Number(value));
                }}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="profilePicture">Profile Picture</FormLabel>
              <Input
                id="profilePicture"
                type="text"
                value={profilePicture || currentEmployee.profilePicture!}
                onChange={(event) => setProfilePicture(event.target.value)}
              />
            </FormControl>
            <ModalFooter>
              <Button
                size={["sm", "md", "lg"]}
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
                mr={3}
                isLoading={isLoading}
                type="submit"
              >
                Save Changes
              </Button>
              <Button onClick={handleCloseModal}>Close</Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
