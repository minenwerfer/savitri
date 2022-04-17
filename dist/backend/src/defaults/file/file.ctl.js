"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const crypto_1 = require("crypto");
const { writeFile, readFile, unlink } = require('fs').promises;
const file_mdl_1 = require("./file.mdl");
const controller_1 = require("../../controller");
const { STORAGE_PATH } = process.env;
class FileController extends controller_1.Mutable {
    constructor() {
        super(file_mdl_1.File, file_mdl_1.Description);
    }
    async insert(props, res, decodedToken) {
        if (!STORAGE_PATH) {
            throw new Error('STORAGE_PATH is not set in the environment');
        }
        if (!props.what.context) {
            throw new Error('context is not set');
        }
        const what = Object.assign({}, props.what);
        what.user_id = decodedToken.access._id;
        const extension = what.filename.split('.').pop();
        if (!extension) {
            throw new Error('filename lacks extension');
        }
        if (['shtml', 'html', 'html', 'php', 'php5', 'exe', 'msi', 'vbs'].includes(extension)) {
            throw new Error('hoje não, joãozinho defacer');
        }
        const oldFile = await file_mdl_1.File.findOne({
            $and: [
                { user_id: what.user_id },
                { context: what.context }
            ]
        }).sort({ created_at: -1 });
        if (oldFile) {
            if (oldFile.immutable === true) {
                throw new Error('você não pode mais editar esse arquivo');
            }
            try {
                await unlink(oldFile.absolute_path);
                await file_mdl_1.File.deleteOne(oldFile._id);
            }
            catch (error) {
                console.trace(error);
            }
        }
        const filenameHash = (0, crypto_1.createHash)('sha1')
            .update(what.filename + Date.now())
            .digest('hex');
        what.absolute_path = `${STORAGE_PATH}/${filenameHash}.${extension}`;
        await writeFile(what.absolute_path, Buffer.from(what.content.split(',').pop(), 'base64'));
        return super.insert.call(this, { what }, res, decodedToken);
    }
    async remove(props) {
        const file = await file_mdl_1.File.findOne(props.filters);
        if (file) {
            await unlink(file.absolute_path);
            return await super.remove.call(this, props);
        }
        return Promise.resolve();
    }
    async download(_id) {
        const file = await file_mdl_1.File.findOne({ _id }).lean();
        if (!file) {
            throw new Error('file not found');
        }
        const content = await readFile(file.absolute_path);
        return {
            ...file,
            content: Buffer.from(content, 'base64')
        };
    }
}
exports.FileController = FileController;
//# sourceMappingURL=file.ctl.js.map