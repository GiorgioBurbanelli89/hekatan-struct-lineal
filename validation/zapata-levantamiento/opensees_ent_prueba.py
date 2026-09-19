# -*- coding: utf-8 -*-
"""¿El material ENT de OpenSees resiste compresión y no tracción? Se MIDE (OpenSeesPy 3.7.1), no se supone."""
import openseespy.opensees as ops
ops.wipe()
ops.uniaxialMaterial("ENT", 1, 1000.0)
for e in (-0.01, -0.001, 0.0, 0.001, 0.01):
    ops.testUniaxialMaterial(1)
    ops.setStrain(e)
    print("deformación %+.3f -> tensión %+.4f  tangente %.1f" % (e, ops.getStress(), ops.getTangent()))
