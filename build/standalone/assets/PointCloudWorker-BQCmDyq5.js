import{fC as k,O as x,ay as O,bk as R,fD as T}from"./index-CCrAUeKG.js";import{O as _}from"./quat-CtFrdXx2.js";import{e as V}from"./quatf64-Bdb9ZJJK.js";import{a as B,b as J,d as q}from"./PointCloudUniqueValueRenderer-Dut3nkQl.js";import{w as z,l as E,c as Z,I as X}from"./I3SBinaryReader-BWTUxFho.js";import{I as Y}from"./orientedBoundingBox-BtN_TlXI.js";import"./mat3f64-q3fE-ZOt.js";import"./VertexAttribute-BlT9lbVY.js";import"./mat3-CIXcZBmu.js";import"./mat4f64-CSKppSlJ.js";import"./spatialReferenceEllipsoidUtils-vtmACvay.js";import"./computeTranslationToOriginAndRotation-6a8G0_hT.js";import"./plane-DVngUg_9.js";import"./vec2f64-DA6GkJuH.js";function g(){return new Float32Array(3)}function A(a){const t=new Float32Array(3);return t[0]=a[0],t[1]=a[1],t[2]=a[2],t}function d(a,t,l){const n=new Float32Array(3);return n[0]=a,n[1]=t,n[2]=l,n}function j(a,t){return new Float32Array(a,t,3)}function M(){return g()}function D(){return d(1,1,1)}function F(){return d(1,0,0)}function C(){return d(0,1,0)}function N(){return d(0,0,1)}const P=M(),G=D(),L=F(),H=C(),K=N();Object.freeze(Object.defineProperty({__proto__:null,ONES:G,UNIT_X:L,UNIT_Y:H,UNIT_Z:K,ZEROS:P,clone:A,create:g,createView:j,fromValues:d,ones:D,unitX:F,unitY:C,unitZ:N,zeros:M},Symbol.toStringTag,{value:"Module"}));function Q(a,t,l,n){const{rendererJSON:s,isRGBRenderer:p}=a;let r=null,u=null;if(t&&p)r=t;else if(t&&(s==null?void 0:s.type)==="pointCloudUniqueValueRenderer"){u=B.fromJSON(s);const e=u.colorUniqueValueInfos;r=new Uint8Array(3*n);const c=I(u.fieldTransformType);for(let o=0;o<n;o++){const i=(c?c(t[o]):t[o])+"";for(let f=0;f<e.length;f++)if(e[f].values.includes(i)){r[3*o]=e[f].color.r,r[3*o+1]=e[f].color.g,r[3*o+2]=e[f].color.b;break}}}else if(t&&(s==null?void 0:s.type)==="pointCloudStretchRenderer"){u=J.fromJSON(s);const e=u.stops;r=new Uint8Array(3*n);const c=I(u.fieldTransformType);for(let o=0;o<n;o++){const i=c?c(t[o]):t[o],f=e.length-1;if(i<e[0].value)r[3*o]=e[0].color.r,r[3*o+1]=e[0].color.g,r[3*o+2]=e[0].color.b;else if(i>=e[f].value)r[3*o]=e[f].color.r,r[3*o+1]=e[f].color.g,r[3*o+2]=e[f].color.b;else for(let b=1;b<e.length;b++)if(i<e[b].value){const m=(i-e[b-1].value)/(e[b].value-e[b-1].value);r[3*o]=e[b].color.r*m+e[b-1].color.r*(1-m),r[3*o+1]=e[b].color.g*m+e[b-1].color.g*(1-m),r[3*o+2]=e[b].color.b*m+e[b-1].color.b*(1-m);break}}}else if(t&&(s==null?void 0:s.type)==="pointCloudClassBreaksRenderer"){u=q.fromJSON(s);const e=u.colorClassBreakInfos;r=new Uint8Array(3*n);const c=I(u.fieldTransformType);for(let o=0;o<n;o++){const i=c?c(t[o]):t[o];for(let f=0;f<e.length;f++)if(i>=e[f].minValue&&i<=e[f].maxValue){r[3*o]=e[f].color.r,r[3*o+1]=e[f].color.g,r[3*o+2]=e[f].color.b;break}}}else r=new Uint8Array(3*n).fill(255);if(l&&(u!=null&&u.colorModulation)){const e=u.colorModulation.minValue,c=u.colorModulation.maxValue,o=.3;for(let i=0;i<n;i++){const f=l[i],b=f>=c?1:f<=e?o:o+(1-o)*(f-e)/(c-e);r[3*i]=b*r[3*i],r[3*i+1]=b*r[3*i+1],r[3*i+2]=b*r[3*i+2]}}return r}function W(a,t){if(a.encoding==null||a.encoding===""){const l=z(t,a);if(l.vertexAttributes.position==null)return;const n=E(t,l.vertexAttributes.position),s=l.header.fields,p=[s.offsetX,s.offsetY,s.offsetZ],r=[s.scaleX,s.scaleY,s.scaleZ],u=n.length/3,e=new Float64Array(3*u);for(let c=0;c<u;c++)e[3*c]=n[3*c]*r[0]+p[0],e[3*c+1]=n[3*c+1]*r[1]+p[1],e[3*c+2]=n[3*c+2]*r[2]+p[2];return e}if(a.encoding==="lepcc-xyz")return Z(t).result}function y(a,t,l){return a!=null&&a.attributeInfo.useElevation?t?tt(t,l):null:a!=null&&a.attributeInfo.storageInfo?X(a.attributeInfo.storageInfo,a.buffer,l):null}function tt(a,t){const l=new Float64Array(t);for(let n=0;n<t;n++)l[n]=a[3*n+2];return l}function et(a,t,l,n,s){const p=a.length/3;let r=0;for(let u=0;u<p;u++){let e=!0;for(let c=0;c<n.length&&e;c++){const{filterJSON:o}=n[c],i=s[c].values[u];switch(o.type){case"pointCloudValueFilter":{const f=o.mode==="exclude";o.values.includes(i)===f&&(e=!1);break}case"pointCloudBitfieldFilter":{const f=S(o.requiredSetBits),b=S(o.requiredClearBits);((i&f)!==f||i&b)&&(e=!1);break}case"pointCloudReturnFilter":{const f=15&i,b=i>>>4&15,m=b>1,U=f===1,v=f===b;let w=!1;for(const h of o.includedReturns)if(h==="last"&&v||h==="firstOfMany"&&U&&m||h==="lastOfMany"&&v&&m||h==="single"&&!m){w=!0;break}w||(e=!1);break}}}e&&(l[r]=u,a[3*r]=a[3*u],a[3*r+1]=a[3*u+1],a[3*r+2]=a[3*u+2],t[3*r]=t[3*u],t[3*r+1]=t[3*u+1],t[3*r+2]=t[3*u+2],r++)}return r}function I(a){switch(a){default:case null:case"none":return t=>t;case"low-four-bit":return t=>15&t;case"high-four-bit":return t=>(240&t)>>4;case"absolute-value":return t=>Math.abs(t);case"modulo-ten":return t=>t%10}}function S(a){let t=0;for(const l of a||[])t|=1<<l;return t}class rt{transform(t){const l=this._transform(t),n=[l.points.buffer,l.rgb.buffer];l.pointIdFilterMap!=null&&n.push(l.pointIdFilterMap.buffer);for(const s of l.attributes)"buffer"in s.values&&k(s.values.buffer)&&s.values.buffer!==l.rgb.buffer&&n.push(s.values.buffer);return Promise.resolve({result:l,transferList:n})}_transform(t){const l=W(t.schema,t.geometryBuffer);let n=l.length/3,s=null;const p=new Array,r=y(t.primaryAttributeData,l,n);t.primaryAttributeData!=null&&r&&p.push({attributeInfo:t.primaryAttributeData.attributeInfo,values:r});const u=y(t.modulationAttributeData,l,n);t.modulationAttributeData!=null&&u&&p.push({attributeInfo:t.modulationAttributeData.attributeInfo,values:u});let e=Q(t.rendererInfo,r,u,n);if(t.filterInfo&&t.filterInfo.length>0&&t.filterAttributesData!=null){const o=t.filterAttributesData.filter(x).map(i=>{const f=y(i,l,n),b={attributeInfo:i.attributeInfo,values:f};return p.push(b),b});s=new Uint32Array(n),n=et(l,e,s,t.filterInfo,o)}for(const o of t.userAttributesData){const i=y(o,l,n);p.push({attributeInfo:o.attributeInfo,values:i})}3*n<e.length&&(e=new Uint8Array(e.buffer.slice(0,3*n))),nt(l,n,t.elevationOffset);const c=ot(l,n,Y.fromData(t.obbData),O.fromJSON(t.inSR),O.fromJSON(t.outSR));return{obbData:t.obbData,points:c,rgb:e,attributes:p,pointIdFilterMap:s}}}function ot(a,t,l,n,s){if(!R(a,n,0,a,s,0,t))throw new Error("Can't reproject");const p=A(l.center),r=g(),u=g(),e=A(l.halfSize);_($,l.quaternion);const c=new Float32Array(3*t);for(let o=0;o<t;o++){let i=3*o;r[0]=a[i]-p[0],r[1]=a[i+1]-p[1],r[2]=a[i+2]-p[2],T(u,r,$),e[0]=Math.max(e[0],Math.abs(u[0])),e[1]=Math.max(e[1],Math.abs(u[1])),e[2]=Math.max(e[2],Math.abs(u[2])),c[i++]=r[0],c[i++]=r[1],c[i]=r[2]}return l.halfSize=e,c}function nt(a,t,l){if(l!==0)for(let n=0;n<t;n++)a[3*n+2]+=l}const $=V();function It(){return new rt}export{It as default};