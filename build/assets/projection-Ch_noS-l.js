import{bk as C,bl as b,bm as R,bn as v,at as w,bo as O,bp as x,bq as $,br as B,W,bs as Y,bt as q,bu as z,au as j,bv as J}from"./index-DKOmzAMm.js";import{j as h,n as S}from"./mat3-BNGRf_pC.js";import{e as D}from"./mat3f64-q3fE-ZOt.js";import{o as g,e as H}from"./mat4f64-CSKppSlJ.js";import{a as E}from"./spatialReferenceEllipsoidUtils-BKSgV6gI.js";import{u as G}from"./computeTranslationToOriginAndRotation-BxPeFPaY.js";import{t as L,o as I}from"./DoubleArray-D2IDWC15.js";import{i as P,T as y}from"./BufferView-DOhKdt-N.js";import{f as K,l as V,e as k}from"./vec3-C6eb5QY9.js";import{n as Q}from"./vec4-n1PBj5SL.js";import"./vec2-CurFBDJu.js";const ur="Projection may be possible after calling projection.load().";function mr(r,o,e,t){r.error(`Failed to project from (wkid:${o.wkid}) to (wkid:${e.wkid}).${t?" ":""}${t}`)}function pr(r,o,e,t,n){return M(T.TO_PCPF,P.fromTypedArray(r),p.NORMAL,y.fromTypedArray(o),y.fromTypedArray(e),t,P.fromTypedArray(n))?n:null}function Tr(r,o,e,t,n){return M(T.FROM_PCPF,P.fromTypedArray(r),p.NORMAL,y.fromTypedArray(o),y.fromTypedArray(e),t,P.fromTypedArray(n))?n:null}function Pr(r,o,e){return C(r,o,0,e,E(o),0,r.length/3)?e:null}function yr(r,o,e){return C(r,E(e),0,o,e,0,r.length/3)?o:null}function Ar(r,o,e){return h(i,e),K(o,r,i),b(i)&&V(o,o),o}function Fr(r,o,e){return S(i,e),Q(o,r,i),b(i)&&V(o,o,4),o}function dr(r,o,e,t,n){if(!M(T.TO_PCPF,P.fromTypedArray(r,4*Float32Array.BYTES_PER_ELEMENT),p.TANGENT,y.fromTypedArray(o),y.fromTypedArray(e),t,P.fromTypedArray(n,4*Float32Array.BYTES_PER_ELEMENT)))return null;for(let f=3;f<r.length;f+=4)n[f]=r[f];return n}function gr(r,o,e,t,n){if(!M(T.FROM_PCPF,P.fromTypedArray(r,16),p.TANGENT,y.fromTypedArray(o),y.fromTypedArray(e),t,P.fromTypedArray(n,16)))return null;for(let f=3;f<r.length;f+=4)n[f]=r[f];return n}var p,T;function _(r,o,e,t,n){switch(G(t,e,m,t),r===T.FROM_PCPF&&J(m,m),o){case p.NORMAL:return h(n,m);case p.TANGENT:return S(n,m)}}function M(r,o,e,t,n,f,u){if(!o)return;const l=t.count,A=E(f);if(U(f))for(let s=0;s<l;s++)n.getVec(s,N),o.getVec(s,c),R(c,c,_(r,e,N,A,i)),u.setVec(s,c);else for(let s=0;s<l;s++){n.getVec(s,N),o.getVec(s,c);const F=v(t.get(s,1));let a=Math.cos(F);e===p.TANGENT!=(r===T.TO_PCPF)&&(a=1/a),_(r,e,N,A,i),r===T.TO_PCPF?(i[0]*=a,i[1]*=a,i[2]*=a,i[3]*=a,i[4]*=a,i[5]*=a):(i[0]*=a,i[3]*=a,i[6]*=a,i[1]*=a,i[4]*=a,i[7]*=a),R(c,c,i),w(c,c),u.setVec(s,c)}return u}function Nr(r){return r.vertexSpace.type==="local"?X(r):Z(r)}function X({vertexSpace:r,transform:o,inSpatialReference:e,outSpatialReference:t,localMode:n,outPositions:f,positions:u}){const l=r.origin??O,A=r.origin!=null?(o==null?void 0:o.localMatrix)??g:g,s=E(e),F=t.isWebMercator&&n||!x(e,s)?e:s;G(e,l,m,F),$(m,m,A);const a=f??L(u.length);return k(a,u,m),C(a,F,0,a,t,0,a.length/3),a}function Z({vertexSpace:r,transform:o,outPositions:e,positions:t,inSpatialReference:n,outSpatialReference:f}){const u=r.origin!=null?(o==null?void 0:o.localMatrix)??g:g,l=e??L(t.length);B(u,g)?I(l,t):k(l,t,u);const A=r.origin??O;if(!W(A,O)){const[s,F,a]=A;for(let d=0;d<l.length;d+=3)l[d]+=s,l[d+1]+=F,l[d+2]+=a}return C(l,n,0,l,f,0,l.length/3)?l:null}function U(r){return r.isWGS84||Y(r)||q(r)||z(r)}(function(r){r[r.NORMAL=0]="NORMAL",r[r.TANGENT=1]="TANGENT"})(p||(p={})),function(r){r[r.TO_PCPF=0]="TO_PCPF",r[r.FROM_PCPF=1]="FROM_PCPF"}(T||(T={}));const N=j(),c=j(),m=H(),i=D();export{p as VectorType,ur as loadProjectErrorMessage,mr as logProjectionError,Nr as project,yr as projectFromPCPF,Tr as projectNormalFromPCPF,pr as projectNormalToPCPF,gr as projectTangentFromPCPF,dr as projectTangentToPCPF,Pr as projectToPCPF,Ar as transformNormal,Fr as transformTangent};