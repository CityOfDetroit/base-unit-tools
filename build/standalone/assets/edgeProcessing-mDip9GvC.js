import{e as Ot}from"./deduplicate-DD5Fw38l.js";import{H as F}from"./InterleavedLayout-DX3g2_Vd.js";import{e as l}from"./VertexAttribute-BlT9lbVY.js";import{C as V}from"./enums-CxXC-vJk.js";import{t as St}from"./VertexElementDescriptor-BOD-G50G.js";import{au as T,b5 as tt,gl as Et,g7 as H,c1 as rt,aq as K,gj as At,hd as Tt,ar as ht,c2 as at,at as dt,eb as Nt,c5 as wt,c6 as $t,he as yt}from"./index-CCrAUeKG.js";function et(t,e=0){const s=t.stride;return Array.from(t.fields.keys()).map(o=>{var i;const r=t.fields.get(o),c=r.constructor.ElementCount,h=Mt(r.constructor.ElementType),d=r.offset,g=((i=r.optional)==null?void 0:i.glNormalized)??!1;return new St(o,c,h,d,s,g,e)})}function Mt(t){const e=vt[t];if(e)return e;throw new Error("BufferType not supported in WebGL")}const vt={u8:V.UNSIGNED_BYTE,u16:V.UNSIGNED_SHORT,u32:V.UNSIGNED_INT,i8:V.BYTE,i16:V.SHORT,i32:V.INT,f32:V.FLOAT},Rt=F().vec3f(l.POSITION).u16(l.COMPONENTINDEX).freeze(),Pt=F().vec2u8(l.SIDENESS).freeze();et(Pt);const j=F().vec3f(l.POSITION0).vec3f(l.POSITION1).vec2i16(l.NORMALCOMPRESSED).u16(l.COMPONENTINDEX).u8(l.VARIANTOFFSET,{glNormalized:!0}).u8(l.VARIANTSTROKE).u8(l.VARIANTEXTENSION,{glNormalized:!0}).freeze(),Y=F().vec3f(l.POSITION0).vec3f(l.POSITION1).vec2i16(l.NORMALCOMPRESSED).vec2i16(l.NORMAL2COMPRESSED).u16(l.COMPONENTINDEX).u8(l.VARIANTOFFSET,{glNormalized:!0}).u8(l.VARIANTSTROKE).u8(l.VARIANTEXTENSION,{glNormalized:!0}).freeze();l.POSITION0,l.POSITION1,l.COMPONENTINDEX,l.VARIANTOFFSET,l.VARIANTSTROKE,l.VARIANTEXTENSION,l.NORMALCOMPRESSED,l.NORMAL2COMPRESSED,l.SIDENESS;let Vt=class{constructor(){this.position0=T(),this.position1=T(),this.faceNormal0=T(),this.faceNormal1=T(),this.componentIndex=0,this.cosAngle=0}};const k=-1;function xt(t,e,s){const o=t.vertices.position,r=t.vertices.componentIndex,c=O.position0,h=O.position1,d=O.faceNormal0,g=O.faceNormal1,{edges:i,normals:p}=Ct(t),m=i.length/4,E=e.allocate(m);let P=0;const B=m,w=s==null?void 0:s.allocate(B);let _=0,n=0,a=0;z.length=0;for(let N=0;N<m;++N){const y=4*N;o.getVec(i.data[y],c),o.getVec(i.data[y+1],h);const D=z.pushNew();D.index=4*N,D.length=Et(c,h)}z.sort((N,y)=>y.length-N.length);const f=new Array,u=new Array;z.forAll(({length:N,index:y})=>{const D=i.data[y],It=i.data[y+1],nt=i.data[y+2],st=i.data[y+3],ot=st===k;if(o.getVec(D,c),o.getVec(It,h),ot){const A=3*nt;H(d,p.data[A],p.data[A+1],p.data[A+2]),rt(g,d),O.componentIndex=r.get(D),O.cosAngle=K(d,g)}else{let A=3*nt;if(H(d,p.data[A],p.data[A+1],p.data[A+2]),A=3*st,H(g,p.data[A],p.data[A+1],p.data[A+2]),O.componentIndex=r.get(D),O.cosAngle=K(d,g),bt(O,_t))return;O.cosAngle<-.9999&&rt(g,d)}n+=N,a++,ot||Dt(O,Ut)?(e.write(E,P++,O),f.push(N)):Lt(O,gt)&&(w&&s&&s.write(w,_++,O),u.push(N))});const S=new Float32Array(f.reverse()),$=new Float32Array(u.reverse()),M=w&&s?{instancesData:w.slice(0,_),lodInfo:{lengths:$}}:void 0;return{regular:{instancesData:E.slice(0,P),lodInfo:{lengths:S}},silhouette:M,averageEdgeLength:n/a}}function Dt(t,e){return t.cosAngle<e}function bt(t,e){return t.cosAngle>e}function Lt(t,e){const s=At(t.cosAngle);return Tt(it,t.position1,t.position0),s*(K(ht(Bt,t.faceNormal0,t.faceNormal1),it)>0?-1:1)>e}function Ct(t){const e=t.faces.length/3,s=t.faces,o=t.neighbors,r=t.vertices.position;I.length=q.length=0;for(let c=0;c<e;c++){const h=3*c,d=o[h],g=o[h+1],i=o[h+2],p=s[h],m=s[h+1],E=s[h+2];r.getVec(p,x),r.getVec(m,U),r.getVec(E,X),at(U,U,x),at(X,X,x),ht(x,U,X),dt(x,x),q.pushArray(x),(d===k||p<m)&&(I.push(p),I.push(m),I.push(c),I.push(d)),(g===k||m<E)&&(I.push(m),I.push(E),I.push(c),I.push(g)),(i===k||E<p)&&(I.push(E),I.push(p),I.push(c),I.push(i))}return{edges:I,normals:q}}class Ft{constructor(){this.index=0,this.length=0}}const z=new tt({allocator:t=>t||new Ft,deallocator:null}),I=new tt({deallocator:null}),q=new tt({deallocator:null}),O=new Vt,Bt=T(),it=T(),x=T(),U=T(),X=T(),gt=Nt(4),_t=Math.cos(gt),zt=Nt(35),Ut=Math.cos(zt);function ct(t,e,s){const o=e/3,r=new Uint32Array(s+1),c=new Uint32Array(s+1),h=(n,a)=>{n<a?r[n+1]++:c[a+1]++};for(let n=0;n<o;n++){const a=t[3*n],f=t[3*n+1],u=t[3*n+2];h(a,f),h(f,u),h(u,a)}let d=0,g=0;for(let n=0;n<s;n++){const a=r[n+1],f=c[n+1];r[n+1]=d,c[n+1]=g,d+=a,g+=f}const i=new Uint32Array(6*o),p=r[s],m=(n,a,f)=>{if(n<a){const u=r[n+1]++;i[2*u]=a,i[2*u+1]=f}else{const u=c[a+1]++;i[2*p+2*u]=n,i[2*p+2*u+1]=f}};for(let n=0;n<o;n++){const a=t[3*n],f=t[3*n+1],u=t[3*n+2];m(a,f,n),m(f,u,n),m(u,a,n)}const E=(n,a)=>{const f=2*n,u=a-n;for(let S=1;S<u;S++){const $=i[f+2*S],M=i[f+2*S+1];let N=S-1;for(;N>=0&&i[f+2*N]>$;N--)i[f+2*N+2]=i[f+2*N],i[f+2*N+3]=i[f+2*N+1];i[f+2*N+2]=$,i[f+2*N+3]=M}};for(let n=0;n<s;n++)E(r[n],r[n+1]),E(p+c[n],p+c[n+1]);const P=new Int32Array(3*o),B=(n,a)=>n===t[3*a]?0:n===t[3*a+1]?1:n===t[3*a+2]?2:-1,w=(n,a)=>{const f=B(n,a);P[3*a+f]=-1},_=(n,a,f,u)=>{const S=B(n,a);P[3*a+S]=u;const $=B(f,u);P[3*u+$]=a};for(let n=0;n<s;n++){let a=r[n];const f=r[n+1];let u=c[n];const S=c[n+1];for(;a<f&&u<S;){const $=i[2*a],M=i[2*p+2*u];$===M?(_(n,i[2*a+1],M,i[2*p+2*u+1]),a++,u++):$<M?(w(n,i[2*a+1]),a++):(w(M,i[2*p+2*u+1]),u++)}for(;a<f;)w(n,i[2*a+1]),a++;for(;u<S;)w(i[2*p+2*u],i[2*p+2*u+1]),u++}return P}function J(t,e,s,o,r,c=2){const h=1/(Math.abs(s)+Math.abs(o)+Math.abs(r)),d=s*h,g=o*h,i=r<=0?(d>=0?1:-1)*(1-Math.abs(g)):d,p=r<=0?(g>=0?1:-1)*(1-Math.abs(d)):g,m=e*c;t[m]=lt(i),t[m+1]=lt(p)}function lt(t){return wt(Math.round(32767*t),-32767,32767)}const G=.7;let mt=class{updateSettings(e){this.settings=e,this._edgeHashFunction=e.reducedPrecision?Wt:Xt}write(e,s,o){W.seed=this._edgeHashFunction(o);const r=W.getIntRange(0,255),c=W.getIntRange(0,this.settings.variants-1),h=W.getFloat(),d=255*(.5*kt(-(1-Math.min(h/G,1))+Math.max(0,h-G)/(1-G),1.2)+.5);e.position0.setVec(s,o.position0),e.position1.setVec(s,o.position1),e.componentIndex.set(s,o.componentIndex),e.variantOffset.set(s,r),e.variantStroke.set(s,c),e.variantExtension.set(s,d)}};const v=new Float32Array(6),R=new Uint32Array(v.buffer),C=new Uint32Array(1);function Xt(t){return v[0]=t.position0[0],v[1]=t.position0[1],v[2]=t.position0[2],v[3]=t.position1[0],v[4]=t.position1[1],v[5]=t.position1[2],C[0]=31*(31*(31*(31*(31*(166811+R[0])+R[1])+R[2])+R[3])+R[4])+R[5],C[0]}function Wt(t){const e=v;e[0]=b(t.position0[0]),e[1]=b(t.position0[1]),e[2]=b(t.position0[2]),e[3]=b(t.position1[0]),e[4]=b(t.position1[1]),e[5]=b(t.position1[2]),C[0]=5381;for(let s=0;s<R.length;s++)C[0]=31*C[0]+R[s];return C[0]}const ut=1e4;function b(t){return Math.round(t*ut)/ut}function kt(t,e){return Math.abs(t)**e*Math.sign(t)}class Q{constructor(){this._commonWriter=new mt}updateSettings(e){this._commonWriter.updateSettings(e)}allocate(e){return j.createBuffer(e)}write(e,s,o){this._commonWriter.write(e,s,o),$t(L,o.faceNormal0,o.faceNormal1),dt(L,L);const{typedBuffer:r,typedBufferStride:c}=e.normalCompressed;J(r,s,L[0],L[1],L[2],c)}}Q.Layout=j,Q.glLayout=et(j,1);class Z{constructor(){this._commonWriter=new mt}updateSettings(e){this._commonWriter.updateSettings(e)}allocate(e){return Y.createBuffer(e)}write(e,s,o){this._commonWriter.write(e,s,o);{const{typedBuffer:r,typedBufferStride:c}=e.normalCompressed;J(r,s,o.faceNormal0[0],o.faceNormal0[1],o.faceNormal0[2],c)}{const{typedBuffer:r,typedBufferStride:c}=e.normal2Compressed;J(r,s,o.faceNormal1[0],o.faceNormal1[1],o.faceNormal1[2],c)}}}Z.Layout=Y,Z.glLayout=et(Y,1);const L=T(),W=new yt;function ee(t){const e=Ht(t.data,t.skipDeduplicate,t.indices,t.indicesLength);return ft.updateSettings(t.writerSettings),pt.updateSettings(t.writerSettings),xt(e,ft,pt)}function Ht(t,e,s,o){if(e){const h=ct(s,o,t.count);return new qt(s,o,h,t)}const r=Ot(t.buffer,t.stride/4,{originalIndices:s,originalIndicesLength:o}),c=ct(r.indices,o,r.uniqueCount);return{faces:r.indices,facesLength:r.indices.length,neighbors:c,vertices:Rt.createView(r.buffer)}}class qt{constructor(e,s,o,r){this.faces=e,this.facesLength=s,this.neighbors=o,this.vertices=r}}const ft=new Q,pt=new Z,ne=F().vec3f(l.POSITION0).vec3f(l.POSITION1),se=F().vec3f(l.POSITION0).vec3f(l.POSITION1).u16(l.COMPONENTINDEX);export{Rt as E,ne as d,ee as f,se as m,xt as p,Ht as u};