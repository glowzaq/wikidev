import { HttpLink } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";
import { ApolloClient } from "@apollo/client";

const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

export default client;