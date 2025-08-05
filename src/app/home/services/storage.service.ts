import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '@services/Supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';
interface UploadFileOptions {
  file: File;
  filename: string;
  bucket: string;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  #supabaseService = inject(SupabaseService);
  #supabase: SupabaseClient = this.#supabaseService.supabase;
  async uploadFile({
    file,
    filename,
    bucket,
  }: UploadFileOptions): Promise<{ signedUrl: string }> {
    const { error: uploadError } = await this.#supabase.storage
      .from(bucket)
      .upload(`${filename}`, file);
    if (uploadError) throw new Error(uploadError.message);
    const { data, error } = await this.signedUrl(filename, bucket);
    if (error) throw new Error(error.message);
    return data;
  }

  async signedUrl(filename: string, bucket: string) {
    return await this.#supabase.storage
      .from(bucket)
      .createSignedUrl(filename, 31536000, {
        transform: {
          width: 500,
          height: 600,
        },
      });
  }
}
