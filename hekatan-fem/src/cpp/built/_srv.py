import http.server, socketserver
class H(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
        '.js':'text/javascript', '.mjs':'text/javascript',
        '.wasm':'application/wasm', '.html':'text/html'}
    def end_headers(self):
        self.send_header('Cross-Origin-Opener-Policy','same-origin')
        self.send_header('Cross-Origin-Embedder-Policy','require-corp')
        super().end_headers()
socketserver.ThreadingTCPServer.allow_reuse_address=True
socketserver.ThreadingTCPServer(('127.0.0.1',8766), H).serve_forever()
