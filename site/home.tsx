import { createMemo, createSignal } from 'solid-js';
import { Encrypt } from 'rsa-encrypt-long';

import Readme from '../README.md?raw';

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw0uFvORTj1y5R0dogYcs
cK6bv1dTJmsdt60Gg/IIvL2c9O4rtyw5Ngu0eFgmWq/p92BlpFEXdgstx7j+Ds8U
qE9bTUUhRzeOcPNipwkFSsPTDoLihvPNGBaXzh5qq3w5751zG1bCIerXqH7+CGXj
K5GXUZhEqyrW56wHpBXgHizMm71Ilnk+64FXuMIRUqibJLwm31AofR9QN82QyMXn
c/mprjUIZgYyO7BdnxOySTxFkEEl2emGJdLo4qhWcYkmTzFzWuckV4fL8S6z3Lut
lh7ecrD1bCFL9bm5oFVHMqP0OLbL+wY2IWdgAjwj0i7cdCEuPUvuG2n7kMIvg/fX
fwIDAQAB
-----END PUBLIC KEY-----`;
const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDDS4W85FOPXLlH
R2iBhyxwrpu/V1Mmax23rQaD8gi8vZz07iu3LDk2C7R4WCZar+n3YGWkURd2Cy3H
uP4OzxSoT1tNRSFHN45w82KnCQVKw9MOguKG880YFpfOHmqrfDnvnXMbVsIh6teo
fv4IZeMrkZdRmESrKtbnrAekFeAeLMybvUiWeT7rgVe4whFSqJskvCbfUCh9H1A3
zZDIxedz+amuNQhmBjI7sF2fE7JJPEWQQSXZ6YYl0ujiqFZxiSZPMXNa5yRXh8vx
LrPcu62WHt5ysPVsIUv1ubmgVUcyo/Q4tsv7BjYhZ2ACPCPSLtx0IS49S+4bafuQ
wi+D99d/AgMBAAECggEAGTvk5+dItLlyZzde1X21zEmDblHGOKyWhmkg8mOPpXOK
mEs98skQC1+vzez157nbLU+TUov30BTZsXjBuwAe1zCJx44rIpyXFxkboiGUQXjU
CIf45R8TXQ1uR/++ILJIeiGKAfpP0zoY63idMlCX7cU+HBjkpok+g2jDA/yfnMZL
SXrOxbmG9P/tAhU8HJTTV6Xh+oMOrivnnh97wc1RlAx9OxCej4eSU5xnomMeezc0
7/PxnpaLOCUJbt1fuEct51Z/rMH1bU1GrVSF1mEdb9HB5s2jO5uoL6nI9GJPF4D4
Z4KuLbu+ytsr/iKHa1+Y8p7POMEW6LkAtS+7lbGfAQKBgQDnDfABDPHM5xKr4HCv
GMY/d40NfHNlcRFWOl/gqD8fwPWvaMnOSAjSSLxKamdjFXaYn8Jg/FT2JNdjzona
VgOmwtH4/XbTwCScSI3b5ugeEPmG5pPemCEGQJSvLqGXavSYzKway363mAMyUdHc
TPxXQj3c/9LPeS4687gbfsh7HwKBgQDYYTzi6SwgMe8nnMEseun6jwlSNZrSPyDJ
b/jwDta7FOcomWgIp2r/mIoLvq/pMPCZfutQGHddYCS1NcXEnPIGEAyNfmbv/nSZ
ocJ8c9zgohJN+iuJ6XBBfukK+7NW9zT7ol15qw6saOx/J1R3On6xoOe8ZMO9t6PT
iFkE+3l3oQKBgH74K8GICYBeIuaMqZ+u75KE8eBNWWSPY8WMwo9EJZwff2NrJCrV
bvOPwNjr6/CJJOjuMfT19QJmcG6KWzq+Nbd4K8a2Eox+dB/lxv7mvvt2vIijQPL7
inpTFuHFsErzHYKyRola9kGRqYAHclmrfKe+4RwHASO+JeeDctK5MxZlAoGBAIru
5IlN7mc9qLFmlSJaSaH39aQzhxU4M3Uj0FNTM80rvsDyvznPRYSYDQs9hPXV1qa4
N59WFk5+TRONU07K9xutcmHnp3CxkWyT0KzYOBqD9fzbhNkoakujkT7cHmrYj8yC
lEJq8yEAvdlnB3UGuhKTnjf4+zX1k9te0MnCLlwBAoGBAJMJu1QQawF1Kp3qY6M2
+fB9GDLfgqS3m86UqT2pTEjD8JgKILgXJJmzsIJUswMj1xxqyaxkYHmiOwbUJs3B
kRA93jE3iWXbDolw3q10Y8W/ldppx6McD/Wz7ezoOAoQdIj/dU4elSqgmOYT4i9t
vTnpIYFaoR/GqNKMhY5dj4W0
-----END PRIVATE KEY-----`;

function Home() {
  const [text, setText] = createSignal(
    JSON.stringify(
      {
        username: 'moneko',
        password: '123456',
        remember: true,
      },
      null,
      4,
    ),
  );
  const [encrypted, setEncrypted] = createSignal('');

  const encrypt = new Encrypt({
    default_key_size: '2048',
    publicKey,
    privateKey,
  });
  const handleEncrypt = (e: CustomEvent<string>) => {
    setText(e.detail);
  };
  const handleDecrypt = (e: CustomEvent<string>) => {
    setEncrypted(e.detail);
  };
  const encryptedText = createMemo(() => encrypt.encryptLong(text()));
  const decryptedText = createMemo(() => encrypt.decryptLong(encrypted()));

  return (
    <>
      <n-md text={Readme} not-render={true} line-number={false} picture-viewer={false} />
      <div
        style={{
          background: 'var(--component-bg)',
          padding: '24px',
          'border-radius': 'var(--border-radius)',
          'box-shadow': '0 0.125rem 0.5rem 0 var(--primary-shadow)',
          'margin-block-end': '24px',
        }}
      >
        <h2>加密案例</h2>
        <p>这里我们使用的RSA密钥大小为 2048</p>
        <div style={{ display: 'flex', gap: '24px', 'flex-wrap': 'wrap' }}>
          <div>
            <n-typography>私钥</n-typography>
            <n-code toolbar={true} language="js" code={privateKey} />
          </div>
          <div>
            <n-typography>公钥</n-typography>
            <n-code toolbar={true} language="js" code={publicKey} />
          </div>
        </div>
        <n-typography>源数据</n-typography>
        <n-typography>在代码框中输入数据，查看加密结果</n-typography>
        <n-code toolbar={true} edit={true} language="js" code={text()} onChange={handleEncrypt} />
        <n-typography type="success">加密结果</n-typography>
        <div>{encryptedText()}</div>
        <h2>解密案例</h2>
        <n-typography>将密文粘贴到代码框中, 查看解密结果</n-typography>
        <n-code
          toolbar={true}
          edit={true}
          language="js"
          code={encrypted()}
          onChange={handleDecrypt}
        />
        <n-typography type="success">解密结果</n-typography>
        <pre>{decryptedText()}</pre>
      </div>
    </>
  );
}

export default Home;
