export interface IJwt {
    jti: string,
    email: string,
    nombre: string,
    apellido1: string,
    id: string,
    role: string,
    sub: string,
    iss: string,
    iat: number,
    exp: number
}