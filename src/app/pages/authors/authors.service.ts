import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthorsService {
  constructor() {}

  get authors() {
    const authors = [
      {
        id: '1f83b2e4-9f5b-4fae-bd40-246f4e741c56',
        name: 'Paulo',
        lastname: 'Coelho',
        nationality: 'Brasil',
        age: 77,
        biography:
          'Escritor brasileño conocido por "El Alquimista", una novela de desarrollo personal y espiritual.',
        photo:
          'https://images.pexels.com/photos/779393/pexels-photo-779393.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500',
      },
      {
        id: '3b61a8df-237b-4d6c-b2ed-81026df10b4b',
        name: 'Isabel',
        lastname: 'Allende',
        nationality: 'Chile',
        age: 82,
        biography:
          'Reconocida autora chilena de novelas históricas y de realismo mágico como "La casa de los espíritus".',
        photo:
          'https://images.pexels.com/photos/2557712/pexels-photo-2557712.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500',
      },
      {
        id: 'fc2f8d0b-d48f-4347-b1d3-97c0eac2b70a',
        name: 'Gabriel',
        lastname: 'García Márquez',
        nationality: 'Colombia',
        age: 87,
        biography:
          'Premio Nobel de Literatura, famoso por su novela "Cien años de soledad" y por el realismo mágico.',
        photo:
          'https://images.pexels.com/photos/5569301/pexels-photo-5569301.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500',
      },
      {
        id: '9c5218c3-f53e-4b77-b142-3d823d8efc3f',
        name: 'Laura',
        lastname: 'Esquivel',
        nationality: 'México',
        age: 74,
        biography:
          'Autora mexicana conocida por "Como agua para chocolate", una novela que mezcla cocina y amor.',
        photo:
          'https://images.pexels.com/photos/3807592/pexels-photo-3807592.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500',
      },
      {
        id: 'ee88e442-bc86-4980-b1a1-90d21336d9a4',
        name: 'Jorge Luis',
        lastname: 'Borges',
        nationality: 'Argentina',
        age: 86,
        biography:
          'Poeta, ensayista y cuentista argentino, figura clave de la literatura del siglo XX.',
        photo:
          'https://images.pexels.com/photos/3807592/pexels-photo-3807592.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500',
      },
      {
        id: 'b37cb8f7-95b1-437e-b1ad-baf09e805a55',
        name: 'Mario',
        lastname: 'Vargas Llosa',
        nationality: 'Perú',
        age: 88,
        biography:
          'Novelista peruano galardonado con el Nobel de Literatura, autor de "La ciudad y los perros".',
        photo:
          'https://images.pexels.com/photos/5649379/pexels-photo-5649379.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500',
      },
      {
        id: 'd54e2905-0d4f-4f91-98d3-cf7f3c4c3503',
        name: 'Carlos',
        lastname: 'Ruiz Zafón',
        nationality: 'España',
        age: 55,
        biography:
          'Escritor español reconocido por "La sombra del viento", parte de la saga "El Cementerio de los Libros Olvidados".',
        photo:
          'https://images.pexels.com/photos/1656362/pexels-photo-1656362.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500',
      },
      {
        id: '2c1358b3-7275-49ff-a5d6-2f79e6b733c5',
        name: 'Rosario',
        lastname: 'Castellanos',
        nationality: 'México',
        age: 49,
        biography:
          'Escritora y diplomática mexicana, defensora de los derechos de las mujeres e indígenas.',
        photo:
          'https://images.pexels.com/photos/3773310/pexels-photo-3773310.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500',
      },
      {
        id: 'af1e40f3-8b95-46d6-b1b7-9fcbbec7e02e',
        name: 'Julia',
        lastname: 'de Burgos',
        nationality: 'Puerto Rico',
        age: 39,
        biography:
          'Poeta puertorriqueña que exploró la identidad, el feminismo y la justicia social.',
        photo:
          'https://images.pexels.com/photos/3300846/pexels-photo-3300846.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500',
      },
      {
        id: '0742db24-7d91-4a03-b1c4-5f86149aa331',
        name: 'Juan',
        lastname: 'Rulfo',
        nationality: 'México',
        age: 68,
        biography:
          'Autor de "Pedro Páramo" y "El Llano en llamas", pieza clave del boom latinoamericano.',
        photo:
          'https://images.pexels.com/photos/3807592/pexels-photo-3807592.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500',
      },
    ];

    return authors;
  }
}
