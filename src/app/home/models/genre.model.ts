import { IGenre } from '../interfaces/genre.interface';

export class Genre implements IGenre {
  constructor(
    public id: string,
    public created_at: Date,
    public name: string,
    public description: string,
    public updated_at?: Date
  ) {}

  static fromResponseToGenre(data: IGenre): Genre {
    return {
      id: data.id,
      created_at: new Date(data.created_at),
      name: data.name,
      description: data.description,
      updated_at: data.updated_at ? new Date(data.updated_at) : undefined,
    };
  }
}
