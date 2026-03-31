var qc=Object.defineProperty;var $c=(s,e,t)=>e in s?qc(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var D=(s,e,t)=>$c(s,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();class Gn extends Error{constructor(e,t){const n=new.target.prototype;super(`${e}: Status code '${t}'`),this.statusCode=t,this.__proto__=n}}class qr extends Error{constructor(e="A timeout occurred."){const t=new.target.prototype;super(e),this.__proto__=t}}class tn extends Error{constructor(e="An abort occurred."){const t=new.target.prototype;super(e),this.__proto__=t}}class Yc extends Error{constructor(e,t){const n=new.target.prototype;super(e),this.transport=t,this.errorType="UnsupportedTransportError",this.__proto__=n}}class jc extends Error{constructor(e,t){const n=new.target.prototype;super(e),this.transport=t,this.errorType="DisabledTransportError",this.__proto__=n}}class Kc extends Error{constructor(e,t){const n=new.target.prototype;super(e),this.transport=t,this.errorType="FailedToStartTransportError",this.__proto__=n}}class uo extends Error{constructor(e){const t=new.target.prototype;super(e),this.errorType="FailedToNegotiateWithServerError",this.__proto__=t}}class Zc extends Error{constructor(e,t){const n=new.target.prototype;super(e),this.innerErrors=t,this.__proto__=n}}class ic{constructor(e,t,n){this.statusCode=e,this.statusText=t,this.content=n}}class zs{get(e,t){return this.send({...t,method:"GET",url:e})}post(e,t){return this.send({...t,method:"POST",url:e})}delete(e,t){return this.send({...t,method:"DELETE",url:e})}getCookieString(e){return""}}var V;(function(s){s[s.Trace=0]="Trace",s[s.Debug=1]="Debug",s[s.Information=2]="Information",s[s.Warning=3]="Warning",s[s.Error=4]="Error",s[s.Critical=5]="Critical",s[s.None=6]="None"})(V||(V={}));class Oi{constructor(){}log(e,t){}}Oi.instance=new Oi;const Jc="8.0.17";class dt{static isRequired(e,t){if(e==null)throw new Error(`The '${t}' argument is required.`)}static isNotEmpty(e,t){if(!e||e.match(/^\s*$/))throw new Error(`The '${t}' argument should not be empty.`)}static isIn(e,t,n){if(!(e in t))throw new Error(`Unknown ${n} value: ${e}.`)}}class it{static get isBrowser(){return!it.isNode&&typeof window=="object"&&typeof window.document=="object"}static get isWebWorker(){return!it.isNode&&typeof self=="object"&&"importScripts"in self}static get isReactNative(){return!it.isNode&&typeof window=="object"&&typeof window.document>"u"}static get isNode(){return typeof process<"u"&&process.release&&process.release.name==="node"}}function ki(s,e){let t="";return jn(s)?(t=`Binary data of length ${s.byteLength}`,e&&(t+=`. Content: '${Qc(s)}'`)):typeof s=="string"&&(t=`String data of length ${s.length}`,e&&(t+=`. Content: '${s}'`)),t}function Qc(s){const e=new Uint8Array(s);let t="";return e.forEach(n=>{const i=n<16?"0":"";t+=`0x${i}${n.toString(16)} `}),t.substr(0,t.length-1)}function jn(s){return s&&typeof ArrayBuffer<"u"&&(s instanceof ArrayBuffer||s.constructor&&s.constructor.name==="ArrayBuffer")}async function sc(s,e,t,n,i,r){const o={},[a,c]=Si();o[a]=c,s.log(V.Trace,`(${e} transport) sending data. ${ki(i,r.logMessageContent)}.`);const l=jn(i)?"arraybuffer":"text",h=await t.post(n,{content:i,headers:{...o,...r.headers},responseType:l,timeout:r.timeout,withCredentials:r.withCredentials});s.log(V.Trace,`(${e} transport) request complete. Response status: ${h.statusCode}.`)}function el(s){return s===void 0?new Ls(V.Information):s===null?Oi.instance:s.log!==void 0?s:new Ls(s)}class tl{constructor(e,t){this._subject=e,this._observer=t}dispose(){const e=this._subject.observers.indexOf(this._observer);e>-1&&this._subject.observers.splice(e,1),this._subject.observers.length===0&&this._subject.cancelCallback&&this._subject.cancelCallback().catch(t=>{})}}class Ls{constructor(e){this._minLevel=e,this.out=console}log(e,t){if(e>=this._minLevel){const n=`[${new Date().toISOString()}] ${V[e]}: ${t}`;switch(e){case V.Critical:case V.Error:this.out.error(n);break;case V.Warning:this.out.warn(n);break;case V.Information:this.out.info(n);break;default:this.out.log(n);break}}}}function Si(){let s="X-SignalR-User-Agent";return it.isNode&&(s="User-Agent"),[s,nl(Jc,il(),rl(),sl())]}function nl(s,e,t,n){let i="Microsoft SignalR/";const r=s.split(".");return i+=`${r[0]}.${r[1]}`,i+=` (${s}; `,e&&e!==""?i+=`${e}; `:i+="Unknown OS; ",i+=`${t}`,n?i+=`; ${n}`:i+="; Unknown Runtime Version",i+=")",i}function il(){if(it.isNode)switch(process.platform){case"win32":return"Windows NT";case"darwin":return"macOS";case"linux":return"Linux";default:return process.platform}else return""}function sl(){if(it.isNode)return process.versions.node}function rl(){return it.isNode?"NodeJS":"Browser"}function Ks(s){return s.stack?s.stack:s.message?s.message:`${s}`}function ol(){if(typeof globalThis<"u")return globalThis;if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("could not find global")}class al extends zs{constructor(e){if(super(),this._logger=e,typeof fetch>"u"||it.isNode){const t=typeof __webpack_require__=="function"?__non_webpack_require__:require;this._jar=new(t("tough-cookie")).CookieJar,typeof fetch>"u"?this._fetchType=t("node-fetch"):this._fetchType=fetch,this._fetchType=t("fetch-cookie")(this._fetchType,this._jar)}else this._fetchType=fetch.bind(ol());if(typeof AbortController>"u"){const t=typeof __webpack_require__=="function"?__non_webpack_require__:require;this._abortControllerType=t("abort-controller")}else this._abortControllerType=AbortController}async send(e){if(e.abortSignal&&e.abortSignal.aborted)throw new tn;if(!e.method)throw new Error("No method defined.");if(!e.url)throw new Error("No url defined.");const t=new this._abortControllerType;let n;e.abortSignal&&(e.abortSignal.onabort=()=>{t.abort(),n=new tn});let i=null;if(e.timeout){const c=e.timeout;i=setTimeout(()=>{t.abort(),this._logger.log(V.Warning,"Timeout from HTTP request."),n=new qr},c)}e.content===""&&(e.content=void 0),e.content&&(e.headers=e.headers||{},jn(e.content)?e.headers["Content-Type"]="application/octet-stream":e.headers["Content-Type"]="text/plain;charset=UTF-8");let r;try{r=await this._fetchType(e.url,{body:e.content,cache:"no-cache",credentials:e.withCredentials===!0?"include":"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",...e.headers},method:e.method,mode:"cors",redirect:"follow",signal:t.signal})}catch(c){throw n||(this._logger.log(V.Warning,`Error from HTTP request. ${c}.`),c)}finally{i&&clearTimeout(i),e.abortSignal&&(e.abortSignal.onabort=null)}if(!r.ok){const c=await fo(r,"text");throw new Gn(c||r.statusText,r.status)}const a=await fo(r,e.responseType);return new ic(r.status,r.statusText,a)}getCookieString(e){let t="";return it.isNode&&this._jar&&this._jar.getCookies(e,(n,i)=>t=i.join("; ")),t}}function fo(s,e){let t;switch(e){case"arraybuffer":t=s.arrayBuffer();break;case"text":t=s.text();break;case"blob":case"document":case"json":throw new Error(`${e} is not supported.`);default:t=s.text();break}return t}class cl extends zs{constructor(e){super(),this._logger=e}send(e){return e.abortSignal&&e.abortSignal.aborted?Promise.reject(new tn):e.method?e.url?new Promise((t,n)=>{const i=new XMLHttpRequest;i.open(e.method,e.url,!0),i.withCredentials=e.withCredentials===void 0?!0:e.withCredentials,i.setRequestHeader("X-Requested-With","XMLHttpRequest"),e.content===""&&(e.content=void 0),e.content&&(jn(e.content)?i.setRequestHeader("Content-Type","application/octet-stream"):i.setRequestHeader("Content-Type","text/plain;charset=UTF-8"));const r=e.headers;r&&Object.keys(r).forEach(o=>{i.setRequestHeader(o,r[o])}),e.responseType&&(i.responseType=e.responseType),e.abortSignal&&(e.abortSignal.onabort=()=>{i.abort(),n(new tn)}),e.timeout&&(i.timeout=e.timeout),i.onload=()=>{e.abortSignal&&(e.abortSignal.onabort=null),i.status>=200&&i.status<300?t(new ic(i.status,i.statusText,i.response||i.responseText)):n(new Gn(i.response||i.responseText||i.statusText,i.status))},i.onerror=()=>{this._logger.log(V.Warning,`Error from HTTP request. ${i.status}: ${i.statusText}.`),n(new Gn(i.statusText,i.status))},i.ontimeout=()=>{this._logger.log(V.Warning,"Timeout from HTTP request."),n(new qr)},i.send(e.content)}):Promise.reject(new Error("No url defined.")):Promise.reject(new Error("No method defined."))}}class ll extends zs{constructor(e){if(super(),typeof fetch<"u"||it.isNode)this._httpClient=new al(e);else if(typeof XMLHttpRequest<"u")this._httpClient=new cl(e);else throw new Error("No usable HttpClient found.")}send(e){return e.abortSignal&&e.abortSignal.aborted?Promise.reject(new tn):e.method?e.url?this._httpClient.send(e):Promise.reject(new Error("No url defined.")):Promise.reject(new Error("No method defined."))}getCookieString(e){return this._httpClient.getCookieString(e)}}class Ht{static write(e){return`${e}${Ht.RecordSeparator}`}static parse(e){if(e[e.length-1]!==Ht.RecordSeparator)throw new Error("Message is incomplete.");const t=e.split(Ht.RecordSeparator);return t.pop(),t}}Ht.RecordSeparatorCode=30;Ht.RecordSeparator=String.fromCharCode(Ht.RecordSeparatorCode);class hl{writeHandshakeRequest(e){return Ht.write(JSON.stringify(e))}parseHandshakeResponse(e){let t,n;if(jn(e)){const a=new Uint8Array(e),c=a.indexOf(Ht.RecordSeparatorCode);if(c===-1)throw new Error("Message is incomplete.");const l=c+1;t=String.fromCharCode.apply(null,Array.prototype.slice.call(a.slice(0,l))),n=a.byteLength>l?a.slice(l).buffer:null}else{const a=e,c=a.indexOf(Ht.RecordSeparator);if(c===-1)throw new Error("Message is incomplete.");const l=c+1;t=a.substring(0,l),n=a.length>l?a.substring(l):null}const i=Ht.parse(t),r=JSON.parse(i[0]);if(r.type)throw new Error("Expected a handshake response from the server.");return[n,r]}}var Ie;(function(s){s[s.Invocation=1]="Invocation",s[s.StreamItem=2]="StreamItem",s[s.Completion=3]="Completion",s[s.StreamInvocation=4]="StreamInvocation",s[s.CancelInvocation=5]="CancelInvocation",s[s.Ping=6]="Ping",s[s.Close=7]="Close",s[s.Ack=8]="Ack",s[s.Sequence=9]="Sequence"})(Ie||(Ie={}));class ul{constructor(){this.observers=[]}next(e){for(const t of this.observers)t.next(e)}error(e){for(const t of this.observers)t.error&&t.error(e)}complete(){for(const e of this.observers)e.complete&&e.complete()}subscribe(e){return this.observers.push(e),new tl(this,e)}}class dl{constructor(e,t,n){this._bufferSize=1e5,this._messages=[],this._totalMessageCount=0,this._waitForSequenceMessage=!1,this._nextReceivingSequenceId=1,this._latestReceivedSequenceId=0,this._bufferedByteCount=0,this._reconnectInProgress=!1,this._protocol=e,this._connection=t,this._bufferSize=n}async _send(e){const t=this._protocol.writeMessage(e);let n=Promise.resolve();if(this._isInvocationMessage(e)){this._totalMessageCount++;let i=()=>{},r=()=>{};jn(t)?this._bufferedByteCount+=t.byteLength:this._bufferedByteCount+=t.length,this._bufferedByteCount>=this._bufferSize&&(n=new Promise((o,a)=>{i=o,r=a})),this._messages.push(new fl(t,this._totalMessageCount,i,r))}try{this._reconnectInProgress||await this._connection.send(t)}catch{this._disconnected()}await n}_ack(e){let t=-1;for(let n=0;n<this._messages.length;n++){const i=this._messages[n];if(i._id<=e.sequenceId)t=n,jn(i._message)?this._bufferedByteCount-=i._message.byteLength:this._bufferedByteCount-=i._message.length,i._resolver();else if(this._bufferedByteCount<this._bufferSize)i._resolver();else break}t!==-1&&(this._messages=this._messages.slice(t+1))}_shouldProcessMessage(e){if(this._waitForSequenceMessage)return e.type!==Ie.Sequence?!1:(this._waitForSequenceMessage=!1,!0);if(!this._isInvocationMessage(e))return!0;const t=this._nextReceivingSequenceId;return this._nextReceivingSequenceId++,t<=this._latestReceivedSequenceId?(t===this._latestReceivedSequenceId&&this._ackTimer(),!1):(this._latestReceivedSequenceId=t,this._ackTimer(),!0)}_resetSequence(e){if(e.sequenceId>this._nextReceivingSequenceId){this._connection.stop(new Error("Sequence ID greater than amount of messages we've received."));return}this._nextReceivingSequenceId=e.sequenceId}_disconnected(){this._reconnectInProgress=!0,this._waitForSequenceMessage=!0}async _resend(){const e=this._messages.length!==0?this._messages[0]._id:this._totalMessageCount+1;await this._connection.send(this._protocol.writeMessage({type:Ie.Sequence,sequenceId:e}));const t=this._messages;for(const n of t)await this._connection.send(n._message);this._reconnectInProgress=!1}_dispose(e){e??(e=new Error("Unable to reconnect to server."));for(const t of this._messages)t._rejector(e)}_isInvocationMessage(e){switch(e.type){case Ie.Invocation:case Ie.StreamItem:case Ie.Completion:case Ie.StreamInvocation:case Ie.CancelInvocation:return!0;case Ie.Close:case Ie.Sequence:case Ie.Ping:case Ie.Ack:return!1}}_ackTimer(){this._ackTimerHandle===void 0&&(this._ackTimerHandle=setTimeout(async()=>{try{this._reconnectInProgress||await this._connection.send(this._protocol.writeMessage({type:Ie.Ack,sequenceId:this._latestReceivedSequenceId}))}catch{}clearTimeout(this._ackTimerHandle),this._ackTimerHandle=void 0},1e3))}}class fl{constructor(e,t,n,i){this._message=e,this._id=t,this._resolver=n,this._rejector=i}}const pl=30*1e3,ml=15*1e3,gl=1e5;var tt;(function(s){s.Disconnected="Disconnected",s.Connecting="Connecting",s.Connected="Connected",s.Disconnecting="Disconnecting",s.Reconnecting="Reconnecting"})(tt||(tt={}));class $r{static create(e,t,n,i,r,o,a){return new $r(e,t,n,i,r,o,a)}constructor(e,t,n,i,r,o,a){this._nextKeepAlive=0,this._freezeEventListener=()=>{this._logger.log(V.Warning,"The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep")},dt.isRequired(e,"connection"),dt.isRequired(t,"logger"),dt.isRequired(n,"protocol"),this.serverTimeoutInMilliseconds=r??pl,this.keepAliveIntervalInMilliseconds=o??ml,this._statefulReconnectBufferSize=a??gl,this._logger=t,this._protocol=n,this.connection=e,this._reconnectPolicy=i,this._handshakeProtocol=new hl,this.connection.onreceive=c=>this._processIncomingData(c),this.connection.onclose=c=>this._connectionClosed(c),this._callbacks={},this._methods={},this._closedCallbacks=[],this._reconnectingCallbacks=[],this._reconnectedCallbacks=[],this._invocationId=0,this._receivedHandshakeResponse=!1,this._connectionState=tt.Disconnected,this._connectionStarted=!1,this._cachedPingMessage=this._protocol.writeMessage({type:Ie.Ping})}get state(){return this._connectionState}get connectionId(){return this.connection&&this.connection.connectionId||null}get baseUrl(){return this.connection.baseUrl||""}set baseUrl(e){if(this._connectionState!==tt.Disconnected&&this._connectionState!==tt.Reconnecting)throw new Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");if(!e)throw new Error("The HubConnection url must be a valid url.");this.connection.baseUrl=e}start(){return this._startPromise=this._startWithStateTransitions(),this._startPromise}async _startWithStateTransitions(){if(this._connectionState!==tt.Disconnected)return Promise.reject(new Error("Cannot start a HubConnection that is not in the 'Disconnected' state."));this._connectionState=tt.Connecting,this._logger.log(V.Debug,"Starting HubConnection.");try{await this._startInternal(),it.isBrowser&&window.document.addEventListener("freeze",this._freezeEventListener),this._connectionState=tt.Connected,this._connectionStarted=!0,this._logger.log(V.Debug,"HubConnection connected successfully.")}catch(e){return this._connectionState=tt.Disconnected,this._logger.log(V.Debug,`HubConnection failed to start successfully because of error '${e}'.`),Promise.reject(e)}}async _startInternal(){this._stopDuringStartError=void 0,this._receivedHandshakeResponse=!1;const e=new Promise((t,n)=>{this._handshakeResolver=t,this._handshakeRejecter=n});await this.connection.start(this._protocol.transferFormat);try{let t=this._protocol.version;this.connection.features.reconnect||(t=1);const n={protocol:this._protocol.name,version:t};if(this._logger.log(V.Debug,"Sending handshake request."),await this._sendMessage(this._handshakeProtocol.writeHandshakeRequest(n)),this._logger.log(V.Information,`Using HubProtocol '${this._protocol.name}'.`),this._cleanupTimeout(),this._resetTimeoutPeriod(),this._resetKeepAliveInterval(),await e,this._stopDuringStartError)throw this._stopDuringStartError;(this.connection.features.reconnect||!1)&&(this._messageBuffer=new dl(this._protocol,this.connection,this._statefulReconnectBufferSize),this.connection.features.disconnected=this._messageBuffer._disconnected.bind(this._messageBuffer),this.connection.features.resend=()=>{if(this._messageBuffer)return this._messageBuffer._resend()}),this.connection.features.inherentKeepAlive||await this._sendMessage(this._cachedPingMessage)}catch(t){throw this._logger.log(V.Debug,`Hub handshake failed with error '${t}' during start(). Stopping HubConnection.`),this._cleanupTimeout(),this._cleanupPingTimer(),await this.connection.stop(t),t}}async stop(){const e=this._startPromise;this.connection.features.reconnect=!1,this._stopPromise=this._stopInternal(),await this._stopPromise;try{await e}catch{}}_stopInternal(e){if(this._connectionState===tt.Disconnected)return this._logger.log(V.Debug,`Call to HubConnection.stop(${e}) ignored because it is already in the disconnected state.`),Promise.resolve();if(this._connectionState===tt.Disconnecting)return this._logger.log(V.Debug,`Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`),this._stopPromise;const t=this._connectionState;return this._connectionState=tt.Disconnecting,this._logger.log(V.Debug,"Stopping HubConnection."),this._reconnectDelayHandle?(this._logger.log(V.Debug,"Connection stopped during reconnect delay. Done reconnecting."),clearTimeout(this._reconnectDelayHandle),this._reconnectDelayHandle=void 0,this._completeClose(),Promise.resolve()):(t===tt.Connected&&this._sendCloseMessage(),this._cleanupTimeout(),this._cleanupPingTimer(),this._stopDuringStartError=e||new tn("The connection was stopped before the hub handshake could complete."),this.connection.stop(e))}async _sendCloseMessage(){try{await this._sendWithProtocol(this._createCloseMessage())}catch{}}stream(e,...t){const[n,i]=this._replaceStreamingParams(t),r=this._createStreamInvocation(e,t,i);let o;const a=new ul;return a.cancelCallback=()=>{const c=this._createCancelInvocation(r.invocationId);return delete this._callbacks[r.invocationId],o.then(()=>this._sendWithProtocol(c))},this._callbacks[r.invocationId]=(c,l)=>{if(l){a.error(l);return}else c&&(c.type===Ie.Completion?c.error?a.error(new Error(c.error)):a.complete():a.next(c.item))},o=this._sendWithProtocol(r).catch(c=>{a.error(c),delete this._callbacks[r.invocationId]}),this._launchStreams(n,o),a}_sendMessage(e){return this._resetKeepAliveInterval(),this.connection.send(e)}_sendWithProtocol(e){return this._messageBuffer?this._messageBuffer._send(e):this._sendMessage(this._protocol.writeMessage(e))}send(e,...t){const[n,i]=this._replaceStreamingParams(t),r=this._sendWithProtocol(this._createInvocation(e,t,!0,i));return this._launchStreams(n,r),r}invoke(e,...t){const[n,i]=this._replaceStreamingParams(t),r=this._createInvocation(e,t,!1,i);return new Promise((a,c)=>{this._callbacks[r.invocationId]=(h,u)=>{if(u){c(u);return}else h&&(h.type===Ie.Completion?h.error?c(new Error(h.error)):a(h.result):c(new Error(`Unexpected message type: ${h.type}`)))};const l=this._sendWithProtocol(r).catch(h=>{c(h),delete this._callbacks[r.invocationId]});this._launchStreams(n,l)})}on(e,t){!e||!t||(e=e.toLowerCase(),this._methods[e]||(this._methods[e]=[]),this._methods[e].indexOf(t)===-1&&this._methods[e].push(t))}off(e,t){if(!e)return;e=e.toLowerCase();const n=this._methods[e];if(n)if(t){const i=n.indexOf(t);i!==-1&&(n.splice(i,1),n.length===0&&delete this._methods[e])}else delete this._methods[e]}onclose(e){e&&this._closedCallbacks.push(e)}onreconnecting(e){e&&this._reconnectingCallbacks.push(e)}onreconnected(e){e&&this._reconnectedCallbacks.push(e)}_processIncomingData(e){if(this._cleanupTimeout(),this._receivedHandshakeResponse||(e=this._processHandshakeResponse(e),this._receivedHandshakeResponse=!0),e){const t=this._protocol.parseMessages(e,this._logger);for(const n of t)if(!(this._messageBuffer&&!this._messageBuffer._shouldProcessMessage(n)))switch(n.type){case Ie.Invocation:this._invokeClientMethod(n).catch(i=>{this._logger.log(V.Error,`Invoke client method threw error: ${Ks(i)}`)});break;case Ie.StreamItem:case Ie.Completion:{const i=this._callbacks[n.invocationId];if(i){n.type===Ie.Completion&&delete this._callbacks[n.invocationId];try{i(n)}catch(r){this._logger.log(V.Error,`Stream callback threw error: ${Ks(r)}`)}}break}case Ie.Ping:break;case Ie.Close:{this._logger.log(V.Information,"Close message received from server.");const i=n.error?new Error("Server returned an error on close: "+n.error):void 0;n.allowReconnect===!0?this.connection.stop(i):this._stopPromise=this._stopInternal(i);break}case Ie.Ack:this._messageBuffer&&this._messageBuffer._ack(n);break;case Ie.Sequence:this._messageBuffer&&this._messageBuffer._resetSequence(n);break;default:this._logger.log(V.Warning,`Invalid message type: ${n.type}.`);break}}this._resetTimeoutPeriod()}_processHandshakeResponse(e){let t,n;try{[n,t]=this._handshakeProtocol.parseHandshakeResponse(e)}catch(i){const r="Error parsing handshake response: "+i;this._logger.log(V.Error,r);const o=new Error(r);throw this._handshakeRejecter(o),o}if(t.error){const i="Server returned handshake error: "+t.error;this._logger.log(V.Error,i);const r=new Error(i);throw this._handshakeRejecter(r),r}else this._logger.log(V.Debug,"Server handshake complete.");return this._handshakeResolver(),n}_resetKeepAliveInterval(){this.connection.features.inherentKeepAlive||(this._nextKeepAlive=new Date().getTime()+this.keepAliveIntervalInMilliseconds,this._cleanupPingTimer())}_resetTimeoutPeriod(){if((!this.connection.features||!this.connection.features.inherentKeepAlive)&&(this._timeoutHandle=setTimeout(()=>this.serverTimeout(),this.serverTimeoutInMilliseconds),this._pingServerHandle===void 0)){let e=this._nextKeepAlive-new Date().getTime();e<0&&(e=0),this._pingServerHandle=setTimeout(async()=>{if(this._connectionState===tt.Connected)try{await this._sendMessage(this._cachedPingMessage)}catch{this._cleanupPingTimer()}},e)}}serverTimeout(){this.connection.stop(new Error("Server timeout elapsed without receiving a message from the server."))}async _invokeClientMethod(e){const t=e.target.toLowerCase(),n=this._methods[t];if(!n){this._logger.log(V.Warning,`No client method with the name '${t}' found.`),e.invocationId&&(this._logger.log(V.Warning,`No result given for '${t}' method and invocation ID '${e.invocationId}'.`),await this._sendWithProtocol(this._createCompletionMessage(e.invocationId,"Client didn't provide a result.",null)));return}const i=n.slice(),r=!!e.invocationId;let o,a,c;for(const l of i)try{const h=o;o=await l.apply(this,e.arguments),r&&o&&h&&(this._logger.log(V.Error,`Multiple results provided for '${t}'. Sending error to server.`),c=this._createCompletionMessage(e.invocationId,"Client provided multiple results.",null)),a=void 0}catch(h){a=h,this._logger.log(V.Error,`A callback for the method '${t}' threw error '${h}'.`)}c?await this._sendWithProtocol(c):r?(a?c=this._createCompletionMessage(e.invocationId,`${a}`,null):o!==void 0?c=this._createCompletionMessage(e.invocationId,null,o):(this._logger.log(V.Warning,`No result given for '${t}' method and invocation ID '${e.invocationId}'.`),c=this._createCompletionMessage(e.invocationId,"Client didn't provide a result.",null)),await this._sendWithProtocol(c)):o&&this._logger.log(V.Error,`Result given for '${t}' method but server is not expecting a result.`)}_connectionClosed(e){this._logger.log(V.Debug,`HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`),this._stopDuringStartError=this._stopDuringStartError||e||new tn("The underlying connection was closed before the hub handshake could complete."),this._handshakeResolver&&this._handshakeResolver(),this._cancelCallbacksWithError(e||new Error("Invocation canceled due to the underlying connection being closed.")),this._cleanupTimeout(),this._cleanupPingTimer(),this._connectionState===tt.Disconnecting?this._completeClose(e):this._connectionState===tt.Connected&&this._reconnectPolicy?this._reconnect(e):this._connectionState===tt.Connected&&this._completeClose(e)}_completeClose(e){if(this._connectionStarted){this._connectionState=tt.Disconnected,this._connectionStarted=!1,this._messageBuffer&&(this._messageBuffer._dispose(e??new Error("Connection closed.")),this._messageBuffer=void 0),it.isBrowser&&window.document.removeEventListener("freeze",this._freezeEventListener);try{this._closedCallbacks.forEach(t=>t.apply(this,[e]))}catch(t){this._logger.log(V.Error,`An onclose callback called with error '${e}' threw error '${t}'.`)}}}async _reconnect(e){const t=Date.now();let n=0,i=e!==void 0?e:new Error("Attempting to reconnect due to a unknown error."),r=this._getNextRetryDelay(n++,0,i);if(r===null){this._logger.log(V.Debug,"Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt."),this._completeClose(e);return}if(this._connectionState=tt.Reconnecting,e?this._logger.log(V.Information,`Connection reconnecting because of error '${e}'.`):this._logger.log(V.Information,"Connection reconnecting."),this._reconnectingCallbacks.length!==0){try{this._reconnectingCallbacks.forEach(o=>o.apply(this,[e]))}catch(o){this._logger.log(V.Error,`An onreconnecting callback called with error '${e}' threw error '${o}'.`)}if(this._connectionState!==tt.Reconnecting){this._logger.log(V.Debug,"Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");return}}for(;r!==null;){if(this._logger.log(V.Information,`Reconnect attempt number ${n} will start in ${r} ms.`),await new Promise(o=>{this._reconnectDelayHandle=setTimeout(o,r)}),this._reconnectDelayHandle=void 0,this._connectionState!==tt.Reconnecting){this._logger.log(V.Debug,"Connection left the reconnecting state during reconnect delay. Done reconnecting.");return}try{if(await this._startInternal(),this._connectionState=tt.Connected,this._logger.log(V.Information,"HubConnection reconnected successfully."),this._reconnectedCallbacks.length!==0)try{this._reconnectedCallbacks.forEach(o=>o.apply(this,[this.connection.connectionId]))}catch(o){this._logger.log(V.Error,`An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${o}'.`)}return}catch(o){if(this._logger.log(V.Information,`Reconnect attempt failed because of error '${o}'.`),this._connectionState!==tt.Reconnecting){this._logger.log(V.Debug,`Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`),this._connectionState===tt.Disconnecting&&this._completeClose();return}i=o instanceof Error?o:new Error(o.toString()),r=this._getNextRetryDelay(n++,Date.now()-t,i)}}this._logger.log(V.Information,`Reconnect retries have been exhausted after ${Date.now()-t} ms and ${n} failed attempts. Connection disconnecting.`),this._completeClose()}_getNextRetryDelay(e,t,n){try{return this._reconnectPolicy.nextRetryDelayInMilliseconds({elapsedMilliseconds:t,previousRetryCount:e,retryReason:n})}catch(i){return this._logger.log(V.Error,`IRetryPolicy.nextRetryDelayInMilliseconds(${e}, ${t}) threw error '${i}'.`),null}}_cancelCallbacksWithError(e){const t=this._callbacks;this._callbacks={},Object.keys(t).forEach(n=>{const i=t[n];try{i(null,e)}catch(r){this._logger.log(V.Error,`Stream 'error' callback called with '${e}' threw error: ${Ks(r)}`)}})}_cleanupPingTimer(){this._pingServerHandle&&(clearTimeout(this._pingServerHandle),this._pingServerHandle=void 0)}_cleanupTimeout(){this._timeoutHandle&&clearTimeout(this._timeoutHandle)}_createInvocation(e,t,n,i){if(n)return i.length!==0?{arguments:t,streamIds:i,target:e,type:Ie.Invocation}:{arguments:t,target:e,type:Ie.Invocation};{const r=this._invocationId;return this._invocationId++,i.length!==0?{arguments:t,invocationId:r.toString(),streamIds:i,target:e,type:Ie.Invocation}:{arguments:t,invocationId:r.toString(),target:e,type:Ie.Invocation}}}_launchStreams(e,t){if(e.length!==0){t||(t=Promise.resolve());for(const n in e)e[n].subscribe({complete:()=>{t=t.then(()=>this._sendWithProtocol(this._createCompletionMessage(n)))},error:i=>{let r;i instanceof Error?r=i.message:i&&i.toString?r=i.toString():r="Unknown error",t=t.then(()=>this._sendWithProtocol(this._createCompletionMessage(n,r)))},next:i=>{t=t.then(()=>this._sendWithProtocol(this._createStreamItemMessage(n,i)))}})}}_replaceStreamingParams(e){const t=[],n=[];for(let i=0;i<e.length;i++){const r=e[i];if(this._isObservable(r)){const o=this._invocationId;this._invocationId++,t[o]=r,n.push(o.toString()),e.splice(i,1)}}return[t,n]}_isObservable(e){return e&&e.subscribe&&typeof e.subscribe=="function"}_createStreamInvocation(e,t,n){const i=this._invocationId;return this._invocationId++,n.length!==0?{arguments:t,invocationId:i.toString(),streamIds:n,target:e,type:Ie.StreamInvocation}:{arguments:t,invocationId:i.toString(),target:e,type:Ie.StreamInvocation}}_createCancelInvocation(e){return{invocationId:e,type:Ie.CancelInvocation}}_createStreamItemMessage(e,t){return{invocationId:e,item:t,type:Ie.StreamItem}}_createCompletionMessage(e,t,n){return t?{error:t,invocationId:e,type:Ie.Completion}:{invocationId:e,result:n,type:Ie.Completion}}_createCloseMessage(){return{type:Ie.Close}}}const _l=[0,2e3,1e4,3e4,null];class po{constructor(e){this._retryDelays=e!==void 0?[...e,null]:_l}nextRetryDelayInMilliseconds(e){return this._retryDelays[e.previousRetryCount]}}class Vn{}Vn.Authorization="Authorization";Vn.Cookie="Cookie";class vl extends zs{constructor(e,t){super(),this._innerClient=e,this._accessTokenFactory=t}async send(e){let t=!0;this._accessTokenFactory&&(!this._accessToken||e.url&&e.url.indexOf("/negotiate?")>0)&&(t=!1,this._accessToken=await this._accessTokenFactory()),this._setAuthorizationHeader(e);const n=await this._innerClient.send(e);return t&&n.statusCode===401&&this._accessTokenFactory?(this._accessToken=await this._accessTokenFactory(),this._setAuthorizationHeader(e),await this._innerClient.send(e)):n}_setAuthorizationHeader(e){e.headers||(e.headers={}),this._accessToken?e.headers[Vn.Authorization]=`Bearer ${this._accessToken}`:this._accessTokenFactory&&e.headers[Vn.Authorization]&&delete e.headers[Vn.Authorization]}getCookieString(e){return this._innerClient.getCookieString(e)}}var ft;(function(s){s[s.None=0]="None",s[s.WebSockets=1]="WebSockets",s[s.ServerSentEvents=2]="ServerSentEvents",s[s.LongPolling=4]="LongPolling"})(ft||(ft={}));var wt;(function(s){s[s.Text=1]="Text",s[s.Binary=2]="Binary"})(wt||(wt={}));let xl=class{constructor(){this._isAborted=!1,this.onabort=null}abort(){this._isAborted||(this._isAborted=!0,this.onabort&&this.onabort())}get signal(){return this}get aborted(){return this._isAborted}};class mo{get pollAborted(){return this._pollAbort.aborted}constructor(e,t,n){this._httpClient=e,this._logger=t,this._pollAbort=new xl,this._options=n,this._running=!1,this.onreceive=null,this.onclose=null}async connect(e,t){if(dt.isRequired(e,"url"),dt.isRequired(t,"transferFormat"),dt.isIn(t,wt,"transferFormat"),this._url=e,this._logger.log(V.Trace,"(LongPolling transport) Connecting."),t===wt.Binary&&typeof XMLHttpRequest<"u"&&typeof new XMLHttpRequest().responseType!="string")throw new Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");const[n,i]=Si(),r={[n]:i,...this._options.headers},o={abortSignal:this._pollAbort.signal,headers:r,timeout:1e5,withCredentials:this._options.withCredentials};t===wt.Binary&&(o.responseType="arraybuffer");const a=`${e}&_=${Date.now()}`;this._logger.log(V.Trace,`(LongPolling transport) polling: ${a}.`);const c=await this._httpClient.get(a,o);c.statusCode!==200?(this._logger.log(V.Error,`(LongPolling transport) Unexpected response code: ${c.statusCode}.`),this._closeError=new Gn(c.statusText||"",c.statusCode),this._running=!1):this._running=!0,this._receiving=this._poll(this._url,o)}async _poll(e,t){try{for(;this._running;)try{const n=`${e}&_=${Date.now()}`;this._logger.log(V.Trace,`(LongPolling transport) polling: ${n}.`);const i=await this._httpClient.get(n,t);i.statusCode===204?(this._logger.log(V.Information,"(LongPolling transport) Poll terminated by server."),this._running=!1):i.statusCode!==200?(this._logger.log(V.Error,`(LongPolling transport) Unexpected response code: ${i.statusCode}.`),this._closeError=new Gn(i.statusText||"",i.statusCode),this._running=!1):i.content?(this._logger.log(V.Trace,`(LongPolling transport) data received. ${ki(i.content,this._options.logMessageContent)}.`),this.onreceive&&this.onreceive(i.content)):this._logger.log(V.Trace,"(LongPolling transport) Poll timed out, reissuing.")}catch(n){this._running?n instanceof qr?this._logger.log(V.Trace,"(LongPolling transport) Poll timed out, reissuing."):(this._closeError=n,this._running=!1):this._logger.log(V.Trace,`(LongPolling transport) Poll errored after shutdown: ${n.message}`)}}finally{this._logger.log(V.Trace,"(LongPolling transport) Polling complete."),this.pollAborted||this._raiseOnClose()}}async send(e){return this._running?sc(this._logger,"LongPolling",this._httpClient,this._url,e,this._options):Promise.reject(new Error("Cannot send until the transport is connected"))}async stop(){this._logger.log(V.Trace,"(LongPolling transport) Stopping polling."),this._running=!1,this._pollAbort.abort();try{await this._receiving,this._logger.log(V.Trace,`(LongPolling transport) sending DELETE request to ${this._url}.`);const e={},[t,n]=Si();e[t]=n;const i={headers:{...e,...this._options.headers},timeout:this._options.timeout,withCredentials:this._options.withCredentials};let r;try{await this._httpClient.delete(this._url,i)}catch(o){r=o}r?r instanceof Gn&&(r.statusCode===404?this._logger.log(V.Trace,"(LongPolling transport) A 404 response was returned from sending a DELETE request."):this._logger.log(V.Trace,`(LongPolling transport) Error sending a DELETE request: ${r}`)):this._logger.log(V.Trace,"(LongPolling transport) DELETE request accepted.")}finally{this._logger.log(V.Trace,"(LongPolling transport) Stop finished."),this._raiseOnClose()}}_raiseOnClose(){if(this.onclose){let e="(LongPolling transport) Firing onclose event.";this._closeError&&(e+=" Error: "+this._closeError),this._logger.log(V.Trace,e),this.onclose(this._closeError)}}}class yl{constructor(e,t,n,i){this._httpClient=e,this._accessToken=t,this._logger=n,this._options=i,this.onreceive=null,this.onclose=null}async connect(e,t){return dt.isRequired(e,"url"),dt.isRequired(t,"transferFormat"),dt.isIn(t,wt,"transferFormat"),this._logger.log(V.Trace,"(SSE transport) Connecting."),this._url=e,this._accessToken&&(e+=(e.indexOf("?")<0?"?":"&")+`access_token=${encodeURIComponent(this._accessToken)}`),new Promise((n,i)=>{let r=!1;if(t!==wt.Text){i(new Error("The Server-Sent Events transport only supports the 'Text' transfer format"));return}let o;if(it.isBrowser||it.isWebWorker)o=new this._options.EventSource(e,{withCredentials:this._options.withCredentials});else{const a=this._httpClient.getCookieString(e),c={};c.Cookie=a;const[l,h]=Si();c[l]=h,o=new this._options.EventSource(e,{withCredentials:this._options.withCredentials,headers:{...c,...this._options.headers}})}try{o.onmessage=a=>{if(this.onreceive)try{this._logger.log(V.Trace,`(SSE transport) data received. ${ki(a.data,this._options.logMessageContent)}.`),this.onreceive(a.data)}catch(c){this._close(c);return}},o.onerror=a=>{r?this._close():i(new Error("EventSource failed to connect. The connection could not be found on the server, either the connection ID is not present on the server, or a proxy is refusing/buffering the connection. If you have multiple servers check that sticky sessions are enabled."))},o.onopen=()=>{this._logger.log(V.Information,`SSE connected to ${this._url}`),this._eventSource=o,r=!0,n()}}catch(a){i(a);return}})}async send(e){return this._eventSource?sc(this._logger,"SSE",this._httpClient,this._url,e,this._options):Promise.reject(new Error("Cannot send until the transport is connected"))}stop(){return this._close(),Promise.resolve()}_close(e){this._eventSource&&(this._eventSource.close(),this._eventSource=void 0,this.onclose&&this.onclose(e))}}class Sl{constructor(e,t,n,i,r,o){this._logger=n,this._accessTokenFactory=t,this._logMessageContent=i,this._webSocketConstructor=r,this._httpClient=e,this.onreceive=null,this.onclose=null,this._headers=o}async connect(e,t){dt.isRequired(e,"url"),dt.isRequired(t,"transferFormat"),dt.isIn(t,wt,"transferFormat"),this._logger.log(V.Trace,"(WebSockets transport) Connecting.");let n;return this._accessTokenFactory&&(n=await this._accessTokenFactory()),new Promise((i,r)=>{e=e.replace(/^http/,"ws");let o;const a=this._httpClient.getCookieString(e);let c=!1;if(it.isNode||it.isReactNative){const l={},[h,u]=Si();l[h]=u,n&&(l[Vn.Authorization]=`Bearer ${n}`),a&&(l[Vn.Cookie]=a),o=new this._webSocketConstructor(e,void 0,{headers:{...l,...this._headers}})}else n&&(e+=(e.indexOf("?")<0?"?":"&")+`access_token=${encodeURIComponent(n)}`);o||(o=new this._webSocketConstructor(e)),t===wt.Binary&&(o.binaryType="arraybuffer"),o.onopen=l=>{this._logger.log(V.Information,`WebSocket connected to ${e}.`),this._webSocket=o,c=!0,i()},o.onerror=l=>{let h=null;typeof ErrorEvent<"u"&&l instanceof ErrorEvent?h=l.error:h="There was an error with the transport",this._logger.log(V.Information,`(WebSockets transport) ${h}.`)},o.onmessage=l=>{if(this._logger.log(V.Trace,`(WebSockets transport) data received. ${ki(l.data,this._logMessageContent)}.`),this.onreceive)try{this.onreceive(l.data)}catch(h){this._close(h);return}},o.onclose=l=>{if(c)this._close(l);else{let h=null;typeof ErrorEvent<"u"&&l instanceof ErrorEvent?h=l.error:h="WebSocket failed to connect. The connection could not be found on the server, either the endpoint may not be a SignalR endpoint, the connection ID is not present on the server, or there is a proxy blocking WebSockets. If you have multiple servers check that sticky sessions are enabled.",r(new Error(h))}}})}send(e){return this._webSocket&&this._webSocket.readyState===this._webSocketConstructor.OPEN?(this._logger.log(V.Trace,`(WebSockets transport) sending data. ${ki(e,this._logMessageContent)}.`),this._webSocket.send(e),Promise.resolve()):Promise.reject("WebSocket is not in the OPEN state")}stop(){return this._webSocket&&this._close(void 0),Promise.resolve()}_close(e){this._webSocket&&(this._webSocket.onclose=()=>{},this._webSocket.onmessage=()=>{},this._webSocket.onerror=()=>{},this._webSocket.close(),this._webSocket=void 0),this._logger.log(V.Trace,"(WebSockets transport) socket closed."),this.onclose&&(this._isCloseEvent(e)&&(e.wasClean===!1||e.code!==1e3)?this.onclose(new Error(`WebSocket closed with status code: ${e.code} (${e.reason||"no reason given"}).`)):e instanceof Error?this.onclose(e):this.onclose())}_isCloseEvent(e){return e&&typeof e.wasClean=="boolean"&&typeof e.code=="number"}}const go=100;class Ml{constructor(e,t={}){if(this._stopPromiseResolver=()=>{},this.features={},this._negotiateVersion=1,dt.isRequired(e,"url"),this._logger=el(t.logger),this.baseUrl=this._resolveUrl(e),t=t||{},t.logMessageContent=t.logMessageContent===void 0?!1:t.logMessageContent,typeof t.withCredentials=="boolean"||t.withCredentials===void 0)t.withCredentials=t.withCredentials===void 0?!0:t.withCredentials;else throw new Error("withCredentials option was not a 'boolean' or 'undefined' value");t.timeout=t.timeout===void 0?100*1e3:t.timeout;let n=null,i=null;if(it.isNode&&typeof require<"u"){const r=typeof __webpack_require__=="function"?__non_webpack_require__:require;n=r("ws"),i=r("eventsource")}!it.isNode&&typeof WebSocket<"u"&&!t.WebSocket?t.WebSocket=WebSocket:it.isNode&&!t.WebSocket&&n&&(t.WebSocket=n),!it.isNode&&typeof EventSource<"u"&&!t.EventSource?t.EventSource=EventSource:it.isNode&&!t.EventSource&&typeof i<"u"&&(t.EventSource=i),this._httpClient=new vl(t.httpClient||new ll(this._logger),t.accessTokenFactory),this._connectionState="Disconnected",this._connectionStarted=!1,this._options=t,this.onreceive=null,this.onclose=null}async start(e){if(e=e||wt.Binary,dt.isIn(e,wt,"transferFormat"),this._logger.log(V.Debug,`Starting connection with transfer format '${wt[e]}'.`),this._connectionState!=="Disconnected")return Promise.reject(new Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));if(this._connectionState="Connecting",this._startInternalPromise=this._startInternal(e),await this._startInternalPromise,this._connectionState==="Disconnecting"){const t="Failed to start the HttpConnection before stop() was called.";return this._logger.log(V.Error,t),await this._stopPromise,Promise.reject(new tn(t))}else if(this._connectionState!=="Connected"){const t="HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";return this._logger.log(V.Error,t),Promise.reject(new tn(t))}this._connectionStarted=!0}send(e){return this._connectionState!=="Connected"?Promise.reject(new Error("Cannot send data if the connection is not in the 'Connected' State.")):(this._sendQueue||(this._sendQueue=new Yr(this.transport)),this._sendQueue.send(e))}async stop(e){if(this._connectionState==="Disconnected")return this._logger.log(V.Debug,`Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnected state.`),Promise.resolve();if(this._connectionState==="Disconnecting")return this._logger.log(V.Debug,`Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`),this._stopPromise;this._connectionState="Disconnecting",this._stopPromise=new Promise(t=>{this._stopPromiseResolver=t}),await this._stopInternal(e),await this._stopPromise}async _stopInternal(e){this._stopError=e;try{await this._startInternalPromise}catch{}if(this.transport){try{await this.transport.stop()}catch(t){this._logger.log(V.Error,`HttpConnection.transport.stop() threw error '${t}'.`),this._stopConnection()}this.transport=void 0}else this._logger.log(V.Debug,"HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.")}async _startInternal(e){let t=this.baseUrl;this._accessTokenFactory=this._options.accessTokenFactory,this._httpClient._accessTokenFactory=this._accessTokenFactory;try{if(this._options.skipNegotiation)if(this._options.transport===ft.WebSockets)this.transport=this._constructTransport(ft.WebSockets),await this._startTransport(t,e);else throw new Error("Negotiation can only be skipped when using the WebSocket transport directly.");else{let n=null,i=0;do{if(n=await this._getNegotiationResponse(t),this._connectionState==="Disconnecting"||this._connectionState==="Disconnected")throw new tn("The connection was stopped during negotiation.");if(n.error)throw new Error(n.error);if(n.ProtocolVersion)throw new Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");if(n.url&&(t=n.url),n.accessToken){const r=n.accessToken;this._accessTokenFactory=()=>r,this._httpClient._accessToken=r,this._httpClient._accessTokenFactory=void 0}i++}while(n.url&&i<go);if(i===go&&n.url)throw new Error("Negotiate redirection limit exceeded.");await this._createTransport(t,this._options.transport,n,e)}this.transport instanceof mo&&(this.features.inherentKeepAlive=!0),this._connectionState==="Connecting"&&(this._logger.log(V.Debug,"The HttpConnection connected successfully."),this._connectionState="Connected")}catch(n){return this._logger.log(V.Error,"Failed to start the connection: "+n),this._connectionState="Disconnected",this.transport=void 0,this._stopPromiseResolver(),Promise.reject(n)}}async _getNegotiationResponse(e){const t={},[n,i]=Si();t[n]=i;const r=this._resolveNegotiateUrl(e);this._logger.log(V.Debug,`Sending negotiation request: ${r}.`);try{const o=await this._httpClient.post(r,{content:"",headers:{...t,...this._options.headers},timeout:this._options.timeout,withCredentials:this._options.withCredentials});if(o.statusCode!==200)return Promise.reject(new Error(`Unexpected status code returned from negotiate '${o.statusCode}'`));const a=JSON.parse(o.content);return(!a.negotiateVersion||a.negotiateVersion<1)&&(a.connectionToken=a.connectionId),a.useStatefulReconnect&&this._options._useStatefulReconnect!==!0?Promise.reject(new uo("Client didn't negotiate Stateful Reconnect but the server did.")):a}catch(o){let a="Failed to complete negotiation with the server: "+o;return o instanceof Gn&&o.statusCode===404&&(a=a+" Either this is not a SignalR endpoint or there is a proxy blocking the connection."),this._logger.log(V.Error,a),Promise.reject(new uo(a))}}_createConnectUrl(e,t){return t?e+(e.indexOf("?")===-1?"?":"&")+`id=${t}`:e}async _createTransport(e,t,n,i){let r=this._createConnectUrl(e,n.connectionToken);if(this._isITransport(t)){this._logger.log(V.Debug,"Connection was provided an instance of ITransport, using that directly."),this.transport=t,await this._startTransport(r,i),this.connectionId=n.connectionId;return}const o=[],a=n.availableTransports||[];let c=n;for(const l of a){const h=this._resolveTransportOrError(l,t,i,(c==null?void 0:c.useStatefulReconnect)===!0);if(h instanceof Error)o.push(`${l.transport} failed:`),o.push(h);else if(this._isITransport(h)){if(this.transport=h,!c){try{c=await this._getNegotiationResponse(e)}catch(u){return Promise.reject(u)}r=this._createConnectUrl(e,c.connectionToken)}try{await this._startTransport(r,i),this.connectionId=c.connectionId;return}catch(u){if(this._logger.log(V.Error,`Failed to start the transport '${l.transport}': ${u}`),c=void 0,o.push(new Kc(`${l.transport} failed: ${u}`,ft[l.transport])),this._connectionState!=="Connecting"){const d="Failed to select transport before stop() was called.";return this._logger.log(V.Debug,d),Promise.reject(new tn(d))}}}}return o.length>0?Promise.reject(new Zc(`Unable to connect to the server with any of the available transports. ${o.join(" ")}`,o)):Promise.reject(new Error("None of the transports supported by the client are supported by the server."))}_constructTransport(e){switch(e){case ft.WebSockets:if(!this._options.WebSocket)throw new Error("'WebSocket' is not supported in your environment.");return new Sl(this._httpClient,this._accessTokenFactory,this._logger,this._options.logMessageContent,this._options.WebSocket,this._options.headers||{});case ft.ServerSentEvents:if(!this._options.EventSource)throw new Error("'EventSource' is not supported in your environment.");return new yl(this._httpClient,this._httpClient._accessToken,this._logger,this._options);case ft.LongPolling:return new mo(this._httpClient,this._logger,this._options);default:throw new Error(`Unknown transport: ${e}.`)}}_startTransport(e,t){return this.transport.onreceive=this.onreceive,this.features.reconnect?this.transport.onclose=async n=>{let i=!1;if(this.features.reconnect)try{this.features.disconnected(),await this.transport.connect(e,t),await this.features.resend()}catch{i=!0}else{this._stopConnection(n);return}i&&this._stopConnection(n)}:this.transport.onclose=n=>this._stopConnection(n),this.transport.connect(e,t)}_resolveTransportOrError(e,t,n,i){const r=ft[e.transport];if(r==null)return this._logger.log(V.Debug,`Skipping transport '${e.transport}' because it is not supported by this client.`),new Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);if(El(t,r))if(e.transferFormats.map(a=>wt[a]).indexOf(n)>=0){if(r===ft.WebSockets&&!this._options.WebSocket||r===ft.ServerSentEvents&&!this._options.EventSource)return this._logger.log(V.Debug,`Skipping transport '${ft[r]}' because it is not supported in your environment.'`),new Yc(`'${ft[r]}' is not supported in your environment.`,r);this._logger.log(V.Debug,`Selecting transport '${ft[r]}'.`);try{return this.features.reconnect=r===ft.WebSockets?i:void 0,this._constructTransport(r)}catch(a){return a}}else return this._logger.log(V.Debug,`Skipping transport '${ft[r]}' because it does not support the requested transfer format '${wt[n]}'.`),new Error(`'${ft[r]}' does not support ${wt[n]}.`);else return this._logger.log(V.Debug,`Skipping transport '${ft[r]}' because it was disabled by the client.`),new jc(`'${ft[r]}' is disabled by the client.`,r)}_isITransport(e){return e&&typeof e=="object"&&"connect"in e}_stopConnection(e){if(this._logger.log(V.Debug,`HttpConnection.stopConnection(${e}) called while in state ${this._connectionState}.`),this.transport=void 0,e=this._stopError||e,this._stopError=void 0,this._connectionState==="Disconnected"){this._logger.log(V.Debug,`Call to HttpConnection.stopConnection(${e}) was ignored because the connection is already in the disconnected state.`);return}if(this._connectionState==="Connecting")throw this._logger.log(V.Warning,`Call to HttpConnection.stopConnection(${e}) was ignored because the connection is still in the connecting state.`),new Error(`HttpConnection.stopConnection(${e}) was called while the connection is still in the connecting state.`);if(this._connectionState==="Disconnecting"&&this._stopPromiseResolver(),e?this._logger.log(V.Error,`Connection disconnected with error '${e}'.`):this._logger.log(V.Information,"Connection disconnected."),this._sendQueue&&(this._sendQueue.stop().catch(t=>{this._logger.log(V.Error,`TransportSendQueue.stop() threw error '${t}'.`)}),this._sendQueue=void 0),this.connectionId=void 0,this._connectionState="Disconnected",this._connectionStarted){this._connectionStarted=!1;try{this.onclose&&this.onclose(e)}catch(t){this._logger.log(V.Error,`HttpConnection.onclose(${e}) threw error '${t}'.`)}}}_resolveUrl(e){if(e.lastIndexOf("https://",0)===0||e.lastIndexOf("http://",0)===0)return e;if(!it.isBrowser)throw new Error(`Cannot resolve '${e}'.`);const t=window.document.createElement("a");return t.href=e,this._logger.log(V.Information,`Normalizing '${e}' to '${t.href}'.`),t.href}_resolveNegotiateUrl(e){const t=new URL(e);t.pathname.endsWith("/")?t.pathname+="negotiate":t.pathname+="/negotiate";const n=new URLSearchParams(t.searchParams);return n.has("negotiateVersion")||n.append("negotiateVersion",this._negotiateVersion.toString()),n.has("useStatefulReconnect")?n.get("useStatefulReconnect")==="true"&&(this._options._useStatefulReconnect=!0):this._options._useStatefulReconnect===!0&&n.append("useStatefulReconnect","true"),t.search=n.toString(),t.toString()}}function El(s,e){return!s||(e&s)!==0}class Yr{constructor(e){this._transport=e,this._buffer=[],this._executing=!0,this._sendBufferedData=new Yi,this._transportResult=new Yi,this._sendLoopPromise=this._sendLoop()}send(e){return this._bufferData(e),this._transportResult||(this._transportResult=new Yi),this._transportResult.promise}stop(){return this._executing=!1,this._sendBufferedData.resolve(),this._sendLoopPromise}_bufferData(e){if(this._buffer.length&&typeof this._buffer[0]!=typeof e)throw new Error(`Expected data to be of type ${typeof this._buffer} but was of type ${typeof e}`);this._buffer.push(e),this._sendBufferedData.resolve()}async _sendLoop(){for(;;){if(await this._sendBufferedData.promise,!this._executing){this._transportResult&&this._transportResult.reject("Connection stopped.");break}this._sendBufferedData=new Yi;const e=this._transportResult;this._transportResult=void 0;const t=typeof this._buffer[0]=="string"?this._buffer.join(""):Yr._concatBuffers(this._buffer);this._buffer.length=0;try{await this._transport.send(t),e.resolve()}catch(n){e.reject(n)}}}static _concatBuffers(e){const t=e.map(r=>r.byteLength).reduce((r,o)=>r+o),n=new Uint8Array(t);let i=0;for(const r of e)n.set(new Uint8Array(r),i),i+=r.byteLength;return n.buffer}}class Yi{constructor(){this.promise=new Promise((e,t)=>[this._resolver,this._rejecter]=[e,t])}resolve(){this._resolver()}reject(e){this._rejecter(e)}}const bl="json";class Tl{constructor(){this.name=bl,this.version=2,this.transferFormat=wt.Text}parseMessages(e,t){if(typeof e!="string")throw new Error("Invalid input for JSON hub protocol. Expected a string.");if(!e)return[];t===null&&(t=Oi.instance);const n=Ht.parse(e),i=[];for(const r of n){const o=JSON.parse(r);if(typeof o.type!="number")throw new Error("Invalid payload.");switch(o.type){case Ie.Invocation:this._isInvocationMessage(o);break;case Ie.StreamItem:this._isStreamItemMessage(o);break;case Ie.Completion:this._isCompletionMessage(o);break;case Ie.Ping:break;case Ie.Close:break;case Ie.Ack:this._isAckMessage(o);break;case Ie.Sequence:this._isSequenceMessage(o);break;default:t.log(V.Information,"Unknown message type '"+o.type+"' ignored.");continue}i.push(o)}return i}writeMessage(e){return Ht.write(JSON.stringify(e))}_isInvocationMessage(e){this._assertNotEmptyString(e.target,"Invalid payload for Invocation message."),e.invocationId!==void 0&&this._assertNotEmptyString(e.invocationId,"Invalid payload for Invocation message.")}_isStreamItemMessage(e){if(this._assertNotEmptyString(e.invocationId,"Invalid payload for StreamItem message."),e.item===void 0)throw new Error("Invalid payload for StreamItem message.")}_isCompletionMessage(e){if(e.result&&e.error)throw new Error("Invalid payload for Completion message.");!e.result&&e.error&&this._assertNotEmptyString(e.error,"Invalid payload for Completion message."),this._assertNotEmptyString(e.invocationId,"Invalid payload for Completion message.")}_isAckMessage(e){if(typeof e.sequenceId!="number")throw new Error("Invalid SequenceId for Ack message.")}_isSequenceMessage(e){if(typeof e.sequenceId!="number")throw new Error("Invalid SequenceId for Sequence message.")}_assertNotEmptyString(e,t){if(typeof e!="string"||e==="")throw new Error(t)}}const wl={trace:V.Trace,debug:V.Debug,info:V.Information,information:V.Information,warn:V.Warning,warning:V.Warning,error:V.Error,critical:V.Critical,none:V.None};function Al(s){const e=wl[s.toLowerCase()];if(typeof e<"u")return e;throw new Error(`Unknown log level: ${s}`)}class Cl{configureLogging(e){if(dt.isRequired(e,"logging"),Rl(e))this.logger=e;else if(typeof e=="string"){const t=Al(e);this.logger=new Ls(t)}else this.logger=new Ls(e);return this}withUrl(e,t){return dt.isRequired(e,"url"),dt.isNotEmpty(e,"url"),this.url=e,typeof t=="object"?this.httpConnectionOptions={...this.httpConnectionOptions,...t}:this.httpConnectionOptions={...this.httpConnectionOptions,transport:t},this}withHubProtocol(e){return dt.isRequired(e,"protocol"),this.protocol=e,this}withAutomaticReconnect(e){if(this.reconnectPolicy)throw new Error("A reconnectPolicy has already been set.");return e?Array.isArray(e)?this.reconnectPolicy=new po(e):this.reconnectPolicy=e:this.reconnectPolicy=new po,this}withServerTimeout(e){return dt.isRequired(e,"milliseconds"),this._serverTimeoutInMilliseconds=e,this}withKeepAliveInterval(e){return dt.isRequired(e,"milliseconds"),this._keepAliveIntervalInMilliseconds=e,this}withStatefulReconnect(e){return this.httpConnectionOptions===void 0&&(this.httpConnectionOptions={}),this.httpConnectionOptions._useStatefulReconnect=!0,this._statefulReconnectBufferSize=e==null?void 0:e.bufferSize,this}build(){const e=this.httpConnectionOptions||{};if(e.logger===void 0&&(e.logger=this.logger),!this.url)throw new Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");const t=new Ml(this.url,e);return $r.create(t,this.logger||Oi.instance,this.protocol||new Tl,this.reconnectPolicy,this._serverTimeoutInMilliseconds,this._keepAliveIntervalInMilliseconds,this._statefulReconnectBufferSize)}}function Rl(s){return s.log!==void 0}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const jr="160",Pl=0,_o=1,Ll=2,rc=1,Il=2,dn=3,rn=0,At=1,Jt=2,An=0,Wn=1,vo=2,xo=3,yo=4,Dl=5,zn=100,Ul=101,Nl=102,So=103,Mo=104,Fl=200,Ol=201,kl=202,Bl=203,Dr=204,Ur=205,zl=206,Hl=207,Gl=208,Vl=209,Wl=210,Xl=211,ql=212,$l=213,Yl=214,jl=0,Kl=1,Zl=2,Is=3,Jl=4,Ql=5,eh=6,th=7,Kr=0,nh=1,ih=2,Cn=0,sh=1,rh=2,oh=3,ah=4,ch=5,lh=6,oc=300,Mi=301,Ei=302,Nr=303,Fr=304,Hs=306,Bi=1e3,Qt=1001,Or=1002,St=1003,Eo=1004,Zs=1005,Ut=1006,hh=1007,zi=1008,Rn=1009,uh=1010,dh=1011,Zr=1012,ac=1013,bn=1014,Tn=1015,Hi=1016,cc=1017,lc=1018,Xn=1020,fh=1021,en=1023,ph=1024,mh=1025,qn=1026,bi=1027,gh=1028,hc=1029,_h=1030,uc=1031,dc=1033,Js=33776,Qs=33777,er=33778,tr=33779,bo=35840,To=35841,wo=35842,Ao=35843,fc=36196,Co=37492,Ro=37496,Po=37808,Lo=37809,Io=37810,Do=37811,Uo=37812,No=37813,Fo=37814,Oo=37815,ko=37816,Bo=37817,zo=37818,Ho=37819,Go=37820,Vo=37821,nr=36492,Wo=36494,Xo=36495,vh=36283,qo=36284,$o=36285,Yo=36286,pc=3e3,$n=3001,xh=3200,yh=3201,mc=0,Sh=1,$t="",Mt="srgb",mn="srgb-linear",Jr="display-p3",Gs="display-p3-linear",Ds="linear",et="srgb",Us="rec709",Ns="p3",Jn=7680,jo=519,Mh=512,Eh=513,bh=514,gc=515,Th=516,wh=517,Ah=518,Ch=519,kr=35044,Ko="300 es",Br=1035,pn=2e3,Fs=2001;class wi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}}const bt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Rs=Math.PI/180,zr=180/Math.PI;function Pn(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(bt[s&255]+bt[s>>8&255]+bt[s>>16&255]+bt[s>>24&255]+"-"+bt[e&255]+bt[e>>8&255]+"-"+bt[e>>16&15|64]+bt[e>>24&255]+"-"+bt[t&63|128]+bt[t>>8&255]+"-"+bt[t>>16&255]+bt[t>>24&255]+bt[n&255]+bt[n>>8&255]+bt[n>>16&255]+bt[n>>24&255]).toLowerCase()}function Nt(s,e,t){return Math.max(e,Math.min(t,s))}function Rh(s,e){return(s%e+e)%e}function ir(s,e,t){return(1-t)*s+t*e}function Zo(s){return(s&s-1)===0&&s!==0}function Hr(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function fn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Ke(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}class We{constructor(e=0,t=0){We.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*i+e.x,this.y=r*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ve{constructor(e,t,n,i,r,o,a,c,l){Ve.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,c,l)}set(e,t,n,i,r,o,a,c,l){const h=this.elements;return h[0]=e,h[1]=i,h[2]=a,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],m=n[5],g=n[8],_=i[0],p=i[3],f=i[6],E=i[1],y=i[4],T=i[7],P=i[2],w=i[5],A=i[8];return r[0]=o*_+a*E+c*P,r[3]=o*p+a*y+c*w,r[6]=o*f+a*T+c*A,r[1]=l*_+h*E+u*P,r[4]=l*p+h*y+u*w,r[7]=l*f+h*T+u*A,r[2]=d*_+m*E+g*P,r[5]=d*p+m*y+g*w,r[8]=d*f+m*T+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return t*o*h-t*a*l-n*r*h+n*a*c+i*r*l-i*o*c}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=h*o-a*l,d=a*c-h*r,m=l*r-o*c,g=t*u+n*d+i*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=u*_,e[1]=(i*l-h*n)*_,e[2]=(a*n-i*o)*_,e[3]=d*_,e[4]=(h*t-i*c)*_,e[5]=(i*r-a*t)*_,e[6]=m*_,e[7]=(n*c-l*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-i*l,i*c,-i*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(sr.makeScale(e,t)),this}rotate(e){return this.premultiply(sr.makeRotation(-e)),this}translate(e,t){return this.premultiply(sr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const sr=new Ve;function _c(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Os(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Ph(){const s=Os("canvas");return s.style.display="block",s}const Jo={};function Fi(s){s in Jo||(Jo[s]=!0,console.warn(s))}const Qo=new Ve().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),ea=new Ve().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),ji={[mn]:{transfer:Ds,primaries:Us,toReference:s=>s,fromReference:s=>s},[Mt]:{transfer:et,primaries:Us,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[Gs]:{transfer:Ds,primaries:Ns,toReference:s=>s.applyMatrix3(ea),fromReference:s=>s.applyMatrix3(Qo)},[Jr]:{transfer:et,primaries:Ns,toReference:s=>s.convertSRGBToLinear().applyMatrix3(ea),fromReference:s=>s.applyMatrix3(Qo).convertLinearToSRGB()}},Lh=new Set([mn,Gs]),je={enabled:!0,_workingColorSpace:mn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!Lh.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,e,t){if(this.enabled===!1||e===t||!e||!t)return s;const n=ji[e].toReference,i=ji[t].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,e){return this.convert(s,this._workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this._workingColorSpace)},getPrimaries:function(s){return ji[s].primaries},getTransfer:function(s){return s===$t?Ds:ji[s].transfer}};function yi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function rr(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Qn;class vc{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Qn===void 0&&(Qn=Os("canvas")),Qn.width=e.width,Qn.height=e.height;const n=Qn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Qn}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Os("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=yi(r[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(yi(t[n]/255)*255):t[n]=yi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Ih=0;class xc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ih++}),this.uuid=Pn(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(or(i[o].image)):r.push(or(i[o]))}else r=or(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function or(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?vc.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Dh=0;class Ft extends wi{constructor(e=Ft.DEFAULT_IMAGE,t=Ft.DEFAULT_MAPPING,n=Qt,i=Qt,r=Ut,o=zi,a=en,c=Rn,l=Ft.DEFAULT_ANISOTROPY,h=$t){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Dh++}),this.uuid=Pn(),this.name="",this.source=new xc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new We(0,0),this.repeat=new We(1,1),this.center=new We(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ve,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Fi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===$n?Mt:$t),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==oc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Bi:e.x=e.x-Math.floor(e.x);break;case Qt:e.x=e.x<0?0:1;break;case Or:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Bi:e.y=e.y-Math.floor(e.y);break;case Qt:e.y=e.y<0?0:1;break;case Or:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Fi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Mt?$n:pc}set encoding(e){Fi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===$n?Mt:$t}}Ft.DEFAULT_IMAGE=null;Ft.DEFAULT_MAPPING=oc;Ft.DEFAULT_ANISOTROPY=1;class yt{constructor(e=0,t=0,n=0,i=1){yt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const c=e.elements,l=c[0],h=c[4],u=c[8],d=c[1],m=c[5],g=c[9],_=c[2],p=c[6],f=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+p)<.1&&Math.abs(l+m+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(l+1)/2,T=(m+1)/2,P=(f+1)/2,w=(h+d)/4,A=(u+_)/4,j=(g+p)/4;return y>T&&y>P?y<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(y),i=w/n,r=A/n):T>P?T<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(T),n=w/i,r=j/i):P<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(P),n=A/r,i=j/r),this.set(n,i,r,t),this}let E=Math.sqrt((p-g)*(p-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(E)<.001&&(E=1),this.x=(p-g)/E,this.y=(u-_)/E,this.z=(d-h)/E,this.w=Math.acos((l+m+f-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Uh extends wi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new yt(0,0,e,t),this.scissorTest=!1,this.viewport=new yt(0,0,e,t);const i={width:e,height:t,depth:1};n.encoding!==void 0&&(Fi("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===$n?Mt:$t),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ut,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Ft(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new xc(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Kn extends Uh{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class yc extends Ft{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=St,this.minFilter=St,this.wrapR=Qt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Nh extends Ft{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=St,this.minFilter=St,this.wrapR=Qt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Gi{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,o,a){let c=n[i+0],l=n[i+1],h=n[i+2],u=n[i+3];const d=r[o+0],m=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=d,e[t+1]=m,e[t+2]=g,e[t+3]=_;return}if(u!==_||c!==d||l!==m||h!==g){let p=1-a;const f=c*d+l*m+h*g+u*_,E=f>=0?1:-1,y=1-f*f;if(y>Number.EPSILON){const P=Math.sqrt(y),w=Math.atan2(P,f*E);p=Math.sin(p*w)/P,a=Math.sin(a*w)/P}const T=a*E;if(c=c*p+d*T,l=l*p+m*T,h=h*p+g*T,u=u*p+_*T,p===1-a){const P=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=P,l*=P,h*=P,u*=P}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,o){const a=n[i],c=n[i+1],l=n[i+2],h=n[i+3],u=r[o],d=r[o+1],m=r[o+2],g=r[o+3];return e[t]=a*g+h*u+c*m-l*d,e[t+1]=c*g+h*d+l*u-a*m,e[t+2]=l*g+h*m+a*d-c*u,e[t+3]=h*g-a*u-c*d-l*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(i/2),u=a(r/2),d=c(n/2),m=c(i/2),g=c(r/2);switch(o){case"XYZ":this._x=d*h*u+l*m*g,this._y=l*m*u-d*h*g,this._z=l*h*g+d*m*u,this._w=l*h*u-d*m*g;break;case"YXZ":this._x=d*h*u+l*m*g,this._y=l*m*u-d*h*g,this._z=l*h*g-d*m*u,this._w=l*h*u+d*m*g;break;case"ZXY":this._x=d*h*u-l*m*g,this._y=l*m*u+d*h*g,this._z=l*h*g+d*m*u,this._w=l*h*u-d*m*g;break;case"ZYX":this._x=d*h*u-l*m*g,this._y=l*m*u+d*h*g,this._z=l*h*g-d*m*u,this._w=l*h*u+d*m*g;break;case"YZX":this._x=d*h*u+l*m*g,this._y=l*m*u+d*h*g,this._z=l*h*g-d*m*u,this._w=l*h*u-d*m*g;break;case"XZY":this._x=d*h*u-l*m*g,this._y=l*m*u-d*h*g,this._z=l*h*g+d*m*u,this._w=l*h*u+d*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){const m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(h-c)*m,this._y=(r-l)*m,this._z=(o-i)*m}else if(n>a&&n>u){const m=2*Math.sqrt(1+n-a-u);this._w=(h-c)/m,this._x=.25*m,this._y=(i+o)/m,this._z=(r+l)/m}else if(a>u){const m=2*Math.sqrt(1+a-n-u);this._w=(r-l)/m,this._x=(i+o)/m,this._y=.25*m,this._z=(c+h)/m}else{const m=2*Math.sqrt(1+u-n-a);this._w=(o-i)/m,this._x=(r+l)/m,this._y=(c+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Nt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+o*a+i*l-r*c,this._y=i*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-i*a,this._w=o*h-n*a-i*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const m=1-t;return this._w=m*o+t*this._w,this._x=m*n+t*this._x,this._y=m*i+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-t)*h)/l,d=Math.sin(t*h)/l;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),i=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(t*Math.cos(i),n*Math.sin(r),n*Math.cos(r),t*Math.sin(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(e=0,t=0,n=0){R.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ta.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ta.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*i-a*n),h=2*(a*t-r*i),u=2*(r*n-o*t);return this.x=t+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=i+c*u+r*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=i*c-r*a,this.y=r*o-n*c,this.z=n*a-i*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ar.copy(this).projectOnVector(e),this.sub(ar)}reflect(e){return this.sub(ar.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ar=new R,ta=new Gi;class Vi{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(jt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(jt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=jt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,jt):jt.fromBufferAttribute(r,o),jt.applyMatrix4(e.matrixWorld),this.expandByPoint(jt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ki.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ki.copy(n.boundingBox)),Ki.applyMatrix4(e.matrixWorld),this.union(Ki)}const i=e.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,jt),jt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ri),Zi.subVectors(this.max,Ri),ei.subVectors(e.a,Ri),ti.subVectors(e.b,Ri),ni.subVectors(e.c,Ri),_n.subVectors(ti,ei),vn.subVectors(ni,ti),Dn.subVectors(ei,ni);let t=[0,-_n.z,_n.y,0,-vn.z,vn.y,0,-Dn.z,Dn.y,_n.z,0,-_n.x,vn.z,0,-vn.x,Dn.z,0,-Dn.x,-_n.y,_n.x,0,-vn.y,vn.x,0,-Dn.y,Dn.x,0];return!cr(t,ei,ti,ni,Zi)||(t=[1,0,0,0,1,0,0,0,1],!cr(t,ei,ti,ni,Zi))?!1:(Ji.crossVectors(_n,vn),t=[Ji.x,Ji.y,Ji.z],cr(t,ei,ti,ni,Zi))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,jt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(jt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(an[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),an[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),an[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),an[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),an[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),an[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),an[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),an[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(an),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const an=[new R,new R,new R,new R,new R,new R,new R,new R],jt=new R,Ki=new Vi,ei=new R,ti=new R,ni=new R,_n=new R,vn=new R,Dn=new R,Ri=new R,Zi=new R,Ji=new R,Un=new R;function cr(s,e,t,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Un.fromArray(s,r);const a=i.x*Math.abs(Un.x)+i.y*Math.abs(Un.y)+i.z*Math.abs(Un.z),c=e.dot(Un),l=t.dot(Un),h=n.dot(Un);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const Fh=new Vi,Pi=new R,lr=new R;class Wi{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Fh.setFromPoints(e).getCenter(n);let i=0;for(let r=0,o=e.length;r<o;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Pi.subVectors(e,this.center);const t=Pi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Pi,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(lr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Pi.copy(e.center).add(lr)),this.expandByPoint(Pi.copy(e.center).sub(lr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const cn=new R,hr=new R,Qi=new R,xn=new R,ur=new R,es=new R,dr=new R;class Vs{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,cn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=cn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(cn.copy(this.origin).addScaledVector(this.direction,t),cn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){hr.copy(e).add(t).multiplyScalar(.5),Qi.copy(t).sub(e).normalize(),xn.copy(this.origin).sub(hr);const r=e.distanceTo(t)*.5,o=-this.direction.dot(Qi),a=xn.dot(this.direction),c=-xn.dot(Qi),l=xn.lengthSq(),h=Math.abs(1-o*o);let u,d,m,g;if(h>0)if(u=o*c-a,d=o*a-c,g=r*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,m=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=r,u=Math.max(0,-(o*d+a)),m=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(o*d+a)),m=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-c),r),m=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),m=d*(d+2*c)+l):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-c),r),m=-u*u+d*(d+2*c)+l);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),m=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(hr).addScaledVector(Qi,d),m}intersectSphere(e,t){cn.subVectors(e.center,this.origin);const n=cn.dot(this.direction),i=cn.dot(cn)-n*n,r=e.radius*e.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,i=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,i=(e.min.x-d.x)*l),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(e.min.z-d.z)*u,c=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,c=(e.min.z-d.z)*u),n>c||a>i)||((a>n||n!==n)&&(n=a),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,cn)!==null}intersectTriangle(e,t,n,i,r){ur.subVectors(t,e),es.subVectors(n,e),dr.crossVectors(ur,es);let o=this.direction.dot(dr),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;xn.subVectors(this.origin,e);const c=a*this.direction.dot(es.crossVectors(xn,es));if(c<0)return null;const l=a*this.direction.dot(ur.cross(xn));if(l<0||c+l>o)return null;const h=-a*xn.dot(dr);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ct{constructor(e,t,n,i,r,o,a,c,l,h,u,d,m,g,_,p){ct.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,c,l,h,u,d,m,g,_,p)}set(e,t,n,i,r,o,a,c,l,h,u,d,m,g,_,p){const f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=i,f[1]=r,f[5]=o,f[9]=a,f[13]=c,f[2]=l,f[6]=h,f[10]=u,f[14]=d,f[3]=m,f[7]=g,f[11]=_,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ct().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/ii.setFromMatrixColumn(e,0).length(),r=1/ii.setFromMatrixColumn(e,1).length(),o=1/ii.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=o*h,m=o*u,g=a*h,_=a*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=m+g*l,t[5]=d-_*l,t[9]=-a*c,t[2]=_-d*l,t[6]=g+m*l,t[10]=o*c}else if(e.order==="YXZ"){const d=c*h,m=c*u,g=l*h,_=l*u;t[0]=d+_*a,t[4]=g*a-m,t[8]=o*l,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=m*a-g,t[6]=_+d*a,t[10]=o*c}else if(e.order==="ZXY"){const d=c*h,m=c*u,g=l*h,_=l*u;t[0]=d-_*a,t[4]=-o*u,t[8]=g+m*a,t[1]=m+g*a,t[5]=o*h,t[9]=_-d*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const d=o*h,m=o*u,g=a*h,_=a*u;t[0]=c*h,t[4]=g*l-m,t[8]=d*l+_,t[1]=c*u,t[5]=_*l+d,t[9]=m*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const d=o*c,m=o*l,g=a*c,_=a*l;t[0]=c*h,t[4]=_-d*u,t[8]=g*u+m,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-l*h,t[6]=m*u+g,t[10]=d-_*u}else if(e.order==="XZY"){const d=o*c,m=o*l,g=a*c,_=a*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=d*u+_,t[5]=o*h,t[9]=m*u-g,t[2]=g*u-m,t[6]=a*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Oh,e,kh)}lookAt(e,t,n){const i=this.elements;return kt.subVectors(e,t),kt.lengthSq()===0&&(kt.z=1),kt.normalize(),yn.crossVectors(n,kt),yn.lengthSq()===0&&(Math.abs(n.z)===1?kt.x+=1e-4:kt.z+=1e-4,kt.normalize(),yn.crossVectors(n,kt)),yn.normalize(),ts.crossVectors(kt,yn),i[0]=yn.x,i[4]=ts.x,i[8]=kt.x,i[1]=yn.y,i[5]=ts.y,i[9]=kt.y,i[2]=yn.z,i[6]=ts.z,i[10]=kt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],m=n[13],g=n[2],_=n[6],p=n[10],f=n[14],E=n[3],y=n[7],T=n[11],P=n[15],w=i[0],A=i[4],j=i[8],S=i[12],b=i[1],H=i[5],W=i[9],se=i[13],L=i[2],k=i[6],G=i[10],$=i[14],X=i[3],q=i[7],K=i[11],te=i[15];return r[0]=o*w+a*b+c*L+l*X,r[4]=o*A+a*H+c*k+l*q,r[8]=o*j+a*W+c*G+l*K,r[12]=o*S+a*se+c*$+l*te,r[1]=h*w+u*b+d*L+m*X,r[5]=h*A+u*H+d*k+m*q,r[9]=h*j+u*W+d*G+m*K,r[13]=h*S+u*se+d*$+m*te,r[2]=g*w+_*b+p*L+f*X,r[6]=g*A+_*H+p*k+f*q,r[10]=g*j+_*W+p*G+f*K,r[14]=g*S+_*se+p*$+f*te,r[3]=E*w+y*b+T*L+P*X,r[7]=E*A+y*H+T*k+P*q,r[11]=E*j+y*W+T*G+P*K,r[15]=E*S+y*se+T*$+P*te,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],u=e[6],d=e[10],m=e[14],g=e[3],_=e[7],p=e[11],f=e[15];return g*(+r*c*u-i*l*u-r*a*d+n*l*d+i*a*m-n*c*m)+_*(+t*c*m-t*l*d+r*o*d-i*o*m+i*l*h-r*c*h)+p*(+t*l*u-t*a*m-r*o*u+n*o*m+r*a*h-n*l*h)+f*(-i*a*h-t*c*u+t*a*d+i*o*u-n*o*d+n*c*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=e[9],d=e[10],m=e[11],g=e[12],_=e[13],p=e[14],f=e[15],E=u*p*l-_*d*l+_*c*m-a*p*m-u*c*f+a*d*f,y=g*d*l-h*p*l-g*c*m+o*p*m+h*c*f-o*d*f,T=h*_*l-g*u*l+g*a*m-o*_*m-h*a*f+o*u*f,P=g*u*c-h*_*c-g*a*d+o*_*d+h*a*p-o*u*p,w=t*E+n*y+i*T+r*P;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/w;return e[0]=E*A,e[1]=(_*d*r-u*p*r-_*i*m+n*p*m+u*i*f-n*d*f)*A,e[2]=(a*p*r-_*c*r+_*i*l-n*p*l-a*i*f+n*c*f)*A,e[3]=(u*c*r-a*d*r-u*i*l+n*d*l+a*i*m-n*c*m)*A,e[4]=y*A,e[5]=(h*p*r-g*d*r+g*i*m-t*p*m-h*i*f+t*d*f)*A,e[6]=(g*c*r-o*p*r-g*i*l+t*p*l+o*i*f-t*c*f)*A,e[7]=(o*d*r-h*c*r+h*i*l-t*d*l-o*i*m+t*c*m)*A,e[8]=T*A,e[9]=(g*u*r-h*_*r-g*n*m+t*_*m+h*n*f-t*u*f)*A,e[10]=(o*_*r-g*a*r+g*n*l-t*_*l-o*n*f+t*a*f)*A,e[11]=(h*a*r-o*u*r-h*n*l+t*u*l+o*n*m-t*a*m)*A,e[12]=P*A,e[13]=(h*_*i-g*u*i+g*n*d-t*_*d-h*n*p+t*u*p)*A,e[14]=(g*a*i-o*_*i-g*n*c+t*_*c+o*n*p-t*a*p)*A,e[15]=(o*u*i-h*a*i+h*n*c-t*u*c-o*n*d+t*a*d)*A,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-i*c,l*c+i*a,0,l*a+i*c,h*a+n,h*c-i*o,0,l*c-i*a,h*c+i*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,o){return this.set(1,n,r,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,h=o+o,u=a+a,d=r*l,m=r*h,g=r*u,_=o*h,p=o*u,f=a*u,E=c*l,y=c*h,T=c*u,P=n.x,w=n.y,A=n.z;return i[0]=(1-(_+f))*P,i[1]=(m+T)*P,i[2]=(g-y)*P,i[3]=0,i[4]=(m-T)*w,i[5]=(1-(d+f))*w,i[6]=(p+E)*w,i[7]=0,i[8]=(g+y)*A,i[9]=(p-E)*A,i[10]=(1-(d+_))*A,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=ii.set(i[0],i[1],i[2]).length();const o=ii.set(i[4],i[5],i[6]).length(),a=ii.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],Kt.copy(this);const l=1/r,h=1/o,u=1/a;return Kt.elements[0]*=l,Kt.elements[1]*=l,Kt.elements[2]*=l,Kt.elements[4]*=h,Kt.elements[5]*=h,Kt.elements[6]*=h,Kt.elements[8]*=u,Kt.elements[9]*=u,Kt.elements[10]*=u,t.setFromRotationMatrix(Kt),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,i,r,o,a=pn){const c=this.elements,l=2*r/(t-e),h=2*r/(n-i),u=(t+e)/(t-e),d=(n+i)/(n-i);let m,g;if(a===pn)m=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Fs)m=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,o,a=pn){const c=this.elements,l=1/(t-e),h=1/(n-i),u=1/(o-r),d=(t+e)*l,m=(n+i)*h;let g,_;if(a===pn)g=(o+r)*u,_=-2*u;else if(a===Fs)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-m,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const ii=new R,Kt=new ct,Oh=new R(0,0,0),kh=new R(1,1,1),yn=new R,ts=new R,kt=new R,na=new ct,ia=new Gi;class Xi{constructor(e=0,t=0,n=0,i=Xi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],o=i[4],a=i[8],c=i[1],l=i[5],h=i[9],u=i[2],d=i[6],m=i[10];switch(t){case"XYZ":this._y=Math.asin(Nt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Nt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Nt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Nt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Nt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-Nt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return na.makeRotationFromQuaternion(e),this.setFromRotationMatrix(na,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ia.setFromEuler(this),this.setFromQuaternion(ia,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Xi.DEFAULT_ORDER="XYZ";class Qr{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Bh=0;const sa=new R,si=new Gi,ln=new ct,ns=new R,Li=new R,zh=new R,Hh=new Gi,ra=new R(1,0,0),oa=new R(0,1,0),aa=new R(0,0,1),Gh={type:"added"},Vh={type:"removed"};class pt extends wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Bh++}),this.uuid=Pn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=pt.DEFAULT_UP.clone();const e=new R,t=new Xi,n=new Gi,i=new R(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ct},normalMatrix:{value:new Ve}}),this.matrix=new ct,this.matrixWorld=new ct,this.matrixAutoUpdate=pt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=pt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Qr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return si.setFromAxisAngle(e,t),this.quaternion.multiply(si),this}rotateOnWorldAxis(e,t){return si.setFromAxisAngle(e,t),this.quaternion.premultiply(si),this}rotateX(e){return this.rotateOnAxis(ra,e)}rotateY(e){return this.rotateOnAxis(oa,e)}rotateZ(e){return this.rotateOnAxis(aa,e)}translateOnAxis(e,t){return sa.copy(e).applyQuaternion(this.quaternion),this.position.add(sa.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ra,e)}translateY(e){return this.translateOnAxis(oa,e)}translateZ(e){return this.translateOnAxis(aa,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ln.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ns.copy(e):ns.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Li.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ln.lookAt(Li,ns,this.up):ln.lookAt(ns,Li,this.up),this.quaternion.setFromRotationMatrix(ln),i&&(ln.extractRotation(i.matrixWorld),si.setFromRotationMatrix(ln),this.quaternion.premultiply(si.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Gh)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Vh)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ln.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ln.multiply(e.parent.matrixWorld)),e.applyMatrix4(ln),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Li,e,zh),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Li,Hh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++){const r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++){const a=i[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];i.animations.push(r(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),m=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}pt.DEFAULT_UP=new R(0,1,0);pt.DEFAULT_MATRIX_AUTO_UPDATE=!0;pt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Zt=new R,hn=new R,fr=new R,un=new R,ri=new R,oi=new R,ca=new R,pr=new R,mr=new R,gr=new R;let is=!1;class zt{constructor(e=new R,t=new R,n=new R){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Zt.subVectors(e,t),i.cross(Zt);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){Zt.subVectors(i,t),hn.subVectors(n,t),fr.subVectors(e,t);const o=Zt.dot(Zt),a=Zt.dot(hn),c=Zt.dot(fr),l=hn.dot(hn),h=hn.dot(fr),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,m=(l*c-a*h)*d,g=(o*h-a*c)*d;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,un)===null?!1:un.x>=0&&un.y>=0&&un.x+un.y<=1}static getUV(e,t,n,i,r,o,a,c){return is===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),is=!0),this.getInterpolation(e,t,n,i,r,o,a,c)}static getInterpolation(e,t,n,i,r,o,a,c){return this.getBarycoord(e,t,n,i,un)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,un.x),c.addScaledVector(o,un.y),c.addScaledVector(a,un.z),c)}static isFrontFacing(e,t,n,i){return Zt.subVectors(n,t),hn.subVectors(e,t),Zt.cross(hn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Zt.subVectors(this.c,this.b),hn.subVectors(this.a,this.b),Zt.cross(hn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return zt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return zt.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,i,r){return is===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),is=!0),zt.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}getInterpolation(e,t,n,i,r){return zt.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return zt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return zt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let o,a;ri.subVectors(i,n),oi.subVectors(r,n),pr.subVectors(e,n);const c=ri.dot(pr),l=oi.dot(pr);if(c<=0&&l<=0)return t.copy(n);mr.subVectors(e,i);const h=ri.dot(mr),u=oi.dot(mr);if(h>=0&&u<=h)return t.copy(i);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(n).addScaledVector(ri,o);gr.subVectors(e,r);const m=ri.dot(gr),g=oi.dot(gr);if(g>=0&&m<=g)return t.copy(r);const _=m*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(n).addScaledVector(oi,a);const p=h*g-m*u;if(p<=0&&u-h>=0&&m-g>=0)return ca.subVectors(r,i),a=(u-h)/(u-h+(m-g)),t.copy(i).addScaledVector(ca,a);const f=1/(p+_+d);return o=_*f,a=d*f,t.copy(n).addScaledVector(ri,o).addScaledVector(oi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Sc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Sn={h:0,s:0,l:0},ss={h:0,s:0,l:0};function _r(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Ne{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Mt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,je.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=je.workingColorSpace){return this.r=e,this.g=t,this.b=n,je.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=je.workingColorSpace){if(e=Rh(e,1),t=Nt(t,0,1),n=Nt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=_r(o,r,e+1/3),this.g=_r(o,r,e),this.b=_r(o,r,e-1/3)}return je.toWorkingColorSpace(this,i),this}setStyle(e,t=Mt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Mt){const n=Sc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=yi(e.r),this.g=yi(e.g),this.b=yi(e.b),this}copyLinearToSRGB(e){return this.r=rr(e.r),this.g=rr(e.g),this.b=rr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Mt){return je.fromWorkingColorSpace(Tt.copy(this),e),Math.round(Nt(Tt.r*255,0,255))*65536+Math.round(Nt(Tt.g*255,0,255))*256+Math.round(Nt(Tt.b*255,0,255))}getHexString(e=Mt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=je.workingColorSpace){je.fromWorkingColorSpace(Tt.copy(this),t);const n=Tt.r,i=Tt.g,r=Tt.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(i-r)/u+(i<r?6:0);break;case i:c=(r-n)/u+2;break;case r:c=(n-i)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=je.workingColorSpace){return je.fromWorkingColorSpace(Tt.copy(this),t),e.r=Tt.r,e.g=Tt.g,e.b=Tt.b,e}getStyle(e=Mt){je.fromWorkingColorSpace(Tt.copy(this),e);const t=Tt.r,n=Tt.g,i=Tt.b;return e!==Mt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Sn),this.setHSL(Sn.h+e,Sn.s+t,Sn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Sn),e.getHSL(ss);const n=ir(Sn.h,ss.h,t),i=ir(Sn.s,ss.s,t),r=ir(Sn.l,ss.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Tt=new Ne;Ne.NAMES=Sc;let Wh=0;class gn extends wi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Wh++}),this.uuid=Pn(),this.name="",this.type="Material",this.blending=Wn,this.side=rn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Dr,this.blendDst=Ur,this.blendEquation=zn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ne(0,0,0),this.blendAlpha=0,this.depthFunc=Is,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=jo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Jn,this.stencilZFail=Jn,this.stencilZPass=Jn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Wn&&(n.blending=this.blending),this.side!==rn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Dr&&(n.blendSrc=this.blendSrc),this.blendDst!==Ur&&(n.blendDst=this.blendDst),this.blendEquation!==zn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Is&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==jo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Jn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Jn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Jn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(t){const r=i(e.textures),o=i(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Yn extends gn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Kr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ut=new R,rs=new We;class Yt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=kr,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Tn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)rs.fromBufferAttribute(this,t),rs.applyMatrix3(e),this.setXY(t,rs.x,rs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)ut.fromBufferAttribute(this,t),ut.applyMatrix3(e),this.setXYZ(t,ut.x,ut.y,ut.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)ut.fromBufferAttribute(this,t),ut.applyMatrix4(e),this.setXYZ(t,ut.x,ut.y,ut.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ut.fromBufferAttribute(this,t),ut.applyNormalMatrix(e),this.setXYZ(t,ut.x,ut.y,ut.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ut.fromBufferAttribute(this,t),ut.transformDirection(e),this.setXYZ(t,ut.x,ut.y,ut.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=fn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ke(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=fn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ke(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=fn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ke(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=fn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ke(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=fn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ke(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ke(t,this.array),n=Ke(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Ke(t,this.array),n=Ke(n,this.array),i=Ke(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=Ke(t,this.array),n=Ke(n,this.array),i=Ke(i,this.array),r=Ke(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==kr&&(e.usage=this.usage),e}}class Mc extends Yt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Ec extends Yt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class ht extends Yt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Xh=0;const Vt=new ct,vr=new pt,ai=new R,Bt=new Vi,Ii=new Vi,xt=new R;class Dt extends wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Xh++}),this.uuid=Pn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(_c(e)?Ec:Mc)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ve().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Vt.makeRotationFromQuaternion(e),this.applyMatrix4(Vt),this}rotateX(e){return Vt.makeRotationX(e),this.applyMatrix4(Vt),this}rotateY(e){return Vt.makeRotationY(e),this.applyMatrix4(Vt),this}rotateZ(e){return Vt.makeRotationZ(e),this.applyMatrix4(Vt),this}translate(e,t,n){return Vt.makeTranslation(e,t,n),this.applyMatrix4(Vt),this}scale(e,t,n){return Vt.makeScale(e,t,n),this.applyMatrix4(Vt),this}lookAt(e){return vr.lookAt(e),vr.updateMatrix(),this.applyMatrix4(vr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ai).negate(),this.translate(ai.x,ai.y,ai.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new ht(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];Bt.setFromBufferAttribute(r),this.morphTargetsRelative?(xt.addVectors(this.boundingBox.min,Bt.min),this.boundingBox.expandByPoint(xt),xt.addVectors(this.boundingBox.max,Bt.max),this.boundingBox.expandByPoint(xt)):(this.boundingBox.expandByPoint(Bt.min),this.boundingBox.expandByPoint(Bt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Wi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new R,1/0);return}if(e){const n=this.boundingSphere.center;if(Bt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];Ii.setFromBufferAttribute(a),this.morphTargetsRelative?(xt.addVectors(Bt.min,Ii.min),Bt.expandByPoint(xt),xt.addVectors(Bt.max,Ii.max),Bt.expandByPoint(xt)):(Bt.expandByPoint(Ii.min),Bt.expandByPoint(Ii.max))}Bt.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)xt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(xt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)xt.fromBufferAttribute(a,l),c&&(ai.fromBufferAttribute(e,l),xt.add(ai)),i=Math.max(i,n.distanceToSquared(xt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.array,i=t.position.array,r=t.normal.array,o=t.uv.array,a=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Yt(new Float32Array(4*a),4));const c=this.getAttribute("tangent").array,l=[],h=[];for(let b=0;b<a;b++)l[b]=new R,h[b]=new R;const u=new R,d=new R,m=new R,g=new We,_=new We,p=new We,f=new R,E=new R;function y(b,H,W){u.fromArray(i,b*3),d.fromArray(i,H*3),m.fromArray(i,W*3),g.fromArray(o,b*2),_.fromArray(o,H*2),p.fromArray(o,W*2),d.sub(u),m.sub(u),_.sub(g),p.sub(g);const se=1/(_.x*p.y-p.x*_.y);isFinite(se)&&(f.copy(d).multiplyScalar(p.y).addScaledVector(m,-_.y).multiplyScalar(se),E.copy(m).multiplyScalar(_.x).addScaledVector(d,-p.x).multiplyScalar(se),l[b].add(f),l[H].add(f),l[W].add(f),h[b].add(E),h[H].add(E),h[W].add(E))}let T=this.groups;T.length===0&&(T=[{start:0,count:n.length}]);for(let b=0,H=T.length;b<H;++b){const W=T[b],se=W.start,L=W.count;for(let k=se,G=se+L;k<G;k+=3)y(n[k+0],n[k+1],n[k+2])}const P=new R,w=new R,A=new R,j=new R;function S(b){A.fromArray(r,b*3),j.copy(A);const H=l[b];P.copy(H),P.sub(A.multiplyScalar(A.dot(H))).normalize(),w.crossVectors(j,H);const se=w.dot(h[b])<0?-1:1;c[b*4]=P.x,c[b*4+1]=P.y,c[b*4+2]=P.z,c[b*4+3]=se}for(let b=0,H=T.length;b<H;++b){const W=T[b],se=W.start,L=W.count;for(let k=se,G=se+L;k<G;k+=3)S(n[k+0]),S(n[k+1]),S(n[k+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Yt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,m=n.count;d<m;d++)n.setXYZ(d,0,0,0);const i=new R,r=new R,o=new R,a=new R,c=new R,l=new R,h=new R,u=new R;if(e)for(let d=0,m=e.count;d<m;d+=3){const g=e.getX(d+0),_=e.getX(d+1),p=e.getX(d+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,p),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,p),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let d=0,m=t.count;d<m;d+=3)i.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)xt.fromBufferAttribute(e,t),xt.normalize(),e.setXYZ(t,xt.x,xt.y,xt.z)}toNonIndexed(){function e(a,c){const l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h);let m=0,g=0;for(let _=0,p=c.length;_<p;_++){a.isInterleavedBufferAttribute?m=c[_]*a.data.stride+a.offset:m=c[_]*h;for(let f=0;f<h;f++)d[g++]=l[m++]}return new Yt(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Dt,n=this.index.array,i=this.attributes;for(const a in i){const c=i[a],l=e(c,n);t.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){const d=l[h],m=e(d,n);c.push(m)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const i={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const m=l[u];h.push(m.toJSON(e.data))}h.length>0&&(i[c]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const l in i){const h=i[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,m=u.length;d<m;d++)h.push(u[d].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const la=new ct,Nn=new Vs,os=new Wi,ha=new R,ci=new R,li=new R,hi=new R,xr=new R,as=new R,cs=new We,ls=new We,hs=new We,ua=new R,da=new R,fa=new R,us=new R,ds=new R;class $e extends pt{constructor(e=new Dt,t=new Yn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(r&&a){as.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],u=r[c];h!==0&&(xr.fromBufferAttribute(u,e),o?as.addScaledVector(xr,h):as.addScaledVector(xr.sub(t),h))}t.add(as)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),os.copy(n.boundingSphere),os.applyMatrix4(r),Nn.copy(e.ray).recast(e.near),!(os.containsPoint(Nn.origin)===!1&&(Nn.intersectSphere(os,ha)===null||Nn.origin.distanceToSquared(ha)>(e.far-e.near)**2))&&(la.copy(r).invert(),Nn.copy(e.ray).applyMatrix4(la),!(n.boundingBox!==null&&Nn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Nn)))}_computeIntersections(e,t,n){let i;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const p=d[g],f=o[p.materialIndex],E=Math.max(p.start,m.start),y=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let T=E,P=y;T<P;T+=3){const w=a.getX(T),A=a.getX(T+1),j=a.getX(T+2);i=fs(this,f,e,n,l,h,u,w,A,j),i&&(i.faceIndex=Math.floor(T/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,m.start),_=Math.min(a.count,m.start+m.count);for(let p=g,f=_;p<f;p+=3){const E=a.getX(p),y=a.getX(p+1),T=a.getX(p+2);i=fs(this,o,e,n,l,h,u,E,y,T),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const p=d[g],f=o[p.materialIndex],E=Math.max(p.start,m.start),y=Math.min(c.count,Math.min(p.start+p.count,m.start+m.count));for(let T=E,P=y;T<P;T+=3){const w=T,A=T+1,j=T+2;i=fs(this,f,e,n,l,h,u,w,A,j),i&&(i.faceIndex=Math.floor(T/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,m.start),_=Math.min(c.count,m.start+m.count);for(let p=g,f=_;p<f;p+=3){const E=p,y=p+1,T=p+2;i=fs(this,o,e,n,l,h,u,E,y,T),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}}function qh(s,e,t,n,i,r,o,a){let c;if(e.side===At?c=n.intersectTriangle(o,r,i,!0,a):c=n.intersectTriangle(i,r,o,e.side===rn,a),c===null)return null;ds.copy(a),ds.applyMatrix4(s.matrixWorld);const l=t.ray.origin.distanceTo(ds);return l<t.near||l>t.far?null:{distance:l,point:ds.clone(),object:s}}function fs(s,e,t,n,i,r,o,a,c,l){s.getVertexPosition(a,ci),s.getVertexPosition(c,li),s.getVertexPosition(l,hi);const h=qh(s,e,t,n,ci,li,hi,us);if(h){i&&(cs.fromBufferAttribute(i,a),ls.fromBufferAttribute(i,c),hs.fromBufferAttribute(i,l),h.uv=zt.getInterpolation(us,ci,li,hi,cs,ls,hs,new We)),r&&(cs.fromBufferAttribute(r,a),ls.fromBufferAttribute(r,c),hs.fromBufferAttribute(r,l),h.uv1=zt.getInterpolation(us,ci,li,hi,cs,ls,hs,new We),h.uv2=h.uv1),o&&(ua.fromBufferAttribute(o,a),da.fromBufferAttribute(o,c),fa.fromBufferAttribute(o,l),h.normal=zt.getInterpolation(us,ci,li,hi,ua,da,fa,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:c,c:l,normal:new R,materialIndex:0};zt.getNormal(ci,li,hi,u.normal),h.face=u}return h}class at extends Dt{constructor(e=1,t=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],u=[];let d=0,m=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,i,o,2),g("x","z","y",1,-1,e,n,-t,i,o,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new ht(l,3)),this.setAttribute("normal",new ht(h,3)),this.setAttribute("uv",new ht(u,2));function g(_,p,f,E,y,T,P,w,A,j,S){const b=T/A,H=P/j,W=T/2,se=P/2,L=w/2,k=A+1,G=j+1;let $=0,X=0;const q=new R;for(let K=0;K<G;K++){const te=K*H-se;for(let ne=0;ne<k;ne++){const z=ne*b-W;q[_]=z*E,q[p]=te*y,q[f]=L,l.push(q.x,q.y,q.z),q[_]=0,q[p]=0,q[f]=w>0?1:-1,h.push(q.x,q.y,q.z),u.push(ne/A),u.push(1-K/j),$+=1}}for(let K=0;K<j;K++)for(let te=0;te<A;te++){const ne=d+te+k*K,z=d+te+k*(K+1),J=d+(te+1)+k*(K+1),ie=d+(te+1)+k*K;c.push(ne,z,ie),c.push(z,J,ie),X+=6}a.addGroup(m,X,S),m+=X,d+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new at(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ti(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Lt(s){const e={};for(let t=0;t<s.length;t++){const n=Ti(s[t]);for(const i in n)e[i]=n[i]}return e}function $h(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function bc(s){return s.getRenderTarget()===null?s.outputColorSpace:je.workingColorSpace}const Yh={clone:Ti,merge:Lt};var jh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Kh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Zn extends gn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=jh,this.fragmentShader=Kh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ti(e.uniforms),this.uniformsGroups=$h(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Tc extends pt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ct,this.projectionMatrix=new ct,this.projectionMatrixInverse=new ct,this.coordinateSystem=pn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class qt extends Tc{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=zr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Rs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return zr*2*Math.atan(Math.tan(Rs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,i,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Rs*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*i/c,t-=o.offsetY*n/l,i*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ui=-90,di=1;class Zh extends pt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new qt(ui,di,e,t);i.layers=this.layers,this.add(i);const r=new qt(ui,di,e,t);r.layers=this.layers,this.add(r);const o=new qt(ui,di,e,t);o.layers=this.layers,this.add(o);const a=new qt(ui,di,e,t);a.layers=this.layers,this.add(a);const c=new qt(ui,di,e,t);c.layers=this.layers,this.add(c);const l=new qt(ui,di,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,o,a,c]=t;for(const l of t)this.remove(l);if(e===pn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Fs)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,c),e.setRenderTarget(n,4,i),e.render(t,l),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(u,d,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class wc extends Ft{constructor(e,t,n,i,r,o,a,c,l,h){e=e!==void 0?e:[],t=t!==void 0?t:Mi,super(e,t,n,i,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Jh extends Kn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];t.encoding!==void 0&&(Fi("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===$n?Mt:$t),this.texture=new wc(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Ut}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new at(5,5,5),r=new Zn({name:"CubemapFromEquirect",uniforms:Ti(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:At,blending:An});r.uniforms.tEquirect.value=t;const o=new $e(i,r),a=t.minFilter;return t.minFilter===zi&&(t.minFilter=Ut),new Zh(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,i){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(r)}}const yr=new R,Qh=new R,eu=new Ve;class kn{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=yr.subVectors(n,t).cross(Qh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(yr),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||eu.getNormalMatrix(e),i=this.coplanarPoint(yr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Fn=new Wi,ps=new R;class eo{constructor(e=new kn,t=new kn,n=new kn,i=new kn,r=new kn,o=new kn){this.planes=[e,t,n,i,r,o]}set(e,t,n,i,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=pn){const n=this.planes,i=e.elements,r=i[0],o=i[1],a=i[2],c=i[3],l=i[4],h=i[5],u=i[6],d=i[7],m=i[8],g=i[9],_=i[10],p=i[11],f=i[12],E=i[13],y=i[14],T=i[15];if(n[0].setComponents(c-r,d-l,p-m,T-f).normalize(),n[1].setComponents(c+r,d+l,p+m,T+f).normalize(),n[2].setComponents(c+o,d+h,p+g,T+E).normalize(),n[3].setComponents(c-o,d-h,p-g,T-E).normalize(),n[4].setComponents(c-a,d-u,p-_,T-y).normalize(),t===pn)n[5].setComponents(c+a,d+u,p+_,T+y).normalize();else if(t===Fs)n[5].setComponents(a,u,_,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Fn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Fn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Fn)}intersectsSprite(e){return Fn.center.set(0,0,0),Fn.radius=.7071067811865476,Fn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Fn)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(ps.x=i.normal.x>0?e.max.x:e.min.x,ps.y=i.normal.y>0?e.max.y:e.min.y,ps.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(ps)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ac(){let s=null,e=!1,t=null,n=null;function i(r,o){t(r,o),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function tu(s,e){const t=e.isWebGL2,n=new WeakMap;function i(l,h){const u=l.array,d=l.usage,m=u.byteLength,g=s.createBuffer();s.bindBuffer(h,g),s.bufferData(h,u,d),l.onUploadCallback();let _;if(u instanceof Float32Array)_=s.FLOAT;else if(u instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(t)_=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=s.UNSIGNED_SHORT;else if(u instanceof Int16Array)_=s.SHORT;else if(u instanceof Uint32Array)_=s.UNSIGNED_INT;else if(u instanceof Int32Array)_=s.INT;else if(u instanceof Int8Array)_=s.BYTE;else if(u instanceof Uint8Array)_=s.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)_=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:_,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:m}}function r(l,h,u){const d=h.array,m=h._updateRange,g=h.updateRanges;if(s.bindBuffer(u,l),m.count===-1&&g.length===0&&s.bufferSubData(u,0,d),g.length!==0){for(let _=0,p=g.length;_<p;_++){const f=g[_];t?s.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d,f.start,f.count):s.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d.subarray(f.start,f.start+f.count))}h.clearUpdateRanges()}m.count!==-1&&(t?s.bufferSubData(u,m.offset*d.BYTES_PER_ELEMENT,d,m.offset,m.count):s.bufferSubData(u,m.offset*d.BYTES_PER_ELEMENT,d.subarray(m.offset,m.offset+m.count)),m.count=-1),h.onUploadCallback()}function o(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function a(l){l.isInterleavedBufferAttribute&&(l=l.data);const h=n.get(l);h&&(s.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){const d=n.get(l);(!d||d.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const u=n.get(l);if(u===void 0)n.set(l,i(l,h));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,l,h),u.version=l.version}}return{get:o,remove:a,update:c}}class Ws extends Dt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(i),l=a+1,h=c+1,u=e/a,d=t/c,m=[],g=[],_=[],p=[];for(let f=0;f<h;f++){const E=f*d-o;for(let y=0;y<l;y++){const T=y*u-r;g.push(T,-E,0),_.push(0,0,1),p.push(y/a),p.push(1-f/c)}}for(let f=0;f<c;f++)for(let E=0;E<a;E++){const y=E+l*f,T=E+l*(f+1),P=E+1+l*(f+1),w=E+1+l*f;m.push(y,T,w),m.push(T,P,w)}this.setIndex(m),this.setAttribute("position",new ht(g,3)),this.setAttribute("normal",new ht(_,3)),this.setAttribute("uv",new ht(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ws(e.width,e.height,e.widthSegments,e.heightSegments)}}var nu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,iu=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,su=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ru=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ou=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,au=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,cu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,lu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,hu=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,uu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,du=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,fu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,pu=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,mu=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,gu=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,_u=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,vu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,xu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,yu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Su=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Mu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Eu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,bu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Tu=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,wu=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Au=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Cu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ru=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Pu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Lu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Iu="gl_FragColor = linearToOutputTexel( gl_FragColor );",Du=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Uu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Nu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Fu=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Ou=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ku=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Bu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,zu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Hu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Gu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Vu=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Wu=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Xu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,qu=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,$u=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Yu=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,ju=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Ku=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Zu=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ju=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Qu=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ed=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,td=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,nd=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,id=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,sd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,rd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,od=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ad=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,cd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,ld=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,hd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ud=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,dd=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,pd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,md=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,gd=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,_d=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,vd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,xd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,yd=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Sd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Md=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ed=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,bd=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Td=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,wd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ad=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Cd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Rd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Pd=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Ld=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Id=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Dd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ud=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Nd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Fd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Od=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,kd=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Bd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,zd=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Hd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Gd=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Vd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Wd=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Xd=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,qd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,$d=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Yd=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,jd=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Kd=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Zd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Jd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Qd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,ef=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const tf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,nf=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,rf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,of=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,af=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,lf=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,hf=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,uf=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,df=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ff=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pf=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,mf=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,gf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,_f=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vf=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xf=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yf=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Sf=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mf=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Ef=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,bf=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Tf=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wf=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Af=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cf=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Rf=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Pf=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Lf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,If=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Df=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Uf=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Nf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ke={alphahash_fragment:nu,alphahash_pars_fragment:iu,alphamap_fragment:su,alphamap_pars_fragment:ru,alphatest_fragment:ou,alphatest_pars_fragment:au,aomap_fragment:cu,aomap_pars_fragment:lu,batching_pars_vertex:hu,batching_vertex:uu,begin_vertex:du,beginnormal_vertex:fu,bsdfs:pu,iridescence_fragment:mu,bumpmap_pars_fragment:gu,clipping_planes_fragment:_u,clipping_planes_pars_fragment:vu,clipping_planes_pars_vertex:xu,clipping_planes_vertex:yu,color_fragment:Su,color_pars_fragment:Mu,color_pars_vertex:Eu,color_vertex:bu,common:Tu,cube_uv_reflection_fragment:wu,defaultnormal_vertex:Au,displacementmap_pars_vertex:Cu,displacementmap_vertex:Ru,emissivemap_fragment:Pu,emissivemap_pars_fragment:Lu,colorspace_fragment:Iu,colorspace_pars_fragment:Du,envmap_fragment:Uu,envmap_common_pars_fragment:Nu,envmap_pars_fragment:Fu,envmap_pars_vertex:Ou,envmap_physical_pars_fragment:ju,envmap_vertex:ku,fog_vertex:Bu,fog_pars_vertex:zu,fog_fragment:Hu,fog_pars_fragment:Gu,gradientmap_pars_fragment:Vu,lightmap_fragment:Wu,lightmap_pars_fragment:Xu,lights_lambert_fragment:qu,lights_lambert_pars_fragment:$u,lights_pars_begin:Yu,lights_toon_fragment:Ku,lights_toon_pars_fragment:Zu,lights_phong_fragment:Ju,lights_phong_pars_fragment:Qu,lights_physical_fragment:ed,lights_physical_pars_fragment:td,lights_fragment_begin:nd,lights_fragment_maps:id,lights_fragment_end:sd,logdepthbuf_fragment:rd,logdepthbuf_pars_fragment:od,logdepthbuf_pars_vertex:ad,logdepthbuf_vertex:cd,map_fragment:ld,map_pars_fragment:hd,map_particle_fragment:ud,map_particle_pars_fragment:dd,metalnessmap_fragment:fd,metalnessmap_pars_fragment:pd,morphcolor_vertex:md,morphnormal_vertex:gd,morphtarget_pars_vertex:_d,morphtarget_vertex:vd,normal_fragment_begin:xd,normal_fragment_maps:yd,normal_pars_fragment:Sd,normal_pars_vertex:Md,normal_vertex:Ed,normalmap_pars_fragment:bd,clearcoat_normal_fragment_begin:Td,clearcoat_normal_fragment_maps:wd,clearcoat_pars_fragment:Ad,iridescence_pars_fragment:Cd,opaque_fragment:Rd,packing:Pd,premultiplied_alpha_fragment:Ld,project_vertex:Id,dithering_fragment:Dd,dithering_pars_fragment:Ud,roughnessmap_fragment:Nd,roughnessmap_pars_fragment:Fd,shadowmap_pars_fragment:Od,shadowmap_pars_vertex:kd,shadowmap_vertex:Bd,shadowmask_pars_fragment:zd,skinbase_vertex:Hd,skinning_pars_vertex:Gd,skinning_vertex:Vd,skinnormal_vertex:Wd,specularmap_fragment:Xd,specularmap_pars_fragment:qd,tonemapping_fragment:$d,tonemapping_pars_fragment:Yd,transmission_fragment:jd,transmission_pars_fragment:Kd,uv_pars_fragment:Zd,uv_pars_vertex:Jd,uv_vertex:Qd,worldpos_vertex:ef,background_vert:tf,background_frag:nf,backgroundCube_vert:sf,backgroundCube_frag:rf,cube_vert:of,cube_frag:af,depth_vert:cf,depth_frag:lf,distanceRGBA_vert:hf,distanceRGBA_frag:uf,equirect_vert:df,equirect_frag:ff,linedashed_vert:pf,linedashed_frag:mf,meshbasic_vert:gf,meshbasic_frag:_f,meshlambert_vert:vf,meshlambert_frag:xf,meshmatcap_vert:yf,meshmatcap_frag:Sf,meshnormal_vert:Mf,meshnormal_frag:Ef,meshphong_vert:bf,meshphong_frag:Tf,meshphysical_vert:wf,meshphysical_frag:Af,meshtoon_vert:Cf,meshtoon_frag:Rf,points_vert:Pf,points_frag:Lf,shadow_vert:If,shadow_frag:Df,sprite_vert:Uf,sprite_frag:Nf},oe={common:{diffuse:{value:new Ne(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new We(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ne(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ne(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new Ne(16777215)},opacity:{value:1},center:{value:new We(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},sn={basic:{uniforms:Lt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.fog]),vertexShader:ke.meshbasic_vert,fragmentShader:ke.meshbasic_frag},lambert:{uniforms:Lt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new Ne(0)}}]),vertexShader:ke.meshlambert_vert,fragmentShader:ke.meshlambert_frag},phong:{uniforms:Lt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new Ne(0)},specular:{value:new Ne(1118481)},shininess:{value:30}}]),vertexShader:ke.meshphong_vert,fragmentShader:ke.meshphong_frag},standard:{uniforms:Lt([oe.common,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.roughnessmap,oe.metalnessmap,oe.fog,oe.lights,{emissive:{value:new Ne(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ke.meshphysical_vert,fragmentShader:ke.meshphysical_frag},toon:{uniforms:Lt([oe.common,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.gradientmap,oe.fog,oe.lights,{emissive:{value:new Ne(0)}}]),vertexShader:ke.meshtoon_vert,fragmentShader:ke.meshtoon_frag},matcap:{uniforms:Lt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,{matcap:{value:null}}]),vertexShader:ke.meshmatcap_vert,fragmentShader:ke.meshmatcap_frag},points:{uniforms:Lt([oe.points,oe.fog]),vertexShader:ke.points_vert,fragmentShader:ke.points_frag},dashed:{uniforms:Lt([oe.common,oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ke.linedashed_vert,fragmentShader:ke.linedashed_frag},depth:{uniforms:Lt([oe.common,oe.displacementmap]),vertexShader:ke.depth_vert,fragmentShader:ke.depth_frag},normal:{uniforms:Lt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,{opacity:{value:1}}]),vertexShader:ke.meshnormal_vert,fragmentShader:ke.meshnormal_frag},sprite:{uniforms:Lt([oe.sprite,oe.fog]),vertexShader:ke.sprite_vert,fragmentShader:ke.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ke.background_vert,fragmentShader:ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:ke.backgroundCube_vert,fragmentShader:ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ke.cube_vert,fragmentShader:ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ke.equirect_vert,fragmentShader:ke.equirect_frag},distanceRGBA:{uniforms:Lt([oe.common,oe.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ke.distanceRGBA_vert,fragmentShader:ke.distanceRGBA_frag},shadow:{uniforms:Lt([oe.lights,oe.fog,{color:{value:new Ne(0)},opacity:{value:1}}]),vertexShader:ke.shadow_vert,fragmentShader:ke.shadow_frag}};sn.physical={uniforms:Lt([sn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new We(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new Ne(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new We},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new Ne(0)},specularColor:{value:new Ne(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new We},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:ke.meshphysical_vert,fragmentShader:ke.meshphysical_frag};const ms={r:0,b:0,g:0};function Ff(s,e,t,n,i,r,o){const a=new Ne(0);let c=r===!0?0:1,l,h,u=null,d=0,m=null;function g(p,f){let E=!1,y=f.isScene===!0?f.background:null;y&&y.isTexture&&(y=(f.backgroundBlurriness>0?t:e).get(y)),y===null?_(a,c):y&&y.isColor&&(_(y,1),E=!0);const T=s.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,o):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||E)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),y&&(y.isCubeTexture||y.mapping===Hs)?(h===void 0&&(h=new $e(new at(1,1,1),new Zn({name:"BackgroundCubeMaterial",uniforms:Ti(sn.backgroundCube.uniforms),vertexShader:sn.backgroundCube.vertexShader,fragmentShader:sn.backgroundCube.fragmentShader,side:At,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(P,w,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=f.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,h.material.toneMapped=je.getTransfer(y.colorSpace)!==et,(u!==y||d!==y.version||m!==s.toneMapping)&&(h.material.needsUpdate=!0,u=y,d=y.version,m=s.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new $e(new Ws(2,2),new Zn({name:"BackgroundMaterial",uniforms:Ti(sn.background.uniforms),vertexShader:sn.background.vertexShader,fragmentShader:sn.background.fragmentShader,side:rn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,l.material.toneMapped=je.getTransfer(y.colorSpace)!==et,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||d!==y.version||m!==s.toneMapping)&&(l.material.needsUpdate=!0,u=y,d=y.version,m=s.toneMapping),l.layers.enableAll(),p.unshift(l,l.geometry,l.material,0,0,null))}function _(p,f){p.getRGB(ms,bc(s)),n.buffers.color.setClear(ms.r,ms.g,ms.b,f,o)}return{getClearColor:function(){return a},setClearColor:function(p,f=1){a.set(p),c=f,_(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(p){c=p,_(a,c)},render:g}}function Of(s,e,t,n){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:e.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},c=p(null);let l=c,h=!1;function u(L,k,G,$,X){let q=!1;if(o){const K=_($,G,k);l!==K&&(l=K,m(l.object)),q=f(L,$,G,X),q&&E(L,$,G,X)}else{const K=k.wireframe===!0;(l.geometry!==$.id||l.program!==G.id||l.wireframe!==K)&&(l.geometry=$.id,l.program=G.id,l.wireframe=K,q=!0)}X!==null&&t.update(X,s.ELEMENT_ARRAY_BUFFER),(q||h)&&(h=!1,j(L,k,G,$),X!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(X).buffer))}function d(){return n.isWebGL2?s.createVertexArray():r.createVertexArrayOES()}function m(L){return n.isWebGL2?s.bindVertexArray(L):r.bindVertexArrayOES(L)}function g(L){return n.isWebGL2?s.deleteVertexArray(L):r.deleteVertexArrayOES(L)}function _(L,k,G){const $=G.wireframe===!0;let X=a[L.id];X===void 0&&(X={},a[L.id]=X);let q=X[k.id];q===void 0&&(q={},X[k.id]=q);let K=q[$];return K===void 0&&(K=p(d()),q[$]=K),K}function p(L){const k=[],G=[],$=[];for(let X=0;X<i;X++)k[X]=0,G[X]=0,$[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:k,enabledAttributes:G,attributeDivisors:$,object:L,attributes:{},index:null}}function f(L,k,G,$){const X=l.attributes,q=k.attributes;let K=0;const te=G.getAttributes();for(const ne in te)if(te[ne].location>=0){const J=X[ne];let ie=q[ne];if(ie===void 0&&(ne==="instanceMatrix"&&L.instanceMatrix&&(ie=L.instanceMatrix),ne==="instanceColor"&&L.instanceColor&&(ie=L.instanceColor)),J===void 0||J.attribute!==ie||ie&&J.data!==ie.data)return!0;K++}return l.attributesNum!==K||l.index!==$}function E(L,k,G,$){const X={},q=k.attributes;let K=0;const te=G.getAttributes();for(const ne in te)if(te[ne].location>=0){let J=q[ne];J===void 0&&(ne==="instanceMatrix"&&L.instanceMatrix&&(J=L.instanceMatrix),ne==="instanceColor"&&L.instanceColor&&(J=L.instanceColor));const ie={};ie.attribute=J,J&&J.data&&(ie.data=J.data),X[ne]=ie,K++}l.attributes=X,l.attributesNum=K,l.index=$}function y(){const L=l.newAttributes;for(let k=0,G=L.length;k<G;k++)L[k]=0}function T(L){P(L,0)}function P(L,k){const G=l.newAttributes,$=l.enabledAttributes,X=l.attributeDivisors;G[L]=1,$[L]===0&&(s.enableVertexAttribArray(L),$[L]=1),X[L]!==k&&((n.isWebGL2?s:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](L,k),X[L]=k)}function w(){const L=l.newAttributes,k=l.enabledAttributes;for(let G=0,$=k.length;G<$;G++)k[G]!==L[G]&&(s.disableVertexAttribArray(G),k[G]=0)}function A(L,k,G,$,X,q,K){K===!0?s.vertexAttribIPointer(L,k,G,X,q):s.vertexAttribPointer(L,k,G,$,X,q)}function j(L,k,G,$){if(n.isWebGL2===!1&&(L.isInstancedMesh||$.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;y();const X=$.attributes,q=G.getAttributes(),K=k.defaultAttributeValues;for(const te in q){const ne=q[te];if(ne.location>=0){let z=X[te];if(z===void 0&&(te==="instanceMatrix"&&L.instanceMatrix&&(z=L.instanceMatrix),te==="instanceColor"&&L.instanceColor&&(z=L.instanceColor)),z!==void 0){const J=z.normalized,ie=z.itemSize,ge=t.get(z);if(ge===void 0)continue;const ve=ge.buffer,he=ge.type,De=ge.bytesPerElement,Te=n.isWebGL2===!0&&(he===s.INT||he===s.UNSIGNED_INT||z.gpuType===ac);if(z.isInterleavedBufferAttribute){const Xe=z.data,U=Xe.stride,st=z.offset;if(Xe.isInstancedInterleavedBuffer){for(let ye=0;ye<ne.locationSize;ye++)P(ne.location+ye,Xe.meshPerAttribute);L.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=Xe.meshPerAttribute*Xe.count)}else for(let ye=0;ye<ne.locationSize;ye++)T(ne.location+ye);s.bindBuffer(s.ARRAY_BUFFER,ve);for(let ye=0;ye<ne.locationSize;ye++)A(ne.location+ye,ie/ne.locationSize,he,J,U*De,(st+ie/ne.locationSize*ye)*De,Te)}else{if(z.isInstancedBufferAttribute){for(let Xe=0;Xe<ne.locationSize;Xe++)P(ne.location+Xe,z.meshPerAttribute);L.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=z.meshPerAttribute*z.count)}else for(let Xe=0;Xe<ne.locationSize;Xe++)T(ne.location+Xe);s.bindBuffer(s.ARRAY_BUFFER,ve);for(let Xe=0;Xe<ne.locationSize;Xe++)A(ne.location+Xe,ie/ne.locationSize,he,J,ie*De,ie/ne.locationSize*Xe*De,Te)}}else if(K!==void 0){const J=K[te];if(J!==void 0)switch(J.length){case 2:s.vertexAttrib2fv(ne.location,J);break;case 3:s.vertexAttrib3fv(ne.location,J);break;case 4:s.vertexAttrib4fv(ne.location,J);break;default:s.vertexAttrib1fv(ne.location,J)}}}}w()}function S(){W();for(const L in a){const k=a[L];for(const G in k){const $=k[G];for(const X in $)g($[X].object),delete $[X];delete k[G]}delete a[L]}}function b(L){if(a[L.id]===void 0)return;const k=a[L.id];for(const G in k){const $=k[G];for(const X in $)g($[X].object),delete $[X];delete k[G]}delete a[L.id]}function H(L){for(const k in a){const G=a[k];if(G[L.id]===void 0)continue;const $=G[L.id];for(const X in $)g($[X].object),delete $[X];delete G[L.id]}}function W(){se(),h=!0,l!==c&&(l=c,m(l.object))}function se(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:W,resetDefaultState:se,dispose:S,releaseStatesOfGeometry:b,releaseStatesOfProgram:H,initAttributes:y,enableAttribute:T,disableUnusedAttributes:w}}function kf(s,e,t,n){const i=n.isWebGL2;let r;function o(h){r=h}function a(h,u){s.drawArrays(r,h,u),t.update(u,r,1)}function c(h,u,d){if(d===0)return;let m,g;if(i)m=s,g="drawArraysInstanced";else if(m=e.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[g](r,h,u,d),t.update(u,r,d)}function l(h,u,d){if(d===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<d;g++)this.render(h[g],u[g]);else{m.multiDrawArraysWEBGL(r,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=u[_];t.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=l}function Bf(s,e,t){let n;function i(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");n=s.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(A){if(A==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let a=t.precision!==void 0?t.precision:"highp";const c=r(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);const l=o||e.has("WEBGL_draw_buffers"),h=t.logarithmicDepthBuffer===!0,u=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),d=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),_=s.getParameter(s.MAX_VERTEX_ATTRIBS),p=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),f=s.getParameter(s.MAX_VARYING_VECTORS),E=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),y=d>0,T=o||e.has("OES_texture_float"),P=y&&T,w=o?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:l,getMaxAnisotropy:i,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:m,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:p,maxVaryings:f,maxFragmentUniforms:E,vertexTextures:y,floatFragmentTextures:T,floatVertexTextures:P,maxSamples:w}}function zf(s){const e=this;let t=null,n=0,i=!1,r=!1;const o=new kn,a=new Ve,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const m=u.length!==0||d||n!==0||i;return i=d,n=u.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,m){const g=u.clippingPlanes,_=u.clipIntersection,p=u.clipShadows,f=s.get(u);if(!i||g===null||g.length===0||r&&!p)r?h(null):l();else{const E=r?0:n,y=E*4;let T=f.clippingState||null;c.value=T,T=h(g,d,y,m);for(let P=0;P!==y;++P)T[P]=t[P];f.clippingState=T,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=E}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,m,g){const _=u!==null?u.length:0;let p=null;if(_!==0){if(p=c.value,g!==!0||p===null){const f=m+_*4,E=d.matrixWorldInverse;a.getNormalMatrix(E),(p===null||p.length<f)&&(p=new Float32Array(f));for(let y=0,T=m;y!==_;++y,T+=4)o.copy(u[y]).applyMatrix4(E,a),o.normal.toArray(p,T),p[T+3]=o.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}function Hf(s){let e=new WeakMap;function t(o,a){return a===Nr?o.mapping=Mi:a===Fr&&(o.mapping=Ei),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Nr||a===Fr)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new Jh(c.height/2);return l.fromEquirectangularTexture(s,o),e.set(o,l),o.addEventListener("dispose",i),t(l.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class Cc extends Tc{constructor(e=-1,t=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=i+t,c=i-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const vi=4,pa=[.125,.215,.35,.446,.526,.582],Hn=20,Sr=new Cc,ma=new Ne;let Mr=null,Er=0,br=0;const Bn=(1+Math.sqrt(5))/2,fi=1/Bn,ga=[new R(1,1,1),new R(-1,1,1),new R(1,1,-1),new R(-1,1,-1),new R(0,Bn,fi),new R(0,Bn,-fi),new R(fi,0,Bn),new R(-fi,0,Bn),new R(Bn,fi,0),new R(-Bn,fi,0)];class _a{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){Mr=this._renderer.getRenderTarget(),Er=this._renderer.getActiveCubeFace(),br=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ya(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=xa(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Mr,Er,br),e.scissorTest=!1,gs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Mi||e.mapping===Ei?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Mr=this._renderer.getRenderTarget(),Er=this._renderer.getActiveCubeFace(),br=this._renderer.getActiveMipmapLevel();const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ut,minFilter:Ut,generateMipmaps:!1,type:Hi,format:en,colorSpace:mn,depthBuffer:!1},i=va(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=va(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Gf(r)),this._blurMaterial=Vf(r,e,t)}return i}_compileMaterial(e){const t=new $e(this._lodPlanes[0],e);this._renderer.compile(t,Sr)}_sceneToCubeUV(e,t,n,i){const a=new qt(90,1,t,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(ma),h.toneMapping=Cn,h.autoClear=!1;const m=new Yn({name:"PMREM.Background",side:At,depthWrite:!1,depthTest:!1}),g=new $e(new at,m);let _=!1;const p=e.background;p?p.isColor&&(m.color.copy(p),e.background=null,_=!0):(m.color.copy(ma),_=!0);for(let f=0;f<6;f++){const E=f%3;E===0?(a.up.set(0,c[f],0),a.lookAt(l[f],0,0)):E===1?(a.up.set(0,0,c[f]),a.lookAt(0,l[f],0)):(a.up.set(0,c[f],0),a.lookAt(0,0,l[f]));const y=this._cubeSize;gs(i,E*y,f>2?y:0,y,y),h.setRenderTarget(i),_&&h.render(g,a),h.render(e,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,e.background=p}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Mi||e.mapping===Ei;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=ya()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=xa());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new $e(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const c=this._cubeSize;gs(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,Sr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const r=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),o=ga[(i-1)%ga.length];this._blur(e,i-1,i,r,o)}t.autoClear=n}_blur(e,t,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",r),this._halfBlur(o,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new $e(this._lodPlanes[i],l),d=l.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Hn-1),_=r/g,p=isFinite(r)?1+Math.floor(h*_):Hn;p>Hn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Hn}`);const f=[];let E=0;for(let A=0;A<Hn;++A){const j=A/_,S=Math.exp(-j*j/2);f.push(S),A===0?E+=S:A<p&&(E+=2*S)}for(let A=0;A<f.length;A++)f[A]=f[A]/E;d.envMap.value=e.texture,d.samples.value=p,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:y}=this;d.dTheta.value=g,d.mipInt.value=y-n;const T=this._sizeLods[i],P=3*T*(i>y-vi?i-y+vi:0),w=4*(this._cubeSize-T);gs(t,P,w,3*T,2*T),c.setRenderTarget(t),c.render(u,Sr)}}function Gf(s){const e=[],t=[],n=[];let i=s;const r=s-vi+1+pa.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);t.push(a);let c=1/a;o>s-vi?c=pa[o-s+vi-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],m=6,g=6,_=3,p=2,f=1,E=new Float32Array(_*g*m),y=new Float32Array(p*g*m),T=new Float32Array(f*g*m);for(let w=0;w<m;w++){const A=w%3*2/3-1,j=w>2?0:-1,S=[A,j,0,A+2/3,j,0,A+2/3,j+1,0,A,j,0,A+2/3,j+1,0,A,j+1,0];E.set(S,_*g*w),y.set(d,p*g*w);const b=[w,w,w,w,w,w];T.set(b,f*g*w)}const P=new Dt;P.setAttribute("position",new Yt(E,_)),P.setAttribute("uv",new Yt(y,p)),P.setAttribute("faceIndex",new Yt(T,f)),e.push(P),i>vi&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function va(s,e,t){const n=new Kn(s,e,t);return n.texture.mapping=Hs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function gs(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Vf(s,e,t){const n=new Float32Array(Hn),i=new R(0,1,0);return new Zn({name:"SphericalGaussianBlur",defines:{n:Hn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:to(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function xa(){return new Zn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:to(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function ya(){return new Zn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:to(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function to(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Wf(s){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===Nr||c===Fr,h=c===Mi||c===Ei;if(l||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=e.get(a);return t===null&&(t=new _a(s)),u=l?t.fromEquirectangular(a,u):t.fromCubemap(a,u),e.set(a,u),u.texture}else{if(e.has(a))return e.get(a).texture;{const u=a.image;if(l&&u&&u.height>0||h&&u&&i(u)){t===null&&(t=new _a(s));const d=l?t.fromEquirectangular(a):t.fromCubemap(a);return e.set(a,d),a.addEventListener("dispose",r),d.texture}else return null}}}return a}function i(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Xf(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const i=t(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function qf(s,e,t,n){const i={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);for(const g in d.morphAttributes){const _=d.morphAttributes[g];for(let p=0,f=_.length;p<f;p++)e.remove(_[p])}d.removeEventListener("dispose",o),delete i[d.id];const m=r.get(d);m&&(e.remove(m),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,t.memory.geometries++),d}function c(u){const d=u.attributes;for(const g in d)e.update(d[g],s.ARRAY_BUFFER);const m=u.morphAttributes;for(const g in m){const _=m[g];for(let p=0,f=_.length;p<f;p++)e.update(_[p],s.ARRAY_BUFFER)}}function l(u){const d=[],m=u.index,g=u.attributes.position;let _=0;if(m!==null){const E=m.array;_=m.version;for(let y=0,T=E.length;y<T;y+=3){const P=E[y+0],w=E[y+1],A=E[y+2];d.push(P,w,w,A,A,P)}}else if(g!==void 0){const E=g.array;_=g.version;for(let y=0,T=E.length/3-1;y<T;y+=3){const P=y+0,w=y+1,A=y+2;d.push(P,w,w,A,A,P)}}else return;const p=new(_c(d)?Ec:Mc)(d,1);p.version=_;const f=r.get(u);f&&e.remove(f),r.set(u,p)}function h(u){const d=r.get(u);if(d){const m=u.index;m!==null&&d.version<m.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function $f(s,e,t,n){const i=n.isWebGL2;let r;function o(m){r=m}let a,c;function l(m){a=m.type,c=m.bytesPerElement}function h(m,g){s.drawElements(r,g,a,m*c),t.update(g,r,1)}function u(m,g,_){if(_===0)return;let p,f;if(i)p=s,f="drawElementsInstanced";else if(p=e.get("ANGLE_instanced_arrays"),f="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[f](r,g,a,m*c,_),t.update(g,r,_)}function d(m,g,_){if(_===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let f=0;f<_;f++)this.render(m[f]/c,g[f]);else{p.multiDrawElementsWEBGL(r,g,0,a,m,0,_);let f=0;for(let E=0;E<_;E++)f+=g[E];t.update(f,r,1)}}this.setMode=o,this.setIndex=l,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function Yf(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=a*(r/3);break;case s.LINES:t.lines+=a*(r/2);break;case s.LINE_STRIP:t.lines+=a*(r-1);break;case s.LINE_LOOP:t.lines+=a*r;break;case s.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function jf(s,e){return s[0]-e[0]}function Kf(s,e){return Math.abs(e[1])-Math.abs(s[1])}function Zf(s,e,t){const n={},i=new Float32Array(8),r=new WeakMap,o=new yt,a=[];for(let l=0;l<8;l++)a[l]=[l,0];function c(l,h,u){const d=l.morphTargetInfluences;if(e.isWebGL2===!0){const g=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,_=g!==void 0?g.length:0;let p=r.get(h);if(p===void 0||p.count!==_){let k=function(){se.dispose(),r.delete(h),h.removeEventListener("dispose",k)};var m=k;p!==void 0&&p.texture.dispose();const y=h.morphAttributes.position!==void 0,T=h.morphAttributes.normal!==void 0,P=h.morphAttributes.color!==void 0,w=h.morphAttributes.position||[],A=h.morphAttributes.normal||[],j=h.morphAttributes.color||[];let S=0;y===!0&&(S=1),T===!0&&(S=2),P===!0&&(S=3);let b=h.attributes.position.count*S,H=1;b>e.maxTextureSize&&(H=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const W=new Float32Array(b*H*4*_),se=new yc(W,b,H,_);se.type=Tn,se.needsUpdate=!0;const L=S*4;for(let G=0;G<_;G++){const $=w[G],X=A[G],q=j[G],K=b*H*4*G;for(let te=0;te<$.count;te++){const ne=te*L;y===!0&&(o.fromBufferAttribute($,te),W[K+ne+0]=o.x,W[K+ne+1]=o.y,W[K+ne+2]=o.z,W[K+ne+3]=0),T===!0&&(o.fromBufferAttribute(X,te),W[K+ne+4]=o.x,W[K+ne+5]=o.y,W[K+ne+6]=o.z,W[K+ne+7]=0),P===!0&&(o.fromBufferAttribute(q,te),W[K+ne+8]=o.x,W[K+ne+9]=o.y,W[K+ne+10]=o.z,W[K+ne+11]=q.itemSize===4?o.w:1)}}p={count:_,texture:se,size:new We(b,H)},r.set(h,p),h.addEventListener("dispose",k)}let f=0;for(let y=0;y<d.length;y++)f+=d[y];const E=h.morphTargetsRelative?1:1-f;u.getUniforms().setValue(s,"morphTargetBaseInfluence",E),u.getUniforms().setValue(s,"morphTargetInfluences",d),u.getUniforms().setValue(s,"morphTargetsTexture",p.texture,t),u.getUniforms().setValue(s,"morphTargetsTextureSize",p.size)}else{const g=d===void 0?0:d.length;let _=n[h.id];if(_===void 0||_.length!==g){_=[];for(let T=0;T<g;T++)_[T]=[T,0];n[h.id]=_}for(let T=0;T<g;T++){const P=_[T];P[0]=T,P[1]=d[T]}_.sort(Kf);for(let T=0;T<8;T++)T<g&&_[T][1]?(a[T][0]=_[T][0],a[T][1]=_[T][1]):(a[T][0]=Number.MAX_SAFE_INTEGER,a[T][1]=0);a.sort(jf);const p=h.morphAttributes.position,f=h.morphAttributes.normal;let E=0;for(let T=0;T<8;T++){const P=a[T],w=P[0],A=P[1];w!==Number.MAX_SAFE_INTEGER&&A?(p&&h.getAttribute("morphTarget"+T)!==p[w]&&h.setAttribute("morphTarget"+T,p[w]),f&&h.getAttribute("morphNormal"+T)!==f[w]&&h.setAttribute("morphNormal"+T,f[w]),i[T]=A,E+=A):(p&&h.hasAttribute("morphTarget"+T)===!0&&h.deleteAttribute("morphTarget"+T),f&&h.hasAttribute("morphNormal"+T)===!0&&h.deleteAttribute("morphNormal"+T),i[T]=0)}const y=h.morphTargetsRelative?1:1-E;u.getUniforms().setValue(s,"morphTargetBaseInfluence",y),u.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:c}}function Jf(s,e,t,n){let i=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,u=e.get(c,h);if(i.get(u)!==l&&(e.update(u),i.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),i.get(c)!==l&&(t.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,s.ARRAY_BUFFER),i.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;i.get(d)!==l&&(d.update(),i.set(d,l))}return u}function o(){i=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:o}}class Rc extends Ft{constructor(e,t,n,i,r,o,a,c,l,h){if(h=h!==void 0?h:qn,h!==qn&&h!==bi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===qn&&(n=bn),n===void 0&&h===bi&&(n=Xn),super(null,i,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:St,this.minFilter=c!==void 0?c:St,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Pc=new Ft,Lc=new Rc(1,1);Lc.compareFunction=gc;const Ic=new yc,Dc=new Nh,Uc=new wc,Sa=[],Ma=[],Ea=new Float32Array(16),ba=new Float32Array(9),Ta=new Float32Array(4);function Ai(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=Sa[i];if(r===void 0&&(r=new Float32Array(i),Sa[i]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,s[o].toArray(r,a)}return r}function mt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function gt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Xs(s,e){let t=Ma[e];t===void 0&&(t=new Int32Array(e),Ma[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function Qf(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function ep(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(mt(t,e))return;s.uniform2fv(this.addr,e),gt(t,e)}}function tp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(mt(t,e))return;s.uniform3fv(this.addr,e),gt(t,e)}}function np(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(mt(t,e))return;s.uniform4fv(this.addr,e),gt(t,e)}}function ip(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(mt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),gt(t,e)}else{if(mt(t,n))return;Ta.set(n),s.uniformMatrix2fv(this.addr,!1,Ta),gt(t,n)}}function sp(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(mt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),gt(t,e)}else{if(mt(t,n))return;ba.set(n),s.uniformMatrix3fv(this.addr,!1,ba),gt(t,n)}}function rp(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(mt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),gt(t,e)}else{if(mt(t,n))return;Ea.set(n),s.uniformMatrix4fv(this.addr,!1,Ea),gt(t,n)}}function op(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function ap(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(mt(t,e))return;s.uniform2iv(this.addr,e),gt(t,e)}}function cp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(mt(t,e))return;s.uniform3iv(this.addr,e),gt(t,e)}}function lp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(mt(t,e))return;s.uniform4iv(this.addr,e),gt(t,e)}}function hp(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function up(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(mt(t,e))return;s.uniform2uiv(this.addr,e),gt(t,e)}}function dp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(mt(t,e))return;s.uniform3uiv(this.addr,e),gt(t,e)}}function fp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(mt(t,e))return;s.uniform4uiv(this.addr,e),gt(t,e)}}function pp(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const r=this.type===s.SAMPLER_2D_SHADOW?Lc:Pc;t.setTexture2D(e||r,i)}function mp(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Dc,i)}function gp(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Uc,i)}function _p(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Ic,i)}function vp(s){switch(s){case 5126:return Qf;case 35664:return ep;case 35665:return tp;case 35666:return np;case 35674:return ip;case 35675:return sp;case 35676:return rp;case 5124:case 35670:return op;case 35667:case 35671:return ap;case 35668:case 35672:return cp;case 35669:case 35673:return lp;case 5125:return hp;case 36294:return up;case 36295:return dp;case 36296:return fp;case 35678:case 36198:case 36298:case 36306:case 35682:return pp;case 35679:case 36299:case 36307:return mp;case 35680:case 36300:case 36308:case 36293:return gp;case 36289:case 36303:case 36311:case 36292:return _p}}function xp(s,e){s.uniform1fv(this.addr,e)}function yp(s,e){const t=Ai(e,this.size,2);s.uniform2fv(this.addr,t)}function Sp(s,e){const t=Ai(e,this.size,3);s.uniform3fv(this.addr,t)}function Mp(s,e){const t=Ai(e,this.size,4);s.uniform4fv(this.addr,t)}function Ep(s,e){const t=Ai(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function bp(s,e){const t=Ai(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function Tp(s,e){const t=Ai(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function wp(s,e){s.uniform1iv(this.addr,e)}function Ap(s,e){s.uniform2iv(this.addr,e)}function Cp(s,e){s.uniform3iv(this.addr,e)}function Rp(s,e){s.uniform4iv(this.addr,e)}function Pp(s,e){s.uniform1uiv(this.addr,e)}function Lp(s,e){s.uniform2uiv(this.addr,e)}function Ip(s,e){s.uniform3uiv(this.addr,e)}function Dp(s,e){s.uniform4uiv(this.addr,e)}function Up(s,e,t){const n=this.cache,i=e.length,r=Xs(t,i);mt(n,r)||(s.uniform1iv(this.addr,r),gt(n,r));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||Pc,r[o])}function Np(s,e,t){const n=this.cache,i=e.length,r=Xs(t,i);mt(n,r)||(s.uniform1iv(this.addr,r),gt(n,r));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||Dc,r[o])}function Fp(s,e,t){const n=this.cache,i=e.length,r=Xs(t,i);mt(n,r)||(s.uniform1iv(this.addr,r),gt(n,r));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||Uc,r[o])}function Op(s,e,t){const n=this.cache,i=e.length,r=Xs(t,i);mt(n,r)||(s.uniform1iv(this.addr,r),gt(n,r));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||Ic,r[o])}function kp(s){switch(s){case 5126:return xp;case 35664:return yp;case 35665:return Sp;case 35666:return Mp;case 35674:return Ep;case 35675:return bp;case 35676:return Tp;case 5124:case 35670:return wp;case 35667:case 35671:return Ap;case 35668:case 35672:return Cp;case 35669:case 35673:return Rp;case 5125:return Pp;case 36294:return Lp;case 36295:return Ip;case 36296:return Dp;case 35678:case 36198:case 36298:case 36306:case 35682:return Up;case 35679:case 36299:case 36307:return Np;case 35680:case 36300:case 36308:case 36293:return Fp;case 36289:case 36303:case 36311:case 36292:return Op}}class Bp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=vp(t.type)}}class zp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=kp(t.type)}}class Hp{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(e,t[a.id],n)}}}const Tr=/(\w+)(\])?(\[|\.)?/g;function wa(s,e){s.seq.push(e),s.map[e.id]=e}function Gp(s,e,t){const n=s.name,i=n.length;for(Tr.lastIndex=0;;){const r=Tr.exec(n),o=Tr.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===i){wa(t,l===void 0?new Bp(a,s,e):new zp(a,s,e));break}else{let u=t.map[a];u===void 0&&(u=new Hp(a),wa(t,u)),t=u}}}class Ps{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),o=e.getUniformLocation(t,r.name);Gp(r,o,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,o=t.length;r!==o;++r){const a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const o=e[i];o.id in t&&n.push(o)}return n}}function Aa(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const Vp=37297;let Wp=0;function Xp(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function qp(s){const e=je.getPrimaries(je.workingColorSpace),t=je.getPrimaries(s);let n;switch(e===t?n="":e===Ns&&t===Us?n="LinearDisplayP3ToLinearSRGB":e===Us&&t===Ns&&(n="LinearSRGBToLinearDisplayP3"),s){case mn:case Gs:return[n,"LinearTransferOETF"];case Mt:case Jr:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function Ca(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+Xp(s.getShaderSource(e),o)}else return i}function $p(s,e){const t=qp(e);return`vec4 ${s}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Yp(s,e){let t;switch(e){case sh:t="Linear";break;case rh:t="Reinhard";break;case oh:t="OptimizedCineon";break;case ah:t="ACESFilmic";break;case lh:t="AgX";break;case ch:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function jp(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(xi).join(`
`)}function Kp(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(xi).join(`
`)}function Zp(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Jp(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:s.getAttribLocation(e,o),locationSize:a}}return t}function xi(s){return s!==""}function Ra(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Pa(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Qp=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gr(s){return s.replace(Qp,tm)}const em=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function tm(s,e){let t=ke[e];if(t===void 0){const n=em.get(e);if(n!==void 0)t=ke[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Gr(t)}const nm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function La(s){return s.replace(nm,im)}function im(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Ia(s){let e="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function sm(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===rc?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Il?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===dn&&(e="SHADOWMAP_TYPE_VSM"),e}function rm(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Mi:case Ei:e="ENVMAP_TYPE_CUBE";break;case Hs:e="ENVMAP_TYPE_CUBE_UV";break}return e}function om(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Ei:e="ENVMAP_MODE_REFRACTION";break}return e}function am(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Kr:e="ENVMAP_BLENDING_MULTIPLY";break;case nh:e="ENVMAP_BLENDING_MIX";break;case ih:e="ENVMAP_BLENDING_ADD";break}return e}function cm(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function lm(s,e,t,n){const i=s.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=sm(t),l=rm(t),h=om(t),u=am(t),d=cm(t),m=t.isWebGL2?"":jp(t),g=Kp(t),_=Zp(r),p=i.createProgram();let f,E,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(xi).join(`
`),f.length>0&&(f+=`
`),E=[m,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(xi).join(`
`),E.length>0&&(E+=`
`)):(f=[Ia(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xi).join(`
`),E=[m,Ia(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Cn?"#define TONE_MAPPING":"",t.toneMapping!==Cn?ke.tonemapping_pars_fragment:"",t.toneMapping!==Cn?Yp("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ke.colorspace_pars_fragment,$p("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(xi).join(`
`)),o=Gr(o),o=Ra(o,t),o=Pa(o,t),a=Gr(a),a=Ra(a,t),a=Pa(a,t),o=La(o),a=La(a),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,f=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,E=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===Ko?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ko?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+E);const T=y+f+o,P=y+E+a,w=Aa(i,i.VERTEX_SHADER,T),A=Aa(i,i.FRAGMENT_SHADER,P);i.attachShader(p,w),i.attachShader(p,A),t.index0AttributeName!==void 0?i.bindAttribLocation(p,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(p,0,"position"),i.linkProgram(p);function j(W){if(s.debug.checkShaderErrors){const se=i.getProgramInfoLog(p).trim(),L=i.getShaderInfoLog(w).trim(),k=i.getShaderInfoLog(A).trim();let G=!0,$=!0;if(i.getProgramParameter(p,i.LINK_STATUS)===!1)if(G=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,p,w,A);else{const X=Ca(i,w,"vertex"),q=Ca(i,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(p,i.VALIDATE_STATUS)+`

Program Info Log: `+se+`
`+X+`
`+q)}else se!==""?console.warn("THREE.WebGLProgram: Program Info Log:",se):(L===""||k==="")&&($=!1);$&&(W.diagnostics={runnable:G,programLog:se,vertexShader:{log:L,prefix:f},fragmentShader:{log:k,prefix:E}})}i.deleteShader(w),i.deleteShader(A),S=new Ps(i,p),b=Jp(i,p)}let S;this.getUniforms=function(){return S===void 0&&j(this),S};let b;this.getAttributes=function(){return b===void 0&&j(this),b};let H=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return H===!1&&(H=i.getProgramParameter(p,Vp)),H},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(p),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Wp++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=w,this.fragmentShader=A,this}let hm=0;class um{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new dm(e),t.set(e,n)),n}}class dm{constructor(e){this.id=hm++,this.code=e,this.usedTimes=0}}function fm(s,e,t,n,i,r,o){const a=new Qr,c=new um,l=[],h=i.isWebGL2,u=i.logarithmicDepthBuffer,d=i.vertexTextures;let m=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return S===0?"uv":`uv${S}`}function p(S,b,H,W,se){const L=W.fog,k=se.geometry,G=S.isMeshStandardMaterial?W.environment:null,$=(S.isMeshStandardMaterial?t:e).get(S.envMap||G),X=$&&$.mapping===Hs?$.image.height:null,q=g[S.type];S.precision!==null&&(m=i.getMaxPrecision(S.precision),m!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",m,"instead."));const K=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,te=K!==void 0?K.length:0;let ne=0;k.morphAttributes.position!==void 0&&(ne=1),k.morphAttributes.normal!==void 0&&(ne=2),k.morphAttributes.color!==void 0&&(ne=3);let z,J,ie,ge;if(q){const Ct=sn[q];z=Ct.vertexShader,J=Ct.fragmentShader}else z=S.vertexShader,J=S.fragmentShader,c.update(S),ie=c.getVertexShaderID(S),ge=c.getFragmentShaderID(S);const ve=s.getRenderTarget(),he=se.isInstancedMesh===!0,De=se.isBatchedMesh===!0,Te=!!S.map,Xe=!!S.matcap,U=!!$,st=!!S.aoMap,ye=!!S.lightMap,we=!!S.bumpMap,me=!!S.normalMap,qe=!!S.displacementMap,Se=!!S.emissiveMap,M=!!S.metalnessMap,v=!!S.roughnessMap,N=S.anisotropy>0,ee=S.clearcoat>0,Q=S.iridescence>0,Z=S.sheen>0,pe=S.transmission>0,ae=N&&!!S.anisotropyMap,de=ee&&!!S.clearcoatMap,Me=ee&&!!S.clearcoatNormalMap,Ae=ee&&!!S.clearcoatRoughnessMap,Y=Q&&!!S.iridescenceMap,Be=Q&&!!S.iridescenceThicknessMap,Le=Z&&!!S.sheenColorMap,Ee=Z&&!!S.sheenRoughnessMap,_e=!!S.specularMap,fe=!!S.specularColorMap,Oe=!!S.specularIntensityMap,Ye=pe&&!!S.transmissionMap,rt=pe&&!!S.thicknessMap,He=!!S.gradientMap,re=!!S.alphaMap,C=S.alphaTest>0,ce=!!S.alphaHash,le=!!S.extensions,Re=!!k.attributes.uv1,be=!!k.attributes.uv2,Ze=!!k.attributes.uv3;let Je=Cn;return S.toneMapped&&(ve===null||ve.isXRRenderTarget===!0)&&(Je=s.toneMapping),{isWebGL2:h,shaderID:q,shaderType:S.type,shaderName:S.name,vertexShader:z,fragmentShader:J,defines:S.defines,customVertexShaderID:ie,customFragmentShaderID:ge,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:m,batching:De,instancing:he,instancingColor:he&&se.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:ve===null?s.outputColorSpace:ve.isXRRenderTarget===!0?ve.texture.colorSpace:mn,map:Te,matcap:Xe,envMap:U,envMapMode:U&&$.mapping,envMapCubeUVHeight:X,aoMap:st,lightMap:ye,bumpMap:we,normalMap:me,displacementMap:d&&qe,emissiveMap:Se,normalMapObjectSpace:me&&S.normalMapType===Sh,normalMapTangentSpace:me&&S.normalMapType===mc,metalnessMap:M,roughnessMap:v,anisotropy:N,anisotropyMap:ae,clearcoat:ee,clearcoatMap:de,clearcoatNormalMap:Me,clearcoatRoughnessMap:Ae,iridescence:Q,iridescenceMap:Y,iridescenceThicknessMap:Be,sheen:Z,sheenColorMap:Le,sheenRoughnessMap:Ee,specularMap:_e,specularColorMap:fe,specularIntensityMap:Oe,transmission:pe,transmissionMap:Ye,thicknessMap:rt,gradientMap:He,opaque:S.transparent===!1&&S.blending===Wn,alphaMap:re,alphaTest:C,alphaHash:ce,combine:S.combine,mapUv:Te&&_(S.map.channel),aoMapUv:st&&_(S.aoMap.channel),lightMapUv:ye&&_(S.lightMap.channel),bumpMapUv:we&&_(S.bumpMap.channel),normalMapUv:me&&_(S.normalMap.channel),displacementMapUv:qe&&_(S.displacementMap.channel),emissiveMapUv:Se&&_(S.emissiveMap.channel),metalnessMapUv:M&&_(S.metalnessMap.channel),roughnessMapUv:v&&_(S.roughnessMap.channel),anisotropyMapUv:ae&&_(S.anisotropyMap.channel),clearcoatMapUv:de&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:Me&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ae&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:Y&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:Be&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:Le&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&_(S.sheenRoughnessMap.channel),specularMapUv:_e&&_(S.specularMap.channel),specularColorMapUv:fe&&_(S.specularColorMap.channel),specularIntensityMapUv:Oe&&_(S.specularIntensityMap.channel),transmissionMapUv:Ye&&_(S.transmissionMap.channel),thicknessMapUv:rt&&_(S.thicknessMap.channel),alphaMapUv:re&&_(S.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(me||N),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,vertexUv1s:Re,vertexUv2s:be,vertexUv3s:Ze,pointsUvs:se.isPoints===!0&&!!k.attributes.uv&&(Te||re),fog:!!L,useFog:S.fog===!0,fogExp2:L&&L.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:se.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:te,morphTextureStride:ne,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:s.shadowMap.enabled&&H.length>0,shadowMapType:s.shadowMap.type,toneMapping:Je,useLegacyLights:s._useLegacyLights,decodeVideoTexture:Te&&S.map.isVideoTexture===!0&&je.getTransfer(S.map.colorSpace)===et,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Jt,flipSided:S.side===At,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionDerivatives:le&&S.extensions.derivatives===!0,extensionFragDepth:le&&S.extensions.fragDepth===!0,extensionDrawBuffers:le&&S.extensions.drawBuffers===!0,extensionShaderTextureLOD:le&&S.extensions.shaderTextureLOD===!0,extensionClipCullDistance:le&&S.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()}}function f(S){const b=[];if(S.shaderID?b.push(S.shaderID):(b.push(S.customVertexShaderID),b.push(S.customFragmentShaderID)),S.defines!==void 0)for(const H in S.defines)b.push(H),b.push(S.defines[H]);return S.isRawShaderMaterial===!1&&(E(b,S),y(b,S),b.push(s.outputColorSpace)),b.push(S.customProgramCacheKey),b.join()}function E(S,b){S.push(b.precision),S.push(b.outputColorSpace),S.push(b.envMapMode),S.push(b.envMapCubeUVHeight),S.push(b.mapUv),S.push(b.alphaMapUv),S.push(b.lightMapUv),S.push(b.aoMapUv),S.push(b.bumpMapUv),S.push(b.normalMapUv),S.push(b.displacementMapUv),S.push(b.emissiveMapUv),S.push(b.metalnessMapUv),S.push(b.roughnessMapUv),S.push(b.anisotropyMapUv),S.push(b.clearcoatMapUv),S.push(b.clearcoatNormalMapUv),S.push(b.clearcoatRoughnessMapUv),S.push(b.iridescenceMapUv),S.push(b.iridescenceThicknessMapUv),S.push(b.sheenColorMapUv),S.push(b.sheenRoughnessMapUv),S.push(b.specularMapUv),S.push(b.specularColorMapUv),S.push(b.specularIntensityMapUv),S.push(b.transmissionMapUv),S.push(b.thicknessMapUv),S.push(b.combine),S.push(b.fogExp2),S.push(b.sizeAttenuation),S.push(b.morphTargetsCount),S.push(b.morphAttributeCount),S.push(b.numDirLights),S.push(b.numPointLights),S.push(b.numSpotLights),S.push(b.numSpotLightMaps),S.push(b.numHemiLights),S.push(b.numRectAreaLights),S.push(b.numDirLightShadows),S.push(b.numPointLightShadows),S.push(b.numSpotLightShadows),S.push(b.numSpotLightShadowsWithMaps),S.push(b.numLightProbes),S.push(b.shadowMapType),S.push(b.toneMapping),S.push(b.numClippingPlanes),S.push(b.numClipIntersection),S.push(b.depthPacking)}function y(S,b){a.disableAll(),b.isWebGL2&&a.enable(0),b.supportsVertexTextures&&a.enable(1),b.instancing&&a.enable(2),b.instancingColor&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),S.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.skinning&&a.enable(4),b.morphTargets&&a.enable(5),b.morphNormals&&a.enable(6),b.morphColors&&a.enable(7),b.premultipliedAlpha&&a.enable(8),b.shadowMapEnabled&&a.enable(9),b.useLegacyLights&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),S.push(a.mask)}function T(S){const b=g[S.type];let H;if(b){const W=sn[b];H=Yh.clone(W.uniforms)}else H=S.uniforms;return H}function P(S,b){let H;for(let W=0,se=l.length;W<se;W++){const L=l[W];if(L.cacheKey===b){H=L,++H.usedTimes;break}}return H===void 0&&(H=new lm(s,b,S,r),l.push(H)),H}function w(S){if(--S.usedTimes===0){const b=l.indexOf(S);l[b]=l[l.length-1],l.pop(),S.destroy()}}function A(S){c.remove(S)}function j(){c.dispose()}return{getParameters:p,getProgramCacheKey:f,getUniforms:T,acquireProgram:P,releaseProgram:w,releaseShaderCache:A,programs:l,dispose:j}}function pm(){let s=new WeakMap;function e(r){let o=s.get(r);return o===void 0&&(o={},s.set(r,o)),o}function t(r){s.delete(r)}function n(r,o,a){s.get(r)[o]=a}function i(){s=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function mm(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Da(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Ua(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function o(u,d,m,g,_,p){let f=s[e];return f===void 0?(f={id:u.id,object:u,geometry:d,material:m,groupOrder:g,renderOrder:u.renderOrder,z:_,group:p},s[e]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=m,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=_,f.group=p),e++,f}function a(u,d,m,g,_,p){const f=o(u,d,m,g,_,p);m.transmission>0?n.push(f):m.transparent===!0?i.push(f):t.push(f)}function c(u,d,m,g,_,p){const f=o(u,d,m,g,_,p);m.transmission>0?n.unshift(f):m.transparent===!0?i.unshift(f):t.unshift(f)}function l(u,d){t.length>1&&t.sort(u||mm),n.length>1&&n.sort(d||Da),i.length>1&&i.sort(d||Da)}function h(){for(let u=e,d=s.length;u<d;u++){const m=s[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:a,unshift:c,finish:h,sort:l}}function gm(){let s=new WeakMap;function e(n,i){const r=s.get(n);let o;return r===void 0?(o=new Ua,s.set(n,[o])):i>=r.length?(o=new Ua,r.push(o)):o=r[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function _m(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new R,color:new Ne};break;case"SpotLight":t={position:new R,direction:new R,color:new Ne,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new R,color:new Ne,distance:0,decay:0};break;case"HemisphereLight":t={direction:new R,skyColor:new Ne,groundColor:new Ne};break;case"RectAreaLight":t={color:new Ne,position:new R,halfWidth:new R,halfHeight:new R};break}return s[e.id]=t,t}}}function vm(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let xm=0;function ym(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Sm(s,e){const t=new _m,n=vm(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new R);const r=new R,o=new ct,a=new ct;function c(h,u){let d=0,m=0,g=0;for(let W=0;W<9;W++)i.probe[W].set(0,0,0);let _=0,p=0,f=0,E=0,y=0,T=0,P=0,w=0,A=0,j=0,S=0;h.sort(ym);const b=u===!0?Math.PI:1;for(let W=0,se=h.length;W<se;W++){const L=h[W],k=L.color,G=L.intensity,$=L.distance,X=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)d+=k.r*G*b,m+=k.g*G*b,g+=k.b*G*b;else if(L.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(L.sh.coefficients[q],G);S++}else if(L.isDirectionalLight){const q=t.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity*b),L.castShadow){const K=L.shadow,te=n.get(L);te.shadowBias=K.bias,te.shadowNormalBias=K.normalBias,te.shadowRadius=K.radius,te.shadowMapSize=K.mapSize,i.directionalShadow[_]=te,i.directionalShadowMap[_]=X,i.directionalShadowMatrix[_]=L.shadow.matrix,T++}i.directional[_]=q,_++}else if(L.isSpotLight){const q=t.get(L);q.position.setFromMatrixPosition(L.matrixWorld),q.color.copy(k).multiplyScalar(G*b),q.distance=$,q.coneCos=Math.cos(L.angle),q.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),q.decay=L.decay,i.spot[f]=q;const K=L.shadow;if(L.map&&(i.spotLightMap[A]=L.map,A++,K.updateMatrices(L),L.castShadow&&j++),i.spotLightMatrix[f]=K.matrix,L.castShadow){const te=n.get(L);te.shadowBias=K.bias,te.shadowNormalBias=K.normalBias,te.shadowRadius=K.radius,te.shadowMapSize=K.mapSize,i.spotShadow[f]=te,i.spotShadowMap[f]=X,w++}f++}else if(L.isRectAreaLight){const q=t.get(L);q.color.copy(k).multiplyScalar(G),q.halfWidth.set(L.width*.5,0,0),q.halfHeight.set(0,L.height*.5,0),i.rectArea[E]=q,E++}else if(L.isPointLight){const q=t.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity*b),q.distance=L.distance,q.decay=L.decay,L.castShadow){const K=L.shadow,te=n.get(L);te.shadowBias=K.bias,te.shadowNormalBias=K.normalBias,te.shadowRadius=K.radius,te.shadowMapSize=K.mapSize,te.shadowCameraNear=K.camera.near,te.shadowCameraFar=K.camera.far,i.pointShadow[p]=te,i.pointShadowMap[p]=X,i.pointShadowMatrix[p]=L.shadow.matrix,P++}i.point[p]=q,p++}else if(L.isHemisphereLight){const q=t.get(L);q.skyColor.copy(L.color).multiplyScalar(G*b),q.groundColor.copy(L.groundColor).multiplyScalar(G*b),i.hemi[y]=q,y++}}E>0&&(e.isWebGL2?s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=oe.LTC_FLOAT_1,i.rectAreaLTC2=oe.LTC_FLOAT_2):(i.rectAreaLTC1=oe.LTC_HALF_1,i.rectAreaLTC2=oe.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=oe.LTC_FLOAT_1,i.rectAreaLTC2=oe.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=oe.LTC_HALF_1,i.rectAreaLTC2=oe.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=d,i.ambient[1]=m,i.ambient[2]=g;const H=i.hash;(H.directionalLength!==_||H.pointLength!==p||H.spotLength!==f||H.rectAreaLength!==E||H.hemiLength!==y||H.numDirectionalShadows!==T||H.numPointShadows!==P||H.numSpotShadows!==w||H.numSpotMaps!==A||H.numLightProbes!==S)&&(i.directional.length=_,i.spot.length=f,i.rectArea.length=E,i.point.length=p,i.hemi.length=y,i.directionalShadow.length=T,i.directionalShadowMap.length=T,i.pointShadow.length=P,i.pointShadowMap.length=P,i.spotShadow.length=w,i.spotShadowMap.length=w,i.directionalShadowMatrix.length=T,i.pointShadowMatrix.length=P,i.spotLightMatrix.length=w+A-j,i.spotLightMap.length=A,i.numSpotLightShadowsWithMaps=j,i.numLightProbes=S,H.directionalLength=_,H.pointLength=p,H.spotLength=f,H.rectAreaLength=E,H.hemiLength=y,H.numDirectionalShadows=T,H.numPointShadows=P,H.numSpotShadows=w,H.numSpotMaps=A,H.numLightProbes=S,i.version=xm++)}function l(h,u){let d=0,m=0,g=0,_=0,p=0;const f=u.matrixWorldInverse;for(let E=0,y=h.length;E<y;E++){const T=h[E];if(T.isDirectionalLight){const P=i.directional[d];P.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),P.direction.sub(r),P.direction.transformDirection(f),d++}else if(T.isSpotLight){const P=i.spot[g];P.position.setFromMatrixPosition(T.matrixWorld),P.position.applyMatrix4(f),P.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),P.direction.sub(r),P.direction.transformDirection(f),g++}else if(T.isRectAreaLight){const P=i.rectArea[_];P.position.setFromMatrixPosition(T.matrixWorld),P.position.applyMatrix4(f),a.identity(),o.copy(T.matrixWorld),o.premultiply(f),a.extractRotation(o),P.halfWidth.set(T.width*.5,0,0),P.halfHeight.set(0,T.height*.5,0),P.halfWidth.applyMatrix4(a),P.halfHeight.applyMatrix4(a),_++}else if(T.isPointLight){const P=i.point[m];P.position.setFromMatrixPosition(T.matrixWorld),P.position.applyMatrix4(f),m++}else if(T.isHemisphereLight){const P=i.hemi[p];P.direction.setFromMatrixPosition(T.matrixWorld),P.direction.transformDirection(f),p++}}}return{setup:c,setupView:l,state:i}}function Na(s,e){const t=new Sm(s,e),n=[],i=[];function r(){n.length=0,i.length=0}function o(u){n.push(u)}function a(u){i.push(u)}function c(u){t.setup(n,u)}function l(u){t.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:i,lights:t},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function Mm(s,e){let t=new WeakMap;function n(r,o=0){const a=t.get(r);let c;return a===void 0?(c=new Na(s,e),t.set(r,[c])):o>=a.length?(c=new Na(s,e),a.push(c)):c=a[o],c}function i(){t=new WeakMap}return{get:n,dispose:i}}class Em extends gn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=xh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class bm extends gn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Tm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,wm=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Am(s,e,t){let n=new eo;const i=new We,r=new We,o=new yt,a=new Em({depthPacking:yh}),c=new bm,l={},h=t.maxTextureSize,u={[rn]:At,[At]:rn,[Jt]:Jt},d=new Zn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new We},radius:{value:4}},vertexShader:Tm,fragmentShader:wm}),m=d.clone();m.defines.HORIZONTAL_PASS=1;const g=new Dt;g.setAttribute("position",new Yt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new $e(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=rc;let f=this.type;this.render=function(w,A,j){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;const S=s.getRenderTarget(),b=s.getActiveCubeFace(),H=s.getActiveMipmapLevel(),W=s.state;W.setBlending(An),W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);const se=f!==dn&&this.type===dn,L=f===dn&&this.type!==dn;for(let k=0,G=w.length;k<G;k++){const $=w[k],X=$.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;i.copy(X.mapSize);const q=X.getFrameExtents();if(i.multiply(q),r.copy(X.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/q.x),i.x=r.x*q.x,X.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/q.y),i.y=r.y*q.y,X.mapSize.y=r.y)),X.map===null||se===!0||L===!0){const te=this.type!==dn?{minFilter:St,magFilter:St}:{};X.map!==null&&X.map.dispose(),X.map=new Kn(i.x,i.y,te),X.map.texture.name=$.name+".shadowMap",X.camera.updateProjectionMatrix()}s.setRenderTarget(X.map),s.clear();const K=X.getViewportCount();for(let te=0;te<K;te++){const ne=X.getViewport(te);o.set(r.x*ne.x,r.y*ne.y,r.x*ne.z,r.y*ne.w),W.viewport(o),X.updateMatrices($,te),n=X.getFrustum(),T(A,j,X.camera,$,this.type)}X.isPointLightShadow!==!0&&this.type===dn&&E(X,j),X.needsUpdate=!1}f=this.type,p.needsUpdate=!1,s.setRenderTarget(S,b,H)};function E(w,A){const j=e.update(_);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Kn(i.x,i.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,s.setRenderTarget(w.mapPass),s.clear(),s.renderBufferDirect(A,null,j,d,_,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,s.setRenderTarget(w.map),s.clear(),s.renderBufferDirect(A,null,j,m,_,null)}function y(w,A,j,S){let b=null;const H=j.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(H!==void 0)b=H;else if(b=j.isPointLight===!0?c:a,s.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const W=b.uuid,se=A.uuid;let L=l[W];L===void 0&&(L={},l[W]=L);let k=L[se];k===void 0&&(k=b.clone(),L[se]=k,A.addEventListener("dispose",P)),b=k}if(b.visible=A.visible,b.wireframe=A.wireframe,S===dn?b.side=A.shadowSide!==null?A.shadowSide:A.side:b.side=A.shadowSide!==null?A.shadowSide:u[A.side],b.alphaMap=A.alphaMap,b.alphaTest=A.alphaTest,b.map=A.map,b.clipShadows=A.clipShadows,b.clippingPlanes=A.clippingPlanes,b.clipIntersection=A.clipIntersection,b.displacementMap=A.displacementMap,b.displacementScale=A.displacementScale,b.displacementBias=A.displacementBias,b.wireframeLinewidth=A.wireframeLinewidth,b.linewidth=A.linewidth,j.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const W=s.properties.get(b);W.light=j}return b}function T(w,A,j,S,b){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&b===dn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,w.matrixWorld);const se=e.update(w),L=w.material;if(Array.isArray(L)){const k=se.groups;for(let G=0,$=k.length;G<$;G++){const X=k[G],q=L[X.materialIndex];if(q&&q.visible){const K=y(w,q,S,b);w.onBeforeShadow(s,w,A,j,se,K,X),s.renderBufferDirect(j,null,se,K,w,X),w.onAfterShadow(s,w,A,j,se,K,X)}}}else if(L.visible){const k=y(w,L,S,b);w.onBeforeShadow(s,w,A,j,se,k,null),s.renderBufferDirect(j,null,se,k,w,null),w.onAfterShadow(s,w,A,j,se,k,null)}}const W=w.children;for(let se=0,L=W.length;se<L;se++)T(W[se],A,j,S,b)}function P(w){w.target.removeEventListener("dispose",P);for(const j in l){const S=l[j],b=w.target.uuid;b in S&&(S[b].dispose(),delete S[b])}}}function Cm(s,e,t){const n=t.isWebGL2;function i(){let C=!1;const ce=new yt;let le=null;const Re=new yt(0,0,0,0);return{setMask:function(be){le!==be&&!C&&(s.colorMask(be,be,be,be),le=be)},setLocked:function(be){C=be},setClear:function(be,Ze,Je,_t,Ct){Ct===!0&&(be*=_t,Ze*=_t,Je*=_t),ce.set(be,Ze,Je,_t),Re.equals(ce)===!1&&(s.clearColor(be,Ze,Je,_t),Re.copy(ce))},reset:function(){C=!1,le=null,Re.set(-1,0,0,0)}}}function r(){let C=!1,ce=null,le=null,Re=null;return{setTest:function(be){be?De(s.DEPTH_TEST):Te(s.DEPTH_TEST)},setMask:function(be){ce!==be&&!C&&(s.depthMask(be),ce=be)},setFunc:function(be){if(le!==be){switch(be){case jl:s.depthFunc(s.NEVER);break;case Kl:s.depthFunc(s.ALWAYS);break;case Zl:s.depthFunc(s.LESS);break;case Is:s.depthFunc(s.LEQUAL);break;case Jl:s.depthFunc(s.EQUAL);break;case Ql:s.depthFunc(s.GEQUAL);break;case eh:s.depthFunc(s.GREATER);break;case th:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}le=be}},setLocked:function(be){C=be},setClear:function(be){Re!==be&&(s.clearDepth(be),Re=be)},reset:function(){C=!1,ce=null,le=null,Re=null}}}function o(){let C=!1,ce=null,le=null,Re=null,be=null,Ze=null,Je=null,_t=null,Ct=null;return{setTest:function(Qe){C||(Qe?De(s.STENCIL_TEST):Te(s.STENCIL_TEST))},setMask:function(Qe){ce!==Qe&&!C&&(s.stencilMask(Qe),ce=Qe)},setFunc:function(Qe,Rt,nn){(le!==Qe||Re!==Rt||be!==nn)&&(s.stencilFunc(Qe,Rt,nn),le=Qe,Re=Rt,be=nn)},setOp:function(Qe,Rt,nn){(Ze!==Qe||Je!==Rt||_t!==nn)&&(s.stencilOp(Qe,Rt,nn),Ze=Qe,Je=Rt,_t=nn)},setLocked:function(Qe){C=Qe},setClear:function(Qe){Ct!==Qe&&(s.clearStencil(Qe),Ct=Qe)},reset:function(){C=!1,ce=null,le=null,Re=null,be=null,Ze=null,Je=null,_t=null,Ct=null}}}const a=new i,c=new r,l=new o,h=new WeakMap,u=new WeakMap;let d={},m={},g=new WeakMap,_=[],p=null,f=!1,E=null,y=null,T=null,P=null,w=null,A=null,j=null,S=new Ne(0,0,0),b=0,H=!1,W=null,se=null,L=null,k=null,G=null;const $=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,q=0;const K=s.getParameter(s.VERSION);K.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(K)[1]),X=q>=1):K.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),X=q>=2);let te=null,ne={};const z=s.getParameter(s.SCISSOR_BOX),J=s.getParameter(s.VIEWPORT),ie=new yt().fromArray(z),ge=new yt().fromArray(J);function ve(C,ce,le,Re){const be=new Uint8Array(4),Ze=s.createTexture();s.bindTexture(C,Ze),s.texParameteri(C,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(C,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Je=0;Je<le;Je++)n&&(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)?s.texImage3D(ce,0,s.RGBA,1,1,Re,0,s.RGBA,s.UNSIGNED_BYTE,be):s.texImage2D(ce+Je,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,be);return Ze}const he={};he[s.TEXTURE_2D]=ve(s.TEXTURE_2D,s.TEXTURE_2D,1),he[s.TEXTURE_CUBE_MAP]=ve(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(he[s.TEXTURE_2D_ARRAY]=ve(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),he[s.TEXTURE_3D]=ve(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),c.setClear(1),l.setClear(0),De(s.DEPTH_TEST),c.setFunc(Is),Se(!1),M(_o),De(s.CULL_FACE),me(An);function De(C){d[C]!==!0&&(s.enable(C),d[C]=!0)}function Te(C){d[C]!==!1&&(s.disable(C),d[C]=!1)}function Xe(C,ce){return m[C]!==ce?(s.bindFramebuffer(C,ce),m[C]=ce,n&&(C===s.DRAW_FRAMEBUFFER&&(m[s.FRAMEBUFFER]=ce),C===s.FRAMEBUFFER&&(m[s.DRAW_FRAMEBUFFER]=ce)),!0):!1}function U(C,ce){let le=_,Re=!1;if(C)if(le=g.get(ce),le===void 0&&(le=[],g.set(ce,le)),C.isWebGLMultipleRenderTargets){const be=C.texture;if(le.length!==be.length||le[0]!==s.COLOR_ATTACHMENT0){for(let Ze=0,Je=be.length;Ze<Je;Ze++)le[Ze]=s.COLOR_ATTACHMENT0+Ze;le.length=be.length,Re=!0}}else le[0]!==s.COLOR_ATTACHMENT0&&(le[0]=s.COLOR_ATTACHMENT0,Re=!0);else le[0]!==s.BACK&&(le[0]=s.BACK,Re=!0);Re&&(t.isWebGL2?s.drawBuffers(le):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(le))}function st(C){return p!==C?(s.useProgram(C),p=C,!0):!1}const ye={[zn]:s.FUNC_ADD,[Ul]:s.FUNC_SUBTRACT,[Nl]:s.FUNC_REVERSE_SUBTRACT};if(n)ye[So]=s.MIN,ye[Mo]=s.MAX;else{const C=e.get("EXT_blend_minmax");C!==null&&(ye[So]=C.MIN_EXT,ye[Mo]=C.MAX_EXT)}const we={[Fl]:s.ZERO,[Ol]:s.ONE,[kl]:s.SRC_COLOR,[Dr]:s.SRC_ALPHA,[Wl]:s.SRC_ALPHA_SATURATE,[Gl]:s.DST_COLOR,[zl]:s.DST_ALPHA,[Bl]:s.ONE_MINUS_SRC_COLOR,[Ur]:s.ONE_MINUS_SRC_ALPHA,[Vl]:s.ONE_MINUS_DST_COLOR,[Hl]:s.ONE_MINUS_DST_ALPHA,[Xl]:s.CONSTANT_COLOR,[ql]:s.ONE_MINUS_CONSTANT_COLOR,[$l]:s.CONSTANT_ALPHA,[Yl]:s.ONE_MINUS_CONSTANT_ALPHA};function me(C,ce,le,Re,be,Ze,Je,_t,Ct,Qe){if(C===An){f===!0&&(Te(s.BLEND),f=!1);return}if(f===!1&&(De(s.BLEND),f=!0),C!==Dl){if(C!==E||Qe!==H){if((y!==zn||w!==zn)&&(s.blendEquation(s.FUNC_ADD),y=zn,w=zn),Qe)switch(C){case Wn:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case vo:s.blendFunc(s.ONE,s.ONE);break;case xo:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case yo:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}else switch(C){case Wn:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case vo:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case xo:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case yo:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}T=null,P=null,A=null,j=null,S.set(0,0,0),b=0,E=C,H=Qe}return}be=be||ce,Ze=Ze||le,Je=Je||Re,(ce!==y||be!==w)&&(s.blendEquationSeparate(ye[ce],ye[be]),y=ce,w=be),(le!==T||Re!==P||Ze!==A||Je!==j)&&(s.blendFuncSeparate(we[le],we[Re],we[Ze],we[Je]),T=le,P=Re,A=Ze,j=Je),(_t.equals(S)===!1||Ct!==b)&&(s.blendColor(_t.r,_t.g,_t.b,Ct),S.copy(_t),b=Ct),E=C,H=!1}function qe(C,ce){C.side===Jt?Te(s.CULL_FACE):De(s.CULL_FACE);let le=C.side===At;ce&&(le=!le),Se(le),C.blending===Wn&&C.transparent===!1?me(An):me(C.blending,C.blendEquation,C.blendSrc,C.blendDst,C.blendEquationAlpha,C.blendSrcAlpha,C.blendDstAlpha,C.blendColor,C.blendAlpha,C.premultipliedAlpha),c.setFunc(C.depthFunc),c.setTest(C.depthTest),c.setMask(C.depthWrite),a.setMask(C.colorWrite);const Re=C.stencilWrite;l.setTest(Re),Re&&(l.setMask(C.stencilWriteMask),l.setFunc(C.stencilFunc,C.stencilRef,C.stencilFuncMask),l.setOp(C.stencilFail,C.stencilZFail,C.stencilZPass)),N(C.polygonOffset,C.polygonOffsetFactor,C.polygonOffsetUnits),C.alphaToCoverage===!0?De(s.SAMPLE_ALPHA_TO_COVERAGE):Te(s.SAMPLE_ALPHA_TO_COVERAGE)}function Se(C){W!==C&&(C?s.frontFace(s.CW):s.frontFace(s.CCW),W=C)}function M(C){C!==Pl?(De(s.CULL_FACE),C!==se&&(C===_o?s.cullFace(s.BACK):C===Ll?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Te(s.CULL_FACE),se=C}function v(C){C!==L&&(X&&s.lineWidth(C),L=C)}function N(C,ce,le){C?(De(s.POLYGON_OFFSET_FILL),(k!==ce||G!==le)&&(s.polygonOffset(ce,le),k=ce,G=le)):Te(s.POLYGON_OFFSET_FILL)}function ee(C){C?De(s.SCISSOR_TEST):Te(s.SCISSOR_TEST)}function Q(C){C===void 0&&(C=s.TEXTURE0+$-1),te!==C&&(s.activeTexture(C),te=C)}function Z(C,ce,le){le===void 0&&(te===null?le=s.TEXTURE0+$-1:le=te);let Re=ne[le];Re===void 0&&(Re={type:void 0,texture:void 0},ne[le]=Re),(Re.type!==C||Re.texture!==ce)&&(te!==le&&(s.activeTexture(le),te=le),s.bindTexture(C,ce||he[C]),Re.type=C,Re.texture=ce)}function pe(){const C=ne[te];C!==void 0&&C.type!==void 0&&(s.bindTexture(C.type,null),C.type=void 0,C.texture=void 0)}function ae(){try{s.compressedTexImage2D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function de(){try{s.compressedTexImage3D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Me(){try{s.texSubImage2D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Ae(){try{s.texSubImage3D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Y(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Be(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Le(){try{s.texStorage2D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Ee(){try{s.texStorage3D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function _e(){try{s.texImage2D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function fe(){try{s.texImage3D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Oe(C){ie.equals(C)===!1&&(s.scissor(C.x,C.y,C.z,C.w),ie.copy(C))}function Ye(C){ge.equals(C)===!1&&(s.viewport(C.x,C.y,C.z,C.w),ge.copy(C))}function rt(C,ce){let le=u.get(ce);le===void 0&&(le=new WeakMap,u.set(ce,le));let Re=le.get(C);Re===void 0&&(Re=s.getUniformBlockIndex(ce,C.name),le.set(C,Re))}function He(C,ce){const Re=u.get(ce).get(C);h.get(ce)!==Re&&(s.uniformBlockBinding(ce,Re,C.__bindingPointIndex),h.set(ce,Re))}function re(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),n===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),d={},te=null,ne={},m={},g=new WeakMap,_=[],p=null,f=!1,E=null,y=null,T=null,P=null,w=null,A=null,j=null,S=new Ne(0,0,0),b=0,H=!1,W=null,se=null,L=null,k=null,G=null,ie.set(0,0,s.canvas.width,s.canvas.height),ge.set(0,0,s.canvas.width,s.canvas.height),a.reset(),c.reset(),l.reset()}return{buffers:{color:a,depth:c,stencil:l},enable:De,disable:Te,bindFramebuffer:Xe,drawBuffers:U,useProgram:st,setBlending:me,setMaterial:qe,setFlipSided:Se,setCullFace:M,setLineWidth:v,setPolygonOffset:N,setScissorTest:ee,activeTexture:Q,bindTexture:Z,unbindTexture:pe,compressedTexImage2D:ae,compressedTexImage3D:de,texImage2D:_e,texImage3D:fe,updateUBOMapping:rt,uniformBlockBinding:He,texStorage2D:Le,texStorage3D:Ee,texSubImage2D:Me,texSubImage3D:Ae,compressedTexSubImage2D:Y,compressedTexSubImage3D:Be,scissor:Oe,viewport:Ye,reset:re}}function Rm(s,e,t,n,i,r,o){const a=i.isWebGL2,c=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const d=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(M,v){return m?new OffscreenCanvas(M,v):Os("canvas")}function _(M,v,N,ee){let Q=1;if((M.width>ee||M.height>ee)&&(Q=ee/Math.max(M.width,M.height)),Q<1||v===!0)if(typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&M instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&M instanceof ImageBitmap){const Z=v?Hr:Math.floor,pe=Z(Q*M.width),ae=Z(Q*M.height);u===void 0&&(u=g(pe,ae));const de=N?g(pe,ae):u;return de.width=pe,de.height=ae,de.getContext("2d").drawImage(M,0,0,pe,ae),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+M.width+"x"+M.height+") to ("+pe+"x"+ae+")."),de}else return"data"in M&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+M.width+"x"+M.height+")."),M;return M}function p(M){return Zo(M.width)&&Zo(M.height)}function f(M){return a?!1:M.wrapS!==Qt||M.wrapT!==Qt||M.minFilter!==St&&M.minFilter!==Ut}function E(M,v){return M.generateMipmaps&&v&&M.minFilter!==St&&M.minFilter!==Ut}function y(M){s.generateMipmap(M)}function T(M,v,N,ee,Q=!1){if(a===!1)return v;if(M!==null){if(s[M]!==void 0)return s[M];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+M+"'")}let Z=v;if(v===s.RED&&(N===s.FLOAT&&(Z=s.R32F),N===s.HALF_FLOAT&&(Z=s.R16F),N===s.UNSIGNED_BYTE&&(Z=s.R8)),v===s.RED_INTEGER&&(N===s.UNSIGNED_BYTE&&(Z=s.R8UI),N===s.UNSIGNED_SHORT&&(Z=s.R16UI),N===s.UNSIGNED_INT&&(Z=s.R32UI),N===s.BYTE&&(Z=s.R8I),N===s.SHORT&&(Z=s.R16I),N===s.INT&&(Z=s.R32I)),v===s.RG&&(N===s.FLOAT&&(Z=s.RG32F),N===s.HALF_FLOAT&&(Z=s.RG16F),N===s.UNSIGNED_BYTE&&(Z=s.RG8)),v===s.RGBA){const pe=Q?Ds:je.getTransfer(ee);N===s.FLOAT&&(Z=s.RGBA32F),N===s.HALF_FLOAT&&(Z=s.RGBA16F),N===s.UNSIGNED_BYTE&&(Z=pe===et?s.SRGB8_ALPHA8:s.RGBA8),N===s.UNSIGNED_SHORT_4_4_4_4&&(Z=s.RGBA4),N===s.UNSIGNED_SHORT_5_5_5_1&&(Z=s.RGB5_A1)}return(Z===s.R16F||Z===s.R32F||Z===s.RG16F||Z===s.RG32F||Z===s.RGBA16F||Z===s.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function P(M,v,N){return E(M,N)===!0||M.isFramebufferTexture&&M.minFilter!==St&&M.minFilter!==Ut?Math.log2(Math.max(v.width,v.height))+1:M.mipmaps!==void 0&&M.mipmaps.length>0?M.mipmaps.length:M.isCompressedTexture&&Array.isArray(M.image)?v.mipmaps.length:1}function w(M){return M===St||M===Eo||M===Zs?s.NEAREST:s.LINEAR}function A(M){const v=M.target;v.removeEventListener("dispose",A),S(v),v.isVideoTexture&&h.delete(v)}function j(M){const v=M.target;v.removeEventListener("dispose",j),H(v)}function S(M){const v=n.get(M);if(v.__webglInit===void 0)return;const N=M.source,ee=d.get(N);if(ee){const Q=ee[v.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&b(M),Object.keys(ee).length===0&&d.delete(N)}n.remove(M)}function b(M){const v=n.get(M);s.deleteTexture(v.__webglTexture);const N=M.source,ee=d.get(N);delete ee[v.__cacheKey],o.memory.textures--}function H(M){const v=M.texture,N=n.get(M),ee=n.get(v);if(ee.__webglTexture!==void 0&&(s.deleteTexture(ee.__webglTexture),o.memory.textures--),M.depthTexture&&M.depthTexture.dispose(),M.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(N.__webglFramebuffer[Q]))for(let Z=0;Z<N.__webglFramebuffer[Q].length;Z++)s.deleteFramebuffer(N.__webglFramebuffer[Q][Z]);else s.deleteFramebuffer(N.__webglFramebuffer[Q]);N.__webglDepthbuffer&&s.deleteRenderbuffer(N.__webglDepthbuffer[Q])}else{if(Array.isArray(N.__webglFramebuffer))for(let Q=0;Q<N.__webglFramebuffer.length;Q++)s.deleteFramebuffer(N.__webglFramebuffer[Q]);else s.deleteFramebuffer(N.__webglFramebuffer);if(N.__webglDepthbuffer&&s.deleteRenderbuffer(N.__webglDepthbuffer),N.__webglMultisampledFramebuffer&&s.deleteFramebuffer(N.__webglMultisampledFramebuffer),N.__webglColorRenderbuffer)for(let Q=0;Q<N.__webglColorRenderbuffer.length;Q++)N.__webglColorRenderbuffer[Q]&&s.deleteRenderbuffer(N.__webglColorRenderbuffer[Q]);N.__webglDepthRenderbuffer&&s.deleteRenderbuffer(N.__webglDepthRenderbuffer)}if(M.isWebGLMultipleRenderTargets)for(let Q=0,Z=v.length;Q<Z;Q++){const pe=n.get(v[Q]);pe.__webglTexture&&(s.deleteTexture(pe.__webglTexture),o.memory.textures--),n.remove(v[Q])}n.remove(v),n.remove(M)}let W=0;function se(){W=0}function L(){const M=W;return M>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+M+" texture units while this GPU supports only "+i.maxTextures),W+=1,M}function k(M){const v=[];return v.push(M.wrapS),v.push(M.wrapT),v.push(M.wrapR||0),v.push(M.magFilter),v.push(M.minFilter),v.push(M.anisotropy),v.push(M.internalFormat),v.push(M.format),v.push(M.type),v.push(M.generateMipmaps),v.push(M.premultiplyAlpha),v.push(M.flipY),v.push(M.unpackAlignment),v.push(M.colorSpace),v.join()}function G(M,v){const N=n.get(M);if(M.isVideoTexture&&qe(M),M.isRenderTargetTexture===!1&&M.version>0&&N.__version!==M.version){const ee=M.image;if(ee===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ee.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ie(N,M,v);return}}t.bindTexture(s.TEXTURE_2D,N.__webglTexture,s.TEXTURE0+v)}function $(M,v){const N=n.get(M);if(M.version>0&&N.__version!==M.version){ie(N,M,v);return}t.bindTexture(s.TEXTURE_2D_ARRAY,N.__webglTexture,s.TEXTURE0+v)}function X(M,v){const N=n.get(M);if(M.version>0&&N.__version!==M.version){ie(N,M,v);return}t.bindTexture(s.TEXTURE_3D,N.__webglTexture,s.TEXTURE0+v)}function q(M,v){const N=n.get(M);if(M.version>0&&N.__version!==M.version){ge(N,M,v);return}t.bindTexture(s.TEXTURE_CUBE_MAP,N.__webglTexture,s.TEXTURE0+v)}const K={[Bi]:s.REPEAT,[Qt]:s.CLAMP_TO_EDGE,[Or]:s.MIRRORED_REPEAT},te={[St]:s.NEAREST,[Eo]:s.NEAREST_MIPMAP_NEAREST,[Zs]:s.NEAREST_MIPMAP_LINEAR,[Ut]:s.LINEAR,[hh]:s.LINEAR_MIPMAP_NEAREST,[zi]:s.LINEAR_MIPMAP_LINEAR},ne={[Mh]:s.NEVER,[Ch]:s.ALWAYS,[Eh]:s.LESS,[gc]:s.LEQUAL,[bh]:s.EQUAL,[Ah]:s.GEQUAL,[Th]:s.GREATER,[wh]:s.NOTEQUAL};function z(M,v,N){if(N?(s.texParameteri(M,s.TEXTURE_WRAP_S,K[v.wrapS]),s.texParameteri(M,s.TEXTURE_WRAP_T,K[v.wrapT]),(M===s.TEXTURE_3D||M===s.TEXTURE_2D_ARRAY)&&s.texParameteri(M,s.TEXTURE_WRAP_R,K[v.wrapR]),s.texParameteri(M,s.TEXTURE_MAG_FILTER,te[v.magFilter]),s.texParameteri(M,s.TEXTURE_MIN_FILTER,te[v.minFilter])):(s.texParameteri(M,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(M,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(M===s.TEXTURE_3D||M===s.TEXTURE_2D_ARRAY)&&s.texParameteri(M,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(v.wrapS!==Qt||v.wrapT!==Qt)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(M,s.TEXTURE_MAG_FILTER,w(v.magFilter)),s.texParameteri(M,s.TEXTURE_MIN_FILTER,w(v.minFilter)),v.minFilter!==St&&v.minFilter!==Ut&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),v.compareFunction&&(s.texParameteri(M,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(M,s.TEXTURE_COMPARE_FUNC,ne[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const ee=e.get("EXT_texture_filter_anisotropic");if(v.magFilter===St||v.minFilter!==Zs&&v.minFilter!==zi||v.type===Tn&&e.has("OES_texture_float_linear")===!1||a===!1&&v.type===Hi&&e.has("OES_texture_half_float_linear")===!1)return;(v.anisotropy>1||n.get(v).__currentAnisotropy)&&(s.texParameterf(M,ee.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,i.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy)}}function J(M,v){let N=!1;M.__webglInit===void 0&&(M.__webglInit=!0,v.addEventListener("dispose",A));const ee=v.source;let Q=d.get(ee);Q===void 0&&(Q={},d.set(ee,Q));const Z=k(v);if(Z!==M.__cacheKey){Q[Z]===void 0&&(Q[Z]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,N=!0),Q[Z].usedTimes++;const pe=Q[M.__cacheKey];pe!==void 0&&(Q[M.__cacheKey].usedTimes--,pe.usedTimes===0&&b(v)),M.__cacheKey=Z,M.__webglTexture=Q[Z].texture}return N}function ie(M,v,N){let ee=s.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(ee=s.TEXTURE_2D_ARRAY),v.isData3DTexture&&(ee=s.TEXTURE_3D);const Q=J(M,v),Z=v.source;t.bindTexture(ee,M.__webglTexture,s.TEXTURE0+N);const pe=n.get(Z);if(Z.version!==pe.__version||Q===!0){t.activeTexture(s.TEXTURE0+N);const ae=je.getPrimaries(je.workingColorSpace),de=v.colorSpace===$t?null:je.getPrimaries(v.colorSpace),Me=v.colorSpace===$t||ae===de?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Me);const Ae=f(v)&&p(v.image)===!1;let Y=_(v.image,Ae,!1,i.maxTextureSize);Y=Se(v,Y);const Be=p(Y)||a,Le=r.convert(v.format,v.colorSpace);let Ee=r.convert(v.type),_e=T(v.internalFormat,Le,Ee,v.colorSpace,v.isVideoTexture);z(ee,v,Be);let fe;const Oe=v.mipmaps,Ye=a&&v.isVideoTexture!==!0&&_e!==fc,rt=pe.__version===void 0||Q===!0,He=P(v,Y,Be);if(v.isDepthTexture)_e=s.DEPTH_COMPONENT,a?v.type===Tn?_e=s.DEPTH_COMPONENT32F:v.type===bn?_e=s.DEPTH_COMPONENT24:v.type===Xn?_e=s.DEPTH24_STENCIL8:_e=s.DEPTH_COMPONENT16:v.type===Tn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),v.format===qn&&_e===s.DEPTH_COMPONENT&&v.type!==Zr&&v.type!==bn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),v.type=bn,Ee=r.convert(v.type)),v.format===bi&&_e===s.DEPTH_COMPONENT&&(_e=s.DEPTH_STENCIL,v.type!==Xn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),v.type=Xn,Ee=r.convert(v.type))),rt&&(Ye?t.texStorage2D(s.TEXTURE_2D,1,_e,Y.width,Y.height):t.texImage2D(s.TEXTURE_2D,0,_e,Y.width,Y.height,0,Le,Ee,null));else if(v.isDataTexture)if(Oe.length>0&&Be){Ye&&rt&&t.texStorage2D(s.TEXTURE_2D,He,_e,Oe[0].width,Oe[0].height);for(let re=0,C=Oe.length;re<C;re++)fe=Oe[re],Ye?t.texSubImage2D(s.TEXTURE_2D,re,0,0,fe.width,fe.height,Le,Ee,fe.data):t.texImage2D(s.TEXTURE_2D,re,_e,fe.width,fe.height,0,Le,Ee,fe.data);v.generateMipmaps=!1}else Ye?(rt&&t.texStorage2D(s.TEXTURE_2D,He,_e,Y.width,Y.height),t.texSubImage2D(s.TEXTURE_2D,0,0,0,Y.width,Y.height,Le,Ee,Y.data)):t.texImage2D(s.TEXTURE_2D,0,_e,Y.width,Y.height,0,Le,Ee,Y.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Ye&&rt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,He,_e,Oe[0].width,Oe[0].height,Y.depth);for(let re=0,C=Oe.length;re<C;re++)fe=Oe[re],v.format!==en?Le!==null?Ye?t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,re,0,0,0,fe.width,fe.height,Y.depth,Le,fe.data,0,0):t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,re,_e,fe.width,fe.height,Y.depth,0,fe.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ye?t.texSubImage3D(s.TEXTURE_2D_ARRAY,re,0,0,0,fe.width,fe.height,Y.depth,Le,Ee,fe.data):t.texImage3D(s.TEXTURE_2D_ARRAY,re,_e,fe.width,fe.height,Y.depth,0,Le,Ee,fe.data)}else{Ye&&rt&&t.texStorage2D(s.TEXTURE_2D,He,_e,Oe[0].width,Oe[0].height);for(let re=0,C=Oe.length;re<C;re++)fe=Oe[re],v.format!==en?Le!==null?Ye?t.compressedTexSubImage2D(s.TEXTURE_2D,re,0,0,fe.width,fe.height,Le,fe.data):t.compressedTexImage2D(s.TEXTURE_2D,re,_e,fe.width,fe.height,0,fe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ye?t.texSubImage2D(s.TEXTURE_2D,re,0,0,fe.width,fe.height,Le,Ee,fe.data):t.texImage2D(s.TEXTURE_2D,re,_e,fe.width,fe.height,0,Le,Ee,fe.data)}else if(v.isDataArrayTexture)Ye?(rt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,He,_e,Y.width,Y.height,Y.depth),t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Y.width,Y.height,Y.depth,Le,Ee,Y.data)):t.texImage3D(s.TEXTURE_2D_ARRAY,0,_e,Y.width,Y.height,Y.depth,0,Le,Ee,Y.data);else if(v.isData3DTexture)Ye?(rt&&t.texStorage3D(s.TEXTURE_3D,He,_e,Y.width,Y.height,Y.depth),t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Y.width,Y.height,Y.depth,Le,Ee,Y.data)):t.texImage3D(s.TEXTURE_3D,0,_e,Y.width,Y.height,Y.depth,0,Le,Ee,Y.data);else if(v.isFramebufferTexture){if(rt)if(Ye)t.texStorage2D(s.TEXTURE_2D,He,_e,Y.width,Y.height);else{let re=Y.width,C=Y.height;for(let ce=0;ce<He;ce++)t.texImage2D(s.TEXTURE_2D,ce,_e,re,C,0,Le,Ee,null),re>>=1,C>>=1}}else if(Oe.length>0&&Be){Ye&&rt&&t.texStorage2D(s.TEXTURE_2D,He,_e,Oe[0].width,Oe[0].height);for(let re=0,C=Oe.length;re<C;re++)fe=Oe[re],Ye?t.texSubImage2D(s.TEXTURE_2D,re,0,0,Le,Ee,fe):t.texImage2D(s.TEXTURE_2D,re,_e,Le,Ee,fe);v.generateMipmaps=!1}else Ye?(rt&&t.texStorage2D(s.TEXTURE_2D,He,_e,Y.width,Y.height),t.texSubImage2D(s.TEXTURE_2D,0,0,0,Le,Ee,Y)):t.texImage2D(s.TEXTURE_2D,0,_e,Le,Ee,Y);E(v,Be)&&y(ee),pe.__version=Z.version,v.onUpdate&&v.onUpdate(v)}M.__version=v.version}function ge(M,v,N){if(v.image.length!==6)return;const ee=J(M,v),Q=v.source;t.bindTexture(s.TEXTURE_CUBE_MAP,M.__webglTexture,s.TEXTURE0+N);const Z=n.get(Q);if(Q.version!==Z.__version||ee===!0){t.activeTexture(s.TEXTURE0+N);const pe=je.getPrimaries(je.workingColorSpace),ae=v.colorSpace===$t?null:je.getPrimaries(v.colorSpace),de=v.colorSpace===$t||pe===ae?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,de);const Me=v.isCompressedTexture||v.image[0].isCompressedTexture,Ae=v.image[0]&&v.image[0].isDataTexture,Y=[];for(let re=0;re<6;re++)!Me&&!Ae?Y[re]=_(v.image[re],!1,!0,i.maxCubemapSize):Y[re]=Ae?v.image[re].image:v.image[re],Y[re]=Se(v,Y[re]);const Be=Y[0],Le=p(Be)||a,Ee=r.convert(v.format,v.colorSpace),_e=r.convert(v.type),fe=T(v.internalFormat,Ee,_e,v.colorSpace),Oe=a&&v.isVideoTexture!==!0,Ye=Z.__version===void 0||ee===!0;let rt=P(v,Be,Le);z(s.TEXTURE_CUBE_MAP,v,Le);let He;if(Me){Oe&&Ye&&t.texStorage2D(s.TEXTURE_CUBE_MAP,rt,fe,Be.width,Be.height);for(let re=0;re<6;re++){He=Y[re].mipmaps;for(let C=0;C<He.length;C++){const ce=He[C];v.format!==en?Ee!==null?Oe?t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,C,0,0,ce.width,ce.height,Ee,ce.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,C,fe,ce.width,ce.height,0,ce.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Oe?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,C,0,0,ce.width,ce.height,Ee,_e,ce.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,C,fe,ce.width,ce.height,0,Ee,_e,ce.data)}}}else{He=v.mipmaps,Oe&&Ye&&(He.length>0&&rt++,t.texStorage2D(s.TEXTURE_CUBE_MAP,rt,fe,Y[0].width,Y[0].height));for(let re=0;re<6;re++)if(Ae){Oe?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Y[re].width,Y[re].height,Ee,_e,Y[re].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,fe,Y[re].width,Y[re].height,0,Ee,_e,Y[re].data);for(let C=0;C<He.length;C++){const le=He[C].image[re].image;Oe?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,C+1,0,0,le.width,le.height,Ee,_e,le.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,C+1,fe,le.width,le.height,0,Ee,_e,le.data)}}else{Oe?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Ee,_e,Y[re]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,fe,Ee,_e,Y[re]);for(let C=0;C<He.length;C++){const ce=He[C];Oe?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,C+1,0,0,Ee,_e,ce.image[re]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,C+1,fe,Ee,_e,ce.image[re])}}}E(v,Le)&&y(s.TEXTURE_CUBE_MAP),Z.__version=Q.version,v.onUpdate&&v.onUpdate(v)}M.__version=v.version}function ve(M,v,N,ee,Q,Z){const pe=r.convert(N.format,N.colorSpace),ae=r.convert(N.type),de=T(N.internalFormat,pe,ae,N.colorSpace);if(!n.get(v).__hasExternalTextures){const Ae=Math.max(1,v.width>>Z),Y=Math.max(1,v.height>>Z);Q===s.TEXTURE_3D||Q===s.TEXTURE_2D_ARRAY?t.texImage3D(Q,Z,de,Ae,Y,v.depth,0,pe,ae,null):t.texImage2D(Q,Z,de,Ae,Y,0,pe,ae,null)}t.bindFramebuffer(s.FRAMEBUFFER,M),me(v)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ee,Q,n.get(N).__webglTexture,0,we(v)):(Q===s.TEXTURE_2D||Q>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,ee,Q,n.get(N).__webglTexture,Z),t.bindFramebuffer(s.FRAMEBUFFER,null)}function he(M,v,N){if(s.bindRenderbuffer(s.RENDERBUFFER,M),v.depthBuffer&&!v.stencilBuffer){let ee=a===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(N||me(v)){const Q=v.depthTexture;Q&&Q.isDepthTexture&&(Q.type===Tn?ee=s.DEPTH_COMPONENT32F:Q.type===bn&&(ee=s.DEPTH_COMPONENT24));const Z=we(v);me(v)?c.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Z,ee,v.width,v.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,Z,ee,v.width,v.height)}else s.renderbufferStorage(s.RENDERBUFFER,ee,v.width,v.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,M)}else if(v.depthBuffer&&v.stencilBuffer){const ee=we(v);N&&me(v)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,ee,s.DEPTH24_STENCIL8,v.width,v.height):me(v)?c.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ee,s.DEPTH24_STENCIL8,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,v.width,v.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,M)}else{const ee=v.isWebGLMultipleRenderTargets===!0?v.texture:[v.texture];for(let Q=0;Q<ee.length;Q++){const Z=ee[Q],pe=r.convert(Z.format,Z.colorSpace),ae=r.convert(Z.type),de=T(Z.internalFormat,pe,ae,Z.colorSpace),Me=we(v);N&&me(v)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Me,de,v.width,v.height):me(v)?c.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Me,de,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,de,v.width,v.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function De(M,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,M),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(v.depthTexture).__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),G(v.depthTexture,0);const ee=n.get(v.depthTexture).__webglTexture,Q=we(v);if(v.depthTexture.format===qn)me(v)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ee,0,Q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ee,0);else if(v.depthTexture.format===bi)me(v)?c.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ee,0,Q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function Te(M){const v=n.get(M),N=M.isWebGLCubeRenderTarget===!0;if(M.depthTexture&&!v.__autoAllocateDepthBuffer){if(N)throw new Error("target.depthTexture not supported in Cube render targets");De(v.__webglFramebuffer,M)}else if(N){v.__webglDepthbuffer=[];for(let ee=0;ee<6;ee++)t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[ee]),v.__webglDepthbuffer[ee]=s.createRenderbuffer(),he(v.__webglDepthbuffer[ee],M,!1)}else t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer=s.createRenderbuffer(),he(v.__webglDepthbuffer,M,!1);t.bindFramebuffer(s.FRAMEBUFFER,null)}function Xe(M,v,N){const ee=n.get(M);v!==void 0&&ve(ee.__webglFramebuffer,M,M.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),N!==void 0&&Te(M)}function U(M){const v=M.texture,N=n.get(M),ee=n.get(v);M.addEventListener("dispose",j),M.isWebGLMultipleRenderTargets!==!0&&(ee.__webglTexture===void 0&&(ee.__webglTexture=s.createTexture()),ee.__version=v.version,o.memory.textures++);const Q=M.isWebGLCubeRenderTarget===!0,Z=M.isWebGLMultipleRenderTargets===!0,pe=p(M)||a;if(Q){N.__webglFramebuffer=[];for(let ae=0;ae<6;ae++)if(a&&v.mipmaps&&v.mipmaps.length>0){N.__webglFramebuffer[ae]=[];for(let de=0;de<v.mipmaps.length;de++)N.__webglFramebuffer[ae][de]=s.createFramebuffer()}else N.__webglFramebuffer[ae]=s.createFramebuffer()}else{if(a&&v.mipmaps&&v.mipmaps.length>0){N.__webglFramebuffer=[];for(let ae=0;ae<v.mipmaps.length;ae++)N.__webglFramebuffer[ae]=s.createFramebuffer()}else N.__webglFramebuffer=s.createFramebuffer();if(Z)if(i.drawBuffers){const ae=M.texture;for(let de=0,Me=ae.length;de<Me;de++){const Ae=n.get(ae[de]);Ae.__webglTexture===void 0&&(Ae.__webglTexture=s.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&M.samples>0&&me(M)===!1){const ae=Z?v:[v];N.__webglMultisampledFramebuffer=s.createFramebuffer(),N.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let de=0;de<ae.length;de++){const Me=ae[de];N.__webglColorRenderbuffer[de]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,N.__webglColorRenderbuffer[de]);const Ae=r.convert(Me.format,Me.colorSpace),Y=r.convert(Me.type),Be=T(Me.internalFormat,Ae,Y,Me.colorSpace,M.isXRRenderTarget===!0),Le=we(M);s.renderbufferStorageMultisample(s.RENDERBUFFER,Le,Be,M.width,M.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+de,s.RENDERBUFFER,N.__webglColorRenderbuffer[de])}s.bindRenderbuffer(s.RENDERBUFFER,null),M.depthBuffer&&(N.__webglDepthRenderbuffer=s.createRenderbuffer(),he(N.__webglDepthRenderbuffer,M,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Q){t.bindTexture(s.TEXTURE_CUBE_MAP,ee.__webglTexture),z(s.TEXTURE_CUBE_MAP,v,pe);for(let ae=0;ae<6;ae++)if(a&&v.mipmaps&&v.mipmaps.length>0)for(let de=0;de<v.mipmaps.length;de++)ve(N.__webglFramebuffer[ae][de],M,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ae,de);else ve(N.__webglFramebuffer[ae],M,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0);E(v,pe)&&y(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Z){const ae=M.texture;for(let de=0,Me=ae.length;de<Me;de++){const Ae=ae[de],Y=n.get(Ae);t.bindTexture(s.TEXTURE_2D,Y.__webglTexture),z(s.TEXTURE_2D,Ae,pe),ve(N.__webglFramebuffer,M,Ae,s.COLOR_ATTACHMENT0+de,s.TEXTURE_2D,0),E(Ae,pe)&&y(s.TEXTURE_2D)}t.unbindTexture()}else{let ae=s.TEXTURE_2D;if((M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)&&(a?ae=M.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(ae,ee.__webglTexture),z(ae,v,pe),a&&v.mipmaps&&v.mipmaps.length>0)for(let de=0;de<v.mipmaps.length;de++)ve(N.__webglFramebuffer[de],M,v,s.COLOR_ATTACHMENT0,ae,de);else ve(N.__webglFramebuffer,M,v,s.COLOR_ATTACHMENT0,ae,0);E(v,pe)&&y(ae),t.unbindTexture()}M.depthBuffer&&Te(M)}function st(M){const v=p(M)||a,N=M.isWebGLMultipleRenderTargets===!0?M.texture:[M.texture];for(let ee=0,Q=N.length;ee<Q;ee++){const Z=N[ee];if(E(Z,v)){const pe=M.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,ae=n.get(Z).__webglTexture;t.bindTexture(pe,ae),y(pe),t.unbindTexture()}}}function ye(M){if(a&&M.samples>0&&me(M)===!1){const v=M.isWebGLMultipleRenderTargets?M.texture:[M.texture],N=M.width,ee=M.height;let Q=s.COLOR_BUFFER_BIT;const Z=[],pe=M.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ae=n.get(M),de=M.isWebGLMultipleRenderTargets===!0;if(de)for(let Me=0;Me<v.length;Me++)t.bindFramebuffer(s.FRAMEBUFFER,ae.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,ae.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,ae.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ae.__webglFramebuffer);for(let Me=0;Me<v.length;Me++){Z.push(s.COLOR_ATTACHMENT0+Me),M.depthBuffer&&Z.push(pe);const Ae=ae.__ignoreDepthValues!==void 0?ae.__ignoreDepthValues:!1;if(Ae===!1&&(M.depthBuffer&&(Q|=s.DEPTH_BUFFER_BIT),M.stencilBuffer&&(Q|=s.STENCIL_BUFFER_BIT)),de&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ae.__webglColorRenderbuffer[Me]),Ae===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[pe]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[pe])),de){const Y=n.get(v[Me]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Y,0)}s.blitFramebuffer(0,0,N,ee,0,0,N,ee,Q,s.NEAREST),l&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Z)}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),de)for(let Me=0;Me<v.length;Me++){t.bindFramebuffer(s.FRAMEBUFFER,ae.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.RENDERBUFFER,ae.__webglColorRenderbuffer[Me]);const Ae=n.get(v[Me]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,ae.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Me,s.TEXTURE_2D,Ae,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ae.__webglMultisampledFramebuffer)}}function we(M){return Math.min(i.maxSamples,M.samples)}function me(M){const v=n.get(M);return a&&M.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function qe(M){const v=o.render.frame;h.get(M)!==v&&(h.set(M,v),M.update())}function Se(M,v){const N=M.colorSpace,ee=M.format,Q=M.type;return M.isCompressedTexture===!0||M.isVideoTexture===!0||M.format===Br||N!==mn&&N!==$t&&(je.getTransfer(N)===et?a===!1?e.has("EXT_sRGB")===!0&&ee===en?(M.format=Br,M.minFilter=Ut,M.generateMipmaps=!1):v=vc.sRGBToLinear(v):(ee!==en||Q!==Rn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",N)),v}this.allocateTextureUnit=L,this.resetTextureUnits=se,this.setTexture2D=G,this.setTexture2DArray=$,this.setTexture3D=X,this.setTextureCube=q,this.rebindTextures=Xe,this.setupRenderTarget=U,this.updateRenderTargetMipmap=st,this.updateMultisampleRenderTarget=ye,this.setupDepthRenderbuffer=Te,this.setupFrameBufferTexture=ve,this.useMultisampledRTT=me}function Pm(s,e,t){const n=t.isWebGL2;function i(r,o=$t){let a;const c=je.getTransfer(o);if(r===Rn)return s.UNSIGNED_BYTE;if(r===cc)return s.UNSIGNED_SHORT_4_4_4_4;if(r===lc)return s.UNSIGNED_SHORT_5_5_5_1;if(r===uh)return s.BYTE;if(r===dh)return s.SHORT;if(r===Zr)return s.UNSIGNED_SHORT;if(r===ac)return s.INT;if(r===bn)return s.UNSIGNED_INT;if(r===Tn)return s.FLOAT;if(r===Hi)return n?s.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===fh)return s.ALPHA;if(r===en)return s.RGBA;if(r===ph)return s.LUMINANCE;if(r===mh)return s.LUMINANCE_ALPHA;if(r===qn)return s.DEPTH_COMPONENT;if(r===bi)return s.DEPTH_STENCIL;if(r===Br)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===gh)return s.RED;if(r===hc)return s.RED_INTEGER;if(r===_h)return s.RG;if(r===uc)return s.RG_INTEGER;if(r===dc)return s.RGBA_INTEGER;if(r===Js||r===Qs||r===er||r===tr)if(c===et)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===Js)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Qs)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===er)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===tr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Js)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Qs)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===er)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===tr)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===bo||r===To||r===wo||r===Ao)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===bo)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===To)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===wo)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Ao)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===fc)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Co||r===Ro)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(r===Co)return c===et?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===Ro)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Po||r===Lo||r===Io||r===Do||r===Uo||r===No||r===Fo||r===Oo||r===ko||r===Bo||r===zo||r===Ho||r===Go||r===Vo)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(r===Po)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Lo)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Io)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Do)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Uo)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===No)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Fo)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Oo)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===ko)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Bo)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===zo)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Ho)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Go)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Vo)return c===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===nr||r===Wo||r===Xo)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(r===nr)return c===et?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Wo)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Xo)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===vh||r===qo||r===$o||r===Yo)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(r===nr)return a.COMPRESSED_RED_RGTC1_EXT;if(r===qo)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===$o)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Yo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Xn?n?s.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):s[r]!==void 0?s[r]:null}return{convert:i}}class Lm extends qt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class wn extends pt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Im={type:"move"};class wr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new wn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new wn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new wn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(const _ of e.hand.values()){const p=t.getJointPose(_,n),f=this._getHandJoint(l,_);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),m=.02,g=.005;l.inputState.pinching&&d>m+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=m-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Im)))}return a!==null&&(a.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new wn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Dm extends wi{constructor(e,t){super();const n=this;let i=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,m=null,g=null;const _=t.getContextAttributes();let p=null,f=null;const E=[],y=[],T=new We;let P=null;const w=new qt;w.layers.enable(1),w.viewport=new yt;const A=new qt;A.layers.enable(2),A.viewport=new yt;const j=[w,A],S=new Lm;S.layers.enable(1),S.layers.enable(2);let b=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(z){let J=E[z];return J===void 0&&(J=new wr,E[z]=J),J.getTargetRaySpace()},this.getControllerGrip=function(z){let J=E[z];return J===void 0&&(J=new wr,E[z]=J),J.getGripSpace()},this.getHand=function(z){let J=E[z];return J===void 0&&(J=new wr,E[z]=J),J.getHandSpace()};function W(z){const J=y.indexOf(z.inputSource);if(J===-1)return;const ie=E[J];ie!==void 0&&(ie.update(z.inputSource,z.frame,l||o),ie.dispatchEvent({type:z.type,data:z.inputSource}))}function se(){i.removeEventListener("select",W),i.removeEventListener("selectstart",W),i.removeEventListener("selectend",W),i.removeEventListener("squeeze",W),i.removeEventListener("squeezestart",W),i.removeEventListener("squeezeend",W),i.removeEventListener("end",se),i.removeEventListener("inputsourceschange",L);for(let z=0;z<E.length;z++){const J=y[z];J!==null&&(y[z]=null,E[z].disconnect(J))}b=null,H=null,e.setRenderTarget(p),m=null,d=null,u=null,i=null,f=null,ne.stop(),n.isPresenting=!1,e.setPixelRatio(P),e.setSize(T.width,T.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(z){r=z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(z){a=z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(z){l=z},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(z){if(i=z,i!==null){if(p=e.getRenderTarget(),i.addEventListener("select",W),i.addEventListener("selectstart",W),i.addEventListener("selectend",W),i.addEventListener("squeeze",W),i.addEventListener("squeezestart",W),i.addEventListener("squeezeend",W),i.addEventListener("end",se),i.addEventListener("inputsourceschange",L),_.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(T),i.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const J={antialias:i.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(i,t,J),i.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),f=new Kn(m.framebufferWidth,m.framebufferHeight,{format:en,type:Rn,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil})}else{let J=null,ie=null,ge=null;_.depth&&(ge=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,J=_.stencil?bi:qn,ie=_.stencil?Xn:bn);const ve={colorFormat:t.RGBA8,depthFormat:ge,scaleFactor:r};u=new XRWebGLBinding(i,t),d=u.createProjectionLayer(ve),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),f=new Kn(d.textureWidth,d.textureHeight,{format:en,type:Rn,depthTexture:new Rc(d.textureWidth,d.textureHeight,ie,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0});const he=e.properties.get(f);he.__ignoreDepthValues=d.ignoreDepthValues}f.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await i.requestReferenceSpace(a),ne.setContext(i),ne.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function L(z){for(let J=0;J<z.removed.length;J++){const ie=z.removed[J],ge=y.indexOf(ie);ge>=0&&(y[ge]=null,E[ge].disconnect(ie))}for(let J=0;J<z.added.length;J++){const ie=z.added[J];let ge=y.indexOf(ie);if(ge===-1){for(let he=0;he<E.length;he++)if(he>=y.length){y.push(ie),ge=he;break}else if(y[he]===null){y[he]=ie,ge=he;break}if(ge===-1)break}const ve=E[ge];ve&&ve.connect(ie)}}const k=new R,G=new R;function $(z,J,ie){k.setFromMatrixPosition(J.matrixWorld),G.setFromMatrixPosition(ie.matrixWorld);const ge=k.distanceTo(G),ve=J.projectionMatrix.elements,he=ie.projectionMatrix.elements,De=ve[14]/(ve[10]-1),Te=ve[14]/(ve[10]+1),Xe=(ve[9]+1)/ve[5],U=(ve[9]-1)/ve[5],st=(ve[8]-1)/ve[0],ye=(he[8]+1)/he[0],we=De*st,me=De*ye,qe=ge/(-st+ye),Se=qe*-st;J.matrixWorld.decompose(z.position,z.quaternion,z.scale),z.translateX(Se),z.translateZ(qe),z.matrixWorld.compose(z.position,z.quaternion,z.scale),z.matrixWorldInverse.copy(z.matrixWorld).invert();const M=De+qe,v=Te+qe,N=we-Se,ee=me+(ge-Se),Q=Xe*Te/v*M,Z=U*Te/v*M;z.projectionMatrix.makePerspective(N,ee,Q,Z,M,v),z.projectionMatrixInverse.copy(z.projectionMatrix).invert()}function X(z,J){J===null?z.matrixWorld.copy(z.matrix):z.matrixWorld.multiplyMatrices(J.matrixWorld,z.matrix),z.matrixWorldInverse.copy(z.matrixWorld).invert()}this.updateCamera=function(z){if(i===null)return;S.near=A.near=w.near=z.near,S.far=A.far=w.far=z.far,(b!==S.near||H!==S.far)&&(i.updateRenderState({depthNear:S.near,depthFar:S.far}),b=S.near,H=S.far);const J=z.parent,ie=S.cameras;X(S,J);for(let ge=0;ge<ie.length;ge++)X(ie[ge],J);ie.length===2?$(S,w,A):S.projectionMatrix.copy(w.projectionMatrix),q(z,S,J)};function q(z,J,ie){ie===null?z.matrix.copy(J.matrixWorld):(z.matrix.copy(ie.matrixWorld),z.matrix.invert(),z.matrix.multiply(J.matrixWorld)),z.matrix.decompose(z.position,z.quaternion,z.scale),z.updateMatrixWorld(!0),z.projectionMatrix.copy(J.projectionMatrix),z.projectionMatrixInverse.copy(J.projectionMatrixInverse),z.isPerspectiveCamera&&(z.fov=zr*2*Math.atan(1/z.projectionMatrix.elements[5]),z.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(d===null&&m===null))return c},this.setFoveation=function(z){c=z,d!==null&&(d.fixedFoveation=z),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=z)};let K=null;function te(z,J){if(h=J.getViewerPose(l||o),g=J,h!==null){const ie=h.views;m!==null&&(e.setRenderTargetFramebuffer(f,m.framebuffer),e.setRenderTarget(f));let ge=!1;ie.length!==S.cameras.length&&(S.cameras.length=0,ge=!0);for(let ve=0;ve<ie.length;ve++){const he=ie[ve];let De=null;if(m!==null)De=m.getViewport(he);else{const Xe=u.getViewSubImage(d,he);De=Xe.viewport,ve===0&&(e.setRenderTargetTextures(f,Xe.colorTexture,d.ignoreDepthValues?void 0:Xe.depthStencilTexture),e.setRenderTarget(f))}let Te=j[ve];Te===void 0&&(Te=new qt,Te.layers.enable(ve),Te.viewport=new yt,j[ve]=Te),Te.matrix.fromArray(he.transform.matrix),Te.matrix.decompose(Te.position,Te.quaternion,Te.scale),Te.projectionMatrix.fromArray(he.projectionMatrix),Te.projectionMatrixInverse.copy(Te.projectionMatrix).invert(),Te.viewport.set(De.x,De.y,De.width,De.height),ve===0&&(S.matrix.copy(Te.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),ge===!0&&S.cameras.push(Te)}}for(let ie=0;ie<E.length;ie++){const ge=y[ie],ve=E[ie];ge!==null&&ve!==void 0&&ve.update(ge,J,l||o)}K&&K(z,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),g=null}const ne=new Ac;ne.setAnimationLoop(te),this.setAnimationLoop=function(z){K=z},this.dispose=function(){}}}function Um(s,e){function t(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function n(p,f){f.color.getRGB(p.fogColor.value,bc(s)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function i(p,f,E,y,T){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(p,f):f.isMeshToonMaterial?(r(p,f),u(p,f)):f.isMeshPhongMaterial?(r(p,f),h(p,f)):f.isMeshStandardMaterial?(r(p,f),d(p,f),f.isMeshPhysicalMaterial&&m(p,f,T)):f.isMeshMatcapMaterial?(r(p,f),g(p,f)):f.isMeshDepthMaterial?r(p,f):f.isMeshDistanceMaterial?(r(p,f),_(p,f)):f.isMeshNormalMaterial?r(p,f):f.isLineBasicMaterial?(o(p,f),f.isLineDashedMaterial&&a(p,f)):f.isPointsMaterial?c(p,f,E,y):f.isSpriteMaterial?l(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,t(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===At&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,t(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===At&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,t(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,t(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);const E=e.get(f).envMap;if(E&&(p.envMap.value=E,p.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap){p.lightMap.value=f.lightMap;const y=s._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=f.lightMapIntensity*y,t(f.lightMap,p.lightMapTransform)}f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,p.aoMapTransform))}function o(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform))}function a(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function c(p,f,E,y){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*E,p.scale.value=y*.5,f.map&&(p.map.value=f.map,t(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function l(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function h(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function u(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function d(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,p.roughnessMapTransform)),e.get(f).envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function m(p,f,E){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===At&&p.clearcoatNormalScale.value.negate())),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=E.texture,p.transmissionSamplerSize.value.set(E.width,E.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,f){f.matcap&&(p.matcap.value=f.matcap)}function _(p,f){const E=e.get(f).light;p.referencePosition.value.setFromMatrixPosition(E.matrixWorld),p.nearDistance.value=E.shadow.camera.near,p.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Nm(s,e,t,n){let i={},r={},o=[];const a=t.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(E,y){const T=y.program;n.uniformBlockBinding(E,T)}function l(E,y){let T=i[E.id];T===void 0&&(g(E),T=h(E),i[E.id]=T,E.addEventListener("dispose",p));const P=y.program;n.updateUBOMapping(E,P);const w=e.render.frame;r[E.id]!==w&&(d(E),r[E.id]=w)}function h(E){const y=u();E.__bindingPointIndex=y;const T=s.createBuffer(),P=E.__size,w=E.usage;return s.bindBuffer(s.UNIFORM_BUFFER,T),s.bufferData(s.UNIFORM_BUFFER,P,w),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,y,T),T}function u(){for(let E=0;E<a;E++)if(o.indexOf(E)===-1)return o.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(E){const y=i[E.id],T=E.uniforms,P=E.__cache;s.bindBuffer(s.UNIFORM_BUFFER,y);for(let w=0,A=T.length;w<A;w++){const j=Array.isArray(T[w])?T[w]:[T[w]];for(let S=0,b=j.length;S<b;S++){const H=j[S];if(m(H,w,S,P)===!0){const W=H.__offset,se=Array.isArray(H.value)?H.value:[H.value];let L=0;for(let k=0;k<se.length;k++){const G=se[k],$=_(G);typeof G=="number"||typeof G=="boolean"?(H.__data[0]=G,s.bufferSubData(s.UNIFORM_BUFFER,W+L,H.__data)):G.isMatrix3?(H.__data[0]=G.elements[0],H.__data[1]=G.elements[1],H.__data[2]=G.elements[2],H.__data[3]=0,H.__data[4]=G.elements[3],H.__data[5]=G.elements[4],H.__data[6]=G.elements[5],H.__data[7]=0,H.__data[8]=G.elements[6],H.__data[9]=G.elements[7],H.__data[10]=G.elements[8],H.__data[11]=0):(G.toArray(H.__data,L),L+=$.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,W,H.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function m(E,y,T,P){const w=E.value,A=y+"_"+T;if(P[A]===void 0)return typeof w=="number"||typeof w=="boolean"?P[A]=w:P[A]=w.clone(),!0;{const j=P[A];if(typeof w=="number"||typeof w=="boolean"){if(j!==w)return P[A]=w,!0}else if(j.equals(w)===!1)return j.copy(w),!0}return!1}function g(E){const y=E.uniforms;let T=0;const P=16;for(let A=0,j=y.length;A<j;A++){const S=Array.isArray(y[A])?y[A]:[y[A]];for(let b=0,H=S.length;b<H;b++){const W=S[b],se=Array.isArray(W.value)?W.value:[W.value];for(let L=0,k=se.length;L<k;L++){const G=se[L],$=_(G),X=T%P;X!==0&&P-X<$.boundary&&(T+=P-X),W.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=T,T+=$.storage}}}const w=T%P;return w>0&&(T+=P-w),E.__size=T,E.__cache={},this}function _(E){const y={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(y.boundary=4,y.storage=4):E.isVector2?(y.boundary=8,y.storage=8):E.isVector3||E.isColor?(y.boundary=16,y.storage=12):E.isVector4?(y.boundary=16,y.storage=16):E.isMatrix3?(y.boundary=48,y.storage=48):E.isMatrix4?(y.boundary=64,y.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),y}function p(E){const y=E.target;y.removeEventListener("dispose",p);const T=o.indexOf(y.__bindingPointIndex);o.splice(T,1),s.deleteBuffer(i[y.id]),delete i[y.id],delete r[y.id]}function f(){for(const E in i)s.deleteBuffer(i[E]);o=[],i={},r={}}return{bind:c,update:l,dispose:f}}class Nc{constructor(e={}){const{canvas:t=Ph(),context:n=null,depth:i=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=o;const m=new Uint32Array(4),g=new Int32Array(4);let _=null,p=null;const f=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Mt,this._useLegacyLights=!1,this.toneMapping=Cn,this.toneMappingExposure=1;const y=this;let T=!1,P=0,w=0,A=null,j=-1,S=null;const b=new yt,H=new yt;let W=null;const se=new Ne(0);let L=0,k=t.width,G=t.height,$=1,X=null,q=null;const K=new yt(0,0,k,G),te=new yt(0,0,k,G);let ne=!1;const z=new eo;let J=!1,ie=!1,ge=null;const ve=new ct,he=new We,De=new R,Te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Xe(){return A===null?$:1}let U=n;function st(x,I){for(let O=0;O<x.length;O++){const B=x[O],F=t.getContext(B,I);if(F!==null)return F}return null}try{const x={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${jr}`),t.addEventListener("webglcontextlost",re,!1),t.addEventListener("webglcontextrestored",C,!1),t.addEventListener("webglcontextcreationerror",ce,!1),U===null){const I=["webgl2","webgl","experimental-webgl"];if(y.isWebGL1Renderer===!0&&I.shift(),U=st(I,x),U===null)throw st(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&U instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),U.getShaderPrecisionFormat===void 0&&(U.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(x){throw console.error("THREE.WebGLRenderer: "+x.message),x}let ye,we,me,qe,Se,M,v,N,ee,Q,Z,pe,ae,de,Me,Ae,Y,Be,Le,Ee,_e,fe,Oe,Ye;function rt(){ye=new Xf(U),we=new Bf(U,ye,e),ye.init(we),fe=new Pm(U,ye,we),me=new Cm(U,ye,we),qe=new Yf(U),Se=new pm,M=new Rm(U,ye,me,Se,we,fe,qe),v=new Hf(y),N=new Wf(y),ee=new tu(U,we),Oe=new Of(U,ye,ee,we),Q=new qf(U,ee,qe,Oe),Z=new Jf(U,Q,ee,qe),Le=new Zf(U,we,M),Ae=new zf(Se),pe=new fm(y,v,N,ye,we,Oe,Ae),ae=new Um(y,Se),de=new gm,Me=new Mm(ye,we),Be=new Ff(y,v,N,me,Z,d,c),Y=new Am(y,Z,we),Ye=new Nm(U,qe,we,me),Ee=new kf(U,ye,qe,we),_e=new $f(U,ye,qe,we),qe.programs=pe.programs,y.capabilities=we,y.extensions=ye,y.properties=Se,y.renderLists=de,y.shadowMap=Y,y.state=me,y.info=qe}rt();const He=new Dm(y,U);this.xr=He,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const x=ye.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){const x=ye.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(x){x!==void 0&&($=x,this.setSize(k,G,!1))},this.getSize=function(x){return x.set(k,G)},this.setSize=function(x,I,O=!0){if(He.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=x,G=I,t.width=Math.floor(x*$),t.height=Math.floor(I*$),O===!0&&(t.style.width=x+"px",t.style.height=I+"px"),this.setViewport(0,0,x,I)},this.getDrawingBufferSize=function(x){return x.set(k*$,G*$).floor()},this.setDrawingBufferSize=function(x,I,O){k=x,G=I,$=O,t.width=Math.floor(x*O),t.height=Math.floor(I*O),this.setViewport(0,0,x,I)},this.getCurrentViewport=function(x){return x.copy(b)},this.getViewport=function(x){return x.copy(K)},this.setViewport=function(x,I,O,B){x.isVector4?K.set(x.x,x.y,x.z,x.w):K.set(x,I,O,B),me.viewport(b.copy(K).multiplyScalar($).floor())},this.getScissor=function(x){return x.copy(te)},this.setScissor=function(x,I,O,B){x.isVector4?te.set(x.x,x.y,x.z,x.w):te.set(x,I,O,B),me.scissor(H.copy(te).multiplyScalar($).floor())},this.getScissorTest=function(){return ne},this.setScissorTest=function(x){me.setScissorTest(ne=x)},this.setOpaqueSort=function(x){X=x},this.setTransparentSort=function(x){q=x},this.getClearColor=function(x){return x.copy(Be.getClearColor())},this.setClearColor=function(){Be.setClearColor.apply(Be,arguments)},this.getClearAlpha=function(){return Be.getClearAlpha()},this.setClearAlpha=function(){Be.setClearAlpha.apply(Be,arguments)},this.clear=function(x=!0,I=!0,O=!0){let B=0;if(x){let F=!1;if(A!==null){const ue=A.texture.format;F=ue===dc||ue===uc||ue===hc}if(F){const ue=A.texture.type,xe=ue===Rn||ue===bn||ue===Zr||ue===Xn||ue===cc||ue===lc,Ce=Be.getClearColor(),Pe=Be.getClearAlpha(),ze=Ce.r,Ue=Ce.g,Fe=Ce.b;xe?(m[0]=ze,m[1]=Ue,m[2]=Fe,m[3]=Pe,U.clearBufferuiv(U.COLOR,0,m)):(g[0]=ze,g[1]=Ue,g[2]=Fe,g[3]=Pe,U.clearBufferiv(U.COLOR,0,g))}else B|=U.COLOR_BUFFER_BIT}I&&(B|=U.DEPTH_BUFFER_BIT),O&&(B|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",re,!1),t.removeEventListener("webglcontextrestored",C,!1),t.removeEventListener("webglcontextcreationerror",ce,!1),de.dispose(),Me.dispose(),Se.dispose(),v.dispose(),N.dispose(),Z.dispose(),Oe.dispose(),Ye.dispose(),pe.dispose(),He.dispose(),He.removeEventListener("sessionstart",Ct),He.removeEventListener("sessionend",Qe),ge&&(ge.dispose(),ge=null),Rt.stop()};function re(x){x.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function C(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;const x=qe.autoReset,I=Y.enabled,O=Y.autoUpdate,B=Y.needsUpdate,F=Y.type;rt(),qe.autoReset=x,Y.enabled=I,Y.autoUpdate=O,Y.needsUpdate=B,Y.type=F}function ce(x){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function le(x){const I=x.target;I.removeEventListener("dispose",le),Re(I)}function Re(x){be(x),Se.remove(x)}function be(x){const I=Se.get(x).programs;I!==void 0&&(I.forEach(function(O){pe.releaseProgram(O)}),x.isShaderMaterial&&pe.releaseShaderCache(x))}this.renderBufferDirect=function(x,I,O,B,F,ue){I===null&&(I=Te);const xe=F.isMesh&&F.matrixWorld.determinant()<0,Ce=Gc(x,I,O,B,F);me.setMaterial(B,xe);let Pe=O.index,ze=1;if(B.wireframe===!0){if(Pe=Q.getWireframeAttribute(O),Pe===void 0)return;ze=2}const Ue=O.drawRange,Fe=O.attributes.position;let lt=Ue.start*ze,Ot=(Ue.start+Ue.count)*ze;ue!==null&&(lt=Math.max(lt,ue.start*ze),Ot=Math.min(Ot,(ue.start+ue.count)*ze)),Pe!==null?(lt=Math.max(lt,0),Ot=Math.min(Ot,Pe.count)):Fe!=null&&(lt=Math.max(lt,0),Ot=Math.min(Ot,Fe.count));const vt=Ot-lt;if(vt<0||vt===1/0)return;Oe.setup(F,B,Ce,O,Pe);let on,nt=Ee;if(Pe!==null&&(on=ee.get(Pe),nt=_e,nt.setIndex(on)),F.isMesh)B.wireframe===!0?(me.setLineWidth(B.wireframeLinewidth*Xe()),nt.setMode(U.LINES)):nt.setMode(U.TRIANGLES);else if(F.isLine){let Ge=B.linewidth;Ge===void 0&&(Ge=1),me.setLineWidth(Ge*Xe()),F.isLineSegments?nt.setMode(U.LINES):F.isLineLoop?nt.setMode(U.LINE_LOOP):nt.setMode(U.LINE_STRIP)}else F.isPoints?nt.setMode(U.POINTS):F.isSprite&&nt.setMode(U.TRIANGLES);if(F.isBatchedMesh)nt.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else if(F.isInstancedMesh)nt.renderInstances(lt,vt,F.count);else if(O.isInstancedBufferGeometry){const Ge=O._maxInstanceCount!==void 0?O._maxInstanceCount:1/0,qs=Math.min(O.instanceCount,Ge);nt.renderInstances(lt,vt,qs)}else nt.render(lt,vt)};function Ze(x,I,O){x.transparent===!0&&x.side===Jt&&x.forceSinglePass===!1?(x.side=At,x.needsUpdate=!0,$i(x,I,O),x.side=rn,x.needsUpdate=!0,$i(x,I,O),x.side=Jt):$i(x,I,O)}this.compile=function(x,I,O=null){O===null&&(O=x),p=Me.get(O),p.init(),E.push(p),O.traverseVisible(function(F){F.isLight&&F.layers.test(I.layers)&&(p.pushLight(F),F.castShadow&&p.pushShadow(F))}),x!==O&&x.traverseVisible(function(F){F.isLight&&F.layers.test(I.layers)&&(p.pushLight(F),F.castShadow&&p.pushShadow(F))}),p.setupLights(y._useLegacyLights);const B=new Set;return x.traverse(function(F){const ue=F.material;if(ue)if(Array.isArray(ue))for(let xe=0;xe<ue.length;xe++){const Ce=ue[xe];Ze(Ce,O,F),B.add(Ce)}else Ze(ue,O,F),B.add(ue)}),E.pop(),p=null,B},this.compileAsync=function(x,I,O=null){const B=this.compile(x,I,O);return new Promise(F=>{function ue(){if(B.forEach(function(xe){Se.get(xe).currentProgram.isReady()&&B.delete(xe)}),B.size===0){F(x);return}setTimeout(ue,10)}ye.get("KHR_parallel_shader_compile")!==null?ue():setTimeout(ue,10)})};let Je=null;function _t(x){Je&&Je(x)}function Ct(){Rt.stop()}function Qe(){Rt.start()}const Rt=new Ac;Rt.setAnimationLoop(_t),typeof self<"u"&&Rt.setContext(self),this.setAnimationLoop=function(x){Je=x,He.setAnimationLoop(x),x===null?Rt.stop():Rt.start()},He.addEventListener("sessionstart",Ct),He.addEventListener("sessionend",Qe),this.render=function(x,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),He.enabled===!0&&He.isPresenting===!0&&(He.cameraAutoUpdate===!0&&He.updateCamera(I),I=He.getCamera()),x.isScene===!0&&x.onBeforeRender(y,x,I,A),p=Me.get(x,E.length),p.init(),E.push(p),ve.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),z.setFromProjectionMatrix(ve),ie=this.localClippingEnabled,J=Ae.init(this.clippingPlanes,ie),_=de.get(x,f.length),_.init(),f.push(_),nn(x,I,0,y.sortObjects),_.finish(),y.sortObjects===!0&&_.sort(X,q),this.info.render.frame++,J===!0&&Ae.beginShadows();const O=p.state.shadowsArray;if(Y.render(O,x,I),J===!0&&Ae.endShadows(),this.info.autoReset===!0&&this.info.reset(),Be.render(_,x),p.setupLights(y._useLegacyLights),I.isArrayCamera){const B=I.cameras;for(let F=0,ue=B.length;F<ue;F++){const xe=B[F];ro(_,x,xe,xe.viewport)}}else ro(_,x,I);A!==null&&(M.updateMultisampleRenderTarget(A),M.updateRenderTargetMipmap(A)),x.isScene===!0&&x.onAfterRender(y,x,I),Oe.resetDefaultState(),j=-1,S=null,E.pop(),E.length>0?p=E[E.length-1]:p=null,f.pop(),f.length>0?_=f[f.length-1]:_=null};function nn(x,I,O,B){if(x.visible===!1)return;if(x.layers.test(I.layers)){if(x.isGroup)O=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(I);else if(x.isLight)p.pushLight(x),x.castShadow&&p.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||z.intersectsSprite(x)){B&&De.setFromMatrixPosition(x.matrixWorld).applyMatrix4(ve);const xe=Z.update(x),Ce=x.material;Ce.visible&&_.push(x,xe,Ce,O,De.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||z.intersectsObject(x))){const xe=Z.update(x),Ce=x.material;if(B&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),De.copy(x.boundingSphere.center)):(xe.boundingSphere===null&&xe.computeBoundingSphere(),De.copy(xe.boundingSphere.center)),De.applyMatrix4(x.matrixWorld).applyMatrix4(ve)),Array.isArray(Ce)){const Pe=xe.groups;for(let ze=0,Ue=Pe.length;ze<Ue;ze++){const Fe=Pe[ze],lt=Ce[Fe.materialIndex];lt&&lt.visible&&_.push(x,xe,lt,O,De.z,Fe)}}else Ce.visible&&_.push(x,xe,Ce,O,De.z,null)}}const ue=x.children;for(let xe=0,Ce=ue.length;xe<Ce;xe++)nn(ue[xe],I,O,B)}function ro(x,I,O,B){const F=x.opaque,ue=x.transmissive,xe=x.transparent;p.setupLightsView(O),J===!0&&Ae.setGlobalState(y.clippingPlanes,O),ue.length>0&&Hc(F,ue,I,O),B&&me.viewport(b.copy(B)),F.length>0&&qi(F,I,O),ue.length>0&&qi(ue,I,O),xe.length>0&&qi(xe,I,O),me.buffers.depth.setTest(!0),me.buffers.depth.setMask(!0),me.buffers.color.setMask(!0),me.setPolygonOffset(!1)}function Hc(x,I,O,B){if((O.isScene===!0?O.overrideMaterial:null)!==null)return;const ue=we.isWebGL2;ge===null&&(ge=new Kn(1,1,{generateMipmaps:!0,type:ye.has("EXT_color_buffer_half_float")?Hi:Rn,minFilter:zi,samples:ue?4:0})),y.getDrawingBufferSize(he),ue?ge.setSize(he.x,he.y):ge.setSize(Hr(he.x),Hr(he.y));const xe=y.getRenderTarget();y.setRenderTarget(ge),y.getClearColor(se),L=y.getClearAlpha(),L<1&&y.setClearColor(16777215,.5),y.clear();const Ce=y.toneMapping;y.toneMapping=Cn,qi(x,O,B),M.updateMultisampleRenderTarget(ge),M.updateRenderTargetMipmap(ge);let Pe=!1;for(let ze=0,Ue=I.length;ze<Ue;ze++){const Fe=I[ze],lt=Fe.object,Ot=Fe.geometry,vt=Fe.material,on=Fe.group;if(vt.side===Jt&&lt.layers.test(B.layers)){const nt=vt.side;vt.side=At,vt.needsUpdate=!0,oo(lt,O,B,Ot,vt,on),vt.side=nt,vt.needsUpdate=!0,Pe=!0}}Pe===!0&&(M.updateMultisampleRenderTarget(ge),M.updateRenderTargetMipmap(ge)),y.setRenderTarget(xe),y.setClearColor(se,L),y.toneMapping=Ce}function qi(x,I,O){const B=I.isScene===!0?I.overrideMaterial:null;for(let F=0,ue=x.length;F<ue;F++){const xe=x[F],Ce=xe.object,Pe=xe.geometry,ze=B===null?xe.material:B,Ue=xe.group;Ce.layers.test(O.layers)&&oo(Ce,I,O,Pe,ze,Ue)}}function oo(x,I,O,B,F,ue){x.onBeforeRender(y,I,O,B,F,ue),x.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),F.onBeforeRender(y,I,O,B,x,ue),F.transparent===!0&&F.side===Jt&&F.forceSinglePass===!1?(F.side=At,F.needsUpdate=!0,y.renderBufferDirect(O,I,B,F,x,ue),F.side=rn,F.needsUpdate=!0,y.renderBufferDirect(O,I,B,F,x,ue),F.side=Jt):y.renderBufferDirect(O,I,B,F,x,ue),x.onAfterRender(y,I,O,B,F,ue)}function $i(x,I,O){I.isScene!==!0&&(I=Te);const B=Se.get(x),F=p.state.lights,ue=p.state.shadowsArray,xe=F.state.version,Ce=pe.getParameters(x,F.state,ue,I,O),Pe=pe.getProgramCacheKey(Ce);let ze=B.programs;B.environment=x.isMeshStandardMaterial?I.environment:null,B.fog=I.fog,B.envMap=(x.isMeshStandardMaterial?N:v).get(x.envMap||B.environment),ze===void 0&&(x.addEventListener("dispose",le),ze=new Map,B.programs=ze);let Ue=ze.get(Pe);if(Ue!==void 0){if(B.currentProgram===Ue&&B.lightsStateVersion===xe)return co(x,Ce),Ue}else Ce.uniforms=pe.getUniforms(x),x.onBuild(O,Ce,y),x.onBeforeCompile(Ce,y),Ue=pe.acquireProgram(Ce,Pe),ze.set(Pe,Ue),B.uniforms=Ce.uniforms;const Fe=B.uniforms;return(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(Fe.clippingPlanes=Ae.uniform),co(x,Ce),B.needsLights=Wc(x),B.lightsStateVersion=xe,B.needsLights&&(Fe.ambientLightColor.value=F.state.ambient,Fe.lightProbe.value=F.state.probe,Fe.directionalLights.value=F.state.directional,Fe.directionalLightShadows.value=F.state.directionalShadow,Fe.spotLights.value=F.state.spot,Fe.spotLightShadows.value=F.state.spotShadow,Fe.rectAreaLights.value=F.state.rectArea,Fe.ltc_1.value=F.state.rectAreaLTC1,Fe.ltc_2.value=F.state.rectAreaLTC2,Fe.pointLights.value=F.state.point,Fe.pointLightShadows.value=F.state.pointShadow,Fe.hemisphereLights.value=F.state.hemi,Fe.directionalShadowMap.value=F.state.directionalShadowMap,Fe.directionalShadowMatrix.value=F.state.directionalShadowMatrix,Fe.spotShadowMap.value=F.state.spotShadowMap,Fe.spotLightMatrix.value=F.state.spotLightMatrix,Fe.spotLightMap.value=F.state.spotLightMap,Fe.pointShadowMap.value=F.state.pointShadowMap,Fe.pointShadowMatrix.value=F.state.pointShadowMatrix),B.currentProgram=Ue,B.uniformsList=null,Ue}function ao(x){if(x.uniformsList===null){const I=x.currentProgram.getUniforms();x.uniformsList=Ps.seqWithValue(I.seq,x.uniforms)}return x.uniformsList}function co(x,I){const O=Se.get(x);O.outputColorSpace=I.outputColorSpace,O.batching=I.batching,O.instancing=I.instancing,O.instancingColor=I.instancingColor,O.skinning=I.skinning,O.morphTargets=I.morphTargets,O.morphNormals=I.morphNormals,O.morphColors=I.morphColors,O.morphTargetsCount=I.morphTargetsCount,O.numClippingPlanes=I.numClippingPlanes,O.numIntersection=I.numClipIntersection,O.vertexAlphas=I.vertexAlphas,O.vertexTangents=I.vertexTangents,O.toneMapping=I.toneMapping}function Gc(x,I,O,B,F){I.isScene!==!0&&(I=Te),M.resetTextureUnits();const ue=I.fog,xe=B.isMeshStandardMaterial?I.environment:null,Ce=A===null?y.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:mn,Pe=(B.isMeshStandardMaterial?N:v).get(B.envMap||xe),ze=B.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,Ue=!!O.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),Fe=!!O.morphAttributes.position,lt=!!O.morphAttributes.normal,Ot=!!O.morphAttributes.color;let vt=Cn;B.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(vt=y.toneMapping);const on=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,nt=on!==void 0?on.length:0,Ge=Se.get(B),qs=p.state.lights;if(J===!0&&(ie===!0||x!==S)){const Gt=x===S&&B.id===j;Ae.setState(B,x,Gt)}let ot=!1;B.version===Ge.__version?(Ge.needsLights&&Ge.lightsStateVersion!==qs.state.version||Ge.outputColorSpace!==Ce||F.isBatchedMesh&&Ge.batching===!1||!F.isBatchedMesh&&Ge.batching===!0||F.isInstancedMesh&&Ge.instancing===!1||!F.isInstancedMesh&&Ge.instancing===!0||F.isSkinnedMesh&&Ge.skinning===!1||!F.isSkinnedMesh&&Ge.skinning===!0||F.isInstancedMesh&&Ge.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&Ge.instancingColor===!1&&F.instanceColor!==null||Ge.envMap!==Pe||B.fog===!0&&Ge.fog!==ue||Ge.numClippingPlanes!==void 0&&(Ge.numClippingPlanes!==Ae.numPlanes||Ge.numIntersection!==Ae.numIntersection)||Ge.vertexAlphas!==ze||Ge.vertexTangents!==Ue||Ge.morphTargets!==Fe||Ge.morphNormals!==lt||Ge.morphColors!==Ot||Ge.toneMapping!==vt||we.isWebGL2===!0&&Ge.morphTargetsCount!==nt)&&(ot=!0):(ot=!0,Ge.__version=B.version);let Ln=Ge.currentProgram;ot===!0&&(Ln=$i(B,I,F));let lo=!1,Ci=!1,$s=!1;const Et=Ln.getUniforms(),In=Ge.uniforms;if(me.useProgram(Ln.program)&&(lo=!0,Ci=!0,$s=!0),B.id!==j&&(j=B.id,Ci=!0),lo||S!==x){Et.setValue(U,"projectionMatrix",x.projectionMatrix),Et.setValue(U,"viewMatrix",x.matrixWorldInverse);const Gt=Et.map.cameraPosition;Gt!==void 0&&Gt.setValue(U,De.setFromMatrixPosition(x.matrixWorld)),we.logarithmicDepthBuffer&&Et.setValue(U,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&Et.setValue(U,"isOrthographic",x.isOrthographicCamera===!0),S!==x&&(S=x,Ci=!0,$s=!0)}if(F.isSkinnedMesh){Et.setOptional(U,F,"bindMatrix"),Et.setOptional(U,F,"bindMatrixInverse");const Gt=F.skeleton;Gt&&(we.floatVertexTextures?(Gt.boneTexture===null&&Gt.computeBoneTexture(),Et.setValue(U,"boneTexture",Gt.boneTexture,M)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}F.isBatchedMesh&&(Et.setOptional(U,F,"batchingTexture"),Et.setValue(U,"batchingTexture",F._matricesTexture,M));const Ys=O.morphAttributes;if((Ys.position!==void 0||Ys.normal!==void 0||Ys.color!==void 0&&we.isWebGL2===!0)&&Le.update(F,O,Ln),(Ci||Ge.receiveShadow!==F.receiveShadow)&&(Ge.receiveShadow=F.receiveShadow,Et.setValue(U,"receiveShadow",F.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&(In.envMap.value=Pe,In.flipEnvMap.value=Pe.isCubeTexture&&Pe.isRenderTargetTexture===!1?-1:1),Ci&&(Et.setValue(U,"toneMappingExposure",y.toneMappingExposure),Ge.needsLights&&Vc(In,$s),ue&&B.fog===!0&&ae.refreshFogUniforms(In,ue),ae.refreshMaterialUniforms(In,B,$,G,ge),Ps.upload(U,ao(Ge),In,M)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(Ps.upload(U,ao(Ge),In,M),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&Et.setValue(U,"center",F.center),Et.setValue(U,"modelViewMatrix",F.modelViewMatrix),Et.setValue(U,"normalMatrix",F.normalMatrix),Et.setValue(U,"modelMatrix",F.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){const Gt=B.uniformsGroups;for(let js=0,Xc=Gt.length;js<Xc;js++)if(we.isWebGL2){const ho=Gt[js];Ye.update(ho,Ln),Ye.bind(ho,Ln)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Ln}function Vc(x,I){x.ambientLightColor.needsUpdate=I,x.lightProbe.needsUpdate=I,x.directionalLights.needsUpdate=I,x.directionalLightShadows.needsUpdate=I,x.pointLights.needsUpdate=I,x.pointLightShadows.needsUpdate=I,x.spotLights.needsUpdate=I,x.spotLightShadows.needsUpdate=I,x.rectAreaLights.needsUpdate=I,x.hemisphereLights.needsUpdate=I}function Wc(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(x,I,O){Se.get(x.texture).__webglTexture=I,Se.get(x.depthTexture).__webglTexture=O;const B=Se.get(x);B.__hasExternalTextures=!0,B.__hasExternalTextures&&(B.__autoAllocateDepthBuffer=O===void 0,B.__autoAllocateDepthBuffer||ye.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),B.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(x,I){const O=Se.get(x);O.__webglFramebuffer=I,O.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(x,I=0,O=0){A=x,P=I,w=O;let B=!0,F=null,ue=!1,xe=!1;if(x){const Pe=Se.get(x);Pe.__useDefaultFramebuffer!==void 0?(me.bindFramebuffer(U.FRAMEBUFFER,null),B=!1):Pe.__webglFramebuffer===void 0?M.setupRenderTarget(x):Pe.__hasExternalTextures&&M.rebindTextures(x,Se.get(x.texture).__webglTexture,Se.get(x.depthTexture).__webglTexture);const ze=x.texture;(ze.isData3DTexture||ze.isDataArrayTexture||ze.isCompressedArrayTexture)&&(xe=!0);const Ue=Se.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(Ue[I])?F=Ue[I][O]:F=Ue[I],ue=!0):we.isWebGL2&&x.samples>0&&M.useMultisampledRTT(x)===!1?F=Se.get(x).__webglMultisampledFramebuffer:Array.isArray(Ue)?F=Ue[O]:F=Ue,b.copy(x.viewport),H.copy(x.scissor),W=x.scissorTest}else b.copy(K).multiplyScalar($).floor(),H.copy(te).multiplyScalar($).floor(),W=ne;if(me.bindFramebuffer(U.FRAMEBUFFER,F)&&we.drawBuffers&&B&&me.drawBuffers(x,F),me.viewport(b),me.scissor(H),me.setScissorTest(W),ue){const Pe=Se.get(x.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+I,Pe.__webglTexture,O)}else if(xe){const Pe=Se.get(x.texture),ze=I||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,Pe.__webglTexture,O||0,ze)}j=-1},this.readRenderTargetPixels=function(x,I,O,B,F,ue,xe){if(!(x&&x.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=Se.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&xe!==void 0&&(Ce=Ce[xe]),Ce){me.bindFramebuffer(U.FRAMEBUFFER,Ce);try{const Pe=x.texture,ze=Pe.format,Ue=Pe.type;if(ze!==en&&fe.convert(ze)!==U.getParameter(U.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Fe=Ue===Hi&&(ye.has("EXT_color_buffer_half_float")||we.isWebGL2&&ye.has("EXT_color_buffer_float"));if(Ue!==Rn&&fe.convert(Ue)!==U.getParameter(U.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Ue===Tn&&(we.isWebGL2||ye.has("OES_texture_float")||ye.has("WEBGL_color_buffer_float")))&&!Fe){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=x.width-B&&O>=0&&O<=x.height-F&&U.readPixels(I,O,B,F,fe.convert(ze),fe.convert(Ue),ue)}finally{const Pe=A!==null?Se.get(A).__webglFramebuffer:null;me.bindFramebuffer(U.FRAMEBUFFER,Pe)}}},this.copyFramebufferToTexture=function(x,I,O=0){const B=Math.pow(2,-O),F=Math.floor(I.image.width*B),ue=Math.floor(I.image.height*B);M.setTexture2D(I,0),U.copyTexSubImage2D(U.TEXTURE_2D,O,0,0,x.x,x.y,F,ue),me.unbindTexture()},this.copyTextureToTexture=function(x,I,O,B=0){const F=I.image.width,ue=I.image.height,xe=fe.convert(O.format),Ce=fe.convert(O.type);M.setTexture2D(O,0),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,O.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,O.unpackAlignment),I.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,B,x.x,x.y,F,ue,xe,Ce,I.image.data):I.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,B,x.x,x.y,I.mipmaps[0].width,I.mipmaps[0].height,xe,I.mipmaps[0].data):U.texSubImage2D(U.TEXTURE_2D,B,x.x,x.y,xe,Ce,I.image),B===0&&O.generateMipmaps&&U.generateMipmap(U.TEXTURE_2D),me.unbindTexture()},this.copyTextureToTexture3D=function(x,I,O,B,F=0){if(y.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const ue=x.max.x-x.min.x+1,xe=x.max.y-x.min.y+1,Ce=x.max.z-x.min.z+1,Pe=fe.convert(B.format),ze=fe.convert(B.type);let Ue;if(B.isData3DTexture)M.setTexture3D(B,0),Ue=U.TEXTURE_3D;else if(B.isDataArrayTexture||B.isCompressedArrayTexture)M.setTexture2DArray(B,0),Ue=U.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,B.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,B.unpackAlignment);const Fe=U.getParameter(U.UNPACK_ROW_LENGTH),lt=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Ot=U.getParameter(U.UNPACK_SKIP_PIXELS),vt=U.getParameter(U.UNPACK_SKIP_ROWS),on=U.getParameter(U.UNPACK_SKIP_IMAGES),nt=O.isCompressedTexture?O.mipmaps[F]:O.image;U.pixelStorei(U.UNPACK_ROW_LENGTH,nt.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,nt.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,x.min.x),U.pixelStorei(U.UNPACK_SKIP_ROWS,x.min.y),U.pixelStorei(U.UNPACK_SKIP_IMAGES,x.min.z),O.isDataTexture||O.isData3DTexture?U.texSubImage3D(Ue,F,I.x,I.y,I.z,ue,xe,Ce,Pe,ze,nt.data):O.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),U.compressedTexSubImage3D(Ue,F,I.x,I.y,I.z,ue,xe,Ce,Pe,nt.data)):U.texSubImage3D(Ue,F,I.x,I.y,I.z,ue,xe,Ce,Pe,ze,nt),U.pixelStorei(U.UNPACK_ROW_LENGTH,Fe),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,lt),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Ot),U.pixelStorei(U.UNPACK_SKIP_ROWS,vt),U.pixelStorei(U.UNPACK_SKIP_IMAGES,on),F===0&&B.generateMipmaps&&U.generateMipmap(Ue),me.unbindTexture()},this.initTexture=function(x){x.isCubeTexture?M.setTextureCube(x,0):x.isData3DTexture?M.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?M.setTexture2DArray(x,0):M.setTexture2D(x,0),me.unbindTexture()},this.resetState=function(){P=0,w=0,A=null,me.reset(),Oe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return pn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Jr?"display-p3":"srgb",t.unpackColorSpace=je.workingColorSpace===Gs?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Mt?$n:pc}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===$n?Mt:mn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class Fm extends Nc{}Fm.prototype.isWebGL1Renderer=!0;class no{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ne(e),this.near=t,this.far=n}clone(){return new no(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Om extends pt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}class km{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=kr,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=Pn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Pn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Pn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Pt=new R;class ks{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix4(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyNormalMatrix(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.transformDirection(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}setX(e,t){return this.normalized&&(t=Ke(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ke(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ke(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ke(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=fn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=fn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=fn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=fn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ke(t,this.array),n=Ke(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ke(t,this.array),n=Ke(n,this.array),i=Ke(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ke(t,this.array),n=Ke(n,this.array),i=Ke(i,this.array),r=Ke(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new Yt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new ks(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Fc extends gn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ne(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let pi;const Di=new R,mi=new R,gi=new R,_i=new We,Ui=new We,Oc=new ct,_s=new R,Ni=new R,vs=new R,Fa=new We,Ar=new We,Oa=new We;class Bm extends pt{constructor(e=new Fc){if(super(),this.isSprite=!0,this.type="Sprite",pi===void 0){pi=new Dt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new km(t,5);pi.setIndex([0,1,2,0,2,3]),pi.setAttribute("position",new ks(n,3,0,!1)),pi.setAttribute("uv",new ks(n,2,3,!1))}this.geometry=pi,this.material=e,this.center=new We(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),mi.setFromMatrixScale(this.matrixWorld),Oc.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),gi.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&mi.multiplyScalar(-gi.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const o=this.center;xs(_s.set(-.5,-.5,0),gi,o,mi,i,r),xs(Ni.set(.5,-.5,0),gi,o,mi,i,r),xs(vs.set(.5,.5,0),gi,o,mi,i,r),Fa.set(0,0),Ar.set(1,0),Oa.set(1,1);let a=e.ray.intersectTriangle(_s,Ni,vs,!1,Di);if(a===null&&(xs(Ni.set(-.5,.5,0),gi,o,mi,i,r),Ar.set(0,1),a=e.ray.intersectTriangle(_s,vs,Ni,!1,Di),a===null))return;const c=e.ray.origin.distanceTo(Di);c<e.near||c>e.far||t.push({distance:c,point:Di.clone(),uv:zt.getInterpolation(Di,_s,Ni,vs,Fa,Ar,Oa,new We),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function xs(s,e,t,n,i,r){_i.subVectors(s,t).addScalar(.5).multiply(n),i!==void 0?(Ui.x=r*_i.x-i*_i.y,Ui.y=i*_i.x+r*_i.y):Ui.copy(_i),s.copy(e),s.x+=Ui.x,s.y+=Ui.y,s.applyMatrix4(Oc)}class kc extends gn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ne(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ka=new R,Ba=new R,za=new ct,Cr=new Vs,ys=new Wi;class zm extends pt{constructor(e=new Dt,t=new kc){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)ka.fromBufferAttribute(t,i-1),Ba.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=ka.distanceTo(Ba);e.setAttribute("lineDistance",new ht(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ys.copy(n.boundingSphere),ys.applyMatrix4(i),ys.radius+=r,e.ray.intersectsSphere(ys)===!1)return;za.copy(i).invert(),Cr.copy(e.ray).applyMatrix4(za);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=new R,h=new R,u=new R,d=new R,m=this.isLineSegments?2:1,g=n.index,p=n.attributes.position;if(g!==null){const f=Math.max(0,o.start),E=Math.min(g.count,o.start+o.count);for(let y=f,T=E-1;y<T;y+=m){const P=g.getX(y),w=g.getX(y+1);if(l.fromBufferAttribute(p,P),h.fromBufferAttribute(p,w),Cr.distanceSqToSegment(l,h,d,u)>c)continue;d.applyMatrix4(this.matrixWorld);const j=e.ray.origin.distanceTo(d);j<e.near||j>e.far||t.push({distance:j,point:u.clone().applyMatrix4(this.matrixWorld),index:y,face:null,faceIndex:null,object:this})}}else{const f=Math.max(0,o.start),E=Math.min(p.count,o.start+o.count);for(let y=f,T=E-1;y<T;y+=m){if(l.fromBufferAttribute(p,y),h.fromBufferAttribute(p,y+1),Cr.distanceSqToSegment(l,h,d,u)>c)continue;d.applyMatrix4(this.matrixWorld);const w=e.ray.origin.distanceTo(d);w<e.near||w>e.far||t.push({distance:w,point:u.clone().applyMatrix4(this.matrixWorld),index:y,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}const Ha=new R,Ga=new R;class Hm extends zm{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)Ha.fromBufferAttribute(t,i),Ga.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Ha.distanceTo(Ga);e.setAttribute("lineDistance",new ht(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class io extends gn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ne(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Va=new ct,Vr=new Vs,Ss=new Wi,Ms=new R;class Bc extends pt{constructor(e=new Dt,t=new io){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ss.copy(n.boundingSphere),Ss.applyMatrix4(i),Ss.radius+=r,e.ray.intersectsSphere(Ss)===!1)return;Va.copy(i).invert(),Vr.copy(e.ray).applyMatrix4(Va);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){const d=Math.max(0,o.start),m=Math.min(l.count,o.start+o.count);for(let g=d,_=m;g<_;g++){const p=l.getX(g);Ms.fromBufferAttribute(u,p),Wa(Ms,p,c,i,e,t,this)}}else{const d=Math.max(0,o.start),m=Math.min(u.count,o.start+o.count);for(let g=d,_=m;g<_;g++)Ms.fromBufferAttribute(u,g),Wa(Ms,g,c,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Wa(s,e,t,n,i,r,o){const a=Vr.distanceSqToPoint(s);if(a<t){const c=new R;Vr.closestPointToPoint(s,c),c.applyMatrix4(n);const l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,object:o})}}class Wr extends Ft{constructor(e,t,n,i,r,o,a,c,l){super(e,t,n,i,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}const Es=new R,bs=new R,Rr=new R,Ts=new zt;class Gm extends Dt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const i=Math.pow(10,4),r=Math.cos(Rs*t),o=e.getIndex(),a=e.getAttribute("position"),c=o?o.count:a.count,l=[0,0,0],h=["a","b","c"],u=new Array(3),d={},m=[];for(let g=0;g<c;g+=3){o?(l[0]=o.getX(g),l[1]=o.getX(g+1),l[2]=o.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:_,b:p,c:f}=Ts;if(_.fromBufferAttribute(a,l[0]),p.fromBufferAttribute(a,l[1]),f.fromBufferAttribute(a,l[2]),Ts.getNormal(Rr),u[0]=`${Math.round(_.x*i)},${Math.round(_.y*i)},${Math.round(_.z*i)}`,u[1]=`${Math.round(p.x*i)},${Math.round(p.y*i)},${Math.round(p.z*i)}`,u[2]=`${Math.round(f.x*i)},${Math.round(f.y*i)},${Math.round(f.z*i)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let E=0;E<3;E++){const y=(E+1)%3,T=u[E],P=u[y],w=Ts[h[E]],A=Ts[h[y]],j=`${T}_${P}`,S=`${P}_${T}`;S in d&&d[S]?(Rr.dot(d[S].normal)<=r&&(m.push(w.x,w.y,w.z),m.push(A.x,A.y,A.z)),d[S]=null):j in d||(d[j]={index0:l[E],index1:l[y],normal:Rr.clone()})}}for(const g in d)if(d[g]){const{index0:_,index1:p}=d[g];Es.fromBufferAttribute(a,_),bs.fromBufferAttribute(a,p),m.push(Es.x,Es.y,Es.z),m.push(bs.x,bs.y,bs.z)}this.setAttribute("position",new ht(m,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class Bs extends Dt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],u=new R,d=new R,m=[],g=[],_=[],p=[];for(let f=0;f<=n;f++){const E=[],y=f/n;let T=0;f===0&&o===0?T=.5/t:f===n&&c===Math.PI&&(T=-.5/t);for(let P=0;P<=t;P++){const w=P/t;u.x=-e*Math.cos(i+w*r)*Math.sin(o+y*a),u.y=e*Math.cos(o+y*a),u.z=e*Math.sin(i+w*r)*Math.sin(o+y*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),p.push(w+T,1-y),E.push(l++)}h.push(E)}for(let f=0;f<n;f++)for(let E=0;E<t;E++){const y=h[f][E+1],T=h[f][E],P=h[f+1][E],w=h[f+1][E+1];(f!==0||o>0)&&m.push(y,T,w),(f!==n-1||c<Math.PI)&&m.push(T,P,w)}this.setIndex(m),this.setAttribute("position",new ht(g,3)),this.setAttribute("normal",new ht(_,3)),this.setAttribute("uv",new ht(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Bs(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class It extends gn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mc,this.normalScale=new We(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Kr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class zc extends pt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ne(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const Pr=new ct,Xa=new R,qa=new R;class Vm{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new We(512,512),this.map=null,this.mapPass=null,this.matrix=new ct,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new eo,this._frameExtents=new We(1,1),this._viewportCount=1,this._viewports=[new yt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Xa.setFromMatrixPosition(e.matrixWorld),t.position.copy(Xa),qa.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(qa),t.updateMatrixWorld(),Pr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Pr),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Pr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Wm extends Vm{constructor(){super(new Cc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Xm extends zc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(pt.DEFAULT_UP),this.updateMatrix(),this.target=new pt,this.shadow=new Wm}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class qm extends zc{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class $m{constructor(e,t,n=0,i=1/0){this.ray=new Vs(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Qr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}intersectObject(e,t=!0,n=[]){return Xr(e,this,n,t),n.sort($a),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)Xr(e[i],this,n,t);return n.sort($a),n}}function $a(s,e){return s.distance-e.distance}function Xr(s,e,t,n){if(s.layers.test(e.layers)&&s.raycast(e,t),n===!0){const i=s.children;for(let r=0,o=i.length;r<o;r++)Xr(i[r],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:jr}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=jr);const Ya=600,Ym=120,jm=3,ja=200;class Km{constructor(e){D(this,"mesh");D(this,"material");const t=this.generateCloudTexture();t.wrapS=Bi,t.wrapT=Bi,this.material=new Yn({map:t,transparent:!0,side:Jt,depthWrite:!1,opacity:.6});const n=new Ws(Ya,Ya);n.rotateX(-Math.PI/2),this.mesh=new $e(n,this.material),this.mesh.position.set(0,Ym,0),this.mesh.name="clouds",e.add(this.mesh)}generateCloudTexture(){const t=document.createElement("canvas");t.width=512,t.height=512;const n=t.getContext("2d");n.clearRect(0,0,512,512);const i=[];for(let o=0;o<18;o++){const a=Math.random()*512,c=Math.random()*512,l=3+Math.floor(Math.random()*5),h=.3+Math.random()*.4;for(let u=0;u<l;u++){const d=a+(Math.random()-.5)*120,m=c+(Math.random()-.5)*60,g=30+Math.random()*70;i.push({x:d,y:m,radius:g,opacity:h})}}for(const o of i){const a=n.createRadialGradient(o.x,o.y,0,o.x,o.y,o.radius);a.addColorStop(0,`rgba(255, 255, 255, ${o.opacity})`),a.addColorStop(.5,`rgba(255, 255, 255, ${o.opacity*.5})`),a.addColorStop(1,"rgba(255, 255, 255, 0)"),n.fillStyle=a,n.fillRect(o.x-o.radius,o.y-o.radius,o.radius*2,o.radius*2)}const r=new Wr(t);return r.minFilter=Ut,r.magFilter=Ut,r}update(e,t){this.mesh.position.x+=jm*t,this.mesh.position.x>ja&&(this.mesh.position.x-=ja*2);const n=new Ne;if(e>.7)n.setRGB(1,1,1);else if(e>.4){const i=(e-.4)/.3;n.setRGB(1,.6+.4*i,.4+.6*i)}else if(e>.15){const i=(e-.15)/.25;n.setRGB(.6+.4*i,.3+.3*i,.2+.2*i)}else n.setRGB(.3,.3,.35);this.material.color.copy(n),e>.7?this.material.opacity=.55:e>.4?this.material.opacity=.5:e>.15?this.material.opacity=.35:this.material.opacity=.15}dispose(e){e.remove(this.mesh),this.mesh.geometry.dispose(),this.material.map&&this.material.map.dispose(),this.material.dispose()}}class Zm{constructor(e){D(this,"scene");D(this,"camera");D(this,"renderer");D(this,"canvas");D(this,"skyLight");D(this,"ambientLight");D(this,"fog");D(this,"skyColor");D(this,"cloudSystem");D(this,"damageFlashEl");D(this,"vignetteEl");D(this,"lavaOverlayEl");D(this,"damageFlashIntensity",0);D(this,"currentBrightness",1);D(this,"isRaining",!1);D(this,"normalFogNear",80);D(this,"normalFogFar",160);D(this,"rainFogNear",30);D(this,"rainFogFar",80);this.canvas=document.createElement("canvas"),this.canvas.id="game-canvas",e.appendChild(this.canvas),this.scene=new Om,this.skyColor=new Ne(8900331),this.scene.background=this.skyColor,this.fog=new no(this.skyColor,80,160),this.scene.fog=this.fog,this.camera=new qt(70,window.innerWidth/window.innerHeight,.1,500),this.renderer=new Nc({canvas:this.canvas,antialias:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!1,this.skyLight=new Xm(16777215,1),this.skyLight.position.set(100,200,100),this.scene.add(this.skyLight),this.ambientLight=new qm(4210752,.6),this.scene.add(this.ambientLight),this.addSkyDome(),this.setupResizeHandler(),this.cloudSystem=new Km(this.scene),this.damageFlashEl=document.getElementById("damage-flash"),this.vignetteEl=document.getElementById("cave-vignette"),this.lavaOverlayEl=document.getElementById("lava-overlay")}addSkyDome(){const e=new Bs(400,32,32),t=new Yn({color:8900331,side:At}),n=new $e(e,t);n.name="sky",this.scene.add(n);const i=new Bs(15,16,16),r=new Yn({color:16776960}),o=new $e(i,r);o.position.set(200,150,-100),o.name="sun",this.scene.add(o)}setupResizeHandler(){window.addEventListener("resize",()=>{this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)})}getScene(){return this.scene}getCamera(){return this.camera}getCanvas(){return this.canvas}getBrightness(){return this.currentBrightness}setFov(e){this.camera.fov=e,this.camera.updateProjectionMatrix()}setRaining(e){this.isRaining=e}addToScene(e){this.scene.add(e)}removeFromScene(e){this.scene.remove(e)}updateSkyBrightness(e){this.currentBrightness=e;let t=.53*e,n=.81*e,i=.92*e;this.isRaining&&(t=t*(1-.3)+.4*.3,n=n*(1-.3)+.42*.3,i=i*(1-.3)+.48*.3),this.skyColor.setRGB(t,n,i),this.scene.background=this.skyColor,this.scene.fog.color=this.skyColor,this.fog.near=this.isRaining?this.rainFogNear:this.normalFogNear,this.fog.far=this.isRaining?this.rainFogFar:this.normalFogFar,this.skyLight.intensity=this.isRaining?e*.6:e,this.ambientLight.intensity=this.isRaining?.3+.3*e:.2+.6*e;const r=this.scene.getObjectByName("sky");r&&(r.material=new Yn({color:this.skyColor,side:At}))}updateClouds(e){this.cloudSystem.update(this.currentBrightness,e)}flashDamage(e){this.damageFlashIntensity=e,this.damageFlashEl.style.opacity=String(e)}updateDamageFlash(e){this.damageFlashIntensity>0&&(this.damageFlashIntensity-=e/.3,this.damageFlashIntensity<0&&(this.damageFlashIntensity=0),this.damageFlashEl.style.opacity=String(this.damageFlashIntensity))}updateCaveDarkness(e,t){if(t&&e<30){const n=Math.min(1,(30-e)/25),i=.4+.5*n,r=1-n*.7;this.vignetteEl.style.opacity=String(i),this.ambientLight.intensity=(.2+.6*this.currentBrightness)*r}else this.vignetteEl.style.opacity="0",this.ambientLight.intensity=.2+.6*this.currentBrightness}updateLavaEffect(e){this.lavaOverlayEl.style.opacity=e?"0.3":"0"}updateEffects(e){this.updateDamageFlash(e)}render(){this.renderer.render(this.scene,this.camera)}}const Jm=20,Lr=5,Qm=8,eg=12,Ka=.002,tg=1.7,ng=.6,ig=1.8,ws=.6;class sg{constructor(e,t){D(this,"_camera");D(this,"_input");D(this,"_position");D(this,"_velocity");D(this,"_yaw",0);D(this,"_pitch",0);D(this,"_isFlying",!1);D(this,"_selectedSlot",0);D(this,"_selectedBlockType",1);D(this,"_worldManager",null);D(this,"_onGround",!1);D(this,"_knockbackVelocity",new R(0,0,0));D(this,"_selectionBox",null);D(this,"_particleEmitter",null);D(this,"_connection",null);D(this,"digStartTime",0);D(this,"digTarget",null);D(this,"digDuration",0);D(this,"isDigging",!1);D(this,"isLeftMouseDown",!1);D(this,"health",20);D(this,"maxHealth",20);D(this,"inventory",[]);D(this,"isDead",!1);this._camera=e,this._input=t,this._position=new R(0,50,0),this._velocity=new R(0,0,0),this.setupControls(),this.requestPointerLock()}setWorldManager(e){this._worldManager=e}setSelectionBox(e){this._selectionBox=e}setParticleEmitter(e){this._particleEmitter=e}setConnection(e){this._connection=e}requestPointerLock(){const e=document.getElementById("game-canvas");e&&e.addEventListener("click",()=>{e.requestPointerLock()})}setupControls(){document.addEventListener("pointerlockchange",()=>{this._input.setPointerLocked(document.pointerLockElement!==null)}),document.addEventListener("mousemove",e=>{this._input.isPointerLocked()&&(this._yaw-=e.movementX*Ka,this._pitch-=e.movementY*Ka,this._pitch=Math.max(-Math.PI/2+.01,Math.min(Math.PI/2-.01,this._pitch)))}),document.addEventListener("keydown",e=>{switch(e.code){case"KeyF":this._isFlying=!this._isFlying;break;case"KeyE":const t=new CustomEvent("openCrafting");document.dispatchEvent(t);break;case"Digit1":case"Digit2":case"Digit3":case"Digit4":case"Digit5":case"Digit6":case"Digit7":case"Digit8":this._selectedSlot=parseInt(e.code.replace("Digit",""))-1;break}}),document.addEventListener("mousedown",e=>{this._input.isPointerLocked()&&(this.isDead||(e.button===0?(this.isLeftMouseDown=!0,this.startDig()):e.button===2&&this.onPlace()))}),document.addEventListener("mouseup",e=>{e.button===0&&(this.isLeftMouseDown=!1,this.resetDig())}),document.addEventListener("contextmenu",e=>e.preventDefault())}startDig(){const e=this.castRay();if(!e)return;const t={x:e.blockX,y:e.blockY,z:e.blockZ};if(!(this.digTarget&&this.digTarget.x===t.x&&this.digTarget.y===t.y&&this.digTarget.z===t.z&&this.isDigging)){if(this.resetDig(),this.digTarget=t,!this._connection){this.instantDig(e);return}this._connection.invoke("DigBlockStart",e.blockX,e.blockY,e.blockZ).then(n=>{n<0||(this.digStartTime=performance.now()/1e3,this.digDuration=n,this.isDigging=!0)}).catch(()=>{this.instantDig(e)})}}instantDig(e){var t;(t=this._particleEmitter)==null||t.call(this,e.blockX,e.blockY,e.blockZ,"dig"),this.emitBlockEvent("dig",e.blockX,e.blockY,e.blockZ)}completeDig(){var e;this.digTarget&&((e=this._particleEmitter)==null||e.call(this,this.digTarget.x,this.digTarget.y,this.digTarget.z,"dig"),this.emitBlockEvent("dig",this.digTarget.x,this.digTarget.y,this.digTarget.z),this.resetDig())}resetDig(){var e;this.digStartTime=0,this.digTarget=null,this.digDuration=0,this.isDigging=!1,(e=this._selectionBox)==null||e.setDigProgress(0)}updateDig(){var i;if(!this.isLeftMouseDown||!this.isDigging||!this.digTarget){this.isDigging&&this.resetDig();return}const e=this.castRay();if(!e||e.blockX!==this.digTarget.x||e.blockY!==this.digTarget.y||e.blockZ!==this.digTarget.z){this.resetDig();return}const t=performance.now()/1e3-this.digStartTime,n=Math.min(t/this.digDuration,1);(i=this._selectionBox)==null||i.setDigProgress(n),n>=1&&this.completeDig()}onPlace(){var t;const e=this.castRay();if(e){if(this._worldManager){const n=this._worldManager.getBlock(e.blockX,e.blockY,e.blockZ),i=this._worldManager.getBlockRegistry().get(n);if(i&&i.interactive){const r=new CustomEvent("interactBlock",{detail:{x:e.blockX,y:e.blockY,z:e.blockZ,blockId:n,blockName:i.name}});document.dispatchEvent(r);return}}(t=this._particleEmitter)==null||t.call(this,e.placeX,e.placeY,e.placeZ,"place"),this.emitBlockEvent("place",e.placeX,e.placeY,e.placeZ)}}emitBlockEvent(e,t,n,i){const r=new CustomEvent("blockAction",{detail:{type:e,x:t,y:n,z:i,blockType:this._selectedBlockType}});document.dispatchEvent(r)}castRay(){var g;const e=new R(0,0,-1);e.applyQuaternion(this._camera.quaternion);const t=new $m(this._camera.position,e,0,8),n=this._camera.parent;if(!n)return null;const i=[];n.traverse(_=>{_ instanceof $e&&_.name!=="sky"&&_.name!=="sun"&&!_.userData.entityId&&i.push(_)});const r=t.intersectObjects(i,!1);if(r.length===0)return null;const o=r[0],a=(g=o.face)==null?void 0:g.normal;if(!a)return null;const c=Math.floor(o.point.x-a.x*.5),l=Math.floor(o.point.y-a.y*.5),h=Math.floor(o.point.z-a.z*.5),u=Math.floor(o.point.x+a.x*.5),d=Math.floor(o.point.y+a.y*.5),m=Math.floor(o.point.z+a.z*.5);return{blockX:c,blockY:l,blockZ:h,placeX:u,placeY:d,placeZ:m}}update(e){var t,n;if(!this._input.isPointerLocked()){(t=this._selectionBox)==null||t.setVisible(!1);return}if(this.isDead){(n=this._selectionBox)==null||n.setVisible(!1);return}this.updateMovement(e),this.updateCamera(),this.updateSelectionBox(),this.updateDig()}updateMovement(e){const t=new R(-Math.sin(this._yaw),0,-Math.cos(this._yaw)),n=new R(Math.cos(this._yaw),0,-Math.sin(this._yaw)),i=new R(0,0,0);this._input.isKeyDown("KeyW")&&i.add(t),this._input.isKeyDown("KeyS")&&i.sub(t),this._input.isKeyDown("KeyA")&&i.sub(n),this._input.isKeyDown("KeyD")&&i.add(n);const r=this._isFlying?eg:this._input.isKeyDown("ShiftLeft")?Qm:Lr;this._isFlying?(this._velocity.x=i.x*r,this._velocity.z=i.z*r,this._velocity.y*=.9,this._input.isKeyDown("Space")?this._velocity.y=r:this._input.isKeyDown("ShiftLeft")&&(this._velocity.y=-r)):this.isClimbing()?(this._velocity.x=i.x*Lr*.5,this._velocity.z=i.z*Lr*.5,this._velocity.y*=.9,this._input.isKeyDown("Space")?this._velocity.y=2:this._input.isKeyDown("ShiftLeft")?this._velocity.y=-2:this._velocity.y=0,this._onGround=!0):(this._velocity.x=i.x*r,this._velocity.z=i.z*r,this._velocity.y-=Jm*e),this._velocity.y=Math.max(this._velocity.y,-50);const o=this._position.x+this._velocity.x*e,a=this._position.y+this._velocity.y*e,c=this._position.z+this._velocity.z*e;this._worldManager?(this.checkCollision(o,this._position.y,this._position.z)?this._velocity.x=0:this._position.x=o,this.checkCollision(this._position.x,a,this._position.z)?this._velocity.y<0?this._onGround&&Math.abs(this._velocity.y)<8?this.checkCollision(this._position.x,a+ws,this._position.z)?(this._onGround=!0,this._velocity.y=0):(this._position.y=a+ws,this._velocity.y=0):(this._onGround=!0,this._velocity.y=0):this._velocity.y=0:(this._position.y=a,this._onGround=!1),this.checkCollision(this._position.x,this._position.y,c)?this._onGround&&Math.abs(this._velocity.z)>.1?this.checkCollision(this._position.x,this._position.y+ws,c)?this._velocity.z=0:(this._position.z=c,this._position.y+=ws):this._velocity.z=0:this._position.z=c):(this._position.x=o,this._position.y=a,this._position.z=c),this._position.add(this._knockbackVelocity.clone().multiplyScalar(e)),this._knockbackVelocity.multiplyScalar(.85),this._position.y<-20&&(this._position.set(0,50,0),this._velocity.set(0,0,0))}checkCollision(e,t,n){const i=ng/2,r=Math.floor(e-i),o=Math.floor(e+i),a=Math.floor(t),c=Math.floor(t+ig-.01),l=Math.floor(n-i),h=Math.floor(n+i);for(let u=r;u<=o;u++)for(let d=a;d<=c;d++)for(let m=l;m<=h;m++)if(this._worldManager&&this._worldManager.isSolid(u,d,m))return!0;return!1}isClimbing(){if(!this._worldManager)return!1;const e=Math.floor(this._position.x),t=Math.floor(this._position.y),n=Math.floor(this._position.z);for(let i=-1;i<=1;i++)for(let r=-1;r<=1;r++){const o=this._worldManager.getBlock(e+i,t,n+r);if(this._worldManager.getBlockRegistry().isClimbable(o))return!0}return!1}updateCamera(){this._camera.position.copy(this._position),this._camera.position.y+=tg;const e=new Xi(this._pitch,this._yaw,0,"YXZ");this._camera.quaternion.setFromEuler(e)}updateSelectionBox(){if(!this._selectionBox)return;const e=this.castRay();if(e){const t=this.getBlockNormal(e),n=new R(e.blockX+.5+t.x*.5,e.blockY+.5+t.y*.5,e.blockZ+.5+t.z*.5);this._selectionBox.update(n,t)}else this._selectionBox.update(null,null)}getBlockNormal(e){return new R(e.placeX-e.blockX,e.placeY-e.blockY,e.placeZ-e.blockZ)}getPosition(){return this._position.clone()}getVelocity(){return this._velocity.clone()}getYaw(){return this._yaw*180/Math.PI}getPitch(){return this._pitch*180/Math.PI}getOnGround(){return this._onGround}applyKnockback(e,t,n){this._knockbackVelocity.set(e,t,n)}setFlying(e){this._isFlying=e}setHealth(e,t){this.health=e,t!==void 0&&(this.maxHealth=t),this.health<=0&&(this.isDead=!0)}setInventory(e){this.inventory=e;for(let t=0;t<Math.min(8,e.length);t++)if(e[t]&&e[t].blockId){this._selectedBlockType=e[t].blockId;break}}handleDeath(){this.isDead=!0,this._velocity.set(0,0,0)}respawn(){this._position.set(0,50,0),this._velocity.set(0,0,0),this.health=this.maxHealth,this.isDead=!1}getSelectedSlot(){return this._selectedSlot}getSelectedBlockType(){return this._selectedBlockType}setSelectedBlockType(e){this._selectedBlockType=e}}const Wt=16,Za=4,rg=[[-1,-1],[-1,0],[0,-1],[0,0]];function og(s,e,t){return s&&e?0:3-(s?1:0)-(e?1:0)-(t?1:0)}class so{constructor(e,t,n,i){D(this,"mesh",null);D(this,"transparentMesh",null);D(this,"chunkX");D(this,"chunkY");D(this,"chunkZ");D(this,"blocks");D(this,"isVegetation",!1);this.chunkX=e,this.chunkY=t,this.chunkZ=n,this.blocks=i}static fromServerData(e,t,n,i){return new so(e,t,n,i)}getBlock(e,t,n){const i=(e*Wt*Wt+t*Wt+n)*Za;return this.blocks[i]}getLight(e,t,n){const i=(e*Wt*Wt+t*Wt+n)*Za;return this.blocks[i+3]}buildMesh(e,t,n=null,i=()=>15){const r=n!==null;this.isVegetation=!1;const o=[],a=[],c=[],l=[],h=[];let u=0;const d=[],m=[],g=[],_=[],p=[];let f=0;const E=[],y=[];let T=!1;const P=[{dir:[0,1,0],corners:[[0,1,0],[1,1,0],[1,1,1],[0,1,1]],normal:[0,1,0]},{dir:[0,-1,0],corners:[[0,0,1],[1,0,1],[1,0,0],[0,0,0]],normal:[0,-1,0]},{dir:[1,0,0],corners:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]],normal:[1,0,0]},{dir:[-1,0,0],corners:[[0,0,1],[0,1,1],[0,1,0],[0,0,0]],normal:[-1,0,0]},{dir:[0,0,1],corners:[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],normal:[0,0,1]},{dir:[0,0,-1],corners:[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],normal:[0,0,-1]}];for(let A=0;A<Wt;A++)for(let j=0;j<Wt;j++)for(let S=0;S<Wt;S++){const b=this.getBlock(A,j,S);if(b===0)continue;const H=e.get(b);if(!H)continue;const W=H.transparent===!0,se=H.liquid===!0,L=e.isLightSource(b),k=H.name||"",G=k.includes("leaves")||k.includes("pine_needles")||k==="default:sugar_cane";G&&(T=!0,this.isVegetation=!0);const $=this.chunkX*Wt+A,X=this.chunkY*Wt+j,q=this.chunkZ*Wt+S,K=W?d:o,te=W?m:a,ne=W?g:c,z=W?_:l,J=W?p:h;let ie=null,ge=!1;r&&(ie=n.getUV(b),ge=n.hasTexture(b));const ve=ie!==null?[[ie[0],ie[1]],[ie[2],ie[1]],[ie[2],ie[3]],[ie[0],ie[3]]]:[];for(const he of P){const De=$+he.dir[0],Te=X+he.dir[1],Xe=q+he.dir[2],U=t(De,Te,Xe),st=e.get(U);if(W){if(st&&!st.transparent&&!st.liquid||U===b&&!se)continue}else if(st&&st.solid&&!st.transparent)continue;const ye=new Ne(H.color);let we=ye;he.dir[1]===1&&(we=ye.clone().multiplyScalar(1.1)),he.dir[1]===-1&&(we=ye.clone().multiplyScalar(.7));for(let qe=0;qe<4;qe++){const Se=he.corners[qe];let M=1;if(!W){const Z=$+Se[0]-he.dir[0]*.5,pe=X+Se[1]-he.dir[1]*.5,ae=q+Se[2]-he.dir[2]*.5,de=t($+Se[0]*.5+he.dir[0]*.5-he.dir[0],X+Se[1]*.5+he.dir[1]*.5-he.dir[1],q+Se[2]*.5+he.dir[2]*.5-he.dir[2]),Me=t($+he.dir[0],X+he.dir[1],q+he.dir[2]),Ae=e.get(de),Y=e.get(Me),Be=e.get(t(Math.round(Z),Math.round(pe),Math.round(ae))),Le=(Ae==null?void 0:Ae.solid)===!0&&(Ae==null?void 0:Ae.transparent)!==!0,Ee=(Y==null?void 0:Y.solid)===!0&&(Y==null?void 0:Y.transparent)!==!0,_e=(Be==null?void 0:Be.solid)===!0&&(Be==null?void 0:Be.transparent)!==!0;M=og(Le,Ee,_e)/3}let v;if(L)v=1;else{const Z=$+Se[0],pe=X+Se[1],ae=q+Se[2],de=he.dir[0],Me=he.dir[1],Ae=he.dir[2];let Y=0;for(const[Be,Le]of rg){let Ee,_e,fe;de!==0?(Ee=de>0?Z:Z-1,_e=pe+Be,fe=ae+Le):Me!==0?(Ee=Z+Be,_e=Me>0?pe:pe-1,fe=ae+Le):(Ee=Z+Be,_e=pe+Le,fe=Ae>0?ae:ae-1),Y+=i(Ee,_e,fe)}v=Math.max(Y/4/15,.1)}const N=ge?M*v:we.r*M*v,ee=ge?M*v:we.g*M*v,Q=ge?M*v:we.b*M*v;if(K.push($+Se[0],X+Se[1],q+Se[2]),te.push(he.normal[0],he.normal[1],he.normal[2]),ne.push(N,ee,Q),r&&ie!==null&&z.push(ve[qe][0],ve[qe][1]),G&&he.dir[1]===1){const Z=W?y:E,pe=W?f:u;Z.push(pe+qe)}}const me=W?f:u;J.push(me,me+1,me+2,me,me+2,me+3),W?f+=4:u+=4}}const w=r?n.texture:null;this.mesh=this.buildGeometry(o,a,c,l,h,u,!1,w),this.transparentMesh=this.buildGeometry(d,m,g,_,p,f,!0,w),T&&(this.isVegetation=!0,this.mesh&&E.length>0&&(this.mesh.userData.isVegetation=!0,this.mesh.userData.topVertexIndices=E,this.mesh.userData.topBasePositions=new Float32Array(o)),this.transparentMesh&&y.length>0&&(this.transparentMesh.userData.isVegetation=!0,this.transparentMesh.userData.topVertexIndices=y,this.transparentMesh.userData.topBasePositions=new Float32Array(d)))}static updateAnimations(e,t){}animateVegetation(e){if(!this.isVegetation)return;const t=[];this.mesh&&t.push(this.mesh),this.transparentMesh&&t.push(this.transparentMesh);const n=.05;for(const i of t){if(!i.userData.isVegetation)continue;const r=i.geometry.getAttribute("position");if(!r)continue;const o=i.userData.topVertexIndices,a=i.userData.topBasePositions;if(!(!o||!a)){for(let c=0;c<o.length;c++){const l=o[c];if(l*3+1>=r.array.length||l*3+1>=a.length)continue;const h=a[l*3+1],u=a[l*3];r.array[l*3+1]=h+Math.sin(e*1.5+u*.5)*n}r.needsUpdate=!0}}}buildGeometry(e,t,n,i,r,o,a,c){if(o===0)return null;const l=new Dt;l.setAttribute("position",new ht(e,3)),l.setAttribute("normal",new ht(t,3)),l.setAttribute("color",new ht(n,3)),i.length>0&&l.setAttribute("uv",new ht(i,2)),l.setIndex(r);const h=new It({map:c,vertexColors:!0,transparent:a,opacity:a?.6:1,side:a?Jt:rn,depthWrite:!a});return new $e(l,h)}}class ag{constructor(){D(this,"blocks",new Map);D(this,"byName",new Map);this.loadDefaults()}loadDefaults(){const e=[{id:0,name:"air",solid:!1,transparent:!0,color:"#000000"},{id:1,name:"stone",solid:!0,transparent:!1,color:"#808080",hardness:1.5,drops:"cobblestone",textureName:"default_stone"},{id:2,name:"dirt",solid:!0,transparent:!1,color:"#8B4513",hardness:.5,textureName:"default_dirt"},{id:3,name:"grass",solid:!0,transparent:!1,color:"#228B22",hardness:.6,textureName:"default_grass"},{id:4,name:"water",solid:!1,transparent:!0,color:"#4169E1",liquid:!0,textureName:"default_water"},{id:5,name:"sand",solid:!0,transparent:!1,color:"#F4A460",hardness:.5,textureName:"default_sand"},{id:6,name:"wood",solid:!0,transparent:!1,color:"#DEB887",hardness:2,textureName:"default_tree"},{id:7,name:"leaves",solid:!0,transparent:!0,color:"#32CD32",hardness:.2,textureName:"default_leaves"},{id:8,name:"glass",solid:!0,transparent:!0,color:"#ADD8E6",hardness:.3},{id:9,name:"brick",solid:!0,transparent:!1,color:"#B22222",hardness:2},{id:10,name:"ore_iron",solid:!0,transparent:!1,color:"#C4A882",hardness:3,drops:"iron_ingot"},{id:11,name:"coal",solid:!0,transparent:!1,color:"#2F4F4F",hardness:3},{id:12,name:"bedrock",solid:!0,transparent:!1,color:"#1C1C1C",breakable:!1},{id:13,name:"snow",solid:!0,transparent:!1,color:"#FFFAFA",hardness:.2,textureName:"default_snow"},{id:14,name:"ice",solid:!0,transparent:!0,color:"#B0E0E6",hardness:.5,textureName:"default_ice"},{id:15,name:"lava",solid:!1,transparent:!0,color:"#FF4500",liquid:!0,damage:4,textureName:"default_lava"},{id:16,name:"torch",solid:!1,transparent:!0,color:"#FFD700",light:14},{id:17,name:"ladder",solid:!1,transparent:!0,color:"#8B4513",climbable:!0},{id:18,name:"fence",solid:!0,transparent:!0,color:"#8B4513",hardness:2},{id:19,name:"door_wood",solid:!0,transparent:!0,color:"#8B6914",interactive:!0,hardness:3},{id:20,name:"chest",solid:!0,transparent:!1,color:"#8B4513",interactive:!0,hardness:2.5},{id:21,name:"crafting_table",solid:!0,transparent:!1,color:"#D2691E",interactive:!0,hardness:2.5},{id:22,name:"furnace",solid:!0,transparent:!1,color:"#696969",interactive:!0,hardness:3.5},{id:23,name:"ore_gold",solid:!0,transparent:!1,color:"#FFD700",hardness:3,drops:"gold_ingot"},{id:24,name:"ore_diamond",solid:!0,transparent:!1,color:"#00FFFF",hardness:3,drops:"diamond"},{id:25,name:"planks",solid:!0,transparent:!1,color:"#BC8F5A",hardness:2},{id:26,name:"cobblestone",solid:!0,transparent:!1,color:"#6B6B6B",hardness:2,textureName:"default_cobble"},{id:27,name:"stone_brick",solid:!0,transparent:!1,color:"#777777",hardness:1.5},{id:28,name:"wool_white",solid:!0,transparent:!1,color:"#EEEEEE",hardness:.8},{id:29,name:"wool_red",solid:!0,transparent:!1,color:"#CC2222",hardness:.8},{id:30,name:"wool_blue",solid:!0,transparent:!1,color:"#2222CC",hardness:.8},{id:31,name:"wool_green",solid:!0,transparent:!1,color:"#22CC22",hardness:.8},{id:32,name:"bookshelf",solid:!0,transparent:!1,color:"#C4A050",hardness:1.5},{id:33,name:"gravel",solid:!0,transparent:!1,color:"#888078",hardness:.6,falling:!0,groups:{crumbly:3},soundGroup:"gravel",textureName:"default_gravel"},{id:34,name:"clay",solid:!0,transparent:!1,color:"#9BA5B0",hardness:.6,groups:{crumbly:3},soundGroup:"dirt"},{id:35,name:"sandstone",solid:!0,transparent:!1,color:"#E8D5A3",hardness:.8,groups:{cracky:3},soundGroup:"sand"},{id:36,name:"obsidian",solid:!0,transparent:!1,color:"#1A0A2E",hardness:50,groups:{cracky:5},soundGroup:"stone"},{id:37,name:"cactus",solid:!0,transparent:!1,color:"#0A5C0A",hardness:.4,damage:1,groups:{choppy:2},soundGroup:"wood"},{id:38,name:"sugar_cane",solid:!1,transparent:!0,color:"#90EE90",hardness:.2,soundGroup:"grass"},{id:39,name:"pumpkin",solid:!0,transparent:!1,color:"#FF8C00",hardness:1,groups:{choppy:2},soundGroup:"wood"},{id:40,name:"melon",solid:!0,transparent:!1,color:"#5C8A1E",hardness:1,drops:"melon_slice",groups:{choppy:2},soundGroup:"wood"},{id:41,name:"mycelium",solid:!0,transparent:!1,color:"#6B5A8A",hardness:.6,drops:"dirt",groups:{crumbly:3},soundGroup:"dirt"},{id:42,name:"farmland",solid:!0,transparent:!1,color:"#6B4E2A",hardness:.6,groups:{crumbly:3},soundGroup:"dirt"},{id:43,name:"water_flowing",solid:!1,transparent:!0,color:"#4169E1",liquid:!0,drowning:!0,soundGroup:"water",textureName:"default_water_flowing"},{id:44,name:"lava_flowing",solid:!1,transparent:!0,color:"#FF4500",liquid:!0,damage:4,postEffectColor:"#FF4400",soundGroup:"lava",textureName:"default_lava_flowing"},{id:45,name:"coal_ore",solid:!0,transparent:!1,color:"#3A3A3A",hardness:3,drops:"coal",groups:{cracky:3},soundGroup:"stone"},{id:46,name:"mossy_cobblestone",solid:!0,transparent:!1,color:"#5E6E5E",hardness:2,groups:{cracky:3},soundGroup:"stone",textureName:"default_mossycobble"},{id:47,name:"iron_block",solid:!0,transparent:!1,color:"#D8D8D8",hardness:5,groups:{cracky:2},soundGroup:"metal"},{id:48,name:"gold_block",solid:!0,transparent:!1,color:"#FFD700",hardness:3,groups:{cracky:2},soundGroup:"metal"},{id:49,name:"diamond_block",solid:!0,transparent:!1,color:"#4AEDD9",hardness:5,groups:{cracky:2},soundGroup:"metal"},{id:50,name:"wool_orange",solid:!0,transparent:!1,color:"#E8821C",hardness:.8,groups:{snappy:2},soundGroup:"cloth"},{id:51,name:"wool_yellow",solid:!0,transparent:!1,color:"#F2E63C",hardness:.8,groups:{snappy:2},soundGroup:"cloth"},{id:52,name:"wool_cyan",solid:!0,transparent:!1,color:"#2CC4AD",hardness:.8,groups:{snappy:2},soundGroup:"cloth"},{id:53,name:"wool_purple",solid:!0,transparent:!1,color:"#7B2FBE",hardness:.8,groups:{snappy:2},soundGroup:"cloth"},{id:54,name:"wool_black",solid:!0,transparent:!1,color:"#1D1D1D",hardness:.8,groups:{snappy:2},soundGroup:"cloth"},{id:55,name:"wool_brown",solid:!0,transparent:!1,color:"#724528",hardness:.8,groups:{snappy:2},soundGroup:"cloth"},{id:56,name:"wool_pink",solid:!0,transparent:!1,color:"#F2A5C4",hardness:.8,groups:{snappy:2},soundGroup:"cloth"},{id:57,name:"wool_lime",solid:!0,transparent:!1,color:"#52B248",hardness:.8,groups:{snappy:2},soundGroup:"cloth"},{id:58,name:"wool_light_blue",solid:!0,transparent:!1,color:"#6689D3",hardness:.8,groups:{snappy:2},soundGroup:"cloth"},{id:59,name:"wool_magenta",solid:!0,transparent:!1,color:"#B24CBF",hardness:.8,groups:{snappy:2},soundGroup:"cloth"},{id:60,name:"wool_gray",solid:!0,transparent:!1,color:"#6B6B6B",hardness:.8,groups:{snappy:2},soundGroup:"cloth"},{id:61,name:"wool_light_gray",solid:!0,transparent:!1,color:"#A0A0A0",hardness:.8,groups:{snappy:2},soundGroup:"cloth"},{id:62,name:"glowing_obsidian",solid:!0,transparent:!1,color:"#3A1A5E",hardness:50,light:14,groups:{cracky:5},soundGroup:"stone"},{id:63,name:"apple_block",solid:!0,transparent:!1,color:"#CC2222",hardness:.8,drops:"apple",groups:{snappy:3},soundGroup:"grass"}];for(const t of e)this.blocks.set(t.id,t),this.byName.set(t.name,t)}loadFromServer(e){const t=JSON.parse(e);this.blocks.clear(),this.byName.clear();const n=t.blocks||t;for(const i of Object.keys(n)){const r=n[i],o=parseInt(i),a={id:o,name:r.name,solid:r.solid,transparent:r.transparent,color:r.color};r.liquid!==void 0&&(a.liquid=r.liquid),r.light!==void 0&&(a.light=r.light),r.hardness!==void 0&&(a.hardness=r.hardness),r.drops!==void 0&&(a.drops=r.drops),r.climbable!==void 0&&(a.climbable=r.climbable),r.damage!==void 0&&(a.damage=r.damage),r.breakable!==void 0&&(a.breakable=r.breakable),r.interactive!==void 0&&(a.interactive=r.interactive),r.drowning!==void 0&&(a.drowning=r.drowning),r.falling!==void 0&&(a.falling=r.falling),r.bouncy!==void 0&&(a.bouncy=r.bouncy),r.slippery!==void 0&&(a.slippery=r.slippery),r.moveResistance!==void 0&&(a.moveResistance=r.moveResistance),r.postEffectColor!==void 0&&(a.postEffectColor=r.postEffectColor),r.groups!==void 0&&(a.groups=r.groups),r.soundGroup!==void 0&&(a.soundGroup=r.soundGroup),r.textureName!==void 0&&(a.textureName=r.textureName),this.blocks.set(o,a),this.byName.set(a.name,a)}}get(e){return this.blocks.get(e)}getByBlockId(e){return this.blocks.get(e)}getByName(e){return this.byName.get(e)}isSolid(e){var t;return((t=this.blocks.get(e))==null?void 0:t.solid)??!1}isTransparent(e){var t;return((t=this.blocks.get(e))==null?void 0:t.transparent)??!0}isLiquid(e){var t;return((t=this.blocks.get(e))==null?void 0:t.liquid)??!1}isClimbable(e){var t;return((t=this.blocks.get(e))==null?void 0:t.climbable)??!1}isFalling(e){var t;return((t=this.blocks.get(e))==null?void 0:t.falling)??!1}isInteractive(e){var t;return((t=this.blocks.get(e))==null?void 0:t.interactive)??!1}isLightSource(e){var t;return(((t=this.blocks.get(e))==null?void 0:t.light)??0)>0}getLightLevel(e){var t;return((t=this.blocks.get(e))==null?void 0:t.light)??0}lightPropagates(e){const t=this.blocks.get(e);return t?t.transparent===!0||t.liquid===!0:!0}getGroups(e){var t;return((t=this.blocks.get(e))==null?void 0:t.groups)??{}}getAll(){return this.blocks}}const On=8,Mn=16,Ja=["default_stone","default_dirt","default_grass","default_water","default_sand","default_tree","default_leaves","default_snow","default_snow_side","default_ice","default_lava","default_lava_flowing","default_water_flowing","default_cobble","default_gravel","default_mossycobble","default_desert_sand","default_desert_stone","default_tree_top","default_pine_tree","default_pine_tree_top","default_pine_needles","default_jungletree","default_jungletree_top","default_jungleleaves","default_junglegrass","default_river_water","default_river_water_flowing","default_apple","basenodes_snow_sheet","basenodes_dirt_with_snow","basenodes_dirt_with_snow_bottom","basenodes_dirt_with_grass_bottom"],Qa=20;class cg{constructor(e,t,n,i,r,o,a,c){D(this,"mesh");D(this,"fromX");D(this,"fromY");D(this,"fromZ");D(this,"toX");D(this,"toY");D(this,"toZ");D(this,"blockType");D(this,"elapsedTime",0);D(this,"startY");D(this,"velocityY",0);D(this,"completed",!1);this.fromX=e,this.fromY=t,this.fromZ=n,this.toX=i,this.toY=r,this.toZ=o,this.blockType=a,this.startY=t;const l=new at(1,1,1),h=new It({color:c});this.mesh=new $e(l,h),this.mesh.position.set(e+.5,t+.5,n+.5)}update(e){if(this.completed)return;this.elapsedTime+=e,this.velocityY-=Qa*e;const t=this.startY+.5+this.velocityY*this.elapsedTime+.5*Qa*this.elapsedTime*this.elapsedTime;t<=this.toY+.5?(this.mesh.position.y=this.toY+.5,this.completed=!0):this.mesh.position.y=t}}class lg{constructor(e){D(this,"chunks",new Map);D(this,"renderer");D(this,"blockRegistry");D(this,"playerMeshes",new Map);D(this,"entityMeshes",new Map);D(this,"pendingChunks",new Set);D(this,"connection",null);D(this,"textureAtlas",null);D(this,"fallingBlocks",[]);D(this,"playerAnimTime",0);this.renderer=e,this.blockRegistry=new ag,this.loadTextureAtlas()}setConnection(e){this.connection=e}getBlockRegistry(){return this.blockRegistry}loadTextureAtlas(){const e=new Map,t=Ja.map(n=>new Promise(i=>{const r=new Image;r.onload=()=>{e.set(n,r),i()},r.onerror=()=>i(),r.src=`/textures/blocks/${n}.png`}));Promise.all(t).then(()=>{if(e.size===0)return;const n=e.size+1,i=Math.ceil(n/On),r=document.createElement("canvas");r.width=On*Mn,r.height=i*Mn;const o=r.getContext("2d");o.fillStyle="#ffffff",o.fillRect(0,0,Mn,Mn);const a=new Map;let c=1;for(const u of Ja){const d=e.get(u);if(!d)continue;const m=c%On,g=Math.floor(c/On);o.drawImage(d,m*Mn,g*Mn,Mn,Mn),a.set(u,{col:m,row:g}),c++}const l=new Wr(r);l.magFilter=St,l.minFilter=St;const h=[0,1-1/i,1/On,1];this.textureAtlas={texture:l,getUV:u=>{const d=this.blockRegistry.get(u),m=d==null?void 0:d.textureName;if(m){const g=a.get(m);if(g)return[g.col/On,1-(g.row+1)/i,(g.col+1)/On,1-g.row/i]}return h},hasTexture:u=>{const d=this.blockRegistry.get(u),m=d==null?void 0:d.textureName;return m!=null&&a.has(m)}};for(const[u]of this.chunks)this.rebuildChunkMesh(u)})}loadChunk(e,t,n,i){const r=`${e},${t},${n}`,o=this.chunks.get(r);o&&o.mesh&&this.renderer.removeFromScene(o.mesh),o&&o.transparentMesh&&this.renderer.removeFromScene(o.transparentMesh);const a=so.fromServerData(e,t,n,i);a.buildMesh(this.blockRegistry,(c,l,h)=>this.getBlock(c,l,h),this.textureAtlas,(c,l,h)=>this.getBlockLight(c,l,h)),a.mesh&&this.renderer.addToScene(a.mesh),a.transparentMesh&&this.renderer.addToScene(a.transparentMesh),this.chunks.set(r,a),this.pendingChunks.delete(r),this.rebuildNeighborChunks(e,t,n)}rebuildNeighborChunks(e,t,n){const i=[[e-1,t,n],[e+1,t,n],[e,t-1,n],[e,t+1,n],[e,t,n-1],[e,t,n+1]];for(const[r,o,a]of i){const c=`${r},${o},${a}`;this.chunks.has(c)&&this.rebuildChunkMesh(c)}}rebuildChunkMesh(e){const t=this.chunks.get(e);t&&(t.mesh&&this.renderer.removeFromScene(t.mesh),t.transparentMesh&&this.renderer.removeFromScene(t.transparentMesh),t.buildMesh(this.blockRegistry,(n,i,r)=>this.getBlock(n,i,r),this.textureAtlas,(n,i,r)=>this.getBlockLight(n,i,r)),t.mesh&&this.renderer.addToScene(t.mesh),t.transparentMesh&&this.renderer.addToScene(t.transparentMesh))}updateBlock(e,t,n,i){const r=Math.floor(e/16),o=Math.floor(t/16),a=Math.floor(n/16),c=`${r},${o},${a}`,l=this.chunks.get(c);if(l){const h=(e%16+16)%16,u=(t%16+16)%16,d=(n%16+16)%16,m=(h*16*16+u*16+d)*4;l.blocks[m]=i>>8&255,l.blocks[m+1]=i&255,this.rebuildChunkMesh(c),h===0&&this.rebuildChunkMesh(`${r-1},${o},${a}`),h===15&&this.rebuildChunkMesh(`${r+1},${o},${a}`),u===0&&this.rebuildChunkMesh(`${r},${o-1},${a}`),u===15&&this.rebuildChunkMesh(`${r},${o+1},${a}`),d===0&&this.rebuildChunkMesh(`${r},${o},${a-1}`),d===15&&this.rebuildChunkMesh(`${r},${o},${a+1}`)}}requestChunksAroundPlayer(e){const t=Math.floor(e.x/16),n=Math.floor(e.y/16),i=Math.floor(e.z/16),r=4,o=[];for(let a=-r;a<=r;a++)for(let c=-1;c<=2;c++)for(let l=-r;l<=r;l++){if(a*a+l*l>r*r)continue;const h=`${t+a},${n+c},${i+l}`;!this.chunks.has(h)&&!this.pendingChunks.has(h)&&(this.pendingChunks.add(h),o.push(h),this.connection&&this.connection.invoke("RequestChunk",t+a,n+c,i+l))}return o}hasChunk(e){return this.chunks.has(e)}getChunk(e){return this.chunks.get(e)}addPlayer(e){if(this.playerMeshes.has(e))return;const t=new wn,n=new at(.6,.75,.3),i=new It({color:2245802}),r=new $e(n,i);r.position.y=.375,t.add(r);const o=new at(.5,.5,.5),a=new It({color:16764057}),c=new $e(o,a);c.position.y=.875,t.add(c);const l=new at(.25,.75,.25),h=new It({color:1122918}),u=new $e(l,h);u.position.set(-.15,-.375,0),t.add(u);const d=new $e(l,h);d.position.set(.15,-.375,0),t.add(d);const m=new at(.25,.75,.25),g=new It({color:16764057}),_=new $e(m,g);_.position.set(-.425,.375,0),t.add(_);const p=new $e(m,g);p.position.set(.425,.375,0),t.add(p);const f=document.createElement("canvas");f.width=256,f.height=64;const E=f.getContext("2d");E.fillStyle="white",E.font="24px Arial",E.textAlign="center",E.fillText(e,128,40);const y=new Wr(f),T=new Fc({map:y,transparent:!0}),P=new Bm(T);P.position.y=2.2,P.scale.set(3,.75,1),t.add(P),t.position.y=.9,this.renderer.addToScene(t),this.playerMeshes.set(e,{mesh:t,label:P,leftLeg:u,rightLeg:d,leftArm:_,rightArm:p})}removePlayer(e){const t=this.playerMeshes.get(e);t&&(this.renderer.removeFromScene(t.mesh),this.playerMeshes.delete(e))}updatePlayerPosition(e,t,n,i,r,o){this.playerMeshes.has(e)||this.addPlayer(e);const a=this.playerMeshes.get(e);a.mesh.position.set(t,n,i),a.mesh.rotation.y=r*Math.PI/180}animatePlayer(e,t,n){const i=this.playerMeshes.get(e);if(i)if(t){this.playerAnimTime+=n;const o=Math.sin(this.playerAnimTime*8)*.5236,a=-.375+.375,c=.375+.375;i.leftLeg.position.set(-.15,a,0),i.leftLeg.rotation.x=o,i.rightLeg.position.set(.15,a,0),i.rightLeg.rotation.x=-o,i.leftArm.position.set(-.425,c,0),i.leftArm.rotation.x=-o,i.rightArm.position.set(.425,c,0),i.rightArm.rotation.x=o}else i.leftLeg.rotation.x=0,i.rightLeg.rotation.x=0,i.leftArm.rotation.x=0,i.rightArm.rotation.x=0,i.leftLeg.position.set(-.15,-.375,0),i.rightLeg.position.set(.15,-.375,0),i.leftArm.position.set(-.425,.375,0),i.rightArm.position.set(.425,.375,0)}spawnEntity(e,t,n,i,r){const o=t==="Item"?new at(.3,.3,.3):new at(.8,1.6,.8),a=t==="Item"?16755200:16729156,c=new It({color:a}),l=new $e(o,c);l.position.set(n,i,r),l.userData.entityId=e,this.renderer.addToScene(l),this.entityMeshes.set(e,l)}removeEntity(e){const t=this.entityMeshes.get(e);t&&(this.renderer.removeFromScene(t),this.entityMeshes.delete(e))}updateEntityPosition(e,t,n,i){const r=this.entityMeshes.get(e);r&&r.position.set(t,n,i)}getBlock(e,t,n){const i=Math.floor(e/16),r=Math.floor(t/16),o=Math.floor(n/16),a=`${i},${r},${o}`,c=this.chunks.get(a);if(!c)return 0;const l=(e%16+16)%16,h=(t%16+16)%16,u=(n%16+16)%16;return c.getBlock(l,h,u)}getBlockLight(e,t,n){const i=Math.floor(e/16),r=Math.floor(t/16),o=Math.floor(n/16),a=`${i},${r},${o}`,c=this.chunks.get(a);if(!c)return 15;const l=(e%16+16)%16,h=(t%16+16)%16,u=(n%16+16)%16;return c.getLight(l,h,u)}isSolid(e,t,n){const i=this.getBlock(e,t,n);return this.blockRegistry.isSolid(i)}onFallingBlock(e,t,n,i,r,o,a){const c=this.blockRegistry.get(a),l=(c==null?void 0:c.color)||"#888888",h=new Ne(l).getHex(),u=new cg(e,t,n,i,r,o,a,h);this.renderer.addToScene(u.mesh),this.fallingBlocks.push(u)}update(e){for(const n of this.entityMeshes.values())n.position.y+=Math.sin(Date.now()*.003)*.002,n.rotation.y+=e;for(let n=this.fallingBlocks.length-1;n>=0;n--){const i=this.fallingBlocks[n];i.update(e),i.completed&&(this.renderer.removeFromScene(i.mesh),i.mesh.geometry.dispose(),i.mesh.material.dispose(),this.updateBlock(i.toX,i.toY,i.toZ,i.blockType),this.fallingBlocks.splice(n,1))}const t=performance.now()/1e3;for(const n of this.chunks.values())n.isVegetation&&n.animateVegetation(t)}getChunkCount(){return this.chunks.size}getPendingChunkKeys(){return this.pendingChunks}}class hg{constructor(){D(this,"keys",new Set);D(this,"pointerLocked",!1);this.setupListeners()}setupListeners(){document.addEventListener("keydown",e=>{this.keys.add(e.code)}),document.addEventListener("keyup",e=>{this.keys.delete(e.code)}),window.addEventListener("blur",()=>{this.keys.clear(),this.pointerLocked=!1})}isKeyDown(e){return this.keys.has(e)}isPointerLocked(){return this.pointerLocked}setPointerLocked(e){this.pointerLocked=e}}class ug{constructor(){D(this,"audioContext",null);try{this.audioContext=new AudioContext}catch{console.warn("Web Audio API not available")}}play(e,t=.5){if(this.audioContext)switch(this.audioContext.state==="suspended"&&this.audioContext.resume(),e){case"block_break":this.playBlockBreak(t);break;case"block_place":this.playBlockPlace(t);break;case"footstep":this.playFootstep(t);break;case"hurt":this.playHurt(t);break;case"pickup":this.playPickup(t);break;case"death":this.playDeath(t);break}}playBlockBreak(e){if(!this.audioContext)return;const t=this.audioContext,n=.1,i=Math.floor(t.sampleRate*n),r=t.createBuffer(1,i,t.sampleRate),o=r.getChannelData(0);for(let l=0;l<i;l++)o[l]=(Math.random()*2-1)*(1-l/i);const a=t.createBufferSource();a.buffer=r;const c=t.createGain();c.gain.setValueAtTime(e*.3,t.currentTime),c.gain.exponentialRampToValueAtTime(.001,t.currentTime+n),a.connect(c),c.connect(t.destination),a.start()}playBlockPlace(e){if(!this.audioContext)return;const t=this.audioContext,n=.08,i=t.createOscillator();i.type="sine",i.frequency.setValueAtTime(150,t.currentTime),i.frequency.exponentialRampToValueAtTime(60,t.currentTime+n);const r=t.createGain();r.gain.setValueAtTime(e*.4,t.currentTime),r.gain.exponentialRampToValueAtTime(.001,t.currentTime+n),i.connect(r),r.connect(t.destination),i.start(),i.stop(t.currentTime+n)}playFootstep(e){if(!this.audioContext)return;const t=this.audioContext,n=.05,i=Math.floor(t.sampleRate*n),r=t.createBuffer(1,i,t.sampleRate),o=r.getChannelData(0);for(let l=0;l<i;l++)o[l]=(Math.random()*2-1)*(1-l/i)*.5;const a=t.createBufferSource();a.buffer=r;const c=t.createGain();c.gain.setValueAtTime(e*.1,t.currentTime),c.gain.exponentialRampToValueAtTime(.001,t.currentTime+n),a.connect(c),c.connect(t.destination),a.start()}playHurt(e){if(!this.audioContext)return;const t=this.audioContext,n=.2,i=t.createOscillator();i.type="sawtooth",i.frequency.setValueAtTime(200,t.currentTime);const r=t.createOscillator();r.type="square",r.frequency.setValueAtTime(153,t.currentTime);const o=t.createGain();o.gain.setValueAtTime(e*.3,t.currentTime),o.gain.exponentialRampToValueAtTime(.001,t.currentTime+n),i.connect(o),r.connect(o),o.connect(t.destination),i.start(),r.start(),i.stop(t.currentTime+n),r.stop(t.currentTime+n)}playPickup(e){if(!this.audioContext)return;const t=this.audioContext,n=.15,i=t.createOscillator();i.type="sine",i.frequency.setValueAtTime(400,t.currentTime),i.frequency.setValueAtTime(600,t.currentTime+.075);const r=t.createGain();r.gain.setValueAtTime(e*.25,t.currentTime),r.gain.setValueAtTime(e*.25,t.currentTime+.07),r.gain.exponentialRampToValueAtTime(.001,t.currentTime+n),i.connect(r),r.connect(t.destination),i.start(),i.stop(t.currentTime+n)}playDeath(e){if(!this.audioContext)return;const t=this.audioContext,n=.5,i=t.createOscillator();i.type="sawtooth",i.frequency.setValueAtTime(440,t.currentTime),i.frequency.exponentialRampToValueAtTime(55,t.currentTime+n);const r=t.createGain();r.gain.setValueAtTime(e*.35,t.currentTime),r.gain.exponentialRampToValueAtTime(.001,t.currentTime+n),i.connect(r),r.connect(t.destination),i.start(),i.stop(t.currentTime+n)}dispose(){var e;(e=this.audioContext)==null||e.close()}}const Xt=160,ec=32;class dg{constructor(e,t){D(this,"canvas");D(this,"ctx");D(this,"worldManager");D(this,"mode","surface");D(this,"updateTimer",0);D(this,"updateInterval",.5);D(this,"container");D(this,"position",new R);D(this,"yaw",0);this.worldManager=t,this.container=e,this.canvas=document.createElement("canvas"),this.canvas.width=Xt,this.canvas.height=Xt,this.canvas.id="minimap",this.canvas.style.cssText=`
            position: fixed; top: 10px; right: 10px;
            width: ${Xt}px; height: ${Xt}px;
            border: 2px solid rgba(255,255,255,0.5);
            border-radius: ${this.mode==="surface"?"50%":"4px"};
            z-index: 100; image-rendering: pixelated;
            cursor: pointer; opacity: 0.85;
        `,this.ctx=this.canvas.getContext("2d"),this.container.appendChild(this.canvas),this.canvas.addEventListener("click",()=>{const n=["surface","radar","normal"],i=n.indexOf(this.mode);this.mode=n[(i+1)%n.length],this.canvas.style.borderRadius=this.mode==="surface"?"50%":"4px"})}setPosition(e,t,n,i){this.position.set(e,t,n),this.yaw=i}update(e){if(this.updateTimer+=e,this.updateTimer<this.updateInterval)return;this.updateTimer=0;const t=Math.floor(this.position.x),n=Math.floor(this.position.y),i=Math.floor(this.position.z),r=Math.floor(ec/2),o=Xt/ec,a=this.ctx.createImageData(Xt,Xt),c=a.data;for(let u=-r;u<r;u++)for(let d=-r;d<r;d++){const m=Math.round(d*Math.cos(-this.yaw)-u*Math.sin(-this.yaw)),g=Math.round(d*Math.sin(-this.yaw)+u*Math.cos(-this.yaw)),_=t+m,p=i+g;let f=0;if(this.mode==="surface")for(let w=n+30;w>=n-30;w--){const A=this.worldManager.getBlock(_,w,p);if(A!==0&&!this.worldManager.getBlockRegistry().isLiquid(A)){f=A;break}}else if(this.mode==="radar")f=this.worldManager.getBlock(_,n,p);else{const w=this.worldManager.getBlock(_,n+1,p);w===0?f=this.worldManager.getBlock(_,n,p):f=w}const E=Math.floor((d+r)*o),y=Math.floor((u+r)*o);if(E<0||E>=Xt||y<0||y>=Xt)continue;const T=this.getBlockColor(f),P=(y*Xt+E)*4;c[P]=T[0],c[P+1]=T[1],c[P+2]=T[2],c[P+3]=255}this.ctx.putImageData(a,0,0);const l=Xt/2,h=Xt/2;this.ctx.fillStyle="#FF0000",this.ctx.beginPath(),this.ctx.arc(l,h,3,0,Math.PI*2),this.ctx.fill(),this.ctx.strokeStyle="#FFFFFF",this.ctx.lineWidth=2,this.ctx.beginPath(),this.ctx.moveTo(l,h),this.ctx.lineTo(l+Math.sin(this.yaw)*12,h-Math.cos(this.yaw)*12),this.ctx.stroke()}getBlockColor(e){if(e===0)return[30,100,200];const t=this.worldManager.getBlockRegistry().get(e);if(!t)return[0,0,0];const n=t.color,i=parseInt(n.slice(1,3),16),r=parseInt(n.slice(3,5),16),o=parseInt(n.slice(5,7),16);return[i,r,o]}setVisible(e){this.canvas.style.display=e?"block":"none"}destroy(){this.canvas.remove()}}class fg{constructor(e){D(this,"particles",[]);D(this,"geometry");D(this,"material");D(this,"points");D(this,"maxParticles",500);this.geometry=new Dt,this.material=new io({size:.15,vertexColors:!0,transparent:!0,opacity:.8,sizeAttenuation:!0,depthWrite:!1,blending:Wn}),this.points=new Bc(this.geometry,this.material),this.points.frustumCulled=!1,e.add(this.points)}emitBlockParticles(e,t,n,i,r=8){for(let o=0;o<r;o++)this.particles.length>=this.maxParticles&&this.particles.shift(),this.particles.push({position:new R(e+.2+Math.random()*.6,t+.2+Math.random()*.6,n+.2+Math.random()*.6),velocity:new R((Math.random()-.5)*3,Math.random()*4+1,(Math.random()-.5)*3),life:.5+Math.random()*.5,maxLife:.5+Math.random()*.5,size:.1+Math.random()*.1,color:i.clone().multiplyScalar(.8+Math.random()*.4),alpha:1})}emitPlaceParticles(e,t,n,i,r=6){for(let o=0;o<r;o++)this.particles.length>=this.maxParticles&&this.particles.shift(),this.particles.push({position:new R(e+Math.random(),t+Math.random(),n+Math.random()),velocity:new R((Math.random()-.5)*2,Math.random()*1.5,(Math.random()-.5)*2),life:.3+Math.random()*.3,maxLife:.3+Math.random()*.3,size:.08+Math.random()*.08,color:i.clone(),alpha:1})}emitDamageParticles(e,t,n,i=12){const r=[16711680,16729156,16737894,16746632];for(let o=0;o<i;o++)this.particles.length>=this.maxParticles&&this.particles.shift(),this.particles.push({position:new R(e+(Math.random()-.5)*.5,t+Math.random()*1.8,n+(Math.random()-.5)*.5),velocity:new R((Math.random()-.5)*2,Math.random()*3+1,(Math.random()-.5)*2),life:.4+Math.random()*.4,maxLife:.4+Math.random()*.4,size:.05+Math.random()*.1,color:new Ne(r[Math.floor(Math.random()*r.length)]),alpha:1})}emitSmokeParticles(e,t,n,i=4){for(let r=0;r<i;r++)this.particles.length>=this.maxParticles&&this.particles.shift(),this.particles.push({position:new R(e+.3+Math.random()*.4,t+.8+Math.random()*.4,n+.3+Math.random()*.4),velocity:new R((Math.random()-.5)*.5,.5+Math.random()*1,(Math.random()-.5)*.5),life:1+Math.random()*1,maxLife:1+Math.random()*1,size:.15+Math.random()*.15,color:new Ne(13421772),alpha:.5})}update(e){for(let t=this.particles.length-1;t>=0;t--){const n=this.particles[t];if(n.life-=e,n.life<=0){this.particles.splice(t,1);continue}n.velocity.y-=9.8*e,n.position.addScaledVector(n.velocity,e),n.alpha=n.life/n.maxLife*.8}this.updateGeometry()}updateGeometry(){const e=this.particles.length;if(e===0){this.geometry.setAttribute("position",new ht([],3)),this.geometry.setAttribute("color",new ht([],3));return}const t=new Float32Array(e*3),n=new Float32Array(e*3);for(let i=0;i<e;i++){const r=this.particles[i];t[i*3]=r.position.x,t[i*3+1]=r.position.y,t[i*3+2]=r.position.z,n[i*3]=r.color.r*r.alpha,n[i*3+1]=r.color.g*r.alpha,n[i*3+2]=r.color.b*r.alpha}this.geometry.setAttribute("position",new ht(t,3)),this.geometry.setAttribute("color",new ht(n,3))}destroy(){this.geometry.dispose(),this.material.dispose(),this.points.removeFromParent()}}class pg{constructor(e,t){D(this,"scene");D(this,"camera");D(this,"pivot");D(this,"currentMesh",null);D(this,"currentItemId","");D(this,"bobAngle",0);D(this,"bobSpeed",8);D(this,"bobAmount",.03);D(this,"swingAngle",0);D(this,"isSwinging",!1);this.scene=e,this.camera=t,this.pivot=new wn,this.scene.add(this.pivot)}updateItem(e,t,n){if(this.currentItemId===e&&this.currentMesh||(this.currentItemId=e,this.currentMesh&&(this.pivot.remove(this.currentMesh),this.currentMesh.geometry.dispose(),this.currentMesh.material instanceof gn&&this.currentMesh.material.dispose(),this.currentMesh=null),!e||e===""))return;const i=t!==null&&t>0;n.includes("pickaxe")||n.includes("sword")||n.includes("axe")||n.includes("shovel")||n.includes("hoe")||n.includes("shears")||n.includes("dagger")?this.currentMesh=this.createToolMesh(n):i?this.currentMesh=this.createBlockMesh(n):this.currentMesh=this.createItemMesh(n),this.currentMesh&&this.pivot.add(this.currentMesh)}createBlockMesh(e){const t=new at(.25,.25,.25),n=new It({color:8947848});return new $e(t,n)}createToolMesh(e){let t=9127187,n=6042391;if(e.includes("wooden")?(t=12357466,n=9127187):e.includes("stone")?(t=8421504,n=9127187):e.includes("iron")||e.includes("steel")?(t=14211288,n=6042391):e.includes("diamond")?(t=4910553,n=6042391):e.includes("gold")?(t=16766720,n=6042391):e.includes("mese")?(t=16776960,n=6042391):e.includes("blood")?(t=8912896,n=4004866):e.includes("fire")?(t=16737792,n=6042391):e.includes("ice")?(t=8965375,n=6042391):e.includes("heal")&&(t=4521796,n=6042391),e.includes("sword")){const o=new wn,a=new at(.04,.2,.04),c=new It({color:n}),l=new $e(a,c);l.position.y=-.05,o.add(l);const h=new at(.03,.25,.03),u=new It({color:t}),d=new $e(h,u);d.position.y=.12,o.add(d);const m=new at(.12,.02,.04),g=new It({color:4473924}),_=new $e(m,g);return _.position.y=.04,o.add(_),o}if(e.includes("pickaxe")){const o=new wn,a=new at(.04,.3,.04),c=new It({color:n}),l=new $e(a,c);l.rotation.z=.3,o.add(l);const h=new at(.2,.04,.04),u=new It({color:t}),d=new $e(h,u);return d.position.y=.14,d.position.x=.02,o.add(d),o}const i=new at(.05,.3,.05),r=new It({color:t});return new $e(i,r)}createItemMesh(e){const t=new at(.12,.12,.12);let n=13413068;e.includes("apple")?n=16720418:e.includes("bread")?n=13803616:e.includes("coal")?n=3355443:e.includes("iron_ingot")?n=14540253:e.includes("gold_ingot")?n=16766720:e.includes("diamond")?n=4910553:e.includes("stick")?n=9127187:e.includes("bucket")?n=8947848:e.includes("torch")?n=16766720:e.includes("bucket_water")&&(n=4491519);const i=new It({color:n});return new $e(t,i)}swing(){this.isSwinging=!0,this.swingAngle=-.8}update(e,t){this.bobAngle+=e*this.bobSpeed*(t?1:0),this.isSwinging&&(this.swingAngle+=e*6,this.swingAngle>=0&&(this.swingAngle=0,this.isSwinging=!1));const n=Math.sin(this.bobAngle)*this.bobAmount*(t?1:0),i=Math.cos(this.bobAngle*.5)*this.bobAmount*.5*(t?1:0),r=this.camera.quaternion.clone();this.pivot.position.copy(this.camera.position),this.pivot.position.add(new R(.4+i,-.35+n,-.5).applyQuaternion(r)),this.pivot.quaternion.copy(r),this.pivot.rotateZ(this.swingAngle)}destroy(){this.currentMesh&&this.currentMesh.geometry.dispose(),this.pivot.removeFromParent()}}class mg{constructor(e){D(this,"wireframe");D(this,"digOverlay");D(this,"digMaterial");D(this,"edges");D(this,"material");D(this,"visible",!1);const t=new at(1.005,1.005,1.005);this.edges=new Gm(t),this.material=new kc({color:0,linewidth:2,transparent:!0,opacity:.5}),this.wireframe=new Hm(this.edges,this.material),this.wireframe.visible=!1,e.add(this.wireframe);const n=new at(1.008,1.008,1.008);this.digMaterial=new Yn({color:0,transparent:!0,opacity:0,depthTest:!0,side:rn}),this.digOverlay=new $e(n,this.digMaterial),this.digOverlay.visible=!1,this.wireframe.add(this.digOverlay)}update(e,t){if(!e||!t){this.wireframe.visible=!1,this.visible=!1;return}const n=Math.floor(e.x-t.x*.5),i=Math.floor(e.y-t.y*.5),r=Math.floor(e.z-t.z*.5);this.wireframe.position.set(n+.5,i+.5,r+.5),this.wireframe.visible=!0,this.visible=!0}setDigProgress(e){e<=0?(this.digOverlay.visible=!1,this.digMaterial.opacity=0):(this.digOverlay.visible=!0,this.digMaterial.opacity=Math.min(e*.6,.6))}setVisible(e){this.wireframe.visible=e&&this.visible}isActive(){return this.visible}destroy(){this.edges.dispose(),this.material.dispose(),this.digMaterial.dispose(),this.digOverlay.geometry.dispose(),this.wireframe.removeFromParent()}}const As=800,Ir=50,Cs=35,gg=25,tc=.15;class _g{constructor(e){D(this,"rainPoints",null);D(this,"rainPositions",null);D(this,"rainVelocities",null);D(this,"isRaining",!1);D(this,"scene");D(this,"groundLevel",0);this.scene=e,this.initRain()}initRain(){const e=new Dt;this.rainPositions=new Float32Array(As*3),this.rainVelocities=new Float32Array(As);for(let n=0;n<As;n++)this.resetRaindrop(n,!0);e.setAttribute("position",new Yt(this.rainPositions,3));const t=new io({color:10075101,size:.3,transparent:!0,opacity:.6,depthWrite:!1});this.rainPoints=new Bc(e,t),this.rainPoints.visible=!1,this.scene.add(this.rainPoints)}resetRaindrop(e,t){if(!this.rainPositions)return;const n=Math.random()*Math.PI*2,i=Math.random()*Ir,r=e*3;this.rainPositions[r]=Math.cos(n)*i,this.rainPositions[r+1]=t?Math.random()*Cs:Cs+Math.random()*10,this.rainPositions[r+2]=Math.sin(n)*i,this.rainVelocities[e]=gg*(.8+Math.random()*.4)}setRaining(e){this.isRaining=e,this.rainPoints&&(this.rainPoints.visible=e)}getIsRaining(){return this.isRaining}update(e,t,n,i){if(!this.isRaining||!this.rainPoints||!this.rainPositions||!this.rainVelocities)return;this.groundLevel=n-10;const r=this.rainPoints.geometry.getAttribute("position");let o=!1;for(let a=0;a<As;a++){const c=a*3;this.rainPositions[c]+=Math.sin(tc)*this.rainVelocities[a]*e,this.rainPositions[c+1]-=this.rainVelocities[a]*e,this.rainPositions[c+2]+=Math.cos(tc)*this.rainVelocities[a]*e*.3,this.rainPositions[c+1]<this.groundLevel&&(this.rainPositions[c]=t+(Math.random()-.5)*Ir*2,this.rainPositions[c+1]=n+Cs*.5+Math.random()*Cs*.5,this.rainPositions[c+2]=i+(Math.random()-.5)*Ir*2,o=!0)}this.rainPoints.position.set(t,0,i),r.needsUpdate=o||!0}}class vg{constructor(e){D(this,"connection",null);D(this,"renderer");D(this,"playerController");D(this,"worldManager");D(this,"inputManager");D(this,"uiManager");D(this,"audioManager");D(this,"minimap");D(this,"particleSystem");D(this,"wieldItem");D(this,"selectionBox");D(this,"weatherSystem");D(this,"isRunning",!1);D(this,"lastTime",0);D(this,"frameCount",0);D(this,"fps",0);D(this,"fpsTimer",0);D(this,"chunkRequestTimer",0);D(this,"weatherTimer",0);D(this,"skyBrightness",1);this.uiManager=e,this.renderer=new Zm(document.getElementById("game-container")),this.worldManager=new lg(this.renderer),this.inputManager=new hg,this.audioManager=new ug,this.minimap=new dg(document.getElementById("game-container"),this.worldManager),this.particleSystem=new fg(this.renderer.getScene()),this.wieldItem=new pg(this.renderer.getScene(),this.renderer.getCamera()),this.selectionBox=new mg(this.renderer.getScene()),this.weatherSystem=new _g(this.renderer.getScene()),this.playerController=new sg(this.renderer.getCamera(),this.inputManager),this.playerController.setWorldManager(this.worldManager),this.playerController.setSelectionBox(this.selectionBox),this.playerController.setParticleEmitter((t,n,i,r)=>{this.onParticleEvent(t,n,i,r)}),this.applySettings(this.uiManager.getSettingsPanel().getSettings()),this.uiManager.getSettingsPanel().setOnSettingsChanged(t=>{this.applySettings(t)})}applySettings(e){this.renderer.setFov(e.fov)}async connect(e){this.connection=new Cl().withUrl("/game").withAutomaticReconnect().configureLogging(V.Information).build(),this.worldManager.setConnection(this.connection),this.playerController.setConnection(this.connection),this.setupServerHandlers(),this.uiManager.setConnection(this.connection);try{await this.connection.start(),await this.connection.invoke("Join",e),this.isRunning=!0,this.lastTime=performance.now(),this.gameLoop()}catch(t){this.uiManager.addChatMessage("Server",`Connection failed: ${t}`),this.showLoginScreen()}}setupServerHandlers(){this.connection&&(this.connection.on("OnChunkReceived",(e,t,n,i)=>{this.worldManager.loadChunk(e,t,n,i)}),this.connection.on("OnPlayerJoined",e=>{this.uiManager.addChatMessage("Server",`${e} joined the game`)}),this.connection.on("OnPlayerLeft",e=>{this.uiManager.addChatMessage("Server",`${e} left the game`),this.worldManager.removePlayer(e)}),this.connection.on("OnPlayerListUpdate",e=>{this.uiManager.updatePlayerList(e)}),this.connection.on("OnPlayerPositionUpdate",(e,t,n,i,r,o)=>{this.worldManager.updatePlayerPosition(e,t,n,i,r,o)}),this.connection.on("OnChatMessage",(e,t)=>{this.uiManager.addChatMessage(e,t)}),this.connection.on("OnBlockUpdate",(e,t,n,i)=>{this.worldManager.updateBlock(e,t,n,i)}),this.connection.on("OnHealthUpdate",(e,t)=>{this.uiManager.updateHealth(e,t),this.playerController.setHealth(e,t)}),this.connection.on("OnInventoryUpdate",e=>{this.uiManager.updateInventory(e),this.playerController.setInventory(e)}),this.connection.on("OnTimeUpdate",(e,t,n)=>{this.skyBrightness=n,this.renderer.updateSkyBrightness(n)}),this.connection.on("OnEntitySpawned",(e,t,n,i,r)=>{this.worldManager.spawnEntity(e,t,n,i,r)}),this.connection.on("OnEntityDespawned",e=>{this.worldManager.removeEntity(e)}),this.connection.on("OnEntityUpdate",(e,t,n,i)=>{this.worldManager.updateEntityPosition(e,t,n,i)}),this.connection.on("OnCraftResult",(e,t)=>{this.uiManager.addChatMessage("Server",`Crafted ${t}x ${e}`)}),this.connection.on("OnDeath",e=>{this.uiManager.showDeathScreen(e),this.playerController.handleDeath()}),this.connection.on("OnBlockDefinitions",e=>{this.worldManager.getBlockRegistry().loadFromServer(e)}),this.connection.on("OnBreathUpdate",(e,t)=>{this.uiManager.updateBreath(e,t)}),this.connection.on("OnKnockback",(e,t,n)=>{this.playerController.applyKnockback(e,t,n),this.audioManager.play("hurt"),this.renderer.flashDamage(.6)}),this.connection.on("OnPrivilegeList",e=>{this.uiManager.addChatMessage("Server",`Your privileges: ${e.join(", ")}`)}),this.connection.on("OnGameModeChanged",e=>{this.uiManager.addChatMessage("Server",`Game mode changed to: ${e}`),e==="creative"||e==="spectator"?this.playerController.setFlying(!0):this.playerController.setFlying(!1)}),this.connection.on("OnTeleported",(e,t,n)=>{}),this.connection.on("OnCraftingRecipes",e=>{this.uiManager.populateCraftingRecipes(e)}),this.connection.on("OnSmeltingRecipes",e=>{this.uiManager.populateSmeltingRecipes(e)}),this.connection.on("OnChestInventory",e=>{this.uiManager.updateChestInventory(e),this.uiManager.updateChestPlayerInventory(this.playerController.inventory)}),this.connection.on("OnFurnaceUpdate",(e,t,n,i)=>{this.uiManager.updateFurnaceState(e,t,n,i)}),this.connection.on("OnFallingBlock",(e,t,n,i,r,o,a)=>{this.worldManager.onFallingBlock(e,t,n,i,r,o,a)}))}sendChat(e){var t;(t=this.connection)==null||t.invoke("SendChat",e)}respawn(){var e;(e=this.connection)==null||e.invoke("Respawn"),this.playerController.respawn(),this.uiManager.hideDeathScreen()}useItem(e){var t;(t=this.connection)==null||t.invoke("UseItem",e)}craft(){var e;(e=this.connection)==null||e.invoke("Craft","")}getCraftingRecipes(){var e;(e=this.connection)==null||e.invoke("GetCraftingRecipes")}craftRecipe(e){var t;(t=this.connection)==null||t.invoke("CraftRecipe",e)}getSmeltingRecipes(){var e;(e=this.connection)==null||e.invoke("GetSmeltingRecipes")}startSmelting(e,t,n,i,r){var o;(o=this.connection)==null||o.invoke("StartSmelting",e,t,n,i,r)}getChestInventory(e,t,n){var i;(i=this.connection)==null||i.invoke("GetChestInventory",e,t,n)}moveItemToChest(e,t,n,i,r){var o;(o=this.connection)==null||o.invoke("MoveItemToChest",e,t,n,i,r)}takeItemFromChest(e,t,n,i,r){var o;(o=this.connection)==null||o.invoke("TakeItemFromChest",e,t,n,i,r)}getPrivileges(){var e;(e=this.connection)==null||e.invoke("GetPrivileges")}showCreativeInventory(){const e=this.worldManager.getBlockRegistry(),t=[];e.getAll().forEach((n,i)=>{i>0&&t.push({id:i,name:n.name,color:n.color,solid:n.solid})}),t.sort((n,i)=>n.id-i.id),this.uiManager.setCreativeSelectHandler(n=>{this.playerController.setSelectedBlockType(n)}),this.uiManager.showCreativeInventory(t)}gameLoop(){if(!this.isRunning)return;requestAnimationFrame(()=>this.gameLoop());const e=performance.now(),t=(e-this.lastTime)/1e3;this.lastTime=e,this.frameCount++,this.fpsTimer+=t,this.fpsTimer>=1&&(this.fps=Math.round(this.frameCount/this.fpsTimer),this.frameCount=0,this.fpsTimer=0),this.playerController.isDead||this.playerController.update(t),this.minimap.setPosition(this.playerController.getPosition().x,this.playerController.getPosition().y,this.playerController.getPosition().z,this.playerController.getYaw()*Math.PI/180),this.minimap.update(t),this.particleSystem.update(t);const n=this.playerController.getSelectedSlot(),i=this.playerController.inventory;i[n]?this.wieldItem.updateItem(i[n].itemId||"",i[n].blockId||null,i[n].itemName||""):this.wieldItem.updateItem("",null,""),this.wieldItem.update(t,this.playerController.getOnGround()),this.chunkRequestTimer+=t,this.chunkRequestTimer>=2&&(this.chunkRequestTimer=0,this.worldManager.requestChunksAroundPlayer(this.playerController.getPosition())),this.worldManager.update(t),this.renderer.updateClouds(t),this.renderer.updateEffects(t),this.weatherTimer+=t,this.weatherTimer>=5&&(this.weatherTimer=0,this.skyBrightness<.3?this.weatherSystem.setRaining(!0):this.weatherSystem.setRaining(Math.random()<.2),this.renderer.setRaining(this.weatherSystem.getIsRaining()));const r=this.playerController.getPosition();this.weatherSystem.update(t,r.x,r.y,r.z);const o=this.playerController.getVelocity(),a=o.x*o.x+o.z*o.z>.5;if(this.worldManager.animatePlayer("__local__",a,t),r.y<30){const c=this.checkSkyAccess(Math.floor(r.x),Math.floor(r.y)+2,Math.floor(r.z));this.renderer.updateCaveDarkness(r.y,!c)}else this.renderer.updateCaveDarkness(r.y,!1);this.renderer.updateLavaEffect(this.checkNearLava(r)),this.renderer.render(),this.uiManager.updateDebugInfo(this.fps,this.playerController.getPosition(),this.worldManager.getChunkCount()),this.sendPositionUpdate()}sendPositionUpdate(){if(!this.connection)return;const e=this.playerController.getPosition(),t=this.playerController.getVelocity(),n=this.playerController.getYaw(),i=this.playerController.getPitch();this.connection.invoke("UpdatePosition",e.x,e.y,e.z,t.x,t.y,t.z,n,i)}showLoginScreen(){const e=document.getElementById("login-screen");e.style.display="flex"}onParticleEvent(e,t,n,i){var o;const r=new Ne(((o=this.worldManager.getBlockRegistry().get(this.worldManager.getBlock(e,t,n)))==null?void 0:o.color)||"#888888");switch(i){case"dig":this.particleSystem.emitBlockParticles(e,t,n,r,8);break;case"place":this.particleSystem.emitPlaceParticles(e,t,n,r,6);break;case"damage":this.particleSystem.emitDamageParticles(this.playerController.getPosition().x,this.playerController.getPosition().y,this.playerController.getPosition().z);break;case"smoke":this.particleSystem.emitSmokeParticles(e,t,n,4);break}}checkSkyAccess(e,t,n){for(let i=t;i<80;i+=3)if(this.worldManager.isSolid(e,i,n))return!1;return!0}checkNearLava(e){const n=Math.floor(e.x),i=Math.floor(e.y),r=Math.floor(e.z);for(let o=-4;o<=4;o++)for(let a=-4;a<=4;a++)for(let c=-4;c<=4;c++){if(o*o+a*a+c*c>4*4)continue;const l=this.worldManager.getBlock(n+o,i+a,r+c),h=this.worldManager.getBlockRegistry().get(l);if(h&&(h.name==="default:lava"||h.name==="default:lava_source"))return!0}return!1}}const En={mouseSensitivity:.002,renderDistance:4,fov:70,musicVolume:.5,soundVolume:.5,cloudsEnabled:!0,aoEnabled:!0},nc="helloworld_settings";class xg{constructor(){D(this,"element",null);D(this,"overlay",null);D(this,"settings");D(this,"onSettingsChanged",null);this.settings=this.loadSettings()}getSettings(){return{...this.settings}}setOnSettingsChanged(e){this.onSettingsChanged=e}isOpen(){return this.element!==null}show(){if(this.element)return;this.overlay=document.createElement("div"),this.overlay.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:599;",this.overlay.addEventListener("click",()=>this.hide()),this.element=document.createElement("div"),this.element.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(40,40,50,0.95);color:white;padding:24px 28px;border-radius:8px;z-index:600;width:380px;font-family:monospace;";const e=document.createElement("div");e.style.cssText="font-size:20px;font-weight:bold;margin-bottom:16px;text-align:center;",e.textContent="Settings";const t=document.createElement("button");t.style.cssText="position:absolute;top:8px;right:14px;cursor:pointer;background:none;border:none;color:white;font-size:22px;",t.textContent="X",t.addEventListener("click",()=>this.hide()),this.element.appendChild(t),this.element.appendChild(e),this.element.appendChild(this.createSlider("Mouse Sensitivity",this.settings.mouseSensitivity,.001,.01,.001,n=>{this.settings.mouseSensitivity=n})),this.element.appendChild(this.createSlider("Render Distance",this.settings.renderDistance,2,8,1,n=>{this.settings.renderDistance=Math.round(n)})),this.element.appendChild(this.createSlider("FOV",this.settings.fov,50,110,1,n=>{this.settings.fov=Math.round(n)})),this.element.appendChild(this.createSlider("Music Volume",this.settings.musicVolume,0,1,.05,n=>{this.settings.musicVolume=n})),this.element.appendChild(this.createSlider("Sound Volume",this.settings.soundVolume,0,1,.05,n=>{this.settings.soundVolume=n})),this.element.appendChild(this.createToggle("Clouds",this.settings.cloudsEnabled,n=>{this.settings.cloudsEnabled=n})),this.element.appendChild(this.createToggle("Ambient Occlusion",this.settings.aoEnabled,n=>{this.settings.aoEnabled=n})),document.body.appendChild(this.overlay),document.body.appendChild(this.element),document.exitPointerLock()}hide(){var e,t;this.element&&((e=this.element.parentNode)==null||e.removeChild(this.element),this.element=null),this.overlay&&((t=this.overlay.parentNode)==null||t.removeChild(this.overlay),this.overlay=null),this.saveSettings(),this.onSettingsChanged&&this.onSettingsChanged(this.settings)}createSlider(e,t,n,i,r,o){const a=document.createElement("div");a.style.cssText="margin-bottom:14px;";const c=document.createElement("div");c.style.cssText="display:flex;justify-content:space-between;margin-bottom:4px;font-size:13px;";const l=document.createElement("span");l.textContent=e;const h=document.createElement("span");h.style.cssText="color:#88aaff;",h.textContent=String(t),c.appendChild(l),c.appendChild(h);const u=document.createElement("input");return u.type="range",u.min=String(n),u.max=String(i),u.step=String(r),u.value=String(t),u.style.cssText="width:100%;cursor:pointer;",u.addEventListener("input",()=>{const d=parseFloat(u.value);h.textContent=r<1?d.toFixed(3):String(Math.round(d)),o(d)}),a.appendChild(c),a.appendChild(u),a}createToggle(e,t,n){const i=document.createElement("div");i.style.cssText="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-size:13px;";const r=document.createElement("span");r.textContent=e;const o=document.createElement("input");return o.type="checkbox",o.checked=t,o.style.cssText="width:18px;height:18px;cursor:pointer;",o.addEventListener("change",()=>{n(o.checked)}),i.appendChild(r),i.appendChild(o),i}loadSettings(){try{const e=localStorage.getItem(nc);if(e){const t=JSON.parse(e);return{mouseSensitivity:t.mouseSensitivity??En.mouseSensitivity,renderDistance:t.renderDistance??En.renderDistance,fov:t.fov??En.fov,musicVolume:t.musicVolume??En.musicVolume,soundVolume:t.soundVolume??En.soundVolume,cloudsEnabled:t.cloudsEnabled??En.cloudsEnabled,aoEnabled:t.aoEnabled??En.aoEnabled}}}catch{}return{...En}}saveSettings(){try{localStorage.setItem(nc,JSON.stringify(this.settings))}catch{}}}class yg{constructor(){D(this,"_connection",null);D(this,"chatMessages");D(this,"healthBar");D(this,"hotbar");D(this,"debugInfo");D(this,"deathScreen",null);D(this,"craftingUI",null);D(this,"breathBar",null);D(this,"furnaceUI",null);D(this,"chestUI",null);D(this,"creativeInventoryUI",null);D(this,"chestPosition",null);D(this,"furnacePosition",null);D(this,"creativePage",0);D(this,"creativeFilter","");D(this,"creativeEntries",[]);D(this,"onCreativeSelect",null);D(this,"settingsPanel");this.chatMessages=document.getElementById("chat-messages"),this.healthBar=document.getElementById("health-bar"),this.hotbar=document.getElementById("hotbar"),this.debugInfo=document.getElementById("debug-info"),this.settingsPanel=new xg,this.setupHotbar()}setConnection(e){this._connection=e,document.addEventListener("blockAction",t=>{if(!this._connection)return;const{type:n,x:i,y:r,z:o,blockType:a}=t.detail;n==="dig"?this._connection.invoke("DigBlock",i,r,o):n==="place"&&this._connection.invoke("PlaceBlock",i,r,o,a)}),document.addEventListener("interactBlock",t=>{if(!this._connection)return;const{x:n,y:i,z:r,blockName:o}=t.detail;o==="chest"?(this.showChestUI(n,i,r),this._connection.invoke("GetChestInventory",n,i,r)):o==="furnace"?(this.showFurnaceUI(n,i,r),this._connection.invoke("GetSmeltingRecipes")):o==="crafting_table"&&(this.showCraftingUI(),this._connection.invoke("GetCraftingRecipes"))}),document.addEventListener("openCrafting",()=>{this._connection&&(this.showCraftingUI(),this._connection.invoke("GetCraftingRecipes"))})}setupHotbar(){this.hotbar.innerHTML="";for(let e=0;e<8;e++){const t=document.createElement("div");t.className="hotbar-slot",t.innerHTML=`<span style="font-size:12px;color:#aaa">${e+1}</span>`,e===0&&t.classList.add("selected"),this.hotbar.appendChild(t)}}addChatMessage(e,t){const n=document.createElement("div");for(n.className="chat-message",n.innerHTML=`<span class="sender">${e}:</span> ${t}`,this.chatMessages.appendChild(n),this.chatMessages.scrollTop=this.chatMessages.scrollHeight;this.chatMessages.children.length>100;)this.chatMessages.removeChild(this.chatMessages.firstChild)}updateHealth(e,t){const n=Math.ceil(t/2);this.healthBar.innerHTML="";for(let i=0;i<n;i++){const r=document.createElement("div");r.className="heart",e-i*2<=0&&r.classList.add("empty"),this.healthBar.appendChild(r)}}updateInventory(e){for(let t=0;t<8;t++){const n=this.hotbar.children[t];if(e[t]&&e[t].itemId){const i=e[t];let r=`<span style="font-size:11px;color:white">${i.itemId.replace(/_/g," ")}</span>`;i.count>1&&(r+=`<span style="position:absolute;bottom:2px;right:4px;font-size:10px;color:white">${i.count}</span>`),n.innerHTML=r,i.metadata&&(n.style.borderBottom="2px solid #00ff00")}else n.innerHTML=`<span style="font-size:12px;color:#aaa">${t+1}</span>`,n.style.borderBottom=""}}updatePlayerList(e){let t=document.getElementById("player-list-panel");if(t||(t=document.createElement("div"),t.id="player-list-panel",t.style.cssText="position:fixed;top:10px;right:10px;background:rgba(0,0,0,0.6);color:white;padding:8px 12px;border-radius:4px;font-size:13px;max-height:300px;overflow-y:auto;z-index:100;display:none;",document.body.appendChild(t)),e.length===0){t.style.display="none";return}t.style.display="block",t.innerHTML=`<div style="font-weight:bold;margin-bottom:4px">Players (${e.length})</div>`;for(const n of e){const i=document.createElement("div");i.textContent=n,t.appendChild(i)}}setSelectedSlot(e){const t=this.hotbar.children;for(let n=0;n<t.length;n++)t[n].classList.toggle("selected",n===e)}updateHotbarSelection(e){const t=this.hotbar.children;for(let n=0;n<t.length;n++)t[n].classList.toggle("selected",n===e)}showDeathScreen(e){this.hideDeathScreen(),this.deathScreen=document.createElement("div"),this.deathScreen.id="death-screen",this.deathScreen.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(150,0,0,0.5);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:1000;";const t=document.createElement("div");t.style.cssText="font-size:48px;color:#ff4444;font-weight:bold;margin-bottom:16px;text-shadow:2px 2px 4px black;",t.textContent="You Died!";const n=document.createElement("div");n.style.cssText="font-size:20px;color:#ffaaaa;margin-bottom:24px;",n.textContent=e;const i=document.createElement("button");i.id="respawn-button",i.style.cssText="padding:12px 32px;font-size:18px;cursor:pointer;background:#cc2222;color:white;border:2px solid #ff4444;border-radius:4px;",i.textContent="Respawn",i.addEventListener("click",()=>{const r=new CustomEvent("respawnRequest");document.dispatchEvent(r)}),this.deathScreen.appendChild(t),this.deathScreen.appendChild(n),this.deathScreen.appendChild(i),document.body.appendChild(this.deathScreen),document.exitPointerLock()}hideDeathScreen(){this.deathScreen&&this.deathScreen.parentNode&&(this.deathScreen.parentNode.removeChild(this.deathScreen),this.deathScreen=null)}showCraftingUI(){this.hideCraftingUI(),this.hideFurnaceUI(),this.hideChestUI(),document.exitPointerLock(),this.craftingUI=document.createElement("div"),this.craftingUI.id="crafting-ui",this.craftingUI.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(60,40,20,0.95);color:white;padding:20px;border-radius:8px;z-index:500;width:420px;max-height:80vh;display:flex;flex-direction:column;";const e=document.createElement("div");e.style.cssText="font-size:20px;font-weight:bold;margin-bottom:12px;text-align:center;",e.textContent="Crafting";const t=document.createElement("button");t.style.cssText="position:absolute;top:8px;right:12px;cursor:pointer;background:none;border:none;color:white;font-size:20px;",t.textContent="X",t.addEventListener("click",()=>{this.hideCraftingUI()});const n=document.createElement("div");n.id="crafting-body",n.style.cssText="font-size:13px;overflow-y:auto;flex:1;",n.textContent="Loading recipes...";const i=document.createElement("div");i.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;z-index:499;",i.addEventListener("click",()=>{this.hideCraftingUI()}),this.craftingUI.appendChild(t),this.craftingUI.appendChild(e),this.craftingUI.appendChild(n),document.body.appendChild(i),document.body.appendChild(this.craftingUI)}hideCraftingUI(){var e,t;if(this.craftingUI&&this.craftingUI.parentNode){const n=this.craftingUI.previousElementSibling;n&&((e=n.style)==null?void 0:e.zIndex)==="499"&&((t=n.parentNode)==null||t.removeChild(n)),this.craftingUI.parentNode.removeChild(this.craftingUI),this.craftingUI=null}}populateCraftingRecipes(e){if(!this.craftingUI)return;const t=document.getElementById("crafting-body");if(t){if(t.innerHTML="",e.length===0){t.textContent="No crafting recipes available.";return}for(let n=0;n<e.length;n++){const i=e[n],r=document.createElement("div");r.style.cssText="display:flex;align-items:center;justify-content:space-between;padding:6px 8px;margin:3px 0;background:rgba(0,0,0,0.3);border-radius:4px;cursor:pointer;",r.addEventListener("mouseenter",()=>{r.style.background="rgba(100,80,40,0.6)"}),r.addEventListener("mouseleave",()=>{r.style.background="rgba(0,0,0,0.3)"});const o=document.createElement("div");o.style.cssText="flex:1;";const a=document.createElement("div");a.style.cssText="font-weight:bold;color:#ffdd44;";const c=i.resultCount>1?` x${i.resultCount}`:"";a.textContent=`${this.formatItemName(i.result)}${c}`;const l=document.createElement("div");l.style.cssText="font-size:11px;color:#aaa;margin-top:2px;";const h=i.ingredients.map(([m,g])=>`${g}x ${this.formatItemName(m)}`).join(", ");l.textContent=h,o.appendChild(a),o.appendChild(l);const u=document.createElement("button");u.style.cssText="padding:4px 12px;cursor:pointer;background:#556b2f;color:white;border:1px solid #6b8e23;border-radius:3px;font-size:12px;",u.textContent="Craft";const d=n;u.addEventListener("click",m=>{var g;m.stopPropagation(),(g=this._connection)==null||g.invoke("CraftRecipe",d)}),r.appendChild(o),r.appendChild(u),t.appendChild(r)}}}showFurnaceUI(e,t,n){this.hideCraftingUI(),this.hideFurnaceUI(),this.hideChestUI(),document.exitPointerLock(),this.furnacePosition={x:e,y:t,z:n},this.furnaceUI=document.createElement("div"),this.furnaceUI.id="furnace-ui",this.furnaceUI.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(50,50,50,0.95);color:white;padding:20px;border-radius:8px;z-index:500;width:400px;max-height:80vh;display:flex;flex-direction:column;";const i=document.createElement("div");i.style.cssText="font-size:20px;font-weight:bold;margin-bottom:12px;text-align:center;",i.textContent="Furnace";const r=document.createElement("button");r.style.cssText="position:absolute;top:8px;right:12px;cursor:pointer;background:none;border:none;color:white;font-size:20px;",r.textContent="X",r.addEventListener("click",()=>{this.hideFurnaceUI()});const o=document.createElement("div");o.style.cssText="display:flex;gap:16px;justify-content:center;margin-bottom:12px;align-items:center;";const a=document.createElement("div");a.id="furnace-input-slot",a.style.cssText="width:50px;height:50px;background:rgba(0,0,0,0.4);border:2px solid #555;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#aaa;text-align:center;",a.textContent="Input";const c=document.createElement("div");c.style.cssText="font-size:20px;color:#ff8800;",c.textContent="→";const l=document.createElement("div");l.id="furnace-fuel-slot",l.style.cssText="width:50px;height:50px;background:rgba(0,0,0,0.4);border:2px solid #555;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#aaa;text-align:center;",l.textContent="Fuel";const h=document.createElement("div");h.style.cssText="font-size:20px;color:#ff8800;",h.textContent="→";const u=document.createElement("div");u.id="furnace-output-slot",u.style.cssText="width:50px;height:50px;background:rgba(0,0,0,0.4);border:2px solid #555;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#aaa;text-align:center;",u.textContent="Output",o.appendChild(a),o.appendChild(c),o.appendChild(l),o.appendChild(h),o.appendChild(u);const d=document.createElement("div");d.style.cssText="width:100%;height:16px;background:rgba(0,0,0,0.4);border-radius:8px;margin-bottom:12px;overflow:hidden;";const m=document.createElement("div");m.id="furnace-progress-fill",m.style.cssText="width:0%;height:100%;background:linear-gradient(90deg,#ff4400,#ff8800);border-radius:8px;transition:width 0.5s;",d.appendChild(m);const g=document.createElement("div");g.style.cssText="font-size:14px;font-weight:bold;margin-bottom:6px;color:#ccc;",g.textContent="Smelting Recipes";const _=document.createElement("div");_.id="smelting-recipes-list",_.style.cssText="font-size:12px;overflow-y:auto;flex:1;",_.textContent="Loading recipes...";const p=document.createElement("div");p.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;z-index:499;",p.addEventListener("click",()=>{this.hideFurnaceUI()}),this.furnaceUI.appendChild(r),this.furnaceUI.appendChild(i),this.furnaceUI.appendChild(o),this.furnaceUI.appendChild(d),this.furnaceUI.appendChild(g),this.furnaceUI.appendChild(_),document.body.appendChild(p),document.body.appendChild(this.furnaceUI)}hideFurnaceUI(){this.furnaceUI&&this.furnaceUI.parentNode&&(this.furnaceUI.parentNode.removeChild(this.furnaceUI),this.furnaceUI=null),this.furnacePosition=null}populateSmeltingRecipes(e){if(!this.furnaceUI)return;const t=document.getElementById("smelting-recipes-list");if(t){if(t.innerHTML="",e.length===0){t.textContent="No smelting recipes available.";return}for(let n=0;n<e.length;n++){const i=e[n],r=document.createElement("div");r.style.cssText="display:flex;align-items:center;justify-content:space-between;padding:5px 8px;margin:2px 0;background:rgba(0,0,0,0.3);border-radius:4px;";const o=document.createElement("div");o.style.cssText="flex:1;font-size:12px;",o.textContent=`${this.formatItemName(i.input)} → ${this.formatItemName(i.result)} (${i.cookTime}s)`;const a=document.createElement("button");a.style.cssText="padding:3px 10px;cursor:pointer;background:#8b4513;color:white;border:1px solid #a0522d;border-radius:3px;font-size:11px;",a.textContent="Smelt",a.addEventListener("click",()=>{var c;this.furnacePosition&&((c=this._connection)==null||c.invoke("StartSmelting",i.input,i.result,this.furnacePosition.x,this.furnacePosition.y,this.furnacePosition.z),a.textContent="...",a.disabled=!0)}),r.appendChild(o),r.appendChild(a),t.appendChild(r)}}}updateFurnaceState(e,t,n,i){if(!this.furnaceUI)return;const r=document.getElementById("furnace-input-slot"),o=document.getElementById("furnace-fuel-slot"),a=document.getElementById("furnace-output-slot"),c=document.getElementById("furnace-progress-fill");r&&(r.textContent=e?this.formatItemName(e):"Input",r.style.color=e?"#ffdd44":"#aaa"),o&&(o.textContent=t?this.formatItemName(t):"Fuel",o.style.color=t?"#44dd44":"#aaa"),a&&(a.textContent=n?this.formatItemName(n):"Output",a.style.color=n?"#44aaff":"#aaa"),c&&(c.style.width=`${Math.round(i*100)}%`)}showChestUI(e,t,n){this.hideCraftingUI(),this.hideFurnaceUI(),this.hideChestUI(),document.exitPointerLock(),this.chestPosition={x:e,y:t,z:n},this.chestUI=document.createElement("div"),this.chestUI.id="chest-ui",this.chestUI.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(101,67,33,0.95);color:white;padding:20px;border-radius:8px;z-index:500;width:380px;max-height:80vh;display:flex;flex-direction:column;";const i=document.createElement("div");i.style.cssText="font-size:20px;font-weight:bold;margin-bottom:12px;text-align:center;",i.textContent="Chest";const r=document.createElement("button");r.style.cssText="position:absolute;top:8px;right:12px;cursor:pointer;background:none;border:none;color:white;font-size:20px;",r.textContent="X",r.addEventListener("click",()=>{this.hideChestUI()});const o=document.createElement("div");o.style.cssText="font-size:12px;color:#ccc;margin-bottom:6px;",o.textContent="Chest Inventory";const a=document.createElement("div");a.id="chest-grid",a.style.cssText="display:grid;grid-template-columns:repeat(9,1fr);gap:3px;margin-bottom:16px;";for(let u=0;u<27;u++){const d=document.createElement("div");d.className="chest-slot",d.dataset.slot=String(u),d.style.cssText="width:36px;height:36px;background:rgba(0,0,0,0.4);border:1px solid #555;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:9px;color:#aaa;text-align:center;cursor:pointer;position:relative;",d.textContent="";const m=u;d.addEventListener("click",()=>{var g;this.chestPosition&&((g=this._connection)==null||g.invoke("TakeItemFromChest",m,0,this.chestPosition.x,this.chestPosition.y,this.chestPosition.z))}),a.appendChild(d)}const c=document.createElement("div");c.style.cssText="font-size:12px;color:#ccc;margin-bottom:6px;",c.textContent="Your Inventory (click to store)";const l=document.createElement("div");l.id="chest-inv-grid",l.style.cssText="display:grid;grid-template-columns:repeat(8,1fr);gap:3px;";for(let u=0;u<8;u++){const d=document.createElement("div");d.className="chest-inv-slot",d.dataset.slot=String(u),d.style.cssText="width:36px;height:36px;background:rgba(0,0,0,0.4);border:1px solid #555;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:9px;color:#aaa;text-align:center;cursor:pointer;position:relative;",d.textContent="";const m=u;d.addEventListener("click",()=>{var g;this.chestPosition&&((g=this._connection)==null||g.invoke("MoveItemToChest",m,-1,this.chestPosition.x,this.chestPosition.y,this.chestPosition.z))}),l.appendChild(d)}const h=document.createElement("div");h.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;z-index:499;",h.addEventListener("click",()=>{this.hideChestUI()}),this.chestUI.appendChild(r),this.chestUI.appendChild(i),this.chestUI.appendChild(o),this.chestUI.appendChild(a),this.chestUI.appendChild(c),this.chestUI.appendChild(l),document.body.appendChild(h),document.body.appendChild(this.chestUI)}hideChestUI(){this.chestUI&&this.chestUI.parentNode&&(this.chestUI.parentNode.removeChild(this.chestUI),this.chestUI=null),this.chestPosition=null}updateChestInventory(e){if(!this.chestUI)return;const t=document.getElementById("chest-grid");if(!t)return;const n=t.children;for(let i=0;i<27;i++){const r=n[i];if(e[i]&&e[i].itemId){const o=e[i];if(r.textContent=this.formatItemName(o.itemId),r.style.color="#ffdd44",r.style.fontSize="8px",o.count>1){const a=document.createElement("span");a.style.cssText="position:absolute;bottom:1px;right:2px;font-size:9px;color:white;text-shadow:1px 1px 1px black;",a.textContent=String(o.count),r.appendChild(a)}}else r.textContent="",r.style.color="#aaa",r.style.fontSize="9px"}}updateChestPlayerInventory(e){if(!this.chestUI)return;const t=document.getElementById("chest-inv-grid");if(!t)return;const n=t.children;for(let i=0;i<8;i++){const r=n[i];if(e[i]&&e[i].itemId){const o=e[i];if(r.textContent=this.formatItemName(o.itemId),r.style.color="#44ddff",r.style.fontSize="8px",o.count>1){const a=document.createElement("span");a.style.cssText="position:absolute;bottom:1px;right:2px;font-size:9px;color:white;text-shadow:1px 1px 1px black;",a.textContent=String(o.count),r.appendChild(a)}}else r.textContent="",r.style.color="#aaa",r.style.fontSize="9px"}}hideAllUIs(){this.hideCraftingUI(),this.hideFurnaceUI(),this.hideChestUI(),this.hideCreativeInventory()}setCreativeSelectHandler(e){this.onCreativeSelect=e}showCreativeInventory(e){this.hideCraftingUI(),this.hideFurnaceUI(),this.hideChestUI(),this.hideCreativeInventory(),document.exitPointerLock(),this.creativeEntries=e.filter(d=>d.id>0),this.creativePage=0,this.creativeFilter="",this.creativeInventoryUI=document.createElement("div"),this.creativeInventoryUI.id="creative-inventory-ui",this.creativeInventoryUI.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(40,40,60,0.95);color:white;padding:20px;border-radius:8px;z-index:500;width:520px;max-height:80vh;display:flex;flex-direction:column;";const t=document.createElement("div");t.style.cssText="font-size:20px;font-weight:bold;margin-bottom:12px;text-align:center;display:flex;justify-content:space-between;align-items:center;";const n=document.createElement("span");n.textContent="Creative Inventory";const i=document.createElement("button");i.style.cssText="cursor:pointer;background:none;border:none;color:white;font-size:20px;",i.textContent="X",i.addEventListener("click",()=>{this.hideCreativeInventory()}),t.appendChild(n),t.appendChild(i);const r=document.createElement("input");r.type="text",r.placeholder="Search blocks...",r.style.cssText="width:100%;padding:8px;margin-bottom:12px;background:rgba(0,0,0,0.4);border:1px solid #555;border-radius:4px;color:white;font-size:14px;outline:none;box-sizing:border-box;",r.addEventListener("input",()=>{this.creativeFilter=r.value.toLowerCase(),this.creativePage=0,this.renderCreativeGrid()});const o=document.createElement("div");o.id="creative-grid-container",o.style.cssText="flex:1;overflow-y:auto;";const a=document.createElement("div");a.style.cssText="display:flex;justify-content:center;gap:12px;margin-top:12px;align-items:center;";const c=document.createElement("button");c.style.cssText="padding:6px 16px;cursor:pointer;background:#555;color:white;border:1px solid #777;border-radius:4px;font-size:13px;",c.textContent="← Prev",c.addEventListener("click",()=>{this.creativePage>0&&(this.creativePage--,this.renderCreativeGrid())});const l=document.createElement("span");l.id="creative-page-info",l.style.cssText="font-size:13px;color:#aaa;";const h=document.createElement("button");h.style.cssText="padding:6px 16px;cursor:pointer;background:#555;color:white;border:1px solid #777;border-radius:4px;font-size:13px;",h.textContent="Next →",h.addEventListener("click",()=>{this.creativePage++,this.renderCreativeGrid()}),a.appendChild(c),a.appendChild(l),a.appendChild(h);const u=document.createElement("div");u.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;z-index:499;",u.addEventListener("click",()=>{this.hideCreativeInventory()}),this.creativeInventoryUI.appendChild(t),this.creativeInventoryUI.appendChild(r),this.creativeInventoryUI.appendChild(o),this.creativeInventoryUI.appendChild(a),document.body.appendChild(u),document.body.appendChild(this.creativeInventoryUI),this.renderCreativeGrid()}renderCreativeGrid(){const e=document.getElementById("creative-grid-container");if(!e)return;e.innerHTML="";let t=this.creativeEntries;this.creativeFilter&&(t=this.creativeEntries.filter(l=>l.name.toLowerCase().includes(this.creativeFilter)));const n=32,i=Math.max(1,Math.ceil(t.length/n));this.creativePage>=i&&(this.creativePage=i-1);const r=this.creativePage*n,o=t.slice(r,r+n),a=document.createElement("div");a.style.cssText="display:grid;grid-template-columns:repeat(8,1fr);gap:4px;";for(const l of o){const h=document.createElement("div");h.style.cssText="width:52px;height:52px;background:rgba(0,0,0,0.4);border:2px solid #555;border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;position:relative;transition:border-color 0.1s;";const u=document.createElement("div");u.style.cssText=`width:28px;height:28px;background:${l.color};border-radius:3px;border:1px solid rgba(255,255,255,0.2);`,h.appendChild(u);const d=document.createElement("span");d.style.cssText="font-size:8px;color:#ccc;margin-top:2px;text-align:center;line-height:1.1;max-width:48px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;",d.textContent=l.name.replace(/_/g," "),h.appendChild(d),h.addEventListener("mouseenter",()=>{h.style.borderColor="#aaddff",h.style.background="rgba(100,150,200,0.3)"}),h.addEventListener("mouseleave",()=>{h.style.borderColor="#555",h.style.background="rgba(0,0,0,0.4)"}),h.addEventListener("click",()=>{var m;(m=this.onCreativeSelect)==null||m.call(this,l.id),this.hideCreativeInventory()}),a.appendChild(h)}e.appendChild(a);const c=document.getElementById("creative-page-info");c&&(c.textContent=`${this.creativePage+1} / ${i} (${t.length} items)`)}hideCreativeInventory(){var e,t;if(this.creativeInventoryUI&&this.creativeInventoryUI.parentNode){const n=this.creativeInventoryUI.previousElementSibling;n&&((e=n.style)==null?void 0:e.zIndex)==="499"&&((t=n.parentNode)==null||t.removeChild(n)),this.creativeInventoryUI.parentNode.removeChild(this.creativeInventoryUI),this.creativeInventoryUI=null}}showSettingsPanel(){this.settingsPanel.show()}hideSettingsPanel(){this.settingsPanel.hide()}isSettingsPanelOpen(){return this.settingsPanel.isOpen()}getSettingsPanel(){return this.settingsPanel}updateBreath(e,t){if(this.breathBar||(this.breathBar=document.createElement("div"),this.breathBar.id="breath-bar",this.breathBar.style.cssText="position:fixed;bottom:60px;left:50%;transform:translateX(-50%);display:none;gap:2px;",document.body.appendChild(this.breathBar)),e>=t){this.breathBar.style.display="none";return}this.breathBar.style.display="flex",this.breathBar.innerHTML="";const n=Math.ceil(t/2);for(let i=0;i<n;i++){const r=document.createElement("div"),o=e-i*2;r.style.cssText="width:10px;height:10px;border-radius:50%;border:1px solid #4488ff;",r.style.background=o>0?"#4488ff":"transparent",this.breathBar.appendChild(r)}}updateDebugInfo(e,t,n){if(this.debugInfo.style.display==="none")return;const i=t;this.debugInfo.innerHTML=`
            <div>FPS: ${e}</div>
            <div>XYZ: ${i.x.toFixed(1)} / ${i.y.toFixed(1)} / ${i.z.toFixed(1)}</div>
            <div>Chunks: ${n}</div>
            <div>Memory: N/A</div>
        `}formatItemName(e){return e.replace(/_/g," ").replace(/\b\w/g,t=>t.toUpperCase())}}class Sg{constructor(){D(this,"gameClient");D(this,"uiManager");this.uiManager=new yg,this.gameClient=new vg(this.uiManager),this.setupEventListeners()}setupEventListeners(){const e=document.getElementById("login-form"),t=document.getElementById("chat-input");e.addEventListener("submit",async n=>{n.preventDefault();const r=document.getElementById("player-name-input").value.trim();if(!r)return;const o=document.getElementById("login-screen");o.style.display="none",await this.gameClient.connect(r)}),t.addEventListener("keydown",n=>{if(n.key==="Enter"){const i=t.value.trim();i&&(this.gameClient.sendChat(i),t.value="",t.style.display="none"),t.blur()}n.key==="Escape"&&(t.style.display="none",t.blur())}),document.addEventListener("keydown",n=>{if((n.key==="t"||n.key==="T")&&t.style.display!=="block"&&(t.style.display="block",t.focus()),n.key==="F3"){n.preventDefault();const i=document.getElementById("debug-info");i.style.display=i.style.display==="none"?"block":"none"}n.key==="Escape"&&(this.uiManager.isSettingsPanelOpen()?this.uiManager.hideSettingsPanel():this.uiManager.hideAllUIs()),(n.key==="o"||n.key==="O")&&(this.uiManager.isSettingsPanelOpen()?this.uiManager.hideSettingsPanel():this.uiManager.showSettingsPanel()),(n.key==="i"||n.key==="I")&&this.gameClient.showCreativeInventory()}),document.addEventListener("respawnRequest",()=>{this.gameClient.respawn()}),document.addEventListener("contextmenu",n=>{document.pointerLockElement&&n.preventDefault()})}}new Sg;
//# sourceMappingURL=index-CL_6IT2x.js.map
