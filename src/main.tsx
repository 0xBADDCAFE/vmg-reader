import { ChakraProvider, Grid, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ContentLoadingProgress from "./App/ContentLoadingProgress";
import ContentPane from "./App/ContentPane";
// import App from "./App";
import ListPane from "./App/ListPane";
import "./index.css";
import { VMG } from "./types";

const App = () => {
  const [vmg, setVmg] = useState<VMG>({
    fileName: "",
    messages: [],
  });
  const [selected, setSelected] = useState<string>("");
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [progressTotal, setProgressTotal] = useState<number>(0);
  const [progressCurrent, setProgressCurrent] = useState<number>(0);

  useEffect(() => {
    if (vmg.fileName.trim() === "") {
      document.title = "VMG Reader";
    } else {
      document.title = `VMG Reader [${vmg.fileName}]`;
    }
  });

  const onClickLoadVmg = async () => {
    console.log("Open VMG");

    onOpen();
    const vmg = await window.electronAPI.openVmg((current, total) => {
      setProgressCurrent(current);
      setProgressTotal(total);
    });
    setVmg(vmg);
    onClose();
  };

  return (
    <>
      <Grid
        height="100vh"
        templateColumns="360px 1fr"
        templateRows="1fr"
        border="1px"
        borderColor="gray.200"
        gap={0.5}
        bg="#e6e6e6"
        userSelect="none"
      >
        <ListPane
          messages={vmg.messages}
          onClickItem={setSelected}
          selectedItemId={selected}
        />
        <ContentPane
          message={vmg.messages.find((m) => m.id === selected)}
          onClickLoadVmg={onClickLoadVmg}
        />
      </Grid>
      <ContentLoadingProgress
        isOpen={isOpen}
        onClose={onClose}
        current={progressCurrent}
        total={progressTotal}
      />
    </>
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
