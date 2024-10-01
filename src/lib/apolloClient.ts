// src/apolloClient.ts
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: `${import.meta.env.VITE_GITHUB_URL}`,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`, // Token from environment variables
  },
  cache: new InMemoryCache(),
});

export default client;
