export interface Recipe {
  id: number;
  title: string;
  description?: string;
  youtubeVideoId: string;
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
}

