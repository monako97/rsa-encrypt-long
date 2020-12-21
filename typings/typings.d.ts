declare module "jsencrypt" {
  export interface IJSEncryptOptions {
    default_key_size?: number; // 默认值：1024位的密钥大小
    default_public_exponent?: string; // 默认值：'010001', 公共指数的十六进制表示形式
    log?: boolean; // 默认值：false，是否发出日志警告/错误
  }

  export class JSEncrypt {
    constructor(options?: IJSEncryptOptions);

    /**
     * 设置rsa密钥参数的方法
     * （一种方法足以设置公共密钥和私有密钥，因为私有密钥包含公共密钥参数）。
     * 如果启用了日志，则记录警告
     * @param {Object|string} key pem编码的字符串或对象（带有或不带有页眉/页脚）
     * @public
     */
    public setKey(key: string): void;

    /**
     * 返回私钥的pem编码表示形式
     * 如果密钥不存在，将创建一个新密钥
     * @returns {string} pem编码的私钥（带有页眉/页脚）
     * @public
     */
    public getPrivateKey(): string;

    /**
     * 返回私钥的pem编码表示形式
     * 如果密钥不存在，将创建一个新密钥
     * @returns {string} pem编码的私钥（不带有页眉/页脚）
     * @public
     */
    public getPrivateKeyB64(): string;

    /**
     * setKey的代理方法，用于api兼容性
     * @see setKey
     * @public
     */
    public setPrivateKey(privkey: string): void;

    /**
     * 返回公钥的pem编码表示形式
     * 如果密钥不存在，将创建一个新密钥
     * @returns {string} pem编码的公钥（带有页眉/页脚）
     * @public
     */
    public getPublicKey(): string;

    /**
     * 返回公钥的pem编码表示形式
     * 如果密钥不存在，将创建一个新密钥
     * @returns {string} pem编码的公钥（不带有页眉/页脚）
     * @public
     */
    public getPublicKeyB64(): string;

    /**
     * setKey的代理方法，用于api兼容性
     * @see setKey
     * @public
     */
    public setPublicKey(pubkey: string): void;

    /**
     * RSAKey对象解密的代理方法，使用rsa密钥对象的私有组件解密字符串。
     * 请注意，如果未设置对象，则将使用JSEncrypt构造函数中传递的参数（通过getKey方法）动态创建
     * @param {string} str 要加密的字符串
     * @return {string} 以base64编码的加密字符串
     * @public
     */
    public encrypt(key: string): string;

    /**
     * RSAKey对象解密的代理方法，使用rsa密钥对象的私有组件解密字符串。
     * 请注意，如果未设置对象，则将使用JSEncrypt构造函数中传递的参数（通过getKey方法）动态创建
     * @param {string} str 以base64编码的加密字符串
     * @return {string} 解密的字符串
     * @public
     */
    public decrypt(str: string): string;

    /**
     * RSAKey对象签名
     * @param {string} str 要签名的字符串
     * @param {function} digestMethod hash 方法
     * @param {string} digestName hash 算法的名称
     * @return {string} 以base64编码的签名
     * @public
     */
    public sign(
      str: string,
      digestMethod: (str: string) => string,
      digestName: string
    ): string | false;

    /**
     * RSAKey对象验证
     * @param {string} str 要验证的字符串
     * @param {string} signature 以base64编码的签名
     * @param {function} digestMethod hash 方法
     * @return {boolean} 数据和签名是否匹配
     * @public
     */
    public verify(
      str: string,
      signature: string,
      digestMethod: (str: string) => string
    ): boolean;

    /**
     * 当前JSEncryptRSAKey对象的Getter。
     * 如果不存在，将创建一个新对象并返回
     * @param {callback} [cb] 如果希望以异步方式生成密钥，则调用该回调
     * @returns {JSEncryptRSAKey} JSEncryptRSAKey对象
     * @public
     */
    public getKey(cb?: () => void): JSEncryptRSAKey;
  }
}
