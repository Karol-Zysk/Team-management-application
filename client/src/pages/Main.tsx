import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { AccountContext, UserData } from "../context/AccountContext";
import ApiKeyInput from "../components/ApiKeyInput";
import SyncClockifyField from "../components/SyncClockifyField";
import PageTitle from "../components/PageTitle";
import Layout from "../components/Layout";
import image from "../assets/employee.svg";
import MainSvg from "../components/MainSvg";

const Main = () => {
  const { user } = useContext(AccountContext);
  const activeUser = user as UserData;

  return (
    <Layout title="Account Settings">
      <Box w="100%">
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
          fontSize={["2xl", "4xl"]}
          fontWeight="semibold"
          marginBottom={[8, 12]}
          marginRight={[0, 12]}
          textShadow={"2px 1px 1px"}
        >
          Hello {activeUser.name}!
        </Text>
        <Box display={["none", "block"]}>
          <MainSvg />
        </Box>
      </Flex>
    </Layout>
  );
};

export default Main;
