import{da as E,ay as h,a8 as y,aZ as S,Q as N,d1 as l,V as D}from"./index-CCrAUeKG.js";import{$ as d}from"./Mesh-D81OasC4.js";import{N as M,o as w,i as F}from"./MeshTransform-tNSTBezi.js";import{s as T}from"./infoFor3D-DsOdlPuA.js";import"./imageUtils-Cjk0UShD.js";import"./MeshVertexAttributes-BVy9cpc9.js";import"./MeshLocalVertexSpace-D0zPGggf.js";import"./meshVertexSpaceUtils-Bze82FGi.js";import"./earcut-BqgeR2O3.js";import"./_commonjsHelpers-DCkdB7M8.js";import"./DoubleArray-Bh8y2JW4.js";import"./Indices-CVrKJJHE.js";import"./plane-DVngUg_9.js";import"./mat3f64-q3fE-ZOt.js";import"./mat4f64-CSKppSlJ.js";import"./quatf64-Bdb9ZJJK.js";import"./vec2f64-DA6GkJuH.js";import"./deduplicate-DD5Fw38l.js";import"./projection-CYX5FyXR.js";import"./mat3-CIXcZBmu.js";import"./spatialReferenceEllipsoidUtils-vtmACvay.js";import"./computeTranslationToOriginAndRotation-6a8G0_hT.js";import"./BufferView-WIndRwRP.js";import"./vec2-Ct1rwEet.js";import"./vec3-D1q0HpG6.js";import"./vec4-CPfBIDNU.js";import"./vertexSpaceConversion-mtp-EhuS.js";import"./quat-CtFrdXx2.js";const I=()=>D.getLogger("esri.rest.support.meshFeatureSet");function ut(t,r,e){const o=e.features;e.features=[],delete e.geometryType;const n=E.fromJSON(e);if(n.geometryType="mesh",!e.assetMaps)return n;const s=P(r,e.assetMaps),i=t.sourceSpatialReference??h.WGS84,m=e.globalIdFieldName,{outFields:a}=t,c=a!=null&&a.length>0?L(a.includes("*")?null:new Set(a)):()=>({});for(const u of o){const p=O(u,m,i,r,s);n.features.push(new y({geometry:p,attributes:c(u)}))}return n}function L(t){return({attributes:r})=>{if(!r)return{};if(!t)return r;for(const e in r)t.has(e)||delete r[e];return r}}function O(t,r,e,o,n){const s=t.attributes[r],i=n.get(s);if(i==null||!t.geometry)return null;const m=x(t,e,o),a=S.fromJSON(t.geometry);a.spatialReference=e;const c=A(t.attributes,o),u=e.isGeographic?"local":"georeferenced",p=$(i);return p?d.createWithExternalSource(m,p,{extent:a,transform:c,vertexSpace:u}):d.createIncomplete(m,{extent:a,transform:c,vertexSpace:u})}function x({attributes:t},r,{transformFieldRoles:e}){const o=t[e.originX],n=t[e.originY],s=t[e.originZ];return new N({x:o,y:n,z:s,spatialReference:r})}function A(t,{transformFieldRoles:r}){return new M({translation:[t[r.translationX],-t[r.translationZ],t[r.translationY]],rotationAxis:[t[r.rotationX],-t[r.rotationZ],t[r.rotationY]],rotationAngle:t[r.rotationDeg],scale:[t[r.scaleX],t[r.scaleZ],t[r.scaleY]]})}var f;function P(t,r){const e=new Map;for(const o of r){const n=o.parentGlobalId;if(n==null)continue;const s=o.assetName,i=o.assetType,m=o.assetHash,a=o.assetURL,c=o.conversionStatus,u=o.seqNo,p=T(i,t.supportedFormats);if(!p){I().error("mesh-feature-set:unknown-format",`Service returned an asset of type ${i}, but it does not list it as a supported type`);continue}const g=l(e,n,()=>({files:new Map}));l(g.files,s,()=>({name:s,type:i,mimeType:p,status:b(c),parts:[]})).parts[u]={hash:m,url:a}}return e}function $(t){const r=Array.from(t.files.values()),e=new Array;for(const o of r){if(o.status!==f.COMPLETED)return null;const n=new Array;for(const s of o.parts){if(!s)return null;n.push(new w(s.url,s.hash))}e.push(new F(o.name,o.mimeType,n))}return e}function b(t){switch(t){case"COMPLETED":case"SUBMITTED":return f.COMPLETED;case"INPROGRESS":return f.PENDING;default:return f.FAILED}}(function(t){t[t.FAILED=0]="FAILED",t[t.PENDING=1]="PENDING",t[t.COMPLETED=2]="COMPLETED"})(f||(f={}));export{P as assetMapFromAssetMapsJSON,O as extractMesh,ut as meshFeatureSetFromJSON};