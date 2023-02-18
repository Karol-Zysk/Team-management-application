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
import { motion } from "framer-motion";
import { baseUrl } from "../utils/origin";

const ApiKeyInput = ({}) => {
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
    companyName,
    setCompanyName,
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
      const response = await fetch(`${baseUrl}/users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          clockify_api_key: apiKey,
          companyName: companyName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setIsApiKeyValid(true);
      setCompanyName(companyName);
      setIsActive(true);
      setError(null);
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
      toast({
        title: "Error",
        description: `${err.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
            isDisabled={isApiKeyValid || isActive}
            required={true}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          {companyName && <CheckIcon color="green" />}
        </VStack>
        <FormLabel mt="6" htmlFor="clockifyApiKey">{`${
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

          {isApiKeyValid && <CheckIcon color="green" />}
        </VStack>
        {!isActive && (
          <Text color="red.700" fontSize={["sm", "sm", "md"]} my="4">
            Providing a valid API key enables access to the application's
            functionality
          </Text>
        )}
        <ButtonGroup mt="4">
          <Button
            type="submit"
            color={isApiKeyValid ? "green" : ""}
            isDisabled={isApiKeyValid || isActive}
          >
            {isActive ? <CheckIcon /> : "Activate"}
          </Button>
          <Button onClick={editInputKeyHandler}>Edit</Button>
        </ButtonGroup>
      </form>
    </motion.div>
  );
};

export default ApiKeyInput;
