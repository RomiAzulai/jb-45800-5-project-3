export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  created_at?: Date;
}

export interface Vacation {
  id: number;
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
  image_filename: string;
  created_at?: Date;
}

export interface VacationWithLikes extends Vacation {
  likes_count: number;
  is_liked: boolean;
}

export interface Like {
  id: number;
  user_id: number;
  vacation_id: number;
  created_at?: Date;
}

export interface JwtPayload {
  id: number;
  email: string;
  role: 'user' | 'admin';
  firstName: string;
  lastName: string;
}

export type VacationFilter = 'all' | 'liked' | 'active' | 'future';

export interface ReportItem {
  destination: string;
  likes_count: number;
}
