"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_BASE_URL = exports.getApiBaseUrl = void 0;
const getApiBaseUrl = () => {
    const codespaceName = process.env.CODESPACE_NAME;
    if (codespaceName) {
        return `https://${codespaceName}-8000.app.github.dev`;
    }
    return 'http://localhost:8000';
};
exports.getApiBaseUrl = getApiBaseUrl;
exports.API_BASE_URL = (0, exports.getApiBaseUrl)();
//# sourceMappingURL=api.js.map