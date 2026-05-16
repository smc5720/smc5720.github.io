export type Category = "news" | "dev" | "retrospective" | "release" | "etc";

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: Category;
  tags: string[];
  cover?: string;
  readingTime: number;
}

export interface Post extends PostMeta {
  content: string;
}
