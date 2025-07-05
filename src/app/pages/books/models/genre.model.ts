import { IGenre } from '../interfaces/genre.interface';

export class Genre implements IGenre {
  constructor(
    public id: string,
    public createdAt: Date,
    public name: string,
    public description: string,
    public updatedAt?: Date
  ) {}

  static fromResponseToGenre(data: IGenre): Genre {
    return {
      id: data.id,
      createdAt: new Date(data.createdAt),
      name: data.name,
      description: data.description,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    };
  }
}
