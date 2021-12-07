# brpix-api-node
Essa é uma lib para fluxo de pagamento com o PIX. Utiliza para os testes o (PSP) endpoint da [GERENCIANET.COM.BR](https://gerencianet.com.br/pix/)

![standard-image](https://img.shields.io/badge/code%20style-standard-brightgreen.svg) [![Coverage Status](https://coveralls.io/repos/github/leguass7/brpix-api-node/badge.svg?branch=master)](https://coveralls.io/github/leguass7/brpix-api-node?branch=master) [![NPM](https://img.shields.io/npm/v/brpix-api-node.svg)](https://www.npmjs.com/package/brpix-api-node) [![ci](https://github.com/leguass7/brpix-api-node/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/leguass7/brpix-api-node/actions/workflows/deploy.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
## Como utilizar?
 - 1) Crie uma conta de desenvolvedor na [GERENCIANET.COM.BR](https://gerencianet.com.br/pix/)
 - 2) Crie uma aplicação no menu **Minhas aplicações** e adquira o ```Client_Id```, ```Client_Secret```
 - 3) Em seguida adquira um certificado *.p12* de homologação no menu **Meus certificados** 
 - 4) Configure no ```.env``` do seu repositório as respectivas informações conforme o ```.env.example```

### Instalação
```
yarn add brpix-api-node
``` 
ou 
```
npm -i brpix-api-node
```

### Exemplo de implementação
```js
import { ApiPix } from 'brpix-api-node'

/** @type {IApiPixConfig} */
const apiConfig = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  baseURL: 'https://api-pix-h.gerencianet.com.br',
  // debug: true,
  certificate: {
    path: './certificates/certificate.p12',
    passphrase: '' // senha do certificado (vazio para homologação)
  }
}

// nova instância 
const pix = new ApiPix(apiConfig)

// inicia acesso no PSP
pix.init().then(() => {
  console.log('token de acesso adquirido', api.token)
})

// ou também pode iniciar acesso assim
const response = await api.getAccessToken()
console.log(response.accessToken)
```

### Criar uma cobrança PIX dinâmica

```js
/** @type {IRequestCreateImmediateCharge} */
const request = {
  calendario: {
    expiracao: 3600 // 1 hora
  },
  chave: '12345678900', // chave pix do cobrador
  devedor: {
    cpf: '98765432100',
    nome: 'Fulano de Tal'
  },
  solicitacaoPagador: 'Pagamento do pedido 123',
  valor: {
    original: '10.20'
  }
}


// levando um txid
const txid = 'GERE_O_SEU_TXID_123'
const cob = await pix.createCob(request, txid)

//ou  gerando txtid automaticamente
const cob = await pix.createCob(request)

//ou  pode adquirir um txid da classe antes da requisição
const myTxid = pix.txidGenerate()
const cob = await pix.createCob(request, myTxid)

// seguindo para gerar QRCode
if(response && response.location) {
  /** @type {IQRCodePayload} */
  const payload = {
      amount: cob.valor.original,
      merchantCity: 'Cidade do cobrador',
      merchantName: 'Nome do cobrador', 
      pixKey: request.chave,
      txid: cob.txid,
      uniquePayment: true,
      url: cob.location // importante para pix dinâmico
    }
    const codePayload = new QRCodePayload(payload)

    // pode adquirir a string do QRCode
    console.log('string payload', codePayload.getPayload()) 

    // adquirir string base64 para imagem QRCode
    const strBase64 =  await codePayload.getQRCode()

    /** 
     * Use no frontend
     * <img src={strBase64} />
     */
}

```

### Criar um pix QRCode stático

```javascript
import { QRCodePayload } from 'brpix-api-node'

// instanciando QRCode
const codePayload = new QRCodePayload({
  isStatic: true, // importante sinalizar que é pix estático
  txid: 'GERE_SEU_TXID_123456', // no pix estático será preenchido com '***' automaticamente
  pixKey: 'CHAVE_PIX_DO_COBRADOR',
  amount: '1.50',
  merchantCity: 'Cidade_do_cobrador',
  merchantName: 'Nome_do_cobrador',
  uniquePayment: false, // true se deve ser usado apenas uma vez
  description: 'Descricao do pagamento'
})

// ou assim 
const codePayload = new QRCodePayload()
  .set('txid', 'GERE_SEU_TXID_123456')
  .set('isStatic', true)
  .set('pixKey', 'CHAVE_PIX_DO_COBRADOR')
  .set('amount', '1.50')
  .set('merchantCity', 'Cidade_do_cobrador')
  .set('merchantName', 'Nome_do_cobrador')
  .set('uniquePayment', false)
  .set('description', 'Descricao do pagamento')

 // pode adquirir a string do QRCode
 console.log('string payload', codePayload.getPayload()) 

 // adquirir string base64 para imagem QRCode
 const strBase64 = await codePayload.getQRCode({ width: 400 })
 /** 
  * Use no frontend
  * <img src={strBase64} />
  */

  // ou 
  await codePayload.save(`./qrcode-${txid}.png`, { width: 400, type: 'png' })

```


### Contribuindo
Solicitações pull são bem-vindas! Se você vir algo que gostaria de adicionar, faça. Para mudanças drásticas, abra uma ```issue``` primeiro.

## MIT License

Copyright (c) 2021 [Leandro Sbrissa](https://github.com/leguass7)
