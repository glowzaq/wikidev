import Article from "@/models/articles.model";


export const articleResolver = {
    Query: {
        articles: async () => await Article.find({}),
        article: async (_: any, { id }: { id: string }) => await Article.findById(id)
    }
}