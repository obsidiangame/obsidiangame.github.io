// obsidian sw v5
importScripts("./controller/controller.sw.js?v=4");

addEventListener("install", (e) => {
	e.waitUntil(skipWaiting());
});

addEventListener("activate", (e) => {
	e.waitUntil(clients.claim());
});

addEventListener("fetch", (e) => {
	if ($zxController.shouldRoute(e)) {
		e.respondWith($zxController.route(e));
	}
});
