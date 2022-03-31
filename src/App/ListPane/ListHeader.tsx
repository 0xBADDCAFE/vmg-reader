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
  MenuDivider,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
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
  onSelectSortOption: (sortKind: SortKind) => void;
  filteredByAttachments: boolean;
  onCheckFilterByAttachments: (enable: boolean) => void;
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
    <Menu closeOnSelect={false}>
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
      <MenuList zIndex={2}>
        <MenuOptionGroup
          onChange={onChangeListOption(
            props.onSelectSortOption,
            props.onCheckFilterByAttachments
          )}
          defaultValue="asc"
          title="Order"
          type="radio"
          value={props.sortKind}
        >
          <MenuItemOption value="DateAsc">Date Ascending</MenuItemOption>
          <MenuItemOption value="DateDesc">Date Descending</MenuItemOption>
          <MenuItemOption value="AlphaAsc">Alpha Ascending</MenuItemOption>
          <MenuItemOption value="AlphaDesc">Alpha Descending</MenuItemOption>
        </MenuOptionGroup>
        <MenuDivider />
        <MenuOptionGroup
          type="checkbox"
          onChange={onChangeListOption(
            props.onSelectSortOption,
            props.onCheckFilterByAttachments
          )}
          value={props.filteredByAttachments ? ["attachment"] : []}
        >
          <MenuItemOption value="attachment">Attachment only</MenuItemOption>
        </MenuOptionGroup>
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

const onChangeListOption =
  (
    onFilterChanged: (sortKind: SortKind) => void,
    onCheckFilteredByAttachments: (enable: boolean) => void
  ) =>
  (value: string | string[]) => {
    if (typeof value == "string") {
      switch (value) {
        case "DateAsc":
        case "DateDesc":
        case "AlphaAsc":
        case "AlphaDesc":
          onFilterChanged(value);
        default:
          return;
      }
    } else {
      onCheckFilteredByAttachments(value.length > 0);
    }
  };

export default ListHeader;
