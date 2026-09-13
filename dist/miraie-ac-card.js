function e(e,t,i,o){var s,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(s=e[r])&&(n=(a<3?s(n):a>3?s(t,i,n):s(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),s=new WeakMap;let a=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=s.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(t,e))}return e}toString(){return this.cssText}};const n=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new a("string"==typeof e?e:e+"",void 0,o))(t)})(e):e,{is:r,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,m=globalThis,u=m.trustedTypes,g=u?u.emptyScript:"",v=m.reactiveElementPolyfillSupport,b=(e,t)=>e,_={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},f=(e,t)=>!r(e,t),y={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:f};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=y){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(e,i,t);void 0!==o&&c(this.prototype,e,o)}}static getPropertyDescriptor(e,t,i){const{get:o,set:s}=l(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:o,set(t){const a=o?.call(this);s?.call(this,t),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??y}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...d(e),...h(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(n(e))}else void 0!==e&&t.push(n(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,o)=>{if(i)e.adoptedStyleSheets=o.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of o){const o=document.createElement("style"),s=t.litNonce;void 0!==s&&o.setAttribute("nonce",s),o.textContent=i.cssText,e.appendChild(o)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,i);if(void 0!==o&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:_).toAttribute(t,i.type);this._$Em=e,null==s?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(e,t){const i=this.constructor,o=i._$Eh.get(e);if(void 0!==o&&this._$Em!==o){const e=i.getPropertyOptions(o),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:_;this._$Em=o;const a=s.fromAttribute(t,e.type);this[o]=a??this._$Ej?.get(o)??a,this._$Em=null}}requestUpdate(e,t,i,o=!1,s){if(void 0!==e){const a=this.constructor;if(!1===o&&(s=this[e]),i??=a.getPropertyOptions(e),!((i.hasChanged??f)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:o,wrapped:s},a){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==s||void 0!==a)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===o&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,o=this[t];!0!==e||this._$AL.has(t)||void 0===o||this.C(t,void 0,i,o)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[b("elementProperties")]=new Map,w[b("finalized")]=new Map,v?.({ReactiveElement:w}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x=globalThis,$=e=>e,k=x.trustedTypes,A=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,T="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+C,S=`<${P}>`,j=document,z=()=>j.createComment(""),E=e=>null===e||"object"!=typeof e&&"function"!=typeof e,D=Array.isArray,N="[ \t\n\f\r]",M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,O=/>/g,L=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,F=/"/g,R=/^(?:script|style|textarea|title)$/i,I=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),B=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,V=j.createTreeWalker(j,129);function G(e,t){if(!D(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(t):t}const Y=(e,t)=>{const i=e.length-1,o=[];let s,a=2===t?"<svg>":3===t?"<math>":"",n=M;for(let t=0;t<i;t++){const i=e[t];let r,c,l=-1,d=0;for(;d<i.length&&(n.lastIndex=d,c=n.exec(i),null!==c);)d=n.lastIndex,n===M?"!--"===c[1]?n=H:void 0!==c[1]?n=O:void 0!==c[2]?(R.test(c[2])&&(s=RegExp("</"+c[2],"g")),n=L):void 0!==c[3]&&(n=L):n===L?">"===c[0]?(n=s??M,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,r=c[1],n=void 0===c[3]?L:'"'===c[3]?F:U):n===F||n===U?n=L:n===H||n===O?n=M:(n=L,s=void 0);const h=n===L&&e[t+1].startsWith("/>")?" ":"";a+=n===M?i+S:l>=0?(o.push(r),i.slice(0,l)+T+i.slice(l)+C+h):i+C+(-2===l?t:h)}return[G(e,a+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),o]};class Q{constructor({strings:e,_$litType$:t},i){let o;this.parts=[];let s=0,a=0;const n=e.length-1,r=this.parts,[c,l]=Y(e,t);if(this.el=Q.createElement(c,i),V.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(o=V.nextNode())&&r.length<n;){if(1===o.nodeType){if(o.hasAttributes())for(const e of o.getAttributeNames())if(e.endsWith(T)){const t=l[a++],i=o.getAttribute(e).split(C),n=/([.?@])?(.*)/.exec(t);r.push({type:1,index:s,name:n[2],strings:i,ctor:"."===n[1]?ee:"?"===n[1]?te:"@"===n[1]?ie:X}),o.removeAttribute(e)}else e.startsWith(C)&&(r.push({type:6,index:s}),o.removeAttribute(e));if(R.test(o.tagName)){const e=o.textContent.split(C),t=e.length-1;if(t>0){o.textContent=k?k.emptyScript:"";for(let i=0;i<t;i++)o.append(e[i],z()),V.nextNode(),r.push({type:2,index:++s});o.append(e[t],z())}}}else if(8===o.nodeType)if(o.data===P)r.push({type:2,index:s});else{let e=-1;for(;-1!==(e=o.data.indexOf(C,e+1));)r.push({type:7,index:s}),e+=C.length-1}s++}}static createElement(e,t){const i=j.createElement("template");return i.innerHTML=e,i}}function J(e,t,i=e,o){if(t===B)return t;let s=void 0!==o?i._$Co?.[o]:i._$Cl;const a=E(t)?void 0:t._$litDirective$;return s?.constructor!==a&&(s?._$AO?.(!1),void 0===a?s=void 0:(s=new a(e),s._$AT(e,i,o)),void 0!==o?(i._$Co??=[])[o]=s:i._$Cl=s),void 0!==s&&(t=J(e,s._$AS(e,t.values),s,o)),t}class K{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,o=(e?.creationScope??j).importNode(t,!0);V.currentNode=o;let s=V.nextNode(),a=0,n=0,r=i[0];for(;void 0!==r;){if(a===r.index){let t;2===r.type?t=new Z(s,s.nextSibling,this,e):1===r.type?t=new r.ctor(s,r.name,r.strings,this,e):6===r.type&&(t=new oe(s,this,e)),this._$AV.push(t),r=i[++n]}a!==r?.index&&(s=V.nextNode(),a++)}return V.currentNode=j,o}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,o){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=J(this,e,t),E(e)?e===W||null==e||""===e?(this._$AH!==W&&this._$AR(),this._$AH=W):e!==this._$AH&&e!==B&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>D(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==W&&E(this._$AH)?this._$AA.nextSibling.data=e:this.T(j.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,o="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Q.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(t);else{const e=new K(o,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=q.get(e.strings);return void 0===t&&q.set(e.strings,t=new Q(e)),t}k(e){D(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,o=0;for(const s of e)o===t.length?t.push(i=new Z(this.O(z()),this.O(z()),this,this.options)):i=t[o],i._$AI(s),o++;o<t.length&&(this._$AR(i&&i._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=$(e).nextSibling;$(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,o,s){this.type=1,this._$AH=W,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(e,t=this,i,o){const s=this.strings;let a=!1;if(void 0===s)e=J(this,e,t,0),a=!E(e)||e!==this._$AH&&e!==B,a&&(this._$AH=e);else{const o=e;let n,r;for(e=s[0],n=0;n<s.length-1;n++)r=J(this,o[i+n],t,n),r===B&&(r=this._$AH[n]),a||=!E(r)||r!==this._$AH[n],r===W?e=W:e!==W&&(e+=(r??"")+s[n+1]),this._$AH[n]=r}a&&!o&&this.j(e)}j(e){e===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ee extends X{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===W?void 0:e}}class te extends X{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==W)}}class ie extends X{constructor(e,t,i,o,s){super(e,t,i,o,s),this.type=5}_$AI(e,t=this){if((e=J(this,e,t,0)??W)===B)return;const i=this._$AH,o=e===W&&i!==W||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==W&&(i===W||o);o&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class oe{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){J(this,e)}}const se=x.litHtmlPolyfillSupport;se?.(Q,Z),(x.litHtmlVersions??=[]).push("3.3.3");const ae=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ne extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const o=i?.renderBefore??t;let s=o._$litPart$;if(void 0===s){const e=i?.renderBefore??null;o._$litPart$=s=new Z(t.insertBefore(z(),e),e,void 0,i??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}ne._$litElement$=!0,ne.finalized=!0,ae.litElementHydrateSupport?.({LitElement:ne});const re=ae.litElementPolyfillSupport;re?.({LitElement:ne}),(ae.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ce={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:f},le=(e=ce,t,i)=>{const{kind:o,metadata:s}=i;let a=globalThis.litPropertyMetadata.get(s);if(void 0===a&&globalThis.litPropertyMetadata.set(s,a=new Map),"setter"===o&&((e=Object.create(e)).wrapped=!0),a.set(i.name,e),"accessor"===o){const{name:o}=i;return{set(i){const s=t.get.call(this);t.set.call(this,i),this.requestUpdate(o,s,e,!0,i)},init(t){return void 0!==t&&this.C(o,void 0,e,t),t}}}if("setter"===o){const{name:o}=i;return function(i){const s=this[o];t.call(this,i),this.requestUpdate(o,s,e,!0,i)}}throw Error("Unsupported decorator location: "+o)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function de(e){return(t,i)=>"object"==typeof i?le(e,t,i):((e,t,i)=>{const o=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),o?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function he(e){return de({...e,state:!0,attribute:!1})}const pe=((e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,o)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1],e[0]);return new a(i,e,o)})`
  /* ──────────────────────────────────────────────────────────
     Default Token Layer (Standard Home Assistant)
     ────────────────────────────────────────────────────────── */
  :host {
    --miraie-accent:        var(--primary-color, #f39c12);

    /* Surfaces - color-mix ensures deep contrast in both light & dark themes */
    --m-bg:                 var(--ha-card-background, var(--card-background-color, var(--lovelace-background)));
    --m-surface:            color-mix(in srgb, var(--primary-text-color, #000) 10%, var(--ha-card-background, var(--card-background-color, #fff)));
    --m-surface-hover:      color-mix(in srgb, var(--primary-text-color, #000) 18%, var(--m-surface));
    --m-border:             color-mix(in srgb, var(--primary-text-color, #000) 24%, transparent);

    /* Text */
    --m-text:               var(--primary-text-color, #111111);
    --m-text-2:             color-mix(in srgb, var(--primary-text-color, #000) 80%, transparent);
    --m-on-accent:          var(--text-primary-color, var(--m-bg));

    /* Active state */
    --m-active-bg:          color-mix(in srgb, var(--miraie-accent) 22%, var(--m-surface));
    --m-active-border:      color-mix(in srgb, var(--miraie-accent) 75%, transparent);
  }

  /* ──────────────────────────────────────────────────────────
     Material You Token Layer (Activated via Config)
     ────────────────────────────────────────────────────────── */
  :host([theme="material_you"]) {
    --miraie-accent:        var(--md-sys-color-primary, var(--primary-color, #f39c12));

    --m-bg:                 var(--md-sys-color-surface-variant, var(--md-sys-color-surface, var(--ha-card-background, var(--card-background-color, var(--lovelace-background)))));
    --m-surface:            var(--md-sys-color-surface, color-mix(in srgb, var(--primary-text-color, #000) 10%, var(--ha-card-background, var(--card-background-color, #fff))));
    --m-surface-hover:      color-mix(in srgb, var(--md-sys-color-on-surface, var(--m-text)) 18%, var(--m-surface));
    --m-border:             var(--md-sys-color-outline-variant, var(--md-sys-color-outline, color-mix(in srgb, var(--primary-text-color, #000) 24%, transparent)));

    /* Text */
    --m-text:               var(--md-sys-color-on-surface, var(--primary-text-color, #111111));
    --m-text-2:             var(--md-sys-color-on-surface-variant, color-mix(in srgb, var(--primary-text-color, #000) 80%, transparent));
    --m-on-accent:          var(--md-sys-color-on-primary, var(--text-primary-color, var(--m-bg)));

    /* Active state */
    --m-active-bg:          var(--md-sys-color-secondary-container, color-mix(in srgb, var(--miraie-accent) 22%, var(--m-surface)));
    --m-active-border:      var(--md-sys-color-secondary, color-mix(in srgb, var(--miraie-accent) 75%, transparent));
  }

  ha-card {
    background: var(--m-bg, var(--ha-card-background, var(--card-background-color, #1e1e24)));
    border-radius: 18px;
    padding: 20px 18px 18px;
    color: var(--m-text);
    font-family: inherit;
    overflow: hidden;
  }

  /* ── Header ── */
  .header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 18px;
  }
  .header-left { display: flex; flex-direction: column; gap: 2px; }
  .title-row   { display: flex; align-items: center; gap: 8px; }

  .status-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #e74c3c; flex-shrink: 0;
    transition: background 0.3s;
  }
  .status-dot.online {
    background: #2ecc71;
    box-shadow: 0 0 6px rgba(46, 204, 113, 0.5);
  }

  .title   { font-size: 1.15rem; font-weight: 700; color: var(--m-text); line-height: 1.2; }
  .subtitle { font-size: 0.8rem; font-weight: 600; color: var(--m-text-2); }

  .collapse-btn {
    width: 40px; height: 40px; border-radius: 50%;
    border: 1.5px solid var(--m-border); cursor: pointer; display: flex; align-items: center; justify-content: center;
    background: var(--m-surface); color: var(--m-text-2);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    outline: none;
  }
  .collapse-btn:hover { background: var(--m-surface-hover); color: var(--m-text); }

  .power-btn {
    width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid var(--m-border);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    background: var(--m-surface); color: var(--m-text);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); --mdc-icon-size: 22px;
  }
  .power-btn:hover:not(:disabled):not(.disabled) { background: var(--m-surface-hover); }
  .power-btn.on { 
    background: var(--miraie-accent);
    border-color: var(--miraie-accent);
    color: var(--m-on-accent);
    box-shadow: 0 4px 14px color-mix(in srgb, var(--miraie-accent) 40%, transparent);
  }
  .power-btn:disabled, .power-btn.disabled { opacity: 0.55; cursor: not-allowed; }

  /* ── Temperature block ── */
  .temp-block {
    background: var(--m-surface); border: 1.5px solid var(--m-border);
    border-radius: 16px;
    padding: 16px 20px;
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 22px;
  }
  .temp-btn {
    width: 40px; height: 40px; border-radius: 50%; border: 1.5px solid var(--m-border);
    background: var(--m-bg); color: var(--m-text); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.18s; --mdc-icon-size: 20px;
  }
  .temp-btn:hover:not(:disabled):not(.disabled) { background: var(--m-surface-hover); }
  .temp-btn:disabled, .temp-btn.disabled { opacity: 0.55; cursor: not-allowed; }
  .temp-center { text-align: center; }
  .temp-value  { font-size: 2rem; font-weight: 800; letter-spacing: -1px; color: var(--m-text); }
  .temp-meta {
    display: flex; align-items: center; justify-content: center;
    gap: 16px; margin-top: 8px;
  }
  .temp-meta-item {
    display: flex; align-items: center; gap: 6px;
    font-size: 0.95rem; font-weight: 600; color: var(--m-text);
  }
  .temp-meta-item ha-icon { --mdc-icon-size: 16px; color: var(--m-text-2); }

  /* ── Generic section ── */
  .section { margin-bottom: 22px; }
  .section-title {
    font-size: 0.75rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--m-text); opacity: 0.9; margin-bottom: 8px;
  }

  /* ── Connection Controls & Status ── */
  .connection-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .connection-switches {
    flex: 1;
  }
  .connection-status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.76rem;
    color: var(--m-text-2);
    background: transparent;
    border: none;
    padding: 0;
    --mdc-icon-size: 14px;
  }

  /* ── 2.0 Transport Status Strip ── */
  .transport-strip {
    display: flex; align-items: center; justify-content: space-between;
    background: var(--m-surface); border: 1px solid var(--m-border);
    border-radius: 12px; padding: 4px; gap: 4px;
  }
  .transport-item {
    flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 8px 6px; border-radius: 8px; border: none; background: transparent;
    color: var(--m-text); font-size: 0.78rem; font-weight: 700; cursor: pointer;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;
    transition: all 0.18s ease; --mdc-icon-size: 15px;
  }
  .transport-item:hover:not(:disabled):not(.disabled) {
    background: var(--m-surface-hover);
  }
  .transport-item.active {
    background: var(--miraie-accent);
    color: var(--m-on-accent); font-weight: 800;
    box-shadow: 0 0 16px color-mix(in srgb, var(--miraie-accent) 55%, transparent), 0 2px 8px color-mix(in srgb, var(--miraie-accent) 35%, transparent);
  }
  .transport-item:disabled, .transport-item.disabled {
    opacity: 0.5; cursor: not-allowed;
  }

  /* ── Segmented Control Bar (Modes & Presets) ── */
  .segmented-bar {
    display: flex; align-items: center;
    background: var(--m-surface); border: 1px solid var(--m-border);
    border-radius: 12px; padding: 4px; gap: 4px;
  }
  .segmented-item {
    flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 9px 8px; border-radius: 8px; border: none; background: transparent;
    color: var(--m-text-2); font-size: 0.82rem; font-weight: 700; cursor: pointer;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;
    transition: all 0.2s ease; --mdc-icon-size: 16px;
  }
  .segmented-item:hover:not(:disabled):not(.disabled) {
    background: var(--m-surface-hover); color: var(--m-text);
  }
  .segmented-item.active {
    background: var(--miraie-accent);
    color: var(--m-on-accent); font-weight: 800;
    box-shadow: 0 0 16px color-mix(in srgb, var(--miraie-accent) 55%, transparent), 0 2px 8px color-mix(in srgb, var(--miraie-accent) 35%, transparent);
  }
  .segmented-item:disabled, .segmented-item.disabled {
    opacity: 0.45; cursor: not-allowed;
  }

  /* ── Fan & Swing Setting Tiles ── */
  .setting-tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(85px, 1fr));
    gap: 8px;
  }
  .setting-tile {
    display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between;
    padding: 10px 12px; border-radius: 12px;
    border: 1px solid var(--m-border); background: var(--m-surface);
    cursor: pointer; transition: all 0.18s ease; text-align: left; min-width: 0;
  }
  .setting-tile:hover:not(:disabled):not(.disabled) {
    background: var(--m-surface-hover);
    border-color: color-mix(in srgb, var(--miraie-accent) 40%, var(--m-border));
  }
  .setting-tile.active {
    background: var(--m-active-bg);
    border-color: var(--m-active-border);
  }
  .setting-tile:disabled, .setting-tile.disabled {
    opacity: 0.5; cursor: not-allowed;
  }
  .setting-tile-label {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.68rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.05em; color: var(--m-text-2);
  }
  .setting-tile-label ha-icon { --mdc-icon-size: 13px; color: var(--m-text-2); }
  .setting-tile-value-row {
    display: flex; align-items: center; justify-content: space-between; width: 100%;
    margin-top: 6px;
  }
  .setting-tile-value {
    font-size: 0.92rem; font-weight: 800; color: var(--m-text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .setting-tile-chevron {
    --mdc-icon-size: 14px; color: var(--m-text-2);
    transition: transform 0.2s ease; flex-shrink: 0;
  }
  .setting-tile.active .setting-tile-chevron {
    transform: rotate(180deg);
    color: var(--miraie-accent);
  }

  /* ── Action Buttons / Pills ── */
  .pills {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(75px, 1fr));
    gap: 8px;
  }
  .pill {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 10px 8px; border-radius: 12px;
    border: 1px solid var(--m-border);
    background: var(--m-surface); color: var(--m-text);
    font-size: 0.82rem; font-weight: 700; cursor: pointer; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis; min-width: 0;
    transition: all 0.18s ease; --mdc-icon-size: 15px;
  }
  .pill:hover:not(:disabled):not(.disabled) {
    background: var(--m-surface-hover);
    border-color: color-mix(in srgb, var(--miraie-accent) 40%, var(--m-border));
  }
  .pill.active {
    background: var(--m-active-bg);
    border-color: var(--m-active-border);
    color: color-mix(in srgb, var(--miraie-accent) 85%, #000);
    font-weight: 800;
  }
  .pill:disabled, .pill.disabled {
    opacity: 0.55;
    cursor: not-allowed;
    color: color-mix(in srgb, var(--m-text) 65%, transparent);
    background: color-mix(in srgb, var(--primary-text-color, #000) 4%, var(--m-surface));
    border-color: color-mix(in srgb, var(--primary-text-color, #000) 14%, transparent);
  }
  .pill.active:disabled, .pill.active.disabled,
  .gh-chip.active[style*="not-allowed"] {
    opacity: 0.8;
    cursor: not-allowed;
    background: color-mix(in srgb, var(--miraie-accent) 18%, var(--m-surface));
    border-color: color-mix(in srgb, var(--miraie-accent) 55%, transparent);
    color: color-mix(in srgb, var(--miraie-accent) 85%, #000);
  }

  @media (max-width: 450px) {
    .connection-status-pill { padding: 8px 8px; font-size: 0.72rem; gap: 4px; border-radius: 10px; }
    .connection-status-pill ha-icon { --mdc-icon-size: 13px; }
    .transport-item { padding: 7px 4px; font-size: 0.72rem; gap: 3px; }
    .transport-item ha-icon { --mdc-icon-size: 13px; }
    .segmented-item { padding: 8px 4px; font-size: 0.76rem; gap: 4px; }
    .segmented-item ha-icon { --mdc-icon-size: 14px; }
    .setting-tile { padding: 8px 10px; }
    .setting-tile-value { font-size: 0.85rem; }
    .pills {
      gap: 6px;
      grid-template-columns: repeat(auto-fit, minmax(65px, 1fr));
    }
    .pill { padding: 8px 4px; font-size: 0.74rem; gap: 4px; border-radius: 10px; }
    .pill ha-icon { --mdc-icon-size: 13px; flex-shrink: 0; }
  }

  /* ── Picker panel (fan / swing) ── */
  .picker-panel {
    margin-top: 8px; border-radius: 14px;
    background: var(--m-surface); border: 1px solid var(--m-border);
    padding: 14px; display: flex; flex-wrap: wrap; gap: 8px;
    animation: slideDown 0.15s ease;
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .picker-opt {
    padding: 8px 16px; border-radius: 16px;
    border: 1px solid var(--m-border);
    background: transparent; color: var(--m-text-2);
    font-size: 0.85rem; cursor: pointer; transition: all 0.15s;
  }
  .picker-opt:hover { background: var(--m-surface-hover); }
  .picker-opt.sel {
    background: var(--m-active-bg);
    border-color: var(--m-active-border);
    color: var(--miraie-accent); font-weight: 600;
  }

  /* ── Step slider (Convertible mode) ── */
  .step-slider-wrap {
    margin-top: 8px; border-radius: 14px;
    background: var(--m-surface); border: 1px solid var(--m-border);
    padding: 16px 16px 12px;
    animation: slideDown 0.15s ease;
  }
  .step-slider-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 18px;
  }
  .step-slider-title { font-size: 0.82rem; font-weight: 600; }
  .step-slider-val { font-size: 0.9rem; font-weight: 800; color: var(--miraie-accent); }
  .step-track-outer {
    position: relative; height: 4px; margin: 16px 6px 28px;
  }
  .step-track-bg {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: var(--m-border); border-radius: 2px;
  }
  .step-track-fill {
    height: 100%; background: var(--miraie-accent); border-radius: 2px;
    transition: width 0.3s ease;
  }
  .step-notches {
    position: absolute; top: -4px; left: 0; width: 100%; height: 12px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .notch-wrapper {
    position: relative; display: flex; justify-content: center; width: 12px; height: 12px;
  }
  .step-notch {
    width: 12px; height: 12px; border-radius: 50%; padding: 0;
    background: var(--m-surface-hover); border: 2px solid var(--m-border);
    cursor: pointer; transition: all 0.2s;
  }
  .step-notch:hover:not(:disabled) { transform: scale(1.3); }
  .step-notch.filled { background: var(--miraie-accent); border-color: var(--miraie-accent); }
  .step-notch.current {
    transform: scale(1.4); background: var(--miraie-accent);
    border-color: var(--m-surface); box-shadow: 0 0 0 1px var(--miraie-accent);
  }
  .step-notch:disabled { cursor: not-allowed; opacity: 0.4; }
  
  .notch-label {
    position: absolute; top: 16px; font-size: 0.65rem; color: var(--m-text-2); font-weight: 600;
  }
  .notch-label.current { color: var(--miraie-accent); font-weight: 700; }
  .step-label { font-size: 0.65rem; color: var(--m-text-2); }

  /* ── Toggle Cards (controls) ── */
  .toggles { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .toggle-card {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 12px; border-radius: 14px;
    border: 1px solid var(--m-border); background: var(--m-surface);
    cursor: pointer; transition: background 0.15s;
    overflow: hidden;
  }
  .toggle-card:hover:not(.disabled) { background: var(--m-surface-hover); }
  .toggle-card.disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(1); }
  .toggle-card ha-switch { pointer-events: none; }
  .toggle-left { display: flex; align-items: center; gap: 9px; }
  .toggle-icon {
    width: 32px; height: 32px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    background: var(--m-surface-hover); color: var(--m-text-2);
    --mdc-icon-size: 17px;
  }
  .toggle-icon.active { background: var(--m-active-bg); color: var(--miraie-accent); }
  .toggle-label { font-size: 0.8rem; }
  .toggle-action { --mdc-icon-size: 18px; color: var(--m-text-2); margin-right: 2px; }

  /* ── Filter Alert Banner ── */
  .alert-banner {
    border-radius: 14px; border: 1px solid rgba(244,67,54,0.35);
    background: rgba(244,67,54,0.06); padding: 12px 14px;
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px;
  }
  .alert-left { display: flex; align-items: center; gap: 9px; }
  .alert-icon { color: var(--error-color, #f44336); --mdc-icon-size: 20px; }
  .alert-text { font-size: 0.82rem; font-weight: 700; color: var(--error-color, #f44336); }
  .alert-hint { font-size: 0.72rem; color: var(--error-color, #f44336); }

  /* ── Energy Cards ── */
  .energy-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .energy-card {
    flex: 1; border-radius: 14px;
    background: var(--m-surface); border: 1px solid var(--m-border);
    padding: 12px 14px; cursor: pointer; transition: background 0.15s;
  }
  .energy-card:hover { background: var(--m-surface-hover); }
  .energy-label {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.7rem; font-weight: 600; color: var(--m-text-2);
    text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;
  }
  .energy-label ha-icon { --mdc-icon-size: 14px; color: var(--miraie-accent); }
  .energy-value-row { display: flex; align-items: baseline; gap: 4px; }
  .energy-value { font-size: 1.4rem; font-weight: 800; }
  .energy-unit  { font-size: 0.75rem; color: var(--m-text-2); }

  /* ── Footer ── */
  .footer {
    display: flex; align-items: center; justify-content: center;
    gap: 5px; padding-top: 12px; border-top: 1px solid var(--m-border);
    margin-top: 6px; font-size: 0.72rem; color: var(--m-text-2);
  }
  .footer ha-icon { --mdc-icon-size: 13px; }

  /* ── Error ── */
  .error { padding: 20px; color: var(--error-color, #f44336); text-align: center; font-size: 0.85rem; }

  /* ──────────────────────────────────────────────────────────
     Compact View (Google Home Style)
     ────────────────────────────────────────────────────────── */
  /* ── Compact Views: Classic vs Google Home ── */
  .compact-card {
    cursor: pointer;
    transition: all 0.2s ease;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* Classic Compact */
  .compact-card.classic {
    border-radius: 16px;
    border: 1px solid var(--m-border);
    background: var(--m-bg);
    padding: 16px;
  }
  .compact-card.classic .compact-icon-btn {
    width: 38px; height: 38px; border-radius: 10px;
    border: 1px solid var(--m-border); cursor: pointer; display: flex; align-items: center; justify-content: center;
    background: var(--m-surface); color: var(--m-text);
    transition: all 0.2s ease; flex-shrink: 0;
  }
  .compact-card.classic .compact-icon-btn.on {
    background: var(--miraie-accent);
    color: var(--m-on-accent, #ffffff);
    border-color: var(--miraie-accent);
    box-shadow: 0 4px 14px color-mix(in srgb, var(--miraie-accent) 40%, transparent);
  }
  .compact-card.classic .compact-action-btn {
    width: 38px; height: 38px; border-radius: 10px;
    border: 1px solid var(--m-border); cursor: pointer; display: flex; align-items: center; justify-content: center;
    background: var(--m-surface); color: var(--m-text);
    transition: all 0.2s ease;
  }
  .compact-card.classic .compact-value {
    font-size: 2.4rem;
    font-weight: 800;
    color: var(--m-text);
  }

  /* Google Home Compact */
  .compact-card.google-home {
    background: var(--m-bg);
    border-radius: 28px;
    border: none;
    box-shadow: none;
    padding: 16px;
  }
  .compact-card.google-home .compact-icon-btn {
    width: 40px; height: 40px; border-radius: 50%;
    border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
    background: rgba(128, 128, 128, 0.15); color: var(--m-text-2);
    transition: all 0.2s ease; flex-shrink: 0;
  }
  .compact-card.google-home .compact-icon-btn.on {
    background: var(--m-active-bg);
    color: var(--miraie-accent);
  }
  .compact-card.google-home .compact-action-btn {
    width: 40px; height: 40px; border-radius: 50%;
    border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
    background: rgba(128, 128, 128, 0.15); color: var(--m-text);
    transition: all 0.2s ease;
  }
  .compact-card.google-home .compact-value {
    font-size: 2.5rem;
    font-weight: 400;
    color: var(--m-text);
  }

  .compact-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .compact-title {
    font-size: 1rem;
    font-weight: 600;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--m-text);
  }
  .compact-chevron {
    color: var(--m-text-2);
    opacity: 0.7;
  }
  .compact-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .compact-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px;
  }
  .compact-icon-btn:hover { background: var(--m-surface-hover); }
  .compact-icon-btn.disabled { opacity: 0.4; cursor: not-allowed; }
  .compact-action-btn:hover { background: var(--m-surface-hover); }
  .compact-action-btn:disabled, .compact-action-btn.disabled { opacity: 0.3; cursor: not-allowed; }
  .compact-subtitle {
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--m-text-2);
  }

  /* ──────────────────────────────────────────────────────────
     Google Home Full View
     ────────────────────────────────────────────────────────── */
  .gh-full-card {
    background: var(--m-bg);
    border-radius: 28px;
    border: none;
    box-shadow: none;
    padding: 16px;
    box-sizing: border-box;
  }
  .gh-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 24px;
  }
  .gh-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .gh-icon {
    color: var(--m-text-2);
    --mdc-icon-size: 20px;
  }
  .gh-title {
    font-weight: 500;
    font-size: 1.05rem;
    color: var(--m-text);
  }
  .gh-power-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--m-text-2);
    cursor: pointer;
    transition: 0.2s;
    outline: none;
  }
  .gh-power-btn:hover {
    background: rgba(128, 128, 128, 0.15);
  }
  .gh-power-btn.on {
    background: var(--m-active-bg);
    color: var(--miraie-accent);
  }
  .gh-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 0 16px 0;
  }
  .gh-value-large {
    font-size: 5rem;
    font-weight: 400;
    line-height: 1.1;
    color: var(--m-text);
  }
  .gh-subtitle-large {
    font-size: 1rem;
    font-weight: 500;
    color: var(--m-text-2);
    margin-top: 8px;
  }
  .gh-mode-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--m-text);
    letter-spacing: 0.02em;
  }
  .gh-action-row {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 40px;
  }
  .gh-circular-btn {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: rgba(128, 128, 128, 0.15);
    border: none;
    color: var(--m-text);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.2s;
    --mdc-icon-size: 32px;
  }
  .gh-circular-btn:hover {
    background: rgba(128, 128, 128, 0.25);
  }
  .gh-circular-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .gh-select-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-bottom: 8px;
  }
  .gh-select-wrapper {
    flex: 1 1 calc(33.33% - 8px);
    min-width: 120px;
    position: relative;
  }
  .gh-select-wrapper.active {
    z-index: 100;
  }
  .gh-custom-select {
    width: 100%;
    background: rgba(128, 128, 128, 0.15);
    border-radius: 20px;
    border: none;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px 0 16px;
    color: var(--m-text);
    font-size: 0.95rem;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  .gh-custom-select span,
  .gh-custom-select ha-icon {
    pointer-events: none;
  }
  .gh-custom-select ha-icon {
    color: var(--m-text-2);
    --mdc-icon-size: 20px;
  }
  .gh-dropdown-menu {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 0;
    width: 100%;
    background: var(--m-surface, var(--card-background-color));
    border: 1px solid rgba(128, 128, 128, 0.2);
    border-radius: 16px;
    overflow: hidden;
    z-index: 10;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    display: flex;
    flex-direction: column;
  }
  .gh-dropdown-item {
    width: 100%;
    text-align: left;
    border: none;
    background: transparent;
    font-family: inherit;
    padding: 12px 16px;
    font-size: 0.95rem;
    color: var(--m-text);
    transition: 0.2s;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .gh-dropdown-item:hover {
    background: rgba(128, 128, 128, 0.1);
  }
  .gh-dropdown-item.active {
    color: var(--miraie-accent);
    background: rgba(128, 128, 128, 0.05);
  }
  .gh-extra-chips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    padding-top: 16px;
  }
  .gh-footer-text {
    text-align: center;
    font-size: 0.75rem;
    color: var(--m-text-2);
    margin-top: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    opacity: 0.6;
    --mdc-icon-size: 14px;
  }
  .gh-chip {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: 16px;
    background: rgba(128, 128, 128, 0.15);
    color: var(--m-text-2);
    font-size: 0.8rem;
    cursor: pointer;
    transition: 0.2s;
    --mdc-icon-size: 16px;
  }
  .gh-chip:hover {
    background: rgba(128, 128, 128, 0.25);
  }
  .gh-chip.active {
    color: var(--miraie-accent);
  }
  .gh-chip.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .gh-chip-text {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: 16px;
    background: rgba(128, 128, 128, 0.15);
    color: var(--m-text-2);
    font-size: 0.8rem;
    --mdc-icon-size: 16px;
  }
  .footer-telemetry-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid var(--m-border);
    font-size: 0.76rem;
    color: var(--m-text-2);
    flex-wrap: wrap;
  }
  .connection-status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.76rem;
    color: var(--m-text-2);
  }
`,me={type:"miraie-ac-card",name:"Panasonic AC India Card",description:"A premium thermostat card for Indian-market Panasonic MirAIe AC units",preview:!0,domain:"climate",domains:["climate"],documentationURL:"https://github.com/selvakk2k/panasonic-ac-card-in"};window.customCards=window.customCards||[];const ue=window.customCards.findIndex(e=>"miraie-ac-card"===e.type||"custom:miraie-ac-card"===e.type||"miraie-ac-card-in"===e.type||"custom:miraie-ac-card-in"===e.type||"panasonic-ac-card-in"===e.type||"custom:panasonic-ac-card-in"===e.type);function ge(e){const t=/^cv[\s_]+(\d+)$/.exec((e??"").trim());return t?parseInt(t[1],10):-1}function ve(e){const t=Number(e);return isNaN(t)?String(e):t.toFixed(2)}ue>=0?window.customCards[ue]=me:window.customCards.push(me);let be=class extends ne{constructor(){super(...arguments),this._openPanel=null,this._expanded=!1,this._ghDropdown=null,this._handleWindowClick=e=>{const t=e.composedPath();this._ghDropdown&&!t.includes(this)&&(this._ghDropdown=null)}}static get styles(){return pe}connectedCallback(){super.connectedCallback(),window.addEventListener("click",this._handleWindowClick)}disconnectedCallback(){window.removeEventListener("click",this._handleWindowClick),super.disconnectedCallback()}static getConfigForm(){return{schema:[{name:"entity",required:!0,selector:{entity:{domain:"climate",integration:"miraie_in"}}},{name:"name",selector:{text:{}}},{name:"theme",selector:{select:{options:[{label:"Default HA Theme",value:"default"},{label:"Material You (Optimized for Material 3 Theme)",value:"material_you"}]}}},{name:"layout",selector:{select:{options:[{label:"Default (Full)",value:"default"},{label:"Compact (Expandable)",value:"compact"}]}}},{name:"full_layout",selector:{select:{options:[{label:"Classic",value:"default"},{label:"Google Home",value:"google_home"}]}}},{name:"",type:"expandable",title:"Theming & Colors",icon:"mdi:palette",schema:[{name:"accent_color",label:"Accent Color",selector:{ui_color:{}}},{name:"main_color",label:"Background Color",selector:{ui_color:{}}}]},{name:"",type:"expandable",title:"Display Sensors",icon:"mdi:thermometer",schema:[{name:"room_temp_sensor",selector:{entity:{domain:"sensor",device_class:"temperature"}}},{name:"humidity_sensor",selector:{entity:{domain:"sensor",device_class:"humidity"}}}]},{name:"",type:"expandable",title:"2.0 Hybrid Transport Architecture (Auto-Discovered if blank)",icon:"mdi:swap-horizontal-circle-outline",schema:[{name:"hybrid_submode_switch",selector:{entity:{domain:"switch",integration:"miraie_in"}}},{name:"active_backend_switch",selector:{entity:{domain:"switch",integration:"miraie_in"}}},{name:"ir_blaster_sensor",selector:{entity:{domain:["binary_sensor","infrared","remote"]}}},{name:"cloud_mqtt_sensor",selector:{entity:{domain:"binary_sensor",integration:"miraie_in"}}},{name:"control_source_sensor",selector:{entity:{domain:"sensor",integration:"miraie_in"}}}]},{name:"",type:"expandable",title:"Convertible & Controls",icon:"mdi:toggle-switch-outline",schema:[{name:"nanoe_switch",selector:{entity:{domain:"switch",integration:"miraie_in"}}},{name:"display_switch",selector:{entity:{domain:"switch",integration:"miraie_in"}}},{name:"coil_clean_button",selector:{entity:{domain:"button",integration:"miraie_in"}}},{name:"coil_cleaning_sensor",selector:{entity:{domain:"binary_sensor",integration:"miraie_in"}}},{name:"filter_alert_sensor",selector:{entity:{domain:"binary_sensor",integration:"miraie_in"}}}]},{name:"",type:"expandable",title:"Diagnostics & Energy",icon:"mdi:chart-line",schema:[{name:"rssi_sensor",selector:{entity:{domain:"sensor",integration:"miraie_in"}}},{name:"energy_today_sensor",selector:{entity:{domain:"sensor",integration:"miraie_in"}}},{name:"energy_yesterday_sensor",selector:{entity:{domain:"sensor",integration:"miraie_in"}}}]}]}}static getStubConfig(e,t,i){let o="";return t&&t.length&&(o=t.find(e=>e.startsWith("climate."))||""),!o&&i&&i.length&&(o=i.find(e=>e.startsWith("climate."))||""),!o&&e&&e.states&&(o=Object.keys(e.states).find(e=>e.startsWith("climate."))||""),{type:"custom:miraie-ac-card",entity:o}}setConfig(e){if(!e)throw new Error("Invalid configuration");this._config={...e},this._openPanel=null}updated(e){if(super.updated(e),e.has("_config")){const e=this._config?.theme||"default";this.getAttribute("theme")!==e&&this.setAttribute("theme",e),this._config?.accent_color?(this.style.setProperty("--appliance-accent",this._config.accent_color),this.style.setProperty("--m-accent",this._config.accent_color)):(this.style.removeProperty("--appliance-accent"),this.style.removeProperty("--m-accent")),this._config?.main_color?(this.style.setProperty("--appliance-bg",this._config.main_color),this.style.setProperty("--m-bg",this._config.main_color)):(this.style.removeProperty("--appliance-bg"),this.style.removeProperty("--m-bg"))}}shouldUpdate(e){if(e.has("_config")||e.has("_openPanel")||e.has("_expanded")||e.has("_ghDropdown"))return!0;if(e.has("hass")&&this._config){const t=e.get("hass");if(!t)return!0;const i=this._config;if(!i.entity)return!0;const o=i.entity.replace(/^climate\./,""),s=Object.keys(this.hass.states);for(const e of s)if((e===i.entity||e.includes(o))&&t.states[e]!==this.hass.states[e])return!0;return!1}return!1}render(){if(!this.hass||!this._config)return null;const e=this._config,t=e.entity,i=t?this.hass.states[t]:void 0;if(!i)return I`
        <ha-card class="m-card" style="padding: 24px; text-align: center; color: var(--appliance-text-2, var(--secondary-text-color, #8e8e93));">
          <ha-icon icon="mdi:air-conditioner" style="--mdc-icon-size: 40px; margin-bottom: 8px; opacity: 0.6; color: var(--miraie-accent, var(--primary-color, #f39c12));"></ha-icon>
          <div style="font-weight: 500; font-size: 15px; color: var(--appliance-text-1, var(--primary-text-color, inherit));">MirAIe AC Card</div>
          <div style="font-size: 13px; margin-top: 4px;">
            ${t?I`Entity not found: <code>${t}</code>`:"Please select a Panasonic MirAIe climate entity in the card editor."}
          </div>
        </ha-card>
      `;const o=i.attributes,s="unavailable"!==i.state&&"unknown"!==i.state,a="off"!==i.state&&s,n=e.name||o.friendly_name||"AC",r=o.temperature,c=o.min_temp??16,l=o.max_temp??30,d=o.preset_mode,h="eco"===d?16:c,p="eco"===d?30:l,m=i.state,u=o.fan_mode,g=o.swing_mode,v=o.swing_horizontal_mode,b=e.room_temp_sensor?this.hass.states[e.room_temp_sensor]:void 0;let _=b?b.state:o.current_temperature;null==_||isNaN(Number(_))||(_=Number(_).toFixed(1));const f=e.humidity_sensor?this.hass.states[e.humidity_sensor]:void 0;let y=f?f.state:void 0;null==y||isNaN(Number(y))||(y=Number(y).toFixed(1));const w=e.nanoe_switch?this.hass.states[e.nanoe_switch]:void 0,x=e.display_switch?this.hass.states[e.display_switch]:void 0,$=e.coil_clean_button?this.hass.states[e.coil_clean_button]:void 0,k=e.coil_cleaning_sensor?this.hass.states[e.coil_cleaning_sensor]:void 0,A=e.filter_alert_sensor?this.hass.states[e.filter_alert_sensor]:void 0,T=e.rssi_sensor?this.hass.states[e.rssi_sensor]:void 0,C=e.energy_today_sensor?this.hass.states[e.energy_today_sensor]:void 0,P=e.energy_yesterday_sensor?this.hass.states[e.energy_yesterday_sensor]:void 0,S="on"===k?.state,j=e.entity.replace(/^climate\./,""),z=(e,t,i)=>{if(e&&this.hass.states[e])return this.hass.states[e];for(const e of i){const i=`${t}.${e}`;if(this.hass.states[i])return this.hass.states[i]}const o=Object.keys(this.hass.states);for(const e of i){const i=o.find(i=>i.startsWith(`${t}.${j}_`)&&i.includes(e));if(i)return this.hass.states[i]}},E=z(e.hybrid_submode_switch,"switch",[`${j}_hybrid_automatic_control`,`${j}_hybrid_submode`,`${j}_hybrid_control`,"hybrid"]),D=z(e.active_backend_switch,"switch",[`${j}_primary_transport_backend_cloud`,`${j}_primary_transport_backend`,`${j}_active_backend`,"backend","transport"]),N=z(e.ir_blaster_sensor,"binary_sensor",[`${j}_ir_blaster_available`,`${j}_ir_transmitter_available`,`${j}_ir_blaster_transmitter_availability`,"ir_blaster"]),M=z(e.cloud_mqtt_sensor,"binary_sensor",[`${j}_cloud_mqtt_connected`,`${j}_cloud_mqtt`,"cloud_mqtt"]),H=z(e.control_source_sensor,"sensor",[`${j}_last_controlled_via`,`${j}_control_source`,"last_controlled_via"]);let O=[],L="cv_";o.preset_modes&&o.preset_modes.some(e=>/^cv[\s_]/.test(e))&&(O=o.preset_modes.filter(e=>/^cv[\s_]/.test(e)),L=O[0].substring(0,3),O.includes(`${L}0`)||O.push(`${L}0`));let U=o.preset_mode&&/^cv[\s_]/.test(o.preset_mode)?o.preset_mode:`${L}0`;const F=O.filter(e=>ge(e)>0).sort((e,t)=>ge(e)-ge(t)),R=[`${L}0`,...F],B=R.indexOf(U),W=(q=O,q?.length?q.some(e=>60===ge(e))&&q.some(e=>50===ge(e))?"Converti8":"Converti7":"Convertible");var q;const V=F.length>0?B/(R.length-1)*100:0;let G="";if(this._config.accent_color)if(Array.isArray(this._config.accent_color))G=`rgb(${this._config.accent_color.join(",")})`;else if("string"==typeof this._config.accent_color){const e=this._config.accent_color.toLowerCase();G="primary"===e?"var(--primary-color)":"accent"===e?"var(--accent-color)":/^[a-z-]+$/.test(e)?`var(--${e}-color, ${e})`:e}let Y="";if(this._config.main_color)if(Array.isArray(this._config.main_color))Y=`rgb(${this._config.main_color.join(",")})`;else if("string"==typeof this._config.main_color){const e=this._config.main_color.toLowerCase();Y="primary"===e?"var(--primary-color)":"accent"===e?"var(--accent-color)":/^[a-z-]+$/.test(e)?`var(--${e}-color, ${e})`:e}const Q=`${G?`--miraie-accent: ${G}; `:""}${Y?`--m-bg: ${Y}; `:""}`;if("compact"===e.layout&&!this._expanded)return this._renderCompact(i,n,a,r,_,y,m,c,l,Q);if("google_home"===e.full_layout)return this._renderGoogleHomeFull(i,n,a,r,_,y,m,c,l,Q);let J=[];if(a){if(J.push(this._modeLabel(m)),d&&"none"!==d)if(/^cv[\s_]/.test(d)){const e=ge(d);J.push(0===e?"Normal Limit":e+"% Limit")}else J.push(this._presetLabel(d));J.push(`Fan: ${u??"Auto"}`)}return I`
      <ha-card style="${Q}">

        <!-- ── Header ── -->
        <div class="header">
          <div class="header-left">
            <div class="title-row">
              <ha-icon class="header-icon" icon="mdi:air-conditioner"></ha-icon>
              <span class="title">${n}</span>
            </div>
            <div class="subtitle">
              ${s?a?J.join(" • "):"Off":"Offline"}
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            ${"compact"===e.layout?I`
              <button class="collapse-btn" title="Collapse card" @click=${()=>{this._haptic("light"),this._expanded=!1}}>
                <ha-icon icon="mdi:chevron-up"></ha-icon>
              </button>
            `:""}
            <button
              class="power-btn ${a?"on":""} ${!s||S?"disabled":""}"
              title="${S?"Power cannot be toggled while coil cleaning is active":s?"Toggle Power":"Device is offline"}"
              @click=${()=>{S?this._showToast("Power cannot be toggled while coil cleaning is active"):s?this._togglePower(i):this._showToast("Device is offline")}}
            >
              <ha-icon icon="mdi:power"></ha-icon>
            </button>
          </div>
        </div>

        <!-- ── Temperature ── -->
        <div class="temp-block">
          <button
            class="temp-btn ${!a||"fan_only"===m||null!=r&&Number(r)<=Number(h)||S?"disabled":""}"
            title="${S?"Temperature cannot be adjusted while coil cleaning is active":a?"fan_only"===m?"Temperature cannot be adjusted in Fan Only mode":null!=r&&Number(r)<=Number(h)?`Minimum temperature reached (${h}°)`:"Decrease Temperature":"Turn on the AC to adjust temperature"}"
            @click=${()=>{S?this._showToast("Temperature cannot be adjusted while coil cleaning is active"):a?"fan_only"===m?this._showToast("Temperature cannot be adjusted in Fan Only mode"):null!=r&&Number(r)<=Number(h)?this._showToast(`Minimum temperature reached (${h}°)`):this._adjustTemp(-1,r,h):this._showToast("Turn on the AC to adjust temperature")}}
          >
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>

          <div class="temp-center">
            <div class="temp-value">
              ${a?"fan_only"===m?"FA":null!=r?`${r}°C`:"--":"--"}
            </div>
            <div class="temp-meta">
              <span class="temp-meta-item">
                <ha-icon icon="mdi:thermometer"></ha-icon>
                ${null!=_?`${_}°C`:"--"}
              </span>
              ${f?I`
                <span class="temp-meta-item">
                  <ha-icon icon="mdi:water-percent"></ha-icon>
                  ${y}%
                </span>
              `:""}
            </div>
          </div>

          <button
            class="temp-btn ${!a||"fan_only"===m||null!=r&&Number(r)>=Number(p)||S?"disabled":""}"
            title="${S?"Temperature cannot be adjusted while coil cleaning is active":a?"fan_only"===m?"Temperature cannot be adjusted in Fan Only mode":null!=r&&Number(r)>=Number(p)?`Maximum temperature reached (${p}°)`:"Increase Temperature":"Turn on the AC to adjust temperature"}"
            @click=${()=>{S?this._showToast("Temperature cannot be adjusted while coil cleaning is active"):a?"fan_only"===m?this._showToast("Temperature cannot be adjusted in Fan Only mode"):null!=r&&Number(r)>=Number(p)?this._showToast(`Maximum temperature reached (${p}°)`):this._adjustTemp(1,r,p):this._showToast("Turn on the AC to adjust temperature")}}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>

        <!-- ── Filter Alert (always visible if entity configured + active) ── -->
        ${"on"===A?.state?I`
          <div class="alert-banner">
            <div class="alert-left">
              <ha-icon class="alert-icon" icon="mdi:air-filter"></ha-icon>
              <span class="alert-text">Dirty Filter Alert!</span>
            </div>
            <span class="alert-hint">Clean your filter</span>
          </div>
        `:""}

        <!-- ── Connection / Transport Controls ── -->
        ${D||E?I`
          <div class="section">
            <div class="section-title">Connection</div>
            <div class="connection-row">
              <div class="segmented-bar connection-switches">
                ${D?I`
                  ${(()=>{const e="cloud"===D.state||"on"===D.state,t=E&&("auto"===E.state||"on"===E.state);return I`
                      <button
                        class="segmented-item ${t?"":"active"} ${t||S?"disabled":""}"
                        title="${t?"Backend transport is managed automatically in Auto Failover mode":S?"Backend cannot be switched while coil cleaning is active":"Click to toggle primary transport backend"}"
                        @click=${()=>{t?this._showToast("Backend transport is managed automatically in Auto Failover mode"):S?this._showToast("Backend cannot be switched while coil cleaning is active"):this._toggleSwitch(D.entity_id,D.state)}}
                      >
                        <ha-icon icon="${e?"mdi:cloud-sync":"mdi:remote"}"></ha-icon>
                        ${e?"Backend: Cloud":"Backend: IR"}
                      </button>
                    `})()}
                `:""}

                ${E?I`
                  <button
                    class="segmented-item ${"auto"===E.state||"on"===E.state?"active":""} ${S?"disabled":""}"
                    title="${S?"Hybrid mode cannot be toggled while coil cleaning is active":"Click to toggle between Auto Failover and Manual backend"}"
                    @click=${()=>{S?this._showToast("Hybrid mode cannot be toggled while coil cleaning is active"):this._toggleSwitch(E.entity_id,E.state)}}
                  >
                    <ha-icon icon="${"auto"===E.state||"on"===E.state?"mdi:refresh-auto":"mdi:hand-back-right"}"></ha-icon>
                    ${"auto"===E.state||"on"===E.state?"Auto Failover":"Manual"}
                  </button>
                `:""}
              </div>


            </div>
          </div>
        `:""}

        <!-- ── HVAC Modes ── -->
        <div class="section">
          <div class="section-title">Modes</div>
          <div class="segmented-bar">
            ${(o.hvac_modes||[]).filter(e=>"off"!==e).map(e=>I`
              <button
                class="segmented-item ${m===e&&a?"active":""} ${!s||S?"disabled":""}"
                title="${S?"HVAC mode cannot be changed while coil cleaning is active":s?this._modeLabel(e):"Device is offline"}"
                @click=${()=>{S?this._showToast("HVAC mode cannot be changed while coil cleaning is active"):s?this._setHvacMode(e):this._showToast("Device is offline")}}
              >
                <ha-icon icon="${this._modeIcon(e)}"></ha-icon>
                ${this._modeLabel(e)}
              </button>
            `)}
          </div>
        </div>

        <!-- ── Fan & Swing ── -->
        <div class="section">
          <div class="section-title">Fan & Swing</div>
          <div class="setting-tiles">
            <div
              class="setting-tile ${"fan"===this._openPanel?"active":""} ${!a||"dry"===m||S?"disabled":""}"
              title="${S?"Fan speed cannot be changed while coil cleaning is active":a?"dry"===m?"Fan speed is automatically managed in Dry mode":"Adjust fan speed":"Turn on the AC to adjust fan speed"}"
              @click=${()=>{S?this._showToast("Fan speed cannot be changed while coil cleaning is active"):a?"dry"===m?this._showToast("Fan speed is automatically managed in Dry mode"):this._togglePanel("fan"):this._showToast("Turn on the AC to adjust fan speed")}}
            >
              <div class="setting-tile-label">
                <ha-icon icon="mdi:fan"></ha-icon>
                <span>Fan</span>
              </div>
              <div class="setting-tile-value-row">
                <span class="setting-tile-value">${u?u.charAt(0).toUpperCase()+u.slice(1):"Auto"}</span>
                <ha-icon class="setting-tile-chevron" icon="mdi:chevron-down"></ha-icon>
              </div>
            </div>

            ${null!=g?I`
              <div
                class="setting-tile ${"swing_v"===this._openPanel?"active":""} ${!a||S?"disabled":""}"
                title="${S?"Swing vanes cannot be adjusted while coil cleaning is active":a?"Adjust vertical swing":"Turn on the AC to adjust swing vanes"}"
                @click=${()=>{S?this._showToast("Swing vanes cannot be adjusted while coil cleaning is active"):a?this._togglePanel("swing_v"):this._showToast("Turn on the AC to adjust swing vanes")}}
              >
                <div class="setting-tile-label">
                  <ha-icon icon="mdi:arrow-up-down"></ha-icon>
                  <span>V-Swing</span>
                </div>
                <div class="setting-tile-value-row">
                  <span class="setting-tile-value">${"Auto Swing"===g?"Auto":g}</span>
                  <ha-icon class="setting-tile-chevron" icon="mdi:chevron-down"></ha-icon>
                </div>
              </div>
            `:""}

            ${null!=v?I`
              <div
                class="setting-tile ${"swing_h"===this._openPanel?"active":""} ${!a||S?"disabled":""}"
                title="${S?"Horizontal swing cannot be adjusted while coil cleaning is active":a?"Adjust horizontal swing":"Turn on the AC to adjust horizontal swing"}"
                @click=${()=>{S?this._showToast("Horizontal swing cannot be adjusted while coil cleaning is active"):a?this._togglePanel("swing_h"):this._showToast("Turn on the AC to adjust horizontal swing")}}
              >
                <div class="setting-tile-label">
                  <ha-icon icon="mdi:arrow-left-right"></ha-icon>
                  <span>H-Swing</span>
                </div>
                <div class="setting-tile-value-row">
                  <span class="setting-tile-value">${"Auto Swing"===v?"Auto":v}</span>
                  <ha-icon class="setting-tile-chevron" icon="mdi:chevron-down"></ha-icon>
                </div>
              </div>
            `:""}
          </div>

          ${"fan"===this._openPanel?I`
            <div class="picker-panel">
              ${(o.fan_modes||[]).map(e=>I`
                <button class="picker-opt ${u===e?"sel":""}"
                        @click=${()=>{this._setFanMode(i,e),this._openPanel=null}}>
                  ${e.charAt(0).toUpperCase()+e.slice(1)}
                </button>
              `)}
            </div>
          `:""}

          ${"swing_v"===this._openPanel?I`
            <div class="picker-panel">
              ${(o.swing_modes||[]).map(e=>I`
                <button class="picker-opt ${g===e?"sel":""}"
                        @click=${()=>{this._setSwing(i,e),this._openPanel=null}}>
                  ${e}
                </button>
              `)}
            </div>
          `:""}

          ${"swing_h"===this._openPanel?I`
            <div class="picker-panel">
              ${(o.swing_horizontal_modes||[]).map(e=>I`
                <button class="picker-opt ${v===e?"sel":""}"
                        @click=${()=>{this._setHSwing(i,e),this._openPanel=null}}>
                  ${e}
                </button>
              `)}
            </div>
          `:""}
        </div>

        <!-- ── Comfort Presets ── -->
        <div class="section">
          <div class="section-title">Comfort Presets</div>
          <div class="segmented-bar">
            ${["none","eco","boost"].map(e=>{const t=!a||["dry","auto","fan_only"].includes(m)&&"none"!==e||S||B>0&&"none"!==e;return I`
                <button
                  class="segmented-item ${d===e?"active":""} ${t?"disabled":""}"
                  title="${S?"Presets cannot be changed while coil cleaning is active":a?["dry","auto","fan_only"].includes(m)&&"none"!==e?`Presets are not available in ${this._modeLabel(m)} mode`:B>0&&"none"!==e?"Presets cannot be changed while capacity limit is active":"none"===e?"Normal":e.charAt(0).toUpperCase()+e.slice(1):"Turn on the AC to select presets"}"
                  @click=${()=>{S?this._showToast("Presets cannot be changed while coil cleaning is active"):a?["dry","auto","fan_only"].includes(m)&&"none"!==e?this._showToast(`Presets are not available in ${this._modeLabel(m)} mode`):B>0&&"none"!==e?this._showToast("Presets cannot be changed while capacity limit is active"):this._setPreset(e):this._showToast("Turn on the AC to select presets")}}
                >
                  <ha-icon icon="${this._presetIcon(e)}"></ha-icon>
                  ${this._presetLabel(e)}
                </button>
              `})}
          </div>
        </div>

        <!-- ── Convertible Mode — stepped notch slider ── -->
        ${F.length>0?I`
          <div class="section" style="${["dry","auto","fan_only"].includes(m)||S?"opacity: 0.5;":""}">
            <div class="section-title">${W}</div>
            <div class="step-slider-wrap">
              <div class="step-slider-header">
                <span class="step-slider-title">Capacity Limit</span>
                <span class="step-slider-val">
                  ${0===B?"Normal":`${ge(U)}%`}
                </span>
              </div>

              <!-- Track + notch dots -->
              <div class="step-track-outer">
                <div class="step-track-bg">
                  <div class="step-track-fill" style="width: ${V}%"></div>
                </div>
                <div class="step-notches">
                  ${R.map((e,t)=>{const i=["eco","boost","powerful"].includes(d),o=!a||["dry","auto","fan_only"].includes(m)||S||i&&t>0;return I`
                      <div class="notch-wrapper">
                        <button
                          class="step-notch
                            ${t<B?"filled":""}
                            ${t===B?"current":""}
                            ${o?"disabled":""}"
                          title="${S?"Capacity limit cannot be changed while coil cleaning is active":a?["dry","auto","fan_only"].includes(m)?`Capacity limit is not available in ${this._modeLabel(m)} mode`:i&&t>0?`Capacity limit cannot be changed while ${this._presetLabel(d)} mode is active`:0===t?"Normal":`${ge(e)}%`:"Turn on the AC to set capacity limits"}"
                          @click=${()=>{S?this._showToast("Capacity limit cannot be changed while coil cleaning is active"):a?["dry","auto","fan_only"].includes(m)?this._showToast(`Capacity limit is not available in ${this._modeLabel(m)} mode`):i&&t>0?this._showToast(`Capacity limit cannot be changed while ${this._presetLabel(d)} mode is active`):this._setPreset(e):this._showToast("Turn on the AC to set capacity limits")}}
                        ></button>
                        <span class="notch-label ${t===B?"current":""}">${0===t?"N":ge(e)}</span>
                      </div>
                    `})}
                </div>
              </div>
            </div>
          </div>
        `:""}

        <!-- ── Controls (Nanoe, Display, Coil Clean) ── -->
        ${w||x||$?I`
          <div class="section">
            <div class="section-title">Controls</div>
            <div class="toggles">
              ${w?I`
                <div class="toggle-card ${!s||S?"disabled":""}"
                     title="${S?"Nanoe cannot be toggled while coil cleaning is active":s?"Toggle Nanoe™ air purification":"Device is offline"}"
                     @click=${()=>{S?this._showToast("Nanoe cannot be toggled while coil cleaning is active"):s?this._toggleSwitch(e.nanoe_switch,w.state):this._showToast("Device is offline")}}>
                  <div class="toggle-left">
                    <div class="toggle-icon ${"on"===w.state?"active":""}">
                      <ha-icon icon="mdi:air-purifier"></ha-icon>
                    </div>
                    <span class="toggle-label">nanoe™</span>
                  </div>
                  <ha-switch .checked=${"on"===w.state} ?disabled=${!s}></ha-switch>
                </div>
              `:""}
              ${x?I`
                <div class="toggle-card ${!s||S?"disabled":""}"
                     title="${S?"Display LED cannot be toggled while coil cleaning is active":s?"Toggle indoor unit LED display":"Device is offline"}"
                     @click=${()=>{S?this._showToast("Display LED cannot be toggled while coil cleaning is active"):s?this._toggleSwitch(e.display_switch,x.state):this._showToast("Device is offline")}}>
                  <div class="toggle-left">
                    <div class="toggle-icon ${"on"===x.state?"active":""}">
                      <ha-icon icon="mdi:eye"></ha-icon>
                    </div>
                    <span class="toggle-label">AC LED</span>
                  </div>
                  <ha-switch .checked=${"on"===x.state} ?disabled=${!s}></ha-switch>
                </div>
              `:""}
              ${$?I`
                <div class="toggle-card ${a||S?"disabled":""}"
                     title="${S?"Coil cleaning cycle is currently running":a?"Coil clean cannot be started while AC is running":"Start coil self-cleaning cycle"}"
                     @click=${()=>{S?this._showToast("Coil cleaning cycle is currently running"):a?this._showToast("Coil clean cannot be started while AC is running"):this._pressButton(e.coil_clean_button)}}>
                  <div class="toggle-left">
                    <div class="toggle-icon ${"on"===k?.state?"active":""}">
                      <ha-icon icon="mdi:spray-bottle"></ha-icon>
                    </div>
                    <span class="toggle-label">
                      ${"on"===k?.state?"Cleaning…":"Coil Clean"}
                    </span>
                  </div>
                  <ha-icon class="toggle-action" icon="mdi:play-circle-outline"></ha-icon>
                </div>
              `:""}
            </div>
          </div>
        `:""}

        <!-- ── Energy Cards ── -->
        ${C||P?I`
          <div class="section">
            <div class="section-title">Energy Consumption</div>
            <div class="energy-row">
              ${C?I`
                <div class="energy-card" @click=${()=>this._showMoreInfo(e.energy_today_sensor)}>
                  <div class="energy-label">
                    <ha-icon icon="mdi:flash"></ha-icon>
                    ${C.attributes.friendly_name??"Today"}
                  </div>
                  <div class="energy-value-row">
                    <span class="energy-value">${ve(C.state)}</span>
                    <span class="energy-unit">${C.attributes.unit_of_measurement??"kWh"}</span>
                  </div>
                </div>
              `:""}
              ${P?I`
                <div class="energy-card" @click=${()=>this._showMoreInfo(e.energy_yesterday_sensor)}>
                  <div class="energy-label">
                    <ha-icon icon="mdi:flash-outline"></ha-icon>
                    ${P.attributes.friendly_name??"Yesterday"}
                  </div>
                  <div class="energy-value-row">
                    <span class="energy-value">${ve(P.state)}</span>
                    <span class="energy-unit">${P.attributes.unit_of_measurement??"kWh"}</span>
                  </div>
                </div>
              `:""}
            </div>
          </div>
        `:""}

        <!-- Footer Telemetry Status Row -->
        <div class="footer-telemetry-row">
          ${N?I`
            <div class="connection-status-pill">
              <span class="status-dot ${"on"===N.state?"online":""}"></span>
              <span>IR Blaster</span>
            </div>
          `:""}
          ${M?I`
            <div class="connection-status-pill">
              <span class="status-dot ${"on"===M.state?"online":""}"></span>
              <span>Cloud MQTT</span>
            </div>
          `:""}
          ${H&&H.state&&"unknown"!==H.state&&"unavailable"!==H.state?I`
            <div class="connection-status-pill">
              <ha-icon icon="${this._sourceIcon(H.state)}" style="--mdc-icon-size: 14px;"></ha-icon>
              <span>Last controlled by: ${this._sourceLabel(H.state)}</span>
            </div>
          `:""}
          ${T?I`
            <div class="connection-status-pill">
              <ha-icon icon="mdi:wifi" style="--mdc-icon-size: 14px;"></ha-icon>
              <span>${T.state} ${T.attributes.unit_of_measurement??"dBm"}</span>
            </div>
          `:""}
        </div>
      </ha-card>
    `}_togglePanel(e){this._haptic("selection"),this._openPanel=this._openPanel===e?null:e}_haptic(e="light"){this.dispatchEvent(new CustomEvent("haptic",{detail:e,bubbles:!0,composed:!0}))}_showToast(e){this._haptic("warning"),this.dispatchEvent(new CustomEvent("hass-notification",{bubbles:!0,composed:!0,detail:{message:e}}))}_showMoreInfo(e){this._haptic("selection"),this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}_togglePower(e){this._haptic("medium"),"off"!==e.state?this.hass.callService("climate","set_hvac_mode",{entity_id:e.entity_id,hvac_mode:"off"}):this.hass.callService("climate","turn_on",{entity_id:e.entity_id})}_adjustTemp(e,t,i){if(this._haptic("light"),null==t)return;const o=Number(t)+e;if(null!=i&&(e<0&&o<Number(i)||e>0&&o>Number(i)))return;const s=this.hass?.states[this._config.entity];"auto"===s?.state&&this._showToast(`Temperature ${o}°C queued`),this.hass.callService("climate","set_temperature",{entity_id:this._config.entity,temperature:o})}_setHvacMode(e){this._haptic("light"),this.hass.callService("climate","set_hvac_mode",{entity_id:this._config.entity,hvac_mode:e})}_setFanMode(e,t){this._haptic("selection"),this.hass.callService("climate","set_fan_mode",{entity_id:e.entity_id,fan_mode:t})}_setSwing(e,t){this._haptic("selection"),this.hass.callService("climate","set_swing_mode",{entity_id:e.entity_id,swing_mode:t})}_setHSwing(e,t){this._haptic("selection"),this.hass.callService("climate","set_swing_horizontal_mode",{entity_id:e.entity_id,swing_horizontal_mode:t})}_setPreset(e){this._haptic("light");const t="cv_0"===e||"cv 0"===e?"none":e;this.hass.callService("climate","set_preset_mode",{entity_id:this._config.entity,preset_mode:t})}_toggleSwitch(e,t){this._haptic("light"),this.hass.callService("switch","on"===t?"turn_off":"turn_on",{entity_id:e})}_pressButton(e){this._haptic("medium"),this.hass.callService("button","press",{entity_id:e})}_modeLabel(e){return{cool:"Cool",dry:"Dry",fan_only:"Fan",auto:"Auto",heat:"Heat",off:"Off"}[e]??e.charAt(0).toUpperCase()+e.slice(1)}_modeIcon(e){return{cool:"mdi:snowflake",dry:"mdi:water-percent",fan_only:"mdi:fan",auto:"mdi:cached",heat:"mdi:fire"}[e]??"mdi:air-conditioner"}_modeColor(e){return{cool:"rgba(100, 181, 246, 0.18)",dry:"rgba(129, 199, 132, 0.18)",fan_only:"rgba(179, 157, 219, 0.18)",auto:"rgba(255, 183,  77, 0.18)",heat:"rgba(255, 138, 101, 0.18)"}[e]??"rgba(128, 128, 128, 0.12)"}_presetLabel(e){return"boost"===e?"Powerful":"none"===e?"None":"eco"===e?"Eco":e.charAt(0).toUpperCase()+e.slice(1)}_presetIcon(e){return{eco:"mdi:leaf",boost:"mdi:rocket",powerful:"mdi:rocket",none:"mdi:close-circle-outline"}[e]??"mdi:play-circle-outline"}_sourceIcon(e){const t=(e||"").toLowerCase();return t.includes("remote")?"mdi:remote":t.includes("switch")?"mdi:toggle-switch":t.includes("blaster")||t.includes("failover")||"ir"===t?"mdi:remote-desktop":t.includes("cloud")||"mqtt"===t?"mdi:cloud-check":"mdi:remote-desktop"}_sourceLabel(e){if(!e)return"Unknown";const t=e.trim(),i=t.toLowerCase();return"ir"===i?"IR":"cloud"===i?"Cloud":"ir blaster"===i||"ir_blaster"===i?"IR Blaster":"ir remote"===i||"ir_remote"===i?"IR Remote":"ir failover"===i||"ir_failover"===i?"IR Failover":"ir failover (offline)"===i||"ir_failover (offline)"===i?"IR Failover (Offline)":t.split(/[\s_]+/).map(e=>{const t=e.toLowerCase();return"ir"===t?"IR":"mqtt"===t?"MQTT":"ha"===t?"HA":e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()}).join(" ")}_renderGoogleHomeFull(e,t,i,o,s,a,n,r,c,l){const d=this._config,h=e.attributes,p=h.hvac_modes||[],m=h.fan_mode,u=h.fan_modes||[],g=h.swing_mode,v=h.swing_modes||[],b=h.swing_horizontal_mode,_=h.swing_horizontal_modes||[],f="unavailable"!==e.state&&"unknown"!==e.state,y=h.preset_mode,w="eco"===y?16:r,x="eco"===y?30:c,$=i?"fan_only"===n?"FA":null!=o?`${o}°`:"--":f?"Off":"Offline";let k=["none"],A=[];if(h.preset_modes&&(k=Array.from(new Set(["none",...h.preset_modes.filter(e=>!/^cv[\s_]/.test(e))])),A=h.preset_modes.filter(e=>/^cv[\s_]/.test(e)),A.length>0)){const e=A[0].substring(0,3);A.includes(`${e}0`)||A.push(`${e}0`)}const T=A.sort((e,t)=>ge(t)-ge(e)),C=d.nanoe_switch?this.hass.states[d.nanoe_switch]:void 0,P=d.display_switch?this.hass.states[d.display_switch]:void 0,S=d.coil_clean_button?this.hass.states[d.coil_clean_button]:void 0,j=d.coil_cleaning_sensor?this.hass.states[d.coil_cleaning_sensor]:void 0,z=d.energy_today_sensor?this.hass.states[d.energy_today_sensor]:void 0,E=d.energy_yesterday_sensor?this.hass.states[d.energy_yesterday_sensor]:void 0,D=d.rssi_sensor?this.hass.states[d.rssi_sensor]:void 0,N="on"===j?.state,M=d.entity.replace(/^climate\./,""),H=(e,t,i)=>{if(e&&this.hass.states[e])return this.hass.states[e];for(const e of i){const i=`${t}.${e}`;if(this.hass.states[i])return this.hass.states[i]}const o=Object.keys(this.hass.states);for(const e of i){const i=o.find(i=>i.startsWith(`${t}.${M}_`)&&i.includes(e));if(i)return this.hass.states[i]}},O=H(d.hybrid_submode_switch,"switch",[`${M}_hybrid_automatic_control`,`${M}_hybrid_submode`,`${M}_hybrid_control`,"hybrid"]),L=H(d.active_backend_switch,"switch",[`${M}_primary_transport_backend_cloud`,`${M}_primary_transport_backend`,`${M}_active_backend`,"backend","transport"]),U=H(d.control_source_sensor,"sensor",[`${M}_last_controlled_via`,`${M}_control_source`,"last_controlled_via"]),F=H(d.ir_blaster_sensor,"binary_sensor",[`${M}_ir_blaster_available`,`${M}_ir_transmitter_available`,`${M}_ir_blaster_transmitter_availability`,"ir_blaster"]),R=H(d.cloud_mqtt_sensor,"binary_sensor",[`${M}_cloud_mqtt_connected`,`${M}_cloud_mqtt`,"cloud_mqtt"]);let B=[];return i&&(B.push(this._modeLabel(n)),y&&"none"!==y&&!/^cv[\s_]/.test(y)&&B.push(this._presetLabel(y))),I`
      <ha-card style="${l}" class="gh-full-card">
        <div class="gh-header">
          <div class="gh-header-left">
            <ha-icon class="gh-icon" icon="mdi:air-conditioner"></ha-icon>
            <div class="gh-title">${t}</div>
          </div>
          <div style="display: flex; gap: 8px;">
            ${"compact"===this._config.layout?I`
              <button class="gh-power-btn" style="background: transparent; color: var(--m-text-2);" @click=${()=>{this._haptic("light"),this._expanded=!1}}>
                <ha-icon icon="mdi:chevron-up"></ha-icon>
              </button>
            `:""}
            <button
              class="gh-power-btn ${i?"on":""} ${!f||N?"disabled":""}"
              title="${N?"Power cannot be toggled while coil cleaning is active":f?"Toggle Power":"Device is offline"}"
              @click=${t=>{N?this._showToast("Power cannot be toggled while coil cleaning is active"):f?this._togglePower(e):this._showToast("Device is offline")}}
            >
              <ha-icon icon="mdi:power"></ha-icon>
            </button>
          </div>
        </div>

        <div class="gh-center">
          <div class="gh-value-large">${$}</div>
          <div class="gh-subtitle-large">
            <div style="display: flex; align-items: center; gap: 16px; justify-content: center;">
              ${null!=s?I`
                <span style="display: flex; align-items: center; gap: 5px;">
                  <ha-icon icon="mdi:thermometer" style="--mdc-icon-size: 16px;"></ha-icon>${s}°
                </span>`:""}
              ${null!=a?I`
                <span style="display: flex; align-items: center; gap: 5px;">
                  <ha-icon icon="mdi:water-percent" style="--mdc-icon-size: 16px;"></ha-icon>${a}%
                </span>`:""}
            </div>
            ${i?I`
              <div style="display: flex; justify-content: center; margin-top: 10px;">
                <span class="gh-mode-pill" style="background: ${this._modeColor(n)};">
                  <ha-icon icon="${this._modeIcon(n)}" style="--mdc-icon-size: 14px;"></ha-icon>
                  ${this._modeLabel(n)}
                </span>
              </div>`:""}
          </div>
        </div>

        <div class="gh-action-row">
          <button
            class="gh-circular-btn ${!i||"fan_only"===n||null!=o&&Number(o)<=Number(w)||N?"disabled":""}"
            title="${N?"Temperature cannot be adjusted while coil cleaning is active":i?"fan_only"===n?"Temperature cannot be adjusted in Fan Only mode":null!=o&&Number(o)<=Number(w)?`Minimum temperature reached (${w}°)`:"Decrease Temperature":"Turn on the AC to adjust temperature"}"
            @click=${e=>{if(e.stopPropagation(),N)this._showToast("Temperature cannot be adjusted while coil cleaning is active");else if(i)if("fan_only"===n)this._showToast("Temperature cannot be adjusted in Fan Only mode");else if(null!=o&&Number(o)<=Number(w))this._showToast(`Minimum temperature reached (${w}°)`);else{const e=Number(h.target_temp_step??1);this._adjustTemp(-e,o,w)}else this._showToast("Turn on the AC to adjust temperature")}}
          >
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>
          <div style="width: 48px;"></div>
          <button
            class="gh-circular-btn ${!i||"fan_only"===n||null!=o&&Number(o)>=Number(x)||N?"disabled":""}"
            title="${N?"Temperature cannot be adjusted while coil cleaning is active":i?"fan_only"===n?"Temperature cannot be adjusted in Fan Only mode":null!=o&&Number(o)>=Number(x)?`Maximum temperature reached (${x}°)`:"Increase Temperature":"Turn on the AC to adjust temperature"}"
            @click=${e=>{if(e.stopPropagation(),N)this._showToast("Temperature cannot be adjusted while coil cleaning is active");else if(i)if("fan_only"===n)this._showToast("Temperature cannot be adjusted in Fan Only mode");else if(null!=o&&Number(o)>=Number(x))this._showToast(`Maximum temperature reached (${x}°)`);else{const e=Number(h.target_temp_step??1);this._adjustTemp(e,o,x)}else this._showToast("Turn on the AC to adjust temperature")}}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>

        <div class="gh-select-container">
          <!-- Mode Dropdown -->
          <div class="gh-select-wrapper ${"mode"===this._ghDropdown?"active":""}">
            <button class="gh-custom-select" @click=${e=>{e.stopPropagation(),N?this._showToast("HVAC mode cannot be changed while coil cleaning is active"):(this._haptic("selection"),this._ghDropdown="mode"===this._ghDropdown?null:"mode")}}>
              <span>Mode: ${this._modeLabel(n)}</span>
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </button>
            ${"mode"===this._ghDropdown?I`
              <div class="gh-dropdown-menu">
                ${p.map(e=>I`
                  <button class="gh-dropdown-item ${n===e?"active":""}" 
                       @click=${t=>{t.stopPropagation(),this._ghDropdown=null,this._setHvacMode(e)}}>
                    ${this._modeLabel(e)}
                  </button>
                `)}
              </div>
            `:""}
          </div>

          <!-- Preset Dropdown -->
          <div class="gh-select-wrapper ${"preset"===this._ghDropdown?"active":""}" style="${!i||["dry","auto","fan_only"].includes(n)||N?"opacity: 0.5;":""}">
            <button class="gh-custom-select" @click=${e=>{e.stopPropagation(),N?this._showToast("Presets cannot be changed while coil cleaning is active"):i?["dry","auto","fan_only"].includes(n)?this._showToast(`Presets are not available in ${this._modeLabel(n)} mode`):(this._haptic("selection"),this._ghDropdown="preset"===this._ghDropdown?null:"preset"):this._showToast("Turn on the AC to select presets")}}>
              <span>Preset: ${y&&"none"!==y&&!/^cv[\s_]/.test(y)?this._presetLabel(y):"None"}</span>
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </button>
            ${"preset"===this._ghDropdown?I`
              <div class="gh-dropdown-menu">
                ${k.map(e=>{const t=!y||"none"===y||/^cv[\s_]/.test(y)?"none"===e:y===e;return I`
                    <button class="gh-dropdown-item ${t?"active":""}" 
                         @click=${t=>{t.stopPropagation(),this._ghDropdown=null,this._setPreset(e)}}>
                      ${this._presetLabel(e)}
                    </button>
                  `})}
              </div>
            `:""}
          </div>

          <!-- Convertible Dropdown -->
          ${T.length>0?I`
            <div class="gh-select-wrapper ${"cv"===this._ghDropdown?"active":""}" style="${!i||["dry","auto","fan_only"].includes(n)||N?"opacity: 0.5;":""}">
              <button class="gh-custom-select" @click=${e=>{e.stopPropagation(),N?this._showToast("Capacity limit cannot be changed while coil cleaning is active"):i?["dry","auto","fan_only"].includes(n)?this._showToast(`Capacity limit is not available in ${this._modeLabel(n)} mode`):(this._haptic("selection"),this._ghDropdown="cv"===this._ghDropdown?null:"cv"):this._showToast("Turn on the AC to set capacity limits")}}>
                <span>Limit: ${e.attributes.preset_mode&&/^cv[\s_]/.test(e.attributes.preset_mode)?0===ge(e.attributes.preset_mode)?"Normal":ge(e.attributes.preset_mode)+"%":"Normal"}</span>
                <ha-icon icon="mdi:chevron-down"></ha-icon>
              </button>
              ${"cv"===this._ghDropdown?I`
                <div class="gh-dropdown-menu">
                  ${T.map(t=>{const i=ge(t),o=e.attributes.preset_mode===t||0===i&&(!e.attributes.preset_mode||!/^cv[\s_]/.test(e.attributes.preset_mode));return I`
                      <button class="gh-dropdown-item ${o?"active":""}" 
                           @click=${e=>{e.stopPropagation(),this._ghDropdown=null,this._setPreset(t)}}>
                        ${0===i?"Normal":i+"%"}
                      </button>
                    `})}
                </div>
              `:""}
            </div>
          `:""}

          <!-- Fan Speed Dropdown -->
          ${u.length>0?I`
            <div class="gh-select-wrapper ${"fan"===this._ghDropdown?"active":""}" style="${!i||"dry"===n||N?"opacity: 0.5;":""}">
              <button class="gh-custom-select" @click=${e=>{e.stopPropagation(),N?this._showToast("Fan speed cannot be changed while coil cleaning is active"):i?"dry"===n?this._showToast("Fan speed is automatically managed in Dry mode"):(this._haptic("selection"),this._ghDropdown="fan"===this._ghDropdown?null:"fan"):this._showToast("Turn on the AC to adjust fan speed")}}>
                <span>Fan: ${m?m.charAt(0).toUpperCase()+m.slice(1):"Auto"}</span>
                <ha-icon icon="mdi:chevron-down"></ha-icon>
              </button>
              ${"fan"===this._ghDropdown?I`
                <div class="gh-dropdown-menu">
                  ${u.map(t=>I`
                    <button class="gh-dropdown-item ${m===t?"active":""}" 
                         @click=${i=>{i.stopPropagation(),this._ghDropdown=null,this._setFanMode(e,t)}}>
                      ${t.charAt(0).toUpperCase()+t.slice(1)}
                    </button>
                  `)}
                </div>
              `:""}
            </div>
          `:""}

          <!-- Vertical Swing (Vanes V) Dropdown -->
          ${v.length>0||null!=g?I`
            <div class="gh-select-wrapper ${"swing_v"===this._ghDropdown?"active":""}" style="${!i||N?"opacity: 0.5;":""}">
              <button class="gh-custom-select" @click=${e=>{e.stopPropagation(),N?this._showToast("Swing vanes cannot be adjusted while coil cleaning is active"):i?(this._haptic("selection"),this._ghDropdown="swing_v"===this._ghDropdown?null:"swing_v"):this._showToast("Turn on the AC to adjust swing vanes")}}>
                <span>V-Swing: ${g?g.charAt(0).toUpperCase()+g.slice(1):"Auto"}</span>
                <ha-icon icon="mdi:chevron-down"></ha-icon>
              </button>
              ${"swing_v"===this._ghDropdown?I`
                <div class="gh-dropdown-menu">
                  ${v.map(t=>I`
                    <button class="gh-dropdown-item ${g===t?"active":""}" 
                         @click=${i=>{i.stopPropagation(),this._ghDropdown=null,this._setSwing(e,t)}}>
                      ${t.charAt(0).toUpperCase()+t.slice(1)}
                    </button>
                  `)}
                </div>
              `:""}
            </div>
          `:""}

          <!-- Horizontal Swing (Vanes H) Dropdown -->
          ${_.length>0||null!=b?I`
            <div class="gh-select-wrapper ${"swing_h"===this._ghDropdown?"active":""}" style="${!i||N?"opacity: 0.5;":""}">
              <button class="gh-custom-select" @click=${e=>{e.stopPropagation(),N?this._showToast("Horizontal swing cannot be adjusted while coil cleaning is active"):i?(this._haptic("selection"),this._ghDropdown="swing_h"===this._ghDropdown?null:"swing_h"):this._showToast("Turn on the AC to adjust horizontal swing")}}>
                <span>H-Swing: ${b?b.charAt(0).toUpperCase()+b.slice(1):"Auto"}</span>
                <ha-icon icon="mdi:chevron-down"></ha-icon>
              </button>
              ${"swing_h"===this._ghDropdown?I`
                <div class="gh-dropdown-menu">
                  ${_.map(t=>I`
                    <button class="gh-dropdown-item ${b===t?"active":""}" 
                         @click=${i=>{i.stopPropagation(),this._ghDropdown=null,this._setHSwing(e,t)}}>
                      ${t.charAt(0).toUpperCase()+t.slice(1)}
                    </button>
                  `)}
                </div>
              `:""}
            </div>
          `:""}
        </div>

        ${C||P||S||z||E?I`
          <div class="gh-extra-chips">
            ${C?I`<div class="gh-chip ${"on"===C.state?"active":""} ${!f||N?"disabled":""}" title="${N?"Nanoe cannot be toggled while coil cleaning is active":f?"Toggle Nanoe™ air purification":"Device is offline"}" @click=${()=>N?this._showToast("Nanoe cannot be toggled while coil cleaning is active"):f?this._toggleSwitch(d.nanoe_switch,C.state):this._showToast("Device is offline")}><ha-icon icon="mdi:virus-outline"></ha-icon>Nanoe</div>`:""}
            ${P?I`<div class="gh-chip ${"on"===P.state?"active":""} ${!f||N?"disabled":""}" title="${N?"Display LED cannot be toggled while coil cleaning is active":f?"Toggle indoor unit LED display":"Device is offline"}" @click=${()=>N?this._showToast("Display LED cannot be toggled while coil cleaning is active"):f?this._toggleSwitch(d.display_switch,P.state):this._showToast("Device is offline")}><ha-icon icon="mdi:lightbulb-outline"></ha-icon>Display</div>`:""}
            ${S||j?I`
              <div
                class="gh-chip ${"on"===j?.state?"active":""} ${i||N?"disabled":""}"
                style="${i?"opacity: 0.4; cursor: not-allowed;":""}"
                title="${N?"Coil cleaning cycle is currently running":i?"Coil clean cannot be started while AC is running":"Start coil self-cleaning cycle"}"
                @click=${()=>{N?this._showToast("Coil cleaning cycle is currently running"):i?this._showToast("Coil clean cannot be started while AC is running"):S&&this._pressButton(d.coil_clean_button)}}
              >
                <ha-icon icon="mdi:spray"></ha-icon>
                ${"on"===j?.state?"Cleaning…":"Clean Coil"}
              </div>
            `:""}
            ${z&&E?I`
              <div class="gh-chip-text"><ha-icon icon="mdi:lightning-bolt"></ha-icon>Today: ${ve(z.state)} kWh • Yesterday: ${ve(E.state)} kWh</div>
            `:I`
              ${z?I`<div class="gh-chip-text"><ha-icon icon="mdi:lightning-bolt"></ha-icon>Today: ${ve(z.state)} kWh</div>`:""}
              ${E?I`<div class="gh-chip-text"><ha-icon icon="mdi:lightning-bolt"></ha-icon>Yesterday: ${ve(E.state)} kWh</div>`:""}
            `}
          </div>
        `:""}

        <!-- ── 2.0 Hybrid Transport Controls (Google Home Layout) ── -->
        ${L||O?I`
          <div class="gh-extra-chips" style="margin-top: 10px;">
            ${L?I`
              ${(()=>{const e="cloud"===L.state||"on"===L.state,t=O&&("auto"===O.state||"on"===O.state);return I`
                  <div
                    class="gh-chip ${e?"active":""} ${t||N?"disabled":""}"
                    style="${t?"opacity: 0.4; cursor: not-allowed;":""}"
                    title="${t?"Backend transport is managed automatically in Auto Failover mode":N?"Backend cannot be switched while coil cleaning is active":"Click to toggle primary transport backend"}"
                    @click=${()=>{t?this._showToast("Backend transport is managed automatically in Auto Failover mode"):N?this._showToast("Backend cannot be switched while coil cleaning is active"):this._toggleSwitch(L.entity_id,L.state)}}
                  >
                    <ha-icon icon="${e?"mdi:cloud-sync":"mdi:remote"}"></ha-icon>
                    Backend: ${e?"Cloud":"IR"}
                  </div>
                `})()}
            `:""}

            ${O?I`
              <div
                class="gh-chip ${"auto"===O.state||"on"===O.state?"active":""} ${N?"disabled":""}"
                title="${N?"Hybrid mode cannot be toggled while coil cleaning is active":"Click to toggle between Auto Failover and Manual backend"}"
                @click=${()=>{N?this._showToast("Hybrid mode cannot be toggled while coil cleaning is active"):this._toggleSwitch(O.entity_id,O.state)}}
              >
                <ha-icon icon="${"auto"===O.state||"on"===O.state?"mdi:refresh-auto":"mdi:hand-back-right"}"></ha-icon>
                ${"auto"===O.state||"on"===O.state?"Auto Failover":"Manual"}
              </div>
            `:""}


          </div>
        `:""}
        
        <!-- Footer Telemetry Status Row -->
        <div class="footer-telemetry-row">
          ${F?I`
            <div class="connection-status-pill">
              <span class="status-dot ${"on"===F.state?"online":""}"></span>
              <span>IR Blaster</span>
            </div>
          `:""}
          ${R?I`
            <div class="connection-status-pill">
              <span class="status-dot ${"on"===R.state?"online":""}"></span>
              <span>Cloud MQTT</span>
            </div>
          `:""}
          ${U&&U.state&&"unknown"!==U.state&&"unavailable"!==U.state?I`
            <div class="connection-status-pill">
              <ha-icon icon="${this._sourceIcon(U.state)}" style="--mdc-icon-size: 14px;"></ha-icon>
              <span>Last controlled by: ${this._sourceLabel(U.state)}</span>
            </div>
          `:""}
          ${D?I`
            <div class="connection-status-pill">
              <ha-icon icon="mdi:wifi" style="--mdc-icon-size: 14px;"></ha-icon>
              <span>${D.state} ${D.attributes.unit_of_measurement??"dBm"}</span>
            </div>
          `:""}
        </div>
      </ha-card>
    `}_renderCompact(e,t,i,o,s,a,n,r,c,l){const d="unavailable"!==e.state&&"unknown"!==e.state,h=i?"fan_only"===n?"FA":null!=o?`${o}°`:"--":d?"Off":"Offline",p=this._config.coil_cleaning_sensor?this.hass.states[this._config.coil_cleaning_sensor]:void 0,m="on"===p?.state,u=[];if(i){u.push(this._modeLabel(n));const t=e.attributes.preset_mode;if(t&&"none"!==t)if(/^cv[\s_]/.test(t)){const e=ge(t);u.push(0===e?"Normal":e+"%")}else u.push(this._presetLabel(t))}const g=u.length?u.join(" • "):"";return I`
      <ha-card style="${l}" class="compact-card ${"google_home"===this._config.full_layout?"google-home":"classic"}" @click=${()=>{this._haptic("selection"),this._expanded=!0}}>
        <div class="compact-header">
          <button
            class="compact-icon-btn ${i?"on":""} ${!d||m?"disabled":""}"
            title="${m?"Power cannot be toggled while coil cleaning is active":d?"Toggle Power":"Device is offline"}"
            @click=${t=>{t.stopPropagation(),m?this._showToast("Power cannot be toggled while coil cleaning is active"):d?this._togglePower(e):this._showToast("Device is offline")}}
          >
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
          <div class="compact-title">${t}</div>
          <ha-icon class="compact-chevron" icon="mdi:chevron-right"></ha-icon>
        </div>
        
        <div class="compact-center">
          <div class="compact-value">${h}</div>
        </div>

        <div class="compact-footer">
          <button
            class="compact-action-btn ${!i||"fan_only"===n||null!=o&&Number(o)<=Number(r)||m?"disabled":""}"
            title="${m?"Temperature cannot be adjusted while coil cleaning is active":i?"fan_only"===n?"Temperature cannot be adjusted in Fan Only mode":null!=o&&Number(o)<=Number(r)?`Minimum temperature reached (${r}°)`:"Decrease Temperature":"Turn on the AC to adjust temperature"}"
            @click=${e=>{e.stopPropagation(),m?this._showToast("Temperature cannot be adjusted while coil cleaning is active"):i?"fan_only"===n?this._showToast("Temperature cannot be adjusted in Fan Only mode"):null!=o&&Number(o)<=Number(r)?this._showToast(`Minimum temperature reached (${r}°)`):this._adjustTemp(-1,o,r):this._showToast("Turn on the AC to adjust temperature")}}
          >
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>
          <div class="compact-subtitle" style="display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.2;">
            <div style="display: flex; align-items: center; gap: 12px;">
              ${null!=s?I`
                <span style="display: flex; align-items: center; gap: 4px;">
                  <ha-icon icon="mdi:thermometer" style="--mdc-icon-size: 14px;"></ha-icon>${s}°
                </span>`:""}
              ${null!=a?I`
                <span style="display: flex; align-items: center; gap: 4px;">
                  <ha-icon icon="mdi:water-percent" style="--mdc-icon-size: 14px;"></ha-icon>${a}%
                </span>`:""}
            </div>
            ${g?I`<div style="font-size: 0.75rem; opacity: 0.7;">${g}</div>`:""}
          </div>
          <button
            class="compact-action-btn ${!i||"fan_only"===n||null!=o&&Number(o)>=Number(c)||m?"disabled":""}"
            title="${m?"Temperature cannot be adjusted while coil cleaning is active":i?"fan_only"===n?"Temperature cannot be adjusted in Fan Only mode":null!=o&&Number(o)>=Number(c)?`Maximum temperature reached (${c}°)`:"Increase Temperature":"Turn on the AC to adjust temperature"}"
            @click=${e=>{e.stopPropagation(),m?this._showToast("Temperature cannot be adjusted while coil cleaning is active"):i?"fan_only"===n?this._showToast("Temperature cannot be adjusted in Fan Only mode"):null!=o&&Number(o)>=Number(c)?this._showToast(`Maximum temperature reached (${c}°)`):this._adjustTemp(1,o,c):this._showToast("Turn on the AC to adjust temperature")}}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>
      </ha-card>
    `}getCardSize(){return"compact"!==this._config?.layout||this._expanded?5:2}};e([de({attribute:!1})],be.prototype,"hass",void 0),e([he()],be.prototype,"_config",void 0),e([he()],be.prototype,"_openPanel",void 0),e([he()],be.prototype,"_expanded",void 0),e([he()],be.prototype,"_ghDropdown",void 0),be=e([(e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)})("miraie-ac-card-in")],be),customElements.get("miraie-ac-card")||customElements.define("miraie-ac-card",class extends be{});export{be as MirAIeACCard};
