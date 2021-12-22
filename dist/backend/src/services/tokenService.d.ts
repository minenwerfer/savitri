import * as jwt from 'jsonwebtoken';
/**
 * @exports @const
 * Random alphanumeric sequence for salting JWT.
 */
export declare const TOKEN_SECRET: jwt.Secret;
/**
 * @exports @const
 * Expiration time in seconds.
 */
export declare const EXPIRES_IN = 36000;
/**
 * @exports @class
 * Token service for signing and decoding objects with JWT.
 */
export declare class TokenService {
    /**
     * @static @method
     * Creates a token from a object.
     */
    static sign(payload: object): string;
    /**
     * @static @method
     * Verifies token authenticity.
     */
    static verify(token: string): string | jwt.JwtPayload;
    /**
     * @static @method
     * Decodes token to object.
     */
    static decode(token: string): void;
}
