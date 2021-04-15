# express-jsonwebtoken

JsonWebToken (JWT) manager for express,

This module managing the authentication using [JSON Web Tokens](https://tools.ietf.org/html/rfc7519) for express application.
and allow you to encrypt the tokens and blacklist sign out tokens, 

this module also has middleware for authenticate and sign out


# Install

```bash
$ npm install express-jsonwebtoken
```

# Initialize 

Before you can use this package in your app, you must initial it by this code: (the jwt.secret property is required for using this package)
```nodejs
var jwtExpress = require('express-jsonwebtoken');
var jwtManager = new JwtExpress({
    jwt: {
        secret: 'mySecretShouldNeverBeTold',
    }
});
```

# usage

## Sign method
```nodejs
jwtExpress.sign(payload, [options = {}, callback = null])
```
Sign your payload with the initiated options for jwt.options.
`payload:` data you want to sign with jwt algorithm
`options:` override the initiated options to sign with.Must be type of object.
`callback:` should use callback function instead of return sync value of the sign method.
callback sign: function(Error|null,null|String)

## Verify method
```nodejs
jwtExpress.verify(token, [options = {}, callback = null, onlyPayload = true]) {
```
verify the token and return the payload value, using jwt.options as default options
`token:` token to be verified and get payload from
`options:` override the initiated options to sign with.Must be type of object.
`callback:` should use callback function instead of return sync value of the sign method.
callback sign: function(Error|null,null|String)
`onlyPayload:` indicate if return the payload data only or the whole token data


## Decode method
> **WARNING:** this method not validate the token before exclude the payload and open possebility for injections
```nodejs
jwtExpress.decode(token, [options = {}, callback = null, onlyPayload = true]) {
```
verify the token and return the payload value, using jwt.refresh.options as default options
`token:` token to be verified and get payload from
`options:` override the initiated options to sign with.Must be type of object.
`callback:` should use callback function instead of return sync value of the sign method.
callback sign: function(Error|null,null|String)
`onlyPayload:` indicate if return the payload data only or the whole token data


## Sign Refresh method
```nodejs
jwtExpress.signRefresh(payload, [options = {}, callback = null])
```
Sign your payload with the initiated options for jwt.refresh.options.
`payload:` data you want to sign with jwt algorithm
`options:` override the initiated options to sign with.Must be type of object.
`callback:` should use callback function instead of return sync value of the sign method.
callback sign: function(Error|null,null|String)


## Verify Refresh method
```nodejs
jwtExpress.verifyRefresh(token, [options = {}, callback = null, onlyPayload = true]) {
```
verify the token and return the payload value, using jwt.refresh.options as default options
`token:` token to be verified and get payload from
`options:` override the initiated options to sign with.Must be type of object.
`callback:` should use callback function instead of return sync value of the sign method.
callback sign: function(Error|null,null|String)
`onlyPayload:` indicate if return the payload data only or the whole token data


## Middleware
### JWT middleware
middleware for authenticate users by jwt token.
If the token is valid, `req.user` (or any other property that preset on init method) will be set with the token payload data

example:
```nodejs
var jwtExpress = require('express-jsonwebtoken');
var jwtManager = new JwtExpress({
    jwt: {
        secret: 'mySecretShouldNeverBeTold',
        middleware:{
            tokenPayloadKey: 'user'
        }
    }
});
...

app.get('/admin',
  jwtManager.middleware({
      // any option override available
  }),
  function(req, res) {
    // your logic goes here
    // example
    if (!req.user.isAdmin) {
        return res.sendStatus(401);
    }
    res.sendStatus(200);
  });
```
### Sign Out middleware
middleware for sign out user that add to blacklist the user token.
for really make this work, you must enable blacklist on init, `jwt:{useBlacklist = true}` 

example:
```nodejs
var jwtExpress = require('express-jsonwebtoken');
var jwtManager = new JwtExpress({
    jwt: {
        secret: 'mySecretShouldNeverBeTold',
        useBlacklist: true
    }
});
...

app.get('/sign-out',
  jwtExpress.middlewareSignOut({
      // any option override available
  }),
  function(req, res) {
    res.sendStatus(200);
  });
```

### Refresh Token Middleware
middleware for refreshing jwt token 
(for using default refresh middleware, you must sign & refreshSign with the exact same payload)

example:
```nodejs
var jwtExpress = require('express-jsonwebtoken');
var jwtManager = new JwtExpress({
    jwt: {
        secret: 'mySecretShouldNeverBeTold',
        useBlacklist: true
    }
});
...

app.get('/sign-out',
  jwtManager.middlewareSignOut({
      // any jwt option override available
  }, {
    // any refresh options override avaible
  }),
  function(req, res) {
    res.sendStatus(200);
  });
```
## All Params explanation and defaults
**The only required param is jwt.secret value**
```js
new JwtExpress({
    jwt: {
        options: {
            algorithm: 'HS256',
            expiresIn: '5m',
            // notBefore: undefined,
            // audience: undefined,
            // issuer: undefined,
            // jwtid: undefined,
            // subject: undefined,
            // noTimestamp: undefined,
            // header: undefined,
            // keyid: undefined,
            // mutatePayload: false
        },
        refresh: {
            options: {
                algorithm: 'HS256',
                expiresIn: '7d',
                // notBefore: undefined,
                // audience: undefined,
                // issuer: undefined,
                // jwtid: undefined,
                // subject: undefined,
                // noTimestamp: undefined,
                // header: undefined,
                // keyid: undefined,
                // mutatePayload: false
            },
            getToken: (req) => {
                const refreshToken = req.header('refresh-token');
                if (refreshToken && typeof refreshToken === "string") {
                    const parts = refreshToken.split(' ');
                    if (parts.length === 2) {
                        const scheme = parts[0];
                        const token = parts[1];

                        if (scheme === "Bearer") {
                            return token;
                        } else {
                            throw new JwtExpressError(JwtExpressError.ErrorCodes.INVALID_TOKEN_SCHEMA);
                        }
                    } else {
                        throw new JwtExpressError(JwtExpressError.ErrorCodes.INVALID_TOKEN);
                    }
                } else if (req.query.token) {
                    return req.query.token
                } else {
                    throw new JwtExpressError(JwtExpressError.ErrorCodes.MISSING_TOKEN);
                }
            },
        },
        secret: null,
        useEncrypt: false,
        useBlacklist: false,
        getToken: (req) => {
            const authorizationHeader = req.header('authorization')
            if (authorizationHeader && typeof authorizationHeader === "string") {
                const parts = authorizationHeader.split(' ');
                if (parts.length === 2) {
                    const scheme = parts[0];
                    const token = parts[1];

                    if (scheme === "Bearer") {
                        return token;
                    } else {
                        throw new JwtExpressError(JwtExpressError.ErrorCodes.INVALID_TOKEN_SCHEMA);
                    }
                } else {
                    throw new JwtExpressError(JwtExpressError.ErrorCodes.INVALID_TOKEN);
                }
            } else if (req.query.token) {
                return req.query.token;
            } else {
                throw new JwtExpressError(JwtExpressError.ErrorCodes.MISSING_TOKEN);
            }
        },
        middleware: {
            tokenPayloadKey: 'user',
        },
        blacklist: {
            driverName: 'memory',
            driverParams: {
                clearExpiredItemsInterval: '5m',
                clearExpiredItemsIntervalDelay: null,
            },
        },
    },
    encryption: {
        algorithm: 'aes-256-cbc',
    },
    localization: {
        responses: {
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
        },
    },
});
```

=======
*   jwt
    *   options: 
        *   algorithm: 
            *   Type: String.
            *   Explanation: algorithm for the encryption token, [All supported algorithms can be found here] (https://github.com/auth0/node-jsonwebtoken#user-content-algorithms-supported).
            *   Defaults: 'HS256'
            >   Eg: `'HS256'` , `'HS384'`, `'HS512'`, `'RS256'`, '`RS512'` 
        *   expiresIn: 
            *   Type: String, Number.
            *   Explanation: expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms).
            *   Defaults: '5m' - 5 minutes
            >   Eg: `60`, `"2 days"`, `"10h"`, `"7d"`. A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default (`"120"` is equal to `"120ms"`).
        *   [Other options and more details can be found here](https://github.com/auth0/node-jsonwebtoken#user-content-usage)
    *   refresh: {
        *   options: 
            *   algorithm: 
                *   Type: String.
                *   Explanation: algorithm for the encryption token, [All supported algorithms can be found here] (https://github.com/auth0/node-jsonwebtoken#user-content-algorithms-supported).
                *   Defaults: 'HS256'
                >   Eg: `'HS256'` , `'HS384'`, `'HS512'`, `'RS256'`, '`RS512'` 
            *   expiresIn: 
                *   Type: String, Number.
                *   Explanation: expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms).
                *   Defaults: '7d' - 7 days
                >   Eg: `60`, `"2 days"`, `"10h"`, `"7d"`. A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default (`"120"` is equal to `"120ms"`).
            *   [Other options and more details can be found here](https://github.com/auth0/node-jsonwebtoken#user-content-usage)
        *   getToken:
            *   Type: function(Object: expressRequestObject)
            *   Explanation: function that extract the token from the request
            *   Defaults: look for refresh-token header
    *   secret: 
        *   Type: String.
        *   Explanation: secret hash for the token validation.
        *   Defaults: No defaults and Required for using the module.
    *   useEncrypt: 
        *   Type: Boolean.
        *   Explanation: indicate encryption for the token. if true, the encryption.secret param is Required
        *   Defaults: false
    *   useBlacklist:
        *   Type: Boolean.
        *   Explanation: indicate using blacklist tokens. if true, read about jwt.blacklist param for more details
        *   Defaults: false
    *   getToken:
        *   Type: function(Object: expressRequestObject)
        *   Explanation: function that extract the token from the request
        *   Defaults: look for authorization header 
    *   middleware: 
        *   tokenPayloadKey: 
            *   Type: String.
            *   Explanation: choose on which key the parsed token should set on request object, 
            >   Eg: `req[key]` = parsed token`
            *   Defaults: 'user'
            >   Eg: `req.user`
    *   blacklist: 
        *   driverName: 'memory',
            *   Type: String.
            *   Explanation: select the desired driver for handle blacklist
            >   Note: Other than memory will coming soon
            *   Defaults: 'memory'
        *   driverParams: 
            *   clearExpiredItemsInterval: 
                *   Type: String.
                *   Explanation: set interval time for clearing expired tokens from blacklist, in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms).
                *   Defaults: '5m' - 5 minutes
                >   Eg: `60`, `"2 days"`, `"10h"`, `"7d"`. A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default (`"120"` is equal to `"120ms"`).
            *   clearExpiredItemsIntervalDelay: null,
                *   Type: String || null.
                *   Explanation: delay the first interval time for clearing expired tokens from blacklist, in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms).
                *   Defaults: null - no delay
                >   Eg: `60`, `"2 days"`, `"10h"`, `"7d"`. A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default (`"120"` is equal to `"120ms"`).
        *   customInstance: null,
*   encryption: 
    *   algorithm: 
        *   Type: String.
        *   Explanation: select the desired encryption algorithm
        >   Note: Other than aes-256-cbc will coming soon
        *   Defaults: 'aes-256-cbc'
*   localization: 
    *   responses: 
        *   Type: Object.
        *   Explanation: select the desired encryption algorithm
        >   Note: Must be Object with all keys as the file
        *   Defaults: 


## response object
```nodejs
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
```

## Author

Ran, Nofar, Yogev, Yaron

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
