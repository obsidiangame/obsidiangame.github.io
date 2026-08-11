// obsidian sw v4
importScripts("./controller/controller.sw.js?v=4");

var ADBLOCK_SUFFIXES = [
	"doubleclick.net", "googlesyndication.com", "googleadservices.com", "2mdn.net",
	"google-analytics.com", "googletagmanager.com", "adnxs.com", "adsystem.com",
	"popads.net", "propellerads.com", "taboola.com", "outbrain.com", "mgid.com",
	"criteo.com", "adroll.com", "amazon-adsystem.com", "scorecardresearch.com",
	"quantserve.com", "adsterra.com", "smartadserver.com", "rubiconproject.com",
	"openx.net", "pubmatic.com", "inmobi.com", "mobfox.com", "cpx.to",
	"adcolony.com", "applovin.com", "unityads.unity3d.com", "hotjar.com", "yandex.ru"
];

var adblockOn = true;

addEventListener("message", function (e) {
	if (e.data && typeof e.data.$zx$adblock === "boolean") adblockOn = e.data.$zx$adblock;
});

addEventListener("install", (e) => {
	e.waitUntil(skipWaiting());
});

addEventListener("activate", (e) => {
	e.waitUntil(clients.claim());
});

addEventListener("fetch", (e) => {
	if (adblockOn && e.request.method === "GET" && e.request.mode !== "navigate") {
		var url = new URL(e.request.url);
		var host = url.hostname.toLowerCase();
		for (var i = 0; i < ADBLOCK_SUFFIXES.length; i++) {
			var s = ADBLOCK_SUFFIXES[i];
			if (host === s || host.endsWith("." + s)) {
				return e.respondWith(new Response("", { status: 204, statusText: "No Content" }));
			}
		}
	}
	if ($zxController.shouldRoute(e)) {
		e.respondWith($zxController.route(e));
	}
});
