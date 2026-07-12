export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Vacation {
  id: number;
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  imageFilename: string;
  likesCount: number;
  isLiked: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ReportItem {
  destination: string;
  likesCount: number;
}

export type VacationFilter = 'all' | 'liked' | 'active' | 'future';
