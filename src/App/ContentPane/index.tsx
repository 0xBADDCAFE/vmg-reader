import {
  Box,
  Button,
  Center,
  Flex,
  GridItem,
  Heading,
  Img,
} from "@chakra-ui/react";
import { Message } from "../../types";

type Props = {
  message?: Message;
  onClickLoadVmg: () => Promise<void>;
};

const ContentPane: React.VFC<Props> = ({ message, onClickLoadVmg }) => {
  if (message) {
    console.log(message.attachments);
    const __html = new DOMParser().parseFromString(
      (message.html ? message.html : message.textAsHtml) ?? "",
      "text/html"
    ).body.innerHTML;

    const nonRelatedAttachments = message.attachments.filter((a) => !a.related);
    const attachmentViewList =
      nonRelatedAttachments.length > 0 ? (
        <Flex mt={4} gap={4} flexWrap="wrap">
          {nonRelatedAttachments.map((a) => (
            <Img
              key={a.checksum}
              src={URL.createObjectURL(
                new Blob([a.content], { type: a.contentType })
              )}
            />
          ))}
        </Flex>
      ) : null;

    return (
      <GridItem bg="#fff" padding={8} overflow="auto">
        <Heading size="md">{message.subject || "(No title)"}</Heading>
        <Heading size="sm" mt={4}>
          {message.from?.text}
        </Heading>
        <Box
          className="message-content-body"
          mt={4}
          dangerouslySetInnerHTML={{ __html }}
        />
        {attachmentViewList}
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
