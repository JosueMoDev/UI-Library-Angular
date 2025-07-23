import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '@core/Supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateAuthorDto } from '../dtos/create-author.dto';
import { Author } from '../models/author.model';
import { UpdateAuthorDto } from '../dtos/update-author.dto';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorsService {
  private supabaseService = inject(SupabaseService);
  private supabase: SupabaseClient = this.supabaseService.supabase;
  private auth = inject(AuthenticationService);

  async addAuthor(author: CreateAuthorDto): Promise<Author> {
    const { data, error } = await this.supabase
      .from('Authors')
      .insert([author])
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data as Author;
  }

  async updateAuthor(dto: UpdateAuthorDto): Promise<Author> {
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

    return data as Author;
  }

  async getAuthors(): Promise<Author[]> {
    const { data, error } = await this.supabase.from('Authors').select('*');
    if (error) {
      throw new Error(error.message);
    }
    const authorsMappeds = data.map(Author.fromResponseToAuthor);
    return authorsMappeds;
  }

  async uploadFile(file: File, author: Author) {
    const { data, error } = await this.supabase.storage
      .from('author-profile')
      .upload(`${file.name}`, file);
    if (error) throw new Error(error.message);

    this.setProfilePictureUrl(data.path, author);
  }

  async setProfilePictureUrl(filename: string, author: Author) {
    const { data, error } = await this.supabase.storage
      .from('author-profile')
      .createSignedUrl(filename, 604800, {
        transform: {
          width: 500,
          height: 600,
        },
      });

    if (error) return;
    await this.updateAuthor({
      id: author.id,
      updated_by: this.auth.getAuthenticatedUser()!,
      profile_picture_url: data.signedUrl,
    });
  }
}
