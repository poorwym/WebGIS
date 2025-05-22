import geopandas as gpd
import pathlib

from app.main import config_loader
from app.schemas import file_model
def list_file_edu_poi() -> file_model.FileList:
    '''
    列出data/edu/下所有的文件
    :return:
    '''

    files: list[file_model.FileItem]= [file_model.FileItem(path = pathlib.Path(config_loader.project_root / "data" / "edu" / f.name), name=f.name ) for f in pathlib.Path(config_loader.project_root / "data" / "edu").iterdir() if f.is_file()]
    return file_model.FileList(list=files)

def list_file_house_price() -> file_model.FileList:
    '''
    list all file in data/residential/
    :return:
    '''

    files: list[file_model.FileItem]= [file_model.FileItem(path = pathlib.Path(config_loader.project_root / "data" / "residential" / f.name), name=f.name ) for f in pathlib.Path(config_loader.project_root / "data" / "residential").iterdir() if f.is_file()]
    return file_model.FileList(list=files)

