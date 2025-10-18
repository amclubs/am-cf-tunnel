### 🚀[am-cf-tunnel](https://github.com/amclubs/am-cf-tunnel)
这是一个基于 Cloudflare Workers 和 Pages平台的脚本，在原版的基础上修改了显示 VLESS、Trojan 配置信息转换为订阅内容。使用该脚本，你可以方便地将 VLESS、Trojan 配置信息使用在线配置转换到 Clash、 Singbox 、Quantumult X等工具中订阅使用。Cloudflare Workers 和 Pages 生成VLESS、Trojan节点,实现一键订阅节点。[最新视频教程](https://youtu.be/i-XnnP-MptY)、[🎬 YouTube](https://youtube.com/@am_clubs?sub_confirmation=1)、 [💬 Telegram](https://t.me/am_clubs)、[📂 GitHub](https://github.com/amclubs)、[🌐 Blog](https://amclubss.com)

### 🎬推荐视频教程
- [Error1101和522解决教程](https://youtu.be/4fcyJjstFdg) | [优选IP和反代IP教程](https://youtu.be/pKrlfRRB0gU) | [常见-1问题教程](https://youtu.be/kYQxV1G-ePw) | [免费域名教程](https://www.youtube.com/playlist?list=PLGVQi7TjHKXZGODTvB8DEervrmHANQ1AR) | [NAT64版教程](https://youtu.be/nx80sGpVoBM)
- [VLESS免费节点部署教程](https://youtu.be/dPH63nITA0M) | [Trojan免费节点部署教程](https://youtu.be/uh27CVVi6HA) | [从入门到精通免费部署教程](https://youtu.be/ag12Rpc9KP4)| [高级固定节点区域教程](https://youtu.be/wgeM9XvZ5RA)
- [GitHub私有储优选IP文教程](https://youtu.be/vX3U3FuuTT8) | [CF免费KV存储IP文件教程](https://youtu.be/dzxezRV1v-o)  | [获取CF自家域名无限节点](https://youtu.be/novrPiMsK70) | [聚合节点订阅教程](https://youtu.be/YBO2hf96150)
- [🔥amclubs-cfnat自动优先IP(Win桌面版)](https://youtu.be/-a6NJ6vPSu4) | [Linux&openwrt软路由版](https://youtu.be/ZC6fxZwPaiM) | [Mac版](https://youtu.be/gf6gncc2yEE) | [安卓(Android)手机版](https://youtu.be/7yamDM38MFw) | [docker版](https://youtu.be/gRnNwoeUQKU)
- 本频道订阅器转换地址：https://sub.amclubss.com

## 📝一、前期准备资料
<details>
<summary>点击展开/收起</summary>

### 1、注册免费**cloudflare**帐号(邮箱就可以免费注册)
- 注册地址：https://cloudflare.com <a href="https://youtu.be/ITeuSbHVQ2E">[点击观看视频教程]</a>

### 2、注册**免费域名** [点击观看所有免费域名视频教程](https://www.youtube.com/playlist?list=PLGVQi7TjHKXZGODTvB8DEervrmHANQ1AR)

### 3、**订阅工具** [点击观看使用视频教程](https://youtu.be/xGOL57cmvaw)
👉 [点击加入TG群 数字套利｜交流群](https://t.me/AM_CLUBS)发送关键字 **工具** 获取下载

### 4、Cloudflare标准 **端口** 知识  [点击观看优选IP视频教程](https://youtu.be/pKrlfRRB0gU)
- 80系端口(HTTP)：80，8080，8880，2052，2082，2086，2095
- 443系端口(HTTPS)：443，2053，2083，2087，2096，8443
- [IP落地测试工具地址](https://ip.sb/) 

</details>

## 
## ⚙️ 二、Workers 部署方法 [视频教程](https://www.youtube.com/watch?v=i-XnnP-MptY&t=165s)
<details>
<summary>点击展开/收起</summary>

1. 部署 Cloudflare Worker：
   - 在 CloudFlare主页的左边菜单的 `计算(Workers)` 选项卡 -> 点击 `Workers 和 Pages` -> 右上方点击 -> `创建应用程序` -> 选择 `Workers`里的 `从 Hello World! 开始` 点击 `开始使用` -> 填入 `Worker 名称`(此名称自己命名) 后 -> 右下方点击 `部署` 后-> 右上方点击 `断续处理项目`。(此步已有可忽略)。
2. 给UUID设置KV存储桶(推荐设置)： 
   - 在 CloudFlare主页的左边菜单的 `存储和数据库` 选项卡 -> 展开选择点击 `Workers KV` -> 右方点击 -> `创建实例(Create Instance)` -> 填入 `命名空间名称`(此名称自己命名) 后 -> 点击 `创建`。(此步已有可忽略)
   - 在 workers控制台的 `绑定` 选项卡 -> 右方点击 -> `添加绑定` -> 选择 `KV 命名空间` 右下方点击 -> `添加绑定` -> 变量名称 填入 `amclubs`(此名称固定不能变) -> KV 命名空间 选择 在上面创建的 `命名空间名称`后 -> 右下方点击 `添加绑定`。
3. 部署 Cloudflare Worker代码：
   - 在 workers控制台的 右上角方点击 `编辑代码(</>)` 图标进入代码编辑页面。
   - 将 [_worker.js](https://github.com/amclubs/am-cf-tunnel/blob/main/_worker.js) 的内容粘贴到 Worker 编辑器中 右上方点击 -> `部署` 完成部署。
4. 给 workers绑定 自定义域： [免费域名申请教程](https://www.youtube.com/playlist?list=PLGVQi7TjHKXZGODTvB8DEervrmHANQ1AR)
   - 在 workers控制台的 `设置` 选项卡 -> 点击 `域和路由` -> 右方点击 -> `添加` -> 选择 `自定义域`。
   - 填入你已转入 CloudFlare 域名 (amclubss.com) 解析服务的次级域名，例如:`vless.amclubss.com`后 点击 `添加域`，等待证书生效即可。
5. 验证部署是否成功：
   - 访问 `https://[YOUR-WORKERS-URL]` 即可进入登录页面,登录成功就是完成部署(默认登录密码(UUID)是：ec872d8f-72b0-4a04-b612-0327d85e18ed)。
   - 例如 `https://vless.amclubss.com` 然后进入登录页面 -> 输入密码 `ec872d8f-72b0-4a04-b612-0327d85e18ed` -> 点击登录 -> 成功登录。 
6. 修改默认登录密码(UUID)变量，使用KV存储桶(推荐修改，防止别人用你节点)： 
   - `https://vless.amclubss.com` 然后进入登录页面 -> 输入密码 `ec872d8f-72b0-4a04-b612-0327d85e18ed` -> 点击登录 -> 成功登录。 
   - 在登录成功页面 ID选项 -> 填入 `新的UUID` 后,[在线获取UUID](https://1024tools.com/uuid) -> 点击 `保存`。
   - 保存成功后，原登录密码(UUID)已作废不能访问，用新登录密码(UUID)登录访问即可。
7. 订阅连接和节点生成使用方法：  [视频教程](https://www.youtube.com/watch?v=i-XnnP-MptY&t=596s)
   - 进入 [am-cf-tunnel-sub](https://github.com/amclubs/am-cf-tunnel-sub) 项目 -> 根据项目教程部署和使用。(此步已有可忽略)
   - 本频道订阅器转换地址：https://sub.amclubss.com
   
</details>

## 
## 📦三、Pages 上传 部署方法 **(最佳推荐!!!)** [视频教程](https://www.youtube.com/watch?v=i-XnnP-MptY&t=1100s)
 <details>
<summary>点击展开/收起</summary>

1. 部署 Cloudflare Pages：
   - 下载 [_worker.js.zip](https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/_worker.js.zip) 文件，并点上 Star !!!
   - 在 CloudFlare主页的左边菜单的 `计算(Workers)` 选项卡 -> 点击 `Workers 和 Pages` -> 右上方点击 -> `创建应用程序` -> 选择 `Pages`里的 `拖放文件` 点击 `开始使用` -> 填入 `项目名称`(此名称自己命名)后 -> 右边点击 `创建项目` 后 -> 下方 `上传您的项目资产` 点击 `拖放或从计算机中选择` 后  -> 点击 `上传压缩文件` 然后上传你下载好的 [_worker.js.zip](https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/_worker.js.zip) 文件后点击 `部署站点`。
2. 给UUID设置KV存储桶(推荐设置)： 
   - 在 CloudFlare主页的左边菜单的 `存储和数据库` 选项卡 -> 展开选择点击 `Workers KV` -> 右方点击 -> `创建实例(Create Instance)` -> 填入 `命名空间名称`(此名称自己命名) 后 -> 点击 `创建`。(此步已有可忽略)
   - 在 Pages控制台的 `设置` 选项卡 -> 点击 `绑定` -> 右方点击 -> `添加` -> 选择 `KV 命名空间` -> 变量名称 填入 `amclubs`(此名称固定不能变) -> KV 命名空间 选择 在上面创建的 `命名空间名称`后 -> 右下方点击 `保存`。
   - 在 `设置` 选项卡，在右上角点击 `创建部署` 后，重新上传 [_worker.js.zip](https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/_worker.js.zip) 文件后点击 `保存并部署` 即可。
3. 给 Pages绑定 CNAME自定义域：[无域名绑定Cloudflare部署视频教程]->[免费域名教程1](https://youtu.be/wHJ6TJiCF0s) [免费域名教程2](https://youtu.be/yEF1YoLVmig)  [免费域名教程3](https://www.youtube.com/watch?v=XS0EgqckUKo&t=320s)
   - 在 Pages控制台的 `自定义域`选项卡，下方点击 `设置自定义域`。
   - 填入你的自定义次级域名，注意不要使用你的根域名，例如：
     您分配到的域名是 `amclubss.com`，则添加自定义域填入 `vless.amclubss.com`即可，点击 `激活域`即可。    
4. 验证部署是否成功：
   - 访问 `https://[YOUR-WORKERS-URL]` 即可进入登录页面,登录成功就是完成部署(默认登录密码(UUID)是：ec872d8f-72b0-4a04-b612-0327d85e18ed)。
   - 例如 `https://vless.amclubss.com` 然后进入登录页面 -> 输入密码 `ec872d8f-72b0-4a04-b612-0327d85e18ed` -> 点击登录 -> 成功登录。 
5. 修改默认登录密码(UUID)变量，使用KV存储桶(推荐修改，防止别人用你节点)： 
   - `https://vless.amclubss.com` 然后进入登录页面 -> 输入密码 `ec872d8f-72b0-4a04-b612-0327d85e18ed` -> 点击登录 -> 成功登录。 
   - 在登录成功页面 ID选项 -> 填入 `新的UUID` 后,[在线获取UUID](https://1024tools.com/uuid) -> 点击 `保存`。
   - 保存成功后，原登录密码(UUID)已作废不能访问，用新登录密码(UUID)登录访问即可。
6. 订阅连接和节点生成使用方法：  [视频教程](https://www.youtube.com/watch?v=i-XnnP-MptY&t=596s)
   - 进入 [am-cf-tunnel-sub](https://github.com/amclubs/am-cf-tunnel-sub) 项目 -> 根据项目教程部署和使用。(此步已有可忽略)
   - 本频道订阅器转换地址：https://sub.amclubss.com

</details>

## 
## 🧰四、Pages GitHub 部署方法 **(不推荐)** [视频教程](https://www.youtube.com/watch?v=dPH63nITA0M&t=654s)
<details>
<summary>点击展开/收起</summary>
   
1. 部署 Cloudflare Pages：
   - 在 Github 上先 Fork 本项目[am-cf-tunnel](https://github.com/amclubs/am-cf-tunnel)，并点上 Star !!!
   - 在 CloudFlare主页的左边菜单的 `计算(Workers)` 选项卡 -> 点击 `Workers 和 Pages` -> 右上方点击 -> `创建应用程序` -> 选择 `Pages`里的 `导入现有 Git 存储库` 点击 `开始使用` -> 选择GitHub 点击`连接GitHub`根据提示授权GitHub和项目(此步已有可忽略)后 -> 选中 `am-cf-tunnel`项目后 -> 点击 `开始设置` -> 可修改`项目名称`(此名称自己命名) 后 -> 右下方点击 `保存并部署`即可。
2. 给UUID设置KV存储桶(推荐设置)： 
   - 在 CloudFlare主页的左边菜单的 `存储和数据库` 选项卡 -> 展开选择点击 `Workers KV` -> 右方点击 -> `创建实例(Create Instance)` -> 填入 `命名空间名称`(此名称自己命名) 后 -> 点击 `创建`。(此步已有可忽略)
   - 在 Pages控制台的 `设置` 选项卡 -> 点击 `绑定` -> 右方点击 -> `添加` -> 选择 `KV 命名空间` -> 变量名称 填入 `amclubs`(此名称固定不能变) -> KV 命名空间 选择 在上面创建的 `命名空间名称`后 -> 右下方点击 `保存`。
   - 在 `设置` 选项卡，点击 `部署` -> 在所有部署 找到最新一条部署记录 ，在右边点击 3个点 `...` 选择 `重试部署` 即可。
3. 给 Pages绑定 CNAME自定义域：[无域名绑定Cloudflare部署视频教程]->[免费域名教程1](https://youtu.be/wHJ6TJiCF0s) [免费域名教程2](https://youtu.be/yEF1YoLVmig)  [免费域名教程3](https://www.youtube.com/watch?v=XS0EgqckUKo&t=320s)
   - 在 Pages控制台的 `自定义域`选项卡，下方点击 `设置自定义域`。
   - 填入你的自定义次级域名，注意不要使用你的根域名，例如：
     您分配到的域名是 `amclubss.com`，则添加自定义域填入 `vless.amclubss.com`即可，点击 `激活域`即可。    
4. 验证部署是否成功：
   - 访问 `https://[YOUR-WORKERS-URL]` 即可进入登录页面,登录成功就是完成部署(默认登录密码(UUID)是：ec872d8f-72b0-4a04-b612-0327d85e18ed)。
   - 例如 `https://vless.amclubss.com` 然后进入登录页面 -> 输入密码 `ec872d8f-72b0-4a04-b612-0327d85e18ed` -> 点击登录 -> 成功登录。 
5. 修改默认登录密码(UUID)变量，使用KV存储桶(推荐修改，防止别人用你节点)： 
   - `https://vless.amclubss.com` 然后进入登录页面 -> 输入密码 `ec872d8f-72b0-4a04-b612-0327d85e18ed` -> 点击登录 -> 成功登录。 
   - 在登录成功页面 ID选项 -> 填入 `新的UUID` 后,[在线获取UUID](https://1024tools.com/uuid) -> 点击 `保存`。
   - 保存成功后，原登录密码(UUID)已作废不能访问，用新登录密码(UUID)登录访问即可。
6. 订阅连接和节点生成使用方法：  [视频教程](https://www.youtube.com/watch?v=i-XnnP-MptY&t=596s)
   - 进入 [am-cf-tunnel-sub](https://github.com/amclubs/am-cf-tunnel-sub) 项目 -> 根据项目教程部署和使用。(此步已有可忽略)
   - 本频道订阅器转换地址：https://sub.amclubss.com

</details>

## 
## 🔧五、变量说明 [视频教程](https://www.youtube.com/watch?v=i-XnnP-MptY&t=468s)
| 变量名 | 示例 | 必填 | 备注 | YT |
|-----|-----|-----|-----|-----|
| ID   | ec872d8f-72b0-4a04-b612-0327d85e18ed（默认）|✅| 支持Cloudflare的KV存储桶设置 [在线获取UUID](https://1024tools.com/uuid) VLESS、Trojan节点共用 | |
| D_URL | https://cloudflare-dns.com/dns-query |❌| DNS解析获取作用，小白勿用                                                           |  |

## 
## 🧩六、节点订阅配置  [Vercel部署视频教程](https://www.youtube.com/playlist?list=PLGVQi7TjHKXZGODTvB8DEervrmHANQ1AR) [Cloudfare部署视频教程](https://youtu.be/f8ZTvv4u3Pw)

<details>
<summary>点击展开/收起</summary>

#### `①` Vercel方式部署 [视频教程](https://www.youtube.com/watch?v=i-XnnP-MptY&t=596s)
1. Fork或克隆本仓库[am-cf-tunnel-sub](https://github.com/amclubs/am-cf-tunnel-sub)到您的 GitHub/GitLab 账户
2. 登录 [Vercel](https://vercel.com)，点击"New Project" <a href="https://www.youtube.com/watch?v=ZxHLLlxuJyI&t=28s">[点击观看注册视频教程]</a>
3. 导入您的仓库，使用默认设置
4. **⚠️ 重要：在"Settings" > "Environment Variables"中添加 `UUID` 和 `HOST` 变量（必须设置）**
5. 点击"Deploy"

访问 `http://部署域名` 即可。

#### `②` Cloudfare方式部署（Pages GitHub）[视频教程](https://youtu.be/f8ZTvv4u3Pw)
1. 部署 Cloudflare Pages：
   - 在 Github 上先 Fork 本项目[am-cf-tunnel-sub](https://github.com/amclubs/am-cf-tunnel-sub)，并点上 Star !!!
   - 在 CloudFlare主页的左边菜单的 `计算(Workers)` 选项卡 -> 点击 `Workers 和 Pages` -> 右上方点击 -> `创建应用程序` -> 选择 `Pages`里的 `导入现有 Git 存储库` 点击 `开始使用` -> 选择GitHub 点击`连接GitHub`根据提示授权GitHub和项目(此步已有可忽略)后 -> 选中 `am-cf-tunnel-sub`项目后 -> 点击 `开始设置` -> 可修改`项目名称`(此名称自己命名) 后 -> 右下方点击 `保存并部署`即可。
2. 设置节点UUID和HOST变量： 
   - 在 Pages控制台的 `设置` 选项卡 -> 点击 `设置` -> 左方点击 `变量和机密` -> 右方点击  `添加` -> 变量名称 填入 `UUID`(此名称固定不能变) ，值填入CF部署节点ID -> 再点击添加变量 填入 `HOST`(此名称固定不能变)，值填入CF部署的自定义域名 后 -> 右下方点击 `保存`。
   - 在 `设置` 选项卡，点击 `部署` -> 在所有部署 找到最新一条部署记录 ，在右边点击 3个点 `...` 选择 `重试部署` 即可。
3. 给 Pages绑定 CNAME自定义域：[无域名绑定Cloudflare部署视频教程]->[免费域名教程1](https://youtu.be/wHJ6TJiCF0s) [免费域名教程2](https://youtu.be/yEF1YoLVmig)  [免费域名教程3](https://www.youtube.com/watch?v=XS0EgqckUKo&t=320s)
   - 在 Pages控制台的 `自定义域`选项卡，下方点击 `设置自定义域`。
   - 填入你的自定义次级域名，注意不要使用你的根域名，例如：
     您分配到的域名是 `amclubss.com`，则添加自定义域填入 `sub.amclubss.com`即可，点击 `激活域`即可。    
4. 验证部署是否成功：
   - 访问 `https://[YOUR-WORKERS-URL]` 即可进入登录页面,登录成功就是完成部署(默认登录密码(UUID)是：ec872d8f-72b0-4a04-b612-0327d85e18ed)。
   - 例如 `https://sub.amclubss.com` 然后进入登录页面 -> 输入密码 `ec872d8f-72b0-4a04-b612-0327d85e18ed` -> 点击登录 -> 成功登录。 
5. 修改默认登录密码(ID)变量，(强烈要求修改，防止别人用你节点)： 
   - 在 Pages控制台的 `设置` 选项卡 -> 点击 `设置` -> 左方点击 `变量和机密` -> 右方点击  `添加` -> 变量名称 填入 `ID`(此名称固定不能变) ，自己设置复杂的密码 -> 右下方点击 `保存`。
   - 在 `设置` 选项卡，点击 `部署` -> 在所有部署 找到最新一条部署记录 ，在右边点击 3个点 `...` 选择 `重试部署` 即可。
   - 保存成功后，原登录密码(ID)已作废不能访问，用新登录密码(ID)登录访问即可。
6. 本频道订阅器转换地址：https://sub.amclubss.com

7. 变量说明 [视频教程](https://www.youtube.com/watch?v=i-XnnP-MptY&t=808s)

| 变量名 | 示例 | 必填 | 备注 | YT |
|-----|-----|-----|-----|-----|
| ID   | ec872d8f-72b0-4a04-b612-0327d85e18ed（默认）|✅| 订阅器的登录密码 | |
| UUID | ec872d8f-72b0-4a04-b612-0327d85e18ed |✅| Cloudflare部署节点的ID变量值[在线获取UUID](https://1024tools.com/uuid)   |  |
| HOST | vless.amclubss.com |✅| Cloudflare部署节点的域名或自定域名 | |
| IP_URL           | [https://raw.github.../ipUrl.txt](https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/ipUrl.txt)           |❌| （推荐）优选(ipv4、ipv6、域名、API)地址(支持多个之间`,`或 换行 作间隔)，支持文件连接后里带PROXYIP参数，可以实现不同区域优先IP使用不同的PROXYIP固定区域，解决IP乱跳问题  | [视频教程](https://www.youtube.com/watch?v=4fcyJjstFdg&t=349s)|
| PROXYIP          | proxyip.amclubs.kozow.com </br>或</br> [https://raw.github.../proxyip.txt](https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/proxyip.txt)  |❌| 访问CloudFlare的CDN代理节点(支持多PROXYIP, PROXYIP之间使用`,`或 换行 作间隔),支持端口设置默认443 如: proxyip.amclubs.kozow.com:2053 ，支持远程txt或csv文件| [视频教程](https://youtu.be/pKrlfRRB0gU) |
| SOCKS5           | user:password@127.0.0.1:1080         |❌| 优先作为访问CFCDN站点的SOCKS5代理                                                   | [视频教程](https://youtu.be/Bw82BH_ecC4) |
| NAT64           | true/false                           |❌| 默认false,是否开启nat做PROXYIP(反代IP)，开启后优选使用NAT64再用PROXYIP       | [视频教程](https://www.youtube.com/watch?v=nx80sGpVoBM&t=533s) |
| NAT64_PREFIX  | 2602:fc59:b0:64::  </br>或</br> [https://raw.github.../nat64Prefix.txt](https://raw.githubusercontent.com/amclubs/am-cf-tunnel/main/nat64Prefix.txt)    |❌| 指定自定NAT64前缀,不填走CF默认的 (https://amclubss.com/public/)     | [视频教程](https://www.youtube.com/watch?v=nx80sGpVoBM&t=533s)|
| SUB_CONFIG       | [https://raw.github.../ACL4SSR_Online_Mini.ini](https://raw.githubusercontent.com/amclubs/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_MultiMode.ini) |❌| clash、singbox等 订阅转换配置文件  ||
| SUB_CONVERTER    | url.v1.mk                    |❌| clash、singbox等 订阅转换后端的api地址                               ||
| PROT_TYPE        | 默认空          |❌|      默认空,就是生成vless和trojan节点，vless(只生成vless节点)，trojan(只生成trojan节点)           | [视频教程](https://www.youtube.com/watch?v=emEBm8Gw2wI&t=922s) |
| HOST_REAMRK           | true/false                            |❌ | 默认false,是否用订阅域名做节点别名                                      ||

- 本频道订阅器转换地址：https://sub.amclubss.com
  
</details>

## 
## 🛠已适配订阅工具 [点击进入视频教程](https://youtu.be/xGOL57cmvaw) [点进进入karing视频教程](https://youtu.be/M3vLLBWfuFg)
<details>
<summary>点击展开/收起</summary>

- Mac（苹果电脑）
   - [v2rayU](https://github.com/yanue/V2rayU/releases) | [clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev/releases) | [Quantumult X](https://apps.apple.com/us/app/quantumult-x/id1443988620) |  [小火箭](https://apps.apple.com/us/app/shadowrocket/id932747118) | [surge](https://apps.apple.com/us/app/surge-5/id1442620678) | [karing](https://karing.app/download) | [sing-box](https://github.com/SagerNet/sing-box/releases)  | [Clash Nyanpasu](https://github.com/keiko233/clash-nyanpasu/releases) | [openclash](https://github.com/vernesong/OpenClash/releases) | [Hiddify](https://github.com/hiddify/hiddify-next/releases)

- Win（win系统电脑）
   - [v2rayN](https://github.com/2dust/v2rayN/releases) |  [clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev/releases) | [sing-box](https://github.com/SagerNet/sing-box/releases) |  [Clash Nyanpasu](https://github.com/keiko233/clash-nyanpasu/releases) | [openclash](https://github.com/vernesong/OpenClash/releases)  | [karing](https://karing.app/download) |  [Hiddify](https://github.com/hiddify/hiddify-next/releases)
     
- IOS（苹果手机）
   - [clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev/releases) |  [Quantumult X](https://apps.apple.com/us/app/quantumult-x/id1443988620)  |  [小火箭](https://apps.apple.com/us/app/shadowrocket/id932747118)  |  [surge](https://apps.apple.com/us/app/surge-5/id1442620678) |  [sing-box](https://github.com/SagerNet/sing-box/releases) | [Clash Nyanpasu](https://github.com/keiko233/clash-nyanpasu/releases) | [karing](https://karing.app/download) | [Hiddify](https://github.com/hiddify/hiddify-next/releases)
     
- Android（安卓手机）
   - [v2rayNG](https://github.com/2dust/v2rayNG/releases) |  [clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev/releases) | [sing-box](https://github.com/SagerNet/sing-box/releases) |  [Clash Nyanpasu](https://github.com/keiko233/clash-nyanpasu/releases) |  [karing](https://karing.app/download) | [Hiddify](https://github.com/hiddify/hiddify-next/releases)

- 软路由
   - [openclash(clash.meta)](https://github.com/vernesong/OpenClash/releases) 
  
</details>

##
### 🙏感谢
[3Kmfi6HP](https://github.com/3Kmfi6HP/EDtunnel)、[ACL4SSR](https://github.com/ACL4SSR/ACL4SSR/tree/master/Clash/config)

###  🌟推荐
**【流量光】** 中转+专线高速机场 (**9.9元300G每月**) (**75元包年每月300G**) (**55元1000GB不限时**)✅畅爽晚高峰 解锁ChatGPT、全流媒体(送小火箭)
</br>🌐官网：[https://llgjc1.com](https://llgjc1.com/#/register?code=bIUDEPTu)

# 
<center>
<details><summary><strong> ☕ [点击展开] 赞赏支持 ~🧧</strong></summary>
*我非常感谢您的赞赏和支持，它们将极大地激励我继续创新，持续产生有价值的工作。*

- **USDT-TRC20:** `TWTxUyay6QJN3K4fs4kvJTT8Zfa2mWTwDD`
- **TRX-TRC20:** `TWTxUyay6QJN3K4fs4kvJTT8Zfa2mWTwDD`

<div align="center"> 
  <img src="https://github.com/user-attachments/assets/e6cdc42a-6374-4722-b833-601738f72196" width="200"></br> 
  TRC10/TRC20扫码支付 
</div> 
</details>
</center>

# 
 ⚠️免责声明:
 - 1、该项目设计和开发仅供学习、研究和安全测试目的。请于下载后 24 小时内删除, 不得用作任何商业用途, 文字、数据及图片均有所属版权, 如转载须注明来源。
 - 2、使用本程序必循遵守部署服务器所在地区的法律、所在国家和用户所在国家的法律法规。对任何人或团体使用该项目时产生的任何后果由使用者承担。
 - 3、作者不对使用该项目可能引起的任何直接或间接损害负责。作者保留随时更新免责声明的权利，且不另行通知。
 
