const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/geometryEngineWorker-ClddcLz0.js","assets/geometryEngineBase-RmbNeFm7.js","assets/_commonjsHelpers-DCkdB7M8.js","assets/json-Wa8cmqdu.js"])))=>i.map(i=>d[i]);
import{bM as d,bN as h,bL as g,bO as m,bP as p,bQ as y,bR as a,_ as b}from"./index-DKOmzAMm.js";import{n as w}from"./date-M6n_RqpC.js";class _{constructor(){this.code=null,this.description=null}}class I{constructor(r){this.error=new _,this.globalId=null,this.objectId=null,this.success=!1,this.uniqueId=null,this.error.description=r}}function c(n){return new I(n)}class P{constructor(r){this.globalId=null,this.success=!0,this.objectId=this.uniqueId=r}}function A(n){return new P(n)}const u=new Set;function F(n,r,e,f=!1){u.clear();for(const i in e){const t=n.get(i);if(!t)continue;const o=q(t,e[i]);if(u.add(t.name),t&&(f||t.editable)){const l=d(t,o);if(l)return c(h(l,t,o));r[t.name]=o}}for(const i of(n==null?void 0:n.requiredFields)??[])if(!u.has(i.name))return c(`missing required field "${i.name}"`);return null}function q(n,r){let e=r;return g(n)&&typeof r=="string"?e=parseFloat(r):m(n)&&r!=null&&typeof r!="string"?e=String(r):p(n)&&typeof r=="string"&&(e=w(r)),y(e)}let s;function G(n,r){if(!n||!a(r))return n;if("rings"in n||"paths"in n){if(s==null)throw new TypeError("geometry engine not loaded");return s.simplify(r,n)}return n}async function j(){return s==null&&(s=await b(()=>import("./geometryEngineWorker-ClddcLz0.js").then(n=>n.g),__vite__mapDeps([0,1,2,3]))),s}async function L(n,r){!a(n)||r!=="esriGeometryPolygon"&&r!=="esriGeometryPolyline"||await j()}export{A as d,c as f,L as j,F as p,G as y};