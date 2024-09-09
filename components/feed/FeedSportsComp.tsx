import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import SportsBottomSheet, { RBSheetProps } from "react-native-raw-bottom-sheet";
import { FlatList, SafeAreaView } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import useSportsEvent from "../../hooks/useSportsEvent";

interface FeedSportsProps {
  id: number | undefined;
  sportsEvent: String | undefined;
  setValue: Function;
}

const TextLabel = styled.Text`
  font-size: ${(props) => props.theme.size20};
  font-weight: 600;
  color: ${(props) => props.theme.greenActColor};
  margin-bottom: 8px;
`;

const TextInput = styled.TextInput`
  font-size: ${(props) => props.theme.size16};
  color: ${(props) => props.theme.textColor};
`;

const Upload = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.whiteColor};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const UploadText = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-weight: 400;
  font-size: ${(props) => props.theme.size16};
`;

const ListLabel = styled.Text`
  font-size: ${(props) => props.theme.size16};
  font-weight: 600;
  color: ${(props) => props.theme.grayColor};
  margin-left: 8px;
`;

const ListButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.whiteColor};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const ImportantData = styled.Text`
  font-size: 8px;
  color: red;
`;

export function FeedSportsComp({ id, sportsEvent, setValue }: FeedSportsProps) {
  // 그룹 종목 세팅 - 시작
  const refSportsEventSheet = useRef<RBSheetProps | undefined>();
  const eventList = useSportsEvent(sportsEvent);
  const [eventData, setEventData] = useState(eventList);

  useEffect(() => {
    if (id) {
      setSportsEvent();
    }
  }, [eventData]);

  const setSportsEvent = () => {
    setEventData(eventList);
    onSportsEventClose();
  };

  const onSportsEventPress = (id: number | undefined) => {
    let temp = eventData.map((item: any) => {
      if (id === item.id) {
        return { ...item, isChecked: !item.isChecked };
      } else {
        return { ...item, isChecked: false };
      }
      return item;
    });
    setEventData(temp);
  };
  const onSportsEventClose = () => {
    let temp = eventData.map((event: any) => {
      if (event.isChecked) {
        setValue("sportsEvent", event.name);
        return event.name;
      }
    });

    return temp;
  };
  const renderSportsEventItem = ({ item }: any) => {
    return (
      <ListButton
        onPress={() => {
          onSportsEventPress(item.id);
          refSportsEventSheet.current?.close();
        }}
      >
        <MaterialCommunityIcons
          size={24}
          name={item.isChecked ? "checkbox-marked" : "checkbox-blank-outline"}
        />
        <ListLabel>{item.name}</ListLabel>
      </ListButton>
    );
  };
  // 그룹 종목 세팅 - 끝

  return (
    <Upload onPress={() => refSportsEventSheet.current?.open()}>
      <TextLabel>종목</TextLabel>
      <UploadText>{onSportsEventClose()}</UploadText>
      <SportsBottomSheet
        ref={refSportsEventSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          draggableIcon: {
            backgroundColor: "#000",
          },
        }}
      >
        <SafeAreaView>
          <FlatList
            keyExtractor={(item: any) => item.id}
            data={eventData}
            renderItem={renderSportsEventItem}
          />
        </SafeAreaView>
      </SportsBottomSheet>
    </Upload>
  );
}
