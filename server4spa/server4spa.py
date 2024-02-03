#!/usr/bin/env python

# Inspired by https://gist.github.com/jtangelder/e445e9a7f5e31c220be6
# Python3 http.server for Single Page Application

import urllib.parse
import http.server
import socketserver
import re
from pathlib import Path
import sys

HOST = ('0.0.0.0', 3000 if len(sys.argv) == 1 else int(sys.argv[1]))

print(HOST)

pattern = re.compile('.png|.jpg|.jpeg|.js|.css|.ico|.gif|.svg', re.IGNORECASE)

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        url_parts = urllib.parse.urlparse(self.path)
        request_file_path = Path(url_parts.path.strip("/"))

        ext = request_file_path.suffix
        if not request_file_path.is_file() and not pattern.match(ext):
            self.path = 'index.html'

        return http.server.SimpleHTTPRequestHandler.do_GET(self)
    def end_headers (self):
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        return http.server.SimpleHTTPRequestHandler.end_headers(self)


httpd = socketserver.TCPServer(HOST, Handler)
httpd.serve_forever()
