

export interface ISocio {
  id: number;
  dni: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  email: string;
  telefono: string;
  fotoDni: string | null;  // Foto del DNI, opcional y de tipo File
}
