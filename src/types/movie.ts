export interface Movie {
  id: string;
  title: string;
  titleTh?: string;
  year: number;
  rating: number;
  quality: 'HD' | 'Full HD' | '4K' | 'Zoom';
  audio: 'เสียงไทย' | 'Sound Track' | 'พากย์ไทย' | 'ซับไทย';
  poster: string;
  backdrop?: string;
  genres: string[];
  duration?: string;
  synopsis?: string;
  isNew?: boolean;
  isSeries?: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  href: string;
}

export interface Genre {
  id: string;
  name: string;
  nameEn: string;
  href: string;
}
