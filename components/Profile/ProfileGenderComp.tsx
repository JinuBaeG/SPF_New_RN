import React, { useEffect, useRef, useState } from "react";
import { FlatList, SafeAreaView } from "react-native";
import TagBottomSheet, { RBSheetProps } from "react-native-raw-bottom-sheet";
import styled from "styled-components/native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

interface IGender {
  setValue: any;
  gender: string;
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
  background-color: ${(props) => props.theme.whiteColor};
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

export function ProfileGenderComp({ setValue, gender }: IGender) {
  // 그룹 태그 세팅 - 시작
  const refTagSheet = useRef<RBSheetProps>();
  const genderList = [
    { name: "선택 안함", isUse: false },
    { name: "여성", isUse: false },
    { name: "남성", isUse: false },
  ];
  const [list, setList] = useState<any>(genderList);
  const [viewGender, setViewGenter] = useState("");

  useEffect(() => {
    setGenderList();
    onTagClose();
  }, [gender]);

  const setGenderList = () => {
    list.map((item: any) => {
      if (item.name === gender) {
        item.isUse = true;
      }
    });
    setList(list);
  };

  const onTagPress = (idx: any) => {
    let temp = list.map((item: any, index: any) => {
      if (idx === index) {
        setValue("gender", item.name);
        setViewGenter(item.name);
        return { ...item, isUse: !item.isUse };
      } else {
        return { ...item, isUse: false };
      }
    });
    setList(temp);
  };

  const onTagClose = () => {
    let temp = list.map((tag: any) => {
      if (tag.isUse) {
        return tag.name;
      }
    });
    setViewGenter(temp);
  };
  const renderTagItem = ({ item, index }: any) => {
    return (
      <ListButton onPress={() => onTagPress(index)} key={index}>
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
      <TextLabel>성별</TextLabel>
      <UploadText>{viewGender}</UploadText>
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
            keyExtractor={(item: any) => item.name}
            data={list}
            renderItem={renderTagItem}
          />
        </SafeAreaView>
      </TagBottomSheet>
    </Upload>
  );
}
