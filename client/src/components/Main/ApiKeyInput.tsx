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
import { useContext, useState } from "react";
import { AccountContext } from "../../context/AccountContext";
import ApiClient from "../../utils/ApiClient";
import { baseUrl } from "../../utils/origin";

const ApiKeyInput = ({}) => {
  const toast = useToast();
  const {
    isApiKeyValid,
    setIsApiKeyValid,
    isActive,
    setIsActive,
    error,
    setError,
    companyName,
    setCompanyName,
  } = useContext(AccountContext);

  const apiClient = new ApiClient();

  const [apiKey, setApiKey] = useState<string>("");
  const editInputKeyHandler = () => {
    setIsApiKeyValid(false);
    setIsActive(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      const response = await apiClient.patch("/users", {
        ...(apiKey !== "" ? { clockify_api_key: apiKey } : {}),
        companyName,
      });
      setIsApiKeyValid(true);
      setCompanyName(companyName!);
      setIsActive(true);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: `${err}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {!isActive ? (
        <form onSubmit={handleSubmit}>
          <FormLabel fontSize={["lg", "2xl"]} htmlFor="companyName">{`${
            companyName ? "Company Name" : "Enter Company Name"
          } `}</FormLabel>
          <VStack mt="4" h="min-content" flexDirection="row" align="center">
            <Input
              id="companyName"
              w="70%"
              placeholder={`${
                companyName ? companyName : "Enter Company Name"
              }`}
              mr="3"
              size={["sm", "md"]}
              _placeholder={{ opacity: 0.8, color: "gray.500" }}
              value={companyName}
              isDisabled={isActive}
              required={true}
              bg="white"
              color="black"
              onChange={(e) => setCompanyName(e.target.value)}
            />

            {companyName && <CheckIcon fontSize={24} color="green" />}
          </VStack>
          <FormLabel
            fontSize={["lg", "2xl"]}
            mt="6"
            htmlFor="clockifyApiKey"
          >{`${
            isActive ? "You have a valid" : "Enter valid"
          } Clockify API Key`}</FormLabel>
          <VStack mt="4" h="min-content" flexDirection="row" align="center">
            <Input
              w="70%"
              id="clockifyApiKey"
              placeholder="Clockify API Key"
              mr="3"
              size={["sm", "md"]}
              bg="white"
              color="black"
              _placeholder={{ opacity: 0.8, color: "gray.500" }}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              isDisabled={isApiKeyValid || isActive}
            />

            {isApiKeyValid && <CheckIcon fontSize={24} color="green" />}
          </VStack>
          {!isActive && (
            <Text
              color="red.700"
              fontWeight="semibold"
              fontSize={["sm", "md", "lg"]}
              my="4"
            >
              Providing a valid API key enables access to the application's
              functionality
            </Text>
          )}
          <ButtonGroup size={["sm", "md", "lg"]} mt="4">
            <Button
              type="submit"
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
              isDisabled={isApiKeyValid || isActive}
            >
              {isActive ? "Active" : "Activate"}
            </Button>
            {isActive && (
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
                onClick={editInputKeyHandler}
              >
                Edit
              </Button>
            )}
          </ButtonGroup>
        </form>
      ) : (
        <>
          <Text fontSize={["xl", "2xl"]} fontWeight="semibold">
            You have valid api key.
          </Text>
          <ButtonGroup size={["sm", "md", "lg"]} mt="4">
            <Button
              type="submit"
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
              isDisabled={isApiKeyValid || isActive}
            >
              {isApiKeyValid ? <CheckIcon /> : "Activate"}
            </Button>
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
              onClick={editInputKeyHandler}
            >
              Edit
            </Button>
          </ButtonGroup>
        </>
      )}
    </>
  );
};

export default ApiKeyInput;
