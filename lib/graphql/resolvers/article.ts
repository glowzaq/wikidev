import { articleType } from "@/app/shared/type";
import Article from "@/models/articles.model";
import mongoose from "mongoose";


export const articleResolver = {
    Query: {
        articles: async () => await Article.find({}).sort({ createdAt: -1 }),
        article: async (_: any, { id }: { id: string }) => await Article.findById(id),
        userArticles: async (_: any, { author }: { author: string }) => await Article.find({ author }).sort({ createdAt: -1 }),
        userArticlesById: async (_: any, { authorId }: { authorId: string }) => {
            return await Article.find({ authorId: new mongoose.Types.ObjectId(authorId) }).sort({ createdAt: -1 });
        }
    },
    Mutation: {
        createArticle: async (_: any, { title, content, category, author, authorId }: articleType) => {
            const trimmedTitle = title.trim();
            const trimmedContent = content.trim();

            if (trimmedTitle.length < 5) throw new Error("Title must be at least 5 characters long");
            if (trimmedTitle.length > 100) throw new Error("Title exceeds maximum length of 100 characters");
            if (trimmedContent.length < 20) throw new Error("Content must be at least 20 characters long");

            const newArticle = await Article.create({
                title: trimmedTitle,
                content: trimmedContent,
                category,
                author,
                authorId
            })
            return newArticle
        },
        updateArticle: async (_: any, { id, title, content, category }: { id: string, title?: string, content?: string, category?: string }) => {
            const updateData: any = { category };
            
            if (title !== undefined) {
                const trimmedTitle = title.trim();
                if (trimmedTitle.length < 5) throw new Error("Title must be at least 5 characters long");
                if (trimmedTitle.length > 100) throw new Error("Title exceeds maximum length of 100 characters");
                updateData.title = trimmedTitle;
            }
            
            if (content !== undefined) {
                const trimmedContent = content.trim();
                if (trimmedContent.length < 20) throw new Error("Content must be at least 20 characters long");
                updateData.content = trimmedContent;
            }

            const updatedArticle = await Article.findByIdAndUpdate(
                id,
                updateData,
                { returnDocument: 'after' }
            );
            if (!updatedArticle) throw new Error("Article not found");
            return updatedArticle;
        },
            deleteArticle: async (_: any, { id }: { id: string }) => {
                const deletedArticle = await Article.findByIdAndDelete(id);
                if (!deletedArticle) throw new Error("Article not found");
                return deletedArticle;
            },
            likeArticle: async (_: any, { articleId, userId }: { articleId: string, userId: string }) => {
                const article = await Article.findByIdAndUpdate(
                    articleId,
                    { $addToSet: { likes: userId } },
                    { new: true }
                );
                if (!article) throw new Error("Article not found");
                return article;
            },
            unlikeArticle: async (_: any, { articleId, userId }: { articleId: string, userId: string }) => {
                const article = await Article.findByIdAndUpdate(
                    articleId,
                    { $pull: { likes: userId } },
                    { new: true }
                );
                if (!article) throw new Error("Article not found");
                return article;
            },
            commentArticle: async (_: any, { articleId, userId, userName, text }: { articleId: string, userId: string, userName: string, text: string }) => {
                const article = await Article.findByIdAndUpdate(
                    articleId,
                    { $push: { comments: { userId, userName, text } } },
                    { new: true }
                );
                if (!article) throw new Error("Article not found");
                return article;
            }
        }
}