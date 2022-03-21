import { Box, Center, GridItem, VStack } from "@chakra-ui/react";
import { Virtuoso } from "react-virtuoso";
import { VMG } from "../../types";
import MessageItem from "./MessageItem";

type Props = {
  vmg: VMG;
  onClickItem: (id: string) => void;
  selectedItemId: string;
};

const ListPane: React.VFC<Props> = ({ vmg, onClickItem, selectedItemId }) => {
  const list = vmg.messages.map((item) => (
    <MessageItem
      key={item.id}
      from={item.from?.text ?? ""}
      date={item.date}
      subject={item.subject ?? ""}
      onClick={() => {
        // console.log(item);
        onClickItem(item.id);
      }}
      selected={item.id === selectedItemId}
      body={(item.html ? item.html : item.textAsHtml) ?? ""}
    />
  ));

  // TODO: Footer
  return (
    <GridItem>
      <VStack
        h="100%"
        bg="#e6e6e6"
        align="stretch"
        spacing={0.5}
        overflowY="auto"
      >
        <Box h={16} bg="#fff" color="#e6e6e6">
          <Center>Header</Center>
        </Box>
        <Box flex={1}>
          <Virtuoso
            style={{ height: "100%" }}
            data={list}
            itemContent={(i, el) => el}
          />
        </Box>
      </VStack>
    </GridItem>
  );
};

export default ListPane;
