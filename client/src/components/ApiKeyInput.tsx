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

interface InputProps {
  error: any;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ApiKeyInput: React.FC<InputProps> = ({}) => {
  const toast = useToast();
  const {
    isApiKeyValid,
    setIsApiKeyValid,
    apiKey,
    setApiKey,
    isActive,
    setIsActive,
    error,
    setError,
  } = useContext(AccountContext);

  const editInputKeyHandler = () => {
    setIsApiKeyValid(false);
    setIsActive(false);
  };

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
      const response = await fetch(`http://127.0.0.1:4000/users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          clockify_api_key: apiKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setIsApiKeyValid(true);
      setIsActive(true);
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
      {!isActive && (
        <Text fontSize={["lg", "xl", "2xl"]} mb="12">
          To fully use our application, please enter your Clockify API key.
        </Text>
      )}
      <form onSubmit={handleSubmit}>
        <FormLabel htmlFor="clockifyApiKey">{`${
          isActive ? "You have a valid" : "Enter valid"
        } Clockify API Key`}</FormLabel>
        <VStack mt="4" h="min-content" flexDirection="row" align="center">
          <Input
            w="70%"
            id="clockifyApiKey"
            placeholder="Clockify API Key"
            mr="3"
            size="sm"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            isDisabled={isApiKeyValid || isActive}
          />

          {isActive || isApiKeyValid ? <CheckIcon color="green" /> : null}
        </VStack>
        <ButtonGroup w="70%" justifyContent="left" alignContent="right" mt="4">
          <Button
            size={["sm", "md", "lg"]}
            isDisabled={isApiKeyValid || isActive}
            type="submit"
          >
            Submit
          </Button>
          <Button size={["sm", "md", "lg"]} onClick={editInputKeyHandler}>
            Edit
          </Button>
        </ButtonGroup>
      </form>
    </>
  );
};
export default ApiKeyInput;
