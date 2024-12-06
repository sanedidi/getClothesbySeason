import React from "react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import Routers from "./router/router";
import "./i18next";
import './App.css'
import { QueryClient, QueryClientProvider } from "react-query";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={defaultSystem}>
        <Routers />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
