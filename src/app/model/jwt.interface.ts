export interface IJwt {
    jti: string,
    email: string,
    nombre: string,
    apellido1: string,
    sub: string,
    iss: string,
    iat: number,
    exp: number
}