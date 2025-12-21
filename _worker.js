/**
 * YouTube  : https://youtube.com/@am_clubs
 * Telegram : https://t.me/am_clubs
 * GitHub   : https://github.com/amclubs
 * BLog     : https://amclubss.com
 */

let id = atob('ZWM4NzJkOGYtNzJiMC00YTA0LWI2MTItMDMyN2Q4NWUxOGVk');

let pnum = atob('NDQz');
let paddrs = [
    atob('cHJveHlpcC5hbWNsdWJzLmNhbWR2ci5vcmc='),
    atob('cHJveHlpcC5hbWNsdWJzLmtvem93LmNvbQ==')
];
let paddr = paddrs[Math.floor(Math.random() * paddrs.length)];
let pDomain = [];

let p64 = true;
let p64DnUrl = atob('aHR0cHM6Ly8xLjEuMS4xL2Rucy1xdWVyeQ==');
let p64Prefix = atob('MjYwMjpmYzU5OmIwOjY0Ojo=');
let p64Domain = [];

let s5 = '';
let s5Enable = false;
let parsedS5 = {};

let durl = atob('aHR0cHM6Ly9za3kucmV0aGlua2Rucy5jb20vMTotUGZfX19fXzlfOEFfQU1BSWdFOGtNQUJWRERtS09IVEFLZz0=');
let fname = atob('5pWw5a2X5aWX5Yip');
const dataTypeTr = 'EBMbCxUX';
let enableLog = false;

let ytName = atob('aHR0cHM6Ly95b3V0dWJlLmNvbS9AYW1fY2x1YnM/c3ViX2NvbmZpcm1hdGlvbj0x');
let tgName = atob('aHR0cHM6Ly90Lm1lL2FtX2NsdWJz');
let ghName = atob('aHR0cHM6Ly9naXRodWIuY29tL2FtY2x1YnMvYW0tY2YtdHVubmVs');
let bName = atob('aHR0cHM6Ly9hbWNsdWJzcy5jb20=');
let pName = '5pWw5a2X5aWX5Yip';

import { connect } from 'cloudflare:sockets';

if (!isValidUserId(id)) {
    throw new Error('id is invalid');
}

export default {
    async fetch(request, env, ctx) {
        try {
            let { ID, PADDR, P64, P64PREFIX, S5, D_URL, ENABLE_LOG } = env;

            const kvCheckResponse = await check_kv(env);
            let kvData = {};
            if (!kvCheckResponse) {
                kvData = await get_kv(env) || {};
                log(`[fetch]--> kv_id = ${kvData.kv_id}, kv_pDomain = ${JSON.stringify(kvData.pDomain)}, kv_p64Domain = ${JSON.stringify(kvData.kv_p64Domain)}`);
            }

            const url = new URL(request.url);
            enableLog = url.searchParams.get('ENABLE_LOG') || ENABLE_LOG || enableLog;
            id = (kvData.kv_id || ID || id).toLowerCase();
            log(`[fetch]--> id = ${id}`);

            paddr = url.searchParams.get('PADDR') || PADDR || paddr;
            if (paddr) {
                const [ip, port] = paddr.split(':');
                paddr = ip;
                pnum = port || pnum;
            }
            pDomain = kvData.kv_pDomain || pDomain;
            log(`[fetch]--> pDomain = ${JSON.stringify(pDomain)}`);

            p64 = url.searchParams.get('P64') || P64 || p64;
            p64Prefix = url.searchParams.get('P64PREFIX') || P64PREFIX || p64Prefix;
            p64Domain = kvData.kv_p64Domain || p64Domain;
            log(`[fetch]--> p64Domain = ${JSON.stringify(p64Domain)}`);

            s5 = url.searchParams.get('S5') || S5 || s5;
            parsedS5 = await requestParserFromUrl(s5, url);
            if (parsedS5) {
                s5Enable = true;
            }

            durl = url.searchParams.get('D_URL') || D_URL || durl;
            let prType = url.searchParams.get(atob('UFJPVF9UWVBF'));
            if (prType) {
                prType = prType.toLowerCase();
            }

            if (request.headers.get('Upgrade') === 'websocket') {
                if (prType === xorDe(dataTypeTr, 'datatype')) {
                    return await websvcExecutorTr(request);
                }
                return await websvcExecutor(request);
            }
            switch (url.pathname.toLowerCase()) {
                case '/': {
                    return await login(request, env);
                }
                case `/${id}/get`: {
                    return get_kv(env);
                }
                case `/${id}/set`: {
                    return set_kv_data(request, env);
                }
                default: {
                    return Response.redirect(new URL('/', request.url));
                }
            }
        } catch (err) {
            console.error('Error processing request:', err);
            return new Response(`Error: ${err.message}`, { status: 500 });
        }
    },
};


/** ---------------------tools------------------------------ */
function log(...args) {
    if (enableLog) console.log(...args);
}

function error(...args) {
    if (enableLog) console.error(...args);
}

function isValidUserId(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

const byteToHex = [];
for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
    return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

function stringify(arr, offset = 0) {
    const uuid = unsafeStringify(arr, offset);
    if (!isValidUserId(uuid)) {
        throw TypeError("Stringified ID is invalid");
    }
    return uuid;
}

function b64ToBuf(base64Str) {
    if (!base64Str) {
        return { earlyData: null, error: null };
    }
    try {
        base64Str = base64Str.replace(/-/g, '+').replace(/_/g, '/');
        const decode = atob(base64Str);
        const arryBuffer = Uint8Array.from(decode, (c) => c.charCodeAt(0));
        return { earlyData: arryBuffer.buffer, error: null };
    } catch (error) {
        return { earlyData: null, error };
    }
}

function decodeBase64Utf8(str) {
    const bytes = Uint8Array.from(atob(str), c => c.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
}

function requestParser(s5) {
    let [latter, former] = s5.split("@").reverse();
    let username, password, hostname, port;

    if (former) {
        const formers = former.split(":");
        if (formers.length !== 2) {
            throw new Error('Invalid S address format: authentication must be in the "username:password" format');
        }
        [username, password] = formers;
    }

    const latters = latter.split(":");
    port = Number(latters.pop());
    if (isNaN(port)) {
        throw new Error('Invalid S address format: port must be a number');
    }

    hostname = latters.join(":");
    const isIPv6 = hostname.includes(":") && !/^\[.*\]$/.test(hostname);
    if (isIPv6) {
        throw new Error('Invalid S address format: IPv6 addresses must be enclosed in brackets, e.g., [2001:db8::1]');
    }

    return { username, password, hostname, port };
}

async function requestParserFromUrl(s5, url) {
    if (/\/s5?=/.test(url.pathname)) {
        s5 = url.pathname.split('5=')[1];
    } else if (/\/socks[5]?:\/\//.test(url.pathname)) {
        s5 = url.pathname.split('://')[1].split('#')[0];
    }

    const authIdx = s5.indexOf('@');
    if (authIdx !== -1) {
        let userPassword = s5.substring(0, authIdx);
        const base64Regex = /^(?:[A-Z0-9+/]{4})*(?:[A-Z0-9+/]{2}==|[A-Z0-9+/]{3}=)?$/i;
        if (base64Regex.test(userPassword) && !userPassword.includes(':')) {
            userPassword = atob(userPassword);
        }
        s5 = `${userPassword}@${s5.substring(authIdx + 1)}`;
    }

    if (s5) {
        try {
            return requestParser(s5);
        } catch (err) {
            error(err.toString());
            return null;
        }
    }
    return null;
}

function xorEn(plain, key) {
    const encoder = new TextEncoder();
    const p = encoder.encode(plain);
    const k = encoder.encode(key);
    const out = new Uint8Array(p.length);
    for (let i = 0; i < p.length; i++) {
        out[i] = p[i] ^ k[i % k.length];
    }
    return btoa(String.fromCharCode(...out));
}

function xorDe(b64, key) {
    const data = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const k = encoder.encode(key);
    const out = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
        out[i] = data[i] ^ k[i % k.length];
    }
    return decoder.decode(out);
}

async function getDomainToRouteX(addressRemote, portRemote, s5Enable, p64Flag = false) {
    let finalTargetHost = addressRemote;
    let finalTargetPort = portRemote;
    try {
        log(`[getDomainToRouteX]--> paddr=${paddr}, p64Prefix=${p64Prefix}, addressRemote=${addressRemote}, p64=${p64}`);
        log(`[getDomainToRouteX]--> pDomain=${JSON.stringify(pDomain)}, p64Domain=${JSON.stringify(p64Domain)}`);

        const safeMatch = (domains, target) => {
            try {
                return Array.isArray(domains) && domains.some(domain => matchesDomainPattern(target, domain));
            } catch (e) {
                log(`[error]--> matchesDomainPattern failed: ${e.message}`);
                return false;
            }
        };

        const resultDomain = safeMatch(pDomain, addressRemote);
        const result64Domain = safeMatch(p64Domain, addressRemote);
        log(`[getDomainToRouteX]--> match pDomain=${resultDomain}, match p64Domain=${result64Domain}, p64Flag=${p64Flag}`);

        if (s5Enable) {
            log(`[getDomainToRouteX]--> s5Enable=true, use remote directly`);
        } else if (resultDomain) {
            finalTargetHost = paddr;
            finalTargetPort = pnum || portRemote;
            log(`[getDomainToRouteX]--> Matched pDomain, use paddr=${finalTargetHost}, port=${finalTargetPort}`);
        } else if (result64Domain || (p64Flag && p64)) {
            try {
                finalTargetHost = await resolveDomainToRouteX(addressRemote);
                finalTargetPort = portRemote;
                log(`[getDomainToRouteX]--> Resolved p64Domain via resolveDomainToRouteX: ${finalTargetHost}`);
            } catch (err) {
                log(`[retry]--> resolveDomainToRouteX failed: ${err.message}`);
                finalTargetHost = paddr || addressRemote;
                finalTargetPort = pnum || portRemote;
            }
        } else if (p64Flag) {
            finalTargetHost = paddr || addressRemote;
            finalTargetPort = portRemote;
            log(`[getDomainToRouteX]--> fallback by p64Flag, host=${finalTargetHost}, port=${finalTargetPort}`);
        }

        log(`[getDomainToRouteX]--> Final target: ${finalTargetHost}:${finalTargetPort}`);
        return { finalTargetHost, finalTargetPort };
    } catch (err) {
        log(`[fatal]--> getDomainToRouteX failed: ${err.message}`);
        if (p64Flag) {
            finalTargetHost = paddr || addressRemote;
            finalTargetPort = portRemote;
            log(`[fatal-fallback]--> fallback by p64Flag, host=${finalTargetHost}, port=${finalTargetPort}`);
        }
        return { finalTargetHost, finalTargetPort };
    }
}

function matchesDomainPattern(hostname, pattern) {
    if (!hostname || !pattern) return false;

    hostname = hostname.toLowerCase();
    pattern = pattern.toLowerCase();
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^\[?([a-f0-9:]+)\]?$/i;
    if (ipv4Regex.test(hostname) || ipv6Regex.test(hostname)) {
        return false;
    }

    const hostParts = hostname.split('.');
    const patternParts = pattern.split('.');

    if (hostParts.length < patternParts.length) return false;

    for (let i = 1; i <= patternParts.length; i++) {
        if (hostParts[hostParts.length - i] !== patternParts[patternParts.length - i]) {
            return false;
        }
    }
    return true;
}

async function resolveDomainToRouteX(domain) {
    try {
        log(`[resolveDomainToRouteX] Starting domain resolution: ${domain}`);
        const response = await fetch(`${p64DnUrl}?name=${domain}&type=A`, {
            headers: {
                Accept: "application/dns-json",
            },
        });
        if (!response.ok) {
            throw new Error(`[resolveDomainToRouteX] request failed with status code: ${response.status}`);
        }

        const result = await response.json();
        log(`[resolveDomainToRouteX] Query result: ${JSON.stringify(result, null, 2)}`);
        const aRecord = result?.Answer?.find(record => record.type === 1 && record.data);
        if (!aRecord) {
            throw new Error("No valid A record found");
        }
        const ipv4 = aRecord.data;
        log(`[resolveDomainToRouteX] Found IPv4 address: ${ipv4}`);
        const ipv6 = convertToRouteX(ipv4);
        log(`[resolveDomainToRouteX] Converted IPv6 address: ${ipv6}`);
        return ipv6;
    } catch (err) {
        error(`[Error] Failed to get routeX address: ${err.message}`);
        throw new Error(`[resolveDomainToRouteX] resolution failed: ${err.message}`);
    }
}

function convertToRouteX(ipv4Address) {
    const parts = ipv4Address.trim().split('.');
    if (parts.length !== 4) {
        throw new Error('Invalid IPv4 address');
    }
    const hexParts = parts.map(part => {
        const num = Number(part);
        if (!/^\d+$/.test(part) || isNaN(num) || num < 0 || num > 255) {
            throw new Error(`Invalid IPv4 segment: ${part}`);
        }
        return num.toString(16).padStart(2, '0');
    });

    let withBrackets = true
    log(`[convertToRouteX] p64Prefix--->: ${p64Prefix}`);
    if (!p64Prefix || typeof p64Prefix !== 'string' || !p64Prefix.includes('::')) {
        throw new Error('[convertToRouteX] Invalid manual prefix; must be a valid IPv6 prefix');
    }
    const ipv6Tail = `${hexParts[0]}${hexParts[1]}:${hexParts[2]}${hexParts[3]}`.toLowerCase();
    const fullIPv6 = `${p64Prefix}${ipv6Tail}`;
    return withBrackets ? `[${fullIPv6}]` : fullIPv6;
}

function stringToArray(str) {
    if (!str) return [];
    return str
        .split(/[\n,]+/)
        .map(s => s.trim())
        .filter(Boolean);
}

(function () {
    'use strict';

    var ERROR = 'input is invalid type';
    var WINDOW = typeof window === 'object';
    var root = WINDOW ? window : {};
    if (root.JS_SHA256_NO_WINDOW) {
        WINDOW = false;
    }
    var WEB_WORKER = !WINDOW && typeof self === 'object';
    var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
    if (NODE_JS) {
        root = global;
    } else if (WEB_WORKER) {
        root = self;
    }
    var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && typeof module === 'object' && module.exports;
    var AMD = typeof define === 'function' && define.amd;
    var ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
    var HEX_CHARS = '0123456789abcdef'.split('');
    var EXTRA = [-2147483648, 8388608, 32768, 128];
    var SHIFT = [24, 16, 8, 0];
    var K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];

    var blocks = [];

    if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) {
        Array.isArray = function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        };
    }

    if (ARRAY_BUFFER && (root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
        ArrayBuffer.isView = function (obj) {
            return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
        };
    }

    var createOutputMethod = function (outputType, is224) {
        return function (message) {
            return new Sha256(is224, true).update(message)[outputType]();
        };
    };

    var createMethod = function (is224) {
        var method = createOutputMethod('hex', is224);
        if (NODE_JS) {
            method = nodeWrap(method, is224);
        }
        method.create = function () {
            return new Sha256(is224);
        };
        method.update = function (message) {
            return method.create().update(message);
        };
        for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
            var type = OUTPUT_TYPES[i];
            method[type] = createOutputMethod(type, is224);
        }
        return method;
    };

    var nodeWrap = function (method, is224) {
        var crypto = require('node:crypto')
        var Buffer = require('node:buffer').Buffer;
        var algorithm = is224 ? 'sha224' : 'sha256';
        var bufferFrom;
        if (Buffer.from && !root.JS_SHA256_NO_BUFFER_FROM) {
            bufferFrom = Buffer.from;
        } else {
            bufferFrom = function (message) {
                return new Buffer(message);
            };
        }
        var nodeMethod = function (message) {
            if (typeof message === 'string') {
                return crypto.createHash(algorithm).update(message, 'utf8').digest('hex');
            } else {
                if (message === null || message === undefined) {
                    throw new Error(ERROR);
                } else if (message.constructor === ArrayBuffer) {
                    message = new Uint8Array(message);
                }
            }
            if (Array.isArray(message) || ArrayBuffer.isView(message) ||
                message.constructor === Buffer) {
                return crypto.createHash(algorithm).update(bufferFrom(message)).digest('hex');
            } else {
                return method(message);
            }
        };
        return nodeMethod;
    };

    var createHmacOutputMethod = function (outputType, is224) {
        return function (key, message) {
            return new HmacSha256(key, is224, true).update(message)[outputType]();
        };
    };

    var createHmacMethod = function (is224) {
        var method = createHmacOutputMethod('hex', is224);
        method.create = function (key) {
            return new HmacSha256(key, is224);
        };
        method.update = function (key, message) {
            return method.create(key).update(message);
        };
        for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
            var type = OUTPUT_TYPES[i];
            method[type] = createHmacOutputMethod(type, is224);
        }
        return method;
    };

    function Sha256(is224, sharedMemory) {
        if (sharedMemory) {
            blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
                blocks[4] = blocks[5] = blocks[6] = blocks[7] =
                blocks[8] = blocks[9] = blocks[10] = blocks[11] =
                blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
            this.blocks = blocks;
        } else {
            this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }

        if (is224) {
            this.h0 = 0xc1059ed8;
            this.h1 = 0x367cd507;
            this.h2 = 0x3070dd17;
            this.h3 = 0xf70e5939;
            this.h4 = 0xffc00b31;
            this.h5 = 0x68581511;
            this.h6 = 0x64f98fa7;
            this.h7 = 0xbefa4fa4;
        } else { // 256
            this.h0 = 0x6a09e667;
            this.h1 = 0xbb67ae85;
            this.h2 = 0x3c6ef372;
            this.h3 = 0xa54ff53a;
            this.h4 = 0x510e527f;
            this.h5 = 0x9b05688c;
            this.h6 = 0x1f83d9ab;
            this.h7 = 0x5be0cd19;
        }

        this.block = this.start = this.bytes = this.hBytes = 0;
        this.finalized = this.hashed = false;
        this.first = true;
        this.is224 = is224;
    }

    Sha256.prototype.update = function (message) {
        if (this.finalized) {
            return;
        }
        var notString, type = typeof message;
        if (type !== 'string') {
            if (type === 'object') {
                if (message === null) {
                    throw new Error(ERROR);
                } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
                    message = new Uint8Array(message);
                } else if (!Array.isArray(message)) {
                    if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
                        throw new Error(ERROR);
                    }
                }
            } else {
                throw new Error(ERROR);
            }
            notString = true;
        }
        var code, index = 0, i, length = message.length, blocks = this.blocks;
        while (index < length) {
            if (this.hashed) {
                this.hashed = false;
                blocks[0] = this.block;
                this.block = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
                    blocks[4] = blocks[5] = blocks[6] = blocks[7] =
                    blocks[8] = blocks[9] = blocks[10] = blocks[11] =
                    blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
            }

            if (notString) {
                for (i = this.start; index < length && i < 64; ++index) {
                    blocks[i >>> 2] |= message[index] << SHIFT[i++ & 3];
                }
            } else {
                for (i = this.start; index < length && i < 64; ++index) {
                    code = message.charCodeAt(index);
                    if (code < 0x80) {
                        blocks[i >>> 2] |= code << SHIFT[i++ & 3];
                    } else if (code < 0x800) {
                        blocks[i >>> 2] |= (0xc0 | (code >>> 6)) << SHIFT[i++ & 3];
                        blocks[i >>> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                    } else if (code < 0xd800 || code >= 0xe000) {
                        blocks[i >>> 2] |= (0xe0 | (code >>> 12)) << SHIFT[i++ & 3];
                        blocks[i >>> 2] |= (0x80 | ((code >>> 6) & 0x3f)) << SHIFT[i++ & 3];
                        blocks[i >>> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                    } else {
                        code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
                        blocks[i >>> 2] |= (0xf0 | (code >>> 18)) << SHIFT[i++ & 3];
                        blocks[i >>> 2] |= (0x80 | ((code >>> 12) & 0x3f)) << SHIFT[i++ & 3];
                        blocks[i >>> 2] |= (0x80 | ((code >>> 6) & 0x3f)) << SHIFT[i++ & 3];
                        blocks[i >>> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                    }
                }
            }

            this.lastByteIndex = i;
            this.bytes += i - this.start;
            if (i >= 64) {
                this.block = blocks[16];
                this.start = i - 64;
                this.hash();
                this.hashed = true;
            } else {
                this.start = i;
            }
        }
        if (this.bytes > 4294967295) {
            this.hBytes += this.bytes / 4294967296 << 0;
            this.bytes = this.bytes % 4294967296;
        }
        return this;
    };

    Sha256.prototype.finalize = function () {
        if (this.finalized) {
            return;
        }
        this.finalized = true;
        var blocks = this.blocks, i = this.lastByteIndex;
        blocks[16] = this.block;
        blocks[i >>> 2] |= EXTRA[i & 3];
        this.block = blocks[16];
        if (i >= 56) {
            if (!this.hashed) {
                this.hash();
            }
            blocks[0] = this.block;
            blocks[16] = blocks[1] = blocks[2] = blocks[3] =
                blocks[4] = blocks[5] = blocks[6] = blocks[7] =
                blocks[8] = blocks[9] = blocks[10] = blocks[11] =
                blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
        }
        blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
        blocks[15] = this.bytes << 3;
        this.hash();
    };

    Sha256.prototype.hash = function () {
        var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6,
            h = this.h7, blocks = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;

        for (j = 16; j < 64; ++j) {
            // rightrotate
            t1 = blocks[j - 15];
            s0 = ((t1 >>> 7) | (t1 << 25)) ^ ((t1 >>> 18) | (t1 << 14)) ^ (t1 >>> 3);
            t1 = blocks[j - 2];
            s1 = ((t1 >>> 17) | (t1 << 15)) ^ ((t1 >>> 19) | (t1 << 13)) ^ (t1 >>> 10);
            blocks[j] = blocks[j - 16] + s0 + blocks[j - 7] + s1 << 0;
        }

        bc = b & c;
        for (j = 0; j < 64; j += 4) {
            if (this.first) {
                if (this.is224) {
                    ab = 300032;
                    t1 = blocks[0] - 1413257819;
                    h = t1 - 150054599 << 0;
                    d = t1 + 24177077 << 0;
                } else {
                    ab = 704751109;
                    t1 = blocks[0] - 210244248;
                    h = t1 - 1521486534 << 0;
                    d = t1 + 143694565 << 0;
                }
                this.first = false;
            } else {
                s0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
                s1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
                ab = a & b;
                maj = ab ^ (a & c) ^ bc;
                ch = (e & f) ^ (~e & g);
                t1 = h + s1 + ch + K[j] + blocks[j];
                t2 = s0 + maj;
                h = d + t1 << 0;
                d = t1 + t2 << 0;
            }
            s0 = ((d >>> 2) | (d << 30)) ^ ((d >>> 13) | (d << 19)) ^ ((d >>> 22) | (d << 10));
            s1 = ((h >>> 6) | (h << 26)) ^ ((h >>> 11) | (h << 21)) ^ ((h >>> 25) | (h << 7));
            da = d & a;
            maj = da ^ (d & b) ^ ab;
            ch = (h & e) ^ (~h & f);
            t1 = g + s1 + ch + K[j + 1] + blocks[j + 1];
            t2 = s0 + maj;
            g = c + t1 << 0;
            c = t1 + t2 << 0;
            s0 = ((c >>> 2) | (c << 30)) ^ ((c >>> 13) | (c << 19)) ^ ((c >>> 22) | (c << 10));
            s1 = ((g >>> 6) | (g << 26)) ^ ((g >>> 11) | (g << 21)) ^ ((g >>> 25) | (g << 7));
            cd = c & d;
            maj = cd ^ (c & a) ^ da;
            ch = (g & h) ^ (~g & e);
            t1 = f + s1 + ch + K[j + 2] + blocks[j + 2];
            t2 = s0 + maj;
            f = b + t1 << 0;
            b = t1 + t2 << 0;
            s0 = ((b >>> 2) | (b << 30)) ^ ((b >>> 13) | (b << 19)) ^ ((b >>> 22) | (b << 10));
            s1 = ((f >>> 6) | (f << 26)) ^ ((f >>> 11) | (f << 21)) ^ ((f >>> 25) | (f << 7));
            bc = b & c;
            maj = bc ^ (b & d) ^ cd;
            ch = (f & g) ^ (~f & h);
            t1 = e + s1 + ch + K[j + 3] + blocks[j + 3];
            t2 = s0 + maj;
            e = a + t1 << 0;
            a = t1 + t2 << 0;
            this.chromeBugWorkAround = true;
        }

        this.h0 = this.h0 + a << 0;
        this.h1 = this.h1 + b << 0;
        this.h2 = this.h2 + c << 0;
        this.h3 = this.h3 + d << 0;
        this.h4 = this.h4 + e << 0;
        this.h5 = this.h5 + f << 0;
        this.h6 = this.h6 + g << 0;
        this.h7 = this.h7 + h << 0;
    };

    Sha256.prototype.hex = function () {
        this.finalize();

        var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
            h6 = this.h6, h7 = this.h7;

        var hex = HEX_CHARS[(h0 >>> 28) & 0x0F] + HEX_CHARS[(h0 >>> 24) & 0x0F] +
            HEX_CHARS[(h0 >>> 20) & 0x0F] + HEX_CHARS[(h0 >>> 16) & 0x0F] +
            HEX_CHARS[(h0 >>> 12) & 0x0F] + HEX_CHARS[(h0 >>> 8) & 0x0F] +
            HEX_CHARS[(h0 >>> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
            HEX_CHARS[(h1 >>> 28) & 0x0F] + HEX_CHARS[(h1 >>> 24) & 0x0F] +
            HEX_CHARS[(h1 >>> 20) & 0x0F] + HEX_CHARS[(h1 >>> 16) & 0x0F] +
            HEX_CHARS[(h1 >>> 12) & 0x0F] + HEX_CHARS[(h1 >>> 8) & 0x0F] +
            HEX_CHARS[(h1 >>> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
            HEX_CHARS[(h2 >>> 28) & 0x0F] + HEX_CHARS[(h2 >>> 24) & 0x0F] +
            HEX_CHARS[(h2 >>> 20) & 0x0F] + HEX_CHARS[(h2 >>> 16) & 0x0F] +
            HEX_CHARS[(h2 >>> 12) & 0x0F] + HEX_CHARS[(h2 >>> 8) & 0x0F] +
            HEX_CHARS[(h2 >>> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
            HEX_CHARS[(h3 >>> 28) & 0x0F] + HEX_CHARS[(h3 >>> 24) & 0x0F] +
            HEX_CHARS[(h3 >>> 20) & 0x0F] + HEX_CHARS[(h3 >>> 16) & 0x0F] +
            HEX_CHARS[(h3 >>> 12) & 0x0F] + HEX_CHARS[(h3 >>> 8) & 0x0F] +
            HEX_CHARS[(h3 >>> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
            HEX_CHARS[(h4 >>> 28) & 0x0F] + HEX_CHARS[(h4 >>> 24) & 0x0F] +
            HEX_CHARS[(h4 >>> 20) & 0x0F] + HEX_CHARS[(h4 >>> 16) & 0x0F] +
            HEX_CHARS[(h4 >>> 12) & 0x0F] + HEX_CHARS[(h4 >>> 8) & 0x0F] +
            HEX_CHARS[(h4 >>> 4) & 0x0F] + HEX_CHARS[h4 & 0x0F] +
            HEX_CHARS[(h5 >>> 28) & 0x0F] + HEX_CHARS[(h5 >>> 24) & 0x0F] +
            HEX_CHARS[(h5 >>> 20) & 0x0F] + HEX_CHARS[(h5 >>> 16) & 0x0F] +
            HEX_CHARS[(h5 >>> 12) & 0x0F] + HEX_CHARS[(h5 >>> 8) & 0x0F] +
            HEX_CHARS[(h5 >>> 4) & 0x0F] + HEX_CHARS[h5 & 0x0F] +
            HEX_CHARS[(h6 >>> 28) & 0x0F] + HEX_CHARS[(h6 >>> 24) & 0x0F] +
            HEX_CHARS[(h6 >>> 20) & 0x0F] + HEX_CHARS[(h6 >>> 16) & 0x0F] +
            HEX_CHARS[(h6 >>> 12) & 0x0F] + HEX_CHARS[(h6 >>> 8) & 0x0F] +
            HEX_CHARS[(h6 >>> 4) & 0x0F] + HEX_CHARS[h6 & 0x0F];
        if (!this.is224) {
            hex += HEX_CHARS[(h7 >>> 28) & 0x0F] + HEX_CHARS[(h7 >>> 24) & 0x0F] +
                HEX_CHARS[(h7 >>> 20) & 0x0F] + HEX_CHARS[(h7 >>> 16) & 0x0F] +
                HEX_CHARS[(h7 >>> 12) & 0x0F] + HEX_CHARS[(h7 >>> 8) & 0x0F] +
                HEX_CHARS[(h7 >>> 4) & 0x0F] + HEX_CHARS[h7 & 0x0F];
        }
        return hex;
    };

    Sha256.prototype.toString = Sha256.prototype.hex;

    Sha256.prototype.digest = function () {
        this.finalize();

        var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
            h6 = this.h6, h7 = this.h7;

        var arr = [
            (h0 >>> 24) & 0xFF, (h0 >>> 16) & 0xFF, (h0 >>> 8) & 0xFF, h0 & 0xFF,
            (h1 >>> 24) & 0xFF, (h1 >>> 16) & 0xFF, (h1 >>> 8) & 0xFF, h1 & 0xFF,
            (h2 >>> 24) & 0xFF, (h2 >>> 16) & 0xFF, (h2 >>> 8) & 0xFF, h2 & 0xFF,
            (h3 >>> 24) & 0xFF, (h3 >>> 16) & 0xFF, (h3 >>> 8) & 0xFF, h3 & 0xFF,
            (h4 >>> 24) & 0xFF, (h4 >>> 16) & 0xFF, (h4 >>> 8) & 0xFF, h4 & 0xFF,
            (h5 >>> 24) & 0xFF, (h5 >>> 16) & 0xFF, (h5 >>> 8) & 0xFF, h5 & 0xFF,
            (h6 >>> 24) & 0xFF, (h6 >>> 16) & 0xFF, (h6 >>> 8) & 0xFF, h6 & 0xFF
        ];
        if (!this.is224) {
            arr.push((h7 >>> 24) & 0xFF, (h7 >>> 16) & 0xFF, (h7 >>> 8) & 0xFF, h7 & 0xFF);
        }
        return arr;
    };

    Sha256.prototype.array = Sha256.prototype.digest;

    Sha256.prototype.arrayBuffer = function () {
        this.finalize();

        var buffer = new ArrayBuffer(this.is224 ? 28 : 32);
        var dataView = new DataView(buffer);
        dataView.setUint32(0, this.h0);
        dataView.setUint32(4, this.h1);
        dataView.setUint32(8, this.h2);
        dataView.setUint32(12, this.h3);
        dataView.setUint32(16, this.h4);
        dataView.setUint32(20, this.h5);
        dataView.setUint32(24, this.h6);
        if (!this.is224) {
            dataView.setUint32(28, this.h7);
        }
        return buffer;
    };

    function HmacSha256(key, is224, sharedMemory) {
        var i, type = typeof key;
        if (type === 'string') {
            var bytes = [], length = key.length, index = 0, code;
            for (i = 0; i < length; ++i) {
                code = key.charCodeAt(i);
                if (code < 0x80) {
                    bytes[index++] = code;
                } else if (code < 0x800) {
                    bytes[index++] = (0xc0 | (code >>> 6));
                    bytes[index++] = (0x80 | (code & 0x3f));
                } else if (code < 0xd800 || code >= 0xe000) {
                    bytes[index++] = (0xe0 | (code >>> 12));
                    bytes[index++] = (0x80 | ((code >>> 6) & 0x3f));
                    bytes[index++] = (0x80 | (code & 0x3f));
                } else {
                    code = 0x10000 + (((code & 0x3ff) << 10) | (key.charCodeAt(++i) & 0x3ff));
                    bytes[index++] = (0xf0 | (code >>> 18));
                    bytes[index++] = (0x80 | ((code >>> 12) & 0x3f));
                    bytes[index++] = (0x80 | ((code >>> 6) & 0x3f));
                    bytes[index++] = (0x80 | (code & 0x3f));
                }
            }
            key = bytes;
        } else {
            if (type === 'object') {
                if (key === null) {
                    throw new Error(ERROR);
                } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
                    key = new Uint8Array(key);
                } else if (!Array.isArray(key)) {
                    if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
                        throw new Error(ERROR);
                    }
                }
            } else {
                throw new Error(ERROR);
            }
        }

        if (key.length > 64) {
            key = (new Sha256(is224, true)).update(key).array();
        }

        var oKeyPad = [], iKeyPad = [];
        for (i = 0; i < 64; ++i) {
            var b = key[i] || 0;
            oKeyPad[i] = 0x5c ^ b;
            iKeyPad[i] = 0x36 ^ b;
        }

        Sha256.call(this, is224, sharedMemory);

        this.update(iKeyPad);
        this.oKeyPad = oKeyPad;
        this.inner = true;
        this.sharedMemory = sharedMemory;
    }
    HmacSha256.prototype = new Sha256();

    HmacSha256.prototype.finalize = function () {
        Sha256.prototype.finalize.call(this);
        if (this.inner) {
            this.inner = false;
            var innerHash = this.array();
            Sha256.call(this, this.is224, this.sharedMemory);
            this.update(this.oKeyPad);
            this.update(innerHash);
            Sha256.prototype.finalize.call(this);
        }
    };

    var exports = createMethod();
    exports.sha256 = exports;
    exports.sha224 = createMethod(true);
    exports.sha256.hmac = createHmacMethod();
    exports.sha224.hmac = createHmacMethod(true);

    if (COMMON_JS) {
        module.exports = exports;
    } else {
        root.sha256 = exports.sha256;
        root.sha224 = exports.sha224;
        if (AMD) {
            define(function () {
                return exports;
            });
        }
    }
})();


/** ---------------------cf data------------------------------ */
const MY_KV_ALL_KEY = 'KV_CONFIG';
async function check_kv(env) {
    if (!env || !env.amclubs) {
        return new Response('Error: amclubs KV_NAMESPACE is not bound.', {
            status: 400,
        });
    }
    if (typeof env.amclubs === 'undefined') {
        return new Response('Error: amclubs KV_NAMESPACE is not bound.', {
            status: 400,
        })
    }
    return null;
}

async function get_kv(env) {
    try {
        const config = await env.amclubs.get(MY_KV_ALL_KEY, { type: 'json' });
        if (!config) {
            return {
                kv_id: '',
                kv_pDomain: [],
                kv_p64Domain: []
            };
        }
        return {
            kv_id: config.kv_id || '',
            kv_pDomain: Array.isArray(config.kv_pDomain) ? config.kv_pDomain : stringToArray(config.kv_pDomain),
            kv_p64Domain: Array.isArray(config.kv_p64Domain) ? config.kv_p64Domain : stringToArray(config.kv_p64Domain)
        };
    } catch (err) {
        error('[get_kv] Error reading KV:', err);
        return {
            kv_id: '',
            kv_pDomain: [],
            kv_p64Domain: []
        };
    }
}

async function set_kv_data(request, env) {
    try {
        const { kv_id, kv_pDomain, kv_p64Domain } = await request.json();
        const data = {
            kv_id,
            kv_pDomain: stringToArray(kv_pDomain),
            kv_p64Domain: stringToArray(kv_p64Domain)
        };
        await env.amclubs.put(MY_KV_ALL_KEY, JSON.stringify(data));
        return new Response('保存成功', { status: 200 });
    } catch (err) {
        return new Response('保存失败: ' + err.message, { status: 500 });
    }
}

async function show_kv_page(env) {
    const kvCheckResponse = await check_kv(env);
    if (kvCheckResponse) {
        return kvCheckResponse;
    }
    const { kv_id, kv_pDomain, kv_p64Domain } = await get_kv(env);
    log('[show_kv_page] KV数据:', { kv_id, kv_pDomain, kv_p64Domain });

    return new Response(
        renderPage({
            base64Title: pName,
            suffix: '-设置',
            heading: `配置设置`,
            bodyContent: `
                <label>ID：</label>
                <input type="text" id="kv_id" placeholder="请输入ID" value="${kv_id || ''}" /><br/><br/>
                <label>pDomain（逗号或换行分隔多个域名）：</label>
                <textarea id="kv_pDomain" placeholder="例如 a.com,b.com" rows="4">${kv_pDomain.join('\n')}</textarea><br/><br/>
                <label>p64Domain（逗号或换行分隔多个域名）：</label>
                <textarea id="kv_p64Domain" placeholder="例如 b.com,c.com" rows="4">${kv_p64Domain.join('\n')}</textarea><br/><br/>
                <button onclick="saveData()">保存</button>
                <div id="saveStatus" style="margin-top:10px;color:green;"></div>

                <script>
                    async function saveData() {
                        const kv_id = document.getElementById('kv_id').value;
                        const kv_pDomain = document.getElementById('kv_pDomain').value;
                        const kv_p64Domain = document.getElementById('kv_p64Domain').value;

                        const body = JSON.stringify({ kv_id, kv_pDomain, kv_p64Domain });
                        try {
                            const response = await fetch('/${id}/set', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body
                            });

                            const text = await response.text();
                            const statusDiv = document.getElementById('saveStatus');
                            statusDiv.innerText = text;

                            setTimeout(() => {
                                statusDiv.innerText = '';
                            }, 3000);
                        } catch (err) {
                            const statusDiv = document.getElementById('saveStatus');
                            statusDiv.innerText = '保存失败: ' + err.message;
                            setTimeout(() => {
                                statusDiv.innerText = '';
                            }, 3000);
                        }
                    }
                </script>
            `
        }),
        { headers: { "Content-Type": "text/html; charset=UTF-8" }, status: 200 }
    );
}


/** -------------------websvc logic-------------------------------- */
const WS_READY_STATE_OPEN = 1;
const WS_READY_STATE_CLOSING = 2;
async function websvcExecutor(request) {
    const webSocketPair = new WebSocketPair();
    const [client, webSocket] = Object.values(webSocketPair);
    webSocket.accept();

    let address = '';
    let portWithRandomLog = '';
    let currentDate = new Date();
    const log = (/** @type {string} */ info, /** @type {string | undefined} */ event) => {
        console.log(`[${currentDate} ${address}:${portWithRandomLog}] ${info}`, event || '');
    };
    const earlyDataHeader = request.headers.get('sec-websocket-protocol') || '';
    const readableWebSocketStream = websvcStream(webSocket, earlyDataHeader, log);

    /** @type {{ value: import("@cloudflare/workers-types").Socket | null}}*/
    let remoteSocketWapper = {
        value: null,
    };
    let udpStreamWrite = null;
    let isDns = false;

    readableWebSocketStream.pipeTo(new WritableStream({
        async write(chunk, controller) {
            if (isDns && udpStreamWrite) {
                return udpStreamWrite(chunk);
            }
            if (remoteSocketWapper.value) {
                const writer = remoteSocketWapper.value.writable.getWriter()
                await writer.write(chunk);
                writer.releaseLock();
                return;
            }

            const {
                hasError,
                //message,
                portRemote = 443,
                addressRemote = '',
                rawDataIndex,
                channelVersion = new Uint8Array([0, 0]),
                isUDP,
                addressType,
            } = handleRequestHeader(chunk, id);
            address = addressRemote;
            portWithRandomLog = `${portRemote} ${isUDP ? 'udp' : 'tcp'} `;
            log(`handleRequestHeader-->${addressType} Processing TCP outbound connection ${addressRemote}:${portRemote}`);

            if (hasError) {
                throw new Error(message);
            }

            if (isUDP && portRemote !== 53) {
                throw new Error('UDP proxy only enabled for DNS which is port 53');
            }

            if (isUDP && portRemote === 53) {
                isDns = true;
            }

            const channelResponseHeader = new Uint8Array([channelVersion[0], 0]);
            const rawClientData = chunk.slice(rawDataIndex);

            if (isDns) {
                const { write } = await handleUPOut(webSocket, channelResponseHeader, log);
                udpStreamWrite = write;
                udpStreamWrite(rawClientData);
                return;
            }

            handleTPOut(remoteSocketWapper, addressRemote, portRemote, rawClientData, webSocket, channelResponseHeader, log, addressType);
        },
        close() {
            log(`readableWebSocketStream is close`);
        },
        abort(reason) {
            log(`readableWebSocketStream is abort`, JSON.stringify(reason));
        },
    })).catch((err) => {
        log('readableWebSocketStream pipeTo error', err);
    });

    return new Response(null, {
        status: 101,
        webSocket: client,
    });
}

async function websvcExecutorTr(request) {
    const webSocketPair = new WebSocketPair();
    const [client, webSocket] = Object.values(webSocketPair);
    webSocket.accept();

    let address = "";
    let portWithRandomLog = "";
    const remoteSocketWrapper = { value: null };
    let udpStreamWrite = null;

    const log = (info, event = "") => {
        console.log(`[${address}:${portWithRandomLog}] ${info}`, event);
    };

    const earlyDataHeader = request.headers.get("sec-websocket-protocol") || "";
    const readableWebSocketStream = websvcStream(webSocket, earlyDataHeader, log);

    const handleStreamData = async (chunk) => {
        if (udpStreamWrite) {
            return udpStreamWrite(chunk);
        }

        if (remoteSocketWrapper.value) {
            const writer = remoteSocketWrapper.value.writable.getWriter();
            await writer.write(chunk);
            writer.releaseLock();
            return;
        }

        const { hasError, message, portRemote = 443, addressRemote = "", rawClientData, addressType } = await handleRequestHeaderTr(chunk, id);
        address = addressRemote;
        portWithRandomLog = `${portRemote}--${Math.random()} tcp`;
        if (hasError) {
            throw new Error(message);
        }

        handleTPOut(remoteSocketWrapper, addressRemote, portRemote, rawClientData, webSocket, null, log, addressType);
    };

    readableWebSocketStream.pipeTo(
        new WritableStream({
            write: handleStreamData,
            close: () => log("readableWebSocketStream is closed"),
            abort: (reason) => log("readableWebSocketStream is aborted", JSON.stringify(reason)),
        })
    ).catch((err) => {
        log("readableWebSocketStream pipeTo error", err);
    });

    return new Response(null, {
        status: 101,
        // @ts-ignore
        webSocket: client
    });
}

function websvcStream(pipeServer, earlyDataHeader, log) {
    let readableStreamCancel = false;
    const stream = new ReadableStream({
        start(controller) {
            pipeServer.addEventListener('message', (event) => {
                const message = event.data;
                controller.enqueue(message);
            });

            pipeServer.addEventListener('close', () => {
                closeDataStream(pipeServer);
                controller.close();
            });

            pipeServer.addEventListener('error', (err) => {
                log('pipeServer has error');
                controller.error(err);
            });
            const { earlyData, error } = b64ToBuf(earlyDataHeader);
            if (error) {
                controller.error(error);
            } else if (earlyData) {
                controller.enqueue(earlyData);
            }
        },

        pull(controller) {
            // if ws can stop read if stream is full, we can implement backpressure
        },

        cancel(reason) {
            log(`ReadableStream was canceled, due to ${reason}`)
            readableStreamCancel = true;
            closeDataStream(pipeServer);
        }
    });

    return stream;
}

async function handleTPOut(remoteS, addressRemote, portRemote, rawClientData, pipe, channelResponseHeader, log, addressType) {

    async function connectAndWrite(address, port, socks = false) {
        const tcpS = socks ? await serviceCall(addressType, address, port, log) : connect({ hostname: address, port: port, servername: addressRemote });
        remoteS.value = tcpS;
        log(`[connectAndWrite]--> s5:${socks} connected to ${address}:${port}`);
        const writer = tcpS.writable.getWriter();
        await writer.write(rawClientData);
        writer.releaseLock();
        return tcpS;
    }

    async function retry() {
        const finalTargetHost = paddr || addressRemote;
        const finalTargetPort = pnum || portRemote;
        const tcpS = s5Enable ? await connectAndWrite(finalTargetHost, finalTargetPort, true) : await connectAndWrite(finalTargetHost, finalTargetPort);
        log(`[retry]--> s5:${s5Enable} connected to ${finalTargetHost}:${finalTargetPort}`);
        tcpS.closed.catch(error => {
            log('[retry]--> tcpS closed error', error);
        }).finally(() => {
            closeDataStream(pipe);
        })
        transferDataStream(tcpS, pipe, channelResponseHeader, null, log);
    }

    async function nat64() {
        const finalTargetHost = await resolveDomainToRouteX(addressRemote);
        const finalTargetPort = portRemote;
        const tcpS = s5Enable ? await connectAndWrite(finalTargetHost, finalTargetPort, true) : await connectAndWrite(finalTargetHost, finalTargetPort);
        log(`[nat64]--> s5:${s5Enable} connected to ${finalTargetHost}:${finalTargetPort}`);
        tcpS.closed.catch(error => {
            log('[nat64]--> tcpS closed error', error);
        }).finally(() => {
            closeDataStream(pipe);
        })
        transferDataStream(tcpS, pipe, channelResponseHeader, null, log);
    }

    async function finalStep() {
        try {
            if (p64) {
                log('[finalStep] p64=true → try nat64() first, then retry() if nat64 fails');
                const ok = await tryOnce(nat64, 'nat64');
                if (!ok) await tryOnce(retry, 'retry');
            } else {
                log('[finalStep] p64=false → try retry() first, then nat64() if retry fails');
                const ok = await tryOnce(retry, 'retry');
                if (!ok) await tryOnce(nat64, 'nat64');
            }
        } catch (err) {
            log('[finalStep] error:', err);
        }
    }

    async function tryOnce(fn, tag) {
        try {
            const ok = await fn();
            log(`[finalStep] ${tag} finished normally`);
            return true;
        } catch (err) {
            log(`[finalStep] ${tag} failed:`, err);
            return false;
        }
    }

    const { finalTargetHost, finalTargetPort } = await getDomainToRouteX(addressRemote, portRemote, s5Enable, false);
    const tcpS = await connectAndWrite(finalTargetHost, finalTargetPort, s5Enable ? true : false);
    transferDataStream(tcpS, pipe, channelResponseHeader, finalStep, log);
}

async function transferDataStream(remoteS, pipe, channelResponseHeader, retry, log) {
    let remoteChunkCount = 0;
    let chunks = [];
    let channelHeader = channelResponseHeader;
    let hasIncomingData = false;
    await remoteS.readable
        .pipeTo(
            new WritableStream({
                start() {
                },
                async write(chunk, controller) {
                    hasIncomingData = true;
                    remoteChunkCount++;
                    if (pipe.readyState !== WS_READY_STATE_OPEN) {
                        controller.error(
                            '[transferDataStream]--> pipe.readyState is not open, maybe close'
                        );
                    }
                    if (channelHeader) {
                        pipe.send(await new Blob([channelHeader, chunk]).arrayBuffer());
                        channelHeader = null;
                    } else {
                        pipe.send(chunk);
                    }
                },
                close() {
                    log(`[transferDataStream]--> serviceCallion!.readable is close with hasIncomingData is ${hasIncomingData}`);
                },
                abort(reason) {
                    console.error(`[transferDataStream]--> serviceCallion!.readable abort`, reason);
                },
            })
        )
        .catch((error) => {
            console.error(`[transferDataStream]--> transferDataStream has exception `, error.stack || error);
            closeDataStream(pipe);
        });

    if (hasIncomingData === false && typeof retry === 'function') {
        log(`[transferDataStream]--> no data, invoke retry flow`);
        retry();
    }
}

async function handleUPOut(pipe, channelResponseHeader, log) {
    let ischannelHeaderSent = false;
    const transformStream = new TransformStream({
        start(controller) {

        },
        transform(chunk, controller) {
            for (let index = 0; index < chunk.byteLength;) {
                const lengthBuffer = chunk.slice(index, index + 2);
                const udpPakcetLength = new DataView(lengthBuffer).getUint16(0);
                const udpData = new Uint8Array(
                    chunk.slice(index + 2, index + 2 + udpPakcetLength)
                );
                index = index + 2 + udpPakcetLength;
                controller.enqueue(udpData);
            }
        },
        flush(controller) {
        }
    });

    transformStream.readable.pipeTo(new WritableStream({
        async write(chunk) {
            const resp = await fetch(durl, // dns server url
                {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/dns-message',
                    },
                    body: chunk,
                })
            const dnsQueryResult = await resp.arrayBuffer();
            const udpSize = dnsQueryResult.byteLength;
            const udpSizeBuffer = new Uint8Array([(udpSize >> 8) & 0xff, udpSize & 0xff]);
            if (pipe.readyState === WS_READY_STATE_OPEN) {
                log(`doh success and dns message length is ${udpSize}`);
                if (ischannelHeaderSent) {
                    pipe.send(await new Blob([udpSizeBuffer, dnsQueryResult]).arrayBuffer());
                } else {
                    pipe.send(await new Blob([channelResponseHeader, udpSizeBuffer, dnsQueryResult]).arrayBuffer());
                    ischannelHeaderSent = true;
                }
            }
        }
    })).catch((error) => {
        error('dns udp has error' + error)
    });

    const writer = transformStream.writable.getWriter();

    return {
        /**
         *
         * @param {Uint8Array} chunk
         */
        write(chunk) {
            writer.write(chunk);
        }
    };
}

async function serviceCall(ipType, remoteIp, remotePort, log) {
    const { username, password, hostname, port } = parsedS5;
    const socket = connect({ hostname, port });
    const writer = socket.writable.getWriter();
    const reader = socket.readable.getReader();
    const encoder = new TextEncoder();

    const sendSocksGreeting = async () => {
        const greeting = new Uint8Array([5, 2, 0, 2]);
        await writer.write(greeting);
    };

    const handleAuthResponse = async () => {
        const res = (await reader.read()).value;
        if (res[1] === 0x02) {
            if (!username || !password) {
                throw new Error("Authentication required");
            }
            const authRequest = new Uint8Array([
                1, username.length, ...encoder.encode(username),
                password.length, ...encoder.encode(password)
            ]);
            await writer.write(authRequest);
            const authResponse = (await reader.read()).value;
            if (authResponse[0] !== 0x01 || authResponse[1] !== 0x00) {
                throw new Error("Authentication failed");
            }
        }
    };

    const sendSocksRequest = async () => {
        let DSTADDR;
        switch (ipType) {
            case 1:
                DSTADDR = new Uint8Array([1, ...remoteIp.split('.').map(Number)]);
                break;
            case 2:
                DSTADDR = new Uint8Array([3, remoteIp.length, ...encoder.encode(remoteIp)]);
                break;
            case 3:
                DSTADDR = new Uint8Array([4, ...remoteIp.split(':').flatMap(x => [
                    parseInt(x.slice(0, 2), 16), parseInt(x.slice(2), 16)
                ])]);
                break;
            default:
                throw new Error("Invalid address type");
        }
        const socksRequest = new Uint8Array([5, 1, 0, ...DSTADDR, remotePort >> 8, remotePort & 0xff]);
        await writer.write(socksRequest);

        const response = (await reader.read()).value;
        if (response[1] !== 0x00) {
            throw new Error("Connection failed");
        }
    };

    try {
        await sendSocksGreeting();
        await handleAuthResponse();
        await sendSocksRequest();
    } catch (error) {
        error(error.message);
        return null;
    } finally {
        writer.releaseLock();
        reader.releaseLock();
    }
    return socket;
}

function handleRequestHeader(channelBuffer, id) {
    if (channelBuffer.byteLength < 24) {
        return {
            hasError: true,
            message: 'invalid data',
        };
    }

    const version = new Uint8Array(channelBuffer.slice(0, 1));
    let isValidUser = false;
    let isUDP = false;
    const slicedBuffer = new Uint8Array(channelBuffer.slice(1, 17));
    const slicedBufferString = stringify(slicedBuffer);
    const uuids = id.includes(',') ? id.split(",") : [id];

    isValidUser = uuids.some(userUuid => slicedBufferString === userUuid.trim()) || uuids.length === 1 && slicedBufferString === uuids[0].trim();
    if (!isValidUser) {
        return {
            hasError: true,
            message: 'invalid user',
        };
    }

    const optLength = new Uint8Array(channelBuffer.slice(17, 18))[0];
    const command = new Uint8Array(
        channelBuffer.slice(18 + optLength, 18 + optLength + 1)
    )[0];

    if (command === 1) {
        isUDP = false;
    } else if (command === 2) {
        isUDP = true;
    } else {
        return {
            hasError: true,
            message: `command ${command} is not support, command 01-tcp,02-udp,03-mux`,
        };
    }
    const portIndex = 18 + optLength + 1;
    const portBuffer = channelBuffer.slice(portIndex, portIndex + 2);
    const portRemote = new DataView(portBuffer).getUint16(0);

    let addressIndex = portIndex + 2;
    const addressBuffer = new Uint8Array(
        channelBuffer.slice(addressIndex, addressIndex + 1)
    );

    const addressType = addressBuffer[0];
    let addressLength = 0;
    let addressValueIndex = addressIndex + 1;
    let addressValue = '';
    switch (addressType) {
        case 1:
            addressLength = 4;
            addressValue = new Uint8Array(
                channelBuffer.slice(addressValueIndex, addressValueIndex + addressLength)
            ).join('.');
            break;
        case 2:
            addressLength = new Uint8Array(
                channelBuffer.slice(addressValueIndex, addressValueIndex + 1)
            )[0];
            addressValueIndex += 1;
            addressValue = new TextDecoder().decode(
                channelBuffer.slice(addressValueIndex, addressValueIndex + addressLength)
            );
            break;
        case 3:
            addressLength = 16;
            const dataView = new DataView(
                channelBuffer.slice(addressValueIndex, addressValueIndex + addressLength)
            );
            // 2001:0db8:85a3:0000:0000:8a2e:0370:7334
            const ipv6 = [];
            for (let i = 0; i < 8; i++) {
                ipv6.push(dataView.getUint16(i * 2).toString(16));
            }
            addressValue = ipv6.join(':');
            // seems no need add [] for ipv6
            break;
        default:
            return {
                hasError: true,
                message: `invild  addressType is ${addressType}`,
            };
    }
    if (!addressValue) {
        return {
            hasError: true,
            message: `addressValue is empty, addressType is ${addressType}`,
        };
    }

    return {
        hasError: false,
        addressRemote: addressValue,
        portRemote,
        rawDataIndex: addressValueIndex + addressLength,
        channelVersion: version,
        isUDP,
        addressType,
    };
}

async function handleRequestHeaderTr(buffer, id) {
    if (buffer.byteLength < 56) {
        return {
            hasError: true,
            message: "invalid data"
        };
    }
    let crLfIndex = 56;
    if (new Uint8Array(buffer.slice(56, 57))[0] !== 0x0d || new Uint8Array(buffer.slice(57, 58))[0] !== 0x0a) {
        return {
            hasError: true,
            message: "invalid header format (missing CR LF)"
        };
    }
    const password = new TextDecoder().decode(buffer.slice(0, crLfIndex));
    if (password !== sha256.sha224(id)) {
        return {
            hasError: true,
            message: "invalid password"
        };
    }

    const s5DataBuffer = buffer.slice(crLfIndex + 2);
    if (s5DataBuffer.byteLength < 6) {
        return {
            hasError: true,
            message: "invalid S5 request data"
        };
    }

    const view = new DataView(s5DataBuffer);
    const cmd = view.getUint8(0);
    if (cmd !== 1) {
        return {
            hasError: true,
            message: "unsupported command, only TCP (CONNECT) is allowed"
        };
    }

    const addressType = view.getUint8(1);
    let addressLength = 0;
    let addressIndex = 2;
    let address = "";
    switch (addressType) {
        case 1:
            addressLength = 4;
            address = new Uint8Array(
                s5DataBuffer.slice(addressIndex, addressIndex + addressLength)
            ).join(".");
            break;
        case 3:
            addressLength = new Uint8Array(
                s5DataBuffer.slice(addressIndex, addressIndex + 1)
            )[0];
            addressIndex += 1;
            address = new TextDecoder().decode(
                s5DataBuffer.slice(addressIndex, addressIndex + addressLength)
            );
            break;
        case 4:
            addressLength = 16;
            const dataView = new DataView(s5DataBuffer.slice(addressIndex, addressIndex + addressLength));
            const ipv6 = [];
            for (let i = 0; i < 8; i++) {
                ipv6.push(dataView.getUint16(i * 2).toString(16));
            }
            address = ipv6.join(":");
            break;
        default:
            return {
                hasError: true,
                message: `invalid addressType is ${addressType}`
            };
    }

    if (!address) {
        return {
            hasError: true,
            message: `address is empty, addressType is ${addressType}`
        };
    }

    const portIndex = addressIndex + addressLength;
    const portBuffer = s5DataBuffer.slice(portIndex, portIndex + 2);
    const portRemote = new DataView(portBuffer).getUint16(0);
    return {
        hasError: false,
        addressRemote: address,
        portRemote,
        rawClientData: s5DataBuffer.slice(portIndex + 4),
        addressType: addressType
    };
}

function closeDataStream(socket) {
    try {
        if (socket.readyState === WS_READY_STATE_OPEN || socket.readyState === WS_READY_STATE_CLOSING) {
            socket.close();
        }
    } catch (error) {
        console.error('closeDataStream error', error);
    }
}


/** -------------------home page-------------------------------- */
async function login(request, env) {
    const headers = {
        "Content-Type": "text/html; charset=UTF-8",
        "referer": "https://www.google.com/search?q=" + fname
    };
    if (request.method === "POST") {
        const formData = await request.formData();
        const inputPassword = formData.get("password");
        if (inputPassword === id) {
            return await show_kv_page(env);
        } else {
            return new Response(
                renderPage({
                    base64Title: pName,
                    suffix: '-登录失败',
                    heading: '❌ 登录失败',
                    bodyContent: `
                        <p>密码错误，请重新尝试。</p>
                        <p><a href="/">返回登录页面</a></p>
                    `
                }),
                { headers: { "Content-Type": "text/html; charset=UTF-8" }, status: 200 }
            );
        }
    }

    return new Response(
        renderPage({
            base64Title: pName,
            suffix: '-登录',
            heading: '请输入密码登录',
            bodyContent: `
                <form method="POST">
                    <input type="password" name="password" placeholder="密码" required />
                    <button type="submit">登录</button>
                </form>
            `
        }),
        { headers: { "Content-Type": "text/html; charset=UTF-8" }, status: 200 }
    );

}

function renderPage({ base64Title, suffix = '', heading, bodyContent }) {
    const title = decodeBase64Utf8(base64Title);
    const fullTitle = title + suffix;

    return `<!DOCTYPE html>
        <html lang="zh-CN">
        <head>
        <meta charset="UTF-8">
        <title>${fullTitle}</title>
        <style>
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #5563de, #89f7fe);
            color: #333;
        }

        .login-container {
            background: #fff;
            padding: 30px 25px;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            width: 400px;
            text-align: center;
            animation: fadeIn 0.6s ease-in-out;
        }

        h1 { font-size: 24px; margin-bottom: 20px; color: #4A4A4A; }

        input[type="text"], input[type="password"], textarea {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            margin-top: 10px;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-sizing: border-box;
        }

        button {
            margin-top: 20px;
            width: 100%;
            padding: 12px;
            font-size: 16px;
            border: none;
            background-color: #4CAF50;
            color: white;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.3s;
        }

        button:hover { background-color: #45a049; }

        #saveStatus { margin-top: 15px; font-weight: bold; color: green; }

        .links { margin-top: 15px; font-size: 14px; }
        .link-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .link-row a {
            flex: 1;
            margin: 0 5px;
            padding: 6px 0;
            color: #5563DE;
            text-decoration: none;
            text-align: center;
            border-radius: 6px;
            background: #f1f3ff;
            transition: all 0.3s;
        }
        .link-row a:hover { background: #e0e4ff; color: #333; }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        </style>
        </head>
        <body>
        <div class="login-container">
        <h1>${heading}</h1>
        ${bodyContent}
        <div class="links">
            <div class="link-row">
                <a href="${ytName}" target="_blank">🎬 YouTube</a>
                <a href="${tgName}" target="_blank">💬 Telegram</a>
            </div>
            <div class="link-row">
                <a href="${ghName}" target="_blank">📂 GitHub</a>
                <a href="${bName}" target="_blank">🌐 Blog</a>
            </div>
        </div>
        </div>
        </body>
    </html>`;
}