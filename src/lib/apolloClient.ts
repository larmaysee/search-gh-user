// src/apolloClient.ts
import config from "@/config/app-config";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: `${config.githubUrl}`,
  headers: {
    Authorization: `Bearer ${config.githubToken}`, // Token from environment variables
  },
  cache: new InMemoryCache(),
});

export default client;
