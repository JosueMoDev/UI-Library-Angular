export enum AuthorEnum {
  FEMALE = 'female',
  MALE = 'male',
}
export interface IAuthor {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
  name: string;
  lastName: string;
  age: number;
  gender: AuthorEnum;
  profilePictureUrl?: string;
  biography: string;
}
