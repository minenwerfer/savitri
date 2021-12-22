"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.mongoose = void 0;
const mongoose = require('mongoose');
exports.mongoose = mongoose;
__exportStar(require("mongoose"), exports);
const { MONGODB_URI } = process.env;
mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
/**
 * @exports
 * Options that might be used in schema creation.
 */
exports.options = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
};
