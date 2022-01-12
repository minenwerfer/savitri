"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutable = exports.PAGINATION_LIMIT = void 0;
const Controller_1 = require("./Controller");
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
    insert(props, response, token) {
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
        return this._model.countDocuments(props?.filter || {});
    }
    /**
     * @method
     * Gets a document from database.
     */
    get(props) {
        return this._model.findOne(props.filter);
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
        return this._model.find(props.filter || {})
            .sort(props.sort || defaultSort)
            .skip(props.offset || 0)
            .limit(+(exports.PAGINATION_LIMIT || 0));
    }
    /**
     * @method
     * Removes a document from database.
     */
    remove(props) {
        if (!props.filter) {
            throw 'no criteria specified';
        }
        return this._model.findOneAndDelete(props.filter, { strict: 'throw' });
    }
    /**
     * @method
     * Removing all documents from database matching the criteria.
     */
    removeAll(props) {
        if (!Array.isArray(props.filter?._id) || props.filter?._id?.length === 0) {
            throw 'no criteria specified';
        }
        return this._model.deleteMany(props.filter, { strict: 'throw' });
    }
    /**
     * @method
     * Modify a single document.
   */
    modify(props) {
        return this._model.findOneAndUpdate(props.filter, props.what, { new: true, runValidators: true });
    }
    /**
     * @method
     * Modify documents matching criteria.
     */
    modifyAll(props) {
        return this._model.updateMany(props.filter, props.what);
    }
}
exports.Mutable = Mutable;
//# sourceMappingURL=Mutable.js.map