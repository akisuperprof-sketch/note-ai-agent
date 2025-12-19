
import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
    const envKeys = Object.keys(process.env).sort();
    // Security: Do NOT return actual values for keys containing KEY, SECRET, PASSWORD, etc.
    // Just show the key name exists.

    const envStatus = envKeys.map(key => {
        const isSensitive = /KEY|SECRET|PASSWORD|TOKEN/i.test(key);
        return {
            key: key,
            exists: true,
            value: isSensitive ? '***HIDDEN***' : process.env[key]?.substring(0, 10) + '...'
        };
    });

    return {
        success: true,
        message: "Environment Variable Diagnostic",
        totalKeys: envKeys.length,
        variables: envStatus
    };
});
