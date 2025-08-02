export enum AuthorEnum {
  FEMALE = 'female',
  MALE = 'male',
}
export interface IAuthor {
  id: string;
  name: string;
  created_at: Date;
  age: number;
  lastname: string;
  gender: AuthorEnum;
  biography: string;
  fullName: string;
  updated_at?: Date;
  profile_picture_url?: string;
}
