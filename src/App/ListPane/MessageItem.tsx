import { Box, Center, Grid, GridItem, Icon, propNames } from "@chakra-ui/react";
import { useMemo } from "react";
import { MdAttachFile } from "react-icons/md";

type Props = {
  from: string;
  date?: Date;
  subject: string;
  body: string;
  selected: boolean;
  hasAttachment: boolean;
  onClick: () => void;
  onItemContextMenu: (x: number, y: number) => void;
};

// TODO: Attachment sign
const MessageItem: React.VFC<Props> = (item) => {
  const styleProps = useMemo(
    () =>
      item.selected
        ? { bg: "gray.200" }
        : { bg: "#fff", _hover: { bg: "#f3f3f3" } },
    [item.selected]
  );
  // const styleProps = item.selected
  //   ? { bg: "gray.200" }
  //   : { bg: "#fff", _hover: { bg: "#f3f3f3" } };

  const body = useMemo(
    () =>
      new DOMParser().parseFromString(item.body, "text/html").body.textContent,
    [item.body]
  );
  // const body = new DOMParser().parseFromString(item.body, "text/html").body
  //   .textContent;

  return (
    <Box
      padding={2}
      paddingStart={4}
      {...styleProps}
      onClick={item.onClick}
      onContextMenu={(ev) => {
        item.onItemContextMenu(ev.pageX, ev.pageY);
      }}
    >
      <Grid
        // templateColumns="48px 1fr 80px"
        templateColumns="1fr 100px"
        templateRows="repeat(3, 1fr)"
        columnGap={2}
      >
        {/* <GridItem gridRow="1/4">アイコン</GridItem> */}
        <GridItem gridColumn="2/3" gridRow="1/4">
          <Center h="100%" color="gray.500">
            {item.date?.toLocaleString("ja-JP", {
              dateStyle: "short",
              timeStyle: "short",
            })}
            {item.hasAttachment ? <Icon as={MdAttachFile}></Icon> : null}
          </Center>
        </GridItem>
        <GridItem gridRow="1/2" isTruncated>
          {item.from}
        </GridItem>
        <GridItem gridRow="2/3" isTruncated>
          {item.subject}
        </GridItem>
        <GridItem gridRow="3/4" color="gray.500" isTruncated>
          {body}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default MessageItem;
