---
title: 'Writing a Tiny HTTP Server in Python'
description: 'Sixty lines of raw sockets to demystify every web framework you will ever use.'
pubDate: 2026-05-30
---

HTTP feels like magic until you realize it's just text over a TCP socket. The fastest way to internalize that is to write a server with no framework at all — raw sockets, by hand. What follows fits in one file and handles real browser requests.

## Step 1: listen on a socket

TCP servers all start the same way: bind an address, listen, accept connections in a loop.

```python
import socket

HOST, PORT = "127.0.0.1", 8080

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind((HOST, PORT))
    server.listen()
    print(f"Listening on http://{HOST}:{PORT}")

    while True:
        conn, addr = server.accept()
        with conn:
            handle(conn)
```

`SO_REUSEADDR` is the flag that saves you from "address already in use" errors every time you restart during development.

## Step 2: parse the request

An HTTP request is lines of text: a request line, headers, a blank line, then an optional body.

```text
GET /hello HTTP/1.1
Host: 127.0.0.1:8080
User-Agent: curl/8.6.0
Accept: */*
```

Parsing the parts we need takes a few lines:

```python
def handle(conn: socket.socket) -> None:
    raw = conn.recv(65536).decode("utf-8", errors="replace")
    if not raw:
        return

    request_line = raw.split("\r\n", 1)[0]
    method, path, _version = request_line.split(" ", 2)
    print(f"{method} {path}")

    body = route(method, path)
    respond(conn, body)
```

A real server would loop on `recv` until it has the full request and parse headers properly — but this is enough for a browser to talk to us.

## Step 3: respond

A response is a status line, headers, a blank line, and the body:

```python
def route(method: str, path: str) -> str:
    if path == "/":
        return "<h1>It works!</h1><p>Served by 60 lines of Python.</p>"
    return "<h1>404</h1>"

def respond(conn: socket.socket, body: str) -> None:
    payload = body.encode()
    conn.sendall(
        b"HTTP/1.1 200 OK\r\n"
        b"Content-Type: text/html; charset=utf-8\r\n"
        + f"Content-Length: {len(payload)}\r\n".encode()
        + b"Connection: close\r\n"
        b"\r\n"
        + payload
    )
```

Run it and hit it with curl:

```sh
$ curl -i http://127.0.0.1:8080/
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 55

<h1>It works!</h1><p>Served by 60 lines of Python.</p>
```

That's the whole trick. Everything a framework gives you — routing tables, middleware, JSON parsing — is layered on top of these three steps.

---

## Where it breaks (and why frameworks exist)

Our server handles **one connection at a time**: while it serves one request, every other client waits. Real servers solve this with threads, an event loop (`asyncio`, epoll), or worker processes — that single problem is the origin of most server architecture. It also trusts input completely; a production parser has to survive malformed requests, huge headers, and slow clients.

But those are refinements. The core loop — accept, parse text, write text back — never changes, no matter how many layers of framework sit on top of it.
