import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GenresService {
  constructor() {}
  get genres() {
    const genres = [
      {
        name: 'Novela',
        id: 'f59e5a44-21b0-4b7c-9ed7-80977d119f6e',
        description: 'Narraciones largas de ficción literaria.',
      },
      {
        name: 'Ciencia',
        id: '9876d52a-b49c-44b9-8b94-5130a9b0ea90',
        description:
          'Obras centradas en el conocimiento científico y su divulgación.',
      },
      {
        name: 'Ficción',
        id: 'f396a404-4629-4209-b2b7-5d56fa25149b',
        description: 'Relatos imaginarios que no se ajustan a hechos reales.',
      },
      {
        name: 'Aventura',
        id: '742db2c8-9f8e-41bb-b029-799e6b4cfcd3',
        description: 'Historias con viajes y desafíos emocionantes.',
      },
      {
        name: 'Romance',
        id: 'd1fe8e26-e8b0-4e7f-a8a6-f3d97dba7a57',
        description: 'Narraciones centradas en relaciones amorosas.',
      },
      {
        name: 'Terror',
        id: 'b799ef99-b59f-4c8b-9385-544e9ef704b9',
        description: 'Cuentos diseñados para causar miedo o inquietud.',
      },
      {
        name: 'Misterio',
        id: '24db85ed-19a5-4185-bdc1-5eb0d5e65f59',
        description: 'Relatos con enigmas o crímenes por resolver.',
      },
      {
        name: 'Fábula',
        id: 'c11a09e9-d2a9-457b-a395-ecdbfdde4005',
        description:
          'Historias breves con moraleja, usualmente con animales que hablan.',
      },
      {
        name: 'Suspenso',
        id: '7c15edee-e63c-4a71-a1cc-6be6ea0a4087',
        description: 'Relatos que mantienen al lector en tensión constante.',
      },
      {
        name: 'Histórica',
        id: 'd8fa90c4-8f97-4632-a877-c41f0d5fe2bb',
        description: 'Ficciones ambientadas en contextos del pasado real.',
      },
      {
        name: 'Experimental',
        id: 'abfc3bdf-12f4-4315-948d-3f99f8d8a3b5',
        description: 'Obras que desafían la narrativa tradicional.',
      },
      {
        name: 'Realismo mágico',
        id: '865e63b5-dfb4-45fa-a80e-bfbd09ad29fd',
        description:
          'Combinación de elementos mágicos con escenarios realistas.',
      },
      {
        name: 'Futurista',
        id: 'af3226b7-7b83-4dfb-a52a-0417cb3c251f',
        description: 'Relatos sobre futuros posibles o imaginarios.',
      },
      {
        name: 'Ciencia ficción',
        id: 'a3707382-bb1b-4882-9b29-5ef72f091b23',
        description:
          'Historias que exploran avances científicos o tecnológicos.',
      },
      {
        name: 'Drama',
        id: '9f23ea0b-0b6b-42f0-9d8a-b1b01ac7f04b',
        description:
          'Narrativas centradas en conflictos humanos y emocionales.',
      },
      {
        name: 'Juvenil',
        id: '6e620d84-d1a2-4424-bd4b-e4f788518ff5',
        description: 'Obras orientadas a un público adolescente o joven.',
      },
      {
        name: 'Clásicos',
        id: '9cfb7886-5b2d-49b5-835b-0b8d283e8f73',
        description: 'Literatura reconocida por su valor artístico y duradero.',
      },
    ];

    return genres;
  }
}
