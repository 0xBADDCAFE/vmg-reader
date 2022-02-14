import { Box, Center, Grid, GridItem } from "@chakra-ui/react";

type Props = {
  id: string;
  name: string;
  date: Date;
  title: string;
  body: string;
  selected: boolean;
  onClick: () => void;
};

const MessageItem: React.VFC<Props> = (item) => {
  const styleProps = item.selected
    ? { bg: "gray.200" }
    : { bg: "#fff", _hover: { bg: "#f3f3f3" } };

  return (
    <Box padding={2} {...styleProps} onClick={item.onClick}>
      <Grid
        templateColumns="48px 1fr 80px"
        templateRows="repeat(3, 1fr)"
        columnGap={2}
      >
        <GridItem gridRow="1/4">アイコン</GridItem>
        <GridItem gridColumn="3/4" gridRow="1/4">
          <Center h="100%" color="gray.500">
            {item.date.toLocaleDateString()}
          </Center>
        </GridItem>
        <GridItem gridRow="1/2">{item.name}</GridItem>
        <GridItem gridRow="2/3">{item.title}</GridItem>
        <GridItem gridRow="3/4" color="gray.500">
          {item.body}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default MessageItem;
