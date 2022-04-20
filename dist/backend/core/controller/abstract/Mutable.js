"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutable = exports.PAGINATION_LIMIT = void 0;
const Controller_1 = require("./Controller");
const helpers_1 = require("../../../../common/src/helpers");
const entity_1 = require("../../entity");
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
    async insert(props, response, decodedToken) {
        const { _id } = props.what;
        const what = (0, entity_1.prepareInsert)(this._description, props.what);
        if (typeof _id !== 'string') {
            const newDoc = await this._model.create(what);
            return this._model.findOne({ _id: newDoc._id });
        }
        return this._model.findOneAndUpdate({ _id }, what, { new: true, runValidators: true });
    }
    count(props) {
        return this._model.countDocuments(props?.filters || {});
    }
    /**
     * @method
     * Gets a document from database.
     */
    async get(props, response, decodedToken) {
        return (0, entity_1.project)((0, entity_1.fill)(await this._model.findOne(props?.filters), this._description.fields), props?.project);
    }
    /**
     * @method
     * Gets a collection of documents from database.
     */
    _getAll(props) {
        const defaultSort = {
            date_updated: -1,
            date_created: -1,
            created_at: -1,
        };
        if (typeof props.limit !== 'number') {
            props.limit = +(exports.PAGINATION_LIMIT || 35);
        }
        const entries = Object.entries(props.filters || {})
            .map(([key, value]) => [
            key,
            value && typeof value === 'object' && 'id' in value ? value._id : value
        ]);
        props.filters = (0, helpers_1.fromEntries)(entries);
        return this._model.find(props.filters || {})
            .sort(props.sort || defaultSort)
            .skip(props.offset || 0)
            .limit(props.limit);
    }
    async getAll(props, response, decodedToken) {
        const result = (await this._getAll(props))
            .map((item) => (0, entity_1.project)(item, props.project));
        return result
            .map((item) => (0, entity_1.depopulate)(item, this._description))
            .map((item) => (0, entity_1.depopulateChildren)(item))
            .map((item) => props.project ? item : (0, entity_1.fill)(item, this._description.fields));
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
        const { _id, ...rest } = props.filters;
        const filters = {
            _id: { $in: props.filters._id },
            ...rest
        };
        return this._model.deleteMany(rest, { strict: 'throw' });
    }
    /**
     * @method
     * Modify a single document.
   */
    modify(props) {
        const what = (0, entity_1.prepareInsert)(this._description, props.what);
        return this._model.findOneAndUpdate(props.filters, what, { new: true, runValidators: true });
    }
    /**
     * @method
     * Modify documents matching criteria.
     */
    modifyAll(props) {
        const what = (0, entity_1.prepareInsert)(this._description, props.what);
        return this._model.updateMany(props.filters, what);
    }
}
exports.Mutable = Mutable;
//# sourceMappingURL=Mutable.js.map