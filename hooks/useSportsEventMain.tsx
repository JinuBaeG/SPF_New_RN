import { gql, useQuery } from "@apollo/client";

const SEESPORTSEVENT_QUERY = gql`
  query seeSportsEventMain($offset: Int) {
    seeSportsEventMain(offset: $offset) {
      id
      name
      imagePath
    }
  }
`;

export default function useSportsEventMain(sportsEvent: any | undefined) {
  const { data: eventList } = useQuery(SEESPORTSEVENT_QUERY, {
    variables: {
      offset: 0,
    },
    fetchPolicy: "cache-and-network",
  });

  const tagData: any = [];

  if (eventList) {
    eventList.seeSportsEventMain.map((event: any) => {
      tagData.push({
        id: event.id,
        name: event.name,
        imagePath: event.imagePath,
        isChecked: false,
      });
    });
  }

  if (sportsEvent) {
    tagData.map((item: any, index: number) => {
      if (item.name === sportsEvent) {
        tagData[index].isChecked = true;
      }
    });
  }

  return tagData;
}
