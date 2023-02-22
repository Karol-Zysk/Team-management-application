import { Box, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import { useContext } from "react";
import { AccountContext, UserData } from "../context/AccountContext";
import ApiKeyInput from "../components/Main/ApiKeyInput";
import SyncClockifyField from "../components/Main/SyncClockifyField";
import PageTitle from "../components/PageTitle";
import Layout from "../components/Layout";
import image from "../assets/employee.svg";
import MainSvg from "../components/MainSvg";

const Main = () => {
  const { user } = useContext(AccountContext);
  const activeUser = user as UserData;

  return (
    <Layout title="Account Settings">
      <Box w="50%">
        {!activeUser.active && (
          <Text fontSize={["lg", "xl"]} fontWeight="semibold" mb="6">
            To unlock features, please provide informations.
          </Text>
        )}
        <ApiKeyInput />
        <SyncClockifyField />
      </Box>
      <Flex
        flexDirection="column"
        display={["block", "flex"]}
        alignItems="center"
        justify="center"
        width="50%"
      >
        <Flex
          w="auto"
          justify="center"
          h="min"
          px="8"
          py="4"
          mb="6"
          bg={useColorModeValue("gray.200", "facebook.600")}
          opacity={1}
          boxShadow={useColorModeValue(
            "4px 4px 6px black",
            "4px 4px 6px  black"
          )}
        >
          <Heading
            color={useColorModeValue("white", "white")}
            textShadow={useColorModeValue(
              "3px 3px 3px black",
              "3px 3px 3px  black"
            )}
            fontSize="4xl"
            fontWeight="bold"
            as="h1"
          >
            Hello {activeUser.name}
          </Heading>
        </Flex>
        <Flex
          p="8"
          w="100%"
          justify="center"
          align="center"
          display={["none", "block"]}
        >
          <MainSvg />
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Main;
