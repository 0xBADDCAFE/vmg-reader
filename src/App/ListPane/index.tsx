import { Box, Center, GridItem, VStack } from "@chakra-ui/react";
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
      onClick={() => onClickItem(item.id)}
      selected={item.id === selectedItemId}
      {...item}
    />
  ));

  return (
    <GridItem>
      <VStack h="100vh" bg="#e6e6e6" align="stretch" spacing={0.5}>
        <Box h={16} bg="#fff" color="#e6e6e6">
          <Center>Header</Center>
        </Box>
        {list}
        <Box flex={1} bg="#f9f9f9" color="#e6e6e6">
          <Center>Space</Center>
        </Box>
      </VStack>
    </GridItem>
  );
};

export default ListPane;
