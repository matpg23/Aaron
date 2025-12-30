
export interface FishingRecommendation {
  summary: string;
  spots: FishingSpot[];
  timing: string;
  tackle: TackleRecommendation[];
  proTips: string[];
  sources: GroundingSource[];
}

export interface FishingSpot {
  name: string;
  description: string;
  url?: string;
}

export interface TackleRecommendation {
  item: string;
  reason: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  address?: string;
}
