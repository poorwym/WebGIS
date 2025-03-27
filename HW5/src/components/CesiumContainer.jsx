// components/CesiumContainer.jsx
import React, { useState, useEffect } from 'react';
import * as Cesium from 'cesium';
import '../assets/styles.css';

function CesiumContainer({ imageProvider, terrainProvider, lighting, waterMask }) {
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
    
    // 只有当terrainProvider存在时才设置地形
    if (terrainProvider) {
      try {
        console.log("设置地形提供者:", terrainProvider);
        viewer.scene.setTerrain(terrainProvider);
        // 配置水面掩码
        viewer.scene.globe.showWaterEffect = waterMask;
      } catch (error) {
        console.error("设置地形提供者时出错:", error);
      }
    }
  }, [viewer, lighting, terrainProvider, waterMask]);

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
  }, [viewer, imageProvider]);

  return (
    <div id="cesiumContainer" style={{ width: '100%', height: '100vh' }}></div>
  );
}

export default CesiumContainer;