"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const monitoringMiddleware_1 = require("../middleware/monitoringMiddleware");
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
// Basic health check endpoint
router.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is running' });
});
// Detailed health check with system metrics
router.get('/details', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check MongoDB connection
        const dbStatus = mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected';
        // Get system metrics
        const metrics = (0, monitoringMiddleware_1.getMetrics)();
        // Get process metrics
        const processMetrics = {
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            cpuUsage: process.cpuUsage(),
        };
        // Get environment info
        const environmentInfo = {
            nodeVersion: process.version,
            platform: process.platform,
            env: process.env.NODE_ENV,
        };
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            database: {
                status: dbStatus,
                name: mongoose_1.default.connection.name,
            },
            api: metrics,
            process: processMetrics,
            environment: environmentInfo,
        });
    }
    catch (error) {
        logger_1.logger.error('Health check failed', { error: error.message });
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving health information',
        });
    }
}));
exports.default = router;
