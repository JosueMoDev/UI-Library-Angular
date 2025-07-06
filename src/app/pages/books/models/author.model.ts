import type { AuthorEnum, IAuthor } from '../interfaces/author.interface';

export class Author implements IAuthor {
  constructor(
    public id: string,
    public created_at: Date,
    public name: string,
    public lastname: string,
    public age: number,
    public gender: AuthorEnum,
    public biography: string,
    public updated_at?: Date,
    public profile_picture?: string
  ) {}

  static fromResponseToAuthor(data: IAuthor): Author {
    return {
      id: data.id,
      created_at: new Date(data.created_at),
      name: data.name,
      lastname: data.lastname,
      age: data.age,
      gender: data.gender,
      biography: data.biography,
      updated_at: data.updated_at ? new Date(data.updated_at) : undefined,
      profile_picture: data.profile_picture,
    };
  }
}
