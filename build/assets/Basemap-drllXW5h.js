const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/layersCreator-B7QnC6RR.js","assets/index-DKOmzAMm.js","assets/index-6Ap435l7.css","assets/portalLayers-CSGJfvg_.js","assets/associatedFeatureServiceUtils-D9v5WjkL.js","assets/lazyLayerLoader-BkbwrjyD.js"])))=>i.map(i=>d[i]);
import{fq as k,fr as i,B as l,D as c,E as _,bw as D,J as V,fs as W,cn as B,a7 as h,V as L,ft as R,fu as f,fv as T,$ as j,eD as M,c7 as I,_ as H,I as w,C as G,U as N,d2 as C,S as $,ay as P,aN as x}from"./index-DKOmzAMm.js";import{t as E}from"./loadAll-Cm5pWAv4.js";import{f as U}from"./writeUtils-VdcK5efY.js";async function F(e){if(!e)return;const r=e.includes("-vector")?e.slice(0,e.indexOf("-vector")):e.includes("-3d")?e.slice(0,e.indexOf("-3d")):e,s=await k("esri/t9n/basemaps");return s[e]||s[r]}const z={satellite:{id:"satellite",classic:!0,get thumbnailUrl(){return i("esri/images/basemap/satellite.jpg")},baseMapLayers:[{id:"satellite-base-layer",url:"//services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",layerType:"ArcGISTiledMapServiceLayer",title:"World Imagery",showLegend:!1,visibility:!0,opacity:1}]},hybrid:{id:"hybrid",classic:!0,get thumbnailUrl(){return i("esri/images/basemap/hybrid.jpg")},baseMapLayers:[{id:"hybrid-base-layer",url:"//services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",layerType:"ArcGISTiledMapServiceLayer",title:"World Imagery",showLegend:!1,visibility:!0,opacity:1},{id:"hybrid-reference-layer",styleUrl:"https://cdn.arcgis.com/sharing/rest/content/items/30d6b8271e1849cd9c3042060001f425/resources/styles/root.json",layerType:"VectorTileLayer",title:"Hybrid Reference Layer",isReference:!0,showLegend:!1,visibility:!0,opacity:1}]},terrain:{id:"terrain",classic:!0,get thumbnailUrl(){return i("esri/images/basemap/terrain.jpg")},baseMapLayers:[{id:"terrain-base-layer",url:"//services.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer",layerType:"ArcGISTiledMapServiceLayer",title:"World Terrain Base",showLegend:!1,visibility:!0,opacity:1},{id:"terrain-reference-layer",url:"//services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer",layerType:"ArcGISTiledMapServiceLayer",title:"World Reference Overlay",isReference:!0,showLegend:!1,visibility:!0,opacity:1}]},oceans:{id:"oceans",classic:!0,get thumbnailUrl(){return i("esri/images/basemap/oceans.jpg")},baseMapLayers:[{id:"oceans-base-layer",url:"//services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer",layerType:"ArcGISTiledMapServiceLayer",title:"World Ocean Base",showLegend:!1,visibility:!0,opacity:1},{id:"oceans-reference-layer",url:"//services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer",layerType:"ArcGISTiledMapServiceLayer",title:"World Ocean Reference",isReference:!0,showLegend:!1,visibility:!0,opacity:1}]},osm:{id:"osm",classic:!0,get thumbnailUrl(){return i("esri/images/basemap/osm.jpg")},baseMapLayers:[{id:"osm-base-layer",layerType:"OpenStreetMap",title:"Open Street Map",showLegend:!1,visibility:!0,opacity:1}]},"dark-gray-vector":{id:"dark-gray-vector",classic:!0,get thumbnailUrl(){return i("esri/images/basemap/dark-gray-vector.jpg")},baseMapLayers:[{id:"dark-gray-base-layer",styleUrl:"https://cdn.arcgis.com/sharing/rest/content/items/5e9b3685f4c24d8781073dd928ebda50/resources/styles/root.json",layerType:"VectorTileLayer",title:"Dark Gray Base",visibility:!0,opacity:1},{id:"dark-gray-reference-layer",styleUrl:"https://cdn.arcgis.com/sharing/rest/content/items/747cb7a5329c478cbe6981076cc879c5/resources/styles/root.json",layerType:"VectorTileLayer",title:"Dark Gray Reference",isReference:!0,visibility:!0,opacity:1}]},get"dark-gray"(){return{...this["dark-gray-vector"],id:"dark-gray"}},"gray-vector":{id:"gray-vector",classic:!0,get thumbnailUrl(){return i("esri/images/basemap/gray-vector.jpg")},baseMapLayers:[{id:"gray-base-layer",styleUrl:"https://cdn.arcgis.com/sharing/rest/content/items/291da5eab3a0412593b66d384379f89f/resources/styles/root.json",layerType:"VectorTileLayer",title:"Light Gray Base",visibility:!0,opacity:1},{id:"gray-reference-layer",styleUrl:"https://cdn.arcgis.com/sharing/rest/content/items/1768e8369a214dfab4e2167d5c5f2454/resources/styles/root.json",layerType:"VectorTileLayer",title:"Light Gray Reference",isReference:!0,visibility:!0,opacity:1}]},get gray(){return{...this["gray-vector"],id:"gray"}},"streets-vector":{id:"streets-vector",classic:!0,get thumbnailUrl(){return i("esri/images/basemap/streets-vector.jpg")},baseMapLayers:[{id:"streets-vector-base-layer",styleUrl:"//cdn.arcgis.com/sharing/rest/content/items/de26a3cf4cc9451298ea173c4b324736/resources/styles/root.json",layerType:"VectorTileLayer",title:"World Streets",visibility:!0,opacity:1}]},get streets(){return{...this["streets-vector"],id:"streets"}},"topo-vector":{id:"topo-vector",classic:!0,get thumbnailUrl(){return i("esri/images/basemap/topo-vector.jpg")},baseMapLayers:[{id:"world-hillshade-layer",url:"//services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer",layerType:"ArcGISTiledMapServiceLayer",title:"World Hillshade",showLegend:!1,visibility:!0,opacity:1},{id:"topo-vector-base-layer",styleUrl:"//cdn.arcgis.com/sharing/rest/content/items/7dc6cea0b1764a1f9af2e679f642f0f5/resources/styles/root.json",layerType:"VectorTileLayer",title:"World Topo",visibility:!0,opacity:1}]},get topo(){return{...this["topo-vector"],id:"topo"}},"streets-night-vector":{id:"streets-night-vector",classic:!0,get thumbnailUrl(){return i("esri/images/basemap/streets-night.jpg")},baseMapLayers:[{id:"streets-night-vector-base-layer",styleUrl:"//cdn.arcgis.com/sharing/rest/content/items/86f556a2d1fd468181855a35e344567f/resources/styles/root.json",layerType:"VectorTileLayer",title:"World Streets Night",visibility:!0,opacity:1}]},"streets-relief-vector":{id:"streets-relief-vector",classic:!0,get thumbnailUrl(){return i("esri/images/basemap/streets-relief.jpg")},baseMapLayers:[{id:"world-hillshade-layer",url:"//services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer",layerType:"ArcGISTiledMapServiceLayer",title:"World Hillshade",showLegend:!1,visibility:!0,opacity:1},{id:"streets-relief-vector-base-layer",styleUrl:"//www.arcgis.com/sharing/rest/content/items/b266e6d17fc345b498345613930fbd76/resources/styles/root.json",title:"World Streets Relief",layerType:"VectorTileLayer",visibility:!0,opacity:1}]},"streets-navigation-vector":{id:"streets-navigation-vector",classic:!0,get thumbnailUrl(){return i("esri/images/basemap/streets-navigation.jpg")},baseMapLayers:[{id:"streets-navigation-vector-base-layer",styleUrl:"//cdn.arcgis.com/sharing/rest/content/items/63c47b7177f946b49902c24129b87252/resources/styles/root.json",layerType:"VectorTileLayer",title:"World Streets Navigation",visibility:!0,opacity:1}]},"topo-3d":{id:"topo-3d",is3d:!0,get thumbnailUrl(){return i("esri/images/basemap/topo-3d.png")},baseMapLayers:[{id:"topo-3d-base-layer",styleUrl:"https://www.arcgis.com/sharing/rest/content/items/1e7d1784d1ef4b79ba6764d0bd6c3150/resources/styles/root.json",layerType:"VectorTileLayer",title:"Topographic",visibility:!0,opacity:1},{id:"topo-3d-trees",title:"Trees",url:"https://basemaps3d.arcgis.com/arcgis/rest/services/OpenStreetMap3D_Trees_Thematic_v1/SceneServer",itemId:"f75fef56b2d944fe92ef9f7737b4f953",layerType:"ArcGISSceneServiceLayer"},{id:"topo-3d-places-and-labels",title:"Places and Labels",url:"https://basemaps3d.arcgis.com/arcgis/rest/services/OpenStreetMap3D_DarkLabels_v1/SceneServer",itemId:"a84404ad39c64c328d0596e361ec459b",layerType:"ArcGISSceneServiceLayer"},{id:"topo-3d-buildings",title:"Buildings",url:"https://basemaps3d.arcgis.com/arcgis/rest/services/OpenStreetMap3D_Buildings_v1/SceneServer",itemId:"ca0470dbbddb4db28bad74ed39949e25",layerType:"ArcGISSceneServiceLayer"}]},"navigation-3d":{id:"navigation-3d",is3d:!0,get thumbnailUrl(){return i("esri/images/basemap/navigation-3d.jpg")},baseMapLayers:[{id:"navigation-3d-base-layer",styleUrl:"https://www.arcgis.com/sharing/rest/content/items/ccc904ff872b4144b94934e55e32784b/resources/styles/root.json",layerType:"VectorTileLayer",title:"Navigation",visibility:!0,opacity:1},{id:"navigation-3d-places-and-labels",title:"Places and Labels",url:"https://basemaps3d.arcgis.com/arcgis/rest/services/OpenStreetMap3D_DarkLabels_v1/SceneServer",itemId:"a84404ad39c64c328d0596e361ec459b",layerType:"ArcGISSceneServiceLayer"},{id:"navigation-3d-buildings",title:"Buildings",url:"https://basemaps3d.arcgis.com/arcgis/rest/services/OpenStreetMap3D_Buildings_v1/SceneServer",itemId:"ca0470dbbddb4db28bad74ed39949e25",layerType:"ArcGISSceneServiceLayer"}]},"streets-3d":{id:"streets-3d",is3d:!0,get thumbnailUrl(){return i("esri/images/basemap/streets-3d.png")},baseMapLayers:[{id:"streets-3d-base-layer",styleUrl:"https://www.arcgis.com/sharing/rest/content/items/198298c4c64c4cb19de5b46aa00c198d/resources/styles/root.json",layerType:"VectorTileLayer",title:"Streets",visibility:!0,opacity:1},{id:"streets-3d-places-and-labels",title:"Places and Labels",url:"https://basemaps3d.arcgis.com/arcgis/rest/services/OpenStreetMap3D_DarkLabels_v1/SceneServer",itemId:"a84404ad39c64c328d0596e361ec459b",layerType:"ArcGISSceneServiceLayer"},{id:"streets-3d-buildings",title:"Buildings",url:"https://basemaps3d.arcgis.com/arcgis/rest/services/OpenStreetMap3D_Buildings_v1/SceneServer",itemId:"ca0470dbbddb4db28bad74ed39949e25",layerType:"ArcGISSceneServiceLayer"}]},"osm-3d":{id:"osm-3d",is3d:!0,get thumbnailUrl(){return i("esri/images/basemap/osm-3d.png")},baseMapLayers:[{id:"osm-3d-base-layer",styleUrl:"https://www.arcgis.com/sharing/rest/content/items/8628d259c9d14bdc848771c23c513940/resources/styles/root.json",layerType:"VectorTileLayer",title:"OpenStreetMap",visibility:!0,opacity:1},{id:"osm-3d-trees",title:"Trees",url:"https://basemaps3d.arcgis.com/arcgis/rest/services/OpenStreetMap3D_Trees_Thematic_v1/SceneServer",itemId:"f75fef56b2d944fe92ef9f7737b4f953",layerType:"ArcGISSceneServiceLayer"},{id:"osm-3d-places-and-labels",title:"Places and Labels",url:"https://basemaps3d.arcgis.com/arcgis/rest/services/OpenStreetMap3D_DarkLabels_v1/SceneServer",itemId:"a84404ad39c64c328d0596e361ec459b",layerType:"ArcGISSceneServiceLayer"},{id:"osm-3d-buildings",title:"Buildings",url:"https://basemaps3d.arcgis.com/arcgis/rest/services/OpenStreetMap3D_Buildings_v1/SceneServer",itemId:"ca0470dbbddb4db28bad74ed39949e25",layerType:"ArcGISSceneServiceLayer"}]},"gray-3d":{id:"gray-3d",is3d:!0,get thumbnailUrl(){return i("esri/images/basemap/gray-3d.png")},baseMapLayers:[{id:"gray-3d-base-layer",styleUrl:"https://www.arcgis.com/sharing/rest/content/items/01a14b466345455ba4176d2e6390db92/resources/styles/root.json",layerType:"VectorTileLayer",title:"Streets",visibility:!0,opacity:1},{id:"gray-3d-places-and-labels",title:"Places and Labels",url:"https://basemaps3d.arcgis.com/arcgis/rest/services/OpenStreetMap3D_DarkLabels_v1/SceneServer",itemId:"a84404ad39c64c328d0596e361ec459b",layerType:"ArcGISSceneServiceLayer"},{id:"gray-3d-buildings",title:"Buildings",url:"https://basemaps3d.arcgis.com/arcgis/rest/services/OpenStreetMap3D_Buildings_v1/SceneServer",itemId:"ca0470dbbddb4db28bad74ed39949e25",layerType:"ArcGISSceneServiceLayer"}]},"navigation-dark-3d":{id:"navigation-dark-3d",itemId:"5a1365328b4943f09a54cf5fd1205707",is3d:!0,baseMapLayers:[{id:"navigation-dark-3d-base-layer",styleUrl:"https://www.arcgis.com/sharing/rest/content/items/451a1777ab3f4bf095fae24a117439d9/resources/styles/root.json",layerType:"VectorTileLayer",title:"Navigation Dark"},{id:"navigation-dark-3d-places-and-labels",title:"Places and Labels",url:"https://basemaps3d.arcgis.com/arcgis/rest/services/OpenStreetMap3D_LightLabels_v1/SceneServer/layers/0",itemId:"f364b70b012a4da5a4b5921e193eac4a",layerType:"ArcGISSceneServiceLayer"},{id:"navigation-dark-3d-buildings",title:"Buildings",url:"https://basemaps3d.arcgis.com/arcgis/rest/services/OpenStreetMap3D_Buildings_v1/SceneServer",itemId:"ca0470dbbddb4db28bad74ed39949e25",layerType:"ArcGISSceneServiceLayer"}]},"streets-dark-3d":{id:"streets-dark-3d",itemId:"8a4efa2c20484ec9b4557895e65736ff",is3d:!0,baseMapLayers:[{id:"streets-dark-3d-base-layer",styleUrl:"https://www.arcgis.com/sharing/rest/content/items/bc599b6d741a4ac084b7eea7bf8c5938/resources/styles/root.json",layerType:"VectorTileLayer",title:"OpenStreetMap Streets Night (for 3D)"},{id:"streets-dark-3d-places-and-labels",title:"Places and Labels",url:"https://basemaps3d.arcgis.com/arcgis/rest/services/OpenStreetMap3D_LightLabels_v1/SceneServer",itemId:"f364b70b012a4da5a4b5921e193eac4a",layerType:"ArcGISSceneServiceLayer"},{id:"streets-dark-3d-buildings",title:"Buildings",url:"https://basemaps3d.arcgis.com/arcgis/rest/services/OpenStreetMap3D_Buildings_v1/SceneServer",itemId:"ca0470dbbddb4db28bad74ed39949e25",layerType:"ArcGISSceneServiceLayer"}]},"dark-gray-3d":{id:"dark-gray-3d",itemId:"a8b7322a5fe94002bb0f5e0eeb0c5c18",is3d:!0,baseMapLayers:[{id:"dark-gray-3d-base-layer",styleUrl:"https://www.arcgis.com/sharing/rest/content/items/4178f71acb934fb89f169e7d667c20c6/resources/styles/root.json",layerType:"VectorTileLayer",title:"OpenStreetMap Dark Gray Canvas (for 3D)"},{id:"dark-gray-3d-places-and-labels",title:"Places and Labels",url:"https://basemaps3d.arcgis.com/arcgis/rest/services/OpenStreetMap3D_LightLabels_v1/SceneServer/layers/0",itemId:"f364b70b012a4da5a4b5921e193eac4a",layerType:"ArcGISSceneServiceLayer"},{id:"dark-gray-3d-buildings",title:"Buildings",url:"https://basemaps3d.arcgis.com/arcgis/rest/services/OpenStreetMap3D_Buildings_v1/SceneServer",itemId:"ca0470dbbddb4db28bad74ed39949e25",layerType:"ArcGISSceneServiceLayer"}]},"arcgis-imagery":{get thumbnailUrl(){return i("esri/images/basemap/hybrid.jpg")},title:"Imagery Hybrid",baseMapLayers:[{layerType:"ArcGISTiledMapServiceLayer",showLegend:!1,title:"World Imagery",url:"https://ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer"},{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:Imagery:Labels",title:"Hybrid Reference Layer",isReference:!0}]},"arcgis-imagery-standard":{get thumbnailUrl(){return i("esri/images/basemap/satellite.jpg")},title:"Imagery",baseMapLayers:[{layerType:"ArcGISTiledMapServiceLayer",showLegend:!1,title:"World Imagery",url:"https://ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer"}]},"arcgis-imagery-labels":{title:"Hybrid [Reference]",baseMapLayers:[{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:Imagery:Labels",title:"Hybrid Reference Layer",isReference:!0}]},"arcgis-light-gray":{get thumbnailUrl(){return i("esri/images/basemap/gray-vector.jpg")},title:"Light Gray Canvas",baseMapLayers:[{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:LightGray:Base",title:"Light Gray Canvas Base"},{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:LightGray:Labels",title:"Light Gray Canvas Labels",isReference:!0}]},"arcgis-dark-gray":{get thumbnailUrl(){return i("esri/images/basemap/dark-gray.jpg")},title:"Dark Gray Canvas",baseMapLayers:[{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:DarkGray:Base",title:"Dark Gray Canvas Base"},{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:DarkGray:Labels",title:"Dark Gray Canvas Labels",isReference:!0}]},"arcgis-navigation":{get thumbnailUrl(){return i("esri/images/basemap/streets-navigation.jpg")},title:"Navigation",baseMapLayers:[{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:Navigation",title:"World Navigation Map"}]},"arcgis-navigation-night":{title:"Navigation (Dark Mode)",baseMapLayers:[{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:NavigationNight",title:"World Navigation Map (Dark Mode)"}]},"arcgis-streets":{get thumbnailUrl(){return i("esri/images/basemap/streets-vector.jpg")},title:"Streets",baseMapLayers:[{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:Streets",title:"World Street Map"}]},"arcgis-streets-night":{get thumbnailUrl(){return i("esri/images/basemap/streets-night.jpg")},title:"Streets (Night)",baseMapLayers:[{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:StreetsNight",title:"World Street Map (Night)"}]},"arcgis-streets-relief":{get thumbnailUrl(){return i("esri/images/basemap/streets-relief.jpg")},title:"Streets (with Relief)",baseMapLayers:[{layerType:"ArcGISTiledMapServiceLayer",showLegend:!1,title:"World Hillshade",url:"https://ibasemaps-api.arcgis.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer"},{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:StreetsRelief:Base",title:"World Street Map (with Relief)"}]},"arcgis-topographic":{get thumbnailUrl(){return i("esri/images/basemap/topo.jpg")},title:"Topographic",baseMapLayers:[{layerType:"ArcGISTiledMapServiceLayer",showLegend:!1,title:"World Hillshade",url:"https://ibasemaps-api.arcgis.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer"},{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:Topographic:Base",title:"World Topographic Map"}]},"arcgis-oceans":{get thumbnailUrl(){return i("esri/images/basemap/oceans.jpg")},title:"Oceans",baseMapLayers:[{layerType:"ArcGISTiledMapServiceLayer",showLegend:!1,title:"World Ocean Base",url:"https://ibasemaps-api.arcgis.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer"},{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:Oceans:Labels",title:"World Ocean Reference",isReference:!0}]},"osm-standard":{title:"OpenStreetMap",baseMapLayers:[{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/OSM:Standard",title:"OpenStreetMap"}]},"osm-standard-relief":{title:"OpenStreetMap (with relief)",baseMapLayers:[{layerType:"ArcGISTiledMapServiceLayer",showLegend:!1,title:"World Hillshade",url:"https://ibasemaps-api.arcgis.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer"},{styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/OSM:StandardRelief:Base",layerType:"VectorTileLayer",title:"OpenStreetMap Relief Base"}]},"osm-streets":{title:"OpenStreetMap (Streets)",baseMapLayers:[{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/OSM:Streets",title:"OpenStreetMap (Streets)"}]},"osm-streets-relief":{title:"OpenStreetMap (Streets with relief)",baseMapLayers:[{layerType:"ArcGISTiledMapServiceLayer",showLegend:!1,title:"World Hillshade",url:"https://ibasemaps-api.arcgis.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer"},{styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/OSM:StreetsRelief:Base",layerType:"VectorTileLayer",title:"OpenStreetMap Relief Base"}]},"osm-light-gray":{title:"OpenStreetMap (Light Gray Canvas)",baseMapLayers:[{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/OSM:LightGray:Base",title:"OSM (Light Gray Base)"},{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/OSM:LightGray:Labels",title:"OSM (Light Gray Reference)",isReference:!0}]},"osm-dark-gray":{title:"OpenStreetMap (Dark Gray Canvas)",baseMapLayers:[{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/OSM:DarkGray:Base",title:"OSM (Dark Gray Base)"},{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/OSM:DarkGray:Labels",title:"OSM (Dark Gray Reference)",isReference:!0}]},"arcgis-terrain":{title:"Terrain with Labels",baseMapLayers:[{layerType:"ArcGISTiledMapServiceLayer",showLegend:!1,title:"World Hillshade",url:"https://ibasemaps-api.arcgis.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer"},{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:Terrain:Base",title:"World Terrain Base"},{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:Terrain:Detail",title:"World Terrain Reference",isReference:!0}]},"arcgis-community":{title:"Community",baseMapLayers:[{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:Community",title:"Community"}]},"arcgis-charted-territory":{title:"Charted Territory",baseMapLayers:[{layerType:"ArcGISTiledMapServiceLayer",showLegend:!1,title:"World Hillshade",url:"https://ibasemaps-api.arcgis.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer"},{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:ChartedTerritory:Base",title:"Charted Territory"}]},"arcgis-colored-pencil":{title:"Colored Pencil",baseMapLayers:[{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:ColoredPencil",title:"Colored Pencil"}]},"arcgis-nova":{title:"Nova",baseMapLayers:[{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:Nova",title:"Nova"}]},"arcgis-modern-antique":{title:"Modern Antique",baseMapLayers:[{layerType:"ArcGISTiledMapServiceLayer",showLegend:!1,title:"World Hillshade",url:"https://ibasemaps-api.arcgis.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer"},{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:ModernAntique:Base",title:"Modern Antique"}]},"arcgis-midcentury":{title:"Mid-Century",baseMapLayers:[{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:Midcentury",title:"Mid-Century"}]},"arcgis-newspaper":{title:"Newspaper",baseMapLayers:[{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:Newspaper",title:"Newspaper"}]},"arcgis-hillshade-light":{title:"Hillshade",baseMapLayers:[{layerType:"ArcGISTiledMapServiceLayer",showLegend:!1,title:"World Hillshade",url:"https://ibasemaps-api.arcgis.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer"}]},"arcgis-hillshade-dark":{title:"Hillshade (Dark)",baseMapLayers:[{layerType:"ArcGISTiledMapServiceLayer",showLegend:!1,title:"World Hillshade (Dark)",url:"https://ibasemaps-api.arcgis.com/arcgis/rest/services/Elevation/World_Hillshade_Dark/MapServer"}]},"arcgis-human-geography":{title:"Human Geography",baseMapLayers:[{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:HumanGeography:Base",title:"Human Geography Base"},{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:HumanGeography:Detail",title:"Human Geography Detail",isReference:!0},{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:HumanGeography:Label",title:"Human Geography Label",isReference:!0}]},"arcgis-human-geography-dark":{title:"Human Geography (Dark)",baseMapLayers:[{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:HumanGeographyDark:Base",title:"Human Geography Dark Base"},{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:HumanGeographyDark:Detail",title:"Human Geography Dark Detail",isReference:!0},{layerType:"VectorTileLayer",styleUrl:"https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:HumanGeographyDark:Label",title:"Human Geography Dark Label",isReference:!0}]}},J=new Set(["ar","bs","ca","hr","cs","da","nl","en","et","fi","fr","de","el","he","hu","id","it","ja","ko","lv","lt","nb","pl","ro","ru","sr","es","sv","th","tr","uk","vi"]);let y=class extends D{constructor(e){super(e),this.id=null,this.language=null,this.places=null,this.serviceUrl="https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/webmaps",this.worldview=null}getLanguageParamValue(){if(this.language)return this.language;const e=V().toLowerCase();switch(e){case"pt-br":return"pt-BR";case"pt-pt":return"pt-PT";case"zh-cn":return"zh-CN";case"zh-hk":return"zh-HK";case"zh-tw":return"zh-TW"}const r=W(e);return r==="pt"?"pt-BR":r&&J.has(r)?r:"global"}};l([c()],y.prototype,"id",void 0),l([c()],y.prototype,"language",void 0),l([c()],y.prototype,"places",void 0),l([c()],y.prototype,"serviceUrl",void 0),l([c()],y.prototype,"worldview",void 0),y=l([_("esri.support.BasemapStyle")],y);const q=y;var d;let K=0,o=d=class extends B(x){constructor(e){super(e),this.id=null,this.portalItem=null,this.spatialReference=null,this.style=null,this.thumbnailUrl=null,this.title="Basemap",this.id=Date.now().toString(16)+"-basemap-"+K++,this.baseLayers=new h,this.referenceLayers=new h;const r=a=>{a.parent&&a.parent!==this&&"remove"in a.parent&&a.parent.remove(a),a.parent=this,a.type==="elevation"&&L.getLogger(this).error(`Layer '${a.title}, id:${a.id}' of type '${a.type}' is not supported as a basemap layer and will therefore be ignored.`)},s=a=>{a.parent=null};this.addHandles([this.baseLayers.on("after-add",a=>r(a.item)),this.referenceLayers.on("after-add",a=>r(a.item)),this.baseLayers.on("after-remove",a=>s(a.item)),this.referenceLayers.on("after-remove",a=>s(a.item))])}initialize(){this.when().catch(e=>{L.getLogger(this).error("#load()",`Failed to load basemap (title: '${this.title}', id: '${this.id}')`,e)}),this.resourceInfo&&this.read(this.resourceInfo.data,this.resourceInfo.context)}destroy(){const e=this.baseLayers.toArray();for(const s of e)s.destroy();const r=this.referenceLayers.toArray();for(const s of r)s.destroy();this.baseLayers.destroy(),this.referenceLayers.destroy(),this.portalItem=R(this.portalItem)}normalizeCtorArgs(e){return e&&"resourceInfo"in e&&(this._set("resourceInfo",e.resourceInfo),delete(e={...e}).resourceInfo),e}set baseLayers(e){this._set("baseLayers",f(e,this._get("baseLayers")))}_writeBaseLayers(e,r,s){const a=[];e&&(s={...s,layerContainerType:"basemap"},this.baseLayers.forEach(t=>{const p=U(t,s.webmap?s.webmap.getLayerJSONFromResourceInfo(t):null,s);p!=null&&a.push(p)}),this.referenceLayers.forEach(t=>{const p=U(t,s.webmap?s.webmap.getLayerJSONFromResourceInfo(t):null,s);p!=null&&(t.type!=="scene"&&(p.isReference=!0),a.push(p))})),r.baseMapLayers=a}set referenceLayers(e){this._set("referenceLayers",f(e,this._get("referenceLayers")))}writeTitle(e,r){r.title=e||"Basemap"}load(e){return this.addResolvingPromise(this._loadFromSource(e)),Promise.resolve(this)}loadAll(){return E(this,e=>{e(this.baseLayers,this.referenceLayers)})}clone(){const e={id:this.id,title:this.title,portalItem:this.portalItem,baseLayers:this.baseLayers.map(r=>T(r)?r.clone():r),referenceLayers:this.referenceLayers.map(r=>T(r)?r.clone():r)};return this.loaded&&(e.loadStatus="loaded"),new d({resourceInfo:this.resourceInfo}).set(e)}read(e,r){this.resourceInfo||this._set("resourceInfo",{data:e,context:r}),super.read(e,r)}write(e,r){var s;return e=e||{},r!=null&&r.origin||(r={origin:"web-map",...r}),super.write(e,r),!this.loaded&&((s=this.resourceInfo)!=null&&s.data.baseMapLayers)&&(e.baseMapLayers=this.resourceInfo.data.baseMapLayers.map(a=>{const t=j(a);return t.url&&M(t.url)&&(t.url=`https:${t.url}`),t.templateUrl&&M(t.templateUrl)&&(t.templateUrl=`https:${t.templateUrl}`),t})),e}async _loadFromSource(e){const{resourceInfo:r,portalItem:s,style:a}=this;I(e);const t=[];if(r){const p=r.context?r.context.url:null;if(t.push(this._loadLayersFromJSON(r.data,p,e)),r.data.id&&!r.data.title){const g=r.data.id;t.push(F(g).then(n=>{n&&this.read({title:n},r.context)}))}}else s?t.push(this._loadFromItem(s,e)):a&&t.push(this._loadFromStylesService(a,e));await Promise.all(t)}async _loadLayersFromJSON(e,r,s){var v,u;const a=(v=this.resourceInfo)==null?void 0:v.context,t=((u=this.portalItem)==null?void 0:u.portal)||(a==null?void 0:a.portal)||null,p=X[(a==null?void 0:a.origin)||""]??"web-map",{populateOperationalLayers:g}=await H(async()=>{const{populateOperationalLayers:b}=await import("./layersCreator-B7QnC6RR.js");return{populateOperationalLayers:b}},__vite__mapDeps([0,1,2,3,4,5])),n=[];if(I(s),e.baseMapLayers&&Array.isArray(e.baseMapLayers)){const b={context:{...a,origin:p,url:r,portal:t,layerContainerType:"basemap"},defaultLayerType:"DefaultTileLayer"},S=m=>p==="web-scene"&&m.layerType==="ArcGISSceneServiceLayer"||m.isReference,A=g(this.baseLayers,e.baseMapLayers.filter(m=>!S(m)),b);n.push(A);const O=g(this.referenceLayers,e.baseMapLayers.filter(S),b);n.push(O)}await Promise.allSettled(n)}async _loadFromItem(e,r){const s=await e.load(r),a=await s.fetchData("json",r),t=w(e.itemUrl??"");return this._set("resourceInfo",{data:a.baseMap??{},context:{origin:Q[e.type||""]??"web-map",portal:e.portal||G.getDefault(),url:t}}),this.read(this.resourceInfo.data,this.resourceInfo.context),this.read({spatialReference:a.spatialReference},this.resourceInfo.context),this.read({title:e.title,thumbnailUrl:e.thumbnailUrl},{origin:"portal-item",portal:e.portal||G.getDefault(),url:t}),this._loadLayersFromJSON(this.resourceInfo.data,t,r)}async _loadFromStylesService(e,r){const s=`${e.serviceUrl}/${e.id}`,a=(await N(s,{query:{language:e.getLanguageParamValue(),places:e.places,worldview:e.worldview},signal:r==null?void 0:r.signal})).data,t=w(s);return this._set("resourceInfo",{data:a.baseMap??{},context:{origin:"web-map",url:t}}),this.read(this.resourceInfo.data,this.resourceInfo.context),this.read({spatialReference:a.spatialReference},this.resourceInfo.context),this._loadLayersFromJSON(this.resourceInfo.data,t,r)}static fromId(e){const r=z[e];return r?r.itemId?new d({portalItem:{id:r.itemId,portal:{url:"https://www.arcgis.com"}}}):d.fromJSON(r,{origin:r.is3d?"web-scene":"web-map"}):null}};l([c({json:{write:{ignoreOrigin:!0,target:"baseMapLayers",writer(e,r,s,a){this._writeBaseLayers(e,r,a)}},origins:{"web-scene":{write:{ignoreOrigin:!0,target:{baseMapLayers:{type:h}},writer(e,r,s,a){this._writeBaseLayers(e,r,a)}}}}}})],o.prototype,"baseLayers",null),l([c({type:String,json:{origins:{"web-scene":{write:!0}}}})],o.prototype,"id",void 0),l([c({type:$})],o.prototype,"portalItem",void 0),l([c()],o.prototype,"referenceLayers",null),l([c({readOnly:!0})],o.prototype,"resourceInfo",void 0),l([c({type:P})],o.prototype,"spatialReference",void 0),l([c({type:q})],o.prototype,"style",void 0),l([c()],o.prototype,"thumbnailUrl",void 0),l([c({type:String,json:{origins:{"web-scene":{write:{isRequired:!0}}}}})],o.prototype,"title",void 0),l([C("title")],o.prototype,"writeTitle",null),o=d=l([_("esri.Basemap")],o);const Q={"Web Scene":"web-scene","Web Map":"web-map","Link Chart":"link-chart"},X={"web-scene":"web-scene","web-map":"web-map","link-chart":"link-chart"},re=o;export{re as default};