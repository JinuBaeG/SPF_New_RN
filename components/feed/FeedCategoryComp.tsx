import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import CategoryBottomSheet, {
  RBSheetProps,
} from "react-native-raw-bottom-sheet";
import { FlatList, SafeAreaView } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { gql, useQuery } from "@apollo/client";
import useCategory from "../../hooks/useCategory";

interface FeedCategoryProps {
  id: number | undefined;
  name: string | undefined;
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
  font-size: ${(props) => props.theme.size20};
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

export function FeedCategoryComp({ id, name, setValue }: FeedCategoryProps) {
  // 피드 카테고리 세팅 - 시작
  const refCategoryEventSheet = useRef<RBSheetProps | undefined>();
  const categoryList = useCategory(name);
  const [categoryData, setCategoryData] = useState(categoryList);

  useEffect(() => {
    if (id) {
      setCategory();
    }
  }, []);

  useLayoutEffect(() => {
    setCategoryData(categoryList);
  }, []);

  const setCategory = () => {
    setCategoryData(categoryList);
    onCategoryClose();
  };

  const onCategoryPress = (id: number | undefined) => {
    let temp = categoryData.map((item: any) => {
      if (id === item.id) {
        return { ...item, isChecked: !item.isChecked };
      } else {
        return { ...item, isChecked: false };
      }
    });
    setCategoryData(temp);
  };

  const onCategoryClose = () => {
    let temp = categoryData.map((event: any) => {
      if (event.isChecked) {
        setValue("feedCategory", event.name);
        return event.name;
      }
    });

    return temp;
  };
  const renderCategoryItem = ({ item }: any) => {
    return (
      <ListButton
        onPress={() => {
          onCategoryPress(item.id);
          refCategoryEventSheet.current?.close();
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
    <Upload onPress={() => refCategoryEventSheet.current?.open()}>
      <TextLabel>카테고리</TextLabel>
      <UploadText>{onCategoryClose()}</UploadText>
      <CategoryBottomSheet
        ref={refCategoryEventSheet}
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
            data={categoryData}
            renderItem={renderCategoryItem}
          />
        </SafeAreaView>
      </CategoryBottomSheet>
    </Upload>
  );
}
