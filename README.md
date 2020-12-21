# encrypt-long-unit

# RSA 长数据 加密 解密

> 基于 `jsencrypt` 实现的 RSA 长数据加解密, 补充类型声明

```javascript
import Encrypt from "./encrypt-util";
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
