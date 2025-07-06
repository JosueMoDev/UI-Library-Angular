import { inject, Injectable } from '@angular/core';
import { IBook } from '../interfaces/book.interface';
import { SupabaseService } from '@core/Supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateBookDto } from '../dtos/create-book-dto';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private supabaseService = inject(SupabaseService);
  private supabase: SupabaseClient = this.supabaseService.supabase;

  get Books() {
    const books = Array.from({ length: 20 }, (_, i) => ({
      id: crypto.randomUUID(),
      title: `Libro de Ejemplo ${i + 1}`,
      image: `https://picsum.photos/450/500?random=${i}`,
      description: `Descripción del libro número ${i + 1}.`,
      price: Math.floor(Math.random() * 90) + 10,
      categories: ['Web Design', 'UX/UI', 'Frontend'], // <- arreglo de badges
      genre: '742db2c8-9f8e-41bb-b029-799e6b4cfcd3',
      quantity: Math.floor(Math.random() * 50) + 1,
      sales: Math.floor(Math.random() * 100) + 1,
      inventoryStatus: 'Disponible',
      rating: Math.floor(Math.random() * 5) + 1,
      physicalEnable: Math.random() < 0.7,
      authors: ['John Doe', 'Jane Smith'],
    }));

    return books;
  }

  async addBook(dto: CreateBookDto): Promise<IBook> {
    const { authors, genres, ...bookData } = dto;
    const { data: book, error: bookError } = await this.supabase
      .from('Books')
      .insert([bookData])
      .select('*')
      .single();

    if (bookError) throw new Error(bookError.message);

    const bookId = book.id;

    const genreRelations = genres.map((genre) => ({
      book_id: bookId,
      genre_id: genre,
    }));

    const { error: genreError } = await this.supabase
      .from('GenresBook')
      .insert(genreRelations);

    if (genreError) throw new Error(genreError.message);

    const authorRelations = authors.map((authorId) => ({
      book_id: bookId,
      author_id: authorId,
    }));

    const { error: authorError } = await this.supabase
      .from('AuthorsBook')
      .insert(authorRelations);

    if (authorError) throw new Error(authorError.message);

    return book;
  }

  async allBooks() {
    const { data, error } = await this.supabase.from('Books').select(`
      *,
      AuthorsBook (
        Authors (
          *
        )
      ),
      GenresBook (
        Genres (
          *
        )
      )
    `);

    if (error) throw new Error(error.message);
    // todo: mejorar esto
    // const mappedRs = data.map(({ AuthorsBook, GenresBook, ...book }) =>
    //   Book.fromResponseToBook({
    //     ...book,
    //     authors: AuthorsBook,
    //     genres: GenresBook,
    //   })
    // );
    // console.log(mappedRs);
    console.log(data);
    return data;
  }
}
