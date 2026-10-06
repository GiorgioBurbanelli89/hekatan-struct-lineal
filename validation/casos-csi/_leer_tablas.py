from sap_comun import *
o, sm = conectar()
for t in sys.argv[1:]:
    r = sm.DatabaseTables.GetTableForEditingArray(t, "", 0, [], 0, [])
    L=[x for x in r if isinstance(x,(list,tuple))]; I=[x for x in r if isinstance(x,int)]; campos=list(L[0]); d=list(L[1]); n=len(d)//max(1,len(campos))
    print("====", t, n, campos)
    for i in range(min(n, 8)): print("  ", d[i*len(campos):(i+1)*len(campos)])
