"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFile = void 0;
const module_1 = require("frontend/store/module");
const useFile = (file) => {
    const fileUrl = file && `${module_1.SV_API_URL}/file/${file._id || file}`;
    return {
        link: fileUrl,
        download: `${fileUrl}/download`
    };
};
exports.useFile = useFile;
//# sourceMappingURL=file.js.map