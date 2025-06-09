import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../../core/Supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private supabaseService: SupabaseService = inject(SupabaseService);

  async signInWithCredentials() {
    const { data, error } =
      await this.supabaseService.supabase.auth.signInWithPassword({
        email: 'jonasjosuemoralese@gmail.com',
        password: 'QfRcHJD4s3fgY_.',
      });
    if (error) throw new Error(error.message);
    return data;
  }
}
