const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/src.74gklwG5.js","_astro/rolldown-runtime.DaJ6WEGw.js","_astro/mediabunny-mp3-encoder.BRfobvrU.js","_astro/preload-helper.Bmjislh3.js"])))=>i.map(i=>d[i]);
import{i as e,r as t,t as n}from"./rolldown-runtime.DaJ6WEGw.js";import{$ as r,A as i,B as a,C as o,F as s,G as c,H as l,J as u,M as d,P as f,Q as p,R as m,T as h,U as g,V as _,W as v,X as y,Y as b,_ as x,a as S,at as C,c as w,ct as T,et as E,f as D,g as ee,h as te,it as ne,l as re,lt as O,m as ie,ot as ae,q as oe,u as se,w as ce,x as le,y as ue,z as de}from"./client.Dyhilqg3.js";import"./disclose-version.xihTtKlq.js";import"./legacy.DFPrMICS.js";import{n as fe,t as pe}from"./preload-helper.Bmjislh3.js";var k=n((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.baseAssetPath=void 0;var t=typeof window<`u`&&window.document!==void 0?window.document.currentScript:null,n=`/`;t&&(n=t.src.replace(/#.*$/,``).replace(/\?.*$/,``).replace(/\/[^/]+$/,`/`)),e.baseAssetPath=n})),me=n((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.defaultModelFetcher=void 0,e.defaultModelFetcher=e=>fetch(e).then(e=>e.arrayBuffer())})),A=n((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.log=void 0;var t=e=>t=>{console.log(`VAD | ${e} >`,t)};e.log={error:t(`error`),debug:t(`debug`),warn:t(`warn`)}})),he=n((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Message=void 0;var t;(function(e){e.AudioFrame=`AUDIO_FRAME`,e.SpeechStart=`SPEECH_START`,e.VADMisfire=`VAD_MISFIRE`,e.SpeechEnd=`SPEECH_END`,e.SpeechStop=`SPEECH_STOP`,e.SpeechRealStart=`SPEECH_REAL_START`,e.FrameProcessed=`FRAME_PROCESSED`})(t||(e.Message=t={}))})),ge=n((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.FrameProcessor=e.validateOptions=e.defaultFrameProcessorOptions=void 0;var t=A(),n=he();e.defaultFrameProcessorOptions={positiveSpeechThreshold:.3,negativeSpeechThreshold:.25,preSpeechPadMs:800,redemptionMs:1400,minSpeechMs:400,submitUserSpeechOnPause:!1};function r(e){(e.positiveSpeechThreshold<0||e.positiveSpeechThreshold>1)&&t.log.error(`positiveSpeechThreshold should be a number between 0 and 1`),(e.negativeSpeechThreshold<0||e.negativeSpeechThreshold>e.positiveSpeechThreshold)&&t.log.error(`negativeSpeechThreshold should be between 0 and positiveSpeechThreshold`),e.preSpeechPadMs<0&&t.log.error(`preSpeechPadMs should be positive`),e.redemptionMs<0&&t.log.error(`redemptionMs should be positive`),e.minSpeechMs<0&&t.log.error(`minSpeechMs should be positive`)}e.validateOptions=r;var i=e=>{let t=e.reduce((e,t)=>(e.push(e.at(-1)+t.length),e),[0]),n=new Float32Array(t.at(-1));return e.forEach((e,r)=>{let i=t[r];n.set(e,i)}),n};function a(e,t){return{redemptionFrames:Math.floor(e.redemptionMs/t),preSpeechPadFrames:Math.floor(e.preSpeechPadMs/t),minSpeechFrames:Math.floor(e.minSpeechMs/t)}}e.FrameProcessor=class{constructor(e,t,r,o){this.modelProcessFunc=e,this.modelResetFunc=t,this.options=r,this.msPerFrame=o,this.speaking=!1,this.redemptionCounter=0,this.speechFrameCount=0,this.active=!1,this.speechRealStartFired=!1,this.setOptions=e=>{this.options={...this.options,...e};let{redemptionFrames:t,preSpeechPadFrames:n,minSpeechFrames:r}=a(this.options,this.msPerFrame);this.redemptionFrames=t,this.preSpeechPadFrames=n,this.minSpeechFrames=r},this.reset=()=>{this.speaking=!1,this.speechRealStartFired=!1,this.audioBuffer=[],this.modelResetFunc(),this.redemptionCounter=0,this.speechFrameCount=0},this.pause=e=>{this.active=!1,this.options.submitUserSpeechOnPause?this.endSegment(e):this.reset()},this.resume=()=>{this.active=!0},this.endSegment=e=>{let t=this.audioBuffer;this.audioBuffer=[];let r=this.speaking;if(this.reset(),r)if(t.reduce((e,t)=>t.isSpeech?e+1:e,0)>=this.minSpeechFrames){let r=i(t.map(e=>e.frame));e({msg:n.Message.SpeechEnd,audio:r})}else e({msg:n.Message.VADMisfire});return{}},this.process=async(e,t)=>{if(!this.active)return;let r=await this.modelProcessFunc(e),a=r.isSpeech>=this.options.positiveSpeechThreshold;if(t({probs:r,msg:n.Message.FrameProcessed,frame:e}),this.audioBuffer.push({frame:e,isSpeech:a}),a&&(this.speechFrameCount++,this.redemptionCounter=0),a&&!this.speaking&&(this.speaking=!0,t({msg:n.Message.SpeechStart})),this.speaking&&this.speechFrameCount===this.minSpeechFrames&&!this.speechRealStartFired&&(this.speechRealStartFired=!0,t({msg:n.Message.SpeechRealStart})),r.isSpeech<this.options.negativeSpeechThreshold&&this.speaking&&++this.redemptionCounter>=this.redemptionFrames){this.redemptionCounter=0,this.speechFrameCount=0,this.speaking=!1,this.speechRealStartFired=!1;let e=this.audioBuffer;if(this.audioBuffer=[],e.reduce((e,t)=>t.isSpeech?e+1:e,0)>=this.minSpeechFrames){let r=i(e.map(e=>e.frame));t({msg:n.Message.SpeechEnd,audio:r})}else t({msg:n.Message.VADMisfire})}if(!this.speaking){for(;this.audioBuffer.length>this.preSpeechPadFrames;)this.audioBuffer.shift();this.speechFrameCount=0}},this.audioBuffer=[];let{redemptionFrames:s,preSpeechPadFrames:c,minSpeechFrames:l}=a(this.options,this.msPerFrame);this.redemptionFrames=s,this.preSpeechPadFrames=c,this.minSpeechFrames=l,this.reset()}}})),_e=n(((t,n)=>{fe();var r=(()=>{var t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.prototype.hasOwnProperty,a=(t=>typeof e<`u`?e:typeof Proxy<`u`?new Proxy(t,{get:(t,n)=>(typeof e<`u`?e:t)[n]}):t)(function(t){if(typeof e<`u`)return e.apply(this,arguments);throw Error(`Dynamic require of "`+t+`" is not supported`)}),o=(e,t)=>()=>(e&&(t=e(e=0)),t),s=(e,n)=>{for(var r in n)t(e,r,{get:n[r],enumerable:!0})},c=(e,a,o,s)=>{if(a&&typeof a==`object`||typeof a==`function`)for(let c of r(a))!i.call(e,c)&&c!==o&&t(e,c,{get:()=>a[c],enumerable:!(s=n(a,c))||s.enumerable});return e},l=e=>c(t({},`__esModule`,{value:!0}),e),u,d,f,p,m,h=o(()=>{u=new Map,d=[],f=(e,t,n)=>{if(t&&typeof t.init==`function`&&typeof t.createInferenceSessionHandler==`function`){let r=u.get(e);if(r===void 0)u.set(e,{backend:t,priority:n});else{if(r.priority>n)return;if(r.priority===n&&r.backend!==t)throw Error(`cannot register backend "${e}" using priority ${n}`)}if(n>=0){let t=d.indexOf(e);t!==-1&&d.splice(t,1);for(let t=0;t<d.length;t++)if(u.get(d[t]).priority<=n){d.splice(t,0,e);return}d.push(e)}return}throw TypeError(`not a valid backend`)},p=async e=>{let t=u.get(e);if(!t)return`backend not found.`;if(t.initialized)return t.backend;if(t.aborted)return t.error;{let n=!!t.initPromise;try{return n||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(e){return n||(t.error=`${e}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},m=async e=>{let t=e.executionProviders||[],n=t.map(e=>typeof e==`string`?e:e.name),r=n.length===0?d:n,i,a=[],o=new Set;for(let e of r){let t=await p(e);typeof t==`string`?a.push({name:e,err:t}):(i||=t,i===t&&o.add(e))}if(!i)throw Error(`no available backend found. ERR: ${a.map(e=>`[${e.name}] ${e.err}`).join(`, `)}`);for(let{name:e,err:t}of a)n.includes(e)&&console.warn(`removing requested execution provider "${e}" from session options because it is not available: ${t}`);let s=t.filter(e=>o.has(typeof e==`string`?e:e.name));return[i,new Proxy(e,{get:(e,t)=>t===`executionProviders`?s:Reflect.get(e,t)})]}}),g=o(()=>{h()}),_,v=o(()=>{_=`1.27.0`}),y,b,x=o(()=>{v(),y=`warning`,b={wasm:{},webgl:{},webgpu:{},versions:{common:_},set logLevel(e){if(e!==void 0){if(typeof e!=`string`||[`verbose`,`info`,`warning`,`error`,`fatal`].indexOf(e)===-1)throw Error(`Unsupported logging level: ${e}`);y=e}},get logLevel(){return y}},Object.defineProperty(b,"logLevel",{enumerable:!0})}),S,C=o(()=>{x(),S=b}),w,T,E=o(()=>{w=(e,t)=>{let n=typeof document<`u`?document.createElement(`canvas`):new OffscreenCanvas(1,1);n.width=e.dims[3],n.height=e.dims[2];let r=n.getContext(`2d`);if(r!=null){let i,a;t?.tensorLayout!==void 0&&t.tensorLayout===`NHWC`?(i=e.dims[2],a=e.dims[3]):(i=e.dims[3],a=e.dims[2]);let o=t?.format===void 0?`RGB`:t.format,s=t?.norm,c,l;s===void 0||s.mean===void 0?c=[255,255,255,255]:typeof s.mean==`number`?c=[s.mean,s.mean,s.mean,s.mean]:(c=[s.mean[0],s.mean[1],s.mean[2],0],s.mean[3]!==void 0&&(c[3]=s.mean[3])),s===void 0||s.bias===void 0?l=[0,0,0,0]:typeof s.bias==`number`?l=[s.bias,s.bias,s.bias,s.bias]:(l=[s.bias[0],s.bias[1],s.bias[2],0],s.bias[3]!==void 0&&(l[3]=s.bias[3]));let u=a*i,d=0,f=u,p=u*2,m=-1;o===`RGBA`?(d=0,f=u,p=u*2,m=u*3):o===`RGB`?(d=0,f=u,p=u*2):o===`RBG`&&(d=0,p=u,f=u*2);for(let t=0;t<a;t++)for(let n=0;n<i;n++){let i=(e.data[d++]-l[0])*c[0],a=(e.data[f++]-l[1])*c[1],o=(e.data[p++]-l[2])*c[2],s=m===-1?255:(e.data[m++]-l[3])*c[3];r.fillStyle=`rgba(`+i+`,`+a+`,`+o+`,`+s+`)`,r.fillRect(n,t,1,1)}if(`toDataURL`in n)return n.toDataURL();throw Error(`toDataURL is not supported`)}else throw Error(`Can not access image data`)},T=(e,t)=>{let n=typeof document<`u`?document.createElement(`canvas`).getContext(`2d`):new OffscreenCanvas(1,1).getContext(`2d`),r;if(n!=null){let i,a,o;t?.tensorLayout!==void 0&&t.tensorLayout===`NHWC`?(i=e.dims[2],a=e.dims[1],o=e.dims[3]):(i=e.dims[3],a=e.dims[2],o=e.dims[1]);let s=t!==void 0&&t.format!==void 0?t.format:`RGB`,c=t?.norm,l,u;c===void 0||c.mean===void 0?l=[255,255,255,255]:typeof c.mean==`number`?l=[c.mean,c.mean,c.mean,c.mean]:(l=[c.mean[0],c.mean[1],c.mean[2],255],c.mean[3]!==void 0&&(l[3]=c.mean[3])),c===void 0||c.bias===void 0?u=[0,0,0,0]:typeof c.bias==`number`?u=[c.bias,c.bias,c.bias,c.bias]:(u=[c.bias[0],c.bias[1],c.bias[2],0],c.bias[3]!==void 0&&(u[3]=c.bias[3]));let d=a*i;if(t!==void 0&&(t.format!==void 0&&o===4&&t.format!==`RGBA`||o===3&&t.format!==`RGB`&&t.format!==`BGR`))throw Error(`Tensor format doesn't match input tensor dims`);let f=0,p=1,m=2,h=3,g=0,_=d,v=d*2,y=-1;s===`RGBA`?(g=0,_=d,v=d*2,y=d*3):s===`RGB`?(g=0,_=d,v=d*2):s===`RBG`&&(g=0,v=d,_=d*2),r=n.createImageData(i,a);for(let t=0;t<a*i;f+=4,p+=4,m+=4,h+=4,t++)r.data[f]=(e.data[g++]-u[0])*l[0],r.data[p]=(e.data[_++]-u[1])*l[1],r.data[m]=(e.data[v++]-u[2])*l[2],r.data[h]=y===-1?255:(e.data[y++]-u[3])*l[3]}else throw Error(`Can not access image data`);return r}}),D,ee,te,ne,re,O,ie=o(()=>{me(),D=(e,t)=>{if(e===void 0)throw Error(`Image buffer must be defined`);if(t.height===void 0||t.width===void 0)throw Error(`Image height and width must be defined`);if(t.tensorLayout===`NHWC`)throw Error(`NHWC Tensor layout is not supported yet`);let{height:n,width:r}=t,i=t.norm??{mean:255,bias:0},a,o;a=typeof i.mean==`number`?[i.mean,i.mean,i.mean,i.mean]:[i.mean[0],i.mean[1],i.mean[2],i.mean[3]??255],o=typeof i.bias==`number`?[i.bias,i.bias,i.bias,i.bias]:[i.bias[0],i.bias[1],i.bias[2],i.bias[3]??0];let s=t.format===void 0?`RGBA`:t.format,c=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:`RGB`,l=n*r,u=c===`RGBA`?new Float32Array(l*4):new Float32Array(l*3),d=4,f=0,p=1,m=2,h=3,g=0,_=l,v=l*2,y=-1;s===`RGB`&&(d=3,f=0,p=1,m=2,h=-1),c===`RGBA`?y=l*3:c===`RBG`?(g=0,v=l,_=l*2):c===`BGR`&&(v=0,_=l,g=l*2);for(let t=0;t<l;t++,f+=d,m+=d,p+=d,h+=d)u[g++]=(e[f]+o[0])/a[0],u[_++]=(e[p]+o[1])/a[1],u[v++]=(e[m]+o[2])/a[2],y!==-1&&h!==-1&&(u[y++]=(e[h]+o[3])/a[3]);return c===`RGBA`?new k(`float32`,u,[1,4,n,r]):new k(`float32`,u,[1,3,n,r])},ee=async(e,t)=>{let n=typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement,r=typeof ImageData<`u`&&e instanceof ImageData,i=typeof ImageBitmap<`u`&&e instanceof ImageBitmap,a=typeof e==`string`,o,s=t??{},c=()=>{if(typeof document<`u`)return document.createElement(`canvas`);if(typeof OffscreenCanvas<`u`)return new OffscreenCanvas(1,1);throw Error(`Canvas is not supported`)},l=e=>typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||e instanceof OffscreenCanvas?e.getContext(`2d`):null;if(n){let n=c();n.width=e.width,n.height=e.height;let r=l(n);if(r!=null){let n=e.height,i=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(n=t.resizedHeight,i=t.resizedWidth),t!==void 0){if(s=t,t.tensorFormat!==void 0)throw Error(`Image input config format must be RGBA for HTMLImageElement`);s.tensorFormat=`RGBA`,s.height=n,s.width=i}else s.tensorFormat=`RGBA`,s.height=n,s.width=i;r.drawImage(e,0,0),o=r.getImageData(0,0,i,n).data}else throw Error(`Can not access image data`)}else if(r){let n,r;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(n=t.resizedHeight,r=t.resizedWidth):(n=e.height,r=e.width),t!==void 0&&(s=t),s.format=`RGBA`,s.height=n,s.width=r,t!==void 0){let t=c();t.width=r,t.height=n;let i=l(t);if(i!=null)i.putImageData(e,0,0),o=i.getImageData(0,0,r,n).data;else throw Error(`Can not access image data`)}else o=e.data}else if(i){if(t===void 0)throw Error(`Please provide image config with format for Imagebitmap`);let n=c();n.width=e.width,n.height=e.height;let r=l(n);if(r!=null){let t=e.height,n=e.width;return r.drawImage(e,0,0,n,t),o=r.getImageData(0,0,n,t).data,s.height=t,s.width=n,D(o,s)}else throw Error(`Can not access image data`)}else{if(a)return new Promise((t,n)=>{let r=c(),i=l(r);if(!e||!i)return n();let a=new Image;a.crossOrigin=`Anonymous`,a.src=e,a.onload=()=>{r.width=a.width,r.height=a.height,i.drawImage(a,0,0,r.width,r.height);let e=i.getImageData(0,0,r.width,r.height);s.height=r.height,s.width=r.width,t(D(e.data,s))}});throw Error(`Input data provided is not supported - aborted tensor creation`)}if(o!==void 0)return D(o,s);throw Error(`Input data provided is not supported - aborted tensor creation`)},te=(e,t)=>{let{width:n,height:r,download:i,dispose:a}=t;return new k({location:`texture`,type:`float32`,texture:e,dims:[1,r,n,4],download:i,dispose:a})},ne=(e,t)=>{let{dataType:n,dims:r,download:i,dispose:a}=t;return new k({location:`gpu-buffer`,type:n??`float32`,gpuBuffer:e,dims:r,download:i,dispose:a})},re=(e,t)=>{let{dataType:n,dims:r,download:i,dispose:a}=t;return new k({location:`ml-tensor`,type:n??`float32`,mlTensor:e,dims:r,download:i,dispose:a})},O=(e,t,n)=>new k({location:`cpu-pinned`,type:e,data:t,dims:n??[t.length]})}),ae,oe,se,ce,le=o(()=>{ae=new Map([[`float32`,Float32Array],[`uint8`,Uint8Array],[`int8`,Int8Array],[`uint16`,Uint16Array],[`int16`,Int16Array],[`int32`,Int32Array],[`bool`,Uint8Array],[`float64`,Float64Array],[`uint32`,Uint32Array],[`int4`,Uint8Array],[`uint4`,Uint8Array]]),oe=new Map([[Float32Array,`float32`],[Uint8Array,`uint8`],[Int8Array,`int8`],[Uint16Array,`uint16`],[Int16Array,`int16`],[Int32Array,`int32`],[Float64Array,`float64`],[Uint32Array,`uint32`]]),se=!1,ce=()=>{if(!se){se=!0;let e=typeof BigInt64Array<`u`&&BigInt64Array.from,t=typeof BigUint64Array<`u`&&BigUint64Array.from,n=globalThis.Float16Array,r=typeof n<`u`&&n.from;e&&(ae.set(`int64`,BigInt64Array),oe.set(BigInt64Array,`int64`)),t&&(ae.set(`uint64`,BigUint64Array),oe.set(BigUint64Array,`uint64`)),r?(ae.set(`float16`,n),oe.set(n,`float16`)):ae.set(`float16`,Uint16Array)}}}),ue,de,fe=o(()=>{me(),ue=e=>{let t=1;for(let n=0;n<e.length;n++){let r=e[n];if(typeof r!=`number`||!Number.isSafeInteger(r))throw TypeError(`dims[${n}] must be an integer, got: ${r}`);if(r<0)throw RangeError(`dims[${n}] must be a non-negative integer, got: ${r}`);t*=r}return t},de=(e,t)=>{switch(e.location){case`cpu`:return new k(e.type,e.data,t);case`cpu-pinned`:return new k({location:`cpu-pinned`,data:e.data,type:e.type,dims:t});case`texture`:return new k({location:`texture`,texture:e.texture,type:e.type,dims:t});case`gpu-buffer`:return new k({location:`gpu-buffer`,gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case`ml-tensor`:return new k({location:`ml-tensor`,mlTensor:e.mlTensor,type:e.type,dims:t});default:throw Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),k,me=o(()=>{E(),ie(),le(),fe(),k=class{constructor(e,t,n){ce();let r,i;if(typeof e==`object`&&`location`in e)switch(this.dataLocation=e.location,r=e.type,i=e.dims,e.location){case`cpu-pinned`:{let t=ae.get(r);if(!t)throw TypeError(`unsupported type "${r}" to create tensor from pinned buffer`);if(!(e.data instanceof t))throw TypeError(`buffer should be of type ${t.name}`);this.cpuData=e.data;break}case`texture`:if(r!==`float32`)throw TypeError(`unsupported type "${r}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break;case`gpu-buffer`:if(r!==`float32`&&r!==`float16`&&r!==`int32`&&r!==`int64`&&r!==`uint32`&&r!==`uint8`&&r!==`bool`&&r!==`uint4`&&r!==`int4`)throw TypeError(`unsupported type "${r}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break;case`ml-tensor`:if(r!==`float32`&&r!==`float16`&&r!==`int32`&&r!==`int64`&&r!==`uint32`&&r!==`uint64`&&r!==`int8`&&r!==`uint8`&&r!==`bool`&&r!==`uint4`&&r!==`int4`)throw TypeError(`unsupported type "${r}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break;default:throw Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let a,o;if(typeof e==`string`)if(r=e,o=n,e===`string`){if(!Array.isArray(t))throw TypeError(`A string tensor's data must be a string array.`);a=t}else{let n=ae.get(e);if(n===void 0)throw TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e===`float16`&&n===Uint16Array||e===`uint4`||e===`int4`)throw TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${n.name} as data.`);a=e===`uint64`||e===`int64`?n.from(t,BigInt):n.from(t)}else if(t instanceof n)a=t;else if(t instanceof Uint8ClampedArray)if(e===`uint8`)a=Uint8Array.from(t);else throw TypeError(`A Uint8ClampedArray tensor's data must be type of uint8`);else if(e===`float16`&&t instanceof Uint16Array&&n!==Uint16Array)a=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw TypeError(`A ${r} tensor's data must be type of ${n}`)}else if(o=t,Array.isArray(e)){if(e.length===0)throw TypeError(`Tensor type cannot be inferred from an empty array.`);let t=typeof e[0];if(t===`string`)r=`string`,a=e;else if(t===`boolean`)r=`bool`,a=Uint8Array.from(e);else throw TypeError(`Invalid element type of data array: ${t}.`)}else if(e instanceof Uint8ClampedArray)r=`uint8`,a=Uint8Array.from(e);else{let t=oe.get(e.constructor);if(t===void 0)throw TypeError(`Unsupported type for tensor data: ${e.constructor}.`);r=t,a=e}if(o===void 0)o=[a.length];else if(!Array.isArray(o))throw TypeError(`A tensor's dims must be a number array`);i=o,this.cpuData=a,this.dataLocation=`cpu`}let a=ue(i);if(this.cpuData&&a!==this.cpuData.length&&!((r===`uint4`||r===`int4`)&&Math.ceil(a/2)===this.cpuData.length))throw Error(`Tensor's size(${a}) does not match data length(${this.cpuData.length}).`);this.type=r,this.dims=i,this.size=a}static async fromImage(e,t){return ee(e,t)}static fromTexture(e,t){return te(e,t)}static fromGpuBuffer(e,t){return ne(e,t)}static fromMLTensor(e,t){return re(e,t)}static fromPinnedBuffer(e,t,n){return O(e,t,n)}toDataURL(e){return w(this,e)}toImageData(e){return T(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw Error(`The data is not stored as a WebGL texture.`);return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw Error(`The data is not stored as a WebGPU buffer.`);return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw Error(`The data is not stored as a WebNN MLTensor.`);return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case`cpu`:case`cpu-pinned`:return this.data;case`texture`:case`gpu-buffer`:case`ml-tensor`:if(!this.downloader)throw Error(`The current tensor is not created with a specified data downloader.`);if(this.isDownloading)throw Error(`The current tensor is being downloaded.`);try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation=`cpu`,this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}default:throw Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw Error(`The current tensor is being downloaded.`);this.disposer&&=(this.disposer(),void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation=`none`}ensureValid(){if(this.dataLocation===`none`)throw Error(`The tensor is disposed.`)}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw Error(`Cannot reshape a tensor that owns GPU resource.`);return de(this,e)}}}),A,he=o(()=>{me(),A=k}),ge,_e,ve,ye,be,xe,Se=o(()=>{x(),ge=(e,t)=>{(typeof b.trace>`u`?!b.wasm.trace:!b.trace)||console.timeStamp(`${e}::ORT::${t}`)},_e=(e,t)=>{let n=Error().stack?.split(/\r\n|\r|\n/g)||[],r=!1;for(let i=0;i<n.length;i++){if(r&&!n[i].includes(`TRACE_FUNC`)){let r=`FUNC_${e}::${n[i].trim().split(` `)[1]}`;t&&(r+=`::${t}`),ge(`CPU`,r);return}n[i].includes(`TRACE_FUNC`)&&(r=!0)}},ve=e=>{(typeof b.trace>`u`?!b.wasm.trace:!b.trace)||_e(`BEGIN`,e)},ye=e=>{(typeof b.trace>`u`?!b.wasm.trace:!b.trace)||_e(`END`,e)},be=e=>{(typeof b.trace>`u`?!b.wasm.trace:!b.trace)||console.time(`ORT::${e}`)},xe=e=>{(typeof b.trace>`u`?!b.wasm.trace:!b.trace)||console.timeEnd(`ORT::${e}`)}}),Ce,we=o(()=>{h(),he(),Se(),Ce=class e{constructor(e){this.handler=e}async run(e,t,n){ve(),be(`InferenceSession.run`);let r={},i={};if(typeof e!=`object`||!e||e instanceof A||Array.isArray(e))throw TypeError(`'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.`);let a=!0;if(typeof t==`object`){if(t===null)throw TypeError(`Unexpected argument[1]: cannot be null.`);if(t instanceof A)throw TypeError(`'fetches' cannot be a Tensor`);if(Array.isArray(t)){if(t.length===0)throw TypeError(`'fetches' cannot be an empty array.`);a=!1;for(let e of t){if(typeof e!=`string`)throw TypeError(`'fetches' must be a string array or an object.`);if(this.outputNames.indexOf(e)===-1)throw RangeError(`'fetches' contains invalid output name: ${e}.`);r[e]=null}if(typeof n==`object`&&n)i=n;else if(typeof n<`u`)throw TypeError(`'options' must be an object.`)}else{let e=!1,o=Object.getOwnPropertyNames(t);for(let n of this.outputNames)if(o.indexOf(n)!==-1){let i=t[n];(i===null||i instanceof A)&&(e=!0,a=!1,r[n]=i)}if(e){if(typeof n==`object`&&n)i=n;else if(typeof n<`u`)throw TypeError(`'options' must be an object.`)}else i=t}}else if(typeof t<`u`)throw TypeError(`Unexpected argument[1]: must be 'fetches' or 'options'.`);for(let t of this.inputNames)if(typeof e[t]>`u`)throw Error(`input '${t}' is missing in 'feeds'.`);if(a)for(let e of this.outputNames)r[e]=null;let o=await this.handler.run(e,r,i),s={};for(let e in o)if(Object.hasOwnProperty.call(o,e)){let t=o[e];t instanceof A?s[e]=t:s[e]=new A(t.type,t.data,t.dims)}return xe(`InferenceSession.run`),ye(),s}async release(){return this.handler.dispose()}static async create(t,n,r,i){ve(),be(`InferenceSession.create`);let a,o={};if(typeof t==`string`){if(a=t,typeof n==`object`&&n)o=n;else if(typeof n<`u`)throw TypeError(`'options' must be an object.`)}else if(t instanceof Uint8Array){if(a=t,typeof n==`object`&&n)o=n;else if(typeof n<`u`)throw TypeError(`'options' must be an object.`)}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<`u`&&t instanceof SharedArrayBuffer){let e=t,s=0,c=t.byteLength;if(typeof n==`object`&&n)o=n;else if(typeof n==`number`){if(s=n,!Number.isSafeInteger(s))throw RangeError(`'byteOffset' must be an integer.`);if(s<0||s>=e.byteLength)throw RangeError(`'byteOffset' is out of range [0, ${e.byteLength}).`);if(c=t.byteLength-s,typeof r==`number`){if(c=r,!Number.isSafeInteger(c))throw RangeError(`'byteLength' must be an integer.`);if(c<=0||s+c>e.byteLength)throw RangeError(`'byteLength' is out of range (0, ${e.byteLength-s}].`);if(typeof i==`object`&&i)o=i;else if(typeof i<`u`)throw TypeError(`'options' must be an object.`)}else if(typeof r<`u`)throw TypeError(`'byteLength' must be a number.`)}else if(typeof n<`u`)throw TypeError(`'options' must be an object.`);a=new Uint8Array(e,s,c)}else throw TypeError(`Unexpected argument[0]: must be 'path' or 'buffer'.`);let[s,c]=await m(o),l=await s.createInferenceSessionHandler(a,c);return xe(`InferenceSession.create`),ye(),new e(l)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),Te,Ee=o(()=>{we(),Te=Ce}),De=o(()=>{}),Oe=o(()=>{}),ke=o(()=>{}),Ae=o(()=>{}),je={};s(je,{InferenceSession:()=>Te,TRACE:()=>ge,TRACE_EVENT_BEGIN:()=>be,TRACE_EVENT_END:()=>xe,TRACE_FUNC_BEGIN:()=>ve,TRACE_FUNC_END:()=>ye,Tensor:()=>A,env:()=>S,registerBackend:()=>f});var j=o(()=>{g(),C(),Ee(),he(),De(),Oe(),Se(),ke(),Ae()}),Me=o(()=>{}),Ne={};s(Ne,{default:()=>Ie});var Pe,Fe,Ie,Le=o(()=>{zu(),et(),Ye(),Pe=`ort-wasm-proxy-worker`,Fe=globalThis.self?.name===Pe,Fe&&(self.onmessage=e=>{let{type:t,in:n}=e.data;try{switch(t){case`init-wasm`:L(n.wasm).then(()=>{Du(n).then(()=>{postMessage({type:t})},e=>{postMessage({type:t,err:e})})},e=>{postMessage({type:t,err:e})});break;case`init-ep`:{let{epName:e,env:r}=n;Ou(r,e).then(()=>{postMessage({type:t})},e=>{postMessage({type:t,err:e})});break}case`copy-from`:{let{buffer:e}=n,r=Mu(e);postMessage({type:t,out:r});break}case`create`:{let{model:e,options:r}=n;Nu(e,r).then(e=>{postMessage({type:t,out:e})},e=>{postMessage({type:t,err:e})});break}case`release`:Pu(n),postMessage({type:t});break;case`run`:{let{sessionId:e,inputIndices:r,inputs:i,outputIndices:a,options:o}=n;Iu(e,r,i,a,Array(a.length).fill(null),o).then(e=>{e.some(e=>e[3]!==`cpu`)?postMessage({type:t,err:`Proxy does not support non-cpu tensor location.`}):postMessage({type:t,out:e},Ru([...i,...e]))},e=>{postMessage({type:t,err:e})});break}case`end-profiling`:Lu(n),postMessage({type:t});break;default:}}catch(e){postMessage({type:t,err:e})}}),Ie=Fe?null:e=>new Worker(e??M,{type:`classic`,name:Pe})}),Re,ze,M,Be,Ve,He,N,Ue,We,Ge,Ke,qe,Je,Ye=o(()=>{Me(),Re=typeof location>`u`?void 0:location.origin,ze=()=>typeof document<`u`?document.currentScript?.src:typeof self<`u`?self.location?.href:void 0,M=ze(),Be=()=>{if(M&&!M.startsWith(`blob:`))return M.substring(0,M.lastIndexOf(`/`)+1)},Ve=(e,t)=>{try{let n=t??M;return(n?new URL(e,n):new URL(e)).origin===Re}catch{return!1}},He=(e,t)=>{let n=t??M;try{return(n?new URL(e,n):new URL(e)).href}catch{return}},N=(e,t)=>`${t??`./`}${e}`,Ue=async e=>{let t=await(await fetch(e,{credentials:`same-origin`})).blob();return URL.createObjectURL(t)},We=async e=>(await pe(async()=>{let{default:t}=await import(e);return{default:t}},[])).default,Ge=(Le(),l(Ne)).default,Ke=async()=>{if(!M)throw Error(`Failed to load proxy worker: cannot determine the script source URL.`);if(Ve(M))return[void 0,Ge()];let e=await Ue(M);return[e,Ge(e)]},qe=void 0,Je=async(e,t,n,r)=>{let i=qe&&!(e||t);if(i)if(M)i=Ve(M)||r&&!n;else if(r&&!n)i=!0;else throw Error(`cannot determine the script source URL.`);if(i)return[void 0,qe];{let r=`ort-wasm-simd-threaded.jsep.mjs`,i=e??He(r,t),a=n&&i&&!Ve(i,t),o=a?await Ue(i):i??N(r,t);return[a?o:void 0,await We(o)]}}}),P,F,I,Xe,Ze,Qe,$e,L,R,et=o(()=>{Ye(),F=!1,I=!1,Xe=!1,Ze=()=>{if(typeof SharedArrayBuffer>`u`)return!1;try{return typeof MessageChannel<`u`&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},Qe=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},$e=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},L=async e=>{if(F)return Promise.resolve();if(I)throw Error(`multiple calls to 'initializeWebAssembly()' detected.`);if(Xe)throw Error(`previous call to 'initializeWebAssembly()' failed.`);I=!0;let t=e.initTimeout,n=e.numThreads;if(e.simd!==!1){if(e.simd===`relaxed`){if(!$e())throw Error(`Relaxed WebAssembly SIMD is not supported in the current environment.`)}else if(!Qe())throw Error(`WebAssembly SIMD is not supported in the current environment.`)}let r=Ze();n>1&&!r&&(typeof self<`u`&&!self.crossOriginIsolated&&console.warn(`env.wasm.numThreads is set to `+n+`, but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info.`),console.warn(`WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading.`),e.numThreads=n=1);let i=e.wasmPaths,a=typeof i==`string`?i:void 0,o=i?.mjs,s=o?.href??o,c=i?.wasm,l=c?.href??c,u=e.wasmBinary,[d,f]=await Je(s,a,n>1,!!u||!!l),p=!1,m=[];if(t>0&&m.push(new Promise(e=>{setTimeout(()=>{p=!0,e()},t)})),m.push(new Promise((e,t)=>{let r={numThreads:n};if(u)r.wasmBinary=u,r.locateFile=e=>e;else if(l||a)r.locateFile=e=>l??a+e;else if(s&&s.indexOf(`blob:`)!==0)r.locateFile=e=>new URL(e,s).href;else if(d){let e=Be();e&&(r.locateFile=t=>e+t)}f(r).then(t=>{I=!1,F=!0,P=t,e(),d&&URL.revokeObjectURL(d)},e=>{I=!1,Xe=!0,t(e)})})),await Promise.race(m),p)throw Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},R=()=>{if(F&&P)return P;throw Error(`WebAssembly is not initialized yet.`)}}),tt,z,B,nt=o(()=>{et(),tt=(e,t)=>{let n=R(),r=n.lengthBytesUTF8(e)+1,i=n._malloc(r);return n.stringToUTF8(e,i,r),t.push(i),i},z=(e,t,n,r)=>{if(typeof e==`object`&&e){if(n.has(e))throw Error(`Circular reference in options`);n.add(e)}Object.entries(e).forEach(([e,i])=>{let a=t?t+e:e;if(typeof i==`object`)z(i,a+`.`,n,r);else if(typeof i==`string`||typeof i==`number`)r(a,i.toString());else if(typeof i==`boolean`)r(a,i?`1`:`0`);else throw Error(`Can't handle extra config type: ${typeof i}`)})},B=e=>{let t=R(),n=t.stackSave();try{let n=t.PTR_SIZE,r=t.stackAlloc(2*n);t._OrtGetLastError(r,r+n);let i=Number(t.getValue(r,n===4?`i32`:`i64`)),a=t.getValue(r+n,`*`),o=a?t.UTF8ToString(a):``;throw Error(`${e} ERROR_CODE: ${i}, ERROR_MESSAGE: ${o}`)}finally{t.stackRestore(n)}}}),rt,it=o(()=>{et(),nt(),rt=e=>{let t=R(),n=0,r=[],i=e||{};try{if(e?.logSeverityLevel===void 0)i.logSeverityLevel=2;else if(typeof e.logSeverityLevel!=`number`||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw Error(`log severity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)i.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!=`number`||!Number.isInteger(e.logVerbosityLevel))throw Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(i.terminate=!1);let a=0;return e?.tag!==void 0&&(a=tt(e.tag,r)),n=t._OrtCreateRunOptions(i.logSeverityLevel,i.logVerbosityLevel,!!i.terminate,a),n===0&&B(`Can't create run options.`),e?.extra!==void 0&&z(e.extra,``,new WeakSet,(e,i)=>{let a=tt(e,r),o=tt(i,r);t._OrtAddRunConfigEntry(n,a,o)!==0&&B(`Can't set a run config entry: ${e} - ${i}.`)}),[n,r]}catch(e){throw n!==0&&t._OrtReleaseRunOptions(n),r.forEach(e=>t._free(e)),e}}}),at,ot,st,ct,lt,ut,dt=o(()=>{et(),nt(),at=e=>{switch(e){case`disabled`:return 0;case`basic`:return 1;case`extended`:return 2;case`layout`:return 3;case`all`:return 99;default:throw Error(`unsupported graph optimization level: ${e}`)}},ot=e=>{switch(e){case`sequential`:return 0;case`parallel`:return 1;default:throw Error(`unsupported execution mode: ${e}`)}},st=e=>{e.extra||={},e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||=`1`,e.executionProviders&&e.executionProviders.some(e=>(typeof e==`string`?e:e.name)===`webgpu`)&&(e.enableMemPattern=!1)},ct=(e,t,n,r)=>{let i=tt(t,r),a=tt(n,r);R()._OrtAddSessionConfigEntry(e,i,a)!==0&&B(`Can't set a session config entry: ${t} - ${n}.`)},lt=async(e,t,n)=>{let r=t.executionProviders;for(let t of r){let r=typeof t==`string`?t:t.name,i=[];switch(r){case`webnn`:if(r=`WEBNN`,ct(e,`session.disable_quant_qdq`,`1`,n),ct(e,`session.disable_qdq_constant_folding`,`1`,n),typeof t!=`string`){let r=t?.deviceType;r&&ct(e,`deviceType`,r,n)}break;case`webgpu`:if(r=`JS`,typeof t!=`string`){let r=t;if(r?.preferredLayout){if(r.preferredLayout!==`NCHW`&&r.preferredLayout!==`NHWC`)throw Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${r.preferredLayout}`);ct(e,`preferredLayout`,r.preferredLayout,n)}}break;case`wasm`:case`cpu`:continue;default:throw Error(`not supported execution provider: ${r}`)}let a=tt(r,n),o=i.length,s=0,c=0;if(o>0){s=R()._malloc(o*R().PTR_SIZE),n.push(s),c=R()._malloc(o*R().PTR_SIZE),n.push(c);for(let e=0;e<o;e++)R().setValue(s+e*R().PTR_SIZE,i[e][0],`*`),R().setValue(c+e*R().PTR_SIZE,i[e][1],`*`)}await R()._OrtAppendExecutionProvider(e,a,s,c,o)!==0&&B(`Can't append execution provider: ${r}.`)}},ut=async e=>{let t=R(),n=0,r=[],i=e||{};st(i);try{let e=at(i.graphOptimizationLevel??`all`),a=ot(i.executionMode??`sequential`),o=typeof i.logId==`string`?tt(i.logId,r):0,s=i.logSeverityLevel??2;if(!Number.isInteger(s)||s<0||s>4)throw Error(`log severity level is not valid: ${s}`);let c=i.logVerbosityLevel??0;if(!Number.isInteger(c)||c<0||c>4)throw Error(`log verbosity level is not valid: ${c}`);let l=typeof i.optimizedModelFilePath==`string`?tt(i.optimizedModelFilePath,r):0;if(n=t._OrtCreateSessionOptions(e,!!i.enableCpuMemArena,!!i.enableMemPattern,a,!!i.enableProfiling,0,o,s,c,l),n===0&&B(`Can't create session options.`),i.executionProviders&&await lt(n,i,r),i.enableGraphCapture!==void 0){if(typeof i.enableGraphCapture!=`boolean`)throw Error(`enableGraphCapture must be a boolean value: ${i.enableGraphCapture}`);ct(n,`enableGraphCapture`,i.enableGraphCapture.toString(),r)}if(i.freeDimensionOverrides)for(let[e,a]of Object.entries(i.freeDimensionOverrides)){if(typeof e!=`string`)throw Error(`free dimension override name must be a string: ${e}`);if(typeof a!=`number`||!Number.isInteger(a)||a<0)throw Error(`free dimension override value must be a non-negative integer: ${a}`);let i=tt(e,r);t._OrtAddFreeDimensionOverride(n,i,a)!==0&&B(`Can't set a free dimension override: ${e} - ${a}.`)}return i.extra!==void 0&&z(i.extra,``,new WeakSet,(e,t)=>{ct(n,e,t,r)}),[n,r]}catch(e){throw n!==0&&t._OrtReleaseSessionOptions(n)!==0&&B(`Can't release session options.`),r.forEach(e=>t._free(e)),e}}}),ft,pt,mt,ht,gt,_t,vt,yt,V=o(()=>{ft=e=>{switch(e){case`int8`:return 3;case`uint8`:return 2;case`bool`:return 9;case`int16`:return 5;case`uint16`:return 4;case`int32`:return 6;case`uint32`:return 12;case`float16`:return 10;case`float32`:return 1;case`float64`:return 11;case`string`:return 8;case`int64`:return 7;case`uint64`:return 13;case`int4`:return 22;case`uint4`:return 21;default:throw Error(`unsupported data type: ${e}`)}},pt=e=>{switch(e){case 3:return`int8`;case 2:return`uint8`;case 9:return`bool`;case 5:return`int16`;case 4:return`uint16`;case 6:return`int32`;case 12:return`uint32`;case 10:return`float16`;case 1:return`float32`;case 11:return`float64`;case 8:return`string`;case 7:return`int64`;case 13:return`uint64`;case 22:return`int4`;case 21:return`uint4`;default:throw Error(`unsupported data type: ${e}`)}},mt=(e,t)=>{let n=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],r=typeof t==`number`?t:t.reduce((e,t)=>e*t,1);return n>0?Math.ceil(r*n):void 0},ht=e=>{switch(e){case`float16`:return typeof Float16Array<`u`?Float16Array:Uint16Array;case`float32`:return Float32Array;case`uint8`:return Uint8Array;case`int8`:return Int8Array;case`uint16`:return Uint16Array;case`int16`:return Int16Array;case`int32`:return Int32Array;case`bool`:return Uint8Array;case`float64`:return Float64Array;case`uint32`:return Uint32Array;case`int64`:return BigInt64Array;case`uint64`:return BigUint64Array;default:throw Error(`unsupported type: ${e}`)}},gt=e=>{switch(e){case`verbose`:return 0;case`info`:return 1;case`warning`:return 2;case`error`:return 3;case`fatal`:return 4;default:throw Error(`unsupported logging level: ${e}`)}},_t=e=>e===`float32`||e===`float16`||e===`int32`||e===`int64`||e===`uint32`||e===`uint8`||e===`bool`||e===`uint4`||e===`int4`,vt=e=>e===`float32`||e===`float16`||e===`int32`||e===`int64`||e===`uint32`||e===`uint64`||e===`int8`||e===`uint8`||e===`bool`||e===`uint4`||e===`int4`,yt=e=>{switch(e){case`none`:return 0;case`cpu`:return 1;case`cpu-pinned`:return 2;case`texture`:return 3;case`gpu-buffer`:return 4;case`ml-tensor`:return 5;default:throw Error(`unsupported data location: ${e}`)}}}),bt,xt=o(()=>{Me(),bt=async e=>{if(typeof e==`string`){let t=await fetch(e);if(!t.ok)throw Error(`failed to load external data file: ${e}`);let n=t.headers.get(`Content-Length`),r=n?parseInt(n,10):0;if(r<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw Error(`failed to load external data file: ${e}, no response body.`);let n=t.body.getReader(),i;try{i=new ArrayBuffer(r)}catch(e){if(e instanceof RangeError){let e=Math.ceil(r/65536);i=new WebAssembly.Memory({initial:e,maximum:e}).buffer}else throw e}let a=0;for(;;){let{done:e,value:t}=await n.read();if(e)break;let r=t.byteLength;new Uint8Array(i,a,r).set(t),a+=r}return new Uint8Array(i,0,r)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),St,Ct,wt,Tt,Et,Dt,H,U=o(()=>{V(),St=[`V`,`I`,`W`,`E`,`F`],Ct=(e,t)=>{console.log(`[${St[e]},${new Date().toISOString()}]${t}`)},Et=(e,t)=>{wt=e,Tt=t},Dt=(e,t)=>{let n=gt(e);n>=gt(wt)&&Ct(n,typeof t==`function`?t():t)},H=(...e)=>{Tt&&Dt(...e)}}),Ot,kt,W,At,jt,Mt,Nt,G=o(()=>{Ot=class{static calcMatMulShape(e,t){return e[1]===t[0]?[e[0],t[1]]:void 0}},kt=class{static calcShape(e,t,n=!1){let r=e.length,i=t.length;if(r===0)return t;if(i===0)return e;let a=Math.max(e.length,t.length),o=Array(a);if(n){if(r<2||i<2)return;let n=Ot.calcMatMulShape([e[r-2],e[r-1]],[t[i-2],t[i-1]]);if(n===void 0)return;[o[a-2],o[a-1]]=n}for(let s=n?3:1;s<=a;s++){let n=r-s<0?1:e[r-s],c=i-s<0?1:t[i-s];if(n!==c&&n>1&&c>1)return;let l=Math.max(n,c);if(n&&c)o[a-s]=Math.max(n,c);else{if(l>1)return;o[a-s]=0}}return o}static isValidBroadcast(e,t){let n=e.length,r=t.length;if(n>r)return!1;for(let i=1;i<=n;i++)if(e[n-i]!==1&&e[n-i]!==t[r-i])return!1;return!0}},W=class e{static size(t){return e.getSizeFromDimensionRange(t,0,t.length)}static convertShape(e,t=4){let n=e.length;if(n===0)return[];let r=Array(n),i=n-1;for(;i>=0;){if(e[i]%t===0){r[i]=e[i]/t;break}if(t%e[i]!==0)throw Error(`cannot convert shape`);r[i]=1,t/=e[i],i--}for(i--;i>=0;i--)r[i]=e[i];return r}static sizeFromDimension(t,n){if(n<0||n>t.length)throw Error(`invalid dimension of ${n} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return e.getSizeFromDimensionRange(t,n,t.length)}static sizeToDimension(t,n){if(n<0||n>t.length)throw Error(`invalid dimension of ${n} for sizeToDimension as Tensor has ${t.length} dimensions.`);return e.getSizeFromDimensionRange(t,0,n)}static getSizeFromDimensionRange(e,t,n){let r=1;for(let i=t;i<n;i++){if(e[i]<0)throw Error(`cannot get valid size from specified dimension range. Most likely the range contains negative values in them.`);r*=Number(e[i])}return r}static computeStrides(e){let t=e.length;if(t===0)return[];if(t===1)return[1];let n=Array(t);n[t-1]=1,n[t-2]=e[t-1];for(let r=t-3;r>=0;--r)n[r]=n[r+1]*e[r+1];return n}static normalizeAxis(e,t){if(e<-t&&e>=t)throw Error(`unsupported axis for this operation.`);return e<0?e+t:e}static normalizeAxes(e,t){return e.map(n=>this.normalizeAxis(n,t??e.length))}static sortBasedOnPerm(e,t){return t?t.map(t=>e[t]):e.slice().reverse()}static padShape(e,t){let n=e.length;return e.map((e,r)=>e+t[r]+t[r+n])}static areEqual(e,t){return e.length===t.length&&e.every((e,n)=>e===t[n])}},At=class e{static adjustPoolAttributes(e,t,n,r,i,a){if(!e&&n.length!==t.length-2)throw Error(`length of specified kernel shapes should be 2 less than length of input dimensions`);if(e)for(let e=0;e<t.length-2;e++)e>=n.length?n.push(t[e+2]):n[e]=t[e+2];for(let e=0;e<n.length;e++)if(e<r.length){if(r[e]<0)throw Error(`strides should be greater than or equal to 1`)}else r.push(1);for(let e=0;e<n.length;e++)if(e<i.length){if(i[e]<0)throw Error(`dilations should be greater than or equal to 1`)}else i.push(1);for(let e=0;e<n.length*2;e++)if(e<a.length){if(a[e]<0)throw Error(`pad should be greater than or equal to 1`)}else a.push(0);for(let e=0;e<n.length;e++){if(n[e]<=0)throw Error(`kernel shapes need to be greater than 0`);if(a[e]>=n[e]||a[e+n.length]>=n[e])throw Error(`pads should be smaller than kernel`)}}static adjustPadsBasedOnAutoPad(t,n,r,i,a,o,s){if(s){if(a.length!==2*(t.length-2))throw Error(`length of pads should be twice the length of data dimensions`);if(n.length!==t.length-2)throw Error(`length of strides should be the length of data dimensions`);if(i.length!==t.length-2)throw Error(`length of kernel shapes should be the length of data dimensions`);for(let c=0;c<t.length-2;c++)e.adjustPadAndReturnShape(t[c+(o?1:2)],n[c],r[c],i[c],a,c,c+t.length-2,s)}}static computePoolOutputShape(t,n,r,i,a,o,s){if(n.length<=0)throw Error(`input shape must be of size greater than 0`);let c=[n[0],n[1]];return e.computeShapeHelper(t,n,c,r,i,a,o,s),c}static computeConvOutputShape(t,n,r,i,a,o,s){if(t.length<=0||n.length<=0)throw Error(`invalid input tensor dims or invalid filter tensor dims`);let c=[t[0],n[0]];return e.computeShapeHelper(!1,t,c,r,i,a,o,s),c}static computeShapeHelper(t,n,r,i,a,o,s,c){if(t)for(let e=0;e<n.length-2;e++)r.push(1);else for(let t=0;t<n.length-2;t++)r.push(e.adjustPadAndReturnShape(n[t+2],i[t],a[t],o[t],s,t,t+n.length-2,c))}static adjustPadAndReturnShape(e,t,n,r,i,a,o,s){let c=n*(r-1)+1;if(s&&s!==`NOTSET`)switch(s){case`VALID`:return i[a]=0,i[o]=0,Math.floor((e-c)/t+1);case`SAME_LOWER`:case`SAME_UPPER`:if(n!==1)throw Error(`Dilation not supported for SAME_UPPER or SAME_LOWER`);{let n=((e+t-1)/t-1)*t+r-e;return i[a]=Math.floor(s===`SAME_LOWER`?(n+1)/2:n/2),i[o]=n-i[a],Math.floor((e+n-r)/t+1)}default:throw Error(`Unsupported AutoPad type`)}else return Math.floor((e+i[a]+i[o]-c)/t+1)}},jt=class{static getShapeOfGemmResult(e,t,n,r,i){if(e.length!==2||n.length!==2)throw Error(`shape need to be of size 2`);let a,o,s;t?(a=e[1],o=e[0]):(a=e[0],o=e[1]);let c=-1;if(r?(s=n[0],c=1):(s=n[1],c=0),n[c]!==o)throw Error(`dimension mismatch`);if(a<=0||s<=0||o<=0)throw Error(`invalid shape specified`);if(i&&!kt.isValidBroadcast(i,[a,s]))throw Error(`gemm: invalid bias shape for broadcast`);return[a,s,o]}},Mt=-34028234663852886e22,Nt=34028234663852886e22}),Pt,Ft=o(()=>{V(),Pt=(e,t)=>new(ht(t))(e)}),It,Lt,Rt,zt,K,Bt,Vt,Ht,Ut,Wt,Gt,Kt=o(()=>{V(),U(),It=new Map([[`float32`,32],[`float16`,16],[`int32`,32],[`uint32`,32],[`int64`,64],[`uint64`,64],[`int8`,8],[`uint8`,8],[`int4`,4],[`uint4`,4]]),Lt=(e,t)=>{if(t===`int32`)return e;let n=It.get(t);if(!n)throw Error(`WebNN backend does not support data type: ${t}`);let r=n/8;if(e.byteLength%r!==0)throw Error(`Invalid Uint8Array length - must be a multiple of ${r}.`);let i=e.byteLength/r,a=new(ht(t))(e.buffer,e.byteOffset,i);switch(t){case`int64`:case`uint64`:{let e=new Int32Array(i);for(let t=0;t<i;t++){let n=a[t];if(n>2147483647n||n<-2147483648n)throw Error(`Can not convert int64 data to int32 - value out of range.`);e[t]=Number(n)}return new Uint8Array(e.buffer)}case`int8`:case`uint8`:case`uint32`:{if(t===`uint32`&&a.some(e=>e>2147483647))throw Error(`Can not convert uint32 data to int32 - value out of range.`);let e=Int32Array.from(a,Number);return new Uint8Array(e.buffer)}default:throw Error(`Unsupported data conversion from ${t} to 'int32'`)}},Rt=(e,t)=>{if(t===`int32`)return e;if(e.byteLength%4!=0)throw Error(`Invalid Uint8Array length - must be a multiple of 4 (int32).`);let n=e.byteLength/4,r=new Int32Array(e.buffer,e.byteOffset,n);switch(t){case`int64`:{let e=BigInt64Array.from(r,BigInt);return new Uint8Array(e.buffer)}case`uint64`:{if(r.some(e=>e<0))throw Error(`Can not convert int32 data to uin64 - negative value found.`);let e=BigUint64Array.from(r,BigInt);return new Uint8Array(e.buffer)}case`int8`:{if(r.some(e=>e<-128||e>127))throw Error(`Can not convert int32 data to int8 - value out of range.`);let e=Int8Array.from(r,Number);return new Uint8Array(e.buffer)}case`uint8`:if(r.some(e=>e<0||e>255))throw Error(`Can not convert int32 data to uint8 - value out of range.`);return Uint8Array.from(r,Number);case`uint32`:{if(r.some(e=>e<0))throw Error(`Can not convert int32 data to uint32 - negative value found.`);let e=Uint32Array.from(r,Number);return new Uint8Array(e.buffer)}default:throw Error(`Unsupported data conversion from 'int32' to ${t}`)}},zt=1,K=()=>zt++,Bt=new Map([[`int8`,`int32`],[`uint8`,`int32`],[`uint32`,`int32`],[`int64`,`int32`]]),Vt=(e,t)=>{let n=It.get(e);if(!n)throw Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((e,t)=>e*t)*n/8):0},Ht=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:n,tensor:r,dataType:i,shape:a,fallbackDataType:o}=e;this.sessionId=t,this.mlContext=n,this.mlTensor=r,this.dataType=i,this.tensorShape=a,this.fallbackDataType=o}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return Vt(this.dataType,this.tensorShape)}destroy(){H(`verbose`,()=>`[WebNN] TensorWrapper.destroy`),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),n=Rt(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(n);return}else return new Uint8Array(n).buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,n){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===n.length&&this.tensorShape.every((e,t)=>e===n[t])}setIsDataConverted(e){this.isDataConverted=e}},Ut=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,n,r){let i=this.tensorManager.getMLContext(e),a=this.tensorManager.getMLOpSupportLimits(e),o;if(!a?.input.dataTypes.includes(t)){if(o=Bt.get(t),!o||a?.input.dataTypes.includes(o))throw Error(`WebNN backend does not support data type: ${t}`);H(`verbose`,()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${o}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(i,t,n))return this.wrapper.tensor;if(r){if(this.wrapper.byteLength!==Vt(t,n))throw Error(`Unable to copy data to tensor with different size.`);this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let s=typeof MLTensorUsage>`u`?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,n,s,!0,!0,o),r&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType===`int32`)t=Lt(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else H(`verbose`,()=>`Data size does not match tensor size. Releasing tensor.`),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){if(this.activeUpload){let t=this.wrapper?.isDataConverted?Rt(this.activeUpload,this.wrapper?.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(t):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(t);return}else return t.buffer}if(!this.wrapper)throw Error(`Tensor has not been created.`);return e?this.wrapper.read(e):this.wrapper.read()}},Wt=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw Error(`MLContext not found for session.`);return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=K();return this.tensorTrackersById.set(e,new Ut(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,n,r,i){H(`verbose`,()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${n}, shape: ${r}, copyOld: ${i}}`);let a=this.tensorTrackersById.get(t);if(!a)throw Error(`Tensor not found.`);return a.ensureTensor(e,n,r,i)}upload(e,t){let n=this.tensorTrackersById.get(e);if(!n)throw Error(`Tensor not found.`);n.upload(t)}async download(e,t){H(`verbose`,()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.byteLength}}`);let n=this.tensorTrackersById.get(e);if(!n)throw Error(`Tensor not found.`);return n.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,n,r){let i=this.getMLContext(e),a=K(),o=new Ht({sessionId:e,context:i,tensor:t,dataType:n,shape:r});return this.tensorTrackersById.set(a,new Ut(this,o)),this.externalTensors.add(o),a}async getCachedTensor(e,t,n,r,i,a,o){let s=this.getMLContext(e);for(let[r,i]of this.freeTensors.entries())if(i.canReuseTensor(s,t,n)){H(`verbose`,()=>`[WebNN] Reusing tensor {dataType: ${t}, ${o?`fallbackDataType: ${o},`:``} shape: ${n}`);let i=this.freeTensors.splice(r,1)[0];return i.sessionId=e,i}H(`verbose`,()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${o?`fallbackDataType: ${o},`:``} shape: ${n}}`);let c=await s.createTensor({dataType:o??t,shape:n,dimensions:n,usage:r,writable:i,readable:a});return new Ht({sessionId:e,context:s,tensor:c,dataType:t,shape:n,fallbackDataType:o})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},Gt=(...e)=>new Wt(...e)}),qt,Jt,Yt,Xt=o(()=>{V(),et(),Ft(),Kt(),U(),qt=new Map([[1,`float32`],[10,`float16`],[6,`int32`],[12,`uint32`],[7,`int64`],[13,`uint64`],[22,`int4`],[21,`uint4`],[3,`int8`],[2,`uint8`],[9,`uint8`]]),Jt=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let n=Object.keys(e).sort(),r=Object.keys(t).sort();return n.length===r.length&&n.every((n,i)=>n===r[i]&&e[n]===t[n])},Yt=class{constructor(e){this.tensorManager=Gt(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,Et(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw Error(`No active session`);return this.activeSessionId}onRunStart(e){H(`verbose`,()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){H(`verbose`,()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let e of t)H(`verbose`,()=>`[WebNN] releasing temporary tensor {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let t=this.mlContextCache.findIndex(t=>t.gpuDevice===e);if(t!==-1)return this.mlContextCache[t].mlContext;{let t=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:t}),t}}else if(e===void 0){let e=this.mlContextCache.findIndex(e=>e.options===void 0&&e.gpuDevice===void 0);if(e!==-1)return this.mlContextCache[e].mlContext;{let e=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:e}),e}}let t=this.mlContextCache.findIndex(t=>Jt(t.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let t=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:t}),t}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let n=this.sessionIdsByMLContext.get(t);n||(n=new Set,this.sessionIdsByMLContext.set(t,n)),n.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let n=this.sessionIdsByMLContext.get(t);if(n.delete(e),n.size===0){this.sessionIdsByMLContext.delete(t);let e=this.mlContextCache.findIndex(e=>e.mlContext===t);e!==-1&&this.mlContextCache.splice(e,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){H(`verbose`,()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,n,r,i){let a=qt.get(n);if(!a)throw Error(`Unsupported ONNX data type: ${n}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,a,r,i)}async createTemporaryTensor(e,t,n){H(`verbose`,()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${n}}`);let r=qt.get(t);if(!r)throw Error(`Unsupported ONNX data type: ${t}`);let i=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,i,r,n,!1);let a=this.temporarySessionTensorIds.get(e);return a?a.push(i):this.temporarySessionTensorIds.set(e,[i]),i}uploadTensor(e,t){if(!R().shouldTransferToMLTensor)throw Error(`Trying to upload to a MLTensor while shouldTransferToMLTensor is false`);H(`verbose`,()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let n=await this.tensorManager.download(e);return Pt(n,t)}}registerMLTensor(e,t,n,r){let i=qt.get(n);if(!i)throw Error(`Unsupported ONNX data type: ${n}`);let a=this.tensorManager.registerTensor(e,t,i,r);return H(`verbose`,()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${i}, dimensions: ${r}} -> {tensorId: ${a}}`),a}registerMLConstant(e,t,n,r,i,a,o=!1){if(!a)throw Error(`External mounted files are not available.`);let s=e;e.startsWith(`./`)&&(s=e.substring(2));let c=a.get(s);if(!c)throw Error(`File with name ${s} not found in preloaded files.`);if(t+n>c.byteLength)throw Error(`Out of bounds: data offset and length exceed the external file data size.`);let l=c.slice(t,t+n).buffer,u;switch(i.dataType){case`float32`:u=new Float32Array(l);break;case`float16`:u=typeof Float16Array<`u`?new Float16Array(l):new Uint16Array(l);break;case`int32`:u=new Int32Array(l);break;case`uint32`:u=new Uint32Array(l);break;case`int64`:if(o){let e=Lt(new Uint8Array(l),`int64`);u=new Int32Array(e.buffer),i.dataType=`int32`}else u=new BigInt64Array(l);break;case`uint64`:u=new BigUint64Array(l);break;case`int8`:u=new Int8Array(l);break;case`int4`:case`uint4`:case`uint8`:u=new Uint8Array(l);break;default:throw Error(`Unsupported data type: ${i.dataType} in creating WebNN Constant from external data.`)}return H(`verbose`,()=>`[WebNN] registerMLConstant {dataType: ${i.dataType}, shape: ${i.shape}}} ${o?`(Note: it was int64 data type and registered to int32 as workaround)`:``}`),r.constant(i,u)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let n=this.sessionGraphInputs.get(e);return n?n.includes(t):!1}isGraphOutput(e,t){let n=this.sessionGraphOutputs.get(e);return n?n.includes(t):!1}isGraphInputOutputTypeSupported(e,t,n=!0){let r=qt.get(ft(t)),i=this.mlOpSupportLimitsBySessionId.get(e);return typeof r>`u`?!1:n?!!i?.input.dataTypes.includes(r):!!i?.output.dataTypes.includes(r)}flush(){}}}),Zt=o(()=>{}),Qt,$t,en,tn,nn,rn,an,on,sn,cn=o(()=>{U(),Zt(),Qt=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),$t=[],en=e=>Math.ceil(Number(e)/16)*16,tn=e=>{for(let t=0;t<$t.length;t++){let n=$t[t];if(e<=n)return n}return Math.ceil(e/16)*16},nn=1,rn=()=>nn++,an=async(e,t,n,r)=>{let i=en(n),a=e.device.createBuffer({size:i,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let o=e.getCommandEncoder();e.endComputePass(),o.copyBufferToBuffer(t,0,a,0,i),e.flush(),await a.mapAsync(GPUMapMode.READ);let s=a.getMappedRange();if(r){let e=r();return e.set(new Uint8Array(s,0,n)),e}else return new Uint8Array(s.slice(0,n))}finally{a.destroy()}},on=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[e]of Qt)$t.push(e),this.freeBuffers.set(e,[]),this.freeUniformBuffers.set(e,[]);this.sessionCount=0}upload(e,t){let n=t.buffer,r=t.byteOffset,i=t.byteLength,a=en(i),o=this.storageCache.get(e);if(!o)throw Error(`gpu data for uploading does not exist`);if(Number(o.originalSize)!==i)throw Error(`inconsistent data size. gpu data size=${o.originalSize}, data size=${i}`);let s=this.backend.device.createBuffer({mappedAtCreation:!0,size:a,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),c=s.getMappedRange();new Uint8Array(c).set(new Uint8Array(n,r,i)),s.unmap();let l=this.backend.device.createCommandEncoder();l.copyBufferToBuffer(s,0,o.gpuData.buffer,0,a),this.backend.device.queue.submit([l.finish()]),s.destroy(),H(`verbose`,()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let n=this.storageCache.get(e);if(!n)throw Error(`source gpu data for memcpy does not exist`);let r=this.storageCache.get(t);if(!r)throw Error(`destination gpu data for memcpy does not exist`);if(n.originalSize!==r.originalSize)throw Error(`inconsistent source and destination gpu data size`);let i=en(n.originalSize),a=this.backend.getCommandEncoder();this.backend.endComputePass(),a.copyBufferToBuffer(n.gpuData.buffer,0,r.gpuData.buffer,0,i)}registerExternalBuffer(e,t,n){let r;if(n){if(r=n[0],e===n[1])return H(`verbose`,()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${r}, buffer is the same, skip.`),r;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else r=rn();return this.storageCache.set(r,{gpuData:{id:r,type:0,buffer:e},originalSize:t}),H(`verbose`,()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${r}, registered.`),r}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),H(`verbose`,()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let n=tn(e),r,i=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,a=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(i||a){let e=(i?this.freeBuffers:this.freeUniformBuffers).get(n);r=e&&e.length>0?e.pop():this.backend.device.createBuffer({size:n,usage:t})}else r=this.backend.device.createBuffer({size:n,usage:t});let o={id:rn(),type:0,buffer:r};return this.storageCache.set(o.id,{gpuData:o,originalSize:Number(e)}),H(`verbose`,()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${o.id}`),o}get(e){return this.storageCache.get(e)?.gpuData}release(e){let t=typeof e==`bigint`?Number(e):e,n=this.storageCache.get(t);if(!n){if(this.storageCache.size===0)return 0;throw Error(`releasing data does not exist`)}return H(`verbose`,()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${n.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(n.gpuData.buffer),n.originalSize}async download(e,t){let n=this.storageCache.get(Number(e));if(!n)throw Error(`data does not exist`);await an(this.backend,n.gpuData.buffer,n.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=Qt.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let n=this.freeBuffers.get(e.size)||[];t===void 0||n.length>=t?e.destroy():n.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let n=this.freeUniformBuffers.get(e.size)||[];t===void 0||n.length>=t?e.destroy():n.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(e=>{e.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(e=>{e.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(e=>{e.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(e=>{e.destroy()}),this.capturedPendingBuffers.delete(e)),--this.sessionCount,this.sessionCount===0&&(H(`warning`,()=>`[WebGPU] Clearing webgpu buffer cache`),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.storageCache=new Map)}},sn=(...e)=>new on(...e)}),ln,q,un=o(()=>{ln=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(`;`),this.key}},q=e=>new ln(e)}),dn,fn,pn,mn,J,hn,gn,_n,vn,Y,yn,X,Z,bn,xn,Sn,Cn,Q=o(()=>{V(),G(),dn=64,fn=(e,t)=>{if(t===3)throw Error(`vec3 has same alignment as vec4, use vec4 instead`);switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:`f16`;case 1:return t>1?`vec${t}<f32>`:`f32`;case 6:return t>1?`vec${t}<i32>`:`i32`;case 12:return t>1?`vec${t}<u32>`:`u32`;case 7:if(t>1)throw Error(`currently not supported vecX of uint64 yet`);return[`vec2<u32>`,`i32`];case 13:if(t>1)throw Error(`currently not supported vecX of uint64 yet`);return[`vec2<u32>`,`u32`];case 9:if(t!==4)throw Error(`bool must be vec4`);return[`u32`,`vec4<bool>`];case 22:return`i32`;case 21:return`u32`;default:throw Error(`Unknown data type: ${e}`)}},pn=(e,t=1)=>{let n=fn(e,t);return typeof n==`string`?n:n[0]},mn=(e,t=1)=>{let n=fn(e,t);return typeof n==`string`?n:n[1]},J=(...e)=>{let t=[];return e.forEach(e=>{e.length!==0&&t.push({type:12,data:e},{type:12,data:W.computeStrides(e)})}),t},hn=e=>e%4==0?4:e%2==0?2:1,gn=(e=`f32`,t,n=`0`)=>!t||t===1?`${e}(${n})`:`vec${t}<${e}>(${n})`,_n=(e,t,n)=>e===`f32`?n:t===1?`f32(${n})`:`vec${t}<f32>(${n})`,vn=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,Y=(e,t,n,r)=>e.startsWith(`uniforms.`)&&n>4?typeof t==`string`?r===`f16`?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:r===`f16`?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:n>1?`${e}[${t}]`:e,yn=(e,t,n,r,i)=>{let a=typeof n==`number`,o=a?n:n.length,s=[...Array(o).keys()],c=o<2?`u32`:o<=4?`vec${o}<u32>`:`array<u32, ${o}>`,l=fn(t,i),u=typeof l==`string`?l:l[1],d={indices:c,value:u,storage:typeof l==`string`?l:l[0],tensor:t},f=e=>typeof e==`string`?e:`${e}u`,p={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},m=a?`uniforms.`:``,h=`${m}${e}_shape`,g=`${m}${e}_strides`,_=``;for(let e=0;e<o-1;e++)_+=`
    let dim${e} = current / ${Y(g,e,o)};
    let rest${e} = current % ${Y(g,e,o)};
    indices[${e}] = dim${e};
    current = rest${e};
    `;_+=`indices[${o-1}] = current;`;let v=o<2?``:`
  fn o2i_${e}(offset: u32) -> ${d.indices} {
    var indices: ${d.indices};
    var current = offset;
    ${_}
    return indices;
  }`,y=t=>(p.offsetToIndices=!0,o<2?t:`o2i_${e}(${t})`),b=[];if(o>=2)for(let e=o-1;e>=0;e--)b.push(`${Y(g,e,o)} * (indices[${e}])`);let x=o<2?``:`
  fn i2o_${e}(indices: ${d.indices}) -> u32 {
    return ${b.join(`+`)};
  }`,S=t=>(p.indicesToOffset=!0,o<2?t:`i2o_${e}(${t})`),C=(...e)=>o===0?`0u`:`${d.indices}(${e.map(f).join(`,`)})`,w=(e,t)=>o<2?`${e}`:`${Y(e,t,o)}`,T=(e,t,n)=>o<2?`${e}=${n};`:`${Y(e,t,o)}=${n};`,E={},D=(t,n)=>{p.broadcastedIndicesToOffset=!0;let r=`${n.name}broadcastedIndicesTo${e}Offset`;if(r in E)return`${r}(${t})`;let i=[];for(let e=o-1;e>=0;e--){let t=n.indicesGet(`outputIndices`,e+n.rank-o);i.push(`${w(g,e)} * (${t} % ${w(h,e)})`)}return E[r]=`fn ${r}(outputIndices: ${n.type.indices}) -> u32 {
             return ${i.length>0?i.join(`+`):`0u`};
           }`,`${r}(${t})`},ee=(t,n)=>(()=>{if(d.storage===d.value)return`${e}[${t}]=${n};`;if(d.storage===`vec2<u32>`&&d.value===`i32`)return`${e}[${t}]=vec2<u32>(u32(${n}), select(0u, 0xFFFFFFFFu, ${n} < 0));`;if(d.storage===`vec2<u32>`&&d.value===`u32`)return`${e}[${t}]=vec2<u32>(u32(${n}), 0u);`;if(d.storage===`u32`&&d.value===`vec4<bool>`)return`${e}[${t}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${n}));`;throw Error(`not supported combination of storage type ${d.storage} and value type ${d.value} yet`)})(),te=t=>(()=>{if(d.storage===d.value)return`${e}[${t}]`;if(d.storage===`vec2<u32>`&&d.value===`i32`)return`i32(${e}[${t}].x)`;if(d.storage===`vec2<u32>`&&d.value===`u32`)return`u32(${e}[${t}].x)`;if(d.storage===`u32`&&d.value===`vec4<bool>`)return`vec4<bool>(bool(${e}[${t}] & 0xFFu), bool(${e}[${t}] & 0xFF00u), bool(${e}[${t}] & 0xFF0000u), bool(${e}[${t}] & 0xFF000000u))`;throw Error(`not supported combination of storage type ${d.storage} and value type ${d.value} yet`)})(),ne=o<2?``:`
  fn get_${e}ByIndices(indices: ${d.indices}) -> ${u} {
    return ${te(`i2o_${e}(indices)`)};
  }`,re=o<2?``:(()=>{let t=s.map(e=>`d${e}: u32`).join(`, `),n=s.map(e=>`d${e}`).join(`, `);return`
  fn get_${e}(${t}) -> ${u} {
    return get_${e}ByIndices(${C(n)});
  }`})(),O=(...t)=>{if(t.length!==o)throw Error(`indices length must be ${o}`);let n=t.map(f).join(`,`);return o===0?te(`0u`):o===1?te(n[0]):(p.get=!0,p.getByIndices=!0,p.indicesToOffset=!0,`get_${e}(${n})`)},ie=t=>o<2?te(t):(p.getByIndices=!0,p.indicesToOffset=!0,`get_${e}ByIndices(${t})`),ae=o<2?``:`
  fn set_${e}ByIndices(indices: ${d.indices}, value: ${u}) {
    ${ee(`i2o_${e}(indices)`,`value`)}
  }`,oe=o<2?``:(()=>{let t=s.map(e=>`d${e}: u32`).join(`, `),n=s.map(e=>`d${e}`).join(`, `);return`
  fn set_${e}(${t}, value: ${u}) {
    set_${e}ByIndices(${C(n)}, value);
  }`})();return{impl:()=>{let e=[],t=!1;return p.offsetToIndices&&(e.push(v),t=!0),p.indicesToOffset&&(e.push(x),t=!0),p.broadcastedIndicesToOffset&&(Object.values(E).forEach(t=>e.push(t)),t=!0),p.set&&(e.push(oe),t=!0),p.setByIndices&&(e.push(ae),t=!0),p.get&&(e.push(re),t=!0),p.getByIndices&&(e.push(ne),t=!0),!a&&t&&e.unshift(`const ${h} = ${d.indices}(${n.join(`,`)});`,`const ${g} = ${d.indices}(${W.computeStrides(n).join(`,`)});`),e.join(`
`)},type:d,offsetToIndices:y,indicesToOffset:S,broadcastedIndicesToOffset:D,indices:C,indicesGet:w,indicesSet:T,set:(...t)=>{if(t.length!==o+1)throw Error(`indices length must be ${o}`);let n=t[o];if(typeof n!=`string`)throw Error(`value must be string`);let r=t.slice(0,o).map(f).join(`,`);return o===0?ee(`0u`,n):o===1?ee(r[0],n):(p.set=!0,p.setByIndices=!0,p.indicesToOffset=!0,`set_${e}(${r}, ${n})`)},setByOffset:ee,setByIndices:(t,n)=>o<2?ee(t,n):(p.setByIndices=!0,p.indicesToOffset=!0,`set_${e}ByIndices(${t}, ${n});`),get:O,getByOffset:te,getByIndices:ie,usage:r,name:e,strides:g,shape:h,rank:o}},X=(e,t,n,r=1)=>yn(e,t,n,`input`,r),Z=(e,t,n,r=1)=>yn(e,t,n,`output`,r),bn=(e,t,n)=>yn(e,t,n,`atomicOutput`,1),xn=(e,t,n,r=1)=>yn(e,t,n,`internal`,r),Sn=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e==`number`?`${e}u`:e}) { return; }`}mainStart(e=dn){let t=typeof e==`number`?e:e[0],n=typeof e==`number`?1:e[1],r=typeof e==`number`?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||n>this.limits.maxComputeWorkgroupSizeY||r>this.limits.maxComputeWorkgroupSizeZ)throw Error(`workgroup size [${t}, ${n}, ${r}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*n*r>this.limits.maxComputeInvocationsPerWorkgroup)throw Error(`workgroup size [${t}, ${n}, ${r}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let i=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1;return`@compute @workgroup_size(${t}, ${n}, ${r})
  fn main(${i?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`}) {
    ${i?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*n*r}u + local_idx;`}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith(`uniforms.`)&&this.uniforms.push({name:e.shape.replace(`uniforms.`,``),type:`u32`,length:e.rank}),e.strides.startsWith(`uniforms.`)&&this.uniforms.push({name:e.strides.replace(`uniforms.`,``),type:`u32`,length:e.rank}))}declareVariable(e,t){if(e.usage===`internal`)throw Error(`cannot use internal variable with declareVariable(). use registerInternalVariables() instead.`);this.variables.push(e),this.appendVariableUniforms(e);let n=e.usage===`input`?`read`:`read_write`,r=e.usage===`atomicOutput`?`atomic<i32>`:e.type.storage;return`@group(0) @binding(${t}) var<storage, ${n}> ${e.name}: array<${r}>;`}declareVariables(...e){return e.map(e=>this.declareVariable(e,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!==`internal`)throw Error(`cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.`);this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(e=>this.registerInternalVariable(e)),this}registerUniform(e,t,n=1){return this.uniforms.push({name:e,type:t,length:n}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return``;let e=[];for(let{name:t,type:n,length:r}of this.uniforms)if(r&&r>4)n===`f16`?e.push(`@align(16) ${t}:array<mat2x4<${n}>, ${Math.ceil(r/8)}>`):e.push(`${t}:array<vec4<${n}>, ${Math.ceil(r/4)}>`);else{let i=r==null||r===1?n:`vec${r}<${n}>`;e.push(`${t}:${i}`)}return`
      struct Uniforms { ${e.join(`, `)} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=e=>[12,10,1,6][[`u32`,`f16`,`f32`,`i32`].indexOf(e)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},Cn=(e,t)=>new Sn(e,t)}),wn,Tn,En,Dn,On,kn,An,jn,Mn,Nn=o(()=>{V(),G(),un(),Q(),wn=(e,t)=>{if(!e||e.length!==1)throw Error(`Transpose requires 1 input.`);if(t.length!==0&&t.length!==e[0].dims.length)throw Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},Tn=(e,t)=>t.length===0?[...Array(e).keys()].reverse():t,En=(e,t)=>W.sortBasedOnPerm(e,Tn(e.length,t)),Dn=(e,t,n,r)=>{let i=`fn perm(i: ${r.type.indices}) -> ${n.type.indices} {
    var a: ${n.type.indices};`;for(let n=0;n<t;++n)i+=`a[${e[n]}]=i[${n}];`;return i+=`return a;}`},On=(e,t)=>{let n=[],r=[];for(let i=0;i<e.length;++i)e[i]!==1&&n.push(e[i]),e[t[i]]!==1&&r.push(t[i]);return{newShape:n,newPerm:r}},kn=(e,t)=>{let n=0;for(let r=0;r<e.length;++r)if(t[e[r]]!==1){if(e[r]<n)return!1;n=e[r]}return!0},An=(e,t)=>{let n=e.dataType,r=e.dims.length,i=Tn(r,t),a=En(e.dims,i),o=e.dims,s=a,c=r<2||kn(i,e.dims),l;if(c)return l=e=>{let t=X(`input`,n,o,4),r=Z(`output`,n,s,4);return`
  ${e.registerUniform(`output_size`,`u32`).declareVariables(t,r)}
  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
    output[global_idx] = input[global_idx];
  }`},{name:`TransposeCopy`,shaderCache:{inputDependencies:[`type`]},getRunData:()=>{let t=W.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(t/64/4)},programUniforms:[{type:12,data:Math.ceil(t/4)}]}},getShaderSource:l};let{newShape:u,newPerm:d}=On(e.dims,i),f=W.areEqual(d,[2,3,1]),p=W.areEqual(d,[3,1,2]);return u.length===2||f||p?(o=f?[u[0],u[1]*u[2]]:p?[u[0]*u[1],u[2]]:u,s=[o[1],o[0]],l=e=>{let t=X(`a`,n,o.length),r=Z(`output`,n,s.length);return`
  ${e.registerUniform(`output_size`,`u32`).declareVariables(t,r)}
  var<workgroup> tile : array<array<${r.type.value}, 17>, 16>;
  ${e.mainStart([16,16,1])}
    let stride = (uniforms.output_shape[1] - 1) / 16 + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * 16u + local_id.x;
    let input_row = workgroup_id_x * 16u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${t.getByIndices(`${t.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * 16u + local_id.x;
    let output_row = workgroup_id_y * 16u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${r.setByIndices(`${r.type.indices}(output_row, output_col)`,`tile[local_id.x][local_id.y]`)}
    }
  }`},{name:`TransposeShared`,shaderCache:{inputDependencies:[`type`]},getRunData:()=>{let t=W.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(s[1]/16),y:Math.ceil(s[0]/16)},programUniforms:[{type:12,data:t},...J(o,s)]}},getShaderSource:l}):(l=e=>{let t=X(`a`,n,o.length),a=Z(`output`,n,s.length);return`
  ${e.registerUniform(`output_size`,`u32`).declareVariables(t,a)}

  ${Dn(i,r,t,a)}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}

    let indices = ${a.offsetToIndices(`global_idx`)};
    let aIndices = perm(indices);

    ${a.setByOffset(`global_idx`,t.getByIndices(`aIndices`))}
  }`},{name:`Transpose`,shaderCache:{hint:`${t}`,inputDependencies:[`rank`]},getRunData:()=>{let t=W.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(t/64)},programUniforms:[{type:12,data:t},...J(o,s)]}},getShaderSource:l})},jn=(e,t)=>{wn(e.inputs,t.perm),e.compute(An(e.inputs[0],t.perm))},Mn=e=>q({perm:e.perm})}),Pn,Fn,In,Ln,Rn,zn,Bn,Vn,Hn,Un,Wn,Gn,Kn,qn,Jn,Yn,Xn,Zn,Qn,$n,er,tr=o(()=>{V(),G(),Q(),Or(),Nn(),Pn={max:`select(bestValue, candidate, candidate > bestValue)`,min:`select(bestValue, candidate, candidate < bestValue)`,mean:`bestValue + candidate`,sum:`bestValue + candidate`,prod:`bestValue * candidate`,sumSquare:`bestValue + candidate * candidate`,logSumExp:`bestValue + exp(candidate)`,l1:`bestValue + abs(candidate)`,l2:`bestValue + candidate * candidate`,logSum:`bestValue + candidate`},Fn={max:`select(bestValue, candidate, candidate > bestValue)`,min:`select(bestValue, candidate, candidate < bestValue)`,mean:`bestValue + candidate`,sum:`bestValue + candidate`,prod:`bestValue * candidate`,sumSquare:`bestValue + candidate`,logSumExp:`bestValue + candidate`,l1:`bestValue + candidate`,l2:`bestValue + candidate`,logSum:`bestValue + candidate`},In={max:`_A[offset]`,min:`_A[offset]`,mean:`0`,sum:`0`,prod:`1`,sumSquare:`0`,logSumExp:`0`,l1:`0`,l2:`0`,logSum:`0`},Ln={max:`bestValue`,min:`bestValue`,sum:`bestValue`,prod:`bestValue`,sumSquare:`bestValue`,logSumExp:`log(bestValue)`,l1:`bestValue`,l2:`sqrt(bestValue)`,logSum:`log(bestValue)`},Rn=(e,t)=>{let n=[];for(let r=t-e;r<t;++r)n.push(r);return n},zn=(e,t)=>{let n=[],r=e.length;for(let i=0;i<r;i++)t.indexOf(i)===-1&&n.push(e[i]);return[n,t.map(t=>e[t])]},Bn=(e,t)=>{let n=e.length+t.length,r=[],i=0;for(let a=0;a<n;a++)t.indexOf(a)===-1?r.push(e[i++]):r.push(1);return r},Vn=(e,t)=>{for(let n=0;n<e.length;++n)if(e[e.length-n-1]!==t-1-n)return!1;return!0},Hn=(e,t)=>{let n=[];if(!Vn(e,t)){for(let r=0;r<t;++r)e.indexOf(r)===-1&&n.push(r);e.forEach(e=>n.push(e))}return n},Un=(e,t,n,r,i,a,o)=>{let s=n[0].dims,c=W.size(a),l=W.size(o),u=X(`_A`,n[0].dataType,s),d=Z(`output`,i,a),f=64;c===1&&(f=256);let p=`
          var<workgroup> aBestValues : array<f32, ${f}>;
       `;return{name:e,shaderCache:{hint:`${t};${f}`,inputDependencies:[`type`]},getShaderSource:e=>`
        ${e.registerUniform(`reduceSize`,`u32`).declareVariables(u,d)}
        ${p}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${e.mainStart(f)}

          let outputIndex = global_idx / ${f};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${In[r]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${f}) {
           let candidate = f32(${u.getByOffset(`offset + k`)});
           bestValue = ${Pn[r]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${f}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${Fn[r]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${d.setByOffset(`outputIndex`,`${r===`mean`?`${d.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${d.type.storage}(${Ln[r]})`}`)};
         }
        }`,getRunData:()=>({outputs:[{dims:a,dataType:i}],dispatchGroup:{x:c},programUniforms:[{type:12,data:l}]})}},Wn=(e,t,n,r)=>{let i=e.inputs.length===1?n:ar(e.inputs,n),a=i.axes;a.length===0&&!i.noopWithEmptyAxes&&(a=e.inputs[0].dims.map((e,t)=>t));let o=W.normalizeAxes(a,e.inputs[0].dims.length),s=o,c=e.inputs[0],l=Hn(s,e.inputs[0].dims.length);l.length>0&&(c=e.compute(An(e.inputs[0],l),{inputs:[0],outputs:[-1]})[0],s=Rn(s.length,c.dims.length));let[u,d]=zn(c.dims,s),f=u;i.keepDims&&(f=Bn(u,o)),e.compute(Un(t,i.cacheKey,[c],r,e.inputs[0].dataType,f,d),{inputs:[c]})},Gn=(e,t)=>{Wn(e,`ReduceMeanShared`,t,`mean`)},Kn=(e,t)=>{Wn(e,`ReduceL1Shared`,t,`l1`)},qn=(e,t)=>{Wn(e,`ReduceL2Shared`,t,`l2`)},Jn=(e,t)=>{Wn(e,`ReduceLogSumExpShared`,t,`logSumExp`)},Yn=(e,t)=>{Wn(e,`ReduceMaxShared`,t,`max`)},Xn=(e,t)=>{Wn(e,`ReduceMinShared`,t,`min`)},Zn=(e,t)=>{Wn(e,`ReduceProdShared`,t,`prod`)},Qn=(e,t)=>{Wn(e,`ReduceSumShared`,t,`sum`)},$n=(e,t)=>{Wn(e,`ReduceSumSquareShared`,t,`sumSquare`)},er=(e,t)=>{Wn(e,`ReduceLogSumShared`,t,`logSum`)}}),nr,rr,ir,ar,or,sr,cr,lr,ur,dr,fr,pr,mr,hr,gr,_r,vr,yr,br,xr,Sr,Cr,wr,Tr,Er,Dr,Or=o(()=>{V(),G(),un(),Q(),tr(),nr=e=>{if(!e||e.length===0||e.length>2)throw Error(`Reduce op requires 1 or 2 inputs.`);if(e.length===2&&e[1].dims.length!==1)throw Error(`Invalid axes input dims.`)},rr=e=>[``,``,`var value = ${e.getByIndices(`input_indices`)};`,``],ir=(e,t,n,r,i,a,o=!1,s=!1)=>{let c=[],l=n[0].dims,u=l.length,d=W.normalizeAxes(i,u),f=!s&&d.length===0;l.forEach((e,t)=>{f||d.indexOf(t)>=0?o&&c.push(1):c.push(e)});let p=c.length,m=W.size(c);return{name:e,shaderCache:t,getShaderSource:e=>{let t=[],i=X(`_A`,n[0].dataType,u),s=Z(`output`,a,p),c=r(i,s,d),m=c[2];for(let e=0,n=0;e<u;e++)f||d.indexOf(e)>=0?(o&&n++,m=`for(var j${e}: u32 = 0; j${e} < ${l[e]}; j${e}++) {
                  ${c[2].includes(`last_index`)?`let last_index = j${e};`:``}
                  ${i.indicesSet(`input_indices`,e,`j${e}`)}
                  ${m}
                }`):(t.push(`${i.indicesSet(`input_indices`,e,s.indicesGet(`output_indices`,n))};`),n++);return`

        ${e.registerUniform(`output_size`,`u32`).declareVariables(i,s)}

        ${e.mainStart()}
          ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
          var input_indices: ${i.type.indices};
          let output_indices = ${s.offsetToIndices(`global_idx`)};

          ${t.join(`
`)}
          ${c[0]}       // init ops for reduce max/min
          ${c[1]}
          ${m}
          ${c[3]}
          ${c.length===4?s.setByOffset(`global_idx`,`value`):c.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:c,dataType:a}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},...J(l,c)]})}},ar=(e,t)=>{let n=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(e=>n.push(Number(e))),q({axes:n,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},or=(e,t,n,r)=>{let i=e.inputs,a=i.length===1?n:ar(i,n);e.compute(ir(t,{hint:a.cacheKey,inputDependencies:[`rank`]},[i[0]],a.noopWithEmptyAxes&&a.axes.length===0?rr:r,a.axes,i[0].dataType,a.keepDims,a.noopWithEmptyAxes),{inputs:[0]})},sr=(e,t)=>{nr(e.inputs),or(e,`ReduceLogSum`,t,(e,t)=>[`var value = ${t.type.storage}(0);`,``,`value += ${e.getByIndices(`input_indices`)};`,`value = log(value);`])},cr=(e,t)=>{nr(e.inputs),or(e,`ReduceL1`,t,(e,t)=>[`var value = ${t.type.storage}(0);`,``,`value += abs(${e.getByIndices(`input_indices`)});`,``])},lr=(e,t)=>{nr(e.inputs),or(e,`ReduceL2`,t,(e,t)=>[`var t = ${t.type.value}(0); var value = ${t.type.value}(0);`,``,`t = ${e.getByIndices(`input_indices`)}; value += (t * t);`,`value = sqrt(value);`])},ur=(e,t)=>{nr(e.inputs),or(e,`ReduceLogSumExp`,t,(e,t)=>[`var value = ${t.type.storage}(0);`,``,`value += exp(${e.getByIndices(`input_indices`)});`,`value = log(value);`])},dr=(e,t)=>{nr(e.inputs),or(e,`ReduceMax`,t,(e,t,n)=>{let r=[];for(let t=0;t<e.rank;t++)(n.indexOf(t)>=0||n.length===0)&&r.push(e.indicesSet(`input_indices`,t,0));return[`${r.join(`
`)}`,`var value = ${e.getByIndices(`input_indices`)};`,`value = max(value, ${e.getByIndices(`input_indices`)});`,``]})},fr=(e,t)=>{nr(e.inputs),or(e,`ReduceMean`,t,(t,n,r)=>{let i=1;for(let n=0;n<t.rank;n++)(r.indexOf(n)>=0||r.length===0)&&(i*=e.inputs[0].dims[n]);return[`var sum = f32(0);`,``,`sum += f32(${t.getByIndices(`input_indices`)});`,`let value = ${n.type.value}(sum / ${i});`]})},pr=(e,t)=>{nr(e.inputs),or(e,`ReduceMin`,t,(e,t,n)=>{let r=[];for(let t=0;t<e.rank;t++)(n.indexOf(t)>=0||n.length===0)&&r.push(`input_indices[${t}] = 0;`);return[`${r.join(`
`)}`,`var value = ${e.getByIndices(`input_indices`)};`,`value = min(value, ${e.getByIndices(`input_indices`)});`,``]})},mr=(e,t)=>{nr(e.inputs),or(e,`ReduceProd`,t,(e,t)=>[`var value = ${t.type.storage}(1);`,``,`value *= ${e.getByIndices(`input_indices`)};`,``])},hr=(e,t)=>{nr(e.inputs),or(e,`ReduceSum`,t,(e,t)=>[`var value = ${t.type.storage}(0);`,``,`value += ${e.getByIndices(`input_indices`)};`,``])},gr=(e,t)=>{nr(e.inputs),or(e,`ReduceSumSquare`,t,(e,t)=>[`var t = ${t.type.value}(0); var value = ${t.type.value}(0);`,``,`t = ${e.getByIndices(`input_indices`)}; value += t * t;`,``])},_r=(e,t,n)=>{if(t.length===0)return n;let r=1,i=1;for(let n=0;n<t.length;n++)t.indexOf(n)===-1?r*=e[n]:i*=e[n];return i<32&&r>1024},vr=(e,t)=>{_r(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?fr(e,t):Gn(e,t)},yr=(e,t)=>{_r(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?cr(e,t):Kn(e,t)},br=(e,t)=>{_r(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?lr(e,t):qn(e,t)},xr=(e,t)=>{_r(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?ur(e,t):Jn(e,t)},Sr=(e,t)=>{_r(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?dr(e,t):Yn(e,t)},Cr=(e,t)=>{_r(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?pr(e,t):Xn(e,t)},wr=(e,t)=>{_r(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?mr(e,t):Zn(e,t)},Tr=(e,t)=>{_r(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?hr(e,t):Qn(e,t)},Er=(e,t)=>{_r(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?gr(e,t):$n(e,t)},Dr=(e,t)=>{_r(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?sr(e,t):er(e,t)}}),kr,Ar,jr,Mr,Nr=o(()=>{V(),un(),Or(),kr=e=>{if(!e||e.length===0||e.length>2)throw Error(`ArgMinMaxOp op requires 1 or 2 inputs.`);if(e[0].dataType!==1)throw Error(`Invalid input type.`)},Ar=(e,t)=>{kr(e.inputs),e.compute(ir(`ArgMin`,{hint:t.cacheKey,inputDependencies:[`rank`]},[e.inputs[0]],(e,n,r)=>{let i=[];for(let t=0;t<e.rank;t++)(r.indexOf(t)>=0||r.length===0)&&i.push(`input_indices[${t}] = 0;`);return[`${i.join(`
`)}`,`var value = ${e.getByIndices(`input_indices`)};
var best_index : i32 = 0;`,`if (${e.getByIndices(`input_indices`)} ${t.selectLastIndex>0?`<=`:`<`} value) {
         value = ${e.getByIndices(`input_indices`)};
         best_index = i32(last_index);
       }`,``,n.setByOffset(`global_idx`,`best_index`)]},[t.axis],7,t.keepDims),{inputs:[0]})},jr=(e,t)=>{kr(e.inputs),e.compute(ir(`argMax`,{hint:t.cacheKey,inputDependencies:[`rank`]},[e.inputs[0]],(e,n,r)=>{let i=[];for(let t=0;t<e.rank;t++)(r.indexOf(t)>=0||r.length===0)&&i.push(`input_indices[${t}] = 0;`);return[`${i.join(`
`)}`,`var value = ${e.getByIndices(`input_indices`)};
var best_index : i32 = 0;`,`if (${e.getByIndices(`input_indices`)} ${t.selectLastIndex>0?`>=`:`>`} value) {
         value = ${e.getByIndices(`input_indices`)};
         best_index = i32(last_index);
       }`,``,n.setByOffset(`global_idx`,`best_index`)]},[t.axis],7,t.keepDims),{inputs:[0]})},Mr=e=>q(e)}),Pr,Fr,Ir,Lr,Rr,zr,Br,Vr,Hr=o(()=>{V(),G(),Zt(),Q(),Pr=(e,t)=>{let n=e[0],r=e[1],i=e[2],a=e[3],o=e[4],s=e[5];if(o&&s)throw Error(`Attention cannot have both past and attention_bias`);if(n.dims.length!==3)throw Error(`Input "input" must have 3 dimensions`);let c=n.dims[0],l=n.dims[1],u=n.dims[2];if(i.dims.length!==1)throw Error(`Input "bias" is expected to have 1 dimensions`);if(r.dims.length!==2)throw Error(`Input "weights" is expected to have 2 dimensions`);if(r.dims[0]!==u)throw Error(`Input 1 dimension 0 should have same length as dimension 2 of input 0`);if(i.dims[0]!==r.dims[1])throw Error(`Input "bias" dimension 0 should have same length as dimension 1 of input "weights"`);let d=i.dims[0]/3,f=d,p=f;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw Error(`qkv_hidden_sizes attribute should have 3 elements`);for(let e of t.qkvHiddenSizes)if(e%t.numHeads!==0)throw Error(`qkv_hidden_sizes should be divisible by num_heads`);d=t.qkvHiddenSizes[0],f=t.qkvHiddenSizes[1],p=t.qkvHiddenSizes[2]}let m=l;if(d!==f)throw Error(`qkv_hidden_sizes first element should be same as the second`);if(i.dims[0]!==d+f+p)throw Error(`Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes`);let h=0;if(o){if(f!==p)throw Error(`Input "past" expect k_hidden_size == v_hidden_size`);if(o.dims.length!==5)throw Error(`Input "past" must have 5 dimensions`);if(o.dims[0]!==2)throw Error(`Input "past" first dimension must be 2`);if(o.dims[1]!==c)throw Error(`Input "past" second dimension must be batch_size`);if(o.dims[2]!==t.numHeads)throw Error(`Input "past" third dimension must be num_heads`);if(o.dims[4]!==f/t.numHeads)throw Error(`Input "past" fifth dimension must be k_hidden_size / num_heads`);t.pastPresentShareBuffer||(h=o.dims[3])}let g=m+h;if(a)throw Error(`Mask not supported`);if(o)throw Error(`past is not supported`);if(s){if(s.dims.length!==4)throw Error(`Input "attention_bias" must have 4 dimensions`);if(s.dims[0]!==c||s.dims[1]!==t.numHeads||s.dims[2]!==l||s.dims[3]!==g)throw Error(`Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)`)}return{batchSize:c,sequenceLength:l,pastSequenceLength:h,kvSequenceLength:m,totalSequenceLength:g,maxSequenceLength:-1,inputHiddenSize:u,hiddenSize:d,vHiddenSize:p,headSize:Math.floor(d/t.numHeads),vHeadSize:Math.floor(p/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:0,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Fr=(e,t,n)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset(`0`)});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e?.getByOffset(`batchIdx`)}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${n?`let past_sequence_length = uniforms.past_sequence_length`:``};
    let present_sequence_length = total_sequence_length;
    `,Ir=(e,t,n,r,i,a,o,s)=>{let c=hn(o?1:a),l=64,u=a/c;u<l&&(l=32);let d=Math.ceil(a/c/l),f=[{type:12,data:t},{type:12,data:n},{type:12,data:r},{type:12,data:i},{type:12,data:u},{type:12,data:d}],p=pn(e.dataType,c),m=mn(1,c),h=[`type`];return o&&h.push(`type`),s&&h.push(`type`),{name:`AttentionProbsSoftmax`,shaderCache:{hint:`${l};${p};${c}`,inputDependencies:h},getShaderSource:t=>{let n=Z(`x`,e.dataType,e.dims,c),r=[n],i=o?X(`seq_lens`,o.dataType,o.dims):void 0;i&&r.push(i);let a=s?X(`total_sequence_length_input`,s.dataType,s.dims):void 0;a&&r.push(a);let u=mn(e.dataType);return`
  var<workgroup> thread_max: array<f32, ${l}>;
  var<workgroup> thread_sum: array<f32, ${l}>;
  ${t.registerUniforms([{name:`batch_size`,type:`u32`},{name:`num_heads`,type:`u32`},{name:`past_sequence_length`,type:`u32`},{name:`sequence_length`,type:`u32`},{name:`total_sequence_length`,type:`u32`},{name:`elements_per_thread`,type:`u32`}]).declareVariables(...r)}
  ${t.mainStart([l,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Fr(i,a,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${l}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${o?`u32(past_sequence_length + workgroup_id.y + 1)`:`total_sequence_length`};
    var thread_max_vector = ${m}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${m}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(c){case 1:return`thread_max_vector`;case 2:return`max(thread_max_vector.x, thread_max_vector.y)`;case 4:return`max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))`;default:throw Error(`Unsupported components: ${c}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${l}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${m}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${m}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(c){case 1:return`sum_vector`;case 2:return`sum_vector.x + sum_vector.y`;case 4:return`sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w`;default:throw Error(`Unsupported components: ${c}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${l}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${n.type.value}(${u}(1.0) / ${u}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${m}(x[offset + i]);
        x[offset + i] = ${n.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${o?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${n.type.value}(${u}(0));
        }`:``};
  }`},getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:i,z:t*n},programUniforms:f})}},Lr=(e,t,n,r,i,a,o,s,c)=>{let l=o+a.kvSequenceLength,u=[a.batchSize,a.numHeads,a.sequenceLength,l],d=e>1&&r,f=a.kvNumHeads?a.kvNumHeads:a.numHeads,p=d?[a.batchSize,f,l,a.headSize]:void 0,m=a.nReps?a.nReps:1,h=a.scale===0?1/Math.sqrt(a.headSize):a.scale,g=hn(a.headSize),_=a.headSize/g,v={x:Math.ceil(l/12),y:Math.ceil(a.sequenceLength/12),z:a.batchSize*a.numHeads},y=[{type:12,data:a.sequenceLength},{type:12,data:_},{type:12,data:l},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:1,data:h},{type:12,data:o},{type:12,data:a.kvSequenceLength},{type:12,data:m}],b=d&&r&&W.size(r.dims)>0,x=[`type`,`type`];b&&x.push(`type`),i&&x.push(`type`),s&&x.push(`type`),c&&x.push(`type`);let S=[{dims:u,dataType:t.dataType,gpuDataType:0}];return d&&S.push({dims:p,dataType:t.dataType,gpuDataType:0}),{name:`AttentionProbs`,shaderCache:{hint:`${g};${i!==void 0};${r!==void 0};${e}`,inputDependencies:x},getRunData:()=>({outputs:S,dispatchGroup:v,programUniforms:y}),getShaderSource:e=>{let a=X(`q`,t.dataType,t.dims,g),o=[a,X(`key`,n.dataType,n.dims,g)];if(b){let e=X(`past_key`,r.dataType,r.dims,g);o.push(e)}i&&o.push(X(`attention_bias`,i.dataType,i.dims));let l=s?X(`seq_lens`,s.dataType,s.dims):void 0;l&&o.push(l);let f=c?X(`total_sequence_length_input`,c.dataType,c.dims):void 0;f&&o.push(f);let h=Z(`output`,t.dataType,u),_=[h];d&&_.push(Z(`present_key`,t.dataType,p,g));let v=mn(1,g);return`
  const TILE_SIZE = 12u;

  var<workgroup> tileQ: array<${a.type.storage}, 144>;
  var<workgroup> tileK: array<${a.type.storage}, 144>;
  ${e.registerUniforms([{name:`M`,type:`u32`},{name:`K`,type:`u32`},{name:`N`,type:`u32`},{name:`num_heads`,type:`u32`},{name:`head_size`,type:`u32`},{name:`alpha`,type:`f32`},{name:`past_sequence_length`,type:`u32`},{name:`kv_sequence_length`,type:`u32`},{name:`n_reps`,type:`u32`}]).declareVariables(...o,..._)}
  ${e.mainStart([12,12,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${m===1?`headIdx`:`headIdx / uniforms.n_reps`};
    let kv_num_heads = ${m===1?`uniforms.num_heads`:`uniforms.num_heads / uniforms.n_reps`};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Fr(l,f,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${b&&d?`let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;`:``};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${d?`let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;`:``}
    var value = ${v}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${b&&d?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${d?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:``}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${v}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(g){case 1:return`value`;case 2:return`value.x + value.y`;case 4:return`value.x + value.y + value.z + value.w`;default:throw Error(`Unsupported components: ${g}`)}})()};
        output[outputIdx] = ${h.type.value} (sum * uniforms.alpha) + ${i?`attention_bias[outputIdx]`:`0.0`};
    }
  }`}}},Rr=(e,t,n,r,i,a,o=void 0,s=void 0)=>{let c=a+i.kvSequenceLength,l=i.nReps?i.nReps:1,u=i.vHiddenSize*l,d=e>1&&r,f=i.kvNumHeads?i.kvNumHeads:i.numHeads,p=d?[i.batchSize,f,c,i.headSize]:void 0,m=[i.batchSize,i.sequenceLength,u],h={x:Math.ceil(i.vHeadSize/12),y:Math.ceil(i.sequenceLength/12),z:i.batchSize*i.numHeads},g=[{type:12,data:i.sequenceLength},{type:12,data:c},{type:12,data:i.vHeadSize},{type:12,data:i.numHeads},{type:12,data:i.headSize},{type:12,data:u},{type:12,data:a},{type:12,data:i.kvSequenceLength},{type:12,data:l}],_=d&&r&&W.size(r.dims)>0,v=[`type`,`type`];_&&v.push(`type`),o&&v.push(`type`),s&&v.push(`type`);let y=[{dims:m,dataType:t.dataType,gpuDataType:0}];return d&&y.push({dims:p,dataType:t.dataType,gpuDataType:0}),{name:`AttentionScore`,shaderCache:{hint:`${r!==void 0};${e}`,inputDependencies:v},getRunData:()=>({outputs:y,dispatchGroup:h,programUniforms:g}),getShaderSource:e=>{let i=X(`probs`,t.dataType,t.dims),a=[i,X(`v`,n.dataType,n.dims)];_&&a.push(X(`past_value`,r.dataType,r.dims));let c=o?X(`seq_lens`,o.dataType,o.dims):void 0;o&&a.push(c);let u=s?X(`total_sequence_length_input`,s.dataType,s.dims):void 0;s&&a.push(u);let f=[Z(`output`,t.dataType,m)];return d&&f.push(Z(`present_value`,t.dataType,p)),`
  const TILE_SIZE = 12u;
  var<workgroup> tileQ: array<${i.type.value}, 144>;
  var<workgroup> tileV: array<${i.type.value}, 144>;
  ${e.registerUniforms([{name:`M`,type:`u32`},{name:`K`,type:`u32`},{name:`N`,type:`u32`},{name:`num_heads`,type:`u32`},{name:`head_size`,type:`u32`},{name:`v_hidden_size`,type:`u32`},{name:`past_sequence_length`,type:`u32`},{name:`kv_sequence_length`,type:`u32`},{name:`n_reps`,type:`u32`}]).declareVariables(...a,...f)}
  ${e.mainStart([12,12,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${l===1?`headIdx`:`headIdx / uniforms.n_reps`};
   let kv_num_heads = ${l===1?`uniforms.num_heads`:`uniforms.num_heads / uniforms.n_reps`};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Fr(c,u,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${_&&d?`let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;`:``};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${d?`let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;`:``}
   var value = ${i.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${_&&d?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${d?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:``}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`}}},zr=(e,t,n,r,i,a,o,s,c,l,u=void 0,d=void 0)=>{let f=Math.min(e.outputCount,1+ +!!o+ +!!s),p=f>1?o:void 0,m=f>1?s:void 0,h=f>1?l.pastSequenceLength:0,g=h+l.kvSequenceLength,_=c&&W.size(c.dims)>0?c:void 0,v=[t,n];p&&W.size(p.dims)>0&&v.push(p),_&&v.push(_),u&&v.push(u),d&&v.push(d);let y=e.compute(Lr(f,t,n,p,_,l,h,u,d),{inputs:v,outputs:f>1?[-1,1]:[-1]})[0];e.compute(Ir(y,l.batchSize,l.numHeads,h,l.sequenceLength,g,u,d),{inputs:u&&d?[y,u,d]:[y],outputs:[]});let b=[y,r];m&&W.size(m.dims)>0&&b.push(m),u&&b.push(u),d&&b.push(d),e.compute(Rr(f,y,r,m,l,h,u,d),{inputs:b,outputs:f>1?[0,2]:[0]})},Br=(e,t)=>{let n=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],r=t.sequenceLength,i=t.inputHiddenSize,a=t.headSize,o={x:Math.ceil(t.headSize/12),y:Math.ceil(t.sequenceLength/12),z:t.batchSize*t.numHeads},s=[e.inputs[0],e.inputs[1],e.inputs[2]],c=[{type:12,data:r},{type:12,data:i},{type:12,data:a},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}];return e.compute({name:`AttentionPrepare`,shaderCache:{inputDependencies:[`type`,`type`,`type`]},getRunData:()=>({outputs:[{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:o,programUniforms:c}),getShaderSource:e=>{let t=Z(`output_q`,s[0].dataType,n),r=Z(`output_k`,s[0].dataType,n),i=Z(`output_v`,s[0].dataType,n),a=X(`input`,s[0].dataType,s[0].dims),o=X(`weight`,s[1].dataType,s[1].dims),c=X(`bias`,s[2].dataType,s[2].dims),l=a.type.storage;return`
  const TILE_SIZE = 12u;
  var<workgroup> tileInput: array<${l}, 144>;
  var<workgroup> tileWeightQ: array<${l}, 144>;
  var<workgroup> tileWeightK: array<${l}, 144>;
  var<workgroup> tileWeightV: array<${l}, 144>;
  ${e.registerUniforms([{name:`M`,type:`u32`},{name:`K`,type:`u32`},{name:`N`,type:`u32`},{name:`num_heads`,type:`u32`},{name:`head_size`,type:`u32`},{name:`hidden_size`,type:`u32`},{name:`ldb`,type:`u32`}]).declareVariables(a,o,c,t,r,i)}
  ${e.mainStart([12,12,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${l}(0);
    var valueK = ${l}(0);
    var valueV = ${l}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`}},{inputs:s,outputs:[-1,-1,-1]})},Vr=(e,t)=>{let n=Pr(e.inputs,t),[r,i,a]=Br(e,n);return zr(e,r,i,a,e.inputs[4],void 0,void 0,void 0,e.inputs[5],n)}}),Ur,Wr,Gr,Kr,qr=o(()=>{j(),V(),G(),un(),Q(),Ur=(e,t)=>{if(!e||e.length!==5)throw Error(`BatchNormalization requires 5 inputs`);let n=(e,t,n)=>{let r=t.length;if(r!==e.length)throw Error(`${n}: num dimensions != ${r}`);t.forEach((t,r)=>{if(t!==e[r])throw Error(`${n}: dim[${r}] do not match`)})};if(e[0].dims.length>1){let r=t.format===`NHWC`?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);n(e[1].dims,r,`Invalid input scale`),n(e[2].dims,r,`Invalid input B`),n(e[3].dims,r,`Invalid input mean`),n(e[4].dims,r,`Invalid input var`)}else n(e[1].dims,[1],`Invalid input scale`),n(e[2].dims,[1],`Invalid input B`),n(e[3].dims,[1],`Invalid input mean`),n(e[4].dims,[1],`Invalid input var`)},Wr=(e,t)=>{let{epsilon:n,spatial:r,format:i}=t,a=e[0].dims,o=r?hn(a[a.length-1]):1,s=i===`NHWC`&&a.length>1?o:1,c=W.size(a)/o,l=r,u=l?a.length:a,d=X(`x`,e[0].dataType,e[0].dims,o),f=X(`scale`,e[1].dataType,e[1].dims,s),p=X(`bias`,e[2].dataType,e[2].dims,s),m=X(`inputMean`,e[3].dataType,e[3].dims,s),h=X(`inputVar`,e[4].dataType,e[4].dims,s),g=Z(`y`,e[0].dataType,u,o),_=()=>{let e=``;if(r)e=`let cOffset = ${a.length===1?`0u`:i===`NHWC`?`outputIndices[${a.length-1}] / ${o}`:`outputIndices[1]`};`;else if(i===`NCHW`)e=`
            ${g.indicesSet(`outputIndices`,`0`,`0`)}
            let cOffset = ${g.indicesToOffset(`outputIndices`)};`;else{e=`var cIndices = ${f.type.indices}(0);
                       cIndices[0] = outputIndices[${a.length-1}];`;for(let t=1;t<f.rank;t++)e+=`cIndices[${t}] = outputIndices[${t}];`;e+=`let cOffset = ${f.indicesToOffset(`cIndices`)};`}return e};return{name:`BatchNormalization`,shaderCache:{hint:`${t.epsilon}_${t.format}_${r}_${o}`,inputDependencies:l?[`rank`,`type`,`type`,`type`,`type`]:void 0},getShaderSource:e=>`
  const epsilon = ${n};
  ${e.registerUniform(`outputSize`,`u32`).declareVariables(d,f,p,m,h,g)}
  ${e.mainStart()}
  ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
    var outputIndices = ${g.offsetToIndices(`global_idx * ${o}`)};
    ${_()}
    let scale = ${f.getByOffset(`cOffset`)};
    let bias = ${p.getByOffset(`cOffset`)};
    let inputMean = ${m.getByOffset(`cOffset`)};
    let inputVar = ${h.getByOffset(`cOffset`)};
    let x = ${d.getByOffset(`global_idx`)};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${g.setByOffset(`global_idx`,`value`)}
  }`,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:l?[{type:12,data:c},...J(a)]:[{type:12,data:c}]})}},Gr=e=>q(e),Kr=(e,t)=>{let{inputs:n,outputCount:r}=e,i=Gr({...t,outputCount:r});if(S.webgpu.validateInputContent&&Ur(n,i),t.trainingMode)throw Error(`BatchNormalization trainingMode is not supported yet.`);e.compute(Wr(n,i))}}),Jr,Yr,Xr,Zr=o(()=>{G(),Q(),Jr=e=>{if(e[0].dims.length!==3)throw Error(`input should have 3 dimensions`);if(![320,640,1280].includes(e[0].dims[2]))throw Error(`number of channels should be 320, 640 or 1280`);if(e[1].dims.length!==1)throw Error(`bias is expected to have 1 dimensions`);if(e[0].dims[2]!==e[1].dims[0])throw Error(`last dimension of input and bias are not the same`)},Yr=e=>{let t=e[0].dims,n=e[0].dims[2],r=W.size(t)/4,i=e[0].dataType,a=X(`input`,i,t,4),o=X(`bias`,i,[n],4),s=X(`residual`,i,t,4),c=Z(`output`,i,t,4);return{name:`BiasAdd`,getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(r/64)}}),getShaderSource:e=>`
  const channels = ${n}u / 4;
  ${e.declareVariables(a,o,s,c)}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(r)}
    let value = ${a.getByOffset(`global_idx`)}
      + ${o.getByOffset(`global_idx % channels`)} + ${s.getByOffset(`global_idx`)};
    ${c.setByOffset(`global_idx`,`value`)}
  }`}},Xr=e=>{Jr(e.inputs),e.compute(Yr(e.inputs))}}),Qr,$,$r,ei,ti,ni,ri,ii,ai,oi,si,ci,li,ui,di,fi,pi,mi,hi,gi,_i,vi,yi,bi,xi,Si,Ci,wi,Ti,Ei,Di,Oi,ki,Ai,ji,Mi,Ni,Pi,Fi,Ii,Li,Ri,zi,Bi,Vi,Hi=o(()=>{V(),G(),un(),Q(),Qr=(e,t,n,r,i,a,o)=>{let s=Math.ceil(t/4),c=``;c=typeof i==`string`?`${i}(a)`:i(`a`);let l=X(`inputData`,n,[s],4),u=Z(`outputData`,r,[s],4),d=[{name:`vec_size`,type:`u32`}];return o&&d.push(...o),`
      ${e.registerUniforms(d).declareVariables(l,u)}

  ${a??``}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.vec_size`)}

    let a = ${l.getByOffset(`global_idx`)};
    ${u.setByOffset(`global_idx`,c)}
  }`},$=(e,t,n,r,i,a=e.dataType,o,s)=>{let c=[{type:12,data:Math.ceil(W.size(e.dims)/4)}];return o&&c.push(...o),{name:t,shaderCache:{hint:i,inputDependencies:[`type`]},getShaderSource:t=>Qr(t,W.size(e.dims),e.dataType,a,n,r,s),getRunData:t=>({outputs:[{dims:e.dims,dataType:a}],dispatchGroup:{x:Math.ceil(W.size(t[0].dims)/64/4)},programUniforms:c})}},$r=e=>{e.compute($(e.inputs[0],`Abs`,`abs`))},ei=e=>{e.compute($(e.inputs[0],`Acos`,`acos`))},ti=e=>{e.compute($(e.inputs[0],`Acosh`,`acosh`))},ni=e=>{e.compute($(e.inputs[0],`Asin`,`asin`))},ri=e=>{e.compute($(e.inputs[0],`Asinh`,`asinh`))},ii=e=>{e.compute($(e.inputs[0],`Atan`,`atan`))},ai=e=>{e.compute($(e.inputs[0],`Atanh`,`atanh`))},oi=e=>q(e),si=(e,t)=>{let n;switch(t.to){case 10:n=`vec4<f16>`;break;case 1:n=`vec4<f32>`;break;case 12:n=`vec4<u32>`;break;case 6:n=`vec4<i32>`;break;case 9:n=`vec4<bool>`;break;default:throw RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute($(e.inputs[0],`Cast`,n,void 0,t.cacheKey,t.to))},ci=e=>{let t,n,r=e.length>=2&&e[1].data!==0,i=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=r?e[1].getFloat32Array()[0]:-34028234663852886e22,n=i?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=r?e[1].getUint16Array()[0]:64511,n=i?e[2].getUint16Array()[0]:31743;break;default:throw Error(`Unsupport data type`)}return q({min:t,max:n})},li=(e,t)=>{let n=t||ci(e.inputs),r=mn(e.inputs[0].dataType);e.compute($(e.inputs[0],`Clip`,e=>`clamp(${e}, vec4<${r}>(uniforms.min), vec4<${r}>(uniforms.max))`,void 0,n.cacheKey,void 0,[{type:e.inputs[0].dataType,data:n.min},{type:e.inputs[0].dataType,data:n.max}],[{name:`min`,type:r},{name:`max`,type:r}]),{inputs:[0]})},ui=e=>{e.compute($(e.inputs[0],`Ceil`,`ceil`))},di=e=>{e.compute($(e.inputs[0],`Cos`,`cos`))},fi=e=>{e.compute($(e.inputs[0],`Cosh`,`cosh`))},pi=e=>q(e),mi=(e,t)=>{let n=mn(e.inputs[0].dataType);e.compute($(e.inputs[0],`Elu`,e=>`elu_vf32(${e})`,`
  const elu_alpha_ = ${n}(${t.alpha});

  fn elu_f32(a: ${n}) -> ${n} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${n}>) -> vec4<${n}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},hi=(e=`f32`)=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,gi=e=>{let t=mn(e.inputs[0].dataType);e.compute($(e.inputs[0],`Erf`,e=>`erf_vf32(${e})`,hi(t)))},_i=e=>{e.compute($(e.inputs[0],`Exp`,`exp`))},vi=e=>{e.compute($(e.inputs[0],`Floor`,`floor`))},yi=e=>{let t=mn(e.inputs[0].dataType);e.compute($(e.inputs[0],`Gelu`,e=>`0.5 * ${e} * (1.0 + erf_vf32(${e} * 0.7071067811865475))`,hi(t)))},bi=(e,t)=>{let n=mn(e.inputs[0].dataType);e.compute($(e.inputs[0],`LeakyRelu`,e=>`select(leaky_relu_alpha_ * ${e}, ${e}, ${e} >= vec4<${n}>(0.0))`,`const leaky_relu_alpha_ = ${n}(${t.alpha});`,t.cacheKey))},xi=e=>{e.compute($(e.inputs[0],`Not`,e=>`!${e}`))},Si=e=>{e.compute($(e.inputs[0],`Neg`,e=>`-${e}`))},Ci=e=>{e.compute($(e.inputs[0],`Reciprocal`,e=>`1.0/${e}`))},wi=e=>{let t=mn(e.inputs[0].dataType);e.compute($(e.inputs[0],`Relu`,e=>`select(vec4<${t}>(0.0), ${e}, ${e} > vec4<${t}>(0.0))`))},Ti=e=>{e.compute($(e.inputs[0],`Sigmoid`,e=>`(1.0 / (1.0 + exp(-${e})))`))},Ei=e=>q(e),Di=(e,t)=>{let n=mn(e.inputs[0].dataType);e.compute($(e.inputs[0],`HardSigmoid`,e=>`max(vec4<${n}>(0.0), min(vec4<${n}>(1.0), ${t.alpha} * ${e} + vec4<${n}>(${t.beta})))`,void 0,t.cacheKey))},Oi=e=>{e.compute($(e.inputs[0],`Sin`,`sin`))},ki=e=>{e.compute($(e.inputs[0],`Sinh`,`sinh`))},Ai=e=>{e.compute($(e.inputs[0],`Sqrt`,`sqrt`))},ji=e=>{e.compute($(e.inputs[0],`Tan`,`tan`))},Mi=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,Ni=e=>{e.compute($(e.inputs[0],`Tanh`,Mi))},Pi=(e=`f32`)=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${Mi(`v`)};
}
`,Fi=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,Ii=e=>{let t=mn(e.inputs[0].dataType);e.compute($(e.inputs[0],`FastGelu`,Fi,Pi(t),void 0,e.inputs[0].dataType))},Li=(e,t)=>{let n=mn(e.inputs[0].dataType);return e.compute($(e.inputs[0],`ThresholdedRelu`,e=>`select(vec4<${n}>(0.0), ${e}, ${e} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${n}>(${t.alpha});`,t.cacheKey)),0},Ri=e=>{e.compute($(e.inputs[0],`Log`,`log`))},zi=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,Bi=e=>`quick_gelu_impl(${e})`,Vi=(e,t)=>{let n=mn(e.inputs[0].dataType);e.compute($(e.inputs[0],`QuickGelu`,Bi,zi(n,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),Ui,Wi,Gi,Ki=o(()=>{G(),Q(),Hi(),Ui=e=>{if(e[0].dims.length!==3)throw Error(`input should have 3 dimensions`);if(![2560,5120,10240].includes(e[0].dims[2]))throw Error(`hidden state should be 2560, 5120 or 10240`);if(e[1].dims.length!==1)throw Error(`bias is expected to have 1 dimensions`);if(e[0].dims[2]!==e[1].dims[0])throw Error(`last dimension of input and bias are not the same`)},Wi=e=>{let t=e[0].dims.slice();t[2]/=2;let n=X(`input`,e[0].dataType,e[0].dims,4),r=X(`bias`,e[0].dataType,[e[0].dims[2]],4),i=Z(`output`,e[0].dataType,t,4),a=W.size(t)/4,o=pn(e[0].dataType);return{name:`BiasSplitGelu`,getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)}}),getShaderSource:t=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${t.declareVariables(n,r,i)}

  ${hi(o)}

  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes(a)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${i.setByOffset(`global_idx`,`valueLeft * geluRight`)}
  }`}},Gi=e=>{Ui(e.inputs),e.compute(Wi(e.inputs))}}),qi,Ji,Yi,Xi,Zi,Qi,$i,ea,ta,na,ra,ia,aa,oa=o(()=>{V(),G(),Q(),qi=(e,t,n,r,i,a,o,s,c,l,u,d)=>{let f,p;typeof s==`string`?f=p=(e,t)=>`${s}((${e}),(${t}))`:typeof s==`function`?f=p=s:(f=s.scalar,p=s.vector);let m=Z(`outputData`,u,r.length,4),h=X(`aData`,c,t.length,4),g=X(`bData`,l,n.length,4),_;if(i)if(a){let e=W.size(t)===1,r=W.size(n)===1,i=t.length>0&&t[t.length-1]%4==0,a=n.length>0&&n[n.length-1]%4==0;_=e||r?m.setByOffset(`global_idx`,p(e?`${h.type.value}(${h.getByOffset(`0`)}.x)`:h.getByOffset(`global_idx`),r?`${g.type.value}(${g.getByOffset(`0`)}.x)`:g.getByOffset(`global_idx`))):`
            let outputIndices = ${m.offsetToIndices(`global_idx * 4u`)};
            let offsetA = ${h.broadcastedIndicesToOffset(`outputIndices`,m)};
            let offsetB = ${g.broadcastedIndicesToOffset(`outputIndices`,m)};
            ${m.setByOffset(`global_idx`,p(o||i?h.getByOffset(`offsetA / 4u`):`${h.type.value}(${h.getByOffset(`offsetA / 4u`)}[offsetA % 4u])`,o||a?g.getByOffset(`offsetB / 4u`):`${g.type.value}(${g.getByOffset(`offsetB / 4u`)}[offsetB % 4u])`))}
          `}else _=m.setByOffset(`global_idx`,p(h.getByOffset(`global_idx`),g.getByOffset(`global_idx`)));else{if(!a)throw Error(`no necessary to use scalar implementation for element-wise binary op implementation.`);let e=(e,t,n=``)=>{let r=`aData[indexA${t}][componentA${t}]`,i=`bData[indexB${t}][componentB${t}]`;return`
            let outputIndices${t} = ${m.offsetToIndices(`global_idx * 4u + ${t}u`)};
            let offsetA${t} = ${h.broadcastedIndicesToOffset(`outputIndices${t}`,m)};
            let offsetB${t} = ${g.broadcastedIndicesToOffset(`outputIndices${t}`,m)};
            let indexA${t} = offsetA${t} / 4u;
            let indexB${t} = offsetB${t} / 4u;
            let componentA${t} = offsetA${t} % 4u;
            let componentB${t} = offsetB${t} % 4u;
            ${e}[${t}] = ${n}(${f(r,i)});
          `};_=u===9?`
            var data = vec4<u32>(0);
            ${e(`data`,0,`u32`)}
            ${e(`data`,1,`u32`)}
            ${e(`data`,2,`u32`)}
            ${e(`data`,3,`u32`)}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:`
            ${e(`outputData[global_idx]`,0)}
            ${e(`outputData[global_idx]`,1)}
            ${e(`outputData[global_idx]`,2)}
            ${e(`outputData[global_idx]`,3)}
          `}return`
        ${e.registerUniform(`vec_size`,`u32`).declareVariables(h,g,m)}

        ${d??``}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.vec_size`)}
        ${_}
      }`},Ji=(e,t,n,r,i,a,o=n.dataType)=>{let s=n.dims.map(Number),c=r.dims.map(Number),l=!W.areEqual(s,c),u=s,d=W.size(s),f=!1,p=!1,m=[l];if(l){let e=kt.calcShape(s,c,!1);if(!e)throw Error(`Can't perform binary op on the given tensors`);u=e.slice(),d=W.size(u);let t=W.size(s)===1,n=W.size(c)===1,r=s.length>0&&s[s.length-1]%4==0,i=c.length>0&&c[c.length-1]%4==0;m.push(t),m.push(n),m.push(r),m.push(i);let a=1;for(let e=1;e<u.length;e++){let t=s[s.length-e];if(t===c[c.length-e])a*=t;else break}a%4==0?(p=!0,f=!0):(t||n||r||i)&&(f=!0)}else f=!0;return m.push(f),{name:e,shaderCache:{hint:t+m.map(e=>e.toString()).join(`_`),inputDependencies:[`rank`,`rank`]},getShaderSource:e=>qi(e,s,c,u,f,l,p,i,n.dataType,r.dataType,o,a),getRunData:()=>({outputs:[{dims:u,dataType:o}],dispatchGroup:{x:Math.ceil(d/64/4)},programUniforms:[{type:12,data:Math.ceil(W.size(u)/4)},...J(s,c,u)]})}},Yi=(e,t,n,r,i,a)=>{e.compute(Ji(t,i??``,e.inputs[0],e.inputs[1],n,r,a))},Xi=e=>{Yi(e,`Add`,(e,t)=>`${e}+${t}`)},Zi=e=>{Yi(e,`Div`,(e,t)=>`${e}/${t}`)},Qi=e=>{Yi(e,`Equal`,{scalar:(e,t)=>`u32(${e}==${t})`,vector:(e,t)=>`vec4<u32>(${e}==${t})`},void 0,void 0,9)},$i=e=>{Yi(e,`Mul`,(e,t)=>`${e}*${t}`)},ea=e=>{let t=X(`input`,e.inputs[0].dataType,e.inputs[0].dims).type.value;Yi(e,`Pow`,{scalar:(e,t)=>`pow_custom(${e},${t})`,vector:(e,t)=>`pow_vector_custom(${e},${t})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t===`i32`?`round`:``}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},ta=e=>{Yi(e,`Sub`,(e,t)=>`${e}-${t}`)},na=e=>{Yi(e,`Greater`,{scalar:(e,t)=>`u32(${e}>${t})`,vector:(e,t)=>`vec4<u32>(${e}>${t})`},void 0,void 0,9)},ra=e=>{Yi(e,`Less`,{scalar:(e,t)=>`u32(${e}<${t})`,vector:(e,t)=>`vec4<u32>(${e}<${t})`},void 0,void 0,9)},ia=e=>{Yi(e,`GreaterOrEqual`,{scalar:(e,t)=>`u32(${e}>=${t})`,vector:(e,t)=>`vec4<u32>(${e}>=${t})`},void 0,void 0,9)},aa=e=>{Yi(e,`LessOrEqual`,{scalar:(e,t)=>`u32(${e}<=${t})`,vector:(e,t)=>`vec4<u32>(${e}<=${t})`},void 0,void 0,9)}}),sa,ca,la,ua,da,fa,pa=o(()=>{V(),G(),un(),Q(),sa=(e,t)=>{if(!e||e.length<1)throw Error(`too few inputs`);let n=e[0],r=n.dataType,i=n.dims.length;e.forEach((e,a)=>{if(a!==0){if(e.dataType!==r)throw Error(`input tensors should be one type`);if(e.dims.length!==i)throw Error(`input tensors should have the same shape`);e.dims.forEach((e,r)=>{if(r!==t&&e!==n.dims[r])throw Error(`non concat dimensions must match`)})}})},ca=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,la=(e,t)=>{let n=e.length,r=[];for(let i=0;i<n;++i){let a=t.setByOffset(`global_idx`,e[i].getByIndices(`indices`));n===1?r.push(a):i===0?r.push(`if (inputIndex == ${i}u) { ${a} }`):i===n-1?r.push(`else { ${a} }`):r.push(`else if (inputIndex == ${i}) { ${a} }`)}return r.join(`
`)},ua=(e,t,n,r)=>{let i=W.size(n),a=Array(e.length),o=Array(e.length),s=0,c=[],l=[],u=[{type:12,data:i}];for(let n=0;n<e.length;++n)s+=e[n].dims[t],a[n]=s,l.push(e[n].dims.length),o[n]=X(`input${n}`,r,l[n]),c.push(`rank`),u.push({type:12,data:a[n]});for(let t=0;t<e.length;++t)u.push(...J(e[t].dims));u.push(...J(n));let d=Z(`output`,r,n.length),f=d.indicesGet(`indices`,t),p=Array.from(Array(a.length).keys()).map(e=>`uniforms.sizeInConcatAxis${e}`).join(`,`);return{name:`Concat`,shaderCache:{hint:`${t}`,inputDependencies:c},getRunData:()=>({outputs:[{dims:n,dataType:r}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:u}),getShaderSource:t=>`

  ${(()=>{t.registerUniform(`outputSize`,`u32`);for(let n=0;n<e.length;n++)t.registerUniform(`sizeInConcatAxis${n}`,`u32`);return t.declareVariables(...o,d)})()}

  ${ca(a.length,p)}

  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}

    var indices = ${d.offsetToIndices(`global_idx`)};

    let inputIndex = calculateInputIndex(${f});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${a.length}u>(${p});
      ${f} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${la(o,d)}
  }`}},da=(e,t)=>{let n=e.inputs,r=n[0].dims,i=W.normalizeAxis(t.axis,r.length);sa(n,i);let a=r.slice();a[i]=n.reduce((e,t)=>e+(t.dims.length>i?t.dims[i]:0),0);let o=n.filter(e=>W.size(e.dims)>0);e.compute(ua(o,i,a,n[0].dataType),{inputs:o})},fa=e=>q({axis:e.axis})}),ma,ha,ga,_a,va=o(()=>{V(),G(),ma=(e,t,n=`f32`)=>{switch(e.activation){case`Relu`:return`value = max(value, ${t}(0.0));`;case`Sigmoid`:return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case`Clip`:return`value = clamp(value, ${t}(${n}(uniforms.clip_min)), ${t}(${n}(uniforms.clip_max)));`;case`HardSigmoid`:return`value = max(${t}(0.0), min(${t}(1.0), ${n}(uniforms.alpha) * value + ${n}(uniforms.beta)));`;case`LeakyRelu`:return`value = select(${n}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case`Tanh`:return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case``:return``;default:throw Error(`Unsupported activation ${e.activation}`)}},ha=(e,t)=>{e.activation===`Clip`?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation===`HardSigmoid`?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation===`LeakyRelu`&&t.push({type:1,data:e.alpha})},ga=(e,t)=>{e.activation===`Clip`?t.push({name:`clip_max`,type:`f32`},{name:`clip_min`,type:`f32`}):e.activation===`HardSigmoid`?t.push({name:`alpha`,type:`f32`},{name:`beta`,type:`f32`}):e.activation===`LeakyRelu`&&t.push({name:`alpha`,type:`f32`})},_a=e=>{let t=e?.activation||``;if(t===`HardSigmoid`){let[n,r]=e?.activation_params||[.2,.5];return{activation:t,alpha:n,beta:r}}else if(t===`Clip`){let[n,r]=e?.activation_params||[Mt,Nt];return{activation:t,clipMax:r,clipMin:n}}else if(t===`LeakyRelu`){let[n]=e?.activation_params||[.01];return{activation:t,alpha:n}}return{activation:t}}}),ya,ba,xa=o(()=>{ya=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw Error(`${e}-component is not supported.`)}},ba=e=>`
      ${e?`value = value + getBiasByOutputCoords(coords);`:``}
      `}),Sa,Ca=o(()=>{Sa=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),wa,Ta,Ea=o(()=>{V(),G(),Q(),va(),wa=(e,t,n,r,i)=>{let a=r-n;return`
      ${Array.from({length:n}).map((n,o)=>`
      if (${Y(t.shape,o,t.rank)} != 1) {
        ${t.indicesSet(e,o,Y(i,o+a,r))}
      } else {
        ${t.indicesSet(e,o,0)}
      }`).join(``)}
`},Ta=(e,t,n,r,i=!1,a)=>{let o=e[0].dims,s=e[1].dims,c=o[o.length-2],l=s[s.length-1],u=o[o.length-1],d=hn(l),f=hn(u),p=hn(c),m=W.size(n)/d/p,h=e.length>2,g=r?r.slice(0,-2):n.slice(0,-2),_=[W.size(g),c,l],v=[{type:12,data:m},{type:12,data:c},{type:12,data:l},{type:12,data:u}];return ha(t,v),v.push(...J(g,o,s)),h&&v.push(...J(e[2].dims)),v.push(...J(_)),{name:`MatMulNaive`,shaderCache:{hint:`${t.activation};${d};${f};${p};${i}`,inputDependencies:h?[`rank`,`rank`,`rank`]:[`rank`,`rank`]},getRunData:()=>({outputs:[{dims:a?a(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:v}),getShaderSource:r=>{let a=xn(`batch_dims`,e[0].dataType,g.length),c=X(`a`,e[0].dataType,o.length,f),l=X(`b`,e[1].dataType,s.length,d),u=Z(`output`,e[0].dataType,_.length,d),m=pn(u.type.tensor),v=ma(t,u.type.value,m),y=[c,l],b=``;if(h){let t=i?d:1;y.push(X(`bias`,e[2].dataType,e[2].dims.length,t)),b=`${i?`value += bias[col / ${t}];`:`value += ${u.type.value}(bias[row + i]);`}`}let x=[{name:`output_size`,type:`u32`},{name:`M`,type:`u32`},{name:`N`,type:`u32`},{name:`K`,type:`u32`}];ga(t,x);let S=()=>{let e=`var a_data: ${c.type.value};`;for(let t=0;t<f;t++)e+=`
              let b_data${t} = b[(b_offset + (k + ${t}) * uniforms.N + col) / ${d}];`;for(let t=0;t<p;t++){e+=`a_data = a[(a_offset + (row + ${t}) * uniforms.K + k) / ${f}];`;for(let n=0;n<f;n++)e+=`
            values[${t}] = fma(${l.type.value}(a_data${f===1?``:`[${n}]`}), b_data${n}, values[${t}]);
`}return e};return`
  ${r.registerUniforms(x).registerInternalVariables(a).declareVariables(...y,u)}
  ${r.mainStart()}
    ${r.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
    let col = (global_idx % (uniforms.N / ${d})) * ${d};
    var index1 = global_idx / (uniforms.N / ${d});
    let stride1 = uniforms.M / ${p};
    let row = (index1 % stride1) * ${p};
    let batch = index1 / stride1;

    ${n.length===2?``:`let batch_indices = ${a.offsetToIndices(`batch`)};`}

    var a_indices: ${c.type.indices};
    ${wa(`a_indices`,c,c.rank-2,a.rank,`batch_indices`)}
    ${c.indicesSet(`a_indices`,c.rank-2,0)}
    ${c.indicesSet(`a_indices`,c.rank-1,0)}
    let a_offset = ${c.indicesToOffset(`a_indices`)};

    var b_indices: ${l.type.indices};
    ${wa(`b_indices`,l,l.rank-2,a.rank,`batch_indices`)}
    ${l.indicesSet(`b_indices`,l.rank-2,0)}
    ${l.indicesSet(`b_indices`,l.rank-1,0)}
    let b_offset = ${l.indicesToOffset(`b_indices`)};
    var values: array<${u.type.value}, ${p}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${f}) {
      ${S()}
    }
    for (var i = 0u; i < ${p}u; i++) {
      var value = values[i];
      ${b}
      ${v}
      let cur_indices = ${u.type.indices}(batch, row + i, col);
      let offset = ${u.indicesToOffset(`cur_indices`)};
      ${u.setByOffset(`offset / ${d}`,`value`)};
    }
  }
  `}}}}),Da,Oa,ka,Aa,ja,Ma,Na,Pa,Fa=o(()=>{V(),G(),Q(),va(),Ea(),xa(),Da=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?`, batchIndices`:``});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?`, batchIndices`:``});
        `,Oa=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?``:`let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];`}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?``:`acc[i] = BCached3 * ACached3[i] + acc[i];`}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?``:`acc[i] = BCached3 * ACached.w + acc[i];`}
        }`,ka=(e,t,n=`f32`,r,i=!1,a=32,o=!1,s=32)=>{let c=t[1]*e[1],l=t[0]*e[0],u=i?c:a,d=i?a:c,f=u/t[0],p=a/t[1];if(!((i&&f===4&&e[1]===4||!i&&(f===3||f===4))&&u%t[0]===0&&a%t[1]===0&&e[0]===4))throw Error(`If transposeA ${i} is true, innerElementSize ${f} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${f} must be 3 or 4.
  tileAWidth ${u} must be divisible by workgroupSize[0]${t[0]}. tileInner ${a} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${f}<${n}>, ${u/f}>, ${d}>;
var<workgroup> mm_Bsub: array<array<vec4<${n}>, ${l/e[0]}>, ${a}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${f};
const tileInner = ${a};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${o?`0`:`i32(globalId.z)`};
  ${r?`let batchIndices = ${r.offsetToIndices(`u32(batch)`)};`:``}
  let globalRowStart = i32(workgroupId.y) * ${c};

  let num_tiles = ${o?`${Math.ceil(s/a)}`:`(uniforms.dim_inner - 1) / tileInner + 1`};
  var kStart = ${o?`i32(globalId.z) * ${s}`:`0`};

  var acc: array<vec4<${n}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${p};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${Da(i,r)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${p}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${r?`, batchIndices`:``});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${f===3?``:`let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];`}

          ${Oa(i,f)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},Aa=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?`, batchIndices`:``});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?`, batchIndices`:``});
            `,ja=e=>e?`let ACached = mm_Asub[k][tileRow + innerRow];`:`let ACached = mm_Asub[tileRow + innerRow][k];`,Ma=(e,t,n=`f32`,r,i=!1,a=32,o=!1,s=32,c=!1)=>{let l=e[1]*t[1],u=e[0]*t[0],d=i?l:a,f=i?a:l;if(!(f%t[1]===0&&d%t[0]===0&&a%t[1]===0))throw Error(`tileAHight ${f} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${d} must be divisible by workgroupSize[0]${t[0]}, tileInner ${a} must be divisible by workgroupSize[1]${t[1]}`);let p=f/t[1],m=d/t[0],h=a/t[1],g=c?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${l};
    let globalColStart = i32(workgroupId.x) * ${u};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${f}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${d}; inputCol = inputCol + ${t[0]}) {
          ${Aa(i,r)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${a}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${u}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${r?`, batchIndices`:``});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${n}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${i?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${l};

let tileRowA = i32(localId.y) * ${p};
let tileColA = i32(localId.x) * ${m};
let tileRowB = i32(localId.y) * ${h};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${p}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${m}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Aa(i,r)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${h}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${r?`, batchIndices`:``});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${n}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${ja(i)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${n}, ${d}>, ${f}>;
  var<workgroup> mm_Bsub : array<array<${n}, ${u}>, ${a}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${a};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${o?`0`:`i32(globalId.z)`};
    ${r?`let batchIndices = ${r.offsetToIndices(`u32(batch)`)};`:``}
    let num_tiles = ${o?`${Math.ceil(s/a)}`:`(uniforms.dim_inner - 1) / tileInner + 1`};
    var kStart = ${o?`i32(globalId.z) * ${s}`:`0`};

    var acc : array<array<${n}, colPerThread>, rowPerThread>;
    ${g}
  }
`},Na=(e,t,n,r,i=!1)=>{let[a,o,s,c]=r,l=pn(r[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${ya(e,l)} {
      var value = ${ya(e,l)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${o.type.indices};
        ${wa(`aIndices`,o,o.rank-2,a.rank,`batchIndices`)}
        ${o.indicesSet(`aIndices`,o.rank-2,`u32(row)`)}
        ${o.indicesSet(`aIndices`,o.rank-1,`u32(colIn)`)}
        value = ${o.getByIndices(`aIndices`)};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${ya(e,l)} {
      var value = ${ya(e,l)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${s.type.indices};
        ${wa(`bIndices`,s,s.rank-2,a.rank,`batchIndices`)}
        ${s.indicesSet(`bIndices`,s.rank-2,`u32(row)`)}
        ${s.indicesSet(`bIndices`,s.rank-1,`u32(colIn)`)}
        value = ${s.getByIndices(`bIndices`)};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${ya(e,l)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${i?`bias[colIn]`:`${ya(e,l)}(bias[row])`};`:``}
        ${n}
        ${c.setByIndices(`vec3<u32>(coords)`,`value`)}
      }
    }
    `},Pa=(e,t,n,r,i=!1,a)=>{let o=e[0].dims,s=e[1].dims,c=o.slice(0,-2),l=s.slice(0,-2),u=r?r.slice(0,-2):n.slice(0,-2),d=W.size(u),f=o[o.length-2],p=o[o.length-1],m=s[s.length-1],h=p%4==0&&m%4==0,g=f<=8?[4,1,1]:[4,4,1],_=[8,8,1],v=[Math.ceil(m/_[0]/g[0]),Math.ceil(f/_[1]/g[1]),Math.ceil(d/_[2]/g[2])],y=h?4:1,b=[...c,f,p/y],x=b.length,S=[...l,p,m/y],C=S.length,w=[d,f,m/y],T=[{type:6,data:f},{type:6,data:m},{type:6,data:p}];ha(t,T),T.push(...J(u,b,S));let E=[`rank`,`rank`],D=e.length>2;return D&&(T.push(...J(e[2].dims)),E.push(`rank`)),T.push(...J(w)),{name:`MatMul`,shaderCache:{hint:`${g};${t.activation};${h};${i}`,inputDependencies:E},getRunData:()=>({outputs:[{dims:a?a(n):n,dataType:e[0].dataType}],dispatchGroup:{x:v[0],y:v[1],z:v[2]},programUniforms:T}),getShaderSource:n=>{let r=u.length,a=xn(`batchDims`,e[0].dataType,r,1),o=pn(e[0].dataType),s=X(`a`,e[0].dataType,x,y),c=X(`b`,e[1].dataType,C,y),l=Z(`result`,e[0].dataType,w.length,y),d=[s,c];if(D){let t=i?y:1;d.push(X(`bias`,e[2].dataType,e[2].dims.length,t))}let f=[{name:`dim_a_outer`,type:`i32`},{name:`dim_b_outer`,type:`i32`},{name:`dim_inner`,type:`i32`}];ga(t,f);let p=pn(l.type.tensor),m=ma(t,l.type.value,p),v=Na(y,D,m,[a,s,c,l],i);return`
  ${n.registerUniforms(f).registerInternalVariables(a).declareVariables(...d,l)}
  ${v}
  ${h?ka(g,_,o,a):Ma(g,_,o,a)}
                   `}}}}),Ia,La,Ra=o(()=>{V(),U(),Q(),va(),xa(),Ca(),Fa(),Ia=(e,t,n,r,i=!1,a,o=4,s=4,c=4,l=`f32`)=>{let u=e=>{switch(e){case 1:return`resData = x[xIndex];`;case 3:return`resData = vec3<${l}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return`resData = x[xIndex / 4];`;default:throw Error(`innerElementSize ${e} is not supported.`)}},d=e=>{switch(e){case 1:return`return w[row * i32(uniforms.w_shape[3]) + colIn];`;case 4:return`return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];`;default:throw Error(`innerElementSize ${e} is not supported.`)}},f=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,p=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,m=e?`i32(uniforms.x_shape[1])`:`i32(uniforms.x_shape[2])`,h=e?`i32(uniforms.x_shape[2])`:`i32(uniforms.x_shape[3])`,g=e?`row`:`col`,_=e?`col`:`row`,v=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?`i32(uniforms.result_shape[2])`:`i32(uniforms.result_shape[3])`};
    let outRow = ${g} / outWidth;
    let outCol = ${g} % outWidth;

    let WRow = ${_} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${_} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${_} % inChannels;
    var resData = ${ya(o,l)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${m} && xCol >= 0 && xCol < ${h}) {
      ${f}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${u(o)}
    }
    return resData;`,y=e?t&&r?`
    let col = colIn * ${o};
    ${v}`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${v}
    }
    return ${ya(o,l)}(0.0);`:r&&n?`
    let col = colIn * ${o};
    ${v}`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${v}
    }
    return ${ya(o,l)}(0.0);`,b=e?r&&n?d(s):`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${d(s)}
    }
    return ${ya(s,l)}(0.0);`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${d(s)}
    }
    return ${ya(s,l)}(0.0);`,x=ya(c,l),S=ya(e?o:s,l),C=ya(e?s:o,l),w=ma(a,x,l);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${S} {
      ${e?y:b}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${C} {
      ${e?b:y}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${x}) {
      let col = colIn * ${c};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?`i32(uniforms.result_shape[2])`:`i32(uniforms.result_shape[3])`};
      ${p}
      ${ba(i)}
      ${w}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},La=(e,t,n,r,i,a,o,s,c)=>{let l=t.format===`NHWC`,u=l?e[0].dims[3]:e[0].dims[1],d=n[0],f=l?n[2]:n[3],p=l?n[1]:n[2],m=l?n[3]:n[1],h=l&&(u%4==0||u%3==0)&&m%4==0,g=l?m:f*p,_=l?f*p:m,v=[8,8,1],y=r<=8?[4,1,1]:[4,4,1],b=[Math.ceil(g/v[0]/y[0]),Math.ceil(_/v[1]/y[1]),Math.ceil(d/v[2]/y[2])];H(`verbose`,()=>`[conv2d_mm_webgpu] dispatch = ${b}`);let x=h?l&&u%4!=0?3:4:1,S=v[1]*y[1],C=v[0]*y[0],w=Math.max(v[0]*x,v[1]),T=r%S===0,E=i%C===0,D=a%w===0,ee=h?[x,4,4]:[1,1,1],te=[{type:6,data:r},{type:6,data:i},{type:6,data:a},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];ha(t,te),te.push(...J(e[0].dims,e[1].dims));let ne=[`rank`,`rank`];return o&&(te.push(...J(e[2].dims)),ne.push(`rank`)),te.push(...J(n)),{name:`Conv2DMatMul`,shaderCache:{hint:`${t.cacheKey};${x};${h};${T};${E};${D};${S};${C};${w}`,inputDependencies:ne},getRunData:()=>({outputs:[{dims:c?c(n):n,dataType:e[0].dataType}],dispatchGroup:{x:b[0],y:b[1],z:b[2]},programUniforms:te}),getShaderSource:r=>{let i=[{name:`dim_a_outer`,type:`i32`},{name:`dim_b_outer`,type:`i32`},{name:`dim_inner`,type:`i32`},{name:`pad`,type:`i32`,length:2},{name:`stride`,type:`i32`,length:2},{name:`dilation`,type:`i32`,length:2}];ga(t,i);let a=h?4:1,c=pn(e[0].dataType),u=`
      fn setOutputAtIndex(flatIndex : i32, value : ${h?`vec4<${c}>`:c}) {
        result[flatIndex] = ${h?`vec4<${c}>`:c}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${h?`vec4<${c}>`:c}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${h?`/ 4`:``}, value);
      }`,d=[X(`x`,e[0].dataType,e[0].dims.length,x===3?1:x),X(`w`,e[1].dataType,e[1].dims.length,a)],f=Z(`result`,e[0].dataType,n.length,a);if(o){let t=X(`bias`,e[2].dataType,e[2].dims.length,a);d.push(t),u+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${h?`vec4<${c}>`:c} {
          return bias[coords.${l?`w`:`y`}${h?`/ 4`:``}];
        }`}return`
        ${Sa(`uniforms.result_strides`)}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${r.registerUniforms(i).declareVariables(...d,f)}
        ${u}
        ${Ia(l,T,E,D,o,t,ee[0],ee[1],ee[2],c)}
        ${h?ka(y,v,c,void 0,!l,w):Ma(y,v,c,void 0,!l,w,!1,void 0,s)}`}}}}),za,Ba,Va,Ha,Ua,Wa,Ga,Ka,qa=o(()=>{V(),U(),G(),Q(),va(),xa(),za=e=>{let t=1;for(let n=0;n<e.length;n++)t*=e[n];return t},Ba=e=>typeof e==`number`?[e,e,e]:e,Va=(e,t)=>t<=1?e:e+(e-1)*(t-1),Ha=(e,t,n,r=1)=>{let i=Va(t,r);return Math.floor((e[0]*(n-1)-n+i)/2)},Ua=(e,t,n,r,i)=>{i??=Ha(e,t[0],r[0]);let a=[0,0,0,n];for(let n=0;n<3;n++)e[n]+2*i>=t[n]&&(a[n]=Math.trunc((e[n]-t[n]+2*i)/r[n]+1));return a},Wa=(e,t,n,r,i,a,o,s,c,l)=>{let u,d,f,p;if(e===`VALID`&&(e=0),typeof e==`number`){u={top:e,bottom:e,left:e,right:e,front:e,back:e};let m=Ua([t,n,r,1],[s,c,l],1,[i,a,o],e);d=m[0],f=m[1],p=m[2]}else if(Array.isArray(e)){if(!e.every((e,t,n)=>e===n[0]))throw Error(`Unsupported padding parameter: ${e}`);u={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let m=Ua([t,n,r,1],[s,c,l],1,[i,a,o],e[0]);d=m[0],f=m[1],p=m[2]}else if(e===`SAME_UPPER`){d=Math.ceil(t/i),f=Math.ceil(n/a),p=Math.ceil(r/o);let e=(d-1)*i+s-t,m=(f-1)*a+c-n,h=(p-1)*o+l-r,g=Math.floor(e/2),_=e-g,v=Math.floor(m/2),y=m-v,b=Math.floor(h/2);u={top:v,bottom:y,left:b,right:h-b,front:g,back:_}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:u,outDepth:d,outHeight:f,outWidth:p}},Ga=(e,t,n,r,i,a=!1,o=`channelsLast`)=>{let s,c,l,u,d;if(o===`channelsLast`)[s,c,l,u,d]=e;else if(o===`channelsFirst`)[s,d,c,l,u]=e;else throw Error(`Unknown dataFormat ${o}`);let[f,,p,m,h]=t,[g,_,v]=Ba(n),[y,b,x]=Ba(r),S=Va(p,y),C=Va(m,b),w=Va(h,x),{padInfo:T,outDepth:E,outHeight:D,outWidth:ee}=Wa(i,c,l,u,g,_,v,S,C,w),te=a?f*d:f,ne=[0,0,0,0,0];return o===`channelsFirst`?ne=[s,te,E,D,ee]:o===`channelsLast`&&(ne=[s,E,D,ee,te]),{batchSize:s,dataFormat:o,inDepth:c,inHeight:l,inWidth:u,inChannels:d,outDepth:E,outHeight:D,outWidth:ee,outChannels:te,padInfo:T,strideDepth:g,strideHeight:_,strideWidth:v,filterDepth:p,filterHeight:m,filterWidth:h,effectiveFilterDepth:S,effectiveFilterHeight:C,effectiveFilterWidth:w,dilationDepth:y,dilationHeight:b,dilationWidth:x,inShape:e,outShape:ne,filterShape:t}},Ka=(e,t,n,r,i,a)=>{let o=a===`channelsLast`;o?e[0].dims[3]:e[0].dims[1];let s=[64,1,1],c={x:n.map((e,t)=>t)},l=[Math.ceil(za(c.x.map(e=>n[e]))/s[0]),1,1];H(`verbose`,()=>`[conv3d_naive_webgpu] dispatch = ${l}`);let u=[{type:12,data:W.size(n)},{type:12,data:r},{type:12,data:i},{type:12,data:t.strides},{type:12,data:t.dilations}];ha(t,u),u.push(...J(e[0].dims,e[1].dims));let d=[`rank`,`rank`],f=e.length===3;return f&&(u.push(...J(e[2].dims)),d.push(`rank`)),u.push(...J(n)),{name:`Conv3DNaive`,shaderCache:{hint:`${t.cacheKey};${o};1;${f}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:l[0],y:l[1],z:l[2]},programUniforms:u}),getShaderSource:a=>{let s=[{name:`output_size`,type:`u32`},{name:`filter_dims`,type:`u32`,length:r.length},{name:`pads`,type:`u32`,length:i.length},{name:`strides`,type:`u32`,length:t.strides.length},{name:`dilations`,type:`u32`,length:t.dilations.length}];ga(t,s);let c=pn(e[0].dataType),l=X(`x`,e[0].dataType,e[0].dims.length,1),u=X(`W`,e[1].dataType,e[1].dims.length,1),d=[l,u],p=Z(`result`,e[0].dataType,n.length,1),m=``;if(f){let t=X(`bias`,e[2].dataType,e[2].dims.length,1);d.push(t),m+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${c} {
          return bias[${o?Y(`coords`,4,5):Y(`coords`,1,5)}];
        }`}let h=ya(1,c),g=ma(t,h,c);return`
            ${m}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${l.getByIndices(`aIndices`)};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${u.getByIndices(`aIndices`)};
            }
          ${a.registerUniforms(s).declareVariables(...d,p)}
          ${a.mainStart()}
          ${a.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
              let coords = ${p.offsetToIndices(`global_idx`)};
              let batch = ${Y(`coords`,0,l.rank)};
              let d2 = ${o?Y(`coords`,l.rank-1,l.rank):Y(`coords`,1,l.rank)};
              let xFRCCorner = vec3<u32>(${o?Y(`coords`,1,l.rank):Y(`coords`,2,l.rank)},
              ${o?Y(`coords`,2,l.rank):Y(`coords`,3,l.rank)},
              ${o?Y(`coords`,3,l.rank):Y(`coords`,4,l.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${o?Y(`uniforms.x_shape`,1,l.rank):Y(`uniforms.x_shape`,2,l.rank)};
              let xShapeZ = ${o?Y(`uniforms.x_shape`,2,l.rank):Y(`uniforms.x_shape`,3,l.rank)};
              let xShapeW = ${o?Y(`uniforms.x_shape`,3,l.rank):Y(`uniforms.x_shape`,4,l.rank)};
              let xShapeU = ${o?Y(`uniforms.x_shape`,4,l.rank):Y(`uniforms.x_shape`,1,l.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${o?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${o?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${o?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${o?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${f?`value = value + getBiasByOutputCoords(coords)`:``};
              ${g}
              result[global_idx] = f32(value);
          }`}}}}),Ja,Ya,Xa=o(()=>{V(),G(),Q(),va(),Ja=(e,t,n,r)=>{let i=e.length>2,a=i?`value += b[output_channel];`:``,o=e[0].dims,s=e[1].dims,c=t.format===`NHWC`,l=c?n[3]:n[1],u=l/t.group,d=c&&u>=4?hn(l):1,f=W.size(n)/d,p=[{type:12,data:f},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:u}];ha(t,p),p.push(...J(o,[s[0],s[1],s[2],s[3]/d]));let m=i?[`rank`,`rank`,`rank`]:[`rank`,`rank`];return p.push(...J([n[0],n[1],n[2],n[3]/d])),{name:`GroupedConv`,shaderCache:{hint:`${t.cacheKey}_${d}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:r?r(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:p}),getShaderSource:r=>{let l=Z(`output`,e[0].dataType,n.length,d),u=pn(l.type.tensor),f=ma(t,l.type.value,u),p=X(`x`,e[0].dataType,o.length),m=X(`w`,e[1].dataType,s.length,d),h=[p,m];i&&h.push(X(`b`,e[2].dataType,e[2].dims,d));let g=[{name:`output_size`,type:`u32`},{name:`dilations`,type:`u32`,length:t.dilations.length},{name:`strides`,type:`u32`,length:2},{name:`pads`,type:`u32`,length:2},{name:`output_channels_per_group`,type:`u32`}];ga(t,g);let _=c?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${p.get(`batch`,`xHeight`,`xWidth`,`input_channel`)};
            let wVal = ${m.get(`wHeight`,`wWidth`,`wInChannel`,`output_channel`)};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${p.get(`batch`,`input_channel`,`xHeight`,`xWidth`)};
            let wVal = ${m.get(`output_channel`,`wInChannel`,`wHeight`,`wWidth`)};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${r.registerUniforms(g).declareVariables(...h,l)}

  ${r.mainStart()}
    ${r.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}

    let outputIndices = ${l.offsetToIndices(`global_idx`)};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${c?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${c?1:2}], outputIndices[${c?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${d} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${c?2:1}];

    var value: ${l.type.value} = ${l.type.value}(0);
    ${_}
    ${a}
    ${f}
    ${l.setByOffset(`global_idx`,`value`)}
  }`}}},Ya=(e,t,n,r)=>{let i=e.length>2,a=hn(n[3]),o=hn(n[2]),s=W.size(n)/a/o,c=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/a],l=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/a],u=[n[0],n[1],n[2],n[3]/a],d=[{type:12,data:s},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];ha(t,d),d.push(...J(c,l,u));let f=(o-1)*t.strides[1]+l[1];return{name:`GroupedConv-Vectorize`,shaderCache:{hint:`${t.cacheKey};${a};${o};${f};${l[0]};${l[1]}`,inputDependencies:i?[`rank`,`rank`,`type`]:[`rank`,`rank`]},getRunData:()=>({outputs:[{dims:r?r(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:d}),getShaderSource:n=>{let r=Z(`output`,e[0].dataType,u.length,a),s=pn(r.type.tensor),d=ma(t,r.type.value,s),p=X(`x`,e[0].dataType,c.length,a),m=X(`w`,e[1].dataType,l.length,a),h=[p,m];i&&h.push(X(`b`,e[2].dataType,e[2].dims,a));let g=i?`value += b[output_channel];`:``,_=[{name:`output_size`,type:`u32`},{name:`strides`,type:`i32`,length:2},{name:`pads`,type:`i32`,length:2}];return ga(t,_),`
  ${n.registerUniforms(_).declareVariables(...h,r)}
  ${n.mainStart()}
    ${n.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${o}u;
    let col = (index1 % width1) * ${o}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${p.type.value}, ${f}>;
    var values: array<${r.type.value}, ${o}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${l[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${f}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${p.get(`batch`,`u32(x_height)`,`u32(x_width)`,`input_channel`)};
          } else {
            x_vals[i] = ${p.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${l[1]}; w_width++) {
          let w_val = ${m.get(`w_height`,`w_width`,`0`,`output_channel`)};
          for (var i = 0u; i < ${o}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${o}u; i++) {
      var value = values[i];
      ${g}
      ${d}
      ${r.set(`batch`,`row`,`col + i`,`output_channel`,`value`)};
    }
  }`}}}}),Za,Qa,$a,eo,to,no,ro,io,ao,oo=o(()=>{G(),Ra(),qa(),Fa(),Xa(),va(),Ea(),Nn(),Za=(e,t,n,r,i,a)=>{let o=e[0],s=e.slice(a?1:2,a?3:4),c=s.length,l=t[0],u=t.slice(2).map((e,t)=>e+(e-1)*(n[t]-1)),d=s.map((e,t)=>e+r[t]+r[t+c]).map((e,t)=>Math.floor((e-u[t]+i[t])/i[t]));return d.splice(0,0,o),d.splice(a?3:1,0,l),d},Qa=[2,3,1,0],$a=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw Error(`Conv requires 2 or 3 inputs`);if(e[0].dims.length>5)throw Error(`greater than 5D is not supported`);if(e[0].dims.length!==e[1].dims.length)throw Error(`filter does not have same dimension as input`);if(e[0].dims[t.format===`NHWC`?e[0].dims.length-1:1]!==e[1].dims[1]*t.group)throw Error(`FILTER_IN_CHANNEL should be equal to DATA_CHANNEL`);if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw Error(`invalid bias`);let n=e[0].dims.length-2;if(t.dilations.length!==n)throw Error(`dilations should be ${n}D`);if(t.strides.length!==n)throw Error(`strides should be ${n}D`);if(t.pads.length!==n*2)throw Error(`pads should be ${n*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw Error(`invalid kernel shape`)},eo=(e,t)=>{let n=e.kernelShape.slice();n.length<t[1].dims.length-2&&n.push(...Array(t[1].dims.length-2-n.length).fill(0));for(let e=2;e<t[1].dims.length;++e)n[e-2]===0&&(n[e-2]=t[1].dims[e]);let r=e.pads.slice();At.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,n,r,e.format===`NHWC`,e.autoPad);let i=Object.assign({},e);return Object.assign(i,{kernelShape:n,pads:r}),i},to=e=>{let t=_a(e),n=e.format;return{autoPad:[`NOTSET`,`VALID`,`SAME_UPPER`,`SAME_LOWER`][e.auto_pad],format:n,dilations:e.dilations,group:e.group,kernelShape:e.kernel_shape,pads:e.pads,strides:e.strides,wIsConst:e.w_is_const(),...t,cacheKey:`${e.format};${t.activation};`}},no=(e,t,n,r)=>{let i=n.format===`NHWC`,a=Za(t[0].dims,t[1].dims,n.dilations,n.pads,n.strides,i);if(n.group!==1){let o=[t[0]];if(i){let r=e.kernelCustomData.wT??e.compute(An(t[1],Qa),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=r),o.push(r)}else o.push(t[1]);t.length===3&&o.push(t[2]),!e.adapterInfo.isArchitecture(`ampere`)&&i&&t[1].dims[0]===n.group&&t[1].dims[1]===1&&n.dilations[0]===1&&n.dilations[1]===1?e.compute(Ya(o,n,a,r),{inputs:o}):e.compute(Ja(o,n,a,r),{inputs:o});return}let o=t.length===3,s=t[0].dims[i?1:2],c=t[0].dims[i?2:3],l=t[0].dims[i?3:1],u=t[1].dims[2],d=t[1].dims[3],f=a[i?1:2],p=a[i?2:3],m=a[i?3:1],h=i&&u===s&&d===c&&n.pads[0]===0&&n.pads[1]===0;if(h||u===1&&d===1&&n.dilations[0]===1&&n.dilations[1]===1&&n.strides[0]===1&&n.strides[1]===1&&n.pads[0]===0&&n.pads[1]===0){let u=a[0],d,g,_,v=[];if(i){let r=e.kernelCustomData.wT??e.compute(An(t[1],Qa),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];if(n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=r),h){let e=s*c*l;d=t[0].reshape([1,u,e]),g=r.reshape([1,e,m]),_=[1,u,m]}else d=t[0].reshape([u,s*c,l]),g=r.reshape([1,l,m]),_=[u,f*p,m];v.push(d),v.push(g)}else d=t[0].reshape([u,l,s*c]),g=t[1].reshape([1,m,l]),_=[u,m,f*p],v.push(g),v.push(d);o&&v.push(t[2]);let y=_[2],b=v[0].dims[v[0].dims.length-1];y<8&&b<8?e.compute(Ta(v,n,a,_,i,r),{inputs:v}):e.compute(Pa(v,n,a,_,i,r),{inputs:v});return}let g=e.kernelCustomData.wT??e.compute(An(t[1],Qa),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=g);let _=[t[0],g];o&&_.push(t[2]);let v=i?f*p:m,y=i?m:f*p,b=u*d*l;e.compute(La(_,n,a,v,y,b,o,!0,r),{inputs:_})},ro=(e,t)=>{let n=t.format===`NHWC`,r=[e.inputs[0].reshape(n?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&r.push(e.inputs[2]);let i=[0,t.pads[0],0,t.pads[1]],a=[1].concat(t.strides),o=[1].concat(t.dilations),s=[1].concat(t.kernelShape),c=eo({...t,pads:i,strides:a,dilations:o,kernelShape:s},r);no(e,r,c,e=>n?[e[0],e[2],e[3]]:[e[0],e[1],e[3]])},io=(e,t,n)=>{let r=n.format===`NHWC`?`channelsLast`:`channelsFirst`,i=eo(n,t),a=n.autoPad===`NOTSET`?n.pads:n.autoPad,o=Ga(t[0].dims,t[1].dims,n.strides,n.dilations,a,!1,r);e.compute(Ka(t,i,o.outShape,[o.filterDepth,o.filterHeight,o.filterWidth],[o.padInfo.front,o.padInfo.top,o.padInfo.left],r))},ao=(e,t)=>{if($a(e.inputs,t),e.inputs[0].dims.length===3)ro(e,t);else if(e.inputs[0].dims.length===5)io(e,e.inputs,t);else{let n=eo(t,e.inputs);no(e,e.inputs,n)}}}),so,co=o(()=>{V(),U(),G(),Q(),so=(e,t,n)=>{let r=e.length>2,i=t.outputShape,a=t.format===`NHWC`,o=t.group,s=e[1].dims,c=s[2]/o,l=s[3],u=a?hn(c):1,d=a&&l===1&&c>=4,f=d?Math.floor(c/4)*4:Math.floor(c/u)*u,p=c-f,m=a?hn(l):1,h=a?l===1?u:m:1,g=W.size(i)/m,_=[Math.ceil(g/64),1,1];H(`verbose`,()=>`[conv2d_backprop_webgpu] dispatch = ${_}`);let v=[`rank`,`rank`],y=[t.strides[0],t.strides[1]],b=[t.kernelShape[a?1:2],t.kernelShape[a?2:3]],x=[t.dilations[0],t.dilations[1]],S=[b[0]+(t.dilations[0]<=1?0:(t.kernelShape[a?1:2]-1)*(t.dilations[0]-1)),b[1]+(t.dilations[1]<=1?0:(t.kernelShape[a?2:3]-1)*(t.dilations[1]-1))],C=[S[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),S[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],w=[{type:12,data:g},{type:12,data:y},{type:12,data:b},{type:12,data:x},{type:12,data:S},{type:6,data:C},{type:12,data:f},{type:12,data:c},{type:12,data:l},...J(e[0].dims,e[1].dims)];return r&&(w.push(...J(e[2].dims)),v.push(`rank`)),w.push(...J(i)),{name:`ConvTranspose2D`,shaderCache:{hint:`${t.cacheKey};${u}${h}${m}${d}${p}`,inputDependencies:v},getRunData:()=>({dispatchGroup:{x:_[0],y:_[1],z:_[2]},outputs:[{dims:n?n(i):i,dataType:e[0].dataType}],programUniforms:w}),getShaderSource:t=>{let n=[{name:`output_size`,type:`u32`},{name:`strides`,type:`u32`,length:y.length},{name:`filter_dims`,type:`u32`,length:b.length},{name:`dilations`,type:`u32`,length:b.length},{name:`effective_filter_dims`,type:`u32`,length:S.length},{name:`pads`,type:`i32`,length:C.length},{name:`input_channels_per_group_int`,type:`u32`},{name:`input_channels_per_group`,type:`u32`},{name:`output_channels_per_group`,type:`u32`}],o=pn(e[0].dataType),s=a?1:2,c=a?2:3,l=a?3:1,f=X(`W`,e[1].dataType,e[1].dims.length,h),g=X(`Dy`,e[0].dataType,e[0].dims.length,u),_=[g,f];r&&_.push(X(`bias`,e[2].dataType,[i[l]].length,m));let v=Z(`result`,e[0].dataType,i.length,m),x=`
            let outputIndices = ${v.offsetToIndices(`global_idx * ${m}`)};
            let batch = ${v.indicesGet(`outputIndices`,0)};
            let d1 = ${v.indicesGet(`outputIndices`,l)};
            let r = ${v.indicesGet(`outputIndices`,s)};
            let c = ${v.indicesGet(`outputIndices`,c)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${v.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${o}(dyRCorner) + ${o}(wR)) / ${o}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${o}(uniforms.Dy_shape[${s}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${o}(dyCCorner) + ${o}(wC)) / ${o}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${o}(uniforms.Dy_shape[${c}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${d?`
                var x_offset = ${g.indicesToOffset(`${g.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${u};
                var w_offset = ${f.indicesToOffset(`${f.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${h};
                  `:``}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${d?4:u}) {
                  ${(()=>{let e=``;if(d)u===4?e+=`
        let xValue = ${g.getByOffset(`x_offset`)};
        let wValue = ${f.getByOffset(`w_offset`)};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:u===2?e+=`
          dotProd = dotProd + dot(vec4<${o}>(${g.getByOffset(`x_offset`)}, ${g.getByOffset(`x_offset + 1u`)}), vec4<${o}>(${f.getByOffset(`w_offset`)}, ${f.getByOffset(`w_offset + 1u`)}));
          x_offset += 2u;
          w_offset += 2u;`:u===1&&(e+=`
          dotProd = dotProd + dot(vec4<${o}>(${g.getByOffset(`x_offset`)}, ${g.getByOffset(`x_offset + 1u`)}, ${g.getByOffset(`x_offset + 2u`)}, ${g.getByOffset(`x_offset + 3u`)}), vec4<${o}>(${f.getByOffset(`w_offset`)}, ${f.getByOffset(`w_offset + 1u`)}, ${f.getByOffset(`w_offset + 2u`)}, ${f.getByOffset(`w_offset + 3u`)}));
          x_offset += 4u;
          w_offset += 4u;`);else if(e+=`
                  let xValue = ${a?g.getByOffset(`${g.indicesToOffset(`${g.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${u}`):g.get(`batch`,`inputChannel`,`idyR`,`idyC`)};
        `,u===1)e+=`
          let w_offset = ${f.indicesToOffset(`${f.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${f.getByOffset(`w_offset / ${h}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let t=0;t<u;t++)e+=`
            let wValue${t} = ${f.getByOffset(`${f.indicesToOffset(`${f.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${t}, wOutChannel)`)} / ${h}`)};
            dotProd = dotProd + xValue[${t}] * wValue${t};`;return e})()}
                  inputChannel = inputChannel + ${d?4:u};
                }
                ${(()=>{if(p===0)return``;if(!d)throw Error(`packInputAs4 ${d} is not true.`);let e=``;if(u===1){e+=`dotProd = dotProd`;for(let t=0;t<p;t++)e+=`
            + ${g.getByOffset(`x_offset + ${t}`)} * ${f.getByOffset(`w_offset + ${t}`)}`;e+=`;`}else if(u===2){if(p!==2)throw Error(`Invalid inputChannelsRemainder ${p}.`);e+=`
          let xValue = ${g.getByOffset(`x_offset`)};
          let wValue = ${f.getByOffset(`w_offset`)};
          dotProd = dotProd + dot(xValue, wValue);`}return e})()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${r?` + bias[d1 / ${m}]`:``};
            ${v.setByOffset(`global_idx`,`value`)};
          `;return`
    ${t.registerUniforms(n).declareVariables(..._,v)}
      ${t.mainStart()}
      ${t.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)};
    ${x}}`}}}}),lo,uo,fo,po,mo,ho,go,_o,vo,yo=o(()=>{co(),va(),Nn(),lo=(e,t,n,r,i,a)=>(e-1)*t+n+(r-1)*i+1-a,uo=(e,t,n,r,i)=>{let a=Math.floor(e/2);t===`SAME_UPPER`?(n[r]=a,n[i]=e-a):t===`SAME_LOWER`&&(n[r]=e-a,n[i]=a)},fo=(e,t,n,r,i,a,o,s,c,l)=>{let u=e.length-2,d=l.length===0;c.length<u&&c.push(...Array(u-c.length).fill(0));let f=e[0],p=t[s?3:1]*i;for(let i=0,f=e.length-u-+!!s;i<u;++i,++f){let s=e[f],p=d?s*o[i]:l[i],m=lo(s,o[i],a[i],t[f],n[i],p);uo(m,r,a,i,i+u),d&&l.push(o[i]*(s-1)+c[i]+(t[f]-1)*n[i]+1-a[i]-a[i+u])}l.splice(0,0,f),l.splice(s?3:1,0,p)},po=(e,t)=>{let n=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((e,t)=>e*t,1)===0){n.length=0;for(let e=2;e<t[1].dims.length;++e)n.push(t[1].dims[e])}let r=e.format===`NHWC`;n.splice(0,0,t[1].dims[0]),n.splice(r?3:1,0,t[1].dims[1]);let i=e.pads.slice(),a=e.outputShape.slice(),o=e.outputPadding.slice(),s=t[0].dims,c=e.dilations.slice();if(c.reduce((e,t)=>e+t,0)===0){let e=t[0].dims.length-2;c=Array(e).fill(1)}let l=e.strides.slice();if(l.reduce((e,t)=>e+t,0)===0){let e=t[0].dims.length-2;l=Array(e).fill(1)}fo(s,n,c,e.autoPad,e.group,i,l,r,o,a);let u=Object.assign({},e);return Object.assign(u,{kernelShape:n,pads:i,outputPadding:o,outputShape:a,dilations:c,strides:l}),u},mo=e=>{let t=_a(e),n=e.format,r=[`NOTSET`,`VALID`,`SAME_UPPER`,`SAME_LOWER`][typeof e.autoPad>`u`?0:e.autoPad],i=e.dilations,a=e.group??1,o=e.kernelShape,s=e.pads,c=e.strides,l=e.wIsConst();return{autoPad:r,format:n,dilations:i,group:a,kernelShape:o,outputPadding:e.outputPadding,outputShape:e.outputShape,pads:s,strides:c,wIsConst:l,...t,cacheKey:`${e.format};${t.activation};`}},ho=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw Error(`Conv requires 2 or 3 inputs`);if(e[0].dims.length!==4&&e[0].dims.length!==3)throw Error(`currently only support 2-dimensional conv`);if(e[0].dims.length!==e[1].dims.length)throw Error(`filter does not have same dimension as input`);if(e[0].dims[t.format===`NHWC`?e[0].dims.length-1:1]!==e[1].dims[0])throw Error(`FILTER_IN_CHANNEL should be equal to DATA_CHANNEL`);let n=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==n))throw Error(`invalid bias`);let r=e[0].dims.length-2;if(t.dilations.reduce((e,t)=>e+t,0)>0&&t.dilations.length!==r)throw Error(`dilations should be ${r}D`);if(t.strides.reduce((e,t)=>e+t,0)>0&&t.strides.length!==r)throw Error(`strides should be ${r}D`);if(t.pads.reduce((e,t)=>e+t,0)>0&&t.pads.length!==r*2)throw Error(`pads should be ${r*2}D`);if(t.outputPadding.length!==r&&t.outputPadding.length!==0)throw Error(`output_padding should be ${r}D`);if(t.kernelShape.reduce((e,t)=>e+t,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw Error(`invalid kernel shape`);if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw Error(`invalid output shape`)},go=(e,t,n,r)=>{let i=e.kernelCustomData.wT??e.compute(An(t[1],[2,3,0,1]),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=i);let a=[t[0],i];t.length===3&&a.push(t[2]),e.compute(so(a,n,r),{inputs:a})},_o=(e,t)=>{let n=t.format===`NHWC`,r=[e.inputs[0].reshape(n?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&r.push(e.inputs[2]);let i=t.kernelShape;(i.length===0||i[0]===0)&&(i=[e.inputs[1].dims[2]]);let a=t.dilations;(a.length===0||a[0]===0)&&(a=[1]);let o=t.strides;(o.length===0||o[0]===0)&&(o=[1]);let s=t.pads;s.length===0&&(s=[0,0]),s=[0,s[0],0,s[1]],o=[1].concat(o),a=[1].concat(a),i=[1].concat(i);let c=t.outputPadding;c=[0].concat(c);let l=po({...t,pads:s,strides:o,dilations:a,kernelShape:i,outputPadding:c},r);go(e,r,l,e=>n?[e[0],e[2],e[3]]:[e[0],e[1],e[3]])},vo=(e,t)=>{if(ho(e.inputs,t),e.inputs[0].dims.length===3)_o(e,t);else{let n=po(t,e.inputs);go(e,e.inputs,n)}}}),bo,xo,So,Co=o(()=>{V(),G(),un(),Q(),bo=(e,t,n,r)=>{let i=W.size(t),a=t.length,o=X(`input`,e,a),s=Z(`output`,e,a),c=n.dataType===6?n.getInt32Array()[0]:Number(n.getBigInt64Array()[0]),l=W.normalizeAxis(c,a);return{name:`CumSum`,shaderCache:{hint:r.cacheKey,inputDependencies:[`rank`]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:[{type:12,data:i},{type:12,data:l},...J(t,t)]}),getShaderSource:e=>{let t=` i32(${o.indicesGet(`inputIndices`,`uniforms.axis`)}) `,n=Y(`uniforms.input_shape`,`uniforms.axis`,a),i=r.reverse?t+(r.exclusive?` + 1`:``):`0`,c=r.reverse?n:t+(r.exclusive?``:` + 1`);return`
                ${e.registerUniform(`outputSize`,`u32`).registerUniform(`axis`,`u32`).declareVariables(o,s)}
                ${e.mainStart()}
                  ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
                  var inputIndices = ${s.offsetToIndices(`global_idx`)};
                  var sum = ${s.type.value}(0);
                  let first : i32 = ${i};
                  let last : i32 = ${c};
                  for (var i : i32 = first; i < last; i++) {
                    ${o.indicesSet(`inputIndices`,`uniforms.axis`,`u32(i)`)};
                    sum = sum + ${o.getByIndices(`inputIndices`)};
                  }
                  ${s.setByOffset(`global_idx`,`sum`)};
                }`}}},xo=(e,t)=>{let n=e.inputs[0].dims,r=e.inputs[0].dataType,i=e.inputs[1];e.compute(bo(r,n,i,t),{inputs:[0]})},So=e=>{let t=e.exclusive===1,n=e.reverse===1;return q({exclusive:t,reverse:n})}}),wo,To,Eo,Do,Oo,ko=o(()=>{V(),G(),un(),Q(),wo=e=>{if(!e||e.length!==1)throw Error(`DepthToSpace requires 1 input.`);if(e[0].dims.length!==4)throw Error(`DepthToSpace requires 4D input.`)},To=(e,t,n,r)=>{let i=[];i.push(`fn perm(i: ${r.type.indices}) -> ${n.type.indices} {
    var a: ${n.type.indices};`);for(let r=0;r<t;++r)i.push(n.indicesSet(`a`,e[r],`i[${r}]`));return i.push(`return a;}`),i.join(`
`)},Eo=(e,t)=>{let n,r,i,a,o,s,c=t.format===`NHWC`,l=t.blocksize,u=t.mode===`DCR`;c?([n,r,i,a]=e.dims,o=u?[n,r,i,l,l,a/l**2]:[n,r,i,a/l**2,l,l],s=u?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([n,r,i,a]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],o=u?[n,l,l,a/l**2,r,i]:[n,a/l**2,l,l,r,i],s=u?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let d=e.reshape(o),f=d.dims.length,p=e.dataType,m=X(`a`,p,f),h=Z(`output`,p,f);return{name:`DepthToSpace`,shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:[`rank`]},getRunData:e=>{let t=c?[n,r*l,i*l,a/l**2]:[n,a/l**2,r*l,i*l],o=W.size(t),u=d.dims,f=W.sortBasedOnPerm(u,s);return{outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:[{type:12,data:o},...J(u,f)]}},getShaderSource:e=>`
  ${e.registerUniform(`output_size`,`u32`).declareVariables(m,h)}

  ${To(s,f,m,h)}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}

    let indices = ${h.offsetToIndices(`global_idx`)};
    let aIndices = perm(indices);

    ${h.setByOffset(`global_idx`,m.getByIndices(`aIndices`))}
  }`}},Do=(e,t)=>{wo(e.inputs),e.compute(Eo(e.inputs[0],t))},Oo=e=>q({blocksize:e.blocksize,mode:e.mode,format:e.format})}),Ao,jo,Mo,No,Po,Fo,Io,Lo,Ro,zo,Bo,Vo=o(()=>{V(),G(),un(),Q(),Ao=`[a-zA-Z]|\\.\\.\\.`,jo=`(`+Ao+`)+`,Mo=`^`+jo+`$`,No=`(`+jo+`,)*`+jo,Po=`^`+No+`$`,Fo=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let n=this.symbolToIndices.get(e);n===void 0?n=[t]:n.push(t),this.symbolToIndices.set(e,n)}},Io=class{constructor(e,t){this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=[],this.outputDims=[];let[n,r]=t.includes(`->`)?t.split(`->`,2):[t,``];if(!n.match(RegExp(Po)))throw Error(`Invalid LHS term`);if(n.split(`,`).forEach((t,n)=>{let r=e[n].dims.slice();if(!t.match(RegExp(Mo)))throw Error(`Invalid LHS term`);let i=this.processTerm(t,!0,r,n);this.lhs.push(i)}),r===``)r+=[...this.symbolToInfo.entries()].filter(([e,t])=>t.count===1||e===`...`).map(([e])=>e).join(``);else if(!r.match(RegExp(jo)))throw Error(`Invalid RHS`);r.match(RegExp(Ao,`g`))?.forEach(e=>{if(e===`...`)this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let t=this.symbolToInfo.get(e);if(t===void 0)throw Error(`Invalid RHS symbol`);this.outputDims.push(t.dimValue)}}),this.rhs=this.processTerm(r,!1,this.outputDims)}addSymbol(e,t,n){let r=this.symbolToInfo.get(e);if(r!==void 0){if(r.dimValue!==t&&r.count!==1)throw Error(`Dimension mismatch`);r.count++,r.inputIndices.push(n)}else r={count:1,dimValue:t,inputIndices:[n]};this.symbolToInfo.set(e,r)}processTerm(e,t,n,r=-1){let i=n.length,a=!1,o=[],s=0;if(!e.match(RegExp(Mo))&&!t&&e!==``)throw Error(`Invalid LHS term`);let c=e.match(RegExp(Ao,`g`)),l=new Fo(r);return c?.forEach((e,u)=>{if(e===`...`){if(a)throw Error(`Only one ellipsis is allowed per input term`);a=!0;let e=i-c.length+1;if(e<0)throw Error(`Ellipsis out of bounds`);if(o=n.slice(s,s+e),this.hasEllipsis){if(this.ellipsisDims.length!==o.length||this.ellipsisDims.toString()!==o.toString())throw Error(`Ellipsis dimensions mismatch`)}else if(t)this.hasEllipsis=!0,this.ellipsisDims=o;else throw Error(`Ellipsis must be specified in the LHS`);for(let e=0;e<o.length;e++){let t=String.fromCharCode(48+e);l.addSymbol(t,u+e),this.addSymbol(t,n[s++],r)}}else l.addSymbol(e,u+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(e,n[s++],r)}),l}},Lo=e=>e+`_max`,Ro=(e,t,n,r)=>{let i=e.map(e=>e.length).map((e,n)=>X(`input${n}`,t,e)),a=W.size(r),o=Z(`output`,t,r.length),s=[...n.symbolToInfo.keys()].filter(e=>!n.rhs.symbolToIndices.has(e));return{name:`Einsum`,shaderCache:{hint:n.equation,inputDependencies:e.map(()=>`rank`)},getRunData:()=>{let i=s.filter(e=>n.symbolToInfo.has(e)).map(e=>({type:12,data:n.symbolToInfo.get(e)?.dimValue||0}));i.push({type:12,data:a});let o=e.map((e,t)=>[...J(e)]).reduce((e,t)=>e.concat(t),i);return o.push(...J(r)),{outputs:[{dims:r,dataType:t}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:o}},getShaderSource:e=>{let t=[],r=[],a=[],c=[],l=[],u=n.symbolToInfo.size===n.rhs.symbolToIndices.size;n.symbolToInfo.forEach((e,s)=>{if(n.rhs.symbolToIndices.has(s)){let r=n.rhs.symbolToIndices.get(s)?.[0];r!==void 0&&n.lhs.forEach((n,a)=>{if(e.inputIndices.includes(a)){let e=n.symbolToIndices.get(s);if(e===void 0)throw Error(`Invalid symbol error`);e.forEach(e=>{t.push(`${i[a].indicesSet(`input${a}Indices`,e,o.indicesGet(`outputIndices`,r))}`)})}})}else n.lhs.forEach((t,n)=>{if(e.inputIndices.includes(n)){let e=t.symbolToIndices.get(s);if(e===void 0)throw Error(`Invalid symbol error`);e.forEach(e=>{r.push(`${i[n].indicesSet(`input${n}Indices`,e,`${s}`)}`)}),l.push(`prod *= ${i[n].getByIndices(`input${n}Indices`)};`)}}),a.push(`for(var ${s}: u32 = 0; ${s} < uniforms.${Lo(s)}; ${s}++) {`),c.push(`}`)});let d=u?[...t,`let sum = ${i.map((e,t)=>e.getByIndices(`input${t}Indices`)).join(` * `)};`]:[...t,`var sum = 0.0;`,...a,...r,`var prod = 1.0;`,...l,`sum += prod;`,...c];return`
            ${e.registerUniforms(s.map(e=>({name:`${Lo(e)}`,type:`u32`}))).registerUniform(`outputSize`,`u32`).declareVariables(...i,o)}

            ${e.mainStart()}
            ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
            var outputIndices = ${o.offsetToIndices(`global_idx`)};
            ${i.map((e,t)=>`var input${t}Indices: ${i[t].type.indices};`).join(`
`)}
            ${d.join(`
`)};
            ${o.setByOffset(`global_idx`,`sum`)};
          }`}}},zo=(e,t)=>{let n=new Io(e.inputs,t.equation),r=n.outputDims,i=e.inputs.map((e,t)=>e.dims);e.compute(Ro(i,e.inputs[0].dataType,n,r))},Bo=e=>{let t=e.equation.replace(/\s+/g,``);return q({equation:t})}}),Ho,Uo,Wo,Go,Ko,qo=o(()=>{V(),G(),Q(),Ho=e=>{if(!e||e.length!==2)throw Error(`Expand requires 2 input.`);let t=e[0].dims,n=Array.from(e[1].getBigInt64Array(),Number),r=n.length<t.length?0:n.length-t.length,i=t.length<n.length?0:t.length-n.length;for(;r<n.length&&i<t.length;++r,++i)if(n[r]!==t[i]&&n[r]!==1&&t[i]!==1)throw Error(`Expand requires shape to be broadcastable to input`)},Uo=(e,t)=>{let n=e.length-t.length,r=[];for(let t=0;t<n;++t)r.push(e[t]);for(let i=0;i<t.length;++i)r.push(t[i]===1?e[i+n]:t[i]);return r},Wo=(e,t)=>e.length>t.length?Uo(e,t):Uo(t,e),Go=e=>{let t=e[0].dims,n=Array.from(e[1].getBigInt64Array(),Number),r=Wo(t,n),i=e[0].dataType,a=i===9||W.size(t)===1,o=i===9||t.length>0&&t[t.length-1]%4==0?4:1,s=a||r.length>0&&r[r.length-1]%4==0?4:1,c=Math.ceil(W.size(r)/s),l=e=>{let n=X(`input`,i,t.length,o),a=Z(`output`,i,r.length,s),c;if(i===9){let e=(e,t,r=``)=>`
          let outputIndices${t} = ${a.offsetToIndices(`outputOffset + ${t}u`)};
          let offset${t} = ${n.broadcastedIndicesToOffset(`outputIndices${t}`,a)};
          let index${t} = offset${t} / 4u;
          let component${t} = offset${t} % 4u;
          ${e}[${t}] = ${r}(${n.getByOffset(`index${t}`)}[component${t}]);
        `;c=`
        let outputOffset = global_idx * ${s};
        var data = vec4<u32>(0);
        ${e(`data`,0,`u32`)}
        ${e(`data`,1,`u32`)}
        ${e(`data`,2,`u32`)}
        ${e(`data`,3,`u32`)}
        ${a.setByOffset(`global_idx`,`data`)}
      }`}else c=`
        let outputIndices = ${a.offsetToIndices(`global_idx * ${s}`)};
        let inputOffset = ${n.broadcastedIndicesToOffset(`outputIndices`,a)};
        let data = ${a.type.value}(${n.getByOffset(`inputOffset / ${o}`)});
        ${a.setByOffset(`global_idx`,`data`)}
      }`;return`
    ${e.registerUniform(`vec_size`,`u32`).declareVariables(n,a)}
    ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.vec_size`)}
    ${c}`},u=[{type:12,data:c},...J(t,r)];return{name:`Expand`,shaderCache:{hint:`${r.length};${o}${s}`,inputDependencies:[`rank`]},getShaderSource:l,getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:u})}},Ko=e=>{Ho(e.inputs),e.compute(Go(e.inputs),{inputs:[0]})}}),Jo,Yo,Xo=o(()=>{V(),G(),Q(),Hi(),Jo=e=>{let t=e[0].dataType,n=W.size(e[0].dims),r=W.size(e[1].dims),i=r%4==0;return{name:`FastGeluWithBias`,shaderCache:{hint:`${i}`,inputDependencies:[`type`,`type`]},getShaderSource:e=>{let n=X(`x`,t,[1],4),r=X(`bias`,t,[1],4),a=Z(`y`,t,[1],4),o=[{name:`output_vec_size`,type:`u32`},{name:`bias_size`,type:`u32`}],s=e=>`
      let bias${e}_offset: u32 = (global_idx * 4 + ${e}) % uniforms.bias_size;
      let bias${e} = ${r.getByOffset(`bias${e}_offset / 4`)}[bias${e}_offset % 4];`,c=i?`
      let bias = ${r.getByOffset(`global_idx % (uniforms.bias_size / 4)`)};`:`${s(0)}${s(1)}${s(2)}${s(3)}
      let bias = ${n.type.value}(bias0, bias1, bias2, bias3);`;return`${e.registerUniforms(o).declareVariables(n,r,a)}

    ${Pi(mn(t))}

    ${e.mainStart(dn)}
      ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_vec_size`)}

      let x = ${n.getByOffset(`global_idx`)};
      ${c}
      let x_in = x + bias;
      ${a.setByOffset(`global_idx`,Fi(`x_in`))}
    }`},getRunData:e=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],programUniforms:[{type:12,data:Math.ceil(n/4)},{type:12,data:r}],dispatchGroup:{x:Math.ceil(n/dn/4)}})}},Yo=e=>{e.inputs.length<2||W.size(e.inputs[1].dims)===0?Ii(e):e.compute(Jo(e.inputs))}}),Zo,Qo,$o,es,ts=o(()=>{V(),G(),un(),Q(),Zo=e=>{if(!e||e.length!==2)throw Error(`Gather requires 2 inputs.`)},Qo=(e,t)=>{let n=e[0].dims,r=e[1].dims,i=n.length,a=W.normalizeAxis(t.axis,i),o=n.slice(0);o.splice(a,1,...r);let s=n[a],c=e[0].dataType===9?4:1,l=Math.ceil(W.size(o)/c),u=[{type:12,data:l},{type:6,data:s},{type:12,data:a},...J(e[0].dims,e[1].dims,o)];return{name:`Gather`,shaderCache:{hint:t.cacheKey,inputDependencies:[`rank`,`rank`]},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:u}),getShaderSource:t=>{let n=X(`data`,e[0].dataType,e[0].dims.length,c),s=X(`inputIndices`,e[1].dataType,e[1].dims.length),l=Z(`output`,e[0].dataType,o.length,c),u=e=>{let t=r.length,c=`var indicesIndices${e}  = ${s.type.indices}(0);`;for(let n=0;n<t;n++)c+=`${t>1?`indicesIndices${e}[${n}]`:`indicesIndices${e}`} = ${o.length>1?`outputIndices${e}[uniforms.axis + ${n}]`:`outputIndices${e}`};`;c+=`
          var idx${e} = ${s.getByIndices(`indicesIndices${e}`)};
          if (idx${e} < 0) {
            idx${e} = idx${e} + uniforms.axisDimLimit;
          }
          var dataIndices${e} : ${n.type.indices};
        `;for(let n=0,r=0;n<i;n++)n===a?(c+=`${i>1?`dataIndices${e}[${n}]`:`dataIndices${e}`} = u32(idx${e});`,r+=t):(c+=`${i>1?`dataIndices${e}[${n}]`:`dataIndices${e}`} = ${o.length>1?`outputIndices${e}[${r}]`:`outputIndices${e}`};`,r++);return c},d;if(e[0].dataType===9){let e=(e,t,r=``)=>`
          let outputIndices${t} = ${l.offsetToIndices(`outputOffset + ${t}u`)};
          ${u(t)};
          let offset${t} = ${n.indicesToOffset(`dataIndices${t}`)};
          let index${t} = offset${t} / 4u;
          let component${t} = offset${t} % 4u;
          ${e}[${t}] = ${r}(${n.getByOffset(`index${t}`)}[component${t}]);
        `;d=`
        let outputOffset = global_idx * ${c};
        var value = vec4<u32>(0);
        ${e(`value`,0,`u32`)}
        ${e(`value`,1,`u32`)}
        ${e(`value`,2,`u32`)}
        ${e(`value`,3,`u32`)}
        ${l.setByOffset(`global_idx`,`value`)}
      `}else d=`
      let outputIndices = ${l.offsetToIndices(`global_idx`)};
      ${u(``)};
      let value = ${n.getByIndices(`dataIndices`)};
      ${l.setByOffset(`global_idx`,`value`)};
      `;return`
      ${t.registerUniform(`outputSize`,`u32`).registerUniform(`axisDimLimit`,`i32`).registerUniform(`axis`,`u32`).declareVariables(n,s,l)}
      ${t.mainStart()}
        ${t.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
        ${d}
      }`}}},$o=e=>q({axis:e.axis}),es=(e,t)=>{let n=e.inputs;Zo(n),e.compute(Qo(e.inputs,t))}}),ns,rs,is,as=o(()=>{V(),G(),Q(),ns=(e,t,n,r,i,a,o,s,c)=>{let l=[{type:12,data:a},{type:12,data:r},{type:12,data:i},{type:12,data:n},{type:12,data:o},{type:12,data:s},{type:12,data:c}],u=[a];return l.push(...J(t.dims,u)),e.compute({name:`computeSliceOffsets`,shaderCache:{hint:`${i.length}_${n.length}`,inputDependencies:[`rank`]},getRunData:()=>({outputs:[{dims:u,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:l}),getShaderSource:e=>{let r=[X(`indices_data`,t.dataType,t.dims.length),Z(`input_slice_offsets_data`,12,1,1)],a=[{name:`output_size`,type:`u32`},{name:`batch_dims`,type:`u32`},{name:`input_dims`,type:`u32`,length:i.length},{name:`sizes_from_slice_dims_data`,type:`u32`,length:n.length},{name:`num_slices_per_batch`,type:`u32`},{name:`input_batch_stride`,type:`u32`},{name:`num_slice_dims`,type:`u32`}];return`
  ${e.registerUniforms(a).declareVariables(...r)}
  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${i.length===1?`index += i32(uniforms.input_dims);`:`index += i32(uniforms.input_dims[input_dim_idx]);`}
      }
      ${n.length===1?`relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);`:`relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);`}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`}},{inputs:[t],outputs:[-1]})[0]},rs=(e,t)=>{let n=e.inputs,r=n[0].dims,i=n[0].dataType,a=n[1].dims,o=a[a.length-1],s=W.sizeToDimension(a,a.length-1),c=W.sizeFromDimension(r,t.batchDims+o),l=W.sizeToDimension(r,t.batchDims),u=W.sizeFromDimension(r,t.batchDims),d=s/l,f=Array(o),p=c;for(let e=0;e<o;++e)f[o-1-e]=p,p*=r[t.batchDims+o-1-e];let m=ns(e,n[1],f,t.batchDims,r,s,d,u,o),h=t.batchDims+o;if(h>r.length)throw Error(`last dimension of indices must not be larger than rank of input tensor`);let g=a.slice(0,-1).concat(r.slice(h)),_=W.size(g),v=[{type:12,data:_},{type:12,data:c},...J(n[0].dims,m.dims,g)];e.compute({name:`GatherND`,shaderCache:{hint:t.cacheKey,inputDependencies:[`rank`,`rank`]},getRunData:()=>({outputs:[{dims:g,dataType:i}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:v}),getShaderSource:e=>{let t=X(`data`,n[0].dataType,n[0].dims.length),r=X(`slice_offsets`,12,m.dims.length),i=Z(`output`,n[0].dataType,g.length);return`
          ${e.registerUniform(`output_size`,`u32`).registerUniform(`slice_size`,`u32`).declareVariables(t,r,i)}
            ${e.mainStart()}
            ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`}},{inputs:[n[0],m]})},is=e=>({batchDims:e.batch_dims,cacheKey:``})}),os,ss,cs,ls,us=o(()=>{V(),G(),un(),Q(),os=(e,t)=>{if(e.length<3||e.length>4)throw Error(`GatherBlockQuantized requires 3 or 4 inputs.`);let n=W.normalizeAxis(t.quantizeAxis,e[0].dims.length),r=t.blockSize,i=e[0],a=e[2],o=e.length===4?e[3]:void 0;if(a.dims.length!==i.dims.length||!i.dims.map((e,t)=>t===n?Math.ceil(e/r)===a.dims[t]:e===a.dims[t]).reduce((e,t)=>e&&t,!0))throw Error(`Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.`);if(o){if(o.dataType!==i.dataType)throw Error(`Zero point must have the same data type as the input tensor.`);if(o.dims.length!==a.dims.length||!o.dims.map((e,t)=>e===a.dims[t]).reduce((e,t)=>e&&t,!0))throw Error(`Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.`)}},ss=(e,t)=>{let n=e[0].dims,r=e[1].dims,i=n.length,a=W.normalizeAxis(t.gatherAxis,i),o=W.normalizeAxis(t.quantizeAxis,i),s=n.slice(0);s.splice(a,1,...r);let c=W.size(s),l=e[2].dataType,u=e[0].dataType===22,d=[{type:12,data:c},{type:12,data:o},{type:12,data:a},{type:12,data:t.blockSize},...J(...e.map((e,t)=>e.dims),s)];return{name:`GatherBlockQuantized`,shaderCache:{hint:`${t.cacheKey};${e.filter((e,t)=>t!==1).map(e=>e.dims.join(`_`)).join(`;`)}`,inputDependencies:Array.from({length:e.length},(e,t)=>`rank`)},getRunData:()=>({outputs:[{dims:s,dataType:l}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:d}),getShaderSource:t=>{let i=X(`data`,e[0].dataType,e[0].dims.length),o=X(`inputIndices`,e[1].dataType,e[1].dims.length),c=X(`scales`,e[2].dataType,e[2].dims.length),d=e.length>3?X(`zeroPoint`,e[3].dataType,e[3].dims.length):void 0,f=Z(`output`,l,s.length),p=[i,o,c];return d&&p.push(d),`
        ${t.registerUniforms([{name:`output_size`,type:`u32`},{name:`quantize_axis`,type:`u32`},{name:`gather_axis`,type:`u32`},{name:`block_size`,type:`u32`}]).declareVariables(...p,f)}
        ${t.mainStart()}
        let output_indices = ${f.offsetToIndices(`global_idx`)};
        var indices_indices = ${o.type.indices}(0);
        ${r.length>1?`
          for (var i: u32 = 0; i < ${r.length}; i++) {
            let index = ${f.indicesGet(`output_indices`,`uniforms.gather_axis + i`)};
            ${o.indicesSet(`indices_indices`,`i`,`index`)};
          }`:`indices_indices = ${f.indicesGet(`output_indices`,`uniforms.gather_axis`)};`};
        var data_indices = ${i.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${f.indicesGet(`output_indices`,`i`)};
          ${i.indicesSet(`data_indices`,`i`,`index`)};
        }
        var index_from_indices = ${o.getByIndices(`indices_indices`)};
        if (index_from_indices < 0) {
          index_from_indices += ${n[a]};
        }
        ${i.indicesSet(`data_indices`,`uniforms.gather_axis`,`u32(index_from_indices)`)};
        for (var i = uniforms.gather_axis + 1; i < ${s.length}; i++) {
          let index = ${f.indicesGet(`output_indices`,`i + ${r.length} - 1`)};
          ${i.indicesSet(`data_indices`,`i`,`index`)};
        }
        let data_offset = ${i.indicesToOffset(`data_indices`)};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${i.getByOffset(`data_offset / 8`)};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${u?`unpack4xI8`:`unpack4xU8`}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${c.indicesGet(`data_indices`,`uniforms.quantize_axis`)} / uniforms.block_size;
        ${c.indicesSet(`scale_indices`,`uniforms.quantize_axis`,`quantize_axis_index`)};
        var scale = ${c.getByIndices(`scale_indices`)};
        ${d?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${d.indicesToOffset(`zero_point_indices`)};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${d.getByOffset(`zero_point_offset / 8`)};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${u?`unpack4xI8`:`unpack4xU8`}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:`var zero_point = 0`};
        let dequantized_data = ${mn(l)}(quantized_data - zero_point) * scale;
        ${f.setByOffset(`global_idx`,`dequantized_data`)};
    }`}}},cs=(e,t)=>{let n=e.inputs;os(n,t),e.compute(ss(e.inputs,t))},ls=e=>q({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),ds,fs,ps,ms,hs=o(()=>{V(),G(),un(),Q(),ds=e=>{if(!e||e.length!==2)throw Error(`GatherElements requires 2 inputs.`);if(e[0].dims.length<1)throw Error(`GatherElements requires that the data input be rank >= 1.`);if(e[0].dims.length!==e[1].dims.length)throw Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},fs=(e,t)=>{let n=e[0].dims,r=e[0].dataType,i=n.length,a=e[1].dims,o=e[1].dataType,s=W.normalizeAxis(t.axis,i),c=n[s],l=a.slice(0),u=W.size(l),d=X(`input`,r,i),f=X(`indicesInput`,o,a.length),p=Z(`output`,r,l.length),m=[{type:12,data:u},{type:6,data:c},{type:12,data:s}];return m.push(...J(n,a,l)),{name:`GatherElements`,shaderCache:{inputDependencies:[`rank`,`rank`]},getRunData:()=>({outputs:[{dims:l,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:m}),getShaderSource:e=>`
      ${e.registerUniform(`outputSize`,`u32`).registerUniform(`axisDimLimit`,`i32`).registerUniform(`axis`,`u32`).declareVariables(d,f,p)}
      ${e.mainStart()}
      ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}

      let outputIndices = ${p.offsetToIndices(`global_idx`)};

      var idx = ${f.getByOffset(`global_idx`)};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${d.type.indices}(outputIndices);
      ${d.indicesSet(`inputIndices`,`uniforms.axis`,`u32(idx)`)};
      let value = ${d.getByIndices(`inputIndices`)};

      ${p.setByOffset(`global_idx`,`value`)};
  }`}},ps=e=>q({axis:e.axis}),ms=(e,t)=>{let n=e.inputs;ds(n),e.compute(fs(e.inputs,t))}}),gs,_s,vs,ys,bs=o(()=>{V(),G(),Q(),gs=e=>{if(!e)throw Error(`Input is missing`);if(e.length<2||e.length>3)throw Error(`Invaid input number.`);if(e.length===3&&e[2].dims.length>2)throw Error(`Invalid input shape of C`);if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw Error(`Input types are mismatched`)},_s=(e,t)=>{let n=e[0].dims.slice(),r=e[1].dims.slice(),[i,a,o]=jt.getShapeOfGemmResult(n,t.transA,r,t.transB,e.length===3?e[2].dims:void 0),s=[i,a];if(!s)throw Error(`Can't use gemm on the given tensors`);let c=Math.ceil(a/16),l=Math.ceil(i/16);W.size(s);let u=[{type:12,data:c},{type:12,data:i},{type:12,data:a},{type:12,data:o},{type:1,data:t.alpha},{type:1,data:t.beta}],d=[`type`,`type`];return e.length===3&&(u.push(...J(e[2].dims)),d.push(`rank`)),u.push(...J(s)),{name:`GemmShared`,shaderCache:{hint:`${t.cacheKey}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:c*l},programUniforms:u}),getShaderSource:n=>{let r=X(`a`,e[0].dataType,e[0].dims),i=X(`b`,e[1].dataType,e[1].dims),a=null,o=[r,i];e.length===3&&(a=X(`c`,e[2].dataType,e[2].dims.length),o.push(a));let c=Z(`output`,e[0].dataType,s.length);o.push(c);let l=[{name:`num_tile_n`,type:`u32`},{name:`M`,type:`u32`},{name:`N`,type:`u32`},{name:`K`,type:`u32`},{name:`alpha`,type:`f32`},{name:`beta`,type:`f32`}],u=``,d=``;t.transA&&t.transB?(d=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${r.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${i.type.value}(0);
      }
      `,u=`value += tile_a[k][local_id.y] * tile_b[local_id.x][k];`):t.transA&&!t.transB?(d=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${r.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${i.type.value}(0);
      }
      `,u=`value += tile_a[k][local_id.y] * tile_b[k][local_id.x];`):!t.transA&&t.transB?(d=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${r.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${i.type.value}(0);
      }
      `,u=`value += tile_a[local_id.y][k] * tile_b[local_id.x][k];`):!t.transA&&!t.transB&&(d=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${r.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${i.type.value}(0);
      }
      `,u=`value += tile_a[local_id.y][k] * tile_b[k][local_id.x];`);let f=t.alpha===1?``:`value *= uniforms.alpha;`;return`
  ${n.registerUniforms(l).declareVariables(...o)}
  var<workgroup> tile_a: array<array<${r.type.storage}, 16>, 16>;
  var<workgroup> tile_b: array<array<${i.type.storage}, 16>, 16>;
  ${n.mainStart([16,16,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * 16;
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * 16;
    let num_tiles = (uniforms.K - 1) / 16 + 1;
    var k_start = 0u;
    var value = ${c.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${d}
      k_start = k_start + 16;
      workgroupBarrier();

      for (var k: u32 = 0u; k < 16; k++) {
        ${u}
      }
      workgroupBarrier();
    }

    ${f}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${a==null?``:`let cOffset = ${a.broadcastedIndicesToOffset(`vec2(m, n)`,c)}; value += ${c.type.value}(uniforms.beta) * ${a.getByOffset(`cOffset`)};`}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`}}},vs=e=>({transA:e.transA,transB:e.transB,alpha:e.alpha,beta:e.beta,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}),ys=(e,t)=>{gs(e.inputs),e.compute(_s(e.inputs,t))}}),xs,Ss,Cs,ws,Ts,Es,Ds,Os,ks,As,js,Ms,Ns,Ps,Fs=o(()=>{V(),G(),un(),Q(),[xs,Ss,Cs,ws]=[0,1,2,3],Ts=e=>{if(e[0].dims.length!==4)throw Error(`only 4-D tensor is supported.`);if(e[0].dims.length!==e[1].dims.length)throw Error(`input dimensions must be equal to grid dimensions`);if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw Error(`grid batch size must match input batch size`)},Es=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,Ds=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,Os=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,ks=e=>`
  ${e.paddingMode===`reflection`?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:``}
`,As=(e,t,n)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${xs}] = batch;
     indices[${Ss}] = channel;`+(()=>{switch(n.paddingMode){case`zeros`:return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${Cs}] = u32(r);
            indices[${ws}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case`border`:return`
          indices[${Cs}] = u32(clamp(r, 0, H - 1));
          indices[${ws}] = u32(clamp(c, 0, W - 1));
        `;case`reflection`:return`
          indices[${Cs}] = gs_reflect(r, border[1], border[3]);
          indices[${ws}] = gs_reflect(c, border[0], border[2]);
        `;default:throw Error(`padding mode ${n.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices(`indices`)};
  }
`,js=(e,t,n)=>(()=>{switch(n.mode){case`nearest`:return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${xs}], indices[${Ss}], border);
        `;case`bilinear`:return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${xs}], indices[${Ss}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${xs}], indices[${Ss}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${xs}], indices[${Ss}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${xs}], indices[${Ss}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case`bicubic`:return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${xs}], indices[${Ss}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw Error(`mode ${n.mode} is not supported`)}})()+`${e.setByOffset(`global_idx`,`result`)}`,Ms=(e,t)=>{let n=X(`x`,e[0].dataType,e[0].dims.length),r=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],i=X(`grid`,e[1].dataType,r.length,2),a=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format===`NHWC`&&(a=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[xs,Ss,Cs,ws]=[0,3,1,2]);let o=Z(`output`,e[0].dataType,a.length),s=n.type.value,c=[{type:12,data:W.size(a)},...J(e[0].dims,r,a)];return{name:`GridSample`,shaderCache:{hint:`${t.cacheKey}`,inputDependencies:[`type`,`type`]},getRunData:e=>{let t=W.size(a);return{outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(t/64)},programUniforms:c}},getShaderSource:e=>`
  ${e.registerUniform(`output_size`,`u32`).declareVariables(n,i,o)}
  ${Es}
  ${Ds(s)}
  ${Os(t)}
  ${ks(t)}
  ${As(n,s,t)}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
      let H_in = i32(uniforms.x_shape[${Cs}]);
      let W_in = i32(uniforms.x_shape[${ws}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${o.offsetToIndices(`global_idx`)};
      var grid_indices = vec3<u32>(indices[${xs}], indices[${Cs}], indices[${ws}]);
      let nxy = ${i.getByIndices(`grid_indices`)};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${js(o,s,t)}
  }`}},Ns=(e,t)=>{Ts(e.inputs),e.compute(Ms(e.inputs,t))},Ps=e=>q({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),Is,Ls,Rs,zs,Bs,Vs,Hs,Us=o(()=>{V(),G(),un(),Zt(),Hr(),Q(),Nn(),Is=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,Ls=(e,t)=>{let n=e[0],r=Is(e,1),i=Is(e,2),a=Is(e,3),o=Is(e,4),s=Is(e,5),c=Is(e,6),l=Is(e,7);if(n.dims.length!==3&&n.dims.length!==5)throw Error(`Input query is expected to have 3 or 5 dimensions`);let u=n.dims[0],d=n.dims[1],f=n.dims.length===3?n.dims[2]:t.numHeads*n.dims[4],p=d,m=0,h=0,g=Math.floor(f/t.numHeads);if(c&&l&&W.size(c.dims)&&W.size(l.dims)){if(c.dims.length!==4)throw Error(`Input "past_key" is expected to have 4 dimensions`);if(c.dims[0]!==u||c.dims[1]!==t.numHeads||c.dims[3]!==g)throw Error(`Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)`);if(l.dims[0]!==u||l.dims[1]!==t.numHeads||l.dims[3]!==g)throw Error(`Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)`);if(c.dims[2]!==l.dims[2])throw Error(`Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)`);if(l.dims.length!==4)throw Error(`Input "past_value" is expected to have 4 dimensions`);m=c.dims[2],h=c.dims[2]}else if(c&&W.size(c.dims)||l&&W.size(l.dims))throw Error(`Input "past_key" and "past_value" shall be both present or both absent`);let _;if(r&&W.size(r.dims)>0){if(n.dims.length!==3)throw Error(`Input "query" is expected to have 3 dimensions when key is given`);if(r.dims.length<3||r.dims.length>5)throw Error(`Input "key" is expected to have 3, 4, or 5 dimensions`);if(n.dims[0]!==r.dims[0])throw Error(`Input "query" and "key" shall have same dim 0 (batch size)`);if(r.dims.length===3){if(r.dims[2]!==n.dims[2])throw Error(`Input "query" and "key" shall have same dim 2 (hidden_size)`);_=2,p=r.dims[1]}else if(r.dims.length===5){if(r.dims[2]!==t.numHeads||r.dims[3]!==2||r.dims[4]!==g)throw Error(`Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv`);if(i)throw Error(`Expect "value" be none when "key" has packed kv format.`);_=5,p=r.dims[1]}else{if(r.dims[1]!==t.numHeads||r.dims[3]!==g)throw Error(`Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key`);_=0,p=r.dims[2]}}else{if(n.dims.length!==5)throw Error(`Input "query" is expected to have 5 dimensions when key is empty`);if(n.dims[2]!==t.numHeads||n.dims[3]!==3)throw Error(`Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv`);_=3}if(a&&W.size(a.dims)>0){if(a.dims.length!==1)throw Error(`Input "bias" is expected to have 1 dimension`);if(r&&r.dims.length===5&&r.dims[3]===2)throw Error(`bias is not allowed for packed kv.`)}let v=m+p,y=0;if(o&&W.size(o.dims)>0){y=8;let e=o.dims;throw e.length===1?e[0]===u?y=1:e[0]===3*u+2&&(y=3):e.length===2&&e[0]===u&&e[1]===v&&(y=5),Error(y===8?`Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)`:`Mask not supported`)}let b=!1,x=f;if(i&&W.size(i.dims)>0){if(i.dims.length!==3&&i.dims.length!==4)throw Error(`Input "value" is expected to have 3 or 4 dimensions`);if(n.dims[0]!==i.dims[0])throw Error(`Input "query" and "value" shall have same dim 0 (batch_size)`);if(i.dims.length===3){if(p!==i.dims[1])throw Error(`Input "key" and "value" shall have the same dim 1 (kv_sequence_length)`);x=i.dims[2]}else{if(p!==i.dims[2])throw Error(`Input "key" and "value" shall have the same dim 2 (kv_sequence_length)`);x=i.dims[1]*i.dims[3],b=!0}}if(o&&W.size(o.dims)>0)throw Error(`Key padding mask is not supported`);if(s&&W.size(s.dims)>0){if(s.dims.length!==4)throw Error(`Input "attention_bias" is expected to have 4 dimensions`);if(s.dims[0]!==u||s.dims[1]!==t.numHeads||s.dims[2]!==d||s.dims[3]!==v)throw Error(`Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)`)}return{batchSize:u,sequenceLength:d,pastSequenceLength:m,kvSequenceLength:p,totalSequenceLength:v,maxSequenceLength:h,inputHiddenSize:0,hiddenSize:f,vHiddenSize:x,headSize:g,vHeadSize:Math.floor(x/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:y,scale:t.scale,broadcastResPosBias:!1,passPastInKv:b,qkvFormat:_}},Rs=e=>q({...e}),zs=q({perm:[0,2,1,3]}),Bs=(e,t,n,r,i,a,o)=>{let s=[r,i,a],c=W.size(s),l=[{type:12,data:c},{type:12,data:o},{type:12,data:a}];return e.compute({name:`MultiHeadAttentionAddBias`,shaderCache:{inputDependencies:[`type`,`type`]},getRunData:()=>({outputs:[{dims:s,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:l}),getShaderSource:e=>{let r=Z(`qkv_with_bias`,t.dataType,s),i=X(`qkv`,t.dataType,s),a=X(`bias`,n.dataType,s);return`
  ${e.registerUniforms([{name:`output_size`,type:`u32`},{name:`bias_offset`,type:`u32`},{name:`hidden_size`,type:`u32`}]).declareVariables(i,a,r)}
  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`}},{inputs:[t,n],outputs:[-1]})[0]},Vs=(e,t,n,r,i,a,o,s)=>{let c=a;if(o&&W.size(o.dims)>0){if(r===1)throw Error(`AddBiasReshape is not implemented. Please export your model with packed QKV or KV`);return c=Bs(e,a,o,t,r,n*i,s),c=c.reshape([t,r,n,i]),n===1||r===1?c:e.compute(An(c,zs.perm),{inputs:[c],outputs:[-1]})[0]}else return a.dims.length===3&&(c=a.reshape([t,r,n,i])),n===1||r===1?c:e.compute(An(c,zs.perm),{inputs:[c],outputs:[-1]})[0]},Hs=(e,t)=>{let n=Ls(e.inputs,t),r=e.inputs[0],i=Is(e.inputs,1),a=Is(e.inputs,2),o=Is(e.inputs,3),s=Is(e.inputs,4),c=Is(e.inputs,5),l=Is(e.inputs,6),u=Is(e.inputs,7);if(r.dims.length===5)throw Error(`Packed QKV is not implemented`);if(i?.dims.length===5)throw Error(`Packed KV is not implemented`);let d=i&&a&&i.dims.length===4&&a.dims.length===4,f=Vs(e,n.batchSize,n.numHeads,n.sequenceLength,n.headSize,r,o,0);if(d)return zr(e,f,i,a,s,void 0,l,u,c,n);if(!i||!a)throw Error(`key and value must be provided`);let p=Vs(e,n.batchSize,n.numHeads,n.kvSequenceLength,n.headSize,i,o,n.hiddenSize),m=Vs(e,n.batchSize,n.numHeads,n.kvSequenceLength,n.vHeadSize,a,o,2*n.hiddenSize);zr(e,f,p,m,s,void 0,l,u,c,n)}}),Ws,Gs,Ks,qs,Js,Ys,Xs,Zs=o(()=>{V(),G(),un(),Q(),Ws=e=>{if(!e||e.length<1)throw Error(`too few inputs`)},Gs=(e,t)=>{let n=[],r=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(e=>n.push(Number(e))),r=n.length),q({numOutputs:r,axis:t.axis,splitSizes:n})},Ks=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${Y(`uniforms.size_in_split_axis`,`i`,e)}) {
        return i;
    }
    }
    return ${e}u;
}`,qs=e=>{let t=e.length,n=[];for(let r=0;r<t;++r){let i=e[r].setByIndices(`indices`,`input[global_idx]`);t===1?n.push(i):r===0?n.push(`if (output_number == ${r}u) { ${i} }`):r===t-1?n.push(`else { ${i} }`):n.push(`else if (output_number == ${r}) { ${i} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${n.join(`
`)}
      }`},Js=(e,t)=>{let n=e[0].dims,r=W.size(n),i=e[0].dataType,a=W.normalizeAxis(t.axis,n.length),o=Array(t.numOutputs),s=X(`input`,i,n.length),c=Array(t.numOutputs),l=[],u=[],d=0,f=[{type:12,data:r}];for(let r=0;r<t.numOutputs;r++){d+=t.splitSizes[r],c[r]=d;let s=n.slice();s[a]=t.splitSizes[r],u.push(s),o[r]=Z(`output${r}`,i,s.length),l.push({dims:u[r],dataType:e[0].dataType})}return f.push({type:12,data:c},...J(n,...u)),{name:`Split`,shaderCache:{hint:t.cacheKey,inputDependencies:[`rank`]},getShaderSource:e=>`
  ${e.registerUniform(`input_size`,`u32`).registerUniform(`size_in_split_axis`,`u32`,c.length).declareVariables(s,...o)}
  ${Ks(c.length)}
  ${qs(o)}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.input_size`)}

    var indices = ${s.offsetToIndices(`global_idx`)};
    var index = ${s.indicesGet(`indices`,a)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${Y(`uniforms.size_in_split_axis`,`output_number - 1u`,c.length)};
      ${s.indicesSet(`indices`,a,`index`)};
    }
    writeBufferData(output_number, indices, global_idx);
  }`,getRunData:()=>({outputs:l,dispatchGroup:{x:Math.ceil(r/64)},programUniforms:f})}},Ys=(e,t)=>{Ws(e.inputs);let n=e.inputs.length===1?t:Gs(e.inputs,t);e.compute(Js(e.inputs,n),{inputs:[0]})},Xs=e=>{let t=e.axis,n=e.splitSizes,r=e.numOutputs<0?n.length:e.numOutputs;if(r!==n.length)throw Error(`numOutputs and splitSizes length must be equal`);return q({axis:t,numOutputs:r,splitSizes:n})}}),Qs,$s,ec,tc=o(()=>{V(),G(),un(),Q(),Qs=(e,t)=>{let[n,r,i,a]=e,{numHeads:o,rotaryEmbeddingDim:s}=t;if(n.dims.length!==3&&n.dims.length!==4)throw Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${n.dims.length}`);if(!W.areEqual(r.dims,[])&&!W.areEqual(r.dims,[1])&&r.dims.length!==2)throw Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${r.dims.length}`);if(i.dims.length!==2)throw Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${i.dims.length}`);if(a.dims.length!==2)throw Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(!W.areEqual(i.dims,a.dims))throw Error(`Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape`);if(s>0&&o===0)throw Error(`num_heads must be provided if rotary_embedding_dim is specified`);let c=n.dims[0],l=n.dims[n.dims.length-2],u=i.dims[0],d=W.sizeFromDimension(n.dims,1)/l,f=s===0?i.dims[1]*2:d/o;if(s>f)throw Error(`rotary_embedding_dim must be less than or equal to head_size`);if(r.dims.length===2){if(c!==r.dims[0])throw Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${r.dims[0]}`);if(l!==r.dims[1])throw Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${r.dims[1]}`)}if(l>u)throw Error(`Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported`);if(f/2!==i.dims[1]&&s/2!==i.dims[1])throw Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${i.dims[1]}`)},$s=(e,t)=>{let{interleaved:n,numHeads:r,rotaryEmbeddingDim:i,scale:a}=t,o=e[0].dims[0],s=W.sizeFromDimension(e[0].dims,1),c=e[0].dims[e[0].dims.length-2],l=s/c,u=e[2].dims[1],d=i===0?u*2:l/r,f=[o,c,l/d,d-u],p=W.computeStrides(f),m=[{type:1,data:a},{type:12,data:f},{type:12,data:p},...e[0].dims.length===3?Array({type:12,data:[s,l,d,1]}):[],...e[0].dims.length===4?Array({type:12,data:[s,d,c*d,1]}):[],...J(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)];return{name:`RotaryEmbedding`,shaderCache:{hint:q({interleaved:n}).cacheKey,inputDependencies:[`rank`,`rank`,`rank`,`rank`]},getShaderSource:t=>{let r=X(`input`,e[0].dataType,e[0].dims.length),i=X(`position_ids`,e[1].dataType,e[1].dims.length),a=X(`cos_cache`,e[2].dataType,e[2].dims.length),o=X(`sin_cache`,e[3].dataType,e[3].dims.length),s=Z(`output`,e[0].dataType,e[0].dims.length);return t.registerUniforms([{name:`scale`,type:`f32`},{name:`global_shape`,type:`u32`,length:f.length},{name:`global_strides`,type:`u32`,length:p.length},{name:`input_output_strides`,type:`u32`,length:p.length}]),`
        ${t.declareVariables(r,i,a,o,s)}

        ${t.mainStart(dn)}
          let half_rotary_emb_dim = uniforms.${a.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${t.guardAgainstOutOfBoundsWorkgroupSizes(`size`)}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${i.broadcastedIndicesToOffset(`bsnh.xy`,Z(``,i.type.tensor,2))};
            let position_id =
                u32(${i.getByOffset(`position_ids_idx`)}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${n});
            let j = i + select(half_rotary_emb_dim, 1, ${n});
            let re = ${r.getByOffset(`i`)} * ${a.get(`position_id`,`bsnh[3]`)} -
                ${r.getByOffset(`j`)} * ${o.get(`position_id`,`bsnh[3]`)};
            ${s.setByOffset(`i`,`re`)}
            let im = ${r.getByOffset(`i`)} * ${o.get(`position_id`,`bsnh[3]`)} +
                ${r.getByOffset(`j`)} * ${a.get(`position_id`,`bsnh[3]`)};
            ${s.setByOffset(`j`,`im`)}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${s.setByOffset(`k`,r.getByOffset(`k`))}
          }
        }`},getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(W.size(f)/dn)},programUniforms:m})}},ec=(e,t)=>{Qs(e.inputs,t),e.compute($s(e.inputs,t))}}),nc,rc,ic,ac,oc,sc=o(()=>{un(),V(),Hr(),Us(),Zs(),Nn(),tc(),Q(),nc=(e,t)=>{if(t.doRotary&&e.length<=7)throw Error(`cos_cache and sin_cache inputs are required if do_rotary is specified`);let n=e[0],r=e[1],i=e[2],a=e[3],o=e[4];if(t.doRotary!==0&&e.length<=7)throw Error(`cos_cast and sin_cache are expected if do_rotary attribute is non-zero`);if(t.localWindowSize!==-1)throw Error(`Local attention is not supported`);if(t.softcap!==0)throw Error(`Softcap is not supported`);if(t.rotaryInterleaved!==0)throw Error(`Rotary interleaved is not supported`);if(t.smoothSoftmax)throw Error(`Smooth softmax is not supported`);if(n.dims.length!==3&&n.dims.length!==5)throw Error(`Input query is expected to have 3 or 5 dimensions`);let s=n.dims[0],c=n.dims[1],l=n.dims.length===3?n.dims[2]:t.numHeads*n.dims[4],u=c,d=0,f=!r||r.dims.length===0,p=Math.floor(f?l/(t.numHeads+2*t.kvNumHeads):l/t.numHeads);f&&(l=p*t.numHeads);let m=a&&a.dims.length!==0,h=o&&o.dims.length!==0;if(m&&a.dims.length===4&&a.dims[0]===s&&a.dims[1]!==t.kvNumHeads&&a.dims[2]===t.kvNumHeads&&a.dims[3]===p)throw Error(`BSNH pastKey/pastValue is not supported`);if(m&&h){if(a.dims.length!==4)throw Error(`Input "past_key" is expected to have 4 dimensions`);if(o.dims.length!==4)throw Error(`Input "past_value" is expected to have 4 dimensions`);d=a.dims[2]}else if(m||h)throw Error(`Input "past_key" and "past_value" shall be both present or both absent`);let g=1;if(r&&r.dims.length>0){if(n.dims.length!==3)throw Error(`Input "query" is expected to have 3 dimensions when key is given`);if(r.dims.length<3||r.dims.length>5)throw Error(`Input "key" is expected to have 3, 4, or 5 dimensions`);if(n.dims[0]!==r.dims[0])throw Error(`Input "query" and "key" shall have same dim 0 (batch size)`);if(r.dims.length===3){if(n.dims[2]%r.dims[2]!==0)throw Error(`Dimension 2 of "query" should be a multiple of "key"`);u=r.dims[1]}else if(r.dims.length===5){if(r.dims[2]!==t.numHeads||r.dims[3]!==2||r.dims[4]!==p)throw Error(`Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv`);if(i)throw Error(`Expect "value" be none when "key" has packed kv format.`);u=r.dims[1]}else{if(r.dims[1]!==t.numHeads||r.dims[3]!==p)throw Error(`Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key`);u=r.dims[2]}}else{if(n.dims.length!==3&&n.dims.length!==5)throw Error(`Input "query" is expected to have 3 or 5 dimensions when key is empty`);if(n.dims.length===5&&(n.dims[2]!==t.numHeads||n.dims[3]!==3))throw Error(`Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv`);g=3}let _=!1,v=t.kvNumHeads?p*t.kvNumHeads:l;if(i&&i.dims.length>0){if(i.dims.length!==3&&i.dims.length!==4)throw Error(`Input "value" is expected to have 3 or 4 dimensions`);if(n.dims[0]!==i.dims[0])throw Error(`Input "query" and "value" shall have same dim 0 (batch_size)`);if(i.dims.length===3){if(u!==i.dims[1])throw Error(`Input "key" and "value" shall have the same dim 1 (kv_sequence_length)`);v=i.dims[2]}else{if(u!==i.dims[2])throw Error(`Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)`);v=i.dims[1]*i.dims[3],_=!0}}let y=e.length>4?e[5]:void 0;if(y){if(y.dims.length===0)throw Error(`seqlens_k must be at least 1D, got scalar.`);let e=y.dims.reduce((e,t)=>e*t,1);if(e!==s)throw Error(`seqlens_k must have batch_size (${s}) elements, got ${e}.`);for(let e=0;e<y.dims.length;e++)if(y.dims[e]!==1&&y.dims[e]!==s)throw Error(`seqlens_k has unexpected shape. Each dimension must be 1 or batch_size (${s}), got dims[${e}] = ${y.dims[e]}.`)}return{batchSize:s,sequenceLength:c,pastSequenceLength:d,kvSequenceLength:u,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:l,vHiddenSize:v,headSize:p,vHeadSize:Math.floor(v/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:0,scale:t.scale,broadcastResPosBias:!1,passPastInKv:_,qkvFormat:g}},rc=q({perm:[0,2,1,3]}),ic=(e,t,n)=>{let r=t,i=n.kvNumHeads;return t.dims.length===3&&n.kvSequenceLength!==0&&(r=t.reshape([n.batchSize,n.kvSequenceLength,i,n.headSize]),r=e.compute(An(r,rc.perm),{inputs:[r],outputs:[-1]})[0]),r},ac=(e,t,n,r)=>{let i=[`type`,`type`],a=[e*t],o=e*t,s=[{type:12,data:o},{type:12,data:t},{type:12,data:e}];return{name:`GeneratePositionIds`,shaderCache:{hint:`${e};${t}`,inputDependencies:i},getRunData:()=>({outputs:[{dims:a,dataType:7}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:s}),getShaderSource:e=>{let t=X(`seq_lens`,n.dataType,n.dims),i=X(`total_seq_lens`,r.dataType,r.dims),o=Z(`pos_ids`,7,a);return`
  ${e.registerUniforms([{name:`output_size`,type:`u32`},{name:`sequence_length`,type:`u32`},{name:`batch_size`,type:`u32`}]).declareVariables(t,i,o)}
  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
    let total_sequence_length = u32(${i.getByOffset(`0`)});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${t.getByOffset(`batch_idx`)};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${o.setByOffset(`global_idx`,`pos_id`)}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${o.setByOffset(`global_idx`,`pos_id`)}
    } else if (global_idx < uniforms.batch_size) {
      ${o.setByOffset(`global_idx`,`seqlen`)}
    };
  }
  `}}},oc=(e,t)=>{let n=nc(e.inputs,t);if(e.inputs[0].dims.length===5)throw Error(`Packed QKV is not implemented`);if(e.inputs[1]?.dims.length===5)throw Error(`Packed KV is not implemented`);let r=e.inputs[0],i=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,a=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,o=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,s=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,c=e.inputs.length>4?e.inputs[5]:void 0,l=e.inputs.length>5?e.inputs[6]:void 0,u=n.kvNumHeads?n.kvNumHeads:n.numHeads,d=q({axis:2,numOutputs:3,splitSizes:[n.numHeads*n.headSize,u*n.headSize,u*n.headSize]}),[f,p,m]=!i&&!a?e.compute(Js([r],d),{inputs:[r],outputs:[-1,-1,-1]}):[r,i,a],h,g;if(t.doRotary){let r=e.compute(ac(n.batchSize,n.sequenceLength,c,l),{inputs:[c,l],outputs:[-1]})[0],i=e.inputs[7],a=e.inputs[8],o=q({interleaved:t.rotaryInterleaved!==0,numHeads:n.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),s=[f,r,i,a],u=[-1];h=e.compute($s(s,o),{inputs:s,outputs:u})[0],s.splice(0,1,p);let d=q({interleaved:t.rotaryInterleaved!==0,numHeads:n.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});g=e.compute($s(s,d),{inputs:s,outputs:u})[0]}let _=Vs(e,n.batchSize,n.numHeads,n.sequenceLength,n.headSize,t.doRotary?h:f,void 0,0),v=ic(e,t.doRotary?g:p,n),y=ic(e,m,n);zr(e,_,v,y,void 0,void 0,o,s,void 0,n,c,l)}}),cc,lc,uc,dc,fc=o(()=>{V(),G(),Nn(),Q(),cc=(e,t,n,r,i,a,o,s)=>{let c=hn(a),l=c===1?`f32`:`vec${c}f`,u=c===1?`vec2f`:`mat2x${c}f`,d=i*o,f=64;d===1&&(f=256);let p=[i,o,a/c],m=[i,o,2],h=[`rank`,`type`,`type`],g=[];return g.push(...J(p,m)),e.compute({name:`InstanceNormComputeChannelScaleShift`,shaderCache:{hint:`${c};${s};${f}`,inputDependencies:h},getRunData:()=>({outputs:[{dims:m,dataType:1}],dispatchGroup:{x:d},programUniforms:g}),getShaderSource:e=>{let i=X(`x`,t.dataType,3,c),a=[i,X(`scale`,n.dataType,n.dims),X(`bias`,r.dataType,r.dims),Z(`output`,1,3,2)];return`
  var<workgroup> workgroup_shared : array<${u}, ${f}>;
  const workgroup_size = ${f}u;
  ${e.declareVariables(...a)}
  ${e.mainStart(f)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${l}(0);
    var squared_sum = ${l}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${l}(${i.get(`batch`,`channel`,`h`)});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${u}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${vn(`workgroup_shared[0][0]`,c)} / f32(hight * ${c});
      let squared_sum_final = ${vn(`workgroup_shared[0][1]`,c)} / f32(hight * ${c});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${s}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`}},{inputs:[t,n,r],outputs:[-1]})[0]},lc=(e,t,n)=>{let r=t[0].dims,i=r,a=r[0],o=r[1],s=W.sizeFromDimension(r,2),c=hn(s),l=W.size(i)/c,u=cc(e,t[0],t[1],t[2],a,s,o,n.epsilon),d=[a,o,s/c],f=[a,o];e.compute({name:`InstanceNormalization`,shaderCache:{hint:`${c}`,inputDependencies:[`type`,`none`]},getRunData:()=>({outputs:[{dims:i,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:[{type:12,data:l},...J(d,f,d)]}),getShaderSource:e=>{let n=X(`x`,t[0].dataType,d.length,c),r=X(`scale_shift`,1,f.length,2),i=Z(`output`,t[0].dataType,d.length,c),a=[n,r,i];return`
  ${e.registerUniform(`output_size`,`u32`).declareVariables(...a)}
  ${e.mainStart()}
  ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
      let outputIndices = ${i.offsetToIndices(`global_idx`)};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${r.getByIndices(`vec2<u32>(batch, channel)`)};
      let value = ${n.getByOffset(`global_idx`)} * ${i.type.value}(scale_shift.x) + ${i.type.value}(scale_shift.y);
      ${i.setByOffset(`global_idx`,`value`)};
  }`}},{inputs:[t[0],u]})},uc=(e,t,n)=>{let r=t[0].dims,i=r,a=r[0],o=r[r.length-1],s=W.sizeFromDimension(r,1)/o,c=hn(o),l=W.size(i)/c,u=[{type:12,data:s},{type:12,data:Math.floor(o/c)}],d=[`type`,`type`],f=!1,p=[0,r.length-1];for(let e=0;e<r.length-2;e++)f||=r[e+1]!==1,p.push(e+1);f&&=r[r.length-1]!==1;let m=f?e.compute(An(e.inputs[0],p),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:r.length},(e,t)=>r[p[t]])),h=cc(e,m,t[1],t[2],a,s,o,n.epsilon);e.compute({name:`InstanceNormalizationNHWC`,shaderCache:{hint:`${c}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:i,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:u}),getShaderSource:e=>{let n=pn(t[0].dataType),r=c===1?`vec2f`:`mat${c}x2f`,a=e=>{let t=e===0?`x`:`y`,r=c===1?`f32`:`vec${c}f`;switch(c){case 1:return`${n}(${r}(scale.${t}))`;case 2:return`vec2<${n}>(${r}(scale[0].${t}, scale[1].${t}))`;case 4:return`vec4<${n}>(${r}(scale[0].${t}, scale[1].${t}, scale[2].${t}, scale[3].${t}))`;default:throw Error(`Not supported compoents ${c}`)}},o=X(`input`,t[0].dataType,t[0].dims,c),s=Z(`output`,t[0].dataType,i,c);return`
  @group(0) @binding(0) var<storage, read> input : array<${o.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${r}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${s.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${e.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${a(0)}, ${a(1)});
  }`}},{inputs:[t[0],h]})},dc=(e,t)=>{t.format===`NHWC`?uc(e,e.inputs,t):lc(e,e.inputs,t)}}),pc,mc,hc,gc=o(()=>{V(),G(),Q(),pc=e=>{if(!e||e.length<2)throw Error(`layerNorm requires at least 2 inputs.`)},mc=(e,t,n)=>{let r=t.simplified,i=e[0].dims,a=e[1],o=!r&&e[2],s=i,c=W.normalizeAxis(t.axis,i.length),l=W.sizeToDimension(i,c),u=W.sizeFromDimension(i,c),d=W.size(a.dims),f=o?W.size(o.dims):0;if(d!==u||o&&f!==u)throw Error(`Size of X.shape()[axis:] == ${u}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${d} and bias size of ${f}`);let p=[];for(let e=0;e<i.length;++e)e<c?p.push(i[e]):p.push(1);let m=hn(u),h=[`type`,`type`],g=[{type:12,data:l},{type:1,data:u},{type:12,data:Math.floor(u/m)},{type:1,data:t.epsilon}];o&&h.push(`type`);let _=n>1,v=n>2,y=t=>{let n=pn(e[0].dataType),i=[X(`x`,e[0].dataType,e[0].dims,m),X(`scale`,a.dataType,a.dims,m)];return o&&i.push(X(`bias`,o.dataType,o.dims,m)),i.push(Z(`output`,e[0].dataType,s,m)),_&&i.push(Z(`mean_data_output`,1,p)),v&&i.push(Z(`inv_std_output`,1,p)),`
  ${t.registerUniforms([{name:`norm_count`,type:`u32`},{name:`norm_size`,type:`f32`},{name:`norm_size_vectorized`,type:`u32`},{name:`epsilon`,type:`f32`}]).declareVariables(...i)}
  ${t.mainStart()}
    ${t.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.norm_count`)}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${gn(`f32`,m)};
    var mean_square_vector = ${gn(`f32`,m)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${_n(n,m,`x[h + offset]`)};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${vn(`mean_vector`,m)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${vn(`mean_square_vector`,m)} / uniforms.norm_size ${r?``:`- mean * mean`} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${_n(n,m,`x[j + offset]`)};
      let f32scale = ${_n(n,m,`scale[j]`)};
      output[j + offset] = ${i[0].type.value}((f32input ${r?``:`- mean`}) * inv_std_dev * f32scale
        ${o?`+ ${_n(n,m,`bias[j]`)}`:``}
      );
    }

    ${_?`mean_data_output[global_idx] = mean`:``};
    ${v?`inv_std_output[global_idx] = inv_std_dev`:``};
  }`},b=[{dims:s,dataType:e[0].dataType}];return _&&b.push({dims:p,dataType:1}),v&&b.push({dims:p,dataType:1}),{name:`LayerNormalization`,shaderCache:{hint:`${m};${n};${r}`,inputDependencies:h},getRunData:()=>({outputs:b,dispatchGroup:{x:Math.ceil(l/64)},programUniforms:g}),getShaderSource:y}},hc=(e,t)=>{pc(e.inputs),e.compute(mc(e.inputs,t,e.outputCount))}}),_c,vc,yc=o(()=>{G(),Ea(),Fa(),_c=e=>{if(!e||e.length!==2)throw Error(`MatMul requires 2 inputs.`);if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw Error(`shared dimension does not match.`)},vc=e=>{_c(e.inputs);let t=kt.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw Error(`Can't use matmul on the given tensors`);let n=t[t.length-1],r=e.inputs[0].dims[e.inputs[0].dims.length-1];if(n<8&&r<8)e.compute(Ta(e.inputs,{activation:``},t));else{let i=t[t.length-2],a=W.size(e.inputs[0].dims.slice(0,-2)),o=W.size(e.inputs[1].dims.slice(0,-2));if(a!==1&&i===1&&o===1){let i=e.inputs[0].reshape([1,a,r]),o=e.inputs[1].reshape([1,r,n]),s=[1,a,n],c=[i,o];e.compute(Pa(c,{activation:``},t,s),{inputs:c})}else e.compute(Pa(e.inputs,{activation:``},t))}}}),bc,xc,Sc,Cc,wc,Tc=o(()=>{V(),G(),un(),Q(),bc=(e,t)=>{if(e.length<3||e.length>4)throw Error(`MatMulNBits requires 3 or 4 inputs`);let n=e[0],r=n.dims.length;if(n.dims[r-1]!==t.k)throw Error(`The last dim of input shape does not match the k value`);let i=Math.floor((t.k+t.blockSize-1)/t.blockSize),a=t.blockSize/8*t.bits,o=e[1];if(!W.areEqual(o.dims,[t.n,i,a]))throw Error(`The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize`);let s=e[2].dims;if(W.size(s)!==t.n*i)throw Error(`scales input size error.`);if(e.length===4){let n=e[3].dims,r=t.n*(t.bits===8?i:Math.floor((i*t.bits+7)/8));if(W.size(n)!==r)throw Error(`zeroPoints input size error.`)}},xc=(e,t)=>{let n=e[0].dims,r=n.length,i=n[r-2],a=t.k,o=t.n,s=n.slice(0,r-2),c=W.size(s),l=e[1].dims[2]/4,u=e[0].dataType,d=hn(t.k),f=hn(l),p=hn(o),m=s.concat([i,o]),h=i>1&&o/p%2==0?2:1,g=W.size(m)/p/h,_=[],v=[c,i,a/d],y=W.convertShape(e[1].dims).slice();y.splice(-1,1,l/f),_.push(...J(v)),_.push(...J(y)),_.push(...J(e[2].dims)),e.length===4&&_.push(...J(W.convertShape(e[3].dims)));let b=[c,i,o/p];return _.push(...J(b)),{name:`MatMulNBits`,shaderCache:{hint:`${t.blockSize};${t.bits};${d};${f};${p};${h};64`,inputDependencies:Array(e.length).fill(`rank`)},getRunData:()=>({outputs:[{dims:m,dataType:u}],dispatchGroup:{x:g},programUniforms:_}),getShaderSource:n=>{let r=v.length,i=X(`a`,e[0].dataType,r,d),a=X(`b`,12,y.length,f),o=X(`scales`,e[2].dataType,e[2].dims.length),s=[i,a,o],c=e.length===4?X(`zero_points`,12,e[3].dims.length):void 0;c&&s.push(c);let u=b.length,m=Z(`output`,e[0].dataType,u,p),g=pn(e[0].dataType),_=(()=>{switch(d){case 1:return`array<${g}, 8>`;case 2:return`mat4x2<${g}>`;case 4:return`mat2x4<${g}>`;default:throw Error(`${d}-component is not supported.`)}})(),x=Math.floor(32/t.bits),S=Math.floor(x/8),C=()=>{let e=``;for(let n=0;n<S;n++){let r=n*t.bits*4,a=r+t.bits;e+=`
          // reuse a data (pass ${n})
            var input_offset${n>0?n:``} = ${n===0?i.indicesToOffset(`${i.type.indices}(batch, row, word_offset)`):`input_offset`};
            var a_data${n>0?n:``}: ${_};
            for (var j${n>0?n:``}: u32 = 0; j${n>0?n:``} < ${8/d}; j${n>0?n:``}++) {
              a_data${n>0?n:``}[j${n>0?n:``}] = ${i.getByOffset(`input_offset${n>0?n:``}`)};
              input_offset${n>0?n:``}++;
            }
          `;for(let i=0;i<p*h;i++)e+=`
            b_value = ${f===1?`b${i}_data`:`b${i}_data[i]`};
            ${t.bits===2?`{
              let half_word = b_value >> ${n*16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }`:`b_value_lower = unpack4xU8((b_value >> ${r}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${a}u) & b_mask);`}
            b_quantized_values = ${_}(${Array.from({length:4},(e,t)=>`${g}(b_value_lower[${t}]), ${g}(b_value_upper[${t}])`).join(`, `)});
            b_dequantized_values = ${d===1?`${_}(${Array.from({length:8},(e,t)=>`(b_quantized_values[${t}] - ${c?`zero_point${i}`:`zero_point`}) * scale${i}`).join(`, `)});`:`(b_quantized_values - ${_}(${Array(8).fill(`${c?`zero_point${i}`:`zero_point`}`).join(`,`)})) * scale${i};`};
            workgroup_shared[local_id.x * ${h} + ${Math.floor(i/p)}]${p>1?`[${i%p}]`:``} += ${Array.from({length:8/d},(e,t)=>`${d===1?`a_data${n>0?n:``}[${t}] * b_dequantized_values[${t}]`:`dot(a_data${n>0?n:``}[${t}], b_dequantized_values[${t}])`}`).join(` + `)};
          `}return e},w=()=>{let e=`
            var col_index = col * ${p};
            ${c?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (nBlocksPerCol + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is ${2**(t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${g}(${(2**(t.bits-1)).toFixed(1)});`}
            `;for(let n=0;n<p*h;n++)e+=`
            let scale${n} = ${o.getByOffset(`col_index * nBlocksPerCol + block`)};
            ${c?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            zero_point_word = ${c.getByOffset(`zero_point_word_index`)} >> zero_point_bits_offset;
            let zero_point${n} = ${g}((zero_point_word) & ${t.bits===2?`0x3u`:`0xFu`});`:``}
            col_index += 1;`;return e},T=()=>{let e=`col_index = col * ${p};`;for(let t=0;t<p*h;t++)e+=`
            let b${t}_data = ${a.getByIndices(`${a.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return e+=`
            var b_value: u32;
            let b_mask: u32 = ${t.bits===2?`0x03030303u`:`0x0F0F0F0Fu`};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${_};
            var b_dequantized_values: ${_};`,e};return`
        var<workgroup> workgroup_shared: array<${m.type.value}, ${h*64}>;
        ${n.declareVariables(...s,m)}
        ${n.mainStart([64,1,1])}
          let output_indices = ${m.offsetToIndices(`(global_idx / 64) * ${h}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += 64) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/d};
            ${w()}
            for (var word: u32 = 0; word < ${l}; word += ${f}) {
              ${T()}
              for (var i: u32 = 0; i < ${f}; i++) {
                ${C()}
                word_offset += ${x/d};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${h}) {
            var output_value: ${m.type.value} = ${m.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < 64u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${h};
            }
            ${m.setByIndices(`${m.type.indices}(batch, row, col + local_id.x)`,`output_value`)};
          }
        }`}}},Sc=(e,t)=>{let n=e[0].dims,r=n.length,i=n[r-2],a=t.k,o=t.n,s=n.slice(0,r-2),c=W.size(s),l=e[1].dims[2]/4,u=e[0].dataType,d=hn(t.k),f=hn(l),p=s.concat([i,o]),m=o%8==0?8:o%4==0?4:1,h=128/m,g=Math.floor(32/t.bits),_=h*f*g,v=_/d,y=_/t.blockSize,b=W.size(p)/m,x=[],S=[c,i,a/d],C=W.convertShape(e[1].dims).slice();C.splice(-1,1,l/f),x.push(...J(S)),x.push(...J(C)),x.push(...J(e[2].dims)),e.length===4&&x.push(...J(W.convertShape(e[3].dims)));let w=[c,i,o];return x.push(...J(w)),{name:`BlockwiseMatMulNBits32`,shaderCache:{hint:`${t.blockSize};${d};${f};${h};${m}`,inputDependencies:Array(e.length).fill(`rank`)},getRunData:()=>({outputs:[{dims:p,dataType:u}],dispatchGroup:{x:b},programUniforms:x}),getShaderSource:n=>{let r=S.length,i=X(`a`,e[0].dataType,r,d),a=X(`b`,12,C.length,f),o=X(`scales`,e[2].dataType,e[2].dims.length),s=[i,a,o],c=e.length===4?X(`zero_points`,12,e[3].dims.length):void 0;c&&s.push(c);let l=w.length,u=Z(`output`,e[0].dataType,l),p=pn(e[0].dataType),_=()=>{switch(d){case 1:return`
          let a_data0 = vec4<${p}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${p}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${p}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${p}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw Error(`${d}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${i.type.value}, ${v}>;
        var<workgroup> inter_results: array<array<${u.type.value}, ${h}>, ${m}>;
        ${n.declareVariables(...s,u)}
        ${n.mainStart([h,m,1])}
          let output_indices = ${u.offsetToIndices(`workgroup_index * ${m}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${y} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${v};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${v}; a_offset += 128)
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${i.getByIndices(`${i.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${i.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${y} + local_id.x;
            ${c?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            let zero_point_word = ${c.getByOffset(`zero_point_word_index`)} >> zero_point_bits_offset;
            let zero_point = ${p}((zero_point_word) & ${t.bits===2?`0x3u`:`0xFu`});`:`
            // The default zero point is ${2**(t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${p}(${(2**(t.bits-1)).toFixed(1)});`}
            let scale = ${o.getByOffset(`b_row * n_blocks_per_col + block`)};
            let b_data = ${a.getByIndices(`${a.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/d};
            for (var i: u32 = 0; i < ${f}; i++) {
              let b_value = ${f===1?`b_data`:`b_data[i]`};
              ${(()=>{let e=Math.floor(g/8),n=``;for(let r=0;r<e;r++){let e=r*t.bits*4,i=e+t.bits;n+=`
              ${_()}
              {${t.bits===2?`
                let half_word = b_value >> ${r*16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);`:`
                let b_value_lower = unpack4xU8((b_value >> ${e}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${i}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${p}>(${Array.from({length:4},(e,t)=>`${p}(b_value_lower[${t}]), ${p}(b_value_upper[${t}])`).join(`, `)});
                let b_dequantized_values = (b_quantized_values - mat2x4<${p}>(${Array(8).fill(`zero_point`).join(`,`)})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(e,t)=>`${`dot(a_data${t}, b_dequantized_values[${t}])`}`).join(` + `)};
              }
              word_offset += ${8/d};`}return n})()}
            }
            workgroupBarrier();
          }

          if (local_idx < ${m}) {
            var output_value: ${u.type.value} = ${u.type.value}(0);
            for (var b = 0u; b < ${h}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${u.setByIndices(`${u.type.indices}(batch, row, col + local_idx)`,`output_value`)}
            }
          }
        }`}}},Cc=(e,t)=>{bc(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor(`intel`)&&e.adapterInfo.isArchitecture(`gen-12lp`)?e.compute(Sc(e.inputs,t)):e.compute(xc(e.inputs,t))},wc=e=>q(e)}),Ec,Dc,Oc,kc,Ac,jc,Mc,Nc,Pc,Fc=o(()=>{V(),G(),Q(),Ec=e=>{if(!e||e.length<1)throw Error(`Too few inputs`);if(e[0].dataType!==1&&e[0].dataType!==10)throw Error(`Input type must be float or float16.`);if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw Error(`The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].`)}},Dc=(e,t,n)=>{let r=``;for(let i=t-1;i>=0;--i)r+=`
            k = i32(${e.indicesGet(`indices`,i)}) - ${Y(`uniforms.pads`,i,n)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${Y(`uniforms.x_shape`,i,t)})) {
              break;
            }
            offset += k * i32(${Y(`uniforms.x_strides`,i,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${r}
            value = x[offset];
          }
      `},Oc=(e,t,n)=>{let r=``;for(let i=t-1;i>=0;--i)r+=`
                k = i32(${e.indicesGet(`indices`,i)}) - ${Y(`uniforms.pads`,i,n)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${Y(`uniforms.x_shape`,i,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${Y(`uniforms.x_shape`,i,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${Y(`uniforms.x_strides`,i,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${r}
              value = x[offset];
          `},kc=(e,t,n)=>{let r=``;for(let i=t-1;i>=0;--i)r+=`
                k = i32(${e.indicesGet(`indices`,i)}) - ${Y(`uniforms.pads`,i,n)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${Y(`uniforms.x_shape`,i,t)})) {
                  k = i32(${Y(`uniforms.x_shape`,i,t)}) - 1;
                }
                offset += k * i32(${Y(`uniforms.x_strides`,i,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${r}
              value = x[offset];
          `},Ac=(e,t,n)=>{let r=``;for(let i=t-1;i>=0;--i)r+=`
                k = i32(${e.indicesGet(`indices`,i)}) - ${Y(`uniforms.pads`,i,n)};
                if (k < 0)  {
                  k += i32(${Y(`uniforms.x_shape`,i,t)}]);
                }
                if (k >= i32(${Y(`uniforms.x_shape`,i,t)})) {
                  k -= i32(${Y(`uniforms.x_shape`,i,t)});
                }
                offset += k * i32(${Y(`uniforms.x_strides`,i,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${r}
              value = x[offset];
          `},jc=(e,t,n)=>{switch(n.mode){case 0:return Dc(e,t,n.pads.length);case 1:return Oc(e,t,n.pads.length);case 2:return kc(e,t,n.pads.length);case 3:return Ac(e,t,n.pads.length);default:throw Error(`Invalid mode`)}},Mc=(e,t)=>{let n=W.padShape(e[0].dims.slice(),t.pads),r=e[0].dims,i=[{type:12,data:W.size(n)},{type:6,data:t.pads}],a=e.length>=3&&e[2].data;return t.mode===0&&i.push({type:a?e[2].dataType:1,data:t.value}),i.push(...J(e[0].dims,n)),{name:`Pad`,shaderCache:{hint:`${t.mode}${a}`,inputDependencies:[`rank`]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(W.size(n)/64)},programUniforms:i}),getShaderSource:i=>{let o=Z(`output`,e[0].dataType,n.length),s=X(`x`,e[0].dataType,r.length),c=s.type.value,l=jc(o,r.length,t),u=[{name:`output_size`,type:`u32`},{name:`pads`,type:`i32`,length:t.pads.length}];return t.mode===0&&u.push({name:`constant_value`,type:a?c:`f32`}),`
            ${i.registerUniforms(u).declareVariables(s,o)}
            ${i.mainStart()}
            ${i.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}

            let indices = ${o.offsetToIndices(`global_idx`)};

            var value = ${c}(0);
            ${l}
            output[global_idx] = value;
        }`}}},Nc=(e,t)=>{if(e.length>1){let n=e[1].getBigInt64Array(),r=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,i=e[0].dims.length,a=new Int32Array(2*i).fill(0);if(e.length>=4){let t=e[3].getBigInt64Array();for(let e=0;e<t.length;e++)a[Number(t[e])]=Number(n[e]),a[Number(t[e])+i]=Number(n[e+t.length])}else n.forEach((e,t)=>a[Number(t)]=Number(e));let o=[];return a.forEach(e=>o.push(e)),{mode:t.mode,value:r,pads:o}}else return t},Pc=(e,t)=>{Ec(e.inputs);let n=Nc(e.inputs,t);e.compute(Mc(e.inputs,n),{inputs:[0]})}}),Ic,Lc,Rc,zc,Bc,Vc,Hc,Uc,Wc,Gc,Kc,qc,Jc,Yc,Xc,Zc,Qc,$c,el,tl=o(()=>{j(),V(),G(),Q(),Ic=e=>{if(S.webgpu.validateInputContent&&(!e||e.length!==1))throw Error(`Pool ops requires 1 input.`)},Lc=(e,t,n)=>{let r=t.format===`NHWC`,i=e.dims.slice();r&&i.splice(1,0,i.pop());let a=Object.hasOwnProperty.call(t,`dilations`),o=t.kernelShape.slice(),s=t.strides.slice(),c=a?t.dilations.slice():[],l=t.pads.slice();At.adjustPoolAttributes(n,i,o,s,c,l);let u=At.computePoolOutputShape(n,i,s,c,o,l,t.autoPad),d=Object.assign({},t);a?Object.assign(d,{kernelShape:o,strides:s,pads:l,dilations:c,cacheKey:t.cacheKey}):Object.assign(d,{kernelShape:o,strides:s,pads:l,cacheKey:t.cacheKey});let f=u.slice();return f.push(f.splice(1,1)[0]),[d,r?f:u]},Rc=(e,t)=>{let n=t.format===`NHWC`,r=W.size(e),i=W.size(t.kernelShape),a=[{type:12,data:r},{type:12,data:i}],o=[{name:`outputSize`,type:`u32`},{name:`kernelSize`,type:`u32`}];if(t.kernelShape.length<=2){let e=t.kernelShape[t.kernelShape.length-1],n=t.strides[t.strides.length-1],r=t.pads[t.pads.length/2-1],i=t.pads[t.pads.length-1],s=!!(r+i);a.push({type:12,data:e},{type:12,data:n},{type:12,data:r},{type:12,data:i}),o.push({name:`kw`,type:`u32`},{name:`sw`,type:`u32`},{name:`pwStart`,type:`u32`},{name:`pwEnd`,type:`u32`});let c=!1;if(t.kernelShape.length===2){let e=t.kernelShape[t.kernelShape.length-2],n=t.strides[t.strides.length-2],r=t.pads[t.pads.length/2-2],i=t.pads[t.pads.length-2];c=!!(r+i),a.push({type:12,data:e},{type:12,data:n},{type:12,data:r},{type:12,data:i}),o.push({name:`kh`,type:`u32`},{name:`sh`,type:`u32`},{name:`phStart`,type:`u32`},{name:`phEnd`,type:`u32`})}return[a,o,!0,s,c]}else{if(n)throw Error(`Pooling with kernelShape.length > 2 is not supported for NHWC format.`);let e=W.computeStrides(t.kernelShape);return a.push({type:12,data:e},{type:12,data:t.pads},{type:12,data:t.strides}),o.push({name:`kernelStrides`,type:`u32`,length:e.length},{name:`pads`,type:`u32`,length:t.pads.length},{name:`strides`,type:`u32`,length:t.strides.length}),[a,o,!!t.pads.reduce((e,t)=>e+t),!1,!1]}},zc=(e,t,n,r,i,a,o,s,c,l,u,d)=>{let f=i.format===`NHWC`,p=t.type.value,m=Z(`output`,t.type.tensor,r);if(i.kernelShape.length<=2){let r=``,l=``,h=``,g=n-(f?2:1);if(r=u?`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${g}] = indices[${g}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${g}] < 0 || xIndices[${g}]
                      >= uniforms.x_shape[${g}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset(`xIndices`)}];
                  ${a}
                }`:`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${g}] = indices[${g}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset(`xIndices`)}];
                  ${a}
                }`,i.kernelShape.length===2){let e=n-(f?3:2);l=d?`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${e}] = indices[${e}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${e}] < 0 || xIndices[${e}] >= uniforms.x_shape[${e}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${e}] = indices[${e}] * uniforms.sh - uniforms.phStart + j;
                `,h=`
              }
            `}return`
            ${e.registerUniforms(c).declareVariables(t,m)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}

              let indices = ${m.offsetToIndices(`global_idx`)};
              var xIndices = ${m.offsetToIndices(`global_idx`)};

              var value = ${p}(${s});
              var pad = 0;
              ${l}
              ${r}
              ${h}
              ${o}

              output[global_idx] = value;
            }`}else{if(f)throw Error(`Pooling with kernelShape.length > 2 is not supported for NHWC format.`);let r=i.kernelShape.length,u=i.pads.length,d=``;return d=l?`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset(`xIndices`)}];
                ${a}
              }`:`
              }
              let x_val = x[${t.indicesToOffset(`xIndices`)}];
              ${a}
            `,`
            ${e.registerUniforms(c).declareVariables(t,m)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
              let indices = ${m.offsetToIndices(`global_idx`)};
              var xIndices = ${m.offsetToIndices(`global_idx`)};

              var offsets: array<u32, ${r}>;

              var value = ${p}(${s});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${r-1}u; j++) {
                  offsets[j] = offset / ${Y(`uniforms.kernelStrides`,`j`,r)};
                  offset -= offsets[j] * ${Y(`uniforms.kernelStrides`,`j`,r)};
                }
                offsets[${r-1}] = offset;

                isPad = false;
                for (var j = ${n-r}u; j < ${n}u; j++) {
                  xIndices[j] = indices[j] * ${Y(`uniforms.strides`,`j - ${n-r}u`,r)}
                    + offsets[j - ${n-r}u] - ${Y(`uniforms.pads`,`j - 2u`,u)};
                  ${d}
              }
              ${o}

              output[global_idx] = value;
            }`}},Bc=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,Vc=e=>`${Bc(e)};${e.countIncludePad}`,Hc=e=>`${Bc(e)};${e.storageOrder};${e.dilations}`,Uc=e=>({format:e.format,autoPad:[`NOTSET`,`VALID`,`SAME_UPPER`,`SAME_LOWER`][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),Wc=(e,t,n,r)=>{let[i,a]=Lc(t,r,n),o=X(`x`,t.dataType,t.dims.length),s=o.type.value,c=``;i.countIncludePad?c+=`value /= ${s}(uniforms.kernelSize);`:c+=`value /= ${s}(i32(uniforms.kernelSize) - pad);`;let[l,u,d,f,p]=Rc(a,i);return l.push(...J(t.dims,a)),{name:e,shaderCache:{hint:`${r.cacheKey};${d};${f};${p}`,inputDependencies:[`rank`]},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(W.size(a)/64)},programUniforms:l}),getShaderSource:e=>zc(e,o,t.dims.length,a.length,i,`value += x_val;`,c,0,u,d,f,p)}},Gc=e=>{let t=e.count_include_pad!==0,n=Uc(e);if(n.ceilMode!==0)throw Error(`using ceil() in shape computation is not yet supported for AveragePool`);let r={countIncludePad:t,...n,cacheKey:``};return{...r,cacheKey:Vc(r)}},Kc=(e,t)=>{Ic(e.inputs),e.compute(Wc(`AveragePool`,e.inputs[0],!1,t))},qc={autoPad:``,ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},Jc=e=>{let t=e.format;return{format:t,...qc,cacheKey:t}},Yc=(e,t)=>{Ic(e.inputs),e.compute(Wc(`GlobalAveragePool`,e.inputs[0],!0,t))},Xc=(e,t,n,r)=>{let[i,a]=Lc(t,r,n),o=X(`x`,t.dataType,t.dims.length),s=[`rank`],[c,l,u,d,f]=Rc(a,i);return c.push(...J(t.dims,a)),{name:e,shaderCache:{hint:`${r.cacheKey};${u};${d};${f}`,inputDependencies:s},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(W.size(a)/64)},programUniforms:c}),getShaderSource:e=>zc(e,o,t.dims.length,a.length,i,`
      value = max(x_val, value);
    `,``,t.dataType===10?-65504:-1e5,l,u,d,f)}},Zc=(e,t)=>{Ic(e.inputs),e.compute(Xc(`MaxPool`,e.inputs[0],!1,t))},Qc=e=>{let t=e.storage_order,n=e.dilations,r=Uc(e);if(t!==0)throw Error(`column major storage order is not yet supported for MaxPool`);if(r.ceilMode!==0)throw Error(`using ceil() in shape computation is not yet supported for MaxPool`);let i={storageOrder:t,dilations:n,...r,cacheKey:``};return{...i,cacheKey:Hc(i)}},$c=e=>{let t=e.format;return{format:t,...qc,cacheKey:t}},el=(e,t)=>{Ic(e.inputs),e.compute(Xc(`GlobalMaxPool`,e.inputs[0],!0,t))}}),nl,rl,il,al,ol=o(()=>{V(),G(),un(),Q(),nl=(e,t)=>{if(e.length<2||e.length>3)throw Error(`DequantizeLinear requires 2 or 3 inputs.`);if(e.length===3&&e[1].dims===e[2].dims)throw Error(`x-scale and x-zero-point must have the same shape.`);if(e.length===3&&e[0].dataType!==e[2].dataType)throw Error(`x and x-zero-point must have the same data type.`);if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw Error(`scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.`);if(e.length>2){if(e[0].dataType!==e[2].dataType)throw Error(`x and x-zero-point must have the same data type.`);if(e[1].dims.length!==e[2].dims.length)throw Error(`scale and zero-point inputs must have the same rank.`);if(!e[1].dims.map((t,n)=>t===e[2].dims[n]).reduce((e,t)=>e&&t,!0))throw Error(`scale and zero-point inputs must have the same shape.`)}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw Error(`blockSize must be set only for block quantization.`);if(!e[1].dims.map((n,r)=>r===t.axis||n===e[0].dims[r]).reduce((e,t)=>e&&t,!0))throw Error(`For block qunatization, scale input shape to match the input shape except for the axis`);if(e[1].dims.length!==e[0].dims.length)throw Error(`For block qunatization the scale input rank must be the same as the x rank.`);let n=e[0].dims[t.axis],r=e[1].dims[t.axis];if(t.blockSize<Math.ceil(n/r)||t.blockSize>Math.ceil(n/(r-1)-1))throw Error(`blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].`)}},rl=(e,t)=>{let n=W.normalizeAxis(t.axis,e[0].dims.length),r=e[0].dataType,i=r===3,a=e[0].dims,o=e[1].dataType,s=W.size(a),c=r===3||r===2,l=c?[Math.ceil(W.size(e[0].dims)/4)]:e[0].dims,u=e[1].dims,d=e.length>2?e[2]:void 0,f=d?c?[Math.ceil(W.size(d.dims)/4)]:d.dims:void 0,p=u.length===0||u.length===1&&u[0]===1,m=p===!1&&u.length===1,h=hn(s),g=p&&(!c||h===4),_=g?h:1,v=g&&!c?h:1,y=X(`input`,c?12:r,l.length,v),b=X(`scale`,o,u.length),x=d?X(`zero_point`,c?12:r,f.length):void 0,S=Z(`output`,o,a.length,_),C=[y,b];x&&C.push(x);let w=[l,u];d&&w.push(f);let T=[{type:12,data:s/_},{type:12,data:n},{type:12,data:t.blockSize},...J(...w,a)];return{name:`DequantizeLinear`,shaderCache:{hint:t.cacheKey,inputDependencies:x?[`rank`,`rank`,`rank`]:[`rank`,`rank`]},getShaderSource:e=>`
      ${e.registerUniforms([{name:`output_size`,type:`u32`},{name:`axis`,type:`u32`},{name:`block_size`,type:`u32`}]).declareVariables(...C,S)}
      ${e.mainStart()}
          ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
          let output_indices = ${S.offsetToIndices(`global_idx`)};

          // Set input x
          ${c?`
            let input = ${y.getByOffset(`global_idx / 4`)};
            let x_vec = ${i?`unpack4xI8(input)`:`unpack4xU8(input)`};
            let x_value = ${_===1?`x_vec[global_idx % 4]`:`x_vec`};`:`let x_value = ${y.getByOffset(`global_idx`)};`};

          // Set scale input
          ${p?`let scale_value= ${b.getByOffset(`0`)}`:m?`
            let scale_index = ${S.indicesGet(`output_indices`,`uniforms.axis`)};
            let scale_value= ${b.getByOffset(`scale_index`)};`:`
            var scale_indices: ${b.type.indices} = output_indices;
            let index = ${b.indicesGet(`scale_indices`,`uniforms.axis`)} / uniforms.block_size;
            ${b.indicesSet(`scale_indices`,`uniforms.axis`,`index`)};
            let scale_value= ${b.getByIndices(`scale_indices`)};`};

          // Set zero-point input
          ${x?p?c?`
                let zero_point_input = ${x.getByOffset(`0`)};
                let zero_point_vec =  ${i?`unpack4xI8(zero_point_input)`:`unpack4xU8(zero_point_input)`};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${x.getByOffset(`0`)}`:m?c?`
                let zero_point_index = ${S.indicesGet(`output_indices`,`uniforms.axis`)};
                let zero_point_input = ${x.getByOffset(`zero_point_index / 4`)};
                let zero_point_vec =  ${i?`unpack4xI8(zero_point_input)`:`unpack4xU8(zero_point_input)`};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${S.indicesGet(`output_indices`,`uniforms.axis`)};
                let zero_point_value = ${x.getByOffset(`zero_point_index`)};`:c?`
                let zero_point_offset = ${b.indicesToOffset(`scale_indices`)};
                let zero_point_input = ${x.getByOffset(`zero_point_offset / 4`)};
                let zero_point_vec = ${i?`unpack4xI8(zero_point_input)`:`unpack4xU8(zero_point_input)`};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${x.getByIndices(`scale_indices`)};`:`let zero_point_value = ${c?i?`i32`:`u32`:y.type.value}(0);`};
      // Compute and write output
      ${S.setByOffset(`global_idx`,`${S.type.value}(x_value - zero_point_value) * scale_value`)};
      }`,getRunData:()=>({outputs:[{dims:a,dataType:o}],dispatchGroup:{x:Math.ceil(s/_/64),y:1,z:1},programUniforms:T})}},il=(e,t)=>{nl(e.inputs,t),e.compute(rl(e.inputs,t))},al=e=>q({axis:e.axis,blockSize:e.blockSize})}),sl,cl,ll,ul=o(()=>{j(),V(),Q(),sl=(e,t,n)=>{if(e===t||e<t&&n<0||e>t&&n>0)throw Error(`Range these inputs' contents are invalid.`)},cl=(e,t,n,r)=>{let i=Math.abs(Math.ceil((t-e)/n)),a=[i],o=i,s=[{type:12,data:o},{type:r,data:e},{type:r,data:n},...J(a)];return{name:`Range`,shaderCache:{hint:`${r}`},getShaderSource:e=>{let t=Z(`output`,r,a.length),n=t.type.value,i=[{name:`outputSize`,type:`u32`},{name:`start`,type:n},{name:`delta`,type:n}];return`
        ${e.registerUniforms(i).declareVariables(t)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
        output[global_idx] = uniforms.start + ${n}(global_idx) * uniforms.delta;
      }`},getRunData:()=>({outputs:[{dims:a,dataType:r}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:s})}},ll=e=>{let t=0,n=0,r=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],n=e.inputs[1].getInt32Array()[0],r=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],n=e.inputs[1].getFloat32Array()[0],r=e.inputs[2].getFloat32Array()[0]),S.webgpu.validateInputContent&&sl(t,n,r),e.compute(cl(t,n,r,e.inputs[0].dataType),{inputs:[]})}}),dl,fl,pl,ml,hl=o(()=>{V(),G(),un(),Q(),dl=(e,t,n,r)=>{if(e!==`none`&&r!==`i32`&&r!==`u32`&&r!==`f32`)throw Error(`Input ${r} is not supported with reduction ${e}.`);let i=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,a=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case`none`:return`${t}=${n};`;case`add`:return r===`i32`||r===`u32`?`atomicAdd(&${t}, bitcast<${r}>(${n}));`:`
              ${i}bitcast<${r}>(oldValue) + (${n})${a}`;case`max`:return r===`i32`||r===`u32`?`atomicMax(&${t}, bitcast<${r}>(${n}));`:`
                ${i}max(bitcast<f32>(oldValue), (${n}))${a}`;case`min`:return r===`i32`||r===`u32`?`atomicMin(&${t}, bitcast<${r}>(${n}));`:`${i}min(bitcast<${r}>(oldValue), (${n}))${a}`;case`mul`:return`${i}(bitcast<${r}>(oldValue) * (${n}))${a}`;default:throw Error(`Reduction ${e} is not supported.`)}},fl=(e,t)=>{let n=e[0].dims,r=e[1].dims,i=n,a=Math.ceil(W.sizeToDimension(r,r.length-1)/1),o=r[r.length-1],s=W.sizeFromDimension(n,o),c=[{type:12,data:a},{type:12,data:o},{type:12,data:s},...J(e[1].dims,e[2].dims,i)];return{name:`ScatterND`,shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:[`rank`,`rank`]},getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:c}),getShaderSource:n=>{let r=X(`indices`,e[1].dataType,e[1].dims.length),a=X(`updates`,e[2].dataType,e[2].dims.length,1),o=t.reduction!==`none`&&t.reduction!==``?bn(`output`,e[0].dataType,i.length):Z(`output`,e[0].dataType,i.length,1);return`
      ${n.registerUniform(`output_size`,`u32`).registerUniform(`last_index_dimension`,`u32`).registerUniform(`num_updates_elements`,`u32`).declareVariables(r,a,o)}
      ${n.mainStart()}
        ${n.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${dl(t.reduction,`output[data_offset + i]`,`value`,o.type.value)}
  }

      }`}}},pl=e=>q({reduction:e.reduction}),ml=(e,t)=>{e.compute(fl(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),gl,_l,vl,yl,bl,xl,Sl,Cl,wl,Tl,El,Dl,Ol,kl,Al,jl,Ml,Nl,Pl,Fl,Il=o(()=>{V(),G(),un(),Q(),gl=(e,t)=>{if(e.every(e=>e>0||(()=>{throw Error(`Resize requires scales input values to be positive`)})),e.length>0){if(t.mode===`linear`){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode===`cubic`&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw Error(`Resize requires scales input size to be 2 or 4 for cubic mode`)}},_l=(e,t,n)=>{t.every(e=>e>=0&&e<n||(()=>{throw Error(`Resize requires axes input values to be positive and less than rank`)}));let r=Array(n).fill(1);return t.forEach((t,n)=>r[t]=e[n]),r},vl=(e,t,n,r,i,a)=>{let[o,s,c]=n>10?[1,2,3]:[-1,e.length>1?1:-1,-1],l=e[0].dims.length;if(o>0&&e.length>o&&e[o].dims.length>0)e[o].getFloat32Array().forEach(e=>a.push(e));else if(t.coordinateTransformMode===`tf_crop_and_resize`)throw Error(`Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize`);if(s>0&&e.length>s&&e[s].dims.length===1&&e[s].dims[0]>0){if(e[s].getFloat32Array().forEach(e=>r.push(e)),r.length!==0&&r.length!==l&&n>=18&&r.length!==t.axes.length)throw Error(`Resize requires scales input size to be same as input rank or axes size for opset 18 and up`);gl(r,t),t.axes.length>0&&_l(r,t.axes,l).forEach((e,t)=>r[t]=e)}if(c>0&&e.length>c&&e[c].dims.length===1&&e[c].dims[0]>0&&(e[c].getBigInt64Array().forEach(e=>i.push(Number(e))),i.length!==0&&i.length!==l&&n>=18&&i.length!==t.axes.length))throw Error(`Resize requires sizes input size to be same as input rank or axes size for opset 18 and up`);if(t.axes.length>0){if(r.length!==0&&r.length!==t.axes.length)throw Error(`Resize requires "scales" input size to be of axes rank when axes attributes is specified`);if(i.length!==0&&i.length!==t.axes.length)throw Error(`Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified`)}if(typeof r<`u`&&typeof i<`u`&&r.length>0&&i.length>l)throw Error(`Resize requires only of scales or sizes to be specified`)},yl=(e,t,n,r)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${r}(big / (${n}));
  let fract = ${r}(big % (${n})) / ${r}(${n});
  return whole + fract;
`,bl=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case`asymmetric`:return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${yl(`xResized`,`lengthOriginal`,`lengthResized`,t)}
          }
        `;case`pytorch_half_pixel`:return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case`tf_half_pixel_for_nn`:return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case`align_corners`:return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${yl(`xResized`,`lengthOriginal - 1`,`lengthResized - 1`,t)}
                  }`;case`tf_crop_and_resize`:return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case`half_pixel_symmetric`:return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case`half_pixel`:return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw Error(`Coordinate transform mode ${e} is not supported`)}})()+`}`,xl=(e,t,n)=>`fn getNearestPixelFromOriginal(xOriginal: ${n}, isDownSample: bool) -> ${n} {`+(()=>{switch(e){case`round_prefer_ceil`:return`if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }`;case`floor`:return`return floor(xOriginal);`;case`ceil`:return`return ceil(xOriginal);`;case`round_prefer_floor`:return`if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }`;default:if(t<11)return`if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }`;throw Error(`Nearest mode ${e} is not supported`)}})()+`}`,Sl=(e,t,n)=>{let r=Array(n).fill(0).concat(Array(n).fill(1)),i=e.length===0?r:e.slice();return t.length>0?(t.forEach((e,a)=>{r[e]=i[a],r[a+n]=i[t.length+a]}),r):i},Cl=(e,t,n,r)=>{let i=[];if(n.length>0)if(r.length>0){if(e.forEach(e=>i.push(e)),Math.max(...r)>e.length)throw Error(`axes is out of bound`);r.forEach((e,t)=>i[e]=n[t])}else n.forEach(e=>i.push(e));else{if(t.length===0)throw Error(`Resize requires either scales or sizes.`);i=e.map((e,n)=>Math.round(e*t[n]))}return i},wl=(e,t,n)=>{let r=(()=>{switch(n.keepAspectRatioPolicy){case`not_larger`:return n.axes.length>0?Math.min(...n.axes.map(e=>t[e]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case`not_smaller`:return n.axes.length>0?Math.max(...n.axes.map(e=>t[e]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw Error(`Keep aspect ratio policy ${n.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let i=e.slice();return n.axes.length>0?(n.axes.forEach(e=>t[e]=r),n.axes.forEach(n=>i[n]=Math.round(e[n]*t[n]))):(t.fill(r,0,t.length),i.forEach((e,n)=>i[n]=Math.round(e*t[n]))),i},Tl=(e,t,n,r,i)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${n.length}> {
      var original_indices: array<${e.type.value}, ${n.length}>;
      for (var i:u32 = 0; i < ${n.length}; i++) {
        var output_index = ${e.indicesGet(`output_indices`,`i`)};
        var scale = ${Y(`uniforms.scales`,`i`,r)};
        var roi_low = ${Y(`uniforms.roi`,`i`,i)};
        var roi_hi = ${Y(`uniforms.roi`,`i + ${t.length}`,i)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${Y(`uniforms.input_shape`,`i`,t.length)};
          var output_shape_i = ${Y(`uniforms.output_shape`,`i`,n.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,El=(e,t,n,r,i,a,o)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${t.indicesGet(`output_indices`,`i`)};
        var input_index: u32;
        var scale = ${Y(`uniforms.scales`,`i`,i)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${Y(`uniforms.roi`,`i`,a)};
          var roi_hi = ${Y(`uniforms.roi`,`i + ${n.length}`,a)};
          var input_shape_i = ${Y(`uniforms.input_shape`,`i`,n.length)};
          var output_shape_i = ${Y(`uniforms.output_shape`,`i`,r.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${o} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet(`input_indices`,`i`,`input_index`)}
      }
      return input_indices;
    }`,Dl=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet(`input_indices`,`i`)};
        if (input_index < 0 || input_index >= ${Y(`uniforms.input_shape`,`i`,t.length)}) {
          return false;
        }
      }
      return true;
    }`,Ol=(e,t,n,r)=>e.rank>r?`
    ${e.indicesSet(`input_indices`,t,`channel`)};
    ${e.indicesSet(`input_indices`,n,`batch`)};
`:``,kl=(e,t,n,r,i)=>{let[a,o,s,c]=n.length===2?[-1,0,1,-1]:[0,2,3,1],l=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${l} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet(`input_indices`,o,`max(0, min(row, ${n[o]} - 1))`)};
      ${e.indicesSet(`input_indices`,s,`max(0, min(col, ${n[s]} - 1))`)};
      ${Ol(e,c,a,2)}
      return ${e.getByIndices(`input_indices`)};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${l} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${l} = originalIndices[${o}];
      var col:${l} = originalIndices[${s}];
      ${r?`if (row < 0 || row > (${n[o]} - 1) || col < 0 || col > (${n[s]} - 1)) {
        return ${i};
      }`:``};
      row = max(0, min(row, ${n[o]} - 1));
      col = max(0, min(col, ${n[s]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${n.length>2?`u32(originalIndices[${c}])`:`0`};
      var batch: u32 =  ${n.length>2?`u32(originalIndices[${a}])`:`0`};
      var x11: ${l} = getInputValue(batch, channel, row1, col1);
      var x12: ${l} = getInputValue(batch, channel, row1, col2);
      var x21: ${l} = getInputValue(batch, channel, row2, col1);
      var x22: ${l} = getInputValue(batch, channel, row2, col2);
      var dx1: ${l} = abs(row - ${l}(row1));
      var dx2: ${l} = abs(${l}(row2) - row);
      var dy1: ${l} = abs(col - ${l}(col1));
      var dy2: ${l} = abs(${l}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},Al=(e,t,n,r,i,a,o,s,c,l)=>{let[u,d]=n.length===2?[0,1]:[2,3],f=e.type.value,p=o=>{let d=o===u?`row`:`col`;return`
      fn ${d}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${f} {
        var output_index = ${t.indicesGet(`output_indices`,o)};
        var originalIdx: ${f} = getOriginalCoordinateFromResizedCoordinate(output_index, ${i[o]},
        ${r[o]}, ${n[o]}, ${a[o]}, ${a[o]} + ${n.length});
        var fractOriginalIdx: ${f} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${s} && (originalIdx < 0 || originalIdx > (${n[o]} - 1))) {
          return ${c};
        }
        var data: array<${f}, 4> = array<${f}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${d}: ${f} = originalIdx + ${f}(i);
          if (${d} < 0 || ${d} >= ${n[o]}) {
            ${l?`coefs[i + 1] = 0.0;
                        continue;`:s?`return ${c};`:`${d} = max(0, min(${d}, ${n[o]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet(`input_indices_copy`,o,`u32(${d})`)};
          data[i + 1] = ${o===u?e.getByIndices(`input_indices_copy`):`rowCubicInterpolation(input_indices_copy, output_indices)`};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${p(u)};
    ${p(d)};
  fn getCubicInterpolationCoefs(s: ${f}) -> array<${f}, 4> {
    var absS = abs(s);
    var coeffs: array<${f}, 4> = array<${f}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${f} = 1.0 - absS;
    var twoMinusAbsS: ${f} = 2.0 - absS;
    var onePlusAbsS: ${f} = 1.0 + absS;
    coeffs[0] = ((${o} * onePlusAbsS - 5 * ${o}) * onePlusAbsS + 8 * ${o}) * onePlusAbsS - 4 * ${o};
    coeffs[1] = ((${o} + 2) * absS - (${o} + 3)) * absS * absS + 1;
    coeffs[2] = ((${o} + 2) * oneMinusAbsS - (${o} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${o} * twoMinusAbsS - 5 * ${o}) * twoMinusAbsS + 8 * ${o}) * twoMinusAbsS - 4 * ${o};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${f}, 4>, coefs: array<${f}, 4>) -> ${f} {
    var coefsSum: ${f} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${f} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},jl=(e,t,n,r,i)=>{let[a,o,s,c,l]=n.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],u=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${u} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet(`input_indices`,o,`max(0, min(depth, ${n[o]} - 1))`)};
      ${e.indicesSet(`input_indices`,s,`max(0, min(height, ${n[s]} - 1))`)};
      ${e.indicesSet(`input_indices`,c,`max(0, min(width, ${n[c]} - 1))`)};
      ${Ol(e,l,a,3)}
      return ${e.getByIndices(`input_indices`)};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${u} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${u} = originalIndices[${o}];
      var height:${u} = originalIndices[${s}];
      var width:${u} = originalIndices[${c}];
      ${r?`if (depth < 0 || depth > (${n[o]} - 1) || height < 0 || height > (${n[s]} - 1) || width < 0 || (width > ${n[c]} - 1)) {
      return ${i};
        }`:``};

    depth = max(0, min(depth, ${n[o]} - 1));
      height = max(0, min(height, ${n[s]} - 1));
      width = max(0, min(width, ${n[c]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${n.length>3?`u32(originalIndices[${l}])`:`0`};
      var batch: u32 =  ${n.length>3?`u32(originalIndices[${a}])`:`0`};

      var x111: ${u} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${u} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${u} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${u} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${u} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${u} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${u} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${u} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${u} = abs(depth - ${u}(depth1));
      var dx2: ${u} = abs(${u}(depth2) - depth);
      var dy1: ${u} = abs(height - ${u}(height1));
      var dy2: ${u} = abs(${u}(height2) - height);
      var dz1: ${u} = abs(width - ${u}(width1));
      var dz2: ${u} = abs(${u}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},Ml=(e,t,n,r,i,a)=>{let o=e.dims,s=Sl(a,t.axes,o.length),c=Cl(o,r,i,t.axes),l=r.slice();r.length===0&&(l=o.map((e,t)=>e===0?1:c[t]/e),t.keepAspectRatioPolicy!==`stretch`&&(c=wl(o,l,t)));let u=Z(`output`,e.dataType,c.length),d=X(`input`,e.dataType,o.length),f=W.size(c),p=o.length===c.length&&o.every((e,t)=>e===c[t]),m=t.coordinateTransformMode===`tf_crop_and_resize`,h=t.extrapolationValue,g=d.type.value;return{name:`Resize`,shaderCache:{hint:`${t.cacheKey}|${n}|${l.length>0?t.mode===`cubic`?l:l.length:``}|${i.length>0?i:``}|${s.length>0?s:``}|${p}|${t.mode===`nearest`?o.length:o}`,inputDependencies:[`rank`]},getShaderSource:e=>`
      ${p?``:`
      ${bl(t.coordinateTransformMode,g)};
      ${(()=>{switch(t.mode){case`nearest`:return`
              ${Dl(d,o)};
              ${xl(t.nearestMode,n,g)};
              ${El(d,u,o,c,l.length,s.length,m)};
              `;case`linear`:return`
              ${Tl(u,o,c,l.length,s.length)};
              ${(()=>{if(o.length===2||o.length===4)return`${kl(d,u,o,m,h)}`;if(o.length===3||o.length===5)return`${jl(d,u,o,m,h)}`;throw Error(`Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.`)})()};
            `;case`cubic`:return`
            ${(()=>{if(o.length===2||o.length===4)return`${Al(d,u,o,c,l,s,t.cubicCoeffA,m,t.extrapolationValue,t.excludeOutside)}`;throw Error(`Cubic mode only supports input dims 2 and 4 are supported in linear mode.`)})()};
            `;default:throw Error(`Invalid resize mode`)}})()};
      `}
      ${e.registerUniform(`output_size`,`u32`).registerUniform(`scales`,`f32`,l.length).registerUniform(`roi`,`f32`,s.length).declareVariables(d,u)}
      ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
        ${p?`output[global_idx] = input[global_idx];`:`
        let output_indices = ${u.offsetToIndices(`global_idx`)};
        var input_indices: ${d.type.indices};
        ${(()=>{switch(t.mode){case`nearest`:return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${d.getByIndices(`input_indices`)};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case`linear`:return`output[global_idx] = ${o.length===2||o.length===4?`bilinearInterpolation`:`trilinearInterpolation`}(output_indices);`;case`cubic`:return`output[global_idx] = bicubicInterpolation(output_indices);`;default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`,getRunData:()=>({outputs:[{dims:c,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},{type:1,data:l},{type:1,data:s},...J(o,c)]})}},Nl=e=>{let t=e.customDataBuffer;return new Uint32Array(t.buffer,t.byteOffset,1)[0]},Pl=(e,t)=>{let n=[],r=[],i=[],a=Nl(e);if(t.antialias!==0)throw Error(`Only default value (0) for Antialias attribute is supported`);vl(e.inputs,t,a,n,r,i),e.compute(Ml(e.inputs[0],t,a,n,r,i),{inputs:[0]})},Fl=e=>{let t=e.antialias,n=e.axes,r=e.coordinateTransformMode,i=e.cubicCoeffA,a=e.excludeOutside!==0,o=e.extrapolationValue,s=e.keepAspectRatioPolicy,c=e.mode,l=e.nearestMode===``?`simple`:e.nearestMode;return q({antialias:t,axes:n,coordinateTransformMode:r,cubicCoeffA:i,excludeOutside:a,extrapolationValue:o,keepAspectRatioPolicy:s,mode:c,nearestMode:l})}}),Ll,Rl,zl,Bl=o(()=>{V(),G(),Q(),Ll=e=>{if(!e||e.length<3)throw Error(`layerNorm requires at least 3 inputs.`);let t=e[0],n=e[1],r=e[2];if(t.dataType!==n.dataType||t.dataType!==r.dataType)throw Error(`All inputs must have the same data type`);if(t.dims.length!==3&&t.dims.length!==2)throw Error(`Input must be 2D or 3D`);if(n.dims.length!==3&&n.dims.length!==2)throw Error(`Skip must be 2D or 3D`);let i=t.dims[t.dims.length-1],a=t.dims[t.dims.length-2];if(n.dims[n.dims.length-1]!==i)throw Error(`Skip must have the same hidden size as input`);if(n.dims[n.dims.length-2]!==a)throw Error(`Skip must have the same sequence length as input`);if(r.dims.length!==1)throw Error(`Gamma must be 1D`);if(r.dims[r.dims.length-1]!==i)throw Error(`Gamma must have the same hidden size as input`);if(e.length>3){let t=e[3];if(t.dims.length!==1)throw Error(`Beta must be 1D`);if(t.dims[t.dims.length-1]!==i)throw Error(`Beta must have the same hidden size as input`)}if(e.length>4){let t=e[4];if(t.dims.length!==1)throw Error(`Bias must be 1D`);if(t.dims[t.dims.length-1]!==i)throw Error(`Bias must have the same hidden size as input`)}},Rl=(e,t,n,r)=>{let i=t.simplified,a=e[0].dims,o=W.size(a),s=a,c=o,l=a.slice(-1)[0],u=r?a.slice(0,-1).concat(1):[],d=!i&&e.length>3,f=e.length>4,p=r&&n>1,m=r&&n>2,h=n>3,g=hn(l),_=[{type:12,data:c},{type:12,data:g},{type:12,data:l},{type:1,data:t.epsilon}],v=t=>{let n=[{name:`output_size`,type:`u32`},{name:`components`,type:`u32`},{name:`hidden_size`,type:`u32`},{name:`epsilon`,type:`f32`}],r=[X(`x`,e[0].dataType,e[0].dims,g),X(`skip`,e[1].dataType,e[1].dims,g),X(`gamma`,e[2].dataType,e[2].dims,g)];d&&r.push(X(`beta`,e[3].dataType,e[3].dims,g)),f&&r.push(X(`bias`,e[4].dataType,e[4].dims,g)),r.push(Z(`output`,e[0].dataType,s,g)),p&&r.push(Z(`mean_output`,1,u)),m&&r.push(Z(`inv_std_output`,1,u)),h&&r.push(Z(`input_skip_bias_sum`,e[0].dataType,s,g));let a=pn(e[0].dataType),o=pn(1,g);return`

      ${t.registerUniforms(n).declareVariables(...r)}
      var<workgroup> sum_shared : array<${o}, 64>;
      var<workgroup> sum_squared_shared : array<${o}, 64>;

      ${t.mainStart([64,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / 64;

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / 64;
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == 63) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${f?`bias[offset1d + i]`:a+`(0.0)`};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${h?`input_skip_bias_sum[offset + i] = value;`:``}
          output[offset + i] = value;
          let f32_value = ${_n(a,g,`value`)};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = 64;
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${vn(`sum`,g)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${vn(`square_sum`,g)} / f32(uniforms.hidden_size) ${i?``:`- mean * mean`} + uniforms.epsilon);
        ${p?`mean_output[global_idx] = mean;`:``}
        ${m?`inv_std_output[global_idx] = inv_std_dev;`:``}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${i?``:`- ${a}(mean)`}) *
            ${a}(inv_std_dev) * gamma[offset1d + i]
            ${d?`+ beta[offset1d + i]`:``};
        }
      }`},y=[{dims:s,dataType:e[0].dataType}];return n>1&&y.push({dims:u,dataType:1}),n>2&&y.push({dims:u,dataType:1}),n>3&&y.push({dims:a,dataType:e[0].dataType}),{name:`SkipLayerNormalization`,shaderCache:{hint:`${g};${p};${m};${h}`,inputDependencies:e.map((e,t)=>`type`)},getShaderSource:v,getRunData:()=>({outputs:y,dispatchGroup:{x:Math.ceil(c/l)},programUniforms:_})}},zl=(e,t)=>{Ll(e.inputs);let n=[0];e.outputCount>1&&n.push(-3),e.outputCount>2&&n.push(-3),e.outputCount>3&&n.push(3),e.compute(Rl(e.inputs,t,e.outputCount,!1),{outputs:n})}}),Vl,Hl,Ul,Wl,Gl,Kl,ql,Jl,Yl=o(()=>{V(),G(),un(),Q(),Vl=(e,t)=>{if(!e||e.length<1)throw Error(`too few inputs`);if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw Error(`axes, starts and ends must have the same length`)}else if(t.starts.length!==t.ends.length)throw Error(`starts and ends must have the same length`);e.slice(1).forEach((t,n)=>{if(e[n+1].dataType!==6&&e[n+1].dataType!==7)throw Error(`Input ${n} must be an array of int32 or int64`)})},Hl=(e,t)=>{let n=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(e=>n.push(Number(e)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(e=>n.push(Number(e)));else throw Error(`Input ${t} must be an array of int32 or int64`);return n},Ul=(e,t)=>{if(e.length>1){let t=Hl(e,1),n=Hl(e,2),r=Hl(e,3);return r.length===0&&(r=[...Array(e[0].dims.length).keys()]),q({starts:t,ends:n,axes:r})}else return t},Wl=(e,t,n,r,i)=>{let a=e;return e<0&&(a+=n[r[t]]),i[t]<0?Math.max(0,Math.min(a,n[r[t]]-1)):Math.max(0,Math.min(a,n[r[t]]))},Gl=(e,t,n)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${n.length-1}; i >= 0; i--) {
            let input_shape_i = ${Y(`uniforms.input_shape`,`i`,n.length)};
            let steps_i = ${Y(`uniforms.steps`,`i`,n.length)};
            let signs_i = ${Y(`uniforms.signs`,`i`,n.length)};
            let starts_i = ${Y(`uniforms.starts`,`i`,n.length)};
            var output_index = ${t.indicesGet(`output_indices`,`i`)};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet(`input_indices`,`i`,`input_index`)};
          }
          return input_indices;
      }`,Kl=(e,t)=>{let n=e[0].dims,r=W.size(n),i=t.axes.length>0?W.normalizeAxes(t.axes,n.length):[...Array(n.length).keys()],a=Hl(e,4);a.forEach(e=>e!==0||(()=>{throw Error(`step cannot be 0`)})),a.length===0&&(a=Array(i.length).fill(1));let o=t.starts.map((e,t)=>Wl(e,t,n,i,a)),s=t.ends.map((e,t)=>Wl(e,t,n,i,a));if(i.length!==o.length||i.length!==s.length)throw Error(`start, ends and axes should have the same number of elements`);if(i.length!==n.length)for(let e=0;e<n.length;++e)i.includes(e)||(o.splice(e,0,0),s.splice(e,0,n[e]),a.splice(e,0,1));let c=a.map(e=>Math.sign(e));a.forEach((e,t,n)=>{if(e<0){let r=(s[t]-o[t])/e,i=o[t],c=i+r*a[t];o[t]=c,s[t]=i,n[t]=-e}});let l=n.slice(0);i.forEach((e,t)=>{l[e]=Math.ceil((s[e]-o[e])/a[e])});let u={dims:l,dataType:e[0].dataType},d=Z(`output`,e[0].dataType,l.length),f=X(`input`,e[0].dataType,e[0].dims.length),p=W.size(l),m=[{name:`outputSize`,type:`u32`},{name:`starts`,type:`u32`,length:o.length},{name:`signs`,type:`i32`,length:c.length},{name:`steps`,type:`u32`,length:a.length}],h=[{type:12,data:p},{type:12,data:o},{type:6,data:c},{type:12,data:a},...J(e[0].dims,l)];return{name:`Slice`,shaderCache:{hint:`${c.length}_${o.length}_${a.length}`,inputDependencies:[`rank`]},getShaderSource:e=>`
      ${e.registerUniforms(m).declareVariables(f,d)}
        ${Gl(f,d,n)}
        ${e.mainStart()}
          ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.outputSize`)}
          let output_indices = ${d.offsetToIndices(`global_idx`)};
          let input_indices = calculateInputIndices(output_indices);
          ${d.setByOffset(`global_idx`,f.getByIndices(`input_indices`))}
      }`,getRunData:()=>({outputs:[u],dispatchGroup:{x:Math.ceil(r/64)},programUniforms:h})}},ql=(e,t)=>{Vl(e.inputs,t);let n=Ul(e.inputs,t);e.compute(Kl(e.inputs,n),{inputs:[0]})},Jl=e=>{let t=e.starts,n=e.ends,r=e.axes;return q({starts:t,ends:n,axes:r})}}),Xl,Zl,Ql,$l,eu=o(()=>{V(),G(),un(),Nn(),Q(),Xl=e=>{if(!e||e.length!==1)throw Error(`Softmax op requires 1 input.`)},Zl=(e,t)=>{let n=e.inputs[0],r=n.dims,i=W.size(r),a=r.length,o=W.normalizeAxis(t.axis,a),s=o<r.length-1,c,l=[];s?(l=Array.from({length:a},(e,t)=>t),l[o]=a-1,l[a-1]=o,c=e.compute(An(n,l),{inputs:[n],outputs:[-1]})[0]):c=n;let u=c.dims,d=u[a-1],f=i/d,p=hn(d),m=d/p,h=64;f===1&&(h=256);let g=(e,t)=>t===4?`max(max(${e}.x, ${e}.y), max(${e}.z, ${e}.w))`:t===2?`max(${e}.x, ${e}.y)`:t===3?`max(max(${e}.x, ${e}.y), ${e}.z)`:e,_=X(`x`,c.dataType,c.dims,p),v=Z(`result`,c.dataType,c.dims,p),y=_.type.value,b=pn(c.dataType)===`f32`?`var threadMax = ${y}(-3.4028234663852886e+38f);`:`var threadMax = ${y}(-65504.0h);`,x=e.compute({name:`Softmax`,shaderCache:{hint:`${p};${h}`,inputDependencies:[`type`]},getRunData:()=>({outputs:[{dims:u,dataType:c.dataType}],dispatchGroup:{x:f},programUniforms:[{type:6,data:m}]}),getShaderSource:e=>`
      var<workgroup> rowMaxShared : ${y};
      var<workgroup> rowSumShared : ${y};
      var<workgroup> threadShared : array<${y}, ${h}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${y} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${y}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${e.registerUniform(`packedCols`,`i32`).declareVariables(_,v)}
      ${e.mainStart(h)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${h};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${b}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${y}(${g(`threadShared[0]`,p)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${y}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${y}(${vn(`threadShared[0]`,p)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${y}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`},{inputs:[c],outputs:[s?-1:0]})[0];s&&e.compute(An(x,l),{inputs:[x]})},Ql=(e,t)=>{Xl(e.inputs),Zl(e,t)},$l=e=>q({axis:e.axis})}),tu,nu,ru,iu,au,ou=o(()=>{V(),G(),Q(),tu=e=>Array.from(e.getBigInt64Array(),Number),nu=e=>{if(!e||e.length!==2)throw Error(`Tile requires 2 inputs.`);if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw Error(`Tile only support float, float16, int32, and uint32 data types`);if(e[1].dataType!==7)throw Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw Error("Tile `repeats` input should be 1-D");if(tu(e[1]).length!==e[0].dims.length)throw Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},ru=(e,t)=>{let n=[];for(let r=0;r<e.length;++r)n.push(e[r]*t[r]);return n},iu=(e,t)=>{let n=e[0].dims,r=t??tu(e[1]),i=ru(n,r),a=W.size(i),o=e[0].dataType,s=X(`input`,o,n.length),c=Z(`output`,o,i.length);return{name:`Tile`,shaderCache:{hint:`${r}`,inputDependencies:[`rank`]},getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},...J(e[0].dims,i)]}),getShaderSource:e=>`
      const inputShape = ${s.indices(...n)};
      ${e.registerUniform(`output_size`,`u32`).declareVariables(s,c)}
      ${e.mainStart()}
      ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.output_size`)}
      let output_indices = ${c.offsetToIndices(`global_idx`)};
      var input_indices: ${s.type.indices};
      for (var i = 0; i < ${n.length}; i++) {
        let input_dim_i = ${s.indicesGet(`uniforms.input_shape`,`i`)};
        let input_dim_value = ${c.indicesGet(`output_indices`,`i`)}  % input_dim_i;

        ${s.indicesSet(`input_indices`,`i`,`input_dim_value`)}
      }
      ${c.setByOffset(`global_idx`,s.getByIndices(`input_indices`))}
    }`}},au=e=>{nu(e.inputs),e.compute(iu(e.inputs),{inputs:[0]})}}),su,cu,lu,uu=o(()=>{V(),G(),Q(),su=(e,t,n,r,i)=>{let a=Z(`output_data`,i,n.length,4),o=X(`a_data`,t[1].dataType,t[1].dims.length,4),s=X(`b_data`,t[2].dataType,t[2].dims.length,4),c=X(`c_data`,t[0].dataType,t[0].dims.length,4),l,u=(e,t,n)=>`select(${t}, ${e}, ${n})`;if(!r)l=a.setByOffset(`global_idx`,u(o.getByOffset(`global_idx`),s.getByOffset(`global_idx`),c.getByOffset(`global_idx`)));else{let e=(e,t,n=``)=>{let r=`a_data[index_a${t}][component_a${t}]`,i=`b_data[index_b${t}][component_b${t}]`,l=`bool(c_data[index_c${t}] & (0xffu << (component_c${t} * 8)))`;return`
            let output_indices${t} = ${a.offsetToIndices(`global_idx * 4u + ${t}u`)};
            let offset_a${t} = ${o.broadcastedIndicesToOffset(`output_indices${t}`,a)};
            let offset_b${t} = ${s.broadcastedIndicesToOffset(`output_indices${t}`,a)};
            let offset_c${t} = ${c.broadcastedIndicesToOffset(`output_indices${t}`,a)};
            let index_a${t} = offset_a${t} / 4u;
            let index_b${t} = offset_b${t} / 4u;
            let index_c${t} = offset_c${t} / 4u;
            let component_a${t} = offset_a${t} % 4u;
            let component_b${t} = offset_b${t} % 4u;
            let component_c${t} = offset_c${t} % 4u;
            ${e}[${t}] = ${n}(${u(r,i,l)});
          `};l=i===9?`
            var data = vec4<u32>(0);
            ${e(`data`,0,`u32`)}
            ${e(`data`,1,`u32`)}
            ${e(`data`,2,`u32`)}
            ${e(`data`,3,`u32`)}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:`
            ${e(`output_data[global_idx]`,0)}
            ${e(`output_data[global_idx]`,1)}
            ${e(`output_data[global_idx]`,2)}
            ${e(`output_data[global_idx]`,3)}
          `}return`
        ${e.registerUniform(`vec_size`,`u32`).declareVariables(c,o,s,a)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes(`uniforms.vec_size`)}
        ${l}
      }`},cu=e=>{let t=e[1].dims,n=e[2].dims,r=e[0].dims,i=e[1].dataType,a=!(W.areEqual(t,n)&&W.areEqual(n,r)),o=t,s=W.size(t);if(a){let e=kt.calcShape(kt.calcShape(t,n,!1),r,!1);if(!e)throw Error(`Can't perform where op on the given tensors`);o=e,s=W.size(o)}let c=Math.ceil(s/4);return{name:`Where`,shaderCache:{inputDependencies:[`rank`,`rank`,`rank`]},getShaderSource:t=>su(t,e,o,a,i),getRunData:()=>({outputs:[{dims:o,dataType:i}],dispatchGroup:{x:Math.ceil(s/64/4)},programUniforms:[{type:12,data:c},...J(r,t,n,o)]})}},lu=e=>{e.compute(cu(e.inputs))}}),du,fu=o(()=>{Nr(),Hr(),qr(),Zr(),Ki(),oa(),pa(),oo(),yo(),Co(),ko(),Vo(),qo(),Xo(),ts(),as(),us(),hs(),bs(),Fs(),sc(),fc(),gc(),yc(),Tc(),Us(),Fc(),tl(),ol(),ul(),hl(),Or(),Il(),tc(),Bl(),Yl(),eu(),Zs(),ou(),Nn(),Hi(),uu(),du=new Map([[`Abs`,[$r]],[`Acos`,[ei]],[`Acosh`,[ti]],[`Add`,[Xi]],[`ArgMax`,[jr,Mr]],[`ArgMin`,[Ar,Mr]],[`Asin`,[ni]],[`Asinh`,[ri]],[`Atan`,[ii]],[`Atanh`,[ai]],[`Attention`,[Vr]],[`AveragePool`,[Kc,Gc]],[`BatchNormalization`,[Kr]],[`BiasAdd`,[Xr]],[`BiasSplitGelu`,[Gi]],[`Cast`,[si,oi]],[`Ceil`,[ui]],[`Clip`,[li]],[`Concat`,[da,fa]],[`Conv`,[ao,to]],[`ConvTranspose`,[vo,mo]],[`Cos`,[di]],[`Cosh`,[fi]],[`CumSum`,[xo,So]],[`DepthToSpace`,[Do,Oo]],[`DequantizeLinear`,[il,al]],[`Div`,[Zi]],[`Einsum`,[zo,Bo]],[`Elu`,[mi,pi]],[`Equal`,[Qi]],[`Erf`,[gi]],[`Exp`,[_i]],[`Expand`,[Ko]],[`FastGelu`,[Yo]],[`Floor`,[vi]],[`FusedConv`,[ao,to]],[`Gather`,[es,$o]],[`GatherElements`,[ms,ps]],[`GatherBlockQuantized`,[cs,ls]],[`GatherND`,[rs,is]],[`Gelu`,[yi]],[`Gemm`,[ys,vs]],[`GlobalAveragePool`,[Yc,Jc]],[`GlobalMaxPool`,[el,$c]],[`Greater`,[na]],[`GreaterOrEqual`,[ia]],[`GridSample`,[Ns,Ps]],[`GroupQueryAttention`,[oc]],[`HardSigmoid`,[Di,Ei]],[`InstanceNormalization`,[dc]],[`LayerNormalization`,[hc]],[`LeakyRelu`,[bi,pi]],[`Less`,[ra]],[`LessOrEqual`,[aa]],[`Log`,[Ri]],[`MatMul`,[vc]],[`MatMulNBits`,[Cc,wc]],[`MaxPool`,[Zc,Qc]],[`Mul`,[$i]],[`MultiHeadAttention`,[Hs,Rs]],[`Neg`,[Si]],[`Not`,[xi]],[`Pad`,[Pc]],[`Pow`,[ea]],[`QuickGelu`,[Vi,pi]],[`Range`,[ll]],[`Reciprocal`,[Ci]],[`ReduceMin`,[Cr]],[`ReduceMean`,[vr]],[`ReduceMax`,[Sr]],[`ReduceSum`,[Tr]],[`ReduceProd`,[wr]],[`ReduceL1`,[yr]],[`ReduceL2`,[br]],[`ReduceLogSum`,[Dr]],[`ReduceLogSumExp`,[xr]],[`ReduceSumSquare`,[Er]],[`Relu`,[wi]],[`Resize`,[Pl,Fl]],[`RotaryEmbedding`,[ec]],[`ScatterND`,[ml,pl]],[`Sigmoid`,[Ti]],[`Sin`,[Oi]],[`Sinh`,[ki]],[`Slice`,[ql,Jl]],[`SkipLayerNormalization`,[zl]],[`Split`,[Ys,Xs]],[`Sqrt`,[Ai]],[`Softmax`,[Ql,$l]],[`Sub`,[ta]],[`Tan`,[ji]],[`Tanh`,[Ni]],[`ThresholdedRelu`,[Li,pi]],[`Tile`,[au]],[`Transpose`,[jn,Mn]],[`Where`,[lu]]])}),pu,mu=o(()=>{j(),U(),Q(),pu=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,n,r,i){ve(e.programInfo.name);let a=this.backend.device,o=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let s=[];for(let e of t)s.push({binding:s.length,resource:{buffer:e.buffer}});for(let e of n)s.push({binding:s.length,resource:{buffer:e.buffer}});i&&s.push({binding:s.length,resource:i});let c=a.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:s,label:e.programInfo.name});if(this.backend.sessionStatus===`capturing`){let t={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:c,dispatchGroup:r};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(t)}o.setPipeline(e.computePipeline),o.setBindGroup(0,c),o.dispatchWorkgroups(...r),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType===`at-passes`)&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),ye(e.programInfo.name)}dispose(){}build(e,t){ve(e.name);let n=this.backend.device,r=[];[{feature:`shader-f16`,extension:`f16`},{feature:`subgroups`,extension:`subgroups`}].forEach(e=>{n.features.has(e.feature)&&r.push(`enable ${e.extension};`)});let i=Cn(t,this.backend.device.limits),a=e.getShaderSource(i),o=`${r.join(`
`)}
${i.additionalImplementations}
${a}`,s=n.createShaderModule({code:o,label:e.name});H(`verbose`,()=>`[WebGPU] ${e.name} shader code: ${o}`);let c=n.createComputePipeline({compute:{module:s,entryPoint:`main`},layout:`auto`,label:e.name});return ye(e.name),{programInfo:e,computePipeline:c,uniformVariablesInfo:i.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e==`number`?e:e.x,n=typeof e==`number`?1:e.y||1,r=typeof e==`number`?1:e.z||1,i=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=i&&n<=i&&r<=i)return[t,n,r];let a=t*n*r,o=Math.ceil(Math.sqrt(a));if(o>i){if(o=Math.ceil(Math.cbrt(a)),o>i)throw Error(`Total dispatch size exceeds WebGPU maximum.`);return[o,o,o]}else return[o,o,1]}}}),hu={};s(hu,{WebGpuBackend:()=>yu});var gu,_u,vu,yu,bu=o(()=>{j(),V(),U(),Ft(),cn(),fu(),mu(),gu=(e,t)=>{if(t.length!==e.length)throw Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let n=[];for(let r=0;r<e.length;++r){let i=e[r].dataType;switch(t[r]){case`none`:n.push(``);break;case`type`:n.push(`${i}`);break;case`rank`:{let t=e[r].dims.length;n.push(`${i};${t}`);break}case`dims`:{let t=e[r].dims.join(`,`);n.push(`${i};${t}`);break}default:throw Error(`unsupported input dependency: ${t[r]}`)}}return n.join(`|`)},_u=(e,t,n)=>{let r=e.name;return e.shaderCache?.hint&&(r+=`[`+e.shaderCache.hint+`]`),r+=`:`+n+`:${gu(t,e.shaderCache?.inputDependencies??Array(t.length).fill(`dims`))}`,r},vu=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},yu=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus=`default`,this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw Error(`currentKernelCustomData(): currentKernelId is null. (should not happen)`);let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let n=[],r={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:n},i=e=>t.features.has(e)&&n.push(e)&&!0;i(`chromium-experimental-timestamp-query-inside-passes`)||i(`timestamp-query`),i(`shader-f16`),i(`subgroups`),this.device=await t.requestDevice(r);let a=t,o=t.info??(typeof a.requestAdapterInfo==`function`?await a.requestAdapterInfo():void 0);this.adapterInfo=new vu(o),this.gpuDataManager=sn(this),this.programManager=new pu(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Et(e.logLevel,!!e.debug),this.device.onuncapturederror=e=>{e.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${e.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!0}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<`u`&&this.querySet.destroy(),this.gpuDataManager.dispose(),this.device&&this.env?.webgpu&&this.device.lost.then(()=>{delete this.env.webgpu.device})}getCommandEncoder(){return this.commandEncoder||=this.device.createCommandEncoder(),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType===`at-passes`&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&=(this.computePassEncoder.end(),null)}flush(){if(!this.commandEncoder)return;ve(),this.endComputePass();let e;this.queryType!==`none`&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!==`none`&&e.mapAsync(GPUMapMode.READ).then(()=>{let t=new BigUint64Array(e.getMappedRange()),n=this.pendingQueries.get(e);for(let e=0;e<t.length/2;e++){let r=n[e],i=r.kernelId,a=this.kernels.get(i),o=a.kernelType,s=a.kernelName,c=r.programName,l=r.inputTensorViews,u=r.outputTensorViews,d=t[e*2],f=t[e*2+1];typeof this.queryTimeBase>`u`&&(this.queryTimeBase=d);let p=Number(d-this.queryTimeBase),m=Number(f-this.queryTimeBase);if(!Number.isSafeInteger(p)||!Number.isSafeInteger(m))throw RangeError(`incorrect timestamp range`);if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:l.map(e=>({dims:e.dims,dataType:pt(e.dataType)})),outputsMetadata:u.map(e=>({dims:e.dims,dataType:pt(e.dataType)})),kernelId:i,kernelType:o,kernelName:s,programName:c,startTime:p,endTime:m});else{let e=``;l.forEach((t,n)=>{e+=`input[${n}]: [${t.dims}] | ${pt(t.dataType)}, `});let t=``;u.forEach((e,n)=>{t+=`output[${n}]: [${e.dims}] | ${pt(e.dataType)}, `}),console.log(`[profiling] kernel "${i}|${o}|${s}|${c}" ${e}${t}start time: ${p} ns, execution time: ${m-p} ns`)}ge(`GPU`,`${c}::${d}::${f}`)}e.unmap(),this.pendingQueries.delete(e)}),ye()}run(e,t,n,r,i,a){ve(e.name);let o=[];for(let e=0;e<t.length;++e){let n=t[e].data;if(n===0)continue;let r=this.gpuDataManager.get(n);if(!r)throw Error(`no GPU data for input: ${n}`);o.push(r)}let{outputs:s,dispatchGroup:c,programUniforms:l}=e.getRunData(t),u=n.length===0?s.map((e,t)=>t):n;if(u.length!==s.length)throw Error(`Output size ${u.length} must be equal to ${s.length}.`);let d=[],f=[];for(let e=0;e<s.length;++e){if(!Number.isInteger(u[e])||u[e]<-3||u[e]>=a)throw Error(`Invalid output index: ${u[e]}`);if(u[e]===-3)continue;let t=u[e]===-1,n=u[e]===-2,o=t||n?i(s[e].dataType,s[e].dims):r(u[e],s[e].dataType,s[e].dims);if(d.push(o),o.data===0)continue;let c=this.gpuDataManager.get(o.data);if(!c)throw Error(`no GPU data for output: ${o.data}`);if(t&&this.temporaryData.push(c),n){let e=this.kernelPersistentData.get(this.currentKernelId);e||(e=[],this.kernelPersistentData.set(this.currentKernelId,e)),e.push(c)}f.push(c)}if(o.length!==t.length||f.length!==d.length){if(f.length===0)return ye(e.name),d;throw Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let p;if(l){let e=0,t=[];l.forEach(n=>{let r=typeof n.data==`number`?[n.data]:n.data;if(r.length===0)return;let i=n.type===10?2:4,a,o;n.type===10?(o=r.length>4?16:r.length>2?8:r.length*i,a=r.length>4?16:i*r.length):(o=r.length<=2?r.length*i:16,a=16),e=Math.ceil(e/o)*o,t.push(e);let s=n.type===10?8:4;e+=r.length>4?Math.ceil(r.length/s)*a:r.length*i}),e=Math.ceil(e/16)*16;let n=new ArrayBuffer(e);l.forEach((e,r)=>{let i=t[r],a=typeof e.data==`number`?[e.data]:e.data;if(e.type===6)new Int32Array(n,i,a.length).set(a);else if(e.type===12)new Uint32Array(n,i,a.length).set(a);else if(e.type===10)new Uint16Array(n,i,a.length).set(a);else if(e.type===1)new Float32Array(n,i,a.length).set(a);else throw Error(`Unsupported uniform type: ${pt(e.type)}`)});let r=this.gpuDataManager.create(e,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(r.buffer,0,n,0,e),this.gpuDataManager.release(r.id),p={offset:0,size:e,buffer:r.buffer}}let m=this.programManager.normalizeDispatchGroupSize(c),h=m[1]===1&&m[2]===1,g=_u(e,t,h),_=this.programManager.getArtifact(g);if(_||(_=this.programManager.build(e,m),this.programManager.setArtifact(g,_),H(`info`,()=>`[artifact] key: ${g}, programName: ${e.name}`)),l&&_.uniformVariablesInfo){if(l.length!==_.uniformVariablesInfo.length)throw Error(`Uniform variables count mismatch: expect ${_.uniformVariablesInfo.length}, got ${l.length} in program "${_.programInfo.name}".`);for(let e=0;e<l.length;e++){let t=l[e],n=t.type,r=typeof t.data==`number`?1:t.data.length,[i,a]=_.uniformVariablesInfo[e];if(n!==i||r!==a)throw Error(`Uniform variable ${e} mismatch: expect type ${i} with size ${a}, got type ${n} with size ${r} in program "${_.programInfo.name}".`)}}if(H(`info`,()=>`[ProgramManager] run "${e.name}" (key=${g}) with ${m[0]}x${m[1]}x${m[2]}`),this.queryType!==`none`||this.sessionStatus===`capturing`){let e={kernelId:this.currentKernelId,programName:_.programInfo.name,inputTensorViews:t,outputTensorViews:d};this.pendingKernels.push(e),this.sessionStatus===`capturing`&&this.capturedPendingKernels.get(this.currentSessionId).push(e)}return this.programManager.run(_,o,f,m,p),ye(e.name),d}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,n,r){let i=du.get(e);if(!i)throw Error(`kernel not implemented: ${e}`);let a={kernelType:e,kernelName:r,kernelEntry:i[0],attributes:[i[1],n]};this.kernels.set(t,a)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let e of t)this.gpuDataManager.release(e.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,n){let r=this.kernels.get(e);if(!r)throw Error(`kernel not created: ${e}`);let i=r.kernelType,a=r.kernelName,o=r.kernelEntry,s=r.attributes;if(this.currentKernelId!==null)throw Error(`kernel "[${i}] ${a}" is not allowed to be called recursively`);this.currentKernelId=e,s[0]&&=(s[1]=s[0](s[1]),void 0),H(`info`,()=>`[WebGPU] Start to run kernel "[${i}] ${a}"...`);let c=this.env.debug;this.temporaryData=[];try{return c&&this.device.pushErrorScope(`validation`),o(t,s[1]),0}catch(e){return n.push(Promise.resolve(`[WebGPU] Kernel "[${i}] ${a}" failed. ${e}`)),1}finally{c&&n.push(this.device.popErrorScope().then(e=>e?`GPU validation error for kernel "[${i}] ${a}": ${e.message}`:null));for(let e of this.temporaryData)this.gpuDataManager.release(e.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,n,r){let i=this.sessionExternalDataMapping.get(e);i||(i=new Map,this.sessionExternalDataMapping.set(e,i));let a=i.get(t),o=this.gpuDataManager.registerExternalBuffer(n,r,a);return i.set(t,[o,n]),o}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(e=>this.gpuDataManager.unregisterExternalBuffer(e[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,n){return async()=>{let r=await an(this,e,t);return Pt(r.buffer,n)}}writeTimestamp(e){this.queryType===`inside-passes`&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){this.queryType=`none`,(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>`u`?this.env.wasm.trace:this.env.trace))&&(this.device.features.has(`chromium-experimental-timestamp-query-inside-passes`)?this.queryType=`inside-passes`:this.device.features.has(`timestamp-query`)&&(this.queryType=`at-passes`),this.queryType!==`none`&&typeof this.querySet>`u`&&(this.querySet=this.device.createQuerySet({type:`timestamp`,count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){H(`info`,`captureBegin`),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus=`capturing`}captureEnd(){H(`info`,`captureEnd`),this.flush(),this.sessionStatus=`default`}replay(){H(`info`,`replay`),this.sessionStatus=`replaying`;let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),n=e.length;this.pendingKernels=[];for(let r=0;r<n;r++){let n=this.getComputePassEncoder(),i=e[r];this.writeTimestamp(this.pendingDispatchNumber*2),n.setPipeline(i.computePipeline),n.setBindGroup(0,i.bindGroup),n.dispatchWorkgroups(...i.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!==`none`&&this.pendingKernels.push(t[r]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType===`at-passes`)&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus=`default`}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),xu={};s(xu,{init:()=>wu});var Su,Cu,wu,Tu=o(()=>{V(),U(),G(),Xt(),Su=class e{constructor(e,t,n,r){this.module=e,this.dataType=t,this.data=n,this.dims=r}getFloat32Array(){if(this.dataType!==1)throw Error(`Invalid data type`);let e=W.size(this.dims);return e===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,e)}getBigInt64Array(){if(this.dataType!==7)throw Error(`Invalid data type`);let e=W.size(this.dims);return e===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,e)}getInt32Array(){if(this.dataType!==6)throw Error(`Invalid data type`);let e=W.size(this.dims);return e===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,e)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw Error(`Invalid data type`);let e=W.size(this.dims);return e===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,e)}reshape(t){if(W.size(t)!==W.size(this.dims))throw Error(`Invalid new shape`);return new e(this.module,this.dataType,this.data,t)}},Cu=class{constructor(e,t,n){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let r=e.PTR_SIZE,i=n/e.PTR_SIZE,a=r===4?`i32`:`i64`;this.opKernelContext=Number(e.getValue(r*i++,a));let o=Number(e.getValue(r*i++,a));this.outputCount=Number(e.getValue(r*i++,a)),this.customDataOffset=Number(e.getValue(r*i++,`*`)),this.customDataSize=Number(e.getValue(r*i++,a));let s=[];for(let t=0;t<o;t++){let t=Number(e.getValue(r*i++,a)),n=Number(e.getValue(r*i++,`*`)),o=Number(e.getValue(r*i++,a)),c=[];for(let t=0;t<o;t++)c.push(Number(e.getValue(r*i++,a)));s.push(new Su(e,t,n,c))}this.inputs=s}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){let n=t?.inputs?.map(e=>typeof e==`number`?this.inputs[e]:e)??this.inputs,r=t?.outputs??[];return this.backend.run(e,n,r,(e,t,n)=>new Su(this.module,t,this.output(e,n),n),(e,t)=>{let n=mt(e,t);if(!n)throw Error(`Unsupported data type: ${e}`);let r=n>0?this.backend.gpuDataManager.create(n).id:0;return new Su(this.module,e,r,t)},this.outputCount)}output(e,t){let n=this.module.stackSave();try{let n=this.module.PTR_SIZE,r=n===4?`i32`:`i64`,i=this.module.stackAlloc((1+t.length)*n);this.module.setValue(i,t.length,r);for(let e=0;e<t.length;e++)this.module.setValue(i+n*(e+1),t[e],r);return this.module._JsepOutput(this.opKernelContext,e,i)}catch(n){throw Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${n}`)}finally{this.module.stackRestore(n)}}},wu=async(e,t,n,r)=>{let i=t.jsepInit;if(!i)throw Error(`Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.`);if(e===`webgpu`){let e=(bu(),l(hu)).WebGpuBackend,a=new e;await a.initialize(n,r),i(`webgpu`,[a,e=>a.alloc(Number(e)),e=>a.free(e),(e,n,r,i=!1)=>{if(i)H(`verbose`,()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(e)}, dst=${Number(n)}, size=${Number(r)}`),a.memcpy(Number(e),Number(n));else{H(`verbose`,()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(e)}, gpuDataId=${Number(n)}, size=${Number(r)}`);let i=t.HEAPU8.subarray(Number(e>>>0),Number(e>>>0)+Number(r));a.upload(Number(n),i)}},async(e,n,r)=>{H(`verbose`,()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${e}, dataOffset=${n}, size=${r}`),await a.download(Number(e),()=>t.HEAPU8.subarray(Number(n)>>>0,Number(n+r)>>>0))},(e,n,r)=>a.createKernel(e,Number(n),r,t.UTF8ToString(t._JsepGetNodeName(Number(n)))),e=>a.releaseKernel(e),(e,n,r,i)=>{H(`verbose`,()=>`[WebGPU] jsepRun: sessionHandle=${r}, kernel=${e}, contextDataOffset=${n}`);let o=new Cu(t,a,Number(n));return a.computeKernel(Number(e),o,i)},()=>a.captureBegin(),()=>a.captureEnd(),()=>a.replay()])}else{let e=new Yt(n);i(`webnn`,[e,()=>e.reserveTensorId(),t=>e.releaseTensorId(t),async(t,n,r,i,a)=>e.ensureTensor(t,n,r,i,a),(t,n)=>{e.uploadTensor(t,n)},async(t,n)=>e.downloadTensor(t,n),(t,n)=>e.registerMLContext(t,n),!!n.trace])}}}),Eu,Du,Ou,ku,Au,ju,Mu,Nu,Pu,Fu,Iu,Lu,Ru,zu=o(()=>{j(),it(),dt(),V(),et(),nt(),xt(),Eu=(e,t)=>{R()._OrtInit(e,t)!==0&&B(`Can't initialize onnxruntime.`)},Du=async e=>{Eu(e.wasm.numThreads,gt(e.logLevel))},Ou=async(e,t)=>{R().asyncInit?.();let n=e.webgpu.adapter;if(t===`webgpu`){if(typeof navigator>`u`||!navigator.gpu)throw Error(`WebGPU is not supported in current environment`);if(n){if(typeof n.limits!=`object`||typeof n.features!=`object`||typeof n.requestDevice!=`function`)throw Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let t=e.webgpu.powerPreference;if(t!==void 0&&t!==`low-power`&&t!==`high-performance`)throw Error(`Invalid powerPreference setting: "${t}"`);let r=e.webgpu.forceFallbackAdapter;if(r!==void 0&&typeof r!=`boolean`)throw Error(`Invalid forceFallbackAdapter setting: "${r}"`);if(n=await navigator.gpu.requestAdapter({powerPreference:t,forceFallbackAdapter:r}),!n)throw Error(`Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.`)}}if(t===`webnn`&&(typeof navigator>`u`||!navigator.ml))throw Error(`WebNN is not supported in current environment`);{let r=(Tu(),l(xu)).init;t===`webgpu`&&await r(`webgpu`,R(),e,n),t===`webnn`&&await r(`webnn`,R(),e)}},ku=new Map,Au=e=>{let t=R(),n=t.stackSave();try{let n=t.PTR_SIZE,r=t.stackAlloc(2*n);t._OrtGetInputOutputCount(e,r,r+n)!==0&&B(`Can't get session input/output count.`);let i=n===4?`i32`:`i64`;return[Number(t.getValue(r,i)),Number(t.getValue(r+n,i))]}finally{t.stackRestore(n)}},ju=(e,t)=>{let n=R(),r=n.stackSave(),i=0;try{let r=n.PTR_SIZE,a=n.stackAlloc(2*r);n._OrtGetInputOutputMetadata(e,t,a,a+r)!==0&&B(`Can't get session input/output metadata.`);let o=Number(n.getValue(a,`*`));i=Number(n.getValue(a+r,`*`));let s=n.HEAP32[i/4];if(s===0)return[o,0];let c=n.HEAPU32[i/4+1],l=[];for(let e=0;e<c;e++){let t=Number(n.getValue(i+8+e*r,`*`));l.push(t===0?Number(n.getValue(i+8+(e+c)*r,`*`)):n.UTF8ToString(t))}return[o,s,l]}finally{n.stackRestore(r),i!==0&&n._OrtFree(i)}},Mu=e=>{let t=R(),n=t._malloc(e.byteLength);if(n===0)throw Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,n),[n,e.byteLength]},Nu=async(e,t)=>{let n,r,i=R();Array.isArray(e)?[n,r]=e:e.buffer===i.HEAPU8.buffer?[n,r]=[e.byteOffset,e.byteLength]:[n,r]=Mu(e);let a=0,o=0,s=0,c=[],l=[],u=[];try{if([o,c]=await ut(t),t?.externalData&&i.mountExternalData){let e=[];for(let n of t.externalData){let t=typeof n==`string`?n:n.path;e.push(bt(typeof n==`string`?n:n.data).then(e=>{i.mountExternalData(t,e)}))}await Promise.all(e)}for(let e of t?.executionProviders??[])if((typeof e==`string`?e:e.name)===`webnn`){if(i.shouldTransferToMLTensor=!1,typeof e!=`string`){let t=e,n=t?.context,r=t?.gpuDevice,a=t?.deviceType,o=t?.powerPreference;n?i.currentContext=n:r?i.currentContext=await i.webnnCreateMLContext(r):i.currentContext=await i.webnnCreateMLContext({deviceType:a,powerPreference:o})}else i.currentContext=await i.webnnCreateMLContext();break}a=await i._OrtCreateSession(n,r,o),i.webgpuOnCreateSession?.(a),a===0&&B(`Can't create a session.`),i.jsepOnCreateSession?.(),i.currentContext&&(i.webnnRegisterMLContext(a,i.currentContext),i.currentContext=void 0,i.shouldTransferToMLTensor=!0);let[e,d]=Au(a),f=!!t?.enableGraphCapture,p=[],m=[],h=[],g=[],_=[];for(let t=0;t<e;t++){let[e,n,r]=ju(a,t);e===0&&B(`Can't get an input name.`),l.push(e);let o=i.UTF8ToString(e);p.push(o),h.push(n===0?{name:o,isTensor:!1}:{name:o,isTensor:!0,type:pt(n),shape:r})}for(let n=0;n<d;n++){let[r,o,s]=ju(a,n+e);r===0&&B(`Can't get an output name.`),u.push(r);let c=i.UTF8ToString(r);m.push(c),g.push(o===0?{name:c,isTensor:!1}:{name:c,isTensor:!0,type:pt(o),shape:s});{if(f&&t?.preferredOutputLocation===void 0){_.push(`gpu-buffer`);continue}let e=typeof t?.preferredOutputLocation==`string`?t.preferredOutputLocation:t?.preferredOutputLocation?.[c]??`cpu`,n=i.webnnIsGraphOutput;if(e===`cpu`&&n&&n(a,c)){_.push(`ml-tensor-cpu-output`);continue}if(e!==`cpu`&&e!==`cpu-pinned`&&e!==`gpu-buffer`&&e!==`ml-tensor`)throw Error(`Not supported preferred output location: ${e}.`);if(f&&e!==`gpu-buffer`)throw Error(`Not supported preferred output location: ${e}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);_.push(e)}}let v=null;return _.some(e=>e===`gpu-buffer`||e===`ml-tensor`||e===`ml-tensor-cpu-output`)&&(s=i._OrtCreateBinding(a),s===0&&B(`Can't create IO binding.`),v={handle:s,outputPreferredLocations:_,outputPreferredLocationsEncoded:_.map(e=>e===`ml-tensor-cpu-output`?`ml-tensor`:e).map(e=>yt(e))}),ku.set(a,[a,l,u,v,f,!1]),[a,p,m,h,g]}catch(e){throw l.forEach(e=>i._OrtFree(e)),u.forEach(e=>i._OrtFree(e)),s!==0&&i._OrtReleaseBinding(s)!==0&&B(`Can't release IO binding.`),a!==0&&i._OrtReleaseSession(a)!==0&&B(`Can't release session.`),e}finally{i._free(n),o!==0&&i._OrtReleaseSessionOptions(o)!==0&&B(`Can't release session options.`),c.forEach(e=>i._free(e)),i.unmountExternalData?.()}},Pu=e=>{let t=R(),n=ku.get(e);if(!n)throw Error(`cannot release session. invalid session id: ${e}`);let[r,i,a,o,s]=n;o&&(s&&t._OrtClearBoundOutputs(o.handle)!==0&&B(`Can't clear bound outputs.`),t._OrtReleaseBinding(o.handle)!==0&&B(`Can't release IO binding.`)),t.jsepOnReleaseSession?.(e),t.webnnOnReleaseSession?.(e),t.webgpuOnReleaseSession?.(e),i.forEach(e=>t._OrtFree(e)),a.forEach(e=>t._OrtFree(e)),t._OrtReleaseSession(r)!==0&&B(`Can't release session.`),ku.delete(e)},Fu=async(e,t,n,r,i,a,o=!1)=>{if(!e){t.push(0);return}let s=R(),c=s.PTR_SIZE,l=e[0],u=e[1],d=e[3],f=d,p,m;if(l===`string`&&(d===`gpu-buffer`||d===`ml-tensor`))throw Error(`String tensor is not supported on GPU.`);if(o&&d!==`gpu-buffer`)throw Error(`External buffer must be provided for input/output index ${a} when enableGraphCapture is true.`);if(d===`gpu-buffer`){let t=e[2].gpuBuffer;m=mt(ft(l),u);{let e=s.jsepRegisterBuffer;if(!e)throw Error(`Tensor location "gpu-buffer" is not supported without using WebGPU.`);p=e(r,a,t,m)}}else if(d===`ml-tensor`){let t=e[2].mlTensor;m=mt(ft(l),u);let n=s.webnnRegisterMLTensor;if(!n)throw Error(`Tensor location "ml-tensor" is not supported without using WebNN.`);p=n(r,t,ft(l),u)}else{let t=e[2];if(Array.isArray(t)){m=c*t.length,p=s._malloc(m),n.push(p);for(let e=0;e<t.length;e++){if(typeof t[e]!=`string`)throw TypeError(`tensor data at index ${e} is not a string`);s.setValue(p+e*c,tt(t[e],n),`*`)}}else{let e=s.webnnIsGraphInput,a=s.webnnIsGraphOutput;if(l!==`string`&&e&&a){let o=s.UTF8ToString(i);if(e(r,o)||a(r,o)){let e=ft(l);m=mt(e,u),f=`ml-tensor`;let n=s.webnnCreateTemporaryTensor,i=s.webnnUploadTensor;if(!n||!i)throw Error(`Tensor location "ml-tensor" is not supported without using WebNN.`);let a=await n(r,e,u);i(a,new Uint8Array(t.buffer,t.byteOffset,t.byteLength)),p=a}else m=t.byteLength,p=s._malloc(m),n.push(p),s.HEAPU8.set(new Uint8Array(t.buffer,t.byteOffset,m),p)}else m=t.byteLength,p=s._malloc(m),n.push(p),s.HEAPU8.set(new Uint8Array(t.buffer,t.byteOffset,m),p)}}let h=s.stackSave(),g=s.stackAlloc(4*u.length);try{u.forEach((e,t)=>s.setValue(g+t*c,e,c===4?`i32`:`i64`));let e=s._OrtCreateTensor(ft(l),p,m,g,u.length,yt(f));e===0&&B(`Can't create tensor for input/output. session=${r}, index=${a}.`),t.push(e)}finally{s.stackRestore(h)}},Iu=async(e,t,n,r,i,a)=>{let o=R(),s=o.PTR_SIZE,c=ku.get(e);if(!c)throw Error(`cannot run inference. invalid session id: ${e}`);let l=c[0],u=c[1],d=c[2],f=c[3],p=c[4],m=c[5],h=t.length,g=r.length,_=0,v=[],y=[],b=[],x=[],S=[],C=o.stackSave(),w=o.stackAlloc(h*s),T=o.stackAlloc(h*s),E=o.stackAlloc(g*s),D=o.stackAlloc(g*s);try{[_,v]=rt(a),be(`wasm prepareInputOutputTensor`);for(let r=0;r<h;r++)await Fu(n[r],y,x,e,u[t[r]],t[r],p);for(let t=0;t<g;t++)await Fu(i[t],b,x,e,d[r[t]],h+r[t],p);xe(`wasm prepareInputOutputTensor`);for(let e=0;e<h;e++)o.setValue(w+e*s,y[e],`*`),o.setValue(T+e*s,u[t[e]],`*`);for(let e=0;e<g;e++)o.setValue(E+e*s,b[e],`*`),o.setValue(D+e*s,d[r[e]],`*`);if(f&&!m){let{handle:n,outputPreferredLocations:a,outputPreferredLocationsEncoded:s}=f;if(u.length!==h)throw Error(`input count from feeds (${h}) is expected to be always equal to model's input count (${u.length}).`);be(`wasm bindInputsOutputs`);for(let r=0;r<h;r++){let i=t[r];await o._OrtBindInput(n,u[i],y[r])!==0&&B(`Can't bind input[${r}] for session=${e}.`)}for(let t=0;t<g;t++){let c=r[t];i[t]?.[3]?(S.push(b[t]),o._OrtBindOutput(n,d[c],b[t],0)!==0&&B(`Can't bind pre-allocated output[${t}] for session=${e}.`)):o._OrtBindOutput(n,d[c],0,s[c])!==0&&B(`Can't bind output[${t}] to ${a[t]} for session=${e}.`)}xe(`wasm bindInputsOutputs`),ku.set(e,[l,u,d,f,p,!0])}o.jsepOnRunStart?.(l),o.webnnOnRunStart?.(l);let c;c=f?await o._OrtRunWithBinding(l,f.handle,g,E,_):await o._OrtRun(l,T,w,h,D,g,E,_),c!==0&&B(`failed to call OrtRun().`);let C=[],ee=[];be(`wasm ProcessOutputTensor`);for(let t=0;t<g;t++){let n=Number(o.getValue(E+t*s,`*`));if(n===b[t]||S.includes(b[t])){C.push(i[t]),n!==b[t]&&o._OrtReleaseTensor(n)!==0&&B(`Can't release tensor.`);continue}let a=o.stackSave(),c=o.stackAlloc(4*s),l=!1,u,d=0;try{o._OrtGetTensorData(n,c,c+s,c+2*s,c+3*s)!==0&&B(`Can't access output tensor data on index ${t}.`);let i=s===4?`i32`:`i64`,a=Number(o.getValue(c,i));d=o.getValue(c+s,`*`);let p=o.getValue(c+s*2,`*`),m=Number(o.getValue(c+s*3,i)),h=[];for(let e=0;e<m;e++)h.push(Number(o.getValue(p+e*s,i)));o._OrtFree(p)!==0&&B(`Can't free memory for tensor dims.`);let g=h.reduce((e,t)=>e*t,1);u=pt(a);let _=f?.outputPreferredLocations[r[t]];if(u===`string`){if(_===`gpu-buffer`||_===`ml-tensor`)throw Error(`String tensor is not supported on GPU.`);let e=[];for(let t=0;t<g;t++){let n=o.getValue(d+t*s,`*`),r=o.getValue(d+(t+1)*s,`*`),i=t===g-1?void 0:r-n;e.push(o.UTF8ToString(n,i))}C.push([u,h,e,`cpu`])}else if(_===`gpu-buffer`&&g>0){let e=o.jsepGetBuffer;if(!e)throw Error(`preferredLocation "gpu-buffer" is not supported without using WebGPU.`);let t=e(d),r=mt(a,g);if(r===void 0||!_t(u))throw Error(`Unsupported data type: ${u}`);l=!0,C.push([u,h,{gpuBuffer:t,download:o.jsepCreateDownloader(t,r,u),dispose:()=>{o._OrtReleaseTensor(n)!==0&&B(`Can't release tensor.`)}},`gpu-buffer`])}else if(_===`ml-tensor`&&g>0){let t=o.webnnEnsureTensor,r=o.webnnIsGraphInputOutputTypeSupported;if(!t||!r)throw Error(`preferredLocation "ml-tensor" is not supported without using WebNN.`);if(mt(a,g)===void 0||!vt(u))throw Error(`Unsupported data type: ${u}`);if(!r(e,u,!1))throw Error(`preferredLocation "ml-tensor" for ${u} output is not supported by current WebNN Context.`);let i=await t(e,d,a,h,!1);l=!0,C.push([u,h,{mlTensor:i,download:o.webnnCreateMLTensorDownloader(d,u),dispose:()=>{o.webnnReleaseTensorId(d),o._OrtReleaseTensor(n)}},`ml-tensor`])}else if(_===`ml-tensor-cpu-output`&&g>0){let e=o.webnnCreateMLTensorDownloader(d,u)(),t=C.length;l=!0,ee.push((async()=>{let r=[t,await e];return o.webnnReleaseTensorId(d),o._OrtReleaseTensor(n),r})()),C.push([u,h,[],`cpu`])}else{let e=new(ht(u))(g);new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(o.HEAPU8.subarray(d,d+e.byteLength)),C.push([u,h,e,`cpu`])}}finally{o.stackRestore(a),u===`string`&&d&&o._free(d),l||o._OrtReleaseTensor(n)}}f&&!p&&(o._OrtClearBoundOutputs(f.handle)!==0&&B(`Can't clear bound outputs.`),ku.set(e,[l,u,d,f,p,!1]));for(let[e,t]of await Promise.all(ee))C[e][2]=t;return xe(`wasm ProcessOutputTensor`),C}finally{o.webnnOnRunEnd?.(l),o.stackRestore(C),y.forEach(e=>o._OrtReleaseTensor(e)),b.forEach(e=>o._OrtReleaseTensor(e)),x.forEach(e=>o._free(e)),_!==0&&o._OrtReleaseRunOptions(_),v.forEach(e=>o._free(e))}},Lu=e=>{let t=R(),n=ku.get(e);if(!n)throw Error(`invalid session id`);let r=n[0],i=t._OrtEndProfiling(r);i===0&&B(`Can't get an profile file name.`),t._OrtFree(i)},Ru=e=>{let t=[];for(let n of e){let e=n[2];!Array.isArray(e)&&`buffer`in e&&t.push(e.buffer)}return t}}),Bu,Vu,Hu,Uu,Wu,Gu,Ku,qu,Ju,Yu,Xu,Zu,Qu,$u,ed,td,nd,rd,id=o(()=>{j(),zu(),et(),Ye(),Bu=()=>!!S.wasm.proxy&&typeof document<`u`,Hu=!1,Uu=!1,Wu=!1,qu=new Map,Ju=(e,t)=>{let n=qu.get(e);n?n.push(t):qu.set(e,[t])},Yu=()=>{if(Hu||!Uu||Wu||!Vu)throw Error(`worker not ready`)},Xu=e=>{switch(e.data.type){case`init-wasm`:Hu=!1,e.data.err?(Wu=!0,Ku[1](e.data.err)):(Uu=!0,Ku[0]()),Gu&&=(URL.revokeObjectURL(Gu),void 0);break;case`init-ep`:case`copy-from`:case`create`:case`release`:case`run`:case`end-profiling`:{let t=qu.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},Zu=async()=>{if(!Uu){if(Hu)throw Error(`multiple calls to 'initWasm()' detected.`);if(Wu)throw Error(`previous call to 'initWasm()' failed.`);if(Hu=!0,Bu())return new Promise((e,t)=>{Vu?.terminate(),Ke().then(([n,r])=>{try{Vu=r,Vu.onerror=e=>t(e),Vu.onmessage=Xu,Ku=[e,t];let i={type:`init-wasm`,in:S};if(!i.in.wasm.wasmPaths&&n){let e=Be();e&&(i.in.wasm.wasmPaths=e)}Vu.postMessage(i),Gu=n}catch(e){t(e)}},t)});try{await L(S.wasm),await Du(S),Uu=!0}catch(e){throw Wu=!0,e}finally{Hu=!1}}},Qu=async e=>{if(Bu())return Yu(),new Promise((t,n)=>{Ju(`init-ep`,[t,n]);let r={type:`init-ep`,in:{epName:e,env:S}};Vu.postMessage(r)});await Ou(S,e)},$u=async e=>Bu()?(Yu(),new Promise((t,n)=>{Ju(`copy-from`,[t,n]);let r={type:`copy-from`,in:{buffer:e}};Vu.postMessage(r,[e.buffer])})):Mu(e),ed=async(e,t)=>{if(Bu()){if(t?.preferredOutputLocation)throw Error(`session option "preferredOutputLocation" is not supported for proxy.`);return Yu(),new Promise((n,r)=>{Ju(`create`,[n,r]);let i={type:`create`,in:{model:e,options:{...t}}},a=[];e instanceof Uint8Array&&a.push(e.buffer),Vu.postMessage(i,a)})}else return Nu(e,t)},td=async e=>{if(Bu())return Yu(),new Promise((t,n)=>{Ju(`release`,[t,n]);let r={type:`release`,in:e};Vu.postMessage(r)});Pu(e)},nd=async(e,t,n,r,i,a)=>{if(Bu()){if(n.some(e=>e[3]!==`cpu`))throw Error(`input tensor on GPU is not supported for proxy.`);if(i.some(e=>e))throw Error(`pre-allocated output tensor is not supported for proxy.`);return Yu(),new Promise((i,o)=>{Ju(`run`,[i,o]);let s=n,c={type:`run`,in:{sessionId:e,inputIndices:t,inputs:s,outputIndices:r,options:a}};Vu.postMessage(c,Ru(s))})}else return Iu(e,t,n,r,i,a)},rd=async e=>{if(Bu())return Yu(),new Promise((t,n)=>{Ju(`end-profiling`,[t,n]);let r={type:`end-profiling`,in:e};Vu.postMessage(r)});Lu(e)}}),ad,od,sd,cd=o(()=>{j(),id(),V(),Me(),xt(),ad=(e,t)=>{switch(e.location){case`cpu`:return[e.type,e.dims,e.data,`cpu`];case`gpu-buffer`:return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},`gpu-buffer`];case`ml-tensor`:return[e.type,e.dims,{mlTensor:e.mlTensor},`ml-tensor`];default:throw Error(`invalid data location: ${e.location} for ${t()}`)}},od=e=>{switch(e[3]){case`cpu`:return new A(e[0],e[2],e[1]);case`gpu-buffer`:{let t=e[0];if(!_t(t))throw Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:n,download:r,dispose:i}=e[2];return A.fromGpuBuffer(n,{dataType:t,dims:e[1],download:r,dispose:i})}case`ml-tensor`:{let t=e[0];if(!vt(t))throw Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:n,download:r,dispose:i}=e[2];return A.fromMLTensor(n,{dataType:t,dims:e[1],download:r,dispose:i})}default:throw Error(`invalid data location: ${e[3]}`)}},sd=class{async fetchModelAndCopyToWasmMemory(e){return $u(await bt(e))}async loadModel(e,t){ve();let n;n=typeof e==`string`?await this.fetchModelAndCopyToWasmMemory(e):e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await ed(n,t),ye()}async dispose(){return td(this.sessionId)}async run(e,t,n){ve();let r=[],i=[];Object.entries(e).forEach(e=>{let t=e[0],n=e[1],a=this.inputNames.indexOf(t);if(a===-1)throw Error(`invalid input '${t}'`);r.push(n),i.push(a)});let a=[],o=[];Object.entries(t).forEach(e=>{let t=e[0],n=e[1],r=this.outputNames.indexOf(t);if(r===-1)throw Error(`invalid output '${t}'`);a.push(n),o.push(r)});let s=r.map((e,t)=>ad(e,()=>`input "${this.inputNames[i[t]]}"`)),c=a.map((e,t)=>e?ad(e,()=>`output "${this.outputNames[o[t]]}"`):null),l=await nd(this.sessionId,i,s,o,c,n),u={};for(let e=0;e<l.length;e++)u[this.outputNames[o[e]]]=a[e]??od(l[e]);return ye(),u}startProfiling(){}endProfiling(){rd(this.sessionId)}}}),ld={};s(ld,{OnnxruntimeWebAssemblyBackend:()=>dd,initializeFlags:()=>ud,wasmBackend:()=>fd});var ud,dd,fd,pd=o(()=>{j(),id(),cd(),ud=()=>{(typeof S.wasm.initTimeout!=`number`||S.wasm.initTimeout<0)&&(S.wasm.initTimeout=0);let e=S.wasm.simd;if(typeof e!=`boolean`&&e!==void 0&&e!==`fixed`&&e!==`relaxed`&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),S.wasm.simd=!1),typeof S.wasm.proxy!=`boolean`&&(S.wasm.proxy=!1),typeof S.wasm.trace!=`boolean`&&(S.wasm.trace=!1),typeof S.wasm.numThreads!=`number`||!Number.isInteger(S.wasm.numThreads)||S.wasm.numThreads<=0)if(typeof self<`u`&&!self.crossOriginIsolated)S.wasm.numThreads=1;else{let e=typeof navigator>`u`?a(`node:os`).cpus().length:navigator.hardwareConcurrency;S.wasm.numThreads=Math.min(4,Math.ceil((e||1)/2))}},dd=class{async init(e){ud(),await Zu(),await Qu(e)}async createInferenceSessionHandler(e,t){let n=new sd;return await n.loadModel(e,t),n}},fd=new dd}),md={};s(md,{InferenceSession:()=>Te,TRACE:()=>ge,TRACE_EVENT_BEGIN:()=>be,TRACE_EVENT_END:()=>xe,TRACE_FUNC_BEGIN:()=>ve,TRACE_FUNC_END:()=>ye,Tensor:()=>A,default:()=>gd,env:()=>S,registerBackend:()=>f}),j(),j(),j();var hd=`1.27.0`,gd=je;{let e=(pd(),l(ld)).wasmBackend;f(`webgpu`,e,5),f(`webnn`,e,5),f(`cpu`,e,10),f(`wasm`,e,10)}return Object.defineProperty(S.versions,"web",{value:hd,enumerable:!0}),l(md)})();typeof t==`object`&&typeof n==`object`&&(n.exports=r)})),ve=n((e=>{Object.defineProperty(e,"__esModule",{value:!0})})),ye=n((e=>{var t;Object.defineProperty(e,"__esModule",{value:!0}),e.SileroLegacy=void 0;var n=A(),r=class{constructor(e,t,n,r,i){this.ortInstance=e,this._session=t,this._h=n,this._c=r,this._sr=i,this.reset_state=()=>{let e=Array(128).fill(0);this._h=new this.ortInstance.Tensor(`float32`,e,[2,1,64]),this._c=new this.ortInstance.Tensor(`float32`,e,[2,1,64])},this.process=async e=>{let t={input:new this.ortInstance.Tensor(`float32`,e,[1,e.length]),h:this._h,c:this._c,sr:this._sr},n=await this._session.run(t);this._h=n.hn,this._c=n.cn;let[r]=n.output?.data;return{notSpeech:1-r,isSpeech:r}},this.release=async()=>{await this._session.release(),this._h.dispose(),this._c.dispose(),this._sr.dispose()}}};e.SileroLegacy=r,t=r,r.new=async(e,r)=>{n.log.debug(`initializing vad`);let i=await r(),a=await e.InferenceSession.create(i),o=new e.Tensor(`int64`,[16000n]),s=Array(128).fill(0),c=new e.Tensor(`float32`,s,[2,1,64]),l=new e.Tensor(`float32`,s,[2,1,64]);return n.log.debug(`vad is initialized`),new t(e,a,c,l,o)}})),be=n((e=>{var t;Object.defineProperty(e,"__esModule",{value:!0}),e.SileroV5=void 0;var n=A();function r(e){let t=Array(256).fill(0);return new e.Tensor(`float32`,t,[2,1,128])}var i=class{constructor(e,t,n,i){this._session=e,this._state=t,this._sr=n,this.ortInstance=i,this.reset_state=()=>{this._state=r(this.ortInstance)},this.process=async e=>{let t={input:new this.ortInstance.Tensor(`float32`,e,[1,e.length]),state:this._state,sr:this._sr},n=await this._session.run(t);if(!n.stateN)throw Error(`No state from model`);if(this._state=n.stateN,!n.output?.data)throw Error(`No output from model`);let r=n.output.data[0];if(typeof r!=`number`)throw Error(`Weird output data`);return{notSpeech:1-r,isSpeech:r}},this.release=async()=>{await this._session.release(),this._state.dispose(),this._sr.dispose()}}};e.SileroV5=i,t=i,i.new=async(e,i)=>{n.log.debug(`Loading VAD...`);let a=await i(),o=await e.InferenceSession.create(a),s=new e.Tensor(`int64`,[16000n]),c=r(e);return n.log.debug(`...finished loading VAD`),new t(o,c,s,e)}})),xe=n((e=>{var t=e&&e.__createBinding||(Object.create?(function(e,t,n,r){r===void 0&&(r=n);var i=Object.getOwnPropertyDescriptor(t,n);(!i||(`get`in i?!t.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,i)}):(function(e,t,n,r){r===void 0&&(r=n),e[r]=t[n]})),n=e&&e.__exportStar||function(e,n){for(var r in e)r!=="default"&&!Object.prototype.hasOwnProperty.call(n,r)&&t(n,e,r)};Object.defineProperty(e,"__esModule",{value:!0}),e.SileroV5=e.SileroLegacy=void 0,n(ve(),e);var r=ye();Object.defineProperty(e,"SileroLegacy",{enumerable:!0,get:function(){return r.SileroLegacy}});var i=be();Object.defineProperty(e,"SileroV5",{enumerable:!0,get:function(){return i.SileroV5}})})),Se=n((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Resampler=void 0;var t=A();e.Resampler=class{constructor(e){this.options=e,this.process=e=>{let t=[];for(let n of e)for(this.inputBuffer.push(n);this.hasEnoughDataForFrame();){let e=this.generateOutputFrame();t.push(e)}return t},e.nativeSampleRate<16e3&&t.log.error(`nativeSampleRate is too low. Should have 16000 = targetSampleRate <= nativeSampleRate`),this.inputBuffer=[]}async*stream(e){for(let t of e)for(this.inputBuffer.push(t);this.hasEnoughDataForFrame();)yield this.generateOutputFrame()}hasEnoughDataForFrame(){return this.inputBuffer.length*this.options.targetSampleRate/this.options.nativeSampleRate>=this.options.targetFrameSize}generateOutputFrame(){let e=new Float32Array(this.options.targetFrameSize),t=0,n=0;for(;t<this.options.targetFrameSize;){let r=0,i=0;for(;n<Math.min(this.inputBuffer.length,(t+1)*this.options.nativeSampleRate/this.options.targetSampleRate);){let e=this.inputBuffer[n];e!==void 0&&(r+=e,i++),n++}e[t]=r/i,t++}return this.inputBuffer=this.inputBuffer.slice(n),e}}})),Ce=n((e=>{var t=e&&e.__createBinding||(Object.create?(function(e,t,n,r){r===void 0&&(r=n);var i=Object.getOwnPropertyDescriptor(t,n);(!i||(`get`in i?!t.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,i)}):(function(e,t,n,r){r===void 0&&(r=n),e[r]=t[n]})),n=e&&e.__setModuleDefault||(Object.create?(function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}):function(e,t){e.default=t}),r=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var r={};if(e!=null)for(var i in e)i!=="default"&&Object.prototype.hasOwnProperty.call(e,i)&&t(r,e,i);return n(r,e),r};Object.defineProperty(e,"__esModule",{value:!0}),e.NonRealTimeVAD=e.defaultNonRealTimeVADOptions=void 0;var i=r(_e()),a=k(),o=me(),s=ge(),c=he(),l=xe(),u=Se();e.defaultNonRealTimeVADOptions={...s.defaultFrameProcessorOptions,modelURL:a.baseAssetPath+`silero_vad_legacy.onnx`,modelFetcher:o.defaultModelFetcher},e.NonRealTimeVAD=class{static async new(t={}){let n={...e.defaultNonRealTimeVADOptions,...t};(0,s.validateOptions)(n),n.ortConfig!==void 0&&n.ortConfig(i);let r=()=>n.modelFetcher(n.modelURL),a=await l.SileroLegacy.new(i,r),o=new s.FrameProcessor(a.process,a.reset_state,{positiveSpeechThreshold:n.positiveSpeechThreshold,negativeSpeechThreshold:n.negativeSpeechThreshold,redemptionMs:n.redemptionMs,preSpeechPadMs:n.preSpeechPadMs,minSpeechMs:n.minSpeechMs,submitUserSpeechOnPause:n.submitUserSpeechOnPause},1536/16);return o.resume(),new this(r,i,n,o)}constructor(e,t,n,r){this.modelFetcher=e,this.ort=t,this.options=n,this.frameProcessor=r,this.frameSamples=1536}async*run(e,t){let n={nativeSampleRate:t,targetSampleRate:16e3,targetFrameSize:this.frameSamples},r=new u.Resampler(n),i=0,a=0,o=0;for await(let t of r.stream(e)){let e=[];await this.frameProcessor.process(t,t=>{e.push(t)});for(let t of e)switch(t.msg){case c.Message.SpeechStart:i=o*this.frameSamples/16;break;case c.Message.SpeechEnd:a=(o+1)*this.frameSamples/16,yield{audio:t.audio,start:i,end:a};break;default:break}o++}let s=[];this.frameProcessor.endSegment(e=>{s.push(e)});for(let e of s)switch(e.msg){case c.Message.SpeechEnd:yield{audio:e.audio,start:i,end:o*this.frameSamples/16}}}}})),we=n((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.audioFileToArray=e.encodeWAV=e.arrayBufferToBase64=e.minFramesForTargetMS=void 0;function t(e,t,n=16e3){return Math.ceil(e*n/1e3/t)}e.minFramesForTargetMS=t;function n(e){let t=new Uint8Array(e),n=t.byteLength,r=Array(n);for(let e=0;e<n;e++){let n=t[e];if(n===void 0)break;r[e]=String.fromCharCode(n)}return btoa(r.join(``))}e.arrayBufferToBase64=n;function r(e,t=3,n=16e3,r=1,s=32){let c=s/8,l=r*c,u=new ArrayBuffer(44+e.length*c),d=new DataView(u);return o(d,0,`RIFF`),d.setUint32(4,36+e.length*c,!0),o(d,8,`WAVE`),o(d,12,`fmt `),d.setUint32(16,16,!0),d.setUint16(20,t,!0),d.setUint16(22,r,!0),d.setUint32(24,n,!0),d.setUint32(28,n*l,!0),d.setUint16(32,l,!0),d.setUint16(34,s,!0),o(d,36,`data`),d.setUint32(40,e.length*c,!0),t===1?a(d,44,e):i(d,44,e),u}e.encodeWAV=r;function i(e,t,n){for(let r=0;r<n.length;r++,t+=4)e.setFloat32(t,n[r],!0)}function a(e,t,n){for(let r=0;r<n.length;r++,t+=2){let i=Math.max(-1,Math.min(1,n[r]));e.setInt16(t,i<0?i*32768:i*32767,!0)}}function o(e,t,n){for(let r=0;r<n.length;r++)e.setUint8(t+r,n.charCodeAt(r))}async function s(e){let t=new OfflineAudioContext(1,1,44100),n=new FileReader,r=null;if(await new Promise(i=>{n.addEventListener(`loadend`,()=>{let e=n.result;t.decodeAudioData(e,e=>{r=e,t.startRendering().then(()=>{console.log(`Rendering completed successfully`),i()}).catch(e=>{console.error(`Rendering failed: `,e)})},e=>{console.log(`Error with decoding audio data: `,e)})}),n.readAsArrayBuffer(e)}),r===null)throw Error(`some shit`);let i=r,a=new Float32Array(i.length);for(let e=0;e<i.length;e++)for(let t=0;t<i.numberOfChannels;t++){let n=i.getChannelData(t)[e],r=a[e];if(n===void 0||r===void 0)throw Error(`sample or out[i] is undefined`);a[e]=r+n}return{audio:a,sampleRate:i.sampleRate}}e.audioFileToArray=s})),Te=n(((t,n)=>{fe();var r=(()=>{var t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.prototype.hasOwnProperty,a=(t=>typeof e<`u`?e:typeof Proxy<`u`?new Proxy(t,{get:(t,n)=>(typeof e<`u`?e:t)[n]}):t)(function(t){if(typeof e<`u`)return e.apply(this,arguments);throw Error(`Dynamic require of "`+t+`" is not supported`)}),o=(e,t)=>()=>(e&&(t=e(e=0)),t),s=(e,n)=>{for(var r in n)t(e,r,{get:n[r],enumerable:!0})},c=(e,a,o,s)=>{if(a&&typeof a==`object`||typeof a==`function`)for(let c of r(a))!i.call(e,c)&&c!==o&&t(e,c,{get:()=>a[c],enumerable:!(s=n(a,c))||s.enumerable});return e},l=e=>c(t({},`__esModule`,{value:!0}),e),u,d,f,p,m,h=o(()=>{u=new Map,d=[],f=(e,t,n)=>{if(t&&typeof t.init==`function`&&typeof t.createInferenceSessionHandler==`function`){let r=u.get(e);if(r===void 0)u.set(e,{backend:t,priority:n});else{if(r.priority>n)return;if(r.priority===n&&r.backend!==t)throw Error(`cannot register backend "${e}" using priority ${n}`)}if(n>=0){let t=d.indexOf(e);t!==-1&&d.splice(t,1);for(let t=0;t<d.length;t++)if(u.get(d[t]).priority<=n){d.splice(t,0,e);return}d.push(e)}return}throw TypeError(`not a valid backend`)},p=async e=>{let t=u.get(e);if(!t)return`backend not found.`;if(t.initialized)return t.backend;if(t.aborted)return t.error;{let n=!!t.initPromise;try{return n||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(e){return n||(t.error=`${e}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},m=async e=>{let t=e.executionProviders||[],n=t.map(e=>typeof e==`string`?e:e.name),r=n.length===0?d:n,i,a=[],o=new Set;for(let e of r){let t=await p(e);typeof t==`string`?a.push({name:e,err:t}):(i||=t,i===t&&o.add(e))}if(!i)throw Error(`no available backend found. ERR: ${a.map(e=>`[${e.name}] ${e.err}`).join(`, `)}`);for(let{name:e,err:t}of a)n.includes(e)&&console.warn(`removing requested execution provider "${e}" from session options because it is not available: ${t}`);let s=t.filter(e=>o.has(typeof e==`string`?e:e.name));return[i,new Proxy(e,{get:(e,t)=>t===`executionProviders`?s:Reflect.get(e,t)})]}}),g=o(()=>{h()}),_,v=o(()=>{_=`1.27.0`}),y,b,x=o(()=>{v(),y=`warning`,b={wasm:{},webgl:{},webgpu:{},versions:{common:_},set logLevel(e){if(e!==void 0){if(typeof e!=`string`||[`verbose`,`info`,`warning`,`error`,`fatal`].indexOf(e)===-1)throw Error(`Unsupported logging level: ${e}`);y=e}},get logLevel(){return y}},Object.defineProperty(b,"logLevel",{enumerable:!0})}),S,C=o(()=>{x(),S=b}),w,T,E=o(()=>{w=(e,t)=>{let n=typeof document<`u`?document.createElement(`canvas`):new OffscreenCanvas(1,1);n.width=e.dims[3],n.height=e.dims[2];let r=n.getContext(`2d`);if(r!=null){let i,a;t?.tensorLayout!==void 0&&t.tensorLayout===`NHWC`?(i=e.dims[2],a=e.dims[3]):(i=e.dims[3],a=e.dims[2]);let o=t?.format===void 0?`RGB`:t.format,s=t?.norm,c,l;s===void 0||s.mean===void 0?c=[255,255,255,255]:typeof s.mean==`number`?c=[s.mean,s.mean,s.mean,s.mean]:(c=[s.mean[0],s.mean[1],s.mean[2],0],s.mean[3]!==void 0&&(c[3]=s.mean[3])),s===void 0||s.bias===void 0?l=[0,0,0,0]:typeof s.bias==`number`?l=[s.bias,s.bias,s.bias,s.bias]:(l=[s.bias[0],s.bias[1],s.bias[2],0],s.bias[3]!==void 0&&(l[3]=s.bias[3]));let u=a*i,d=0,f=u,p=u*2,m=-1;o===`RGBA`?(d=0,f=u,p=u*2,m=u*3):o===`RGB`?(d=0,f=u,p=u*2):o===`RBG`&&(d=0,p=u,f=u*2);for(let t=0;t<a;t++)for(let n=0;n<i;n++){let i=(e.data[d++]-l[0])*c[0],a=(e.data[f++]-l[1])*c[1],o=(e.data[p++]-l[2])*c[2],s=m===-1?255:(e.data[m++]-l[3])*c[3];r.fillStyle=`rgba(`+i+`,`+a+`,`+o+`,`+s+`)`,r.fillRect(n,t,1,1)}if(`toDataURL`in n)return n.toDataURL();throw Error(`toDataURL is not supported`)}else throw Error(`Can not access image data`)},T=(e,t)=>{let n=typeof document<`u`?document.createElement(`canvas`).getContext(`2d`):new OffscreenCanvas(1,1).getContext(`2d`),r;if(n!=null){let i,a,o;t?.tensorLayout!==void 0&&t.tensorLayout===`NHWC`?(i=e.dims[2],a=e.dims[1],o=e.dims[3]):(i=e.dims[3],a=e.dims[2],o=e.dims[1]);let s=t!==void 0&&t.format!==void 0?t.format:`RGB`,c=t?.norm,l,u;c===void 0||c.mean===void 0?l=[255,255,255,255]:typeof c.mean==`number`?l=[c.mean,c.mean,c.mean,c.mean]:(l=[c.mean[0],c.mean[1],c.mean[2],255],c.mean[3]!==void 0&&(l[3]=c.mean[3])),c===void 0||c.bias===void 0?u=[0,0,0,0]:typeof c.bias==`number`?u=[c.bias,c.bias,c.bias,c.bias]:(u=[c.bias[0],c.bias[1],c.bias[2],0],c.bias[3]!==void 0&&(u[3]=c.bias[3]));let d=a*i;if(t!==void 0&&(t.format!==void 0&&o===4&&t.format!==`RGBA`||o===3&&t.format!==`RGB`&&t.format!==`BGR`))throw Error(`Tensor format doesn't match input tensor dims`);let f=0,p=1,m=2,h=3,g=0,_=d,v=d*2,y=-1;s===`RGBA`?(g=0,_=d,v=d*2,y=d*3):s===`RGB`?(g=0,_=d,v=d*2):s===`RBG`&&(g=0,v=d,_=d*2),r=n.createImageData(i,a);for(let t=0;t<a*i;f+=4,p+=4,m+=4,h+=4,t++)r.data[f]=(e.data[g++]-u[0])*l[0],r.data[p]=(e.data[_++]-u[1])*l[1],r.data[m]=(e.data[v++]-u[2])*l[2],r.data[h]=y===-1?255:(e.data[y++]-u[3])*l[3]}else throw Error(`Can not access image data`);return r}}),D,ee,te,ne,re,O,ie=o(()=>{me(),D=(e,t)=>{if(e===void 0)throw Error(`Image buffer must be defined`);if(t.height===void 0||t.width===void 0)throw Error(`Image height and width must be defined`);if(t.tensorLayout===`NHWC`)throw Error(`NHWC Tensor layout is not supported yet`);let{height:n,width:r}=t,i=t.norm??{mean:255,bias:0},a,o;a=typeof i.mean==`number`?[i.mean,i.mean,i.mean,i.mean]:[i.mean[0],i.mean[1],i.mean[2],i.mean[3]??255],o=typeof i.bias==`number`?[i.bias,i.bias,i.bias,i.bias]:[i.bias[0],i.bias[1],i.bias[2],i.bias[3]??0];let s=t.format===void 0?`RGBA`:t.format,c=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:`RGB`,l=n*r,u=c===`RGBA`?new Float32Array(l*4):new Float32Array(l*3),d=4,f=0,p=1,m=2,h=3,g=0,_=l,v=l*2,y=-1;s===`RGB`&&(d=3,f=0,p=1,m=2,h=-1),c===`RGBA`?y=l*3:c===`RBG`?(g=0,v=l,_=l*2):c===`BGR`&&(v=0,_=l,g=l*2);for(let t=0;t<l;t++,f+=d,m+=d,p+=d,h+=d)u[g++]=(e[f]+o[0])/a[0],u[_++]=(e[p]+o[1])/a[1],u[v++]=(e[m]+o[2])/a[2],y!==-1&&h!==-1&&(u[y++]=(e[h]+o[3])/a[3]);return c===`RGBA`?new k(`float32`,u,[1,4,n,r]):new k(`float32`,u,[1,3,n,r])},ee=async(e,t)=>{let n=typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement,r=typeof ImageData<`u`&&e instanceof ImageData,i=typeof ImageBitmap<`u`&&e instanceof ImageBitmap,a=typeof e==`string`,o,s=t??{},c=()=>{if(typeof document<`u`)return document.createElement(`canvas`);if(typeof OffscreenCanvas<`u`)return new OffscreenCanvas(1,1);throw Error(`Canvas is not supported`)},l=e=>typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||e instanceof OffscreenCanvas?e.getContext(`2d`):null;if(n){let n=c();n.width=e.width,n.height=e.height;let r=l(n);if(r!=null){let n=e.height,i=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(n=t.resizedHeight,i=t.resizedWidth),t!==void 0){if(s=t,t.tensorFormat!==void 0)throw Error(`Image input config format must be RGBA for HTMLImageElement`);s.tensorFormat=`RGBA`,s.height=n,s.width=i}else s.tensorFormat=`RGBA`,s.height=n,s.width=i;r.drawImage(e,0,0),o=r.getImageData(0,0,i,n).data}else throw Error(`Can not access image data`)}else if(r){let n,r;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(n=t.resizedHeight,r=t.resizedWidth):(n=e.height,r=e.width),t!==void 0&&(s=t),s.format=`RGBA`,s.height=n,s.width=r,t!==void 0){let t=c();t.width=r,t.height=n;let i=l(t);if(i!=null)i.putImageData(e,0,0),o=i.getImageData(0,0,r,n).data;else throw Error(`Can not access image data`)}else o=e.data}else if(i){if(t===void 0)throw Error(`Please provide image config with format for Imagebitmap`);let n=c();n.width=e.width,n.height=e.height;let r=l(n);if(r!=null){let t=e.height,n=e.width;return r.drawImage(e,0,0,n,t),o=r.getImageData(0,0,n,t).data,s.height=t,s.width=n,D(o,s)}else throw Error(`Can not access image data`)}else{if(a)return new Promise((t,n)=>{let r=c(),i=l(r);if(!e||!i)return n();let a=new Image;a.crossOrigin=`Anonymous`,a.src=e,a.onload=()=>{r.width=a.width,r.height=a.height,i.drawImage(a,0,0,r.width,r.height);let e=i.getImageData(0,0,r.width,r.height);s.height=r.height,s.width=r.width,t(D(e.data,s))}});throw Error(`Input data provided is not supported - aborted tensor creation`)}if(o!==void 0)return D(o,s);throw Error(`Input data provided is not supported - aborted tensor creation`)},te=(e,t)=>{let{width:n,height:r,download:i,dispose:a}=t;return new k({location:`texture`,type:`float32`,texture:e,dims:[1,r,n,4],download:i,dispose:a})},ne=(e,t)=>{let{dataType:n,dims:r,download:i,dispose:a}=t;return new k({location:`gpu-buffer`,type:n??`float32`,gpuBuffer:e,dims:r,download:i,dispose:a})},re=(e,t)=>{let{dataType:n,dims:r,download:i,dispose:a}=t;return new k({location:`ml-tensor`,type:n??`float32`,mlTensor:e,dims:r,download:i,dispose:a})},O=(e,t,n)=>new k({location:`cpu-pinned`,type:e,data:t,dims:n??[t.length]})}),ae,oe,se,ce,le=o(()=>{ae=new Map([[`float32`,Float32Array],[`uint8`,Uint8Array],[`int8`,Int8Array],[`uint16`,Uint16Array],[`int16`,Int16Array],[`int32`,Int32Array],[`bool`,Uint8Array],[`float64`,Float64Array],[`uint32`,Uint32Array],[`int4`,Uint8Array],[`uint4`,Uint8Array]]),oe=new Map([[Float32Array,`float32`],[Uint8Array,`uint8`],[Int8Array,`int8`],[Uint16Array,`uint16`],[Int16Array,`int16`],[Int32Array,`int32`],[Float64Array,`float64`],[Uint32Array,`uint32`]]),se=!1,ce=()=>{if(!se){se=!0;let e=typeof BigInt64Array<`u`&&BigInt64Array.from,t=typeof BigUint64Array<`u`&&BigUint64Array.from,n=globalThis.Float16Array,r=typeof n<`u`&&n.from;e&&(ae.set(`int64`,BigInt64Array),oe.set(BigInt64Array,`int64`)),t&&(ae.set(`uint64`,BigUint64Array),oe.set(BigUint64Array,`uint64`)),r?(ae.set(`float16`,n),oe.set(n,`float16`)):ae.set(`float16`,Uint16Array)}}}),ue,de,fe=o(()=>{me(),ue=e=>{let t=1;for(let n=0;n<e.length;n++){let r=e[n];if(typeof r!=`number`||!Number.isSafeInteger(r))throw TypeError(`dims[${n}] must be an integer, got: ${r}`);if(r<0)throw RangeError(`dims[${n}] must be a non-negative integer, got: ${r}`);t*=r}return t},de=(e,t)=>{switch(e.location){case`cpu`:return new k(e.type,e.data,t);case`cpu-pinned`:return new k({location:`cpu-pinned`,data:e.data,type:e.type,dims:t});case`texture`:return new k({location:`texture`,texture:e.texture,type:e.type,dims:t});case`gpu-buffer`:return new k({location:`gpu-buffer`,gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case`ml-tensor`:return new k({location:`ml-tensor`,mlTensor:e.mlTensor,type:e.type,dims:t});default:throw Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),k,me=o(()=>{E(),ie(),le(),fe(),k=class{constructor(e,t,n){ce();let r,i;if(typeof e==`object`&&`location`in e)switch(this.dataLocation=e.location,r=e.type,i=e.dims,e.location){case`cpu-pinned`:{let t=ae.get(r);if(!t)throw TypeError(`unsupported type "${r}" to create tensor from pinned buffer`);if(!(e.data instanceof t))throw TypeError(`buffer should be of type ${t.name}`);this.cpuData=e.data;break}case`texture`:if(r!==`float32`)throw TypeError(`unsupported type "${r}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break;case`gpu-buffer`:if(r!==`float32`&&r!==`float16`&&r!==`int32`&&r!==`int64`&&r!==`uint32`&&r!==`uint8`&&r!==`bool`&&r!==`uint4`&&r!==`int4`)throw TypeError(`unsupported type "${r}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break;case`ml-tensor`:if(r!==`float32`&&r!==`float16`&&r!==`int32`&&r!==`int64`&&r!==`uint32`&&r!==`uint64`&&r!==`int8`&&r!==`uint8`&&r!==`bool`&&r!==`uint4`&&r!==`int4`)throw TypeError(`unsupported type "${r}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break;default:throw Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let a,o;if(typeof e==`string`)if(r=e,o=n,e===`string`){if(!Array.isArray(t))throw TypeError(`A string tensor's data must be a string array.`);a=t}else{let n=ae.get(e);if(n===void 0)throw TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e===`float16`&&n===Uint16Array||e===`uint4`||e===`int4`)throw TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${n.name} as data.`);a=e===`uint64`||e===`int64`?n.from(t,BigInt):n.from(t)}else if(t instanceof n)a=t;else if(t instanceof Uint8ClampedArray)if(e===`uint8`)a=Uint8Array.from(t);else throw TypeError(`A Uint8ClampedArray tensor's data must be type of uint8`);else if(e===`float16`&&t instanceof Uint16Array&&n!==Uint16Array)a=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw TypeError(`A ${r} tensor's data must be type of ${n}`)}else if(o=t,Array.isArray(e)){if(e.length===0)throw TypeError(`Tensor type cannot be inferred from an empty array.`);let t=typeof e[0];if(t===`string`)r=`string`,a=e;else if(t===`boolean`)r=`bool`,a=Uint8Array.from(e);else throw TypeError(`Invalid element type of data array: ${t}.`)}else if(e instanceof Uint8ClampedArray)r=`uint8`,a=Uint8Array.from(e);else{let t=oe.get(e.constructor);if(t===void 0)throw TypeError(`Unsupported type for tensor data: ${e.constructor}.`);r=t,a=e}if(o===void 0)o=[a.length];else if(!Array.isArray(o))throw TypeError(`A tensor's dims must be a number array`);i=o,this.cpuData=a,this.dataLocation=`cpu`}let a=ue(i);if(this.cpuData&&a!==this.cpuData.length&&!((r===`uint4`||r===`int4`)&&Math.ceil(a/2)===this.cpuData.length))throw Error(`Tensor's size(${a}) does not match data length(${this.cpuData.length}).`);this.type=r,this.dims=i,this.size=a}static async fromImage(e,t){return ee(e,t)}static fromTexture(e,t){return te(e,t)}static fromGpuBuffer(e,t){return ne(e,t)}static fromMLTensor(e,t){return re(e,t)}static fromPinnedBuffer(e,t,n){return O(e,t,n)}toDataURL(e){return w(this,e)}toImageData(e){return T(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw Error(`The data is not stored as a WebGL texture.`);return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw Error(`The data is not stored as a WebGPU buffer.`);return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw Error(`The data is not stored as a WebNN MLTensor.`);return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case`cpu`:case`cpu-pinned`:return this.data;case`texture`:case`gpu-buffer`:case`ml-tensor`:if(!this.downloader)throw Error(`The current tensor is not created with a specified data downloader.`);if(this.isDownloading)throw Error(`The current tensor is being downloaded.`);try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation=`cpu`,this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}default:throw Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw Error(`The current tensor is being downloaded.`);this.disposer&&=(this.disposer(),void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation=`none`}ensureValid(){if(this.dataLocation===`none`)throw Error(`The tensor is disposed.`)}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw Error(`Cannot reshape a tensor that owns GPU resource.`);return de(this,e)}}}),A,he=o(()=>{me(),A=k}),ge,_e,ve,ye,be,xe,Se=o(()=>{x(),ge=(e,t)=>{(typeof b.trace>`u`?!b.wasm.trace:!b.trace)||console.timeStamp(`${e}::ORT::${t}`)},_e=(e,t)=>{let n=Error().stack?.split(/\r\n|\r|\n/g)||[],r=!1;for(let i=0;i<n.length;i++){if(r&&!n[i].includes(`TRACE_FUNC`)){let r=`FUNC_${e}::${n[i].trim().split(` `)[1]}`;t&&(r+=`::${t}`),ge(`CPU`,r);return}n[i].includes(`TRACE_FUNC`)&&(r=!0)}},ve=e=>{(typeof b.trace>`u`?!b.wasm.trace:!b.trace)||_e(`BEGIN`,e)},ye=e=>{(typeof b.trace>`u`?!b.wasm.trace:!b.trace)||_e(`END`,e)},be=e=>{(typeof b.trace>`u`?!b.wasm.trace:!b.trace)||console.time(`ORT::${e}`)},xe=e=>{(typeof b.trace>`u`?!b.wasm.trace:!b.trace)||console.timeEnd(`ORT::${e}`)}}),Ce,we=o(()=>{h(),he(),Se(),Ce=class e{constructor(e){this.handler=e}async run(e,t,n){ve(),be(`InferenceSession.run`);let r={},i={};if(typeof e!=`object`||!e||e instanceof A||Array.isArray(e))throw TypeError(`'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.`);let a=!0;if(typeof t==`object`){if(t===null)throw TypeError(`Unexpected argument[1]: cannot be null.`);if(t instanceof A)throw TypeError(`'fetches' cannot be a Tensor`);if(Array.isArray(t)){if(t.length===0)throw TypeError(`'fetches' cannot be an empty array.`);a=!1;for(let e of t){if(typeof e!=`string`)throw TypeError(`'fetches' must be a string array or an object.`);if(this.outputNames.indexOf(e)===-1)throw RangeError(`'fetches' contains invalid output name: ${e}.`);r[e]=null}if(typeof n==`object`&&n)i=n;else if(typeof n<`u`)throw TypeError(`'options' must be an object.`)}else{let e=!1,o=Object.getOwnPropertyNames(t);for(let n of this.outputNames)if(o.indexOf(n)!==-1){let i=t[n];(i===null||i instanceof A)&&(e=!0,a=!1,r[n]=i)}if(e){if(typeof n==`object`&&n)i=n;else if(typeof n<`u`)throw TypeError(`'options' must be an object.`)}else i=t}}else if(typeof t<`u`)throw TypeError(`Unexpected argument[1]: must be 'fetches' or 'options'.`);for(let t of this.inputNames)if(typeof e[t]>`u`)throw Error(`input '${t}' is missing in 'feeds'.`);if(a)for(let e of this.outputNames)r[e]=null;let o=await this.handler.run(e,r,i),s={};for(let e in o)if(Object.hasOwnProperty.call(o,e)){let t=o[e];t instanceof A?s[e]=t:s[e]=new A(t.type,t.data,t.dims)}return xe(`InferenceSession.run`),ye(),s}async release(){return this.handler.dispose()}static async create(t,n,r,i){ve(),be(`InferenceSession.create`);let a,o={};if(typeof t==`string`){if(a=t,typeof n==`object`&&n)o=n;else if(typeof n<`u`)throw TypeError(`'options' must be an object.`)}else if(t instanceof Uint8Array){if(a=t,typeof n==`object`&&n)o=n;else if(typeof n<`u`)throw TypeError(`'options' must be an object.`)}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<`u`&&t instanceof SharedArrayBuffer){let e=t,s=0,c=t.byteLength;if(typeof n==`object`&&n)o=n;else if(typeof n==`number`){if(s=n,!Number.isSafeInteger(s))throw RangeError(`'byteOffset' must be an integer.`);if(s<0||s>=e.byteLength)throw RangeError(`'byteOffset' is out of range [0, ${e.byteLength}).`);if(c=t.byteLength-s,typeof r==`number`){if(c=r,!Number.isSafeInteger(c))throw RangeError(`'byteLength' must be an integer.`);if(c<=0||s+c>e.byteLength)throw RangeError(`'byteLength' is out of range (0, ${e.byteLength-s}].`);if(typeof i==`object`&&i)o=i;else if(typeof i<`u`)throw TypeError(`'options' must be an object.`)}else if(typeof r<`u`)throw TypeError(`'byteLength' must be a number.`)}else if(typeof n<`u`)throw TypeError(`'options' must be an object.`);a=new Uint8Array(e,s,c)}else throw TypeError(`Unexpected argument[0]: must be 'path' or 'buffer'.`);let[s,c]=await m(o),l=await s.createInferenceSessionHandler(a,c);return xe(`InferenceSession.create`),ye(),new e(l)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),Te,Ee=o(()=>{we(),Te=Ce}),De=o(()=>{}),Oe=o(()=>{}),ke=o(()=>{}),Ae=o(()=>{}),je={};s(je,{InferenceSession:()=>Te,TRACE:()=>ge,TRACE_EVENT_BEGIN:()=>be,TRACE_EVENT_END:()=>xe,TRACE_FUNC_BEGIN:()=>ve,TRACE_FUNC_END:()=>ye,Tensor:()=>A,env:()=>S,registerBackend:()=>f});var j=o(()=>{g(),C(),Ee(),he(),De(),Oe(),Se(),ke(),Ae()}),Me=o(()=>{}),Ne={};s(Ne,{default:()=>Ie});var Pe,Fe,Ie,Le=o(()=>{Mt(),et(),Ye(),Pe=`ort-wasm-proxy-worker`,Fe=globalThis.self?.name===Pe,Fe&&(self.onmessage=e=>{let{type:t,in:n}=e.data;try{switch(t){case`init-wasm`:L(n.wasm).then(()=>{Ct(n).then(()=>{postMessage({type:t})},e=>{postMessage({type:t,err:e})})},e=>{postMessage({type:t,err:e})});break;case`init-ep`:{let{epName:e,env:r}=n;wt(r,e).then(()=>{postMessage({type:t})},e=>{postMessage({type:t,err:e})});break}case`copy-from`:{let{buffer:e}=n,r=H(e);postMessage({type:t,out:r});break}case`create`:{let{model:e,options:r}=n;U(e,r).then(e=>{postMessage({type:t,out:e})},e=>{postMessage({type:t,err:e})});break}case`release`:Ot(n),postMessage({type:t});break;case`run`:{let{sessionId:e,inputIndices:r,inputs:i,outputIndices:a,options:o}=n;W(e,r,i,a,Array(a.length).fill(null),o).then(e=>{e.some(e=>e[3]!==`cpu`)?postMessage({type:t,err:`Proxy does not support non-cpu tensor location.`}):postMessage({type:t,out:e},jt([...i,...e]))},e=>{postMessage({type:t,err:e})});break}case`end-profiling`:At(n),postMessage({type:t});break;default:}}catch(e){postMessage({type:t,err:e})}}),Ie=Fe?null:e=>new Worker(e??M,{type:`classic`,name:Pe})}),Re,ze,M,Be,Ve,He,N,Ue,We,Ge,Ke,qe,Je,Ye=o(()=>{Me(),Re=typeof location>`u`?void 0:location.origin,ze=()=>typeof document<`u`?document.currentScript?.src:typeof self<`u`?self.location?.href:void 0,M=ze(),Be=()=>{if(M&&!M.startsWith(`blob:`))return M.substring(0,M.lastIndexOf(`/`)+1)},Ve=(e,t)=>{try{let n=t??M;return(n?new URL(e,n):new URL(e)).origin===Re}catch{return!1}},He=(e,t)=>{let n=t??M;try{return(n?new URL(e,n):new URL(e)).href}catch{return}},N=(e,t)=>`${t??`./`}${e}`,Ue=async e=>{let t=await(await fetch(e,{credentials:`same-origin`})).blob();return URL.createObjectURL(t)},We=async e=>(await pe(async()=>{let{default:t}=await import(e);return{default:t}},[])).default,Ge=(Le(),l(Ne)).default,Ke=async()=>{if(!M)throw Error(`Failed to load proxy worker: cannot determine the script source URL.`);if(Ve(M))return[void 0,Ge()];let e=await Ue(M);return[e,Ge(e)]},qe=void 0,Je=async(e,t,n,r)=>{let i=qe&&!(e||t);if(i)if(M)i=Ve(M)||r&&!n;else if(r&&!n)i=!0;else throw Error(`cannot determine the script source URL.`);if(i)return[void 0,qe];{let r=`ort-wasm-simd-threaded.mjs`,i=e??He(r,t),a=n&&i&&!Ve(i,t),o=a?await Ue(i):i??N(r,t);return[a?o:void 0,await We(o)]}}}),P,F,I,Xe,Ze,Qe,$e,L,R,et=o(()=>{Ye(),F=!1,I=!1,Xe=!1,Ze=()=>{if(typeof SharedArrayBuffer>`u`)return!1;try{return typeof MessageChannel<`u`&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},Qe=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},$e=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},L=async e=>{if(F)return Promise.resolve();if(I)throw Error(`multiple calls to 'initializeWebAssembly()' detected.`);if(Xe)throw Error(`previous call to 'initializeWebAssembly()' failed.`);I=!0;let t=e.initTimeout,n=e.numThreads;if(e.simd!==!1){if(e.simd===`relaxed`){if(!$e())throw Error(`Relaxed WebAssembly SIMD is not supported in the current environment.`)}else if(!Qe())throw Error(`WebAssembly SIMD is not supported in the current environment.`)}let r=Ze();n>1&&!r&&(typeof self<`u`&&!self.crossOriginIsolated&&console.warn(`env.wasm.numThreads is set to `+n+`, but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info.`),console.warn(`WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading.`),e.numThreads=n=1);let i=e.wasmPaths,a=typeof i==`string`?i:void 0,o=i?.mjs,s=o?.href??o,c=i?.wasm,l=c?.href??c,u=e.wasmBinary,[d,f]=await Je(s,a,n>1,!!u||!!l),p=!1,m=[];if(t>0&&m.push(new Promise(e=>{setTimeout(()=>{p=!0,e()},t)})),m.push(new Promise((e,t)=>{let r={numThreads:n};if(u)r.wasmBinary=u,r.locateFile=e=>e;else if(l||a)r.locateFile=e=>l??a+e;else if(s&&s.indexOf(`blob:`)!==0)r.locateFile=e=>new URL(e,s).href;else if(d){let e=Be();e&&(r.locateFile=t=>e+t)}f(r).then(t=>{I=!1,F=!0,P=t,e(),d&&URL.revokeObjectURL(d)},e=>{I=!1,Xe=!0,t(e)})})),await Promise.race(m),p)throw Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},R=()=>{if(F&&P)return P;throw Error(`WebAssembly is not initialized yet.`)}}),tt,z,B,nt=o(()=>{et(),tt=(e,t)=>{let n=R(),r=n.lengthBytesUTF8(e)+1,i=n._malloc(r);return n.stringToUTF8(e,i,r),t.push(i),i},z=(e,t,n,r)=>{if(typeof e==`object`&&e){if(n.has(e))throw Error(`Circular reference in options`);n.add(e)}Object.entries(e).forEach(([e,i])=>{let a=t?t+e:e;if(typeof i==`object`)z(i,a+`.`,n,r);else if(typeof i==`string`||typeof i==`number`)r(a,i.toString());else if(typeof i==`boolean`)r(a,i?`1`:`0`);else throw Error(`Can't handle extra config type: ${typeof i}`)})},B=e=>{let t=R(),n=t.stackSave();try{let n=t.PTR_SIZE,r=t.stackAlloc(2*n);t._OrtGetLastError(r,r+n);let i=Number(t.getValue(r,n===4?`i32`:`i64`)),a=t.getValue(r+n,`*`),o=a?t.UTF8ToString(a):``;throw Error(`${e} ERROR_CODE: ${i}, ERROR_MESSAGE: ${o}`)}finally{t.stackRestore(n)}}}),rt,it=o(()=>{et(),nt(),rt=e=>{let t=R(),n=0,r=[],i=e||{};try{if(e?.logSeverityLevel===void 0)i.logSeverityLevel=2;else if(typeof e.logSeverityLevel!=`number`||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw Error(`log severity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)i.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!=`number`||!Number.isInteger(e.logVerbosityLevel))throw Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(i.terminate=!1);let a=0;return e?.tag!==void 0&&(a=tt(e.tag,r)),n=t._OrtCreateRunOptions(i.logSeverityLevel,i.logVerbosityLevel,!!i.terminate,a),n===0&&B(`Can't create run options.`),e?.extra!==void 0&&z(e.extra,``,new WeakSet,(e,i)=>{let a=tt(e,r),o=tt(i,r);t._OrtAddRunConfigEntry(n,a,o)!==0&&B(`Can't set a run config entry: ${e} - ${i}.`)}),[n,r]}catch(e){throw n!==0&&t._OrtReleaseRunOptions(n),r.forEach(e=>t._free(e)),e}}}),at,ot,st,ct,lt,ut,dt=o(()=>{et(),nt(),at=e=>{switch(e){case`disabled`:return 0;case`basic`:return 1;case`extended`:return 2;case`layout`:return 3;case`all`:return 99;default:throw Error(`unsupported graph optimization level: ${e}`)}},ot=e=>{switch(e){case`sequential`:return 0;case`parallel`:return 1;default:throw Error(`unsupported execution mode: ${e}`)}},st=e=>{e.extra||={},e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||=`1`,e.executionProviders&&e.executionProviders.some(e=>(typeof e==`string`?e:e.name)===`webgpu`)&&(e.enableMemPattern=!1)},ct=(e,t,n,r)=>{let i=tt(t,r),a=tt(n,r);R()._OrtAddSessionConfigEntry(e,i,a)!==0&&B(`Can't set a session config entry: ${t} - ${n}.`)},lt=async(e,t,n)=>{let r=t.executionProviders;for(let t of r){let r=typeof t==`string`?t:t.name,i=[];switch(r){case`webnn`:if(r=`WEBNN`,ct(e,`session.disable_quant_qdq`,`1`,n),ct(e,`session.disable_qdq_constant_folding`,`1`,n),typeof t!=`string`){let r=t?.deviceType;r&&ct(e,`deviceType`,r,n)}break;case`webgpu`:if(r=`JS`,typeof t!=`string`){let r=t;if(r?.preferredLayout){if(r.preferredLayout!==`NCHW`&&r.preferredLayout!==`NHWC`)throw Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${r.preferredLayout}`);ct(e,`preferredLayout`,r.preferredLayout,n)}}break;case`wasm`:case`cpu`:continue;default:throw Error(`not supported execution provider: ${r}`)}let a=tt(r,n),o=i.length,s=0,c=0;if(o>0){s=R()._malloc(o*R().PTR_SIZE),n.push(s),c=R()._malloc(o*R().PTR_SIZE),n.push(c);for(let e=0;e<o;e++)R().setValue(s+e*R().PTR_SIZE,i[e][0],`*`),R().setValue(c+e*R().PTR_SIZE,i[e][1],`*`)}await R()._OrtAppendExecutionProvider(e,a,s,c,o)!==0&&B(`Can't append execution provider: ${r}.`)}},ut=async e=>{let t=R(),n=0,r=[],i=e||{};st(i);try{let e=at(i.graphOptimizationLevel??`all`),a=ot(i.executionMode??`sequential`),o=typeof i.logId==`string`?tt(i.logId,r):0,s=i.logSeverityLevel??2;if(!Number.isInteger(s)||s<0||s>4)throw Error(`log severity level is not valid: ${s}`);let c=i.logVerbosityLevel??0;if(!Number.isInteger(c)||c<0||c>4)throw Error(`log verbosity level is not valid: ${c}`);let l=typeof i.optimizedModelFilePath==`string`?tt(i.optimizedModelFilePath,r):0;if(n=t._OrtCreateSessionOptions(e,!!i.enableCpuMemArena,!!i.enableMemPattern,a,!!i.enableProfiling,0,o,s,c,l),n===0&&B(`Can't create session options.`),i.executionProviders&&await lt(n,i,r),i.enableGraphCapture!==void 0){if(typeof i.enableGraphCapture!=`boolean`)throw Error(`enableGraphCapture must be a boolean value: ${i.enableGraphCapture}`);ct(n,`enableGraphCapture`,i.enableGraphCapture.toString(),r)}if(i.freeDimensionOverrides)for(let[e,a]of Object.entries(i.freeDimensionOverrides)){if(typeof e!=`string`)throw Error(`free dimension override name must be a string: ${e}`);if(typeof a!=`number`||!Number.isInteger(a)||a<0)throw Error(`free dimension override value must be a non-negative integer: ${a}`);let i=tt(e,r);t._OrtAddFreeDimensionOverride(n,i,a)!==0&&B(`Can't set a free dimension override: ${e} - ${a}.`)}return i.extra!==void 0&&z(i.extra,``,new WeakSet,(e,t)=>{ct(n,e,t,r)}),[n,r]}catch(e){throw n!==0&&t._OrtReleaseSessionOptions(n)!==0&&B(`Can't release session options.`),r.forEach(e=>t._free(e)),e}}}),ft,pt,mt,ht,gt,_t,vt,yt,V=o(()=>{ft=e=>{switch(e){case`int8`:return 3;case`uint8`:return 2;case`bool`:return 9;case`int16`:return 5;case`uint16`:return 4;case`int32`:return 6;case`uint32`:return 12;case`float16`:return 10;case`float32`:return 1;case`float64`:return 11;case`string`:return 8;case`int64`:return 7;case`uint64`:return 13;case`int4`:return 22;case`uint4`:return 21;default:throw Error(`unsupported data type: ${e}`)}},pt=e=>{switch(e){case 3:return`int8`;case 2:return`uint8`;case 9:return`bool`;case 5:return`int16`;case 4:return`uint16`;case 6:return`int32`;case 12:return`uint32`;case 10:return`float16`;case 1:return`float32`;case 11:return`float64`;case 8:return`string`;case 7:return`int64`;case 13:return`uint64`;case 22:return`int4`;case 21:return`uint4`;default:throw Error(`unsupported data type: ${e}`)}},mt=(e,t)=>{let n=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],r=typeof t==`number`?t:t.reduce((e,t)=>e*t,1);return n>0?Math.ceil(r*n):void 0},ht=e=>{switch(e){case`float16`:return typeof Float16Array<`u`?Float16Array:Uint16Array;case`float32`:return Float32Array;case`uint8`:return Uint8Array;case`int8`:return Int8Array;case`uint16`:return Uint16Array;case`int16`:return Int16Array;case`int32`:return Int32Array;case`bool`:return Uint8Array;case`float64`:return Float64Array;case`uint32`:return Uint32Array;case`int64`:return BigInt64Array;case`uint64`:return BigUint64Array;default:throw Error(`unsupported type: ${e}`)}},gt=e=>{switch(e){case`verbose`:return 0;case`info`:return 1;case`warning`:return 2;case`error`:return 3;case`fatal`:return 4;default:throw Error(`unsupported logging level: ${e}`)}},_t=e=>e===`float32`||e===`float16`||e===`int32`||e===`int64`||e===`uint32`||e===`uint8`||e===`bool`||e===`uint4`||e===`int4`,vt=e=>e===`float32`||e===`float16`||e===`int32`||e===`int64`||e===`uint32`||e===`uint64`||e===`int8`||e===`uint8`||e===`bool`||e===`uint4`||e===`int4`,yt=e=>{switch(e){case`none`:return 0;case`cpu`:return 1;case`cpu-pinned`:return 2;case`texture`:return 3;case`gpu-buffer`:return 4;case`ml-tensor`:return 5;default:throw Error(`unsupported data location: ${e}`)}}}),bt,xt=o(()=>{Me(),bt=async e=>{if(typeof e==`string`){let t=await fetch(e);if(!t.ok)throw Error(`failed to load external data file: ${e}`);let n=t.headers.get(`Content-Length`),r=n?parseInt(n,10):0;if(r<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw Error(`failed to load external data file: ${e}, no response body.`);let n=t.body.getReader(),i;try{i=new ArrayBuffer(r)}catch(e){if(e instanceof RangeError){let e=Math.ceil(r/65536);i=new WebAssembly.Memory({initial:e,maximum:e}).buffer}else throw e}let a=0;for(;;){let{done:e,value:t}=await n.read();if(e)break;let r=t.byteLength;new Uint8Array(i,a,r).set(t),a+=r}return new Uint8Array(i,0,r)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),St,Ct,wt,Tt,Et,Dt,H,U,Ot,kt,W,At,jt,Mt=o(()=>{j(),it(),dt(),V(),et(),nt(),xt(),St=(e,t)=>{R()._OrtInit(e,t)!==0&&B(`Can't initialize onnxruntime.`)},Ct=async e=>{St(e.wasm.numThreads,gt(e.logLevel))},wt=async(e,t)=>{R().asyncInit?.();let n=e.webgpu.adapter;if(t===`webgpu`){if(typeof navigator>`u`||!navigator.gpu)throw Error(`WebGPU is not supported in current environment`);if(n){if(typeof n.limits!=`object`||typeof n.features!=`object`||typeof n.requestDevice!=`function`)throw Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let t=e.webgpu.powerPreference;if(t!==void 0&&t!==`low-power`&&t!==`high-performance`)throw Error(`Invalid powerPreference setting: "${t}"`);let r=e.webgpu.forceFallbackAdapter;if(r!==void 0&&typeof r!=`boolean`)throw Error(`Invalid forceFallbackAdapter setting: "${r}"`);if(n=await navigator.gpu.requestAdapter({powerPreference:t,forceFallbackAdapter:r}),!n)throw Error(`Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.`)}}if(t===`webnn`&&(typeof navigator>`u`||!navigator.ml))throw Error(`WebNN is not supported in current environment`)},Tt=new Map,Et=e=>{let t=R(),n=t.stackSave();try{let n=t.PTR_SIZE,r=t.stackAlloc(2*n);t._OrtGetInputOutputCount(e,r,r+n)!==0&&B(`Can't get session input/output count.`);let i=n===4?`i32`:`i64`;return[Number(t.getValue(r,i)),Number(t.getValue(r+n,i))]}finally{t.stackRestore(n)}},Dt=(e,t)=>{let n=R(),r=n.stackSave(),i=0;try{let r=n.PTR_SIZE,a=n.stackAlloc(2*r);n._OrtGetInputOutputMetadata(e,t,a,a+r)!==0&&B(`Can't get session input/output metadata.`);let o=Number(n.getValue(a,`*`));i=Number(n.getValue(a+r,`*`));let s=n.HEAP32[i/4];if(s===0)return[o,0];let c=n.HEAPU32[i/4+1],l=[];for(let e=0;e<c;e++){let t=Number(n.getValue(i+8+e*r,`*`));l.push(t===0?Number(n.getValue(i+8+(e+c)*r,`*`)):n.UTF8ToString(t))}return[o,s,l]}finally{n.stackRestore(r),i!==0&&n._OrtFree(i)}},H=e=>{let t=R(),n=t._malloc(e.byteLength);if(n===0)throw Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,n),[n,e.byteLength]},U=async(e,t)=>{let n,r,i=R();Array.isArray(e)?[n,r]=e:e.buffer===i.HEAPU8.buffer?[n,r]=[e.byteOffset,e.byteLength]:[n,r]=H(e);let a=0,o=0,s=[],c=[],l=[];try{if([o,s]=await ut(t),t?.externalData&&i.mountExternalData){let e=[];for(let n of t.externalData){let t=typeof n==`string`?n:n.path;e.push(bt(typeof n==`string`?n:n.data).then(e=>{i.mountExternalData(t,e)}))}await Promise.all(e)}for(let e of t?.executionProviders??[])if((typeof e==`string`?e:e.name)===`webnn`){if(i.shouldTransferToMLTensor=!1,typeof e!=`string`){let t=e,n=t?.context,r=t?.gpuDevice,a=t?.deviceType,o=t?.powerPreference;n?i.currentContext=n:r?i.currentContext=await i.webnnCreateMLContext(r):i.currentContext=await i.webnnCreateMLContext({deviceType:a,powerPreference:o})}else i.currentContext=await i.webnnCreateMLContext();break}a=await i._OrtCreateSession(n,r,o),i.webgpuOnCreateSession?.(a),a===0&&B(`Can't create a session.`),i.jsepOnCreateSession?.(),i.currentContext&&(i.webnnRegisterMLContext(a,i.currentContext),i.currentContext=void 0,i.shouldTransferToMLTensor=!0);let[e,u]=Et(a),d=!!t?.enableGraphCapture,f=[],p=[],m=[],h=[];for(let t=0;t<e;t++){let[e,n,r]=Dt(a,t);e===0&&B(`Can't get an input name.`),c.push(e);let o=i.UTF8ToString(e);f.push(o),m.push(n===0?{name:o,isTensor:!1}:{name:o,isTensor:!0,type:pt(n),shape:r})}for(let t=0;t<u;t++){let[n,r,o]=Dt(a,t+e);n===0&&B(`Can't get an output name.`),l.push(n);let s=i.UTF8ToString(n);p.push(s),h.push(r===0?{name:s,isTensor:!1}:{name:s,isTensor:!0,type:pt(r),shape:o})}return Tt.set(a,[a,c,l,null,d,!1]),[a,f,p,m,h]}catch(e){throw c.forEach(e=>i._OrtFree(e)),l.forEach(e=>i._OrtFree(e)),a!==0&&i._OrtReleaseSession(a)!==0&&B(`Can't release session.`),e}finally{i._free(n),o!==0&&i._OrtReleaseSessionOptions(o)!==0&&B(`Can't release session options.`),s.forEach(e=>i._free(e)),i.unmountExternalData?.()}},Ot=e=>{let t=R(),n=Tt.get(e);if(!n)throw Error(`cannot release session. invalid session id: ${e}`);let[r,i,a,o,s]=n;o&&(s&&t._OrtClearBoundOutputs(o.handle)!==0&&B(`Can't clear bound outputs.`),t._OrtReleaseBinding(o.handle)!==0&&B(`Can't release IO binding.`)),t.jsepOnReleaseSession?.(e),t.webnnOnReleaseSession?.(e),t.webgpuOnReleaseSession?.(e),i.forEach(e=>t._OrtFree(e)),a.forEach(e=>t._OrtFree(e)),t._OrtReleaseSession(r)!==0&&B(`Can't release session.`),Tt.delete(e)},kt=async(e,t,n,r,i,a,o=!1)=>{if(!e){t.push(0);return}let s=R(),c=s.PTR_SIZE,l=e[0],u=e[1],d=e[3],f=d,p,m;if(l===`string`&&(d===`gpu-buffer`||d===`ml-tensor`))throw Error(`String tensor is not supported on GPU.`);if(o&&d!==`gpu-buffer`)throw Error(`External buffer must be provided for input/output index ${a} when enableGraphCapture is true.`);if(d===`gpu-buffer`){let t=e[2].gpuBuffer;m=mt(ft(l),u);{let e=s.jsepRegisterBuffer;if(!e)throw Error(`Tensor location "gpu-buffer" is not supported without using WebGPU.`);p=e(r,a,t,m)}}else if(d===`ml-tensor`){let t=e[2].mlTensor;m=mt(ft(l),u);let n=s.webnnRegisterMLTensor;if(!n)throw Error(`Tensor location "ml-tensor" is not supported without using WebNN.`);p=n(r,t,ft(l),u)}else{let t=e[2];if(Array.isArray(t)){m=c*t.length,p=s._malloc(m),n.push(p);for(let e=0;e<t.length;e++){if(typeof t[e]!=`string`)throw TypeError(`tensor data at index ${e} is not a string`);s.setValue(p+e*c,tt(t[e],n),`*`)}}else{let e=s.webnnIsGraphInput,a=s.webnnIsGraphOutput;if(l!==`string`&&e&&a){let o=s.UTF8ToString(i);if(e(r,o)||a(r,o)){let e=ft(l);m=mt(e,u),f=`ml-tensor`;let n=s.webnnCreateTemporaryTensor,i=s.webnnUploadTensor;if(!n||!i)throw Error(`Tensor location "ml-tensor" is not supported without using WebNN.`);let a=await n(r,e,u);i(a,new Uint8Array(t.buffer,t.byteOffset,t.byteLength)),p=a}else m=t.byteLength,p=s._malloc(m),n.push(p),s.HEAPU8.set(new Uint8Array(t.buffer,t.byteOffset,m),p)}else m=t.byteLength,p=s._malloc(m),n.push(p),s.HEAPU8.set(new Uint8Array(t.buffer,t.byteOffset,m),p)}}let h=s.stackSave(),g=s.stackAlloc(4*u.length);try{u.forEach((e,t)=>s.setValue(g+t*c,e,c===4?`i32`:`i64`));let e=s._OrtCreateTensor(ft(l),p,m,g,u.length,yt(f));e===0&&B(`Can't create tensor for input/output. session=${r}, index=${a}.`),t.push(e)}finally{s.stackRestore(h)}},W=async(e,t,n,r,i,a)=>{let o=R(),s=o.PTR_SIZE,c=Tt.get(e);if(!c)throw Error(`cannot run inference. invalid session id: ${e}`);let l=c[0],u=c[1],d=c[2],f=c[3],p=c[4];c[5];let m=t.length,h=r.length,g=0,_=[],v=[],y=[],b=[],x=[],S=o.stackSave(),C=o.stackAlloc(m*s),w=o.stackAlloc(m*s),T=o.stackAlloc(h*s),E=o.stackAlloc(h*s);try{[g,_]=rt(a),be(`wasm prepareInputOutputTensor`);for(let r=0;r<m;r++)await kt(n[r],v,b,e,u[t[r]],t[r],p);for(let t=0;t<h;t++)await kt(i[t],y,b,e,d[r[t]],m+r[t],p);xe(`wasm prepareInputOutputTensor`);for(let e=0;e<m;e++)o.setValue(C+e*s,v[e],`*`),o.setValue(w+e*s,u[t[e]],`*`);for(let e=0;e<h;e++)o.setValue(T+e*s,y[e],`*`),o.setValue(E+e*s,d[r[e]],`*`);o.jsepOnRunStart?.(l),o.webnnOnRunStart?.(l);let c;c=await o._OrtRun(l,w,C,m,E,h,T,g),c!==0&&B(`failed to call OrtRun().`);let S=[],D=[];be(`wasm ProcessOutputTensor`);for(let t=0;t<h;t++){let n=Number(o.getValue(T+t*s,`*`));if(n===y[t]||x.includes(y[t])){S.push(i[t]),n!==y[t]&&o._OrtReleaseTensor(n)!==0&&B(`Can't release tensor.`);continue}let a=o.stackSave(),c=o.stackAlloc(4*s),l=!1,u,d=0;try{o._OrtGetTensorData(n,c,c+s,c+2*s,c+3*s)!==0&&B(`Can't access output tensor data on index ${t}.`);let i=s===4?`i32`:`i64`,a=Number(o.getValue(c,i));d=o.getValue(c+s,`*`);let p=o.getValue(c+s*2,`*`),m=Number(o.getValue(c+s*3,i)),h=[];for(let e=0;e<m;e++)h.push(Number(o.getValue(p+e*s,i)));o._OrtFree(p)!==0&&B(`Can't free memory for tensor dims.`);let g=h.reduce((e,t)=>e*t,1);u=pt(a);let _=f?.outputPreferredLocations[r[t]];if(u===`string`){if(_===`gpu-buffer`||_===`ml-tensor`)throw Error(`String tensor is not supported on GPU.`);let e=[];for(let t=0;t<g;t++){let n=o.getValue(d+t*s,`*`),r=o.getValue(d+(t+1)*s,`*`),i=t===g-1?void 0:r-n;e.push(o.UTF8ToString(n,i))}S.push([u,h,e,`cpu`])}else if(_===`gpu-buffer`&&g>0){let e=o.jsepGetBuffer;if(!e)throw Error(`preferredLocation "gpu-buffer" is not supported without using WebGPU.`);let t=e(d),r=mt(a,g);if(r===void 0||!_t(u))throw Error(`Unsupported data type: ${u}`);l=!0,S.push([u,h,{gpuBuffer:t,download:o.jsepCreateDownloader(t,r,u),dispose:()=>{o._OrtReleaseTensor(n)!==0&&B(`Can't release tensor.`)}},`gpu-buffer`])}else if(_===`ml-tensor`&&g>0){let t=o.webnnEnsureTensor,r=o.webnnIsGraphInputOutputTypeSupported;if(!t||!r)throw Error(`preferredLocation "ml-tensor" is not supported without using WebNN.`);if(mt(a,g)===void 0||!vt(u))throw Error(`Unsupported data type: ${u}`);if(!r(e,u,!1))throw Error(`preferredLocation "ml-tensor" for ${u} output is not supported by current WebNN Context.`);let i=await t(e,d,a,h,!1);l=!0,S.push([u,h,{mlTensor:i,download:o.webnnCreateMLTensorDownloader(d,u),dispose:()=>{o.webnnReleaseTensorId(d),o._OrtReleaseTensor(n)}},`ml-tensor`])}else if(_===`ml-tensor-cpu-output`&&g>0){let e=o.webnnCreateMLTensorDownloader(d,u)(),t=S.length;l=!0,D.push((async()=>{let r=[t,await e];return o.webnnReleaseTensorId(d),o._OrtReleaseTensor(n),r})()),S.push([u,h,[],`cpu`])}else{let e=new(ht(u))(g);new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(o.HEAPU8.subarray(d,d+e.byteLength)),S.push([u,h,e,`cpu`])}}finally{o.stackRestore(a),u===`string`&&d&&o._free(d),l||o._OrtReleaseTensor(n)}}f&&!p&&(o._OrtClearBoundOutputs(f.handle)!==0&&B(`Can't clear bound outputs.`),Tt.set(e,[l,u,d,f,p,!1]));for(let[e,t]of await Promise.all(D))S[e][2]=t;return xe(`wasm ProcessOutputTensor`),S}finally{o.webnnOnRunEnd?.(l),o.stackRestore(S),v.forEach(e=>o._OrtReleaseTensor(e)),y.forEach(e=>o._OrtReleaseTensor(e)),b.forEach(e=>o._free(e)),g!==0&&o._OrtReleaseRunOptions(g),_.forEach(e=>o._free(e))}},At=e=>{let t=R(),n=Tt.get(e);if(!n)throw Error(`invalid session id`);let r=n[0],i=t._OrtEndProfiling(r);i===0&&B(`Can't get an profile file name.`),t._OrtFree(i)},jt=e=>{let t=[];for(let n of e){let e=n[2];!Array.isArray(e)&&`buffer`in e&&t.push(e.buffer)}return t}}),Nt,G,Pt,Ft,It,Lt,Rt,zt,K,Bt,Vt,Ht,Ut,Wt,Gt,Kt,qt,Jt,Yt=o(()=>{j(),Mt(),et(),Ye(),Nt=()=>!!S.wasm.proxy&&typeof document<`u`,Pt=!1,Ft=!1,It=!1,zt=new Map,K=(e,t)=>{let n=zt.get(e);n?n.push(t):zt.set(e,[t])},Bt=()=>{if(Pt||!Ft||It||!G)throw Error(`worker not ready`)},Vt=e=>{switch(e.data.type){case`init-wasm`:Pt=!1,e.data.err?(It=!0,Rt[1](e.data.err)):(Ft=!0,Rt[0]()),Lt&&=(URL.revokeObjectURL(Lt),void 0);break;case`init-ep`:case`copy-from`:case`create`:case`release`:case`run`:case`end-profiling`:{let t=zt.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},Ht=async()=>{if(!Ft){if(Pt)throw Error(`multiple calls to 'initWasm()' detected.`);if(It)throw Error(`previous call to 'initWasm()' failed.`);if(Pt=!0,Nt())return new Promise((e,t)=>{G?.terminate(),Ke().then(([n,r])=>{try{G=r,G.onerror=e=>t(e),G.onmessage=Vt,Rt=[e,t];let i={type:`init-wasm`,in:S};if(!i.in.wasm.wasmPaths&&n){let e=Be();e&&(i.in.wasm.wasmPaths=e)}G.postMessage(i),Lt=n}catch(e){t(e)}},t)});try{await L(S.wasm),await Ct(S),Ft=!0}catch(e){throw It=!0,e}finally{Pt=!1}}},Ut=async e=>{if(Nt())return Bt(),new Promise((t,n)=>{K(`init-ep`,[t,n]);let r={type:`init-ep`,in:{epName:e,env:S}};G.postMessage(r)});await wt(S,e)},Wt=async e=>Nt()?(Bt(),new Promise((t,n)=>{K(`copy-from`,[t,n]);let r={type:`copy-from`,in:{buffer:e}};G.postMessage(r,[e.buffer])})):H(e),Gt=async(e,t)=>{if(Nt()){if(t?.preferredOutputLocation)throw Error(`session option "preferredOutputLocation" is not supported for proxy.`);return Bt(),new Promise((n,r)=>{K(`create`,[n,r]);let i={type:`create`,in:{model:e,options:{...t}}},a=[];e instanceof Uint8Array&&a.push(e.buffer),G.postMessage(i,a)})}else return U(e,t)},Kt=async e=>{if(Nt())return Bt(),new Promise((t,n)=>{K(`release`,[t,n]);let r={type:`release`,in:e};G.postMessage(r)});Ot(e)},qt=async(e,t,n,r,i,a)=>{if(Nt()){if(n.some(e=>e[3]!==`cpu`))throw Error(`input tensor on GPU is not supported for proxy.`);if(i.some(e=>e))throw Error(`pre-allocated output tensor is not supported for proxy.`);return Bt(),new Promise((i,o)=>{K(`run`,[i,o]);let s=n,c={type:`run`,in:{sessionId:e,inputIndices:t,inputs:s,outputIndices:r,options:a}};G.postMessage(c,jt(s))})}else return W(e,t,n,r,i,a)},Jt=async e=>{if(Nt())return Bt(),new Promise((t,n)=>{K(`end-profiling`,[t,n]);let r={type:`end-profiling`,in:e};G.postMessage(r)});At(e)}}),Xt,Zt,Qt,$t=o(()=>{j(),Yt(),V(),Me(),xt(),Xt=(e,t)=>{switch(e.location){case`cpu`:return[e.type,e.dims,e.data,`cpu`];case`gpu-buffer`:return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},`gpu-buffer`];case`ml-tensor`:return[e.type,e.dims,{mlTensor:e.mlTensor},`ml-tensor`];default:throw Error(`invalid data location: ${e.location} for ${t()}`)}},Zt=e=>{switch(e[3]){case`cpu`:return new A(e[0],e[2],e[1]);case`gpu-buffer`:{let t=e[0];if(!_t(t))throw Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:n,download:r,dispose:i}=e[2];return A.fromGpuBuffer(n,{dataType:t,dims:e[1],download:r,dispose:i})}case`ml-tensor`:{let t=e[0];if(!vt(t))throw Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:n,download:r,dispose:i}=e[2];return A.fromMLTensor(n,{dataType:t,dims:e[1],download:r,dispose:i})}default:throw Error(`invalid data location: ${e[3]}`)}},Qt=class{async fetchModelAndCopyToWasmMemory(e){return Wt(await bt(e))}async loadModel(e,t){ve();let n;n=typeof e==`string`?await this.fetchModelAndCopyToWasmMemory(e):e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await Gt(n,t),ye()}async dispose(){return Kt(this.sessionId)}async run(e,t,n){ve();let r=[],i=[];Object.entries(e).forEach(e=>{let t=e[0],n=e[1],a=this.inputNames.indexOf(t);if(a===-1)throw Error(`invalid input '${t}'`);r.push(n),i.push(a)});let a=[],o=[];Object.entries(t).forEach(e=>{let t=e[0],n=e[1],r=this.outputNames.indexOf(t);if(r===-1)throw Error(`invalid output '${t}'`);a.push(n),o.push(r)});let s=r.map((e,t)=>Xt(e,()=>`input "${this.inputNames[i[t]]}"`)),c=a.map((e,t)=>e?Xt(e,()=>`output "${this.outputNames[o[t]]}"`):null),l=await qt(this.sessionId,i,s,o,c,n),u={};for(let e=0;e<l.length;e++)u[this.outputNames[o[e]]]=a[e]??Zt(l[e]);return ye(),u}startProfiling(){}endProfiling(){Jt(this.sessionId)}}}),en={};s(en,{OnnxruntimeWebAssemblyBackend:()=>nn,initializeFlags:()=>tn,wasmBackend:()=>rn});var tn,nn,rn,an=o(()=>{j(),Yt(),$t(),tn=()=>{(typeof S.wasm.initTimeout!=`number`||S.wasm.initTimeout<0)&&(S.wasm.initTimeout=0);let e=S.wasm.simd;if(typeof e!=`boolean`&&e!==void 0&&e!==`fixed`&&e!==`relaxed`&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),S.wasm.simd=!1),typeof S.wasm.proxy!=`boolean`&&(S.wasm.proxy=!1),typeof S.wasm.trace!=`boolean`&&(S.wasm.trace=!1),typeof S.wasm.numThreads!=`number`||!Number.isInteger(S.wasm.numThreads)||S.wasm.numThreads<=0)if(typeof self<`u`&&!self.crossOriginIsolated)S.wasm.numThreads=1;else{let e=typeof navigator>`u`?a(`node:os`).cpus().length:navigator.hardwareConcurrency;S.wasm.numThreads=Math.min(4,Math.ceil((e||1)/2))}},nn=class{async init(e){tn(),await Ht(),await Ut(e)}async createInferenceSessionHandler(e,t){let n=new Qt;return await n.loadModel(e,t),n}},rn=new nn}),on={};s(on,{InferenceSession:()=>Te,TRACE:()=>ge,TRACE_EVENT_BEGIN:()=>be,TRACE_EVENT_END:()=>xe,TRACE_FUNC_BEGIN:()=>ve,TRACE_FUNC_END:()=>ye,Tensor:()=>A,default:()=>cn,env:()=>S,registerBackend:()=>f}),j(),j(),j();var sn=`1.27.0`,cn=je;{let e=(an(),l(en)).wasmBackend;f(`cpu`,e,10),f(`wasm`,e,10)}return Object.defineProperty(S.versions,"web",{value:sn,enumerable:!0}),l(on)})();typeof t==`object`&&typeof n==`object`&&(n.exports=r)})),Ee=n((e=>{var t=e&&e.__createBinding||(Object.create?(function(e,t,n,r){r===void 0&&(r=n);var i=Object.getOwnPropertyDescriptor(t,n);(!i||(`get`in i?!t.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,i)}):(function(e,t,n,r){r===void 0&&(r=n),e[r]=t[n]})),n=e&&e.__setModuleDefault||(Object.create?(function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}):function(e,t){e.default=t}),r=e&&e.__importStar||function(e){if(e&&e.__esModule)return e;var r={};if(e!=null)for(var i in e)i!=="default"&&Object.prototype.hasOwnProperty.call(e,i)&&t(r,e,i);return n(r,e),r};Object.defineProperty(e,"__esModule",{value:!0}),e.MicVAD=e.getDefaultRealTimeVADOptions=e.ort=e.DEFAULT_MODEL=void 0;var i=r(Te()),a=me(),o=ge(),s=A(),c=he(),l=xe(),u=Se();e.DEFAULT_MODEL=`legacy`,e.ort=i;var d=`vad.worklet.bundle.min.js`,f=`silero_vad_v5.onnx`,p=`silero_vad_legacy.onnx`;e.getDefaultRealTimeVADOptions=e=>({...o.defaultFrameProcessorOptions,onFrameProcessed:()=>{},onVADMisfire:()=>{s.log.debug(`VAD misfire`)},onSpeechStart:()=>{s.log.debug(`Detected speech start`)},onSpeechEnd:()=>{s.log.debug(`Detected speech end`)},onSpeechRealStart:()=>{s.log.debug(`Detected real speech start`)},baseAssetPath:`./`,onnxWASMBasePath:`./`,model:e,workletOptions:{},getStream:async()=>await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:!0,autoGainControl:!0,noiseSuppression:!0}}),pauseStream:async e=>{e.getTracks().forEach(e=>{e.stop()})},resumeStream:async()=>await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:!0,autoGainControl:!0,noiseSuppression:!0}}),ortConfig:e=>{e.env.logLevel=`error`},startOnLoad:!0,processorType:`auto`});var m=e=>`audioWorklet`in e&&typeof AudioWorkletNode==`function`?`AudioWorklet`:`ScriptProcessor`;async function h(e,t,n,r,i){await n.audioWorklet.addModule(e),t.processorOptions={...t.processorOptions??{},frameSamples:r};let a=new AudioWorkletNode(n,`vad-helper-worklet`,t);return a.port.onmessage=async e=>{let t=e.data;if(!(typeof t==`object`&&t&&`message`in t)){console.error(`Invalid message event`,t);return}switch(t.message){case c.Message.AudioFrame:if(!(`data`in t&&t.data instanceof ArrayBuffer)){console.log(`Audio frame message has no data`);return}await i(new Float32Array(t.data));break}},a}async function g(e,t,n){let r=new u.Resampler({nativeSampleRate:e.sampleRate,targetSampleRate:16e3,targetFrameSize:t});s.log.debug(`using script processor`);let i=e.createScriptProcessor(4096,1,1),a=!1;return i.onaudioprocess=async e=>{if(!a){a=!0;try{let t=e.inputBuffer.getChannelData(0);e.outputBuffer.getChannelData(0).fill(0);let i=r.process(t);for(let e of i)await n(e)}catch(e){console.error(`Error processing audio:`,e)}finally{a=!1}}},i.connect(e.destination),i}e.MicVAD=class t{constructor(e,t,n,r,i=!1,a=null,o=null,l=null,u=null,f=null,p=null,_=`uninitialized`,v=!1){this.options=e,this.frameProcessor=t,this.model=n,this.frameSamples=r,this.listening=i,this.errored=a,this._stream=o,this._audioContext=l,this._vadNode=u,this._mediaStreamAudioSourceNode=f,this._audioProcessorAdapterType=p,this.initializationState=_,this.ownsAudioContext=v,this.getAudioInstances=()=>{if(this._stream===null||this._audioContext===null||this._vadNode==null||this._mediaStreamAudioSourceNode==null)throw Error(`MicVAD has null stream, audio context, or processor adapter`);return{stream:this._stream,audioContext:this._audioContext,vadNode:this._vadNode,mediaStreamAudioSourceNode:this._mediaStreamAudioSourceNode}},this.setErrored=e=>{this.initializationState=`errored`,this.errored=e},this.start=async()=>{switch(this.initializationState){case`uninitialized`:s.log.debug(`initializing micVAD`),this.initializationState=`initializing`,this.frameProcessor.resume();try{this._stream=await this.options.getStream()}catch(e){throw e instanceof Error?this.setErrored(e.message):this.setErrored(String(e)),e}if(this.options.audioContext?(console.log(`using custom audio context`),this._audioContext=this.options.audioContext):(console.log(`using default audio context`),this._audioContext=new AudioContext,this.ownsAudioContext=!0),!this._audioContext)throw this.setErrored(`Audio context is null`),Error(`Audio context is null`);switch(this._audioProcessorAdapterType=this.options.processorType==`auto`?m(this._audioContext):this.options.processorType,this._audioProcessorAdapterType){case`AudioWorklet`:this._vadNode=await h(this.options.baseAssetPath+d,this.options.workletOptions,this._audioContext,this.frameSamples,this.processFrame);break;case`ScriptProcessor`:this._vadNode=await g(this._audioContext,this.frameSamples,this.processFrame);break;default:throw Error(`Unsupported audio processor adapter type: ${this._audioProcessorAdapterType}`)}this._mediaStreamAudioSourceNode=new MediaStreamAudioSourceNode(this._audioContext,{mediaStream:this._stream}),this._mediaStreamAudioSourceNode.connect(this._vadNode),s.log.debug(`started micVAD`),this.listening=!0,this.initializationState=`initialized`;break;case`initializing`:s.log.warn(`start called while initializing`);break;case`initialized`:{if(this.listening)return;this.listening=!0,this.frameProcessor.resume();let{stream:e,audioContext:t,vadNode:n}=this.getAudioInstances();this._stream=await this.options.resumeStream(e);let r=new MediaStreamAudioSourceNode(t,{mediaStream:this._stream});this._mediaStreamAudioSourceNode=r,r.connect(n);break}case`destroyed`:s.log.warn(`start called after destroyed`);break;case`errored`:s.log.error(`start called after errored`);break;default:s.log.warn(`weird initialization state`);break}},this.pause=async()=>{if(!this.listening)return;this.listening=!1;let{stream:e,mediaStreamAudioSourceNode:t}=this.getAudioInstances();await this.options.pauseStream(e),t.disconnect(),this.frameProcessor.pause(this.handleFrameProcessorEvent)},this.destroy=async()=>{s.log.debug(`destroy called`),this.initializationState=`destroyed`;let{vadNode:e}=this.getAudioInstances();e instanceof AudioWorkletNode&&e.port.postMessage(c.Message.SpeechStop),this.listening&&await this.pause(),await this.model.release(),this.ownsAudioContext&&await this._audioContext?.close()},this.setOptions=e=>{this.frameProcessor.setOptions(e)},this.processFrame=async e=>{await this.frameProcessor.process(e,this.handleFrameProcessorEvent)},this.handleFrameProcessorEvent=e=>{switch(e.msg){case c.Message.FrameProcessed:this.options.onFrameProcessed(e.probs,e.frame);break;case c.Message.SpeechStart:this.options.onSpeechStart();break;case c.Message.SpeechRealStart:this.options.onSpeechRealStart();break;case c.Message.VADMisfire:this.options.onVADMisfire();break;case c.Message.SpeechEnd:this.options.onSpeechEnd(e.audio);break}}}static async new(n={}){let r={...(0,e.getDefaultRealTimeVADOptions)(n.model??e.DEFAULT_MODEL),...n};(0,o.validateOptions)(r),e.ort.env.wasm.wasmPaths=r.onnxWASMBasePath,r.ortConfig!==void 0&&r.ortConfig(e.ort);let i=r.model===`v5`?f:p,s=r.baseAssetPath+i,c=r.model===`v5`?l.SileroV5.new:l.SileroLegacy.new,u;try{u=await c(e.ort,()=>(0,a.defaultModelFetcher)(s))}catch(e){throw console.error(`Encountered an error while loading model file ${s}`),e}let d=r.model===`v5`?512:1536,m=d/16,h=new o.FrameProcessor(u.process,u.reset_state,{positiveSpeechThreshold:r.positiveSpeechThreshold,negativeSpeechThreshold:r.negativeSpeechThreshold,redemptionMs:r.redemptionMs,preSpeechPadMs:r.preSpeechPadMs,minSpeechMs:r.minSpeechMs,submitUserSpeechOnPause:r.submitUserSpeechOnPause},m),g=new t(r,h,u,d);if(r.startOnLoad)try{await g.start()}catch(e){throw console.error(`Error starting micVad`,e),e}return g}}})),De=n((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.getDefaultRealTimeVADOptions=e.MicVAD=e.DEFAULT_MODEL=e.utils=e.NonRealTimeVAD=e.Message=e.FrameProcessor=e.defaultModelFetcher=e.baseAssetPath=void 0;var t=k();Object.defineProperty(e,"baseAssetPath",{enumerable:!0,get:function(){return t.baseAssetPath}});var n=me();Object.defineProperty(e,"defaultModelFetcher",{enumerable:!0,get:function(){return n.defaultModelFetcher}});var r=ge();Object.defineProperty(e,"FrameProcessor",{enumerable:!0,get:function(){return r.FrameProcessor}});var i=he();Object.defineProperty(e,"Message",{enumerable:!0,get:function(){return i.Message}});var a=Ce();Object.defineProperty(e,"NonRealTimeVAD",{enumerable:!0,get:function(){return a.NonRealTimeVAD}});var o=we();e.utils={audioFileToArray:o.audioFileToArray,minFramesForTargetMS:o.minFramesForTargetMS,arrayBufferToBase64:o.arrayBufferToBase64,encodeWAV:o.encodeWAV};var s=Ee();Object.defineProperty(e,"DEFAULT_MODEL",{enumerable:!0,get:function(){return s.DEFAULT_MODEL}}),Object.defineProperty(e,"MicVAD",{enumerable:!0,get:function(){return s.MicVAD}}),Object.defineProperty(e,"getDefaultRealTimeVADOptions",{enumerable:!0,get:function(){return s.getDefaultRealTimeVADOptions}})}))(),Oe=t({SystemAudioNotCapturedError:()=>je,acquireDisplayStream:()=>j,mixMicWithAudioTracks:()=>Me,recordSourceLabel:()=>Ae,supportsDisplayMediaCapture:()=>ke});function ke(){return typeof navigator<`u`&&!!navigator.mediaDevices?.getDisplayMedia}function Ae(e){switch(e){case`mic`:return`Microphone`;case`system`:return`System / tab audio`;case`mixed`:return`Microphone + system audio`}}var je=class extends Error{constructor(){super(`System audio was not captured. In the browser share dialog, pick a tab or screen and enable "Share tab audio" or "Share system audio", then try again.`),this.name=`SystemAudioNotCapturedError`}};async function j(){return navigator.mediaDevices.getDisplayMedia({video:!0,audio:!0})}async function Me(e,t){let n=new AudioContext;await n.resume().catch(()=>{});let r=n.createMediaStreamDestination();return t.length>0&&n.createMediaStreamSource(new MediaStream(t)).connect(r),n.createMediaStreamSource(e).connect(r),{mixedStream:r.stream,audioContext:n}}fe();var Ne=0;function Pe(e){return Ne+=1,`${e}-${Ne}-${Date.now()}`}function Fe(e){return{langs:[e],processLocally:!0,quality:`dictation`}}function Ie(){return window.SpeechRecognition??window.webkitSpeechRecognition??null}function Le(){return Ie()||null}function Re(){return typeof window<`u`&&(!!window.SpeechRecognition||!!window.webkitSpeechRecognition)}function ze(){if(typeof window>`u`)return!1;let e=Le();return typeof e?.available==`function`&&typeof e?.install==`function`}async function M(e){let t=Le();if(!t?.available)return`api-unavailable`;try{let n=await t.available(Fe(e));return n===`available`?`available`:n===`downloadable`?`downloadable`:`unavailable`}catch{return`unavailable`}}async function Be(e){let t=Le();if(!t?.install||!t.available)throw Error(`Your browser does not support on-device language pack install. Use Chrome or Edge, enable cloud fallback, or try Record/Upload with Whisper.`);let n=Fe(e),r=await t.available(n);if(r!==`available`){if(r!==`downloadable`)throw Error(`Language pack for ${e} cannot be downloaded in this browser. Try another language, enable cloud fallback, or use Record/Upload.`);if(await t.install(n),r=await t.available(n),r!==`available`)throw Error(`Language pack install did not finish. Click Install again or enable cloud fallback.`)}}function Ve(e,t){switch(e){case`available`:return`On-device pack for ${t} is installed.`;case`downloadable`:return`On-device pack for ${t} can be downloaded (~tens of MB).`;case`unavailable`:return`On-device pack for ${t} is not offered by this browser.`;case`api-unavailable`:return`This browser uses cloud speech recognition (no local pack API).`}}function He(e){switch(e){case`not-allowed`:return`Microphone access was denied. Allow microphone for this site in browser settings.`;case`no-speech`:return`No speech detected. Try speaking closer to the microphone.`;case`network`:return`Network error during speech recognition. Check your connection or try on-device mode.`;case`language-not-supported`:return`Language not supported. Install the language pack or enable cloud fallback.`;case`aborted`:return`Speech recognition was stopped.`;default:return`Speech recognition error: ${e}`}}function N(e){return e===`no-speech`||e===`aborted`}function Ue(e){return!!(e.includes(`denied`)||e.includes(`not supported`)||e.includes(`language pack unavailable`)||e.includes(`Network error`)||e.startsWith(`Speech recognition error:`))}async function We(e,t,n,r){if(!t||!ze())return r.onPrivacyMode(`cloud-assisted`),{processLocally:!1,mode:`cloud-assisted`};let i=await M(e);if(i===`available`)return r.onPrivacyMode(`on-device`),{processLocally:!0,mode:`on-device`};if(i===`downloadable`){if(n)return r.onPrivacyMode(`cloud-assisted`),{processLocally:!1,mode:`cloud-assisted`};throw Error(`On-device language pack is not installed yet. Click Install language pack below, enable cloud fallback, or choose meeting-audio captions.`)}if(n)return r.onPrivacyMode(`cloud-assisted`),{processLocally:!1,mode:`cloud-assisted`};throw Error(`On-device language pack unavailable. Click Install language pack below, enable cloud fallback, or choose another language.`)}function Ge(){if(typeof navigator>`u`)return null;let e=navigator.userAgent.match(/(?:Chrome|Chromium|Edg|CriOS)\/(\d+)/);return e?Number(e[1]):null}function Ke(){if(!Ie())return!1;let e=Ge();return e!=null&&e>=135}function qe(){return typeof navigator<`u`&&!!navigator.mediaDevices?.getDisplayMedia&&Ke()}function Je(e,t,n,r,i,a){e.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++){let a=e.results[i],o=a[0]?.transcript?.trim()??``;if(!o)continue;let s=Date.now()-t,c={id:Pe(`ws`),startMs:Math.max(0,s-2e3),endMs:s,text:o,isFinal:a.isFinal,source:`web-speech`};a.isFinal?(n.push(c),r.onFinal(c)):r.onPartial(c)}},e.onerror=e=>{N(e.error)||r.onError(He(e.error))},e.onend=()=>{i()||window.setTimeout(a,300)}}function Ye(e,t){let n=Ie();if(!n)throw Error(`Live captions are not supported in this browser.`);let r=new n;return r.continuous=!0,r.interimResults=!0,r.lang=e,`processLocally`in r&&(r.processLocally=t),r}async function P(e,t,n){let r=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!0,noiseSuppression:!0,autoGainControl:!0},video:!1});await t.onMediaStream?.(r);let{processLocally:i}=await We(e,t.preferOnDevice,t.allowCloudFallback,n),a=Ye(e,i),o=t.sessionStartMs??Date.now(),s=[],c=!1;Je(a,o,s,n,()=>c,()=>{try{a.start()}catch{}});try{a.start()}catch(e){throw r.getTracks().forEach(e=>e.stop()),e}let l=()=>r.getTracks().forEach(e=>e.stop());return{stop:()=>new Promise(e=>{c=!0,a.onend=null;try{a.stop()}catch{}l(),e([...s])}),abort:()=>{c=!0,a.onend=null;try{a.abort()}catch{}l()}}}async function F(e,t,n){if(!qe())throw Error(`Tab-audio captions need Chrome/Edge 135+. Update your browser, or use Microphone only + Web Speech.`);let r=await j(),i=r.getAudioTracks();if(i.length===0)throw r.getTracks().forEach(e=>e.stop()),new je;let a=null,o=null,s=i[0],c=new MediaStream(i);try{if(t.source===`mixed`){let{mixMicWithAudioTracks:e}=await pe(async()=>{let{mixMicWithAudioTracks:e}=await Promise.resolve().then(()=>Oe);return{mixMicWithAudioTracks:e}},void 0);a=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!0,noiseSuppression:!0,autoGainControl:!0},video:!1});let t=await e(a,i);o=t.audioContext,c=t.mixedStream,s=t.mixedStream.getAudioTracks()[0]??i[0]}}catch(e){throw r.getTracks().forEach(e=>e.stop()),a?.getTracks().forEach(e=>e.stop()),e}await t.onMediaStream?.(c);let{processLocally:l}=await We(e,t.preferOnDevice,t.allowCloudFallback,n),u=Ye(e,l),d=t.sessionStartMs??Date.now(),f=[],p=!1;Je(u,d,f,n,()=>p,()=>{if(!(p||s.readyState!==`live`))try{u.start(s)}catch{}}),r.getVideoTracks()[0]?.addEventListener(`ended`,()=>{if(!p){p=!0;try{u.stop()}catch{}}},{once:!0});try{u.start(s)}catch(e){throw r.getTracks().forEach(e=>e.stop()),a?.getTracks().forEach(e=>e.stop()),o?.close(),e}let m=()=>{r.getTracks().forEach(e=>e.stop()),a?.getTracks().forEach(e=>e.stop()),o?.close()};return{stop:()=>new Promise(e=>{p=!0,u.onend=null;try{u.stop()}catch{}m(),e([...f])}),abort:()=>{p=!0,u.onend=null;try{u.abort()}catch{}m()}}}async function I(e,t,n){return F(e,{...t,source:`system`},n)}async function Xe(e,t,n){return F(e,{...t,source:`mixed`},n)}var Ze=50*1024*1024,Qe=7200*1e3,$e=16e3,L=`Xenova/whisper-base`,R=`Xenova/whisper-tiny`,et=L,tt=`en-US`,z=`meeting-notes-db`,B=`sessions`,nt=`current`,rt=`meeting-notes-hint-dismissed`,it=1500,at=`https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.30/dist/`,ot=`https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist/`,st=.55,ct=new Set([`audio/webm`,`audio/wav`,`audio/x-wav`,`audio/mpeg`,`audio/mp3`,`audio/ogg`,`audio/flac`,`audio/mp4`,`audio/x-m4a`,`video/webm`,`video/mp4`,`video/quicktime`]),lt=new Set([`.webm`,`.wav`,`.mp3`,`.mpeg`,`.ogg`,`.flac`,`.mp4`,`.m4a`,`.mov`,`.mkv`]),ut=[{value:`en-US`,label:`English (US)`,whisper:`en`},{value:`vi-VN`,label:`Vietnamese`,whisper:`vi`},{value:`ja-JP`,label:`Japanese`,whisper:`ja`},{value:`ko-KR`,label:`Korean`,whisper:`ko`},{value:`zh-CN`,label:`Chinese (Simplified)`,whisper:`zh`}],dt=[{value:R,label:`Tiny (~40 MB)`,sizeHint:`~40 MB`},{value:L,label:`Base (~75 MB)`,sizeHint:`~75 MB`}];function ft(e){return e.split(`-`)[0]?.toLowerCase()??`en`}async function pt(){return navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!0,noiseSuppression:!0,autoGainControl:!0},video:!1})}async function mt(e,t){let n=e===`meeting-audio`?`system`:e;if(n===`mic`){let e=await pt();return{stream:e,cleanup:()=>e.getTracks().forEach(e=>e.stop())}}let r=await j(),i=r.getAudioTracks();if(i.length===0)throw r.getTracks().forEach(e=>e.stop()),new je;if(r.getVideoTracks()[0]?.addEventListener(`ended`,t,{once:!0}),n===`system`)return{stream:new MediaStream(i),cleanup:()=>r.getTracks().forEach(e=>e.stop())};let a=await pt(),{mixedStream:o,audioContext:s}=await Me(a,i);return{stream:o,cleanup:()=>{r.getTracks().forEach(e=>e.stop()),a.getTracks().forEach(e=>e.stop()),s.close()}}}async function ht(e,t,n,r,i){let a=!1,o=[],{stream:s,cleanup:c}=await mt(e,()=>{a||n.onError(`Screen/tab sharing stopped.`)});try{await t.onMediaStream?.(s);let e=await De.MicVAD.new({getStream:async()=>s,baseAssetPath:at,onnxWASMBasePath:ot,onSpeechStart:()=>{a||n.onSpeechStart()},onSpeechEnd:async e=>{if(!a){n.onSpeechEnd();try{await r.transcribeSamples(e,i,{onProgress:()=>{},onSegment:e=>{o.push(e),n.onFinal(e)},onError:e=>n.onError(e)})}catch(e){n.onError(e instanceof Error?e.message:String(e))}}},onVADMisfire:()=>{a||n.onSpeechEnd()}});await e.start();let l=()=>{a||(a=!0,e.destroy(),c())};return{stop:async()=>(l(),[...o]),abort:()=>l()}}catch(e){throw c(),e}}function gt(e,t,n=it){return e==null||t-e>=n}function _t(e){return`Speaker ${e+1}`}function vt(e,t){if(e.length===0)return null;for(let n of e)if(t>=n.startMs&&t<=n.endMs)return n.index;let n=e[0],r=Math.min(Math.abs(t-n.startMs),Math.abs(t-n.endMs));for(let i of e){let e=Math.min(Math.abs(t-i.startMs),Math.abs(t-i.endMs));e<r&&(n=i,r=e)}return n.index}var yt=class{#e=[];#t=0;#n=null;#r=null;speechStart(e){this.#n=e}speechEnd(e){this.#n!=null&&(this.#e.push({index:this.#t,startMs:this.#n,endMs:e}),this.#t+=1,this.#n=null)}misfire(){this.#n=null}resolveTurnBoundary(e){let t=vt(this.#e,e);if(t===null)return this.#r===null;let n=t!==this.#r;return this.#r=t,n}};async function V(e,t,n,r,i,a){return t.engine===`local-ai`?(n.onPrivacyMode(`local-model`),ht(e,{onMediaStream:t.onMediaStream},{onFinal:n.onFinal,onError:n.onError,onSpeechStart:n.onSpeechStart,onSpeechEnd:n.onSpeechEnd},r,a)):bt(e,t,n,i)}async function bt(e,t,n,r){let i=Date.now(),a=new yt,o=null,s={...n,onFinal:e=>{n.onFinal({...e,turnBoundary:a.resolveTurnBoundary(e.startMs)})}},c={preferOnDevice:t.preferOnDevice,allowCloudFallback:t.allowCloudFallback,sessionStartMs:i,onMediaStream:async e=>{await t.onMediaStream?.(e);try{o=await De.MicVAD.new({getStream:async()=>e,baseAssetPath:at,onnxWASMBasePath:ot,onSpeechStart:()=>{a.speechStart(Date.now()-i),n.onSpeechStart()},onSpeechEnd:()=>{a.speechEnd(Date.now()-i),n.onSpeechEnd()},onVADMisfire:()=>a.misfire()}),await o.start()}catch{o=null}}},l=e===`meeting-audio`?`system`:e,u=l===`system`?await I(r,c,s):l===`mixed`?await Xe(r,c,s):await P(r,c,s);return{stop:async()=>{let e=await u.stop();return await o?.destroy(),e},abort:()=>{u.abort(),o?.destroy()}}}function xt(e,t){if(e.size>52428800)throw Error(`File is too large (max ${Math.round(Ze/(1024*1024))} MB).`);let n=e.type.split(`;`)[0]?.trim().toLowerCase()??``;if(n&&ct.has(n))return;let r=t?t.slice(t.lastIndexOf(`.`)).toLowerCase():``;if(!(r&&lt.has(r))&&!(!n&&!r))throw Error(`Unsupported file type. Use webm, wav, mp3, ogg, flac, or mp4.`)}async function St(e,t){xt(e,t);let n=new AudioContext;try{let t=await n.decodeAudioData(await e.arrayBuffer()),r=wt(t),i=t.sampleRate===16e3?r:Tt(r,t.sampleRate,$e);return{samples:i,sampleRate:$e,durationSec:i.length/$e}}finally{await n.close()}}async function Ct(e,t){xt(e,t);let n=new AudioContext;try{return(await n.decodeAudioData(await e.arrayBuffer())).duration}finally{await n.close()}}function wt(e){if(e.numberOfChannels===1)return e.getChannelData(0).slice();let t=e.length,n=new Float32Array(t);for(let r=0;r<e.numberOfChannels;r++){let i=e.getChannelData(r);for(let r=0;r<t;r++)n[r]+=i[r]/e.numberOfChannels}return n}function Tt(e,t,n){if(t===n)return e;let r=t/n,i=Math.floor(e.length/r),a=new Float32Array(i);for(let t=0;t<i;t++){let n=t*r,i=Math.floor(n),o=n-i,s=e[i]??0;a[t]=s+((e[i+1]??s)-s)*o}return a}function Et(e,t,n){let r=Math.floor(t*n);if(e.length<=r)return[e];let i=[];for(let t=0;t<e.length;t+=r)i.push(e.subarray(t,Math.min(t+r,e.length)));return i}function Dt(e){let t=Math.max(0,Math.floor(e/1e3)),n=Math.floor(t/3600),r=Math.floor(t%3600/60),i=t%60;return`${String(n).padStart(2,`0`)}:${String(r).padStart(2,`0`)}:${String(i).padStart(2,`0`)}`}function H(e){if(e.length===0)return[];let t=[];for(let n of e){let e=t[t.length-1];e&&e.source===n.source&&e.isFinal&&n.isFinal&&n.startMs-e.endMs<500&&e.text.trim()&&n.text.trim()?(e.text=`${e.text.trim()} ${n.text.trim()}`,e.endMs=n.endMs,n.confidence!=null&&(e.confidence=n.confidence)):t.push({...n})}return t}function U(e){return e.filter(e=>e.isFinal&&e.text.trim())}function Ot(e){return U(e).map(e=>`[${Dt(e.startMs)}] ${e.text.trim()}`).join(`
`)}function kt(e,t=`Meeting transcript`){return`# ${t}\n\n| Time | Text |\n|------|------|\n${U(e).map(e=>`| ${Dt(e.startMs)} | ${jt(e.text.trim())} |`).join(`
`)}\n`}function W(e){return JSON.stringify(U(e),null,2)}function At(e,t){let n=[...e],r=n.findIndex(e=>!e.isFinal&&e.source===t.source&&Math.abs(e.startMs-t.startMs)<2e3);if(r>=0)return n[r]=t,n;if(!t.isFinal)return n.push(t),n;let i=n.findIndex(e=>!e.isFinal&&e.source===t.source);return i>=0?(n[i]=t,n):(n.push(t),n)}function jt(e){return e.replace(/\|/g,`\\|`).replace(/\n/g,` `)}function Mt(e){let t=Math.floor(e/60),n=e%60;return`${String(t).padStart(2,`0`)}:${String(n).padStart(2,`0`)}`}function Nt(e){let t=e??{},n=0;typeof t.progress==`number`&&Number.isFinite(t.progress)&&(n=t.progress<=1?Math.round(t.progress*100):Math.round(Math.min(100,t.progress)));let r=t.file??t.name??``,i=t.status??``,a=`Loading model…`;return i===`initiate`?a=r?`Preparing: ${r}`:`Preparing…`:i===`download`||i===`progress`?a=r?`Downloading ${r} (${n}%)`:`Downloading… (${n}%)`:i===`done`?a=r?`Loaded ${r}`:`Loading…`:i?a=`${i}…`:r&&(a=`Loading ${r}`),{pct:n,status:a}}var G=new Set([`progress`,`ready`,`segment`,`chunk-done`,`done`,`error`]),Pt=0;function Ft(){return Pt+=1,`wh-${Pt}-${Date.now()}`}var It=class{#e=null;#t=!1;#n=null;#r=null;#i=null;#a=null;#o=0;#s=[];#c=null;constructor(){this.#e=new Worker(new URL(`/_astro/worker-B69YnygQ.js`,``+import.meta.url),{type:`module`}),this.#e.onmessage=e=>this.#u(e.data),this.#e.onerror=e=>{this.#r?.(Error(e.message??`Worker error`)),this.#a?.(Error(e.message??`Worker error`)),this.#c?.onError(e.message??`Worker error`)}}get isReady(){return this.#t}#l=null;loadModel(e,t){return this.#e?(this.#t=!1,this.#l=t??null,new Promise((t,n)=>{this.#n=t,this.#r=n,this.#e.postMessage({type:`load`,payload:e})})):Promise.reject(Error(`Worker not available`))}async transcribeBlob(e,t,n,r){if(!this.#e||!this.#t)throw Error(`Transcription model is not loaded.`);this.#c=n,this.#s=[],Pt=0;let i=await St(e,r),a=Et(i.samples,i.sampleRate,30);return this.#o=a.length,new Promise((e,n)=>{this.#i=e,this.#a=n,a.forEach((e,n)=>{this.#e.postMessage({type:`transcribe`,payload:{audio:e,sampleRate:i.sampleRate,language:t,chunkIndex:n}},[e.buffer])}),a.length===0&&e([])})}async transcribeSamples(e,t,n){if(!this.#e||!this.#t)throw Error(`Transcription model is not loaded.`);this.#c=n,this.#s=[],Pt=0;let r=Et(e,$e,30);return this.#o=r.length,new Promise((e,n)=>{this.#i=e,this.#a=n,r.forEach((e,n)=>{this.#e.postMessage({type:`transcribe`,payload:{audio:e,sampleRate:$e,language:t,chunkIndex:n}},[e.buffer])}),r.length===0&&e([])})}abort(){this.#e?.postMessage({type:`abort`}),this.#o=0,this.#a?.(Error(`Transcription aborted`)),this.#i=null,this.#a=null}terminate(){this.#e?.terminate(),this.#e=null,this.#t=!1}#u(e){if(!(!e?.type||!G.has(e.type))){if(e.type===`progress`){let{pct:t,status:n}=Nt(e.payload);this.#l?this.#l(t,n):this.#c?.onProgress(t,n);return}if(e.type===`ready`){this.#t=!0,this.#l=null,this.#n?.(),this.#n=null,this.#r=null;return}if(e.type===`segment`){let t=e.payload,n={id:Ft(),startMs:t.startMs,endMs:t.endMs,text:t.text,confidence:t.confidence,isFinal:!0,source:`whisper`};this.#s.push(n),this.#c?.onSegment(n);return}if(e.type===`chunk-done`){--this.#o;let e=this.#s.length||1,t=this.#s.length-(this.#o,0);if(this.#c?.onProgress(Math.round(t/e*100),this.#o>0?`Transcribing…`:`Finishing…`),this.#o<=0){let e=H(this.#s);this.#i?.(e),this.#i=null,this.#a=null}return}if(e.type===`error`){let t=e.payload?.message??`Transcription failed.`;this.#r?.(Error(t)),this.#a?.(Error(t)),this.#c?.onError(t),this.#n=null,this.#r=null,this.#i=null,this.#a=null}}}};function Lt(){let e=[`audio/webm;codecs=opus`,`audio/webm`,`audio/ogg;codecs=opus`,`audio/mp4`];return typeof MediaRecorder>`u`?e:[...e.filter(e=>MediaRecorder.isTypeSupported(e)),``]}function Rt(){return Lt().find(e=>e.length>0)??`audio/webm`}var zt=class{#e=null;#t=null;#n=null;#r=null;#i=null;#a=[];#o=0;#s=Rt();#c=!0;#l=`mic`;onCaptureEnded;get elapsedMs(){return this.#o?Date.now()-this.#o:0}get mimeType(){return this.#s}get inputSource(){return this.#l}async start(){await this.startWithSource(`mic`)}async startWithSource(e){this.#c=!0,this.#l=e;let t=await this.#u(e);await this.#d(t)}async startWithStream(e,t){this.#c=t?.releaseStreamOnStop??!1,this.#l=`mic`,await this.#d(e)}async#u(e){if(e===`mic`){let e=await navigator.mediaDevices.getUserMedia({audio:!0,video:!1});return this.#n=e,e}this.#t=await j(),this.#t.getVideoTracks()[0]?.addEventListener(`ended`,()=>this.onCaptureEnded?.(),{once:!0});let t=this.#t.getAudioTracks();if(t.length===0)throw this.#f(),new je;if(e===`system`)return new MediaStream(t);let n=await navigator.mediaDevices.getUserMedia({audio:!0,video:!1});this.#n=n;let{mixedStream:r,audioContext:i}=await Me(n,t);return this.#r=i,r}async#d(e){if(this.#i?.state===`recording`)return;this.#a=[];let t=e.getAudioTracks().filter(e=>e.readyState===`live`);if(t.length===0)throw Error(`No live audio tracks available to record. Check microphone / share permissions.`);let n;for(let e of Lt()){let r=new MediaStream(t.map(e=>e.clone()));try{let t=e?new MediaRecorder(r,{mimeType:e}):new MediaRecorder(r);t.ondataavailable=e=>{e.data.size>0&&this.#a.push(e.data)},t.start(1e3),this.#e=r,this.#i=t,this.#s=t.mimeType||e||`audio/webm`,this.#o=Date.now();return}catch(e){n=e,r.getTracks().forEach(e=>e.stop())}}this.#e=null;let r=n instanceof Error?n.message:String(n??`unknown error`);throw Error(`Could not start audio recorder (${r}). Try another browser or audio source.`)}async stop(){let e=this.#i;return!e||e.state===`inactive`?(this.#p(),new Blob(this.#a,{type:this.#s})):new Promise((t,n)=>{e.onstop=()=>{let e=new Blob(this.#a,{type:this.#s});this.#p(),t(e)},e.onerror=()=>{this.#p(),n(Error(`Recording failed.`))},e.stop()})}abort(){try{this.#i?.state===`recording`&&this.#i.stop()}catch{}this.#a=[],this.#p()}isOverLimit(){return this.elapsedMs>=Qe}#f(){this.#t?.getTracks().forEach(e=>e.stop()),this.#t=null,this.#c&&this.#n?.getTracks().forEach(e=>e.stop()),this.#n=null,this.#r&&=(this.#r.close(),null)}#p(){this.#e?.getTracks().forEach(e=>e.stop()),this.#f(),this.#e=null,this.#i=null,this.#o=0}};fe();var K=null;async function Bt(){K||=(async()=>{let{canEncodeAudio:e}=await pe(async()=>{let{canEncodeAudio:e}=await import(`./src.74gklwG5.js`).then(e=>e.t);return{canEncodeAudio:e}},__vite__mapDeps([0,1]));if(await e(`mp3`))return;let{registerMp3Encoder:t}=await pe(async()=>{let{registerMp3Encoder:e}=await import(`./mediabunny-mp3-encoder.BRfobvrU.js`);return{registerMp3Encoder:e}},__vite__mapDeps([2,1,0,3]));t()})(),await K}function Vt(e){let t=e.split(`;`)[0].trim().toLowerCase();return t.includes(`webm`)?`webm`:t.includes(`ogg`)?`ogg`:t.includes(`mp4`)||t.includes(`m4a`)||t.includes(`aac`)?`mp4`:`bin`}function Ht(e=`meeting-recording`){return`${e}-${new Date().toISOString().replace(/[:.]/g,`-`).slice(0,19)}`}function Ut(e,t=`audio/webm`){return e.type&&e.type!==`application/octet-stream`?e:new Blob([e],{type:t})}async function Wt(e){await Bt();let{ALL_FORMATS:t,BlobSource:n,BufferTarget:r,Conversion:i,Input:a,Mp3OutputFormat:o,Output:s}=await pe(async()=>{let{ALL_FORMATS:e,BlobSource:t,BufferTarget:n,Conversion:r,Input:i,Mp3OutputFormat:a,Output:o}=await import(`./src.74gklwG5.js`).then(e=>e.t);return{ALL_FORMATS:e,BlobSource:t,BufferTarget:n,Conversion:r,Input:i,Mp3OutputFormat:a,Output:o}},__vite__mapDeps([0,1])),c=new a({source:new n(Ut(e)),formats:t}),l=new s({format:new o,target:new r}),u=await i.init({input:c,output:l});if(!u.isValid)throw c.dispose(),Error(u.discardedTracks.length?`MP3 conversion failed: audio track could not be encoded in this browser.`:`MP3 conversion configuration is invalid.`);await u.execute(),c.dispose();let d=l.target.buffer;if(!d)throw Error(`MP3 conversion produced an empty buffer.`);return new Blob([d],{type:`audio/mpeg`})}async function Gt(e,t,n=Ht()){let r=Ut(e),i,a;if(t===`mp3`)i=await Wt(r),a=`${n}.mp3`;else{let e=Vt(r.type),o=e===`bin`||e===`webm`?`webm`:e;i=r.type.includes(`webm`)||o===`webm`?new Blob([r],{type:r.type||`audio/webm`}):r,a=`${n}.${o}`,t===`webm`&&o!==`webm`&&(a=`${n}.webm`,i=new Blob([r],{type:`audio/webm`}))}let o=URL.createObjectURL(i),s=document.createElement(`a`);return s.href=o,s.download=a,s.rel=`noopener`,s.style.display=`none`,document.body.appendChild(s),s.click(),s.remove(),{url:o,filename:a}}var Kt=new Set([`progress`,`ready`,`embedding`,`error`]),qt=class{#e=null;#t=!1;#n=null;#r=null;#i=null;#a=new Map;#o=0;#s(){return this.#e||(this.#e=new Worker(new URL(`/_astro/diarize-worker-DJZe0Ei2.js`,``+import.meta.url),{type:`module`}),this.#e.onmessage=e=>this.#c(e.data),this.#e.onerror=e=>{let t=Error(e.message??`Diarization worker error`);this.#r?.(t);for(let e of this.#a.values())e.reject(t);this.#a.clear()}),this.#e}get isReady(){return this.#t}loadModel(e={},t){let n=this.#s();return this.#t=!1,this.#i=t??null,new Promise((t,r)=>{this.#n=t,this.#r=r,n.postMessage({type:`load`,payload:e})})}embed(e){if(!this.#e||!this.#t)return Promise.reject(Error(`Diarization model is not loaded.`));let t=String(this.#o++),n=e.slice().buffer;return new Promise((e,r)=>{this.#a.set(t,{resolve:e,reject:r}),this.#e.postMessage({type:`embed`,payload:{requestId:t,audio:new Float32Array(n)}},[n])})}terminate(){this.#e?.terminate(),this.#e=null,this.#t=!1;for(let e of this.#a.values())e.reject(Error(`Diarization terminated`));this.#a.clear()}#c(e){if(!(!e?.type||!Kt.has(e.type))){if(e.type===`progress`){let{pct:t,status:n}=Nt(e.payload);this.#i?.(t,n);return}if(e.type===`ready`){this.#t=!0,this.#i=null,this.#n?.(),this.#n=null,this.#r=null;return}if(e.type===`embedding`){this.#a.get(e.payload.requestId)?.resolve(Float32Array.from(e.payload.embedding)),this.#a.delete(e.payload.requestId);return}if(e.type===`error`){let t=Error(e.payload?.message??`Diarization failed.`),n=e.payload?.requestId;n&&this.#a.has(n)?(this.#a.get(n)?.reject(t),this.#a.delete(n)):(this.#r?.(t),this.#n=null,this.#r=null)}}}};function Jt(e,t){let n=0,r=0,i=0;for(let a=0;a<e.length;a++)n+=e[a]*t[a],r+=e[a]*e[a],i+=t[a]*t[a];return r===0||i===0?0:n/(Math.sqrt(r)*Math.sqrt(i))}function Yt(e,t=st){let n=[],r=[];for(let i of e){let e=null;for(let t=0;t<n.length;t++){let r=Jt(i.embedding,n[t].embedding);(!e||r>e.sim)&&(e={idx:t,sim:r})}if(e&&e.sim>=t){let t=n[e.idx],a=t.count+1;for(let e=0;e<t.embedding.length;e++)t.embedding[e]=(t.embedding[e]*t.count+i.embedding[e])/a;t.count=a,r.push({startMs:i.startMs,endMs:i.endMs,speakerId:t.speakerId})}else{let e=_t(n.length);n.push({embedding:Float32Array.from(i.embedding),count:1,speakerId:e}),r.push({startMs:i.startMs,endMs:i.endMs,speakerId:e})}}return r}function Xt(e,t){return e.map(e=>{let n=null;for(let r=0;r<t.length;r++){let i=t[r],a=Math.min(e.endMs,i.endMs)-Math.max(e.startMs,i.startMs);a>0&&(!n||a>n.overlap)&&(n={idx:r,overlap:a})}return n?{...e,speakerId:t[n.idx].speakerId}:e})}var Zt=3;function Qt(e){return U(e).length>=Zt}function $t(e){return`You are a meeting secretary. From the transcript below, produce structured meeting minutes as JSON only (no markdown fences).

Required JSON shape:
{
  "title": "string",
  "attendees": ["name or role"],
  "agenda": ["topic"],
  "decisions": ["decision"],
  "actionItems": [{ "owner": "optional", "task": "string", "due": "optional" }],
  "summary": "2-4 sentence summary"
}

Transcript:
${U(e).map(e=>`[${Math.floor(e.startMs/1e3)}s] ${e.text.trim()}`).join(`
`)}`}function en(e,t){let n=e.trim().match(/\{[\s\S]*\}/);if(!n)return null;try{let e=JSON.parse(n[0]);return!e||typeof e!=`object`?null:{title:String(e.title??`Meeting notes`),attendees:Array.isArray(e.attendees)?e.attendees.map(String):[],agenda:Array.isArray(e.agenda)?e.agenda.map(String):[],decisions:Array.isArray(e.decisions)?e.decisions.map(String):[],actionItems:Array.isArray(e.actionItems)?e.actionItems.map(e=>({owner:e?.owner?String(e.owner):void 0,task:String(e?.task??``),due:e?.due?String(e.due):void 0})).filter(e=>e.task):[],summary:String(e.summary??``),rawTranscript:U(t)}}catch{return null}}function tn(e){return[`# ${e.title}`,``,`## Summary`,e.summary||`_No summary._`,``,`## Attendees`,...e.attendees.length?e.attendees.map(e=>`- ${e}`):[`- _Unknown_`],``,`## Agenda`,...e.agenda.length?e.agenda.map(e=>`- ${e}`):[`- _None recorded_`],``,`## Decisions`,...e.decisions.length?e.decisions.map(e=>`- ${e}`):[`- _None recorded_`],``,`## Action items`,...e.actionItems.length?e.actionItems.map(e=>`- ${e.task}${e.owner?` (@${e.owner})`:``}${e.due?` — due ${e.due}`:``}`):[`- _None recorded_`],``,`---`,``,`_AI-generated draft — review before sharing._`].join(`
`)}function nn(){return new Promise((e,t)=>{let n=indexedDB.open(z,1);n.onupgradeneeded=()=>{n.result.createObjectStore(B)},n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}async function rn(){try{let e=await nn();return new Promise((t,n)=>{let r=e.transaction(B,`readonly`).objectStore(B).get(nt);r.onsuccess=()=>t(r.result??null),r.onerror=()=>n(r.error)})}catch{return null}}async function an(e,t,n){try{let r=await nn(),i={id:nt,updatedAt:Date.now(),segments:e,language:t,speakerLabelOverrides:n};return new Promise((e,t)=>{let n=r.transaction(B,`readwrite`).objectStore(B).put(i,nt);n.onsuccess=()=>e(),n.onerror=()=>t(n.error)})}catch{}}async function on(){try{let e=await nn();return new Promise((t,n)=>{let r=e.transaction(B,`readwrite`).objectStore(B).delete(nt);r.onsuccess=()=>t(),r.onerror=()=>n(r.error)})}catch{}}var sn=f(`<div class="alert alert-danger mb-3 svelte-1eaoyra" id="error-msg" role="alert"><i class="fas fa-triangle-exclamation me-2 svelte-1eaoyra"></i> </div>`),cn=f(`<div class="alert alert-warning mb-3 svelte-1eaoyra" id="mic-denied-alert" role="alert">Allow microphone access in your browser site settings for this page, then try again.</div>`),ln=f(`<div class="alert alert-secondary mb-3 svelte-1eaoyra" id="first-run-hint" role="alert"><strong class="svelte-1eaoyra">First time on Record / Upload?</strong> Load the Whisper model once (~40–75 MB). It stays cached in your browser. <strong class="svelte-1eaoyra">Live</strong> defaults to Web Speech API — no Whisper download needed unless you switch to LocalAI. <button type="button" class="btn btn-sm btn-outline-secondary ms-2 svelte-1eaoyra">Dismiss</button></div>`),q=f(`<option class="svelte-1eaoyra"> </option>`),un=f(`<div class="form-check svelte-1eaoyra"><input class="form-check-input svelte-1eaoyra" type="radio" name="live-source" id="live-src-system"/> <label class="form-check-label svelte-1eaoyra" for="live-src-system"><strong class="svelte-1eaoyra">System / tab audio</strong> <span class="text-muted svelte-1eaoyra">(what you hear — Teams / Meet / Zoom)</span></label></div> <div class="form-check svelte-1eaoyra"><input class="form-check-input svelte-1eaoyra" type="radio" name="live-source" id="live-src-mixed"/> <label class="form-check-label svelte-1eaoyra" for="live-src-mixed"><strong class="svelte-1eaoyra">Microphone + system audio</strong> <span class="text-muted svelte-1eaoyra">(mix both into one caption stream)</span></label></div>`,1),dn=f(`Captions use <strong class="svelte-1eaoyra">Web Speech API</strong> on that audio track (Chrome/Edge 135+).`,1),fn=f(`<div class="alert alert-warning py-2 mb-3 svelte-1eaoyra" role="alert">Tab-audio Web Speech needs Chrome/Edge 135+. Use <strong class="svelte-1eaoyra">Microphone</strong>, switch to <strong class="svelte-1eaoyra">LocalAI</strong>, or use Record/Upload.</div>`),pn=f(`<div class="alert alert-info py-2 mb-3 svelte-1eaoyra" id="live-meeting-help" role="note"><strong class="svelte-1eaoyra">Teams / Zoom / Meet:</strong> click Start, share the <strong class="svelte-1eaoyra">meeting browser tab</strong>, and enable <strong class="svelte-1eaoyra">Share tab audio</strong>. <!></div> <!>`,1),mn=f(`<div class="alert alert-warning svelte-1eaoyra">Live mic captions require Chrome, Edge, or Safari. Use <strong class="svelte-1eaoyra">LocalAI</strong> or <strong class="svelte-1eaoyra">Record</strong> instead.</div>`),J=f(`<div class="form-check mb-2 svelte-1eaoyra"><input class="form-check-input svelte-1eaoyra" type="checkbox" id="prefer-on-device"/> <label class="form-check-label svelte-1eaoyra" for="prefer-on-device">Prefer on-device recognition</label></div> <div class="form-check mb-2 svelte-1eaoyra"><input class="form-check-input svelte-1eaoyra" type="checkbox" id="allow-cloud-fallback"/> <label class="form-check-label svelte-1eaoyra" for="allow-cloud-fallback">Allow cloud fallback if on-device unavailable</label></div>`,1),hn=f(`<span class="badge bg-success svelte-1eaoyra"><i class="fas fa-check me-1 svelte-1eaoyra"></i>Installed</span>`),gn=f(`<span class="badge bg-info svelte-1eaoyra"><i class="fas fa-spinner fa-spin me-1 svelte-1eaoyra"></i>Installing…</span>`),_n=f(`<button type="button" class="btn btn-sm btn-outline-info svelte-1eaoyra" id="install-lang-pack-btn"><i class="fas fa-download me-1 svelte-1eaoyra"></i>Install language pack</button> <p class="text-muted small mt-2 mb-0 svelte-1eaoyra">Requires Chrome or Edge. Download stays in the browser (not on this site). You can also add the language in <code class="svelte-1eaoyra">chrome://settings/languages</code> then return here and click Install.</p>`,1),vn=f(`<p class="text-muted small mb-0 svelte-1eaoyra">Add <strong class="svelte-1eaoyra"> </strong> in <code class="svelte-1eaoyra">chrome://settings/languages</code> (Chrome/Edge — paste in the address bar), wait for speech components to finish downloading, reload this page, then check again.
              Or enable <strong class="svelte-1eaoyra">Allow cloud fallback</strong> / switch to <strong class="svelte-1eaoyra">LocalAI</strong>.</p>`),Y=f(`<p class="text-muted small mb-0 svelte-1eaoyra">Safari and some browsers always use cloud recognition — enable cloud fallback or use LocalAI.</p>`),yn=f(`<div class="border rounded p-3 mb-3 svelte-1eaoyra" id="lang-pack-panel"><h6 class="fw-semibold mb-2 svelte-1eaoyra">On-device language pack</h6> <p class="text-muted small mb-2 svelte-1eaoyra" id="lang-pack-status"> </p> <!></div>`),X=f(`<div class="alert alert-secondary py-2 mb-3 svelte-1eaoyra" id="live-status-hint" role="status"> </div>`),Z=f(`<button type="button" class="btn btn-primary svelte-1eaoyra" id="start-live-btn"><i class="fas fa-microphone me-1 svelte-1eaoyra"></i>Start live captions</button>`),bn=f(`<button type="button" class="btn btn-danger svelte-1eaoyra" id="stop-live-btn"><i class="fas fa-stop me-1 svelte-1eaoyra"></i>Stop captions</button>`),xn=f(`<button type="button" class="btn btn-outline-secondary svelte-1eaoyra" id="download-recording-webm-btn">Download .webm</button> <button type="button" class="btn btn-outline-secondary svelte-1eaoyra" id="download-recording-mp3-btn">Download .mp3</button>`,1),Sn=f(`<p class="text-muted small svelte-1eaoyra">Real-time captions from mic and/or meeting audio.</p> <fieldset class="mb-3 border rounded p-3 svelte-1eaoyra" id="live-engine-fieldset"><legend class="form-label fw-semibold mb-2 w-auto px-2 svelte-1eaoyra">Speech engine</legend> <div class="form-check svelte-1eaoyra"><input class="form-check-input svelte-1eaoyra" type="radio" name="live-engine" id="live-engine-webspeech"/> <label class="form-check-label svelte-1eaoyra" for="live-engine-webspeech"><strong class="svelte-1eaoyra">Web Speech API</strong> <span class="badge bg-primary-subtle text-primary-emphasis ms-1 svelte-1eaoyra">Recommended</span> <br class="svelte-1eaoyra"/><span class="text-muted small svelte-1eaoyra">Best accuracy, including Vietnamese. Live word-by-word captions.</span></label></div> <div class="form-check mt-2 svelte-1eaoyra"><input class="form-check-input svelte-1eaoyra" type="radio" name="live-engine" id="live-engine-localai"/> <label class="form-check-label svelte-1eaoyra" for="live-engine-localai"><strong class="svelte-1eaoyra">LocalAI</strong> <span class="text-muted svelte-1eaoyra">(Whisper, fully offline/private)</span> <br class="svelte-1eaoyra"/><span class="text-muted small svelte-1eaoyra">Works without internet or in Firefox. Captions appear after each pause; load the Whisper model below first.</span></label></div></fieldset> <fieldset class="mb-3 svelte-1eaoyra" id="live-source-fieldset"><legend class="form-label fw-semibold mb-2 svelte-1eaoyra">Caption source</legend> <div class="form-check svelte-1eaoyra"><input class="form-check-input svelte-1eaoyra" type="radio" name="live-source" id="live-src-mic"/> <label class="form-check-label svelte-1eaoyra" for="live-src-mic"><strong class="svelte-1eaoyra">Microphone</strong> <span class="text-muted svelte-1eaoyra">(your voice near the mic)</span></label></div> <!></fieldset> <!> <!> <div class="form-check mb-3 svelte-1eaoyra"><input class="form-check-input svelte-1eaoyra" type="checkbox" id="record-live-audio"/> <label class="form-check-label svelte-1eaoyra" for="record-live-audio">Also save an audio recording while captioning (.webm / .mp3 after Stop)</label></div> <!> <!> <div class="d-flex gap-2 mb-3 flex-wrap svelte-1eaoyra"><!> <!></div> <p class="text-muted small mb-0 svelte-1eaoyra"><!> Saved audio always uses a <code class="svelte-1eaoyra">.webm</code> or <code class="svelte-1eaoyra">.mp3</code> filename.</p>`,1),Cn=f(`<div class="form-check svelte-1eaoyra"><input class="form-check-input svelte-1eaoyra" type="radio" name="record-source" id="record-src-system"/> <label class="form-check-label svelte-1eaoyra" for="record-src-system">System / tab audio</label></div> <div class="form-check svelte-1eaoyra"><input class="form-check-input svelte-1eaoyra" type="radio" name="record-source" id="record-src-mixed"/> <label class="form-check-label svelte-1eaoyra" for="record-src-mixed">Microphone + system audio</label></div>`,1),Q=f(`<p class="text-muted small mb-0 svelte-1eaoyra">System audio capture requires a desktop browser with screen sharing (Chrome, Edge, or Firefox).</p>`),wn=f(`<div class="alert alert-secondary py-2 mb-3 svelte-1eaoyra" id="system-audio-help" role="note"><strong class="svelte-1eaoyra">Capturing meeting audio:</strong> when prompted, share the <strong class="svelte-1eaoyra">browser tab</strong> running your call (Zoom, Teams, Meet, etc.) and enable <strong class="svelte-1eaoyra">Share tab audio</strong>. For desktop-wide sound, share your <strong class="svelte-1eaoyra">entire screen</strong> and enable <strong class="svelte-1eaoyra">Share system audio</strong> (Windows/macOS; availability varies by browser and OS).</div>`),Tn=f(`<button type="button" class="btn btn-primary svelte-1eaoyra" id="start-record-btn"><i class="fas fa-circle me-1 svelte-1eaoyra"></i>Start recording</button>`),En=f(`<button type="button" class="btn btn-outline-danger svelte-1eaoyra" id="stop-record-btn"><i class="fas fa-stop me-1 svelte-1eaoyra"></i>Stop &amp; save</button> <button type="button" class="btn btn-danger svelte-1eaoyra" id="stop-transcribe-btn"><i class="fas fa-stop me-1 svelte-1eaoyra"></i>Stop and transcribe</button>`,1),Dn=f(`<button type="button" class="btn btn-outline-secondary svelte-1eaoyra" id="download-recording-btn-record">Download .webm</button> <button type="button" class="btn btn-outline-secondary svelte-1eaoyra" id="download-recording-mp3-btn-record">Download .mp3</button> <button type="button" class="btn btn-outline-primary svelte-1eaoyra" id="transcribe-recording-btn">Transcribe recording</button>`,1),On=f(`<p class="text-muted small svelte-1eaoyra" id="recording-ready-hint">Recording ready: <code class="svelte-1eaoyra"> </code> — download .webm/.mp3 or transcribe after loading Whisper.</p>`),kn=f(`<p class="text-muted small svelte-1eaoyra">Record microphone, system/tab audio, or both — save as .webm/.mp3, then optionally transcribe with Whisper.</p> <fieldset class="mb-3 svelte-1eaoyra" id="record-source-fieldset"><legend class="form-label fw-semibold mb-2 svelte-1eaoyra">Audio source</legend> <div class="form-check svelte-1eaoyra"><input class="form-check-input svelte-1eaoyra" type="radio" name="record-source" id="record-src-mic"/> <label class="form-check-label svelte-1eaoyra" for="record-src-mic">Microphone</label></div> <!></fieldset> <!> <div class="d-flex gap-2 mb-3 flex-wrap svelte-1eaoyra"><!> <!></div> <!>`,1),An=f(`<small class="text-muted d-block mt-1 svelte-1eaoyra"> </small>`),jn=f(`<p class="text-muted small svelte-1eaoyra">Transcribe an existing audio or video file.</p> <div class="mb-3 svelte-1eaoyra"><input type="file" class="form-control svelte-1eaoyra" id="file-input" accept="audio/*,video/*,.webm,.wav,.mp3,.ogg,.flac,.mp4,.m4a"/> <!></div> <button type="button" class="btn btn-primary mb-3 svelte-1eaoyra" id="transcribe-file-btn">Transcribe file</button>`,1),Mn=f(`<span class="badge bg-success svelte-1eaoyra"><i class="fas fa-folder-open me-1 svelte-1eaoyra"></i> </span> <button type="button" class="btn btn-outline-secondary btn-sm svelte-1eaoyra">Clear folder</button>`,1),Nn=f(`<button type="button" class="btn btn-outline-secondary btn-sm svelte-1eaoyra">Pick cache folder (optional)</button>`),Pn=f(`<button type="button" class="btn btn-info text-white mb-2 svelte-1eaoyra" id="load-whisper-btn"><i class="fas fa-download me-1 svelte-1eaoyra"></i>Load transcription model</button>`),Fn=f(`<div class="mb-3 svelte-1eaoyra"><div class="d-flex justify-content-between mb-1 svelte-1eaoyra"><small class="text-muted svelte-1eaoyra"> </small> <small class="text-muted svelte-1eaoyra"> </small></div> <div class="progress svelte-1eaoyra" style="height: 8px"><div class="progress-bar bg-info svelte-1eaoyra"></div></div></div>`),In=f(`<div class="alert alert-success py-2 mb-2 svelte-1eaoyra"><i class="fas fa-check me-1 svelte-1eaoyra"></i>Model ready</div>`),Ln=f(`<hr class="svelte-1eaoyra"/> <h6 class="fw-semibold svelte-1eaoyra">Whisper transcription model</h6> <p class="text-muted small svelte-1eaoyra"><!></p> <div class="mb-2 svelte-1eaoyra"><label class="form-label svelte-1eaoyra" for="model-select">Model</label> <select id="model-select" class="form-select form-select-sm svelte-1eaoyra"></select></div> <div class="mb-2 d-flex align-items-center gap-2 flex-wrap svelte-1eaoyra"><!></div> <!> <!> <!>`,1),Rn=f(`<span class="mic-indicator svelte-1eaoyra" id="mic-indicator"></span> <span class="svelte-1eaoyra"> </span> <span class="text-muted svelte-1eaoyra" id="elapsed-timer"> </span>`,1),zn=f(`<span class="svelte-1eaoyra"> </span> <small class="text-muted svelte-1eaoyra"> </small> <div class="progress status-progress svelte-1eaoyra" style="height: 6px"><div class="progress-bar svelte-1eaoyra"></div></div>`,1),Bn=f(`<div class="d-flex align-items-center gap-2 mb-3 p-2 border rounded flex-wrap svelte-1eaoyra" id="status-strip"><!></div>`),Vn=f(`<span class="text-muted svelte-1eaoyra">No transcript yet — start live captions, record, or upload a file.</span>`),Hn=f(`<input class="form-control-plaintext form-control-sm d-inline-block fw-semibold text-warning speaker-label-input p-0 me-1 svelte-1eaoyra" style="width: auto; min-width: 90px; border-bottom: 1px dashed currentColor;" title="Click to rename this speaker — renames every line using this label"/>:`,1),Un=f(`<div><span class="text-info small me-2 svelte-1eaoyra"> </span> <!> </div>`),Wn=f(`<div class="interim-line svelte-1eaoyra" id="listening-placeholder">Listening…</div>`),Gn=f(`<!> <!>`,1),Kn=f(`<button type="button" class="btn btn-info btn-sm text-dark jump-latest-btn svelte-1eaoyra" aria-controls="transcript-panel" aria-label="Resume automatic transcript scrolling and jump to latest"><i class="fas fa-arrow-down me-1 svelte-1eaoyra" aria-hidden="true"></i>Jump to latest</button>`),qn=f(`<p class="text-muted small mb-2 svelte-1eaoyra">Needs a recording or uploaded file — check "Also save an audio recording" on Live, or use Record/Upload.</p>`),Jn=f(`<small class="text-muted svelte-1eaoyra"> </small>`),Yn=f(`<div class="mb-2 svelte-1eaoyra"><div class="d-flex justify-content-between mb-1 svelte-1eaoyra"><small class="text-muted svelte-1eaoyra"> </small> <!></div> <div class="progress svelte-1eaoyra" style="height: 6px"><div class="progress-bar bg-secondary svelte-1eaoyra"></div></div></div>`),Xn=f(`<p class="text-success small mb-2 svelte-1eaoyra"><i class="fas fa-check me-1 svelte-1eaoyra"></i> </p>`),Zn=f(`<hr class="svelte-1eaoyra"/> <h6 class="fw-semibold svelte-1eaoyra">Speaker diarization</h6> <p class="text-muted small svelte-1eaoyra">Identify who's speaking using real voice-embedding clustering (WeSpeaker) — more accurate than the automatic pause-based labels above. Runs on the most recent recording/upload only.</p> <button type="button" class="btn btn-secondary btn-sm mb-2 svelte-1eaoyra" id="diarize-btn"> </button> <!> <!> <!>`,1),Qn=f(`<div class="border rounded p-3 mb-3 svelte-1eaoyra"><p class="small text-warning svelte-1eaoyra"><em class="svelte-1eaoyra">AI-generated draft — review before sharing.</em></p> <div class="mb-2 svelte-1eaoyra"><label class="form-label svelte-1eaoyra" for="mom-title">Title</label> <input id="mom-title" class="form-control form-control-sm svelte-1eaoyra"/></div> <div class="mb-2 svelte-1eaoyra"><label class="form-label svelte-1eaoyra" for="mom-summary">Summary</label> <textarea id="mom-summary" class="form-control form-control-sm svelte-1eaoyra" rows="3"></textarea></div> <div class="mb-2 svelte-1eaoyra"><label class="form-label svelte-1eaoyra" for="mom-decisions">Decisions (one per line)</label> <textarea id="mom-decisions" class="form-control form-control-sm svelte-1eaoyra" rows="3"></textarea></div> <div class="mb-2 svelte-1eaoyra"><label class="form-label svelte-1eaoyra" for="mom-actions">Action items (one per line)</label> <textarea id="mom-actions" class="form-control form-control-sm svelte-1eaoyra" rows="3"></textarea></div> <button type="button" class="btn btn-outline-secondary btn-sm svelte-1eaoyra">Download minutes MD</button></div>`),$n=f(`<hr class="svelte-1eaoyra"/> <h6 class="fw-semibold svelte-1eaoyra">Meeting minutes (AI draft)</h6> <p class="text-muted small svelte-1eaoyra">Generate structured minutes from the transcript using a local model. Review before sharing.</p> <button type="button" class="btn btn-secondary mb-3 svelte-1eaoyra"> </button> <!>`,1),er=f(`<div class="modal fade show d-block svelte-1eaoyra" tabindex="-1" style="background: rgba(0,0,0,.5)"><div class="modal-dialog svelte-1eaoyra"><div class="modal-content bg-dark text-light svelte-1eaoyra"><div class="modal-header svelte-1eaoyra"><h5 class="modal-title svelte-1eaoyra">Stop active capture?</h5></div> <div class="modal-body svelte-1eaoyra">Switching tabs will stop the current live session or recording.</div> <div class="modal-footer svelte-1eaoyra"><button type="button" class="btn btn-secondary svelte-1eaoyra">Stay</button> <button type="button" class="btn btn-danger svelte-1eaoyra">Stop</button></div></div></div></div>`),tr=f(`<div class="card google-anno-skip svelte-1eaoyra"><div class="card-body svelte-1eaoyra"><div class="alert alert-info mb-3 d-flex align-items-center flex-wrap gap-2 svelte-1eaoyra" role="alert"><span id="privacy-badge"> </span> <span class="svelte-1eaoyra"><!></span></div> <!> <!> <div class="row g-3 align-items-start svelte-1eaoyra"><div class="col-lg-5 mn-col svelte-1eaoyra"><ul class="nav nav-tabs mb-3 svelte-1eaoyra"><li class="nav-item svelte-1eaoyra"><button type="button" id="tab-live">Live</button></li> <li class="nav-item svelte-1eaoyra"><button type="button" id="tab-record">Record</button></li> <li class="nav-item svelte-1eaoyra"><button type="button" id="tab-upload">Upload</button></li></ul> <!> <div class="mb-3 svelte-1eaoyra"><label class="form-label fw-semibold svelte-1eaoyra" for="lang-select">Language</label> <select id="lang-select" class="form-select svelte-1eaoyra"></select></div> <!> <!> <!> <!> <!></div> <div class="col-lg-7 mn-col svelte-1eaoyra"><h6 class="fw-semibold svelte-1eaoyra">Transcript</h6> <div class="position-relative transcript-wrap mb-3 svelte-1eaoyra"><div class="border rounded p-3 bg-dark text-light transcript-panel svelte-1eaoyra" id="transcript-panel" aria-label="Live transcript" aria-live="polite" role="log"><!></div> <!></div> <div class="d-flex gap-2 flex-wrap mb-3 mn-actions svelte-1eaoyra"><button type="button" class="btn btn-outline-secondary btn-sm svelte-1eaoyra" id="copy-transcript-btn">Copy</button> <button type="button" class="btn btn-outline-secondary btn-sm svelte-1eaoyra">Download MD</button> <button type="button" class="btn btn-outline-secondary btn-sm svelte-1eaoyra">Download JSON</button> <button type="button" class="btn btn-outline-danger btn-sm svelte-1eaoyra" id="clear-session-btn">Clear session</button></div> <div class="form-check mb-4 svelte-1eaoyra"><input class="form-check-input svelte-1eaoyra" type="checkbox" id="dont-persist"/> <label class="form-check-label svelte-1eaoyra" for="dont-persist">Don't save transcript to this browser</label></div> <!> <!></div></div></div></div> <!>`,1);function nr(e,t){ae(t,!1);let n=p(),f=p(),fe=p(),pe=p(),k=p(),me=p(),A=p(),he=p(),ge=p(),_e=p(),ve=p(),ye=p(),be=p(),xe=p(),Se=p(),Ce=p(),we=p(),Te=p(),Ee=p(),Oe=p(),je=p(),j=p(),Me=p(),Ne=p(),Pe=[],Fe=[],Ie=[],Le=p(`live`),He=p(tt),N=p(`web-speech`),We=p(!0),Ge=p(!0),Ke=p(!0),Je=p(`on-device`),Ye=p(`On-device`),P=p(`idle`),F=p(`idle`),I=p(`idle`),Xe=p(0),Ze=p(``),Qe=p(0),$e=p(``),L=p(``),R=p(!1),z=p([]),B=p(!1),nt=p(!1),it=p(et),st=null,ct=p(``),lt=p(null),pt=p(null),mt=p(`mic`),ht=p(`mic`),vt=p(``),yt=p(!1),bt=p(`checking`),xt=p(!1),wt=null,Tt=null,Et=null,H=null,U=p(null),jt=null,Nt=p(`meeting-recording.webm`),G=p(0),Pt=null,Ft=null,Lt=null,Rt=p(`idle`),K=p(null),Bt=``,Vt=p(!1),Wt=p(null),Kt=null,Jt=0,Zt=p({}),nn=null,nr=p(`idle`),rr=p(0),ir=p(``),ar=null,or=p(!0),sr=Re(),cr=ke(),lr=qe();function ur(){return!ar||ar.scrollHeight-ar.scrollTop-ar.clientHeight<=56}function dr(){E(or,ur())}function fr(e){return ar=e,()=>{ar===e&&(ar=null)}}async function pr(){await _(),a(or)&&ar&&(ar.scrollTop=ar.scrollHeight)}async function mr(){E(or,!0),await pr()}function hr(){return Ft||=new It,Ft}async function gr(){if(!sr||!a(We)||a(N)!==`web-speech`){E(bt,`api-unavailable`);return}E(bt,`checking`),E(bt,await M(a(He)))}async function _r(){if(a(Me)){E(xt,!0),E(L,``);try{await Be(a(He)),E(bt,`available`)}catch(e){E(L,e instanceof Error?e.message:String(e))}finally{E(xt,!1)}}}function vr(){a(Le)===`live`&&gr()}function yr(){a(Le)===`live`&&gr()}function br(e){return e===`on-device`?`On-device`:e===`cloud-assisted`?`Cloud-assisted`:`Local Whisper model`}function xr(e){E(Je,e),E(Ye,br(e))}function Sr(){a(N)===`local-ai`?xr(`local-model`):(xr(a(We)?`on-device`:`cloud-assisted`),gr())}function Cr(){wr(),E(G,0),Pt=setInterval(()=>{E(G,a(G)+1)},1e3)}function wr(){Pt&&clearInterval(Pt),Pt=null}async function Tr(){!a(B)&&a(z).length&&await an(a(z),a(He),a(Zt))}function Er(e){if(a(N)===`web-speech`&&!Ue(e)){E(vt,e);return}E(L,e),E(F,`error`)}function Dr(e){return(e.turnBoundary??gt(Kt??void 0,e.startMs))&&(Jt+=1),_t(Math.max(0,Jt-1))}function Or(e,t){e&&E(Zt,{...a(Zt),[e]:t})}function kr(e){if(E(vt,``),!e.isFinal){E(z,At(a(z),e)),pr();return}let t=Dr(e);Kt=e.endMs,E(z,At(a(z),{...e,speakerId:t})),pr(),Tr()}async function Ar(){if(!(`showDirectoryPicker`in window)){alert(`Your browser does not support choosing a cache folder. The model will use built-in browser cache.`);return}try{st=await window.showDirectoryPicker({mode:`readwrite`,id:`meeting-notes-model-cache`}),E(ct,st.name)}catch(e){e instanceof Error&&e.name!==`AbortError`&&alert(`Could not open directory: `+e.message)}}function jr(){st=null,E(ct,``)}async function Mr(){if(a(P)!==`loading`){E(P,`loading`),E(Xe,0),E(Ze,`Initializing…`),E(L,``),xr(`local-model`);try{await hr().loadModel({dirHandle:st??void 0,modelId:a(it)},(e,t)=>{E(Xe,Math.max(0,Math.min(100,e))),E(Ze,t)}),E(P,`ready`),E(Ze,``)}catch(e){E(L,e instanceof Error?e.message:String(e)),E(P,`error`)}}}async function Nr(e){a(Ke)&&(Et=new zt,await Et.startWithStream(e,{releaseStreamOnStop:!1}))}function Pr(){return{onPartial:e=>kr(e),onFinal:e=>kr(e),onError:Er,onPrivacyMode:e=>xr(e),onSpeechStart:()=>{E(yt,!0)},onSpeechEnd:()=>{E(yt,!1)}}}async function Fr(){if(!a(ge))return;E(L,``),E(vt,``),E(F,`idle`),Ur(),E(U,null),Et=null;let e=a(pe);try{wt=await V(e,{engine:a(N),preferOnDevice:a(We),allowCloudFallback:a(Ge),onMediaStream:async e=>{Tt=e,await Nr(e)}},Pr(),hr(),a(He),a(n)),E(vt,a(N)===`local-ai`?`LocalAI (Whisper): captions appear after each pause in speech.`:e===`mic`?`Web Speech on microphone.`:e===`mixed`?`Web Speech on microphone + tab/system audio (mixed).`:`Web Speech on tab/system audio. Keep the shared tab audible.`),E(F,`listening`),Cr()}catch(e){E(L,e instanceof Error?e.message:String(e)),Tt?.getTracks().forEach(e=>e.stop()),Tt=null,E(F,`idle`)}}async function Ir(){if(wr(),E(yt,!1),Et){try{let e=Ut(await Et.stop());E(U,e),Ur(),jt=URL.createObjectURL(e),E(Nt,`${Ht()}.${e.type.includes(`webm`),`webm`}`),setTimeout(()=>Ur(),300*1e3)}catch{}Et=null}await wt?.stop(),wt=null,Tt?.getTracks().forEach(e=>e.stop()),Tt=null,E(F,`idle`),await Tr(),gr()}async function Lr(){if(a(ye)){E(L,``),E(U,null),Ur(),H=new zt,H.onCaptureEnded=()=>{a(I)===`recording`&&zr()};try{await H.startWithSource(a(mt)),E(I,`recording`),Cr()}catch(e){E(L,e instanceof Error?e.message:String(e)),H?.abort(),H=null,E(I,`idle`)}}}async function Rr(){if(!H)return null;let e=Ut(await H.stop());return H=null,E(U,e),Ur(),jt=URL.createObjectURL(e),E(Nt,`${Ht()}.webm`),setTimeout(()=>Ur(),600*1e3),e}async function zr(){if(!(!H||a(I)!==`recording`)){wr(),E(I,`idle`);try{await Rr()}catch(e){E(L,e instanceof Error?e.message:String(e)),E(I,`error`)}}}async function Br(){if(!(!H||a(I)!==`recording`)){wr(),E(I,`idle`);try{let e=await Rr();if(!e)return;if(a(P)!==`ready`){E(L,`Recording saved. Load the Whisper model, then click Transcribe recording.`);return}await Wr(e,a(Nt))}catch(e){E(L,e instanceof Error?e.message:String(e)),E(I,`error`)}}}async function Vr(){!a(U)||!a(xe)||await Wr(a(U),a(Nt))}async function Hr(e){if(!(!a(U)||a(R))){E(R,!0),E(L,``);try{let{url:t,filename:n}=await Gt(a(U),e);E(Nt,n),e===`webm`?(Ur(),jt=t):setTimeout(()=>URL.revokeObjectURL(t),6e4)}catch(e){E(L,e instanceof Error?e.message:String(e))}finally{E(R,!1)}}}function Ur(){jt&&=(URL.revokeObjectURL(jt),null)}async function Wr(e,t){E(P,`transcribing`),E(Qe,0),E($e,`Decoding audio…`),xr(`local-model`);try{await hr().transcribeBlob(e,a(n),{onProgress:(e,t)=>{E(Qe,e),E($e,t)},onSegment:e=>kr(e),onError:e=>{E(L,e)}},t),E(P,`ready`),E($e,``)}catch(e){E(L,e instanceof Error?e.message:String(e)),E(P,`ready`)}}async function Gr(e){let t=e.target,n=t.files?.[0]??null;if(E(lt,n),E(pt,null),n)try{E(pt,await Ct(n,n.name))}catch(e){E(L,e instanceof Error?e.message:String(e)),E(lt,null),t.value=``}}async function Kr(){!a(lt)||!a(Se)||await Wr(a(lt),a(lt).name)}function qr(e){if(e!==a(Le)){if(a(F)===`listening`||a(I)===`recording`){E(Wt,e),E(Vt,!0);return}E(Le,e),e===`live`&&(gr(),a(Je)===`local-model`&&xr(a(N)===`local-ai`?`local-model`:a(We)?`on-device`:`cloud-assisted`))}}async function Jr(){a(F)===`listening`&&await Ir(),a(I)===`recording`&&(H?.abort(),H=null,E(I,`idle`),wr()),E(Vt,!1),a(Wt)&&(E(Le,a(Wt)),E(Wt,null))}function Yr(){E(nt,!0);try{sessionStorage.setItem(rt,`1`)}catch{}}async function Xr(){if(a(P)===`transcribing`){if(!confirm(`Transcription in progress. Clear anyway?`))return;Ft?.abort(),E(P,`ready`)}E(z,[]),E(or,!0),E(K,null),Bt=``,Kt=null,Jt=0,E(Zt,{}),E(nr,`idle`),E(ir,``),await on()}async function Zr(){await navigator.clipboard.writeText(Ot(a(z)))}function Qr(){$r(kt(a(z)),`meeting-transcript.md`,`text/markdown`)}function $(){$r(W(a(z)),`meeting-transcript.json`,`application/json`)}function $r(e,t,n){let r=new Blob([e],{type:n}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=t,a.click(),URL.revokeObjectURL(i)}async function ei(){if(!a(Te))return;E(Rt,`loading-model`),Bt=``,E(K,null),E(L,``),Lt||=new Worker(new URL(`/_astro/minutes-worker-SRvmiBii.js`,``+import.meta.url),{type:`module`});let e=$t(a(z));await new Promise((t,n)=>{let r=i=>{let{type:a,payload:o}=i.data;a===`ready`?(E(Rt,`generating`),Lt.postMessage({type:`generate`,payload:{prompt:e}})):a===`token`?Bt+=String(o??``):a===`done`?(Lt.removeEventListener(`message`,r),t()):a===`error`&&(Lt.removeEventListener(`message`,r),n(Error(String(o??`Minutes generation failed`))))};Lt.addEventListener(`message`,r),Lt.postMessage({type:`load`,payload:{dirHandle:st??void 0}})}).catch(e=>{E(L,e instanceof Error?e.message:String(e)),E(Rt,`error`)}),(a(Rt)===`generating`||Bt)&&(E(K,en(Bt,a(z))),E(Rt,a(K)?`ready`:`error`),a(K)||E(L,`Could not parse minutes from model output. Try again or edit manually.`))}function ti(){a(K)&&$r(tn(a(K)),`meeting-minutes.md`,`text/markdown`)}function ni(){return nn||=new qt,nn}async function ri(){if(!a(Oe)||!a(Ee))return;let e=a(Ee);E(nr,`loading`),E(rr,0),E(ir,`Loading diarization model…`),E(L,``);try{let t=ni();t.isReady||await t.loadModel({dirHandle:st??void 0},(e,t)=>{E(rr,e),E(ir,t)}),E(nr,`running`),E(ir,`Decoding audio…`);let n=await St(e,e instanceof File?e.name:void 0);E(ir,`Detecting speech segments…`);let r=await De.NonRealTimeVAD.new({modelURL:`${at}silero_vad_legacy.onnx`,ortConfig:e=>{e.env.wasm.wasmPaths=ot}}),i=[],o=0;for await(let{audio:e,start:a,end:s}of r.run(n.samples,n.sampleRate)){o+=1,E(ir,`Analyzing speakers… (utterance ${o})`);let n=await t.embed(e);i.push({startMs:a,endMs:s,embedding:n})}let s=Yt(i);E(z,Xt(a(z),s)),Tr(),E(nr,`ready`),E(ir,i.length?`Identified ${new Set(s.map(e=>e.speakerId)).size} speaker(s) across ${i.length} utterance(s).`:`No speech segments detected in the audio.`)}catch(e){E(L,e instanceof Error?e.message:String(e)),E(nr,`error`)}}h(()=>{try{E(nt,sessionStorage.getItem(rt)===`1`)}catch{}rn().then(e=>{e?.segments?.length&&(E(z,e.segments),pr(),E(He,e.language??`en-US`),E(Zt,e.speakerLabelOverrides??{})),a(Le)===`live`&&gr()}),a(Le)===`live`&&gr(),xr(`on-device`);let e=setInterval(()=>{a(I)===`recording`&&H?.isOverLimit()&&Br()},5e3);return()=>clearInterval(e)}),ce(()=>{wr(),wt?.abort(),Et?.abort(),H?.abort(),Ft?.terminate(),Lt?.terminate(),nn?.terminate(),Ur(),Tt?.getTracks().forEach(e=>e.stop())}),g(()=>a(He),()=>{E(n,ft(a(He)))}),g(()=>a(z),()=>{E(f,a(z).some(e=>e.isFinal&&e.text.trim()))}),g(()=>a(z),()=>{E(fe,a(z).some(e=>!e.isFinal))}),g(()=>a(ht),()=>{E(pe,a(ht)===`meeting-audio`?`system`:a(ht))}),g(()=>a(F),()=>{E(k,a(F)===`idle`||a(F)===`error`)}),g(()=>a(I),()=>{E(me,a(I)===`idle`||a(I)===`error`)}),g(()=>(a(k),a(I),a(pe)),()=>{E(A,sr&&a(k)&&a(I)!==`recording`&&(a(pe)===`mic`||lr))}),g(()=>(a(P),a(k),a(I),a(pe)),()=>{E(he,a(P)===`ready`&&a(k)&&a(I)!==`recording`&&(a(pe)===`mic`||cr))}),g(()=>(a(N),a(he),a(A)),()=>{E(ge,a(N)===`local-ai`?a(he):a(A))}),g(()=>a(F),()=>{E(_e,a(F)===`listening`)}),g(()=>a(P),()=>{E(ve,a(P)===`idle`||a(P)===`error`)}),g(()=>(a(me),a(F),a(P)),()=>{E(ye,a(me)&&a(F)!==`listening`&&a(P)!==`transcribing`)}),g(()=>a(I),()=>{E(be,a(I)===`recording`)}),g(()=>(a(P),a(U),a(F),a(I)),()=>{E(xe,a(P)===`ready`&&!!a(U)&&a(F)!==`listening`&&a(I)!==`recording`)}),g(()=>(a(P),a(lt),a(F),a(I)),()=>{E(Se,a(P)===`ready`&&!!a(lt)&&a(F)!==`listening`&&a(I)!==`recording`)}),g(()=>(a(Le),a(N)),()=>{E(Ce,a(Le)===`record`||a(Le)===`upload`||a(Le)===`live`&&a(N)===`local-ai`)}),g(()=>(a(Ce),a(nt),a(P)),()=>{E(we,a(Ce)&&!a(nt)&&a(P)===`idle`)}),g(()=>a(z),()=>{E(Te,Qt(a(z)))}),g(()=>(a(U),a(Le),a(lt)),()=>{E(Ee,a(U)??(a(Le)===`upload`?a(lt):null))}),g(()=>(a(f),a(Ee),a(nr)),()=>{E(Oe,a(f)&&!!a(Ee)&&a(nr)!==`loading`&&a(nr)!==`running`)}),g(()=>(a(bt),a(He)),()=>{E(je,a(bt)===`checking`?`Checking on-device language pack…`:Ve(a(bt),a(He)))}),g(()=>(a(We),a(bt),a(N)),()=>{E(j,a(We)&&ze()&&a(bt)===`downloadable`&&a(N)===`web-speech`)}),g(()=>(a(j),a(xt),a(F)),()=>{E(Me,a(j)&&!a(xt)&&a(F)!==`listening`)}),g(()=>a(N),()=>{E(Ne,a(N)===`web-speech`)}),v(),S();var ii=tr(),ai=b(ii),oi=u(ai),si=u(oi),ci=u(si);let li;var ui=u(ci,!0);O(ci);var di=y(ci,2),fi=u(di),pi=e=>{d(e,s(`Audio may be sent to your browser vendor for live captions (Web Speech cloud fallback). Everything else stays on this device.`))},mi=e=>{d(e,s(`Transcript text and audio processing stay in your browser — nothing is uploaded.`))};o(fi,e=>{a(Je)===`cloud-assisted`?e(pi):e(mi,-1)}),O(di),O(si);var hi=y(si,2),gi=e=>{var t=sn(),n=y(u(t),1,!0);O(t),c(()=>i(n,a(L))),d(e,t)};o(hi,e=>{a(L)&&e(gi)});var _i=y(hi,2),vi=e=>{d(e,cn())},yi=ne(()=>(a(F),a(L),l(()=>a(F)===`error`&&a(L).includes(`denied`))));o(_i,e=>{a(yi)&&e(vi)});var bi=y(_i,2),xi=u(bi),Si=u(xi),Ci=u(Si),wi=u(Ci);let Ti;O(Ci);var Ei=y(Ci,2),Di=u(Ei);let Oi;O(Ei);var ki=y(Ei,2),Ai=u(ki);let ji;O(ki),O(Si);var Mi=y(Si,2),Ni=e=>{var t=ln(),n=y(u(t),4);O(t),m(`click`,n,Yr),d(e,t)};o(Mi,e=>{a(we)&&e(Ni)});var Pi=y(Mi,2),Fi=y(u(Pi),2);le(Fi,5,()=>ut,e=>e.value,(e,t)=>{var n=q(),r=u(n,!0);O(n);var o={};c(()=>{i(r,(a(t),l(()=>a(t).label))),o!==(o=(a(t),l(()=>a(t).value)))&&(n.value=(n.__value=(a(t),l(()=>a(t).value)))??``)}),d(e,n)}),O(Fi),O(Pi);var Ii=y(Pi,2),Li=e=>{var t=Sn(),n=y(b(t),2),r=y(u(n),2),l=u(r);D(l),l.value=l.__value=`web-speech`,T(2),O(r);var f=y(r,2),p=u(f);D(p),p.value=p.__value=`local-ai`,T(2),O(f),O(n);var h=y(n,2),g=y(u(h),2),_=u(g);D(_),_.value=_.__value=`mic`,T(2),O(g);var v=y(g,2),x=e=>{var t=un(),n=b(t),r=u(n);D(r),r.value=r.__value=`system`,T(2),O(n);var i=y(n,2),o=u(i);D(o),o.value=o.__value=`mixed`,T(2),O(i),re(Fe,[],r,()=>a(ht),e=>E(ht,e)),re(Fe,[],o,()=>a(ht),e=>E(ht,e)),d(e,t)};o(v,e=>{cr&&e(x)}),O(h);var S=y(h,2),C=e=>{var t=pn(),n=b(t),r=y(u(n),6),i=e=>{var t=dn();T(2),d(e,t)},c=e=>{d(e,s(`Audio is transcribed continuously via LocalAI (Whisper) as you speak.`))};o(r,e=>{a(N)===`local-ai`?e(c,-1):e(i)}),O(n);var l=y(n,2),f=e=>{d(e,fn())};o(l,e=>{a(N)!==`local-ai`&&!lr&&e(f)}),d(e,t)},ee=e=>{d(e,mn())};o(S,e=>{a(pe)===`mic`?a(N)!==`local-ai`&&!sr&&e(ee,1):e(C)});var te=y(S,2),ne=e=>{var t=J(),n=b(t),r=u(n);D(r),T(2),O(n);var i=y(n,2),o=u(i);D(o),T(2),O(i),c(()=>{r.disabled=a(F)===`listening`,o.disabled=a(F)===`listening`}),w(r,()=>a(We),e=>E(We,e)),m(`change`,r,yr),w(o,()=>a(Ge),e=>E(Ge,e)),d(e,t)};o(te,e=>{a(Ne)&&e(ne)});var ie=y(te,2),ae=u(ie);D(ae),T(2),O(ie);var oe=y(ie,2),se=e=>{var t=yn(),n=y(u(t),2),r=u(n,!0);O(n);var s=y(n,2),l=e=>{d(e,hn())},f=e=>{d(e,gn())},p=e=>{var t=_n(),n=b(t);T(2),c(()=>n.disabled=!a(Me)),m(`click`,n,_r),d(e,t)},h=e=>{var t=vn(),n=y(u(t)),r=u(n,!0);O(n),T(7),O(t),c(()=>i(r,a(He))),d(e,t)},g=e=>{d(e,Y())};o(s,e=>{a(bt)===`available`?e(l):a(xt)?e(f,1):a(j)?e(p,2):a(bt)===`unavailable`?e(h,3):a(bt)===`api-unavailable`&&e(g,4)}),O(t),c(()=>i(r,a(je))),d(e,t)};o(oe,e=>{a(N)===`web-speech`&&a(We)&&sr&&e(se)});var ce=y(oe,2),le=e=>{var t=X(),n=u(t,!0);O(t),c(()=>i(n,a(vt))),d(e,t)};o(ce,e=>{a(vt)&&a(F)===`listening`&&e(le)});var ue=y(ce,2),de=u(ue),fe=e=>{var t=Z();c(()=>t.disabled=!a(ge)),m(`click`,t,Fr),d(e,t)},k=e=>{var t=bn();m(`click`,t,Ir),d(e,t)};o(de,e=>{a(F)===`listening`?e(k,-1):e(fe)});var me=y(de,2),A=e=>{var t=xn(),n=b(t),r=y(n,2);c(()=>{n.disabled=a(R),r.disabled=a(R)}),m(`click`,n,()=>Hr(`webm`)),m(`click`,r,()=>Hr(`mp3`)),d(e,t)};o(me,e=>{a(U)&&e(A)}),O(ue);var he=y(ue,2),_e=u(he),ve=e=>{d(e,s(`Web Speech gives live word-by-word captions — no model download needed.`))},ye=e=>{d(e,s(`LocalAI needs the Whisper model loaded (below).`))};o(_e,e=>{a(N)===`web-speech`?e(ve):e(ye,-1)}),T(5),O(he),c(()=>{n.disabled=a(F)===`listening`,h.disabled=a(F)===`listening`,ae.disabled=a(F)===`listening`}),re(Pe,[],l,()=>a(N),e=>E(N,e)),m(`change`,l,Sr),re(Pe,[],p,()=>a(N),e=>E(N,e)),m(`change`,p,Sr),re(Fe,[],_,()=>a(ht),e=>E(ht,e)),w(ae,()=>a(Ke),e=>E(Ke,e)),d(e,t)};o(Ii,e=>{a(Le)===`live`&&e(Li)});var Ri=y(Ii,2),zi=e=>{var t=kn(),n=y(b(t),2),r=y(u(n),2),s=u(r);D(s),s.value=s.__value=`mic`,T(2),O(r);var l=y(r,2),f=e=>{var t=Cn(),n=b(t),r=u(n);D(r),r.value=r.__value=`system`,T(2),O(n);var i=y(n,2),o=u(i);D(o),o.value=o.__value=`mixed`,T(2),O(i),re(Ie,[],r,()=>a(mt),e=>E(mt,e)),re(Ie,[],o,()=>a(mt),e=>E(mt,e)),d(e,t)},p=e=>{d(e,Q())};o(l,e=>{cr?e(f):e(p,-1)}),O(n);var h=y(n,2),g=e=>{d(e,wn())};o(h,e=>{a(mt)!==`mic`&&cr&&e(g)});var _=y(h,2),v=u(_),x=e=>{var t=Tn();c(()=>t.disabled=!a(ye)),m(`click`,t,Lr),d(e,t)},S=e=>{var t=En(),n=b(t),r=y(n,2);m(`click`,n,zr),m(`click`,r,Br),d(e,t)};o(v,e=>{a(I)===`recording`?e(S,-1):e(x)});var C=y(v,2),w=e=>{var t=Dn(),n=b(t),r=y(n,2),i=y(r,2);c(()=>{n.disabled=a(R),r.disabled=a(R),i.disabled=!a(xe)}),m(`click`,n,()=>Hr(`webm`)),m(`click`,r,()=>Hr(`mp3`)),m(`click`,i,Vr),d(e,t)};o(C,e=>{a(U)&&a(I)!==`recording`&&e(w)}),O(_);var ee=y(_,2),te=e=>{var t=On(),n=y(u(t)),r=u(n,!0);O(n),T(),O(t),c(()=>i(r,a(Nt))),d(e,t)};o(ee,e=>{a(U)&&a(I)!==`recording`&&e(te)}),c(()=>n.disabled=a(I)===`recording`),re(Ie,[],s,()=>a(mt),e=>E(mt,e)),d(e,t)};o(Ri,e=>{a(Le)===`record`&&e(zi)});var Bi=y(Ri,2),Vi=e=>{var t=jn(),n=y(b(t),2),r=u(n),s=y(r,2),f=e=>{var t=An(),n=u(t);O(t),c(e=>i(n,`${(a(lt),l(()=>a(lt).name))??``}${e??``}`),[()=>(a(pt),l(()=>a(pt)==null?``:` — ${Math.round(a(pt))}s`))]),d(e,t)};o(s,e=>{a(lt)&&e(f)}),O(n);var p=y(n,2);c(()=>{r.disabled=a(P)===`loading`,p.disabled=!a(Se)}),m(`change`,r,Gr),m(`click`,p,Kr),d(e,t)};o(Bi,e=>{a(Le)===`upload`&&e(Vi)});var Hi=y(Bi,2),Ui=e=>{var t=Ln(),n=y(b(t),4),r=u(n),f=e=>{d(e,s(`Used by the LocalAI live engine.`))},p=e=>{d(e,s(`Used by Record and Upload (and by Live if you switch to LocalAI).`))};o(r,e=>{a(Le)===`live`?e(f):e(p,-1)}),O(n);var h=y(n,2),g=y(u(h),2);le(g,5,()=>dt,e=>e.value,(e,t)=>{var n=q(),r=u(n,!0);O(n);var o={};c(()=>{i(r,(a(t),l(()=>a(t).label))),o!==(o=(a(t),l(()=>a(t).value)))&&(n.value=(n.__value=(a(t),l(()=>a(t).value)))??``)}),d(e,n)}),O(g),O(h);var _=y(h,2),v=u(_),x=e=>{var t=Mn(),n=b(t),r=y(u(n),1,!0);O(n);var o=y(n,2);c(()=>{i(r,a(ct)),o.disabled=a(P)===`loading`}),m(`click`,o,jr),d(e,t)},S=e=>{var t=Nn();m(`click`,t,Ar),d(e,t)};o(v,e=>{a(ct)?e(x):(a(P)===`idle`||a(P)===`error`)&&e(S,1)}),O(_);var C=y(_,2),w=e=>{var t=Pn();c(()=>t.disabled=!a(ve)),m(`click`,t,Mr),d(e,t)};o(C,e=>{(a(P)===`idle`||a(P)===`error`)&&e(w)});var T=y(C,2),D=e=>{var t=Fn(),n=u(t),r=u(n),o=u(r,!0);O(r);var s=y(r,2),l=u(s);O(s),O(n);var f=y(n,2),p=u(f);O(f),O(t),c(()=>{i(o,a(Ze)),i(l,`${a(Xe)??``}%`),ee(p,`width: ${a(Xe)??``}%`)}),d(e,t)};o(T,e=>{a(P)===`loading`&&e(D)});var ne=y(T,2),re=e=>{d(e,In())};o(ne,e=>{a(P)===`ready`&&e(re)}),c(()=>g.disabled=a(P)===`loading`||a(P)===`ready`||a(P)===`transcribing`),te(g,()=>a(it),e=>E(it,e)),d(e,t)};o(Hi,e=>{a(Ce)&&e(Ui)});var Wi=y(Hi,2),Gi=e=>{var t=Bn(),n=u(t),r=e=>{var t=Rn(),n=y(b(t),2),r=u(n,!0);O(n);var o=y(n,2),s=u(o,!0);O(o),c((e,t)=>{i(r,e),i(s,t)},[()=>(a(F),a(yt),de(Ae),a(mt),l(()=>a(F)===`listening`?a(yt)?`Speech detected…`:`Listening for speech…`:`Recording (${Ae(a(mt))})`)),()=>(de(Mt),a(G),l(()=>Mt(a(G))))]),d(e,t)},s=e=>{var t=zn(),n=b(t),r=u(n);O(n);var o=y(n,2),s=u(o,!0);O(o);var l=y(o,2),f=u(l);O(l),c(()=>{i(r,`Transcribing… ${a(Qe)??``}%`),i(s,a($e)),ee(f,`width: ${a(Qe)??``}%`)}),d(e,t)};o(n,e=>{a(P)===`transcribing`?e(s,-1):e(r)}),O(t),d(e,t)};o(Wi,e=>{(a(F)===`listening`||a(I)===`recording`||a(P)===`transcribing`)&&e(Gi)}),O(xi);var Ki=y(xi,2),qi=y(u(Ki),2),Ji=u(qi),Yi=u(Ji),Xi=e=>{d(e,Vn())},Zi=e=>{var t=Gn(),n=b(t);le(n,1,()=>a(z),e=>e.id,(e,t)=>{var n=Un();let r;var s=u(n),f=u(s);O(s);var p=y(s,2),h=e=>{var n=Hn(),r=b(n);D(r),T(),c(()=>ie(r,(a(Zt),a(t),l(()=>a(Zt)[a(t).speakerId]??a(t).speakerId)))),m(`change`,r,e=>Or(a(t).speakerId,e.currentTarget.value)),d(e,n)};o(p,e=>{a(t),l(()=>a(t).speakerId)&&e(h)});var g=y(p);O(n),c(e=>{r=x(n,1,`transcript-segment svelte-1eaoyra`,null,r,{"interim-line":!a(t).isFinal}),i(f,`[${e??``}]`),i(g,` ${(a(t),l(()=>a(t).text))??``}`)},[()=>(de(Dt),a(t),l(()=>Dt(a(t).startMs)))]),d(e,n)});var r=y(n,2),s=e=>{d(e,Wn())};o(r,e=>{a(yt)&&!a(fe)&&e(s)}),d(e,t)};o(Yi,e=>{a(z),a(yt),l(()=>a(z).length===0&&!a(yt))?e(Xi):e(Zi,-1)}),O(Ji),ue(Ji,()=>fr);var Qi=y(Ji,2),$i=e=>{var t=Kn();m(`click`,t,mr),d(e,t)};o(Qi,e=>{a(or)||e($i)}),O(qi);var ea=y(qi,2),ta=u(ea),na=y(ta,2),ra=y(na,2),ia=y(ra,2);O(ea);var aa=y(ea,2),oa=u(aa);D(oa),T(2),O(aa);var sa=y(aa,2),ca=e=>{var t=Zn(),n=y(b(t),6),r=u(n,!0);O(n);var s=y(n,2),l=e=>{d(e,qn())};o(s,e=>{a(Ee)||e(l)});var f=y(s,2),p=e=>{var t=Yn(),n=u(t),r=u(n),s=u(r,!0);O(r);var l=y(r,2),f=e=>{var t=Jn(),n=u(t);O(t),c(()=>i(n,`${a(rr)??``}%`)),d(e,t)};o(l,e=>{a(nr)===`loading`&&e(f)}),O(n);var p=y(n,2),m=u(p);O(p),O(t),c(()=>{i(s,a(ir)),ee(m,`width: ${(a(nr)===`loading`?a(rr):100)??``}%`)}),d(e,t)};o(f,e=>{(a(nr)===`loading`||a(nr)===`running`)&&e(p)});var h=y(f,2),g=e=>{var t=Xn(),n=y(u(t),1,!0);O(t),c(()=>i(n,a(ir))),d(e,t)};o(h,e=>{a(nr)===`ready`&&e(g)}),c(()=>{n.disabled=!a(Oe),i(r,a(nr)===`loading`||a(nr)===`running`?`Identifying speakers…`:`Identify speakers`)}),m(`click`,n,ri),d(e,t)};o(sa,e=>{a(f)&&e(ca)});var la=y(sa,2),ua=e=>{var t=$n(),n=y(b(t),6),s=u(n,!0);O(n);var f=y(n,2),p=e=>{var t=Qn(),n=y(u(t),2),i=y(u(n),2);D(i),O(n);var o=y(n,2),s=y(u(o),2);oe(s),O(o);var f=y(o,2),p=y(u(f),2);oe(p),O(f);var h=y(f,2),g=y(u(h),2);oe(g),O(h);var _=y(h,2);O(t),c((e,t)=>{ie(p,e),ie(g,t)},[()=>(a(K),l(()=>a(K).decisions.join(`
`))),()=>(a(K),l(()=>a(K).actionItems.map(e=>e.task).join(`
`)))]),se(i,()=>a(K).title,e=>r(K,a(K).title=e)),se(s,()=>a(K).summary,e=>r(K,a(K).summary=e)),m(`input`,p,e=>{r(K,a(K).decisions=e.currentTarget.value.split(`
`).filter(Boolean))}),m(`input`,g,e=>{r(K,a(K).actionItems=e.currentTarget.value.split(`
`).filter(Boolean).map(e=>({task:e})))}),m(`click`,_,ti),d(e,t)};o(f,e=>{a(K)&&e(p)}),c(()=>{n.disabled=a(Rt)===`loading-model`||a(Rt)===`generating`,i(s,a(Rt)===`generating`||a(Rt)===`loading-model`?`Generating…`:`Generate minutes`)}),m(`click`,n,ei),d(e,t)};o(la,e=>{a(Te)&&e(ua)}),O(Ki),O(bi),O(oi),O(ai);var da=y(ai,2),fa=e=>{var t=er(),n=u(t),r=u(n),i=y(u(r),4),a=u(i),o=y(a,2);O(i),O(r),O(n),O(t),m(`click`,a,()=>{E(Vt,!1),E(Wt,null)}),m(`click`,o,Jr),d(e,t)};o(da,e=>{a(Vt)&&e(fa)}),c(()=>{li=x(ci,1,`badge svelte-1eaoyra`,null,li,{"bg-success":a(Je)===`on-device`,"bg-warning":a(Je)===`cloud-assisted`,"text-dark":a(Je)===`cloud-assisted`,"bg-info":a(Je)===`local-model`}),i(ui,a(Ye)),Ti=x(wi,1,`nav-link svelte-1eaoyra`,null,Ti,{active:a(Le)===`live`}),Oi=x(Di,1,`nav-link svelte-1eaoyra`,null,Oi,{active:a(Le)===`record`}),ji=x(Ai,1,`nav-link svelte-1eaoyra`,null,ji,{active:a(Le)===`upload`}),Fi.disabled=a(F)===`listening`||a(I)===`recording`,ta.disabled=!a(f),na.disabled=!a(f),ra.disabled=!a(f)}),m(`click`,wi,()=>qr(`live`)),m(`click`,Di,()=>qr(`record`)),m(`click`,Ai,()=>qr(`upload`)),te(Fi,()=>a(He),e=>E(He,e)),m(`change`,Fi,vr),m(`scroll`,Ji,dr),m(`click`,ta,Zr),m(`click`,na,Qr),m(`click`,ra,$),m(`click`,ia,Xr),w(oa,()=>a(B),e=>E(B,e)),d(e,ii),C()}export{nr as default};