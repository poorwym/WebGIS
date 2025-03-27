export const image_provider_source = {
    ArcGIS_Image:{
        url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/1.0.0/default/default/default',
        layer: 'default',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'GoogleMapsCompatible',
    },
    天地图矢量:{
        url: 'https://t0.tianditu.gov.cn/vec_w/wmts?tk=d3bfcac935d678f5478d55f4f3e82ad8',
        layer: 'vec_w',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'w',
    },
    天地图影像:{
        url: 'https://t0.tianditu.gov.cn/img_w/wmts?tk=d3bfcac935d678f5478d55f4f3e82ad8',
        layer: 'img_w',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'w',
    },
}