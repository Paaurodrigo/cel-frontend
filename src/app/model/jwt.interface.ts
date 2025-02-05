export interface IJwt {
    jti: string,
    email: string,
    sub: string,
    iss: string,
    iat: number,
    exp: number
}