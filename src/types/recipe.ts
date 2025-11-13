export interface Recipe {
  id: number;
  title: string;
  description?: string;
  youtubeVideoId: string;
  videoUrl?: string | null;
  videoThumbnail?: string | null;
  price: number;
  isForSale: boolean;
  difficulty: string;
  cookingTime: number;
  servings: number;
  category: string;
  rating: number;
  totalRatings: number;
  viewCount: number;
  purchaseCount: number;
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

