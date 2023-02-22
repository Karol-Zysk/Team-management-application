import { Box, Flex, Heading, Text } from "@chakra-ui/react";
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
        alignItems="flex-end"
        width="60%"
      >
        <Text
          fontSize={["2xl", "3xl"]}
          fontWeight="semibold"
          marginBottom={[8, 12]}
          marginRight={[0, 12]}
        >
          Hello {activeUser.name}!
        </Text>
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
