/**
 * YouTube  : https://youtube.com/@am_clubs
 * Telegram : https://t.me/am_clubs
 * GitHub   : https://github.com/amclubs
 * BLog     : https://amclubss.com
 */

let id = atob('ZWM4NzJkOGYtNzJiMC00YTA0LWI2MTItMDMyN2Q4NWUxOGVk');

let paddrs = [
    atob('cHJveHlpcC5hbWNsdWJzLmNhbWR2ci5vcmc='),
    atob('cHJveHlpcC5hbWNsdWJzLmtvem93LmNvbQ==')
];
let paddrDefaul = paddrs[Math.floor(Math.random() * paddrs.length)];
let pnumDefaul = atob('NDQz');
let pDomainDefaul = [];

let p64Defaul = false;
let p64DnUrl = atob('aHR0cHM6Ly8xLjEuMS4xL2Rucy1xdWVyeQ==');
let p64PrefixDefaul = atob('MjYwMjpmYzU5OmIwOjY0Ojo=');
let p64DomainDefaul = [];

let s5Defaul = '';
let s5EnableDefaul = false;
let parsedS5Defaul = {};

let durlDefaul = atob('aHR0cHM6Ly9za3kucmV0aGlua2Rucy5jb20vMTotUGZfX19fXzlfOEFfQU1BSWdFOGtNQUJWRERtS09IVEFLZz0=');
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
            const config = await resolveConfig(request, env, kvData);

            if (request.headers.get('Upgrade') === 'websocket') {
                return await websvcExecutor(request, config);
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
async function resolveConfig(request, env, kvData) {
    const url = new URL(request.url);
    let paddr = url.searchParams.get('PADDR') ?? env.PADDR ?? paddrDefaul;
    let pnum = pnumDefaul;
    if (paddr) {
        const [ip, port] = paddr.split(':');
        paddr = ip;
        pnum = port || pnum;
    }
    const rawP64 = url.searchParams.get('P64') ?? env.P64 ?? p64Defaul;
    const s5 = url.searchParams.get('S5') ?? env.S5 ?? s5Defaul;
    const parsedS5 = (await requestParserFromUrl(s5, url)) ?? parsedS5Defaul;
    const s5Enable = parsedS5 && Object.keys(parsedS5).length > 0;
    let prType = url.searchParams.get(atob('UFJPVF9UWVBF')) ?? env.PROT_TYPE ?? '';
    if (prType) {
        prType = String(prType).trim().toLowerCase();
    }
    const parseNumberOption = (name, defaultValue, min, max) => {
        const value = Number(url.searchParams.get(name) ?? env[name] ?? defaultValue);
        if (!Number.isFinite(value)) return defaultValue;
        return Math.min(max, Math.max(min, Math.floor(value)));
    };

    const config = {
        paddr,
        pnum,
        pDomain: kvData.kv_pDomain ?? pDomainDefaul,
        p64: String(rawP64).toLowerCase() === 'true',
        p64Prefix: url.searchParams.get('P64PREFIX') ?? env.P64PREFIX ?? p64PrefixDefaul,
        p64Domain: kvData.kv_p64Domain ?? p64DomainDefaul,
        s5,
        parsedS5,
        s5Enable,
        durl: url.searchParams.get('D_URL') ?? env.D_URL ?? durlDefaul,
        tcpConnectTimeout: parseNumberOption('TCP_CONNECT_TIMEOUT', TCP_CONNECT_TIMEOUT_MS, 250, 10000),
        tcpDirectConcurrency: parseNumberOption('TCP_CONCURRENT_DIAL', TCP_DIRECT_CONCURRENCY, 1, 4),
        tcpProxyConcurrency: parseNumberOption('PROXY_CONCURRENT_DIAL', TCP_PROXY_CONCURRENCY, 1, 4),
        prType
    };
    log(`[config]-->[${Date.now()}]`, JSON.stringify(config));
    return config;
}

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

function isIpAddress(str) {
    const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6 = /^[0-9a-fA-F:]+$/;
    return ipv4.test(str) || ipv6.test(str);
}

async function getDomainToRouteX(addressRemote, portRemote, p64Flag = false, config) {
    let finalHost = addressRemote;
    let finalPort = portRemote;
    try {
        log(`[getDomainToRouteX]--> paddr=${config.paddr}, p64Prefix=${config.p64Prefix}, addressRemote=${addressRemote}, p64=${config.p64}`);
        log(`[getDomainToRouteX]--> pDomain=${JSON.stringify(config.pDomain)}, p64Domain=${JSON.stringify(config.p64Domain)}`);

        // if (isIpAddress(addressRemote)) {
        //     log(`[getDomainToRouteX] Skip DNS resolve because target is IP`);
        //     return { finalHost, finalPort };
        // }

        const safeMatch = (domains, target) => {
            try {
                return Array.isArray(domains) && domains.some(domain => matchesDomainPattern(target, domain));
            } catch (e) {
                log(`[error]--> matchesDomainPattern failed: ${e.message}`);
                return false;
            }
        };

        const resultDomain = safeMatch(config.pDomain, addressRemote);
        const result64Domain = safeMatch(config.p64Domain, addressRemote);
        log(`[getDomainToRouteX]--> match pDomain=${resultDomain}, match p64Domain=${result64Domain}, p64Flag=${p64Flag}`);

        if (config.s5Enable) {
            log(`[getDomainToRouteX]--> s5Enable=true, use remote directly`);
        } else if (resultDomain) {
            finalHost = config.paddr;
            finalPort = config.pnum || portRemote;
            log(`[getDomainToRouteX]--> Matched pDomain, use paddr=${finalHost}, port=${finalPort}`);
        } else if (result64Domain || (p64Flag && config.p64)) {
            try {
                finalHost = await resolveDomainToRouteX(addressRemote, config);
                finalPort = portRemote;
                log(`[getDomainToRouteX]--> Resolved p64Domain via resolveDomainToRouteX: ${finalHost}`);
            } catch (err) {
                log(`[retry]--> resolveDomainToRouteX failed: ${err.message}`);
                finalHost = config.paddr || addressRemote;
                finalPort = config.pnum || portRemote;
            }
        } else if (p64Flag) {
            finalHost = config.paddr || addressRemote;
            finalPort = portRemote;
            log(`[getDomainToRouteX]--> fallback by p64Flag, host=${finalHost}, port=${finalPort}`);
        }

        log(`[getDomainToRouteX]--> Final target: ${finalHost}:${finalPort}`);
        return { finalHost, finalPort };
    } catch (err) {
        log(`[fatal]--> getDomainToRouteX failed: ${err.message}`);
        if (p64Flag) {
            finalHost = config.paddr || addressRemote;
            finalPort = portRemote;
            log(`[fatal-fallback]--> fallback by p64Flag, host=${finalHost}, port=${finalPort}`);
        }
        log(`[getDomainToRouteX]--> Final target: ${finalHost}:${finalPort}`);
        return { finalHost, finalPort };
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

async function resolveDomainToRouteX(domain, config) {
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
        const ipv6 = convertToRouteX(ipv4, config);
        log(`[resolveDomainToRouteX] Converted IPv6 address: ${ipv6}`);
        return ipv6;
    } catch (err) {
        error(`[Error] Failed to get routeX address: ${err.message}`);
        throw new Error(`[resolveDomainToRouteX] resolution failed: ${err.message}`);
    }
}

function convertToRouteX(ipv4Address, config) {
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

    let withBrackets = true;
    log(`[convertToRouteX] p64Prefix--->: ${config.p64Prefix}`);
    if (!config.p64Prefix || typeof config.p64Prefix !== 'string' || !config.p64Prefix.includes('::')) {
        throw new Error('[convertToRouteX] Invalid manual prefix; must be a valid IPv6 prefix');
    }
    const ipv6Tail = `${hexParts[0]}${hexParts[1]}:${hexParts[2]}${hexParts[3]}`.toLowerCase();
    const fullIPv6 = `${config.p64Prefix}${ipv6Tail}`;
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
    var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof require === 'function' && typeof process === 'object' && process.versions && process.versions.node;
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
const UPLOAD_BATCH_TARGET_BYTES = 20 * 1024;
const UPLOAD_QUEUE_MAX_BYTES = 16 * 1024 * 1024;
const UPLOAD_QUEUE_MAX_ITEMS = 4096;
const DOWNLOAD_CHUNK_MAX_BYTES = 32 * 1024;
const DOWNLOAD_BUFFER_DELAY_MS = 1;
const UPLOAD_DRAIN_TIMEOUT_MS = 1000;
const TCP_CONNECT_TIMEOUT_MS = 1000;
const TCP_DIRECT_CONCURRENCY = 2;
const TCP_PROXY_CONCURRENCY = 1;
async function websvcExecutor(request, config) {
    const webSocketPair = new WebSocketPair();
    const [client, webSocket] = Object.values(webSocketPair);
    webSocket.binaryType = 'arraybuffer';
    try {
        webSocket.accept({ allowHalfOpen: true });
    } catch (error) {
        webSocket.accept();
    }

    let address = '';
    let portWithRandomLog = '';
    let currentDate = new Date();
    const log = (/** @type {string} */ info, /** @type {string | undefined} */ event) => {
        console.log(`[${currentDate} ${address}:${portWithRandomLog}] ${info}`, event || '');
    };
    const remoteSocketWapper = createRemoteSocketWrapper(log, () => closeDataStream(webSocket));
    let udpStreamHandler = null;
    const earlyDataHeader = request.headers.get('sec-websocket-protocol') || '';
    const readableWebSocketStream = websvcStream(webSocket, earlyDataHeader, log, (reason) => {
        udpStreamHandler?.close(reason);
        remoteSocketWapper.close(reason);
    });
    let isDns = false;
    const trojanType = xorDe(dataTypeTr, 'datatype');
    let protocolType = config.prType === trojanType ? trojanType : config.prType === 'vless' ? 'vless' : null;
    let requestHeaderBuffer = new Uint8Array(0);

    readableWebSocketStream.pipeTo(new WritableStream({
        async write(chunk, controller) {

            if (isDns && udpStreamHandler) {
                return udpStreamHandler.write(chunk);
            }
            if (remoteSocketWapper.value || remoteSocketWapper.connectingPromise) {
                await remoteSocketWapper.write(chunk);
                return;
            }

            const data = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk);
            if (requestHeaderBuffer.byteLength + data.byteLength > 64 * 1024) {
                throw new Error('request header is too large');
            }
            const mergedHeader = new Uint8Array(requestHeaderBuffer.byteLength + data.byteLength);
            mergedHeader.set(requestHeaderBuffer);
            mergedHeader.set(data, requestHeaderBuffer.byteLength);
            requestHeaderBuffer = mergedHeader;

            if (!protocolType) {
                if (requestHeaderBuffer.byteLength >= 18) {
                    try {
                        const requestUser = stringify(requestHeaderBuffer.slice(1, 17));
                        const users = String(id || '').split(',').map(user => user.trim());
                        if (users.includes(requestUser)) protocolType = 'vless';
                    } catch (error) { }
                }
                if (!protocolType && requestHeaderBuffer.byteLength >= 58) {
                    if (requestHeaderBuffer[56] === 0x0d && requestHeaderBuffer[57] === 0x0a) {
                        protocolType = trojanType;
                    } else {
                        throw new Error('unable to detect request protocol');
                    }
                }
                if (!protocolType) return;
                log(`request protocol detected: ${protocolType}`);
            }

            if (protocolType === trojanType) {
                const trojanRequest = await handleRequestHeaderTr(requestHeaderBuffer, id);
                if (trojanRequest.needMore) return;
                if (trojanRequest.hasError) throw new Error(trojanRequest.message);
                const {
                    portRemote = 443,
                    addressRemote = '',
                    rawClientData,
                    isUDP,
                    addressType,
                } = trojanRequest;
                address = addressRemote;
                portWithRandomLog = `${portRemote} ${isUDP ? 'udp' : 'tcp'} `;
                requestHeaderBuffer = new Uint8Array(0);
                if (isUDP) {
                    isDns = true;
                    udpStreamHandler = await handleUPOut(webSocket, null, config, trojanType);
                    await udpStreamHandler.write(rawClientData);
                    return;
                }
                await handleTPOut(remoteSocketWapper, addressRemote, portRemote, rawClientData, webSocket, null, log, addressType, config);
                return;
            }

            const {
                hasError,
                needMore,
                message,
                portRemote = 443,
                addressRemote = '',
                rawDataIndex,
                channelVersion = new Uint8Array([0, 0]),
                isUDP,
                addressType,
            } = handleRequestHeader(requestHeaderBuffer, id);
            if (needMore) return;
            address = addressRemote;
            portWithRandomLog = `${portRemote} ${isUDP ? 'udp' : 'tcp'} `;
            log(`handleRequestHeader-->${addressType} Processing TCP outbound connection ${addressRemote}:${portRemote} portWithRandomLog:${portWithRandomLog}`);

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
            const rawClientData = requestHeaderBuffer.slice(rawDataIndex);
            requestHeaderBuffer = new Uint8Array(0);

            if (isDns) {
                udpStreamHandler = await handleUPOut(webSocket, channelResponseHeader, config);
                await udpStreamHandler.write(rawClientData);
                return;
            }

            await handleTPOut(remoteSocketWapper, addressRemote, portRemote, rawClientData, webSocket, channelResponseHeader, log, addressType, config);
        },
        async close() {
            log(`readableWebSocketStream is close`);
            await udpStreamHandler?.close();
            await remoteSocketWapper.closeGracefully();
        },
        async abort(reason) {
            log(`readableWebSocketStream is abort`, JSON.stringify(reason));
            await udpStreamHandler?.close(reason);
            remoteSocketWapper.close(reason);
        },
    })).catch((err) => {
        log('readableWebSocketStream pipeTo error', err);
        remoteSocketWapper.close(err);
        closeDataStream(webSocket);
    });

    return new Response(null, {
        status: 101,
        webSocket: client,
    });
}

async function websvcExecutorTr(request, config) {
    const webSocketPair = new WebSocketPair();
    const [client, webSocket] = Object.values(webSocketPair);
    webSocket.binaryType = 'arraybuffer';
    try {
        webSocket.accept({ allowHalfOpen: true });
    } catch (error) {
        webSocket.accept();
    }

    let address = "";
    let portWithRandomLog = "";
    let udpStreamHandler = null;

    const log = (info, event = "") => {
        console.log(`[${address}:${portWithRandomLog}] ${info}`, event);
    };
    const remoteSocketWrapper = createRemoteSocketWrapper(log, () => closeDataStream(webSocket));

    const earlyDataHeader = request.headers.get("sec-websocket-protocol") || "";
    const readableWebSocketStream = websvcStream(webSocket, earlyDataHeader, log, (reason) => {
        udpStreamHandler?.close(reason);
        remoteSocketWrapper.close(reason);
    });

    const handleStreamData = async (chunk) => {
        if (udpStreamHandler) {
            return udpStreamHandler.write(chunk);
        }

        if (remoteSocketWrapper.value || remoteSocketWrapper.connectingPromise) {
            await remoteSocketWrapper.write(chunk);
            return;
        }

        const { hasError, message, portRemote = 443, addressRemote = "", rawClientData, addressType } = await handleRequestHeaderTr(chunk, id);
        address = addressRemote;
        portWithRandomLog = `${portRemote}--${Math.random()} tcp`;
        if (hasError) {
            throw new Error(message);
        }

        await handleTPOut(remoteSocketWrapper, addressRemote, portRemote, rawClientData, webSocket, null, log, addressType, config);
    };

    readableWebSocketStream.pipeTo(
        new WritableStream({
            write: handleStreamData,
            close: async () => {
                log("readableWebSocketStream is closed");
                await udpStreamHandler?.close();
                await remoteSocketWrapper.closeGracefully();
            },
            abort: async (reason) => {
                log("readableWebSocketStream is aborted", JSON.stringify(reason));
                await udpStreamHandler?.close(reason);
                remoteSocketWrapper.close(reason);
            },
        })
    ).catch((err) => {
        log("readableWebSocketStream pipeTo error", err);
        remoteSocketWrapper.close(err);
        closeDataStream(webSocket);
    });

    return new Response(null, {
        status: 101,
        // @ts-ignore
        webSocket: client
    });
}

function websvcStream(pipeServer, earlyDataHeader, log, onClose) {
    let streamClosed = false;
    let sourceClosed = false;
    let draining = false;
    let queuedBytes = 0;
    let controllerRef;
    const messageQueue = [];

    const getMessageSize = (message) => {
        if (message instanceof ArrayBuffer || message instanceof Uint8Array) return message.byteLength;
        if (message instanceof Blob) return message.size;
        if (typeof message === "string") return new TextEncoder().encode(message).byteLength;
        return 0;
    };

    const normalizeMessage = async (message) => {
        if (message instanceof ArrayBuffer) return new Uint8Array(message);
        if (message instanceof Uint8Array) return new Uint8Array(message.buffer, message.byteOffset, message.byteLength);
        if (message instanceof Blob) return new Uint8Array(await message.arrayBuffer());
        if (typeof message === "string") return new TextEncoder().encode(message);
        throw new Error(`Unknown WS message type: ${typeof message}`);
    };

    const failStream = (error) => {
        if (streamClosed) return;
        streamClosed = true;
        messageQueue.length = 0;
        queuedBytes = 0;
        onClose?.(error);
        controllerRef?.error(error);
    };

    const drainQueue = async () => {
        if (draining || streamClosed || !controllerRef) return;
        draining = true;
        try {
            while (messageQueue.length && !streamClosed && controllerRef.desiredSize > 0) {
                const item = messageQueue.shift();
                const message = await normalizeMessage(item.message);
                queuedBytes = Math.max(0, queuedBytes - item.size);
                if (!streamClosed) controllerRef.enqueue(message);
            }
            if (sourceClosed && messageQueue.length === 0 && !streamClosed) {
                streamClosed = true;
                controllerRef.close();
            }
        } catch (error) {
            failStream(error);
        } finally {
            draining = false;
        }
    };

    const enqueueMessage = (message) => {
        if (streamClosed || sourceClosed) return;
        const size = getMessageSize(message);
        const nextBytes = queuedBytes + size;
        const nextItems = messageQueue.length + 1;
        if (nextBytes > UPLOAD_QUEUE_MAX_BYTES || nextItems > UPLOAD_QUEUE_MAX_ITEMS) {
            failStream(new Error(`WebSocket input queue overflow: ${nextBytes}B/${nextItems}`));
            closeDataStream(pipeServer);
            return;
        }
        queuedBytes = nextBytes;
        messageQueue.push({ message, size });
        drainQueue();
    };

    const stream = new ReadableStream({
        start(controller) {
            controllerRef = controller;
            pipeServer.addEventListener('message', (event) => {
                enqueueMessage(event.data);
            });
            pipeServer.addEventListener('close', () => {
                if (streamClosed) return;
                sourceClosed = true;
                drainQueue();
            });
            pipeServer.addEventListener('error', (err) => {
                log('pipeServer has error');
                failStream(err);
            });
            const { earlyData, error } = b64ToBuf(earlyDataHeader);
            if (error) {
                failStream(error);
            } else if (earlyData) {
                enqueueMessage(earlyData);
            }
        },
        pull(controller) {
            return drainQueue();
        },
        cancel(reason) {
            log(`ReadableStream was canceled, due to ${reason}`)
            if (streamClosed) return;
            streamClosed = true;
            messageQueue.length = 0;
            queuedBytes = 0;
            onClose?.(reason);
            closeDataStream(pipeServer);
        }
    });
    return stream;
}

function createRemoteSocketWrapper(log, onError) {
    return {
        value: null,
        writer: null,
        connectingPromise: null,
        retryPromise: null,
        retryBarrier: null,
        uploadQueue: [],
        uploadTimer: null,
        draining: false,
        activeBatchBytes: 0,
        activeBatchItems: 0,
        idleResolvers: [],
        queuedBytes: 0,
        generation: 0,
        closed: false,
        lastError: null,
        setSocket(socket) {
            if (this.closed) {
                try { socket.close(); } catch (error) { }
                throw new Error('remote socket wrapper is closed');
            }
            const oldSocket = this.value;
            if (this.writer) {
                try { this.writer.releaseLock(); } catch (error) { }
            }
            this.writer = null;
            this.value = socket;
            this.generation++;
            if (oldSocket && oldSocket !== socket) {
                try { oldSocket.close(); } catch (error) { }
            }
            return this.generation;
        },
        write(chunk) {
            const data = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk);
            if (data.byteLength === 0) return;
            const nextBytes = this.queuedBytes + data.byteLength;
            const nextItems = this.uploadQueue.length + this.activeBatchItems + 1;
            if (nextBytes > UPLOAD_QUEUE_MAX_BYTES || nextItems > UPLOAD_QUEUE_MAX_ITEMS) {
                const error = new Error(`upload queue overflow: ${nextBytes}B/${nextItems}`);
                this.close(error);
                throw error;
            }
            this.queuedBytes = nextBytes;
            this.uploadQueue.push(data);
            if (this.queuedBytes >= UPLOAD_BATCH_TARGET_BYTES) {
                if (this.uploadTimer) clearTimeout(this.uploadTimer);
                this.uploadTimer = null;
                this.drain();
            } else if (!this.uploadTimer && !this.draining) {
                this.uploadTimer = setTimeout(() => {
                    this.uploadTimer = null;
                    this.drain();
                }, 1);
            }
        },
        async drain() {
            if (this.draining || this.closed) return;
            this.draining = true;
            try {
                while (this.uploadQueue.length && !this.closed) {
                    if (this.connectingPromise) await this.connectingPromise;
                    if (this.closed || !this.value) throw new Error('remote socket is not available');
                    if (!this.writer) this.writer = this.value.writable.getWriter();

                    let batchBytes = 0;
                    let batchItems = 0;
                    while (batchItems < this.uploadQueue.length) {
                        const nextLength = this.uploadQueue[batchItems].byteLength;
                        if (batchItems > 0 && batchBytes + nextLength > UPLOAD_BATCH_TARGET_BYTES) break;
                        batchBytes += nextLength;
                        batchItems++;
                        if (batchBytes >= UPLOAD_BATCH_TARGET_BYTES) break;
                    }

                    let batch;
                    if (batchItems === 1) {
                        batch = this.uploadQueue.shift();
                    } else {
                        batch = new Uint8Array(batchBytes);
                        let offset = 0;
                        for (let index = 0; index < batchItems; index++) {
                            const item = this.uploadQueue.shift();
                            batch.set(item, offset);
                            offset += item.byteLength;
                        }
                    }
                    this.activeBatchBytes = batchBytes;
                    this.activeBatchItems = batchItems;
                    await this.writer.write(batch);
                    this.queuedBytes = Math.max(0, this.queuedBytes - batchBytes);
                    this.activeBatchBytes = 0;
                    this.activeBatchItems = 0;
                }
            } catch (error) {
                this.close(error);
            } finally {
                this.draining = false;
                if (this.uploadQueue.length && !this.closed) this.drain();
                else this.resolveIdle();
            }
        },
        resolveIdle() {
            if (this.uploadQueue.length || this.draining || this.activeBatchItems) return;
            const resolvers = this.idleResolvers;
            this.idleResolvers = [];
            for (const resolve of resolvers) resolve();
        },
        async waitForIdle() {
            if (this.uploadQueue.length || this.draining || this.activeBatchItems) {
                await new Promise(resolve => this.idleResolvers.push(resolve));
            }
            if (this.lastError) throw this.lastError;
        },
        async writeAndWait(chunk) {
            this.write(chunk);
            await this.waitForIdle();
        },
        async closeGracefully() {
            if (this.closed) return;
            if (this.uploadTimer) clearTimeout(this.uploadTimer);
            this.uploadTimer = null;
            this.drain();
            let timeoutId;
            try {
                await Promise.race([
                    this.waitForIdle(),
                    new Promise(resolve => {
                        timeoutId = setTimeout(resolve, UPLOAD_DRAIN_TIMEOUT_MS);
                    })
                ]);
            } finally {
                if (timeoutId) clearTimeout(timeoutId);
                this.close();
            }
        },
        async writeInitial(chunk) {
            const data = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk);
            if (this.closed || !this.value) throw new Error('remote socket is not available');
            if (!this.writer) this.writer = this.value.writable.getWriter();
            if (data.byteLength > 0) await this.writer.write(data);
        },
        startReconnect() {
            if (this.retryBarrier || this.closed) return;
            let resolveBarrier;
            const barrier = new Promise(resolve => {
                resolveBarrier = resolve;
            });
            this.retryBarrier = { promise: barrier, resolve: resolveBarrier };
            this.connectingPromise = barrier;
        },
        finishReconnect() {
            if (!this.retryBarrier) return;
            const barrier = this.retryBarrier;
            this.retryBarrier = null;
            if (this.connectingPromise === barrier.promise) this.connectingPromise = null;
            barrier.resolve();
        },
        close(reason) {
            if (this.closed) return;
            this.closed = true;
            this.generation++;
            if (reason) {
                this.lastError ||= reason instanceof Error ? reason : new Error(String(reason));
                log(`[remoteSocketWrapper]--> close: ${reason.message || reason}`);
                try { onError?.(reason); } catch (error) { }
            }
            if (this.uploadTimer) clearTimeout(this.uploadTimer);
            this.uploadTimer = null;
            this.uploadQueue = [];
            this.queuedBytes = 0;
            this.activeBatchBytes = 0;
            this.activeBatchItems = 0;
            if (this.writer) {
                try { this.writer.releaseLock(); } catch (error) { }
            }
            this.writer = null;
            if (this.value) {
                try { this.value.close(); } catch (error) { }
            }
            this.value = null;
            this.connectingPromise = null;
            this.retryPromise = null;
            if (this.retryBarrier) this.retryBarrier.resolve();
            this.retryBarrier = null;
            this.resolveIdle();
        }
    };
}

async function waitSocketOpened(socket, timeoutMs = TCP_CONNECT_TIMEOUT_MS) {
    if (!socket.opened) return socket;
    let timeoutId;
    try {
        await Promise.race([
            socket.opened,
            new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => reject(new Error(`TCP connection timeout after ${timeoutMs}ms`)), timeoutMs);
            })
        ]);
        return socket;
    } catch (error) {
        try { socket.close(); } catch (closeError) { }
        throw error;
    } finally {
        if (timeoutId) clearTimeout(timeoutId);
    }
}

async function connectTcpSocket(address, port, concurrency = TCP_DIRECT_CONCURRENCY, timeoutMs = TCP_CONNECT_TIMEOUT_MS, log) {
    const attemptCount = Math.max(1, Math.floor(Number(concurrency) || 1));
    const attempts = Array.from({ length: attemptCount }, async () => {
        const socket = connect({ hostname: address, port: port }, { allowHalfOpen: true });
        await waitSocketOpened(socket, timeoutMs);
        return socket;
    });
    let winner;
    try {
        winner = await Promise.any(attempts);
        return winner;
    } catch (error) {
        const errors = Array.isArray(error?.errors) ? error.errors : [error];
        const details = errors.map((item, index) => `#${index + 1} ${item?.message || item}`).join('; ');
        log?.(`[connectTcpSocket]--> all ${attemptCount} attempts failed for ${address}:${port}: ${details}`);
        throw new Error(`TCP connection failed for ${address}:${port}: ${details}`);
    } finally {
        if (winner) {
            for (const attempt of attempts) {
                attempt.then((socket) => {
                    if (socket !== winner) {
                        try { socket.close(); } catch (error) { }
                    }
                }).catch(() => { });
            }
        }
    }
}

async function handleTPOut(remoteS, addressRemote, portRemote, rawClientData, pipe, channelResponseHeader, log, addressType, config) {

    async function connectAndWrite(address, port, socks = false, concurrency = config.tcpDirectConcurrency) {
        const connectTask = socks
            ? serviceCall(addressType, address, port, config)
            : connectTcpSocket(address, port, concurrency, config.tcpConnectTimeout, log);
        if (!remoteS.retryBarrier) remoteS.connectingPromise = connectTask;
        let tcpS;
        try {
            tcpS = await connectTask;
            if (!tcpS) throw new Error('TCP connection failed');
            remoteS.setSocket(tcpS);
            tcpS.closed.catch((error) => {
                log(`[connectAndWrite]--> tcp closed error: ${error.message || error}`);
            });
            log(`[connectAndWrite]--> s5:${socks} connected to ${address}:${port}`);
            await remoteS.writeInitial(rawClientData);
            remoteS.finishReconnect();
        } finally {
            if (remoteS.connectingPromise === connectTask) remoteS.connectingPromise = null;
        }
        return tcpS;
    }

    async function retry() {
        const finalHost = config.paddr || addressRemote;
        const finalPort = config.pnum || portRemote;
        const tcpS = config.s5Enable ? await connectAndWrite(finalHost, finalPort, true) : await connectAndWrite(finalHost, finalPort, false, config.tcpProxyConcurrency);
        log(`[retry]--> s5:${config.s5Enable} connected to ${finalHost}:${finalPort}`);
        await transferDataStream(tcpS, pipe, channelResponseHeader, null, log, remoteS, remoteS.generation, true);
    }

    async function nat64() {
        const finalHost = await resolveDomainToRouteX(addressRemote, config);
        const finalPort = portRemote;
        const tcpS = config.s5Enable ? await connectAndWrite(finalHost, finalPort, true) : await connectAndWrite(finalHost, finalPort, false, config.tcpDirectConcurrency);
        log(`[nat64]--> s5:${config.s5Enable} connected to ${finalHost}:${finalPort}`);
        await transferDataStream(tcpS, pipe, channelResponseHeader, null, log, remoteS, remoteS.generation, true);
    }

    async function finalStep() {
        if (remoteS.retryPromise) return remoteS.retryPromise;
        remoteS.startReconnect();
        const retryTask = (async () => {
            let ok;
            if (config.p64) {
                log('[finalStep] p64=true → try nat64() first, then retry() if nat64 fails');
                ok = await tryOnce(nat64, 'nat64');
                if (!ok) ok = await tryOnce(retry, 'retry');
            } else {
                log('[finalStep] p64=false → try retry() first, then nat64() if retry fails');
                ok = await tryOnce(retry, 'retry');
                if (!ok) ok = await tryOnce(nat64, 'nat64');
            }
            if (!ok) throw new Error('all retry connections failed');
        })();
        remoteS.retryPromise = retryTask;
        try {
            await retryTask;
        } finally {
            remoteS.finishReconnect();
            if (remoteS.retryPromise === retryTask) remoteS.retryPromise = null;
        }
    }

    async function tryOnce(fn, tag) {
        try {
            const ok = await fn();
            log(`[tryOnce] ${tag} finished normally`);
            return true;
        } catch (err) {
            log(`[tryOnce] ${tag} failed:`, err);
            return false;
        }
    }

    const { finalHost, finalPort } = await getDomainToRouteX(addressRemote, portRemote, false, config);
    const isDirectTarget = finalHost === addressRemote && Number(finalPort) === Number(portRemote);
    const concurrency = isDirectTarget ? config.tcpDirectConcurrency : config.tcpProxyConcurrency;
    const tcpS = await connectAndWrite(finalHost, finalPort, config.s5Enable ? true : false, concurrency);
    const generation = remoteS.generation;
    transferDataStream(tcpS, pipe, channelResponseHeader, finalStep, log, remoteS, generation).catch((error) => {
        log(`[transferDataStream]--> unhandled error: ${error.message || error}`);
        remoteS.close(error);
        closeDataStream(pipe);
    });
}

function createDownlinkSender(pipe, channelResponseHeader, isActive) {
    let responseHeader = channelResponseHeader;
    let buffer = new Uint8Array(DOWNLOAD_CHUNK_MAX_BYTES);
    let bufferLength = 0;
    let flushTimer = null;
    let sendChain = Promise.resolve();
    let sendError = null;

    const sendRaw = (chunk) => {
        if (sendError) throw sendError;
        if (!isActive() || pipe.readyState !== WS_READY_STATE_OPEN) {
            throw new Error('pipe.readyState is not open');
        }
        if (responseHeader) {
            const response = new Uint8Array(responseHeader.byteLength + chunk.byteLength);
            response.set(responseHeader, 0);
            response.set(chunk, responseHeader.byteLength);
            responseHeader = null;
            pipe.send(response);
        } else {
            pipe.send(chunk);
        }
    };

    const queueSend = (chunk) => {
        const sendTask = sendChain.then(() => sendRaw(chunk)).catch((error) => {
            sendError ||= error;
            throw error;
        });
        sendChain = sendTask.catch(() => { });
        return sendTask;
    };

    const flush = async () => {
        if (flushTimer) clearTimeout(flushTimer);
        flushTimer = null;
        if (bufferLength === 0) return sendChain;
        const chunk = buffer.slice(0, bufferLength);
        bufferLength = 0;
        return queueSend(chunk);
    };

    const scheduleFlush = () => {
        if (flushTimer || bufferLength === 0) return;
        flushTimer = setTimeout(() => {
            flushTimer = null;
            flush().catch(() => closeDataStream(pipe));
        }, DOWNLOAD_BUFFER_DELAY_MS);
    };

    return {
        async send(data) {
            if (sendError) throw sendError;
            const chunk = data instanceof Uint8Array ? data : new Uint8Array(data);
            let offset = 0;
            while (offset < chunk.byteLength) {
                const remaining = chunk.byteLength - offset;
                if (bufferLength === 0 && remaining >= DOWNLOAD_CHUNK_MAX_BYTES) {
                    const end = offset + DOWNLOAD_CHUNK_MAX_BYTES;
                    await queueSend(chunk.subarray(offset, end));
                    offset = end;
                    continue;
                }
                const copyLength = Math.min(DOWNLOAD_CHUNK_MAX_BYTES - bufferLength, remaining);
                buffer.set(chunk.subarray(offset, offset + copyLength), bufferLength);
                bufferLength += copyLength;
                offset += copyLength;
                if (bufferLength === DOWNLOAD_CHUNK_MAX_BYTES) await flush();
            }
            scheduleFlush();
        },
        async stopAndFlush() {
            if (flushTimer) clearTimeout(flushTimer);
            flushTimer = null;
            await flush();
            await sendChain;
            if (sendError) throw sendError;
        }
    };
}

async function transferDataStream(remoteS, pipe, channelResponseHeader, retry, log, remoteSocketWrapper, generation, throwOnNoData = false) {
    let hasIncomingData = false;
    let reader;
    let useBYOB = false;
    let readError = null;
    const isCurrentSocket = () => !remoteSocketWrapper || remoteSocketWrapper.generation === generation;
    const downlinkSender = createDownlinkSender(pipe, channelResponseHeader, isCurrentSocket);

    try {
        try {
            reader = remoteS.readable.getReader({ mode: 'byob' });
            useBYOB = true;
        } catch (error) {
            reader = remoteS.readable.getReader();
        }

        if (useBYOB) {
            let readBuffer = new ArrayBuffer(64 * 1024);
            while (true) {
                const { done, value } = await reader.read(new Uint8Array(readBuffer));
                if (!isCurrentSocket()) return;
                if (done) break;
                if (!value || value.byteLength === 0) {
                    readBuffer = new ArrayBuffer(64 * 1024);
                    continue;
                }
                hasIncomingData = true;
                await downlinkSender.send(value);
                readBuffer = value.buffer.byteLength >= 64 * 1024 ? value.buffer : new ArrayBuffer(64 * 1024);
            }
        } else {
            while (true) {
                const { done, value } = await reader.read();
                if (!isCurrentSocket()) return;
                if (done) break;
                if (!value || value.byteLength === 0) continue;
                hasIncomingData = true;
                await downlinkSender.send(value);
            }
        }
        if (isCurrentSocket()) await downlinkSender.stopAndFlush();
        log(`[transferDataStream]--> remote readable is close with hasIncomingData is ${hasIncomingData}`);
    } catch (error) {
        readError = error;
    } finally {
        if (isCurrentSocket() && pipe.readyState === WS_READY_STATE_OPEN) {
            try { await downlinkSender.stopAndFlush(); } catch (error) { readError ||= error; }
        }
        try { await reader?.cancel(); } catch (error) { }
        try { reader?.releaseLock(); } catch (error) { }
        if (isCurrentSocket()) {
            try { remoteS.close(); } catch (error) { }
        }
    }

    if (!isCurrentSocket()) return;
    if (hasIncomingData === false && typeof retry === 'function' && pipe.readyState === WS_READY_STATE_OPEN) {
        log(`[transferDataStream]--> no data, invoke finalStep flow`);
        await retry();
        return;
    }
    if (hasIncomingData === false && throwOnNoData) {
        remoteSocketWrapper?.startReconnect();
        throw readError || new Error('remote connection closed without incoming data');
    }
    if (readError) log(`[transferDataStream]--> read error: ${readError.message || readError}`);
    remoteSocketWrapper?.close(readError);
    closeDataStream(pipe);
}

async function handleUPOut(pipe, channelResponseHeader, config, protocolType = 'vless') {
    let ischannelHeaderSent = false;
    let pendingData = new Uint8Array(0);
    let closed = false;
    let closePromise = null;
    const isTrojan = protocolType === xorDe(dataTypeTr, 'datatype');
    const activeRequests = new Set();
    const transformStream = new TransformStream({
        start(controller) {

        },
        transform(chunk, controller) {
            const data = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk);
            if (data.byteLength > 0) {
                const merged = new Uint8Array(pendingData.byteLength + data.byteLength);
                merged.set(pendingData, 0);
                merged.set(data, pendingData.byteLength);
                pendingData = merged;
            }

            let index = 0;
            while (index < pendingData.byteLength) {
                if (isTrojan) {
                    if (pendingData.byteLength - index < 1) break;
                    const addressType = pendingData[index];
                    let addressLength = 0;
                    let addressIndex = index + 1;
                    if (addressType === 1) {
                        addressLength = 4;
                    } else if (addressType === 4) {
                        addressLength = 16;
                    } else if (addressType === 3) {
                        if (pendingData.byteLength < addressIndex + 1) break;
                        addressLength = 1 + pendingData[addressIndex];
                    } else {
                        throw new Error(`invalid trojan UDP addressType: ${addressType}`);
                    }

                    const portIndex = addressIndex + addressLength;
                    if (pendingData.byteLength < portIndex + 6) break;
                    const port = (pendingData[portIndex] << 8) | pendingData[portIndex + 1];
                    const udpPacketLength = (pendingData[portIndex + 2] << 8) | pendingData[portIndex + 3];
                    if (pendingData[portIndex + 4] !== 0x0d || pendingData[portIndex + 5] !== 0x0a) {
                        throw new Error('invalid trojan UDP delimiter');
                    }
                    const payloadIndex = portIndex + 6;
                    if (pendingData.byteLength < payloadIndex + udpPacketLength) break;
                    if (port !== 53) throw new Error('Trojan UDP proxy only enabled for DNS which is port 53');
                    if (udpPacketLength === 0) throw new Error('invalid empty UDP packet');
                    controller.enqueue({
                        payload: pendingData.slice(payloadIndex, payloadIndex + udpPacketLength),
                        responseHeader: pendingData.slice(index, portIndex + 2),
                    });
                    index = payloadIndex + udpPacketLength;
                    continue;
                }

                if (pendingData.byteLength - index < 2) break;
                const udpPacketLength = (pendingData[index] << 8) | pendingData[index + 1];
                if (udpPacketLength === 0) throw new Error('invalid empty UDP packet');
                if (pendingData.byteLength - index < udpPacketLength + 2) break;
                controller.enqueue({ payload: pendingData.slice(index + 2, index + 2 + udpPacketLength) });
                index += udpPacketLength + 2;
            }
            pendingData = index > 0 ? pendingData.slice(index) : pendingData;
        },
        flush(controller) {
            if (pendingData.byteLength > 0) throw new Error(`incomplete UDP packet: ${pendingData.byteLength} bytes`);
        }
    });

    const processingPromise = transformStream.readable.pipeTo(new WritableStream({
        async write(packet) {
            if (closed) throw new Error('DNS stream is closed');
            const { payload, responseHeader } = packet;
            const abortController = new AbortController();
            activeRequests.add(abortController);
            const timeoutId = setTimeout(() => abortController.abort(new Error('DoH request timeout')), 10000);
            try {
                const resp = await fetch(config.durl, // dns server url
                    {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/dns-message',
                            'accept': 'application/dns-message',
                        },
                        body: payload,
                        signal: abortController.signal,
                    });
                if (!resp.ok) {
                    try { await resp.body?.cancel(); } catch (error) { }
                    throw new Error(`DoH request failed with status ${resp.status}`);
                }
                const dnsQueryResult = await resp.arrayBuffer();
                const udpSize = dnsQueryResult.byteLength;
                if (udpSize === 0 || udpSize > 65535) throw new Error(`invalid DoH response length: ${udpSize}`);
                const udpSizeBuffer = new Uint8Array([(udpSize >> 8) & 0xff, udpSize & 0xff]);
                if (!closed && pipe.readyState === WS_READY_STATE_OPEN) {
                    log(`doh success and dns message length is ${udpSize}`);
                    let response;
                    if (isTrojan) {
                        response = new Uint8Array(responseHeader.byteLength + 4 + dnsQueryResult.byteLength);
                        response.set(responseHeader, 0);
                        response[responseHeader.byteLength] = (udpSize >> 8) & 0xff;
                        response[responseHeader.byteLength + 1] = udpSize & 0xff;
                        response[responseHeader.byteLength + 2] = 0x0d;
                        response[responseHeader.byteLength + 3] = 0x0a;
                        response.set(new Uint8Array(dnsQueryResult), responseHeader.byteLength + 4);
                    } else if (ischannelHeaderSent) {
                        response = new Uint8Array(udpSizeBuffer.byteLength + dnsQueryResult.byteLength);
                        response.set(udpSizeBuffer, 0);
                        response.set(new Uint8Array(dnsQueryResult), udpSizeBuffer.byteLength);
                    } else {
                        response = new Uint8Array(channelResponseHeader.byteLength + udpSizeBuffer.byteLength + dnsQueryResult.byteLength);
                        response.set(channelResponseHeader, 0);
                        response.set(udpSizeBuffer, channelResponseHeader.byteLength);
                        response.set(new Uint8Array(dnsQueryResult), channelResponseHeader.byteLength + udpSizeBuffer.byteLength);
                        ischannelHeaderSent = true;
                    }
                    pipe.send(response);
                }
            } finally {
                clearTimeout(timeoutId);
                activeRequests.delete(abortController);
            }
        }
    })).catch((err) => {
        error('dns udp has error' + err);
        closeDataStream(pipe);
    });

    const writer = transformStream.writable.getWriter();

    return {
        /**
         *
         * @param {Uint8Array} chunk
         */
        write(chunk) {
            if (closed) return Promise.reject(new Error('DNS stream is closed'));
            return writer.write(chunk);
        },
        close(reason) {
            if (closePromise) return closePromise;
            closed = true;
            const closeError = reason instanceof Error ? reason : new Error(String(reason || 'DNS stream closed'));
            for (const abortController of activeRequests) abortController.abort(closeError);
            activeRequests.clear();
            closePromise = (async () => {
                try { await writer.close(); } catch (error) { }
                try { writer.releaseLock(); } catch (error) { }
                try { await processingPromise; } catch (error) { }
            })();
            return closePromise;
        }
    };
}

async function serviceCall(ipType, remoteIp, remotePort, config) {
    const { username, password, hostname, port } = config.parsedS5;
    const socket = connect({ hostname, port }, { allowHalfOpen: true });
    await waitSocketOpened(socket, config.tcpConnectTimeout);
    const writer = socket.writable.getWriter();
    const reader = socket.readable.getReader();
    const encoder = new TextEncoder();
    let readBuffer = new Uint8Array(0);

    const readBytes = async (length) => {
        while (readBuffer.byteLength < length) {
            const { done, value } = await reader.read();
            if (done || !value) throw new Error("SOCKS5 connection closed during handshake");
            const chunk = value instanceof Uint8Array ? value : new Uint8Array(value);
            const merged = new Uint8Array(readBuffer.byteLength + chunk.byteLength);
            merged.set(readBuffer, 0);
            merged.set(chunk, readBuffer.byteLength);
            readBuffer = merged;
        }
        const result = readBuffer.slice(0, length);
        readBuffer = readBuffer.slice(length);
        return result;
    };

    const readSocksResponse = async () => {
        const responseHeader = await readBytes(4);
        if (responseHeader[0] !== 0x05) throw new Error("Invalid SOCKS5 response version");
        if (responseHeader[1] !== 0x00) throw new Error(`SOCKS5 connection failed: ${responseHeader[1]}`);
        if (responseHeader[2] !== 0x00) throw new Error("Invalid SOCKS5 reserved byte");
        switch (responseHeader[3]) {
            case 0x01:
                await readBytes(4 + 2);
                break;
            case 0x03: {
                const domainLength = (await readBytes(1))[0];
                await readBytes(domainLength + 2);
                break;
            }
            case 0x04:
                await readBytes(16 + 2);
                break;
            default:
                throw new Error(`Invalid SOCKS5 response address type: ${responseHeader[3]}`);
        }
    };

    const sendSocksGreeting = async () => {
        const greeting = username && password
            ? new Uint8Array([5, 2, 0, 2])
            : new Uint8Array([5, 1, 0]);
        await writer.write(greeting);
    };

    const handleAuthResponse = async () => {
        const res = await readBytes(2);
        if (res[0] !== 0x05) throw new Error("Invalid SOCKS5 authentication version");
        if (res[1] === 0xff) throw new Error("SOCKS5 has no acceptable authentication method");
        if (res[1] === 0x02) {
            if (!username || !password) {
                throw new Error("Authentication required");
            }
            const usernameBytes = encoder.encode(username);
            const passwordBytes = encoder.encode(password);
            if (usernameBytes.byteLength > 255 || passwordBytes.byteLength > 255) {
                throw new Error("SOCKS5 username or password is too long");
            }
            const authRequest = new Uint8Array([
                1, usernameBytes.byteLength, ...usernameBytes,
                passwordBytes.byteLength, ...passwordBytes
            ]);
            await writer.write(authRequest);
            const authResponse = await readBytes(2);
            if (authResponse[0] !== 0x01 || authResponse[1] !== 0x00) {
                throw new Error("Authentication failed");
            }
        } else if (res[1] !== 0x00) throw new Error(`Unsupported SOCKS5 authentication method: ${res[1]}`);
    };

    const sendSocksRequest = async () => {
        let DSTADDR;
        const addressType = getSocksAddressType(remoteIp, ipType);
        switch (addressType) {
            case 1:
                DSTADDR = new Uint8Array([1, ...parseIPv4Address(remoteIp)]);
                break;
            case 2: {
                const domainBytes = encoder.encode(remoteIp);
                if (domainBytes.byteLength === 0 || domainBytes.byteLength > 255) {
                    throw new Error("Invalid SOCKS5 domain length");
                }
                DSTADDR = new Uint8Array([3, domainBytes.byteLength, ...domainBytes]);
                break;
            }
            case 3:
                DSTADDR = new Uint8Array([4, ...parseIPv6Address(remoteIp)]);
                break;
            default:
                throw new Error("Invalid address type");
        }
        const socksRequest = new Uint8Array([5, 1, 0, ...DSTADDR, remotePort >> 8, remotePort & 0xff]);
        await writer.write(socksRequest);
        await readSocksResponse();
    };

    try {
        await sendSocksGreeting();
        await handleAuthResponse();
        await sendSocksRequest();
    } catch (err) {
        try { socket.close(); } catch (error) { }
        throw err;
    } finally {
        try { writer.releaseLock(); } catch (error) { }
        try { reader.releaseLock(); } catch (error) { }
    }
    return socket;
}

function getSocksAddressType(address, fallbackType) {
    const value = String(address || '').replace(/^\[|\]$/g, '');
    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(value)) return 1;
    if (value.includes(':')) return 3;
    if (value) return 2;
    return fallbackType;
}

function parseIPv4Address(address) {
    const parts = String(address).split('.').map(Number);
    if (parts.length !== 4 || parts.some(part => !Number.isInteger(part) || part < 0 || part > 255)) {
        throw new Error("Invalid IPv4 address");
    }
    return parts;
}

function parseIPv6Address(address) {
    let value = String(address || '').replace(/^\[|\]$/g, '').toLowerCase();
    const doubleColonIndex = value.indexOf('::');
    if (doubleColonIndex !== -1 && value.indexOf('::', doubleColonIndex + 1) !== -1) {
        throw new Error("Invalid IPv6 address");
    }

    const convertIPv4Tail = (groups) => {
        if (!groups.length || !groups[groups.length - 1].includes('.')) return groups;
        const ipv4 = parseIPv4Address(groups.pop());
        groups.push(((ipv4[0] << 8) | ipv4[1]).toString(16));
        groups.push(((ipv4[2] << 8) | ipv4[3]).toString(16));
        return groups;
    };

    let left = [];
    let right = [];
    if (doubleColonIndex === -1) {
        left = convertIPv4Tail(value.split(':'));
        if (left.length !== 8) throw new Error("Invalid IPv6 address");
    } else {
        left = convertIPv4Tail(value.slice(0, doubleColonIndex).split(':').filter(Boolean));
        right = convertIPv4Tail(value.slice(doubleColonIndex + 2).split(':').filter(Boolean));
        const missingGroups = 8 - left.length - right.length;
        if (missingGroups < 1) throw new Error("Invalid IPv6 address");
        left = [...left, ...new Array(missingGroups).fill('0'), ...right];
    }

    const result = new Uint8Array(16);
    left.forEach((group, index) => {
        if (!/^[0-9a-f]{1,4}$/.test(group)) throw new Error("Invalid IPv6 address");
        const value = parseInt(group, 16);
        result[index * 2] = value >> 8;
        result[index * 2 + 1] = value & 0xff;
    });
    return result;
}

function handleRequestHeader(channelBuffer, id) {
    const data = channelBuffer instanceof Uint8Array ? channelBuffer : new Uint8Array(channelBuffer);
    const length = data.byteLength;
    if (length < 24) {
        return {
            hasError: false,
            needMore: true,
        };
    }

    const version = data.slice(0, 1);
    let isValidUser = false;
    let isUDP = false;
    const slicedBuffer = data.slice(1, 17);
    const slicedBufferString = stringify(slicedBuffer);
    const userId = String(id || '');
    const uuids = userId.includes(',') ? userId.split(",") : [userId];

    isValidUser = uuids.some(userUuid => slicedBufferString === userUuid.trim()) || uuids.length === 1 && slicedBufferString === uuids[0].trim();
    if (!isValidUser) {
        return {
            hasError: true,
            message: 'invalid user',
        };
    }

    const optLength = data[17];
    const commandIndex = 18 + optLength;
    if (length < commandIndex + 4) {
        return {
            hasError: false,
            needMore: true,
        };
    }
    const command = data[commandIndex];

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
    const portIndex = commandIndex + 1;
    const portRemote = (data[portIndex] << 8) | data[portIndex + 1];

    let addressIndex = portIndex + 2;
    const addressType = data[addressIndex];
    let addressLength = 0;
    let addressValueIndex = addressIndex + 1;
    let addressValue = '';
    switch (addressType) {
        case 1:
            addressLength = 4;
            if (length < addressValueIndex + addressLength) {
                return { hasError: false, needMore: true };
            }
            addressValue = data.slice(addressValueIndex, addressValueIndex + addressLength).join('.');
            break;
        case 2:
            if (length < addressValueIndex + 1) {
                return { hasError: false, needMore: true };
            }
            addressLength = data[addressValueIndex];
            addressValueIndex += 1;
            if (addressLength === 0) {
                return { hasError: true, message: 'invalid domain data' };
            }
            if (length < addressValueIndex + addressLength) {
                return { hasError: false, needMore: true };
            }
            addressValue = new TextDecoder().decode(
                data.slice(addressValueIndex, addressValueIndex + addressLength)
            );
            break;
        case 3:
            addressLength = 16;
            if (length < addressValueIndex + addressLength) {
                return { hasError: false, needMore: true };
            }
            const dataView = new DataView(
                data.buffer,
                data.byteOffset + addressValueIndex,
                addressLength
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
        message: null,
        addressRemote: addressValue,
        portRemote,
        rawDataIndex: addressValueIndex + addressLength,
        channelVersion: version,
        isUDP,
        addressType,
    };
}

async function handleRequestHeaderTr(buffer, id) {
    const data = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    if (data.byteLength < 58) {
        return {
            hasError: false,
            needMore: true
        };
    }
    let crLfIndex = 56;
    if (data[56] !== 0x0d || data[57] !== 0x0a) {
        return {
            hasError: true,
            message: "invalid header format (missing CR LF)"
        };
    }
    const password = sha256.sha224(id);
    for (let i = 0; i < crLfIndex; i++) {
        if (data[i] !== password.charCodeAt(i)) {
            return {
                hasError: true,
                message: "invalid password"
            };
        }
    }

    const s5DataBuffer = data.slice(crLfIndex + 2);
    if (s5DataBuffer.byteLength < 2) {
        return {
            hasError: false,
            needMore: true
        };
    }

    const view = new DataView(s5DataBuffer.buffer, s5DataBuffer.byteOffset, s5DataBuffer.byteLength);
    const cmd = view.getUint8(0);
    if (cmd !== 1 && cmd !== 3) {
        return {
            hasError: true,
            message: "unsupported command, only TCP/UDP is allowed"
        };
    }
    const isUDP = cmd === 3;

    const addressType = view.getUint8(1);
    let addressLength = 0;
    let addressIndex = 2;
    let address = "";
    switch (addressType) {
        case 1:
            addressLength = 4;
            if (s5DataBuffer.byteLength < addressIndex + addressLength) {
                return { hasError: false, needMore: true };
            }
            address = s5DataBuffer.slice(addressIndex, addressIndex + addressLength).join(".");
            break;
        case 3:
            if (s5DataBuffer.byteLength < addressIndex + 1) {
                return { hasError: false, needMore: true };
            }
            addressLength = s5DataBuffer[addressIndex];
            addressIndex += 1;
            if (addressLength === 0) {
                return { hasError: true, message: "invalid domain data" };
            }
            if (s5DataBuffer.byteLength < addressIndex + addressLength) {
                return { hasError: false, needMore: true };
            }
            address = new TextDecoder().decode(
                s5DataBuffer.slice(addressIndex, addressIndex + addressLength)
            );
            break;
        case 4:
            addressLength = 16;
            if (s5DataBuffer.byteLength < addressIndex + addressLength) {
                return { hasError: false, needMore: true };
            }
            const dataView = new DataView(s5DataBuffer.buffer, s5DataBuffer.byteOffset + addressIndex, addressLength);
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
    if (s5DataBuffer.byteLength < portIndex + 4) {
        return { hasError: false, needMore: true };
    }
    const portRemote = (s5DataBuffer[portIndex] << 8) | s5DataBuffer[portIndex + 1];
    if (s5DataBuffer[portIndex + 2] !== 0x0d || s5DataBuffer[portIndex + 3] !== 0x0a) {
        return { hasError: true, message: "invalid S5 request data (missing CR LF)" };
    }
    return {
        hasError: false,
        message: null,
        addressRemote: address,
        portRemote,
        rawClientData: s5DataBuffer.slice(portIndex + 4),
        isUDP,
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
