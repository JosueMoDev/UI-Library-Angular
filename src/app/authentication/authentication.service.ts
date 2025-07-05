import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '@core/Supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private supabaseService: SupabaseService = inject(SupabaseService);
  private token: string | undefined;
  private authenticatedUser!: string | null;

  async signInWithCredentials() {
    const { data, error } =
      await this.supabaseService.supabase.auth.signInWithPassword({
        email: 'jonasjosuemoralese@gmail.com',
        password: 'QfRcHJD4s3fgY_.',
      });
    if (error) throw new Error(error.message);
    if (data.session.access_token)
      await this.supabaseService.supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
    this.token = data.session.access_token;
    this.authenticatedUser = data.user.id;
    return data;
  }

  getBearerToken() {
    if (this.token === undefined) return '';
    return this.token;
  }

  getAuthenticatedUser() {
    if (!this.authenticatedUser) return null;
    return this.authenticatedUser;
  }
}
