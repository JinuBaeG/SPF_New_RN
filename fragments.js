import { gql } from "@apollo/client";

export const PHOTO_FRAGMENT_NATIVE = gql`
  fragment PhotoFragmentNative on Photo {
    id
    feedUpload {
      id
      imagePath
    }
    likes
    commentCount
    isLiked
    sportsEvent
    feedCategory
  }
`;

export const COMMENT_FRAGMENT_NATIVE = gql`
  fragment CommentFragmentNative on Comment {
    id
    user {
      id
      username
      avatar
    }
    reCommentCount
    payload
    isMine
    createdAt
  }
`;

export const RECOMMENT_FRAGMENT_NATIVE = gql`
  fragment ReCommentFragmentNative on ReComment {
    id
    comment {
      id
    }
    user {
      id
      username
      avatar
    }
    payload
    isMine
    createdAt
  }
`;

export const USER_FRAGMENT_NATIVE = gql`
  fragment UserFragmentNative on User {
    id
    username
    avatar
    isMe
    blockedBy {
      id
    }
  }
`;

export const USER_FULL_FRAGMENT_NATIVE = gql`
  fragment UserFullFragmentNative on User {
    id
    username
    email
    createdAt
    updatedAt
    avatar
    gender
    googleConnect
    kakaoConnect
    naverConnect
    appleConnect
    phoneNumber
  }
`;

export const FEED_PHOTO_NATIVE = gql`
  fragment FeedPhoto on Photo {
    ...PhotoFragmentNative
    user {
      id
      username
      avatar
    }
    caption
    createdAt
    isMine
  }
  ${PHOTO_FRAGMENT_NATIVE}
`;

export const ROOM_FRAGMENT_NATIVE = gql`
  fragment RoomParts on Room {
    id
    unreadTotal
    users {
      username
      avatar
    }
  }
`;

export const GROUPINFO_FRAGMENT_NATIVE = gql`
  fragment GroupInfoFragmentNative on GroupInfo {
    id
    awardDate
    discription
  }
`;

export const GROUP_FRAGMENT_NATIVE = gql`
  fragment GroupFragmentNative on Group {
    id
    name
    sidoName
    gusiName
    dongEubMyunName
    riName
    roadName
    buildingNumber
    zipcode
    activeArea
    address
    addrRoad
    zipcode
    areaLatitude
    areaLongitude
    sportsEvent
    groupImage {
      id
      imagePath
    }
    discription
    users {
      id
      username
      avatar
    }
    groupInfo {
      id
      discription
      awardDate
    }
    facility {
      id
      address
      discription
      name
      facilityTag {
        id
        name
      }
      facilitySports {
        id
        name
      }
    }
    groupTag {
      id
      name
    }
    userCount
    maxMember
    createdAt
    isJoin
    isJoining
    groupJoinRequest {
      id
      user {
        id
        username
        avatar
      }
    }
    isPresident
    groupPresident {
      id
      user {
        id
        username
        avatar
      }
    }
  }
`;

export const TUTOR_FRAGMENT_NATIVE = gql`
  fragment TutorFragmentNative on Tutor {
    id
    user {
      id
      username
    }
    name
    discription
    sidoName
    gusiName
    dongEubMyunName
    riName
    roadName
    buildingNumber
    zipcode
    activeArea
    address
    addrRoad
    addAddr
    areaLatitude
    areaLongitude
    maxMember
    userCount
    tutorImage {
      id
      imagePath
    }
    group {
      id
      name
      sportsEvent
      discription
      maxMember
      groupTag {
        id
        name
        imagePath
      }
    }
    facility {
      id
      name
    }
    tutorInfo {
      id
      discription
      awardDate
    }
    tutorTag {
      id
      name
      imagePath
    }
    tutorInquiry {
      id
      user {
        id
      }
      tutor {
        id
      }
      inquiryTitle
      inquiryDiscription
    }
    tutorSportsEvent {
      id
      name
    }
    isJoin
    isPresident
    tutorPresident {
      id
      user {
        id
        username
        avatar
      }
    }
  }
`;

export const TUTOR_INQUIRY_FRAGMENT_NATIVE = gql`
  fragment TutorInquiryFragmentNative on TutorInquiry {
    id
    user {
      id
    }
    tutor {
      id
    }
    tutorInquiryComment {
      id
      responseTitle
      responseDiscription
      answerOk
      createdAt
    }
    inquiryTitle
    inquiryDiscription
    inquiryResponse
    createdAt
  }
`;

export const BOARD_FRAGMENT_NATIVE = gql`
  fragment BoardFragmentNative on Board {
    id
    user {
      id
      username
      avatar
    }
    group {
      id
    }
    tutor {
      id
    }
    title
    discription
    sortation
    hits
    createdAt
    likes
    boardCommentCount
    isLiked
    isMine
  }
`;

export const BOARD_COMMENT_FRAGMENT_NATIVE = gql`
  fragment BoardCommentFragmentNative on BoardComment {
    id
    board {
      id
    }
    user {
      id
      username
      avatar
    }
    payload
    isMine
    boardReCommentCount
    createdAt
  }
`;

export const FACILITY_FRAGMENT_NATIVE = gql`
  fragment FacilityFragmentNative on Facility {
    id
    name
    discription
    sidoName
    gusiName
    dongEubMyunName
    riName
    roadName
    buildingNumber
    zipcode
    activeArea
    address
    addrRoad
    detailAddress
    areaLatitude
    areaLongitude
    facilityImage {
      id
      imagePath
    }
    group {
      id
      name
      sportsEvent
      discription
      maxMember
      groupTag {
        id
        name
        imagePath
      }
    }
    tutor {
      id
      name
      tutorSportsEvent {
        id
        name
      }
      discription
      maxMember
      tutorTag {
        id
        name
        imagePath
      }
    }
    facilityInfo {
      id
      discription
      awardDate
    }
    facilityTag {
      id
      name
      imagePath
    }
    facilitySports {
      id
      name
    }
  }
`;

export const BOARD_RECOMMENT_FRAGMENT_NATIVE = gql`
  fragment BoardReCommentFragmentNative on BoardReComment {
    id
    boardComment {
      id
    }
    user {
      id
      username
      avatar
    }
    payload
    isMine
    createdAt
  }
`;

export const NOTICE_FRAGMENT_NATIVE = gql`
  fragment NoticeFragmentNative on Notice {
    id
    user {
      id
      username
      avatar
    }
    group {
      id
    }
    tutor {
      id
    }
    title
    discription
    sortation
    hits
    createdAt
    likes
    noticeCommentCount
    isLiked
    isMine
  }
`;

export const NOTICE_COMMENT_FRAGMENT_NATIVE = gql`
  fragment NoticeCommentFragmentNative on NoticeComment {
    id
    notice {
      id
    }
    user {
      id
      username
      avatar
    }
    payload
    isMine
    noticeReCommentCount
    createdAt
  }
`;

export const NOTICE_RECOMMENT_FRAGMENT_NATIVE = gql`
  fragment NoticeReCommentFragmentNative on NoticeReComment {
    id
    noticeComment {
      id
    }
    user {
      id
      username
      avatar
    }
    payload
    isMine
    createdAt
  }
`;
