import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider, Grid, GridItem } from "@chakra-ui/react";
import "./index.css";
import App from "./App";
import ListPane from "./App/ListPane";
import ContentPane from "./App/ContentPane";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      {/* <App /> */}
      <Grid
        height="100vh"
        templateColumns="320px 1fr"
        templateRows="1fr"
        gap={0.5}
        bg="#e6e6e6"
        userSelect="none"
      >
        <ListPane />
        <ContentPane />
      </Grid>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
