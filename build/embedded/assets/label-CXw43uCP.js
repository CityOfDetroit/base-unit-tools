import{i as k,c as m,q as w,a as y}from"./component-BUnDTGFH.js";/*!
 * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
 * See https://github.com/Esri/calcite-design-system/blob/dev/LICENSE.md for details.
 * v2.13.0
 */const h="calciteInternalLabelClick",E="calciteInternalLabelConnected",f="calciteInternalLabelDisconnected",L="calcite-label",c=new WeakMap,d=new WeakMap,b=new WeakMap,o=new WeakMap,s=new Set,M=e=>{const{id:t}=e,l=t&&w(e,{selector:`${L}[for="${t}"]`});if(l)return l;const a=y(e,L);return!a||D(a,e)?null:a};function D(e,t){let l;const a="custom-element-ancestor-check",i=n=>{n.stopImmediatePropagation();const r=n.composedPath();l=r.slice(r.indexOf(t),r.indexOf(e))};return e.addEventListener(a,i,{once:!0}),t.dispatchEvent(new CustomEvent(a,{composed:!0,bubbles:!0})),e.removeEventListener(a,i),l.filter(n=>n!==t&&n!==e).filter(n=>{var r;return(r=n.tagName)==null?void 0:r.includes("-")}).length>0}function v(e){if(!e)return;const t=M(e.el);if(d.has(t)&&t===e.labelEl||!t&&s.has(e))return;const l=x.bind(e);if(t){e.labelEl=t;const a=c.get(t)||[];a.push(e),c.set(t,a.sort(g)),d.has(e.labelEl)||(d.set(e.labelEl,C),e.labelEl.addEventListener(h,C)),s.delete(e),document.removeEventListener(E,b.get(e)),o.set(e,l),document.addEventListener(f,l)}else s.has(e)||(l(),document.removeEventListener(f,o.get(e)))}function I(e){if(!e||(s.delete(e),document.removeEventListener(E,b.get(e)),document.removeEventListener(f,o.get(e)),b.delete(e),o.delete(e),!e.labelEl))return;const t=c.get(e.labelEl);t.length===1&&(e.labelEl.removeEventListener(h,d.get(e.labelEl)),d.delete(e.labelEl)),c.set(e.labelEl,t.filter(l=>l!==e).sort(g)),e.labelEl=null}function g(e,t){return k(e.el,t.el)?-1:1}function B(e){var t,l;return e.label||((l=(t=e.labelEl)==null?void 0:t.textContent)==null?void 0:l.trim())||""}function C(e){const t=e.detail.sourceEvent.target,l=c.get(this),a=l.find(n=>n.el===t);if(l.includes(a))return;const u=l[0];u.disabled||u.onLabelClick(e)}function O(){s.has(this)&&v(this)}function x(){s.add(this);const e=b.get(this)||O.bind(this);b.set(this,e),document.addEventListener(E,e)}async function W(e){var a;if(await m(e),c.has(e))return;const l=(a=e.ownerDocument)==null?void 0:a.getElementById(e.for);l&&requestAnimationFrame(()=>{for(const i of s)if(i.el===l){v(i);break}})}export{W as a,f as b,v as c,I as d,B as g,E as l};