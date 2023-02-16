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
  FormHelperText,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AccountContext } from "../context/AccountContext";
import { Employee } from "../interfaces/EmployeeInterface";
import { baseUrl } from "../utils/origin";

type ModalProps = {
  handleCloseModal: () => void;
  isOpen: boolean;
  employeeId: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  employee: Employee;
};

const EditModal: React.FC<ModalProps> = ({
  employee,
  employeeId,
  handleCloseModal,
  isOpen,
  setIsOpen,
}) => {
  const { setError, error } = useContext(AccountContext);
  const toast = useToast();

  const [hourlyRate, setHourlyRate] = useState<number | string>();
  const [firstName, setFirstName] = useState<string | undefined>(undefined);
  const [lastName, setLastName] = useState<string | undefined>(undefined);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  async function handleEditEmployee(event: any) {
    setIsLoading(true);
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setError("You're not logged in!");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/employees/${employeeId}`, {
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
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message);
      toast({
        title: "Error",
        description: `${error}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{employeeId}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleEditEmployee}>
            <FormControl>
              <FormLabel htmlFor="firstName">First Name</FormLabel>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="lastName">Last Name</FormLabel>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="hourlyRate">Hourly Rate</FormLabel>
              <Input
                id="hourlyRate"
                type="number"
                value={hourlyRate}
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
                value={profilePicture}
                onChange={(event) => setProfilePicture(event.target.value)}
              />
            </FormControl>
            <ModalFooter>
              <Button
                background="blue"
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
