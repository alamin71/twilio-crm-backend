"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const path_1 = __importDefault(require("path"));
dotenv.config({ path: path_1.default.join((process.cwd(), ".env")) });
exports.default = {
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL
};
