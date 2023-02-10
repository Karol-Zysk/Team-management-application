import { Box, Text } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AccountContext, UserData } from "../context/AccountContext";
import ApiKeyInput from "../components/ApiKeyInput";
import SyncClockifyField from "../components/SyncClockifyField";

const Main = () => {
  const { user, error, setError } = useContext(AccountContext);
  const activeUser = user as UserData;

  return (
    <Box display="flex" w="90%" paddingX="16" paddingY="16" height="100%">
      <Box w="100%">
        <ApiKeyInput error={error} setError={setError} />
        <SyncClockifyField />
      </Box>
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="flex-end"
        width="100%"
      >
        <Text fontSize="2xl">Hi {activeUser.name}!</Text>
      </Box>
    </Box>
  );
};

export default Main;
