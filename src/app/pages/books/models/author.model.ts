import type { AuthorEnum, IAuthor } from '../interfaces/author.interface';

export class Author implements IAuthor {
  constructor(
    public id: string,
    public createdAt: Date,
    public name: string,
    public lastName: string,
    public age: number,
    public gender: AuthorEnum,
    public biography: string,
    public updatedAt?: Date,
    public profilePictureUrl?: string
  ) {}

  static fromResponseToAuthor(data: IAuthor): Author {
    return {
      id: data.id,
      createdAt: new Date(data.createdAt),
      name: data.name,
      lastName: data.lastName,
      age: data.age,
      gender: data.gender,
      biography: data.biography,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
      profilePictureUrl: data.profilePictureUrl,
    };
  }
}
