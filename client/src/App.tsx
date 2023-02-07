import { useState } from "react";
import SignUpForm from "./pages/Login/SignUp";
import ToggleColorMode from "./components/ToggleColorMode";
import { Box } from "@chakra-ui/react";

function App() {
  return (
    <Box paddingX="16" paddingY="10">
      <ToggleColorMode />
      <SignUpForm />
    </Box>
  );
}

export default App;
