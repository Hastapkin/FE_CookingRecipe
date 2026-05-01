export interface Course {
  id: number;
  title: string;
  description?: string;
  thumbnail?: string | null;
  price: number;
  difficulty: string;
  duration?: number | null;
  moduleCount?: number;
  lessonCount?: number;
  rating: number;
  totalRatings: number;
  youtubeVideoId?: string;
  videoUrl?: string | null;
  videoThumbnail?: string | null;
  isForSale?: boolean;
  cookingTime?: number;
  servings?: number;
  category?: string;
  viewCount?: number;
  purchaseCount?: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  ingredients?: Array<{
    label: string;
    quantity: number;
    measurement: string;
  }>;
  instructions?: Array<{
    step: number;
    content: string;
  }>;
  tags?: string[];
  nutrition?: Array<{
    type: string;
    quantity: number;
    measurement: string;
  }>;
}

export type Recipe = Course;
