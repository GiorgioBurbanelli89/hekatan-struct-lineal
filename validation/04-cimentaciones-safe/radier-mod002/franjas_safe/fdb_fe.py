"""Lee los resultados del diseño FE ('Slab Design Data', ᯞ.ᜆ de SAFE.exe) del FDB guardado tras diseñar."""
import zlib, struct, sys, json
def leer(fdb):
    b = open(fdb, 'rb').read()
    i0 = b.find(b'IEND') + 8
    for off in range(i0, i0 + 400):
        try:
            out = zlib.decompressobj(31).decompress(b[off:])
            if len(out) > 1000: break
        except Exception: pass
    key = b'\x10Slab Design Data'
    recs = []; p = 0
    FIELDS = ["AST1","ASB1","AST2","ASB2","AV1","AV2","SITenAllow:f","SICompAllow:f","SIT1","SIB1","SIT2","SIB2","SNTenAllow:f","SNCompAllow:f",
              "SNT1","SNB1","SNT2","SNB2","SLTenAllow:f","SLCompAllow:f","SLT1","SLB1","SLT2","SLB2","AsStressTop1","AsStressBot1","AsStressTop2","AsStressBot2",
              "AsEnvTop1","AsEnvBot1","AsEnvTop2","AsEnvBot2","AsEnvWithMinTop1","AsEnvWithMinBot1","AsEnvWithMinTop2","AsEnvWithMinBot2"]
    while True:
        p = out.find(key, p)
        if p < 0: break
        q = p + len(key)
        ver, elm, npt, ncase = struct.unpack_from('<4i', out, q); q += 16
        def arr(fmt):
            nonlocal q
            if out[q] == 0: q += 1; return None
            n = struct.unpack_from('<i', out, q + 1)[0]; q += 5
            v = list(struct.unpack_from('<%d%s' % (n, fmt), out, q)); q += 4 * n; return v
        jcase = arr('i'); mod = arr('i')
        prov = struct.unpack_from('<12f', out, q); q += 48
        r = dict(ver=ver, elm=elm, npt=npt, ncase=ncase)
        for f in FIELDS:
            if f.endswith(':f'): r[f[:-2]] = struct.unpack_from('<f', out, q)[0]; q += 4
            else: r[f] = arr('f')
        r['PTCheck'] = out[q]; q += 1
        recs.append(r); p = q
    return recs
if __name__ == "__main__":
    R = leer(sys.argv[1]); print(len(R), R[0]['elm'], R[0]['npt'], R[0]['AsEnvTop1'], R[0]['AsEnvWithMinTop2'], R[-1]['elm'])
    json.dump(R, open(sys.argv[2], 'w'))
    import itertools
    for k in ("AsEnvTop1","AsEnvBot1","AsEnvTop2","AsEnvBot2"): print(k, max(max(r[k]) for r in R if r[k]))
