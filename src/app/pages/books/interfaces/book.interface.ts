import { IAuthor } from './author.interface';
import { IGenre } from './genre.interface';

export interface IBook {
  id: string;
  created_at: Date;
  title: string;
  description: string;
  physical_enable: boolean;
  price: number;
  downloads: number;
  stars: number;
  lenguages: string;
  authors: IAuthor[];
  genres: IGenre[];
  stock: number;
  total_sales: number;
  updatedAt?: Date;
  cover_url?: string;
  digitalFileUrl?: string;
}
