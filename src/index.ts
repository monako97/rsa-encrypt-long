import JSEncrypt from "jsencrypt";
import { parseBigInt } from "jsencrypt/lib/lib/jsbn/jsbn";
interface IJSEncryptOptions {
  default_key_size?: number; // 默认值：1024位的密钥大小
  default_public_exponent?: string; // 默认值：'010001', 公共指数的十六进制表示形式
  log?: boolean; // 默认值：false，是否发出日志警告/错误
}

/**
 * RSA 长数据 加密 解密
 * @example
 * ```javascript
 * import { Encrypt } from 'rsa-encrypt-long';
 * const encrypt = new Encrypt();
 * // RSA 加密
 * encrypt.setPublicKey(public_key); // 设置公钥
 * encrypt.encryptLong(string); // 加密
 * // RSA 解密
 * encrypt.setPrivateKey(private_key); // 设置私钥
 * encrypt.decryptLong(string); // 解密
 * ```
 */
export class Encrypt extends JSEncrypt {
  /**
   * 设置rsa密钥参数
   * （一种方法足以设置公共密钥和私有密钥，因为私有密钥包含公共密钥参数）。
   * 如果启用了日志，则记录警告
   * @param {Object|string} key pem编码的字符串或对象（带有或不带有页眉/页脚）
   * @public
   */
  setKey!: (key: string) => void;
  /**
   * 返回私钥的pem编码表示形式
   * 如果密钥不存在，将创建一个新密钥
   * @returns {string} pem编码的私钥（带有页眉/页脚）
   * @public
   */
  getPrivateKey!: () => string;
  /**
   * 返回私钥的pem编码表示形式
   * 如果密钥不存在，将创建一个新密钥
   * @returns {string} pem编码的私钥（不带有页眉/页脚）
   * @public
   */
  getPrivateKeyB64!: () => string;
  /**
   * setKey的代理方法，用于api兼容性
   * @see setKey
   * @public
   */
  setPrivateKey!: (privkey: string) => void;
  /**
   * 返回公钥的pem编码表示形式
   * 如果密钥不存在，将创建一个新密钥
   * @returns {string} pem编码的公钥（带有页眉/页脚）
   * @public
   */
  getPublicKey!: () => string;
  /**
   * 返回公钥的pem编码表示形式
   * 如果密钥不存在，将创建一个新密钥
   * @returns {string} pem编码的公钥（不带有页眉/页脚）
   * @public
   */
  getPublicKeyB64!: () => string;
  /**
   * setKey的代理方法，用于api兼容性
   * @see setKey
   * @public
   */
  setPublicKey!: (pubkey: string) => void;
  /**
   * RSAKey对象加密，使用rsa密钥对象的公钥加密字符串。
   * 请注意，如果未设置对象，则将使用JSEncrypt构造函数中传递的参数（通过getKey方法）动态创建
   * @param {string} str 要加密的字符串
   * @return {string} 以base64编码的加密字符串
   * @public
   */
  encrypt!: (key: string) => string;
  /**
   * RSAKey对象签名
   * @param {string} str 要签名的字符串
   * @param {function} digestMethod hash 方法
   * @param {string} digestName hash 算法的名称
   * @return {string} 以base64编码的签名
   * @public
   */
  sign!: (
    str: string,
    digestMethod: (str: string) => string,
    digestName: string
  ) => string | false;
  /**
   * RSAKey对象验证
   * @param {string} str 要验证的字符串
   * @param {string} signature 以base64编码的签名
   * @param {function} digestMethod hash 方法
   * @return {boolean} 数据和签名是否匹配
   * @public
   */
  verify!: (
    str: string,
    signature: string,
    digestMethod: (str: string) => string
  ) => boolean;
  /**
   * 当前JSEncryptRSAKey对象的Getter。
   * 如果不存在，将创建一个新对象并返回
   * @param {callback} [cb] 如果希望以异步方式生成密钥，则调用该回调
   * @returns {JSEncryptRSAKey} JSEncryptRSAKey对象
   * @public
   */
  getKey!: (cb?: () => void) => any;

  constructor(options?: IJSEncryptOptions) {
    super(options);
  }
  /**
   * 十六进制转字节
   * @param {string} hex 十六进制
   * @returns {number[]} bytes
   */
  hexToBytes(hex: string): number[] {
    const bytes = [];

    for (let c = 0, len = hex.length; c < len; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
  }
  /**
   * 字节转十六进制
   * @param {number[]} bytes 字节
   * @returns {string} 十六进制
   */
  bytesToHex(bytes: number[]): string {
    const hex = [];

    for (let i = 0, len = bytes.length; i < len; i++) {
      hex.push((bytes[i] >>> 4).toString(16));
      hex.push((bytes[i] & 0xf).toString(16));
    }
    return hex.join("");
  }
  /**
   * RSAKey对象长数据加密
   * @param {string} string 要加密的字符串
   * @return {string} 以base64编码的加密字符串
   * @public
   */
  encryptLong(string: string): string {
    const k = this.getKey();

    try {
      let ct = "";
      // RSA每次加密117bytes，需要辅助方法判断字符串截取位置
      // 1.获取字符串截取点
      const bytes = [];

      bytes.push(0);
      let byteNo = 0,
        c;

      for (let j = 0, len = string.length; j < len; j++) {
        c = string.charCodeAt(j);
        if (c >= 0x010000 && c <= 0x10ffff) byteNo += 4;
        else if (c >= 0x000800 && c <= 0x00ffff) byteNo += 3;
        else if (c >= 0x000080 && c <= 0x0007ff) byteNo += 2;
        else byteNo += 1;
        const so = byteNo % 117;

        if (so >= 114 || so === 0) {
          bytes.push(j);
        }
      }
      // 2.截取字符串并分段加密
      if (bytes.length > 1) {
        for (let i = 0, len = bytes.length - 1; i < len; i++) {
          let str;

          if (i === 0) str = string.substring(0, bytes[i + 1] + 1);
          else str = string.substring(bytes[i] + 1, bytes[i + 1] + 1);
          const t1 = k.encrypt(str);

          ct += t1;
        }
        if (bytes[bytes.length - 1] !== string.length - 1) {
          const lastStr = string.substring(bytes[bytes.length - 1] + 1);

          ct += k.encrypt(lastStr);
        }
        return ct;
      }
      return k.encrypt(string);
    } catch (e) {
      return "";
    }
  }
  /**
   * RSAKey对象长数据解密
   * @param {string} encryptString 以base64编码的加密字符串
   * @param {'public' | 'private'} type 使用公、私钥解密
   * @return {string} 解密的字符串
   * @public
   */
  decryptLong(encryptString: string, type: 'public' | 'private' = 'private'): string {
    const k = this.getKey(),
      MAX_DECRYPT_BLOCK = (k.n.bitLength() + 7) >> 3;

    try {
      /**
       * offSet 开始长度
       * endOffSet 结束长度*/
      let ct = "",
        t1: string,
        bufTmp: number[],
        hexTmp: string,
        offSet = 0,
        endOffSet = MAX_DECRYPT_BLOCK;
      const buf = this.hexToBytes(encryptString),
        inputLen = buf.length;

      // 分段解密
      while (inputLen - offSet > 0) {
        if (inputLen - offSet > MAX_DECRYPT_BLOCK) {
          bufTmp = buf.slice(offSet, endOffSet);
          hexTmp = this.bytesToHex(bufTmp);
          t1 = k.decrypt(hexTmp, type);
          ct += t1;
        } else {
          bufTmp = buf.slice(offSet, inputLen);
          hexTmp = this.bytesToHex(bufTmp);
          t1 = k.decrypt(hexTmp, type);
          ct += t1;
        }
        offSet += MAX_DECRYPT_BLOCK;
        endOffSet += MAX_DECRYPT_BLOCK;
      }
      return ct;
    } catch (e) {
      return "";
    }
  }
  /**
   * RSAKey对象解密，使用rsa密钥对象的私钥解密字符串。
   * 请注意，如果未设置对象，则将使用JSEncrypt构造函数中传递的参数（通过getKey方法）动态创建
   * @param {string} str 以base64编码的加密字符串
   * @param {'public' | 'private'} type 使用公、私钥解密
   * @return {string} 解密的字符串
   * @public
   */
  decrypt(ctext: string, type: 'public' | 'private'): string | null {
    var c = parseBigInt(ctext, 16);
    var m;
    if (type === 'public') {
      m = this.doPublic(c);
    } else {
      m = this.doPrivate(c);
    }
    if (m == null) {
        return null;
    }
    return pkcs1unpad2(m, (this.n.bitLength() + 7) >> 3, type);
}
}

function pkcs1unpad2(d: { toByteArray: () => any; }, n: number, type: 'public' | 'private') {
  var b = d.toByteArray();
  var i = 0;
  while (i < b.length && b[i] == 0) {
      ++i;
  }
  if (type === 'private') {
    if (b.length - i != n - 1 || b[i] != 2) {
        return null;
    }
  }
  ++i;
  while (b[i] != 0) {
      if (++i >= b.length) {
          return null;
      }
  }
  var ret = "";
  while (++i < b.length) {
      var c = b[i] & 255;
      if (c < 128) { // utf-8 decode
          ret += String.fromCharCode(c);
      }
      else if ((c > 191) && (c < 224)) {
          ret += String.fromCharCode(((c & 31) << 6) | (b[i + 1] & 63));
          ++i;
      }
      else {
          ret += String.fromCharCode(((c & 15) << 12) | ((b[i + 1] & 63) << 6) | (b[i + 2] & 63));
          i += 2;
      }
  }
  return ret;
}