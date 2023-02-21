import { CheckIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  FormLabel,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useContext } from "react";
import { AccountContext } from "../context/AccountContext";
import { baseUrl } from "../utils/origin";

interface InputProps {
  error: any;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const CompanyNameInput: React.FC<InputProps> = ({}) => {
  const toast = useToast();
  const { companyName, setCompanyName, error, setError } =
    useContext(AccountContext);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setError("You're not logged in");
      toast({
        title: "Error",
        description: `${error}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          companyName: companyName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setCompanyName(companyName);
      setError(null);
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
      toast({
        title: "Error",
        description: `${error}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {!companyName && (
        <Text fontSize={["lg", "xl", "2xl"]} mb="12">
          Set Your Company Name
        </Text>
      )}
      <form onSubmit={handleSubmit}>
        <FormLabel htmlFor="companyName">{`${
          companyName ? "Company Name" : "Enter Company Name"
        } `}</FormLabel>
        <VStack mt="4" h="min-content" flexDirection="row" align="center">
          <Input
            w="70%"
            id="companyName"
            placeholder={`${companyName ? companyName : "Enter Company Name"}`}
            mr="3"
            size="sm"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          {companyName && <CheckIcon color="green" />}
        </VStack>
        <ButtonGroup w="70%" justifyContent="left" alignContent="right" mt="4">
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
            type="submit"
          >
            Submit
          </Button>
          {/* <Button size={["sm", "md", "lg"]} onClick={editInputHandler}>
            Edit
          </Button> */}
        </ButtonGroup>
      </form>
    </>
  );
};
export default CompanyNameInput;
