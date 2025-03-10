import { IInmueble } from "./inmueble.interface"
import { IInstalacion } from "./instalacion.interface"


export interface IConexion {
    id: number 
    potencia: string
    fecha: string
    porcentaje: number
    inmueble: IInmueble
    instalacion: IInstalacion
    firma: string
  }