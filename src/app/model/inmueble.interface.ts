import { ISocio } from "./socio.interface";

export interface IInmueble {
    id: number;
    cups: string;
    direccion: string;
    codigoPostal: string;
    municipio: string;
    refCatas: string;
    potencia1: string;
    potencia2: string;
    tension: string;
    uso: string;
    consumoAnual:number;
    habitos: string;
    intencion: string;
    recomendacion:string;
    socio: ISocio;
}
  