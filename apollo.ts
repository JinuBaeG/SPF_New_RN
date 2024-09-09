import {
  ApolloClient,
  InMemoryCache,
  makeVar,
  split,
  HttpLink,
  NormalizedCacheObject,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  getMainDefinition,
  offsetLimitPagination,
} from "@apollo/client/utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { OPER_URL, LOCAL_URL } from "@env";
import { Platform } from "react-native";

const TOKEN = "token";

export const isLoggedInVar = makeVar<boolean>(false);
export const tokenVar = makeVar<string | null>(null);

const uploadHttpLink = createUploadLink({
  uri:
    process.env.NODE_ENV === "development"
      ? Platform.OS === "ios"
        ? `${LOCAL_URL}:4000/graphql`
        : "http://10.44.100.43:4000/graphql"
      : `${OPER_URL}:4000/graphql`,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url:
      process.env.NODE_ENV === "development"
        ? Platform.OS === "ios"
          ? `${LOCAL_URL}:4000/graphql`
          : "http://10.44.100.43:4000/graphql"
        : `${OPER_URL}:4000/graphql`,
    connectionParams: async () => ({
      authToken: await AsyncStorage.getItem(TOKEN),
    }),
  })
);

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem(TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeFeed: offsetLimitPagination(),
        seeBoardComments: offsetLimitPagination(),
      },
    },
    User: {
      keyFields: ["id"],
      fields: {
        blockedBy: {
          merge(existing: any[] = [], incoming: any[]) {
            return [...existing, ...incoming];
          },
        },
      },
    },
    Message: {
      fields: {
        user: {
          merge: true,
        },
        feedCategory: {
          merge: true,
        },
      },
    },
  },
});

const httpLinks = authLink.concat(onErrorLink).concat(uploadHttpLink as unknown as HttpLink);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLinks
);

const client = new ApolloClient({
  link: splitLink,
  cache,
});

export default client;
