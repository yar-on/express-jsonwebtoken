module.exports = {
    UNKNOWN_ERROR: {
        httpCode: 500,
        message: 'Unknown error, please try again later.',
    },
    MISSING_TOKEN: {
        httpCode: 400,
        message: 'Missing token param.',
    },
    INVALID_TOKEN_SCHEMA: {
        httpCode: 400,
        message: 'Token schema is not allowed.',
    },
    INVALID_TOKEN: {
        httpCode: 401,
        message: 'Invalid token.',
    },
    CORRUPTED_TOKEN: {
        httpCode: 400,
        message: 'Corrupted token.',
    },
    TOKEN_BLACKLISTED: {
        httpCode: 401,
        message: 'Token in blacklist.',
    },
    TOKEN_EXPIRED: {
        httpCode: 401,
        message: 'Token in expired.',
    },
    JWT_MALFORMED: {
        httpCode: 400,
        message: 'Jwt token malformed.',
    },
    JWT_SIGNATURE_IS_REQUIRED: {
        httpCode: 400,
        message: 'Jwt signature is required.',
    },
    INVALID_SIGNATURE: {
        httpCode: 400,
        message: 'Invalid signature.',
    },
    JWT_AUDIENCE_INVALID: {
        httpCode: 400,
        message: 'Jwt audience invalid. expected: ${expected}',
    },
    JWT_ISSUER_INVALID: {
        httpCode: 400,
        message: 'Jwt issuer invalid. expected: ${expected}.',
    },
    JWT_ID_INVALID: {
        httpCode: 400,
        message: 'Jwt id invalid. expected: ${expected}',
    },
    JWT_SUBJECT_INVALID: {
        httpCode: 400,
        message: 'Jwt subject invalid. expected ${expected}',
    },

};