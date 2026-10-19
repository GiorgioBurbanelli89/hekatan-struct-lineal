@echo off
cd /d "%~dp0"
pip install -r requirements.txt
python -m PyInstaller --noconfirm --onefile --windowed --name "ShellThin+Frame3D 1.0.0" --paths . --hidden-import mesa_hekatan --hidden-import mesa_modelo --hidden-import mesa_export --hidden-import mesa_export_csi --hidden-import mesa_export_opensees --hidden-import mesa_export_fortran --hidden-import python_dkq --collect-submodules hekatan_fem --collect-data matplotlib --exclude-module pandas mesa_hekatan_tk.py
echo El exe queda en dist\
