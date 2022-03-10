import { Box, Center, Grid, GridItem } from "@chakra-ui/react";

type Props = {
  id: string;
  from: string;
  date: Date;
  subject: string;
  body: string;
  selected: boolean;
  onClick: () => void;
};

const MessageItem: React.VFC<Props> = (item) => {
  const styleProps = item.selected
    ? { bg: "gray.200" }
    : { bg: "#fff", _hover: { bg: "#f3f3f3" } };

  return (
    <Box padding={2} paddingStart={4} {...styleProps} onClick={item.onClick}>
      <Grid
        // templateColumns="48px 1fr 80px"
        templateColumns="1fr 80px"
        templateRows="repeat(3, 1fr)"
        columnGap={2}
      >
        {/* <GridItem gridRow="1/4">アイコン</GridItem> */}
        <GridItem gridColumn="2/3" gridRow="1/4">
          <Center h="100%" color="gray.500">
            {item.date.toLocaleDateString()}
          </Center>
        </GridItem>
        <GridItem gridRow="1/2">{item.from}</GridItem>
        <GridItem gridRow="2/3">{item.subject}</GridItem>
        <GridItem gridRow="3/4" color="gray.500" isTruncated>
          {item.body}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default MessageItem;
