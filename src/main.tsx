import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ChakraProvider, Grid, GridItem } from "@chakra-ui/react";
import "./index.css";
// import App from "./App";
import ListPane from "./App/ListPane";
import ContentPane from "./App/ContentPane";
import { VMG } from "./types";

const App = () => {
  const [vmg, setVmg] = useState<VMG>({
    fileName: "",
    messages: [],
  });
  const [selected, setSelected] = useState<string>("");

  const onClickLoadVmg = async () => {
    console.log("Open VMG");
    const vmg = await window.electronAPI.openVmg();
    setVmg(vmg);
    if (vmg.messages.length > 0) {
      setSelected(vmg.messages[0].id);
    }
  };

  return (
    <Grid
      height="100vh"
      templateColumns="320px 1fr"
      templateRows="1fr"
      gap={0.5}
      bg="#e6e6e6"
      userSelect="none"
    >
      <ListPane vmg={vmg} onClickItem={setSelected} selectedItemId={selected} />
      <ContentPane
        message={vmg.messages.find((m) => m.id === selected)}
        onClickLoadVmg={onClickLoadVmg}
      />
    </Grid>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
