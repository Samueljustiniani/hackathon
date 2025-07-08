// src/app/models/ficha-bibliografica.model.ts
export interface FichaBibliografica {
  idFicha?: number;
  tipoDocumento: string;
  autor: string;
  titulo: string;
  anioPublicacion: number;
  editorial: string;
  numeroEdicion: string;
  numeroPaginas: number;
  tema: string;
  fechaAgregada?: Date;
  estado?: boolean;
}