import{bS as Y}from"./index-CM6rNXwm.js";var A={};A.defaultNoDataValue=Y(-1/0),A.decode=function(i,t){var r=(t=t||{}).encodedMaskData||t.encodedMaskData===null,e=D(i,t.inputOffset||0,r),c=t.noDataValue!=null?Y(t.noDataValue):A.defaultNoDataValue,n=b(e,t.pixelType||Float32Array,t.encodedMaskData,c,t.returnMask),s={width:e.width,height:e.height,pixelData:n.resultPixels,minValue:e.pixels.minValue,maxValue:e.pixels.maxValue,noDataValue:c};return n.resultMask&&(s.maskData=n.resultMask),t.returnEncodedMask&&e.mask&&(s.encodedMaskData=e.mask.bitset?e.mask.bitset:null),t.returnFileInfo&&(s.fileInfo=F(e,c),t.computeUsedBitDepths&&(s.fileInfo.bitDepths=S(e))),s};var b=function(i,t,r,e,c){var n,s,d=0,m=i.pixels.numBlocksX,x=i.pixels.numBlocksY,y=Math.floor(i.width/m),v=Math.floor(i.height/x),p=2*i.maxZError;r=r||(i.mask?i.mask.bitset:null),n=new t(i.width*i.height),c&&r&&(s=new Uint8Array(i.width*i.height));for(var g,k,h=new Float32Array(y*v),M=0;M<=x;M++){var B=M!==x?v:i.height%x;if(B!==0)for(var I=0;I<=m;I++){var o=I!==m?y:i.width%m;if(o!==0){var P,a,f,w,l=M*i.width*v+I*y,U=i.width-o,u=i.pixels.blocks[d];if(u.encoding<2?(u.encoding===0?P=u.rawData:(E(u.stuffedData,u.bitsPerPixel,u.numValidPixels,u.offset,p,h,i.pixels.maxValue),P=h),a=0):f=u.encoding===2?0:u.offset,r)for(k=0;k<B;k++){for(7&l&&(w=r[l>>3],w<<=7&l),g=0;g<o;g++)7&l||(w=r[l>>3]),128&w?(s&&(s[l]=1),n[l++]=u.encoding<2?P[a++]:f):(s&&(s[l]=0),n[l++]=e),w<<=1;l+=U}else if(u.encoding<2)for(k=0;k<B;k++){for(g=0;g<o;g++)n[l++]=P[a++];l+=U}else for(k=0;k<B;k++)if(n.fill)n.fill(f,l,l+o),l+=o+U;else{for(g=0;g<o;g++)n[l++]=f;l+=U}if(u.encoding===1&&a!==u.numValidPixels)throw"Block and Mask do not match";d++}}}return{resultPixels:n,resultMask:s}},F=function(i,t){return{fileIdentifierString:i.fileIdentifierString,fileVersion:i.fileVersion,imageType:i.imageType,height:i.height,width:i.width,maxZError:i.maxZError,eofOffset:i.eofOffset,mask:i.mask?{numBlocksX:i.mask.numBlocksX,numBlocksY:i.mask.numBlocksY,numBytes:i.mask.numBytes,maxValue:i.mask.maxValue}:null,pixels:{numBlocksX:i.pixels.numBlocksX,numBlocksY:i.pixels.numBlocksY,numBytes:i.pixels.numBytes,maxValue:i.pixels.maxValue,minValue:i.pixels.minValue,noDataValue:t}}},S=function(i){for(var t=i.pixels.numBlocksX*i.pixels.numBlocksY,r={},e=0;e<t;e++){var c=i.pixels.blocks[e];c.encoding===0?r.float32=!0:c.encoding===1?r[c.bitsPerPixel]=!0:r[0]=!0}return Object.keys(r)},D=function(i,t,r){var e={},c=new Uint8Array(i,t,10);if(e.fileIdentifierString=String.fromCharCode.apply(null,c),e.fileIdentifierString.trim()!="CntZImage")throw"Unexpected file identifier string: "+e.fileIdentifierString;t+=10;var n=new DataView(i,t,24);if(e.fileVersion=n.getInt32(0,!0),e.imageType=n.getInt32(4,!0),e.height=n.getUint32(8,!0),e.width=n.getUint32(12,!0),e.maxZError=n.getFloat64(16,!0),t+=24,!r)if(n=new DataView(i,t,16),e.mask={},e.mask.numBlocksY=n.getUint32(0,!0),e.mask.numBlocksX=n.getUint32(4,!0),e.mask.numBytes=n.getUint32(8,!0),e.mask.maxValue=n.getFloat32(12,!0),t+=16,e.mask.numBytes>0){var s=new Uint8Array(Math.ceil(e.width*e.height/8)),d=(n=new DataView(i,t,e.mask.numBytes)).getInt16(0,!0),m=2,x=0;do{if(d>0)for(;d--;)s[x++]=n.getUint8(m++);else{var y=n.getUint8(m++);for(d=-d;d--;)s[x++]=y}d=n.getInt16(m,!0),m+=2}while(m<e.mask.numBytes);if(d!==-32768||x<s.length)throw"Unexpected end of mask RLE encoding";e.mask.bitset=s,t+=e.mask.numBytes}else e.mask.numBytes|e.mask.numBlocksY|e.mask.maxValue||(s=new Uint8Array(Math.ceil(e.width*e.height/8)),e.mask.bitset=s);n=new DataView(i,t,16),e.pixels={},e.pixels.numBlocksY=n.getUint32(0,!0),e.pixels.numBlocksX=n.getUint32(4,!0),e.pixels.numBytes=n.getUint32(8,!0),e.pixels.maxValue=n.getFloat32(12,!0),t+=16;var v=e.pixels.numBlocksX,p=e.pixels.numBlocksY,g=v+(e.width%v>0?1:0),k=p+(e.height%p>0?1:0);e.pixels.blocks=new Array(g*k);for(var h=1e9,M=0,B=0;B<k;B++)for(var I=0;I<g;I++){var o=0,P=i.byteLength-t;n=new DataView(i,t,Math.min(10,P));var a={};e.pixels.blocks[M++]=a;var f=n.getUint8(0);if(o++,a.encoding=63&f,a.encoding>3)throw"Invalid block encoding ("+a.encoding+")";if(a.encoding!==2){if(f!==0&&f!==2){if(f>>=6,a.offsetType=f,f===2)a.offset=n.getInt8(1),o++;else if(f===1)a.offset=n.getInt16(1,!0),o+=2;else{if(f!==0)throw"Invalid block offset type";a.offset=n.getFloat32(1,!0),o+=4}if(h=Math.min(a.offset,h),a.encoding===1)if(f=n.getUint8(o),o++,a.bitsPerPixel=63&f,f>>=6,a.numValidPixelsType=f,f===2)a.numValidPixels=n.getUint8(o),o++;else if(f===1)a.numValidPixels=n.getUint16(o,!0),o+=2;else{if(f!==0)throw"Invalid valid pixel count type";a.numValidPixels=n.getUint32(o,!0),o+=4}}var w;if(t+=o,a.encoding!=3){if(a.encoding===0){var l=(e.pixels.numBytes-1)/4;if(l!==Math.floor(l))throw"uncompressed block has invalid length";w=new ArrayBuffer(4*l),new Uint8Array(w).set(new Uint8Array(i,t,4*l));for(var U=new Float32Array(w),u=0;u<U.length;u++)h=Math.min(h,U[u]);a.rawData=U,t+=4*l}else if(a.encoding===1){var V=Math.ceil(a.numValidPixels*a.bitsPerPixel/8),X=Math.ceil(V/4);w=new ArrayBuffer(4*X),new Uint8Array(w).set(new Uint8Array(i,t,V)),a.stuffedData=new Uint32Array(w),t+=V}}}else t++,h=Math.min(h,0)}return e.pixels.minValue=h,e.eofOffset=t,e},E=function(i,t,r,e,c,n,s){var d,m,x,y=(1<<t)-1,v=0,p=0,g=Math.ceil((s-e)/c),k=4*i.length-Math.ceil(t*r/8);for(i[i.length-1]<<=8*k,d=0;d<r;d++){if(p===0&&(x=i[v++],p=32),p>=t)m=x>>>p-t&y,p-=t;else{var h=t-p;m=(x&y)<<h&y,m+=(x=i[v++])>>>(p=32-h)}n[d]=m<g?e+m*c:s}return n};const T=A.decode;class O{_decode(t){const r=T(t.buffer,t.options);return Promise.resolve({result:r,transferList:[r.pixelData.buffer]})}}function C(){return new O}export{C as default};
