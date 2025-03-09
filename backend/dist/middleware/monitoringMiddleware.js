"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitoringMiddleware = exports.getMetrics = exports.resetMetrics = void 0;
const logger_1 = require("../utils/logger");
// Initialize metrics object
const metrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    responseTimeTotal: 0,
    responseTimeAvg: 0,
    requestsPerEndpoint: {},
    errors: {},
};
// Reset metrics function (for testing/maintenance)
const resetMetrics = () => {
    metrics.totalRequests = 0;
    metrics.successfulRequests = 0;
    metrics.failedRequests = 0;
    metrics.responseTimeTotal = 0;
    metrics.responseTimeAvg = 0;
    metrics.requestsPerEndpoint = {};
    metrics.errors = {};
};
exports.resetMetrics = resetMetrics;
// Function to get current metrics
const getMetrics = () => {
    return Object.assign(Object.assign({}, metrics), { 
        // Calculate current average response time
        responseTimeAvg: metrics.totalRequests > 0
            ? Math.round(metrics.responseTimeTotal / metrics.totalRequests)
            : 0 });
};
exports.getMetrics = getMetrics;
// Monitoring middleware function
const monitoringMiddleware = (req, res, next) => {
    const startTime = Date.now();
    const endpoint = `${req.method} ${req.path}`;
    // Increment total requests
    metrics.totalRequests++;
    // Track requests per endpoint
    if (!metrics.requestsPerEndpoint[endpoint]) {
        metrics.requestsPerEndpoint[endpoint] = 0;
    }
    metrics.requestsPerEndpoint[endpoint]++;
    // Log request details
    logger_1.logger.info(`API Request`, {
        method: req.method,
        path: req.path,
        query: req.query,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    // Capture response metrics
    const originalSend = res.send;
    res.send = function (body) {
        const responseTime = Date.now() - startTime;
        const statusCode = res.statusCode;
        // Add to total response time
        metrics.responseTimeTotal += responseTime;
        // Track successful vs failed requests
        if (statusCode >= 200 && statusCode < 400) {
            metrics.successfulRequests++;
        }
        else {
            metrics.failedRequests++;
            // Track errors by status code
            const errorKey = `${statusCode}`;
            if (!metrics.errors[errorKey]) {
                metrics.errors[errorKey] = 0;
            }
            metrics.errors[errorKey]++;
            // Log error details
            logger_1.logger.error(`API Error Response`, {
                statusCode,
                method: req.method,
                path: req.path,
                responseTime,
                error: body
            });
        }
        // Log response details
        logger_1.logger.info(`API Response`, {
            statusCode,
            method: req.method,
            path: req.path,
            responseTime,
            contentLength: (body === null || body === void 0 ? void 0 : body.length) || 0
        });
        // Continue with the original send method
        return originalSend.call(this, body);
    };
    next();
};
exports.monitoringMiddleware = monitoringMiddleware;
