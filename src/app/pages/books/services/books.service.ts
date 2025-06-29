import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  constructor() {}

  get Books() {
    const books = Array.from({ length: 20 }, (_, i) => ({
      id: crypto.randomUUID(),
      title: `Libro de Ejemplo ${i + 1}`,
      image: `https://picsum.photos/450/500?random=${i}`,
      description: `Descripción del libro número ${i + 1}.`,
      price: Math.floor(Math.random() * 90) + 10,
      categories: ['Web Design', 'UX/UI', 'Frontend'], // <- arreglo de badges
      genre: '742db2c8-9f8e-41bb-b029-799e6b4cfcd3',
      quantity: Math.floor(Math.random() * 50) + 1,
      sales: Math.floor(Math.random() * 100) + 1,
      inventoryStatus: 'Disponible',
      rating: Math.floor(Math.random() * 5) + 1,
      physicalEnable: Math.random() < 0.7,
      authors: ['John Doe', 'Jane Smith'],
    }));

    return books;
  }
}
