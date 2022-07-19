import { promisify } from 'util'
import {
  Secret,
  SignOptions,
  sign,
  verify

} from 'jsonwebtoken'

if( process.env.MODE !== 'PRODUCTION') {
  require('dotenv').config()
}

// interface AsyncJwt {
//   sign: (payload: any, secret: string, options?: any) => Promise<string>
//   verify: (payload: any, secret: string, options?: any) => Promise<string>
// }

// const AsyncJwt: AsyncJwt = {
//   sign: promisify(jwt.sign),
//   verify: promisify(jwt.verify)
// }

const asyncSign = promisify<string|object|Buffer, Secret, SignOptions>(sign)
const asyncVerify = promisify<string, Secret, any>(verify)

/**
 * @exports @const
 * Random alphanumeric sequence for salting JWT.
 */
export const { APPLICATION_SECRET } = process.env as { APPLICATION_SECRET: Secret }
if( !APPLICATION_SECRET ) {
  throw new Error('APPLICATION_SECRET is undefined')
}

/**
 * @exports @const
 * Expiration time in seconds.
 */
export const EXPIRES_IN = 36000

/**
 * @exports @class
 * Token service for signing and decoding objects with JWT.
 */
export class TokenService {
  /**
   * @static @method
   * Creates a token from a object.
   */
  static sign(payload: object, secret?: string): Promise<void|string> {
    return asyncSign(payload, secret || APPLICATION_SECRET, {
      expiresIn: EXPIRES_IN
    })
  }

  /**
   * @static @method
   * Verifies token authenticity.
   */
  static verify(token: string, secret?: string) {
    return asyncVerify(token, secret || APPLICATION_SECRET)
  }

  /**
   * @static @method
   * Decodes token to object.
   */
  static decode(token: string, secret?: string): Promise<any> {
    return asyncVerify(token, secret || APPLICATION_SECRET)
  }
}
