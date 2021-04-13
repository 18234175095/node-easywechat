'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseClient_1 = __importDefault(require("../../Core/BaseClient"));
class UrlSchemeClient extends BaseClient_1.default {
    generate(params = {}) {
        return this.httpPostJson('wxa/generatescheme', params);
    }
}
exports.default = UrlSchemeClient;
