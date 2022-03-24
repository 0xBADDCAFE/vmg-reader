import {
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import {
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { MdClear, MdFilterAlt, MdTune } from "react-icons/md";

type Props = {
  filterStr: string;
  onFilterChanged: (filterStr: string) => void;
};

const ListHeader: React.VFC<Props> = (props) => (
  // Do not use Stack to prevent warning by default spacing
  <Flex direction="row" h={16} bg="#fff" padding={4}>
    <InputGroup>
      <InputLeftElement
        h={8}
        w={8}
        pointerEvents="none"
        children={<Icon as={MdFilterAlt} color="gray.300" />}
      />
      <Input
        size="sm"
        type="tel"
        placeholder="Filter with from address"
        value={props.filterStr}
        onChange={(ev) => props.onFilterChanged(ev.target.value)}
      />
      <InputRightElement
        children={
          <IconButton
            marginTop={-2}
            marginEnd={-2}
            size="xs"
            aria-label="Clear filter"
            icon={<MdClear />}
            _focus={{ outline: "none" }}
            onClick={() => props.onFilterChanged("")}
          />
        }
      />
    </InputGroup>
    <Menu>
      <MenuButton
        h={8}
        w={8}
        marginStart={2}
        as={IconButton}
        aria-label="Options"
        icon={<MdTune />}
        variant="outline"
        _focus={{ outline: "none" }}
      />
      <MenuList>
        <MenuItem icon={<FaSortAlphaDown />}>Alpha Descend</MenuItem>
        <MenuItem icon={<FaSortAlphaUp />}>Alpha Ascend</MenuItem>
        <MenuItem icon={<FaSortAmountDown />}>Date Descend</MenuItem>
        <MenuItem icon={<FaSortAmountUp />}>Date Ascend</MenuItem>
      </MenuList>
    </Menu>
  </Flex>
);

export default ListHeader;
