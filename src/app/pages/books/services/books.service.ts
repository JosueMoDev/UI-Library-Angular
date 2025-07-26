import { inject, Injectable } from '@angular/core';
import { IBook } from '../interfaces/book.interface';
import { SupabaseService } from '@core/Supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateBookDto } from '../dtos/create-book.dto';
import { Book } from '../models/book.model';
import { UpdateBookDto } from '../dtos/update-book.dto';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private supabaseService = inject(SupabaseService);
  private supabase: SupabaseClient = this.supabaseService.supabase;
  private auth = inject(AuthenticationService);

  async findBookById(id: string): Promise<Book> {
    const { data, error } = await this.supabase
      .from('Books')
      .select(
        `*,
      GenresBook (
          Genres (
            *
          )
        ),
        AuthorsBook (
          Authors (
            *
          )
        )
    `
      )
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);

    return Book.fromResponseToBook({
      ...data,
      authors: data.AuthorsBook,
      genres: data.GenresBook,
    });
  }

  async addBook(dto: CreateBookDto): Promise<Book> {
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

  async allBooks(): Promise<Book[]> {
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
    if (!data) return [];

    const mappedData = data.map(({ AuthorsBook, GenresBook, ...book }) =>
      Book.fromResponseToBook({
        ...book,
        authors: AuthorsBook,
        genres: GenresBook,
      })
    );
    return mappedData;
  }

  async updateBook(dto: UpdateBookDto): Promise<Book> {
    const { id, updated_by, genres, authors, ...book } = dto;

    const currentBook = await this.findBookById(id);

    const genresToDelete = currentBook.genres.filter(
      (genre) => !genres?.includes(genre.id)
    );
    const authorsToDelete = currentBook.authors.filter(
      (author) => !authors?.includes(author.id)
    );

    if (genresToDelete.length > 0) {
      await this.supabase
        .from('GenresBook')
        .delete()
        .in(
          'genre_id',
          genresToDelete.map((genre) => genre.id)
        );
    }

    if (authorsToDelete.length > 0) {
      await this.supabase
        .from('AuthorsBook')
        .delete()
        .in(
          'author_id',
          authorsToDelete.map((author) => author.id)
        );
    }

    const newGenres = genres!
      .filter(
        (genreId) => !currentBook.genres.some((genre) => genre.id === genreId)
      )
      .map((genreId) => ({ book_id: id, genre_id: genreId }));

    const newAuthors = authors!
      .filter(
        (authorId) =>
          !currentBook.authors.some((author) => author.id === authorId)
      )
      .map((authorId) => ({ book_id: id, author_id: authorId }));

    if (newGenres.length > 0) {
      await this.supabase.from('GenresBook').upsert(newGenres);
    }

    if (newAuthors.length > 0) {
      await this.supabase.from('AuthorsBook').upsert(newAuthors);
    }

    const { error: updateBookError } = await this.supabase
      .from('Books')
      .update({
        ...book,
        updated_by,
      })
      .eq('id', id);

    if (updateBookError) {
      throw new Error(updateBookError.message);
    }

    const { data, error } = await this.supabase
      .from('Books')
      .select(
        `*,
       GenresBook (
          Genres (
            *
          )
        ),
        AuthorsBook (
          Authors (
            *
          )
        )
    `
      )
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new Error('Error getting updated book');
    }

    return Book.fromResponseToBook({
      ...data,
      authors: data.AuthorsBook,
      genres: data.GenresBook,
    });
  }

  async uploadFile(file: File, book: Book) {
    const { data, error } = await this.supabase.storage
      .from('books-covers')
      .upload(`${file.name}`, file);
    if (error) throw new Error(error.message);

    this.setCoverPictureUrl(data.path, book);
  }

  async setCoverPictureUrl(filename: string, book: Book) {
    const { data, error } = await this.supabase.storage
      .from('books-covers')
      .createSignedUrl(filename, 604800, {
        transform: {
          width: 500,
          height: 600,
        },
      });

    if (error) return;

    const { error: coverBookError } = await this.supabase
      .from('Books')
      .update({
        cover_url: data.signedUrl,
        updated_by: this.auth.getAuthenticatedUser(),
      })
      .eq('id', book.id);

    if (coverBookError) throw new Error('Error while uploading book cover');
  }
}
