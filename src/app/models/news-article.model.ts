export type NewsArticleType = 'newSet' | 'tips' | 'cleanSort' | 'family' | 'behindTheScenes' | 'newsAndActions';

export interface NewsArticle {
    type: NewsArticleType;
    id?: string;
    title: string;
    slug?: string;
    excerpt: string;
    text: string;
    ourAdvice?: string;
    heroImage: string;
    published: boolean;
    publishedAt?: any;
    blocks: NewsBlock[];
    createdAt?: any;
    updatedAt?: any;
}

export type NewsBlockType = 'text' | 'image' | 'quote' | 'tip' | 'set' | 'video';

export interface NewsBlock {
    type: NewsBlockType;

    title?: string;
    text?: string;

    image?: string;
    imageAlt?: string;
    caption?: string;

    // LEGO set
    setId?: string;
    setName?: string;
    setImage?: string;
    legoId?: number;
    pieces?: number;
    price?: number;
    setLink?: string;

    // YouTube
    videoUrl?: string;
    videoTitle?: string;
    videoDescription?: string;
}
