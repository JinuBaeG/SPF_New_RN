import React, { useEffect, useRef, useState } from "react";
import { FlatList, SafeAreaView } from "react-native";
import TagBottomSheet, { RBSheetProps } from "react-native-raw-bottom-sheet";
import styled from "styled-components/native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import useTag from "../../hooks/useGroupTag";

interface GroupTagProps {
  id: number | undefined;
  groupTag: any | undefined;
  setValue: Function;
}

const TextLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.greenActColor};
  margin-bottom: 8px;
`;

const ListLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.grayColor};
  margin-left: 8px;
`;

const ListButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
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
  font-size: 12px;
`;

export function GroupTagComp({ id, setValue, groupTag }: GroupTagProps) {
  // 그룹 태그 세팅 - 시작
  const refTagSheet = useRef<RBSheetProps | undefined>();
  const tagList = useTag(groupTag);
  const [tagData, setTagData] = useState(tagList);

  useEffect(() => {
    if (id) {
      setGroupTag();
    }
  }, []);

  const setGroupTag = () => {
    setTagData(tagList);
    onTagClose();
  };

  const onTagPress = (id: any) => {
    let temp = tagData.map((item: any) => {
      if (id === item.id) {
        return { ...item, isUse: !item.isUse };
      }
      return item;
    });
    setTagData(temp);
  };

  const onTagClose = () => {
    let isUseArr: any = [];
    let temp = tagData.map((tag: any) => {
      if (tag.isUse) {
        isUseArr.push(tag);
        return tag.name + ", ";
      }
    });

    setValue("groupTag", isUseArr);
    return temp;
  };
  const renderTagItem = ({ item }: any) => {
    return (
      <ListButton onPress={() => onTagPress(item.id)}>
        <MaterialCommunityIcons
          size={24}
          name={item.isUse ? "checkbox-marked" : "checkbox-blank-outline"}
        />
        <ListLabel>{item.name}</ListLabel>
      </ListButton>
    );
  };
  // 그룹 태그 세팅 - 끝

  return (
    <Upload onPress={() => refTagSheet.current?.open()}>
      <TextLabel>그룹 태그</TextLabel>
      <UploadText>{onTagClose()}</UploadText>
      <TagBottomSheet
        ref={refTagSheet}
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
            data={tagData}
            renderItem={renderTagItem}
          />
        </SafeAreaView>
      </TagBottomSheet>
    </Upload>
  );
}
