import React, { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

function CesiumLayer({ pointList }) {
    const viewerRef = useRef(null);          // 只存实例，不触发重新渲染
    const containerRef = useRef(null);       // div 容器

    /* ① 仅在组件挂载时初始化一次 Viewer */
    useEffect(() => {
        if (!containerRef.current) return;

        viewerRef.current = new Cesium.Viewer(containerRef.current, {
            shouldAnimate: true,
            animation: false,
            timeline: false,
        });

        return () => {
            viewerRef.current?.destroy();
        };
    }, []);                                   // ← 依赖空数组，确保只执行一次

    /* ② pointList 或 viewer 准备好后，再增删实体 */
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer) return;                    // viewer 还没建好
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(114.305392, 30.593098, 80000.0)
        })
        viewer.entities.removeAll();            // 先清空

        pointList.forEach((p) => {
            const height = 1;                     // 如需可改真实高度

            // 将 0-2 分数映射到 0-255（示例：线性放大 100 倍并裁剪）
            const r = Math.min(255, Math.round(p.min_max_score * 100));

            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(p.lon, p.lat, height),
                point: {
                    pixelSize: 6,
                    color: Cesium.Color.fromBytes(r, 0, 0, 255),
                },
            });
        });
    }, [pointList]);                          // ← 只依赖数据，不依赖 viewer

    return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}

export default CesiumLayer;