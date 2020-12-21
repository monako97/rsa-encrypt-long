# encrypt-long-unit

# RSA 长数据 加密 解密

> 基于 `jsencrypt` 实现的 RSA 长数据加解密, 补充类型声明

### 安装

```npm
npm install rsa-encrypt-long -S
```

### 使用

```javascript
import { Encrypt } from "rsa-encrypt-long";
const encrypt = new Encrypt();
// RSA 加密
// 设置公钥
encrypt.setPublicKey(public_key);
// 加密
encrypt.encryptLong(string);
// RSA 解密
// 设置私钥
encrypt.setPrivateKey(private_key);
// 解密
encrypt.decryptLong(string);
```

- setKey: (key: string) => void; 设置 rsa 密钥参数
- getPrivateKey: () => string; 返回私钥的 pem 编码表示形式
- getPrivateKeyB64: () => string; 返回私钥的 pem 编码表示形式
- setPrivateKey: (privkey: string) => void; setKey 的代理方法，用于 api 兼容性
- getPublicKey: () => string; 返回公钥的 pem 编码表示形式
- getPublicKeyB64: () => string; 返回公钥的 pem 编码表示形式
- setPublicKey: (pubkey: string) => void; setKey 的代理方法，用于 api 兼容性
- encrypt: (key: string) => string; RSAKey 对象加密的方法，使用 rsa 密钥对象的公钥加密字符串。
- decrypt: (str: string) => string; RSAKey 对象解密的代理方法，使用 rsa 密钥对象的私钥解密字符串。
- sign: (str: string, digestMethod: (str: string) => string, digestName: string) => string | false; RSAKey 对象签名
- verify: (str: string, signature: string, digestMethod: (str: string) => string) => boolean; RSAKey 对象验证
- getKey: (cb?: () => void) => any; 当前 JSEncryptRSAKey 对象的 Getter。
- encryptLong(string: string): string; RSA 长数据加密
- decryptLong(encryptString: string): string; RSA 长数据解密
