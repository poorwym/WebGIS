import CesiumContainer from './components/cesiumContainer'
import { useState, useEffect } from 'react'
import * as Cesium from 'cesium'
import './assets/styles.css'
import { image_provider_source } from './data/image_provider_source'
import LightSwitch from './components/LightSwitch'
import WaterMaskSwitch from './components/WaterMaskSwitch'
import ImagerProviderSelector from './components/ImagerProviderSelector'
import TerrainProviderSelector from './components/TerrainProviderSelector'

function InitCesium(){
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMGYzYTM2Yi0yOGIwLTQ4ZGUtOWQ2NC03ZGE2MGQ1NTQzOWYiLCJpZCI6Mjg0ODk3LCJpYXQiOjE3NDIxODM0OTV9.AVIChWRSQIPf82NfHfz9K88x2nbo7PF3EQUb-z_-r1w'
   Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
     // 经度
     114.218926,
     // 纬度
     30.585424,
     // 经度
     114.218926,
     // 纬度
     30.585424,
   )
}

function App() {
  const [imageProvider, setImageProvider] = useState(null);
  const [terrainProvider, setTerrainProvider] = useState(null);
  const [option, setOption] = useState({
    waterMask: true,
    lighting: false,
    imageryProvider: '天地图矢量',
    terrainProvider: 'CesiumTerrainProvider'
  });

  useEffect(
    () => {
      InitCesium();
    },[]
  )

  const handleImageryProviderChange = async (value) => {
    console.log("setImageryProvider: ",value);
    setOption({...option, imageryProvider: value});
    
    try {
      if(value === 'ArcGIS_Image'){
        console.log("创建ArcGIS_ImageProvider:", value);
        const imageryProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
          'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'
        );
        setImageProvider(imageryProvider);
      }
      else{
        console.log("创建WebMapTileServiceImageryProvider:", value, image_provider_source[value]);
        const provider = new Cesium.WebMapTileServiceImageryProvider({
          url: image_provider_source[value].url,
          layer: image_provider_source[value].layer,
          style: image_provider_source[value].style,
          format: image_provider_source[value].format,
          tileMatrixSetID: image_provider_source[value].tileMatrixSetID,
          maximumLevel: 18
        });
        console.log("创建的影像提供者:", provider);
        setImageProvider(provider);
      }
    } catch (error) {
      console.error("创建影像提供者时出错:", error);
    }
  }

  const handleTerrainProviderChange = async (value) => {
    console.log("setTerrainProvider: ",value);
    setOption({...option, terrainProvider: value});
    try {
        const terrainProvider = await Cesium.createWorldTerrainAsync({
          requestWaterMask: option.waterMask
        });
        const terrain = new Cesium.Terrain(terrainProvider);
        setTerrainProvider(terrain);
    } catch (error) {
      console.error("创建地形提供者时出错:", error);
    }
  }

  useEffect(() => {
    handleImageryProviderChange(option.imageryProvider);
    handleTerrainProviderChange(option.terrainProvider);
    console.log("option: ",option);
  }, [option.imageryProvider, option.terrainProvider]);

  // 监听waterMask变化，更新地形提供者
  useEffect(() => {
    handleTerrainProviderChange(option.terrainProvider);
  }, [option.waterMask]);

  return (
    <>
      <div className="flex flex-row p-2 m-2 gap-2">
        <LightSwitch option={option} setOption={setOption} />
        <WaterMaskSwitch option={option} setOption={setOption} />
        <ImagerProviderSelector option={option} setOption={setOption} />
        <TerrainProviderSelector option={option} setOption={setOption} />
      </div>
      <CesiumContainer imageProvider={imageProvider} terrainProvider={terrainProvider} waterMask={option.waterMask} lighting={option.lighting}/>
    </>
  )
}

export default App
