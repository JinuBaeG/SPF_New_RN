import MultipleImagePicker from "@baronha/react-native-multiple-image-picker";
import { ReactNativeFile } from "apollo-upload-client";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  View,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const TextWrap = styled.View`
  width: 100%;
  padding: 16px;
  background-color: ${(props) => props.theme.whiteColor};
  border-radius: 8px;
  margin-bottom: 8px;
`;

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

export function FeedImageComp({ id, setValue, imagePath }: any) {
  // 사진 첨부 - 시작
  const [images, setImages] = useState([]);
  const dimensions = useWindowDimensions();
  const winWidth = dimensions.width;
  const mediaWidth = (winWidth - 92) / 3;

  useEffect(() => {
    if (id) {
      setCurGroupImage();
    }
  }, []);

  const setCurGroupImage = () => {
    if (imagePath !== null && imagePath !== undefined) {
      let path = imagePath.map((item: any) => {
        return [{ path: item.imagePath }];
      });
      setImages(path);
    }
  };

  const setUploadFiles = (uploadFiles: any) => {
    let files = new Array();
    uploadFiles.map((item: any) => {
      const file = new ReactNativeFile({
        uri: item.path,
        name: item.fileName,
        type: item.mime,
      });
      files.push(file);
    });

    setValue("files", files);
    files = [];
  };

  const openPicker = async () => {
    try {
      const response: any = await MultipleImagePicker.openPicker<any>({
        selectedAssets: images,
        mediaType: "image",
        usedCameraButton: false,
        isCrop: true,
        isCropCircle: true,
        maxSelectedAssets: 10,
        maximumMessageTitle: "플레이 인 어스",
        maximumMessage: "최대 등록 가능한 사진 수는 10개 입니다.",
      });
      setImages(response);
      setUploadFiles(response);
    } catch (e) {
      console.log(e);
    }
  };

  const onDelete = (value: any) => {
    const data = images.filter(
      (item: any) =>
        item?.localIdentifier &&
        item?.localIdentifier !== value?.localIdentifier
    );
    setImages(data);
    setUploadFiles(data);
  };

  const uploadPhotoItem = ({ item, index }: any) => {
    return (
      <View>
        <Image
          style={{
            width: mediaWidth,
            height: mediaWidth,
            margin: 4,
            borderRadius: 4,
          }}
          source={{
            uri: item?.path,
          }}
        />
        <TouchableOpacity
          style={{ position: "absolute", bottom: 4, right: 4 }}
          onPress={() => onDelete(item)}
          activeOpacity={0.9}
        >
          <Ionicons name="close-circle-outline" color={"white"} size={24} />
        </TouchableOpacity>
      </View>
    );
  };

  // 사진 첨부 - 끝
  return (
    <Upload onPress={openPicker}>
      <TextLabel>사진 첨부</TextLabel>
      <UploadText>사진 선택...</UploadText>
      <SafeAreaView
        style={{
          position: "relative",
        }}
      >
        <FlatList
          style={{
            paddingTop: 6,
          }}
          data={images}
          keyExtractor={(item: any, index: any) =>
            (item?.filename ?? item?.path) + index
          }
          renderItem={uploadPhotoItem}
          numColumns={3}
        />
      </SafeAreaView>
    </Upload>
  );
}
