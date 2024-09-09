import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { isLoggedInVar, logUserOut } from "../apollo";

const SEE_USER_QUERY = gql`
  query seeUser($id: Int) {
    seeUser(id: $id) {
      id
      username
      avatar
    }
  }
`;

export default function useUser(userId: any) {
  const { data }: any = useQuery(SEE_USER_QUERY, {
    variables: {
      id: parseInt(userId),
    },
  });

  return data?.seeUser;
}
