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
      <Flex direction="column">
        <Flex
          w="auto"
          justify="center"
          h="min"
          mx={["5%", "20%"]}
          px="8"
          py={["2", "4"]}
          mb="6"
          transform={["none", "translateY(-30%)"]}
          bg={useColorModeValue("facebook.300", "facebook.600")}
          opacity={1}
          boxShadow={useColorModeValue(
            "4px 4px 8px black",
            "4px 4px 8px  black"
          )}
        >
          <Heading
            color={useColorModeValue("white", "white")}
            textShadow={useColorModeValue(
              "3px 3px 3px black",
              "3px 3px 3px  black"
            )}
            fontSize={["xl", "4xl"]}
            fontWeight="bold"
            as="h1"
          >
            Hi {activeUser.name}!
          </Heading>
        </Flex>
        <Flex>
          <Box w={["100%", "50%"]}>
            <ApiKeyInput />
            <SyncClockifyField />
          </Box>
          <Flex
            flexDirection="column"
            display={["none", "none", "flex"]}
            alignItems="center"
            justify="center"
            width="50%"
          >
            <Flex
              p="8"
              w="100%"
              justify="center"
              align="center"
              display={["none", "none", "none", "block"]}
            >
              <MainSvg />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Main;
