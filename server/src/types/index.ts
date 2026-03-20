export interface JWTPayload {
  sub: string
  email: string
  plan: string
  iat?: number
  exp?: number
}
