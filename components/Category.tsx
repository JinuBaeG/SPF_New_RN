import { gql, useQuery } from "@apollo/client";
import React from "react";
import { FlatList, Text, View } from "react-native";
import styled from "styled-components/native";
import useCategory from "../hooks/useCategory";

const CategoryContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 8px;
  width: 100%;
  background-color: ${(props: { theme: { mainBgColor: any; }; }) => props.theme.mainBgColor};
`;

const CategoryView = styled.TouchableOpacity<{ isChecked: Boolean }>`
  flex-direction: row;
  align-items: center;
  margin-right: 4px;
  padding: 4px;
  background-color: ${(props: { isChecked: any; theme: { greenInactColor: any; greenActColor: any; }; }) =>
    props.isChecked ? props.theme.greenInactColor : props.theme.greenActColor};
  border-radius: 4px;
  height: 28px;
`;

const CategoryText = styled.Text`
  color: ${(props: { theme: { greenTextColor: any; }; }) => props.theme.greenTextColor};
`;

export default function Category({ category, setCategory, refresh }: any) {
  const categoryList = useCategory(category);

  const renderCategory = ({ item: category }: any) => {
    return (
      <CategoryView
        onPress={() => {
          setCategory(category.name);
          refresh();
          category.isChecked = true;
        }}
        isChecked={category.isChecked}
      >
        <CategoryText>{category.name}</CategoryText>
      </CategoryView>
    );
  };
  return (
    <CategoryContainer>
      <CategoryView
        onPress={() => {
          setCategory("");
          refresh();
        }}
        isChecked={false}
      >
        <CategoryText>전체보기</CategoryText>
      </CategoryView>
      <FlatList
        horizontal={true}
        data={categoryList}
        keyExtractor={(category: any) => "" + category.id}
        renderItem={renderCategory}
      />
    </CategoryContainer>
  );
}
