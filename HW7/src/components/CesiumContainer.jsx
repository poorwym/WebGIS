// components/CesiumContainer.jsx
import React, { useEffect, useState } from 'react';
import * as Cesium from 'cesium';
import '../assets/css/styles.css';
import cityList from '../assets/json/cityList.json';
import { colorList } from '../data/color_list';

function CesiumContainer({ imageProvider, terrainProvider, lighting, waterMask, selectedCity, pointStyle, onCitySelect }) {
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    try {
      const newViewer = new Cesium.Viewer("cesiumContainer", {
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        infoBox: false,
        imageryProvider: false, // 禁用默认影像，稍后添加
      });
      
      // 添加点击事件监听器
      newViewer.screenSpaceEventHandler.setInputAction((movement) => {
        const pickedObject = newViewer.scene.pick(movement.position);
        if (Cesium.defined(pickedObject) && pickedObject.id) {
          const entity = pickedObject.id;
          
          // 获取点击的城市名称
          if (entity.properties && entity.properties.cityName) {
            const cityName = entity.properties.cityName.getValue();
            console.log("选中城市:", cityName);
            
            // 如果有传入的onCitySelect函数，可以调用它来更新App组件中的city状态
            if (onCitySelect) {
              onCitySelect(cityName);
            }
            
            // 飞行到选中的城市
            const cityData = cityList.find(city => city.name === cityName);
            if (cityData) {
              const [lon, lat] = cityData.centerPoint.split(',').map(Number);
              newViewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(lon, lat, 1500000.0)
              });
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // 保存viewer实例
      setViewer(newViewer);
      
      // 返回清理函数
      return () => {
        if (newViewer && !newViewer.isDestroyed()) {
          newViewer.destroy();
        }
      };
    } catch (error) {
      console.error("初始化Cesium Viewer时出错:", error);
    }
  }, []); // 只在组件挂载时创建 viewer

  // 处理光照和水面掩码
  useEffect(() => {
    if (!viewer) return;
    
    // 设置光照
    viewer.scene.globe.enableLighting = lighting;
    console.log("设置光照：", lighting);
    
    // 设置水体效果，无论terrain是否已加载
    viewer.scene.globe.showWaterEffect = waterMask;
    console.log("设置水体效果：", waterMask);
    
    // 只有当terrainProvider存在时才设置地形
    if (terrainProvider) {
      try {
        console.log("设置地形提供者:", terrainProvider);
        viewer.scene.setTerrain(terrainProvider);
      } catch (error) {
        console.error("设置地形提供者时出错:", error);
      }
    }
  }, [viewer, lighting, terrainProvider, waterMask]);

  async function load3DTileset(viewer, url) {
    try {
      const tileset = await Cesium.Cesium3DTileset.fromUrl(url);
      viewer.scene.primitives.add(tileset);
      await viewer.zoomTo(tileset);
      console.log("3D Tileset 加载完成");
      return tileset;
    } catch (error) {
      console.error("加载 3D Tileset 失败：", error);
    }
  }

  // 处理影像图层
  useEffect(() => {
    if (!viewer) return;
    
    // 移除所有现有影像图层
    viewer.imageryLayers.removeAll();
    
    // 如果有新的影像提供者，添加它
    if (imageProvider) {
      console.log("添加影像图层:", imageProvider);
      viewer.imageryLayers.addImageryProvider(imageProvider);
    }

    // 使用正确的public目录路径
    // load3DTileset(viewer, '/Tileset/tileset.json');

  }, [viewer, imageProvider]);

  useEffect(() => {
    if (!viewer) return;
    
    // 清除现有的实体
    viewer.entities.removeAll();
    
    // 添加城市标记
    cityList.forEach(city => {
      let [lon, lat] = city.centerPoint.split(',').map(Number);
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lon, lat, 1),
        point: {
            pixelSize: pointStyle.pixelSize,
            color: city.name === selectedCity ? colorList[pointStyle.selectedColor] : colorList[pointStyle.color],
            outlineColor: colorList["white"],
            outlineWidth: pointStyle.outlineWidth
        },
        properties: {
          cityName: city.name,
          cityCode: city.code
        }
      });
    });

    if (selectedCity) {
      const city = cityList.find(city => city.name === selectedCity);
      if (city) {
        const [lon, lat] = city.centerPoint.split(',').map(Number);
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(lon, lat, 1500000.0)
        });
      }
    }
  }, [viewer, selectedCity, pointStyle]);

  return (
    <div id="cesiumContainer" className='w-full h-full'></div>
  );
}

export default CesiumContainer;