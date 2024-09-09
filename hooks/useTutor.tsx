import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { isLoggedInVar, logUserOut } from "../apollo";

const SEE_TUTOR_QUERY = gql`
  query seeTutor($id: Int) {
    seeTutor(id: $id) {
      id
      name
    }
  }
`;

export default function useTutor(tutorId: any) {
  const { data }: any = useQuery(SEE_TUTOR_QUERY, {
    variables: {
      id: parseInt(tutorId),
    },
  });

  return data?.seeTutor;
}
