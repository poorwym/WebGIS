import numpy
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# 读取CSV文件为普通DataFrame
residential_df = pd.read_csv("wh_house_price.csv")
#print(residential_df.head())

# 将DataFrame转换为GeoDataFrame
geometry = [Point(xy) for xy in zip(residential_df['lon_gps'], residential_df['lat_gps'])]
residential_gdf = gpd.GeoDataFrame(residential_df, geometry=geometry)

# 设置坐标参考系统为WGS84
residential_gdf.crs = "EPSG:4326"
residential_gdf.to_crs("EPSG:3857", inplace=True)
# 读取GeoJSON文件
edu_gdf = gpd.read_file("wh_poi_edu_cul.geojson")

# 设置坐标参考系统为WGS84
edu_gdf.crs = "EPSG:4326"
edu_gdf.to_crs("EPSG:3857", inplace=True)

# print(residential_gdf.head())
# print(edu_gdf.head())

# 只保留小学的行
residential_buffer_gdf = residential_gdf.copy()
residential_buffer_gdf["buffer"] = residential_buffer_gdf.geometry.buffer(1600)

residential_buffer_gdf.set_geometry("buffer", inplace=True)
residential_buffer_gdf.crs = "EPSG:3857"
# Step 2: 空间连接
joined = gpd.sjoin(residential_buffer_gdf, edu_gdf, how='left', predicate='intersects')


# Step 3: 只保留小学
joined_primary = joined[joined['小类'].str.contains('小学', na=False)]

# Step 4: 按原小区 index 统计数量（这是关键）
school_count = joined_primary.groupby(joined_primary.index).size()

# Step 5: 写入原 GeoDataFrame
residential_gdf["count_primary_school"] = residential_gdf.index.map(school_count).fillna(0).astype(int)

print(residential_gdf[["name", "count_primary_school"]].head())

joined_middle = joined[joined['小类'].str.contains('中学', na=False)]
# print(joined_middle.head())

middle_count = joined_middle.groupby(joined_middle.index).size()
residential_gdf["count_middle_school"] = residential_gdf.index.map(middle_count).fillna(0).astype(int)

print(residential_gdf[["name", "count_middle_school"]].head())

def min_max(series):
    return (series - series.min()) / (series.max() - series.min())

residential_gdf["count_primary_school_normalized"] = min_max(residential_gdf["count_primary_school"])
residential_gdf["count_middle_school_normalized"] = min_max(residential_gdf["count_middle_school"])
residential_gdf["score"] = residential_gdf["count_primary_school_normalized"] + residential_gdf["count_middle_school_normalized"]

result = residential_gdf.sort_values(by="score", ascending=False)



