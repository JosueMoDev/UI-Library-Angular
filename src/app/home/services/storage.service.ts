import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { SupabaseService } from '@services/Supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';
import * as tus from 'tus-js-client';
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
  #signedUrl: string | undefined;
  async uploadFile(
    { file, filename, bucket }: UploadFileOptions,
    onProgressFn: (progress: number) => void
  ): Promise<{ signedUrl: string }> {
    const {
      data: { session },
    } = await this.#supabase.auth.getSession();

    if (!session?.access_token) throw new Error('No access token found.');

    const endpoint = `https://${environment.projectId}.storage.supabase.co/storage/v1/upload/resumable`;
    return new Promise<{ signedUrl: string }>((resolve, reject) => {
      const upload = new tus.Upload(file, {
        endpoint,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${session.access_token}`,
          'x-upsert': 'true',
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        metadata: {
          bucketName: bucket,
          objectName: filename,
          contentType: file.type || 'application/octet-stream',
          cacheControl: '3600',
          metadata: JSON.stringify({
            customMetadata: true,
          }),
        },
        chunkSize: 6 * 1024 * 1024,
        onError: (error) => {
          console.error('Upload failed:', error);
          reject(error);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          onProgressFn(+percentage);
        },
        onSuccess: async () => {
          try {
            const { data, error } = await this.signedUrl(filename, bucket);
            if (error) {
              throw new Error(error.message);
            }
            resolve({ signedUrl: data.signedUrl });
          } catch (error) {
            reject(error);
          }
        },
      });

      upload.findPreviousUploads().then((previousUploads) => {
        if (previousUploads.length > 0) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }
        upload.start();
      });
    });
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
