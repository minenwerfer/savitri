"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutable = exports.PAGINATION_LIMIT = void 0;
const Controller_1 = require("./Controller");
const helpers_1 = require("../../../../common/src/helpers");
exports.PAGINATION_LIMIT = process.env.PAGINATION_LIMIT;
class Mutable extends Controller_1.Controller {
    /**
     * @constructor
     * @param {Model<T>} model - a singleton instance of Model<T>
     */
    constructor(model, description, options = {}) {
        super({ description, ...options });
        this._model = model;
    }
    /**
     * @method
     * Inserts a single document in the database.
     */
    insert(props, response, decodedToken) {
        const { _id, ...rest } = props.what;
        const what = typeof _id === 'string' ? Object.entries(rest).reduce((a, [key, value]) => {
            const result = a;
            const append = value && typeof value === 'object' && Object.keys(value).length === 0
                ? '$unset' : '$set';
            a[append][key] = value;
            return a;
        }, {
            $set: {},
            $unset: {}
        }) : rest;
        Object.keys(what)
            .filter(k => typeof what[k] === 'object' && Object.keys(what[k]).length === 0)
            .forEach(k => delete what[k]);
        return typeof _id !== 'string'
            ? this._model.create(what)
            : this._model.findOneAndUpdate({ _id }, what, { new: true, runValidators: true });
    }
    count(props) {
        return this._model.countDocuments(props?.filters || {});
    }
    /**
     * @method
     * Gets a document from database.
     */
    get(props, response, decodedToken) {
        return this._model.findOne(props.filters);
    }
    /**
     * @method
     * Gets a collection of documents from database.
     */
    getAll(props) {
        const defaultSort = {
            created_at: -1,
            date_updated: -1,
            date_created: -1,
        };
        if (typeof props.limit !== 'number') {
            props.limit = +(exports.PAGINATION_LIMIT || 35);
        }
        const entries = Object.entries(props.filters || {})
            .map(([key, value]) => [key, typeof value === 'object' && 'id' in value ? value._id : value]);
        props.filters = (0, helpers_1.fromEntries)(entries);
        return this._model.find(props.filters || {})
            .sort(props.sort || defaultSort)
            .skip(props.offset || 0)
            .limit(props.limit);
    }
    /**
     * @method
     * Removes a document from database.
     */
    remove(props) {
        if (!props.filters) {
            throw new Error('no criteria specified');
        }
        return this._model.findOneAndDelete(props.filters, { strict: 'throw' });
    }
    /**
     * @method
     * Removing all documents from database matching the criteria.
     */
    removeAll(props) {
        if (!Array.isArray(props.filters?._id) || props.filters?._id?.length === 0) {
            throw new Error('no criteria specified');
        }
        return this._model.deleteMany(props.filters, { strict: 'throw' });
    }
    /**
     * @method
     * Modify a single document.
   */
    modify(props) {
        return this._model.findOneAndUpdate(props.filters, props.what, { new: true, runValidators: true });
    }
    /**
     * @method
     * Modify documents matching criteria.
     */
    modifyAll(props) {
        return this._model.updateMany(props.filters, props.what);
    }
}
exports.Mutable = Mutable;
//# sourceMappingURL=Mutable.js.map