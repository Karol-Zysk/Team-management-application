import { Box, Flex, FormLabel, Input, Text, VStack } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useContext, useState } from "react";
import { AccountContext } from "../../context/AccountContext";
import ApiKeyInput from "../../components/ApiKeyInput";

const Main = () => {
  const { user } = useContext(AccountContext);

  const [error, setError] = useState<string | null>(null);

  if (!user) return <Text>Error</Text>;
  const { active } = user;
  console.log(user);

  return !user ? (
    <Text>Loading</Text>
  ) : (
    <Box display="flex" w="90%" paddingX="16" paddingY="16" height="100%">
      <Box w="100%">
        {active && (
          <Text fontSize="xl" mb="5">
            Fajnie, że jesteś z nami{" "}
          </Text>
        )}
        <ApiKeyInput error={error} setError={setError} active={active} />
      </Box>
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="flex-end"
        width="100%"
      >
        <Text fontSize="2xl">Hi {user?.name}!</Text>
      </Box>
    </Box>
  );
};

export default Main;
