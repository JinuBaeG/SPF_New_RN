import React, { useEffect, useRef, useState } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { RBSheetProps } from "react-native-raw-bottom-sheet";
import styled from "styled-components/native";
import ActiveInfoSheet from "react-native-raw-bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

interface TutorInfoProps {
  id: number | undefined;
  groupInfo: any | undefined;
  setValue: Function;
}

const TextWrap = styled.View`
  width: 100%;
  padding: 16px;
  background-color: ${(props) => props.theme.whiteColor};
  border-radius: 8px;
  margin-bottom: 8px;
`;

const TextLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.greenActColor};
  margin-bottom: 8px;
`;

const TextInput = styled.TextInput`
  font-size: 12px;
  color: ${(props) => props.theme.textColor};
`;

const UploadText = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-weight: 400;
  font-size: 12px;
`;

const AddButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const GroupActiveWrap = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const GroupActiveInfoWrap = styled.View`
  flex-direction: row;
`;

const GroupActiveRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
`;

const ActiveDateButton = styled.TouchableOpacity`
  width: 84px;
`;

const ActiveHistList = styled.View`
  width: 100%;
`;

const ActiveHistWrap = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin: 4px 0;
`;

const ActiveHistDate = styled.Text`
  width: 84px;
  font-size: 12px;
  color: ${(props) => props.theme.grayColor};
`;

const ActiveHistDisc = styled.Text`
  width: 60.5%;
  margin-right: 8px;
  font-size: 12px;
  color: ${(props) => props.theme.blackColor};
`;

export function TutorActInfoComp({ id, setValue, groupInfo }: TutorInfoProps) {
  // 그룹 활동 이력 - 시작
  LocaleConfig.locales["kr"] = {
    monthNames: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    monthNamesShort: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    dayNames: [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ],
    dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  };
  LocaleConfig.defaultLocale = "kr";
  const refAcitveSheet = useRef<RBSheetProps | undefined>();

  const [activeDate, setActiveDate] = useState("날짜 선택");
  const [activeDisc, setActiveDisc] = useState("");
  const [activeHist, setActiveHist] = useState<any | undefined>([]);
  useEffect(() => {
    if (id) {
      setGroupInfo(groupInfo);
    }
  }, []);

  // 그룹 정보 수정에서 그룹 이력 초기 정보 세팅을 위한
  const setGroupInfo = (groupInfo: any | undefined) => {
    let infoArr: any = [];
    groupInfo.map((item: any) => {
      let info = {
        id: item.id,
        awardDate: item.awardDate,
        discription: item.discription,
        isNew: item.isNew !== undefined ? item.isNew : false,
        isDelete: item.isDelete !== undefined ? item.isDelete : false,
      };
      infoArr.push(info);
    });
    // 날짜 오름차순으로 정렬
    infoArr.sort((a: any, b: any) => {
      if (a.awardDate > b.awardDate) return 1;
      if (a.awardDate === b.awardDate) return 0;
      if (a.awardDate < b.awardDate) return -1;
    });
    setActiveHist(infoArr);
  };

  const removeActiveInfo = (index: number) => {
    if (activeHist[index].isNew === true) {
      activeHist.splice(index, 1);
      setActiveHist(activeHist);
      setGroupInfo(activeHist);
    } else {
      activeHist[index].isDelete = true;
      setActiveHist(activeHist);
      setGroupInfo(activeHist);
    }
  };

  const sortActiveHist = (activeHist: any) => {
    activeHist.sort((a: any, b: any) => {
      if (a.awardDate > b.awardDate) return 1;
      if (a.awardDate === b.awardDate) return 0;
      if (a.awardDate < b.awardDate) return -1;
    });
    setActiveHist(activeHist);
  };

  const onSetActiveInfo = ({ activeDisc, activeDate }: any) => {
    const newHistory: any = {
      discription: activeDisc,
      awardDate: activeDate,
      isNew: true,
      isDelete: false,
    };
    setActiveHist([newHistory, ...activeHist]);
    setActiveDate("날짜 선택");
    setActiveDisc("");
    sortActiveHist([newHistory, ...activeHist]);
  };

  useEffect(() => {
    setValue("tutorInfo", activeHist);
  }, [activeHist]);

  // 그룹 활동 이력 - 끝

  return (
    <TextWrap>
      <TextLabel>튜터 활동 이력</TextLabel>
      <GroupActiveWrap>
        <GroupActiveRow>
          <GroupActiveInfoWrap>
            <ActiveDateButton onPress={() => refAcitveSheet.current?.open()}>
              <UploadText>{activeDate}</UploadText>
            </ActiveDateButton>
            <TextInput
              placeholder="활동 이력을 적어주세요"
              placeholderTextColor="rgba(0,0,0,0.2)"
              onChangeText={(text) => {
                setValue("groupname", text);
                setActiveDisc(text);
              }}
              maxLength={20}
              style={{ marginBottom: 8 }}
            >
              {activeDisc}
            </TextInput>
          </GroupActiveInfoWrap>
          <AddButton
            onPress={() => {
              onSetActiveInfo({ activeDisc, activeDate });
            }}
          >
            <UploadText>추가 </UploadText>
            <Ionicons name="add-circle" size={12} color={"#01aa73"} />
          </AddButton>
        </GroupActiveRow>
        <ActiveInfoSheet
          ref={refAcitveSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            draggableIcon: {
              backgroundColor: "#000",
            },
          }}
          height={400}
        >
          <Calendar
            onDayPress={(day: any) => {
              setActiveDate(day.dateString);
              refAcitveSheet.current?.close();
            }}
            markedDates={{ activeDate: { selected: true } }}
          />
        </ActiveInfoSheet>
      </GroupActiveWrap>
      <ActiveHistList>
        {activeHist !== undefined
          ? activeHist.map((item: any, index: any) => {
              if (activeHist[index].isDelete !== true) {
                return (
                  <ActiveHistWrap key={index}>
                    <ActiveHistDate>{item.awardDate}</ActiveHistDate>
                    <ActiveHistDisc>{item.discription}</ActiveHistDisc>
                    <AddButton
                      onPress={() => {
                        removeActiveInfo(index);
                      }}
                    >
                      <UploadText>삭제 </UploadText>
                      <Ionicons
                        name="remove-circle"
                        size={12}
                        color={"#01aa73"}
                      />
                    </AddButton>
                  </ActiveHistWrap>
                );
              } else {
                return null;
              }
            })
          : null}
      </ActiveHistList>
    </TextWrap>
  );
}
