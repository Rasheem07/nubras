import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://your-hasura-instance.hasura.app/v1/graphql",
  headers: {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": "kB8Ki1OPLnq6T53sJYAbIxu54ZgjMK6PVweCOgDkL7ntugrgb5FREG9Y7bdnfQK0",
  },
  cache: new InMemoryCache(),
});

export default client;
