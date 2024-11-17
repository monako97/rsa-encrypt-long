# rsa-encrypt-long

基于 `jsencrypt` 的 RSA 长数据加解密工具，支持 TypeScript。

[![version][version-tag]][npm-url]
[![install size][size-tag]][size-url]
[![download][download-tag]][npm-url]

## 安装

```bash
npm install rsa-encrypt-long --save
```

## 基础使用

```typescript
import { Encrypt } from "rsa-encrypt-long";

// 方式一：初始化时直接传入密钥
const encrypt = new Encrypt({
  publicKey: 'YOUR_PUBLIC_KEY',  // 公钥
  privateKey: 'YOUR_PRIVATE_KEY' // 私钥
});
// 或者
// 方式二：分步设置密钥
const encrypt = new Encrypt();
encrypt.setPublicKey('YOUR_PUBLIC_KEY');
encrypt.setPrivateKey('YOUR_PRIVATE_KEY');

// 加密示例
const data = "需要加密的数据";
const encrypted_text = encrypt.encryptLong(data);
console.log('加密结果:', encrypted_text);

// 解密示例
const decrypted_text = encrypt.decryptLong(encrypted_text);
console.log('解密结果:', decrypted_text);
```

## API 文档

### 密钥管理
- `setPublicKey(pubkey: string): void` - 设置 RSA 公钥
- `setPrivateKey(privkey: string): void` - 设置 RSA 私钥
- `getPublicKey(): string` - 获取 PEM 格式公钥
- `getPrivateKey(): string` - 获取 PEM 格式私钥

### 加解密
- `encryptLong(data: string): string` - RSA 长数据加密
- `decryptLong(encrypted: string): string` - RSA 长数据解密
- `encrypt(data: string): string` - 标准 RSA 加密
- `decrypt(encrypted: string): string` - 标准 RSA 解密

### 数字签名
- `sign(data: string, digestMethod: (str: string) => string, digestName: string): string | false` - 数字签名
- `verify(data: string, signature: string, digestMethod: (str: string) => string): boolean` - 签名验证

[npm-url]: https://npmjs.org/package/rsa-encrypt-long
[version-tag]: https://img.shields.io/npm/v/rsa-encrypt-long/latest.svg?logo=npm
[size-tag]: https://packagephobia.com/badge?p=rsa-encrypt-long@latest
[size-url]: https://packagephobia.com/result?p=rsa-encrypt-long@latest
[download-tag]: https://img.shields.io/npm/dm/rsa-encrypt-long.svg?logo=docusign
