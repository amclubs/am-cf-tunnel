/**
 * YouTube Channel: https://youtube.com/@AM_CLUB
 * GitHub Repository: https://github.com/amclubs
 * Telegram Group: https://t.me/AM_CLUBS
 * Personal Blog: https://am.809098.xyz
 */

// @ts-ignore
import { connect } from 'cloudflare:sockets';

// Generate your own UUID using the following command in PowerShell:
// Powershell -NoExit -Command "[guid]::NewGuid()"
let userID = '88deb2d4-96e2-448b-b9c6-6e2a5f26fc8f';

// Proxy IPs to choose from
let proxyIPs = [
	'proxyip.amclubs.camdvr.org',
	'proxyip.amclubs.kozow.com'
];
// Randomly select a proxy IP from the list
let proxyIP = proxyIPs[Math.floor(Math.random() * proxyIPs.length)];
let proxyPort = 443;
let proxyIpTxt = 'https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/proxyip.txt';

// Setting the socks5 will ignore proxyIP
// Example:  user:pass@host:port  or  host:port
let socks5 = '';
let socks5Enable = false;
let parsedSocks5 = {};

// https://cloudflare-dns.com/dns-query or https://dns.google/dns-query
// DNS-over-HTTPS URL
let dohURL = 'https://sky.rethinkdns.com/1:-Pf_____9_8A_AMAIgE8kMABVDDmKOHTAKg=';

// Preferred address API interface
let ipUrlTxt = [
	'https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/ipv4.txt',
	// 'https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/ipv6.txt'
];
let ipUrlCsv = [
	// 'https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/ipv4.csv'
];
// Preferred addresses with optional TLS subscription
let ipLocal = [
	'visa.cn:443#youtube.com/@AM_CLUB 订阅频道获取更多教程',
	'icook.hk#t.me/AM_CLUBS 加入交流群解锁更多优选节点',
	'time.is:443#github.com/amclubs GitHub仓库查看更多项目'
];
let noTLS = 'false';
let sl = 5;

let tagName = atob('YW1jbHVicw==');
let subUpdateTime = 6; // Subscription update time in hours
let timestamp = 4102329600000; // Timestamp for the end date (2099-12-31)
let total = 99 * 1125899906842624; // PB (perhaps referring to bandwidth or total entries)
let download = Math.floor(Math.random() * 1099511627776);
let upload = download;

// Network protocol type
let network = 'ws'; // WebSocket

// Fake UUID and hostname for configuration generation
let fakeUserID;
let fakeHostName;

// Subscription and conversion details
let subProtocol = 'https';
let subConverter = 'url.v1.mk'; // Subscription conversion backend using Sheep's function
let subConfig = "https://raw.githubusercontent.com/amclubs/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_MultiMode.ini"; // Subscription profile
let fileName = 'AM%E7%A7%91%E6%8A%80';
let isBase64 = true;

let botToken = '';
let chatID = '';

const httpPattern = /^http(s)?:\/\/.+/;

if (!isValidUUID(userID)) {
	throw new Error('uuid is invalid');
}

export default {
	/**
	 * @param {import("@cloudflare/workers-types").Request} request
	 * @param {{UUID: string, PROXYIP: string, DNS_RESOLVER_URL: string, NODE_ID: int, API_HOST: string, API_TOKEN: string}} env
	 * @param {import("@cloudflare/workers-types").ExecutionContext} ctx
	 * @returns {Promise<Response>}
	*/
	async fetch(request, env, ctx) {
		try {
			const {
				UUID,
				PROXYIP,
				SOCKS5,
				DNS_RESOLVER_URL,
				IP_LOCAL,
				IP_URL_TXT,
				IP_URL_CSV,
				NO_TLS,
				SL,
				SUB_CONFIG,
				SUB_CONVERTER,
				SUB_NAME,
				CF_EMAIL,
				CF_KEY,
				CF_ID = 0,
				TG_TOKEN,
				TG_ID,
				//兼容
				ADDRESSESAPI,
			} = env;

			userID = (UUID || userID).toLowerCase();
			if (PROXYIP) {
				if (httpPattern.test(PROXYIP)) {
					let proxyIpTxt = await addIpText(PROXYIP);
					let ipUrlTxtAndCsv;
					if (PROXYIP.endsWith('.csv')) {
						ipUrlTxtAndCsv = await getIpUrlTxtAndCsv(noTLS, null, proxyIpTxt);

					} else {
						ipUrlTxtAndCsv = await getIpUrlTxtAndCsv(noTLS, proxyIpTxt, null);
					}
					const uniqueIpTxt = [...new Set([...ipUrlTxtAndCsv.txt, ...ipUrlTxtAndCsv.csv])];
					proxyIP = uniqueIpTxt[Math.floor(Math.random() * uniqueIpTxt.length)];
				} else {
					proxyIPs = await addIpText(PROXYIP);
					proxyIP = proxyIPs[Math.floor(Math.random() * proxyIPs.length)];
				}
			} else {
				let proxyIpTxts = await addIpText(proxyIpTxt);
				let ipUrlTxtAndCsv = await getIpUrlTxtAndCsv(noTLS, proxyIpTxts, null);
				let updatedIps = ipUrlTxtAndCsv.txt.map(ip => `${tagName}${download}.${ip}`);
				const uniqueIpTxt = [...new Set([...updatedIps, ...proxyIPs])];
				proxyIP = uniqueIpTxt[Math.floor(Math.random() * uniqueIpTxt.length)];
			}
			const [ip, port] = proxyIP.split(':');
			proxyIP = ip;
			proxyPort = port || proxyPort;

			const url = new URL(request.url);
			socks5 = SOCKS5 || url.searchParams.get('socks5') || socks5;
			parsedSocks5 = await parseSocks5FromUrl(socks5, url);
			if (parsedSocks5) {
				socks5Enable = true;
			}

			dohURL = (DNS_RESOLVER_URL || dohURL);

			if (IP_LOCAL) {
				ipLocal = await addIpText(IP_LOCAL);
			}
			//兼容旧的，如果有IP_URL_TXT新的则不用旧的
			if (ADDRESSESAPI) {
				ipUrlTxt = await addIpText(ADDRESSESAPI);
			}
			if (IP_URL_TXT) {
				ipUrlTxt = await addIpText(IP_URL_TXT);
			}
			if (IP_URL_CSV) {
				ipUrlCsv = await addIpText(IP_URL_CSV);
			}

			noTLS = (NO_TLS || noTLS);
			sl = (SL || sl);
			subConfig = (SUB_CONFIG || subConfig);
			subConverter = (SUB_CONVERTER || subConverter);
			fileName = (SUB_NAME || fileName);
			botToken = (TG_TOKEN || botToken);
			chatID = (TG_ID || chatID);

			// Unified protocol for handling subconverters
			const [subProtocol, subConverterWithoutProtocol] = (subConverter.startsWith("http://") || subConverter.startsWith("https://"))
				? subConverter.split("://")
				: [undefined, subConverter];
			subConverter = subConverterWithoutProtocol;

			// console.log(`proxyIPs: ${proxyIPs} \n proxyIP: ${proxyIP} \n ipLocal: ${ipLocal} \n ipUrlTxt: ${ipUrlTxt} `);

			//const uuid = url.searchParams.get('uuid')?.toLowerCase() || 'null';
			const ua = request.headers.get('User-Agent') || 'null';
			const userAgent = ua.toLowerCase();
			const host = request.headers.get('Host');
			const upgradeHeader = request.headers.get('Upgrade');
			const expire = Math.floor(timestamp / 1000);

			// If WebSocket upgrade, handle WebSocket request
			if (upgradeHeader === 'websocket') {
				return await channelOverWSHandler(request);
			}

			fakeUserID = await getFakeUserID(userID);
			fakeHostName = fakeUserID.slice(6, 9) + "." + fakeUserID.slice(13, 19);
			console.log(`userID: ${userID}`);
			console.log(`fakeUserID: ${fakeUserID}`);
			// Handle routes based on the path
			switch (url.pathname.toLowerCase()) {
				case '/': {
					return new Response(await nginx(), {
						headers: {
							'Content-Type': 'text/html; charset=UTF-8',
							'referer': 'https://www.google.com/search?q=' + fileName,
						},
					});
				}

				case `/${fakeUserID}`: {
					// Disguise UUID node generation
					const fakeConfig = await getchannelConfig(userID, host, 'CF-FAKE-UA', url);
					return new Response(fakeConfig, { status: 200 });
				}

				case `/${userID}`: {
					// Handle real UUID requests and get node info
					await sendMessage(
						`#获取订阅 ${fileName}`,
						request.headers.get('CF-Connecting-IP'),
						`UA: ${userAgent}\n域名: ${url.hostname}\n入口: ${url.pathname + url.search}`
					);

					const channelConfig = await getchannelConfig(userID, host, userAgent, url);
					const isMozilla = userAgent.includes('mozilla');

					const config = await getCFConfig(CF_EMAIL, CF_KEY, CF_ID);
					if (CF_EMAIL && CF_KEY) {
						({ upload, download, total } = config);
					}

					// Prepare common headers
					const commonHeaders = {
						"Content-Type": isMozilla ? "text/html;charset=utf-8" : "text/plain;charset=utf-8",
						"Profile-Update-Interval": `${subUpdateTime}`,
						"Subscription-Userinfo": `upload=${upload}; download=${download}; total=${total}; expire=${expire}`,
					};

					// Add download headers if not a Mozilla browser
					if (!isMozilla) {
						commonHeaders["Content-Disposition"] = `attachment; filename=${fileName}; filename*=gbk''${fileName}`;
					}

					return new Response(channelConfig, {
						status: 200,
						headers: commonHeaders,
					});
				}

				default: {
					// Serve the default nginx disguise page
					return new Response(await nginx(), {
						headers: {
							'Content-Type': 'text/html; charset=UTF-8',
							'referer': 'https://www.google.com/search?q=' + fileName,
						},
					});
				}
			}
		} catch (err) {
			// Log error for debugging purposes
			console.error('Error processing request:', err);
			return new Response(`Error: ${err.message}`, { status: 500 });
		}
	},
};


/** ---------------------Tools------------------------------ */

export async function hashHex_f(string) {
	const encoder = new TextEncoder();
	const data = encoder.encode(string);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
	return hashHex;
}

/**
 * Checks if a given string is a valid UUID.
 * Note: This is not a real UUID validation.
 * @param {string} uuid The string to validate as a UUID.
 * @returns {boolean} True if the string is a valid UUID, false otherwise.
 */
function isValidUUID(uuid) {
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
	if (!isValidUUID(uuid)) {
		throw TypeError("Stringified UUID is invalid");
	}
	return uuid;
}

async function getFakeUserID(userID) {
	const date = new Date().toISOString().split('T')[0];
	const rawString = `${userID}-${date}`;

	const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(rawString));
	const hashArray = Array.from(new Uint8Array(hashBuffer)).map(b => ('00' + b.toString(16)).slice(-2)).join('');

	return `${hashArray.substring(0, 8)}-${hashArray.substring(8, 12)}-${hashArray.substring(12, 16)}-${hashArray.substring(16, 20)}-${hashArray.substring(20, 32)}`;
}

function revertFakeInfo(content, userID, hostName) {
	//console.log(`revertFakeInfo-->: isBase64 ${isBase64} \n content: ${content}`);
	if (isBase64) {
		content = atob(content);//Base64 decrypt
	}
	content = content.replace(new RegExp(fakeUserID, 'g'), userID).replace(new RegExp(fakeHostName, 'g'), hostName);
	if (isBase64) {
		content = btoa(content);//Base64 encryption
	}
	return content;
}

/**
 * Decodes a base64 string into an ArrayBuffer.
 * @param {string} base64Str The base64 string to decode.
 * @returns {{earlyData: ArrayBuffer|null, error: Error|null}} An object containing the decoded ArrayBuffer or null if there was an error, and any error that occurred during decoding or null if there was no error.
 */
function base64ToArrayBuffer(base64Str) {
	if (!base64Str) {
		return { earlyData: null, error: null };
	}
	try {
		// go use modified Base64 for URL rfc4648 which js atob not support
		base64Str = base64Str.replace(/-/g, '+').replace(/_/g, '/');
		const decode = atob(base64Str);
		const arryBuffer = Uint8Array.from(decode, (c) => c.charCodeAt(0));
		return { earlyData: arryBuffer.buffer, error: null };
	} catch (error) {
		return { earlyData: null, error };
	}
}

async function addIpText(envAdd) {
	var addText = envAdd.replace(/[	|"'\r\n]+/g, ',').replace(/,+/g, ',');
	//console.log(addText);
	if (addText.charAt(0) == ',') {
		addText = addText.slice(1);
	}
	if (addText.charAt(addText.length - 1) == ',') {
		addText = addText.slice(0, addText.length - 1);
	}
	const add = addText.split(',');
	// console.log(add);
	return add;
}

function socks5Parser(socks5) {
	let [latter, former] = socks5.split("@").reverse();
	let username, password, hostname, port;

	if (former) {
		const formers = former.split(":");
		if (formers.length !== 2) {
			throw new Error('Invalid SOCKS address format: authentication must be in the "username:password" format');
		}
		[username, password] = formers;
	}

	const latters = latter.split(":");
	port = Number(latters.pop());
	if (isNaN(port)) {
		throw new Error('Invalid SOCKS address format: port must be a number');
	}

	hostname = latters.join(":");
	const isIPv6 = hostname.includes(":") && !/^\[.*\]$/.test(hostname);
	if (isIPv6) {
		throw new Error('Invalid SOCKS address format: IPv6 addresses must be enclosed in brackets, e.g., [2001:db8::1]');
	}

	//console.log(`socks5Parser-->: username ${username} \n password: ${password} \n hostname: ${hostname} \n port: ${port}`);
	return { username, password, hostname, port };
}

async function parseSocks5FromUrl(socks5, url) {
	if (/\/socks5?=/.test(url.pathname)) {
		socks5 = url.pathname.split('5=')[1];
	} else if (/\/socks[5]?:\/\//.test(url.pathname)) {
		socks5 = url.pathname.split('://')[1].split('#')[0];
	}

	const authIdx = socks5.indexOf('@');
	if (authIdx !== -1) {
		let userPassword = socks5.substring(0, authIdx);
		const base64Regex = /^(?:[A-Z0-9+/]{4})*(?:[A-Z0-9+/]{2}==|[A-Z0-9+/]{3}=)?$/i;
		if (base64Regex.test(userPassword) && !userPassword.includes(':')) {
			userPassword = atob(userPassword);
		}
		socks5 = `${userPassword}@${socks5.substring(authIdx + 1)}`;
	}

	if (socks5) {
		try {
			return socks5Parser(socks5);
		} catch (err) {
			console.log(err.toString());
			return null;
		}
	}
	return null;
}


/** ---------------------Get data------------------------------ */

let subParams = ['sub', 'base64', 'b64', 'clash', 'singbox', 'sb'];
/**
 * @param {string} userID
 * @param {string | null} host
 * @param {string} userAgent
 * @param {string} _url
 * @returns {Promise<string>}
 */
async function getchannelConfig(userID, host, userAgent, _url) {
	// console.log(`------------getchannelConfig------------------`);
	// console.log(`userID: ${userID} \n host: ${host} \n userAgent: ${userAgent} \n _url: ${_url}`);

	userAgent = userAgent.toLowerCase();
	let port = 443;
	if (host.includes('.workers.dev')) {
		port = 80;
	}
	const [v2ray, clash] = getConfigLink(userID, host, host, port, host);

	if (userAgent.includes('mozilla') && !subParams.some(param => _url.searchParams.has(param))) {
		return getHtmlResponse(socks5Enable, userID, host, v2ray, clash);
	}

	// Get node information
	fakeHostName = getFakeHostName(host);
	const ipUrlTxtAndCsv = await getIpUrlTxtAndCsv(noTLS, ipUrlTxt, ipUrlCsv);

	// console.log(`txt: ${ipUrlTxtAndCsv.txt} \n csv: ${ipUrlTxtAndCsv.csv}`);
	let content = await getSubscribeNode(userAgent, _url, host, fakeHostName, fakeUserID, noTLS, ipUrlTxtAndCsv.txt, ipUrlTxtAndCsv.csv);

	return _url.pathname === `/${fakeUserID}` ? content : revertFakeInfo(content, userID, host);

}

function getHtmlResponse(socks5Enable, userID, host, v2ray, clash) {
	const subRemark = `IP_URL_TXT/IP_URL_CSV/IP_LOCAL`;
	let proxyIPRemark = `PROXYIP: ${proxyIP}`;

	if (socks5Enable) {
		proxyIPRemark = `socks5: ${parsedSocks5.hostname}:${parsedSocks5.port}`;
	}

	let remark = `您的订阅节点由设置变量 ${subRemark} 提供, 当前使用反代是${proxyIPRemark}`;

	if (!proxyIP && !socks5Enable) {
		remark = `您的订阅节点由设置变量 ${subRemark} 提供, 当前没设置反代, 推荐您设置PROXYIP变量或SOCKS5变量或订阅连接带proxyIP`;
	}

	return getConfigHtml(userID, host, remark, v2ray, clash);
}

function getFakeHostName(host) {
	if (host.includes(".pages.dev")) {
		return `${fakeHostName}.pages.dev`;
	} else if (host.includes(".workers.dev") || host.includes("notls") || noTLS === 'true') {
		return `${fakeHostName}.workers.dev`;
	}
	return `${fakeHostName}.xyz`;
}

async function getIpUrlTxtAndCsv(noTLS, urlTxts, urlCsvs) {
	if (noTLS === 'true') {
		return {
			txt: await getIpUrlTxt(urlTxts),
			csv: await getIpUrlCsv(urlCsvs, 'FALSE')
		};
	}
	return {
		txt: await getIpUrlTxt(urlTxts),
		csv: await getIpUrlCsv(urlCsvs, 'TRUE')
	};
}

async function getIpUrlTxt(urlTxts) {
	if (!urlTxts || urlTxts.length === 0) {
		return [];
	}

	let ipTxt = "";

	// Create an AbortController object to control the cancellation of fetch requests
	const controller = new AbortController();

	// Set a timeout to trigger the cancellation of all requests after 2 seconds
	const timeout = setTimeout(() => {
		controller.abort(); // Cancel all requests
	}, 2000);

	try {
		// Use Promise.allSettled to wait for all API requests to complete, regardless of success or failure
		// Iterate over the api array and send a fetch request to each API URL
		const responses = await Promise.allSettled(urlTxts.map(apiUrl => fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;',
				'User-Agent': 'amclubs/am-cf-tunnel'
			},
			signal: controller.signal // Attach the AbortController's signal to the fetch request to allow cancellation when needed
		}).then(response => response.ok ? response.text() : Promise.reject())));

		// Iterate through all the responses
		for (const response of responses) {
			// Check if the request was fulfilled successfully
			if (response.status === 'fulfilled') {
				// Get the response content
				const content = await response.value;
				ipTxt += content + '\n';
			}
		}
	} catch (error) {
		console.error(error);
	} finally {
		// Clear the timeout regardless of success or failure
		clearTimeout(timeout);
	}

	// Process the result using addIpText function
	const newIpTxt = await addIpText(ipTxt);
	// console.log(`ipUrlTxts: ${ipUrlTxts} \n ipTxt: ${ipTxt} \n newIpTxt: ${newIpTxt} `);

	// Return the processed result
	return newIpTxt;
}

async function getIpUrlCsv(urlCsvs, tls) {
	// Check if the CSV URLs are valid
	if (!urlCsvs || urlCsvs.length === 0) {
		return [];
	}

	const newAddressesCsv = [];

	// Fetch and process all CSVs concurrently
	const fetchCsvPromises = urlCsvs.map(async (csvUrl) => {
		try {
			const response = await fetch(csvUrl);

			// Ensure the response is successful
			if (!response.ok) {
				console.error('Error fetching CSV:', response.status, response.statusText);
				return;
			}

			// Parse the CSV content and split it into lines
			const text = await response.text();
			const lines = text.includes('\r\n') ? text.split('\r\n') : text.split('\n');

			// Ensure we have a non-empty CSV
			if (lines.length < 2) {
				console.error('CSV file is empty or has no data rows');
				return;
			}

			// Extract the header and get required field indexes
			const header = lines[0].trim().split(',');
			const tlsIndex = header.indexOf('TLS');
			const ipAddressIndex = 0; // Assuming the first column is IP address
			const portIndex = 1; // Assuming the second column is port
			const dataCenterIndex = tlsIndex + 1; // Data center assumed to be right after TLS
			const speedIndex = header.length - 1; // Last column for speed

			// If the required fields are missing, skip this CSV
			if (tlsIndex === -1) {
				console.error('CSV file missing required TLS field');
				return;
			}

			// Process the data rows
			for (let i = 1; i < lines.length; i++) {
				const columns = lines[i].trim().split(',');

				// Skip empty or malformed rows
				if (columns.length < header.length) {
					continue;
				}

				// Check if TLS matches and speed is greater than sl
				const tlsValue = columns[tlsIndex].toUpperCase();
				const speedValue = parseFloat(columns[speedIndex]);

				if (tlsValue === tls && speedValue > sl) {
					const ipAddress = columns[ipAddressIndex];
					const port = columns[portIndex];
					const dataCenter = columns[dataCenterIndex];
					newAddressesCsv.push(`${ipAddress}:${port}#${dataCenter}`);
				}
			}
		} catch (error) {
			console.error('Error processing CSV URL:', csvUrl, error);
		}
	});

	// Wait for all CSVs to be processed
	await Promise.all(fetchCsvPromises);

	return newAddressesCsv;
}

const protocolTypeBase64 = 'dmxlc3M=';
/**
 * Get node configuration information
 * @param {*} uuid 
 * @param {*} host 
 * @param {*} address 
 * @param {*} port 
 * @param {*} remarks 
 * @returns 
 */
function getConfigLink(uuid, host, address, port, remarks) {
	const protocolType = atob(protocolTypeBase64);

	const encryption = 'none';
	let path = '/?ed=2560';
	const fingerprint = 'randomized';
	let tls = ['tls', true];
	if (host.includes('.workers.dev') || host.includes('pages.dev')) {
		path = `/${host}${path}`;
		remarks += ' 请通过绑定自定义域名订阅！';
	}

	const v2ray = getV2rayLink({ protocolType, host, uuid, address, port, remarks, encryption, path, fingerprint, tls });
	const clash = getClashLink(protocolType, host, address, port, uuid, path, tls, fingerprint);

	return [v2ray, clash];
}

/**
 * Get channel information
 * @param {*} param0 
 * @returns 
 */
function getV2rayLink({ protocolType, host, uuid, address, port, remarks, encryption, path, fingerprint, tls }) {
	let sniAndFp = `&sni=${host}&fp=${fingerprint}`;
	if (portSet_http.has(parseInt(port))) {
		tls = ['', false];
		sniAndFp = '';
	}

	const v2rayLink = `${protocolType}://${uuid}@${address}:${port}?encryption=${encryption}&security=${tls[0]}&type=${network}&host=${host}&path=${encodeURIComponent(path)}${sniAndFp}#${encodeURIComponent(remarks)}`;
	return v2rayLink;
}

/**
 * getClashLink
 * @param {*} protocolType 
 * @param {*} host 
 * @param {*} address 
 * @param {*} port 
 * @param {*} uuid 
 * @param {*} path 
 * @param {*} tls 
 * @param {*} fingerprint 
 * @returns 
 */
function getClashLink(protocolType, host, address, port, uuid, path, tls, fingerprint) {
	return `- {type: ${protocolType}, name: ${host}, server: ${address}, port: ${port}, password: ${uuid}, network: ${network}, tls: ${tls[1]}, udp: false, sni: ${host}, client-fingerprint: ${fingerprint}, skip-cert-verify: true,  ws-opts: {path: ${path}, headers: {Host: ${host}}}}`;

	// 	return `
	//   - type: ${protocolType}
	//     name: ${host}
	//     server: ${address}
	//     port: ${port}
	//     uuid: ${uuid}
	//     network: ${network}
	//     tls: ${tls[1]}
	//     udp: false
	//     sni: ${host}
	//     client-fingerprint: ${fingerprint}
	//     ws-opts:
	//       path: "${path}"
	//       headers:
	//         host: ${host}
	// 	`;
}

/**
 * Generate home page
 * @param {*} userID 
 * @param {*} hostName 
 * @param {*} remark 
 * @param {*} v2ray 
 * @param {*} clash 
 * @returns 
 */
function getConfigHtml(userID, host, remark, v2ray, clash) {
	// HTML Head with CSS and FontAwesome library
	const htmlHead = `
    <head>
      <title>am-cf-tunnel(AM科技)</title>
      <meta name='description' content='This is a project to generate free vmess nodes. For more information, please subscribe youtube(AM科技) https://youtube.com/@AM_CLUB and follow GitHub https://github.com/amclubs ' />
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
          color: #333;
          padding: 0;
          margin: 0;
        }
        a {
          color: #1a0dab;
          text-decoration: none;
        }
        img {
          max-width: 100%;
          height: auto;
        }
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          background-color: #fff;
          border: 1px solid #ddd;
          padding: 10px;
          margin: 0;
        }
        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          body {
            background-color: #333;
            color: #f0f0f0;
          }
          a {
            color: #9db4ff;
          }
          pre {
            background-color: #282a36;
            border-color: #6272a4;
          }
        }
      </style>
    </head>
  `;

	// Prepare header string with left alignment
	const header = `
		<p align="left" style="padding-left: 20px; margin-top: 20px;">
		Telegram交流群 技术大佬~在线交流</br>
		<a href="t.me/AM_CLUBS" target="_blank">t.me/AM_CLUBS</a>
		</br></br>
		GitHub项目地址 点击Star!Star!Star!</br>
		<a href="https://github.com/amclubs/am-cf-tunnel" target="_blank">https://github.com/amclubs/am-cf-tunnel</a>
		</br></br>
		YouTube频道,订阅频道,更多技术分享</br>
		<a href="https://youtube.com/@AM_CLUB" target="_blank">https://youtube.com/@AM_CLUB</a>
		</p>
  `;

	// Prepare the output string
	const httpAddr = `https://${host}/${userID}`;
	const output = `
################################################################
订阅地址, 支持 Base64、clash-meta、sing-box、Quantumult X、小火箭、surge 等订阅格式, ${remark}
---------------------------------------------------------------
通用订阅地址: <button onclick='copyToClipboard("${httpAddr}?sub")'><i class="fa fa-clipboard"></i> 点击复制订阅地址 </button>
${httpAddr}?sub

Base64订阅地址: <button onclick='copyToClipboard("${httpAddr}?base64")'><i class="fa fa-clipboard"></i> 点击复制订阅地址 </button>
${httpAddr}?base64

clash订阅地址: <button onclick='copyToClipboard("${httpAddr}?clash")'><i class="fa fa-clipboard"></i> 点击复制订阅地址 </button>
${httpAddr}?clash

singbox订阅地址: <button onclick='copyToClipboard("${httpAddr}?singbox")'><i class="fa fa-clipboard"></i> 点击复制订阅地址 </button>
${httpAddr}?singbox
---------------------------------------------------------------
################################################################
v2ray
---------------------------------------------------------------
${v2ray}
---------------------------------------------------------------
################################################################
clash-meta
---------------------------------------------------------------
${clash}
---------------------------------------------------------------
################################################################
  `;

	// Final HTML
	const html = `
<html>
${htmlHead}
<body>
  ${header}
  <pre>${output}</pre>
  <script>
    function copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          alert("Copied to clipboard");
        })
        .catch(err => {
          console.error("Failed to copy to clipboard:", err);
        });
    }
  </script>
</body>
</html>
  `;

	return html;
}


let portSet_http = new Set([80, 8080, 8880, 2052, 2086, 2095, 2082]);
let portSet_https = new Set([443, 8443, 2053, 2096, 2087, 2083]);
/**
 * 
 * @param {*} host 
 * @param {*} uuid 
 * @param {*} noTLS 
 * @param {*} ipUrlTxt 
 * @param {*} ipUrlCsv 
 * @returns 
 */
async function getSubscribeNode(userAgent, _url, host, fakeHostName, fakeUserID, noTLS, ipUrlTxt, ipUrlCsv) {
	// Use Set object to remove duplicates
	const uniqueIpTxt = [...new Set([...ipLocal, ...ipUrlTxt, ...ipUrlCsv])];
	let responseBody = splitNodeData(uniqueIpTxt, noTLS, fakeHostName, fakeUserID, userAgent);
	// console.log(`getSubscribeNode---> responseBody: ${responseBody} `);

	if (!userAgent.includes(('CF-FAKE-UA').toLowerCase())) {

		let url = `https://${host}/${fakeUserID}`;

		if (isClashCondition(userAgent, _url)) {
			isBase64 = false;
			url = createSubConverterUrl('clash', url, subConfig, subConverter, subProtocol);
		} else if (isSingboxCondition(userAgent, _url)) {
			isBase64 = false;
			url = createSubConverterUrl('singbox', url, subConfig, subConverter, subProtocol);
		} else {
			return responseBody;
		}
		const response = await fetch(url, {
			headers: {
				//'Content-Type': 'text/html; charset=UTF-8',
				'User-Agent': `${userAgent} am-cf-tunnel/amclubs`
			}
		});
		responseBody = await response.text();
		//console.log(`getSubscribeNode---> url: ${url} `);
	}

	return responseBody;
}

function createSubConverterUrl(target, url, subConfig, subConverter, subProtocol) {
	return `${subProtocol}://${subConverter}/sub?target=${target}&url=${encodeURIComponent(url)}&insert=false&config=${encodeURIComponent(subConfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
}

function isClashCondition(userAgent, _url) {
	return (userAgent.includes('clash') && !userAgent.includes('nekobox')) || (_url.searchParams.has('clash') && !userAgent.includes('subConverter'));
}

function isSingboxCondition(userAgent, _url) {
	return userAgent.includes('sing-box') || userAgent.includes('singbox') || ((_url.searchParams.has('singbox') || _url.searchParams.has('sb')) && !userAgent.includes('subConverter'));
}

/**
 * 
 * @param {*} uniqueIpTxt 
 * @param {*} noTLS 
 * @param {*} host 
 * @param {*} uuid 
 * @returns 
 */
function splitNodeData(uniqueIpTxt, noTLS, host, uuid, userAgent) {
	// Regex to match IPv4 and IPv6
	const regex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\[.*\]):?(\d+)?#?(.*)?$/;

	// Region codes mapped to corresponding emojis
	const regionMap = {
		'SG': '🇸🇬 SG',
		'HK': '🇭🇰 HK',
		'KR': '🇰🇷 KR',
		'JP': '🇯🇵 JP',
		'GB': '🇬🇧 GB',
		'US': '🇺🇸 US',
		'TW': '🇼🇸 TW',
		'CF': '📶 CF'
	};

	const responseBody = uniqueIpTxt.map(ipTxt => {
		let address = ipTxt;
		let port = "443";
		let remarks = "";

		const match = address.match(regex);
		if (match) {
			address = match[1];
			port = match[2] || port;
			remarks = match[3] || host;
		} else {
			let ip, newPort, extra;

			if (ipTxt.includes(':') && ipTxt.includes('#')) {
				[ip, newPort, extra] = ipTxt.split(/[:#]/);
			} else if (ipTxt.includes(':')) {
				[ip, newPort] = ipTxt.split(':');
			} else if (ipTxt.includes('#')) {
				[ip, extra] = ipTxt.split('#');
			} else {
				ip = ipTxt;
			}

			address = ip;
			port = newPort || port;
			remarks = extra || host;
			// console.log(`splitNodeData---> ip: ${ip} \n extra: ${extra} \n port: ${port}`);
		}

		// Replace region code with corresponding emoji
		remarks = regionMap[remarks] || remarks;

		// Check if TLS is disabled and if the port is in the allowed set
		if (noTLS !== 'true' && portSet_http.has(parseInt(port))) {
			return null; // Skip this iteration
		}

		const [v2ray, clash] = getConfigLink(uuid, host, address, port, remarks);
		return v2ray;
	}).filter(Boolean).join('\n');

	let base64Response = responseBody;
	return btoa(base64Response);
}

/** ---------------------Get CF data------------------------------ */

async function getCFConfig(email, key, accountIndex) {
	try {
		const now = new Date();
		const today = new Date(now);
		today.setHours(0, 0, 0, 0);

		// Calculate default value
		const ud = Math.floor(((now - today.getTime()) / 86400000) * 24 * 1099511627776 / 2);
		let upload = ud;
		let download = ud;
		let total = 24 * 1099511627776;

		if (email && key) {
			const accountId = await getAccountId(email, key);
			if (accountId) {
				// Calculate start and end time
				now.setUTCHours(0, 0, 0, 0);
				const startDate = now.toISOString();
				const endDate = new Date().toISOString();

				// Get summary data
				const [pagesSumResult, workersSumResult] = await getCFSum(accountId, accountIndex, email, key, startDate, endDate);
				upload = pagesSumResult;
				download = workersSumResult;
				total = 102400;
			}
		}

		return { upload, download, total };
	} catch (error) {
		console.error('Error in getCFConfig:', error);
		return { upload: 0, download: 0, total: 0 };
	}
}

/**
 * 
 * @param {*} email 
 * @param {*} key 
 * @returns 
 */
async function getAccountId(email, key) {
	try {
		const url = 'https://api.cloudflare.com/client/v4/accounts';
		const headers = {
			'X-AUTH-EMAIL': email,
			'X-AUTH-KEY': key
		};

		const response = await fetch(url, { headers });

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		//console.error('getAccountId-->', data);

		return data?.result?.[0]?.id || false;
	} catch (error) {
		console.error('Error fetching account ID:', error);
		return false;
	}
}

/**
 * 
 * @param {*} accountId 
 * @param {*} accountIndex 
 * @param {*} email 
 * @param {*} key 
 * @param {*} startDate 
 * @param {*} endDate 
 * @returns 
 */
async function getCFSum(accountId, accountIndex, email, key, startDate, endDate) {
	try {
		const [startDateISO, endDateISO] = [new Date(startDate), new Date(endDate)].map(d => d.toISOString());

		const query = JSON.stringify({
			query: `query getBillingMetrics($accountId: String!, $filter: AccountWorkersInvocationsAdaptiveFilter_InputObject) {
				viewer {
					accounts(filter: {accountTag: $accountId}) {
						pagesFunctionsInvocationsAdaptiveGroups(limit: 1000, filter: $filter) {
							sum {
								requests
							}
						}
						workersInvocationsAdaptive(limit: 10000, filter: $filter) {
							sum {
								requests
							}
						}
					}
				}
			}`,
			variables: {
				accountId,
				filter: { datetime_geq: startDateISO, datetime_leq: endDateISO }
			},
		});

		const headers = {
			'Content-Type': 'application/json',
			'X-AUTH-EMAIL': email,
			'X-AUTH-KEY': key
		};

		const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
			method: 'POST',
			headers,
			body: query
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const res = await response.json();
		const accounts = res?.data?.viewer?.accounts?.[accountIndex];

		if (!accounts) {
			throw new Error('找不到账户数据');
		}

		const getSumRequests = (data) => data?.reduce((total, item) => total + (item?.sum?.requests || 0), 0) || 0;

		const pagesSum = getSumRequests(accounts.pagesFunctionsInvocationsAdaptiveGroups);
		const workersSum = getSumRequests(accounts.workersInvocationsAdaptive);

		return [pagesSum, workersSum];

	} catch (error) {
		console.error('Error fetching billing metrics:', error);
		return [0, 0];
	}
}

const API_URL = 'http://ip-api.com/json/';
const TELEGRAM_API_URL = 'https://api.telegram.org/bot';
/**
 * Send message to Telegram channel
 * @param {string} type 
 * @param {string} ip I
 * @param {string} [add_data=""] 
 */
async function sendMessage(type, ip, add_data = "") {
	if (botToken && chatID) {
		try {
			const ipResponse = await fetch(`${API_URL}${ip}?lang=zh-CN`);
			let msg = `${type}\nIP: ${ip}\n${add_data}`;

			if (ipResponse.ok) {
				const ipInfo = await ipResponse.json();
				msg = `${type}\nIP: ${ip}\n国家: ${ipInfo.country}\n城市: ${ipInfo.city}\n组织: ${ipInfo.org}\nASN: ${ipInfo.as}\n${add_data}`;
			} else {
				console.error(`Failed to fetch IP info. Status: ${ipResponse.status}`);
			}

			const telegramUrl = `${TELEGRAM_API_URL}${botToken}/sendMessage`;
			const params = new URLSearchParams({
				chat_id: chatID,
				parse_mode: 'HTML',
				text: msg
			});

			await fetch(`${telegramUrl}?${params.toString()}`, {
				method: 'GET',
				headers: {
					'Accept': 'text/html,application/xhtml+xml,application/xml',
					'Accept-Encoding': 'gzip, deflate, br',
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36'
				}
			});

		} catch (error) {
			console.error('Error sending message:', error);
		}
	} else {
		console.warn('botToken or chatID is missing.');
	}
}


/** -------------------processing logic-------------------------------- */
/**
 * Handles channel over WebSocket requests by creating a WebSocket pair, accepting the WebSocket connection, and processing the channel header.
 * @param {import("@cloudflare/workers-types").Request} request The incoming request object.
 * @returns {Promise<Response>} A Promise that resolves to a WebSocket response object.
 */
async function channelOverWSHandler(request) {
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
	const readableWebSocketStream = makeReadableWebSocketStream(webSocket, earlyDataHeader, log);

	/** @type {{ value: import("@cloudflare/workers-types").Socket | null}}*/
	let remoteSocketWapper = {
		value: null,
	};
	let udpStreamWrite = null;
	let isDns = false;

	// ws --> remote
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
			} = processchannelHeader(chunk, userID);
			address = addressRemote;
			portWithRandomLog = `${portRemote} ${isUDP ? 'udp' : 'tcp'} `;

			if (hasError) {
				throw new Error(message);
			}

			// If UDP and not DNS port, close it
			if (isUDP && portRemote !== 53) {
				throw new Error('UDP proxy only enabled for DNS which is port 53');
			}

			if (isUDP && portRemote === 53) {
				isDns = true;
			}

			const channelResponseHeader = new Uint8Array([channelVersion[0], 0]);
			const rawClientData = chunk.slice(rawDataIndex);

			if (isDns) {
				const { write } = await handleUDPOutBound(webSocket, channelResponseHeader, log);
				udpStreamWrite = write;
				udpStreamWrite(rawClientData);
				return;
			}
			log(`processchannelHeader-->${addressType} Processing TCP outbound connection ${addressRemote}:${portRemote}`);

			handleTCPOutBound(remoteSocketWapper, addressRemote, portRemote, rawClientData, webSocket, channelResponseHeader, log, addressType);
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

/**
 * Handles outbound TCP connections.
 *
 * @param {any} remoteSocket
 * @param {string} addressRemote The remote address to connect to.
 * @param {number} portRemote The remote port to connect to.
 * @param {Uint8Array} rawClientData The raw client data to write.
 * @param {import("@cloudflare/workers-types").WebSocket} webSocket The WebSocket to pass the remote socket to.
 * @param {Uint8Array} channelResponseHeader The channel response header.
 * @param {function} log The logging function.
 * @returns {Promise<void>} The remote socket.
 */
async function handleTCPOutBound(remoteSocket, addressRemote, portRemote, rawClientData, webSocket, channelResponseHeader, log, addressType,) {

	/**
	 * Connects to a given address and port and writes data to the socket.
	 * @param {string} address The address to connect to.
	 * @param {number} port The port to connect to.
	 * @returns {Promise<import("@cloudflare/workers-types").Socket>} A Promise that resolves to the connected socket.
	 */
	async function connectAndWrite(address, port, socks = false) {
		/** @type {import("@cloudflare/workers-types").Socket} */
		const tcpSocket = socks ? await socks5Connect(addressType, address, port, log)
			: connect({
				hostname: address,
				port: port,
			});
		remoteSocket.value = tcpSocket;
		console.log(`connectAndWrite-${socks} connected to ${address}:${port}`);
		const writer = tcpSocket.writable.getWriter();
		await writer.write(rawClientData);
		writer.releaseLock();
		return tcpSocket;
	}

	/**
	 * Retries connecting to the remote address and port if the Cloudflare socket has no incoming data.
	 * @returns {Promise<void>} A Promise that resolves when the retry is complete.
	 */
	async function retry() {
		const tcpSocket = socks5Enable ? await connectAndWrite(addressRemote, portRemote, true) : await connectAndWrite(proxyIP || addressRemote, proxyPort || portRemote);

		console.log(`retry-${socks5Enable} connected to ${addressRemote}:${portRemote}`);
		tcpSocket.closed.catch(error => {
			console.log('retry tcpSocket closed error', error);
		}).finally(() => {
			safeCloseWebSocket(webSocket);
		})
		remoteSocketToWS(tcpSocket, webSocket, channelResponseHeader, null, log);
	}

	const tcpSocket = await connectAndWrite(addressRemote, portRemote);

	// when remoteSocket is ready, pass to websocket
	// remote--> ws
	remoteSocketToWS(tcpSocket, webSocket, channelResponseHeader, retry, log);
}

/**
 * Creates a readable stream from a WebSocket server, allowing for data to be read from the WebSocket.
 * @param {import("@cloudflare/workers-types").WebSocket} webSocketServer The WebSocket server to create the readable stream from.
 * @param {string} earlyDataHeader The header containing early data for WebSocket 0-RTT.
 * @param {(info: string)=> void} log The logging function.
 * @returns {ReadableStream} A readable stream that can be used to read data from the WebSocket.
 */
function makeReadableWebSocketStream(webSocketServer, earlyDataHeader, log) {
	let readableStreamCancel = false;
	const stream = new ReadableStream({
		start(controller) {
			webSocketServer.addEventListener('message', (event) => {
				const message = event.data;
				controller.enqueue(message);
			});

			webSocketServer.addEventListener('close', () => {
				safeCloseWebSocket(webSocketServer);
				controller.close();
			});

			webSocketServer.addEventListener('error', (err) => {
				log('webSocketServer has error');
				controller.error(err);
			});
			const { earlyData, error } = base64ToArrayBuffer(earlyDataHeader);
			if (error) {
				controller.error(error);
			} else if (earlyData) {
				controller.enqueue(earlyData);
			}
		},

		pull(controller) {
			// if ws can stop read if stream is full, we can implement backpressure
			// https://streams.spec.whatwg.org/#example-rs-push-backpressure
		},

		cancel(reason) {
			log(`ReadableStream was canceled, due to ${reason}`)
			readableStreamCancel = true;
			safeCloseWebSocket(webSocketServer);
		}
	});

	return stream;
}

// https://xtls.github.io/development/protocols/channel.html

/**
 * Processes the channel header buffer and returns an object with the relevant information.
 * @param {ArrayBuffer} channelBuffer The channel header buffer to process.
 * @param {string} userID The user ID to validate against the UUID in the channel header.
 * @returns {{
 *  hasError: boolean,
 *  message?: string,
 *  addressRemote?: string,
 *  addressType?: number,
 *  portRemote?: number,
 *  rawDataIndex?: number,
 *  channelVersion?: Uint8Array,
 *  isUDP?: boolean
 * }} An object with the relevant information extracted from the channel header buffer.
 */
function processchannelHeader(channelBuffer, userID) {
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
	// check if userID is valid uuid or uuids split by , and contains userID in it otherwise return error message to console
	const uuids = userID.includes(',') ? userID.split(",") : [userID];
	// uuid_validator(hostName, slicedBufferString);


	// isValidUser = uuids.some(userUuid => slicedBufferString === userUuid.trim());
	isValidUser = uuids.some(userUuid => slicedBufferString === userUuid.trim()) || uuids.length === 1 && slicedBufferString === uuids[0].trim();

	console.log(`userID: ${slicedBufferString}`);

	if (!isValidUser) {
		return {
			hasError: true,
			message: 'invalid user',
		};
	}

	const optLength = new Uint8Array(channelBuffer.slice(17, 18))[0];
	//skip opt for now

	const command = new Uint8Array(
		channelBuffer.slice(18 + optLength, 18 + optLength + 1)
	)[0];

	// 0x01 TCP
	// 0x02 UDP
	// 0x03 MUX
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
	// port is big-Endian in raw data etc 80 == 0x005d
	const portRemote = new DataView(portBuffer).getUint16(0);

	let addressIndex = portIndex + 2;
	const addressBuffer = new Uint8Array(
		channelBuffer.slice(addressIndex, addressIndex + 1)
	);

	// 1--> ipv4  addressLength =4
	// 2--> domain name addressLength=addressBuffer[1]
	// 3--> ipv6  addressLength =16
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

/**
 * Converts a remote socket to a WebSocket connection.
 * @param {import("@cloudflare/workers-types").Socket} remoteSocket The remote socket to convert.
 * @param {import("@cloudflare/workers-types").WebSocket} webSocket The WebSocket to connect to.
 * @param {ArrayBuffer | null} channelResponseHeader The channel response header.
 * @param {(() => Promise<void>) | null} retry The function to retry the connection if it fails.
 * @param {(info: string) => void} log The logging function.
 * @returns {Promise<void>} A Promise that resolves when the conversion is complete.
 */
async function remoteSocketToWS(remoteSocket, webSocket, channelResponseHeader, retry, log) {
	// remote--> ws
	let remoteChunkCount = 0;
	let chunks = [];
	/** @type {ArrayBuffer | null} */
	let channelHeader = channelResponseHeader;
	let hasIncomingData = false; // check if remoteSocket has incoming data
	await remoteSocket.readable
		.pipeTo(
			new WritableStream({
				start() {
				},
				/**
				 *
				 * @param {Uint8Array} chunk
				 * @param {*} controller
				 */
				async write(chunk, controller) {
					hasIncomingData = true;
					remoteChunkCount++;
					if (webSocket.readyState !== WS_READY_STATE_OPEN) {
						controller.error(
							'webSocket.readyState is not open, maybe close'
						);
					}
					if (channelHeader) {
						webSocket.send(await new Blob([channelHeader, chunk]).arrayBuffer());
						channelHeader = null;
					} else {
						// console.log(`remoteSocketToWS send chunk ${chunk.byteLength}`);
						// seems no need rate limit this, CF seems fix this??..
						// if (remoteChunkCount > 20000) {
						// 	// cf one package is 4096 byte(4kb),  4096 * 20000 = 80M
						// 	await delay(1);
						// }
						webSocket.send(chunk);
					}
				},
				close() {
					log(`remoteConnection!.readable is close with hasIncomingData is ${hasIncomingData}`);
					// safeCloseWebSocket(webSocket); // no need server close websocket frist for some case will casue HTTP ERR_CONTENT_LENGTH_MISMATCH issue, client will send close event anyway.
				},
				abort(reason) {
					console.error(`remoteConnection!.readable abort`, reason);
				},
			})
		)
		.catch((error) => {
			console.error(
				`remoteSocketToWS has exception `,
				error.stack || error
			);
			safeCloseWebSocket(webSocket);
		});

	// seems is cf connect socket have error,
	// 1. Socket.closed will have error
	// 2. Socket.readable will be close without any data coming
	if (hasIncomingData === false && retry) {
		log(`retry`)
		retry();
	}
}

const WS_READY_STATE_OPEN = 1;
const WS_READY_STATE_CLOSING = 2;
/**
 * Closes a WebSocket connection safely without throwing exceptions.
 * @param {import("@cloudflare/workers-types").WebSocket} socket The WebSocket connection to close.
 */
function safeCloseWebSocket(socket) {
	try {
		if (socket.readyState === WS_READY_STATE_OPEN || socket.readyState === WS_READY_STATE_CLOSING) {
			socket.close();
		}
	} catch (error) {
		console.error('safeCloseWebSocket error', error);
	}
}

/**
 * Handles outbound UDP traffic by transforming the data into DNS queries and sending them over a WebSocket connection.
 * @param {import("@cloudflare/workers-types").WebSocket} webSocket The WebSocket connection to send the DNS queries over.
 * @param {ArrayBuffer} channelResponseHeader The channel response header.
 * @param {(string) => void} log The logging function.
 * @returns {{write: (chunk: Uint8Array) => void}} An object with a write method that accepts a Uint8Array chunk to write to the transform stream.
 */
async function handleUDPOutBound(webSocket, channelResponseHeader, log) {

	let ischannelHeaderSent = false;
	const transformStream = new TransformStream({
		start(controller) {

		},
		transform(chunk, controller) {
			// udp message 2 byte is the the length of udp data
			// TODO: this should have bug, beacsue maybe udp chunk can be in two websocket message
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

	// only handle dns udp for now
	transformStream.readable.pipeTo(new WritableStream({
		async write(chunk) {
			const resp = await fetch(dohURL, // dns server url
				{
					method: 'POST',
					headers: {
						'content-type': 'application/dns-message',
					},
					body: chunk,
				})
			const dnsQueryResult = await resp.arrayBuffer();
			const udpSize = dnsQueryResult.byteLength;
			// console.log([...new Uint8Array(dnsQueryResult)].map((x) => x.toString(16)));
			const udpSizeBuffer = new Uint8Array([(udpSize >> 8) & 0xff, udpSize & 0xff]);
			if (webSocket.readyState === WS_READY_STATE_OPEN) {
				log(`doh success and dns message length is ${udpSize}`);
				if (ischannelHeaderSent) {
					webSocket.send(await new Blob([udpSizeBuffer, dnsQueryResult]).arrayBuffer());
				} else {
					webSocket.send(await new Blob([channelResponseHeader, udpSizeBuffer, dnsQueryResult]).arrayBuffer());
					ischannelHeaderSent = true;
				}
			}
		}
	})).catch((error) => {
		log('dns udp has error' + error)
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

/**
 * Handles outbound UDP traffic by transforming the data into DNS queries and sending them over a WebSocket connection.
 * @param {ArrayBuffer} udpChunk - DNS query data sent from the client.
 * @param {import("@cloudflare/workers-types").WebSocket} webSocket - The WebSocket connection to send the DNS queries over.
 * @param {ArrayBuffer} channelResponseHeader - The channel response header.
 * @param {(string) => void} log - The logging function.
 * @returns {{write: (chunk: Uint8Array) => void}} An object with a write method that accepts a Uint8Array chunk to write to the transform stream.
 */
async function handleDNSQuery(udpChunk, webSocket, channelResponseHeader, log) {
	try {
		const dnsServer = '8.8.4.4';
		const dnsPort = 53;
		let channelHeader = channelResponseHeader;

		const tcpSocket = connect({ hostname: dnsServer, port: dnsPort });
		log(`Connected to ${dnsServer}:${dnsPort}`);

		const writer = tcpSocket.writable.getWriter();
		await writer.write(udpChunk);
		writer.releaseLock();

		await tcpSocket.readable.pipeTo(new WritableStream({
			async write(chunk) {
				if (webSocket.readyState === WS_READY_STATE_OPEN) {
					const dataToSend = channelHeader ? await new Blob([channelHeader, chunk]).arrayBuffer() : chunk;
					webSocket.send(dataToSend);
					channelHeader = null;
				}
			},
			close() {
				log(`TCP connection to DNS server (${dnsServer}) closed`);
			},
			abort(reason) {
				console.error(`TCP connection to DNS server (${dnsServer}) aborted`, reason);
			},
		}));
	} catch (error) {
		console.error(`Exception in handleDNSQuery function: ${error.message}`);
	}
}


async function socks5Connect(ipType, remoteIp, remotePort, log) {
	const { username, password, hostname, port } = parsedSocks5;
	const socket = connect({ hostname, port });
	const writer = socket.writable.getWriter();
	const reader = socket.readable.getReader();
	const encoder = new TextEncoder();

	const sendSocksGreeting = async () => {
		const greeting = new Uint8Array([5, 2, 0, 2]);
		await writer.write(greeting);
		console.log('SOCKS5 greeting sent');
	};

	const handleAuthResponse = async () => {
		const res = (await reader.read()).value;
		if (res[1] === 0x02) {
			console.log("SOCKS5 server requires authentication");
			if (!username || !password) {
				console.log("Please provide username and password");
				throw new Error("Authentication required");
			}
			const authRequest = new Uint8Array([
				1, username.length, ...encoder.encode(username),
				password.length, ...encoder.encode(password)
			]);
			await writer.write(authRequest);
			const authResponse = (await reader.read()).value;
			if (authResponse[0] !== 0x01 || authResponse[1] !== 0x00) {
				console.log("SOCKS5 server authentication failed");
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
				console.log(`Invalid address type: ${ipType}`);
				throw new Error("Invalid address type");
		}
		const socksRequest = new Uint8Array([5, 1, 0, ...DSTADDR, remotePort >> 8, remotePort & 0xff]);
		await writer.write(socksRequest);
		console.log('SOCKS5 request sent');

		const response = (await reader.read()).value;
		if (response[1] !== 0x00) {
			console.log("SOCKS5 connection failed");
			throw new Error("Connection failed");
		}
		console.log("SOCKS5 connection established");
	};

	try {
		await sendSocksGreeting();
		await handleAuthResponse();
		await sendSocksRequest();
	} catch (error) {
		console.log(error.message);
		return null; // Return null on failure
	} finally {
		writer.releaseLock();
		reader.releaseLock();
	}
	return socket;
}


/** -------------------Home page-------------------------------- */
async function nginx() {
	const text = `
	<!DOCTYPE html>
	<html>
	<head>
	<meta charset="UTF-8">
	<title>Welcome to nginx!</title>
	<style>
		body {
			width: 35em;
			margin: 0 auto;
			font-family: Tahoma, Verdana, Arial, sans-serif;
		}
	</style>
	</head>
	<body>
	<h1>Welcome to nginx!</h1>
	<p>If you see this page, the nginx web server is successfully installed and
	working. Further configuration is required.</p>

	<p>For online documentation and support please refer to
	<a href="http://nginx.org/">nginx.org</a>.<br/>
	Commercial support is available at
	<a href="http://nginx.com/">nginx.com</a>.</p>

	<p><em>Thank you for using nginx.</em></p>
	</body>
	</html>
	`
	return text;
}
