export interface devType {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export interface articleType {
    title: string,
    content: string,
    category: string,
    author: string,
    authorId: string,
}

export interface User {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    role: string,
    bio?: string
}

export interface Comment {
    id: string;
    userId: string;
    userName: string;
    text: string;
    createdAt: string;
}

export interface Article {
    id: string;
    title: string;
    content: string;
    category: string;
    author: string;
    authorId: string;
    likes: string[];
    comments: Comment[];
    createdAt: string;
    updatedAt?: string;
}

export interface ArticlesData {
    articles: Article[];
}

export interface ArticleData {
    article: Article;
}

export interface DevBookmarksData {
    dev: {
        id: string;
        bookmarks: Article[];
    };
}

export interface DevData {
    dev: User;
}

export interface UserArticlesData {
    userArticles: Article[];
}

export interface UserArticlesByIdData {
    userArticlesById: Article[];
}

export interface StatsData {
    articlesCount: number;
    devsCount: number;
}

export interface AuthPayload {
    token: string;
    dev: User;
}

export interface GoogleCallbackData {
    googleCallback: AuthPayload;
}

export interface LoginDevData {
    loginDev: AuthPayload;
}

export interface GoogleAuthUrlData {
    googleAuthUrl: string;
}