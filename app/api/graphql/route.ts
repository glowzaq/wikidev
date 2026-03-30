import { typeDefs } from "@/lib/graphql/typeDefs";
import { resolvers } from "@/lib/graphql/resolvers";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { connectDB } from "@/utils/connect";

await connectDB()

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };