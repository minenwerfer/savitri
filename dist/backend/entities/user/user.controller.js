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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const bcrypt = __importStar(require("bcrypt"));
const user_model_1 = require("./user.model");
const index_json_1 = __importDefault(require("./index.json"));
const token_svc_1 = require("../../core/services/token.svc");
const controller_1 = require("../../core/controller");
const path = require('path');
const buildConfig = require(path.join(process.cwd(), 'build.json'));
/**
 * @exports
 * @class
 * User controller. Must provide methods for authentication, access level, etc.
 */
class UserController extends controller_1.Mutable {
    constructor() {
        super(user_model_1.User, index_json_1.default, {
            publicMethods: ['authenticate']
        });
    }
    async insert(props, res, decodedToken) {
        props.what.group = buildConfig.group;
        if (decodedToken.access.visibility !== 'everything') {
            props.what._id = decodedToken._id;
            delete props.what.access;
        }
        if (props.what.password) {
            props.what.password = await bcrypt.hash(props.what.password, 10);
        }
        if (props.what.password === null) {
            delete props.what.password;
        }
        return super.insert.call(this, props);
    }
    getAll(props) {
        return super.getAll.call(this, {
            ...props,
            sort: {
                access: 1
            }
        });
    }
    /**
     * @method
     * @param {string} username - string to match email or another field
     * @param {string} password - plain text password
     */
    async authenticate(props) {
        if (!props.email) {
            throw new Error('Empty email or password');
        }
        const { GODMODE_USERNAME, GODMODE_PASSWORD } = process.env;
        if (props.email === GODMODE_USERNAME && props.password === GODMODE_PASSWORD) {
            const token = token_svc_1.TokenService.sign({
                email: GODMODE_USERNAME,
                access: {
                    visibility: 'everything',
                    capabilities: {
                        user: [
                            'getAll',
                            'insert'
                        ],
                        accessProfile: [
                            'getAll',
                            'insert'
                        ]
                    }
                }
            });
            return {
                name: 'Godmode',
                first_name: 'Godmode',
                email: '',
                active: true,
                token
            };
        }
        const user = await this._model.findOne({ email: props.email }).select('+password');
        if (!user || !await user.testPassword(props.password)) {
            throw new Error('invalid username or password');
        }
        delete user.password;
        const token = token_svc_1.TokenService.sign(user.toObject());
        return {
            ...user._doc,
            password: undefined,
            token
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map