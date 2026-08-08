var PROXY_BASE = "https://archive.org/download/obsidian-games";

self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener("fetch", function (e) {
	var req = e.request;
	if (req.method !== "GET" || req.mode === "navigate") return;
	var url = new URL(req.url);
	if (url.origin !== location.origin) return;
	var path = url.pathname;
	if (path.indexOf("/semag/") !== 0 && path.indexOf("/sppa/") !== 0) return;
	var init = { mode: "cors", credentials: "omit" };
	var range = req.headers.get("range");
	if (range) init.headers = { Range: range };
	e.respondWith(
		fetch(PROXY_BASE + path, init)
			.then(function (res) {
				var headers = new Headers(res.headers);
				headers.delete("cross-origin-resource-policy");
				headers.delete("cross-origin-embedder-policy");
				headers.delete("access-control-allow-origin");
				headers.delete("access-control-allow-credentials");
				return new Response(res.body, { status: res.status, statusText: res.statusText, headers: headers });
			})
			.catch(function () {
				return new Response("", { status: 502 });
			})
	);
});
