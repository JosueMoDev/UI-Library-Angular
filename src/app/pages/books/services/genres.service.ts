import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '@services/Supabase.service';
import { IGenre } from '../interfaces/genre.interface';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthenticationService } from '@services/authentication.service';
import { Genre } from '../models/genre.model';
import { CreateGenreDto } from '../dtos/create-genre.dto';
import { UpdateGenreDto } from '../dtos/update-genre.dto';

@Injectable({
  providedIn: 'root',
})
export class GenresService {
  private supabaseService = inject(SupabaseService);
  private supabase: SupabaseClient = this.supabaseService.supabase;

  async addGenre(genre: CreateGenreDto): Promise<IGenre> {
    const { data, error } = await this.supabase
      .from('Genres')
      .insert([genre])
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data as Genre;
  }

  async updateGenre(genre: UpdateGenreDto): Promise<IGenre> {
    const { id, updated_by, ...updateData } = genre;

    const { data, error } = await this.supabase
      .from('Genres')
      .update({
        ...updateData,
        updated_by,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as IGenre;
  }

  async getGenres(): Promise<IGenre[]> {
    const { data, error } = await this.supabase.from('Genres').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}
