import{f as l}from"./utils-CF4bGKhW.js";import{U as m,df as p,ff as f,da as j}from"./index-DKOmzAMm.js";import{t as R}from"./query-CQvaiR4K.js";import"./normalizeUtils-DIcj7CYy.js";import"./normalizeUtilsCommon-BatUY1sD.js";import"./utils-BCmi3vQB.js";import"./pbfQueryUtils-D2YxxSfN.js";import"./pbf-DwSF5Y_G.js";import"./OptimizedFeature-DDMKj8Vq.js";import"./OptimizedFeatureSet-Blu9Ckm7.js";function F(r,t){const e=r.toJSON();return e.objectIds&&(e.objectIds=e.objectIds.join(",")),e.orderByFields&&(e.orderByFields=e.orderByFields.join(",")),e.outFields&&!(t!=null&&t.returnCountOnly)?e.outFields.includes("*")?e.outFields="*":e.outFields=e.outFields.join(","):delete e.outFields,e.outSR&&(e.outSR=p(e.outSR)),e.dynamicDataSource&&(e.layer=JSON.stringify({source:e.dynamicDataSource}),delete e.dynamicDataSource),e}async function b(r,t,e){const n=await y(r,t,e),o=n.data,s=o.geometryType,a=o.spatialReference,d={};for(const c of o.relatedRecordGroups){const u={fields:void 0,objectIdFieldName:void 0,geometryType:s,spatialReference:a,hasZ:!!o.hasZ,hasM:!!o.hasM,features:c.relatedRecords};if(c.objectId!=null)d[c.objectId]=u;else for(const i of Object.keys(c))i!=="relatedRecords"&&(d[c[i]]=u)}return{...n,data:d}}async function h(r,t,e){const n=await y(r,t,e,{returnCountOnly:!0}),o=n.data,s={};for(const a of o.relatedRecordGroups)a.objectId!=null&&(s[a.objectId]=a.count);return{...n,data:s}}async function y(r,t,e={},n){const o=R({...r.query,f:"json",...n,...F(t,n)});return m(r.path+"/queryRelatedRecords",{...e,query:{...e.query,...o}})}async function J(r,t,e){t=f.from(t);const n=l(r);return b(n,t,e).then(o=>{const s=o.data,a={};return Object.keys(s).forEach(d=>a[d]=j.fromJSON(s[d])),a})}async function k(r,t,e){t=f.from(t);const n=l(r);return h(n,t,{...e}).then(o=>o.data)}export{J as executeRelationshipQuery,k as executeRelationshipQueryForCount};