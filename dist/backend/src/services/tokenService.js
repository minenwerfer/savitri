"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = exports.EXPIRES_IN = exports.TOKEN_SECRET = void 0;
const util_1 = require("util");
const jwt = __importStar(require("jsonwebtoken"));
if (process.env.MODE !== 'PRODUCTION') {
    require('dotenv').config();
}
const AsyncJwt = {
    sign: (0, util_1.promisify)(jwt.sign),
    verify: (0, util_1.promisify)(jwt.verify)
};
/**
 * @exports @const
 * Random alphanumeric sequence for salting JWT.
 */
exports.TOKEN_SECRET = process.env.TOKEN_SECRET;
if (!exports.TOKEN_SECRET) {
    throw new Error('TOKEN_SECRET is undefined');
}
/**
 * @exports @const
 * Expiration time in seconds.
 */
exports.EXPIRES_IN = 36000;
/**
 * @exports @class
 * Token service for signing and decoding objects with JWT.
 */
class TokenService {
    /**
     * @static @method
     * Creates a token from a object.
     */
    static sign(payload) {
        return jwt.sign(payload, exports.TOKEN_SECRET, {
            expiresIn: exports.EXPIRES_IN
        });
    }
    /**
     * @static @method
     * Verifies token authenticity.
     */
    static verify(token) {
        return jwt.verify(token, exports.TOKEN_SECRET);
    }
    /**
     * @static @method
     * Decodes token to object.
     */
    static decode(token) {
        return jwt.verify(token, exports.TOKEN_SECRET, (err, decoded) => !err && decoded);
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=tokenService.js.map