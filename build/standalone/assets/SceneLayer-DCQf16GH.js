const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/editingSupport-CzcNybiB.js","assets/index-CCrAUeKG.js","assets/index-6Ap435l7.css","assets/normalizeUtils-BSbja_dL.js","assets/normalizeUtilsCommon-DXWmgXRI.js","assets/utils-DMHF5ULe.js","assets/utils-BYTTVylw.js","assets/infoFor3D-DsOdlPuA.js"])))=>i.map(i=>d[i]);
import{B as s,D as a,E as b,fd as G,dG as V,hi as ie,F as N,ek as Q,cn as se,a7 as q,aX as P,bp as ae,c8 as k,fQ as oe,aS as v,bz as ne,bA as le,n as pe,U as Y,$ as de,s as u,aV as ue,_ as ee,eZ as ce,cF as ye,cs as he,ct as fe,cu as me,cv as ge,cG as ve,cH as we,co as be,bE as Ie,e_ as Le,ej as z,hj as K,V as m,aK as Fe,t as Se,dK as _e,hk as $e,a8 as Te,el as Ee,d9 as J,hl as xe,Q as Oe,gw as H,c$ as R,aU as je,fV as Ae,hm as Pe,hn as Re,gz as De,cN as Ue,en as Ne,eo as qe,ep as M,cx as Ce,ho as Ge,eu as Ve,er as Qe,es as ke,ev as ze,hc as Ke,ex as Je,cE as He}from"./index-CCrAUeKG.js";import{$ as Me}from"./Mesh-D81OasC4.js";import{i as We,m as Ze}from"./uploadAssetErrors-D5FAHWQH.js";import{L as Be,C as W}from"./SceneService-BWNG3Xe_.js";import{s as Xe}from"./associatedFeatureServiceUtils-BziGRvGN.js";import{n as Ye,p as et,s as tt}from"./popupUtils-CSOeyGpI.js";import{p as te,a as rt,y as it,m as st}from"./I3SLayerDefinitions-BUrpXmuu.js";import{r as at,t as ot}from"./infoFor3D-DsOdlPuA.js";import{a as nt}from"./lazyLayerLoader-C1dtIpyG.js";import{j as lt}from"./persistable-CMDmqOXk.js";import{$ as Z,P as pt,w as dt}from"./elevationInfoUtils-Bgws7flt.js";import{$ as ut}from"./I3SUtil-DA-WKDIW.js";import"./MeshTransform-tNSTBezi.js";import"./mat4f64-CSKppSlJ.js";import"./quat-CtFrdXx2.js";import"./mat3f64-q3fE-ZOt.js";import"./quatf64-Bdb9ZJJK.js";import"./imageUtils-Cjk0UShD.js";import"./MeshVertexAttributes-BVy9cpc9.js";import"./MeshLocalVertexSpace-D0zPGggf.js";import"./meshVertexSpaceUtils-Bze82FGi.js";import"./earcut-BqgeR2O3.js";import"./_commonjsHelpers-DCkdB7M8.js";import"./DoubleArray-Bh8y2JW4.js";import"./Indices-CVrKJJHE.js";import"./plane-DVngUg_9.js";import"./vec2f64-DA6GkJuH.js";import"./deduplicate-DD5Fw38l.js";import"./projection-CYX5FyXR.js";import"./mat3-CIXcZBmu.js";import"./spatialReferenceEllipsoidUtils-vtmACvay.js";import"./computeTranslationToOriginAndRotation-6a8G0_hT.js";import"./BufferView-WIndRwRP.js";import"./vec2-Ct1rwEet.js";import"./vec3-D1q0HpG6.js";import"./vec4-CPfBIDNU.js";import"./vertexSpaceConversion-mtp-EhuS.js";import"./originUtils-D69mHv66.js";import"./multiOriginJSONSupportUtils-C0wm8_Yw.js";import"./jsonContext-BI6UxVXo.js";import"./resourceUtils-DBaWxXtQ.js";import"./resourceUtils-jC4Rp7dx.js";import"./saveAPIKeyUtils-BF1Oyr2P.js";import"./saveUtils-Cb2RtnH3.js";import"./resourceExtension--Dcx1vtW.js";import"./sphere-N3QOcM0D.js";import"./I3SBinaryReader-BWTUxFho.js";import"./VertexAttribute-BlT9lbVY.js";import"./NormalAttribute.glsl-C4MPa3rw.js";import"./BindType-BmZEZMMh.js";import"./orientedBoundingBox-BtN_TlXI.js";function re({associatedLayer:e,serviceUpdateTimeStamp:t}){var d;const r=(d=e==null?void 0:e.editingInfo)==null?void 0:d.lastEditDate,i=e==null?void 0:e.serverGens,n=r!=null,l=t!=null,p=n&&l&&t.lastUpdate!==r.getTime();return n&&(p||!l&&(i==null?void 0:i.minServerGen)!==(i==null?void 0:i.serverGen))}const ct=e=>{let t=class extends e{constructor(){super(...arguments),this.serviceTimeInfo=null}get timeInfo(){var n;const r=(n=this.associatedLayer)==null?void 0:n.timeInfo;if(r==null)return null;const i=r.clone();return Q(i,this.fieldsIndex),i}set timeInfo(r){Q(r,this.fieldsIndex),this._override("timeInfo",r)}get timeExtent(){var r;return(r=this.associatedLayer)==null?void 0:r.timeExtent}set timeExtent(r){this._override("timeExtent",r)}get timeOffset(){var r;return(r=this.associatedLayer)==null?void 0:r.timeOffset}set timeOffset(r){this._override("timeOffset",r)}get datesInUnknownTimezone(){var r;return((r=this.associatedLayer)==null?void 0:r.datesInUnknownTimezone)??!1}set datesInUnknownTimezone(r){this._override("datesInUnknownTimezone",r)}async loadTimeInfoFromService(r){const{serviceTimeInfo:i}=this;if(i==null)return;const{startTimeField:n,endTimeField:l}=i;if(n==null&&l==null||re({associatedLayer:this.associatedLayer,serviceUpdateTimeStamp:this.serviceUpdateTimeStamp}))return;const p=async c=>{var _;let f=null;try{const L=await((_=this.fetchStatistics)==null?void 0:_.call(this,c,r));f=L==null?void 0:L.stats}catch{}if(f==null)return null;const{minTimeStr:I,min:x,maxTimeStr:O,max:j}=f,S=c===n?I??x:O??j;return S!=null?new Date(S):null},[d,y]=await Promise.all([p(n),p(l)]);if(n!=null&&d==null||l!=null&&y==null)return;const h=new V({start:d,end:y});this.setAtOrigin("timeInfo",new G({endField:l,startField:n,fullTimeExtent:h}),"service")}};return s([a({type:G,json:{read:!1,write:!1}})],t.prototype,"timeInfo",null),s([a({type:V,json:{read:!1,write:!1}})],t.prototype,"timeExtent",null),s([a({type:ie,json:{read:!1,write:!1}})],t.prototype,"timeOffset",null),s([a({type:Boolean,nonNullable:!0,json:{read:!1,write:!1}})],t.prototype,"datesInUnknownTimezone",null),s([a({type:F,readOnly:!0,json:{read:{source:"timeInfo"}}})],t.prototype,"serviceTimeInfo",void 0),t=s([b("esri.layers.mixins.TemporalSceneLayer")],t),t};let F=class extends N{constructor(){super(...arguments),this.endTimeField=null,this.startTimeField=null}};s([a({type:String})],F.prototype,"endTimeField",void 0),s([a({type:String})],F.prototype,"startTimeField",void 0),F=s([b("esri.layers.mixins.TemporalSceneLayer.SceneServiceTimeInfo")],F);let g=class extends N{constructor(){super(...arguments),this.name=null,this.field=null,this.currentRangeExtent=null,this.fullRangeExtent=null,this.type="rangeInfo"}};s([a({type:String,json:{read:!0,write:!0}})],g.prototype,"name",void 0),s([a({type:String,json:{read:!0,write:!0}})],g.prototype,"field",void 0),s([a({type:[Number],json:{read:!0,write:!0}})],g.prototype,"currentRangeExtent",void 0),s([a({type:[Number],json:{read:!0,write:!0}})],g.prototype,"fullRangeExtent",void 0),s([a({type:["rangeInfo"],readOnly:!0,json:{read:!1,write:!0}})],g.prototype,"type",void 0),g=s([b("esri.layers.support.RangeInfo")],g);var T;let D=T=class extends se(q.ofType(P)){constructor(e){super(e)}clone(){return new T(this.items.map(e=>e.clone()))}write(e,t){return this.toJSON(t)}toJSON(e){var r;const t=(r=e==null?void 0:e.layer)==null?void 0:r.spatialReference;return t?this.toArray().map(i=>{if(!t.equals(i.spatialReference)){if(!ae(i.spatialReference,t))return e!=null&&e.messages&&e.messages.push(new k("scenefilter:unsupported","Scene filters with incompatible spatial references are not supported",{modification:this,spatialReference:e.layer.spatialReference,context:e})),null;const l=new P;oe(i,l,t),i=l}const n=i.toJSON(e);return delete n.spatialReference,n}).filter(i=>i!=null):(e!=null&&e.messages&&e.messages.push(new k("scenefilter:unsupported","Writing Scene filters without context layer is not supported",{modification:this,spatialReference:e.layer.spatialReference,context:e})),this.toArray().map(i=>i.toJSON(e)))}static fromJSON(e,t){const r=new T;return e.forEach(i=>r.add(P.fromJSON(i,t))),r}};D=T=s([b("esri.layers.support.PolygonCollection")],D);const E=D;var U;let w=U=class extends N{constructor(e){super(e),this.spatialRelationship="disjoint",this.geometries=new E,this._geometriesSource=null}initialize(){this.addHandles(ne(()=>this.geometries,"after-changes",()=>this.geometries=this.geometries,le))}readGeometries(e,t,r){Array.isArray(e)?this.geometries=E.fromJSON(e,r):this._geometriesSource={url:pe(e,r),context:r}}async loadGeometries(e,t){if(this._geometriesSource==null)return;const{url:r,context:i}=this._geometriesSource,n=await Y(r,{responseType:"json",signal:t==null?void 0:t.signal}),l=e.toJSON(),p=n.data.map(d=>({...d,spatialReference:l}));this.geometries=E.fromJSON(p,i),this._geometriesSource=null}clone(){const e=new U({geometries:de(this.geometries),spatialRelationship:this.spatialRelationship});return e._geometriesSource=this._geometriesSource,e}};s([a({type:["disjoint","contains"],nonNullable:!0,json:{write:!0}})],w.prototype,"spatialRelationship",void 0),s([a({type:E,nonNullable:!0,json:{write:!0}}),lt({origins:["web-scene","portal-item"],type:"resource",prefix:"geometries",contentAddressed:!0})],w.prototype,"geometries",void 0),s([v(["web-scene","portal-item"],"geometries")],w.prototype,"readGeometries",null),w=U=s([b("esri.layers.support.SceneFilter")],w);const yt=w;async function ht({fieldName:e,statisticsInfo:t,errorContext:r,fieldsIndex:i,path:n,customParameters:l,apiKey:p,signal:d}){if(t==null)throw new u(`${r}:no-cached-statistics`,"Cached statistics are not available for this layer");const y=i.get(e);if(y==null)throw new u(`${r}:field-unexisting`,`Field '${e}' does not exist on the layer`);const h=t.find(I=>I.name===y.name);if(h==null)throw new u(`${r}:no-cached-statistics`,"Cached statistics for this attribute are not available");const c=ue(n,h.href),{data:f}=await Y(c,{query:{f:"json",...l,token:p},responseType:"json",signal:d});return f}async function ft(e){const t=[];for(const r of e)r.name.toLowerCase().endsWith(".zip")?t.push(mt(r)):t.push(Promise.resolve(r));return(await Promise.all(t)).flat()}async function mt(e){const{BlobReader:t,ZipReader:r,BlobWriter:i}=await ee(()=>import("./zipjs-wrapper-DnezS2lx.js"),[]),n=[];return(await new r(new t(e)).getEntries()).forEach(p=>{var h;if(p.directory||/^__MACOS/i.test(p.filename))return;const d=new i,y=(h=p.getData)==null?void 0:h.call(p,d).then(c=>new File([c],p.filename));y&&n.push(y)}),Promise.all(n)}const gt=new Set(["3DObject","Point"]),B=Je();let o=class extends ct(ce(Be(ye(he(fe(me(ge(ve(we(be(He))))))))))){constructor(...e){super(...e),this.featureReduction=null,this.rangeInfos=null,this.operationalLayerType="ArcGISSceneServiceLayer",this.type="scene",this.fields=null,this.floorInfo=null,this.outFields=null,this.nodePages=null,this.materialDefinitions=null,this.textureSetDefinitions=null,this.geometryDefinitions=null,this.serviceUpdateTimeStamp=null,this.excludeObjectIds=new q,this.definitionExpression=null,this.filter=null,this.path=null,this.labelsVisible=!0,this.labelingInfo=null,this.legendEnabled=!0,this.priority=null,this.semantic=null,this.cachedDrawingInfo={color:!1},this.popupEnabled=!0,this.popupTemplate=null,this.objectIdField=null,this.globalIdField=null,this._fieldUsageInfo={},this.screenSizePerspectiveEnabled=!0,this.serviceItemId=void 0}normalizeCtorArgs(e,t){return typeof e=="string"?{url:e,...t}:e}destroy(){this._set("renderer",null)}getField(e){return this.fieldsIndex.get(e)}getFieldDomain(e,t){var i,n,l;const r=(n=(i=this.getFeatureType(t==null?void 0:t.feature))==null?void 0:i.domains)==null?void 0:n[e];return r&&r.type!=="inherited"?r:((l=this.getField(e))==null?void 0:l.domain)??null}getFeatureType(e){return e&&this.associatedLayer?this.associatedLayer.getFeatureType(e):null}get types(){var e;return((e=this.associatedLayer)==null?void 0:e.types)??[]}get typeIdField(){var e;return((e=this.associatedLayer)==null?void 0:e.typeIdField)??null}get templates(){var e;return((e=this.associatedLayer)==null?void 0:e.templates)??null}get formTemplate(){var e;return((e=this.associatedLayer)==null?void 0:e.formTemplate)??null}get fieldsIndex(){return new Ie(this.fields)}readNodePages(e,t,r){return t.layerType==="Point"&&(e=t.pointNodePages),e==null||typeof e!="object"?null:te.fromJSON(e,r)}set elevationInfo(e){this._set("elevationInfo",e),this.loaded&&this._validateElevationInfo()}get effectiveCapabilities(){var e;return this._capabilitiesFromAssociatedFeatureLayer((e=this.associatedLayer)==null?void 0:e.effectiveCapabilities)}get effectiveEditingEnabled(){return this.associatedLayer!=null&&Le(this.associatedLayer)}get geometryType(){return vt[this.profile]||"mesh"}set renderer(e){z(e,this.fieldsIndex),this._set("renderer",e)}readCachedDrawingInfo(e){return e!=null&&typeof e=="object"||(e={}),e.color==null&&(e.color=!1),e}get capabilities(){var e;return this._capabilitiesFromAssociatedFeatureLayer((e=this.associatedLayer)==null?void 0:e.capabilities)}_capabilitiesFromAssociatedFeatureLayer(e){var C;e=e??tt;const{query:t,queryRelated:r,editing:{supportsGlobalId:i,supportsRollbackOnFailure:n,supportsUploadWithItemId:l,supportsGeometryUpdate:p,supportsReturnServiceEditsInSourceSpatialReference:d},data:{supportsZ:y,supportsM:h,isVersioned:c,supportsAttachment:f},operations:{supportsEditing:I,supportsAdd:x,supportsUpdate:O,supportsDelete:j,supportsQuery:S,supportsQueryAttachments:_,supportsAsyncConvert3D:L}}=e,$=e.operations.supportsChangeTracking,A=!!((C=this.associatedLayer)!=null&&C.infoFor3D)&&K();return{query:t,queryRelated:r,editing:{supportsGlobalId:i,supportsReturnServiceEditsInSourceSpatialReference:d,supportsRollbackOnFailure:n,supportsGeometryUpdate:A&&p,supportsUploadWithItemId:l},data:{supportsAttachment:f,supportsZ:y,supportsM:h,isVersioned:c},operations:{supportsQuery:S,supportsQueryAttachments:_,supportsEditing:I&&$,supportsAdd:A&&x&&$,supportsDelete:A&&j&&$,supportsUpdate:O&&$,supportsAsyncConvert3D:L}}}get editingEnabled(){var e;return this._isOverridden("editingEnabled")?this._get("editingEnabled"):((e=this.associatedLayer)==null?void 0:e.editingEnabled)??!1}set editingEnabled(e){this._overrideIfSome("editingEnabled",e)}get infoFor3D(){var e;return((e=this.associatedLayer)==null?void 0:e.infoFor3D)??null}get relationships(){var e;return(e=this.associatedLayer)==null?void 0:e.relationships}get defaultPopupTemplate(){return this.associatedLayer||this.attributeStorageInfo?this.createPopupTemplate():null}readObjectIdField(e,t){return!e&&t.fields&&t.fields.some(r=>(r.type==="esriFieldTypeOID"&&(e=r.name),!!e)),e||void 0}readGlobalIdField(e,t){return!e&&t.fields&&t.fields.some(r=>(r.type==="esriFieldTypeGlobalID"&&(e=r.name),!!e)),e||void 0}get displayField(){var e;return((e=this.associatedLayer)==null?void 0:e.displayField)??null}readProfile(e,t){const r=t.store.profile;return r!=null&&X[r]?X[r]:(m.getLogger(this).error("Unknown or missing profile",{profile:r,layer:this}),"mesh-pyramids")}get useViewTime(){var e;return((e=this.associatedLayer)==null?void 0:e.useViewTime)??!0}set useViewTime(e){this._override("useViewTime",e)}load(e){return this.addResolvingPromise(this._load(e)),Promise.resolve(this)}async _load(e){const t=e!=null?e.signal:null;await this.loadFromPortal({supportedTypes:["Scene Service"]},e).catch(Fe),await this._fetchService(t),await Promise.all([this._fetchIndexAndUpdateExtent(this.nodePages,t),this._setAssociatedFeatureLayer(t),this._loadFilterGeometries()]),this._validateElevationInfo(),this._applyAssociatedLayerOverrides(),this._populateFieldUsageInfo(),await this.loadTimeInfoFromService(e),await Se(this,{origin:"service"},t),z(this.renderer,this.fieldsIndex),await this.finishLoadEditablePortalLayer(e)}async beforeSave(){this.filter!=null&&(this.filter=this.filter.clone(),await this.load())}async _loadFilterGeometries(){if(this.filter)try{await this.filter.loadGeometries(this.spatialReference)}catch(e){m.getLogger(this).error("#_loadFilterGeometries()",this,"Failed to load filter geometries. Geometry filter will not be applied for this layer.",{error:e}),this.filter=null}}createQuery(){var t;const e=new _e;return this.geometryType==="mesh"?(t=this.associatedLayer)!=null&&t.infoFor3D&&(e.returnGeometry=!0):(e.returnGeometry=!0,e.returnZ=!0),e.where=this.definitionExpression||"1=1",e.sqlFormat="standard",e.outFields=["*"],e}queryExtent(e,t){return this._getAssociatedLayerForQuery().then(r=>r.queryExtent(e||this.createQuery(),t))}queryFeatureCount(e,t){return this._getAssociatedLayerForQuery().then(r=>r.queryFeatureCount(e||this.createQuery(),t))}queryFeatures(e,t){return this._getAssociatedLayerForQuery().then(r=>r.queryFeatures(e||this.createQuery(),t)).then(r=>{if(r!=null&&r.features)for(const i of r.features)i.layer=this,i.sourceLayer=this;return r})}async queryRelatedFeatures(e,t){if(await this.load(),!this.associatedLayer)throw new u("scenelayer:query-not-available","SceneLayer queries are not available without an associated feature layer",{layer:this});return this.associatedLayer.queryRelatedFeatures(e,t)}async queryRelatedFeaturesCount(e,t){if(await this.load(),!this.associatedLayer)throw new u("scenelayer:query-not-available","SceneLayer queries are not available without an associated feature layer",{layer:this});return this.associatedLayer.queryRelatedFeaturesCount(e,t)}async queryCachedAttributes(e,t){var i;const r=$e(this.fieldsIndex,await Ye(this,et(this)));return ut(((i=this.parsedUrl)==null?void 0:i.path)??"",this.attributeStorageInfo??[],e,t,r,this.apiKey,this.customParameters)}async queryCachedFeature(e,t){const r=await this.queryCachedAttributes(e,[t]);if(!r||r.length===0)throw new u("scenelayer:feature-not-in-cached-data","Feature not found in cached data");const i=new Te;return i.attributes=r[0],i.layer=this,i.sourceLayer=this,i}queryObjectIds(e,t){return this._getAssociatedLayerForQuery().then(r=>r.queryObjectIds(e||this.createQuery(),t))}queryAttachments(e,t){return this._getAssociatedLayerForQuery().then(r=>r.queryAttachments(e,t))}getFieldUsageInfo(e){const t={supportsLabelingInfo:!1,supportsRenderer:!1,supportsPopupTemplate:!1,supportsLayerQuery:!1};return this.loaded?this._fieldUsageInfo[e]||t:(m.getLogger(this).error("#getFieldUsageInfo()","Unavailable until layer is loaded"),t)}createPopupTemplate(e){return Ee(this,e)}_getAssociatedLayerForQuery(){const e=this.associatedLayer;return e!=null&&e.loaded?Promise.resolve(e):this._loadAssociatedLayerForQuery()}async _loadAssociatedLayerForQuery(){if(await this.load(),!this.associatedLayer)throw new u("scenelayer:query-not-available","SceneLayer queries are not available without an associated feature layer",{layer:this});try{await this.associatedLayer.load()}catch(e){throw new u("scenelayer:query-not-available","SceneLayer associated feature layer could not be loaded",{layer:this,error:e})}return this.associatedLayer}hasCachedStatistics(e){return this.statisticsInfo!=null&&this.statisticsInfo.some(t=>t.name===e)}async queryCachedStatistics(e,t){return await this.load(t),await this.fetchStatistics(e,t)}async saveAs(e,t){return this._debouncedSaveOperations(W.SAVE_AS,{...t,getTypeKeywords:()=>this._getTypeKeywords(),portalItemLayerType:"scene"},e)}async save(){const e={getTypeKeywords:()=>this._getTypeKeywords(),portalItemLayerType:"scene"};return this._debouncedSaveOperations(W.SAVE,e)}async applyEdits(e,t){const{applyEdits:r}=await ee(()=>import("./editingSupport-CzcNybiB.js"),__vite__mapDeps([0,1,2,3,4,5,6,7]));let i=t;await this.load();const n=this.associatedLayer;if(!n)throw new u(`${this.type}-layer:not-editable`,"Service is not editable");await n.load();const{globalIdField:l}=n,p=!!n.infoFor3D,d=(i==null?void 0:i.globalIdUsed)??!0;if(p&&l==null)throw new u(`${this.type}-layer:not-editable`,"Valid globalIdField expected on editable SceneLayer");if(p&&!d)throw new u(`${this.type}-layer:globalid-required`,"globalIdUsed must not be false for SceneLayer editing as globalIds are required.");return J(n.url)&&p&&e.deleteFeatures!=null&&l!=null&&(i={...i,globalIdToObjectId:await xe(n,e.deleteFeatures,l)}),r(this,n.source,e,i)}async uploadAssets(e,t){if(await this.load(),this.associatedLayer==null)throw new u(`${this.type}-layer:not-editable`,"Service is not editable");return await this.associatedLayer.load(),this.associatedLayer.uploadAssets(e,t)}on(e,t){return super.on(e,t)}async convertMesh(e,t){const r=c=>{throw m.getLogger(this).error(".convertMesh()",c.message),c};await this.load(),this.infoFor3D||r(new u("invalid:layer","SceneLayer has no capability for mesh conversion"));const i=await this.extractAndFilterFiles(e),n=i.reduce((c,f)=>at(this.infoFor3D,f)?c+1:c,0);n===0&&r(new We),n>1&&r(new Ze);const l=this.spatialReference,p=(t==null?void 0:t.location)??new Oe({x:0,y:0,z:0,spatialReference:l}),d=p.spatialReference.isGeographic?"local":"georeferenced",y=Me.createWithExternalSource(p,i,{vertexSpace:d}),[h]=await this.uploadAssets([y],t);return h}async extractAndFilterFiles(e){await this.load();const t=this.infoFor3D;return t?(await ft(e)).filter(r=>ot(t,r)):e}validateLayer(e){if(e.layerType&&!gt.has(e.layerType))throw new u("scenelayer:layer-type-not-supported","SceneLayer does not support this layer type",{layerType:e.layerType});if(isNaN(this.version.major)||isNaN(this.version.minor))throw new u("layer:service-version-not-supported","Service version is not supported.",{serviceVersion:this.version.versionString,supportedVersions:"1.x, 2.x"});if(this.version.major>2)throw new u("layer:service-version-too-new","Service version is too new.",{serviceVersion:this.version.versionString,supportedVersions:"1.x, 2.x"});function t(r,i){let n=!1,l=!1;if(r==null)n=!0,l=!0;else{const p=i&&i.isGeographic;switch(r){case"east-north-up":case"earth-centered":n=!0,l=p;break;case"vertex-reference-frame":n=!0,l=!p;break;default:n=!1}}if(!n)throw new u("scenelayer:unsupported-normal-reference-frame","Normal reference frame is invalid.");if(!l)throw new u("scenelayer:incompatible-normal-reference-frame","Normal reference frame is incompatible with layer spatial reference.")}t(this.normalReferenceFrame,this.spatialReference)}_getTypeKeywords(){const e=[];if(this.profile==="points")e.push("Point");else{if(this.profile!=="mesh-pyramids")throw new u("scenelayer:unknown-profile","SceneLayer:save() encountered an unknown SceneLayer profile: "+this.profile);e.push("3DObject")}return e}_populateFieldUsageInfo(){var e,t,r;if(this._fieldUsageInfo={},this.fields)for(const i of this.fields){const n=!!((e=this.attributeStorageInfo)!=null&&e.some(d=>d.name===i.name)),l=!!((r=(t=this.associatedLayer)==null?void 0:t.fields)!=null&&r.some(d=>d&&i.name===d.name)),p={supportsLabelingInfo:n,supportsRenderer:n,supportsPopupTemplate:n||l,supportsLayerQuery:l};this._fieldUsageInfo[i.name]=p}}_applyAssociatedLayerOverrides(){this._applyAssociatedLayerFieldsOverrides(),this._applyAssociatedLayerPopupOverrides(),this._applyAssociatedLayerExtentOverride(),this._applyAssociatedLayerPrivileges()}_applyAssociatedLayerFieldsOverrides(){var t;if(!((t=this.associatedLayer)!=null&&t.fields))return;let e=null;for(const r of this.associatedLayer.fields){const i=this.getField(r.name);i?(!i.domain&&r.domain&&(i.domain=r.domain.clone()),i.editable=r.editable,i.nullable=r.nullable,i.length=r.length):(e||(e=this.fields?this.fields.slice():[]),e.push(r.clone()))}e&&this._set("fields",e)}_applyAssociatedLayerPopupOverrides(){if(!this.associatedLayer)return;const e=["popupTemplate","popupEnabled"],t=H(this);for(let r=0;r<e.length;r++){const i=e[r],n=this.originIdOf(i),l=this.associatedLayer.originIdOf(i);n<l&&(l===R.SERVICE||l===R.PORTAL_ITEM)&&t.setAtOrigin(i,this.associatedLayer[i],l)}}_applyAssociatedLayerExtentOverride(){var t,r,i;const e=(t=this.associatedLayer)==null?void 0:t.getAtOrigin("fullExtent","service");K()&&((r=this.associatedLayer)==null?void 0:r.infoFor3D)!=null&&e&&J((i=this.associatedLayer)==null?void 0:i.url)&&re(this)&&H(this).setAtOrigin("fullExtent",e.clone(),R.SERVICE)}_applyAssociatedLayerPrivileges(){const e=this.associatedLayer;e&&(this._set("userHasEditingPrivileges",e.userHasEditingPrivileges),this._set("userHasFullEditingPrivileges",e.userHasFullEditingPrivileges),this._set("userHasUpdateItemPrivileges",e.userHasUpdateItemPrivileges))}async _setAssociatedFeatureLayer(e){if(["mesh-pyramids","points"].includes(this.profile))try{const{serverUrl:t,layerId:r,portalItem:i}=await Xe(`${this.url}/layers/${this.layerId}`,{sceneLayerItem:this.portalItem,customParameters:this.customParameters,apiKey:this.apiKey,signal:e}),n=await nt.FeatureLayer();this.associatedLayer=new n({url:t,customParameters:this.customParameters,layerId:r,portalItem:i}),await this.associatedLayer.load()}catch(t){je(t)||this._logWarningOnPopupEnabled()}}async _logWarningOnPopupEnabled(){await Ae(()=>this.popupEnabled&&this.popupTemplate!=null);const e=`this SceneLayer: ${this.title}`;this.attributeStorageInfo==null?m.getLogger(this).warn(`Associated FeatureLayer could not be loaded and no binary attributes found. Popups will not work on ${e}`):m.getLogger(this).info(`Associated FeatureLayer could not be loaded. Falling back to binary attributes for Popups on ${e}`)}_validateElevationInfo(){const e=this.elevationInfo;this.profile==="mesh-pyramids"&&Z(m.getLogger(this),pt("Mesh scene layers","relative-to-scene",e)),Z(m.getLogger(this),dt("Scene layers",e))}async fetchStatistics(e,t){var r;return await ht({fieldName:e,statisticsInfo:this.statisticsInfo,errorContext:"scenelayer",fieldsIndex:this.fieldsIndex,path:((r=this.parsedUrl)==null?void 0:r.path)??"",customParameters:this.customParameters,apiKey:this.apiKey,signal:t==null?void 0:t.signal})}};s([a({types:{key:"type",base:Pe,typeMap:{selection:Re}},json:{origins:{"web-scene":{name:"layerDefinition.featureReduction",write:!0},"portal-item":{name:"layerDefinition.featureReduction",write:!0}}}})],o.prototype,"featureReduction",void 0),s([a({type:[g],json:{read:!1,origins:{"web-scene":{name:"layerDefinition.rangeInfos",write:!0},"portal-item":{name:"layerDefinition.rangeInfos",write:!0}}}})],o.prototype,"rangeInfos",void 0),s([a({json:{read:!1}})],o.prototype,"associatedLayer",void 0),s([a({type:["show","hide"]})],o.prototype,"listMode",void 0),s([a({type:["ArcGISSceneServiceLayer"]})],o.prototype,"operationalLayerType",void 0),s([a({json:{read:!1},readOnly:!0})],o.prototype,"type",void 0),s([a({...B.fields,readOnly:!0,json:{read:!1,origins:{service:{read:!0}}}})],o.prototype,"fields",void 0),s([a()],o.prototype,"types",null),s([a()],o.prototype,"typeIdField",null),s([a()],o.prototype,"templates",null),s([a()],o.prototype,"formTemplate",null),s([a({readOnly:!0,clonable:!1})],o.prototype,"fieldsIndex",null),s([a({type:De,json:{read:{source:"layerDefinition.floorInfo"},write:{target:"layerDefinition.floorInfo"}}})],o.prototype,"floorInfo",void 0),s([a(B.outFields)],o.prototype,"outFields",void 0),s([a({type:te,readOnly:!0,json:{read:!1}})],o.prototype,"nodePages",void 0),s([v("service","nodePages",["nodePages","pointNodePages"])],o.prototype,"readNodePages",null),s([a({type:[rt],readOnly:!0})],o.prototype,"materialDefinitions",void 0),s([a({type:[it],readOnly:!0})],o.prototype,"textureSetDefinitions",void 0),s([a({type:[st],readOnly:!0})],o.prototype,"geometryDefinitions",void 0),s([a({readOnly:!0})],o.prototype,"serviceUpdateTimeStamp",void 0),s([a({readOnly:!0})],o.prototype,"attributeStorageInfo",void 0),s([a({readOnly:!0})],o.prototype,"statisticsInfo",void 0),s([a({type:q.ofType(Number),nonNullable:!0,json:{origins:{service:{read:!1,write:!1}},name:"layerDefinition.excludeObjectIds",write:{enabled:!0}}})],o.prototype,"excludeObjectIds",void 0),s([a({type:String,json:{origins:{service:{read:!1,write:!1}},name:"layerDefinition.definitionExpression",write:{enabled:!0,allowNull:!0}}})],o.prototype,"definitionExpression",void 0),s([a({type:yt,json:{name:"layerDefinition.polygonFilter",write:{enabled:!0,allowNull:!0},origins:{service:{read:!1,write:!1}}}})],o.prototype,"filter",void 0),s([a({type:String,json:{origins:{"web-scene":{read:!0,write:!0}},read:!1}})],o.prototype,"path",void 0),s([a(Ue)],o.prototype,"elevationInfo",null),s([a({readOnly:!0,json:{read:!1}})],o.prototype,"effectiveCapabilities",null),s([a({readOnly:!0})],o.prototype,"effectiveEditingEnabled",null),s([a({type:String})],o.prototype,"geometryType",null),s([a(Ne)],o.prototype,"labelsVisible",void 0),s([a({type:[qe],json:{origins:{service:{name:"drawingInfo.labelingInfo",read:{reader:M},write:!1}},name:"layerDefinition.drawingInfo.labelingInfo",read:{reader:M},write:!0}})],o.prototype,"labelingInfo",void 0),s([a(Ce)],o.prototype,"legendEnabled",void 0),s([a({type:Number,json:{origins:{"web-document":{default:1,write:{enabled:!0,target:{opacity:{type:Number},"layerDefinition.drawingInfo.transparency":{type:Number}}},read:{source:["opacity","layerDefinition.drawingInfo.transparency"],reader(e,t){var i,n;if(typeof e=="number"&&e>=0&&e<=1)return e;const r=(n=(i=t.layerDefinition)==null?void 0:i.drawingInfo)==null?void 0:n.transparency;return r!==void 0?Ge(r):void 0}}},"portal-item":{write:!0},service:{read:!1}}}})],o.prototype,"opacity",void 0),s([a({type:["Low","High"],readOnly:!0,json:{read:!1,origins:{service:{read:!0}}}})],o.prototype,"priority",void 0),s([a({type:["Labels"],readOnly:!0,json:{read:!1,origins:{service:{read:!0}}}})],o.prototype,"semantic",void 0),s([a({types:Ve,json:{origins:{service:{read:{source:"drawingInfo.renderer"}}},name:"layerDefinition.drawingInfo.renderer",write:!0},value:null})],o.prototype,"renderer",null),s([a({json:{read:!1}})],o.prototype,"cachedDrawingInfo",void 0),s([v("service","cachedDrawingInfo")],o.prototype,"readCachedDrawingInfo",null),s([a({readOnly:!0,json:{read:!1}})],o.prototype,"capabilities",null),s([a({type:Boolean,json:{read:!1}})],o.prototype,"editingEnabled",null),s([a({readOnly:!0,json:{write:!1,read:!1}})],o.prototype,"infoFor3D",null),s([a({readOnly:!0,json:{write:!1,read:!1}})],o.prototype,"relationships",null),s([a(Qe)],o.prototype,"popupEnabled",void 0),s([a({type:ke,json:{name:"popupInfo",write:!0}})],o.prototype,"popupTemplate",void 0),s([a({readOnly:!0,json:{read:!1}})],o.prototype,"defaultPopupTemplate",null),s([a({type:String,json:{read:!1}})],o.prototype,"objectIdField",void 0),s([v("service","objectIdField",["objectIdField","fields"])],o.prototype,"readObjectIdField",null),s([a({type:String,json:{read:!1}})],o.prototype,"globalIdField",void 0),s([v("service","globalIdField",["globalIdField","fields"])],o.prototype,"readGlobalIdField",null),s([a({readOnly:!0,type:String,json:{read:!1}})],o.prototype,"displayField",null),s([a({type:String,json:{read:!1}})],o.prototype,"profile",void 0),s([v("service","profile",["store.profile"])],o.prototype,"readProfile",null),s([a({readOnly:!0,type:String,json:{origins:{service:{read:{source:"store.normalReferenceFrame"}}},read:!1}})],o.prototype,"normalReferenceFrame",void 0),s([a(ze)],o.prototype,"screenSizePerspectiveEnabled",void 0),s([a({json:{read:!1,origins:{service:{read:!0}}}})],o.prototype,"serviceItemId",void 0),s([a(Ke)],o.prototype,"useViewTime",null),o=s([b("esri.layers.SceneLayer")],o);const X={"mesh-pyramids":"mesh-pyramids",meshpyramids:"mesh-pyramids","features-meshes":"mesh-pyramids",points:"points","features-points":"points",lines:"lines","features-lines":"lines",polygons:"polygons","features-polygons":"polygons"},vt={"mesh-pyramids":"mesh",points:"point"},gr=o;export{gr as default};