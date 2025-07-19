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
    public fullName: string,
    public updated_at?: Date,
    public profile_picture_url?: string
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
      fullName: `${data.name} ${data.lastname}`,
      updated_at: data.updated_at ? new Date(data.updated_at) : undefined,
      profile_picture_url:
        data.profile_picture_url ?? 'assets/images/no-user.png',
    };
  }
}
