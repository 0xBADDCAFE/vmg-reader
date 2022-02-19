import { GridItem } from "@chakra-ui/react";

const ContentPane = () => (
  <GridItem
    bg="#fff"
    onClick={() => {
      console.log("hi");
      window.electronAPI.showOpenFileDialog();
    }}
  >
    ContentPane
  </GridItem>
);

export default ContentPane;
