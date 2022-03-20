import {
  Center,
  CircularProgress,
  CircularProgressLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  current: number;
  total: number;
};

const ContentLoadingProgress: React.VFC<Props> = (props) => {
  let label = "Loading..";
  if (props.current != 0 && props.total != 0) {
    label = `${props.current}/${props.total}`;
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent w={320}>
        <ModalBody>
          <Center>
            <CircularProgress
              value={props.current}
              max={props.total}
              size={240}
              thickness={4}
              color="blue.200"
              trackColor="blue.50"
            >
              <CircularProgressLabel fontSize={36}>
                {label}
              </CircularProgressLabel>
            </CircularProgress>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ContentLoadingProgress;
