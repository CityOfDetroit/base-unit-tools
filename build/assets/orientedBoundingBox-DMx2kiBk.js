import{p as It,f as kt}from"./mat3-D_76PMBI.js";import{t as Ut,e as ta}from"./mat3f64-q3fE-ZOt.js";import{e as aa}from"./mat4f64-CSKppSlJ.js";import{X as sa,O as U,x as ia}from"./quat-xbvR041S.js";import{o as Rt,e as xt}from"./quatf64-Bdb9ZJJK.js";import{c4 as et,c6 as lt,au as d,av as Pt,bo as ea,g7 as W,fD as y,g8 as mt,g9 as Ft,ga as na,bm as oa,gb as ra,gc as Ct,bk as St,gd as Bt,fF as ha,cM as Dt,cL as ca,ge as ua,cK as da,gf as vt,gg as gt,gh as fa,gi as la,fj as Qt}from"./index-DD9VVSMx.js";import{a as _t}from"./spatialReferenceEllipsoidUtils-CyFlHXsH.js";import{u as ma}from"./computeTranslationToOriginAndRotation-BUk5kU4N.js";import{c as Tt,o as _a,F as pt}from"./plane-DLjxSU1h.js";import{n as ga}from"./vec2f64-DA6GkJuH.js";var qt;(function(i){i[i.Global=1]="Global",i[i.Local=2]="Local"})(qt||(qt={}));class Vt{constructor(t,a,s=a){this.data=t,this.size=a,this.stride=s}}class Ka extends Vt{constructor(t,a,s,n=!1,o=s){super(t,s,o),this.indices=a,this.exclusive=n}}const nt=1e-6,ot=d(),bt=d();function ba(i,t){const{data:a,size:s}=i,n=a.length/s;if(n<=0)return;const o=new qa(i);yt(ot,o.minProj,o.maxProj),dt(ot,ot,.5),N(bt,o.maxProj,o.minProj);const r=wt(bt),c=new wa;c.quality=r,n<14&&(i=new Vt(new Float64Array(o.buffer,112,42),3));const e=d(),h=d(),b=d(),m=d(),z=d(),A=d(),M=d();switch(Ma(o,i,M,e,h,b,m,z,A,c)){case 1:return void Ht(ot,bt,t);case 2:return void pa(i,m,t)}$a(i,M,e,h,b,m,z,A,c),Lt(i,c.b0,c.b1,c.b2,at,st);const E=d();N(E,st,at),c.quality=wt(E),c.quality<r?Wt(c.b0,c.b1,c.b2,at,st,E,t):Ht(ot,bt,t)}function Ma(i,t,a,s,n,o,r,c,e,h){return Pa(i,s,n),Nt(s,n)<nt?1:(N(r,s,n),g(r,r),ja(t,s,r,o)<nt?2:(N(c,n,o),g(c,c),N(e,o,s),g(e,e),V(a,c,r),g(a,a),L(t,a,r,c,e,h),0))}const rt=d(),ht=d(),p=d(),I=d(),q=d(),O=d(),X=d(),R=d();function $a(i,t,a,s,n,o,r,c,e){xa(i,t,a,rt,ht),rt[0]!==void 0&&(N(p,rt,a),g(p,p),N(I,rt,s),g(I,I),N(q,rt,n),g(q,q),V(O,I,o),g(O,O),V(X,q,r),g(X,X),V(R,p,c),g(R,R),L(i,O,o,I,p,e),L(i,X,r,q,I,e),L(i,R,c,p,q,e)),ht[0]!==void 0&&(N(p,ht,a),g(p,p),N(I,ht,s),g(I,I),N(q,ht,n),g(q,q),V(O,I,o),g(O,O),V(X,q,r),g(X,X),V(R,p,c),g(R,R),L(i,O,o,I,p,e),L(i,X,r,q,I,e),L(i,R,c,p,q,e))}function Pa(i,t,a){let s=Nt(i.maxVert[0],i.minVert[0]),n=0;for(let o=1;o<7;++o){const r=Nt(i.maxVert[o],i.minVert[o]);r>s&&(s=r,n=o)}S(t,i.minVert[n]),S(a,i.maxVert[n])}const w=[0,0,0];function ja(i,t,a,s){const{data:n,size:o}=i;let r=Number.NEGATIVE_INFINITY,c=0;for(let e=0;e<n.length;e+=o){w[0]=n[e]-t[0],w[1]=n[e+1]-t[1],w[2]=n[e+2]-t[2];const h=a[0]*w[0]+a[1]*w[1]+a[2]*w[2],b=a[0]*a[0]+a[1]*a[1]+a[2]*a[2],m=w[0]*w[0]+w[1]*w[1]+w[2]*w[2]-h*h/b;m>r&&(r=m,c=e)}return S(s,n,c),r}const _=ga();function xa(i,t,a,s,n){za(i,t,_,n,s);const o=Kt(a,t);_[1]-nt<=o&&(s[0]=void 0),_[0]+nt>=o&&(n[0]=void 0)}const Et=d(),Gt=d(),Yt=d(),Z=d(),K=d(),Mt=d();function L(i,t,a,s,n,o){if(Zt(t)<nt)return;V(Et,a,t),V(Gt,s,t),V(Yt,n,t),tt(i,t,_),K[1]=_[0],Z[1]=_[1],Mt[1]=Z[1]-K[1];const r=[a,s,n],c=[Et,Gt,Yt];for(let e=0;e<3;++e){tt(i,r[e],_),K[0]=_[0],Z[0]=_[1],tt(i,c[e],_),K[2]=_[0],Z[2]=_[1],Mt[0]=Z[0]-K[0],Mt[2]=Z[2]-K[2];const h=wt(Mt);h<o.quality&&(S(o.b0,r[e]),S(o.b1,t),S(o.b2,c[e]),o.quality=h)}}const Sa=d();function tt(i,t,a){const{data:s,size:n}=i;a[0]=Number.POSITIVE_INFINITY,a[1]=Number.NEGATIVE_INFINITY;for(let o=0;o<s.length;o+=n){const r=s[o]*t[0]+s[o+1]*t[1]+s[o+2]*t[2];a[0]=Math.min(a[0],r),a[1]=Math.max(a[1],r)}}function za(i,t,a,s,n){const{data:o,size:r}=i;S(s,o),S(n,s),a[0]=Kt(Sa,t),a[1]=a[0];for(let c=r;c<o.length;c+=r){const e=o[c]*t[0]+o[c+1]*t[1]+o[c+2]*t[2];e<a[0]&&(a[0]=e,S(s,o,c)),e>a[1]&&(a[1]=e,S(n,o,c))}}function Ht(i,t,a){a.center=i,a.halfSize=et(t,t,.5),a.quaternion=Rt}const G=d(),J=d(),ct=d(),at=d(),st=d(),Ot=d();function pa(i,t,a){S(G,t),Math.abs(t[0])>Math.abs(t[1])&&Math.abs(t[0])>Math.abs(t[2])?G[0]=0:Math.abs(t[1])>Math.abs(t[2])?G[1]=0:G[2]=0,Zt(G)<nt&&(G[0]=G[1]=G[2]=1),V(J,t,G),g(J,J),V(ct,t,J),g(ct,ct),Lt(i,t,J,ct,at,st),N(Ot,st,at),Wt(t,J,ct,at,st,Ot,a)}function Lt(i,t,a,s,n,o){tt(i,t,_),n[0]=_[0],o[0]=_[1],tt(i,a,_),n[1]=_[0],o[1]=_[1],tt(i,s,_),n[2]=_[0],o[2]=_[1]}const B=d(),ut=d(),$t=d(),Q=Ut(1,0,0,0,1,0,0,0,1),Ia=xt();function Wt(i,t,a,s,n,o,r){Q[0]=i[0],Q[1]=i[1],Q[2]=i[2],Q[3]=t[0],Q[4]=t[1],Q[5]=t[2],Q[6]=a[0],Q[7]=a[1],Q[8]=a[2],r.quaternion=ya(Ia,Q),yt(B,s,n),dt(B,B,.5),dt(ut,i,B[0]),dt($t,t,B[1]),yt(ut,ut,$t),dt($t,a,B[2]),r.center=lt(ut,ut,$t),r.halfSize=et(B,o,.5)}const P=7;let qa=class{constructor(t){this.minVert=new Array(P),this.maxVert=new Array(P);const a=64*P;this.buffer=new ArrayBuffer(a);let s=0;this.minProj=new Float64Array(this.buffer,s,P),s+=8*P,this.maxProj=new Float64Array(this.buffer,s,P),s+=8*P;for(let e=0;e<P;++e)this.minVert[e]=new Float64Array(this.buffer,s,3),s+=24;for(let e=0;e<P;++e)this.maxVert[e]=new Float64Array(this.buffer,s,3),s+=24;for(let e=0;e<P;++e)this.minProj[e]=Number.POSITIVE_INFINITY,this.maxProj[e]=Number.NEGATIVE_INFINITY;const n=new Array(P),o=new Array(P),{data:r,size:c}=t;for(let e=0;e<r.length;e+=c){let h=r[e];h<this.minProj[0]&&(this.minProj[0]=h,n[0]=e),h>this.maxProj[0]&&(this.maxProj[0]=h,o[0]=e),h=r[e+1],h<this.minProj[1]&&(this.minProj[1]=h,n[1]=e),h>this.maxProj[1]&&(this.maxProj[1]=h,o[1]=e),h=r[e+2],h<this.minProj[2]&&(this.minProj[2]=h,n[2]=e),h>this.maxProj[2]&&(this.maxProj[2]=h,o[2]=e),h=r[e]+r[e+1]+r[e+2],h<this.minProj[3]&&(this.minProj[3]=h,n[3]=e),h>this.maxProj[3]&&(this.maxProj[3]=h,o[3]=e),h=r[e]+r[e+1]-r[e+2],h<this.minProj[4]&&(this.minProj[4]=h,n[4]=e),h>this.maxProj[4]&&(this.maxProj[4]=h,o[4]=e),h=r[e]-r[e+1]+r[e+2],h<this.minProj[5]&&(this.minProj[5]=h,n[5]=e),h>this.maxProj[5]&&(this.maxProj[5]=h,o[5]=e),h=r[e]-r[e+1]-r[e+2],h<this.minProj[6]&&(this.minProj[6]=h,n[6]=e),h>this.maxProj[6]&&(this.maxProj[6]=h,o[6]=e)}for(let e=0;e<P;++e){let h=n[e];S(this.minVert[e],r,h),h=o[e],S(this.maxVert[e],r,h)}}},wa=class{constructor(){this.b0=Pt(1,0,0),this.b1=Pt(0,1,0),this.b2=Pt(0,0,1),this.quality=0}};function wt(i){return i[0]*i[1]+i[0]*i[2]+i[1]*i[2]}function yt(i,t,a){i[0]=t[0]+a[0],i[1]=t[1]+a[1],i[2]=t[2]+a[2]}function N(i,t,a){i[0]=t[0]-a[0],i[1]=t[1]-a[1],i[2]=t[2]-a[2]}function dt(i,t,a){i[0]=t[0]*a,i[1]=t[1]*a,i[2]=t[2]*a}function S(i,t,a=0){i[0]=t[a],i[1]=t[a+1],i[2]=t[a+2]}function V(i,t,a){const s=t[0],n=t[1],o=t[2],r=a[0],c=a[1],e=a[2];i[0]=n*e-o*c,i[1]=o*r-s*e,i[2]=s*c-n*r}function g(i,t){const a=t[0]*t[0]+t[1]*t[1]+t[2]*t[2];if(a>0){const s=1/Math.sqrt(a);i[0]=t[0]*s,i[1]=t[1]*s,i[2]=t[2]*s}}function Zt(i){return i[0]*i[0]+i[1]*i[1]+i[2]*i[2]}function Nt(i,t){const a=t[0]-i[0],s=t[1]-i[1],n=t[2]-i[2];return a*a+s*s+n*n}function Kt(i,t){return i[0]*t[0]+i[1]*t[1]+i[2]*t[2]}function ya(i,t){const a=t[0]+t[4]+t[8];if(a>0){let s=Math.sqrt(a+1);i[3]=.5*s,s=.5/s,i[0]=(t[5]-t[7])*s,i[1]=(t[6]-t[2])*s,i[2]=(t[1]-t[3])*s}else{let s=0;t[4]>t[0]&&(s=1),t[8]>t[3*s+s]&&(s=2);const n=(s+1)%3,o=(s+2)%3;let r=Math.sqrt(t[3*s+s]-t[3*n+n]-t[3*o+o]+1);i[s]=.5*r,r=.5/r,i[3]=(t[3*n+o]-t[3*o+n])*r,i[n]=(t[3*n+s]+t[3*s+n])*r,i[o]=(t[3*o+s]+t[3*s+o])*r}return i}class ft{constructor(t=ea,a=Ga,s=Rt){this._data=[t[0],t[1],t[2],a[0],a[1],a[2],s[0],s[1],s[2],s[3]]}clone(){const t=new ft;return t._data=this._data.slice(),t}invalidate(){this._data[3]=-1}get isValid(){return this._data[3]>=0}static fromData(t){const a=new ft;return a._data=t.slice(),a}static fromJSON(t){return new ft(t.center,t.halfSize,t.quaternion)}copy(t){this._data=t.data.slice()}get center(){return W(Tt.get(),this._data[0],this._data[1],this._data[2])}get centerX(){return this._data[0]}get centerY(){return this._data[1]}get centerZ(){return this._data[2]}getCenter(t){return t[0]=this._data[0],t[1]=this._data[1],t[2]=this._data[2],t}set center(t){this._data[0]=t[0],this._data[1]=t[1],this._data[2]=t[2]}setCenter(t,a,s){this._data[0]=t,this._data[1]=a,this._data[2]=s}get halfSize(){return W(Tt.get(),this._data[3],this._data[4],this._data[5])}get halfSizeX(){return this._data[3]}get halfSizeY(){return this._data[4]}get halfSizeZ(){return this._data[5]}getHalfSize(t){return t[0]=this._data[3],t[1]=this._data[4],t[2]=this._data[5],t}set halfSize(t){this._data[3]=t[0],this._data[4]=t[1],this._data[5]=t[2]}get quaternion(){return sa(_a.get(),this._data[6],this._data[7],this._data[8],this._data[9])}getQuaternion(t){return t[0]=this._data[6],t[1]=this._data[7],t[2]=this._data[8],t[3]=this._data[9],t}set quaternion(t){this._data[6]=t[0],this._data[7]=t[1],this._data[8]=t[2],this._data[9]=t[3]}get data(){return this._data}getCorners(t){const a=l,s=this._data;a[0]=s[6],a[1]=s[7],a[2]=s[8],a[3]=s[9];for(let n=0;n<8;++n){const o=t[n];o[0]=(1&n?-1:1)*s[3],o[1]=(2&n?-1:1)*s[4],o[2]=(4&n?-1:1)*s[5],y(o,o,a),o[0]+=s[0],o[1]+=s[1],o[2]+=s[2]}}doesIntersectFrustumConservativeApproximation(t){return this.intersectPlane(t[0])<=0&&this.intersectPlane(t[1])<=0&&this.intersectPlane(t[2])<=0&&this.intersectPlane(t[3])<=0&&this.intersectPlane(t[4])<=0&&this.intersectPlane(t[5])<=0}get radius(){const t=this._data[3],a=this._data[4],s=this._data[5];return Math.sqrt(t*t+a*a+s*s)}intersectSphere(t){u[0]=this._data[0]-t[0],u[1]=this._data[1]-t[1],u[2]=this._data[2]-t[2];const a=this.getQuaternion(H);return U(l,a),y(u,u,l),mt(u,u),Y[0]=Math.min(u[0],this._data[3]),Y[1]=Math.min(u[1],this._data[4]),Y[2]=Math.min(u[2],this._data[5]),Ft(Y,u)<t[3]*t[3]}intersectSphereWithMBS(t,a=this.radius){const s=this._data;u[0]=s[0]-t[0],u[1]=s[1]-t[1],u[2]=s[2]-t[2];const n=t[3],o=n+a;return!(na(u)>o*o)&&(l[0]=-s[6],l[1]=-s[7],l[2]=-s[8],l[3]=s[9],y(u,u,l),mt(u,u),Y[0]=Math.min(u[0],s[3]),Y[1]=Math.min(u[1],s[4]),Y[2]=Math.min(u[2],s[5]),Ft(Y,u)<n*n)}intersectPlane(t){const a=t[0]*this._data[0]+t[1]*this._data[1]+t[2]*this._data[2]+t[3],s=this.projectedRadius(pt(t));return a>s?1:a<-s?-1:0}intersectRay(t,a,s=0){const n=this._data,o=l;o[0]=-n[6],o[1]=-n[7],o[2]=-n[8],o[3]=n[9],u[0]=t[0]-n[0],u[1]=t[1]-n[1],u[2]=t[2]-n[2];const r=y(u,u,l),c=y(Y,a,l);let e=-1/0,h=1/0;const b=this.getHalfSize(it);for(let m=0;m<3;m++){const z=r[m],A=c[m],M=b[m]+s;if(Math.abs(A)>1e-6){const E=(M-z)/A,$=(-M-z)/A;e=Math.max(e,Math.min(E,$)),h=Math.min(h,Math.max(E,$))}else if(z>M||z<-M)return!1}return e<=h}projectedArea(t,a,s,n){const o=this.getQuaternion(H);U(l,o),u[0]=t[0]-this._data[0],u[1]=t[1]-this._data[1],u[2]=t[2]-this._data[2],y(u,u,l);const r=this.getHalfSize(it),c=u[0]<-r[0]?-1:u[0]>r[0]?1:0,e=u[1]<-r[1]?-1:u[1]>r[1]?1:0,h=u[2]<-r[2]?-1:u[2]>r[2]?1:0,b=Math.abs(c)+Math.abs(e)+Math.abs(h);if(b===0)return 1/0;const m=b===1?4:6,z=6*(c+3*e+9*h+13);It(k,o),kt(k,k,r);const A=this.getCenter(v);for(let $=0;$<m;$++){const zt=Aa[z+$];W(u,((1&zt)<<1)-1,(2&zt)-1,((4&zt)>>1)-1),oa(u,u,k),lt(D,A,u),D[3]=1,ra(D,D,a);const At=1/Math.max(1e-6,D[3]);F[2*$]=D[0]*At,F[2*$+1]=D[1]*At}const M=2*m-2;let E=F[0]*(F[3]-F[M+1])+F[M]*(F[1]-F[M-1]);for(let $=2;$<M;$+=2)E+=F[$]*(F[$+3]-F[$-1]);return Math.abs(E)*s*n*.125}projectedRadius(t){const a=this.getQuaternion(H);return U(l,a),y(u,t,l),Math.abs(u[0]*this._data[3])+Math.abs(u[1]*this._data[4])+Math.abs(u[2]*this._data[5])}minimumDistancePlane(t){return t[0]*this._data[0]+t[1]*this._data[1]+t[2]*this._data[2]+t[3]-this.projectedRadius(pt(t))}maximumDistancePlane(t){return t[0]*this._data[0]+t[1]*this._data[1]+t[2]*this._data[2]+t[3]+this.projectedRadius(pt(t))}toAaBoundingBox(t){const a=this.getQuaternion(H),s=It(k,a),n=this._data[3]*Math.abs(s[0])+this._data[4]*Math.abs(s[3])+this._data[5]*Math.abs(s[6]),o=this._data[3]*Math.abs(s[1])+this._data[4]*Math.abs(s[4])+this._data[5]*Math.abs(s[7]),r=this._data[3]*Math.abs(s[2])+this._data[4]*Math.abs(s[5])+this._data[5]*Math.abs(s[8]);t[0]=this._data[0]-n,t[1]=this._data[1]-o,t[2]=this._data[2]-r,t[3]=this._data[0]+n,t[4]=this._data[1]+o,t[5]=this._data[2]+r}transform(t,a,s,n=0,o=_t(s),r=_t(a),c=Bt(a,r)){if(s===o)a.isGeographic?Qa(this,t,a,n,r):va(this,t,a,n,r,c);else if(a.isWGS84&&(s.isWebMercator||Ct(s)))Fa(a,this,s,t,n);else if(a.isWebMercator&&Ct(s))Ca(a,this,s,t,n);else{const e=this.getCenter(v);e[2]+=n,St(e,a,0,e,s,0,1),t.center=e,this!==t&&(t.quaternion=this.getQuaternion(H),t.halfSize=this.getHalfSize(it))}}}const l=xt(),H=xt(),Na=xt(),u=d(),Y=d(),D=ha();function Va(i,t=new ft){return ba(i,t),t}const F=[.1,.2,.3,.4,.5,.6,.7,.8,.9,1,1.1,1.2],Aa=(()=>{const i=new Int8Array(162);let t=0;const a=s=>{for(let n=0;n<s.length;n++)i[t+n]=s[n];t+=6};return a([6,2,3,1,5,4]),a([0,2,3,1,5,4]),a([0,2,3,7,5,4]),a([0,1,3,2,6,4]),a([0,1,3,2,0,0]),a([0,1,5,7,3,2]),a([0,1,3,7,6,4]),a([0,1,3,7,6,2]),a([0,1,5,7,6,2]),a([0,1,5,4,6,2]),a([0,1,5,4,0,0]),a([0,1,3,7,5,4]),a([0,2,6,4,0,0]),a([0,0,0,0,0,0]),a([1,3,7,5,0,0]),a([2,3,7,6,4,0]),a([2,3,7,6,0,0]),a([2,3,1,5,7,6]),a([0,1,5,7,6,2]),a([0,1,5,7,6,4]),a([0,1,3,7,6,4]),a([4,5,7,6,2,0]),a([4,5,7,6,0,0]),a([4,5,1,3,7,6]),a([0,2,3,7,5,4]),a([6,2,3,7,5,4]),a([6,2,3,1,5,4]),i})();function Ua(i,t,a,s,n){const o=i.getQuaternion(H);n.quaternion=o,U(l,o);const r=i.getCenter(v),c=i.getHalfSize(it);if(s===qt.Global){y(f,r,l),mt(C,f),da(x,C,c),Dt(x,C,x);const e=vt(x);lt(x,C,c);const h=vt(x);if(e<a)n.center=r,W(f,a,a,a),n.halfSize=lt(f,c,f);else{const b=h>0?1+t/h:1,m=e>0?1+a/e:1,z=(m+b)/2,A=(m-b)/2;et(x,C,A),n.halfSize=gt(x,x,c,z),et(x,C,z),gt(x,x,c,A),fa(f,f),la(f,x,f);const M=i.getQuaternion(Na);n.center=y(f,f,M)}}else{n.center=gt(f,r,Qt,(a+t)/2);const e=y(f,Qt,l);mt(e,e),n.halfSize=gt(C,c,e,(a-t)/2)}return n}function Fa(i,t,a,s,n){t.getCenter(v),v[2]+=n;const o=_t(a);St(v,i,0,v,o,0,1),Jt(o,t,v,a,s)}function Ca(i,t,a,s,n){t.getCenter(v),v[2]+=n,Jt(i,t,v,a,s)}function Jt(i,t,a,s,n){const o=t.getQuaternion(H),r=It(k,o),c=t.getHalfSize(it);for(let e=0;e<8;++e){for(let h=0;h<3;++h)T[h]=c[h]*(e&1<<h?-1:1);for(let h=0;h<3;++h){let b=a[h];for(let m=0;m<3;++m)b+=T[m]*r[3*m+h];jt[3*e+h]=b}}St(jt,i,0,jt,s,0,8),Va(Ta,n)}function va(i,t,a,s,n=_t(a),o=Bt(a,n)){i.getCorners(Xt),i.getCenter(T),T[2]+=s,ma(a,T,j,n),t.setCenter(j[12],j[13],j[14]);const r=2*Math.sqrt(1+j[0]+j[5]+j[10]);l[0]=(j[6]-j[9])/r,l[1]=(j[8]-j[2])/r,l[2]=(j[1]-j[4])/r,l[3]=.25*r;const c=i.getQuaternion(H);t.quaternion=ia(l,l,c),U(l,l),W(C,0,0,0);const e=t.getCenter(Ea);for(const h of Xt)h[2]+=s,o(h,0,h,0),Dt(f,h,e),y(f,f,l),mt(f,f),ca(C,C,f);t.halfSize=C}function Qa(i,t,a,s,n=_t(a)){const o=ua(a),r=1+Math.max(0,s)/(o.radius+i.centerZ);i.getCenter(T),T[2]+=s,St(T,a,0,T,n,0,1),t.center=T;const c=i.getQuaternion(H);t.quaternion=c,U(l,c),W(f,0,0,1),y(f,f,l);const e=i.getHalfSize(it);W(f,e[0]*Math.abs(f[0]),e[1]*Math.abs(f[1]),e[2]*Math.abs(f[2])),et(f,f,o.inverseFlattening),lt(f,e,f),t.halfSize=et(f,f,r)}const jt=new Array(24),Ta=new Vt(jt,3),T=d(),v=d(),Ea=d(),it=d(),k=ta(),j=aa(),Xt=[[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],f=d(),C=d(),x=d(),Ga=Pt(-1,-1,-1);export{ft as I,Ua as L,qt as l,Ka as t};