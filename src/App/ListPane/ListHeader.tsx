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
import { MdClear, MdFilterAlt } from "react-icons/md";
import { SortKind } from "../../types";

type Props = {
  filterStr: string;
  onFilterChanged: (filterStr: string) => void;
  sortKind: SortKind;
  onClickSortMenu: (sortKind: SortKind) => void;
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
        icon={getSortKindIcon(props.sortKind)}
        variant="outline"
        _focus={{ outline: "none" }}
      />
      <MenuList>
        <MenuItem
          icon={<FaSortAmountDown />}
          onClick={() => props.onClickSortMenu("DateAsc")}
        >
          Date Ascend
        </MenuItem>
        <MenuItem
          icon={<FaSortAmountUp />}
          onClick={() => props.onClickSortMenu("DateDesc")}
        >
          Date Descend
        </MenuItem>
        <MenuItem
          icon={<FaSortAlphaDown />}
          onClick={() => props.onClickSortMenu("AlphaAsc")}
        >
          Alpha Ascend
        </MenuItem>
        <MenuItem
          icon={<FaSortAlphaUp />}
          onClick={() => props.onClickSortMenu("AlphaDesc")}
        >
          Alpha Descend
        </MenuItem>
      </MenuList>
    </Menu>
  </Flex>
);

const getSortKindIcon = (k: SortKind): JSX.Element => {
  switch (k) {
    case "DateAsc":
      return <FaSortAmountDown />;
    case "DateDesc":
      return <FaSortAmountUp />;
    case "AlphaAsc":
      return <FaSortAlphaDown />;
    case "AlphaDesc":
    default:
      return <FaSortAlphaUp />;
  }
};

export default ListHeader;
