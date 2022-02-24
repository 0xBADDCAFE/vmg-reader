import { Box, Center, GridItem, VStack } from "@chakra-ui/react";
import { useState } from "react";
import MessageItem from "./MessageItem";

const ListPane = () => {
  const [selected, setSelected] = useState<string>("");

  const list = [
    {
      id: "1",
      name: "名前1",
      date: new Date(),
      title: "タイトル1",
      body: "あああ",
    },
    {
      id: "2",
      name: "名前2",
      date: new Date(),
      title: "タイトル2",
      body: "いいい",
    },
    {
      id: "3",
      name: "名前3",
      date: new Date(),
      title: "タイトルその3",
      body: "うえおかきくけこ",
    },
  ].map((item) => (
    <MessageItem
      key={item.id}
      onClick={() => {
        setSelected(item.id);
      }}
      selected={item.id === selected}
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
