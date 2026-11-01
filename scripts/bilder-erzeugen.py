"""Bilder bei Black Forest Labs erzeugen (FLUX.2 [pro]). Der Schlüssel kommt vom Proxy (x-key), hier steht keiner.
Aufruf: python3 bfl.py <endpoint> <ziel.jpg> <breite> <hoehe> <prompt-datei> [referenz.jpg ...]"""
import sys, json, subprocess, time, base64, os
def curl(args, timeout=120):
    r = subprocess.run(['curl', '-sS', '--max-time', str(timeout)] + args, capture_output=True, text=True)
    if r.returncode != 0: raise SystemExit('curl: ' + r.stderr[:300])
    return r.stdout
def erzeugen(endpoint, ziel, w, h, prompt, refs):
    body = {'prompt': prompt, 'width': int(w), 'height': int(h), 'output_format': 'jpeg', 'safety_tolerance': 2, 'disable_pup': True}
    for i, p in enumerate(refs):
        b = base64.b64encode(open(p, 'rb').read()).decode()
        body['input_image' if i == 0 else 'input_image_%d' % (i + 1)] = 'data:image/jpeg;base64,' + b
    tmp = ziel + '.body.json'; json.dump(body, open(tmp, 'w'))
    out = curl(['-X', 'POST', 'https://api.bfl.ai/v1/' + endpoint, '-H', 'Content-Type: application/json', '--data-binary', '@' + tmp]); os.remove(tmp)
    try: j = json.loads(out)
    except Exception: raise SystemExit('Antwort: ' + out[:400])
    if 'polling_url' not in j: raise SystemExit('Antwort: ' + out[:400])
    url = j['polling_url']; t0 = time.time()
    while True:
        time.sleep(3)
        r = json.loads(curl([url]))
        st = r.get('status')
        if st == 'Ready':
            sample = r['result']['sample']
            curl(['-o', ziel, sample], timeout=180)
            print('fertig', ziel, os.path.getsize(ziel), 'B', round(time.time() - t0), 's', 'seed', r['result'].get('seed')); return
        if st not in ('Pending', 'Queued', 'Processing', 'Request Moderated', None) or time.time() - t0 > 600:
            raise SystemExit('Status: ' + json.dumps(r)[:600])
        if st == 'Request Moderated': raise SystemExit('moderiert: ' + json.dumps(r)[:600])
if __name__ == '__main__':
    ep, ziel, w, h, pf = sys.argv[1:6]; refs = sys.argv[6:]
    erzeugen(ep, ziel, w, h, open(pf, encoding='utf-8').read().strip(), refs)
