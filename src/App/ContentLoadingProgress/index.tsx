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
  let label, value: number;
  if (props.current == 0 || props.total == 0) {
    label = "Loading..";
    value = 0;
  } else {
    label = `${props.current}/${props.total}`;
    value = (props.current / props.total) * 100;
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent w={320}>
        <ModalBody>
          <Center>
            <CircularProgress
              value={value}
              size={240}
              thickness={4}
              color="blue.100"
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
