import{dp as r,ds as s}from"./index-DksN7PFj.js";import{b as t}from"./icon-tPRMgdEt.js";import{w as a}from"./component-BUnDTGFH.js";/*!
 * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
 * See https://github.com/Esri/calcite-design-system/blob/dev/LICENSE.md for details.
 * v2.13.0
 */let o;const l={childList:!0};function c(e){o||(o=t("mutation",f)),o.observe(e.el,l)}function O(e){o.unobserve(e.el)}function f(e){e.forEach(({target:i})=>{r(i)})}/*!
 * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
 * See https://github.com/Esri/calcite-design-system/blob/dev/LICENSE.md for details.
 * v2.13.0
 */const d=s;function n(e){return"opened"in e?e.opened:e.open}function b(e){d(()=>{e.transitionEl&&a(e.transitionEl,e.openTransitionProp,()=>{n(e)?e.onBeforeOpen():e.onBeforeClose()},()=>{n(e)?e.onOpen():e.onClose()})})}export{c,O as d,b as o};
