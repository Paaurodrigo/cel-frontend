export interface IInstalacion {
    id: number;
    nombre: string;
    paneles: number;
    potenciaPanel: number;
    potenciaTotal: number;
    potenciaDisponible: number;
    precioKw: number;
    conexiones?: any;
    direccion: string;
    cau: string;
}