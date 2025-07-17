import { IAuthor } from '../interfaces/author.interface';
import { IBook } from '../interfaces/book.interface';
import { IGenre } from '../interfaces/genre.interface';
import { Author } from './author.model';
import { Genre } from './genre.model';

export class Book implements IBook {
  constructor(
    public id: string,
    public created_at: Date,
    public title: string,
    public description: string,
    public physical_enable: boolean,
    public price: number,
    public downloads: number,
    public stars: number,
    public lenguages: string,
    public authors: IAuthor[],
    public genres: IGenre[],
    public stock: number,
    public total_sales: number,
    public digitalFileUrl?: string,
    public updatedAt?: Date,
    public coverUrl?: string
  ) {}

  static fromResponseToBook(data: IBook): Book {
    return {
      id: data.id,
      created_at: new Date(data.created_at),
      title: data.title,
      description: data.description,
      physical_enable: data.physical_enable,
      digitalFileUrl: data.digitalFileUrl,
      price: data.price,
      downloads: data.downloads,
      stars: data.stars,
      lenguages: data.lenguages,
      // TODO HAY que pulir tema de mapper
      authors: data.authors.map(({ Authors }: any) =>
        Author.fromResponseToAuthor(Authors)
      ),
      genres: data.genres.map(({ Genres }: any) =>
        Genre.fromResponseToGenre(Genres)
      ),
      stock: data.stock ?? 0,
      total_sales: data.total_sales ?? 0,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
      coverUrl: data.coverUrl,
    };
  }
}
