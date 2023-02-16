import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ColorModeScript } from "@chakra-ui/color-mode";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import theme from "./theme";
import { AccountContextProvider } from "./context/AccountContext";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AccountContextProvider>
          <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <App />
          </ChakraProvider>
        </AccountContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
