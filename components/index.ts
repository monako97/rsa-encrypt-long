import JSEncrypt from 'jsencrypt';

/**
 * JSEncrypt 加密库的基础配置选项
 */
export interface JSEncryptOptions {
  /**
   * RSA密钥大小
   * @default "1024"
   * @description 密钥长度越长安全性越高，但加解密速度会相应变慢
   */
  default_key_size?: string;

  /**
   * RSA公共指数
   * @default "010001"
   * @description 公共指数的十六进制表示形式，通常使用 65537 (0x010001)
   */
  default_public_exponent?: string;

  /**
   * 是否启用日志
   * @default false
   * @description 当设置为true时，会输出警告和错误信息到控制台
   */
  log?: boolean;
}

/**
 * RSA加密类的配置选项
 * @extends JSEncryptOptions
 */
export interface EncryptOptions extends JSEncryptOptions {
  /**
   * RSA公钥
   * @description PEM格式的公钥字符串
   */
  publicKey?: string;

  /**
   * RSA私钥
   * @description PEM格式的私钥字符串
   */
  privateKey?: string;
}
interface IRSAKeyWithN {
  n: { bitLength(): number };
}
interface IRSAKey {
  decrypt(text: string, type?: 'public' | 'private'): string | false;
}
export class Encrypt extends JSEncrypt {
  private static readonly cache = new Map<string, string>();
  private static readonly CACHE_MAX_SIZE = 100;
  private static readonly CHUNK_SIZE = 117; // RSA最大加密块大小

  private readonly blockSize: number;
  private readonly chunkCache = new Map<string, string>();

  constructor(options?: EncryptOptions) {
    super(options);
    const key = this.getKey();

    this.blockSize = key ? ((key as unknown as IRSAKeyWithN).n.bitLength() + 7) >> 3 : 0;

    if (options?.publicKey) {
      this.setPublicKey(options.publicKey);
    }
    if (options?.privateKey) {
      this.setPrivateKey(options.privateKey);
    }
  }

  /**
   * 优化后的长文本加密
   */
  public encryptLong(plaintext: string): string {
    const cacheKey = `encrypt:${plaintext}`;
    const cached = Encrypt.cache.get(cacheKey);

    if (cached) return cached;

    const key = this.getKey();

    if (!key) return '';

    try {
      // 预分配结果数组
      const chunks = this.splitString(plaintext, Encrypt.CHUNK_SIZE);
      const results = new Array(chunks.length);

      // 批量加密
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const chunkCacheKey = `chunk:${chunk}`;

        // 检查chunk缓存
        let encrypted = this.chunkCache.get(chunkCacheKey);

        if (!encrypted) {
          encrypted = key.encrypt(chunk);
          this.chunkCache.set(chunkCacheKey, encrypted);
        }

        results[i] = encrypted;
      }

      const encrypted = results.join('');

      Encrypt.updateCache(cacheKey, encrypted);
      return encrypted;
    } catch {
      return '';
    }
  }

  /**
   * 优化后的长文本解密
   */
  public decryptLong(ciphertext: string, type: 'public' | 'private' = 'private'): string {
    const cacheKey = `decrypt:${ciphertext}:${type}`;
    const cached = Encrypt.cache.get(cacheKey);

    if (cached) return cached;

    const key = this.getKey();

    if (!key) return '';

    try {
      const blockSize = this.blockSize;
      const bytes = Encrypt.utils.hexToBytes(ciphertext);

      // 预分配结果数组
      const chunkCount = Math.ceil(bytes.length / blockSize);
      const results = new Array(chunkCount);

      // 批量解密
      for (let i = 0; i < chunkCount; i++) {
        const start = i * blockSize;
        const end = Math.min(start + blockSize, bytes.length);
        const chunk = bytes.slice(start, end);

        // 生成chunk缓存键
        const hexChunk = Encrypt.utils.bytesToHex(chunk);
        const chunkCacheKey = `chunk:${hexChunk}:${type}`;

        // 检查chunk缓存
        let decrypted = this.chunkCache.get(chunkCacheKey);

        if (!decrypted) {
          decrypted = (key as IRSAKey).decrypt(hexChunk, type) || '';
          this.chunkCache.set(chunkCacheKey, decrypted);
        }

        results[i] = decrypted;
      }

      const result = results.join('');

      Encrypt.updateCache(cacheKey, result);
      return result;
    } catch {
      return '';
    }
  }

  /**
   * 优化的字符串分割
   */
  private splitString(str: string, size: number): string[] {
    const chunks: string[] = [];
    let offset = 0;
    let byteCount = 0;

    for (let i = 0; i < str.length; i++) {
      byteCount += Encrypt.utils.getByteLength(str[i]);

      if (byteCount >= size || i === str.length - 1) {
        chunks.push(str.slice(offset, i + 1));
        offset = i + 1;
        byteCount = 0;
      }
    }

    return chunks;
  }

  /**
   * 优化的工具方法
   */
  private static utils = {
    hexToBytes(hex: string): number[] {
      const len = hex.length >> 1;
      const bytes = new Array(len);

      // 使用查找表优化转换
      const lookup: { [key: string]: number } = {
        '0': 0,
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        a: 10,
        b: 11,
        c: 12,
        d: 13,
        e: 14,
        f: 15,
        A: 10,
        B: 11,
        C: 12,
        D: 13,
        E: 14,
        F: 15,
      };

      for (let i = 0; i < len; i++) {
        const high = lookup[hex[i * 2]];
        const low = lookup[hex[i * 2 + 1]];

        bytes[i] = (high << 4) | low;
      }

      return bytes;
    },

    bytesToHex(bytes: number[]): string {
      // 使用查找表优化转换
      const lookup = [
        '00',
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '0a',
        '0b',
        '0c',
        '0d',
        '0e',
        '0f',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '1a',
        '1b',
        '1c',
        '1d',
        '1e',
        '1f',
      ];

      const hex = new Array(bytes.length);

      for (let i = 0; i < bytes.length; i++) {
        const byte = bytes[i];

        hex[i] = lookup[byte] || (byte >>> 4).toString(16) + (byte & 0xf).toString(16);
      }

      return hex.join('');
    },

    getByteLength(char: string): number {
      const code = char.charCodeAt(0);

      if (code >= 0x010000) return 4;
      if (code >= 0x000800) return 3;
      if (code >= 0x000080) return 2;
      return 1;
    },
  };

  private static updateCache(key: string, value: string): void {
    if (Encrypt.cache.size >= Encrypt.CACHE_MAX_SIZE) {
      const firstKey = Encrypt.cache.keys().next().value;

      Encrypt.cache.delete(firstKey);
    }
    Encrypt.cache.set(key, value);
  }
}
