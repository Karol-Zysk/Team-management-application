import { Box, Text } from "@chakra-ui/layout";
import { Route, Routes } from "react-router-dom";

import SignUpForm from "../pages/Login/SignUp";

const Views = () => {
  <Box border="2px" borderColor="gray.200">
    <Routes>
      <Route path="/register" element={<SignUpForm />} />
    </Routes>
  </Box>;
};

export default Views;
