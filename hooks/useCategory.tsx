import { gql, useQuery } from "@apollo/client";

const CATEGORYLIST_QUERY = gql`
  query seeFeedCategoryList {
    seeFeedCategoryList {
      id
      name
    }
  }
`;

export default function useCategory(name: any | undefined) {
  const { data: categoryList } = useQuery(CATEGORYLIST_QUERY, {
    variables: {
      offset: 0,
    },
    fetchPolicy: "cache-and-network",
  });
  let tagData: any = [];

  if (categoryList) {
    categoryList.seeFeedCategoryList.map((category: any) => {
      tagData.push({
        id: category.id,
        name: category.name,
        isChecked: false,
      });
    });
  }

  if (name !== "") {
    tagData.map((item: any, index: number) => {
      if (item.name === name) {
        tagData[index].isChecked = true;
      }
    });
  }

  return tagData;
}
