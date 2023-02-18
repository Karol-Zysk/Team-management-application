import { Box, Flex, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { AccountContext, UserData } from "../context/AccountContext";
import ApiKeyInput from "../components/ApiKeyInput";
import SyncClockifyField from "../components/SyncClockifyField";

const Main = () => {
  const { user, isApiKeyValid } = useContext(AccountContext);
  const activeUser = user as UserData;

  return (
    <Flex
      flexDirection={["column-reverse", "row"]}
      w="100%"
      paddingX={[6, 12, 36]}
      paddingY={[6, 12, 24]}
      height="100%"
    >
      <Box w="100%">
        {!isApiKeyValid && (
          <Text fontSize={["lg", "xl"]} fontWeight="semibold" mb="6">
            To unlock features, please provide informations.
          </Text>
        )}
        <ApiKeyInput />
        <SyncClockifyField />
      </Box>
      <Box
        display={["block", "flex"]}
        alignItems="flex-start"
        justifyContent="flex-end"
        width="100%"
      >
        <Text
          fontSize={["2xl", "4xl"]}
          fontWeight="semibold"
          marginBottom={[8, 0]}
          marginRight={[0, 12]}
        >
          Hello {activeUser.name}!
        </Text>
      </Box>
    </Flex>
  );
};

export default Main;
