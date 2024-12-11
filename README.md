# [am-cf-tunnel](https://github.com/amclubs/am-cf-tunnel)
这是一个基于 Cloudflare Workers 和 Pages平台的脚本，在原版的基础上修改了显示 VLESS 配置信息转换为订阅内容。使用该脚本，你可以方便地将 VLESS、trojan 配置信息使用在线配置转换到 Clash、 Singbox 、Quantumult X等工具中订阅使用。

#
▶️ **新人[YouTube](https://youtube.com/@AM_CLUB)** 需要您的支持，请务必帮我**点赞**、**关注**、**打开小铃铛**，***十分感谢！！！*** ✅
</br>🎁 不要只是下载或Fork。请 **follow** 我的[GitHub](https://github.com/amclubs)、给我所有项目一个 **Star** 星星（拜托了）！你的支持是我不断前进的动力！ 💖
</br>✅**解锁更多内容请进入 YouTube频道[【@AM_CLUB】](https://youtube.com/@AM_CLUB) 、[【个人博客】](https://am.809098.xyz)** 、TG群[【AM科技 | 分享交流群】](https://t.me/AM_CLUBS) 、获取免费节点[【进群发送关键字: 订阅】](https://t.me/AM_CLUBS)
</br>✅点击观看[免费节点教程](https://www.youtube.com/playlist?list=PLGVQi7TjHKXbrY0Pk8gm3T7m8MZ-InquF) | [免费服务器教程](https://www.youtube.com/playlist?list=PLGVQi7TjHKXaVlrHP9Du61CaEThYCQaiY) | [免费域名教程](https://www.youtube.com/playlist?list=PLGVQi7TjHKXZGODTvB8DEervrmHANQ1AR) | [免费VPN教程](https://www.youtube.com/playlist?list=PLGVQi7TjHKXY7V2JF-ShRSVwGANlZULdk) | [免费IPTV教程](https://www.youtube.com/playlist?list=PLGVQi7TjHKXbkozDYVsDRJhbnNaEOC76w) | [Mac和Win工具教程](https://www.youtube.com/playlist?list=PLGVQi7TjHKXYBWu65yP8E08HxAu9LbCWm) | [AI分享教程](https://www.youtube.com/playlist?list=PLGVQi7TjHKXaodkM-mS-2Nwggwc5wRjqY)

# Cloudflare Workers 和 Pages 生成VLESS节点,实现订阅连接可以一键订阅节点
- VLESS免费节点部署视频教程：[点击进入观看](https://youtu.be/dPH63nITA0M) 
- Trojan免费节点部署视频教程：[点击进入观看](https://youtu.be/uh27CVVi6HA) 
- 优选IP和优选反代IP视频教程：[点击进入观看](https://youtu.be/pKrlfRRB0gU)
- GitHub私有库存储优选IP文：[点击进入观看](https://youtu.be/vX3U3FuuTT8)
- CF免费KV存储优选IP文件：[点击进入观看](https://youtu.be/dzxezRV1v-o)
- 聚合节点订阅视频教程：[点击进入观看](https://youtu.be/YBO2hf96150)
- 免费域名视频教程：[点击进入观看](https://www.youtube.com/playlist?list=PLGVQi7TjHKXZGODTvB8DEervrmHANQ1AR)
- 解决常见订阅测试-1：[点击进入观看](https://youtu.be/kYQxV1G-ePw)
- 获取CF自家域名无限节点：[点击进入观看](https://youtu.be/novrPiMsK70)

## Workers 部署方法 [视频教程](https://www.youtube.com/watch?v=dPH63nITA0M&t=151s)
1. 部署 Cloudflare Worker：
   - 在 Cloudflare Worker 控制台中创建一个新的 Worker。
   - 将 [_worker.js](https://github.com/amclubs/am-cf-tunnel/blob/main/_worker.js) 的内容粘贴到 Worker 编辑器中。
2. 访问订阅内容：
   - 访问 `https://[YOUR-WORKERS-URL]/[UUID]` 即可获取订阅内容。
   - 例如 `https://vless.google.workers.dev/90cd4a77-141a-43c9-991b-08263cfe9c10` 就是你的通用自适应订阅地址(Quantumult X、Clash、singbox、小火箭、v2rayN、v2rayU、surge、PassWall、SSR+、Karing等)。
   - 例如 `https://vless.google.workers.dev/90cd4a77-141a-43c9-991b-08263cfe9c10?base64` Base64订阅格式，适用PassWall,SSR+等。
   - 例如 `https://vless.google.workers.dev/90cd4a77-141a-43c9-991b-08263cfe9c10?clash` Clash订阅格式，适用OpenClash等。
   - 例如 `https://vless.google.workers.dev/90cd4a77-141a-43c9-991b-08263cfe9c10?singbox` singbox订阅格式，适用singbox等。

3. 给 workers绑定 自定义域： 
   - 在 workers控制台的 `触发器`选项卡，下方点击 `添加自定义域`。
   - 填入你已转入 CloudFlare 域名解析服务的次级域名，例如:`vless.google.com`后 点击`添加自定义域`，等待证书生效即可。

</details>

## Pages 上传 部署方法 **最佳推荐!!!** [视频教程](https://www.youtube.com/watch?v=dPH63nITA0M&t=476s)
1. 部署 Cloudflare Pages：
   - 下载 [_worker.js.zip](https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/_worker.js.zip) 文件，并点上 Star !!!
   - 在 Cloudflare Pages 控制台中选择 `上传资产`后，为你的项目取名后点击 `创建项目`，然后上传你下载好的 [_worker.js.zip](https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/_worker.js.zip) 文件后点击 `部署站点`。
   - 部署完成后点击 `继续处理站点` 后，选择 `设置` > `环境变量` > **制作**为生产环境定义变量 > `添加变量`。
     变量名称填写**UUID**，值则为你的UUID，后点击 `保存`即可。
   - 返回 `部署` 选项卡，在右下角点击 `创建新部署` 后，重新上传 [_worker.js.zip](https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/_worker.js.zip) 文件后点击 `保存并部署` 即可。
2. 访问订阅内容：
   - 访问 `https://[YOUR-WORKERS-URL]/[UUID]` 即可获取订阅内容。
   - 例如 `https://vless.google.workers.dev/90cd4a77-141a-43c9-991b-08263cfe9c10` 就是你的通用自适应订阅地址(Quantumult X、Clash、singbox、小火箭、v2rayN、v2rayU、surge、PassWall、SSR+、Karing等)。
   - 例如 `https://vless.google.workers.dev/90cd4a77-141a-43c9-991b-08263cfe9c10?base64` Base64订阅格式，适用PassWall,SSR+等。
   - 例如 `https://vless.google.workers.dev/90cd4a77-141a-43c9-991b-08263cfe9c10?clash` Clash订阅格式，适用OpenClash等。
   - 例如 `https://vless.google.workers.dev/90cd4a77-141a-43c9-991b-08263cfe9c10?singbox` singbox订阅格式，适用singbox等。

3. 给 Pages绑定 CNAME自定义域：
   - 在 Pages控制台的 `自定义域`选项卡，下方点击 `设置自定义域`。
   - 填入你的自定义次级域名，注意不要使用你的根域名，例如：
     您分配到的域名是 `google.com`，则添加自定义域填入 `vless.google.com`即可；
   - 按照 Cloudflare 的要求将返回你的域名DNS服务商，添加 该自定义域 `vless`的 CNAME记录 `vless.google.pages.dev` 后，点击 `激活域`即可。

</details>

## Pages GitHub 部署方法 [视频教程](https://www.youtube.com/watch?v=dPH63nITA0M&t=654s)
1. 部署 Cloudflare Pages：
   - 在 Github 上先 Fork 本项目，并点上 Star !!!
   - 在 Cloudflare Pages 控制台中选择 `连接到 Git`后，选中 `am-cf-tunnel`项目后点击 `开始设置`。
   - 在 `设置构建和部署`页面下方，选择 `环境变量（高级）`后并 `添加变量`
     变量名称填写**UUID**，值则为你的UUID，后点击 `保存并部署`即可。

2. 访问订阅内容：
   - 访问 `https://[YOUR-WORKERS-URL]/[UUID]` 即可获取订阅内容。
   - 例如 `https://vless.google.workers.dev/90cd4a77-141a-43c9-991b-08263cfe9c10` 就是你的通用自适应订阅地址(Quantumult X、Clash、singbox、小火箭、v2rayN、v2rayU、surge、PassWall、SSR+、Karing等)。
   - 例如 `https://vless.google.workers.dev/90cd4a77-141a-43c9-991b-08263cfe9c10?base64` Base64订阅格式，适用PassWall,SSR+等。
   - 例如 `https://vless.google.workers.dev/90cd4a77-141a-43c9-991b-08263cfe9c10?clash` Clash订阅格式，适用OpenClash等。
   - 例如 `https://vless.google.workers.dev/90cd4a77-141a-43c9-991b-08263cfe9c10?singbox` singbox订阅格式，适用singbox等。

3. 给 Pages绑定 CNAME自定义域：
   - 在 Pages控制台的 `自定义域`选项卡，下方点击 `设置自定义域`。
   - 填入你的自定义次级域名，注意不要使用你的根域名，例如：
     您分配到的域名是 `google.com`，则添加自定义域填入 `vless.google.com`即可；
   - 按照 Cloudflare 的要求将返回你的域名DNS服务商，添加 该自定义域 `vless`的 CNAME记录 `vless.google.pages.dev` 后，点击 `激活域`即可。


</details>


## 变量说明 [视频教程](https://www.youtube.com/watch?v=ag12Rpc9KP4&t=739s)
| 变量名 | 示例 | 必填 | 备注 | YT |
|-----|-----|-----|-----|-----|
| UUID             | 866853eb-5293-4f09-bf00-e13eb237c655 |✅| [在线获取UUID](https://1024tools.com/uuid)                                        |  |
| PROXYIP          | proxyip.amclubs.kozow.com </br>或</br> [https://raw.github.../proxyip.txt](https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/proxyip.txt)  |❌| 访问CloudFlare的CDN代理节点(支持多ProxyIP, ProxyIP之间使用`,`或 换行 作间隔),支持端口设置默认443 如: proxyip.amclubs.kozow.com:2053 ，支持远程txt或csv文件| [Video](https://youtu.be/pKrlfRRB0gU) |
| SOCKS5           | user:password@127.0.0.1:1080         |❌| 优先作为访问CFCDN站点的SOCKS5代理                                                   | [Video](https://youtu.be/Bw82BH_ecC4) |
| DNS_RESOLVER_URL | https://cloudflare-dns.com/dns-query |❌| DNS解析获取作用，小白勿用                                                           |  |
| IP_LOCAL         | `icook.hk:2053#官方优选域名`           |❌| 本地优选域名/优选IP(支持多元素之间`,`或 换行 作间隔)                                 | |
| IP_URL_TXT       | [https://raw.github.../ipv4.txt](https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/ipv4.txt) |❌| 优选ipv4、ipv6、域名、API地址(支持多个之间`,`或 换行 作间隔) |[Video](https://youtu.be/dzxezRV1v-o) [Video](https://youtu.be/vX3U3FuuTT8)|
| IP_URL_CSV       | [https://raw.github.../ipv4.csv](https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/ipv4.csv) |❌| 优选ipv4/6的IP测速结果(支持多元素, 元素之间使用`,`作间隔) |[Video](https://youtu.be/vX3U3FuuTT8)|
| NO_TLS           | true/false                           |❌| 默认false,是否开启TLS系列端口，只有workers部署才可以使非用TLS系列端口             | |
| SL               | 5                                    |❌| `CSV`文件里的测速结果满足速度下限                                                     ||
| SUB_CONFIG       | [https://raw.github.../ACL4SSR_Online_Mini.ini](https://raw.githubusercontent.com/amclubs/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_MultiMode.ini) |❌| clash、singbox等 订阅转换配置文件  ||
| SUB_CONVERTER    | url.v1.mk                    |❌| clash、singbox等 订阅转换后端的api地址                               ||
| SUB_NAME         | @AM_CLUB                             |❌ | 订阅名称                                                     ||
| CF_EMAIL         | test@gmail.com                       |❌| CF账户邮箱(要和`CF_KEY`同时填才生效, 订阅信息将显示请求使用量, 小白别用)                        ||
| CF_KEY          | c6a944b5c9c18c235288bced8b85e         |❌| CF账户Global API Key(要和`CF_EMAIL`同时填才生效, 订阅信息将显示请求使用量, 小白别用)           ||
| TG_TOKEN        | 6823456:XXXXXXX0qExVUhHDAbXXXqWXgBA   |❌| 发送TG通知的机器人token                       ||
| TG_ID           | 6946912345                            |❌ | 接收TG通知的账户数字ID                                       ||


## 已适配订阅工具 [点击进入视频教程](https://youtu.be/xGOL57cmvaw) [点进进入karing视频教程](https://youtu.be/M3vLLBWfuFg)
   - [v2rayN](https://github.com/2dust/v2rayN/releases) 支持(win)
   - [v2rayNG](https://github.com/2dust/v2rayNG/releases) 支持(安卓)
   - [v2rayU](https://github.com/yanue/V2rayU/releases) 支持(mac)
   - [sing-box](https://github.com/SagerNet/sing-box/releases) 支持(安卓、苹果、win、mac)
   - clash.meta（[clash-verge-rev
](https://github.com/clash-verge-rev/clash-verge-rev)，[Clash Nyanpasu](https://github.com/keiko233/clash-nyanpasu/releases)，ClashX Meta、[openclash](https://github.com/vernesong/OpenClash/releases)）支持(安卓、苹果、win、mac)
   - [Quantumult X](https://apps.apple.com/us/app/quantumult-x/id1443988620) 支持(苹果)
   - [小火箭](https://apps.apple.com/us/app/shadowrocket/id932747118) 支持(苹果)
   - [surge](https://apps.apple.com/us/app/surge-5/id1442620678) 支持(苹果)
   - [karing](https://karing.app/download) 支持(安卓、苹果、win、mac)
   - [Hiddify](https://github.com/hiddify/hiddify-next/releases) 支持(安卓、苹果、win、mac)

# 感谢
[3Kmfi6HP](https://github.com/3Kmfi6HP/EDtunnel)、[ACL4SSR](https://github.com/ACL4SSR/ACL4SSR/tree/master/Clash/config)

  # 
 <center><details><summary><strong> [点击展开] 赞赏支持 ~🧧</strong></summary>
 *我非常感谢您的赞赏和支持，它们将极大地激励我继续创新，持续产生有价值的工作。*
  
 - **USDT-TRC20:** `TWTxUyay6QJN3K4fs4kvJTT8Zfa2mWTwDD`
  
 </details></center>

 #
 免责声明:
 - 1、该项目设计和开发仅供学习、研究和安全测试目的。请于下载后 24 小时内删除, 不得用作任何商业用途, 文字、数据及图片均有所属版权, 如转载须注明来源。
 - 2、使用本程序必循遵守部署服务器所在地区的法律、所在国家和用户所在国家的法律法规。对任何人或团体使用该项目时产生的任何后果由使用者承担。
 - 3、作者不对使用该项目可能引起的任何直接或间接损害负责。作者保留随时更新免责声明的权利，且不另行通知。
 
