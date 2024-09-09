import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { isLoggedInVar, logUserOut } from "../apollo";

const ME_QUERY = gql`
  query me {
    me {
      id
      username
      avatar
      groupCount
      tutorCount
      tutor {
        id
      }
      group {
        id
      }
      blockedBy {
        id
        blockedBy {
          id
        }
      }
    }
  }
`;

export default function useMe() {
  const hasToken = useReactiveVar(isLoggedInVar);

  const { data } = useQuery(ME_QUERY, {
    skip: !hasToken,
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (data?.me === null) {
      logUserOut();
    }
  }, [data]);
  return { data };
}
