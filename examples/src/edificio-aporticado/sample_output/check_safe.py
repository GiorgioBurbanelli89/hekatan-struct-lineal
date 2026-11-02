import os
"""Diagnostico SAFE: lee mensajes de error del modelo."""
import comtypes.client
helper = comtypes.client.CreateObject("SAFEv1.Helper")
mySafe = helper.CreateObject(r"C:\Program Files\Computers and Structures\SAFE 20\SAFE.exe")
mySafe.ApplicationStart()
sapModel = mySafe.SapModel
sapModel.File.OpenFile(os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\examples\src\edificio-aporticado\sample_output\cimentacion_edificio_9zapatas_12vigas.f2k")
# Listar Areas y Joints despues de la carga
n_joints = sapModel.PointObj.Count()
n_areas = sapModel.AreaObj.Count()
n_lines = sapModel.LineObj.Count()
print(f"Joints cargados : {n_joints}")
print(f"Areas cargadas  : {n_areas}")
print(f"Lines cargadas  : {n_lines}")
# Listar slabs con su seccion
print("\n=== AreaObj ===")
ret = sapModel.AreaObj.GetNameList()
print(f"Names: {ret[1][:5]}...")
# Verificar springs asignados
for nm in ret[1][:3]:
    rs = sapModel.AreaObj.GetSpring_2(nm, [], [], [], [], [], [], [], [], [])
    print(f"   {nm}: spring info -> {rs}")
mySafe.ApplicationExit(False)
