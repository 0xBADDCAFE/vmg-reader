import { Box, Button, Center, GridItem, Heading } from "@chakra-ui/react";
import { Message } from "../../types";

type Props = {
  message?: Message;
  onClickLoadVmg: () => Promise<void>;
};

const ContentPane: React.VFC<Props> = ({ message, onClickLoadVmg }) => {
  if (message) {
    const __html = new DOMParser().parseFromString(
      (message.html ? message.html : message.textAsHtml) ?? "",
      "text/html"
    ).body.innerHTML;

    return (
      <GridItem bg="#fff" padding={8} overflow="auto">
        <Heading size="md">{message.subject}</Heading>
        <Heading size="sm" mt={4}>
          {message.from?.text}
        </Heading>
        <Box mt={4} dangerouslySetInnerHTML={{ __html }} />
      </GridItem>
    );
  } else
    return (
      <GridItem bg="#fff">
        <Center h="100%">
          <Button
            _focus={{ outline: "none" }}
            boxShadow="0px 3px 5px 0px #F3F4ED"
            onClick={onClickLoadVmg}
          >
            Open VMG
          </Button>
        </Center>
      </GridItem>
    );
};

export default ContentPane;
