"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("axios"),t=require("https"),r=require("fs"),s=require("uuid"),a=require("md5"),i=require("camelcase-keys"),n=require("axios/lib/adapters/http"),o=require("qrcode");function c(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var u=c(e),l=c(t),h=c(r),d=c(a),p=c(i),g=c(n),f=c(o);function y(e){const t=e&&e.response,r=t&&parseInt(t.status,10),s={success:!1,statusHttp:r||0,messageError:e?`${e.code||e.message}`:"Timeout",responseError:t&&t.data?t.data:{},error:e};return t?(s.messageError=`httpError ${r}`,Promise.resolve({data:s})):Promise.resolve({data:s})}function m(e,t){return e&&e.length>t?e.substring(0,t):e}function A(e,t,r){if(!e)return"";if(Array.isArray(t)){let s=`${e}`;for(let e=0;e<t.length;e++)s=A(s,t[e],r);return s}return e.split(t).join(r)}function $(e){return!("object"!=typeof e||null===e||e instanceof RegExp||e instanceof Error||e instanceof Date||Array.isArray(e))}function C(e){return"string"==typeof e?parseInt(e,10).toString(16):e.toString(16)}function x(e,t="_"){return"string"==typeof e?e.replace(/([\p{Lowercase_Letter}\d])(\p{Uppercase_Letter})/gu,`$1${t}$2`).replace(/(\p{Uppercase_Letter}+)(\p{Uppercase_Letter}\p{Lowercase_Letter}+)/gu,`$1${t}$2`).toLowerCase():e}function S(e){const t={};return Object.keys(e).forEach((r=>{const s=x(r);t[s]=$(e[r])?S(e[r]):e[r]})),t}function k(e){return Array.isArray(e)?e.map((e=>k(e))):$(e)?S(e):x(`${e}`)}const b="00",T="01",w="26",L="00",q="01",E="02",v="25",P="52",R="53",V="54",U="58",j="59",_="60",D="62",I="05",O="63",B={currency:"986",countryCode:"BR",categoryCode:"0000",pixKey:"",description:"",uniquePayment:!0,amount:"",merchantName:"",merchantCity:"Cidade",txid:"",isStatic:!1,url:""};exports.ApiPix=class{constructor(e){this.logPrefix="ApiPix",this.Api=null,this.cancelSources=[],this.Agent=null,this.token="",this.config={timeout:3e3,debug:!1},this.set(e).configureAxios()}logging(...e){this.config.debug&&console.log(this.logPrefix,...e)}configureAxios(){return this.Api=u.default.create({baseURL:this.config.baseURL,timeout:this.config.timeout||1e4,adapter:g.default}),this.Api.defaults.headers={"Cache-Control":"no-cache",Pragma:"no-cache",Expires:"0","Content-Type":"application/json",Accept:"application/json"},this.configureRequests().configureResponses().setAgentSSL()}configureRequests(){return this.Api.interceptors.request.use((e=>(e.data&&e.decamelcase&&(e.data=k(e.data)),this.logging(`REQUEST ${e.method}: (${e.baseURL}${e.url})`,e.data),e))),this}configureResponses(){return this.Api.interceptors.response.use((e=>{const t=e&&e.data,r={status:e.status||e.data.status,success:!(!e.status||e.data.error),data:t?p.default(t,{deep:!0}):{}};return this.logging(`RESPONSE: (${e.config.baseURL}${e.config.url})`,t),{...e,...r}}),y),this}loadCertificate(e){const t=e=>{try{return new l.default.Agent(e)}catch(e){throw new TypeError(`Erro de certificado: ${e}`)}};if(e)return t(e);if(this.config.certificate){const{path:e,passphrase:r}=this.config.certificate;if(h.default.existsSync(e))return t({passphrase:r,pfx:h.default.readFileSync(e)});throw new TypeError(`Caminho do certificado: ${e}`)}return null}setAgentSSL(e){if(this.config.certificate){const t=this.loadCertificate(e);if(t)return this.Agent=t,this.Api.defaults.httpsAgent=t,this}return this}async getAccessToken(){const{clientId:e,clientSecret:t}=this.config,r=Buffer.from(`${e}:${t}`).toString("base64"),s=this.getCancelToken().source(),a=s.token;this.addCancelSource(s);const i={cancelToken:a,headers:{Authorization:`Basic ${r}`},httpsAgent:this.Agent,decamelcase:!0},n=await this.Api.post("/oauth/token",{grantType:"client_credentials"},i);if(this.removeCancelSource(a),n&&n.data){const e=n.data.accessToken||"";return this.token=e,n&&n.data}throw new TypeError("Erro ao adquirir token de acesso")}getCancelToken(){return u.default.CancelToken}removeCancelSource(e){if(e){const t=this.cancelSources.filter((({idToken:t})=>t!==e));return this.cancelSources=t||[],this}return this.cancelSources=[],this}addCancelSource(e){return this.cancelSources.push({idToken:e.token,source:e}),this}set(e,t){return $(e)?Object.keys(e).forEach((t=>this.config[t]=e[t])):this.config[e]=t,this}async init(){return await this.getAccessToken()}cancel(){return this.cancelSources.forEach((({source:e})=>{e&&e.cancel("canceled")})),this.removeCancelSource(),this}async requestApi(e,t,r,s){const a=this.getCancelToken().source(),i=a.token;this.addCancelSource(a),this.token||await this.getAccessToken();const{decamelcase:n,...o}=s||{},c=[t,r,s&&o?{...s,cancelToken:i}:{cancelToken:i,headers:{Authorization:`Bearer ${this.token}`},decamelcase:!!n}].filter((e=>!!e)),u=await this.Api[e.toLocaleLowerCase()](...c);return this.removeCancelSource(i),u}txidGenerate(e){if(e&&e.useMD5Timestamp){const e=(+new Date).toString(16);return d.default(`${this.config.baseURL}${e}`)}const t=e&&e.namespace||s.v4();return A(s.v5(this.config.baseURL,t),"-","")}async createCob(e,t){const r=t||this.txidGenerate(),s=await this.requestApi("put",`/v2/cob/${r}`,e);return s&&s.data}async consultCob(e){const t=await this.requestApi("get",`/v2/cob/${e}`);return t&&t.data}},exports.QRCodePayload=class{constructor(e){return this.payload=B,e&&this.set(e),this}set(e,t){return $(e)?Object.keys(e).forEach((t=>{t in this.payload&&(this.payload[t]=e[t])})):"string"==typeof e&&e in this.payload&&(this.payload[e]=t),this}getValue(e,t){return`${e}${`${`${t}`.length}`.padStart(2,"0")}${t}`}getMerchantAccountInformation(){const{url:e,pixKey:t,description:r,isStatic:s}=this.payload,a=[this.getValue(L,"br.gov.bcb.pix"),t&&s?this.getValue(q,t):"",r?this.getValue(E,(i=r,m(i,99-(22+(s?t.length:0))))):"",e&&!s?this.getValue(v,e.replace(/^(https?|ftp):\/\//,"")):""].filter((e=>!!e));var i;return this.getValue(w,`${a.join("")}`)}getUniquePayment(){return this.payload.uniquePayment?this.getValue(T,"12"):""}getAdditionalDataFieldTemplate(){const e=this.payload.isStatic?this.getValue(I,this.payload.txid):"***";return this.getValue(D,e)}getCRC16(e){return`${O}04${function(e){let t=65535;const r=String(e).length;for(let s=0;s<r;s++){t^=`${e[s]}`.charCodeAt(0)<<8;for(let e=0;e<8;e++)65536&(t<<=1)&&(t^=4129),t&=65535}return s=C(t),`${s}`.toLocaleUpperCase();var s}(`${e}${O}04`)}`}getPayload(){const{amount:e,merchantName:t,merchantCity:r,currency:s,countryCode:a,categoryCode:i}=this.payload,n=[this.getValue(b,"01"),this.getUniquePayment(),this.getMerchantAccountInformation(),this.getValue(P,i),this.getValue(R,s),this.getValue(V,e),this.getValue(U,a),this.getValue(j,t),this.getValue(_,r||"Cidade"),this.getAdditionalDataFieldTemplate()],o=n.join("");return`${n.join("")}${this.getCRC16(o)}`}async getQRCode(e=512){return await f.default.toDataURL(this.getPayload(),{width:e})}async save(e,t){return await f.default.toFile(e,this.getPayload(),t),this}},exports.decamelcase=k,exports.dechex=C,exports.replaceAll=A,exports.stringLimit=m,exports.validPixTxid=function(e){return!("string"!=typeof e||!/^[a-zA-Z0-9]{26,35}$/.test(e))},exports.validPixValor=function(e){return!("string"!=typeof e||!/\d{1,10}\.\d{2}$/.test(e))};
//# sourceMappingURL=index.js.map
