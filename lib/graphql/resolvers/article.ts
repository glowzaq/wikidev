import { articleType } from "@/app/shared/type";
import Article from "@/models/articles.model";


export const articleResolver = {
    Query: {
        articles: async () => await Article.find({}),
        article: async (_: any, { id }: { id: string }) => await Article.findById(id)
    },
    Mutation: {
            createArticle: async (_:any, {title, content, category, author}: articleType)=> {
                const newArticle = await Article.create({
                    title,
                    content,
                    category,
                    author
                })
                return newArticle
            }
        }
}