import ToggleColorMode from "./components/ToggleColorMode";
import { Box } from "@chakra-ui/react";
import Views from "./components/Views";
import { AccountContextProvider } from "./context/AccountContext";

function App() {
  return (
    <AccountContextProvider>
      <Box paddingX="20" paddingY="20">
        <ToggleColorMode />
        <Views />
      </Box>
    </AccountContextProvider>
  );
}

export default App;
