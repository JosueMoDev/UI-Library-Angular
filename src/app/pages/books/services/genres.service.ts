import { Injectable } from '@angular/core';
import { SupabaseService } from '@core/Supabase.service';
import { IGenre } from '../interfaces/genre.interface';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { Genre } from '../models/genre.model';
import { CreateGenreDto } from '../dtos/create-genre.dto';

@Injectable({
  providedIn: 'root',
})
export class GenresService {
  supabase!: SupabaseClient;
  constructor(
    private supabaseService: SupabaseService,
    private auth: AuthenticationService
  ) {
    this.supabase = this.supabaseService.supabase;
  }

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

  async getGenres(): Promise<IGenre[]> {
    const { data, error } = await this.supabase.from('Genres').select('*');
    if (error) {
      throw new Error(error.message);
    }
    console.log(data);
    return data;
  }
}
