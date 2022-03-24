import { Box, GridItem, VStack } from "@chakra-ui/react";
import React, { useMemo, useRef, useState } from "react";
import { GroupedVirtuoso, VirtuosoHandle } from "react-virtuoso";
import { Message } from "../../types";
import ListHeader from "./ListHeader";
import MessageItem from "./MessageItem";

type Props = {
  messages: Message[];
  onClickItem: (id: string) => void;
  selectedItemId: string;
};

type SortKind = "AlphaAsc" | "AlphaDesc" | "DateAsc" | "DateDesc";
const compareFunc = new Map<SortKind, (l: Message, r: Message) => number>([
  ["AlphaAsc", (l, r) => l.from?.text.localeCompare(r.from?.text ?? "") ?? 0],
  ["AlphaDesc", (l, r) => r.from?.text.localeCompare(l.from?.text ?? "") ?? 0],
  ["DateAsc", (l, r) => (l.date?.getTime() ?? 0) - (r.date?.getTime() ?? 0)],
  ["DateDesc", (l, r) => (r.date?.getTime() ?? 0) - (l.date?.getTime() ?? 0)],
]);

const ListPane: React.VFC<Props> = ({
  messages,
  onClickItem,
  selectedItemId,
}) => {
  const [filterStr, setFilterStr] = useState<string>("");
  const [sortKind, setSortKind] = useState<SortKind>("DateAsc");
  const virtuoso = useRef<VirtuosoHandle>(null);

  messages = messages.filter((m) => {
    if (filterStr.trim() == "") {
      return true;
    } else {
      return !((m.from?.text.indexOf(filterStr) ?? -1) < 0);
    }
  });
  messages.sort(compareFunc.get(sortKind));
  const { groups, groupCounts } = getGroupsByDate(messages);

  const list = messages.map((item) => (
    <MessageItem
      key={item.id}
      from={item.from?.text ?? ""}
      date={item.date}
      subject={item.subject ?? ""}
      onClick={() => {
        // console.log(item);
        onClickItem(item.id);
      }}
      hasAttachment={item.attachments.length > 0}
      selected={item.id === selectedItemId}
      body={(item.html ? item.html : item.textAsHtml) ?? ""}
    />
  ));

  const onListKeyDown: React.KeyboardEventHandler<"div"> = (ev) => {
    if (ev.key !== "ArrowUp" && ev.key !== "ArrowDown") return;
    ev.preventDefault();

    const currentItem = messages.find((el) => el.id == selectedItemId);
    if (!currentItem) return;

    const nextIndex =
      messages.indexOf(currentItem) + (ev.key == "ArrowUp" ? -1 : 1);
    if (!messages[nextIndex]) return;
    onClickItem(messages[nextIndex].id);
    virtuoso.current?.scrollToIndex({
      index: nextIndex,
      align: "center",
      // behavior: "smooth",
    });
  };

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
        <ListHeader filterStr={filterStr} onFilterChanged={setFilterStr} />
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
    </GridItem>
  );
};

const getGroupsByDate = (messages: Message[]) => {
  const groups: string[] = [];
  const groupCounts: number[] = [];

  let dateStr = "";
  let groupCnt = 0;

  messages.forEach((m) => {
    const newDate = m.date?.toLocaleString("ja-JP", { dateStyle: "full" });
    if (!newDate) return;
    if (newDate != dateStr) {
      // New group
      groups.push((dateStr = newDate));
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

export default ListPane;
