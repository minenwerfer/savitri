import { promisify } from 'util'
import * as jwt from 'jsonwebtoken'

if( process.env.MODE !== 'PRODUCTION') {
  require('dotenv').config()
}

interface AsyncJwt {
  sign: (payload: object, secret: string, options: any) => Promise<any>;
  verify: (payloda: object, secret: string) => Promise<any>;
}

const AsyncJwt = {
  sign: promisify(jwt.sign),
  verify: promisify(jwt.verify)
}

/**
 * @exports @const
 * Random alphanumeric sequence for salting JWT.
 */
export const { TOKEN_SECRET } = process.env as { TOKEN_SECRET: jwt.Secret }
if( !TOKEN_SECRET ) {
  throw 'TOKEN_SECRET is undefined'
}

/**
 * @exports @const
 * Expiration time in seconds.
 */
export const EXPIRES_IN = 36000;

/**
 * @exports @class
 * Token service for signing and decoding objects with JWT.
 */
export class TokenService {

  /**
   * @static @method
   * Creates a token from a object.
   */
  static sign(payload: object) {
    return jwt.sign(payload, TOKEN_SECRET, {
      expiresIn: EXPIRES_IN
    })
  }

  /**
   * @static @method
   * Verifies token authenticity.
   */
  static verify(token: string) {
    return jwt.verify(token, TOKEN_SECRET)
  }

  /**
   * @static @method
   * Decodes token to object.
   */
  static decode(token: string) {
    return jwt.verify(token, TOKEN_SECRET, (err: any, decoded: any) => !err && decoded)
  }
}
