import { Box, Button, Center, GridItem, Heading } from "@chakra-ui/react";
import { Message } from "../../types";

type Props = {
  message?: Message;
  onClickLoadVmg: () => Promise<void>;
};

const ContentPane: React.VFC<Props> = (props) =>
  props.message ? (
    <GridItem bg="#fff" padding={8}>
      <Heading size="md">{props.message.subject}</Heading>
      <Heading size="sm" mt={4}>
        {props.message.from}
      </Heading>
      <Box mt={4}>{props.message.body}</Box>
    </GridItem>
  ) : (
    <GridItem bg="#fff">
      <Center h="100%">
        <Button onClick={props.onClickLoadVmg}>Open VMG</Button>
      </Center>
    </GridItem>
  );

export default ContentPane;
