"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const database_1 = __importDefault(require("./config/database"));
const api_1 = require("./config/api");
const port = Number(process.env.PORT || 8000);
const app = (0, index_1.createApp)();
app.listen(port, () => {
    const codespaceName = process.env.CODESPACE_NAME;
    console.log(`Octofit Tracker API running on http://localhost:${port}`);
    if (codespaceName) {
        const codespaceUrl = `https://${codespaceName}-${port}.app.github.dev`;
        console.log(`Codespaces API URL: ${codespaceUrl}`);
    }
    else {
        console.log(`Codespaces API URL: ${api_1.API_BASE_URL}`);
    }
});
database_1.default.on('error', console.error.bind(console, 'MongoDB connection error:'));
//# sourceMappingURL=server.js.map