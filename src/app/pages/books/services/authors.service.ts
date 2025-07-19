import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '@core/Supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateAuthorDto } from '../dtos/create-author.dto';
import { IAuthor } from '../interfaces/author.interface';
import { Author } from '../models/author.model';
import { UpdateAuthorDto } from '../dtos/update-author.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthorsService {
  private supabaseService = inject(SupabaseService);
  private supabase: SupabaseClient = this.supabaseService.supabase;

  async addAuthor(author: CreateAuthorDto): Promise<IAuthor> {
    const { data, error } = await this.supabase
      .from('Authors')
      .insert([author])
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data as IAuthor;
  }

  async updateAuthor(dto: UpdateAuthorDto): Promise<IAuthor> {
    const { id, updated_by, ...updateData } = dto;
    const { data, error } = await this.supabase
      .from('Authors')
      .update({ ...updateData, updated_by })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as IAuthor;
  }

  async getAuthors(): Promise<IAuthor[]> {
    const { data, error } = await this.supabase.from('Authors').select('*');
    if (error) {
      throw new Error(error.message);
    }
    const authorsMappeds = data.map(Author.fromResponseToAuthor);
    return authorsMappeds;
  }
}
