importScripts("./controller/controller.sw.js");

addEventListener("install", (e) => {
	e.waitUntil(skipWaiting());
});

addEventListener("activate", (e) => {
	e.waitUntil(clients.claim());
});

addEventListener("fetch", (e) => {
	if ($scramjetController.shouldRoute(e)) {
		e.respondWith($scramjetController.route(e));
	}
});
