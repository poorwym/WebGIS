from pathlib import Path

class ConfigLoader:
    project_root : Path
    def __init__(self, config_path=None):
        # 这里Path貌似返回的是工作目录,而不是config_loader的文件
        # TODO:后面改成用config_loader这个文件作为定位,确保任何路径中运行的目录都一样,并且都通过project_root来定位
        self.project_root = Path().resolve()