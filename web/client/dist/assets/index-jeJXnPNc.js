var Yl=Object.defineProperty;var jl=(s,e,t)=>e in s?Yl(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var I=(s,e,t)=>jl(s,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();class Hn extends Error{constructor(e,t){const n=new.target.prototype;super(`${e}: Status code '${t}'`),this.statusCode=t,this.__proto__=n}}class Yr extends Error{constructor(e="A timeout occurred."){const t=new.target.prototype;super(e),this.__proto__=t}}class tn extends Error{constructor(e="An abort occurred."){const t=new.target.prototype;super(e),this.__proto__=t}}class Kl extends Error{constructor(e,t){const n=new.target.prototype;super(e),this.transport=t,this.errorType="UnsupportedTransportError",this.__proto__=n}}class Zl extends Error{constructor(e,t){const n=new.target.prototype;super(e),this.transport=t,this.errorType="DisabledTransportError",this.__proto__=n}}class Jl extends Error{constructor(e,t){const n=new.target.prototype;super(e),this.transport=t,this.errorType="FailedToStartTransportError",this.__proto__=n}}class po extends Error{constructor(e){const t=new.target.prototype;super(e),this.errorType="FailedToNegotiateWithServerError",this.__proto__=t}}class Ql extends Error{constructor(e,t){const n=new.target.prototype;super(e),this.innerErrors=t,this.__proto__=n}}class rl{constructor(e,t,n){this.statusCode=e,this.statusText=t,this.content=n}}class Gs{get(e,t){return this.send({...t,method:"GET",url:e})}post(e,t){return this.send({...t,method:"POST",url:e})}delete(e,t){return this.send({...t,method:"DELETE",url:e})}getCookieString(e){return""}}var V;(function(s){s[s.Trace=0]="Trace",s[s.Debug=1]="Debug",s[s.Information=2]="Information",s[s.Warning=3]="Warning",s[s.Error=4]="Error",s[s.Critical=5]="Critical",s[s.None=6]="None"})(V||(V={}));class Oi{constructor(){}log(e,t){}}Oi.instance=new Oi;const ec="8.0.17";class ut{static isRequired(e,t){if(e==null)throw new Error(`The '${t}' argument is required.`)}static isNotEmpty(e,t){if(!e||e.match(/^\s*$/))throw new Error(`The '${t}' argument should not be empty.`)}static isIn(e,t,n){if(!(e in t))throw new Error(`Unknown ${n} value: ${e}.`)}}class it{static get isBrowser(){return!it.isNode&&typeof window=="object"&&typeof window.document=="object"}static get isWebWorker(){return!it.isNode&&typeof self=="object"&&"importScripts"in self}static get isReactNative(){return!it.isNode&&typeof window=="object"&&typeof window.document>"u"}static get isNode(){return typeof process<"u"&&process.release&&process.release.name==="node"}}function Bi(s,e){let t="";return jn(s)?(t=`Binary data of length ${s.byteLength}`,e&&(t+=`. Content: '${tc(s)}'`)):typeof s=="string"&&(t=`String data of length ${s.length}`,e&&(t+=`. Content: '${s}'`)),t}function tc(s){const e=new Uint8Array(s);let t="";return e.forEach(n=>{const i=n<16?"0":"";t+=`0x${i}${n.toString(16)} `}),t.substr(0,t.length-1)}function jn(s){return s&&typeof ArrayBuffer<"u"&&(s instanceof ArrayBuffer||s.constructor&&s.constructor.name==="ArrayBuffer")}async function ol(s,e,t,n,i,r){const o={},[a,l]=Si();o[a]=l,s.log(V.Trace,`(${e} transport) sending data. ${Bi(i,r.logMessageContent)}.`);const c=jn(i)?"arraybuffer":"text",h=await t.post(n,{content:i,headers:{...o,...r.headers},responseType:c,timeout:r.timeout,withCredentials:r.withCredentials});s.log(V.Trace,`(${e} transport) request complete. Response status: ${h.statusCode}.`)}function nc(s){return s===void 0?new Is(V.Information):s===null?Oi.instance:s.log!==void 0?s:new Is(s)}class ic{constructor(e,t){this._subject=e,this._observer=t}dispose(){const e=this._subject.observers.indexOf(this._observer);e>-1&&this._subject.observers.splice(e,1),this._subject.observers.length===0&&this._subject.cancelCallback&&this._subject.cancelCallback().catch(t=>{})}}class Is{constructor(e){this._minLevel=e,this.out=console}log(e,t){if(e>=this._minLevel){const n=`[${new Date().toISOString()}] ${V[e]}: ${t}`;switch(e){case V.Critical:case V.Error:this.out.error(n);break;case V.Warning:this.out.warn(n);break;case V.Information:this.out.info(n);break;default:this.out.log(n);break}}}}function Si(){let s="X-SignalR-User-Agent";return it.isNode&&(s="User-Agent"),[s,sc(ec,rc(),ac(),oc())]}function sc(s,e,t,n){let i="Microsoft SignalR/";const r=s.split(".");return i+=`${r[0]}.${r[1]}`,i+=` (${s}; `,e&&e!==""?i+=`${e}; `:i+="Unknown OS; ",i+=`${t}`,n?i+=`; ${n}`:i+="; Unknown Runtime Version",i+=")",i}function rc(){if(it.isNode)switch(process.platform){case"win32":return"Windows NT";case"darwin":return"macOS";case"linux":return"Linux";default:return process.platform}else return""}function oc(){if(it.isNode)return process.versions.node}function ac(){return it.isNode?"NodeJS":"Browser"}function Zs(s){return s.stack?s.stack:s.message?s.message:`${s}`}function lc(){if(typeof globalThis<"u")return globalThis;if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("could not find global")}class cc extends Gs{constructor(e){if(super(),this._logger=e,typeof fetch>"u"||it.isNode){const t=typeof __webpack_require__=="function"?__non_webpack_require__:require;this._jar=new(t("tough-cookie")).CookieJar,typeof fetch>"u"?this._fetchType=t("node-fetch"):this._fetchType=fetch,this._fetchType=t("fetch-cookie")(this._fetchType,this._jar)}else this._fetchType=fetch.bind(lc());if(typeof AbortController>"u"){const t=typeof __webpack_require__=="function"?__non_webpack_require__:require;this._abortControllerType=t("abort-controller")}else this._abortControllerType=AbortController}async send(e){if(e.abortSignal&&e.abortSignal.aborted)throw new tn;if(!e.method)throw new Error("No method defined.");if(!e.url)throw new Error("No url defined.");const t=new this._abortControllerType;let n;e.abortSignal&&(e.abortSignal.onabort=()=>{t.abort(),n=new tn});let i=null;if(e.timeout){const l=e.timeout;i=setTimeout(()=>{t.abort(),this._logger.log(V.Warning,"Timeout from HTTP request."),n=new Yr},l)}e.content===""&&(e.content=void 0),e.content&&(e.headers=e.headers||{},jn(e.content)?e.headers["Content-Type"]="application/octet-stream":e.headers["Content-Type"]="text/plain;charset=UTF-8");let r;try{r=await this._fetchType(e.url,{body:e.content,cache:"no-cache",credentials:e.withCredentials===!0?"include":"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",...e.headers},method:e.method,mode:"cors",redirect:"follow",signal:t.signal})}catch(l){throw n||(this._logger.log(V.Warning,`Error from HTTP request. ${l}.`),l)}finally{i&&clearTimeout(i),e.abortSignal&&(e.abortSignal.onabort=null)}if(!r.ok){const l=await mo(r,"text");throw new Hn(l||r.statusText,r.status)}const a=await mo(r,e.responseType);return new rl(r.status,r.statusText,a)}getCookieString(e){let t="";return it.isNode&&this._jar&&this._jar.getCookies(e,(n,i)=>t=i.join("; ")),t}}function mo(s,e){let t;switch(e){case"arraybuffer":t=s.arrayBuffer();break;case"text":t=s.text();break;case"blob":case"document":case"json":throw new Error(`${e} is not supported.`);default:t=s.text();break}return t}class hc extends Gs{constructor(e){super(),this._logger=e}send(e){return e.abortSignal&&e.abortSignal.aborted?Promise.reject(new tn):e.method?e.url?new Promise((t,n)=>{const i=new XMLHttpRequest;i.open(e.method,e.url,!0),i.withCredentials=e.withCredentials===void 0?!0:e.withCredentials,i.setRequestHeader("X-Requested-With","XMLHttpRequest"),e.content===""&&(e.content=void 0),e.content&&(jn(e.content)?i.setRequestHeader("Content-Type","application/octet-stream"):i.setRequestHeader("Content-Type","text/plain;charset=UTF-8"));const r=e.headers;r&&Object.keys(r).forEach(o=>{i.setRequestHeader(o,r[o])}),e.responseType&&(i.responseType=e.responseType),e.abortSignal&&(e.abortSignal.onabort=()=>{i.abort(),n(new tn)}),e.timeout&&(i.timeout=e.timeout),i.onload=()=>{e.abortSignal&&(e.abortSignal.onabort=null),i.status>=200&&i.status<300?t(new rl(i.status,i.statusText,i.response||i.responseText)):n(new Hn(i.response||i.responseText||i.statusText,i.status))},i.onerror=()=>{this._logger.log(V.Warning,`Error from HTTP request. ${i.status}: ${i.statusText}.`),n(new Hn(i.statusText,i.status))},i.ontimeout=()=>{this._logger.log(V.Warning,"Timeout from HTTP request."),n(new Yr)},i.send(e.content)}):Promise.reject(new Error("No url defined.")):Promise.reject(new Error("No method defined."))}}class uc extends Gs{constructor(e){if(super(),typeof fetch<"u"||it.isNode)this._httpClient=new cc(e);else if(typeof XMLHttpRequest<"u")this._httpClient=new hc(e);else throw new Error("No usable HttpClient found.")}send(e){return e.abortSignal&&e.abortSignal.aborted?Promise.reject(new tn):e.method?e.url?this._httpClient.send(e):Promise.reject(new Error("No url defined.")):Promise.reject(new Error("No method defined."))}getCookieString(e){return this._httpClient.getCookieString(e)}}class Gt{static write(e){return`${e}${Gt.RecordSeparator}`}static parse(e){if(e[e.length-1]!==Gt.RecordSeparator)throw new Error("Message is incomplete.");const t=e.split(Gt.RecordSeparator);return t.pop(),t}}Gt.RecordSeparatorCode=30;Gt.RecordSeparator=String.fromCharCode(Gt.RecordSeparatorCode);class dc{writeHandshakeRequest(e){return Gt.write(JSON.stringify(e))}parseHandshakeResponse(e){let t,n;if(jn(e)){const a=new Uint8Array(e),l=a.indexOf(Gt.RecordSeparatorCode);if(l===-1)throw new Error("Message is incomplete.");const c=l+1;t=String.fromCharCode.apply(null,Array.prototype.slice.call(a.slice(0,c))),n=a.byteLength>c?a.slice(c).buffer:null}else{const a=e,l=a.indexOf(Gt.RecordSeparator);if(l===-1)throw new Error("Message is incomplete.");const c=l+1;t=a.substring(0,c),n=a.length>c?a.substring(c):null}const i=Gt.parse(t),r=JSON.parse(i[0]);if(r.type)throw new Error("Expected a handshake response from the server.");return[n,r]}}var Ue;(function(s){s[s.Invocation=1]="Invocation",s[s.StreamItem=2]="StreamItem",s[s.Completion=3]="Completion",s[s.StreamInvocation=4]="StreamInvocation",s[s.CancelInvocation=5]="CancelInvocation",s[s.Ping=6]="Ping",s[s.Close=7]="Close",s[s.Ack=8]="Ack",s[s.Sequence=9]="Sequence"})(Ue||(Ue={}));class fc{constructor(){this.observers=[]}next(e){for(const t of this.observers)t.next(e)}error(e){for(const t of this.observers)t.error&&t.error(e)}complete(){for(const e of this.observers)e.complete&&e.complete()}subscribe(e){return this.observers.push(e),new ic(this,e)}}class pc{constructor(e,t,n){this._bufferSize=1e5,this._messages=[],this._totalMessageCount=0,this._waitForSequenceMessage=!1,this._nextReceivingSequenceId=1,this._latestReceivedSequenceId=0,this._bufferedByteCount=0,this._reconnectInProgress=!1,this._protocol=e,this._connection=t,this._bufferSize=n}async _send(e){const t=this._protocol.writeMessage(e);let n=Promise.resolve();if(this._isInvocationMessage(e)){this._totalMessageCount++;let i=()=>{},r=()=>{};jn(t)?this._bufferedByteCount+=t.byteLength:this._bufferedByteCount+=t.length,this._bufferedByteCount>=this._bufferSize&&(n=new Promise((o,a)=>{i=o,r=a})),this._messages.push(new mc(t,this._totalMessageCount,i,r))}try{this._reconnectInProgress||await this._connection.send(t)}catch{this._disconnected()}await n}_ack(e){let t=-1;for(let n=0;n<this._messages.length;n++){const i=this._messages[n];if(i._id<=e.sequenceId)t=n,jn(i._message)?this._bufferedByteCount-=i._message.byteLength:this._bufferedByteCount-=i._message.length,i._resolver();else if(this._bufferedByteCount<this._bufferSize)i._resolver();else break}t!==-1&&(this._messages=this._messages.slice(t+1))}_shouldProcessMessage(e){if(this._waitForSequenceMessage)return e.type!==Ue.Sequence?!1:(this._waitForSequenceMessage=!1,!0);if(!this._isInvocationMessage(e))return!0;const t=this._nextReceivingSequenceId;return this._nextReceivingSequenceId++,t<=this._latestReceivedSequenceId?(t===this._latestReceivedSequenceId&&this._ackTimer(),!1):(this._latestReceivedSequenceId=t,this._ackTimer(),!0)}_resetSequence(e){if(e.sequenceId>this._nextReceivingSequenceId){this._connection.stop(new Error("Sequence ID greater than amount of messages we've received."));return}this._nextReceivingSequenceId=e.sequenceId}_disconnected(){this._reconnectInProgress=!0,this._waitForSequenceMessage=!0}async _resend(){const e=this._messages.length!==0?this._messages[0]._id:this._totalMessageCount+1;await this._connection.send(this._protocol.writeMessage({type:Ue.Sequence,sequenceId:e}));const t=this._messages;for(const n of t)await this._connection.send(n._message);this._reconnectInProgress=!1}_dispose(e){e??(e=new Error("Unable to reconnect to server."));for(const t of this._messages)t._rejector(e)}_isInvocationMessage(e){switch(e.type){case Ue.Invocation:case Ue.StreamItem:case Ue.Completion:case Ue.StreamInvocation:case Ue.CancelInvocation:return!0;case Ue.Close:case Ue.Sequence:case Ue.Ping:case Ue.Ack:return!1}}_ackTimer(){this._ackTimerHandle===void 0&&(this._ackTimerHandle=setTimeout(async()=>{try{this._reconnectInProgress||await this._connection.send(this._protocol.writeMessage({type:Ue.Ack,sequenceId:this._latestReceivedSequenceId}))}catch{}clearTimeout(this._ackTimerHandle),this._ackTimerHandle=void 0},1e3))}}class mc{constructor(e,t,n,i){this._message=e,this._id=t,this._resolver=n,this._rejector=i}}const gc=30*1e3,_c=15*1e3,vc=1e5;var tt;(function(s){s.Disconnected="Disconnected",s.Connecting="Connecting",s.Connected="Connected",s.Disconnecting="Disconnecting",s.Reconnecting="Reconnecting"})(tt||(tt={}));class jr{static create(e,t,n,i,r,o,a){return new jr(e,t,n,i,r,o,a)}constructor(e,t,n,i,r,o,a){this._nextKeepAlive=0,this._freezeEventListener=()=>{this._logger.log(V.Warning,"The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep")},ut.isRequired(e,"connection"),ut.isRequired(t,"logger"),ut.isRequired(n,"protocol"),this.serverTimeoutInMilliseconds=r??gc,this.keepAliveIntervalInMilliseconds=o??_c,this._statefulReconnectBufferSize=a??vc,this._logger=t,this._protocol=n,this.connection=e,this._reconnectPolicy=i,this._handshakeProtocol=new dc,this.connection.onreceive=l=>this._processIncomingData(l),this.connection.onclose=l=>this._connectionClosed(l),this._callbacks={},this._methods={},this._closedCallbacks=[],this._reconnectingCallbacks=[],this._reconnectedCallbacks=[],this._invocationId=0,this._receivedHandshakeResponse=!1,this._connectionState=tt.Disconnected,this._connectionStarted=!1,this._cachedPingMessage=this._protocol.writeMessage({type:Ue.Ping})}get state(){return this._connectionState}get connectionId(){return this.connection&&this.connection.connectionId||null}get baseUrl(){return this.connection.baseUrl||""}set baseUrl(e){if(this._connectionState!==tt.Disconnected&&this._connectionState!==tt.Reconnecting)throw new Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");if(!e)throw new Error("The HubConnection url must be a valid url.");this.connection.baseUrl=e}start(){return this._startPromise=this._startWithStateTransitions(),this._startPromise}async _startWithStateTransitions(){if(this._connectionState!==tt.Disconnected)return Promise.reject(new Error("Cannot start a HubConnection that is not in the 'Disconnected' state."));this._connectionState=tt.Connecting,this._logger.log(V.Debug,"Starting HubConnection.");try{await this._startInternal(),it.isBrowser&&window.document.addEventListener("freeze",this._freezeEventListener),this._connectionState=tt.Connected,this._connectionStarted=!0,this._logger.log(V.Debug,"HubConnection connected successfully.")}catch(e){return this._connectionState=tt.Disconnected,this._logger.log(V.Debug,`HubConnection failed to start successfully because of error '${e}'.`),Promise.reject(e)}}async _startInternal(){this._stopDuringStartError=void 0,this._receivedHandshakeResponse=!1;const e=new Promise((t,n)=>{this._handshakeResolver=t,this._handshakeRejecter=n});await this.connection.start(this._protocol.transferFormat);try{let t=this._protocol.version;this.connection.features.reconnect||(t=1);const n={protocol:this._protocol.name,version:t};if(this._logger.log(V.Debug,"Sending handshake request."),await this._sendMessage(this._handshakeProtocol.writeHandshakeRequest(n)),this._logger.log(V.Information,`Using HubProtocol '${this._protocol.name}'.`),this._cleanupTimeout(),this._resetTimeoutPeriod(),this._resetKeepAliveInterval(),await e,this._stopDuringStartError)throw this._stopDuringStartError;(this.connection.features.reconnect||!1)&&(this._messageBuffer=new pc(this._protocol,this.connection,this._statefulReconnectBufferSize),this.connection.features.disconnected=this._messageBuffer._disconnected.bind(this._messageBuffer),this.connection.features.resend=()=>{if(this._messageBuffer)return this._messageBuffer._resend()}),this.connection.features.inherentKeepAlive||await this._sendMessage(this._cachedPingMessage)}catch(t){throw this._logger.log(V.Debug,`Hub handshake failed with error '${t}' during start(). Stopping HubConnection.`),this._cleanupTimeout(),this._cleanupPingTimer(),await this.connection.stop(t),t}}async stop(){const e=this._startPromise;this.connection.features.reconnect=!1,this._stopPromise=this._stopInternal(),await this._stopPromise;try{await e}catch{}}_stopInternal(e){if(this._connectionState===tt.Disconnected)return this._logger.log(V.Debug,`Call to HubConnection.stop(${e}) ignored because it is already in the disconnected state.`),Promise.resolve();if(this._connectionState===tt.Disconnecting)return this._logger.log(V.Debug,`Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`),this._stopPromise;const t=this._connectionState;return this._connectionState=tt.Disconnecting,this._logger.log(V.Debug,"Stopping HubConnection."),this._reconnectDelayHandle?(this._logger.log(V.Debug,"Connection stopped during reconnect delay. Done reconnecting."),clearTimeout(this._reconnectDelayHandle),this._reconnectDelayHandle=void 0,this._completeClose(),Promise.resolve()):(t===tt.Connected&&this._sendCloseMessage(),this._cleanupTimeout(),this._cleanupPingTimer(),this._stopDuringStartError=e||new tn("The connection was stopped before the hub handshake could complete."),this.connection.stop(e))}async _sendCloseMessage(){try{await this._sendWithProtocol(this._createCloseMessage())}catch{}}stream(e,...t){const[n,i]=this._replaceStreamingParams(t),r=this._createStreamInvocation(e,t,i);let o;const a=new fc;return a.cancelCallback=()=>{const l=this._createCancelInvocation(r.invocationId);return delete this._callbacks[r.invocationId],o.then(()=>this._sendWithProtocol(l))},this._callbacks[r.invocationId]=(l,c)=>{if(c){a.error(c);return}else l&&(l.type===Ue.Completion?l.error?a.error(new Error(l.error)):a.complete():a.next(l.item))},o=this._sendWithProtocol(r).catch(l=>{a.error(l),delete this._callbacks[r.invocationId]}),this._launchStreams(n,o),a}_sendMessage(e){return this._resetKeepAliveInterval(),this.connection.send(e)}_sendWithProtocol(e){return this._messageBuffer?this._messageBuffer._send(e):this._sendMessage(this._protocol.writeMessage(e))}send(e,...t){const[n,i]=this._replaceStreamingParams(t),r=this._sendWithProtocol(this._createInvocation(e,t,!0,i));return this._launchStreams(n,r),r}invoke(e,...t){const[n,i]=this._replaceStreamingParams(t),r=this._createInvocation(e,t,!1,i);return new Promise((a,l)=>{this._callbacks[r.invocationId]=(h,u)=>{if(u){l(u);return}else h&&(h.type===Ue.Completion?h.error?l(new Error(h.error)):a(h.result):l(new Error(`Unexpected message type: ${h.type}`)))};const c=this._sendWithProtocol(r).catch(h=>{l(h),delete this._callbacks[r.invocationId]});this._launchStreams(n,c)})}on(e,t){!e||!t||(e=e.toLowerCase(),this._methods[e]||(this._methods[e]=[]),this._methods[e].indexOf(t)===-1&&this._methods[e].push(t))}off(e,t){if(!e)return;e=e.toLowerCase();const n=this._methods[e];if(n)if(t){const i=n.indexOf(t);i!==-1&&(n.splice(i,1),n.length===0&&delete this._methods[e])}else delete this._methods[e]}onclose(e){e&&this._closedCallbacks.push(e)}onreconnecting(e){e&&this._reconnectingCallbacks.push(e)}onreconnected(e){e&&this._reconnectedCallbacks.push(e)}_processIncomingData(e){if(this._cleanupTimeout(),this._receivedHandshakeResponse||(e=this._processHandshakeResponse(e),this._receivedHandshakeResponse=!0),e){const t=this._protocol.parseMessages(e,this._logger);for(const n of t)if(!(this._messageBuffer&&!this._messageBuffer._shouldProcessMessage(n)))switch(n.type){case Ue.Invocation:this._invokeClientMethod(n).catch(i=>{this._logger.log(V.Error,`Invoke client method threw error: ${Zs(i)}`)});break;case Ue.StreamItem:case Ue.Completion:{const i=this._callbacks[n.invocationId];if(i){n.type===Ue.Completion&&delete this._callbacks[n.invocationId];try{i(n)}catch(r){this._logger.log(V.Error,`Stream callback threw error: ${Zs(r)}`)}}break}case Ue.Ping:break;case Ue.Close:{this._logger.log(V.Information,"Close message received from server.");const i=n.error?new Error("Server returned an error on close: "+n.error):void 0;n.allowReconnect===!0?this.connection.stop(i):this._stopPromise=this._stopInternal(i);break}case Ue.Ack:this._messageBuffer&&this._messageBuffer._ack(n);break;case Ue.Sequence:this._messageBuffer&&this._messageBuffer._resetSequence(n);break;default:this._logger.log(V.Warning,`Invalid message type: ${n.type}.`);break}}this._resetTimeoutPeriod()}_processHandshakeResponse(e){let t,n;try{[n,t]=this._handshakeProtocol.parseHandshakeResponse(e)}catch(i){const r="Error parsing handshake response: "+i;this._logger.log(V.Error,r);const o=new Error(r);throw this._handshakeRejecter(o),o}if(t.error){const i="Server returned handshake error: "+t.error;this._logger.log(V.Error,i);const r=new Error(i);throw this._handshakeRejecter(r),r}else this._logger.log(V.Debug,"Server handshake complete.");return this._handshakeResolver(),n}_resetKeepAliveInterval(){this.connection.features.inherentKeepAlive||(this._nextKeepAlive=new Date().getTime()+this.keepAliveIntervalInMilliseconds,this._cleanupPingTimer())}_resetTimeoutPeriod(){if((!this.connection.features||!this.connection.features.inherentKeepAlive)&&(this._timeoutHandle=setTimeout(()=>this.serverTimeout(),this.serverTimeoutInMilliseconds),this._pingServerHandle===void 0)){let e=this._nextKeepAlive-new Date().getTime();e<0&&(e=0),this._pingServerHandle=setTimeout(async()=>{if(this._connectionState===tt.Connected)try{await this._sendMessage(this._cachedPingMessage)}catch{this._cleanupPingTimer()}},e)}}serverTimeout(){this.connection.stop(new Error("Server timeout elapsed without receiving a message from the server."))}async _invokeClientMethod(e){const t=e.target.toLowerCase(),n=this._methods[t];if(!n){this._logger.log(V.Warning,`No client method with the name '${t}' found.`),e.invocationId&&(this._logger.log(V.Warning,`No result given for '${t}' method and invocation ID '${e.invocationId}'.`),await this._sendWithProtocol(this._createCompletionMessage(e.invocationId,"Client didn't provide a result.",null)));return}const i=n.slice(),r=!!e.invocationId;let o,a,l;for(const c of i)try{const h=o;o=await c.apply(this,e.arguments),r&&o&&h&&(this._logger.log(V.Error,`Multiple results provided for '${t}'. Sending error to server.`),l=this._createCompletionMessage(e.invocationId,"Client provided multiple results.",null)),a=void 0}catch(h){a=h,this._logger.log(V.Error,`A callback for the method '${t}' threw error '${h}'.`)}l?await this._sendWithProtocol(l):r?(a?l=this._createCompletionMessage(e.invocationId,`${a}`,null):o!==void 0?l=this._createCompletionMessage(e.invocationId,null,o):(this._logger.log(V.Warning,`No result given for '${t}' method and invocation ID '${e.invocationId}'.`),l=this._createCompletionMessage(e.invocationId,"Client didn't provide a result.",null)),await this._sendWithProtocol(l)):o&&this._logger.log(V.Error,`Result given for '${t}' method but server is not expecting a result.`)}_connectionClosed(e){this._logger.log(V.Debug,`HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`),this._stopDuringStartError=this._stopDuringStartError||e||new tn("The underlying connection was closed before the hub handshake could complete."),this._handshakeResolver&&this._handshakeResolver(),this._cancelCallbacksWithError(e||new Error("Invocation canceled due to the underlying connection being closed.")),this._cleanupTimeout(),this._cleanupPingTimer(),this._connectionState===tt.Disconnecting?this._completeClose(e):this._connectionState===tt.Connected&&this._reconnectPolicy?this._reconnect(e):this._connectionState===tt.Connected&&this._completeClose(e)}_completeClose(e){if(this._connectionStarted){this._connectionState=tt.Disconnected,this._connectionStarted=!1,this._messageBuffer&&(this._messageBuffer._dispose(e??new Error("Connection closed.")),this._messageBuffer=void 0),it.isBrowser&&window.document.removeEventListener("freeze",this._freezeEventListener);try{this._closedCallbacks.forEach(t=>t.apply(this,[e]))}catch(t){this._logger.log(V.Error,`An onclose callback called with error '${e}' threw error '${t}'.`)}}}async _reconnect(e){const t=Date.now();let n=0,i=e!==void 0?e:new Error("Attempting to reconnect due to a unknown error."),r=this._getNextRetryDelay(n++,0,i);if(r===null){this._logger.log(V.Debug,"Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt."),this._completeClose(e);return}if(this._connectionState=tt.Reconnecting,e?this._logger.log(V.Information,`Connection reconnecting because of error '${e}'.`):this._logger.log(V.Information,"Connection reconnecting."),this._reconnectingCallbacks.length!==0){try{this._reconnectingCallbacks.forEach(o=>o.apply(this,[e]))}catch(o){this._logger.log(V.Error,`An onreconnecting callback called with error '${e}' threw error '${o}'.`)}if(this._connectionState!==tt.Reconnecting){this._logger.log(V.Debug,"Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");return}}for(;r!==null;){if(this._logger.log(V.Information,`Reconnect attempt number ${n} will start in ${r} ms.`),await new Promise(o=>{this._reconnectDelayHandle=setTimeout(o,r)}),this._reconnectDelayHandle=void 0,this._connectionState!==tt.Reconnecting){this._logger.log(V.Debug,"Connection left the reconnecting state during reconnect delay. Done reconnecting.");return}try{if(await this._startInternal(),this._connectionState=tt.Connected,this._logger.log(V.Information,"HubConnection reconnected successfully."),this._reconnectedCallbacks.length!==0)try{this._reconnectedCallbacks.forEach(o=>o.apply(this,[this.connection.connectionId]))}catch(o){this._logger.log(V.Error,`An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${o}'.`)}return}catch(o){if(this._logger.log(V.Information,`Reconnect attempt failed because of error '${o}'.`),this._connectionState!==tt.Reconnecting){this._logger.log(V.Debug,`Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`),this._connectionState===tt.Disconnecting&&this._completeClose();return}i=o instanceof Error?o:new Error(o.toString()),r=this._getNextRetryDelay(n++,Date.now()-t,i)}}this._logger.log(V.Information,`Reconnect retries have been exhausted after ${Date.now()-t} ms and ${n} failed attempts. Connection disconnecting.`),this._completeClose()}_getNextRetryDelay(e,t,n){try{return this._reconnectPolicy.nextRetryDelayInMilliseconds({elapsedMilliseconds:t,previousRetryCount:e,retryReason:n})}catch(i){return this._logger.log(V.Error,`IRetryPolicy.nextRetryDelayInMilliseconds(${e}, ${t}) threw error '${i}'.`),null}}_cancelCallbacksWithError(e){const t=this._callbacks;this._callbacks={},Object.keys(t).forEach(n=>{const i=t[n];try{i(null,e)}catch(r){this._logger.log(V.Error,`Stream 'error' callback called with '${e}' threw error: ${Zs(r)}`)}})}_cleanupPingTimer(){this._pingServerHandle&&(clearTimeout(this._pingServerHandle),this._pingServerHandle=void 0)}_cleanupTimeout(){this._timeoutHandle&&clearTimeout(this._timeoutHandle)}_createInvocation(e,t,n,i){if(n)return i.length!==0?{arguments:t,streamIds:i,target:e,type:Ue.Invocation}:{arguments:t,target:e,type:Ue.Invocation};{const r=this._invocationId;return this._invocationId++,i.length!==0?{arguments:t,invocationId:r.toString(),streamIds:i,target:e,type:Ue.Invocation}:{arguments:t,invocationId:r.toString(),target:e,type:Ue.Invocation}}}_launchStreams(e,t){if(e.length!==0){t||(t=Promise.resolve());for(const n in e)e[n].subscribe({complete:()=>{t=t.then(()=>this._sendWithProtocol(this._createCompletionMessage(n)))},error:i=>{let r;i instanceof Error?r=i.message:i&&i.toString?r=i.toString():r="Unknown error",t=t.then(()=>this._sendWithProtocol(this._createCompletionMessage(n,r)))},next:i=>{t=t.then(()=>this._sendWithProtocol(this._createStreamItemMessage(n,i)))}})}}_replaceStreamingParams(e){const t=[],n=[];for(let i=0;i<e.length;i++){const r=e[i];if(this._isObservable(r)){const o=this._invocationId;this._invocationId++,t[o]=r,n.push(o.toString()),e.splice(i,1)}}return[t,n]}_isObservable(e){return e&&e.subscribe&&typeof e.subscribe=="function"}_createStreamInvocation(e,t,n){const i=this._invocationId;return this._invocationId++,n.length!==0?{arguments:t,invocationId:i.toString(),streamIds:n,target:e,type:Ue.StreamInvocation}:{arguments:t,invocationId:i.toString(),target:e,type:Ue.StreamInvocation}}_createCancelInvocation(e){return{invocationId:e,type:Ue.CancelInvocation}}_createStreamItemMessage(e,t){return{invocationId:e,item:t,type:Ue.StreamItem}}_createCompletionMessage(e,t,n){return t?{error:t,invocationId:e,type:Ue.Completion}:{invocationId:e,result:n,type:Ue.Completion}}_createCloseMessage(){return{type:Ue.Close}}}const xc=[0,2e3,1e4,3e4,null];class go{constructor(e){this._retryDelays=e!==void 0?[...e,null]:xc}nextRetryDelayInMilliseconds(e){return this._retryDelays[e.previousRetryCount]}}class Vn{}Vn.Authorization="Authorization";Vn.Cookie="Cookie";class yc extends Gs{constructor(e,t){super(),this._innerClient=e,this._accessTokenFactory=t}async send(e){let t=!0;this._accessTokenFactory&&(!this._accessToken||e.url&&e.url.indexOf("/negotiate?")>0)&&(t=!1,this._accessToken=await this._accessTokenFactory()),this._setAuthorizationHeader(e);const n=await this._innerClient.send(e);return t&&n.statusCode===401&&this._accessTokenFactory?(this._accessToken=await this._accessTokenFactory(),this._setAuthorizationHeader(e),await this._innerClient.send(e)):n}_setAuthorizationHeader(e){e.headers||(e.headers={}),this._accessToken?e.headers[Vn.Authorization]=`Bearer ${this._accessToken}`:this._accessTokenFactory&&e.headers[Vn.Authorization]&&delete e.headers[Vn.Authorization]}getCookieString(e){return this._innerClient.getCookieString(e)}}var dt;(function(s){s[s.None=0]="None",s[s.WebSockets=1]="WebSockets",s[s.ServerSentEvents=2]="ServerSentEvents",s[s.LongPolling=4]="LongPolling"})(dt||(dt={}));var Tt;(function(s){s[s.Text=1]="Text",s[s.Binary=2]="Binary"})(Tt||(Tt={}));let Sc=class{constructor(){this._isAborted=!1,this.onabort=null}abort(){this._isAborted||(this._isAborted=!0,this.onabort&&this.onabort())}get signal(){return this}get aborted(){return this._isAborted}};class _o{get pollAborted(){return this._pollAbort.aborted}constructor(e,t,n){this._httpClient=e,this._logger=t,this._pollAbort=new Sc,this._options=n,this._running=!1,this.onreceive=null,this.onclose=null}async connect(e,t){if(ut.isRequired(e,"url"),ut.isRequired(t,"transferFormat"),ut.isIn(t,Tt,"transferFormat"),this._url=e,this._logger.log(V.Trace,"(LongPolling transport) Connecting."),t===Tt.Binary&&typeof XMLHttpRequest<"u"&&typeof new XMLHttpRequest().responseType!="string")throw new Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");const[n,i]=Si(),r={[n]:i,...this._options.headers},o={abortSignal:this._pollAbort.signal,headers:r,timeout:1e5,withCredentials:this._options.withCredentials};t===Tt.Binary&&(o.responseType="arraybuffer");const a=`${e}&_=${Date.now()}`;this._logger.log(V.Trace,`(LongPolling transport) polling: ${a}.`);const l=await this._httpClient.get(a,o);l.statusCode!==200?(this._logger.log(V.Error,`(LongPolling transport) Unexpected response code: ${l.statusCode}.`),this._closeError=new Hn(l.statusText||"",l.statusCode),this._running=!1):this._running=!0,this._receiving=this._poll(this._url,o)}async _poll(e,t){try{for(;this._running;)try{const n=`${e}&_=${Date.now()}`;this._logger.log(V.Trace,`(LongPolling transport) polling: ${n}.`);const i=await this._httpClient.get(n,t);i.statusCode===204?(this._logger.log(V.Information,"(LongPolling transport) Poll terminated by server."),this._running=!1):i.statusCode!==200?(this._logger.log(V.Error,`(LongPolling transport) Unexpected response code: ${i.statusCode}.`),this._closeError=new Hn(i.statusText||"",i.statusCode),this._running=!1):i.content?(this._logger.log(V.Trace,`(LongPolling transport) data received. ${Bi(i.content,this._options.logMessageContent)}.`),this.onreceive&&this.onreceive(i.content)):this._logger.log(V.Trace,"(LongPolling transport) Poll timed out, reissuing.")}catch(n){this._running?n instanceof Yr?this._logger.log(V.Trace,"(LongPolling transport) Poll timed out, reissuing."):(this._closeError=n,this._running=!1):this._logger.log(V.Trace,`(LongPolling transport) Poll errored after shutdown: ${n.message}`)}}finally{this._logger.log(V.Trace,"(LongPolling transport) Polling complete."),this.pollAborted||this._raiseOnClose()}}async send(e){return this._running?ol(this._logger,"LongPolling",this._httpClient,this._url,e,this._options):Promise.reject(new Error("Cannot send until the transport is connected"))}async stop(){this._logger.log(V.Trace,"(LongPolling transport) Stopping polling."),this._running=!1,this._pollAbort.abort();try{await this._receiving,this._logger.log(V.Trace,`(LongPolling transport) sending DELETE request to ${this._url}.`);const e={},[t,n]=Si();e[t]=n;const i={headers:{...e,...this._options.headers},timeout:this._options.timeout,withCredentials:this._options.withCredentials};let r;try{await this._httpClient.delete(this._url,i)}catch(o){r=o}r?r instanceof Hn&&(r.statusCode===404?this._logger.log(V.Trace,"(LongPolling transport) A 404 response was returned from sending a DELETE request."):this._logger.log(V.Trace,`(LongPolling transport) Error sending a DELETE request: ${r}`)):this._logger.log(V.Trace,"(LongPolling transport) DELETE request accepted.")}finally{this._logger.log(V.Trace,"(LongPolling transport) Stop finished."),this._raiseOnClose()}}_raiseOnClose(){if(this.onclose){let e="(LongPolling transport) Firing onclose event.";this._closeError&&(e+=" Error: "+this._closeError),this._logger.log(V.Trace,e),this.onclose(this._closeError)}}}class Mc{constructor(e,t,n,i){this._httpClient=e,this._accessToken=t,this._logger=n,this._options=i,this.onreceive=null,this.onclose=null}async connect(e,t){return ut.isRequired(e,"url"),ut.isRequired(t,"transferFormat"),ut.isIn(t,Tt,"transferFormat"),this._logger.log(V.Trace,"(SSE transport) Connecting."),this._url=e,this._accessToken&&(e+=(e.indexOf("?")<0?"?":"&")+`access_token=${encodeURIComponent(this._accessToken)}`),new Promise((n,i)=>{let r=!1;if(t!==Tt.Text){i(new Error("The Server-Sent Events transport only supports the 'Text' transfer format"));return}let o;if(it.isBrowser||it.isWebWorker)o=new this._options.EventSource(e,{withCredentials:this._options.withCredentials});else{const a=this._httpClient.getCookieString(e),l={};l.Cookie=a;const[c,h]=Si();l[c]=h,o=new this._options.EventSource(e,{withCredentials:this._options.withCredentials,headers:{...l,...this._options.headers}})}try{o.onmessage=a=>{if(this.onreceive)try{this._logger.log(V.Trace,`(SSE transport) data received. ${Bi(a.data,this._options.logMessageContent)}.`),this.onreceive(a.data)}catch(l){this._close(l);return}},o.onerror=a=>{r?this._close():i(new Error("EventSource failed to connect. The connection could not be found on the server, either the connection ID is not present on the server, or a proxy is refusing/buffering the connection. If you have multiple servers check that sticky sessions are enabled."))},o.onopen=()=>{this._logger.log(V.Information,`SSE connected to ${this._url}`),this._eventSource=o,r=!0,n()}}catch(a){i(a);return}})}async send(e){return this._eventSource?ol(this._logger,"SSE",this._httpClient,this._url,e,this._options):Promise.reject(new Error("Cannot send until the transport is connected"))}stop(){return this._close(),Promise.resolve()}_close(e){this._eventSource&&(this._eventSource.close(),this._eventSource=void 0,this.onclose&&this.onclose(e))}}class Ec{constructor(e,t,n,i,r,o){this._logger=n,this._accessTokenFactory=t,this._logMessageContent=i,this._webSocketConstructor=r,this._httpClient=e,this.onreceive=null,this.onclose=null,this._headers=o}async connect(e,t){ut.isRequired(e,"url"),ut.isRequired(t,"transferFormat"),ut.isIn(t,Tt,"transferFormat"),this._logger.log(V.Trace,"(WebSockets transport) Connecting.");let n;return this._accessTokenFactory&&(n=await this._accessTokenFactory()),new Promise((i,r)=>{e=e.replace(/^http/,"ws");let o;const a=this._httpClient.getCookieString(e);let l=!1;if(it.isNode||it.isReactNative){const c={},[h,u]=Si();c[h]=u,n&&(c[Vn.Authorization]=`Bearer ${n}`),a&&(c[Vn.Cookie]=a),o=new this._webSocketConstructor(e,void 0,{headers:{...c,...this._headers}})}else n&&(e+=(e.indexOf("?")<0?"?":"&")+`access_token=${encodeURIComponent(n)}`);o||(o=new this._webSocketConstructor(e)),t===Tt.Binary&&(o.binaryType="arraybuffer"),o.onopen=c=>{this._logger.log(V.Information,`WebSocket connected to ${e}.`),this._webSocket=o,l=!0,i()},o.onerror=c=>{let h=null;typeof ErrorEvent<"u"&&c instanceof ErrorEvent?h=c.error:h="There was an error with the transport",this._logger.log(V.Information,`(WebSockets transport) ${h}.`)},o.onmessage=c=>{if(this._logger.log(V.Trace,`(WebSockets transport) data received. ${Bi(c.data,this._logMessageContent)}.`),this.onreceive)try{this.onreceive(c.data)}catch(h){this._close(h);return}},o.onclose=c=>{if(l)this._close(c);else{let h=null;typeof ErrorEvent<"u"&&c instanceof ErrorEvent?h=c.error:h="WebSocket failed to connect. The connection could not be found on the server, either the endpoint may not be a SignalR endpoint, the connection ID is not present on the server, or there is a proxy blocking WebSockets. If you have multiple servers check that sticky sessions are enabled.",r(new Error(h))}}})}send(e){return this._webSocket&&this._webSocket.readyState===this._webSocketConstructor.OPEN?(this._logger.log(V.Trace,`(WebSockets transport) sending data. ${Bi(e,this._logMessageContent)}.`),this._webSocket.send(e),Promise.resolve()):Promise.reject("WebSocket is not in the OPEN state")}stop(){return this._webSocket&&this._close(void 0),Promise.resolve()}_close(e){this._webSocket&&(this._webSocket.onclose=()=>{},this._webSocket.onmessage=()=>{},this._webSocket.onerror=()=>{},this._webSocket.close(),this._webSocket=void 0),this._logger.log(V.Trace,"(WebSockets transport) socket closed."),this.onclose&&(this._isCloseEvent(e)&&(e.wasClean===!1||e.code!==1e3)?this.onclose(new Error(`WebSocket closed with status code: ${e.code} (${e.reason||"no reason given"}).`)):e instanceof Error?this.onclose(e):this.onclose())}_isCloseEvent(e){return e&&typeof e.wasClean=="boolean"&&typeof e.code=="number"}}const vo=100;class bc{constructor(e,t={}){if(this._stopPromiseResolver=()=>{},this.features={},this._negotiateVersion=1,ut.isRequired(e,"url"),this._logger=nc(t.logger),this.baseUrl=this._resolveUrl(e),t=t||{},t.logMessageContent=t.logMessageContent===void 0?!1:t.logMessageContent,typeof t.withCredentials=="boolean"||t.withCredentials===void 0)t.withCredentials=t.withCredentials===void 0?!0:t.withCredentials;else throw new Error("withCredentials option was not a 'boolean' or 'undefined' value");t.timeout=t.timeout===void 0?100*1e3:t.timeout;let n=null,i=null;if(it.isNode&&typeof require<"u"){const r=typeof __webpack_require__=="function"?__non_webpack_require__:require;n=r("ws"),i=r("eventsource")}!it.isNode&&typeof WebSocket<"u"&&!t.WebSocket?t.WebSocket=WebSocket:it.isNode&&!t.WebSocket&&n&&(t.WebSocket=n),!it.isNode&&typeof EventSource<"u"&&!t.EventSource?t.EventSource=EventSource:it.isNode&&!t.EventSource&&typeof i<"u"&&(t.EventSource=i),this._httpClient=new yc(t.httpClient||new uc(this._logger),t.accessTokenFactory),this._connectionState="Disconnected",this._connectionStarted=!1,this._options=t,this.onreceive=null,this.onclose=null}async start(e){if(e=e||Tt.Binary,ut.isIn(e,Tt,"transferFormat"),this._logger.log(V.Debug,`Starting connection with transfer format '${Tt[e]}'.`),this._connectionState!=="Disconnected")return Promise.reject(new Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));if(this._connectionState="Connecting",this._startInternalPromise=this._startInternal(e),await this._startInternalPromise,this._connectionState==="Disconnecting"){const t="Failed to start the HttpConnection before stop() was called.";return this._logger.log(V.Error,t),await this._stopPromise,Promise.reject(new tn(t))}else if(this._connectionState!=="Connected"){const t="HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";return this._logger.log(V.Error,t),Promise.reject(new tn(t))}this._connectionStarted=!0}send(e){return this._connectionState!=="Connected"?Promise.reject(new Error("Cannot send data if the connection is not in the 'Connected' State.")):(this._sendQueue||(this._sendQueue=new Kr(this.transport)),this._sendQueue.send(e))}async stop(e){if(this._connectionState==="Disconnected")return this._logger.log(V.Debug,`Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnected state.`),Promise.resolve();if(this._connectionState==="Disconnecting")return this._logger.log(V.Debug,`Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`),this._stopPromise;this._connectionState="Disconnecting",this._stopPromise=new Promise(t=>{this._stopPromiseResolver=t}),await this._stopInternal(e),await this._stopPromise}async _stopInternal(e){this._stopError=e;try{await this._startInternalPromise}catch{}if(this.transport){try{await this.transport.stop()}catch(t){this._logger.log(V.Error,`HttpConnection.transport.stop() threw error '${t}'.`),this._stopConnection()}this.transport=void 0}else this._logger.log(V.Debug,"HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.")}async _startInternal(e){let t=this.baseUrl;this._accessTokenFactory=this._options.accessTokenFactory,this._httpClient._accessTokenFactory=this._accessTokenFactory;try{if(this._options.skipNegotiation)if(this._options.transport===dt.WebSockets)this.transport=this._constructTransport(dt.WebSockets),await this._startTransport(t,e);else throw new Error("Negotiation can only be skipped when using the WebSocket transport directly.");else{let n=null,i=0;do{if(n=await this._getNegotiationResponse(t),this._connectionState==="Disconnecting"||this._connectionState==="Disconnected")throw new tn("The connection was stopped during negotiation.");if(n.error)throw new Error(n.error);if(n.ProtocolVersion)throw new Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");if(n.url&&(t=n.url),n.accessToken){const r=n.accessToken;this._accessTokenFactory=()=>r,this._httpClient._accessToken=r,this._httpClient._accessTokenFactory=void 0}i++}while(n.url&&i<vo);if(i===vo&&n.url)throw new Error("Negotiate redirection limit exceeded.");await this._createTransport(t,this._options.transport,n,e)}this.transport instanceof _o&&(this.features.inherentKeepAlive=!0),this._connectionState==="Connecting"&&(this._logger.log(V.Debug,"The HttpConnection connected successfully."),this._connectionState="Connected")}catch(n){return this._logger.log(V.Error,"Failed to start the connection: "+n),this._connectionState="Disconnected",this.transport=void 0,this._stopPromiseResolver(),Promise.reject(n)}}async _getNegotiationResponse(e){const t={},[n,i]=Si();t[n]=i;const r=this._resolveNegotiateUrl(e);this._logger.log(V.Debug,`Sending negotiation request: ${r}.`);try{const o=await this._httpClient.post(r,{content:"",headers:{...t,...this._options.headers},timeout:this._options.timeout,withCredentials:this._options.withCredentials});if(o.statusCode!==200)return Promise.reject(new Error(`Unexpected status code returned from negotiate '${o.statusCode}'`));const a=JSON.parse(o.content);return(!a.negotiateVersion||a.negotiateVersion<1)&&(a.connectionToken=a.connectionId),a.useStatefulReconnect&&this._options._useStatefulReconnect!==!0?Promise.reject(new po("Client didn't negotiate Stateful Reconnect but the server did.")):a}catch(o){let a="Failed to complete negotiation with the server: "+o;return o instanceof Hn&&o.statusCode===404&&(a=a+" Either this is not a SignalR endpoint or there is a proxy blocking the connection."),this._logger.log(V.Error,a),Promise.reject(new po(a))}}_createConnectUrl(e,t){return t?e+(e.indexOf("?")===-1?"?":"&")+`id=${t}`:e}async _createTransport(e,t,n,i){let r=this._createConnectUrl(e,n.connectionToken);if(this._isITransport(t)){this._logger.log(V.Debug,"Connection was provided an instance of ITransport, using that directly."),this.transport=t,await this._startTransport(r,i),this.connectionId=n.connectionId;return}const o=[],a=n.availableTransports||[];let l=n;for(const c of a){const h=this._resolveTransportOrError(c,t,i,(l==null?void 0:l.useStatefulReconnect)===!0);if(h instanceof Error)o.push(`${c.transport} failed:`),o.push(h);else if(this._isITransport(h)){if(this.transport=h,!l){try{l=await this._getNegotiationResponse(e)}catch(u){return Promise.reject(u)}r=this._createConnectUrl(e,l.connectionToken)}try{await this._startTransport(r,i),this.connectionId=l.connectionId;return}catch(u){if(this._logger.log(V.Error,`Failed to start the transport '${c.transport}': ${u}`),l=void 0,o.push(new Jl(`${c.transport} failed: ${u}`,dt[c.transport])),this._connectionState!=="Connecting"){const d="Failed to select transport before stop() was called.";return this._logger.log(V.Debug,d),Promise.reject(new tn(d))}}}}return o.length>0?Promise.reject(new Ql(`Unable to connect to the server with any of the available transports. ${o.join(" ")}`,o)):Promise.reject(new Error("None of the transports supported by the client are supported by the server."))}_constructTransport(e){switch(e){case dt.WebSockets:if(!this._options.WebSocket)throw new Error("'WebSocket' is not supported in your environment.");return new Ec(this._httpClient,this._accessTokenFactory,this._logger,this._options.logMessageContent,this._options.WebSocket,this._options.headers||{});case dt.ServerSentEvents:if(!this._options.EventSource)throw new Error("'EventSource' is not supported in your environment.");return new Mc(this._httpClient,this._httpClient._accessToken,this._logger,this._options);case dt.LongPolling:return new _o(this._httpClient,this._logger,this._options);default:throw new Error(`Unknown transport: ${e}.`)}}_startTransport(e,t){return this.transport.onreceive=this.onreceive,this.features.reconnect?this.transport.onclose=async n=>{let i=!1;if(this.features.reconnect)try{this.features.disconnected(),await this.transport.connect(e,t),await this.features.resend()}catch{i=!0}else{this._stopConnection(n);return}i&&this._stopConnection(n)}:this.transport.onclose=n=>this._stopConnection(n),this.transport.connect(e,t)}_resolveTransportOrError(e,t,n,i){const r=dt[e.transport];if(r==null)return this._logger.log(V.Debug,`Skipping transport '${e.transport}' because it is not supported by this client.`),new Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);if(wc(t,r))if(e.transferFormats.map(a=>Tt[a]).indexOf(n)>=0){if(r===dt.WebSockets&&!this._options.WebSocket||r===dt.ServerSentEvents&&!this._options.EventSource)return this._logger.log(V.Debug,`Skipping transport '${dt[r]}' because it is not supported in your environment.'`),new Kl(`'${dt[r]}' is not supported in your environment.`,r);this._logger.log(V.Debug,`Selecting transport '${dt[r]}'.`);try{return this.features.reconnect=r===dt.WebSockets?i:void 0,this._constructTransport(r)}catch(a){return a}}else return this._logger.log(V.Debug,`Skipping transport '${dt[r]}' because it does not support the requested transfer format '${Tt[n]}'.`),new Error(`'${dt[r]}' does not support ${Tt[n]}.`);else return this._logger.log(V.Debug,`Skipping transport '${dt[r]}' because it was disabled by the client.`),new Zl(`'${dt[r]}' is disabled by the client.`,r)}_isITransport(e){return e&&typeof e=="object"&&"connect"in e}_stopConnection(e){if(this._logger.log(V.Debug,`HttpConnection.stopConnection(${e}) called while in state ${this._connectionState}.`),this.transport=void 0,e=this._stopError||e,this._stopError=void 0,this._connectionState==="Disconnected"){this._logger.log(V.Debug,`Call to HttpConnection.stopConnection(${e}) was ignored because the connection is already in the disconnected state.`);return}if(this._connectionState==="Connecting")throw this._logger.log(V.Warning,`Call to HttpConnection.stopConnection(${e}) was ignored because the connection is still in the connecting state.`),new Error(`HttpConnection.stopConnection(${e}) was called while the connection is still in the connecting state.`);if(this._connectionState==="Disconnecting"&&this._stopPromiseResolver(),e?this._logger.log(V.Error,`Connection disconnected with error '${e}'.`):this._logger.log(V.Information,"Connection disconnected."),this._sendQueue&&(this._sendQueue.stop().catch(t=>{this._logger.log(V.Error,`TransportSendQueue.stop() threw error '${t}'.`)}),this._sendQueue=void 0),this.connectionId=void 0,this._connectionState="Disconnected",this._connectionStarted){this._connectionStarted=!1;try{this.onclose&&this.onclose(e)}catch(t){this._logger.log(V.Error,`HttpConnection.onclose(${e}) threw error '${t}'.`)}}}_resolveUrl(e){if(e.lastIndexOf("https://",0)===0||e.lastIndexOf("http://",0)===0)return e;if(!it.isBrowser)throw new Error(`Cannot resolve '${e}'.`);const t=window.document.createElement("a");return t.href=e,this._logger.log(V.Information,`Normalizing '${e}' to '${t.href}'.`),t.href}_resolveNegotiateUrl(e){const t=new URL(e);t.pathname.endsWith("/")?t.pathname+="negotiate":t.pathname+="/negotiate";const n=new URLSearchParams(t.searchParams);return n.has("negotiateVersion")||n.append("negotiateVersion",this._negotiateVersion.toString()),n.has("useStatefulReconnect")?n.get("useStatefulReconnect")==="true"&&(this._options._useStatefulReconnect=!0):this._options._useStatefulReconnect===!0&&n.append("useStatefulReconnect","true"),t.search=n.toString(),t.toString()}}function wc(s,e){return!s||(e&s)!==0}class Kr{constructor(e){this._transport=e,this._buffer=[],this._executing=!0,this._sendBufferedData=new ji,this._transportResult=new ji,this._sendLoopPromise=this._sendLoop()}send(e){return this._bufferData(e),this._transportResult||(this._transportResult=new ji),this._transportResult.promise}stop(){return this._executing=!1,this._sendBufferedData.resolve(),this._sendLoopPromise}_bufferData(e){if(this._buffer.length&&typeof this._buffer[0]!=typeof e)throw new Error(`Expected data to be of type ${typeof this._buffer} but was of type ${typeof e}`);this._buffer.push(e),this._sendBufferedData.resolve()}async _sendLoop(){for(;;){if(await this._sendBufferedData.promise,!this._executing){this._transportResult&&this._transportResult.reject("Connection stopped.");break}this._sendBufferedData=new ji;const e=this._transportResult;this._transportResult=void 0;const t=typeof this._buffer[0]=="string"?this._buffer.join(""):Kr._concatBuffers(this._buffer);this._buffer.length=0;try{await this._transport.send(t),e.resolve()}catch(n){e.reject(n)}}}static _concatBuffers(e){const t=e.map(r=>r.byteLength).reduce((r,o)=>r+o),n=new Uint8Array(t);let i=0;for(const r of e)n.set(new Uint8Array(r),i),i+=r.byteLength;return n.buffer}}class ji{constructor(){this.promise=new Promise((e,t)=>[this._resolver,this._rejecter]=[e,t])}resolve(){this._resolver()}reject(e){this._rejecter(e)}}const Tc="json";class Ac{constructor(){this.name=Tc,this.version=2,this.transferFormat=Tt.Text}parseMessages(e,t){if(typeof e!="string")throw new Error("Invalid input for JSON hub protocol. Expected a string.");if(!e)return[];t===null&&(t=Oi.instance);const n=Gt.parse(e),i=[];for(const r of n){const o=JSON.parse(r);if(typeof o.type!="number")throw new Error("Invalid payload.");switch(o.type){case Ue.Invocation:this._isInvocationMessage(o);break;case Ue.StreamItem:this._isStreamItemMessage(o);break;case Ue.Completion:this._isCompletionMessage(o);break;case Ue.Ping:break;case Ue.Close:break;case Ue.Ack:this._isAckMessage(o);break;case Ue.Sequence:this._isSequenceMessage(o);break;default:t.log(V.Information,"Unknown message type '"+o.type+"' ignored.");continue}i.push(o)}return i}writeMessage(e){return Gt.write(JSON.stringify(e))}_isInvocationMessage(e){this._assertNotEmptyString(e.target,"Invalid payload for Invocation message."),e.invocationId!==void 0&&this._assertNotEmptyString(e.invocationId,"Invalid payload for Invocation message.")}_isStreamItemMessage(e){if(this._assertNotEmptyString(e.invocationId,"Invalid payload for StreamItem message."),e.item===void 0)throw new Error("Invalid payload for StreamItem message.")}_isCompletionMessage(e){if(e.result&&e.error)throw new Error("Invalid payload for Completion message.");!e.result&&e.error&&this._assertNotEmptyString(e.error,"Invalid payload for Completion message."),this._assertNotEmptyString(e.invocationId,"Invalid payload for Completion message.")}_isAckMessage(e){if(typeof e.sequenceId!="number")throw new Error("Invalid SequenceId for Ack message.")}_isSequenceMessage(e){if(typeof e.sequenceId!="number")throw new Error("Invalid SequenceId for Sequence message.")}_assertNotEmptyString(e,t){if(typeof e!="string"||e==="")throw new Error(t)}}const Cc={trace:V.Trace,debug:V.Debug,info:V.Information,information:V.Information,warn:V.Warning,warning:V.Warning,error:V.Error,critical:V.Critical,none:V.None};function Rc(s){const e=Cc[s.toLowerCase()];if(typeof e<"u")return e;throw new Error(`Unknown log level: ${s}`)}class Pc{configureLogging(e){if(ut.isRequired(e,"logging"),Lc(e))this.logger=e;else if(typeof e=="string"){const t=Rc(e);this.logger=new Is(t)}else this.logger=new Is(e);return this}withUrl(e,t){return ut.isRequired(e,"url"),ut.isNotEmpty(e,"url"),this.url=e,typeof t=="object"?this.httpConnectionOptions={...this.httpConnectionOptions,...t}:this.httpConnectionOptions={...this.httpConnectionOptions,transport:t},this}withHubProtocol(e){return ut.isRequired(e,"protocol"),this.protocol=e,this}withAutomaticReconnect(e){if(this.reconnectPolicy)throw new Error("A reconnectPolicy has already been set.");return e?Array.isArray(e)?this.reconnectPolicy=new go(e):this.reconnectPolicy=e:this.reconnectPolicy=new go,this}withServerTimeout(e){return ut.isRequired(e,"milliseconds"),this._serverTimeoutInMilliseconds=e,this}withKeepAliveInterval(e){return ut.isRequired(e,"milliseconds"),this._keepAliveIntervalInMilliseconds=e,this}withStatefulReconnect(e){return this.httpConnectionOptions===void 0&&(this.httpConnectionOptions={}),this.httpConnectionOptions._useStatefulReconnect=!0,this._statefulReconnectBufferSize=e==null?void 0:e.bufferSize,this}build(){const e=this.httpConnectionOptions||{};if(e.logger===void 0&&(e.logger=this.logger),!this.url)throw new Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");const t=new bc(this.url,e);return jr.create(t,this.logger||Oi.instance,this.protocol||new Ac,this.reconnectPolicy,this._serverTimeoutInMilliseconds,this._keepAliveIntervalInMilliseconds,this._statefulReconnectBufferSize)}}function Lc(s){return s.log!==void 0}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Zr="160",Ic=0,xo=1,Dc=2,al=1,Uc=2,dn=3,rn=0,At=1,Jt=2,An=0,Wn=1,yo=2,So=3,Mo=4,Nc=5,zn=100,Fc=101,kc=102,Eo=103,bo=104,Oc=200,Bc=201,zc=202,Gc=203,Ur=204,Nr=205,Hc=206,Vc=207,Wc=208,Xc=209,qc=210,$c=211,Yc=212,jc=213,Kc=214,Zc=0,Jc=1,Qc=2,Ds=3,eh=4,th=5,nh=6,ih=7,Jr=0,sh=1,rh=2,Cn=0,oh=1,ah=2,lh=3,ch=4,hh=5,uh=6,ll=300,Mi=301,Ei=302,Fr=303,kr=304,Hs=306,zi=1e3,Qt=1001,Or=1002,St=1003,wo=1004,Js=1005,Ut=1006,dh=1007,Gi=1008,Rn=1009,fh=1010,ph=1011,Qr=1012,cl=1013,bn=1014,wn=1015,Hi=1016,hl=1017,ul=1018,Xn=1020,mh=1021,en=1023,gh=1024,_h=1025,qn=1026,bi=1027,vh=1028,dl=1029,xh=1030,fl=1031,pl=1033,Qs=33776,er=33777,tr=33778,nr=33779,To=35840,Ao=35841,Co=35842,Ro=35843,ml=36196,Po=37492,Lo=37496,Io=37808,Do=37809,Uo=37810,No=37811,Fo=37812,ko=37813,Oo=37814,Bo=37815,zo=37816,Go=37817,Ho=37818,Vo=37819,Wo=37820,Xo=37821,ir=36492,qo=36494,$o=36495,yh=36283,Yo=36284,jo=36285,Ko=36286,gl=3e3,$n=3001,Sh=3200,Mh=3201,_l=0,Eh=1,$t="",Mt="srgb",mn="srgb-linear",eo="display-p3",Vs="display-p3-linear",Us="linear",et="srgb",Ns="rec709",Fs="p3",Jn=7680,Zo=519,bh=512,wh=513,Th=514,vl=515,Ah=516,Ch=517,Rh=518,Ph=519,Br=35044,Jo="300 es",zr=1035,pn=2e3,ks=2001;class Ti{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}}const bt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ps=Math.PI/180,Gr=180/Math.PI;function Pn(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(bt[s&255]+bt[s>>8&255]+bt[s>>16&255]+bt[s>>24&255]+"-"+bt[e&255]+bt[e>>8&255]+"-"+bt[e>>16&15|64]+bt[e>>24&255]+"-"+bt[t&63|128]+bt[t>>8&255]+"-"+bt[t>>16&255]+bt[t>>24&255]+bt[n&255]+bt[n>>8&255]+bt[n>>16&255]+bt[n>>24&255]).toLowerCase()}function Nt(s,e,t){return Math.max(e,Math.min(t,s))}function Lh(s,e){return(s%e+e)%e}function sr(s,e,t){return(1-t)*s+t*e}function Qo(s){return(s&s-1)===0&&s!==0}function Hr(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function fn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Ke(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}class We{constructor(e=0,t=0){We.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*i+e.x,this.y=r*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ve{constructor(e,t,n,i,r,o,a,l,c){Ve.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c)}set(e,t,n,i,r,o,a,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],m=n[5],g=n[8],_=i[0],p=i[3],f=i[6],E=i[1],y=i[4],w=i[7],P=i[2],T=i[5],A=i[8];return r[0]=o*_+a*E+l*P,r[3]=o*p+a*y+l*T,r[6]=o*f+a*w+l*A,r[1]=c*_+h*E+u*P,r[4]=c*p+h*y+u*T,r[7]=c*f+h*w+u*A,r[2]=d*_+m*E+g*P,r[5]=d*p+m*y+g*T,r[8]=d*f+m*w+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,d=a*l-h*r,m=c*r-o*l,g=t*u+n*d+i*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=u*_,e[1]=(i*c-h*n)*_,e[2]=(a*n-i*o)*_,e[3]=d*_,e[4]=(h*t-i*l)*_,e[5]=(i*r-a*t)*_,e[6]=m*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-i*c,i*l,-i*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(rr.makeScale(e,t)),this}rotate(e){return this.premultiply(rr.makeRotation(-e)),this}translate(e,t){return this.premultiply(rr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const rr=new Ve;function xl(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Os(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Ih(){const s=Os("canvas");return s.style.display="block",s}const ea={};function Fi(s){s in ea||(ea[s]=!0,console.warn(s))}const ta=new Ve().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),na=new Ve().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Ki={[mn]:{transfer:Us,primaries:Ns,toReference:s=>s,fromReference:s=>s},[Mt]:{transfer:et,primaries:Ns,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[Vs]:{transfer:Us,primaries:Fs,toReference:s=>s.applyMatrix3(na),fromReference:s=>s.applyMatrix3(ta)},[eo]:{transfer:et,primaries:Fs,toReference:s=>s.convertSRGBToLinear().applyMatrix3(na),fromReference:s=>s.applyMatrix3(ta).convertLinearToSRGB()}},Dh=new Set([mn,Vs]),je={enabled:!0,_workingColorSpace:mn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!Dh.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,e,t){if(this.enabled===!1||e===t||!e||!t)return s;const n=Ki[e].toReference,i=Ki[t].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,e){return this.convert(s,this._workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this._workingColorSpace)},getPrimaries:function(s){return Ki[s].primaries},getTransfer:function(s){return s===$t?Us:Ki[s].transfer}};function yi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function or(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Qn;class yl{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Qn===void 0&&(Qn=Os("canvas")),Qn.width=e.width,Qn.height=e.height;const n=Qn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Qn}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Os("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=yi(r[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(yi(t[n]/255)*255):t[n]=yi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Uh=0;class Sl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Uh++}),this.uuid=Pn(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(ar(i[o].image)):r.push(ar(i[o]))}else r=ar(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function ar(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?yl.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Nh=0;class Ft extends Ti{constructor(e=Ft.DEFAULT_IMAGE,t=Ft.DEFAULT_MAPPING,n=Qt,i=Qt,r=Ut,o=Gi,a=en,l=Rn,c=Ft.DEFAULT_ANISOTROPY,h=$t){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Nh++}),this.uuid=Pn(),this.name="",this.source=new Sl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new We(0,0),this.repeat=new We(1,1),this.center=new We(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ve,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Fi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===$n?Mt:$t),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ll)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case zi:e.x=e.x-Math.floor(e.x);break;case Qt:e.x=e.x<0?0:1;break;case Or:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case zi:e.y=e.y-Math.floor(e.y);break;case Qt:e.y=e.y<0?0:1;break;case Or:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Fi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Mt?$n:gl}set encoding(e){Fi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===$n?Mt:$t}}Ft.DEFAULT_IMAGE=null;Ft.DEFAULT_MAPPING=ll;Ft.DEFAULT_ANISOTROPY=1;class yt{constructor(e=0,t=0,n=0,i=1){yt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],m=l[5],g=l[9],_=l[2],p=l[6],f=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+p)<.1&&Math.abs(c+m+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(c+1)/2,w=(m+1)/2,P=(f+1)/2,T=(h+d)/4,A=(u+_)/4,j=(g+p)/4;return y>w&&y>P?y<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(y),i=T/n,r=A/n):w>P?w<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(w),n=T/i,r=j/i):P<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(P),n=A/r,i=j/r),this.set(n,i,r,t),this}let E=Math.sqrt((p-g)*(p-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(E)<.001&&(E=1),this.x=(p-g)/E,this.y=(u-_)/E,this.z=(d-h)/E,this.w=Math.acos((c+m+f-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Fh extends Ti{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new yt(0,0,e,t),this.scissorTest=!1,this.viewport=new yt(0,0,e,t);const i={width:e,height:t,depth:1};n.encoding!==void 0&&(Fi("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===$n?Mt:$t),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ut,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Ft(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Sl(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Kn extends Fh{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Ml extends Ft{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=St,this.minFilter=St,this.wrapR=Qt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class kh extends Ft{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=St,this.minFilter=St,this.wrapR=Qt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Vi{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3];const d=r[o+0],m=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=d,e[t+1]=m,e[t+2]=g,e[t+3]=_;return}if(u!==_||l!==d||c!==m||h!==g){let p=1-a;const f=l*d+c*m+h*g+u*_,E=f>=0?1:-1,y=1-f*f;if(y>Number.EPSILON){const P=Math.sqrt(y),T=Math.atan2(P,f*E);p=Math.sin(p*T)/P,a=Math.sin(a*T)/P}const w=a*E;if(l=l*p+d*w,c=c*p+m*w,h=h*p+g*w,u=u*p+_*w,p===1-a){const P=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=P,c*=P,h*=P,u*=P}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,o){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[o],d=r[o+1],m=r[o+2],g=r[o+3];return e[t]=a*g+h*u+l*m-c*d,e[t+1]=l*g+h*d+c*u-a*m,e[t+2]=c*g+h*m+a*d-l*u,e[t+3]=h*g-a*u-l*d-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),u=a(r/2),d=l(n/2),m=l(i/2),g=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*m*g,this._y=c*m*u-d*h*g,this._z=c*h*g+d*m*u,this._w=c*h*u-d*m*g;break;case"YXZ":this._x=d*h*u+c*m*g,this._y=c*m*u-d*h*g,this._z=c*h*g-d*m*u,this._w=c*h*u+d*m*g;break;case"ZXY":this._x=d*h*u-c*m*g,this._y=c*m*u+d*h*g,this._z=c*h*g+d*m*u,this._w=c*h*u-d*m*g;break;case"ZYX":this._x=d*h*u-c*m*g,this._y=c*m*u+d*h*g,this._z=c*h*g-d*m*u,this._w=c*h*u+d*m*g;break;case"YZX":this._x=d*h*u+c*m*g,this._y=c*m*u+d*h*g,this._z=c*h*g-d*m*u,this._w=c*h*u-d*m*g;break;case"XZY":this._x=d*h*u-c*m*g,this._y=c*m*u-d*h*g,this._z=c*h*g+d*m*u,this._w=c*h*u+d*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){const m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(o-i)*m}else if(n>a&&n>u){const m=2*Math.sqrt(1+n-a-u);this._w=(h-l)/m,this._x=.25*m,this._y=(i+o)/m,this._z=(r+c)/m}else if(a>u){const m=2*Math.sqrt(1+a-n-u);this._w=(r-c)/m,this._x=(i+o)/m,this._y=.25*m,this._z=(l+h)/m}else{const m=2*Math.sqrt(1+u-n-a);this._w=(o-i)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Nt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const m=1-t;return this._w=m*o+t*this._w,this._x=m*n+t*this._x,this._y=m*i+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),i=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(t*Math.cos(i),n*Math.sin(r),n*Math.cos(r),t*Math.sin(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(e=0,t=0,n=0){R.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ia.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ia.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*i-a*n),h=2*(a*t-r*i),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=i+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return lr.copy(this).projectOnVector(e),this.sub(lr)}reflect(e){return this.sub(lr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const lr=new R,ia=new Vi;class Wi{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(jt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(jt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=jt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,jt):jt.fromBufferAttribute(r,o),jt.applyMatrix4(e.matrixWorld),this.expandByPoint(jt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Zi.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Zi.copy(n.boundingBox)),Zi.applyMatrix4(e.matrixWorld),this.union(Zi)}const i=e.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,jt),jt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ri),Ji.subVectors(this.max,Ri),ei.subVectors(e.a,Ri),ti.subVectors(e.b,Ri),ni.subVectors(e.c,Ri),_n.subVectors(ti,ei),vn.subVectors(ni,ti),Dn.subVectors(ei,ni);let t=[0,-_n.z,_n.y,0,-vn.z,vn.y,0,-Dn.z,Dn.y,_n.z,0,-_n.x,vn.z,0,-vn.x,Dn.z,0,-Dn.x,-_n.y,_n.x,0,-vn.y,vn.x,0,-Dn.y,Dn.x,0];return!cr(t,ei,ti,ni,Ji)||(t=[1,0,0,0,1,0,0,0,1],!cr(t,ei,ti,ni,Ji))?!1:(Qi.crossVectors(_n,vn),t=[Qi.x,Qi.y,Qi.z],cr(t,ei,ti,ni,Ji))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,jt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(jt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(an[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),an[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),an[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),an[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),an[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),an[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),an[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),an[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(an),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const an=[new R,new R,new R,new R,new R,new R,new R,new R],jt=new R,Zi=new Wi,ei=new R,ti=new R,ni=new R,_n=new R,vn=new R,Dn=new R,Ri=new R,Ji=new R,Qi=new R,Un=new R;function cr(s,e,t,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Un.fromArray(s,r);const a=i.x*Math.abs(Un.x)+i.y*Math.abs(Un.y)+i.z*Math.abs(Un.z),l=e.dot(Un),c=t.dot(Un),h=n.dot(Un);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const Oh=new Wi,Pi=new R,hr=new R;class Xi{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Oh.setFromPoints(e).getCenter(n);let i=0;for(let r=0,o=e.length;r<o;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Pi.subVectors(e,this.center);const t=Pi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Pi,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(hr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Pi.copy(e.center).add(hr)),this.expandByPoint(Pi.copy(e.center).sub(hr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ln=new R,ur=new R,es=new R,xn=new R,dr=new R,ts=new R,fr=new R;class Ws{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ln)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ln.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ln.copy(this.origin).addScaledVector(this.direction,t),ln.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){ur.copy(e).add(t).multiplyScalar(.5),es.copy(t).sub(e).normalize(),xn.copy(this.origin).sub(ur);const r=e.distanceTo(t)*.5,o=-this.direction.dot(es),a=xn.dot(this.direction),l=-xn.dot(es),c=xn.lengthSq(),h=Math.abs(1-o*o);let u,d,m,g;if(h>0)if(u=o*l-a,d=o*a-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,m=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),m=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),m=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),m=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),m=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),m=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),m=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(ur).addScaledVector(es,d),m}intersectSphere(e,t){ln.subVectors(e.center,this.origin);const n=ln.dot(this.direction),i=ln.dot(ln)-n*n,r=e.radius*e.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,ln)!==null}intersectTriangle(e,t,n,i,r){dr.subVectors(t,e),ts.subVectors(n,e),fr.crossVectors(dr,ts);let o=this.direction.dot(fr),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;xn.subVectors(this.origin,e);const l=a*this.direction.dot(ts.crossVectors(xn,ts));if(l<0)return null;const c=a*this.direction.dot(dr.cross(xn));if(c<0||l+c>o)return null;const h=-a*xn.dot(fr);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class at{constructor(e,t,n,i,r,o,a,l,c,h,u,d,m,g,_,p){at.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c,h,u,d,m,g,_,p)}set(e,t,n,i,r,o,a,l,c,h,u,d,m,g,_,p){const f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=i,f[1]=r,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=h,f[10]=u,f[14]=d,f[3]=m,f[7]=g,f[11]=_,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new at().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/ii.setFromMatrixColumn(e,0).length(),r=1/ii.setFromMatrixColumn(e,1).length(),o=1/ii.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=o*h,m=o*u,g=a*h,_=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=m+g*c,t[5]=d-_*c,t[9]=-a*l,t[2]=_-d*c,t[6]=g+m*c,t[10]=o*l}else if(e.order==="YXZ"){const d=l*h,m=l*u,g=c*h,_=c*u;t[0]=d+_*a,t[4]=g*a-m,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=m*a-g,t[6]=_+d*a,t[10]=o*l}else if(e.order==="ZXY"){const d=l*h,m=l*u,g=c*h,_=c*u;t[0]=d-_*a,t[4]=-o*u,t[8]=g+m*a,t[1]=m+g*a,t[5]=o*h,t[9]=_-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const d=o*h,m=o*u,g=a*h,_=a*u;t[0]=l*h,t[4]=g*c-m,t[8]=d*c+_,t[1]=l*u,t[5]=_*c+d,t[9]=m*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const d=o*l,m=o*c,g=a*l,_=a*c;t[0]=l*h,t[4]=_-d*u,t[8]=g*u+m,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=m*u+g,t[10]=d-_*u}else if(e.order==="XZY"){const d=o*l,m=o*c,g=a*l,_=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+_,t[5]=o*h,t[9]=m*u-g,t[2]=g*u-m,t[6]=a*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Bh,e,zh)}lookAt(e,t,n){const i=this.elements;return Ot.subVectors(e,t),Ot.lengthSq()===0&&(Ot.z=1),Ot.normalize(),yn.crossVectors(n,Ot),yn.lengthSq()===0&&(Math.abs(n.z)===1?Ot.x+=1e-4:Ot.z+=1e-4,Ot.normalize(),yn.crossVectors(n,Ot)),yn.normalize(),ns.crossVectors(Ot,yn),i[0]=yn.x,i[4]=ns.x,i[8]=Ot.x,i[1]=yn.y,i[5]=ns.y,i[9]=Ot.y,i[2]=yn.z,i[6]=ns.z,i[10]=Ot.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],m=n[13],g=n[2],_=n[6],p=n[10],f=n[14],E=n[3],y=n[7],w=n[11],P=n[15],T=i[0],A=i[4],j=i[8],M=i[12],b=i[1],G=i[5],X=i[9],te=i[13],L=i[2],O=i[6],H=i[10],K=i[14],W=i[3],q=i[7],$=i[11],ne=i[15];return r[0]=o*T+a*b+l*L+c*W,r[4]=o*A+a*G+l*O+c*q,r[8]=o*j+a*X+l*H+c*$,r[12]=o*M+a*te+l*K+c*ne,r[1]=h*T+u*b+d*L+m*W,r[5]=h*A+u*G+d*O+m*q,r[9]=h*j+u*X+d*H+m*$,r[13]=h*M+u*te+d*K+m*ne,r[2]=g*T+_*b+p*L+f*W,r[6]=g*A+_*G+p*O+f*q,r[10]=g*j+_*X+p*H+f*$,r[14]=g*M+_*te+p*K+f*ne,r[3]=E*T+y*b+w*L+P*W,r[7]=E*A+y*G+w*O+P*q,r[11]=E*j+y*X+w*H+P*$,r[15]=E*M+y*te+w*K+P*ne,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],m=e[14],g=e[3],_=e[7],p=e[11],f=e[15];return g*(+r*l*u-i*c*u-r*a*d+n*c*d+i*a*m-n*l*m)+_*(+t*l*m-t*c*d+r*o*d-i*o*m+i*c*h-r*l*h)+p*(+t*c*u-t*a*m-r*o*u+n*o*m+r*a*h-n*c*h)+f*(-i*a*h-t*l*u+t*a*d+i*o*u-n*o*d+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],m=e[11],g=e[12],_=e[13],p=e[14],f=e[15],E=u*p*c-_*d*c+_*l*m-a*p*m-u*l*f+a*d*f,y=g*d*c-h*p*c-g*l*m+o*p*m+h*l*f-o*d*f,w=h*_*c-g*u*c+g*a*m-o*_*m-h*a*f+o*u*f,P=g*u*l-h*_*l-g*a*d+o*_*d+h*a*p-o*u*p,T=t*E+n*y+i*w+r*P;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return e[0]=E*A,e[1]=(_*d*r-u*p*r-_*i*m+n*p*m+u*i*f-n*d*f)*A,e[2]=(a*p*r-_*l*r+_*i*c-n*p*c-a*i*f+n*l*f)*A,e[3]=(u*l*r-a*d*r-u*i*c+n*d*c+a*i*m-n*l*m)*A,e[4]=y*A,e[5]=(h*p*r-g*d*r+g*i*m-t*p*m-h*i*f+t*d*f)*A,e[6]=(g*l*r-o*p*r-g*i*c+t*p*c+o*i*f-t*l*f)*A,e[7]=(o*d*r-h*l*r+h*i*c-t*d*c-o*i*m+t*l*m)*A,e[8]=w*A,e[9]=(g*u*r-h*_*r-g*n*m+t*_*m+h*n*f-t*u*f)*A,e[10]=(o*_*r-g*a*r+g*n*c-t*_*c-o*n*f+t*a*f)*A,e[11]=(h*a*r-o*u*r-h*n*c+t*u*c+o*n*m-t*a*m)*A,e[12]=P*A,e[13]=(h*_*i-g*u*i+g*n*d-t*_*d-h*n*p+t*u*p)*A,e[14]=(g*a*i-o*_*i-g*n*l+t*_*l+o*n*p-t*a*p)*A,e[15]=(o*u*i-h*a*i+h*n*l-t*u*l-o*n*d+t*a*d)*A,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,o){return this.set(1,n,r,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,d=r*c,m=r*h,g=r*u,_=o*h,p=o*u,f=a*u,E=l*c,y=l*h,w=l*u,P=n.x,T=n.y,A=n.z;return i[0]=(1-(_+f))*P,i[1]=(m+w)*P,i[2]=(g-y)*P,i[3]=0,i[4]=(m-w)*T,i[5]=(1-(d+f))*T,i[6]=(p+E)*T,i[7]=0,i[8]=(g+y)*A,i[9]=(p-E)*A,i[10]=(1-(d+_))*A,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=ii.set(i[0],i[1],i[2]).length();const o=ii.set(i[4],i[5],i[6]).length(),a=ii.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],Kt.copy(this);const c=1/r,h=1/o,u=1/a;return Kt.elements[0]*=c,Kt.elements[1]*=c,Kt.elements[2]*=c,Kt.elements[4]*=h,Kt.elements[5]*=h,Kt.elements[6]*=h,Kt.elements[8]*=u,Kt.elements[9]*=u,Kt.elements[10]*=u,t.setFromRotationMatrix(Kt),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,i,r,o,a=pn){const l=this.elements,c=2*r/(t-e),h=2*r/(n-i),u=(t+e)/(t-e),d=(n+i)/(n-i);let m,g;if(a===pn)m=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===ks)m=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,r,o,a=pn){const l=this.elements,c=1/(t-e),h=1/(n-i),u=1/(o-r),d=(t+e)*c,m=(n+i)*h;let g,_;if(a===pn)g=(o+r)*u,_=-2*u;else if(a===ks)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const ii=new R,Kt=new at,Bh=new R(0,0,0),zh=new R(1,1,1),yn=new R,ns=new R,Ot=new R,sa=new at,ra=new Vi;class qi{constructor(e=0,t=0,n=0,i=qi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],m=i[10];switch(t){case"XYZ":this._y=Math.asin(Nt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Nt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Nt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Nt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Nt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-Nt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return sa.makeRotationFromQuaternion(e),this.setFromRotationMatrix(sa,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ra.setFromEuler(this),this.setFromQuaternion(ra,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}qi.DEFAULT_ORDER="XYZ";class to{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Gh=0;const oa=new R,si=new Vi,cn=new at,is=new R,Li=new R,Hh=new R,Vh=new Vi,aa=new R(1,0,0),la=new R(0,1,0),ca=new R(0,0,1),Wh={type:"added"},Xh={type:"removed"};class ft extends Ti{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Gh++}),this.uuid=Pn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ft.DEFAULT_UP.clone();const e=new R,t=new qi,n=new Vi,i=new R(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new at},normalMatrix:{value:new Ve}}),this.matrix=new at,this.matrixWorld=new at,this.matrixAutoUpdate=ft.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new to,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return si.setFromAxisAngle(e,t),this.quaternion.multiply(si),this}rotateOnWorldAxis(e,t){return si.setFromAxisAngle(e,t),this.quaternion.premultiply(si),this}rotateX(e){return this.rotateOnAxis(aa,e)}rotateY(e){return this.rotateOnAxis(la,e)}rotateZ(e){return this.rotateOnAxis(ca,e)}translateOnAxis(e,t){return oa.copy(e).applyQuaternion(this.quaternion),this.position.add(oa.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(aa,e)}translateY(e){return this.translateOnAxis(la,e)}translateZ(e){return this.translateOnAxis(ca,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(cn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?is.copy(e):is.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Li.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?cn.lookAt(Li,is,this.up):cn.lookAt(is,Li,this.up),this.quaternion.setFromRotationMatrix(cn),i&&(cn.extractRotation(i.matrixWorld),si.setFromRotationMatrix(cn),this.quaternion.premultiply(si.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Wh)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Xh)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),cn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),cn.multiply(e.parent.matrixWorld)),e.applyMatrix4(cn),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Li,e,Hh),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Li,Vh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++){const r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++){const a=i[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),m=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}ft.DEFAULT_UP=new R(0,1,0);ft.DEFAULT_MATRIX_AUTO_UPDATE=!0;ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Zt=new R,hn=new R,pr=new R,un=new R,ri=new R,oi=new R,ha=new R,mr=new R,gr=new R,_r=new R;let ss=!1;class zt{constructor(e=new R,t=new R,n=new R){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Zt.subVectors(e,t),i.cross(Zt);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){Zt.subVectors(i,t),hn.subVectors(n,t),pr.subVectors(e,t);const o=Zt.dot(Zt),a=Zt.dot(hn),l=Zt.dot(pr),c=hn.dot(hn),h=hn.dot(pr),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,m=(c*l-a*h)*d,g=(o*h-a*l)*d;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,un)===null?!1:un.x>=0&&un.y>=0&&un.x+un.y<=1}static getUV(e,t,n,i,r,o,a,l){return ss===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),ss=!0),this.getInterpolation(e,t,n,i,r,o,a,l)}static getInterpolation(e,t,n,i,r,o,a,l){return this.getBarycoord(e,t,n,i,un)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,un.x),l.addScaledVector(o,un.y),l.addScaledVector(a,un.z),l)}static isFrontFacing(e,t,n,i){return Zt.subVectors(n,t),hn.subVectors(e,t),Zt.cross(hn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Zt.subVectors(this.c,this.b),hn.subVectors(this.a,this.b),Zt.cross(hn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return zt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return zt.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,i,r){return ss===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),ss=!0),zt.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}getInterpolation(e,t,n,i,r){return zt.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return zt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return zt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let o,a;ri.subVectors(i,n),oi.subVectors(r,n),mr.subVectors(e,n);const l=ri.dot(mr),c=oi.dot(mr);if(l<=0&&c<=0)return t.copy(n);gr.subVectors(e,i);const h=ri.dot(gr),u=oi.dot(gr);if(h>=0&&u<=h)return t.copy(i);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(ri,o);_r.subVectors(e,r);const m=ri.dot(_r),g=oi.dot(_r);if(g>=0&&m<=g)return t.copy(r);const _=m*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(oi,a);const p=h*g-m*u;if(p<=0&&u-h>=0&&m-g>=0)return ha.subVectors(r,i),a=(u-h)/(u-h+(m-g)),t.copy(i).addScaledVector(ha,a);const f=1/(p+_+d);return o=_*f,a=d*f,t.copy(n).addScaledVector(ri,o).addScaledVector(oi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const El={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Sn={h:0,s:0,l:0},rs={h:0,s:0,l:0};function vr(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Fe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Mt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,je.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=je.workingColorSpace){return this.r=e,this.g=t,this.b=n,je.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=je.workingColorSpace){if(e=Lh(e,1),t=Nt(t,0,1),n=Nt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=vr(o,r,e+1/3),this.g=vr(o,r,e),this.b=vr(o,r,e-1/3)}return je.toWorkingColorSpace(this,i),this}setStyle(e,t=Mt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Mt){const n=El[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=yi(e.r),this.g=yi(e.g),this.b=yi(e.b),this}copyLinearToSRGB(e){return this.r=or(e.r),this.g=or(e.g),this.b=or(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Mt){return je.fromWorkingColorSpace(wt.copy(this),e),Math.round(Nt(wt.r*255,0,255))*65536+Math.round(Nt(wt.g*255,0,255))*256+Math.round(Nt(wt.b*255,0,255))}getHexString(e=Mt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=je.workingColorSpace){je.fromWorkingColorSpace(wt.copy(this),t);const n=wt.r,i=wt.g,r=wt.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=je.workingColorSpace){return je.fromWorkingColorSpace(wt.copy(this),t),e.r=wt.r,e.g=wt.g,e.b=wt.b,e}getStyle(e=Mt){je.fromWorkingColorSpace(wt.copy(this),e);const t=wt.r,n=wt.g,i=wt.b;return e!==Mt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Sn),this.setHSL(Sn.h+e,Sn.s+t,Sn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Sn),e.getHSL(rs);const n=sr(Sn.h,rs.h,t),i=sr(Sn.s,rs.s,t),r=sr(Sn.l,rs.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const wt=new Fe;Fe.NAMES=El;let qh=0;class gn extends Ti{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:qh++}),this.uuid=Pn(),this.name="",this.type="Material",this.blending=Wn,this.side=rn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ur,this.blendDst=Nr,this.blendEquation=zn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Fe(0,0,0),this.blendAlpha=0,this.depthFunc=Ds,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Jn,this.stencilZFail=Jn,this.stencilZPass=Jn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Wn&&(n.blending=this.blending),this.side!==rn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ur&&(n.blendSrc=this.blendSrc),this.blendDst!==Nr&&(n.blendDst=this.blendDst),this.blendEquation!==zn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ds&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Zo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Jn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Jn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Jn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(t){const r=i(e.textures),o=i(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Yn extends gn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Fe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Jr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ht=new R,os=new We;class Yt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Br,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=wn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)os.fromBufferAttribute(this,t),os.applyMatrix3(e),this.setXY(t,os.x,os.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)ht.fromBufferAttribute(this,t),ht.applyMatrix3(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)ht.fromBufferAttribute(this,t),ht.applyMatrix4(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ht.fromBufferAttribute(this,t),ht.applyNormalMatrix(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ht.fromBufferAttribute(this,t),ht.transformDirection(e),this.setXYZ(t,ht.x,ht.y,ht.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=fn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ke(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=fn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ke(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=fn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ke(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=fn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ke(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=fn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ke(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ke(t,this.array),n=Ke(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Ke(t,this.array),n=Ke(n,this.array),i=Ke(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=Ke(t,this.array),n=Ke(n,this.array),i=Ke(i,this.array),r=Ke(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Br&&(e.usage=this.usage),e}}class bl extends Yt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class wl extends Yt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class ct extends Yt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let $h=0;const Vt=new at,xr=new ft,ai=new R,Bt=new Wi,Ii=new Wi,xt=new R;class Dt extends Ti{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:$h++}),this.uuid=Pn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(xl(e)?wl:bl)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ve().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Vt.makeRotationFromQuaternion(e),this.applyMatrix4(Vt),this}rotateX(e){return Vt.makeRotationX(e),this.applyMatrix4(Vt),this}rotateY(e){return Vt.makeRotationY(e),this.applyMatrix4(Vt),this}rotateZ(e){return Vt.makeRotationZ(e),this.applyMatrix4(Vt),this}translate(e,t,n){return Vt.makeTranslation(e,t,n),this.applyMatrix4(Vt),this}scale(e,t,n){return Vt.makeScale(e,t,n),this.applyMatrix4(Vt),this}lookAt(e){return xr.lookAt(e),xr.updateMatrix(),this.applyMatrix4(xr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ai).negate(),this.translate(ai.x,ai.y,ai.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new ct(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Wi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];Bt.setFromBufferAttribute(r),this.morphTargetsRelative?(xt.addVectors(this.boundingBox.min,Bt.min),this.boundingBox.expandByPoint(xt),xt.addVectors(this.boundingBox.max,Bt.max),this.boundingBox.expandByPoint(xt)):(this.boundingBox.expandByPoint(Bt.min),this.boundingBox.expandByPoint(Bt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Xi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new R,1/0);return}if(e){const n=this.boundingSphere.center;if(Bt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];Ii.setFromBufferAttribute(a),this.morphTargetsRelative?(xt.addVectors(Bt.min,Ii.min),Bt.expandByPoint(xt),xt.addVectors(Bt.max,Ii.max),Bt.expandByPoint(xt)):(Bt.expandByPoint(Ii.min),Bt.expandByPoint(Ii.max))}Bt.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)xt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(xt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)xt.fromBufferAttribute(a,c),l&&(ai.fromBufferAttribute(e,c),xt.add(ai)),i=Math.max(i,n.distanceToSquared(xt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.array,i=t.position.array,r=t.normal.array,o=t.uv.array,a=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Yt(new Float32Array(4*a),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let b=0;b<a;b++)c[b]=new R,h[b]=new R;const u=new R,d=new R,m=new R,g=new We,_=new We,p=new We,f=new R,E=new R;function y(b,G,X){u.fromArray(i,b*3),d.fromArray(i,G*3),m.fromArray(i,X*3),g.fromArray(o,b*2),_.fromArray(o,G*2),p.fromArray(o,X*2),d.sub(u),m.sub(u),_.sub(g),p.sub(g);const te=1/(_.x*p.y-p.x*_.y);isFinite(te)&&(f.copy(d).multiplyScalar(p.y).addScaledVector(m,-_.y).multiplyScalar(te),E.copy(m).multiplyScalar(_.x).addScaledVector(d,-p.x).multiplyScalar(te),c[b].add(f),c[G].add(f),c[X].add(f),h[b].add(E),h[G].add(E),h[X].add(E))}let w=this.groups;w.length===0&&(w=[{start:0,count:n.length}]);for(let b=0,G=w.length;b<G;++b){const X=w[b],te=X.start,L=X.count;for(let O=te,H=te+L;O<H;O+=3)y(n[O+0],n[O+1],n[O+2])}const P=new R,T=new R,A=new R,j=new R;function M(b){A.fromArray(r,b*3),j.copy(A);const G=c[b];P.copy(G),P.sub(A.multiplyScalar(A.dot(G))).normalize(),T.crossVectors(j,G);const te=T.dot(h[b])<0?-1:1;l[b*4]=P.x,l[b*4+1]=P.y,l[b*4+2]=P.z,l[b*4+3]=te}for(let b=0,G=w.length;b<G;++b){const X=w[b],te=X.start,L=X.count;for(let O=te,H=te+L;O<H;O+=3)M(n[O+0]),M(n[O+1]),M(n[O+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Yt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,m=n.count;d<m;d++)n.setXYZ(d,0,0,0);const i=new R,r=new R,o=new R,a=new R,l=new R,c=new R,h=new R,u=new R;if(e)for(let d=0,m=e.count;d<m;d+=3){const g=e.getX(d+0),_=e.getX(d+1),p=e.getX(d+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,p),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,p),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,m=t.count;d<m;d+=3)i.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)xt.fromBufferAttribute(e,t),xt.normalize(),e.setXYZ(t,xt.x,xt.y,xt.z)}toNonIndexed(){function e(a,l){const c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h);let m=0,g=0;for(let _=0,p=l.length;_<p;_++){a.isInterleavedBufferAttribute?m=l[_]*a.data.stride+a.offset:m=l[_]*h;for(let f=0;f<h;f++)d[g++]=c[m++]}return new Yt(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Dt,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=e(l,n);t.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){const d=c[h],m=e(d,n);l.push(m)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const m=c[u];h.push(m.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,m=u.length;d<m;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ua=new at,Nn=new Ws,as=new Xi,da=new R,li=new R,ci=new R,hi=new R,yr=new R,ls=new R,cs=new We,hs=new We,us=new We,fa=new R,pa=new R,ma=new R,ds=new R,fs=new R;class $e extends ft{constructor(e=new Dt,t=new Yn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(r&&a){ls.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],u=r[l];h!==0&&(yr.fromBufferAttribute(u,e),o?ls.addScaledVector(yr,h):ls.addScaledVector(yr.sub(t),h))}t.add(ls)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),as.copy(n.boundingSphere),as.applyMatrix4(r),Nn.copy(e.ray).recast(e.near),!(as.containsPoint(Nn.origin)===!1&&(Nn.intersectSphere(as,da)===null||Nn.origin.distanceToSquared(da)>(e.far-e.near)**2))&&(ua.copy(r).invert(),Nn.copy(e.ray).applyMatrix4(ua),!(n.boundingBox!==null&&Nn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Nn)))}_computeIntersections(e,t,n){let i;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const p=d[g],f=o[p.materialIndex],E=Math.max(p.start,m.start),y=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let w=E,P=y;w<P;w+=3){const T=a.getX(w),A=a.getX(w+1),j=a.getX(w+2);i=ps(this,f,e,n,c,h,u,T,A,j),i&&(i.faceIndex=Math.floor(w/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,m.start),_=Math.min(a.count,m.start+m.count);for(let p=g,f=_;p<f;p+=3){const E=a.getX(p),y=a.getX(p+1),w=a.getX(p+2);i=ps(this,o,e,n,c,h,u,E,y,w),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const p=d[g],f=o[p.materialIndex],E=Math.max(p.start,m.start),y=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let w=E,P=y;w<P;w+=3){const T=w,A=w+1,j=w+2;i=ps(this,f,e,n,c,h,u,T,A,j),i&&(i.faceIndex=Math.floor(w/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,m.start),_=Math.min(l.count,m.start+m.count);for(let p=g,f=_;p<f;p+=3){const E=p,y=p+1,w=p+2;i=ps(this,o,e,n,c,h,u,E,y,w),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}}function Yh(s,e,t,n,i,r,o,a){let l;if(e.side===At?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,e.side===rn,a),l===null)return null;fs.copy(a),fs.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(fs);return c<t.near||c>t.far?null:{distance:c,point:fs.clone(),object:s}}function ps(s,e,t,n,i,r,o,a,l,c){s.getVertexPosition(a,li),s.getVertexPosition(l,ci),s.getVertexPosition(c,hi);const h=Yh(s,e,t,n,li,ci,hi,ds);if(h){i&&(cs.fromBufferAttribute(i,a),hs.fromBufferAttribute(i,l),us.fromBufferAttribute(i,c),h.uv=zt.getInterpolation(ds,li,ci,hi,cs,hs,us,new We)),r&&(cs.fromBufferAttribute(r,a),hs.fromBufferAttribute(r,l),us.fromBufferAttribute(r,c),h.uv1=zt.getInterpolation(ds,li,ci,hi,cs,hs,us,new We),h.uv2=h.uv1),o&&(fa.fromBufferAttribute(o,a),pa.fromBufferAttribute(o,l),ma.fromBufferAttribute(o,c),h.normal=zt.getInterpolation(ds,li,ci,hi,fa,pa,ma,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:l,c,normal:new R,materialIndex:0};zt.getNormal(li,ci,hi,u.normal),h.face=u}return h}class ot extends Dt{constructor(e=1,t=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,m=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,i,o,2),g("x","z","y",1,-1,e,n,-t,i,o,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new ct(c,3)),this.setAttribute("normal",new ct(h,3)),this.setAttribute("uv",new ct(u,2));function g(_,p,f,E,y,w,P,T,A,j,M){const b=w/A,G=P/j,X=w/2,te=P/2,L=T/2,O=A+1,H=j+1;let K=0,W=0;const q=new R;for(let $=0;$<H;$++){const ne=$*G-te;for(let ie=0;ie<O;ie++){const z=ie*b-X;q[_]=z*E,q[p]=ne*y,q[f]=L,c.push(q.x,q.y,q.z),q[_]=0,q[p]=0,q[f]=T>0?1:-1,h.push(q.x,q.y,q.z),u.push(ie/A),u.push(1-$/j),K+=1}}for(let $=0;$<j;$++)for(let ne=0;ne<A;ne++){const ie=d+ne+O*$,z=d+ne+O*($+1),Z=d+(ne+1)+O*($+1),ce=d+(ne+1)+O*$;l.push(ie,z,ce),l.push(z,Z,ce),W+=6}a.addGroup(m,W,M),m+=W,d+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ot(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function wi(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Lt(s){const e={};for(let t=0;t<s.length;t++){const n=wi(s[t]);for(const i in n)e[i]=n[i]}return e}function jh(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Tl(s){return s.getRenderTarget()===null?s.outputColorSpace:je.workingColorSpace}const Kh={clone:wi,merge:Lt};var Zh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Jh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Zn extends gn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Zh,this.fragmentShader=Jh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=wi(e.uniforms),this.uniformsGroups=jh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Al extends ft{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new at,this.projectionMatrix=new at,this.projectionMatrixInverse=new at,this.coordinateSystem=pn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class qt extends Al{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Gr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ps*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Gr*2*Math.atan(Math.tan(Ps*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,i,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ps*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,t-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ui=-90,di=1;class Qh extends ft{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new qt(ui,di,e,t);i.layers=this.layers,this.add(i);const r=new qt(ui,di,e,t);r.layers=this.layers,this.add(r);const o=new qt(ui,di,e,t);o.layers=this.layers,this.add(o);const a=new qt(ui,di,e,t);a.layers=this.layers,this.add(a);const l=new qt(ui,di,e,t);l.layers=this.layers,this.add(l);const c=new qt(ui,di,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,o,a,l]=t;for(const c of t)this.remove(c);if(e===pn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ks)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(u,d,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Cl extends Ft{constructor(e,t,n,i,r,o,a,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Mi,super(e,t,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class eu extends Kn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];t.encoding!==void 0&&(Fi("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===$n?Mt:$t),this.texture=new Cl(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Ut}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new ot(5,5,5),r=new Zn({name:"CubemapFromEquirect",uniforms:wi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:At,blending:An});r.uniforms.tEquirect.value=t;const o=new $e(i,r),a=t.minFilter;return t.minFilter===Gi&&(t.minFilter=Ut),new Qh(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,i){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(r)}}const Sr=new R,tu=new R,nu=new Ve;class On{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Sr.subVectors(n,t).cross(tu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Sr),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||nu.getNormalMatrix(e),i=this.coplanarPoint(Sr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Fn=new Xi,ms=new R;class no{constructor(e=new On,t=new On,n=new On,i=new On,r=new On,o=new On){this.planes=[e,t,n,i,r,o]}set(e,t,n,i,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=pn){const n=this.planes,i=e.elements,r=i[0],o=i[1],a=i[2],l=i[3],c=i[4],h=i[5],u=i[6],d=i[7],m=i[8],g=i[9],_=i[10],p=i[11],f=i[12],E=i[13],y=i[14],w=i[15];if(n[0].setComponents(l-r,d-c,p-m,w-f).normalize(),n[1].setComponents(l+r,d+c,p+m,w+f).normalize(),n[2].setComponents(l+o,d+h,p+g,w+E).normalize(),n[3].setComponents(l-o,d-h,p-g,w-E).normalize(),n[4].setComponents(l-a,d-u,p-_,w-y).normalize(),t===pn)n[5].setComponents(l+a,d+u,p+_,w+y).normalize();else if(t===ks)n[5].setComponents(a,u,_,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Fn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Fn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Fn)}intersectsSprite(e){return Fn.center.set(0,0,0),Fn.radius=.7071067811865476,Fn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Fn)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(ms.x=i.normal.x>0?e.max.x:e.min.x,ms.y=i.normal.y>0?e.max.y:e.min.y,ms.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(ms)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Rl(){let s=null,e=!1,t=null,n=null;function i(r,o){t(r,o),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function iu(s,e){const t=e.isWebGL2,n=new WeakMap;function i(c,h){const u=c.array,d=c.usage,m=u.byteLength,g=s.createBuffer();s.bindBuffer(h,g),s.bufferData(h,u,d),c.onUploadCallback();let _;if(u instanceof Float32Array)_=s.FLOAT;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(t)_=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=s.UNSIGNED_SHORT;else if(u instanceof Int16Array)_=s.SHORT;else if(u instanceof Uint32Array)_=s.UNSIGNED_INT;else if(u instanceof Int32Array)_=s.INT;else if(u instanceof Int8Array)_=s.BYTE;else if(u instanceof Uint8Array)_=s.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)_=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:_,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version,size:m}}function r(c,h,u){const d=h.array,m=h._updateRange,g=h.updateRanges;if(s.bindBuffer(u,c),m.count===-1&&g.length===0&&s.bufferSubData(u,0,d),g.length!==0){for(let _=0,p=g.length;_<p;_++){const f=g[_];t?s.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d,f.start,f.count):s.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d.subarray(f.start,f.start+f.count))}h.clearUpdateRanges()}m.count!==-1&&(t?s.bufferSubData(u,m.offset*d.BYTES_PER_ELEMENT,d,m.offset,m.count):s.bufferSubData(u,m.offset*d.BYTES_PER_ELEMENT,d.subarray(m.offset,m.offset+m.count)),m.count=-1),h.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(s.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const d=n.get(c);(!d||d.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const u=n.get(c);if(u===void 0)n.set(c,i(c,h));else if(u.version<c.version){if(u.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,c,h),u.version=c.version}}return{get:o,remove:a,update:l}}class Xs extends Dt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,u=e/a,d=t/l,m=[],g=[],_=[],p=[];for(let f=0;f<h;f++){const E=f*d-o;for(let y=0;y<c;y++){const w=y*u-r;g.push(w,-E,0),_.push(0,0,1),p.push(y/a),p.push(1-f/l)}}for(let f=0;f<l;f++)for(let E=0;E<a;E++){const y=E+c*f,w=E+c*(f+1),P=E+1+c*(f+1),T=E+1+c*f;m.push(y,w,T),m.push(w,P,T)}this.setIndex(m),this.setAttribute("position",new ct(g,3)),this.setAttribute("normal",new ct(_,3)),this.setAttribute("uv",new ct(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xs(e.width,e.height,e.widthSegments,e.heightSegments)}}var su=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ru=`#ifdef USE_ALPHAHASH
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
#endif`,ou=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,au=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,lu=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,cu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,hu=`#ifdef USE_AOMAP
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
#endif`,uu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,du=`#ifdef USE_BATCHING
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
#endif`,fu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,pu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,mu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,gu=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,_u=`#ifdef USE_IRIDESCENCE
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
#endif`,vu=`#ifdef USE_BUMPMAP
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
#endif`,xu=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,yu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Su=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Mu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Eu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,bu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,wu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Tu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Au=`#define PI 3.141592653589793
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
} // validated`,Cu=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ru=`vec3 transformedNormal = objectNormal;
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
#endif`,Pu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Lu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Iu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Du=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Uu="gl_FragColor = linearToOutputTexel( gl_FragColor );",Nu=`
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
}`,Fu=`#ifdef USE_ENVMAP
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
#endif`,ku=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ou=`#ifdef USE_ENVMAP
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
#endif`,Bu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,zu=`#ifdef USE_ENVMAP
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
#endif`,Gu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Hu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Vu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Wu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Xu=`#ifdef USE_GRADIENTMAP
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
}`,qu=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,$u=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Yu=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ju=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ku=`uniform bool receiveShadow;
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
#endif`,Zu=`#ifdef USE_ENVMAP
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
#endif`,Ju=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Qu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ed=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,td=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,nd=`PhysicalMaterial material;
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
#endif`,id=`struct PhysicalMaterial {
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
}`,sd=`
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
#endif`,rd=`#if defined( RE_IndirectDiffuse )
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
#endif`,od=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ad=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ld=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,cd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,hd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,ud=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,dd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,fd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,pd=`#if defined( USE_POINTS_UV )
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
#endif`,md=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,gd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,_d=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,vd=`#ifdef USE_MORPHNORMALS
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
#endif`,xd=`#ifdef USE_MORPHTARGETS
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
#endif`,yd=`#ifdef USE_MORPHTARGETS
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
#endif`,Sd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Md=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Ed=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,wd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Td=`#ifdef USE_NORMALMAP
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
#endif`,Ad=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Cd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Rd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Pd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ld=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Id=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Dd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ud=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Nd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Fd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,kd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Od=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Bd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,zd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Gd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Hd=`float getShadowMask() {
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
}`,Vd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Wd=`#ifdef USE_SKINNING
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
#endif`,Xd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,qd=`#ifdef USE_SKINNING
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
#endif`,$d=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Yd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,jd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Kd=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Zd=`#ifdef USE_TRANSMISSION
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
#endif`,Jd=`#ifdef USE_TRANSMISSION
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
#endif`,Qd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ef=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,tf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,nf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const sf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,rf=`uniform sampler2D t2D;
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
}`,of=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,af=`#ifdef ENVMAP_TYPE_CUBE
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
}`,lf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hf=`#include <common>
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
}`,uf=`#if DEPTH_PACKING == 3200
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
}`,df=`#define DISTANCE
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
}`,ff=`#define DISTANCE
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
}`,pf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,mf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gf=`uniform float scale;
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
}`,_f=`uniform vec3 diffuse;
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
}`,vf=`#include <common>
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
}`,xf=`uniform vec3 diffuse;
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
}`,yf=`#define LAMBERT
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
}`,Sf=`#define LAMBERT
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
}`,Mf=`#define MATCAP
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
}`,Ef=`#define MATCAP
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
}`,bf=`#define NORMAL
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
}`,wf=`#define NORMAL
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
}`,Tf=`#define PHONG
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
}`,Af=`#define PHONG
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
}`,Cf=`#define STANDARD
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
}`,Rf=`#define STANDARD
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
}`,Pf=`#define TOON
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
}`,Lf=`#define TOON
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
}`,If=`uniform float size;
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
}`,Df=`uniform vec3 diffuse;
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
}`,Uf=`#include <common>
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
}`,Nf=`uniform vec3 color;
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
}`,Ff=`uniform float rotation;
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
}`,kf=`uniform vec3 diffuse;
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
}`,Oe={alphahash_fragment:su,alphahash_pars_fragment:ru,alphamap_fragment:ou,alphamap_pars_fragment:au,alphatest_fragment:lu,alphatest_pars_fragment:cu,aomap_fragment:hu,aomap_pars_fragment:uu,batching_pars_vertex:du,batching_vertex:fu,begin_vertex:pu,beginnormal_vertex:mu,bsdfs:gu,iridescence_fragment:_u,bumpmap_pars_fragment:vu,clipping_planes_fragment:xu,clipping_planes_pars_fragment:yu,clipping_planes_pars_vertex:Su,clipping_planes_vertex:Mu,color_fragment:Eu,color_pars_fragment:bu,color_pars_vertex:wu,color_vertex:Tu,common:Au,cube_uv_reflection_fragment:Cu,defaultnormal_vertex:Ru,displacementmap_pars_vertex:Pu,displacementmap_vertex:Lu,emissivemap_fragment:Iu,emissivemap_pars_fragment:Du,colorspace_fragment:Uu,colorspace_pars_fragment:Nu,envmap_fragment:Fu,envmap_common_pars_fragment:ku,envmap_pars_fragment:Ou,envmap_pars_vertex:Bu,envmap_physical_pars_fragment:Zu,envmap_vertex:zu,fog_vertex:Gu,fog_pars_vertex:Hu,fog_fragment:Vu,fog_pars_fragment:Wu,gradientmap_pars_fragment:Xu,lightmap_fragment:qu,lightmap_pars_fragment:$u,lights_lambert_fragment:Yu,lights_lambert_pars_fragment:ju,lights_pars_begin:Ku,lights_toon_fragment:Ju,lights_toon_pars_fragment:Qu,lights_phong_fragment:ed,lights_phong_pars_fragment:td,lights_physical_fragment:nd,lights_physical_pars_fragment:id,lights_fragment_begin:sd,lights_fragment_maps:rd,lights_fragment_end:od,logdepthbuf_fragment:ad,logdepthbuf_pars_fragment:ld,logdepthbuf_pars_vertex:cd,logdepthbuf_vertex:hd,map_fragment:ud,map_pars_fragment:dd,map_particle_fragment:fd,map_particle_pars_fragment:pd,metalnessmap_fragment:md,metalnessmap_pars_fragment:gd,morphcolor_vertex:_d,morphnormal_vertex:vd,morphtarget_pars_vertex:xd,morphtarget_vertex:yd,normal_fragment_begin:Sd,normal_fragment_maps:Md,normal_pars_fragment:Ed,normal_pars_vertex:bd,normal_vertex:wd,normalmap_pars_fragment:Td,clearcoat_normal_fragment_begin:Ad,clearcoat_normal_fragment_maps:Cd,clearcoat_pars_fragment:Rd,iridescence_pars_fragment:Pd,opaque_fragment:Ld,packing:Id,premultiplied_alpha_fragment:Dd,project_vertex:Ud,dithering_fragment:Nd,dithering_pars_fragment:Fd,roughnessmap_fragment:kd,roughnessmap_pars_fragment:Od,shadowmap_pars_fragment:Bd,shadowmap_pars_vertex:zd,shadowmap_vertex:Gd,shadowmask_pars_fragment:Hd,skinbase_vertex:Vd,skinning_pars_vertex:Wd,skinning_vertex:Xd,skinnormal_vertex:qd,specularmap_fragment:$d,specularmap_pars_fragment:Yd,tonemapping_fragment:jd,tonemapping_pars_fragment:Kd,transmission_fragment:Zd,transmission_pars_fragment:Jd,uv_pars_fragment:Qd,uv_pars_vertex:ef,uv_vertex:tf,worldpos_vertex:nf,background_vert:sf,background_frag:rf,backgroundCube_vert:of,backgroundCube_frag:af,cube_vert:lf,cube_frag:cf,depth_vert:hf,depth_frag:uf,distanceRGBA_vert:df,distanceRGBA_frag:ff,equirect_vert:pf,equirect_frag:mf,linedashed_vert:gf,linedashed_frag:_f,meshbasic_vert:vf,meshbasic_frag:xf,meshlambert_vert:yf,meshlambert_frag:Sf,meshmatcap_vert:Mf,meshmatcap_frag:Ef,meshnormal_vert:bf,meshnormal_frag:wf,meshphong_vert:Tf,meshphong_frag:Af,meshphysical_vert:Cf,meshphysical_frag:Rf,meshtoon_vert:Pf,meshtoon_frag:Lf,points_vert:If,points_frag:Df,shadow_vert:Uf,shadow_frag:Nf,sprite_vert:Ff,sprite_frag:kf},oe={common:{diffuse:{value:new Fe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new We(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Fe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Fe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new Fe(16777215)},opacity:{value:1},center:{value:new We(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},sn={basic:{uniforms:Lt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.fog]),vertexShader:Oe.meshbasic_vert,fragmentShader:Oe.meshbasic_frag},lambert:{uniforms:Lt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new Fe(0)}}]),vertexShader:Oe.meshlambert_vert,fragmentShader:Oe.meshlambert_frag},phong:{uniforms:Lt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new Fe(0)},specular:{value:new Fe(1118481)},shininess:{value:30}}]),vertexShader:Oe.meshphong_vert,fragmentShader:Oe.meshphong_frag},standard:{uniforms:Lt([oe.common,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.roughnessmap,oe.metalnessmap,oe.fog,oe.lights,{emissive:{value:new Fe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag},toon:{uniforms:Lt([oe.common,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.gradientmap,oe.fog,oe.lights,{emissive:{value:new Fe(0)}}]),vertexShader:Oe.meshtoon_vert,fragmentShader:Oe.meshtoon_frag},matcap:{uniforms:Lt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,{matcap:{value:null}}]),vertexShader:Oe.meshmatcap_vert,fragmentShader:Oe.meshmatcap_frag},points:{uniforms:Lt([oe.points,oe.fog]),vertexShader:Oe.points_vert,fragmentShader:Oe.points_frag},dashed:{uniforms:Lt([oe.common,oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Oe.linedashed_vert,fragmentShader:Oe.linedashed_frag},depth:{uniforms:Lt([oe.common,oe.displacementmap]),vertexShader:Oe.depth_vert,fragmentShader:Oe.depth_frag},normal:{uniforms:Lt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,{opacity:{value:1}}]),vertexShader:Oe.meshnormal_vert,fragmentShader:Oe.meshnormal_frag},sprite:{uniforms:Lt([oe.sprite,oe.fog]),vertexShader:Oe.sprite_vert,fragmentShader:Oe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Oe.background_vert,fragmentShader:Oe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Oe.backgroundCube_vert,fragmentShader:Oe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Oe.cube_vert,fragmentShader:Oe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Oe.equirect_vert,fragmentShader:Oe.equirect_frag},distanceRGBA:{uniforms:Lt([oe.common,oe.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Oe.distanceRGBA_vert,fragmentShader:Oe.distanceRGBA_frag},shadow:{uniforms:Lt([oe.lights,oe.fog,{color:{value:new Fe(0)},opacity:{value:1}}]),vertexShader:Oe.shadow_vert,fragmentShader:Oe.shadow_frag}};sn.physical={uniforms:Lt([sn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new We(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new Fe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new We},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new Fe(0)},specularColor:{value:new Fe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new We},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag};const gs={r:0,b:0,g:0};function Of(s,e,t,n,i,r,o){const a=new Fe(0);let l=r===!0?0:1,c,h,u=null,d=0,m=null;function g(p,f){let E=!1,y=f.isScene===!0?f.background:null;y&&y.isTexture&&(y=(f.backgroundBlurriness>0?t:e).get(y)),y===null?_(a,l):y&&y.isColor&&(_(y,1),E=!0);const w=s.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||E)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),y&&(y.isCubeTexture||y.mapping===Hs)?(h===void 0&&(h=new $e(new ot(1,1,1),new Zn({name:"BackgroundCubeMaterial",uniforms:wi(sn.backgroundCube.uniforms),vertexShader:sn.backgroundCube.vertexShader,fragmentShader:sn.backgroundCube.fragmentShader,side:At,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(P,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=f.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,h.material.toneMapped=je.getTransfer(y.colorSpace)!==et,(u!==y||d!==y.version||m!==s.toneMapping)&&(h.material.needsUpdate=!0,u=y,d=y.version,m=s.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new $e(new Xs(2,2),new Zn({name:"BackgroundMaterial",uniforms:wi(sn.background.uniforms),vertexShader:sn.background.vertexShader,fragmentShader:sn.background.fragmentShader,side:rn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,c.material.toneMapped=je.getTransfer(y.colorSpace)!==et,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||d!==y.version||m!==s.toneMapping)&&(c.material.needsUpdate=!0,u=y,d=y.version,m=s.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null))}function _(p,f){p.getRGB(gs,Tl(s)),n.buffers.color.setClear(gs.r,gs.g,gs.b,f,o)}return{getClearColor:function(){return a},setClearColor:function(p,f=1){a.set(p),l=f,_(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,_(a,l)},render:g}}function Bf(s,e,t,n){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:e.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},l=p(null);let c=l,h=!1;function u(L,O,H,K,W){let q=!1;if(o){const $=_(K,H,O);c!==$&&(c=$,m(c.object)),q=f(L,K,H,W),q&&E(L,K,H,W)}else{const $=O.wireframe===!0;(c.geometry!==K.id||c.program!==H.id||c.wireframe!==$)&&(c.geometry=K.id,c.program=H.id,c.wireframe=$,q=!0)}W!==null&&t.update(W,s.ELEMENT_ARRAY_BUFFER),(q||h)&&(h=!1,j(L,O,H,K),W!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(W).buffer))}function d(){return n.isWebGL2?s.createVertexArray():r.createVertexArrayOES()}function m(L){return n.isWebGL2?s.bindVertexArray(L):r.bindVertexArrayOES(L)}function g(L){return n.isWebGL2?s.deleteVertexArray(L):r.deleteVertexArrayOES(L)}function _(L,O,H){const K=H.wireframe===!0;let W=a[L.id];W===void 0&&(W={},a[L.id]=W);let q=W[O.id];q===void 0&&(q={},W[O.id]=q);let $=q[K];return $===void 0&&($=p(d()),q[K]=$),$}function p(L){const O=[],H=[],K=[];for(let W=0;W<i;W++)O[W]=0,H[W]=0,K[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:H,attributeDivisors:K,object:L,attributes:{},index:null}}function f(L,O,H,K){const W=c.attributes,q=O.attributes;let $=0;const ne=H.getAttributes();for(const ie in ne)if(ne[ie].location>=0){const Z=W[ie];let ce=q[ie];if(ce===void 0&&(ie==="instanceMatrix"&&L.instanceMatrix&&(ce=L.instanceMatrix),ie==="instanceColor"&&L.instanceColor&&(ce=L.instanceColor)),Z===void 0||Z.attribute!==ce||ce&&Z.data!==ce.data)return!0;$++}return c.attributesNum!==$||c.index!==K}function E(L,O,H,K){const W={},q=O.attributes;let $=0;const ne=H.getAttributes();for(const ie in ne)if(ne[ie].location>=0){let Z=q[ie];Z===void 0&&(ie==="instanceMatrix"&&L.instanceMatrix&&(Z=L.instanceMatrix),ie==="instanceColor"&&L.instanceColor&&(Z=L.instanceColor));const ce={};ce.attribute=Z,Z&&Z.data&&(ce.data=Z.data),W[ie]=ce,$++}c.attributes=W,c.attributesNum=$,c.index=K}function y(){const L=c.newAttributes;for(let O=0,H=L.length;O<H;O++)L[O]=0}function w(L){P(L,0)}function P(L,O){const H=c.newAttributes,K=c.enabledAttributes,W=c.attributeDivisors;H[L]=1,K[L]===0&&(s.enableVertexAttribArray(L),K[L]=1),W[L]!==O&&((n.isWebGL2?s:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](L,O),W[L]=O)}function T(){const L=c.newAttributes,O=c.enabledAttributes;for(let H=0,K=O.length;H<K;H++)O[H]!==L[H]&&(s.disableVertexAttribArray(H),O[H]=0)}function A(L,O,H,K,W,q,$){$===!0?s.vertexAttribIPointer(L,O,H,W,q):s.vertexAttribPointer(L,O,H,K,W,q)}function j(L,O,H,K){if(n.isWebGL2===!1&&(L.isInstancedMesh||K.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;y();const W=K.attributes,q=H.getAttributes(),$=O.defaultAttributeValues;for(const ne in q){const ie=q[ne];if(ie.location>=0){let z=W[ne];if(z===void 0&&(ne==="instanceMatrix"&&L.instanceMatrix&&(z=L.instanceMatrix),ne==="instanceColor"&&L.instanceColor&&(z=L.instanceColor)),z!==void 0){const Z=z.normalized,ce=z.itemSize,pe=t.get(z);if(pe===void 0)continue;const _e=pe.buffer,Ie=pe.type,fe=pe.bytesPerElement,be=n.isWebGL2===!0&&(Ie===s.INT||Ie===s.UNSIGNED_INT||z.gpuType===cl);if(z.isInterleavedBufferAttribute){const Xe=z.data,N=Xe.stride,gt=z.offset;if(Xe.isInstancedInterleavedBuffer){for(let xe=0;xe<ie.locationSize;xe++)P(ie.location+xe,Xe.meshPerAttribute);L.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=Xe.meshPerAttribute*Xe.count)}else for(let xe=0;xe<ie.locationSize;xe++)w(ie.location+xe);s.bindBuffer(s.ARRAY_BUFFER,_e);for(let xe=0;xe<ie.locationSize;xe++)A(ie.location+xe,ce/ie.locationSize,Ie,Z,N*fe,(gt+ce/ie.locationSize*xe)*fe,be)}else{if(z.isInstancedBufferAttribute){for(let Xe=0;Xe<ie.locationSize;Xe++)P(ie.location+Xe,z.meshPerAttribute);L.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=z.meshPerAttribute*z.count)}else for(let Xe=0;Xe<ie.locationSize;Xe++)w(ie.location+Xe);s.bindBuffer(s.ARRAY_BUFFER,_e);for(let Xe=0;Xe<ie.locationSize;Xe++)A(ie.location+Xe,ce/ie.locationSize,Ie,Z,ce*fe,ce/ie.locationSize*Xe*fe,be)}}else if($!==void 0){const Z=$[ne];if(Z!==void 0)switch(Z.length){case 2:s.vertexAttrib2fv(ie.location,Z);break;case 3:s.vertexAttrib3fv(ie.location,Z);break;case 4:s.vertexAttrib4fv(ie.location,Z);break;default:s.vertexAttrib1fv(ie.location,Z)}}}}T()}function M(){X();for(const L in a){const O=a[L];for(const H in O){const K=O[H];for(const W in K)g(K[W].object),delete K[W];delete O[H]}delete a[L]}}function b(L){if(a[L.id]===void 0)return;const O=a[L.id];for(const H in O){const K=O[H];for(const W in K)g(K[W].object),delete K[W];delete O[H]}delete a[L.id]}function G(L){for(const O in a){const H=a[O];if(H[L.id]===void 0)continue;const K=H[L.id];for(const W in K)g(K[W].object),delete K[W];delete H[L.id]}}function X(){te(),h=!0,c!==l&&(c=l,m(c.object))}function te(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:X,resetDefaultState:te,dispose:M,releaseStatesOfGeometry:b,releaseStatesOfProgram:G,initAttributes:y,enableAttribute:w,disableUnusedAttributes:T}}function zf(s,e,t,n){const i=n.isWebGL2;let r;function o(h){r=h}function a(h,u){s.drawArrays(r,h,u),t.update(u,r,1)}function l(h,u,d){if(d===0)return;let m,g;if(i)m=s,g="drawArraysInstanced";else if(m=e.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[g](r,h,u,d),t.update(u,r,d)}function c(h,u,d){if(d===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<d;g++)this.render(h[g],u[g]);else{m.multiDrawArraysWEBGL(r,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=u[_];t.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=l,this.renderMultiDraw=c}function Gf(s,e,t){let n;function i(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");n=s.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(A){if(A==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let a=t.precision!==void 0?t.precision:"highp";const l=r(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const c=o||e.has("WEBGL_draw_buffers"),h=t.logarithmicDepthBuffer===!0,u=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),d=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),_=s.getParameter(s.MAX_VERTEX_ATTRIBS),p=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),f=s.getParameter(s.MAX_VARYING_VECTORS),E=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),y=d>0,w=o||e.has("OES_texture_float"),P=y&&w,T=o?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:m,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:p,maxVaryings:f,maxFragmentUniforms:E,vertexTextures:y,floatFragmentTextures:w,floatVertexTextures:P,maxSamples:T}}function Hf(s){const e=this;let t=null,n=0,i=!1,r=!1;const o=new On,a=new Ve,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const m=u.length!==0||d||n!==0||i;return i=d,n=u.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,m){const g=u.clippingPlanes,_=u.clipIntersection,p=u.clipShadows,f=s.get(u);if(!i||g===null||g.length===0||r&&!p)r?h(null):c();else{const E=r?0:n,y=E*4;let w=f.clippingState||null;l.value=w,w=h(g,d,y,m);for(let P=0;P!==y;++P)w[P]=t[P];f.clippingState=w,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,m,g){const _=u!==null?u.length:0;let p=null;if(_!==0){if(p=l.value,g!==!0||p===null){const f=m+_*4,E=d.matrixWorldInverse;a.getNormalMatrix(E),(p===null||p.length<f)&&(p=new Float32Array(f));for(let y=0,w=m;y!==_;++y,w+=4)o.copy(u[y]).applyMatrix4(E,a),o.normal.toArray(p,w),p[w+3]=o.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}function Vf(s){let e=new WeakMap;function t(o,a){return a===Fr?o.mapping=Mi:a===kr&&(o.mapping=Ei),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Fr||a===kr)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new eu(l.height/2);return c.fromEquirectangularTexture(s,o),e.set(o,c),o.addEventListener("dispose",i),t(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class Pl extends Al{constructor(e=-1,t=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const vi=4,ga=[.125,.215,.35,.446,.526,.582],Gn=20,Mr=new Pl,_a=new Fe;let Er=null,br=0,wr=0;const Bn=(1+Math.sqrt(5))/2,fi=1/Bn,va=[new R(1,1,1),new R(-1,1,1),new R(1,1,-1),new R(-1,1,-1),new R(0,Bn,fi),new R(0,Bn,-fi),new R(fi,0,Bn),new R(-fi,0,Bn),new R(Bn,fi,0),new R(-Bn,fi,0)];class xa{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){Er=this._renderer.getRenderTarget(),br=this._renderer.getActiveCubeFace(),wr=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ma(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Sa(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Er,br,wr),e.scissorTest=!1,_s(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Mi||e.mapping===Ei?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Er=this._renderer.getRenderTarget(),br=this._renderer.getActiveCubeFace(),wr=this._renderer.getActiveMipmapLevel();const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ut,minFilter:Ut,generateMipmaps:!1,type:Hi,format:en,colorSpace:mn,depthBuffer:!1},i=ya(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ya(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Wf(r)),this._blurMaterial=Xf(r,e,t)}return i}_compileMaterial(e){const t=new $e(this._lodPlanes[0],e);this._renderer.compile(t,Mr)}_sceneToCubeUV(e,t,n,i){const a=new qt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(_a),h.toneMapping=Cn,h.autoClear=!1;const m=new Yn({name:"PMREM.Background",side:At,depthWrite:!1,depthTest:!1}),g=new $e(new ot,m);let _=!1;const p=e.background;p?p.isColor&&(m.color.copy(p),e.background=null,_=!0):(m.color.copy(_a),_=!0);for(let f=0;f<6;f++){const E=f%3;E===0?(a.up.set(0,l[f],0),a.lookAt(c[f],0,0)):E===1?(a.up.set(0,0,l[f]),a.lookAt(0,c[f],0)):(a.up.set(0,l[f],0),a.lookAt(0,0,c[f]));const y=this._cubeSize;_s(i,E*y,f>2?y:0,y,y),h.setRenderTarget(i),_&&h.render(g,a),h.render(e,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,e.background=p}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Mi||e.mapping===Ei;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ma()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Sa());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new $e(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const l=this._cubeSize;_s(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Mr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const r=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),o=va[(i-1)%va.length];this._blur(e,i-1,i,r,o)}t.autoClear=n}_blur(e,t,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",r),this._halfBlur(o,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new $e(this._lodPlanes[i],c),d=c.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Gn-1),_=r/g,p=isFinite(r)?1+Math.floor(h*_):Gn;p>Gn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Gn}`);const f=[];let E=0;for(let A=0;A<Gn;++A){const j=A/_,M=Math.exp(-j*j/2);f.push(M),A===0?E+=M:A<p&&(E+=2*M)}for(let A=0;A<f.length;A++)f[A]=f[A]/E;d.envMap.value=e.texture,d.samples.value=p,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:y}=this;d.dTheta.value=g,d.mipInt.value=y-n;const w=this._sizeLods[i],P=3*w*(i>y-vi?i-y+vi:0),T=4*(this._cubeSize-w);_s(t,P,T,3*w,2*w),l.setRenderTarget(t),l.render(u,Mr)}}function Wf(s){const e=[],t=[],n=[];let i=s;const r=s-vi+1+ga.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);t.push(a);let l=1/a;o>s-vi?l=ga[o-s+vi-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],m=6,g=6,_=3,p=2,f=1,E=new Float32Array(_*g*m),y=new Float32Array(p*g*m),w=new Float32Array(f*g*m);for(let T=0;T<m;T++){const A=T%3*2/3-1,j=T>2?0:-1,M=[A,j,0,A+2/3,j,0,A+2/3,j+1,0,A,j,0,A+2/3,j+1,0,A,j+1,0];E.set(M,_*g*T),y.set(d,p*g*T);const b=[T,T,T,T,T,T];w.set(b,f*g*T)}const P=new Dt;P.setAttribute("position",new Yt(E,_)),P.setAttribute("uv",new Yt(y,p)),P.setAttribute("faceIndex",new Yt(w,f)),e.push(P),i>vi&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function ya(s,e,t){const n=new Kn(s,e,t);return n.texture.mapping=Hs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function _s(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Xf(s,e,t){const n=new Float32Array(Gn),i=new R(0,1,0);return new Zn({name:"SphericalGaussianBlur",defines:{n:Gn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:io(),fragmentShader:`

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
		`,blending:An,depthTest:!1,depthWrite:!1})}function Sa(){return new Zn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:io(),fragmentShader:`

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
		`,blending:An,depthTest:!1,depthWrite:!1})}function Ma(){return new Zn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:io(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function io(){return`

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
	`}function qf(s){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===Fr||l===kr,h=l===Mi||l===Ei;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=e.get(a);return t===null&&(t=new xa(s)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),e.set(a,u),u.texture}else{if(e.has(a))return e.get(a).texture;{const u=a.image;if(c&&u&&u.height>0||h&&u&&i(u)){t===null&&(t=new xa(s));const d=c?t.fromEquirectangular(a):t.fromCubemap(a);return e.set(a,d),a.addEventListener("dispose",r),d.texture}else return null}}}return a}function i(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function $f(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const i=t(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Yf(s,e,t,n){const i={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);for(const g in d.morphAttributes){const _=d.morphAttributes[g];for(let p=0,f=_.length;p<f;p++)e.remove(_[p])}d.removeEventListener("dispose",o),delete i[d.id];const m=r.get(d);m&&(e.remove(m),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const g in d)e.update(d[g],s.ARRAY_BUFFER);const m=u.morphAttributes;for(const g in m){const _=m[g];for(let p=0,f=_.length;p<f;p++)e.update(_[p],s.ARRAY_BUFFER)}}function c(u){const d=[],m=u.index,g=u.attributes.position;let _=0;if(m!==null){const E=m.array;_=m.version;for(let y=0,w=E.length;y<w;y+=3){const P=E[y+0],T=E[y+1],A=E[y+2];d.push(P,T,T,A,A,P)}}else if(g!==void 0){const E=g.array;_=g.version;for(let y=0,w=E.length/3-1;y<w;y+=3){const P=y+0,T=y+1,A=y+2;d.push(P,T,T,A,A,P)}}else return;const p=new(xl(d)?wl:bl)(d,1);p.version=_;const f=r.get(u);f&&e.remove(f),r.set(u,p)}function h(u){const d=r.get(u);if(d){const m=u.index;m!==null&&d.version<m.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function jf(s,e,t,n){const i=n.isWebGL2;let r;function o(m){r=m}let a,l;function c(m){a=m.type,l=m.bytesPerElement}function h(m,g){s.drawElements(r,g,a,m*l),t.update(g,r,1)}function u(m,g,_){if(_===0)return;let p,f;if(i)p=s,f="drawElementsInstanced";else if(p=e.get("ANGLE_instanced_arrays"),f="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[f](r,g,a,m*l,_),t.update(g,r,_)}function d(m,g,_){if(_===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let f=0;f<_;f++)this.render(m[f]/l,g[f]);else{p.multiDrawElementsWEBGL(r,g,0,a,m,0,_);let f=0;for(let E=0;E<_;E++)f+=g[E];t.update(f,r,1)}}this.setMode=o,this.setIndex=c,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function Kf(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=a*(r/3);break;case s.LINES:t.lines+=a*(r/2);break;case s.LINE_STRIP:t.lines+=a*(r-1);break;case s.LINE_LOOP:t.lines+=a*r;break;case s.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Zf(s,e){return s[0]-e[0]}function Jf(s,e){return Math.abs(e[1])-Math.abs(s[1])}function Qf(s,e,t){const n={},i=new Float32Array(8),r=new WeakMap,o=new yt,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,u){const d=c.morphTargetInfluences;if(e.isWebGL2===!0){const g=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,_=g!==void 0?g.length:0;let p=r.get(h);if(p===void 0||p.count!==_){let O=function(){te.dispose(),r.delete(h),h.removeEventListener("dispose",O)};var m=O;p!==void 0&&p.texture.dispose();const y=h.morphAttributes.position!==void 0,w=h.morphAttributes.normal!==void 0,P=h.morphAttributes.color!==void 0,T=h.morphAttributes.position||[],A=h.morphAttributes.normal||[],j=h.morphAttributes.color||[];let M=0;y===!0&&(M=1),w===!0&&(M=2),P===!0&&(M=3);let b=h.attributes.position.count*M,G=1;b>e.maxTextureSize&&(G=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const X=new Float32Array(b*G*4*_),te=new Ml(X,b,G,_);te.type=wn,te.needsUpdate=!0;const L=M*4;for(let H=0;H<_;H++){const K=T[H],W=A[H],q=j[H],$=b*G*4*H;for(let ne=0;ne<K.count;ne++){const ie=ne*L;y===!0&&(o.fromBufferAttribute(K,ne),X[$+ie+0]=o.x,X[$+ie+1]=o.y,X[$+ie+2]=o.z,X[$+ie+3]=0),w===!0&&(o.fromBufferAttribute(W,ne),X[$+ie+4]=o.x,X[$+ie+5]=o.y,X[$+ie+6]=o.z,X[$+ie+7]=0),P===!0&&(o.fromBufferAttribute(q,ne),X[$+ie+8]=o.x,X[$+ie+9]=o.y,X[$+ie+10]=o.z,X[$+ie+11]=q.itemSize===4?o.w:1)}}p={count:_,texture:te,size:new We(b,G)},r.set(h,p),h.addEventListener("dispose",O)}let f=0;for(let y=0;y<d.length;y++)f+=d[y];const E=h.morphTargetsRelative?1:1-f;u.getUniforms().setValue(s,"morphTargetBaseInfluence",E),u.getUniforms().setValue(s,"morphTargetInfluences",d),u.getUniforms().setValue(s,"morphTargetsTexture",p.texture,t),u.getUniforms().setValue(s,"morphTargetsTextureSize",p.size)}else{const g=d===void 0?0:d.length;let _=n[h.id];if(_===void 0||_.length!==g){_=[];for(let w=0;w<g;w++)_[w]=[w,0];n[h.id]=_}for(let w=0;w<g;w++){const P=_[w];P[0]=w,P[1]=d[w]}_.sort(Jf);for(let w=0;w<8;w++)w<g&&_[w][1]?(a[w][0]=_[w][0],a[w][1]=_[w][1]):(a[w][0]=Number.MAX_SAFE_INTEGER,a[w][1]=0);a.sort(Zf);const p=h.morphAttributes.position,f=h.morphAttributes.normal;let E=0;for(let w=0;w<8;w++){const P=a[w],T=P[0],A=P[1];T!==Number.MAX_SAFE_INTEGER&&A?(p&&h.getAttribute("morphTarget"+w)!==p[T]&&h.setAttribute("morphTarget"+w,p[T]),f&&h.getAttribute("morphNormal"+w)!==f[T]&&h.setAttribute("morphNormal"+w,f[T]),i[w]=A,E+=A):(p&&h.hasAttribute("morphTarget"+w)===!0&&h.deleteAttribute("morphTarget"+w),f&&h.hasAttribute("morphNormal"+w)===!0&&h.deleteAttribute("morphNormal"+w),i[w]=0)}const y=h.morphTargetsRelative?1:1-E;u.getUniforms().setValue(s,"morphTargetBaseInfluence",y),u.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:l}}function ep(s,e,t,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=e.get(l,h);if(i.get(u)!==c&&(e.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;i.get(d)!==c&&(d.update(),i.set(d,c))}return u}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}class Ll extends Ft{constructor(e,t,n,i,r,o,a,l,c,h){if(h=h!==void 0?h:qn,h!==qn&&h!==bi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===qn&&(n=bn),n===void 0&&h===bi&&(n=Xn),super(null,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:St,this.minFilter=l!==void 0?l:St,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Il=new Ft,Dl=new Ll(1,1);Dl.compareFunction=vl;const Ul=new Ml,Nl=new kh,Fl=new Cl,Ea=[],ba=[],wa=new Float32Array(16),Ta=new Float32Array(9),Aa=new Float32Array(4);function Ai(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=Ea[i];if(r===void 0&&(r=new Float32Array(i),Ea[i]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,s[o].toArray(r,a)}return r}function pt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function mt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function qs(s,e){let t=ba[e];t===void 0&&(t=new Int32Array(e),ba[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function tp(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function np(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(pt(t,e))return;s.uniform2fv(this.addr,e),mt(t,e)}}function ip(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(pt(t,e))return;s.uniform3fv(this.addr,e),mt(t,e)}}function sp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(pt(t,e))return;s.uniform4fv(this.addr,e),mt(t,e)}}function rp(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(pt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),mt(t,e)}else{if(pt(t,n))return;Aa.set(n),s.uniformMatrix2fv(this.addr,!1,Aa),mt(t,n)}}function op(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(pt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),mt(t,e)}else{if(pt(t,n))return;Ta.set(n),s.uniformMatrix3fv(this.addr,!1,Ta),mt(t,n)}}function ap(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(pt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),mt(t,e)}else{if(pt(t,n))return;wa.set(n),s.uniformMatrix4fv(this.addr,!1,wa),mt(t,n)}}function lp(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function cp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(pt(t,e))return;s.uniform2iv(this.addr,e),mt(t,e)}}function hp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(pt(t,e))return;s.uniform3iv(this.addr,e),mt(t,e)}}function up(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(pt(t,e))return;s.uniform4iv(this.addr,e),mt(t,e)}}function dp(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function fp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(pt(t,e))return;s.uniform2uiv(this.addr,e),mt(t,e)}}function pp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(pt(t,e))return;s.uniform3uiv(this.addr,e),mt(t,e)}}function mp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(pt(t,e))return;s.uniform4uiv(this.addr,e),mt(t,e)}}function gp(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const r=this.type===s.SAMPLER_2D_SHADOW?Dl:Il;t.setTexture2D(e||r,i)}function _p(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Nl,i)}function vp(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Fl,i)}function xp(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Ul,i)}function yp(s){switch(s){case 5126:return tp;case 35664:return np;case 35665:return ip;case 35666:return sp;case 35674:return rp;case 35675:return op;case 35676:return ap;case 5124:case 35670:return lp;case 35667:case 35671:return cp;case 35668:case 35672:return hp;case 35669:case 35673:return up;case 5125:return dp;case 36294:return fp;case 36295:return pp;case 36296:return mp;case 35678:case 36198:case 36298:case 36306:case 35682:return gp;case 35679:case 36299:case 36307:return _p;case 35680:case 36300:case 36308:case 36293:return vp;case 36289:case 36303:case 36311:case 36292:return xp}}function Sp(s,e){s.uniform1fv(this.addr,e)}function Mp(s,e){const t=Ai(e,this.size,2);s.uniform2fv(this.addr,t)}function Ep(s,e){const t=Ai(e,this.size,3);s.uniform3fv(this.addr,t)}function bp(s,e){const t=Ai(e,this.size,4);s.uniform4fv(this.addr,t)}function wp(s,e){const t=Ai(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function Tp(s,e){const t=Ai(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function Ap(s,e){const t=Ai(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function Cp(s,e){s.uniform1iv(this.addr,e)}function Rp(s,e){s.uniform2iv(this.addr,e)}function Pp(s,e){s.uniform3iv(this.addr,e)}function Lp(s,e){s.uniform4iv(this.addr,e)}function Ip(s,e){s.uniform1uiv(this.addr,e)}function Dp(s,e){s.uniform2uiv(this.addr,e)}function Up(s,e){s.uniform3uiv(this.addr,e)}function Np(s,e){s.uniform4uiv(this.addr,e)}function Fp(s,e,t){const n=this.cache,i=e.length,r=qs(t,i);pt(n,r)||(s.uniform1iv(this.addr,r),mt(n,r));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||Il,r[o])}function kp(s,e,t){const n=this.cache,i=e.length,r=qs(t,i);pt(n,r)||(s.uniform1iv(this.addr,r),mt(n,r));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||Nl,r[o])}function Op(s,e,t){const n=this.cache,i=e.length,r=qs(t,i);pt(n,r)||(s.uniform1iv(this.addr,r),mt(n,r));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||Fl,r[o])}function Bp(s,e,t){const n=this.cache,i=e.length,r=qs(t,i);pt(n,r)||(s.uniform1iv(this.addr,r),mt(n,r));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||Ul,r[o])}function zp(s){switch(s){case 5126:return Sp;case 35664:return Mp;case 35665:return Ep;case 35666:return bp;case 35674:return wp;case 35675:return Tp;case 35676:return Ap;case 5124:case 35670:return Cp;case 35667:case 35671:return Rp;case 35668:case 35672:return Pp;case 35669:case 35673:return Lp;case 5125:return Ip;case 36294:return Dp;case 36295:return Up;case 36296:return Np;case 35678:case 36198:case 36298:case 36306:case 35682:return Fp;case 35679:case 36299:case 36307:return kp;case 35680:case 36300:case 36308:case 36293:return Op;case 36289:case 36303:case 36311:case 36292:return Bp}}class Gp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=yp(t.type)}}class Hp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=zp(t.type)}}class Vp{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(e,t[a.id],n)}}}const Tr=/(\w+)(\])?(\[|\.)?/g;function Ca(s,e){s.seq.push(e),s.map[e.id]=e}function Wp(s,e,t){const n=s.name,i=n.length;for(Tr.lastIndex=0;;){const r=Tr.exec(n),o=Tr.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Ca(t,c===void 0?new Gp(a,s,e):new Hp(a,s,e));break}else{let u=t.map[a];u===void 0&&(u=new Vp(a),Ca(t,u)),t=u}}}class Ls{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),o=e.getUniformLocation(t,r.name);Wp(r,o,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,o=t.length;r!==o;++r){const a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const o=e[i];o.id in t&&n.push(o)}return n}}function Ra(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const Xp=37297;let qp=0;function $p(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function Yp(s){const e=je.getPrimaries(je.workingColorSpace),t=je.getPrimaries(s);let n;switch(e===t?n="":e===Fs&&t===Ns?n="LinearDisplayP3ToLinearSRGB":e===Ns&&t===Fs&&(n="LinearSRGBToLinearDisplayP3"),s){case mn:case Vs:return[n,"LinearTransferOETF"];case Mt:case eo:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function Pa(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+$p(s.getShaderSource(e),o)}else return i}function jp(s,e){const t=Yp(e);return`vec4 ${s}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Kp(s,e){let t;switch(e){case oh:t="Linear";break;case ah:t="Reinhard";break;case lh:t="OptimizedCineon";break;case ch:t="ACESFilmic";break;case uh:t="AgX";break;case hh:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Zp(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(xi).join(`
`)}function Jp(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(xi).join(`
`)}function Qp(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function em(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:s.getAttribLocation(e,o),locationSize:a}}return t}function xi(s){return s!==""}function La(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ia(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const tm=/^[ \t]*#include +<([\w\d./]+)>/gm;function Vr(s){return s.replace(tm,im)}const nm=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function im(s,e){let t=Oe[e];if(t===void 0){const n=nm.get(e);if(n!==void 0)t=Oe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Vr(t)}const sm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Da(s){return s.replace(sm,rm)}function rm(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Ua(s){let e="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function om(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===al?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Uc?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===dn&&(e="SHADOWMAP_TYPE_VSM"),e}function am(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Mi:case Ei:e="ENVMAP_TYPE_CUBE";break;case Hs:e="ENVMAP_TYPE_CUBE_UV";break}return e}function lm(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Ei:e="ENVMAP_MODE_REFRACTION";break}return e}function cm(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Jr:e="ENVMAP_BLENDING_MULTIPLY";break;case sh:e="ENVMAP_BLENDING_MIX";break;case rh:e="ENVMAP_BLENDING_ADD";break}return e}function hm(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function um(s,e,t,n){const i=s.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=om(t),c=am(t),h=lm(t),u=cm(t),d=hm(t),m=t.isWebGL2?"":Zp(t),g=Jp(t),_=Qp(r),p=i.createProgram();let f,E,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(xi).join(`
`),f.length>0&&(f+=`
`),E=[m,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(xi).join(`
`),E.length>0&&(E+=`
`)):(f=[Ua(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xi).join(`
`),E=[m,Ua(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Cn?"#define TONE_MAPPING":"",t.toneMapping!==Cn?Oe.tonemapping_pars_fragment:"",t.toneMapping!==Cn?Kp("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Oe.colorspace_pars_fragment,jp("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(xi).join(`
`)),o=Vr(o),o=La(o,t),o=Ia(o,t),a=Vr(a),a=La(a,t),a=Ia(a,t),o=Da(o),a=Da(a),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,f=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,E=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===Jo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Jo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+E);const w=y+f+o,P=y+E+a,T=Ra(i,i.VERTEX_SHADER,w),A=Ra(i,i.FRAGMENT_SHADER,P);i.attachShader(p,T),i.attachShader(p,A),t.index0AttributeName!==void 0?i.bindAttribLocation(p,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(p,0,"position"),i.linkProgram(p);function j(X){if(s.debug.checkShaderErrors){const te=i.getProgramInfoLog(p).trim(),L=i.getShaderInfoLog(T).trim(),O=i.getShaderInfoLog(A).trim();let H=!0,K=!0;if(i.getProgramParameter(p,i.LINK_STATUS)===!1)if(H=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,p,T,A);else{const W=Pa(i,T,"vertex"),q=Pa(i,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(p,i.VALIDATE_STATUS)+`

Program Info Log: `+te+`
`+W+`
`+q)}else te!==""?console.warn("THREE.WebGLProgram: Program Info Log:",te):(L===""||O==="")&&(K=!1);K&&(X.diagnostics={runnable:H,programLog:te,vertexShader:{log:L,prefix:f},fragmentShader:{log:O,prefix:E}})}i.deleteShader(T),i.deleteShader(A),M=new Ls(i,p),b=em(i,p)}let M;this.getUniforms=function(){return M===void 0&&j(this),M};let b;this.getAttributes=function(){return b===void 0&&j(this),b};let G=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return G===!1&&(G=i.getProgramParameter(p,Xp)),G},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(p),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=qp++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=T,this.fragmentShader=A,this}let dm=0;class fm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new pm(e),t.set(e,n)),n}}class pm{constructor(e){this.id=dm++,this.code=e,this.usedTimes=0}}function mm(s,e,t,n,i,r,o){const a=new to,l=new fm,c=[],h=i.isWebGL2,u=i.logarithmicDepthBuffer,d=i.vertexTextures;let m=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return M===0?"uv":`uv${M}`}function p(M,b,G,X,te){const L=X.fog,O=te.geometry,H=M.isMeshStandardMaterial?X.environment:null,K=(M.isMeshStandardMaterial?t:e).get(M.envMap||H),W=K&&K.mapping===Hs?K.image.height:null,q=g[M.type];M.precision!==null&&(m=i.getMaxPrecision(M.precision),m!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",m,"instead."));const $=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,ne=$!==void 0?$.length:0;let ie=0;O.morphAttributes.position!==void 0&&(ie=1),O.morphAttributes.normal!==void 0&&(ie=2),O.morphAttributes.color!==void 0&&(ie=3);let z,Z,ce,pe;if(q){const Ct=sn[q];z=Ct.vertexShader,Z=Ct.fragmentShader}else z=M.vertexShader,Z=M.fragmentShader,l.update(M),ce=l.getVertexShaderID(M),pe=l.getFragmentShaderID(M);const _e=s.getRenderTarget(),Ie=te.isInstancedMesh===!0,fe=te.isBatchedMesh===!0,be=!!M.map,Xe=!!M.matcap,N=!!K,gt=!!M.aoMap,xe=!!M.lightMap,Ae=!!M.bumpMap,ge=!!M.normalMap,qe=!!M.displacementMap,Ce=!!M.emissiveMap,S=!!M.metalnessMap,v=!!M.roughnessMap,U=M.anisotropy>0,Q=M.clearcoat>0,J=M.iridescence>0,ee=M.sheen>0,me=M.transmission>0,se=U&&!!M.anisotropyMap,he=Q&&!!M.clearcoatMap,Se=Q&&!!M.clearcoatNormalMap,De=Q&&!!M.clearcoatRoughnessMap,Y=J&&!!M.iridescenceMap,ze=J&&!!M.iridescenceThicknessMap,we=ee&&!!M.sheenColorMap,Me=ee&&!!M.sheenRoughnessMap,ve=!!M.specularMap,ue=!!M.specularColorMap,Pe=!!M.specularIntensityMap,Ye=me&&!!M.transmissionMap,st=me&&!!M.thicknessMap,Ge=!!M.gradientMap,re=!!M.alphaMap,C=M.alphaTest>0,ae=!!M.alphaHash,le=!!M.extensions,Re=!!O.attributes.uv1,Ee=!!O.attributes.uv2,Ze=!!O.attributes.uv3;let Je=Cn;return M.toneMapped&&(_e===null||_e.isXRRenderTarget===!0)&&(Je=s.toneMapping),{isWebGL2:h,shaderID:q,shaderType:M.type,shaderName:M.name,vertexShader:z,fragmentShader:Z,defines:M.defines,customVertexShaderID:ce,customFragmentShaderID:pe,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:m,batching:fe,instancing:Ie,instancingColor:Ie&&te.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:_e===null?s.outputColorSpace:_e.isXRRenderTarget===!0?_e.texture.colorSpace:mn,map:be,matcap:Xe,envMap:N,envMapMode:N&&K.mapping,envMapCubeUVHeight:W,aoMap:gt,lightMap:xe,bumpMap:Ae,normalMap:ge,displacementMap:d&&qe,emissiveMap:Ce,normalMapObjectSpace:ge&&M.normalMapType===Eh,normalMapTangentSpace:ge&&M.normalMapType===_l,metalnessMap:S,roughnessMap:v,anisotropy:U,anisotropyMap:se,clearcoat:Q,clearcoatMap:he,clearcoatNormalMap:Se,clearcoatRoughnessMap:De,iridescence:J,iridescenceMap:Y,iridescenceThicknessMap:ze,sheen:ee,sheenColorMap:we,sheenRoughnessMap:Me,specularMap:ve,specularColorMap:ue,specularIntensityMap:Pe,transmission:me,transmissionMap:Ye,thicknessMap:st,gradientMap:Ge,opaque:M.transparent===!1&&M.blending===Wn,alphaMap:re,alphaTest:C,alphaHash:ae,combine:M.combine,mapUv:be&&_(M.map.channel),aoMapUv:gt&&_(M.aoMap.channel),lightMapUv:xe&&_(M.lightMap.channel),bumpMapUv:Ae&&_(M.bumpMap.channel),normalMapUv:ge&&_(M.normalMap.channel),displacementMapUv:qe&&_(M.displacementMap.channel),emissiveMapUv:Ce&&_(M.emissiveMap.channel),metalnessMapUv:S&&_(M.metalnessMap.channel),roughnessMapUv:v&&_(M.roughnessMap.channel),anisotropyMapUv:se&&_(M.anisotropyMap.channel),clearcoatMapUv:he&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:Se&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:De&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Y&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:ze&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:we&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:Me&&_(M.sheenRoughnessMap.channel),specularMapUv:ve&&_(M.specularMap.channel),specularColorMapUv:ue&&_(M.specularColorMap.channel),specularIntensityMapUv:Pe&&_(M.specularIntensityMap.channel),transmissionMapUv:Ye&&_(M.transmissionMap.channel),thicknessMapUv:st&&_(M.thicknessMap.channel),alphaMapUv:re&&_(M.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(ge||U),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,vertexUv1s:Re,vertexUv2s:Ee,vertexUv3s:Ze,pointsUvs:te.isPoints===!0&&!!O.attributes.uv&&(be||re),fog:!!L,useFog:M.fog===!0,fogExp2:L&&L.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:te.isSkinnedMesh===!0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:ne,morphTextureStride:ie,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:s.shadowMap.enabled&&G.length>0,shadowMapType:s.shadowMap.type,toneMapping:Je,useLegacyLights:s._useLegacyLights,decodeVideoTexture:be&&M.map.isVideoTexture===!0&&je.getTransfer(M.map.colorSpace)===et,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Jt,flipSided:M.side===At,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:le&&M.extensions.derivatives===!0,extensionFragDepth:le&&M.extensions.fragDepth===!0,extensionDrawBuffers:le&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:le&&M.extensions.shaderTextureLOD===!0,extensionClipCullDistance:le&&M.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()}}function f(M){const b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(const G in M.defines)b.push(G),b.push(M.defines[G]);return M.isRawShaderMaterial===!1&&(E(b,M),y(b,M),b.push(s.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function E(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function y(M,b){a.disableAll(),b.isWebGL2&&a.enable(0),b.supportsVertexTextures&&a.enable(1),b.instancing&&a.enable(2),b.instancingColor&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),M.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.skinning&&a.enable(4),b.morphTargets&&a.enable(5),b.morphNormals&&a.enable(6),b.morphColors&&a.enable(7),b.premultipliedAlpha&&a.enable(8),b.shadowMapEnabled&&a.enable(9),b.useLegacyLights&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),M.push(a.mask)}function w(M){const b=g[M.type];let G;if(b){const X=sn[b];G=Kh.clone(X.uniforms)}else G=M.uniforms;return G}function P(M,b){let G;for(let X=0,te=c.length;X<te;X++){const L=c[X];if(L.cacheKey===b){G=L,++G.usedTimes;break}}return G===void 0&&(G=new um(s,b,M,r),c.push(G)),G}function T(M){if(--M.usedTimes===0){const b=c.indexOf(M);c[b]=c[c.length-1],c.pop(),M.destroy()}}function A(M){l.remove(M)}function j(){l.dispose()}return{getParameters:p,getProgramCacheKey:f,getUniforms:w,acquireProgram:P,releaseProgram:T,releaseShaderCache:A,programs:c,dispose:j}}function gm(){let s=new WeakMap;function e(r){let o=s.get(r);return o===void 0&&(o={},s.set(r,o)),o}function t(r){s.delete(r)}function n(r,o,a){s.get(r)[o]=a}function i(){s=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function _m(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Na(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Fa(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function o(u,d,m,g,_,p){let f=s[e];return f===void 0?(f={id:u.id,object:u,geometry:d,material:m,groupOrder:g,renderOrder:u.renderOrder,z:_,group:p},s[e]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=m,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=_,f.group=p),e++,f}function a(u,d,m,g,_,p){const f=o(u,d,m,g,_,p);m.transmission>0?n.push(f):m.transparent===!0?i.push(f):t.push(f)}function l(u,d,m,g,_,p){const f=o(u,d,m,g,_,p);m.transmission>0?n.unshift(f):m.transparent===!0?i.unshift(f):t.unshift(f)}function c(u,d){t.length>1&&t.sort(u||_m),n.length>1&&n.sort(d||Na),i.length>1&&i.sort(d||Na)}function h(){for(let u=e,d=s.length;u<d;u++){const m=s[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:h,sort:c}}function vm(){let s=new WeakMap;function e(n,i){const r=s.get(n);let o;return r===void 0?(o=new Fa,s.set(n,[o])):i>=r.length?(o=new Fa,r.push(o)):o=r[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function xm(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new R,color:new Fe};break;case"SpotLight":t={position:new R,direction:new R,color:new Fe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new R,color:new Fe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new R,skyColor:new Fe,groundColor:new Fe};break;case"RectAreaLight":t={color:new Fe,position:new R,halfWidth:new R,halfHeight:new R};break}return s[e.id]=t,t}}}function ym(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let Sm=0;function Mm(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Em(s,e){const t=new xm,n=ym(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new R);const r=new R,o=new at,a=new at;function l(h,u){let d=0,m=0,g=0;for(let X=0;X<9;X++)i.probe[X].set(0,0,0);let _=0,p=0,f=0,E=0,y=0,w=0,P=0,T=0,A=0,j=0,M=0;h.sort(Mm);const b=u===!0?Math.PI:1;for(let X=0,te=h.length;X<te;X++){const L=h[X],O=L.color,H=L.intensity,K=L.distance,W=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)d+=O.r*H*b,m+=O.g*H*b,g+=O.b*H*b;else if(L.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(L.sh.coefficients[q],H);M++}else if(L.isDirectionalLight){const q=t.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity*b),L.castShadow){const $=L.shadow,ne=n.get(L);ne.shadowBias=$.bias,ne.shadowNormalBias=$.normalBias,ne.shadowRadius=$.radius,ne.shadowMapSize=$.mapSize,i.directionalShadow[_]=ne,i.directionalShadowMap[_]=W,i.directionalShadowMatrix[_]=L.shadow.matrix,w++}i.directional[_]=q,_++}else if(L.isSpotLight){const q=t.get(L);q.position.setFromMatrixPosition(L.matrixWorld),q.color.copy(O).multiplyScalar(H*b),q.distance=K,q.coneCos=Math.cos(L.angle),q.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),q.decay=L.decay,i.spot[f]=q;const $=L.shadow;if(L.map&&(i.spotLightMap[A]=L.map,A++,$.updateMatrices(L),L.castShadow&&j++),i.spotLightMatrix[f]=$.matrix,L.castShadow){const ne=n.get(L);ne.shadowBias=$.bias,ne.shadowNormalBias=$.normalBias,ne.shadowRadius=$.radius,ne.shadowMapSize=$.mapSize,i.spotShadow[f]=ne,i.spotShadowMap[f]=W,T++}f++}else if(L.isRectAreaLight){const q=t.get(L);q.color.copy(O).multiplyScalar(H),q.halfWidth.set(L.width*.5,0,0),q.halfHeight.set(0,L.height*.5,0),i.rectArea[E]=q,E++}else if(L.isPointLight){const q=t.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity*b),q.distance=L.distance,q.decay=L.decay,L.castShadow){const $=L.shadow,ne=n.get(L);ne.shadowBias=$.bias,ne.shadowNormalBias=$.normalBias,ne.shadowRadius=$.radius,ne.shadowMapSize=$.mapSize,ne.shadowCameraNear=$.camera.near,ne.shadowCameraFar=$.camera.far,i.pointShadow[p]=ne,i.pointShadowMap[p]=W,i.pointShadowMatrix[p]=L.shadow.matrix,P++}i.point[p]=q,p++}else if(L.isHemisphereLight){const q=t.get(L);q.skyColor.copy(L.color).multiplyScalar(H*b),q.groundColor.copy(L.groundColor).multiplyScalar(H*b),i.hemi[y]=q,y++}}E>0&&(e.isWebGL2?s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=oe.LTC_FLOAT_1,i.rectAreaLTC2=oe.LTC_FLOAT_2):(i.rectAreaLTC1=oe.LTC_HALF_1,i.rectAreaLTC2=oe.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=oe.LTC_FLOAT_1,i.rectAreaLTC2=oe.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=oe.LTC_HALF_1,i.rectAreaLTC2=oe.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=d,i.ambient[1]=m,i.ambient[2]=g;const G=i.hash;(G.directionalLength!==_||G.pointLength!==p||G.spotLength!==f||G.rectAreaLength!==E||G.hemiLength!==y||G.numDirectionalShadows!==w||G.numPointShadows!==P||G.numSpotShadows!==T||G.numSpotMaps!==A||G.numLightProbes!==M)&&(i.directional.length=_,i.spot.length=f,i.rectArea.length=E,i.point.length=p,i.hemi.length=y,i.directionalShadow.length=w,i.directionalShadowMap.length=w,i.pointShadow.length=P,i.pointShadowMap.length=P,i.spotShadow.length=T,i.spotShadowMap.length=T,i.directionalShadowMatrix.length=w,i.pointShadowMatrix.length=P,i.spotLightMatrix.length=T+A-j,i.spotLightMap.length=A,i.numSpotLightShadowsWithMaps=j,i.numLightProbes=M,G.directionalLength=_,G.pointLength=p,G.spotLength=f,G.rectAreaLength=E,G.hemiLength=y,G.numDirectionalShadows=w,G.numPointShadows=P,G.numSpotShadows=T,G.numSpotMaps=A,G.numLightProbes=M,i.version=Sm++)}function c(h,u){let d=0,m=0,g=0,_=0,p=0;const f=u.matrixWorldInverse;for(let E=0,y=h.length;E<y;E++){const w=h[E];if(w.isDirectionalLight){const P=i.directional[d];P.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),P.direction.sub(r),P.direction.transformDirection(f),d++}else if(w.isSpotLight){const P=i.spot[g];P.position.setFromMatrixPosition(w.matrixWorld),P.position.applyMatrix4(f),P.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),P.direction.sub(r),P.direction.transformDirection(f),g++}else if(w.isRectAreaLight){const P=i.rectArea[_];P.position.setFromMatrixPosition(w.matrixWorld),P.position.applyMatrix4(f),a.identity(),o.copy(w.matrixWorld),o.premultiply(f),a.extractRotation(o),P.halfWidth.set(w.width*.5,0,0),P.halfHeight.set(0,w.height*.5,0),P.halfWidth.applyMatrix4(a),P.halfHeight.applyMatrix4(a),_++}else if(w.isPointLight){const P=i.point[m];P.position.setFromMatrixPosition(w.matrixWorld),P.position.applyMatrix4(f),m++}else if(w.isHemisphereLight){const P=i.hemi[p];P.direction.setFromMatrixPosition(w.matrixWorld),P.direction.transformDirection(f),p++}}}return{setup:l,setupView:c,state:i}}function ka(s,e){const t=new Em(s,e),n=[],i=[];function r(){n.length=0,i.length=0}function o(u){n.push(u)}function a(u){i.push(u)}function l(u){t.setup(n,u)}function c(u){t.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:i,lights:t},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function bm(s,e){let t=new WeakMap;function n(r,o=0){const a=t.get(r);let l;return a===void 0?(l=new ka(s,e),t.set(r,[l])):o>=a.length?(l=new ka(s,e),a.push(l)):l=a[o],l}function i(){t=new WeakMap}return{get:n,dispose:i}}class wm extends gn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Sh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Tm extends gn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Am=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Cm=`uniform sampler2D shadow_pass;
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
}`;function Rm(s,e,t){let n=new no;const i=new We,r=new We,o=new yt,a=new wm({depthPacking:Mh}),l=new Tm,c={},h=t.maxTextureSize,u={[rn]:At,[At]:rn,[Jt]:Jt},d=new Zn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new We},radius:{value:4}},vertexShader:Am,fragmentShader:Cm}),m=d.clone();m.defines.HORIZONTAL_PASS=1;const g=new Dt;g.setAttribute("position",new Yt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new $e(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=al;let f=this.type;this.render=function(T,A,j){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;const M=s.getRenderTarget(),b=s.getActiveCubeFace(),G=s.getActiveMipmapLevel(),X=s.state;X.setBlending(An),X.buffers.color.setClear(1,1,1,1),X.buffers.depth.setTest(!0),X.setScissorTest(!1);const te=f!==dn&&this.type===dn,L=f===dn&&this.type!==dn;for(let O=0,H=T.length;O<H;O++){const K=T[O],W=K.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;i.copy(W.mapSize);const q=W.getFrameExtents();if(i.multiply(q),r.copy(W.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/q.x),i.x=r.x*q.x,W.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/q.y),i.y=r.y*q.y,W.mapSize.y=r.y)),W.map===null||te===!0||L===!0){const ne=this.type!==dn?{minFilter:St,magFilter:St}:{};W.map!==null&&W.map.dispose(),W.map=new Kn(i.x,i.y,ne),W.map.texture.name=K.name+".shadowMap",W.camera.updateProjectionMatrix()}s.setRenderTarget(W.map),s.clear();const $=W.getViewportCount();for(let ne=0;ne<$;ne++){const ie=W.getViewport(ne);o.set(r.x*ie.x,r.y*ie.y,r.x*ie.z,r.y*ie.w),X.viewport(o),W.updateMatrices(K,ne),n=W.getFrustum(),w(A,j,W.camera,K,this.type)}W.isPointLightShadow!==!0&&this.type===dn&&E(W,j),W.needsUpdate=!1}f=this.type,p.needsUpdate=!1,s.setRenderTarget(M,b,G)};function E(T,A){const j=e.update(_);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Kn(i.x,i.y)),d.uniforms.shadow_pass.value=T.map.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,s.setRenderTarget(T.mapPass),s.clear(),s.renderBufferDirect(A,null,j,d,_,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,s.setRenderTarget(T.map),s.clear(),s.renderBufferDirect(A,null,j,m,_,null)}function y(T,A,j,M){let b=null;const G=j.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(G!==void 0)b=G;else if(b=j.isPointLight===!0?l:a,s.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const X=b.uuid,te=A.uuid;let L=c[X];L===void 0&&(L={},c[X]=L);let O=L[te];O===void 0&&(O=b.clone(),L[te]=O,A.addEventListener("dispose",P)),b=O}if(b.visible=A.visible,b.wireframe=A.wireframe,M===dn?b.side=A.shadowSide!==null?A.shadowSide:A.side:b.side=A.shadowSide!==null?A.shadowSide:u[A.side],b.alphaMap=A.alphaMap,b.alphaTest=A.alphaTest,b.map=A.map,b.clipShadows=A.clipShadows,b.clippingPlanes=A.clippingPlanes,b.clipIntersection=A.clipIntersection,b.displacementMap=A.displacementMap,b.displacementScale=A.displacementScale,b.displacementBias=A.displacementBias,b.wireframeLinewidth=A.wireframeLinewidth,b.linewidth=A.linewidth,j.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const X=s.properties.get(b);X.light=j}return b}function w(T,A,j,M,b){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&b===dn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,T.matrixWorld);const te=e.update(T),L=T.material;if(Array.isArray(L)){const O=te.groups;for(let H=0,K=O.length;H<K;H++){const W=O[H],q=L[W.materialIndex];if(q&&q.visible){const $=y(T,q,M,b);T.onBeforeShadow(s,T,A,j,te,$,W),s.renderBufferDirect(j,null,te,$,T,W),T.onAfterShadow(s,T,A,j,te,$,W)}}}else if(L.visible){const O=y(T,L,M,b);T.onBeforeShadow(s,T,A,j,te,O,null),s.renderBufferDirect(j,null,te,O,T,null),T.onAfterShadow(s,T,A,j,te,O,null)}}const X=T.children;for(let te=0,L=X.length;te<L;te++)w(X[te],A,j,M,b)}function P(T){T.target.removeEventListener("dispose",P);for(const j in c){const M=c[j],b=T.target.uuid;b in M&&(M[b].dispose(),delete M[b])}}}function Pm(s,e,t){const n=t.isWebGL2;function i(){let C=!1;const ae=new yt;let le=null;const Re=new yt(0,0,0,0);return{setMask:function(Ee){le!==Ee&&!C&&(s.colorMask(Ee,Ee,Ee,Ee),le=Ee)},setLocked:function(Ee){C=Ee},setClear:function(Ee,Ze,Je,_t,Ct){Ct===!0&&(Ee*=_t,Ze*=_t,Je*=_t),ae.set(Ee,Ze,Je,_t),Re.equals(ae)===!1&&(s.clearColor(Ee,Ze,Je,_t),Re.copy(ae))},reset:function(){C=!1,le=null,Re.set(-1,0,0,0)}}}function r(){let C=!1,ae=null,le=null,Re=null;return{setTest:function(Ee){Ee?fe(s.DEPTH_TEST):be(s.DEPTH_TEST)},setMask:function(Ee){ae!==Ee&&!C&&(s.depthMask(Ee),ae=Ee)},setFunc:function(Ee){if(le!==Ee){switch(Ee){case Zc:s.depthFunc(s.NEVER);break;case Jc:s.depthFunc(s.ALWAYS);break;case Qc:s.depthFunc(s.LESS);break;case Ds:s.depthFunc(s.LEQUAL);break;case eh:s.depthFunc(s.EQUAL);break;case th:s.depthFunc(s.GEQUAL);break;case nh:s.depthFunc(s.GREATER);break;case ih:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}le=Ee}},setLocked:function(Ee){C=Ee},setClear:function(Ee){Re!==Ee&&(s.clearDepth(Ee),Re=Ee)},reset:function(){C=!1,ae=null,le=null,Re=null}}}function o(){let C=!1,ae=null,le=null,Re=null,Ee=null,Ze=null,Je=null,_t=null,Ct=null;return{setTest:function(Qe){C||(Qe?fe(s.STENCIL_TEST):be(s.STENCIL_TEST))},setMask:function(Qe){ae!==Qe&&!C&&(s.stencilMask(Qe),ae=Qe)},setFunc:function(Qe,Rt,nn){(le!==Qe||Re!==Rt||Ee!==nn)&&(s.stencilFunc(Qe,Rt,nn),le=Qe,Re=Rt,Ee=nn)},setOp:function(Qe,Rt,nn){(Ze!==Qe||Je!==Rt||_t!==nn)&&(s.stencilOp(Qe,Rt,nn),Ze=Qe,Je=Rt,_t=nn)},setLocked:function(Qe){C=Qe},setClear:function(Qe){Ct!==Qe&&(s.clearStencil(Qe),Ct=Qe)},reset:function(){C=!1,ae=null,le=null,Re=null,Ee=null,Ze=null,Je=null,_t=null,Ct=null}}}const a=new i,l=new r,c=new o,h=new WeakMap,u=new WeakMap;let d={},m={},g=new WeakMap,_=[],p=null,f=!1,E=null,y=null,w=null,P=null,T=null,A=null,j=null,M=new Fe(0,0,0),b=0,G=!1,X=null,te=null,L=null,O=null,H=null;const K=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,q=0;const $=s.getParameter(s.VERSION);$.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec($)[1]),W=q>=1):$.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),W=q>=2);let ne=null,ie={};const z=s.getParameter(s.SCISSOR_BOX),Z=s.getParameter(s.VIEWPORT),ce=new yt().fromArray(z),pe=new yt().fromArray(Z);function _e(C,ae,le,Re){const Ee=new Uint8Array(4),Ze=s.createTexture();s.bindTexture(C,Ze),s.texParameteri(C,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(C,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Je=0;Je<le;Je++)n&&(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)?s.texImage3D(ae,0,s.RGBA,1,1,Re,0,s.RGBA,s.UNSIGNED_BYTE,Ee):s.texImage2D(ae+Je,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Ee);return Ze}const Ie={};Ie[s.TEXTURE_2D]=_e(s.TEXTURE_2D,s.TEXTURE_2D,1),Ie[s.TEXTURE_CUBE_MAP]=_e(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Ie[s.TEXTURE_2D_ARRAY]=_e(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Ie[s.TEXTURE_3D]=_e(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),fe(s.DEPTH_TEST),l.setFunc(Ds),Ce(!1),S(xo),fe(s.CULL_FACE),ge(An);function fe(C){d[C]!==!0&&(s.enable(C),d[C]=!0)}function be(C){d[C]!==!1&&(s.disable(C),d[C]=!1)}function Xe(C,ae){return m[C]!==ae?(s.bindFramebuffer(C,ae),m[C]=ae,n&&(C===s.DRAW_FRAMEBUFFER&&(m[s.FRAMEBUFFER]=ae),C===s.FRAMEBUFFER&&(m[s.DRAW_FRAMEBUFFER]=ae)),!0):!1}function N(C,ae){let le=_,Re=!1;if(C)if(le=g.get(ae),le===void 0&&(le=[],g.set(ae,le)),C.isWebGLMultipleRenderTargets){const Ee=C.texture;if(le.length!==Ee.length||le[0]!==s.COLOR_ATTACHMENT0){for(let Ze=0,Je=Ee.length;Ze<Je;Ze++)le[Ze]=s.COLOR_ATTACHMENT0+Ze;le.length=Ee.length,Re=!0}}else le[0]!==s.COLOR_ATTACHMENT0&&(le[0]=s.COLOR_ATTACHMENT0,Re=!0);else le[0]!==s.BACK&&(le[0]=s.BACK,Re=!0);Re&&(t.isWebGL2?s.drawBuffers(le):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(le))}function gt(C){return p!==C?(s.useProgram(C),p=C,!0):!1}const xe={[zn]:s.FUNC_ADD,[Fc]:s.FUNC_SUBTRACT,[kc]:s.FUNC_REVERSE_SUBTRACT};if(n)xe[Eo]=s.MIN,xe[bo]=s.MAX;else{const C=e.get("EXT_blend_minmax");C!==null&&(xe[Eo]=C.MIN_EXT,xe[bo]=C.MAX_EXT)}const Ae={[Oc]:s.ZERO,[Bc]:s.ONE,[zc]:s.SRC_COLOR,[Ur]:s.SRC_ALPHA,[qc]:s.SRC_ALPHA_SATURATE,[Wc]:s.DST_COLOR,[Hc]:s.DST_ALPHA,[Gc]:s.ONE_MINUS_SRC_COLOR,[Nr]:s.ONE_MINUS_SRC_ALPHA,[Xc]:s.ONE_MINUS_DST_COLOR,[Vc]:s.ONE_MINUS_DST_ALPHA,[$c]:s.CONSTANT_COLOR,[Yc]:s.ONE_MINUS_CONSTANT_COLOR,[jc]:s.CONSTANT_ALPHA,[Kc]:s.ONE_MINUS_CONSTANT_ALPHA};function ge(C,ae,le,Re,Ee,Ze,Je,_t,Ct,Qe){if(C===An){f===!0&&(be(s.BLEND),f=!1);return}if(f===!1&&(fe(s.BLEND),f=!0),C!==Nc){if(C!==E||Qe!==G){if((y!==zn||T!==zn)&&(s.blendEquation(s.FUNC_ADD),y=zn,T=zn),Qe)switch(C){case Wn:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case yo:s.blendFunc(s.ONE,s.ONE);break;case So:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Mo:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}else switch(C){case Wn:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case yo:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case So:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Mo:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}w=null,P=null,A=null,j=null,M.set(0,0,0),b=0,E=C,G=Qe}return}Ee=Ee||ae,Ze=Ze||le,Je=Je||Re,(ae!==y||Ee!==T)&&(s.blendEquationSeparate(xe[ae],xe[Ee]),y=ae,T=Ee),(le!==w||Re!==P||Ze!==A||Je!==j)&&(s.blendFuncSeparate(Ae[le],Ae[Re],Ae[Ze],Ae[Je]),w=le,P=Re,A=Ze,j=Je),(_t.equals(M)===!1||Ct!==b)&&(s.blendColor(_t.r,_t.g,_t.b,Ct),M.copy(_t),b=Ct),E=C,G=!1}function qe(C,ae){C.side===Jt?be(s.CULL_FACE):fe(s.CULL_FACE);let le=C.side===At;ae&&(le=!le),Ce(le),C.blending===Wn&&C.transparent===!1?ge(An):ge(C.blending,C.blendEquation,C.blendSrc,C.blendDst,C.blendEquationAlpha,C.blendSrcAlpha,C.blendDstAlpha,C.blendColor,C.blendAlpha,C.premultipliedAlpha),l.setFunc(C.depthFunc),l.setTest(C.depthTest),l.setMask(C.depthWrite),a.setMask(C.colorWrite);const Re=C.stencilWrite;c.setTest(Re),Re&&(c.setMask(C.stencilWriteMask),c.setFunc(C.stencilFunc,C.stencilRef,C.stencilFuncMask),c.setOp(C.stencilFail,C.stencilZFail,C.stencilZPass)),U(C.polygonOffset,C.polygonOffsetFactor,C.polygonOffsetUnits),C.alphaToCoverage===!0?fe(s.SAMPLE_ALPHA_TO_COVERAGE):be(s.SAMPLE_ALPHA_TO_COVERAGE)}function Ce(C){X!==C&&(C?s.frontFace(s.CW):s.frontFace(s.CCW),X=C)}function S(C){C!==Ic?(fe(s.CULL_FACE),C!==te&&(C===xo?s.cullFace(s.BACK):C===Dc?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):be(s.CULL_FACE),te=C}function v(C){C!==L&&(W&&s.lineWidth(C),L=C)}function U(C,ae,le){C?(fe(s.POLYGON_OFFSET_FILL),(O!==ae||H!==le)&&(s.polygonOffset(ae,le),O=ae,H=le)):be(s.POLYGON_OFFSET_FILL)}function Q(C){C?fe(s.SCISSOR_TEST):be(s.SCISSOR_TEST)}function J(C){C===void 0&&(C=s.TEXTURE0+K-1),ne!==C&&(s.activeTexture(C),ne=C)}function ee(C,ae,le){le===void 0&&(ne===null?le=s.TEXTURE0+K-1:le=ne);let Re=ie[le];Re===void 0&&(Re={type:void 0,texture:void 0},ie[le]=Re),(Re.type!==C||Re.texture!==ae)&&(ne!==le&&(s.activeTexture(le),ne=le),s.bindTexture(C,ae||Ie[C]),Re.type=C,Re.texture=ae)}function me(){const C=ie[ne];C!==void 0&&C.type!==void 0&&(s.bindTexture(C.type,null),C.type=void 0,C.texture=void 0)}function se(){try{s.compressedTexImage2D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function he(){try{s.compressedTexImage3D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Se(){try{s.texSubImage2D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function De(){try{s.texSubImage3D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Y(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ze(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function we(){try{s.texStorage2D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Me(){try{s.texStorage3D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ve(){try{s.texImage2D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ue(){try{s.texImage3D.apply(s,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Pe(C){ce.equals(C)===!1&&(s.scissor(C.x,C.y,C.z,C.w),ce.copy(C))}function Ye(C){pe.equals(C)===!1&&(s.viewport(C.x,C.y,C.z,C.w),pe.copy(C))}function st(C,ae){let le=u.get(ae);le===void 0&&(le=new WeakMap,u.set(ae,le));let Re=le.get(C);Re===void 0&&(Re=s.getUniformBlockIndex(ae,C.name),le.set(C,Re))}function Ge(C,ae){const Re=u.get(ae).get(C);h.get(ae)!==Re&&(s.uniformBlockBinding(ae,Re,C.__bindingPointIndex),h.set(ae,Re))}function re(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),n===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),d={},ne=null,ie={},m={},g=new WeakMap,_=[],p=null,f=!1,E=null,y=null,w=null,P=null,T=null,A=null,j=null,M=new Fe(0,0,0),b=0,G=!1,X=null,te=null,L=null,O=null,H=null,ce.set(0,0,s.canvas.width,s.canvas.height),pe.set(0,0,s.canvas.width,s.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:fe,disable:be,bindFramebuffer:Xe,drawBuffers:N,useProgram:gt,setBlending:ge,setMaterial:qe,setFlipSided:Ce,setCullFace:S,setLineWidth:v,setPolygonOffset:U,setScissorTest:Q,activeTexture:J,bindTexture:ee,unbindTexture:me,compressedTexImage2D:se,compressedTexImage3D:he,texImage2D:ve,texImage3D:ue,updateUBOMapping:st,uniformBlockBinding:Ge,texStorage2D:we,texStorage3D:Me,texSubImage2D:Se,texSubImage3D:De,compressedTexSubImage2D:Y,compressedTexSubImage3D:ze,scissor:Pe,viewport:Ye,reset:re}}function Lm(s,e,t,n,i,r,o){const a=i.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const d=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(S,v){return m?new OffscreenCanvas(S,v):Os("canvas")}function _(S,v,U,Q){let J=1;if((S.width>Q||S.height>Q)&&(J=Q/Math.max(S.width,S.height)),J<1||v===!0)if(typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&S instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&S instanceof ImageBitmap){const ee=v?Hr:Math.floor,me=ee(J*S.width),se=ee(J*S.height);u===void 0&&(u=g(me,se));const he=U?g(me,se):u;return he.width=me,he.height=se,he.getContext("2d").drawImage(S,0,0,me,se),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+S.width+"x"+S.height+") to ("+me+"x"+se+")."),he}else return"data"in S&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+S.width+"x"+S.height+")."),S;return S}function p(S){return Qo(S.width)&&Qo(S.height)}function f(S){return a?!1:S.wrapS!==Qt||S.wrapT!==Qt||S.minFilter!==St&&S.minFilter!==Ut}function E(S,v){return S.generateMipmaps&&v&&S.minFilter!==St&&S.minFilter!==Ut}function y(S){s.generateMipmap(S)}function w(S,v,U,Q,J=!1){if(a===!1)return v;if(S!==null){if(s[S]!==void 0)return s[S];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let ee=v;if(v===s.RED&&(U===s.FLOAT&&(ee=s.R32F),U===s.HALF_FLOAT&&(ee=s.R16F),U===s.UNSIGNED_BYTE&&(ee=s.R8)),v===s.RED_INTEGER&&(U===s.UNSIGNED_BYTE&&(ee=s.R8UI),U===s.UNSIGNED_SHORT&&(ee=s.R16UI),U===s.UNSIGNED_INT&&(ee=s.R32UI),U===s.BYTE&&(ee=s.R8I),U===s.SHORT&&(ee=s.R16I),U===s.INT&&(ee=s.R32I)),v===s.RG&&(U===s.FLOAT&&(ee=s.RG32F),U===s.HALF_FLOAT&&(ee=s.RG16F),U===s.UNSIGNED_BYTE&&(ee=s.RG8)),v===s.RGBA){const me=J?Us:je.getTransfer(Q);U===s.FLOAT&&(ee=s.RGBA32F),U===s.HALF_FLOAT&&(ee=s.RGBA16F),U===s.UNSIGNED_BYTE&&(ee=me===et?s.SRGB8_ALPHA8:s.RGBA8),U===s.UNSIGNED_SHORT_4_4_4_4&&(ee=s.RGBA4),U===s.UNSIGNED_SHORT_5_5_5_1&&(ee=s.RGB5_A1)}return(ee===s.R16F||ee===s.R32F||ee===s.RG16F||ee===s.RG32F||ee===s.RGBA16F||ee===s.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function P(S,v,U){return E(S,U)===!0||S.isFramebufferTexture&&S.minFilter!==St&&S.minFilter!==Ut?Math.log2(Math.max(v.width,v.height))+1:S.mipmaps!==void 0&&S.mipmaps.length>0?S.mipmaps.length:S.isCompressedTexture&&Array.isArray(S.image)?v.mipmaps.length:1}function T(S){return S===St||S===wo||S===Js?s.NEAREST:s.LINEAR}function A(S){const v=S.target;v.removeEventListener("dispose",A),M(v),v.isVideoTexture&&h.delete(v)}function j(S){const v=S.target;v.removeEventListener("dispose",j),G(v)}function M(S){const v=n.get(S);if(v.__webglInit===void 0)return;const U=S.source,Q=d.get(U);if(Q){const J=Q[v.__cacheKey];J.usedTimes--,J.usedTimes===0&&b(S),Object.keys(Q).length===0&&d.delete(U)}n.remove(S)}function b(S){const v=n.get(S);s.deleteTexture(v.__webglTexture);const U=S.source,Q=d.get(U);delete Q[v.__cacheKey],o.memory.textures--}function G(S){const v=S.texture,U=n.get(S),Q=n.get(v);if(Q.__webglTexture!==void 0&&(s.deleteTexture(Q.__webglTexture),o.memory.textures--),S.depthTexture&&S.depthTexture.dispose(),S.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(U.__webglFramebuffer[J]))for(let ee=0;ee<U.__webglFramebuffer[J].length;ee++)s.deleteFramebuffer(U.__webglFramebuffer[J][ee]);else s.deleteFramebuffer(U.__webglFramebuffer[J]);U.__webglDepthbuffer&&s.deleteRenderbuffer(U.__webglDepthbuffer[J])}else{if(Array.isArray(U.__webglFramebuffer))for(let J=0;J<U.__webglFramebuffer.length;J++)s.deleteFramebuffer(U.__webglFramebuffer[J]);else s.deleteFramebuffer(U.__webglFramebuffer);if(U.__webglDepthbuffer&&s.deleteRenderbuffer(U.__webglDepthbuffer),U.__webglMultisampledFramebuffer&&s.deleteFramebuffer(U.__webglMultisampledFramebuffer),U.__webglColorRenderbuffer)for(let J=0;J<U.__webglColorRenderbuffer.length;J++)U.__webglColorRenderbuffer[J]&&s.deleteRenderbuffer(U.__webglColorRenderbuffer[J]);U.__webglDepthRenderbuffer&&s.deleteRenderbuffer(U.__webglDepthRenderbuffer)}if(S.isWebGLMultipleRenderTargets)for(let J=0,ee=v.length;J<ee;J++){const me=n.get(v[J]);me.__webglTexture&&(s.deleteTexture(me.__webglTexture),o.memory.textures--),n.remove(v[J])}n.remove(v),n.remove(S)}let X=0;function te(){X=0}function L(){const S=X;return S>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+S+" texture units while this GPU supports only "+i.maxTextures),X+=1,S}function O(S){const v=[];return v.push(S.wrapS),v.push(S.wrapT),v.push(S.wrapR||0),v.push(S.magFilter),v.push(S.minFilter),v.push(S.anisotropy),v.push(S.internalFormat),v.push(S.format),v.push(S.type),v.push(S.generateMipmaps),v.push(S.premultiplyAlpha),v.push(S.flipY),v.push(S.unpackAlignment),v.push(S.colorSpace),v.join()}function H(S,v){const U=n.get(S);if(S.isVideoTexture&&qe(S),S.isRenderTargetTexture===!1&&S.version>0&&U.__version!==S.version){const Q=S.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ce(U,S,v);return}}t.bindTexture(s.TEXTURE_2D,U.__webglTexture,s.TEXTURE0+v)}function K(S,v){const U=n.get(S);if(S.version>0&&U.__version!==S.version){ce(U,S,v);return}t.bindTexture(s.TEXTURE_2D_ARRAY,U.__webglTexture,s.TEXTURE0+v)}function W(S,v){const U=n.get(S);if(S.version>0&&U.__version!==S.version){ce(U,S,v);return}t.bindTexture(s.TEXTURE_3D,U.__webglTexture,s.TEXTURE0+v)}function q(S,v){const U=n.get(S);if(S.version>0&&U.__version!==S.version){pe(U,S,v);return}t.bindTexture(s.TEXTURE_CUBE_MAP,U.__webglTexture,s.TEXTURE0+v)}const $={[zi]:s.REPEAT,[Qt]:s.CLAMP_TO_EDGE,[Or]:s.MIRRORED_REPEAT},ne={[St]:s.NEAREST,[wo]:s.NEAREST_MIPMAP_NEAREST,[Js]:s.NEAREST_MIPMAP_LINEAR,[Ut]:s.LINEAR,[dh]:s.LINEAR_MIPMAP_NEAREST,[Gi]:s.LINEAR_MIPMAP_LINEAR},ie={[bh]:s.NEVER,[Ph]:s.ALWAYS,[wh]:s.LESS,[vl]:s.LEQUAL,[Th]:s.EQUAL,[Rh]:s.GEQUAL,[Ah]:s.GREATER,[Ch]:s.NOTEQUAL};function z(S,v,U){if(U?(s.texParameteri(S,s.TEXTURE_WRAP_S,$[v.wrapS]),s.texParameteri(S,s.TEXTURE_WRAP_T,$[v.wrapT]),(S===s.TEXTURE_3D||S===s.TEXTURE_2D_ARRAY)&&s.texParameteri(S,s.TEXTURE_WRAP_R,$[v.wrapR]),s.texParameteri(S,s.TEXTURE_MAG_FILTER,ne[v.magFilter]),s.texParameteri(S,s.TEXTURE_MIN_FILTER,ne[v.minFilter])):(s.texParameteri(S,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(S,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(S===s.TEXTURE_3D||S===s.TEXTURE_2D_ARRAY)&&s.texParameteri(S,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(v.wrapS!==Qt||v.wrapT!==Qt)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(S,s.TEXTURE_MAG_FILTER,T(v.magFilter)),s.texParameteri(S,s.TEXTURE_MIN_FILTER,T(v.minFilter)),v.minFilter!==St&&v.minFilter!==Ut&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),v.compareFunction&&(s.texParameteri(S,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(S,s.TEXTURE_COMPARE_FUNC,ie[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const Q=e.get("EXT_texture_filter_anisotropic");if(v.magFilter===St||v.minFilter!==Js&&v.minFilter!==Gi||v.type===wn&&e.has("OES_texture_float_linear")===!1||a===!1&&v.type===Hi&&e.has("OES_texture_half_float_linear")===!1)return;(v.anisotropy>1||n.get(v).__currentAnisotropy)&&(s.texParameterf(S,Q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,i.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy)}}function Z(S,v){let U=!1;S.__webglInit===void 0&&(S.__webglInit=!0,v.addEventListener("dispose",A));const Q=v.source;let J=d.get(Q);J===void 0&&(J={},d.set(Q,J));const ee=O(v);if(ee!==S.__cacheKey){J[ee]===void 0&&(J[ee]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,U=!0),J[ee].usedTimes++;const me=J[S.__cacheKey];me!==void 0&&(J[S.__cacheKey].usedTimes--,me.usedTimes===0&&b(v)),S.__cacheKey=ee,S.__webglTexture=J[ee].texture}return U}function ce(S,v,U){let Q=s.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(Q=s.TEXTURE_2D_ARRAY),v.isData3DTexture&&(Q=s.TEXTURE_3D);const J=Z(S,v),ee=v.source;t.bindTexture(Q,S.__webglTexture,s.TEXTURE0+U);const me=n.get(ee);if(ee.version!==me.__version||J===!0){t.activeTexture(s.TEXTURE0+U);const se=je.getPrimaries(je.workingColorSpace),he=v.colorSpace===$t?null:je.getPrimaries(v.colorSpace),Se=v.colorSpace===$t||se===he?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Se);const De=f(v)&&p(v.image)===!1;let Y=_(v.image,De,!1,i.maxTextureSize);Y=Ce(v,Y);const ze=p(Y)||a,we=r.convert(v.format,v.colorSpace);let Me=r.convert(v.type),ve=w(v.internalFormat,we,Me,v.colorSpace,v.isVideoTexture);z(Q,v,ze);let ue;const Pe=v.mipmaps,Ye=a&&v.isVideoTexture!==!0&&ve!==ml,st=me.__version===void 0||J===!0,Ge=P(v,Y,ze);if(v.isDepthTexture)ve=s.DEPTH_COMPONENT,a?v.type===wn?ve=s.DEPTH_COMPONENT32F:v.type===bn?ve=s.DEPTH_COMPONENT24:v.type===Xn?ve=s.DEPTH24_STENCIL8:ve=s.DEPTH_COMPONENT16:v.type===wn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),v.format===qn&&ve===s.DEPTH_COMPONENT&&v.type!==Qr&&v.type!==bn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),v.type=bn,Me=r.convert(v.type)),v.format===bi&&ve===s.DEPTH_COMPONENT&&(ve=s.DEPTH_STENCIL,v.type!==Xn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),v.type=Xn,Me=r.convert(v.type))),st&&(Ye?t.texStorage2D(s.TEXTURE_2D,1,ve,Y.width,Y.height):t.texImage2D(s.TEXTURE_2D,0,ve,Y.width,Y.height,0,we,Me,null));else if(v.isDataTexture)if(Pe.length>0&&ze){Ye&&st&&t.texStorage2D(s.TEXTURE_2D,Ge,ve,Pe[0].width,Pe[0].height);for(let re=0,C=Pe.length;re<C;re++)ue=Pe[re],Ye?t.texSubImage2D(s.TEXTURE_2D,re,0,0,ue.width,ue.height,we,Me,ue.data):t.texImage2D(s.TEXTURE_2D,re,ve,ue.width,ue.height,0,we,Me,ue.data);v.generateMipmaps=!1}else Ye?(st&&t.texStorage2D(s.TEXTURE_2D,Ge,ve,Y.width,Y.height),t.texSubImage2D(s.TEXTURE_2D,0,0,0,Y.width,Y.height,we,Me,Y.data)):t.texImage2D(s.TEXTURE_2D,0,ve,Y.width,Y.height,0,we,Me,Y.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Ye&&st&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ge,ve,Pe[0].width,Pe[0].height,Y.depth);for(let re=0,C=Pe.length;re<C;re++)ue=Pe[re],v.format!==en?we!==null?Ye?t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,re,0,0,0,ue.width,ue.height,Y.depth,we,ue.data,0,0):t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,re,ve,ue.width,ue.height,Y.depth,0,ue.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ye?t.texSubImage3D(s.TEXTURE_2D_ARRAY,re,0,0,0,ue.width,ue.height,Y.depth,we,Me,ue.data):t.texImage3D(s.TEXTURE_2D_ARRAY,re,ve,ue.width,ue.height,Y.depth,0,we,Me,ue.data)}else{Ye&&st&&t.texStorage2D(s.TEXTURE_2D,Ge,ve,Pe[0].width,Pe[0].height);for(let re=0,C=Pe.length;re<C;re++)ue=Pe[re],v.format!==en?we!==null?Ye?t.compressedTexSubImage2D(s.TEXTURE_2D,re,0,0,ue.width,ue.height,we,ue.data):t.compressedTexImage2D(s.TEXTURE_2D,re,ve,ue.width,ue.height,0,ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ye?t.texSubImage2D(s.TEXTURE_2D,re,0,0,ue.width,ue.height,we,Me,ue.data):t.texImage2D(s.TEXTURE_2D,re,ve,ue.width,ue.height,0,we,Me,ue.data)}else if(v.isDataArrayTexture)Ye?(st&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ge,ve,Y.width,Y.height,Y.depth),t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Y.width,Y.height,Y.depth,we,Me,Y.data)):t.texImage3D(s.TEXTURE_2D_ARRAY,0,ve,Y.width,Y.height,Y.depth,0,we,Me,Y.data);else if(v.isData3DTexture)Ye?(st&&t.texStorage3D(s.TEXTURE_3D,Ge,ve,Y.width,Y.height,Y.depth),t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Y.width,Y.height,Y.depth,we,Me,Y.data)):t.texImage3D(s.TEXTURE_3D,0,ve,Y.width,Y.height,Y.depth,0,we,Me,Y.data);else if(v.isFramebufferTexture){if(st)if(Ye)t.texStorage2D(s.TEXTURE_2D,Ge,ve,Y.width,Y.height);else{let re=Y.width,C=Y.height;for(let ae=0;ae<Ge;ae++)t.texImage2D(s.TEXTURE_2D,ae,ve,re,C,0,we,Me,null),re>>=1,C>>=1}}else if(Pe.length>0&&ze){Ye&&st&&t.texStorage2D(s.TEXTURE_2D,Ge,ve,Pe[0].width,Pe[0].height);for(let re=0,C=Pe.length;re<C;re++)ue=Pe[re],Ye?t.texSubImage2D(s.TEXTURE_2D,re,0,0,we,Me,ue):t.texImage2D(s.TEXTURE_2D,re,ve,we,Me,ue);v.generateMipmaps=!1}else Ye?(st&&t.texStorage2D(s.TEXTURE_2D,Ge,ve,Y.width,Y.height),t.texSubImage2D(s.TEXTURE_2D,0,0,0,we,Me,Y)):t.texImage2D(s.TEXTURE_2D,0,ve,we,Me,Y);E(v,ze)&&y(Q),me.__version=ee.version,v.onUpdate&&v.onUpdate(v)}S.__version=v.version}function pe(S,v,U){if(v.image.length!==6)return;const Q=Z(S,v),J=v.source;t.bindTexture(s.TEXTURE_CUBE_MAP,S.__webglTexture,s.TEXTURE0+U);const ee=n.get(J);if(J.version!==ee.__version||Q===!0){t.activeTexture(s.TEXTURE0+U);const me=je.getPrimaries(je.workingColorSpace),se=v.colorSpace===$t?null:je.getPrimaries(v.colorSpace),he=v.colorSpace===$t||me===se?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,he);const Se=v.isCompressedTexture||v.image[0].isCompressedTexture,De=v.image[0]&&v.image[0].isDataTexture,Y=[];for(let re=0;re<6;re++)!Se&&!De?Y[re]=_(v.image[re],!1,!0,i.maxCubemapSize):Y[re]=De?v.image[re].image:v.image[re],Y[re]=Ce(v,Y[re]);const ze=Y[0],we=p(ze)||a,Me=r.convert(v.format,v.colorSpace),ve=r.convert(v.type),ue=w(v.internalFormat,Me,ve,v.colorSpace),Pe=a&&v.isVideoTexture!==!0,Ye=ee.__version===void 0||Q===!0;let st=P(v,ze,we);z(s.TEXTURE_CUBE_MAP,v,we);let Ge;if(Se){Pe&&Ye&&t.texStorage2D(s.TEXTURE_CUBE_MAP,st,ue,ze.width,ze.height);for(let re=0;re<6;re++){Ge=Y[re].mipmaps;for(let C=0;C<Ge.length;C++){const ae=Ge[C];v.format!==en?Me!==null?Pe?t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,C,0,0,ae.width,ae.height,Me,ae.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,C,ue,ae.width,ae.height,0,ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Pe?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,C,0,0,ae.width,ae.height,Me,ve,ae.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,C,ue,ae.width,ae.height,0,Me,ve,ae.data)}}}else{Ge=v.mipmaps,Pe&&Ye&&(Ge.length>0&&st++,t.texStorage2D(s.TEXTURE_CUBE_MAP,st,ue,Y[0].width,Y[0].height));for(let re=0;re<6;re++)if(De){Pe?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Y[re].width,Y[re].height,Me,ve,Y[re].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,ue,Y[re].width,Y[re].height,0,Me,ve,Y[re].data);for(let C=0;C<Ge.length;C++){const le=Ge[C].image[re].image;Pe?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,C+1,0,0,le.width,le.height,Me,ve,le.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,C+1,ue,le.width,le.height,0,Me,ve,le.data)}}else{Pe?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Me,ve,Y[re]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,ue,Me,ve,Y[re]);for(let C=0;C<Ge.length;C++){const ae=Ge[C];Pe?t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,C+1,0,0,Me,ve,ae.image[re]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+re,C+1,ue,Me,ve,ae.image[re])}}}E(v,we)&&y(s.TEXTURE_CUBE_MAP),ee.__version=J.version,v.onUpdate&&v.onUpdate(v)}S.__version=v.version}function _e(S,v,U,Q,J,ee){const me=r.convert(U.format,U.colorSpace),se=r.convert(U.type),he=w(U.internalFormat,me,se,U.colorSpace);if(!n.get(v).__hasExternalTextures){const De=Math.max(1,v.width>>ee),Y=Math.max(1,v.height>>ee);J===s.TEXTURE_3D||J===s.TEXTURE_2D_ARRAY?t.texImage3D(J,ee,he,De,Y,v.depth,0,me,se,null):t.texImage2D(J,ee,he,De,Y,0,me,se,null)}t.bindFramebuffer(s.FRAMEBUFFER,S),ge(v)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Q,J,n.get(U).__webglTexture,0,Ae(v)):(J===s.TEXTURE_2D||J>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,Q,J,n.get(U).__webglTexture,ee),t.bindFramebuffer(s.FRAMEBUFFER,null)}function Ie(S,v,U){if(s.bindRenderbuffer(s.RENDERBUFFER,S),v.depthBuffer&&!v.stencilBuffer){let Q=a===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(U||ge(v)){const J=v.depthTexture;J&&J.isDepthTexture&&(J.type===wn?Q=s.DEPTH_COMPONENT32F:J.type===bn&&(Q=s.DEPTH_COMPONENT24));const ee=Ae(v);ge(v)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ee,Q,v.width,v.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,ee,Q,v.width,v.height)}else s.renderbufferStorage(s.RENDERBUFFER,Q,v.width,v.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,S)}else if(v.depthBuffer&&v.stencilBuffer){const Q=Ae(v);U&&ge(v)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Q,s.DEPTH24_STENCIL8,v.width,v.height):ge(v)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Q,s.DEPTH24_STENCIL8,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,v.width,v.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,S)}else{const Q=v.isWebGLMultipleRenderTargets===!0?v.texture:[v.texture];for(let J=0;J<Q.length;J++){const ee=Q[J],me=r.convert(ee.format,ee.colorSpace),se=r.convert(ee.type),he=w(ee.internalFormat,me,se,ee.colorSpace),Se=Ae(v);U&&ge(v)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Se,he,v.width,v.height):ge(v)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Se,he,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,he,v.width,v.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function fe(S,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,S),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(v.depthTexture).__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),H(v.depthTexture,0);const Q=n.get(v.depthTexture).__webglTexture,J=Ae(v);if(v.depthTexture.format===qn)ge(v)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Q,0,J):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Q,0);else if(v.depthTexture.format===bi)ge(v)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Q,0,J):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function be(S){const v=n.get(S),U=S.isWebGLCubeRenderTarget===!0;if(S.depthTexture&&!v.__autoAllocateDepthBuffer){if(U)throw new Error("target.depthTexture not supported in Cube render targets");fe(v.__webglFramebuffer,S)}else if(U){v.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[Q]),v.__webglDepthbuffer[Q]=s.createRenderbuffer(),Ie(v.__webglDepthbuffer[Q],S,!1)}else t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer=s.createRenderbuffer(),Ie(v.__webglDepthbuffer,S,!1);t.bindFramebuffer(s.FRAMEBUFFER,null)}function Xe(S,v,U){const Q=n.get(S);v!==void 0&&_e(Q.__webglFramebuffer,S,S.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),U!==void 0&&be(S)}function N(S){const v=S.texture,U=n.get(S),Q=n.get(v);S.addEventListener("dispose",j),S.isWebGLMultipleRenderTargets!==!0&&(Q.__webglTexture===void 0&&(Q.__webglTexture=s.createTexture()),Q.__version=v.version,o.memory.textures++);const J=S.isWebGLCubeRenderTarget===!0,ee=S.isWebGLMultipleRenderTargets===!0,me=p(S)||a;if(J){U.__webglFramebuffer=[];for(let se=0;se<6;se++)if(a&&v.mipmaps&&v.mipmaps.length>0){U.__webglFramebuffer[se]=[];for(let he=0;he<v.mipmaps.length;he++)U.__webglFramebuffer[se][he]=s.createFramebuffer()}else U.__webglFramebuffer[se]=s.createFramebuffer()}else{if(a&&v.mipmaps&&v.mipmaps.length>0){U.__webglFramebuffer=[];for(let se=0;se<v.mipmaps.length;se++)U.__webglFramebuffer[se]=s.createFramebuffer()}else U.__webglFramebuffer=s.createFramebuffer();if(ee)if(i.drawBuffers){const se=S.texture;for(let he=0,Se=se.length;he<Se;he++){const De=n.get(se[he]);De.__webglTexture===void 0&&(De.__webglTexture=s.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&S.samples>0&&ge(S)===!1){const se=ee?v:[v];U.__webglMultisampledFramebuffer=s.createFramebuffer(),U.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,U.__webglMultisampledFramebuffer);for(let he=0;he<se.length;he++){const Se=se[he];U.__webglColorRenderbuffer[he]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,U.__webglColorRenderbuffer[he]);const De=r.convert(Se.format,Se.colorSpace),Y=r.convert(Se.type),ze=w(Se.internalFormat,De,Y,Se.colorSpace,S.isXRRenderTarget===!0),we=Ae(S);s.renderbufferStorageMultisample(s.RENDERBUFFER,we,ze,S.width,S.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+he,s.RENDERBUFFER,U.__webglColorRenderbuffer[he])}s.bindRenderbuffer(s.RENDERBUFFER,null),S.depthBuffer&&(U.__webglDepthRenderbuffer=s.createRenderbuffer(),Ie(U.__webglDepthRenderbuffer,S,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(J){t.bindTexture(s.TEXTURE_CUBE_MAP,Q.__webglTexture),z(s.TEXTURE_CUBE_MAP,v,me);for(let se=0;se<6;se++)if(a&&v.mipmaps&&v.mipmaps.length>0)for(let he=0;he<v.mipmaps.length;he++)_e(U.__webglFramebuffer[se][he],S,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+se,he);else _e(U.__webglFramebuffer[se],S,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+se,0);E(v,me)&&y(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ee){const se=S.texture;for(let he=0,Se=se.length;he<Se;he++){const De=se[he],Y=n.get(De);t.bindTexture(s.TEXTURE_2D,Y.__webglTexture),z(s.TEXTURE_2D,De,me),_e(U.__webglFramebuffer,S,De,s.COLOR_ATTACHMENT0+he,s.TEXTURE_2D,0),E(De,me)&&y(s.TEXTURE_2D)}t.unbindTexture()}else{let se=s.TEXTURE_2D;if((S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(a?se=S.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(se,Q.__webglTexture),z(se,v,me),a&&v.mipmaps&&v.mipmaps.length>0)for(let he=0;he<v.mipmaps.length;he++)_e(U.__webglFramebuffer[he],S,v,s.COLOR_ATTACHMENT0,se,he);else _e(U.__webglFramebuffer,S,v,s.COLOR_ATTACHMENT0,se,0);E(v,me)&&y(se),t.unbindTexture()}S.depthBuffer&&be(S)}function gt(S){const v=p(S)||a,U=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let Q=0,J=U.length;Q<J;Q++){const ee=U[Q];if(E(ee,v)){const me=S.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,se=n.get(ee).__webglTexture;t.bindTexture(me,se),y(me),t.unbindTexture()}}}function xe(S){if(a&&S.samples>0&&ge(S)===!1){const v=S.isWebGLMultipleRenderTargets?S.texture:[S.texture],U=S.width,Q=S.height;let J=s.COLOR_BUFFER_BIT;const ee=[],me=S.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,se=n.get(S),he=S.isWebGLMultipleRenderTargets===!0;if(he)for(let Se=0;Se<v.length;Se++)t.bindFramebuffer(s.FRAMEBUFFER,se.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Se,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,se.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Se,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,se.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,se.__webglFramebuffer);for(let Se=0;Se<v.length;Se++){ee.push(s.COLOR_ATTACHMENT0+Se),S.depthBuffer&&ee.push(me);const De=se.__ignoreDepthValues!==void 0?se.__ignoreDepthValues:!1;if(De===!1&&(S.depthBuffer&&(J|=s.DEPTH_BUFFER_BIT),S.stencilBuffer&&(J|=s.STENCIL_BUFFER_BIT)),he&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,se.__webglColorRenderbuffer[Se]),De===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[me]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[me])),he){const Y=n.get(v[Se]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Y,0)}s.blitFramebuffer(0,0,U,Q,0,0,U,Q,J,s.NEAREST),c&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ee)}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),he)for(let Se=0;Se<v.length;Se++){t.bindFramebuffer(s.FRAMEBUFFER,se.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Se,s.RENDERBUFFER,se.__webglColorRenderbuffer[Se]);const De=n.get(v[Se]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,se.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Se,s.TEXTURE_2D,De,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,se.__webglMultisampledFramebuffer)}}function Ae(S){return Math.min(i.maxSamples,S.samples)}function ge(S){const v=n.get(S);return a&&S.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function qe(S){const v=o.render.frame;h.get(S)!==v&&(h.set(S,v),S.update())}function Ce(S,v){const U=S.colorSpace,Q=S.format,J=S.type;return S.isCompressedTexture===!0||S.isVideoTexture===!0||S.format===zr||U!==mn&&U!==$t&&(je.getTransfer(U)===et?a===!1?e.has("EXT_sRGB")===!0&&Q===en?(S.format=zr,S.minFilter=Ut,S.generateMipmaps=!1):v=yl.sRGBToLinear(v):(Q!==en||J!==Rn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",U)),v}this.allocateTextureUnit=L,this.resetTextureUnits=te,this.setTexture2D=H,this.setTexture2DArray=K,this.setTexture3D=W,this.setTextureCube=q,this.rebindTextures=Xe,this.setupRenderTarget=N,this.updateRenderTargetMipmap=gt,this.updateMultisampleRenderTarget=xe,this.setupDepthRenderbuffer=be,this.setupFrameBufferTexture=_e,this.useMultisampledRTT=ge}function Im(s,e,t){const n=t.isWebGL2;function i(r,o=$t){let a;const l=je.getTransfer(o);if(r===Rn)return s.UNSIGNED_BYTE;if(r===hl)return s.UNSIGNED_SHORT_4_4_4_4;if(r===ul)return s.UNSIGNED_SHORT_5_5_5_1;if(r===fh)return s.BYTE;if(r===ph)return s.SHORT;if(r===Qr)return s.UNSIGNED_SHORT;if(r===cl)return s.INT;if(r===bn)return s.UNSIGNED_INT;if(r===wn)return s.FLOAT;if(r===Hi)return n?s.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===mh)return s.ALPHA;if(r===en)return s.RGBA;if(r===gh)return s.LUMINANCE;if(r===_h)return s.LUMINANCE_ALPHA;if(r===qn)return s.DEPTH_COMPONENT;if(r===bi)return s.DEPTH_STENCIL;if(r===zr)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===vh)return s.RED;if(r===dl)return s.RED_INTEGER;if(r===xh)return s.RG;if(r===fl)return s.RG_INTEGER;if(r===pl)return s.RGBA_INTEGER;if(r===Qs||r===er||r===tr||r===nr)if(l===et)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===Qs)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===er)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===tr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===nr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Qs)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===er)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===tr)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===nr)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===To||r===Ao||r===Co||r===Ro)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===To)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Ao)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Co)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Ro)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===ml)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Po||r===Lo)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(r===Po)return l===et?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===Lo)return l===et?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Io||r===Do||r===Uo||r===No||r===Fo||r===ko||r===Oo||r===Bo||r===zo||r===Go||r===Ho||r===Vo||r===Wo||r===Xo)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(r===Io)return l===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Do)return l===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Uo)return l===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===No)return l===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Fo)return l===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===ko)return l===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Oo)return l===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Bo)return l===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===zo)return l===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Go)return l===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Ho)return l===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Vo)return l===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Wo)return l===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Xo)return l===et?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===ir||r===qo||r===$o)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(r===ir)return l===et?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===qo)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===$o)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===yh||r===Yo||r===jo||r===Ko)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(r===ir)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Yo)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===jo)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Ko)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Xn?n?s.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):s[r]!==void 0?s[r]:null}return{convert:i}}class Dm extends qt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Tn extends ft{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Um={type:"move"};class Ar{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Tn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Tn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Tn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const _ of e.hand.values()){const p=t.getJointPose(_,n),f=this._getHandJoint(c,_);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),m=.02,g=.005;c.inputState.pinching&&d>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Um)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Tn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Nm extends Ti{constructor(e,t){super();const n=this;let i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,m=null,g=null;const _=t.getContextAttributes();let p=null,f=null;const E=[],y=[],w=new We;let P=null;const T=new qt;T.layers.enable(1),T.viewport=new yt;const A=new qt;A.layers.enable(2),A.viewport=new yt;const j=[T,A],M=new Dm;M.layers.enable(1),M.layers.enable(2);let b=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(z){let Z=E[z];return Z===void 0&&(Z=new Ar,E[z]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(z){let Z=E[z];return Z===void 0&&(Z=new Ar,E[z]=Z),Z.getGripSpace()},this.getHand=function(z){let Z=E[z];return Z===void 0&&(Z=new Ar,E[z]=Z),Z.getHandSpace()};function X(z){const Z=y.indexOf(z.inputSource);if(Z===-1)return;const ce=E[Z];ce!==void 0&&(ce.update(z.inputSource,z.frame,c||o),ce.dispatchEvent({type:z.type,data:z.inputSource}))}function te(){i.removeEventListener("select",X),i.removeEventListener("selectstart",X),i.removeEventListener("selectend",X),i.removeEventListener("squeeze",X),i.removeEventListener("squeezestart",X),i.removeEventListener("squeezeend",X),i.removeEventListener("end",te),i.removeEventListener("inputsourceschange",L);for(let z=0;z<E.length;z++){const Z=y[z];Z!==null&&(y[z]=null,E[z].disconnect(Z))}b=null,G=null,e.setRenderTarget(p),m=null,d=null,u=null,i=null,f=null,ie.stop(),n.isPresenting=!1,e.setPixelRatio(P),e.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(z){r=z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(z){a=z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(z){c=z},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(z){if(i=z,i!==null){if(p=e.getRenderTarget(),i.addEventListener("select",X),i.addEventListener("selectstart",X),i.addEventListener("selectend",X),i.addEventListener("squeeze",X),i.addEventListener("squeezestart",X),i.addEventListener("squeezeend",X),i.addEventListener("end",te),i.addEventListener("inputsourceschange",L),_.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(w),i.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const Z={antialias:i.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(i,t,Z),i.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),f=new Kn(m.framebufferWidth,m.framebufferHeight,{format:en,type:Rn,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil})}else{let Z=null,ce=null,pe=null;_.depth&&(pe=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Z=_.stencil?bi:qn,ce=_.stencil?Xn:bn);const _e={colorFormat:t.RGBA8,depthFormat:pe,scaleFactor:r};u=new XRWebGLBinding(i,t),d=u.createProjectionLayer(_e),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),f=new Kn(d.textureWidth,d.textureHeight,{format:en,type:Rn,depthTexture:new Ll(d.textureWidth,d.textureHeight,ce,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0});const Ie=e.properties.get(f);Ie.__ignoreDepthValues=d.ignoreDepthValues}f.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),ie.setContext(i),ie.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function L(z){for(let Z=0;Z<z.removed.length;Z++){const ce=z.removed[Z],pe=y.indexOf(ce);pe>=0&&(y[pe]=null,E[pe].disconnect(ce))}for(let Z=0;Z<z.added.length;Z++){const ce=z.added[Z];let pe=y.indexOf(ce);if(pe===-1){for(let Ie=0;Ie<E.length;Ie++)if(Ie>=y.length){y.push(ce),pe=Ie;break}else if(y[Ie]===null){y[Ie]=ce,pe=Ie;break}if(pe===-1)break}const _e=E[pe];_e&&_e.connect(ce)}}const O=new R,H=new R;function K(z,Z,ce){O.setFromMatrixPosition(Z.matrixWorld),H.setFromMatrixPosition(ce.matrixWorld);const pe=O.distanceTo(H),_e=Z.projectionMatrix.elements,Ie=ce.projectionMatrix.elements,fe=_e[14]/(_e[10]-1),be=_e[14]/(_e[10]+1),Xe=(_e[9]+1)/_e[5],N=(_e[9]-1)/_e[5],gt=(_e[8]-1)/_e[0],xe=(Ie[8]+1)/Ie[0],Ae=fe*gt,ge=fe*xe,qe=pe/(-gt+xe),Ce=qe*-gt;Z.matrixWorld.decompose(z.position,z.quaternion,z.scale),z.translateX(Ce),z.translateZ(qe),z.matrixWorld.compose(z.position,z.quaternion,z.scale),z.matrixWorldInverse.copy(z.matrixWorld).invert();const S=fe+qe,v=be+qe,U=Ae-Ce,Q=ge+(pe-Ce),J=Xe*be/v*S,ee=N*be/v*S;z.projectionMatrix.makePerspective(U,Q,J,ee,S,v),z.projectionMatrixInverse.copy(z.projectionMatrix).invert()}function W(z,Z){Z===null?z.matrixWorld.copy(z.matrix):z.matrixWorld.multiplyMatrices(Z.matrixWorld,z.matrix),z.matrixWorldInverse.copy(z.matrixWorld).invert()}this.updateCamera=function(z){if(i===null)return;M.near=A.near=T.near=z.near,M.far=A.far=T.far=z.far,(b!==M.near||G!==M.far)&&(i.updateRenderState({depthNear:M.near,depthFar:M.far}),b=M.near,G=M.far);const Z=z.parent,ce=M.cameras;W(M,Z);for(let pe=0;pe<ce.length;pe++)W(ce[pe],Z);ce.length===2?K(M,T,A):M.projectionMatrix.copy(T.projectionMatrix),q(z,M,Z)};function q(z,Z,ce){ce===null?z.matrix.copy(Z.matrixWorld):(z.matrix.copy(ce.matrixWorld),z.matrix.invert(),z.matrix.multiply(Z.matrixWorld)),z.matrix.decompose(z.position,z.quaternion,z.scale),z.updateMatrixWorld(!0),z.projectionMatrix.copy(Z.projectionMatrix),z.projectionMatrixInverse.copy(Z.projectionMatrixInverse),z.isPerspectiveCamera&&(z.fov=Gr*2*Math.atan(1/z.projectionMatrix.elements[5]),z.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&m===null))return l},this.setFoveation=function(z){l=z,d!==null&&(d.fixedFoveation=z),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=z)};let $=null;function ne(z,Z){if(h=Z.getViewerPose(c||o),g=Z,h!==null){const ce=h.views;m!==null&&(e.setRenderTargetFramebuffer(f,m.framebuffer),e.setRenderTarget(f));let pe=!1;ce.length!==M.cameras.length&&(M.cameras.length=0,pe=!0);for(let _e=0;_e<ce.length;_e++){const Ie=ce[_e];let fe=null;if(m!==null)fe=m.getViewport(Ie);else{const Xe=u.getViewSubImage(d,Ie);fe=Xe.viewport,_e===0&&(e.setRenderTargetTextures(f,Xe.colorTexture,d.ignoreDepthValues?void 0:Xe.depthStencilTexture),e.setRenderTarget(f))}let be=j[_e];be===void 0&&(be=new qt,be.layers.enable(_e),be.viewport=new yt,j[_e]=be),be.matrix.fromArray(Ie.transform.matrix),be.matrix.decompose(be.position,be.quaternion,be.scale),be.projectionMatrix.fromArray(Ie.projectionMatrix),be.projectionMatrixInverse.copy(be.projectionMatrix).invert(),be.viewport.set(fe.x,fe.y,fe.width,fe.height),_e===0&&(M.matrix.copy(be.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),pe===!0&&M.cameras.push(be)}}for(let ce=0;ce<E.length;ce++){const pe=y[ce],_e=E[ce];pe!==null&&_e!==void 0&&_e.update(pe,Z,c||o)}$&&$(z,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),g=null}const ie=new Rl;ie.setAnimationLoop(ne),this.setAnimationLoop=function(z){$=z},this.dispose=function(){}}}function Fm(s,e){function t(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function n(p,f){f.color.getRGB(p.fogColor.value,Tl(s)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function i(p,f,E,y,w){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(p,f):f.isMeshToonMaterial?(r(p,f),u(p,f)):f.isMeshPhongMaterial?(r(p,f),h(p,f)):f.isMeshStandardMaterial?(r(p,f),d(p,f),f.isMeshPhysicalMaterial&&m(p,f,w)):f.isMeshMatcapMaterial?(r(p,f),g(p,f)):f.isMeshDepthMaterial?r(p,f):f.isMeshDistanceMaterial?(r(p,f),_(p,f)):f.isMeshNormalMaterial?r(p,f):f.isLineBasicMaterial?(o(p,f),f.isLineDashedMaterial&&a(p,f)):f.isPointsMaterial?l(p,f,E,y):f.isSpriteMaterial?c(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,t(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===At&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,t(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===At&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,t(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,t(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);const E=e.get(f).envMap;if(E&&(p.envMap.value=E,p.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap){p.lightMap.value=f.lightMap;const y=s._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=f.lightMapIntensity*y,t(f.lightMap,p.lightMapTransform)}f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,p.aoMapTransform))}function o(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform))}function a(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function l(p,f,E,y){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*E,p.scale.value=y*.5,f.map&&(p.map.value=f.map,t(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function c(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function h(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function u(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function d(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,p.roughnessMapTransform)),e.get(f).envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function m(p,f,E){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===At&&p.clearcoatNormalScale.value.negate())),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=E.texture,p.transmissionSamplerSize.value.set(E.width,E.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,f){f.matcap&&(p.matcap.value=f.matcap)}function _(p,f){const E=e.get(f).light;p.referencePosition.value.setFromMatrixPosition(E.matrixWorld),p.nearDistance.value=E.shadow.camera.near,p.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function km(s,e,t,n){let i={},r={},o=[];const a=t.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(E,y){const w=y.program;n.uniformBlockBinding(E,w)}function c(E,y){let w=i[E.id];w===void 0&&(g(E),w=h(E),i[E.id]=w,E.addEventListener("dispose",p));const P=y.program;n.updateUBOMapping(E,P);const T=e.render.frame;r[E.id]!==T&&(d(E),r[E.id]=T)}function h(E){const y=u();E.__bindingPointIndex=y;const w=s.createBuffer(),P=E.__size,T=E.usage;return s.bindBuffer(s.UNIFORM_BUFFER,w),s.bufferData(s.UNIFORM_BUFFER,P,T),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,y,w),w}function u(){for(let E=0;E<a;E++)if(o.indexOf(E)===-1)return o.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(E){const y=i[E.id],w=E.uniforms,P=E.__cache;s.bindBuffer(s.UNIFORM_BUFFER,y);for(let T=0,A=w.length;T<A;T++){const j=Array.isArray(w[T])?w[T]:[w[T]];for(let M=0,b=j.length;M<b;M++){const G=j[M];if(m(G,T,M,P)===!0){const X=G.__offset,te=Array.isArray(G.value)?G.value:[G.value];let L=0;for(let O=0;O<te.length;O++){const H=te[O],K=_(H);typeof H=="number"||typeof H=="boolean"?(G.__data[0]=H,s.bufferSubData(s.UNIFORM_BUFFER,X+L,G.__data)):H.isMatrix3?(G.__data[0]=H.elements[0],G.__data[1]=H.elements[1],G.__data[2]=H.elements[2],G.__data[3]=0,G.__data[4]=H.elements[3],G.__data[5]=H.elements[4],G.__data[6]=H.elements[5],G.__data[7]=0,G.__data[8]=H.elements[6],G.__data[9]=H.elements[7],G.__data[10]=H.elements[8],G.__data[11]=0):(H.toArray(G.__data,L),L+=K.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,X,G.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function m(E,y,w,P){const T=E.value,A=y+"_"+w;if(P[A]===void 0)return typeof T=="number"||typeof T=="boolean"?P[A]=T:P[A]=T.clone(),!0;{const j=P[A];if(typeof T=="number"||typeof T=="boolean"){if(j!==T)return P[A]=T,!0}else if(j.equals(T)===!1)return j.copy(T),!0}return!1}function g(E){const y=E.uniforms;let w=0;const P=16;for(let A=0,j=y.length;A<j;A++){const M=Array.isArray(y[A])?y[A]:[y[A]];for(let b=0,G=M.length;b<G;b++){const X=M[b],te=Array.isArray(X.value)?X.value:[X.value];for(let L=0,O=te.length;L<O;L++){const H=te[L],K=_(H),W=w%P;W!==0&&P-W<K.boundary&&(w+=P-W),X.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),X.__offset=w,w+=K.storage}}}const T=w%P;return T>0&&(w+=P-T),E.__size=w,E.__cache={},this}function _(E){const y={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(y.boundary=4,y.storage=4):E.isVector2?(y.boundary=8,y.storage=8):E.isVector3||E.isColor?(y.boundary=16,y.storage=12):E.isVector4?(y.boundary=16,y.storage=16):E.isMatrix3?(y.boundary=48,y.storage=48):E.isMatrix4?(y.boundary=64,y.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),y}function p(E){const y=E.target;y.removeEventListener("dispose",p);const w=o.indexOf(y.__bindingPointIndex);o.splice(w,1),s.deleteBuffer(i[y.id]),delete i[y.id],delete r[y.id]}function f(){for(const E in i)s.deleteBuffer(i[E]);o=[],i={},r={}}return{bind:l,update:c,dispose:f}}class kl{constructor(e={}){const{canvas:t=Ih(),context:n=null,depth:i=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=o;const m=new Uint32Array(4),g=new Int32Array(4);let _=null,p=null;const f=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Mt,this._useLegacyLights=!1,this.toneMapping=Cn,this.toneMappingExposure=1;const y=this;let w=!1,P=0,T=0,A=null,j=-1,M=null;const b=new yt,G=new yt;let X=null;const te=new Fe(0);let L=0,O=t.width,H=t.height,K=1,W=null,q=null;const $=new yt(0,0,O,H),ne=new yt(0,0,O,H);let ie=!1;const z=new no;let Z=!1,ce=!1,pe=null;const _e=new at,Ie=new We,fe=new R,be={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Xe(){return A===null?K:1}let N=n;function gt(x,D){for(let k=0;k<x.length;k++){const B=x[k],F=t.getContext(B,D);if(F!==null)return F}return null}try{const x={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Zr}`),t.addEventListener("webglcontextlost",re,!1),t.addEventListener("webglcontextrestored",C,!1),t.addEventListener("webglcontextcreationerror",ae,!1),N===null){const D=["webgl2","webgl","experimental-webgl"];if(y.isWebGL1Renderer===!0&&D.shift(),N=gt(D,x),N===null)throw gt(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&N instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),N.getShaderPrecisionFormat===void 0&&(N.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(x){throw console.error("THREE.WebGLRenderer: "+x.message),x}let xe,Ae,ge,qe,Ce,S,v,U,Q,J,ee,me,se,he,Se,De,Y,ze,we,Me,ve,ue,Pe,Ye;function st(){xe=new $f(N),Ae=new Gf(N,xe,e),xe.init(Ae),ue=new Im(N,xe,Ae),ge=new Pm(N,xe,Ae),qe=new Kf(N),Ce=new gm,S=new Lm(N,xe,ge,Ce,Ae,ue,qe),v=new Vf(y),U=new qf(y),Q=new iu(N,Ae),Pe=new Bf(N,xe,Q,Ae),J=new Yf(N,Q,qe,Pe),ee=new ep(N,J,Q,qe),we=new Qf(N,Ae,S),De=new Hf(Ce),me=new mm(y,v,U,xe,Ae,Pe,De),se=new Fm(y,Ce),he=new vm,Se=new bm(xe,Ae),ze=new Of(y,v,U,ge,ee,d,l),Y=new Rm(y,ee,Ae),Ye=new km(N,qe,Ae,ge),Me=new zf(N,xe,qe,Ae),ve=new jf(N,xe,qe,Ae),qe.programs=me.programs,y.capabilities=Ae,y.extensions=xe,y.properties=Ce,y.renderLists=he,y.shadowMap=Y,y.state=ge,y.info=qe}st();const Ge=new Nm(y,N);this.xr=Ge,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const x=xe.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){const x=xe.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(x){x!==void 0&&(K=x,this.setSize(O,H,!1))},this.getSize=function(x){return x.set(O,H)},this.setSize=function(x,D,k=!0){if(Ge.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}O=x,H=D,t.width=Math.floor(x*K),t.height=Math.floor(D*K),k===!0&&(t.style.width=x+"px",t.style.height=D+"px"),this.setViewport(0,0,x,D)},this.getDrawingBufferSize=function(x){return x.set(O*K,H*K).floor()},this.setDrawingBufferSize=function(x,D,k){O=x,H=D,K=k,t.width=Math.floor(x*k),t.height=Math.floor(D*k),this.setViewport(0,0,x,D)},this.getCurrentViewport=function(x){return x.copy(b)},this.getViewport=function(x){return x.copy($)},this.setViewport=function(x,D,k,B){x.isVector4?$.set(x.x,x.y,x.z,x.w):$.set(x,D,k,B),ge.viewport(b.copy($).multiplyScalar(K).floor())},this.getScissor=function(x){return x.copy(ne)},this.setScissor=function(x,D,k,B){x.isVector4?ne.set(x.x,x.y,x.z,x.w):ne.set(x,D,k,B),ge.scissor(G.copy(ne).multiplyScalar(K).floor())},this.getScissorTest=function(){return ie},this.setScissorTest=function(x){ge.setScissorTest(ie=x)},this.setOpaqueSort=function(x){W=x},this.setTransparentSort=function(x){q=x},this.getClearColor=function(x){return x.copy(ze.getClearColor())},this.setClearColor=function(){ze.setClearColor.apply(ze,arguments)},this.getClearAlpha=function(){return ze.getClearAlpha()},this.setClearAlpha=function(){ze.setClearAlpha.apply(ze,arguments)},this.clear=function(x=!0,D=!0,k=!0){let B=0;if(x){let F=!1;if(A!==null){const de=A.texture.format;F=de===pl||de===fl||de===dl}if(F){const de=A.texture.type,ye=de===Rn||de===bn||de===Qr||de===Xn||de===hl||de===ul,Te=ze.getClearColor(),Le=ze.getClearAlpha(),Be=Te.r,Ne=Te.g,ke=Te.b;ye?(m[0]=Be,m[1]=Ne,m[2]=ke,m[3]=Le,N.clearBufferuiv(N.COLOR,0,m)):(g[0]=Be,g[1]=Ne,g[2]=ke,g[3]=Le,N.clearBufferiv(N.COLOR,0,g))}else B|=N.COLOR_BUFFER_BIT}D&&(B|=N.DEPTH_BUFFER_BIT),k&&(B|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",re,!1),t.removeEventListener("webglcontextrestored",C,!1),t.removeEventListener("webglcontextcreationerror",ae,!1),he.dispose(),Se.dispose(),Ce.dispose(),v.dispose(),U.dispose(),ee.dispose(),Pe.dispose(),Ye.dispose(),me.dispose(),Ge.dispose(),Ge.removeEventListener("sessionstart",Ct),Ge.removeEventListener("sessionend",Qe),pe&&(pe.dispose(),pe=null),Rt.stop()};function re(x){x.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function C(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const x=qe.autoReset,D=Y.enabled,k=Y.autoUpdate,B=Y.needsUpdate,F=Y.type;st(),qe.autoReset=x,Y.enabled=D,Y.autoUpdate=k,Y.needsUpdate=B,Y.type=F}function ae(x){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function le(x){const D=x.target;D.removeEventListener("dispose",le),Re(D)}function Re(x){Ee(x),Ce.remove(x)}function Ee(x){const D=Ce.get(x).programs;D!==void 0&&(D.forEach(function(k){me.releaseProgram(k)}),x.isShaderMaterial&&me.releaseShaderCache(x))}this.renderBufferDirect=function(x,D,k,B,F,de){D===null&&(D=be);const ye=F.isMesh&&F.matrixWorld.determinant()<0,Te=Wl(x,D,k,B,F);ge.setMaterial(B,ye);let Le=k.index,Be=1;if(B.wireframe===!0){if(Le=J.getWireframeAttribute(k),Le===void 0)return;Be=2}const Ne=k.drawRange,ke=k.attributes.position;let lt=Ne.start*Be,kt=(Ne.start+Ne.count)*Be;de!==null&&(lt=Math.max(lt,de.start*Be),kt=Math.min(kt,(de.start+de.count)*Be)),Le!==null?(lt=Math.max(lt,0),kt=Math.min(kt,Le.count)):ke!=null&&(lt=Math.max(lt,0),kt=Math.min(kt,ke.count));const vt=kt-lt;if(vt<0||vt===1/0)return;Pe.setup(F,B,Te,k,Le);let on,nt=Me;if(Le!==null&&(on=Q.get(Le),nt=ve,nt.setIndex(on)),F.isMesh)B.wireframe===!0?(ge.setLineWidth(B.wireframeLinewidth*Xe()),nt.setMode(N.LINES)):nt.setMode(N.TRIANGLES);else if(F.isLine){let He=B.linewidth;He===void 0&&(He=1),ge.setLineWidth(He*Xe()),F.isLineSegments?nt.setMode(N.LINES):F.isLineLoop?nt.setMode(N.LINE_LOOP):nt.setMode(N.LINE_STRIP)}else F.isPoints?nt.setMode(N.POINTS):F.isSprite&&nt.setMode(N.TRIANGLES);if(F.isBatchedMesh)nt.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else if(F.isInstancedMesh)nt.renderInstances(lt,vt,F.count);else if(k.isInstancedBufferGeometry){const He=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,$s=Math.min(k.instanceCount,He);nt.renderInstances(lt,vt,$s)}else nt.render(lt,vt)};function Ze(x,D,k){x.transparent===!0&&x.side===Jt&&x.forceSinglePass===!1?(x.side=At,x.needsUpdate=!0,Yi(x,D,k),x.side=rn,x.needsUpdate=!0,Yi(x,D,k),x.side=Jt):Yi(x,D,k)}this.compile=function(x,D,k=null){k===null&&(k=x),p=Se.get(k),p.init(),E.push(p),k.traverseVisible(function(F){F.isLight&&F.layers.test(D.layers)&&(p.pushLight(F),F.castShadow&&p.pushShadow(F))}),x!==k&&x.traverseVisible(function(F){F.isLight&&F.layers.test(D.layers)&&(p.pushLight(F),F.castShadow&&p.pushShadow(F))}),p.setupLights(y._useLegacyLights);const B=new Set;return x.traverse(function(F){const de=F.material;if(de)if(Array.isArray(de))for(let ye=0;ye<de.length;ye++){const Te=de[ye];Ze(Te,k,F),B.add(Te)}else Ze(de,k,F),B.add(de)}),E.pop(),p=null,B},this.compileAsync=function(x,D,k=null){const B=this.compile(x,D,k);return new Promise(F=>{function de(){if(B.forEach(function(ye){Ce.get(ye).currentProgram.isReady()&&B.delete(ye)}),B.size===0){F(x);return}setTimeout(de,10)}xe.get("KHR_parallel_shader_compile")!==null?de():setTimeout(de,10)})};let Je=null;function _t(x){Je&&Je(x)}function Ct(){Rt.stop()}function Qe(){Rt.start()}const Rt=new Rl;Rt.setAnimationLoop(_t),typeof self<"u"&&Rt.setContext(self),this.setAnimationLoop=function(x){Je=x,Ge.setAnimationLoop(x),x===null?Rt.stop():Rt.start()},Ge.addEventListener("sessionstart",Ct),Ge.addEventListener("sessionend",Qe),this.render=function(x,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),Ge.enabled===!0&&Ge.isPresenting===!0&&(Ge.cameraAutoUpdate===!0&&Ge.updateCamera(D),D=Ge.getCamera()),x.isScene===!0&&x.onBeforeRender(y,x,D,A),p=Se.get(x,E.length),p.init(),E.push(p),_e.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),z.setFromProjectionMatrix(_e),ce=this.localClippingEnabled,Z=De.init(this.clippingPlanes,ce),_=he.get(x,f.length),_.init(),f.push(_),nn(x,D,0,y.sortObjects),_.finish(),y.sortObjects===!0&&_.sort(W,q),this.info.render.frame++,Z===!0&&De.beginShadows();const k=p.state.shadowsArray;if(Y.render(k,x,D),Z===!0&&De.endShadows(),this.info.autoReset===!0&&this.info.reset(),ze.render(_,x),p.setupLights(y._useLegacyLights),D.isArrayCamera){const B=D.cameras;for(let F=0,de=B.length;F<de;F++){const ye=B[F];ao(_,x,ye,ye.viewport)}}else ao(_,x,D);A!==null&&(S.updateMultisampleRenderTarget(A),S.updateRenderTargetMipmap(A)),x.isScene===!0&&x.onAfterRender(y,x,D),Pe.resetDefaultState(),j=-1,M=null,E.pop(),E.length>0?p=E[E.length-1]:p=null,f.pop(),f.length>0?_=f[f.length-1]:_=null};function nn(x,D,k,B){if(x.visible===!1)return;if(x.layers.test(D.layers)){if(x.isGroup)k=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(D);else if(x.isLight)p.pushLight(x),x.castShadow&&p.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||z.intersectsSprite(x)){B&&fe.setFromMatrixPosition(x.matrixWorld).applyMatrix4(_e);const ye=ee.update(x),Te=x.material;Te.visible&&_.push(x,ye,Te,k,fe.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||z.intersectsObject(x))){const ye=ee.update(x),Te=x.material;if(B&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),fe.copy(x.boundingSphere.center)):(ye.boundingSphere===null&&ye.computeBoundingSphere(),fe.copy(ye.boundingSphere.center)),fe.applyMatrix4(x.matrixWorld).applyMatrix4(_e)),Array.isArray(Te)){const Le=ye.groups;for(let Be=0,Ne=Le.length;Be<Ne;Be++){const ke=Le[Be],lt=Te[ke.materialIndex];lt&&lt.visible&&_.push(x,ye,lt,k,fe.z,ke)}}else Te.visible&&_.push(x,ye,Te,k,fe.z,null)}}const de=x.children;for(let ye=0,Te=de.length;ye<Te;ye++)nn(de[ye],D,k,B)}function ao(x,D,k,B){const F=x.opaque,de=x.transmissive,ye=x.transparent;p.setupLightsView(k),Z===!0&&De.setGlobalState(y.clippingPlanes,k),de.length>0&&Vl(F,de,D,k),B&&ge.viewport(b.copy(B)),F.length>0&&$i(F,D,k),de.length>0&&$i(de,D,k),ye.length>0&&$i(ye,D,k),ge.buffers.depth.setTest(!0),ge.buffers.depth.setMask(!0),ge.buffers.color.setMask(!0),ge.setPolygonOffset(!1)}function Vl(x,D,k,B){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;const de=Ae.isWebGL2;pe===null&&(pe=new Kn(1,1,{generateMipmaps:!0,type:xe.has("EXT_color_buffer_half_float")?Hi:Rn,minFilter:Gi,samples:de?4:0})),y.getDrawingBufferSize(Ie),de?pe.setSize(Ie.x,Ie.y):pe.setSize(Hr(Ie.x),Hr(Ie.y));const ye=y.getRenderTarget();y.setRenderTarget(pe),y.getClearColor(te),L=y.getClearAlpha(),L<1&&y.setClearColor(16777215,.5),y.clear();const Te=y.toneMapping;y.toneMapping=Cn,$i(x,k,B),S.updateMultisampleRenderTarget(pe),S.updateRenderTargetMipmap(pe);let Le=!1;for(let Be=0,Ne=D.length;Be<Ne;Be++){const ke=D[Be],lt=ke.object,kt=ke.geometry,vt=ke.material,on=ke.group;if(vt.side===Jt&&lt.layers.test(B.layers)){const nt=vt.side;vt.side=At,vt.needsUpdate=!0,lo(lt,k,B,kt,vt,on),vt.side=nt,vt.needsUpdate=!0,Le=!0}}Le===!0&&(S.updateMultisampleRenderTarget(pe),S.updateRenderTargetMipmap(pe)),y.setRenderTarget(ye),y.setClearColor(te,L),y.toneMapping=Te}function $i(x,D,k){const B=D.isScene===!0?D.overrideMaterial:null;for(let F=0,de=x.length;F<de;F++){const ye=x[F],Te=ye.object,Le=ye.geometry,Be=B===null?ye.material:B,Ne=ye.group;Te.layers.test(k.layers)&&lo(Te,D,k,Le,Be,Ne)}}function lo(x,D,k,B,F,de){x.onBeforeRender(y,D,k,B,F,de),x.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),F.onBeforeRender(y,D,k,B,x,de),F.transparent===!0&&F.side===Jt&&F.forceSinglePass===!1?(F.side=At,F.needsUpdate=!0,y.renderBufferDirect(k,D,B,F,x,de),F.side=rn,F.needsUpdate=!0,y.renderBufferDirect(k,D,B,F,x,de),F.side=Jt):y.renderBufferDirect(k,D,B,F,x,de),x.onAfterRender(y,D,k,B,F,de)}function Yi(x,D,k){D.isScene!==!0&&(D=be);const B=Ce.get(x),F=p.state.lights,de=p.state.shadowsArray,ye=F.state.version,Te=me.getParameters(x,F.state,de,D,k),Le=me.getProgramCacheKey(Te);let Be=B.programs;B.environment=x.isMeshStandardMaterial?D.environment:null,B.fog=D.fog,B.envMap=(x.isMeshStandardMaterial?U:v).get(x.envMap||B.environment),Be===void 0&&(x.addEventListener("dispose",le),Be=new Map,B.programs=Be);let Ne=Be.get(Le);if(Ne!==void 0){if(B.currentProgram===Ne&&B.lightsStateVersion===ye)return ho(x,Te),Ne}else Te.uniforms=me.getUniforms(x),x.onBuild(k,Te,y),x.onBeforeCompile(Te,y),Ne=me.acquireProgram(Te,Le),Be.set(Le,Ne),B.uniforms=Te.uniforms;const ke=B.uniforms;return(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(ke.clippingPlanes=De.uniform),ho(x,Te),B.needsLights=ql(x),B.lightsStateVersion=ye,B.needsLights&&(ke.ambientLightColor.value=F.state.ambient,ke.lightProbe.value=F.state.probe,ke.directionalLights.value=F.state.directional,ke.directionalLightShadows.value=F.state.directionalShadow,ke.spotLights.value=F.state.spot,ke.spotLightShadows.value=F.state.spotShadow,ke.rectAreaLights.value=F.state.rectArea,ke.ltc_1.value=F.state.rectAreaLTC1,ke.ltc_2.value=F.state.rectAreaLTC2,ke.pointLights.value=F.state.point,ke.pointLightShadows.value=F.state.pointShadow,ke.hemisphereLights.value=F.state.hemi,ke.directionalShadowMap.value=F.state.directionalShadowMap,ke.directionalShadowMatrix.value=F.state.directionalShadowMatrix,ke.spotShadowMap.value=F.state.spotShadowMap,ke.spotLightMatrix.value=F.state.spotLightMatrix,ke.spotLightMap.value=F.state.spotLightMap,ke.pointShadowMap.value=F.state.pointShadowMap,ke.pointShadowMatrix.value=F.state.pointShadowMatrix),B.currentProgram=Ne,B.uniformsList=null,Ne}function co(x){if(x.uniformsList===null){const D=x.currentProgram.getUniforms();x.uniformsList=Ls.seqWithValue(D.seq,x.uniforms)}return x.uniformsList}function ho(x,D){const k=Ce.get(x);k.outputColorSpace=D.outputColorSpace,k.batching=D.batching,k.instancing=D.instancing,k.instancingColor=D.instancingColor,k.skinning=D.skinning,k.morphTargets=D.morphTargets,k.morphNormals=D.morphNormals,k.morphColors=D.morphColors,k.morphTargetsCount=D.morphTargetsCount,k.numClippingPlanes=D.numClippingPlanes,k.numIntersection=D.numClipIntersection,k.vertexAlphas=D.vertexAlphas,k.vertexTangents=D.vertexTangents,k.toneMapping=D.toneMapping}function Wl(x,D,k,B,F){D.isScene!==!0&&(D=be),S.resetTextureUnits();const de=D.fog,ye=B.isMeshStandardMaterial?D.environment:null,Te=A===null?y.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:mn,Le=(B.isMeshStandardMaterial?U:v).get(B.envMap||ye),Be=B.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Ne=!!k.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),ke=!!k.morphAttributes.position,lt=!!k.morphAttributes.normal,kt=!!k.morphAttributes.color;let vt=Cn;B.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(vt=y.toneMapping);const on=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,nt=on!==void 0?on.length:0,He=Ce.get(B),$s=p.state.lights;if(Z===!0&&(ce===!0||x!==M)){const Ht=x===M&&B.id===j;De.setState(B,x,Ht)}let rt=!1;B.version===He.__version?(He.needsLights&&He.lightsStateVersion!==$s.state.version||He.outputColorSpace!==Te||F.isBatchedMesh&&He.batching===!1||!F.isBatchedMesh&&He.batching===!0||F.isInstancedMesh&&He.instancing===!1||!F.isInstancedMesh&&He.instancing===!0||F.isSkinnedMesh&&He.skinning===!1||!F.isSkinnedMesh&&He.skinning===!0||F.isInstancedMesh&&He.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&He.instancingColor===!1&&F.instanceColor!==null||He.envMap!==Le||B.fog===!0&&He.fog!==de||He.numClippingPlanes!==void 0&&(He.numClippingPlanes!==De.numPlanes||He.numIntersection!==De.numIntersection)||He.vertexAlphas!==Be||He.vertexTangents!==Ne||He.morphTargets!==ke||He.morphNormals!==lt||He.morphColors!==kt||He.toneMapping!==vt||Ae.isWebGL2===!0&&He.morphTargetsCount!==nt)&&(rt=!0):(rt=!0,He.__version=B.version);let Ln=He.currentProgram;rt===!0&&(Ln=Yi(B,D,F));let uo=!1,Ci=!1,Ys=!1;const Et=Ln.getUniforms(),In=He.uniforms;if(ge.useProgram(Ln.program)&&(uo=!0,Ci=!0,Ys=!0),B.id!==j&&(j=B.id,Ci=!0),uo||M!==x){Et.setValue(N,"projectionMatrix",x.projectionMatrix),Et.setValue(N,"viewMatrix",x.matrixWorldInverse);const Ht=Et.map.cameraPosition;Ht!==void 0&&Ht.setValue(N,fe.setFromMatrixPosition(x.matrixWorld)),Ae.logarithmicDepthBuffer&&Et.setValue(N,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&Et.setValue(N,"isOrthographic",x.isOrthographicCamera===!0),M!==x&&(M=x,Ci=!0,Ys=!0)}if(F.isSkinnedMesh){Et.setOptional(N,F,"bindMatrix"),Et.setOptional(N,F,"bindMatrixInverse");const Ht=F.skeleton;Ht&&(Ae.floatVertexTextures?(Ht.boneTexture===null&&Ht.computeBoneTexture(),Et.setValue(N,"boneTexture",Ht.boneTexture,S)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}F.isBatchedMesh&&(Et.setOptional(N,F,"batchingTexture"),Et.setValue(N,"batchingTexture",F._matricesTexture,S));const js=k.morphAttributes;if((js.position!==void 0||js.normal!==void 0||js.color!==void 0&&Ae.isWebGL2===!0)&&we.update(F,k,Ln),(Ci||He.receiveShadow!==F.receiveShadow)&&(He.receiveShadow=F.receiveShadow,Et.setValue(N,"receiveShadow",F.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&(In.envMap.value=Le,In.flipEnvMap.value=Le.isCubeTexture&&Le.isRenderTargetTexture===!1?-1:1),Ci&&(Et.setValue(N,"toneMappingExposure",y.toneMappingExposure),He.needsLights&&Xl(In,Ys),de&&B.fog===!0&&se.refreshFogUniforms(In,de),se.refreshMaterialUniforms(In,B,K,H,pe),Ls.upload(N,co(He),In,S)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(Ls.upload(N,co(He),In,S),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&Et.setValue(N,"center",F.center),Et.setValue(N,"modelViewMatrix",F.modelViewMatrix),Et.setValue(N,"normalMatrix",F.normalMatrix),Et.setValue(N,"modelMatrix",F.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){const Ht=B.uniformsGroups;for(let Ks=0,$l=Ht.length;Ks<$l;Ks++)if(Ae.isWebGL2){const fo=Ht[Ks];Ye.update(fo,Ln),Ye.bind(fo,Ln)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Ln}function Xl(x,D){x.ambientLightColor.needsUpdate=D,x.lightProbe.needsUpdate=D,x.directionalLights.needsUpdate=D,x.directionalLightShadows.needsUpdate=D,x.pointLights.needsUpdate=D,x.pointLightShadows.needsUpdate=D,x.spotLights.needsUpdate=D,x.spotLightShadows.needsUpdate=D,x.rectAreaLights.needsUpdate=D,x.hemisphereLights.needsUpdate=D}function ql(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(x,D,k){Ce.get(x.texture).__webglTexture=D,Ce.get(x.depthTexture).__webglTexture=k;const B=Ce.get(x);B.__hasExternalTextures=!0,B.__hasExternalTextures&&(B.__autoAllocateDepthBuffer=k===void 0,B.__autoAllocateDepthBuffer||xe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),B.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(x,D){const k=Ce.get(x);k.__webglFramebuffer=D,k.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(x,D=0,k=0){A=x,P=D,T=k;let B=!0,F=null,de=!1,ye=!1;if(x){const Le=Ce.get(x);Le.__useDefaultFramebuffer!==void 0?(ge.bindFramebuffer(N.FRAMEBUFFER,null),B=!1):Le.__webglFramebuffer===void 0?S.setupRenderTarget(x):Le.__hasExternalTextures&&S.rebindTextures(x,Ce.get(x.texture).__webglTexture,Ce.get(x.depthTexture).__webglTexture);const Be=x.texture;(Be.isData3DTexture||Be.isDataArrayTexture||Be.isCompressedArrayTexture)&&(ye=!0);const Ne=Ce.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(Ne[D])?F=Ne[D][k]:F=Ne[D],de=!0):Ae.isWebGL2&&x.samples>0&&S.useMultisampledRTT(x)===!1?F=Ce.get(x).__webglMultisampledFramebuffer:Array.isArray(Ne)?F=Ne[k]:F=Ne,b.copy(x.viewport),G.copy(x.scissor),X=x.scissorTest}else b.copy($).multiplyScalar(K).floor(),G.copy(ne).multiplyScalar(K).floor(),X=ie;if(ge.bindFramebuffer(N.FRAMEBUFFER,F)&&Ae.drawBuffers&&B&&ge.drawBuffers(x,F),ge.viewport(b),ge.scissor(G),ge.setScissorTest(X),de){const Le=Ce.get(x.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+D,Le.__webglTexture,k)}else if(ye){const Le=Ce.get(x.texture),Be=D||0;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,Le.__webglTexture,k||0,Be)}j=-1},this.readRenderTargetPixels=function(x,D,k,B,F,de,ye){if(!(x&&x.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Te=Ce.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&ye!==void 0&&(Te=Te[ye]),Te){ge.bindFramebuffer(N.FRAMEBUFFER,Te);try{const Le=x.texture,Be=Le.format,Ne=Le.type;if(Be!==en&&ue.convert(Be)!==N.getParameter(N.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const ke=Ne===Hi&&(xe.has("EXT_color_buffer_half_float")||Ae.isWebGL2&&xe.has("EXT_color_buffer_float"));if(Ne!==Rn&&ue.convert(Ne)!==N.getParameter(N.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Ne===wn&&(Ae.isWebGL2||xe.has("OES_texture_float")||xe.has("WEBGL_color_buffer_float")))&&!ke){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=x.width-B&&k>=0&&k<=x.height-F&&N.readPixels(D,k,B,F,ue.convert(Be),ue.convert(Ne),de)}finally{const Le=A!==null?Ce.get(A).__webglFramebuffer:null;ge.bindFramebuffer(N.FRAMEBUFFER,Le)}}},this.copyFramebufferToTexture=function(x,D,k=0){const B=Math.pow(2,-k),F=Math.floor(D.image.width*B),de=Math.floor(D.image.height*B);S.setTexture2D(D,0),N.copyTexSubImage2D(N.TEXTURE_2D,k,0,0,x.x,x.y,F,de),ge.unbindTexture()},this.copyTextureToTexture=function(x,D,k,B=0){const F=D.image.width,de=D.image.height,ye=ue.convert(k.format),Te=ue.convert(k.type);S.setTexture2D(k,0),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,k.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,k.unpackAlignment),D.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,B,x.x,x.y,F,de,ye,Te,D.image.data):D.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,B,x.x,x.y,D.mipmaps[0].width,D.mipmaps[0].height,ye,D.mipmaps[0].data):N.texSubImage2D(N.TEXTURE_2D,B,x.x,x.y,ye,Te,D.image),B===0&&k.generateMipmaps&&N.generateMipmap(N.TEXTURE_2D),ge.unbindTexture()},this.copyTextureToTexture3D=function(x,D,k,B,F=0){if(y.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const de=x.max.x-x.min.x+1,ye=x.max.y-x.min.y+1,Te=x.max.z-x.min.z+1,Le=ue.convert(B.format),Be=ue.convert(B.type);let Ne;if(B.isData3DTexture)S.setTexture3D(B,0),Ne=N.TEXTURE_3D;else if(B.isDataArrayTexture||B.isCompressedArrayTexture)S.setTexture2DArray(B,0),Ne=N.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,B.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,B.unpackAlignment);const ke=N.getParameter(N.UNPACK_ROW_LENGTH),lt=N.getParameter(N.UNPACK_IMAGE_HEIGHT),kt=N.getParameter(N.UNPACK_SKIP_PIXELS),vt=N.getParameter(N.UNPACK_SKIP_ROWS),on=N.getParameter(N.UNPACK_SKIP_IMAGES),nt=k.isCompressedTexture?k.mipmaps[F]:k.image;N.pixelStorei(N.UNPACK_ROW_LENGTH,nt.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,nt.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,x.min.x),N.pixelStorei(N.UNPACK_SKIP_ROWS,x.min.y),N.pixelStorei(N.UNPACK_SKIP_IMAGES,x.min.z),k.isDataTexture||k.isData3DTexture?N.texSubImage3D(Ne,F,D.x,D.y,D.z,de,ye,Te,Le,Be,nt.data):k.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),N.compressedTexSubImage3D(Ne,F,D.x,D.y,D.z,de,ye,Te,Le,nt.data)):N.texSubImage3D(Ne,F,D.x,D.y,D.z,de,ye,Te,Le,Be,nt),N.pixelStorei(N.UNPACK_ROW_LENGTH,ke),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,lt),N.pixelStorei(N.UNPACK_SKIP_PIXELS,kt),N.pixelStorei(N.UNPACK_SKIP_ROWS,vt),N.pixelStorei(N.UNPACK_SKIP_IMAGES,on),F===0&&B.generateMipmaps&&N.generateMipmap(Ne),ge.unbindTexture()},this.initTexture=function(x){x.isCubeTexture?S.setTextureCube(x,0):x.isData3DTexture?S.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?S.setTexture2DArray(x,0):S.setTexture2D(x,0),ge.unbindTexture()},this.resetState=function(){P=0,T=0,A=null,ge.reset(),Pe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return pn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===eo?"display-p3":"srgb",t.unpackColorSpace=je.workingColorSpace===Vs?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Mt?$n:gl}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===$n?Mt:mn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class Om extends kl{}Om.prototype.isWebGL1Renderer=!0;class so{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Fe(e),this.near=t,this.far=n}clone(){return new so(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Bm extends ft{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}class zm{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Br,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=Pn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Pn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Pn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Pt=new R;class Bs{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix4(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyNormalMatrix(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.transformDirection(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}setX(e,t){return this.normalized&&(t=Ke(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ke(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ke(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ke(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=fn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=fn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=fn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=fn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ke(t,this.array),n=Ke(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ke(t,this.array),n=Ke(n,this.array),i=Ke(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ke(t,this.array),n=Ke(n,this.array),i=Ke(i,this.array),r=Ke(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new Yt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Bs(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Ol extends gn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Fe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let pi;const Di=new R,mi=new R,gi=new R,_i=new We,Ui=new We,Bl=new at,vs=new R,Ni=new R,xs=new R,Oa=new We,Cr=new We,Ba=new We;class Gm extends ft{constructor(e=new Ol){if(super(),this.isSprite=!0,this.type="Sprite",pi===void 0){pi=new Dt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new zm(t,5);pi.setIndex([0,1,2,0,2,3]),pi.setAttribute("position",new Bs(n,3,0,!1)),pi.setAttribute("uv",new Bs(n,2,3,!1))}this.geometry=pi,this.material=e,this.center=new We(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),mi.setFromMatrixScale(this.matrixWorld),Bl.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),gi.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&mi.multiplyScalar(-gi.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const o=this.center;ys(vs.set(-.5,-.5,0),gi,o,mi,i,r),ys(Ni.set(.5,-.5,0),gi,o,mi,i,r),ys(xs.set(.5,.5,0),gi,o,mi,i,r),Oa.set(0,0),Cr.set(1,0),Ba.set(1,1);let a=e.ray.intersectTriangle(vs,Ni,xs,!1,Di);if(a===null&&(ys(Ni.set(-.5,.5,0),gi,o,mi,i,r),Cr.set(0,1),a=e.ray.intersectTriangle(vs,xs,Ni,!1,Di),a===null))return;const l=e.ray.origin.distanceTo(Di);l<e.near||l>e.far||t.push({distance:l,point:Di.clone(),uv:zt.getInterpolation(Di,vs,Ni,xs,Oa,Cr,Ba,new We),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function ys(s,e,t,n,i,r){_i.subVectors(s,t).addScalar(.5).multiply(n),i!==void 0?(Ui.x=r*_i.x-i*_i.y,Ui.y=i*_i.x+r*_i.y):Ui.copy(_i),s.copy(e),s.x+=Ui.x,s.y+=Ui.y,s.applyMatrix4(Bl)}class zl extends gn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Fe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const za=new R,Ga=new R,Ha=new at,Rr=new Ws,Ss=new Xi;class Hm extends ft{constructor(e=new Dt,t=new zl){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)za.fromBufferAttribute(t,i-1),Ga.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=za.distanceTo(Ga);e.setAttribute("lineDistance",new ct(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ss.copy(n.boundingSphere),Ss.applyMatrix4(i),Ss.radius+=r,e.ray.intersectsSphere(Ss)===!1)return;Ha.copy(i).invert(),Rr.copy(e.ray).applyMatrix4(Ha);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=new R,h=new R,u=new R,d=new R,m=this.isLineSegments?2:1,g=n.index,p=n.attributes.position;if(g!==null){const f=Math.max(0,o.start),E=Math.min(g.count,o.start+o.count);for(let y=f,w=E-1;y<w;y+=m){const P=g.getX(y),T=g.getX(y+1);if(c.fromBufferAttribute(p,P),h.fromBufferAttribute(p,T),Rr.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);const j=e.ray.origin.distanceTo(d);j<e.near||j>e.far||t.push({distance:j,point:u.clone().applyMatrix4(this.matrixWorld),index:y,face:null,faceIndex:null,object:this})}}else{const f=Math.max(0,o.start),E=Math.min(p.count,o.start+o.count);for(let y=f,w=E-1;y<w;y+=m){if(c.fromBufferAttribute(p,y),h.fromBufferAttribute(p,y+1),Rr.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);const T=e.ray.origin.distanceTo(d);T<e.near||T>e.far||t.push({distance:T,point:u.clone().applyMatrix4(this.matrixWorld),index:y,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}const Va=new R,Wa=new R;class Vm extends Hm{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)Va.fromBufferAttribute(t,i),Wa.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Va.distanceTo(Wa);e.setAttribute("lineDistance",new ct(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class ro extends gn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Fe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Xa=new at,Wr=new Ws,Ms=new Xi,Es=new R;class Gl extends ft{constructor(e=new Dt,t=new ro){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ms.copy(n.boundingSphere),Ms.applyMatrix4(i),Ms.radius+=r,e.ray.intersectsSphere(Ms)===!1)return;Xa.copy(i).invert(),Wr.copy(e.ray).applyMatrix4(Xa);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){const d=Math.max(0,o.start),m=Math.min(c.count,o.start+o.count);for(let g=d,_=m;g<_;g++){const p=c.getX(g);Es.fromBufferAttribute(u,p),qa(Es,p,l,i,e,t,this)}}else{const d=Math.max(0,o.start),m=Math.min(u.count,o.start+o.count);for(let g=d,_=m;g<_;g++)Es.fromBufferAttribute(u,g),qa(Es,g,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function qa(s,e,t,n,i,r,o){const a=Wr.distanceSqToPoint(s);if(a<t){const l=new R;Wr.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,object:o})}}class Xr extends Ft{constructor(e,t,n,i,r,o,a,l,c){super(e,t,n,i,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}const bs=new R,ws=new R,Pr=new R,Ts=new zt;class Wm extends Dt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const i=Math.pow(10,4),r=Math.cos(Ps*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d={},m=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:_,b:p,c:f}=Ts;if(_.fromBufferAttribute(a,c[0]),p.fromBufferAttribute(a,c[1]),f.fromBufferAttribute(a,c[2]),Ts.getNormal(Pr),u[0]=`${Math.round(_.x*i)},${Math.round(_.y*i)},${Math.round(_.z*i)}`,u[1]=`${Math.round(p.x*i)},${Math.round(p.y*i)},${Math.round(p.z*i)}`,u[2]=`${Math.round(f.x*i)},${Math.round(f.y*i)},${Math.round(f.z*i)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let E=0;E<3;E++){const y=(E+1)%3,w=u[E],P=u[y],T=Ts[h[E]],A=Ts[h[y]],j=`${w}_${P}`,M=`${P}_${w}`;M in d&&d[M]?(Pr.dot(d[M].normal)<=r&&(m.push(T.x,T.y,T.z),m.push(A.x,A.y,A.z)),d[M]=null):j in d||(d[j]={index0:c[E],index1:c[y],normal:Pr.clone()})}}for(const g in d)if(d[g]){const{index0:_,index1:p}=d[g];bs.fromBufferAttribute(a,_),ws.fromBufferAttribute(a,p),m.push(bs.x,bs.y,bs.z),m.push(ws.x,ws.y,ws.z)}this.setAttribute("position",new ct(m,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class zs extends Dt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new R,d=new R,m=[],g=[],_=[],p=[];for(let f=0;f<=n;f++){const E=[],y=f/n;let w=0;f===0&&o===0?w=.5/t:f===n&&l===Math.PI&&(w=-.5/t);for(let P=0;P<=t;P++){const T=P/t;u.x=-e*Math.cos(i+T*r)*Math.sin(o+y*a),u.y=e*Math.cos(o+y*a),u.z=e*Math.sin(i+T*r)*Math.sin(o+y*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),p.push(T+w,1-y),E.push(c++)}h.push(E)}for(let f=0;f<n;f++)for(let E=0;E<t;E++){const y=h[f][E+1],w=h[f][E],P=h[f+1][E],T=h[f+1][E+1];(f!==0||o>0)&&m.push(y,w,T),(f!==n-1||l<Math.PI)&&m.push(w,P,T)}this.setIndex(m),this.setAttribute("position",new ct(g,3)),this.setAttribute("normal",new ct(_,3)),this.setAttribute("uv",new ct(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zs(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class It extends gn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Fe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Fe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=_l,this.normalScale=new We(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Jr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Hl extends ft{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Fe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const Lr=new at,$a=new R,Ya=new R;class Xm{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new We(512,512),this.map=null,this.mapPass=null,this.matrix=new at,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new no,this._frameExtents=new We(1,1),this._viewportCount=1,this._viewports=[new yt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;$a.setFromMatrixPosition(e.matrixWorld),t.position.copy($a),Ya.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ya),t.updateMatrixWorld(),Lr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Lr),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Lr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class qm extends Xm{constructor(){super(new Pl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class $m extends Hl{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ft.DEFAULT_UP),this.updateMatrix(),this.target=new ft,this.shadow=new qm}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Ym extends Hl{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class jm{constructor(e,t,n=0,i=1/0){this.ray=new Ws(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new to,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}intersectObject(e,t=!0,n=[]){return qr(e,this,n,t),n.sort(ja),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)qr(e[i],this,n,t);return n.sort(ja),n}}function ja(s,e){return s.distance-e.distance}function qr(s,e,t,n){if(s.layers.test(e.layers)&&s.raycast(e,t),n===!0){const i=s.children;for(let r=0,o=i.length;r<o;r++)qr(i[r],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Zr}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Zr);const Ka=600,Km=120,Zm=3,Za=200;class Jm{constructor(e){I(this,"mesh");I(this,"material");const t=this.generateCloudTexture();t.wrapS=zi,t.wrapT=zi,this.material=new Yn({map:t,transparent:!0,side:Jt,depthWrite:!1,opacity:.6});const n=new Xs(Ka,Ka);n.rotateX(-Math.PI/2),this.mesh=new $e(n,this.material),this.mesh.position.set(0,Km,0),this.mesh.name="clouds",e.add(this.mesh)}generateCloudTexture(){const t=document.createElement("canvas");t.width=512,t.height=512;const n=t.getContext("2d");n.clearRect(0,0,512,512);const i=[];for(let o=0;o<18;o++){const a=Math.random()*512,l=Math.random()*512,c=3+Math.floor(Math.random()*5),h=.3+Math.random()*.4;for(let u=0;u<c;u++){const d=a+(Math.random()-.5)*120,m=l+(Math.random()-.5)*60,g=30+Math.random()*70;i.push({x:d,y:m,radius:g,opacity:h})}}for(const o of i){const a=n.createRadialGradient(o.x,o.y,0,o.x,o.y,o.radius);a.addColorStop(0,`rgba(255, 255, 255, ${o.opacity})`),a.addColorStop(.5,`rgba(255, 255, 255, ${o.opacity*.5})`),a.addColorStop(1,"rgba(255, 255, 255, 0)"),n.fillStyle=a,n.fillRect(o.x-o.radius,o.y-o.radius,o.radius*2,o.radius*2)}const r=new Xr(t);return r.minFilter=Ut,r.magFilter=Ut,r}setVisible(e){this.mesh.visible=e}update(e,t){this.mesh.position.x+=Zm*t,this.mesh.position.x>Za&&(this.mesh.position.x-=Za*2);const n=new Fe;if(e>.7)n.setRGB(1,1,1);else if(e>.4){const i=(e-.4)/.3;n.setRGB(1,.6+.4*i,.4+.6*i)}else if(e>.15){const i=(e-.15)/.25;n.setRGB(.6+.4*i,.3+.3*i,.2+.2*i)}else n.setRGB(.3,.3,.35);this.material.color.copy(n),e>.7?this.material.opacity=.55:e>.4?this.material.opacity=.5:e>.15?this.material.opacity=.35:this.material.opacity=.15}dispose(e){e.remove(this.mesh),this.mesh.geometry.dispose(),this.material.map&&this.material.map.dispose(),this.material.dispose()}}class Qm{constructor(e){I(this,"scene");I(this,"camera");I(this,"renderer");I(this,"canvas");I(this,"skyLight");I(this,"ambientLight");I(this,"fog");I(this,"skyColor");I(this,"cloudSystem");I(this,"damageFlashEl");I(this,"vignetteEl");I(this,"lavaOverlayEl");I(this,"damageFlashIntensity",0);I(this,"currentBrightness",1);I(this,"isRaining",!1);I(this,"normalFogNear",80);I(this,"normalFogFar",160);I(this,"rainFogNear",30);I(this,"rainFogFar",80);this.canvas=document.createElement("canvas"),this.canvas.id="game-canvas",e.appendChild(this.canvas),this.scene=new Bm,this.skyColor=new Fe(8900331),this.scene.background=this.skyColor,this.fog=new so(this.skyColor,80,160),this.scene.fog=this.fog,this.camera=new qt(70,window.innerWidth/window.innerHeight,.1,500),this.renderer=new kl({canvas:this.canvas,antialias:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!1,this.skyLight=new $m(16777215,1),this.skyLight.position.set(100,200,100),this.scene.add(this.skyLight),this.ambientLight=new Ym(4210752,.6),this.scene.add(this.ambientLight),this.addSkyDome(),this.setupResizeHandler(),this.cloudSystem=new Jm(this.scene),this.damageFlashEl=document.getElementById("damage-flash"),this.vignetteEl=document.getElementById("cave-vignette"),this.lavaOverlayEl=document.getElementById("lava-overlay")}addSkyDome(){const e=new zs(400,32,32),t=new Yn({color:8900331,side:At}),n=new $e(e,t);n.name="sky",this.scene.add(n);const i=new zs(15,16,16),r=new Yn({color:16776960}),o=new $e(i,r);o.position.set(200,150,-100),o.name="sun",this.scene.add(o)}setupResizeHandler(){window.addEventListener("resize",()=>{this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)})}getScene(){return this.scene}getCamera(){return this.camera}getCanvas(){return this.canvas}getBrightness(){return this.currentBrightness}setFov(e){this.camera.fov=e,this.camera.updateProjectionMatrix()}setCloudsEnabled(e){this.cloudSystem.setVisible(e)}setRaining(e){this.isRaining=e}addToScene(e){this.scene.add(e)}removeFromScene(e){this.scene.remove(e)}updateSkyBrightness(e){this.currentBrightness=e;let t=.53*e,n=.81*e,i=.92*e;this.isRaining&&(t=t*(1-.3)+.4*.3,n=n*(1-.3)+.42*.3,i=i*(1-.3)+.48*.3),this.skyColor.setRGB(t,n,i),this.scene.background=this.skyColor,this.scene.fog.color=this.skyColor,this.fog.near=this.isRaining?this.rainFogNear:this.normalFogNear,this.fog.far=this.isRaining?this.rainFogFar:this.normalFogFar,this.skyLight.intensity=this.isRaining?e*.6:e,this.ambientLight.intensity=this.isRaining?.3+.3*e:.2+.6*e;const r=this.scene.getObjectByName("sky");r&&(r.material=new Yn({color:this.skyColor,side:At}))}updateClouds(e){this.cloudSystem.update(this.currentBrightness,e)}flashDamage(e){this.damageFlashIntensity=e,this.damageFlashEl.style.opacity=String(e)}updateDamageFlash(e){this.damageFlashIntensity>0&&(this.damageFlashIntensity-=e/.3,this.damageFlashIntensity<0&&(this.damageFlashIntensity=0),this.damageFlashEl.style.opacity=String(this.damageFlashIntensity))}updateCaveDarkness(e,t){if(t&&e<30){const n=Math.min(1,(30-e)/25),i=.4+.5*n,r=1-n*.7;this.vignetteEl.style.opacity=String(i),this.ambientLight.intensity=(.2+.6*this.currentBrightness)*r}else this.vignetteEl.style.opacity="0",this.ambientLight.intensity=.2+.6*this.currentBrightness}updateLavaEffect(e){this.lavaOverlayEl.style.opacity=e?"0.3":"0"}updateEffects(e){this.updateDamageFlash(e)}render(){this.renderer.render(this.scene,this.camera)}}const Ja=20,Ir=5,eg=8,tg=12,ng=1.7,ig=.6,sg=1.8,As=.6;class rg{constructor(e,t){I(this,"_camera");I(this,"_input");I(this,"_position");I(this,"_velocity");I(this,"_yaw",0);I(this,"_pitch",0);I(this,"_isFlying",!1);I(this,"_selectedSlot",0);I(this,"_selectedBlockType",1);I(this,"_worldManager",null);I(this,"_onGround",!1);I(this,"_knockbackVelocity",new R(0,0,0));I(this,"_selectionBox",null);I(this,"_particleEmitter",null);I(this,"_connection",null);I(this,"digStartTime",0);I(this,"digTarget",null);I(this,"digDuration",0);I(this,"isDigging",!1);I(this,"mouseSensitivity",.002);I(this,"isLeftMouseDown",!1);I(this,"health",20);I(this,"maxHealth",20);I(this,"inventory",[]);I(this,"isDead",!1);this._camera=e,this._input=t,this._position=new R(0,50,0),this._velocity=new R(0,0,0),this.setupControls(),this.requestPointerLock()}setWorldManager(e){this._worldManager=e}setSelectionBox(e){this._selectionBox=e}setParticleEmitter(e){this._particleEmitter=e}setConnection(e){this._connection=e}requestPointerLock(){const e=document.getElementById("game-canvas");e&&e.addEventListener("click",()=>{e.requestPointerLock()})}setupControls(){document.addEventListener("pointerlockchange",()=>{this._input.setPointerLocked(document.pointerLockElement!==null)}),document.addEventListener("mousemove",e=>{this._input.isPointerLocked()&&(this._yaw-=e.movementX*this.mouseSensitivity,this._pitch-=e.movementY*this.mouseSensitivity,this._pitch=Math.max(-Math.PI/2+.01,Math.min(Math.PI/2-.01,this._pitch)))}),document.addEventListener("keydown",e=>{var t;switch(e.code){case"KeyF":this._isFlying=!this._isFlying;break;case"KeyE":const n=new CustomEvent("openCrafting");document.dispatchEvent(n);break;case"Digit1":case"Digit2":case"Digit3":case"Digit4":case"Digit5":case"Digit6":case"Digit7":case"Digit8":this._selectedSlot=parseInt(e.code.replace("Digit",""))-1,(t=this._connection)==null||t.invoke("SelectSlot",this._selectedSlot);break}}),document.addEventListener("mousedown",e=>{this._input.isPointerLocked()&&(this.isDead||(e.button===0?(this.isLeftMouseDown=!0,this.startDig()):e.button===2&&this.onPlace()))}),document.addEventListener("mouseup",e=>{e.button===0&&(this.isLeftMouseDown=!1,this.resetDig())}),document.addEventListener("contextmenu",e=>e.preventDefault())}async startDig(){var n;const e=this.castRay();if(!e||this._connection&&((n=this.inventory[this._selectedSlot])==null?void 0:n.itemId)==="bucket"&&await this._connection.invoke("UseBucket",e.blockX,e.blockY,e.blockZ,!1))return;const t={x:e.blockX,y:e.blockY,z:e.blockZ};if(!(this.digTarget&&this.digTarget.x===t.x&&this.digTarget.y===t.y&&this.digTarget.z===t.z&&this.isDigging)){if(this.resetDig(),this.digTarget=t,!this._connection){this.instantDig(e);return}this._connection.invoke("DigBlockStart",e.blockX,e.blockY,e.blockZ).then(i=>{i<0||(this.digStartTime=performance.now()/1e3,this.digDuration=i,this.isDigging=!0)}).catch(()=>{this.instantDig(e)})}}instantDig(e){var t;(t=this._particleEmitter)==null||t.call(this,e.blockX,e.blockY,e.blockZ,"dig"),this.emitBlockEvent("dig",e.blockX,e.blockY,e.blockZ)}completeDig(){var e;this.digTarget&&((e=this._particleEmitter)==null||e.call(this,this.digTarget.x,this.digTarget.y,this.digTarget.z,"dig"),this.emitBlockEvent("dig",this.digTarget.x,this.digTarget.y,this.digTarget.z),this.resetDig())}resetDig(){var e;this.digStartTime=0,this.digTarget=null,this.digDuration=0,this.isDigging=!1,(e=this._selectionBox)==null||e.setDigProgress(0)}updateDig(){var i;if(!this.isLeftMouseDown||!this.isDigging||!this.digTarget){this.isDigging&&this.resetDig();return}const e=this.castRay();if(!e||e.blockX!==this.digTarget.x||e.blockY!==this.digTarget.y||e.blockZ!==this.digTarget.z){this.resetDig();return}const t=performance.now()/1e3-this.digStartTime,n=Math.min(t/this.digDuration,1);(i=this._selectionBox)==null||i.setDigProgress(n),n>=1&&this.completeDig()}async onPlace(){var t;const e=this.castRay();if(e){if(this._connection){const n=this.inventory[this._selectedSlot];if(n&&(n.itemId==="water_bucket"||n.itemId==="lava_bucket")){const i={x:e.placeX,y:e.placeY,z:e.placeZ};if(i&&await this._connection.invoke("UseBucket",i.x,i.y,i.z,!0))return}if(n&&n.itemId==="milk_bucket"&&await this._connection.invoke("UseBucket",0,0,0,!1))return}if(this._worldManager){const n=this._worldManager.getBlock(e.blockX,e.blockY,e.blockZ),i=this._worldManager.getBlockRegistry().get(n);if(i&&i.interactive){const r=new CustomEvent("interactBlock",{detail:{x:e.blockX,y:e.blockY,z:e.blockZ,blockId:n,blockName:i.name}});document.dispatchEvent(r);return}}(t=this._particleEmitter)==null||t.call(this,e.placeX,e.placeY,e.placeZ,"place"),this.emitBlockEvent("place",e.placeX,e.placeY,e.placeZ)}}emitBlockEvent(e,t,n,i){const r=new CustomEvent("blockAction",{detail:{type:e,x:t,y:n,z:i,blockType:this._selectedBlockType}});document.dispatchEvent(r)}castRay(){var g;const e=new R(0,0,-1);e.applyQuaternion(this._camera.quaternion);const t=new jm(this._camera.position,e,0,8),n=this._camera.parent;if(!n)return null;const i=[];n.traverse(_=>{_ instanceof $e&&_.name!=="sky"&&_.name!=="sun"&&!_.userData.entityId&&i.push(_)});const r=t.intersectObjects(i,!1);if(r.length===0)return null;const o=r[0],a=(g=o.face)==null?void 0:g.normal;if(!a)return null;const l=Math.floor(o.point.x-a.x*.5),c=Math.floor(o.point.y-a.y*.5),h=Math.floor(o.point.z-a.z*.5),u=Math.floor(o.point.x+a.x*.5),d=Math.floor(o.point.y+a.y*.5),m=Math.floor(o.point.z+a.z*.5);return{blockX:l,blockY:c,blockZ:h,placeX:u,placeY:d,placeZ:m}}update(e){var t,n;if(!this._input.isPointerLocked()){(t=this._selectionBox)==null||t.setVisible(!1);return}if(this.isDead){(n=this._selectionBox)==null||n.setVisible(!1);return}this.updateMovement(e),this.updateCamera(),this.updateSelectionBox(),this.updateDig()}isInLiquid(){if(!this._worldManager)return!1;const e=Math.floor(this._position.x),t=Math.floor(this._position.y),n=Math.floor(this._position.z),i=this._worldManager.getBlockRegistry(),r=this._worldManager.getBlock(e,t,n);if(i.isLiquid(r))return!0;const o=this._worldManager.getBlock(e,t+1,n);return!!i.isLiquid(o)}isOnSlipperyBlock(){if(!this._worldManager)return!1;const e=Math.floor(this._position.x),t=Math.floor(this._position.y-.1),n=Math.floor(this._position.z),i=this._worldManager.getBlock(e,t,n),r=this._worldManager.getBlockRegistry().get(i);return(r==null?void 0:r.slippery)===!0}getMoveResistance(){if(!this._worldManager||!this._onGround)return 0;const e=Math.floor(this._position.x),t=Math.floor(this._position.y-.1),n=Math.floor(this._position.z),i=this._worldManager.getBlock(e,t,n),r=this._worldManager.getBlockRegistry().get(i);return(r==null?void 0:r.moveResistance)??0}updateMovement(e){const t=new R(-Math.sin(this._yaw),0,-Math.cos(this._yaw)),n=new R(Math.cos(this._yaw),0,-Math.sin(this._yaw)),i=new R(0,0,0);this._input.isKeyDown("KeyW")&&i.add(t),this._input.isKeyDown("KeyS")&&i.sub(t),this._input.isKeyDown("KeyA")&&i.sub(n),this._input.isKeyDown("KeyD")&&i.add(n);let r=this._isFlying?tg:this._input.isKeyDown("ShiftLeft")?eg:Ir;const o=this.isInLiquid(),a=this.isOnSlipperyBlock(),l=this.getMoveResistance();if(o&&(r*=.4),l>0&&(r*=1-l),this._isFlying)this._velocity.x=i.x*r,this._velocity.z=i.z*r,this._velocity.y*=.9,this._input.isKeyDown("Space")?this._velocity.y=r:this._input.isKeyDown("ShiftLeft")&&(this._velocity.y=-r);else if(this.isClimbing())this._velocity.x=i.x*Ir*.5,this._velocity.z=i.z*Ir*.5,this._velocity.y*=.9,this._input.isKeyDown("Space")?this._velocity.y=2:this._input.isKeyDown("ShiftLeft")?this._velocity.y=-2:this._velocity.y=0,this._onGround=!0;else if(o){const d=i.x*r,m=i.z*r,g=a?.02:.1;this._velocity.x+=(d-this._velocity.x)*g,this._velocity.z+=(m-this._velocity.z)*g,this._velocity.y-=Ja*.2*e,this._velocity.y=Math.max(this._velocity.y,-2),this._input.isKeyDown("Space")&&(this._velocity.y=Math.max(this._velocity.y,2))}else{if(a){const d=i.x*r,m=i.z*r;i.lengthSq()>0?(this._velocity.x+=(d-this._velocity.x)*.05,this._velocity.z+=(m-this._velocity.z)*.05):(this._velocity.x*=.98,this._velocity.z*=.98)}else this._velocity.x=i.x*r,this._velocity.z=i.z*r;this._velocity.y-=Ja*e}this._velocity.y=Math.max(this._velocity.y,-50);const c=this._position.x+this._velocity.x*e,h=this._position.y+this._velocity.y*e,u=this._position.z+this._velocity.z*e;this._worldManager?(this.checkCollision(c,this._position.y,this._position.z)?this._velocity.x=0:this._position.x=c,this.checkCollision(this._position.x,h,this._position.z)?this._velocity.y<0?this._onGround&&Math.abs(this._velocity.y)<8?this.checkCollision(this._position.x,h+As,this._position.z)?(this._onGround=!0,this._velocity.y=0):(this._position.y=h+As,this._velocity.y=0):(this._onGround=!0,this._velocity.y=0):this._velocity.y=0:(this._position.y=h,this._onGround=!1),this.checkCollision(this._position.x,this._position.y,u)?this._onGround&&Math.abs(this._velocity.z)>.1?this.checkCollision(this._position.x,this._position.y+As,u)?this._velocity.z=0:(this._position.z=u,this._position.y+=As):this._velocity.z=0:this._position.z=u):(this._position.x=c,this._position.y=h,this._position.z=u),this._position.add(this._knockbackVelocity.clone().multiplyScalar(e)),this._knockbackVelocity.multiplyScalar(.85),this._position.y<-20&&(this._position.set(0,50,0),this._velocity.set(0,0,0))}checkCollision(e,t,n){const i=ig/2,r=Math.floor(e-i),o=Math.floor(e+i),a=Math.floor(t),l=Math.floor(t+sg-.01),c=Math.floor(n-i),h=Math.floor(n+i);for(let u=r;u<=o;u++)for(let d=a;d<=l;d++)for(let m=c;m<=h;m++)if(this._worldManager&&this._worldManager.isSolid(u,d,m))return!0;return!1}isClimbing(){if(!this._worldManager)return!1;const e=Math.floor(this._position.x),t=Math.floor(this._position.y),n=Math.floor(this._position.z);for(let i=-1;i<=1;i++)for(let r=-1;r<=1;r++){const o=this._worldManager.getBlock(e+i,t,n+r);if(this._worldManager.getBlockRegistry().isClimbable(o))return!0}return!1}updateCamera(){this._camera.position.copy(this._position),this._camera.position.y+=ng;const e=new qi(this._pitch,this._yaw,0,"YXZ");this._camera.quaternion.setFromEuler(e)}updateSelectionBox(){if(!this._selectionBox)return;const e=this.castRay();if(e){const t=this.getBlockNormal(e),n=new R(e.blockX+.5+t.x*.5,e.blockY+.5+t.y*.5,e.blockZ+.5+t.z*.5);this._selectionBox.update(n,t)}else this._selectionBox.update(null,null)}getBlockNormal(e){return new R(e.placeX-e.blockX,e.placeY-e.blockY,e.placeZ-e.blockZ)}getPosition(){return this._position.clone()}getVelocity(){return this._velocity.clone()}getYaw(){return this._yaw*180/Math.PI}getPitch(){return this._pitch*180/Math.PI}getOnGround(){return this._onGround}applyKnockback(e,t,n){this._knockbackVelocity.set(e,t,n)}setPosition(e,t,n){this._position.set(e,t,n),this._velocity.set(0,0,0)}setFlying(e){this._isFlying=e}setHealth(e,t){this.health=e,t!==void 0&&(this.maxHealth=t),this.health<=0&&(this.isDead=!0)}setInventory(e){this.inventory=e;for(let t=0;t<Math.min(8,e.length);t++)if(e[t]&&e[t].blockId){this._selectedBlockType=e[t].blockId;break}}handleDeath(){this.isDead=!0,this._velocity.set(0,0,0)}respawn(){this._position.set(0,50,0),this._velocity.set(0,0,0),this.health=this.maxHealth,this.isDead=!1}getSelectedSlot(){return this._selectedSlot}getSelectedBlockType(){return this._selectedBlockType}setSelectedBlockType(e){this._selectedBlockType=e}setMouseSensitivity(e){this.mouseSensitivity=e}}const Wt=16,Qa=4,og=[[-1,-1],[-1,0],[0,-1],[0,0]];function ag(s,e,t){return s&&e?0:3-(s?1:0)-(e?1:0)-(t?1:0)}class oo{constructor(e,t,n,i){I(this,"mesh",null);I(this,"transparentMesh",null);I(this,"chunkX");I(this,"chunkY");I(this,"chunkZ");I(this,"blocks");I(this,"isVegetation",!1);this.chunkX=e,this.chunkY=t,this.chunkZ=n,this.blocks=i}static fromServerData(e,t,n,i){return new oo(e,t,n,i)}getBlock(e,t,n){const i=(e*Wt*Wt+t*Wt+n)*Qa;return this.blocks[i]}getLight(e,t,n){const i=(e*Wt*Wt+t*Wt+n)*Qa;return this.blocks[i+3]}buildMesh(e,t,n=null,i=()=>15,r=!0){const o=n!==null;this.isVegetation=!1;const a=[],l=[],c=[],h=[],u=[];let d=0;const m=[],g=[],_=[],p=[],f=[];let E=0;const y=[],w=[];let P=!1;const T=[{dir:[0,1,0],corners:[[0,1,0],[1,1,0],[1,1,1],[0,1,1]],normal:[0,1,0]},{dir:[0,-1,0],corners:[[0,0,1],[1,0,1],[1,0,0],[0,0,0]],normal:[0,-1,0]},{dir:[1,0,0],corners:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]],normal:[1,0,0]},{dir:[-1,0,0],corners:[[0,0,1],[0,1,1],[0,1,0],[0,0,0]],normal:[-1,0,0]},{dir:[0,0,1],corners:[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],normal:[0,0,1]},{dir:[0,0,-1],corners:[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],normal:[0,0,-1]}];for(let j=0;j<Wt;j++)for(let M=0;M<Wt;M++)for(let b=0;b<Wt;b++){const G=this.getBlock(j,M,b);if(G===0)continue;const X=e.get(G);if(!X)continue;const te=X.transparent===!0,L=X.liquid===!0,O=e.isLightSource(G),H=X.name||"",K=H.includes("leaves")||H.includes("pine_needles")||H==="default:sugar_cane";K&&(P=!0,this.isVegetation=!0);const W=this.chunkX*Wt+j,q=this.chunkY*Wt+M,$=this.chunkZ*Wt+b,ne=te?m:a,ie=te?g:l,z=te?_:c,Z=te?p:h,ce=te?f:u;let pe=null,_e=!1;o&&(pe=n.getUV(G),_e=n.hasTexture(G));const Ie=pe!==null?[[pe[0],pe[1]],[pe[2],pe[1]],[pe[2],pe[3]],[pe[0],pe[3]]]:[];for(const fe of T){const be=W+fe.dir[0],Xe=q+fe.dir[1],N=$+fe.dir[2],gt=t(be,Xe,N),xe=e.get(gt);if(te){if(xe&&!xe.transparent&&!xe.liquid||gt===G&&!L)continue}else if(xe&&xe.solid&&!xe.transparent)continue;const Ae=new Fe(X.color);let ge=Ae;fe.dir[1]===1&&(ge=Ae.clone().multiplyScalar(1.1)),fe.dir[1]===-1&&(ge=Ae.clone().multiplyScalar(.7));for(let Ce=0;Ce<4;Ce++){const S=fe.corners[Ce];let v=1;if(!te){const me=W+S[0]-fe.dir[0]*.5,se=q+S[1]-fe.dir[1]*.5,he=$+S[2]-fe.dir[2]*.5,Se=t(W+S[0]*.5+fe.dir[0]*.5-fe.dir[0],q+S[1]*.5+fe.dir[1]*.5-fe.dir[1],$+S[2]*.5+fe.dir[2]*.5-fe.dir[2]),De=t(W+fe.dir[0],q+fe.dir[1],$+fe.dir[2]),Y=e.get(Se),ze=e.get(De),we=e.get(t(Math.round(me),Math.round(se),Math.round(he))),Me=(Y==null?void 0:Y.solid)===!0&&(Y==null?void 0:Y.transparent)!==!0,ve=(ze==null?void 0:ze.solid)===!0&&(ze==null?void 0:ze.transparent)!==!0,ue=(we==null?void 0:we.solid)===!0&&(we==null?void 0:we.transparent)!==!0;v=r?ag(Me,ve,ue)/3:1}let U;if(O)U=1;else{const me=W+S[0],se=q+S[1],he=$+S[2],Se=fe.dir[0],De=fe.dir[1],Y=fe.dir[2];let ze=0;for(const[we,Me]of og){let ve,ue,Pe;Se!==0?(ve=Se>0?me:me-1,ue=se+we,Pe=he+Me):De!==0?(ve=me+we,ue=De>0?se:se-1,Pe=he+Me):(ve=me+we,ue=se+Me,Pe=Y>0?he:he-1),ze+=i(ve,ue,Pe)}U=Math.max(ze/4/15,.1)}const Q=_e?v*U:ge.r*v*U,J=_e?v*U:ge.g*v*U,ee=_e?v*U:ge.b*v*U;if(ne.push(W+S[0],q+S[1],$+S[2]),ie.push(fe.normal[0],fe.normal[1],fe.normal[2]),z.push(Q,J,ee),o&&pe!==null&&Z.push(Ie[Ce][0],Ie[Ce][1]),K&&fe.dir[1]===1){const me=te?w:y,se=te?E:d;me.push(se+Ce)}}const qe=te?E:d;ce.push(qe,qe+1,qe+2,qe,qe+2,qe+3),te?E+=4:d+=4}}const A=o?n.texture:null;this.mesh=this.buildGeometry(a,l,c,h,u,d,!1,A),this.transparentMesh=this.buildGeometry(m,g,_,p,f,E,!0,A),P&&(this.isVegetation=!0,this.mesh&&y.length>0&&(this.mesh.userData.isVegetation=!0,this.mesh.userData.topVertexIndices=y,this.mesh.userData.topBasePositions=new Float32Array(a)),this.transparentMesh&&w.length>0&&(this.transparentMesh.userData.isVegetation=!0,this.transparentMesh.userData.topVertexIndices=w,this.transparentMesh.userData.topBasePositions=new Float32Array(m)))}static updateAnimations(e,t){}animateVegetation(e){if(!this.isVegetation)return;const t=[];this.mesh&&t.push(this.mesh),this.transparentMesh&&t.push(this.transparentMesh);const n=.05;for(const i of t){if(!i.userData.isVegetation)continue;const r=i.geometry.getAttribute("position");if(!r)continue;const o=i.userData.topVertexIndices,a=i.userData.topBasePositions;if(!(!o||!a)){for(let l=0;l<o.length;l++){const c=o[l];if(c*3+1>=r.array.length||c*3+1>=a.length)continue;const h=a[c*3+1],u=a[c*3];r.array[c*3+1]=h+Math.sin(e*1.5+u*.5)*n}r.needsUpdate=!0}}}buildGeometry(e,t,n,i,r,o,a,l){if(o===0)return null;const c=new Dt;c.setAttribute("position",new ct(e,3)),c.setAttribute("normal",new ct(t,3)),c.setAttribute("color",new ct(n,3)),i.length>0&&c.setAttribute("uv",new ct(i,2)),c.setIndex(r);const h=new It({map:l,vertexColors:!0,transparent:a,opacity:a?.6:1,side:a?Jt:rn,depthWrite:!a});return new $e(c,h)}}class lg{constructor(){I(this,"blocks",new Map);I(this,"byName",new Map);this.loadDefaults()}loadDefaults(){const e=[{id:0,name:"air",solid:!1,transparent:!0,color:"#000000"},{id:1,name:"stone",solid:!0,transparent:!1,color:"#808080",hardness:1.5,drops:"cobblestone",textureName:"default_stone"},{id:2,name:"dirt",solid:!0,transparent:!1,color:"#8B4513",hardness:.5,textureName:"default_dirt"},{id:3,name:"grass",solid:!0,transparent:!1,color:"#228B22",hardness:.6,textureName:"default_grass"},{id:4,name:"water",solid:!1,transparent:!0,color:"#4169E1",liquid:!0,textureName:"default_water"},{id:5,name:"sand",solid:!0,transparent:!1,color:"#F4A460",hardness:.5,textureName:"default_sand"},{id:6,name:"wood",solid:!0,transparent:!1,color:"#DEB887",hardness:2,textureName:"default_tree"},{id:7,name:"leaves",solid:!0,transparent:!0,color:"#32CD32",hardness:.2,textureName:"default_leaves"},{id:8,name:"glass",solid:!0,transparent:!0,color:"#ADD8E6",hardness:.3,textureName:"default_glass"},{id:9,name:"brick",solid:!0,transparent:!1,color:"#B22222",hardness:2,textureName:"default_brick"},{id:10,name:"ore_iron",solid:!0,transparent:!1,color:"#C4A882",hardness:3,drops:"iron_ingot",textureName:"default_iron_ore"},{id:11,name:"coal",solid:!0,transparent:!1,color:"#2F4F4F",hardness:3,textureName:"default_coal_ore"},{id:12,name:"bedrock",solid:!0,transparent:!1,color:"#1C1C1C",breakable:!1,textureName:"default_bedrock"},{id:13,name:"snow",solid:!0,transparent:!1,color:"#FFFAFA",hardness:.2,textureName:"default_snow"},{id:14,name:"ice",solid:!0,transparent:!0,color:"#B0E0E6",hardness:.5,textureName:"default_ice"},{id:15,name:"lava",solid:!1,transparent:!0,color:"#FF4500",liquid:!0,damage:4,textureName:"default_lava"},{id:16,name:"torch",solid:!1,transparent:!0,color:"#FFD700",light:14,textureName:"default_torch"},{id:17,name:"ladder",solid:!1,transparent:!0,color:"#8B4513",climbable:!0,textureName:"default_ladder"},{id:18,name:"fence",solid:!0,transparent:!0,color:"#8B4513",hardness:2,textureName:"default_fence"},{id:19,name:"door_wood",solid:!0,transparent:!0,color:"#8B6914",interactive:!0,hardness:3,textureName:"default_door_wood"},{id:20,name:"chest",solid:!0,transparent:!1,color:"#8B4513",interactive:!0,hardness:2.5,textureName:"default_chest"},{id:21,name:"crafting_table",solid:!0,transparent:!1,color:"#D2691E",interactive:!0,hardness:2.5,textureName:"default_crafting_table_front"},{id:22,name:"furnace",solid:!0,transparent:!1,color:"#696969",interactive:!0,hardness:3.5,textureName:"default_furnace"},{id:23,name:"ore_gold",solid:!0,transparent:!1,color:"#FFD700",hardness:3,drops:"gold_ingot",textureName:"default_gold_ore"},{id:24,name:"ore_diamond",solid:!0,transparent:!1,color:"#00FFFF",hardness:3,drops:"diamond",textureName:"default_diamond_ore"},{id:25,name:"planks",solid:!0,transparent:!1,color:"#BC8F5A",hardness:2,textureName:"default_planks"},{id:26,name:"cobblestone",solid:!0,transparent:!1,color:"#6B6B6B",hardness:2,textureName:"default_cobble"},{id:27,name:"stone_brick",solid:!0,transparent:!1,color:"#777777",hardness:1.5,textureName:"default_stone_brick"},{id:28,name:"wool_white",solid:!0,transparent:!1,color:"#EEEEEE",hardness:.8,textureName:"default_wool_white"},{id:29,name:"wool_red",solid:!0,transparent:!1,color:"#CC2222",hardness:.8,textureName:"default_wool_red"},{id:30,name:"wool_blue",solid:!0,transparent:!1,color:"#2222CC",hardness:.8,textureName:"default_wool_blue"},{id:31,name:"wool_green",solid:!0,transparent:!1,color:"#22CC22",hardness:.8,textureName:"default_wool_green"},{id:32,name:"bookshelf",solid:!0,transparent:!1,color:"#C4A050",hardness:1.5,textureName:"default_bookshelf"},{id:33,name:"gravel",solid:!0,transparent:!1,color:"#888078",hardness:.6,falling:!0,groups:{crumbly:3},soundGroup:"gravel",textureName:"default_gravel"},{id:34,name:"clay",solid:!0,transparent:!1,color:"#9BA5B0",hardness:.6,groups:{crumbly:3},soundGroup:"dirt",textureName:"default_clay"},{id:35,name:"sandstone",solid:!0,transparent:!1,color:"#E8D5A3",hardness:.8,groups:{cracky:3},soundGroup:"sand",textureName:"default_sandstone"},{id:36,name:"obsidian",solid:!0,transparent:!1,color:"#1A0A2E",hardness:50,groups:{cracky:5},soundGroup:"stone",textureName:"default_obsidian"},{id:37,name:"cactus",solid:!0,transparent:!1,color:"#0A5C0A",hardness:.4,damage:1,groups:{choppy:2},soundGroup:"wood",textureName:"default_cactus"},{id:38,name:"sugar_cane",solid:!1,transparent:!0,color:"#90EE90",hardness:.2,soundGroup:"grass",textureName:"default_sugar_cane"},{id:39,name:"pumpkin",solid:!0,transparent:!1,color:"#FF8C00",hardness:1,groups:{choppy:2},soundGroup:"wood",textureName:"default_pumpkin"},{id:40,name:"melon",solid:!0,transparent:!1,color:"#5C8A1E",hardness:1,drops:"melon_slice",groups:{choppy:2},soundGroup:"wood",textureName:"default_melon"},{id:41,name:"mycelium",solid:!0,transparent:!1,color:"#6B5A8A",hardness:.6,drops:"dirt",groups:{crumbly:3},soundGroup:"dirt",textureName:"default_mycelium_top"},{id:42,name:"farmland",solid:!0,transparent:!1,color:"#6B4E2A",hardness:.6,groups:{crumbly:3},soundGroup:"dirt",textureName:"default_farmland"},{id:43,name:"water_flowing",solid:!1,transparent:!0,color:"#4169E1",liquid:!0,drowning:!0,soundGroup:"water",textureName:"default_water_flowing"},{id:44,name:"lava_flowing",solid:!1,transparent:!0,color:"#FF4500",liquid:!0,damage:4,postEffectColor:"#FF4400",soundGroup:"lava",textureName:"default_lava_flowing"},{id:45,name:"coal_ore",solid:!0,transparent:!1,color:"#3A3A3A",hardness:3,drops:"coal",groups:{cracky:3},soundGroup:"stone",textureName:"default_coal_ore"},{id:46,name:"mossy_cobblestone",solid:!0,transparent:!1,color:"#5E6E5E",hardness:2,groups:{cracky:3},soundGroup:"stone",textureName:"default_mossycobble"},{id:47,name:"iron_block",solid:!0,transparent:!1,color:"#D8D8D8",hardness:5,groups:{cracky:2},soundGroup:"metal",textureName:"default_iron_block"},{id:48,name:"gold_block",solid:!0,transparent:!1,color:"#FFD700",hardness:3,groups:{cracky:2},soundGroup:"metal",textureName:"default_gold_block"},{id:49,name:"diamond_block",solid:!0,transparent:!1,color:"#4AEDD9",hardness:5,groups:{cracky:2},soundGroup:"metal",textureName:"default_diamond_block"},{id:50,name:"wool_orange",solid:!0,transparent:!1,color:"#E8821C",hardness:.8,groups:{snappy:2},soundGroup:"cloth",textureName:"default_wool_orange"},{id:51,name:"wool_yellow",solid:!0,transparent:!1,color:"#F2E63C",hardness:.8,groups:{snappy:2},soundGroup:"cloth",textureName:"default_wool_yellow"},{id:52,name:"wool_cyan",solid:!0,transparent:!1,color:"#2CC4AD",hardness:.8,groups:{snappy:2},soundGroup:"cloth",textureName:"default_wool_cyan"},{id:53,name:"wool_purple",solid:!0,transparent:!1,color:"#7B2FBE",hardness:.8,groups:{snappy:2},soundGroup:"cloth",textureName:"default_wool_purple"},{id:54,name:"wool_black",solid:!0,transparent:!1,color:"#1D1D1D",hardness:.8,groups:{snappy:2},soundGroup:"cloth",textureName:"default_wool_black"},{id:55,name:"wool_brown",solid:!0,transparent:!1,color:"#724528",hardness:.8,groups:{snappy:2},soundGroup:"cloth",textureName:"default_wool_brown"},{id:56,name:"wool_pink",solid:!0,transparent:!1,color:"#F2A5C4",hardness:.8,groups:{snappy:2},soundGroup:"cloth",textureName:"default_wool_pink"},{id:57,name:"wool_lime",solid:!0,transparent:!1,color:"#52B248",hardness:.8,groups:{snappy:2},soundGroup:"cloth",textureName:"default_wool_lime"},{id:58,name:"wool_light_blue",solid:!0,transparent:!1,color:"#6689D3",hardness:.8,groups:{snappy:2},soundGroup:"cloth",textureName:"default_wool_light_blue"},{id:59,name:"wool_magenta",solid:!0,transparent:!1,color:"#B24CBF",hardness:.8,groups:{snappy:2},soundGroup:"cloth",textureName:"default_wool_magenta"},{id:60,name:"wool_gray",solid:!0,transparent:!1,color:"#6B6B6B",hardness:.8,groups:{snappy:2},soundGroup:"cloth",textureName:"default_wool_gray"},{id:61,name:"wool_light_gray",solid:!0,transparent:!1,color:"#A0A0A0",hardness:.8,groups:{snappy:2},soundGroup:"cloth",textureName:"default_wool_light_gray"},{id:62,name:"glowing_obsidian",solid:!0,transparent:!1,color:"#3A1A5E",hardness:50,light:14,groups:{cracky:5},soundGroup:"stone",textureName:"default_burning_obsidian"},{id:63,name:"apple_block",solid:!0,transparent:!1,color:"#CC2222",hardness:.8,drops:"apple",groups:{snappy:3},soundGroup:"grass",textureName:"default_apple"},{id:64,name:"wheat_crop",solid:!1,transparent:!0,color:"#9ACD32",hardness:0,drops:"wheat",groups:{snappy:3,dig_immediate:3},soundGroup:"grass",textureName:"default_wheat"},{id:65,name:"carrot_crop",solid:!1,transparent:!0,color:"#FF8C00",hardness:0,drops:"carrot",groups:{snappy:3,dig_immediate:3},soundGroup:"grass"},{id:66,name:"potato_crop",solid:!1,transparent:!0,color:"#DAA520",hardness:0,drops:"potato",groups:{snappy:3,dig_immediate:3},soundGroup:"grass"},{id:67,name:"hay_bale",solid:!0,transparent:!1,color:"#DAA520",hardness:.5,groups:{snappy:3},soundGroup:"grass",textureName:"default_hay"},{id:68,name:"desert_stone",solid:!0,transparent:!1,color:"#A0926B",hardness:1.5,groups:{cracky:3},soundGroup:"stone",textureName:"default_desert_stone"},{id:69,name:"dirt_with_snow",solid:!0,transparent:!1,color:"#8B8B8B",hardness:.6,drops:"dirt",groups:{crumbly:3},soundGroup:"dirt"},{id:70,name:"junglegrass",solid:!1,transparent:!0,color:"#00AA00",hardness:0,groups:{dig_immediate:3},soundGroup:"grass",textureName:"default_junglegrass"},{id:71,name:"jungle_wood",solid:!0,transparent:!1,color:"#6B5030",hardness:2,groups:{choppy:3},soundGroup:"wood",textureName:"default_jungletree"},{id:72,name:"jungle_leaves",solid:!0,transparent:!0,color:"#1A8C1A",hardness:.2,groups:{snappy:3},soundGroup:"leaves",textureName:"default_jungleleaves"},{id:73,name:"pine_wood",solid:!0,transparent:!1,color:"#5C3D1E",hardness:2,groups:{choppy:3},soundGroup:"wood",textureName:"default_pine_tree"},{id:74,name:"pine_needles",solid:!0,transparent:!0,color:"#1A5C1A",hardness:.2,groups:{snappy:3},soundGroup:"leaves",textureName:"default_pine_needles"},{id:75,name:"river_water",solid:!1,transparent:!0,color:"#3060C0",liquid:!0,drowning:!0,soundGroup:"water",textureName:"default_river_water"},{id:76,name:"cobblestone_slab",solid:!0,transparent:!1,color:"#6B6B6B",hardness:2,groups:{cracky:3},soundGroup:"stone",textureName:"default_cobble"},{id:77,name:"wood_slab",solid:!0,transparent:!1,color:"#BC8F5A",hardness:2,groups:{choppy:2},soundGroup:"wood",textureName:"default_wood"},{id:78,name:"stone_slab",solid:!0,transparent:!1,color:"#808080",hardness:2,groups:{cracky:3},soundGroup:"stone",textureName:"default_stone"},{id:79,name:"brick_block",solid:!0,transparent:!1,color:"#B22222",hardness:2,groups:{cracky:2},soundGroup:"stone",textureName:"default_brick"},{id:80,name:"clay_block",solid:!0,transparent:!1,color:"#9BA5B0",hardness:.6,groups:{crumbly:3},soundGroup:"dirt",textureName:"default_clay"},{id:81,name:"snow_layer",solid:!0,transparent:!0,color:"#FFFAFA",hardness:.2,groups:{crumbly:3,oddly_breakable_by_hand:3},soundGroup:"snow",textureName:"default_snow"},{id:82,name:"mossy_stone",solid:!0,transparent:!1,color:"#5E6E5E",hardness:1.5,groups:{cracky:3},soundGroup:"stone",textureName:"default_mossycobble"},{id:83,name:"cracked_stone",solid:!0,transparent:!1,color:"#777070",hardness:1.5,groups:{cracky:3},soundGroup:"stone"},{id:84,name:"chiseled_stone",solid:!0,transparent:!1,color:"#999999",hardness:1.5,groups:{cracky:3},soundGroup:"stone"},{id:85,name:"dark_prismarine",solid:!0,transparent:!1,color:"#0E4A5C",hardness:1.5,groups:{cracky:2},soundGroup:"stone"},{id:86,name:"prismarine",solid:!0,transparent:!1,color:"#4E8CA8",hardness:1.5,groups:{cracky:2},soundGroup:"stone"},{id:87,name:"prismarine_bricks",solid:!0,transparent:!1,color:"#3B7A94",hardness:1.5,groups:{cracky:2},soundGroup:"stone"},{id:88,name:"sea_lantern",solid:!0,transparent:!0,color:"#BCC9C2",hardness:.3,light:15,groups:{cracky:3},soundGroup:"glass"},{id:89,name:"glowstone",solid:!0,transparent:!0,color:"#FFC040",hardness:.3,light:15,groups:{cracky:2},soundGroup:"glass"},{id:90,name:"redstone_lamp",solid:!0,transparent:!1,color:"#7A2020",hardness:.3,groups:{cracky:3,oddly_breakable_by_hand:3},soundGroup:"stone"},{id:91,name:"redstone_lamp_on",solid:!0,transparent:!0,color:"#FF6040",hardness:.3,light:12,groups:{cracky:3,oddly_breakable_by_hand:3},soundGroup:"stone"},{id:92,name:"netherrack",solid:!0,transparent:!1,color:"#6B2A2A",hardness:.4,groups:{cracky:2},soundGroup:"stone"},{id:93,name:"soul_sand",solid:!0,transparent:!1,color:"#5C4827",hardness:.5,moveResistance:.5,groups:{crumbly:3},soundGroup:"sand"},{id:94,name:"nether_brick",solid:!0,transparent:!1,color:"#2A1A1A",hardness:2,groups:{cracky:2},soundGroup:"stone"},{id:95,name:"end_stone",solid:!0,transparent:!1,color:"#E8E0B8",hardness:3,groups:{cracky:3},soundGroup:"stone"},{id:96,name:"purpur_block",solid:!0,transparent:!1,color:"#A86FCF",hardness:1.5,groups:{cracky:2},soundGroup:"stone"},{id:97,name:"purpur_pillar",solid:!0,transparent:!1,color:"#8B5CBF",hardness:1.5,groups:{cracky:2},soundGroup:"stone"},{id:98,name:"mycelium",solid:!0,transparent:!1,color:"#6B5A8A",hardness:.6,drops:"dirt",groups:{crumbly:3},soundGroup:"dirt",textureName:"default_mycelium_top"},{id:99,name:"podzol",solid:!0,transparent:!1,color:"#5C4827",hardness:.5,drops:"dirt",groups:{crumbly:3},soundGroup:"dirt"},{id:100,name:"coarse_dirt",solid:!0,transparent:!1,color:"#6B5C48",hardness:.5,groups:{crumbly:3},soundGroup:"dirt"}];for(const t of e)this.blocks.set(t.id,t),this.byName.set(t.name,t)}loadFromServer(e){const t=JSON.parse(e);this.blocks.clear(),this.byName.clear();const n=t.blocks||t;for(const i of Object.keys(n)){const r=n[i],o=parseInt(i),a={id:o,name:r.name,solid:r.solid,transparent:r.transparent,color:r.color};r.liquid!==void 0&&(a.liquid=r.liquid),r.light!==void 0&&(a.light=r.light),r.hardness!==void 0&&(a.hardness=r.hardness),r.drops!==void 0&&(a.drops=r.drops),r.climbable!==void 0&&(a.climbable=r.climbable),r.damage!==void 0&&(a.damage=r.damage),r.breakable!==void 0&&(a.breakable=r.breakable),r.interactive!==void 0&&(a.interactive=r.interactive),r.drowning!==void 0&&(a.drowning=r.drowning),r.falling!==void 0&&(a.falling=r.falling),r.bouncy!==void 0&&(a.bouncy=r.bouncy),r.slippery!==void 0&&(a.slippery=r.slippery),r.moveResistance!==void 0&&(a.moveResistance=r.moveResistance),r.postEffectColor!==void 0&&(a.postEffectColor=r.postEffectColor),r.groups!==void 0&&(a.groups=r.groups),r.soundGroup!==void 0&&(a.soundGroup=r.soundGroup),r.textureName!==void 0&&(a.textureName=r.textureName),this.blocks.set(o,a),this.byName.set(a.name,a)}}get(e){return this.blocks.get(e)}getByBlockId(e){return this.blocks.get(e)}getByName(e){return this.byName.get(e)}isSolid(e){var t;return((t=this.blocks.get(e))==null?void 0:t.solid)??!1}isTransparent(e){var t;return((t=this.blocks.get(e))==null?void 0:t.transparent)??!0}isLiquid(e){var t;return((t=this.blocks.get(e))==null?void 0:t.liquid)??!1}isClimbable(e){var t;return((t=this.blocks.get(e))==null?void 0:t.climbable)??!1}isFalling(e){var t;return((t=this.blocks.get(e))==null?void 0:t.falling)??!1}isInteractive(e){var t;return((t=this.blocks.get(e))==null?void 0:t.interactive)??!1}isLightSource(e){var t;return(((t=this.blocks.get(e))==null?void 0:t.light)??0)>0}getLightLevel(e){var t;return((t=this.blocks.get(e))==null?void 0:t.light)??0}lightPropagates(e){const t=this.blocks.get(e);return t?t.transparent===!0||t.liquid===!0:!0}getGroups(e){var t;return((t=this.blocks.get(e))==null?void 0:t.groups)??{}}getAll(){return this.blocks}}const kn=16,Mn=16,el=["default_stone","default_dirt","default_grass","default_grass_top","default_grass_side","default_water","default_sand","default_tree","default_tree_top","default_leaves","default_snow","default_snow_side","default_ice","default_lava","default_lava_flowing","default_water_flowing","default_cobble","default_gravel","default_mossycobble","default_desert_sand","default_desert_stone","default_junglegrass","default_jungletree","default_jungletree_top","default_jungleleaves","default_pine_tree","default_pine_tree_top","default_pine_needles","default_river_water","default_river_water_flowing","default_apple","default_planks","default_brick","default_bookshelf","default_glass","default_obsidian","default_clay","default_sandstone","default_cactus","default_pumpkin","default_pumpkin_top","default_melon","default_melon_top","default_sugar_cane","default_fence","default_ladder","default_door_wood","default_chest","default_chest_top","default_crafting_table_top","default_furnace","default_furnace_front","default_torch","default_farmland","default_hay","default_wheat","default_iron_ore","default_coal_ore","default_gold_ore","default_diamond_ore","default_iron_block","default_gold_block","default_diamond_block","default_stone_brick","default_bedrock","default_burning_obsidian","default_mycelium_top","basenodes_snow_sheet","default_wool_white","default_wool_red","default_wool_blue","default_wool_green","default_wool_orange","default_wool_yellow","default_wool_cyan","default_wool_purple","default_wool_black","default_wool_brown","default_wool_pink","default_wool_lime","default_wool_light_blue","default_wool_magenta","default_wool_gray","default_wool_light_gray"],tl=20;class cg{constructor(e,t,n,i,r,o,a,l){I(this,"mesh");I(this,"fromX");I(this,"fromY");I(this,"fromZ");I(this,"toX");I(this,"toY");I(this,"toZ");I(this,"blockType");I(this,"elapsedTime",0);I(this,"startY");I(this,"velocityY",0);I(this,"completed",!1);this.fromX=e,this.fromY=t,this.fromZ=n,this.toX=i,this.toY=r,this.toZ=o,this.blockType=a,this.startY=t;const c=new ot(1,1,1),h=new It({color:l});this.mesh=new $e(c,h),this.mesh.position.set(e+.5,t+.5,n+.5)}update(e){if(this.completed)return;this.elapsedTime+=e,this.velocityY-=tl*e;const t=this.startY+.5+this.velocityY*this.elapsedTime+.5*tl*this.elapsedTime*this.elapsedTime;t<=this.toY+.5?(this.mesh.position.y=this.toY+.5,this.completed=!0):this.mesh.position.y=t}}class hg{constructor(e){I(this,"chunks",new Map);I(this,"renderer");I(this,"blockRegistry");I(this,"playerMeshes",new Map);I(this,"entityMeshes",new Map);I(this,"pendingChunks",new Set);I(this,"connection",null);I(this,"textureAtlas",null);I(this,"fallingBlocks",[]);I(this,"renderDistance",4);I(this,"aoEnabled",!0);I(this,"playerAnimTime",0);this.renderer=e,this.blockRegistry=new lg,this.loadTextureAtlas()}setConnection(e){this.connection=e}getBlockRegistry(){return this.blockRegistry}setRenderDistance(e){this.renderDistance=e}setAoEnabled(e){this.aoEnabled=e;for(const[t]of this.chunks)this.rebuildChunkMesh(t)}loadTextureAtlas(){const e=new Map,t=el.map(n=>new Promise(i=>{const r=new Image;r.onload=()=>{e.set(n,r),i()},r.onerror=()=>i(),r.src=`/textures/blocks/${n}.png`}));Promise.all(t).then(()=>{if(e.size===0)return;const n=e.size+1,i=Math.ceil(n/kn),r=document.createElement("canvas");r.width=kn*Mn,r.height=i*Mn;const o=r.getContext("2d");o.fillStyle="#ffffff",o.fillRect(0,0,Mn,Mn);const a=new Map;let l=1;for(const u of el){const d=e.get(u);if(!d)continue;const m=l%kn,g=Math.floor(l/kn);o.drawImage(d,m*Mn,g*Mn,Mn,Mn),a.set(u,{col:m,row:g}),l++}const c=new Xr(r);c.magFilter=St,c.minFilter=St;const h=[0,1-1/i,1/kn,1];this.textureAtlas={texture:c,getUV:u=>{const d=this.blockRegistry.get(u),m=d==null?void 0:d.textureName;if(m){const g=a.get(m);if(g)return[g.col/kn,1-(g.row+1)/i,(g.col+1)/kn,1-g.row/i]}return h},hasTexture:u=>{const d=this.blockRegistry.get(u),m=d==null?void 0:d.textureName;return m!=null&&a.has(m)}};for(const[u]of this.chunks)this.rebuildChunkMesh(u)})}loadChunk(e,t,n,i){const r=`${e},${t},${n}`,o=this.chunks.get(r);o&&o.mesh&&this.renderer.removeFromScene(o.mesh),o&&o.transparentMesh&&this.renderer.removeFromScene(o.transparentMesh);const a=oo.fromServerData(e,t,n,i);a.buildMesh(this.blockRegistry,(l,c,h)=>this.getBlock(l,c,h),this.textureAtlas,(l,c,h)=>this.getBlockLight(l,c,h),this.aoEnabled),a.mesh&&this.renderer.addToScene(a.mesh),a.transparentMesh&&this.renderer.addToScene(a.transparentMesh),this.chunks.set(r,a),this.pendingChunks.delete(r),this.rebuildNeighborChunks(e,t,n)}rebuildNeighborChunks(e,t,n){const i=[[e-1,t,n],[e+1,t,n],[e,t-1,n],[e,t+1,n],[e,t,n-1],[e,t,n+1]];for(const[r,o,a]of i){const l=`${r},${o},${a}`;this.chunks.has(l)?this.rebuildChunkMesh(l):this.connection&&!this.pendingChunks.has(l)&&(this.pendingChunks.add(l),this.connection.invoke("RequestChunk",r,o,a))}}rebuildChunkMesh(e){const t=this.chunks.get(e);t&&(t.mesh&&this.renderer.removeFromScene(t.mesh),t.transparentMesh&&this.renderer.removeFromScene(t.transparentMesh),t.buildMesh(this.blockRegistry,(n,i,r)=>this.getBlock(n,i,r),this.textureAtlas,(n,i,r)=>this.getBlockLight(n,i,r),this.aoEnabled),t.mesh&&this.renderer.addToScene(t.mesh),t.transparentMesh&&this.renderer.addToScene(t.transparentMesh))}updateBlock(e,t,n,i){const r=Math.floor(e/16),o=Math.floor(t/16),a=Math.floor(n/16),l=`${r},${o},${a}`,c=this.chunks.get(l);if(c){const h=(e%16+16)%16,u=(t%16+16)%16,d=(n%16+16)%16,m=(h*16*16+u*16+d)*4;c.blocks[m]=i>>8&255,c.blocks[m+1]=i&255,this.rebuildChunkMesh(l),h===0&&this.rebuildChunkMesh(`${r-1},${o},${a}`),h===15&&this.rebuildChunkMesh(`${r+1},${o},${a}`),u===0&&this.rebuildChunkMesh(`${r},${o-1},${a}`),u===15&&this.rebuildChunkMesh(`${r},${o+1},${a}`),d===0&&this.rebuildChunkMesh(`${r},${o},${a-1}`),d===15&&this.rebuildChunkMesh(`${r},${o},${a+1}`)}}requestChunksAroundPlayer(e){const t=Math.floor(e.x/16),n=Math.floor(e.y/16),i=Math.floor(e.z/16),r=this.renderDistance,o=[];for(let a=-r;a<=r;a++)for(let l=-1;l<=2;l++)for(let c=-r;c<=r;c++){if(a*a+c*c>r*r)continue;const h=`${t+a},${n+l},${i+c}`;!this.chunks.has(h)&&!this.pendingChunks.has(h)&&(this.pendingChunks.add(h),o.push(h),this.connection&&this.connection.invoke("RequestChunk",t+a,n+l,i+c))}return o}hasChunk(e){return this.chunks.has(e)}getChunk(e){return this.chunks.get(e)}addPlayer(e){if(this.playerMeshes.has(e))return;const t=new Tn,n=new ot(.6,.75,.3),i=new It({color:2245802}),r=new $e(n,i);r.position.y=.375,t.add(r);const o=new ot(.5,.5,.5),a=new It({color:16764057}),l=new $e(o,a);l.position.y=.875,t.add(l);const c=new ot(.25,.75,.25),h=new It({color:1122918}),u=new $e(c,h);u.position.set(-.15,-.375,0),t.add(u);const d=new $e(c,h);d.position.set(.15,-.375,0),t.add(d);const m=new ot(.25,.75,.25),g=new It({color:16764057}),_=new $e(m,g);_.position.set(-.425,.375,0),t.add(_);const p=new $e(m,g);p.position.set(.425,.375,0),t.add(p);const f=document.createElement("canvas");f.width=256,f.height=64;const E=f.getContext("2d");E.fillStyle="white",E.font="24px Arial",E.textAlign="center",E.fillText(e,128,40);const y=new Xr(f),w=new Ol({map:y,transparent:!0}),P=new Gm(w);P.position.y=2.2,P.scale.set(3,.75,1),t.add(P),t.position.y=.9,this.renderer.addToScene(t),this.playerMeshes.set(e,{mesh:t,label:P,leftLeg:u,rightLeg:d,leftArm:_,rightArm:p})}removePlayer(e){const t=this.playerMeshes.get(e);t&&(this.renderer.removeFromScene(t.mesh),this.playerMeshes.delete(e))}updatePlayerPosition(e,t,n,i,r,o){this.playerMeshes.has(e)||this.addPlayer(e);const a=this.playerMeshes.get(e);a.mesh.position.set(t,n,i),a.mesh.rotation.y=r*Math.PI/180}animatePlayer(e,t,n){const i=this.playerMeshes.get(e);if(i)if(t){this.playerAnimTime+=n;const o=Math.sin(this.playerAnimTime*8)*.5236,a=-.375+.375,l=.375+.375;i.leftLeg.position.set(-.15,a,0),i.leftLeg.rotation.x=o,i.rightLeg.position.set(.15,a,0),i.rightLeg.rotation.x=-o,i.leftArm.position.set(-.425,l,0),i.leftArm.rotation.x=-o,i.rightArm.position.set(.425,l,0),i.rightArm.rotation.x=o}else i.leftLeg.rotation.x=0,i.rightLeg.rotation.x=0,i.leftArm.rotation.x=0,i.rightArm.rotation.x=0,i.leftLeg.position.set(-.15,-.375,0),i.rightLeg.position.set(.15,-.375,0),i.leftArm.position.set(-.425,.375,0),i.rightArm.position.set(.425,.375,0)}spawnEntity(e,t,n,i,r){let o,a,l=0;if(t==="Item")o=new ot(.3,.3,.3),a=16755200;else{const d={Zombie:{color:4491332,width:.6,height:1.8,yOffset:.9},Skeleton:{color:13421772,width:.5,height:1.8,yOffset:.9},Spider:{color:4469572,width:1,height:.5,yOffset:.25},Cow:{color:8939076,width:.8,height:1.2,yOffset:.6},Pig:{color:16755370,width:.7,height:.8,yOffset:.4},Chicken:{color:16777215,width:.4,height:.6,yOffset:.3}}[t]||{color:16729156,width:.8,height:1.6,yOffset:.8};o=new ot(d.width,d.height,d.width),a=d.color,l=d.yOffset}const c=new It({color:a}),h=new $e(o,c);h.position.set(n,i+l,r),h.userData.entityId=e,this.renderer.addToScene(h),this.entityMeshes.set(e,h)}removeEntity(e){const t=this.entityMeshes.get(e);t&&(this.renderer.removeFromScene(t),this.entityMeshes.delete(e))}updateEntityPosition(e,t,n,i){const r=this.entityMeshes.get(e);r&&r.position.set(t,n,i)}getBlock(e,t,n){const i=Math.floor(e/16),r=Math.floor(t/16),o=Math.floor(n/16),a=`${i},${r},${o}`,l=this.chunks.get(a);if(!l)return 0;const c=(e%16+16)%16,h=(t%16+16)%16,u=(n%16+16)%16;return l.getBlock(c,h,u)}getBlockLight(e,t,n){const i=Math.floor(e/16),r=Math.floor(t/16),o=Math.floor(n/16),a=`${i},${r},${o}`,l=this.chunks.get(a);if(!l)return 15;const c=(e%16+16)%16,h=(t%16+16)%16,u=(n%16+16)%16;return l.getLight(c,h,u)}isSolid(e,t,n){const i=this.getBlock(e,t,n);return this.blockRegistry.isSolid(i)}onFallingBlock(e,t,n,i,r,o,a){const l=this.blockRegistry.get(a),c=(l==null?void 0:l.color)||"#888888",h=new Fe(c).getHex(),u=new cg(e,t,n,i,r,o,a,h);this.renderer.addToScene(u.mesh),this.fallingBlocks.push(u)}update(e){for(const[n,i]of this.entityMeshes)i.position.y+=Math.sin(Date.now()*.003)*.002,n.startsWith("mob_")&&(i.rotation.y+=e*.5);for(let n=this.fallingBlocks.length-1;n>=0;n--){const i=this.fallingBlocks[n];i.update(e),i.completed&&(this.renderer.removeFromScene(i.mesh),i.mesh.geometry.dispose(),i.mesh.material.dispose(),this.updateBlock(i.toX,i.toY,i.toZ,i.blockType),this.fallingBlocks.splice(n,1))}const t=performance.now()/1e3;for(const n of this.chunks.values())n.isVegetation&&n.animateVegetation(t)}unloadDistantChunks(e){const t=Math.floor(e.x/16),n=Math.floor(e.z/16),i=this.renderDistance+3,r=[];for(const[o,a]of this.chunks){const l=a.chunkX-t,c=a.chunkZ-n;(Math.abs(l)>i||Math.abs(c)>i)&&r.push(o)}for(const o of r){const a=this.chunks.get(o);a&&(a.mesh&&this.renderer.removeFromScene(a.mesh),a.transparentMesh&&this.renderer.removeFromScene(a.transparentMesh),this.chunks.delete(o))}}getChunkCount(){return this.chunks.size}getPendingChunkKeys(){return this.pendingChunks}}class ug{constructor(){I(this,"keys",new Set);I(this,"pointerLocked",!1);this.setupListeners()}setupListeners(){document.addEventListener("keydown",e=>{this.keys.add(e.code)}),document.addEventListener("keyup",e=>{this.keys.delete(e.code)}),window.addEventListener("blur",()=>{this.keys.clear(),this.pointerLocked=!1})}isKeyDown(e){return this.keys.has(e)}isPointerLocked(){return this.pointerLocked}setPointerLocked(e){this.pointerLocked=e}}class dg{constructor(){I(this,"audioContext",null);I(this,"volume",.5);try{this.audioContext=new AudioContext}catch{console.warn("Web Audio API not available")}}play(e,t=.5){if(this.audioContext)switch(this.audioContext.state==="suspended"&&this.audioContext.resume(),e){case"block_break":this.playBlockBreak();break;case"block_place":this.playBlockPlace();break;case"footstep":this.playFootstep();break;case"hurt":this.playHurt();break;case"pickup":this.playPickup();break;case"death":this.playDeath();break}}setVolume(e){this.volume=e}playBlockBreak(){if(!this.audioContext)return;const e=this.audioContext,t=.1,n=Math.floor(e.sampleRate*t),i=e.createBuffer(1,n,e.sampleRate),r=i.getChannelData(0);for(let l=0;l<n;l++)r[l]=(Math.random()*2-1)*(1-l/n);const o=e.createBufferSource();o.buffer=i;const a=e.createGain();a.gain.setValueAtTime(this.volume*.3,e.currentTime),a.gain.exponentialRampToValueAtTime(.001,e.currentTime+t),o.connect(a),a.connect(e.destination),o.start()}playBlockPlace(){if(!this.audioContext)return;const e=this.audioContext,t=.08,n=e.createOscillator();n.type="sine",n.frequency.setValueAtTime(150,e.currentTime),n.frequency.exponentialRampToValueAtTime(60,e.currentTime+t);const i=e.createGain();i.gain.setValueAtTime(this.volume*.4,e.currentTime),i.gain.exponentialRampToValueAtTime(.001,e.currentTime+t),n.connect(i),i.connect(e.destination),n.start(),n.stop(e.currentTime+t)}playFootstep(){if(!this.audioContext)return;const e=this.audioContext,t=.05,n=Math.floor(e.sampleRate*t),i=e.createBuffer(1,n,e.sampleRate),r=i.getChannelData(0);for(let l=0;l<n;l++)r[l]=(Math.random()*2-1)*(1-l/n)*.5;const o=e.createBufferSource();o.buffer=i;const a=e.createGain();a.gain.setValueAtTime(this.volume*.1,e.currentTime),a.gain.exponentialRampToValueAtTime(.001,e.currentTime+t),o.connect(a),a.connect(e.destination),o.start()}playHurt(){if(!this.audioContext)return;const e=this.audioContext,t=.2,n=e.createOscillator();n.type="sawtooth",n.frequency.setValueAtTime(200,e.currentTime);const i=e.createOscillator();i.type="square",i.frequency.setValueAtTime(153,e.currentTime);const r=e.createGain();r.gain.setValueAtTime(this.volume*.3,e.currentTime),r.gain.exponentialRampToValueAtTime(.001,e.currentTime+t),n.connect(r),i.connect(r),r.connect(e.destination),n.start(),i.start(),n.stop(e.currentTime+t),i.stop(e.currentTime+t)}playPickup(){if(!this.audioContext)return;const e=this.audioContext,t=.15,n=e.createOscillator();n.type="sine",n.frequency.setValueAtTime(400,e.currentTime),n.frequency.setValueAtTime(600,e.currentTime+.075);const i=e.createGain();i.gain.setValueAtTime(this.volume*.25,e.currentTime),i.gain.setValueAtTime(this.volume*.25,e.currentTime+.07),i.gain.exponentialRampToValueAtTime(.001,e.currentTime+t),n.connect(i),i.connect(e.destination),n.start(),n.stop(e.currentTime+t)}playDeath(){if(!this.audioContext)return;const e=this.audioContext,t=.5,n=e.createOscillator();n.type="sawtooth",n.frequency.setValueAtTime(440,e.currentTime),n.frequency.exponentialRampToValueAtTime(55,e.currentTime+t);const i=e.createGain();i.gain.setValueAtTime(this.volume*.35,e.currentTime),i.gain.exponentialRampToValueAtTime(.001,e.currentTime+t),n.connect(i),i.connect(e.destination),n.start(),n.stop(e.currentTime+t)}dispose(){var e;(e=this.audioContext)==null||e.close()}}const Xt=160,nl=32;class fg{constructor(e,t){I(this,"canvas");I(this,"ctx");I(this,"worldManager");I(this,"mode","surface");I(this,"updateTimer",0);I(this,"updateInterval",.5);I(this,"container");I(this,"position",new R);I(this,"yaw",0);this.worldManager=t,this.container=e,this.canvas=document.createElement("canvas"),this.canvas.width=Xt,this.canvas.height=Xt,this.canvas.id="minimap",this.canvas.style.cssText=`
            position: fixed; top: 10px; right: 10px;
            width: ${Xt}px; height: ${Xt}px;
            border: 2px solid rgba(255,255,255,0.5);
            border-radius: ${this.mode==="surface"?"50%":"4px"};
            z-index: 100; image-rendering: pixelated;
            cursor: pointer; opacity: 0.85;
        `,this.ctx=this.canvas.getContext("2d"),this.container.appendChild(this.canvas),this.canvas.addEventListener("click",()=>{const n=["surface","radar","normal"],i=n.indexOf(this.mode);this.mode=n[(i+1)%n.length],this.canvas.style.borderRadius=this.mode==="surface"?"50%":"4px"})}setPosition(e,t,n,i){this.position.set(e,t,n),this.yaw=i}update(e){if(this.updateTimer+=e,this.updateTimer<this.updateInterval)return;this.updateTimer=0;const t=Math.floor(this.position.x),n=Math.floor(this.position.y),i=Math.floor(this.position.z),r=Math.floor(nl/2),o=Xt/nl,a=this.ctx.createImageData(Xt,Xt),l=a.data;for(let u=-r;u<r;u++)for(let d=-r;d<r;d++){const m=Math.round(d*Math.cos(-this.yaw)-u*Math.sin(-this.yaw)),g=Math.round(d*Math.sin(-this.yaw)+u*Math.cos(-this.yaw)),_=t+m,p=i+g;let f=0;if(this.mode==="surface")for(let T=n+30;T>=n-30;T--){const A=this.worldManager.getBlock(_,T,p);if(A!==0&&!this.worldManager.getBlockRegistry().isLiquid(A)){f=A;break}}else if(this.mode==="radar")f=this.worldManager.getBlock(_,n,p);else{const T=this.worldManager.getBlock(_,n+1,p);T===0?f=this.worldManager.getBlock(_,n,p):f=T}const E=Math.floor((d+r)*o),y=Math.floor((u+r)*o);if(E<0||E>=Xt||y<0||y>=Xt)continue;const w=this.getBlockColor(f),P=(y*Xt+E)*4;l[P]=w[0],l[P+1]=w[1],l[P+2]=w[2],l[P+3]=255}this.ctx.putImageData(a,0,0);const c=Xt/2,h=Xt/2;this.ctx.fillStyle="#FF0000",this.ctx.beginPath(),this.ctx.arc(c,h,3,0,Math.PI*2),this.ctx.fill(),this.ctx.strokeStyle="#FFFFFF",this.ctx.lineWidth=2,this.ctx.beginPath(),this.ctx.moveTo(c,h),this.ctx.lineTo(c+Math.sin(this.yaw)*12,h-Math.cos(this.yaw)*12),this.ctx.stroke()}getBlockColor(e){if(e===0)return[30,100,200];const t=this.worldManager.getBlockRegistry().get(e);if(!t)return[0,0,0];const n=t.color,i=parseInt(n.slice(1,3),16),r=parseInt(n.slice(3,5),16),o=parseInt(n.slice(5,7),16);return[i,r,o]}setVisible(e){this.canvas.style.display=e?"block":"none"}destroy(){this.canvas.remove()}}class pg{constructor(e){I(this,"particles",[]);I(this,"geometry");I(this,"material");I(this,"points");I(this,"maxParticles",500);this.geometry=new Dt,this.material=new ro({size:.15,vertexColors:!0,transparent:!0,opacity:.8,sizeAttenuation:!0,depthWrite:!1,blending:Wn}),this.points=new Gl(this.geometry,this.material),this.points.frustumCulled=!1,e.add(this.points)}emitBlockParticles(e,t,n,i,r=8){for(let o=0;o<r;o++)this.particles.length>=this.maxParticles&&this.particles.shift(),this.particles.push({position:new R(e+.2+Math.random()*.6,t+.2+Math.random()*.6,n+.2+Math.random()*.6),velocity:new R((Math.random()-.5)*3,Math.random()*4+1,(Math.random()-.5)*3),life:.5+Math.random()*.5,maxLife:.5+Math.random()*.5,size:.1+Math.random()*.1,color:i.clone().multiplyScalar(.8+Math.random()*.4),alpha:1})}emitPlaceParticles(e,t,n,i,r=6){for(let o=0;o<r;o++)this.particles.length>=this.maxParticles&&this.particles.shift(),this.particles.push({position:new R(e+Math.random(),t+Math.random(),n+Math.random()),velocity:new R((Math.random()-.5)*2,Math.random()*1.5,(Math.random()-.5)*2),life:.3+Math.random()*.3,maxLife:.3+Math.random()*.3,size:.08+Math.random()*.08,color:i.clone(),alpha:1})}emitDamageParticles(e,t,n,i=12){const r=[16711680,16729156,16737894,16746632];for(let o=0;o<i;o++)this.particles.length>=this.maxParticles&&this.particles.shift(),this.particles.push({position:new R(e+(Math.random()-.5)*.5,t+Math.random()*1.8,n+(Math.random()-.5)*.5),velocity:new R((Math.random()-.5)*2,Math.random()*3+1,(Math.random()-.5)*2),life:.4+Math.random()*.4,maxLife:.4+Math.random()*.4,size:.05+Math.random()*.1,color:new Fe(r[Math.floor(Math.random()*r.length)]),alpha:1})}emitSmokeParticles(e,t,n,i=4){for(let r=0;r<i;r++)this.particles.length>=this.maxParticles&&this.particles.shift(),this.particles.push({position:new R(e+.3+Math.random()*.4,t+.8+Math.random()*.4,n+.3+Math.random()*.4),velocity:new R((Math.random()-.5)*.5,.5+Math.random()*1,(Math.random()-.5)*.5),life:1+Math.random()*1,maxLife:1+Math.random()*1,size:.15+Math.random()*.15,color:new Fe(13421772),alpha:.5})}update(e){for(let t=this.particles.length-1;t>=0;t--){const n=this.particles[t];if(n.life-=e,n.life<=0){this.particles.splice(t,1);continue}n.velocity.y-=9.8*e,n.position.addScaledVector(n.velocity,e),n.alpha=n.life/n.maxLife*.8}this.updateGeometry()}updateGeometry(){const e=this.particles.length;if(e===0){this.geometry.setAttribute("position",new ct([],3)),this.geometry.setAttribute("color",new ct([],3));return}const t=new Float32Array(e*3),n=new Float32Array(e*3);for(let i=0;i<e;i++){const r=this.particles[i];t[i*3]=r.position.x,t[i*3+1]=r.position.y,t[i*3+2]=r.position.z,n[i*3]=r.color.r*r.alpha,n[i*3+1]=r.color.g*r.alpha,n[i*3+2]=r.color.b*r.alpha}this.geometry.setAttribute("position",new ct(t,3)),this.geometry.setAttribute("color",new ct(n,3))}destroy(){this.geometry.dispose(),this.material.dispose(),this.points.removeFromParent()}}class mg{constructor(e,t){I(this,"scene");I(this,"camera");I(this,"pivot");I(this,"currentMesh",null);I(this,"currentItemId","");I(this,"bobAngle",0);I(this,"bobSpeed",8);I(this,"bobAmount",.03);I(this,"swingAngle",0);I(this,"isSwinging",!1);this.scene=e,this.camera=t,this.pivot=new Tn,this.scene.add(this.pivot)}updateItem(e,t,n){if(this.currentItemId===e&&this.currentMesh||(this.currentItemId=e,this.currentMesh&&(this.pivot.remove(this.currentMesh),this.currentMesh.geometry.dispose(),this.currentMesh.material instanceof gn&&this.currentMesh.material.dispose(),this.currentMesh=null),!e||e===""))return;const i=t!==null&&t>0;n.includes("pickaxe")||n.includes("sword")||n.includes("axe")||n.includes("shovel")||n.includes("hoe")||n.includes("shears")||n.includes("dagger")?this.currentMesh=this.createToolMesh(n):i?this.currentMesh=this.createBlockMesh(n):this.currentMesh=this.createItemMesh(n),this.currentMesh&&this.pivot.add(this.currentMesh)}createBlockMesh(e){const t=new ot(.25,.25,.25),n=new It({color:8947848});return new $e(t,n)}createToolMesh(e){let t=9127187,n=6042391;if(e.includes("wooden")?(t=12357466,n=9127187):e.includes("stone")?(t=8421504,n=9127187):e.includes("iron")||e.includes("steel")?(t=14211288,n=6042391):e.includes("diamond")?(t=4910553,n=6042391):e.includes("gold")?(t=16766720,n=6042391):e.includes("mese")?(t=16776960,n=6042391):e.includes("blood")?(t=8912896,n=4004866):e.includes("fire")?(t=16737792,n=6042391):e.includes("ice")?(t=8965375,n=6042391):e.includes("heal")&&(t=4521796,n=6042391),e.includes("sword")){const o=new Tn,a=new ot(.04,.2,.04),l=new It({color:n}),c=new $e(a,l);c.position.y=-.05,o.add(c);const h=new ot(.03,.25,.03),u=new It({color:t}),d=new $e(h,u);d.position.y=.12,o.add(d);const m=new ot(.12,.02,.04),g=new It({color:4473924}),_=new $e(m,g);return _.position.y=.04,o.add(_),o}if(e.includes("pickaxe")){const o=new Tn,a=new ot(.04,.3,.04),l=new It({color:n}),c=new $e(a,l);c.rotation.z=.3,o.add(c);const h=new ot(.2,.04,.04),u=new It({color:t}),d=new $e(h,u);return d.position.y=.14,d.position.x=.02,o.add(d),o}const i=new ot(.05,.3,.05),r=new It({color:t});return new $e(i,r)}createItemMesh(e){const t=new ot(.12,.12,.12);let n=13413068;e.includes("apple")?n=16720418:e.includes("bread")?n=13803616:e.includes("coal")?n=3355443:e.includes("iron_ingot")?n=14540253:e.includes("gold_ingot")?n=16766720:e.includes("diamond")?n=4910553:e.includes("stick")?n=9127187:e.includes("bucket")?n=8947848:e.includes("torch")?n=16766720:e.includes("bucket_water")&&(n=4491519);const i=new It({color:n});return new $e(t,i)}swing(){this.isSwinging=!0,this.swingAngle=-.8}update(e,t){this.bobAngle+=e*this.bobSpeed*(t?1:0),this.isSwinging&&(this.swingAngle+=e*6,this.swingAngle>=0&&(this.swingAngle=0,this.isSwinging=!1));const n=Math.sin(this.bobAngle)*this.bobAmount*(t?1:0),i=Math.cos(this.bobAngle*.5)*this.bobAmount*.5*(t?1:0),r=this.camera.quaternion.clone();this.pivot.position.copy(this.camera.position),this.pivot.position.add(new R(.4+i,-.35+n,-.5).applyQuaternion(r)),this.pivot.quaternion.copy(r),this.pivot.rotateZ(this.swingAngle)}destroy(){this.currentMesh&&this.currentMesh.geometry.dispose(),this.pivot.removeFromParent()}}class gg{constructor(e){I(this,"wireframe");I(this,"digOverlay");I(this,"digMaterial");I(this,"edges");I(this,"material");I(this,"visible",!1);const t=new ot(1.005,1.005,1.005);this.edges=new Wm(t),this.material=new zl({color:0,linewidth:2,transparent:!0,opacity:.5}),this.wireframe=new Vm(this.edges,this.material),this.wireframe.visible=!1,e.add(this.wireframe);const n=new ot(1.008,1.008,1.008);this.digMaterial=new Yn({color:0,transparent:!0,opacity:0,depthTest:!0,side:rn}),this.digOverlay=new $e(n,this.digMaterial),this.digOverlay.visible=!1,this.wireframe.add(this.digOverlay)}update(e,t){if(!e||!t){this.wireframe.visible=!1,this.visible=!1;return}const n=Math.floor(e.x-t.x*.5),i=Math.floor(e.y-t.y*.5),r=Math.floor(e.z-t.z*.5);this.wireframe.position.set(n+.5,i+.5,r+.5),this.wireframe.visible=!0,this.visible=!0}setDigProgress(e){e<=0?(this.digOverlay.visible=!1,this.digMaterial.opacity=0):(this.digOverlay.visible=!0,this.digMaterial.opacity=Math.min(e*.6,.6))}setVisible(e){this.wireframe.visible=e&&this.visible}isActive(){return this.visible}destroy(){this.edges.dispose(),this.material.dispose(),this.digMaterial.dispose(),this.digOverlay.geometry.dispose(),this.wireframe.removeFromParent()}}const Cs=800,Dr=50,Rs=35,_g=25,il=.15;class vg{constructor(e){I(this,"rainPoints",null);I(this,"rainPositions",null);I(this,"rainVelocities",null);I(this,"isRaining",!1);I(this,"scene");I(this,"groundLevel",0);this.scene=e,this.initRain()}initRain(){const e=new Dt;this.rainPositions=new Float32Array(Cs*3),this.rainVelocities=new Float32Array(Cs);for(let n=0;n<Cs;n++)this.resetRaindrop(n,!0);e.setAttribute("position",new Yt(this.rainPositions,3));const t=new ro({color:10075101,size:.3,transparent:!0,opacity:.6,depthWrite:!1});this.rainPoints=new Gl(e,t),this.rainPoints.visible=!1,this.scene.add(this.rainPoints)}resetRaindrop(e,t){if(!this.rainPositions)return;const n=Math.random()*Math.PI*2,i=Math.random()*Dr,r=e*3;this.rainPositions[r]=Math.cos(n)*i,this.rainPositions[r+1]=t?Math.random()*Rs:Rs+Math.random()*10,this.rainPositions[r+2]=Math.sin(n)*i,this.rainVelocities[e]=_g*(.8+Math.random()*.4)}setRaining(e){this.isRaining=e,this.rainPoints&&(this.rainPoints.visible=e)}getIsRaining(){return this.isRaining}update(e,t,n,i){if(!this.isRaining||!this.rainPoints||!this.rainPositions||!this.rainVelocities)return;this.groundLevel=n-10;const r=this.rainPoints.geometry.getAttribute("position");let o=!1;for(let a=0;a<Cs;a++){const l=a*3;this.rainPositions[l]+=Math.sin(il)*this.rainVelocities[a]*e,this.rainPositions[l+1]-=this.rainVelocities[a]*e,this.rainPositions[l+2]+=Math.cos(il)*this.rainVelocities[a]*e*.3,this.rainPositions[l+1]<this.groundLevel&&(this.rainPositions[l]=t+(Math.random()-.5)*Dr*2,this.rainPositions[l+1]=n+Rs*.5+Math.random()*Rs*.5,this.rainPositions[l+2]=i+(Math.random()-.5)*Dr*2,o=!0)}this.rainPoints.position.set(t,0,i),r.needsUpdate=o||!0}}class xg{constructor(e){I(this,"connection",null);I(this,"renderer");I(this,"playerController");I(this,"worldManager");I(this,"inputManager");I(this,"uiManager");I(this,"audioManager");I(this,"minimap");I(this,"particleSystem");I(this,"wieldItem");I(this,"selectionBox");I(this,"weatherSystem");I(this,"isRunning",!1);I(this,"lastTime",0);I(this,"frameCount",0);I(this,"fps",0);I(this,"fpsTimer",0);I(this,"chunkRequestTimer",0);I(this,"chunkUnloadTimer",0);I(this,"weatherTimer",0);I(this,"skyBrightness",1);this.uiManager=e,this.renderer=new Qm(document.getElementById("game-container")),this.worldManager=new hg(this.renderer),this.inputManager=new ug,this.audioManager=new dg,this.minimap=new fg(document.getElementById("game-container"),this.worldManager),this.particleSystem=new pg(this.renderer.getScene()),this.wieldItem=new mg(this.renderer.getScene(),this.renderer.getCamera()),this.selectionBox=new gg(this.renderer.getScene()),this.weatherSystem=new vg(this.renderer.getScene()),this.playerController=new rg(this.renderer.getCamera(),this.inputManager),this.playerController.setWorldManager(this.worldManager),this.playerController.setSelectionBox(this.selectionBox),this.playerController.setParticleEmitter((t,n,i,r)=>{this.onParticleEvent(t,n,i,r)}),this.applySettings(this.uiManager.getSettingsPanel().getSettings()),this.uiManager.getSettingsPanel().setOnSettingsChanged(t=>{this.applySettings(t)})}applySettings(e){this.renderer.setFov(e.fov),this.playerController.setMouseSensitivity(e.mouseSensitivity),this.worldManager.setRenderDistance(e.renderDistance),this.worldManager.setAoEnabled(e.aoEnabled),this.renderer.setCloudsEnabled(e.cloudsEnabled),this.audioManager.setVolume(e.soundVolume)}async connect(e){this.connection=new Pc().withUrl("/game").withAutomaticReconnect().configureLogging(V.Information).build(),this.worldManager.setConnection(this.connection),this.playerController.setConnection(this.connection),this.setupServerHandlers(),this.uiManager.setConnection(this.connection);try{await this.connection.start(),await this.connection.invoke("Join",e),this.isRunning=!0,this.lastTime=performance.now(),this.gameLoop()}catch(t){this.uiManager.addChatMessage("Server",`Connection failed: ${t}`),this.showLoginScreen()}}setupServerHandlers(){this.connection&&(this.connection.on("OnChunkReceived",(e,t,n,i)=>{this.worldManager.loadChunk(e,t,n,i)}),this.connection.on("OnPlayerJoined",e=>{this.uiManager.addChatMessage("Server",`${e} joined the game`)}),this.connection.on("OnPlayerLeft",e=>{this.uiManager.addChatMessage("Server",`${e} left the game`),this.worldManager.removePlayer(e)}),this.connection.on("OnPlayerListUpdate",e=>{this.uiManager.updatePlayerList(e)}),this.connection.on("OnPlayerPositionUpdate",(e,t,n,i,r,o)=>{this.worldManager.updatePlayerPosition(e,t,n,i,r,o)}),this.connection.on("OnChatMessage",(e,t)=>{this.uiManager.addChatMessage(e,t)}),this.connection.on("OnBlockUpdate",(e,t,n,i)=>{this.worldManager.updateBlock(e,t,n,i)}),this.connection.on("OnHealthUpdate",(e,t)=>{this.uiManager.updateHealth(e,t),this.playerController.setHealth(e,t)}),this.connection.on("OnInventoryUpdate",e=>{this.uiManager.updateInventory(e),this.playerController.setInventory(e)}),this.connection.on("OnTimeUpdate",(e,t,n)=>{this.skyBrightness=n,this.renderer.updateSkyBrightness(n)}),this.connection.on("OnEntitySpawned",(e,t,n,i,r)=>{this.worldManager.spawnEntity(e,t,n,i,r)}),this.connection.on("OnEntityDespawned",e=>{this.worldManager.removeEntity(e)}),this.connection.on("OnEntityUpdate",(e,t,n,i)=>{this.worldManager.updateEntityPosition(e,t,n,i)}),this.connection.on("OnCraftResult",(e,t)=>{this.uiManager.addChatMessage("Server",`Crafted ${t}x ${e}`)}),this.connection.on("OnDeath",e=>{this.uiManager.showDeathScreen(e),this.playerController.handleDeath()}),this.connection.on("OnBlockDefinitions",e=>{this.worldManager.getBlockRegistry().loadFromServer(e)}),this.connection.on("OnBreathUpdate",(e,t)=>{this.uiManager.updateBreath(e,t)}),this.connection.on("OnKnockback",(e,t,n)=>{this.playerController.applyKnockback(e,t,n),this.audioManager.play("hurt"),this.renderer.flashDamage(.6)}),this.connection.on("OnPrivilegeList",e=>{this.uiManager.addChatMessage("Server",`Your privileges: ${e.join(", ")}`)}),this.connection.on("OnGameModeChanged",e=>{this.uiManager.addChatMessage("Server",`Game mode changed to: ${e}`),e==="creative"||e==="spectator"?this.playerController.setFlying(!0):this.playerController.setFlying(!1)}),this.connection.on("OnTeleported",(e,t,n)=>{this.playerController.setPosition(e,t,n)}),this.connection.on("OnCraftingRecipes",e=>{this.uiManager.populateCraftingRecipes(e)}),this.connection.on("OnSmeltingRecipes",e=>{this.uiManager.populateSmeltingRecipes(e)}),this.connection.on("OnChestInventory",e=>{this.uiManager.updateChestInventory(e),this.uiManager.updateChestPlayerInventory(this.playerController.inventory)}),this.connection.on("OnFurnaceUpdate",(e,t,n,i)=>{this.uiManager.updateFurnaceState(e,t,n,i)}),this.connection.on("OnFallingBlock",(e,t,n,i,r,o,a)=>{this.worldManager.onFallingBlock(e,t,n,i,r,o,a)}),this.connection.on("OnArmorUpdate",e=>{this.uiManager.updateArmor(e)}),this.connection.on("OnExperienceUpdate",(e,t)=>{this.uiManager.updateExperience(e,t)}))}sendChat(e){var t;(t=this.connection)==null||t.invoke("SendChat",e)}respawn(){var e;(e=this.connection)==null||e.invoke("Respawn"),this.playerController.respawn(),this.uiManager.hideDeathScreen()}useItem(e){var t;(t=this.connection)==null||t.invoke("UseItem",e)}craft(){var e;(e=this.connection)==null||e.invoke("Craft","")}getCraftingRecipes(){var e;(e=this.connection)==null||e.invoke("GetCraftingRecipes")}craftRecipe(e){var t;(t=this.connection)==null||t.invoke("CraftRecipe",e)}getSmeltingRecipes(){var e;(e=this.connection)==null||e.invoke("GetSmeltingRecipes")}startSmelting(e,t,n,i,r){var o;(o=this.connection)==null||o.invoke("StartSmelting",e,t,n,i,r)}getChestInventory(e,t,n){var i;(i=this.connection)==null||i.invoke("GetChestInventory",e,t,n)}moveItemToChest(e,t,n,i,r){var o;(o=this.connection)==null||o.invoke("MoveItemToChest",e,t,n,i,r)}takeItemFromChest(e,t,n,i,r){var o;(o=this.connection)==null||o.invoke("TakeItemFromChest",e,t,n,i,r)}getPrivileges(){var e;(e=this.connection)==null||e.invoke("GetPrivileges")}equipArmor(e,t){var n;(n=this.connection)==null||n.invoke("EquipArmor",e,t)}unequipArmor(e){var t;(t=this.connection)==null||t.invoke("UnequipArmor",e)}showCreativeInventory(){const e=this.worldManager.getBlockRegistry(),t=[];e.getAll().forEach((n,i)=>{i>0&&t.push({id:i,name:n.name,color:n.color,solid:n.solid})}),t.sort((n,i)=>n.id-i.id),this.uiManager.setCreativeSelectHandler(n=>{this.playerController.setSelectedBlockType(n)}),this.uiManager.showCreativeInventory(t)}gameLoop(){if(!this.isRunning)return;requestAnimationFrame(()=>this.gameLoop());const e=performance.now(),t=(e-this.lastTime)/1e3;this.lastTime=e,this.frameCount++,this.fpsTimer+=t,this.fpsTimer>=1&&(this.fps=Math.round(this.frameCount/this.fpsTimer),this.frameCount=0,this.fpsTimer=0),this.playerController.isDead||this.playerController.update(t),this.minimap.setPosition(this.playerController.getPosition().x,this.playerController.getPosition().y,this.playerController.getPosition().z,this.playerController.getYaw()*Math.PI/180),this.minimap.update(t),this.particleSystem.update(t);const n=this.playerController.getSelectedSlot(),i=this.playerController.inventory;i[n]?this.wieldItem.updateItem(i[n].itemId||"",i[n].blockId||null,i[n].itemName||""):this.wieldItem.updateItem("",null,""),this.wieldItem.update(t,this.playerController.getOnGround()),this.chunkRequestTimer+=t,this.chunkRequestTimer>=2&&(this.chunkRequestTimer=0,this.worldManager.requestChunksAroundPlayer(this.playerController.getPosition())),this.chunkUnloadTimer+=t,this.chunkUnloadTimer>=10&&(this.chunkUnloadTimer=0,this.worldManager.unloadDistantChunks(this.playerController.getPosition())),this.worldManager.update(t),this.renderer.updateClouds(t),this.renderer.updateEffects(t),this.weatherTimer+=t,this.weatherTimer>=5&&(this.weatherTimer=0,this.skyBrightness<.3?this.weatherSystem.setRaining(!0):this.weatherSystem.setRaining(Math.random()<.2),this.renderer.setRaining(this.weatherSystem.getIsRaining()));const r=this.playerController.getPosition();this.weatherSystem.update(t,r.x,r.y,r.z);const o=this.playerController.getVelocity(),a=o.x*o.x+o.z*o.z>.5;if(this.worldManager.animatePlayer("__local__",a,t),r.y<30){const l=this.checkSkyAccess(Math.floor(r.x),Math.floor(r.y)+2,Math.floor(r.z));this.renderer.updateCaveDarkness(r.y,!l)}else this.renderer.updateCaveDarkness(r.y,!1);this.renderer.updateLavaEffect(this.checkNearLava(r)),this.renderer.render(),this.uiManager.updateDebugInfo(this.fps,this.playerController.getPosition(),this.worldManager.getChunkCount()),this.sendPositionUpdate()}sendPositionUpdate(){if(!this.connection)return;const e=this.playerController.getPosition(),t=this.playerController.getVelocity(),n=this.playerController.getYaw(),i=this.playerController.getPitch();this.connection.invoke("UpdatePosition",e.x,e.y,e.z,t.x,t.y,t.z,n,i)}showLoginScreen(){const e=document.getElementById("login-screen");e.style.display="flex"}onParticleEvent(e,t,n,i){var o;const r=new Fe(((o=this.worldManager.getBlockRegistry().get(this.worldManager.getBlock(e,t,n)))==null?void 0:o.color)||"#888888");switch(i){case"dig":this.particleSystem.emitBlockParticles(e,t,n,r,8);break;case"place":this.particleSystem.emitPlaceParticles(e,t,n,r,6);break;case"damage":this.particleSystem.emitDamageParticles(this.playerController.getPosition().x,this.playerController.getPosition().y,this.playerController.getPosition().z);break;case"smoke":this.particleSystem.emitSmokeParticles(e,t,n,4);break}}checkSkyAccess(e,t,n){for(let i=t;i<80;i+=3)if(this.worldManager.isSolid(e,i,n))return!1;return!0}checkNearLava(e){const n=Math.floor(e.x),i=Math.floor(e.y),r=Math.floor(e.z);for(let o=-4;o<=4;o++)for(let a=-4;a<=4;a++)for(let l=-4;l<=4;l++){if(o*o+a*a+l*l>4*4)continue;const c=this.worldManager.getBlock(n+o,i+a,r+l),h=this.worldManager.getBlockRegistry().get(c);if(h&&(h.name==="lava"||h.name==="lava_flowing"))return!0}return!1}}const En={mouseSensitivity:.002,renderDistance:4,fov:70,musicVolume:.5,soundVolume:.5,cloudsEnabled:!0,aoEnabled:!0},sl="helloworld_settings";class yg{constructor(){I(this,"element",null);I(this,"overlay",null);I(this,"settings");I(this,"onSettingsChanged",null);this.settings=this.loadSettings()}getSettings(){return{...this.settings}}setOnSettingsChanged(e){this.onSettingsChanged=e}isOpen(){return this.element!==null}show(){if(this.element)return;this.overlay=document.createElement("div"),this.overlay.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:599;",this.overlay.addEventListener("click",()=>this.hide()),this.element=document.createElement("div"),this.element.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(40,40,50,0.95);color:white;padding:24px 28px;border-radius:8px;z-index:600;width:380px;font-family:monospace;";const e=document.createElement("div");e.style.cssText="font-size:20px;font-weight:bold;margin-bottom:16px;text-align:center;",e.textContent="Settings";const t=document.createElement("button");t.style.cssText="position:absolute;top:8px;right:14px;cursor:pointer;background:none;border:none;color:white;font-size:22px;",t.textContent="X",t.addEventListener("click",()=>this.hide()),this.element.appendChild(t),this.element.appendChild(e),this.element.appendChild(this.createSlider("Mouse Sensitivity",this.settings.mouseSensitivity,.001,.01,.001,n=>{this.settings.mouseSensitivity=n})),this.element.appendChild(this.createSlider("Render Distance",this.settings.renderDistance,2,8,1,n=>{this.settings.renderDistance=Math.round(n)})),this.element.appendChild(this.createSlider("FOV",this.settings.fov,50,110,1,n=>{this.settings.fov=Math.round(n)})),this.element.appendChild(this.createSlider("Music Volume",this.settings.musicVolume,0,1,.05,n=>{this.settings.musicVolume=n})),this.element.appendChild(this.createSlider("Sound Volume",this.settings.soundVolume,0,1,.05,n=>{this.settings.soundVolume=n})),this.element.appendChild(this.createToggle("Clouds",this.settings.cloudsEnabled,n=>{this.settings.cloudsEnabled=n})),this.element.appendChild(this.createToggle("Ambient Occlusion",this.settings.aoEnabled,n=>{this.settings.aoEnabled=n})),document.body.appendChild(this.overlay),document.body.appendChild(this.element),document.exitPointerLock()}hide(){var e,t;this.element&&((e=this.element.parentNode)==null||e.removeChild(this.element),this.element=null),this.overlay&&((t=this.overlay.parentNode)==null||t.removeChild(this.overlay),this.overlay=null),this.saveSettings(),this.onSettingsChanged&&this.onSettingsChanged(this.settings)}createSlider(e,t,n,i,r,o){const a=document.createElement("div");a.style.cssText="margin-bottom:14px;";const l=document.createElement("div");l.style.cssText="display:flex;justify-content:space-between;margin-bottom:4px;font-size:13px;";const c=document.createElement("span");c.textContent=e;const h=document.createElement("span");h.style.cssText="color:#88aaff;",h.textContent=String(t),l.appendChild(c),l.appendChild(h);const u=document.createElement("input");return u.type="range",u.min=String(n),u.max=String(i),u.step=String(r),u.value=String(t),u.style.cssText="width:100%;cursor:pointer;",u.addEventListener("input",()=>{const d=parseFloat(u.value);h.textContent=r<1?d.toFixed(3):String(Math.round(d)),o(d)}),a.appendChild(l),a.appendChild(u),a}createToggle(e,t,n){const i=document.createElement("div");i.style.cssText="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-size:13px;";const r=document.createElement("span");r.textContent=e;const o=document.createElement("input");return o.type="checkbox",o.checked=t,o.style.cssText="width:18px;height:18px;cursor:pointer;",o.addEventListener("change",()=>{n(o.checked)}),i.appendChild(r),i.appendChild(o),i}loadSettings(){try{const e=localStorage.getItem(sl);if(e){const t=JSON.parse(e);return{mouseSensitivity:t.mouseSensitivity??En.mouseSensitivity,renderDistance:t.renderDistance??En.renderDistance,fov:t.fov??En.fov,musicVolume:t.musicVolume??En.musicVolume,soundVolume:t.soundVolume??En.soundVolume,cloudsEnabled:t.cloudsEnabled??En.cloudsEnabled,aoEnabled:t.aoEnabled??En.aoEnabled}}}catch{}return{...En}}saveSettings(){try{localStorage.setItem(sl,JSON.stringify(this.settings))}catch{}}}const ki=class ki{constructor(){I(this,"_connection",null);I(this,"chatMessages");I(this,"healthBar");I(this,"hotbar");I(this,"debugInfo");I(this,"deathScreen",null);I(this,"craftingUI",null);I(this,"breathBar",null);I(this,"furnaceUI",null);I(this,"chestUI",null);I(this,"creativeInventoryUI",null);I(this,"chestPosition",null);I(this,"furnacePosition",null);I(this,"creativePage",0);I(this,"creativeFilter","");I(this,"creativeEntries",[]);I(this,"onCreativeSelect",null);I(this,"settingsPanel");this.chatMessages=document.getElementById("chat-messages"),this.healthBar=document.getElementById("health-bar"),this.hotbar=document.getElementById("hotbar"),this.debugInfo=document.getElementById("debug-info"),this.settingsPanel=new yg,this.setupHotbar()}setConnection(e){this._connection=e,document.addEventListener("blockAction",t=>{if(!this._connection)return;const{type:n,x:i,y:r,z:o,blockType:a}=t.detail;n==="dig"?this._connection.invoke("DigBlock",i,r,o):n==="place"&&this._connection.invoke("PlaceBlock",i,r,o,a)}),document.addEventListener("interactBlock",t=>{if(!this._connection)return;const{x:n,y:i,z:r,blockName:o}=t.detail;o==="chest"?(this.showChestUI(n,i,r),this._connection.invoke("GetChestInventory",n,i,r)):o==="furnace"?(this.showFurnaceUI(n,i,r),this._connection.invoke("GetSmeltingRecipes")):o==="crafting_table"&&(this.showCraftingUI(),this._connection.invoke("GetCraftingRecipes"))}),document.addEventListener("openCrafting",()=>{this._connection&&(this.showCraftingUI(),this._connection.invoke("GetCraftingRecipes"))})}setupHotbar(){this.hotbar.innerHTML="";for(let e=0;e<8;e++){const t=document.createElement("div");t.className="hotbar-slot",t.innerHTML=`<span style="font-size:12px;color:#aaa">${e+1}</span>`,e===0&&t.classList.add("selected"),this.hotbar.appendChild(t)}}addChatMessage(e,t){const n=document.createElement("div");for(n.className="chat-message",n.innerHTML=`<span class="sender">${e}:</span> ${t}`,this.chatMessages.appendChild(n),this.chatMessages.scrollTop=this.chatMessages.scrollHeight;this.chatMessages.children.length>100;)this.chatMessages.removeChild(this.chatMessages.firstChild)}updateHealth(e,t){const n=Math.ceil(t/2);this.healthBar.innerHTML="";for(let i=0;i<n;i++){const r=document.createElement("div");r.className="heart",e-i*2<=0&&r.classList.add("empty"),this.healthBar.appendChild(r)}}updateInventory(e){for(let t=0;t<8;t++){const n=this.hotbar.children[t];if(e[t]&&e[t].itemId){const i=e[t];let r=`<span style="font-size:11px;color:white">${i.itemId.replace(/_/g," ")}</span>`;i.count>1&&(r+=`<span style="position:absolute;bottom:2px;right:4px;font-size:10px;color:white">${i.count}</span>`),n.innerHTML=r,i.metadata&&(n.style.borderBottom="2px solid #00ff00")}else n.innerHTML=`<span style="font-size:12px;color:#aaa">${t+1}</span>`,n.style.borderBottom=""}}updatePlayerList(e){let t=document.getElementById("player-list-panel");if(t||(t=document.createElement("div"),t.id="player-list-panel",t.style.cssText="position:fixed;top:10px;right:10px;background:rgba(0,0,0,0.6);color:white;padding:8px 12px;border-radius:4px;font-size:13px;max-height:300px;overflow-y:auto;z-index:100;display:none;",document.body.appendChild(t)),e.length===0){t.style.display="none";return}t.style.display="block",t.innerHTML=`<div style="font-weight:bold;margin-bottom:4px">Players (${e.length})</div>`;for(const n of e){const i=document.createElement("div");i.textContent=n,t.appendChild(i)}}setSelectedSlot(e){const t=this.hotbar.children;for(let n=0;n<t.length;n++)t[n].classList.toggle("selected",n===e)}updateHotbarSelection(e){const t=this.hotbar.children;for(let n=0;n<t.length;n++)t[n].classList.toggle("selected",n===e)}showDeathScreen(e){this.hideDeathScreen(),this.deathScreen=document.createElement("div"),this.deathScreen.id="death-screen",this.deathScreen.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(150,0,0,0.5);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:1000;";const t=document.createElement("div");t.style.cssText="font-size:48px;color:#ff4444;font-weight:bold;margin-bottom:16px;text-shadow:2px 2px 4px black;",t.textContent="You Died!";const n=document.createElement("div");n.style.cssText="font-size:20px;color:#ffaaaa;margin-bottom:24px;",n.textContent=e;const i=document.createElement("button");i.id="respawn-button",i.style.cssText="padding:12px 32px;font-size:18px;cursor:pointer;background:#cc2222;color:white;border:2px solid #ff4444;border-radius:4px;",i.textContent="Respawn",i.addEventListener("click",()=>{const r=new CustomEvent("respawnRequest");document.dispatchEvent(r)}),this.deathScreen.appendChild(t),this.deathScreen.appendChild(n),this.deathScreen.appendChild(i),document.body.appendChild(this.deathScreen),document.exitPointerLock()}hideDeathScreen(){this.deathScreen&&this.deathScreen.parentNode&&(this.deathScreen.parentNode.removeChild(this.deathScreen),this.deathScreen=null)}showCraftingUI(){this.hideCraftingUI(),this.hideFurnaceUI(),this.hideChestUI(),document.exitPointerLock(),this.craftingUI=document.createElement("div"),this.craftingUI.id="crafting-ui",this.craftingUI.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(60,40,20,0.95);color:white;padding:20px;border-radius:8px;z-index:500;width:420px;max-height:80vh;display:flex;flex-direction:column;";const e=document.createElement("div");e.style.cssText="font-size:20px;font-weight:bold;margin-bottom:12px;text-align:center;",e.textContent="Crafting";const t=document.createElement("button");t.style.cssText="position:absolute;top:8px;right:12px;cursor:pointer;background:none;border:none;color:white;font-size:20px;",t.textContent="X",t.addEventListener("click",()=>{this.hideCraftingUI()});const n=document.createElement("div");n.id="crafting-body",n.style.cssText="font-size:13px;overflow-y:auto;flex:1;",n.textContent="Loading recipes...";const i=document.createElement("div");i.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;z-index:499;",i.addEventListener("click",()=>{this.hideCraftingUI()}),this.craftingUI.appendChild(t),this.craftingUI.appendChild(e),this.craftingUI.appendChild(n),document.body.appendChild(i),document.body.appendChild(this.craftingUI)}hideCraftingUI(){var e,t;if(this.craftingUI&&this.craftingUI.parentNode){const n=this.craftingUI.previousElementSibling;n&&((e=n.style)==null?void 0:e.zIndex)==="499"&&((t=n.parentNode)==null||t.removeChild(n)),this.craftingUI.parentNode.removeChild(this.craftingUI),this.craftingUI=null}}populateCraftingRecipes(e){if(!this.craftingUI)return;const t=document.getElementById("crafting-body");if(t){if(t.innerHTML="",e.length===0){t.textContent="No crafting recipes available.";return}for(let n=0;n<e.length;n++){const i=e[n],r=document.createElement("div");r.style.cssText="display:flex;align-items:center;justify-content:space-between;padding:6px 8px;margin:3px 0;background:rgba(0,0,0,0.3);border-radius:4px;cursor:pointer;",r.addEventListener("mouseenter",()=>{r.style.background="rgba(100,80,40,0.6)"}),r.addEventListener("mouseleave",()=>{r.style.background="rgba(0,0,0,0.3)"});const o=document.createElement("div");o.style.cssText="flex:1;";const a=document.createElement("div");a.style.cssText="font-weight:bold;color:#ffdd44;";const l=i.resultCount>1?` x${i.resultCount}`:"";a.textContent=`${this.formatItemName(i.result)}${l}`;const c=document.createElement("div");c.style.cssText="font-size:11px;color:#aaa;margin-top:2px;";const h=i.ingredients.map(([m,g])=>`${g}x ${this.formatItemName(m)}`).join(", ");c.textContent=h,o.appendChild(a),o.appendChild(c);const u=document.createElement("button");u.style.cssText="padding:4px 12px;cursor:pointer;background:#556b2f;color:white;border:1px solid #6b8e23;border-radius:3px;font-size:12px;",u.textContent="Craft";const d=n;u.addEventListener("click",m=>{var g;m.stopPropagation(),(g=this._connection)==null||g.invoke("CraftRecipe",d)}),r.appendChild(o),r.appendChild(u),t.appendChild(r)}}}showFurnaceUI(e,t,n){this.hideCraftingUI(),this.hideFurnaceUI(),this.hideChestUI(),document.exitPointerLock(),this.furnacePosition={x:e,y:t,z:n},this.furnaceUI=document.createElement("div"),this.furnaceUI.id="furnace-ui",this.furnaceUI.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(50,50,50,0.95);color:white;padding:20px;border-radius:8px;z-index:500;width:400px;max-height:80vh;display:flex;flex-direction:column;";const i=document.createElement("div");i.style.cssText="font-size:20px;font-weight:bold;margin-bottom:12px;text-align:center;",i.textContent="Furnace";const r=document.createElement("button");r.style.cssText="position:absolute;top:8px;right:12px;cursor:pointer;background:none;border:none;color:white;font-size:20px;",r.textContent="X",r.addEventListener("click",()=>{this.hideFurnaceUI()});const o=document.createElement("div");o.style.cssText="display:flex;gap:16px;justify-content:center;margin-bottom:12px;align-items:center;";const a=document.createElement("div");a.id="furnace-input-slot",a.style.cssText="width:50px;height:50px;background:rgba(0,0,0,0.4);border:2px solid #555;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#aaa;text-align:center;",a.textContent="Input";const l=document.createElement("div");l.style.cssText="font-size:20px;color:#ff8800;",l.textContent="→";const c=document.createElement("div");c.id="furnace-fuel-slot",c.style.cssText="width:50px;height:50px;background:rgba(0,0,0,0.4);border:2px solid #555;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#aaa;text-align:center;",c.textContent="Fuel";const h=document.createElement("div");h.style.cssText="font-size:20px;color:#ff8800;",h.textContent="→";const u=document.createElement("div");u.id="furnace-output-slot",u.style.cssText="width:50px;height:50px;background:rgba(0,0,0,0.4);border:2px solid #555;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#aaa;text-align:center;",u.textContent="Output",o.appendChild(a),o.appendChild(l),o.appendChild(c),o.appendChild(h),o.appendChild(u);const d=document.createElement("div");d.style.cssText="width:100%;height:16px;background:rgba(0,0,0,0.4);border-radius:8px;margin-bottom:12px;overflow:hidden;";const m=document.createElement("div");m.id="furnace-progress-fill",m.style.cssText="width:0%;height:100%;background:linear-gradient(90deg,#ff4400,#ff8800);border-radius:8px;transition:width 0.5s;",d.appendChild(m);const g=document.createElement("div");g.style.cssText="font-size:14px;font-weight:bold;margin-bottom:6px;color:#ccc;",g.textContent="Smelting Recipes";const _=document.createElement("div");_.id="smelting-recipes-list",_.style.cssText="font-size:12px;overflow-y:auto;flex:1;",_.textContent="Loading recipes...";const p=document.createElement("div");p.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;z-index:499;",p.addEventListener("click",()=>{this.hideFurnaceUI()}),this.furnaceUI.appendChild(r),this.furnaceUI.appendChild(i),this.furnaceUI.appendChild(o),this.furnaceUI.appendChild(d),this.furnaceUI.appendChild(g),this.furnaceUI.appendChild(_),document.body.appendChild(p),document.body.appendChild(this.furnaceUI)}hideFurnaceUI(){this.furnaceUI&&this.furnaceUI.parentNode&&(this.furnaceUI.parentNode.removeChild(this.furnaceUI),this.furnaceUI=null),this.furnacePosition=null}populateSmeltingRecipes(e){if(!this.furnaceUI)return;const t=document.getElementById("smelting-recipes-list");if(t){if(t.innerHTML="",e.length===0){t.textContent="No smelting recipes available.";return}for(let n=0;n<e.length;n++){const i=e[n],r=document.createElement("div");r.style.cssText="display:flex;align-items:center;justify-content:space-between;padding:5px 8px;margin:2px 0;background:rgba(0,0,0,0.3);border-radius:4px;";const o=document.createElement("div");o.style.cssText="flex:1;font-size:12px;",o.textContent=`${this.formatItemName(i.input)} → ${this.formatItemName(i.result)} (${i.cookTime}s)`;const a=document.createElement("button");a.style.cssText="padding:3px 10px;cursor:pointer;background:#8b4513;color:white;border:1px solid #a0522d;border-radius:3px;font-size:11px;",a.textContent="Smelt",a.addEventListener("click",()=>{var l;this.furnacePosition&&((l=this._connection)==null||l.invoke("StartSmelting",i.input,i.result,this.furnacePosition.x,this.furnacePosition.y,this.furnacePosition.z),a.textContent="...",a.disabled=!0)}),r.appendChild(o),r.appendChild(a),t.appendChild(r)}}}updateFurnaceState(e,t,n,i){if(!this.furnaceUI)return;const r=document.getElementById("furnace-input-slot"),o=document.getElementById("furnace-fuel-slot"),a=document.getElementById("furnace-output-slot"),l=document.getElementById("furnace-progress-fill");r&&(r.textContent=e?this.formatItemName(e):"Input",r.style.color=e?"#ffdd44":"#aaa"),o&&(o.textContent=t?this.formatItemName(t):"Fuel",o.style.color=t?"#44dd44":"#aaa"),a&&(a.textContent=n?this.formatItemName(n):"Output",a.style.color=n?"#44aaff":"#aaa"),l&&(l.style.width=`${Math.round(i*100)}%`)}showChestUI(e,t,n){this.hideCraftingUI(),this.hideFurnaceUI(),this.hideChestUI(),document.exitPointerLock(),this.chestPosition={x:e,y:t,z:n},this.chestUI=document.createElement("div"),this.chestUI.id="chest-ui",this.chestUI.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(101,67,33,0.95);color:white;padding:20px;border-radius:8px;z-index:500;width:380px;max-height:80vh;display:flex;flex-direction:column;";const i=document.createElement("div");i.style.cssText="font-size:20px;font-weight:bold;margin-bottom:12px;text-align:center;",i.textContent="Chest";const r=document.createElement("button");r.style.cssText="position:absolute;top:8px;right:12px;cursor:pointer;background:none;border:none;color:white;font-size:20px;",r.textContent="X",r.addEventListener("click",()=>{this.hideChestUI()});const o=document.createElement("div");o.style.cssText="font-size:12px;color:#ccc;margin-bottom:6px;",o.textContent="Chest Inventory";const a=document.createElement("div");a.id="chest-grid",a.style.cssText="display:grid;grid-template-columns:repeat(9,1fr);gap:3px;margin-bottom:16px;";for(let u=0;u<27;u++){const d=document.createElement("div");d.className="chest-slot",d.dataset.slot=String(u),d.style.cssText="width:36px;height:36px;background:rgba(0,0,0,0.4);border:1px solid #555;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:9px;color:#aaa;text-align:center;cursor:pointer;position:relative;",d.textContent="";const m=u;d.addEventListener("click",()=>{var g;this.chestPosition&&((g=this._connection)==null||g.invoke("TakeItemFromChest",m,0,this.chestPosition.x,this.chestPosition.y,this.chestPosition.z))}),a.appendChild(d)}const l=document.createElement("div");l.style.cssText="font-size:12px;color:#ccc;margin-bottom:6px;",l.textContent="Your Inventory (click to store)";const c=document.createElement("div");c.id="chest-inv-grid",c.style.cssText="display:grid;grid-template-columns:repeat(8,1fr);gap:3px;";for(let u=0;u<8;u++){const d=document.createElement("div");d.className="chest-inv-slot",d.dataset.slot=String(u),d.style.cssText="width:36px;height:36px;background:rgba(0,0,0,0.4);border:1px solid #555;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:9px;color:#aaa;text-align:center;cursor:pointer;position:relative;",d.textContent="";const m=u;d.addEventListener("click",()=>{var g;this.chestPosition&&((g=this._connection)==null||g.invoke("MoveItemToChest",m,-1,this.chestPosition.x,this.chestPosition.y,this.chestPosition.z))}),c.appendChild(d)}const h=document.createElement("div");h.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;z-index:499;",h.addEventListener("click",()=>{this.hideChestUI()}),this.chestUI.appendChild(r),this.chestUI.appendChild(i),this.chestUI.appendChild(o),this.chestUI.appendChild(a),this.chestUI.appendChild(l),this.chestUI.appendChild(c),document.body.appendChild(h),document.body.appendChild(this.chestUI)}hideChestUI(){this.chestUI&&this.chestUI.parentNode&&(this.chestUI.parentNode.removeChild(this.chestUI),this.chestUI=null),this.chestPosition=null}updateChestInventory(e){if(!this.chestUI)return;const t=document.getElementById("chest-grid");if(!t)return;const n=t.children;for(let i=0;i<27;i++){const r=n[i];if(e[i]&&e[i].itemId){const o=e[i];if(r.textContent=this.formatItemName(o.itemId),r.style.color="#ffdd44",r.style.fontSize="8px",o.count>1){const a=document.createElement("span");a.style.cssText="position:absolute;bottom:1px;right:2px;font-size:9px;color:white;text-shadow:1px 1px 1px black;",a.textContent=String(o.count),r.appendChild(a)}}else r.textContent="",r.style.color="#aaa",r.style.fontSize="9px"}}updateChestPlayerInventory(e){if(!this.chestUI)return;const t=document.getElementById("chest-inv-grid");if(!t)return;const n=t.children;for(let i=0;i<8;i++){const r=n[i];if(e[i]&&e[i].itemId){const o=e[i];if(r.textContent=this.formatItemName(o.itemId),r.style.color="#44ddff",r.style.fontSize="8px",o.count>1){const a=document.createElement("span");a.style.cssText="position:absolute;bottom:1px;right:2px;font-size:9px;color:white;text-shadow:1px 1px 1px black;",a.textContent=String(o.count),r.appendChild(a)}}else r.textContent="",r.style.color="#aaa",r.style.fontSize="9px"}}hideAllUIs(){this.hideCraftingUI(),this.hideFurnaceUI(),this.hideChestUI(),this.hideCreativeInventory()}setCreativeSelectHandler(e){this.onCreativeSelect=e}showCreativeInventory(e){this.hideCraftingUI(),this.hideFurnaceUI(),this.hideChestUI(),this.hideCreativeInventory(),document.exitPointerLock(),this.creativeEntries=e.filter(d=>d.id>0),this.creativePage=0,this.creativeFilter="",this.creativeInventoryUI=document.createElement("div"),this.creativeInventoryUI.id="creative-inventory-ui",this.creativeInventoryUI.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(40,40,60,0.95);color:white;padding:20px;border-radius:8px;z-index:500;width:520px;max-height:80vh;display:flex;flex-direction:column;";const t=document.createElement("div");t.style.cssText="font-size:20px;font-weight:bold;margin-bottom:12px;text-align:center;display:flex;justify-content:space-between;align-items:center;";const n=document.createElement("span");n.textContent="Creative Inventory";const i=document.createElement("button");i.style.cssText="cursor:pointer;background:none;border:none;color:white;font-size:20px;",i.textContent="X",i.addEventListener("click",()=>{this.hideCreativeInventory()}),t.appendChild(n),t.appendChild(i);const r=document.createElement("input");r.type="text",r.placeholder="Search blocks...",r.style.cssText="width:100%;padding:8px;margin-bottom:12px;background:rgba(0,0,0,0.4);border:1px solid #555;border-radius:4px;color:white;font-size:14px;outline:none;box-sizing:border-box;",r.addEventListener("input",()=>{this.creativeFilter=r.value.toLowerCase(),this.creativePage=0,this.renderCreativeGrid()});const o=document.createElement("div");o.id="creative-grid-container",o.style.cssText="flex:1;overflow-y:auto;";const a=document.createElement("div");a.style.cssText="display:flex;justify-content:center;gap:12px;margin-top:12px;align-items:center;";const l=document.createElement("button");l.style.cssText="padding:6px 16px;cursor:pointer;background:#555;color:white;border:1px solid #777;border-radius:4px;font-size:13px;",l.textContent="← Prev",l.addEventListener("click",()=>{this.creativePage>0&&(this.creativePage--,this.renderCreativeGrid())});const c=document.createElement("span");c.id="creative-page-info",c.style.cssText="font-size:13px;color:#aaa;";const h=document.createElement("button");h.style.cssText="padding:6px 16px;cursor:pointer;background:#555;color:white;border:1px solid #777;border-radius:4px;font-size:13px;",h.textContent="Next →",h.addEventListener("click",()=>{this.creativePage++,this.renderCreativeGrid()}),a.appendChild(l),a.appendChild(c),a.appendChild(h);const u=document.createElement("div");u.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;z-index:499;",u.addEventListener("click",()=>{this.hideCreativeInventory()}),this.creativeInventoryUI.appendChild(t),this.creativeInventoryUI.appendChild(r),this.creativeInventoryUI.appendChild(o),this.creativeInventoryUI.appendChild(a),document.body.appendChild(u),document.body.appendChild(this.creativeInventoryUI),this.renderCreativeGrid()}renderCreativeGrid(){const e=document.getElementById("creative-grid-container");if(!e)return;e.innerHTML="";let t=this.creativeEntries;this.creativeFilter&&(t=this.creativeEntries.filter(c=>c.name.toLowerCase().includes(this.creativeFilter)));const n=32,i=Math.max(1,Math.ceil(t.length/n));this.creativePage>=i&&(this.creativePage=i-1);const r=this.creativePage*n,o=t.slice(r,r+n),a=document.createElement("div");a.style.cssText="display:grid;grid-template-columns:repeat(8,1fr);gap:4px;";for(const c of o){const h=document.createElement("div");h.style.cssText="width:52px;height:52px;background:rgba(0,0,0,0.4);border:2px solid #555;border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;position:relative;transition:border-color 0.1s;";const u=document.createElement("div");u.style.cssText=`width:28px;height:28px;background:${c.color};border-radius:3px;border:1px solid rgba(255,255,255,0.2);`,h.appendChild(u);const d=document.createElement("span");d.style.cssText="font-size:8px;color:#ccc;margin-top:2px;text-align:center;line-height:1.1;max-width:48px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;",d.textContent=c.name.replace(/_/g," "),h.appendChild(d),h.addEventListener("mouseenter",()=>{h.style.borderColor="#aaddff",h.style.background="rgba(100,150,200,0.3)"}),h.addEventListener("mouseleave",()=>{h.style.borderColor="#555",h.style.background="rgba(0,0,0,0.4)"}),h.addEventListener("click",()=>{var m;(m=this.onCreativeSelect)==null||m.call(this,c.id),this.hideCreativeInventory()}),a.appendChild(h)}e.appendChild(a);const l=document.getElementById("creative-page-info");l&&(l.textContent=`${this.creativePage+1} / ${i} (${t.length} items)`)}hideCreativeInventory(){var e,t;if(this.creativeInventoryUI&&this.creativeInventoryUI.parentNode){const n=this.creativeInventoryUI.previousElementSibling;n&&((e=n.style)==null?void 0:e.zIndex)==="499"&&((t=n.parentNode)==null||t.removeChild(n)),this.creativeInventoryUI.parentNode.removeChild(this.creativeInventoryUI),this.creativeInventoryUI=null}}showSettingsPanel(){this.settingsPanel.show()}hideSettingsPanel(){this.settingsPanel.hide()}isSettingsPanelOpen(){return this.settingsPanel.isOpen()}getSettingsPanel(){return this.settingsPanel}updateBreath(e,t){if(this.breathBar||(this.breathBar=document.createElement("div"),this.breathBar.id="breath-bar",this.breathBar.style.cssText="position:fixed;bottom:60px;left:50%;transform:translateX(-50%);display:none;gap:2px;",document.body.appendChild(this.breathBar)),e>=t){this.breathBar.style.display="none";return}this.breathBar.style.display="flex",this.breathBar.innerHTML="";const n=Math.ceil(t/2);for(let i=0;i<n;i++){const r=document.createElement("div"),o=e-i*2;r.style.cssText="width:10px;height:10px;border-radius:50%;border:1px solid #4488ff;",r.style.background=o>0?"#4488ff":"transparent",this.breathBar.appendChild(r)}}updateDebugInfo(e,t,n){if(this.debugInfo.style.display==="none")return;const i=t;this.debugInfo.innerHTML=`
            <div>FPS: ${e}</div>
            <div>XYZ: ${i.x.toFixed(1)} / ${i.y.toFixed(1)} / ${i.z.toFixed(1)}</div>
            <div>Chunks: ${n}</div>
            <div>Memory: N/A</div>
        `}formatItemName(e){return e.replace(/_/g," ").replace(/\b\w/g,t=>t.toUpperCase())}static getDefenseValue(e){switch(e.toLowerCase()){case"leather_helmet":case"leather_chestplate":case"leather_leggings":case"leather_boots":return 1;case"iron_helmet":return 2;case"iron_chestplate":return 6;case"iron_leggings":return 5;case"iron_boots":return 2;case"diamond_helmet":return 3;case"diamond_chestplate":return 8;case"diamond_leggings":return 6;case"diamond_boots":return 3;default:return 0}}updateArmor(e){const t=document.querySelectorAll(".armor-slot");let n=0;for(let r=0;r<4;r++){const o=t[r];if(o)if(e[r]&&e[r].itemId){const a=e[r],l=ki.getDefenseValue(a.itemId);n+=l,o.innerHTML=`<span style="font-size:9px;color:#fff;text-align:center;">${this.formatItemName(a.itemId)}</span>`,o.style.background="rgba(100,150,255,0.3)",o.style.borderColor="#6699ff"}else o.innerHTML=ki.armorSlotNames[r],o.style.background="rgba(0,0,0,0.5)",o.style.borderColor="#555"}const i=document.getElementById("armor-defense");i&&(i.textContent=`Defense: ${n}`)}updateExperience(e,t){const n=document.querySelector(".xp-fill"),i=document.querySelector(".xp-text");if(n){const r=t%100/100*100;n.style.width=`${r}%`}i&&(i.textContent=String(e))}showArmorPanel(){const e=document.getElementById("armor-panel");if(!e)return;e.style.display="block",document.exitPointerLock(),e.querySelectorAll(".armor-slot").forEach(n=>{const i=n;i.onclick=()=>{var o;const r=parseInt(i.dataset.slot||"0");(o=this._connection)==null||o.invoke("UnequipArmor",r)}})}hideArmorPanel(){const e=document.getElementById("armor-panel");e&&(e.style.display="none")}toggleArmorPanel(){const e=document.getElementById("armor-panel");!e||e.style.display==="none"?this.showArmorPanel():this.hideArmorPanel()}};I(ki,"armorSlotNames",["Helmet","Chestplate","Leggings","Boots"]);let $r=ki;class Sg{constructor(){I(this,"gameClient");I(this,"uiManager");this.uiManager=new $r,this.gameClient=new xg(this.uiManager),this.setupEventListeners()}setupEventListeners(){const e=document.getElementById("login-form"),t=document.getElementById("chat-input");e.addEventListener("submit",async n=>{n.preventDefault();const r=document.getElementById("player-name-input").value.trim();if(!r)return;const o=document.getElementById("login-screen");o.style.display="none",await this.gameClient.connect(r)}),t.addEventListener("keydown",n=>{if(n.key==="Enter"){const i=t.value.trim();i&&(this.gameClient.sendChat(i),t.value="",t.style.display="none"),t.blur()}n.key==="Escape"&&(t.style.display="none",t.blur())}),document.addEventListener("keydown",n=>{if((n.key==="t"||n.key==="T")&&t.style.display!=="block"&&(t.style.display="block",t.focus()),n.key==="F3"){n.preventDefault();const i=document.getElementById("debug-info");i.style.display=i.style.display==="none"?"block":"none"}n.key==="Escape"&&(this.uiManager.isSettingsPanelOpen()?this.uiManager.hideSettingsPanel():this.uiManager.hideAllUIs()),(n.key==="o"||n.key==="O")&&(this.uiManager.isSettingsPanelOpen()?this.uiManager.hideSettingsPanel():this.uiManager.showSettingsPanel()),(n.key==="i"||n.key==="I")&&this.gameClient.showCreativeInventory(),(n.key==="p"||n.key==="P")&&this.uiManager.toggleArmorPanel()}),document.addEventListener("respawnRequest",()=>{this.gameClient.respawn()}),document.addEventListener("contextmenu",n=>{document.pointerLockElement&&n.preventDefault()})}}new Sg;
//# sourceMappingURL=index-jeJXnPNc.js.map
