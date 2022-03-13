import { Box, Button, Center, GridItem, Heading } from "@chakra-ui/react";
import { Message } from "../../types";

type Props = {
  message?: Message;
  onClickLoadVmg: () => Promise<void>;
};

const ContentPane: React.VFC<Props> = (props) => {
  if (props.message) {
    const __html = new DOMParser().parseFromString(
      (props.message.html ? props.message.html : props.message.textAsHtml) ??
        "",
      "text/html"
    ).body.innerHTML;

    return (
      <GridItem bg="#fff" padding={8} overflow="auto">
        <Heading size="md">{props.message.subject}</Heading>
        <Heading size="sm" mt={4}>
          {props.message.from?.text}
        </Heading>
        <Box mt={4} dangerouslySetInnerHTML={{ __html }} />
      </GridItem>
    );
  } else
    return (
      <GridItem bg="#fff">
        <Center h="100%">
          <Button _focus={{ outline: "none" }} onClick={props.onClickLoadVmg}>
            Open VMG
          </Button>
        </Center>
      </GridItem>
    );
};

export default ContentPane;
