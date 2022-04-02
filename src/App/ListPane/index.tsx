import {
  Box,
  GridItem,
  Menu,
  MenuItem,
  MenuList,
  VStack,
} from "@chakra-ui/react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GroupedVirtuoso, VirtuosoHandle } from "react-virtuoso";
import { Message, SortKind } from "../../types";
import ListHeader from "./ListHeader";
import MessageItem from "./MessageItem";

type Props = {
  messages: Message[];
  onClickItem: (id: string) => void;
  selectedItemId: string;
};

const compareFunc = new Map<SortKind, (l: Message, r: Message) => number>([
  ["DateAsc", (l, r) => (l.date?.getTime() ?? 0) - (r.date?.getTime() ?? 0)],
  ["DateDesc", (l, r) => (r.date?.getTime() ?? 0) - (l.date?.getTime() ?? 0)],
  ["AlphaAsc", (l, r) => l.from?.text.localeCompare(r.from?.text ?? "") ?? 0],
  ["AlphaDesc", (l, r) => r.from?.text.localeCompare(l.from?.text ?? "") ?? 0],
]);

const ListPane: React.VFC<Props> = ({
  messages,
  onClickItem,
  selectedItemId,
}) => {
  const [filterStr, setFilterStr] = useState<string>("");
  const [filteredByAttachments, setFilteredByAttachments] = useState(false);
  const [sortKind, setSortKind] = useState<SortKind>("DateAsc");
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [isOpen, setOpen] = useState(false);
  const virtuoso = useRef<VirtuosoHandle>(null);
  const shouldScroll = useRef(false);

  const categorizedMessages = useMemo(() => {
    const newMessages = messages.filter((m) => {
      if (filteredByAttachments && !hasAttachment(m)) {
        return false;
      }
      if (filterStr.trim() == "") {
        return true;
      } else {
        return !((m.from?.text.indexOf(filterStr) ?? -1) < 0);
      }
    });
    newMessages.sort(compareFunc.get(sortKind));
    return newMessages;
  }, [messages, filterStr, filteredByAttachments, sortKind]);
  const { groups, groupCounts } = useMemo(
    () =>
      getGroups(
        categorizedMessages,
        sortKind == "DateAsc" || sortKind == "DateDesc"
          ? (m) =>
              m.date?.toLocaleString("ja-JP", { dateStyle: "full" }) ?? null
          : (m) => m.from?.text.charAt(0).toUpperCase() ?? null
      ),
    [categorizedMessages]
  );
  const handleClick = useCallback(() => setOpen(false), []);
  useEffect(() => {
    // Select top item when load
    if (selectedItemId == "" && categorizedMessages.length > 0) {
      onClickItem(categorizedMessages[0].id);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  });

  const onFilterChanged = (filterStr: string) => {
    shouldScroll.current = true;
    setFilterStr(filterStr);
    if (filterStr === "") {
      setFilteredByAttachments(false);
    }
  };
  const onSelectSortOption = (sortKind: SortKind) => {
    shouldScroll.current = true;
    setSortKind(sortKind);
  };
  const onCheckFilterByAttachments = (enable: boolean) => {
    shouldScroll.current = true;
    setFilteredByAttachments(enable);
  };
  const onItemContextMenu = (id: string) => (x: number, y: number) => {
    onClickItem(id);
    setAnchorPoint({ x, y });
    setOpen(true);
  };
  const onListKeyDown: React.KeyboardEventHandler<"div"> = (ev) => {
    if (ev.key !== "ArrowUp" && ev.key !== "ArrowDown") return;
    ev.preventDefault();

    const currentIndex = categorizedMessages.findIndex(
      (m) => m.id == selectedItemId
    );
    if (currentIndex === -1) return;

    const nextIndex = currentIndex + (ev.key == "ArrowUp" ? -1 : 1);
    if (!categorizedMessages[nextIndex]) return;
    onClickItem(categorizedMessages[nextIndex].id);
    // TODO: scrollIntoView doesn't work to back scroll
    virtuoso.current?.scrollToIndex({
      index: nextIndex,
      align: "center",
      // behavior: "smooth",
    });
  };

  // Scroll to selected item if filter changed
  if (shouldScroll.current) {
    const index = categorizedMessages.findIndex((m) => m.id === selectedItemId);
    if (index != -1) {
      virtuoso.current?.scrollToIndex({
        index,
        align: "center",
      });
      shouldScroll.current = false;
    }
  }
  const list = categorizedMessages.map((item) => (
    <MessageItem
      key={item.id}
      from={item.from?.text ?? ""}
      date={item.date}
      subject={item.subject ?? ""}
      onClick={() => {
        // console.log(item);
        onClickItem(item.id);
      }}
      onItemContextMenu={onItemContextMenu(item.id)}
      hasAttachment={hasAttachment(item)}
      selected={item.id === selectedItemId}
      body={(item.html ? item.html : item.textAsHtml) ?? ""}
    />
  ));

  // TODO: Footer
  return (
    <GridItem>
      <VStack
        h="100%"
        bg="#e6e6e6"
        align="stretch"
        spacing={0.5}
        overflowY="auto"
      >
        <ListHeader
          filterStr={filterStr}
          onFilterChanged={onFilterChanged}
          sortKind={sortKind}
          onSelectSortOption={onSelectSortOption}
          filteredByAttachments={filteredByAttachments}
          onCheckFilterByAttachments={onCheckFilterByAttachments}
        />
        <Box flex={1}>
          <GroupedVirtuoso
            groupCounts={groupCounts}
            ref={virtuoso}
            onKeyDown={onListKeyDown}
            style={{ height: "100%" }}
            groupContent={(i) => {
              return (
                <Box
                  bg="gray.50"
                  color="gray.400"
                  paddingStart={4}
                  // borderBottom={["1px", "gray.100"]}
                  boxShadow="0px 3px 5px 0px #F3F4ED"
                >
                  {groups[i]}
                </Box>
              );
            }}
            itemContent={(i) => list[i]}
          />
        </Box>
      </VStack>
      <Menu isOpen={isOpen}>
        <MenuList position="absolute" left={anchorPoint.x} top={anchorPoint.y}>
          <MenuItem
            onClick={() => {
              onFilterChanged(
                categorizedMessages.find((m) => m.id == selectedItemId)?.from
                  ?.text ?? ""
              );
            }}
          >
            Filter this address
          </MenuItem>
          <MenuItem
            onClick={() => {
              console.log("Save attachments");
            }}
          >
            Save attachments
          </MenuItem>
        </MenuList>
      </Menu>
    </GridItem>
  );
};

const getGroups = (
  messages: Message[],
  labelFunc: (m: Message) => string | null
) => {
  const groups: string[] = [];
  const groupCounts: number[] = [];

  let label = "";
  let groupCnt = 0;

  messages.forEach((m) => {
    const newLabel = labelFunc(m);
    if (!newLabel) return;
    if (newLabel != label) {
      // New group
      groups.push((label = newLabel));
      if (groupCnt != 0) {
        groupCounts.push(groupCnt);
        groupCnt = 0;
      }
    }
    groupCnt++;
  });
  if (groupCnt != 0) groupCounts.push(groupCnt);

  console.assert(groups.length == groupCounts.length, { groups, groupCounts });

  return { groups, groupCounts };
};

const hasAttachment = (m: Message) =>
  m.attachments.filter((a) => !a.related || a.size > 15000).length > 0;

export default ListPane;
