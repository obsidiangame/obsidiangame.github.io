var interval;
document.addEventListener("DOMContentLoaded", function () {
	if (localStorage.getItem("theme")) {
		localStorage.setItem("obsidian.theme", localStorage.getItem("theme"));
		localStorage.removeItem("theme");
	}
	if (localStorage.getItem("obsidian.theme")) {
		document.body.setAttribute("theme", localStorage.getItem("obsidian.theme"));
	} else {
		document.body.setAttribute("theme", "main");
	}
	if (document.querySelectorAll("[id=adcontainer]")) {
		for (let i = 0; i < document.querySelectorAll("[id=adcontainer]").length; i++) {
			if (Math.random() < 0.5 || localStorage.getItem("obsidian.adblock") == "true") document.querySelectorAll("[id=adcontainer]")[i].innerHTML = "";
		}
	}
	const blockClose = document.querySelector("input#blockClose");
	const openBlank = document.getElementById("blank");
	const bgTheme = document.querySelector("input#bgTheme");
	if (document.querySelector("input#blockClose")) {
		if (localStorage.getItem("obsidian.blockClose") == "true") {
			blockClose.checked = true;
		}
		blockClose.addEventListener("click", () => {
			localStorage.setItem("obsidian.blockClose", blockClose.checked);
		});
	}
	if (document.querySelector("input#tabDisguise")) {
		if (localStorage.getItem("obsidian.tabDisguise") == "true") {
			tabDisguise.checked = true;
		}
		tabDisguise.addEventListener("click", () => {
			localStorage.setItem("obsidian.tabDisguise", tabDisguise.checked);
		});
	}
	if (document.querySelector("input#bgTheme")) {
		bgTheme.checked = true;
	}
	const rightClick = document.querySelector("input#rightClick");
	if (rightClick) {
		if (localStorage.getItem("obsidian.rightClick") == "true") {
			rightClick.checked = true;
		}
		rightClick.addEventListener("click", () => {
			localStorage.setItem("obsidian.rightClick", rightClick.checked);
		});
	}
	const noInspect = document.querySelector("input#noInspect");
	if (noInspect) {
		if (localStorage.getItem("obsidian.noInspect") == "true") {
			noInspect.checked = true;
		}
		noInspect.addEventListener("click", () => {
			localStorage.setItem("obsidian.noInspect", noInspect.checked);
		});
	}
	const panicOn = document.querySelector("input#panicOn");
	if (panicOn) {
		if (localStorage.getItem("obsidian.panic") == "true") {
			panicOn.checked = true;
		}
		panicOn.addEventListener("click", () => {
			localStorage.setItem("obsidian.panic", panicOn.checked);
		});
	}
	const panicKey = document.getElementById("panicKey");
	if (panicKey) {
		panicKey.value = localStorage.getItem("obsidian.panicKey") || "";
		panicKey.addEventListener("keydown", (e) => {
			e.preventDefault();
			localStorage.setItem("obsidian.panicKey", e.key);
			panicKey.value = e.key;
		});
	}
	if ($("#panic").length > 0) {
		$("#panic").val(localStorage.getItem("obsidian.panicUrl") || "");
	}
	document.getElementById("blank").addEventListener("click", () => {
		win = window.open();
		win.document.body.style.margin = "0";
		win.document.body.style.height = "100vh";
		html = `
        <style>*{margin:0;padding:0;border:none}body,iframe{height:100vh;width:100vw}</style><script>
        </script><iframe id=obsidian></iframe>`;
		win.document.querySelector("html").innerHTML = html;
		win.eval(`let obsidian = document.getElementById("obsidian");obsidian.setAttribute("src", "${location.origin}");`);
		location.href = "https://google.com";
		close();
	});
	if ($("#panicmode").length > 0) {
		$("#panicmode").prop({ href: panicurl });
	}
	if ($(".obsidianminified").length > 0) {
		$.get("https://raw.githubusercontent.com/skysthelimitt/selenite-optimized/main/build/bookmark.txt", function (data) {
			$(".obsidianminified").prop({ href: data });
		});
		$.get("https://raw.githubusercontent.com/car-axle-client/car-axle-client/v10/dist/build.js", function (data) {
			$(".caraxle").prop({ href: `javascript:${encodeURI(data)}` });
		});
	}
});
window.addEventListener("beforeunload", (e) => {
	if (localStorage.getItem("obsidian.blockClose") == "true") {
		e.preventDefault();
		e.returnValue = "";
	}
});
document.addEventListener("contextmenu", (e) => {
	if (localStorage.getItem("obsidian.rightClick") == "true") {
		e.preventDefault();
	}
});
document.addEventListener("keydown", (e) => {
	if (localStorage.getItem("obsidian.noInspect") == "true") {
		if (e.key === "F12" || (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) || (e.ctrlKey && e.key.toUpperCase() === "U")) {
			e.preventDefault();
		}
	}
});
document.addEventListener("keydown", (e) => {
	if (localStorage.getItem("obsidian.panic") == "true" && localStorage.getItem("obsidian.panicKey")) {
		if (e.target.tagName == "INPUT" || e.target.tagName == "TEXTAREA" || e.target.tagName == "SELECT") return;
		if (e.key === localStorage.getItem("obsidian.panicKey")) {
			panicGo();
		}
	}
});
const konamiSequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a", "Enter"];
let konamiIndex = 0;
document.addEventListener("keydown", (e) => {
	if (e.key === konamiSequence[konamiIndex]) {
		konamiIndex++;
	} else {
		konamiIndex = e.key === konamiSequence[0] ? 1 : 0;
	}
	if (konamiIndex === konamiSequence.length) {
		konamiIndex = 0;
		if (!localStorage.getItem("obsidian.konami")) {
			localStorage.setItem("obsidian.konami", "true");
			toast({ title: "Secret theme unlocked!", message: "VATICAN has been added to your settings." });
			const vaticanBtn = document.getElementById("vaticanBtn");
			if (vaticanBtn) vaticanBtn.style.display = "";
		}
	}
});
let easterTyped = "";
document.addEventListener("keydown", (e) => {
	easterTyped = (easterTyped + e.key).toLowerCase();
	if (easterTyped.length > 14) {
		easterTyped = easterTyped.substring(easterTyped.length - 14);
	}
	if (easterTyped.includes("thomas aquinas")) {
		easterTyped = "";
		creatorDvd();
	} else if (easterTyped.includes("mussolini")) {
		easterTyped = "";
		if (!localStorage.getItem("obsidian.duce")) {
			localStorage.setItem("obsidian.duce", "true");
			toast({ title: "Secret theme unlocked!", message: "DUCE has been added to your settings." });
			const duceBtn = document.getElementById("duceBtn");
			if (duceBtn) duceBtn.style.display = "";
		}
	}
});
function creatorDvd() {
	const img = document.createElement("img");
	img.src = "/img/pfps/chesco.jpg";
	img.style.cssText = "position: fixed; width: 140px; height: 140px; object-fit: cover; border-radius: 12px; z-index: 99999; pointer-events: none; box-shadow: 0 0 12px rgba(0,0,0,0.5); left: 0px; top: 0px;";
	document.body.appendChild(img);
	const size = 140;
	let x = Math.random() * Math.max(1, innerWidth - size);
	let y = Math.random() * Math.max(1, innerHeight - size);
	const speed = 210 + Math.random() * 50;
	const diagonals = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
	const angle = diagonals[Math.floor(Math.random() * diagonals.length)];
	let vx = Math.cos(angle) * speed;
	let vy = Math.sin(angle) * speed;
	let rot = 0;
	const start = performance.now();
	let last = start;
	function frame(now) {
		if (now - start > 5000) {
			img.remove();
			return;
		}
		const dt = Math.min((now - last) / 16.667, 3);
		last = now;
		x += vx * dt;
		y += vy * dt;
		if (x <= 0) { x = 0; vx = Math.abs(vx); }
		if (x >= innerWidth - size) { x = innerWidth - size; vx = -Math.abs(vx); }
		if (y <= 0) { y = 0; vy = Math.abs(vy); }
		if (y >= innerHeight - size) { y = innerHeight - size; vy = -Math.abs(vy); }
		rot += 0.9 * dt;
		img.style.left = x + "px";
		img.style.top = y + "px";
		img.style.transform = "rotate(" + rot + "deg)";
		requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
}
function panicGo() {
	if (localStorage.getItem("obsidian.panic") != "true") return;
	let url = localStorage.getItem("obsidian.panicUrl");
	if (!url) url = "https://google.com";
	window.location.href = url;
}
function setPanicMode() {
	let url = $("#panic").val();
	if (!url) {
		url = "https://google.com";
	} else if (!url.startsWith("http")) {
		url = "https://" + url;
	}
	localStorage.setItem("obsidian.panicUrl", url);
	document.cookie = "panicurl=" + url + "; path=/";
	toast({ title: "Panic mode set", message: url });
}
function copyToClipboard(text) {
	navigator.clipboard.writeText(text);
	alert("Copied text!");
}
function setTheme(theme) {
	localStorage.setItem("obsidian.theme", theme);
	document.body.setAttribute("theme", theme);
	if (theme != "custom") {
		document.getElementById("customMenu").style.display = "none";
		document.body.style = "";
	}
}
function setPanicMode() {
	let url = $("#panic").val();
	if (!url) {
		url = "https://google.com";
	} else if (!url.startsWith("http")) {
		url = "https://" + url;
	}
	localStorage.setItem("obsidian.panicUrl", url);
	document.cookie = "panicurl=" + url + "; path=/";
	toast({ title: "Panic mode set", message: url });
}
$(document).ready(function () {
	if (!window.location.href.startsWith("about:")) {
		$("#webicon").attr("placeholder", window.location.href.replace(/\/[^\/]*$/, "/"));
	}
});
function loadScript(a, b) {
	var c = document.createElement("script");
	(c.type = "text/javascript"), (c.src = a), (c.onload = b), document.head.appendChild(c);
}
function toast(message, onclick) {
	const toast = document.createElement("div");
	toast.setAttribute("id", "toast");
	console.log(message.time);
	toast.innerHTML = `<div class=samerow><h1>${message.title}${message.time ? ` - ${timeAgo(new Date(message.time * 1000))}` : ""}</h1></div><p>${message.message}</p>`;
	toast.style.animation = "toastFade 6s";
	document.body.appendChild(toast);
	if (onclick) {
		toast.addEventListener("click", onclick);
		toast.style.cursor = "pointer";
	}
	setTimeout(() => {
		toast.remove();
	}, 6000);
}
function timeAgo(input) {
	const date = input instanceof Date ? input : new Date(input);
	const formatter = new Intl.RelativeTimeFormat("en");
	const ranges = {
		years: 3600 * 24 * 365,
		months: 3600 * 24 * 30,
		weeks: 3600 * 24 * 7,
		days: 3600 * 24,
		hours: 3600,
		minutes: 60,
		seconds: 1,
	};
	const secondsElapsed = (date.getTime() - Date.now()) / 1000;
	for (let key in ranges) {
		if (ranges[key] < Math.abs(secondsElapsed)) {
			const delta = secondsElapsed / ranges[key];
			return formatter.format(Math.round(delta), key);
		}
	}
}
let cookieConsentScript = document.createElement("script");
cookieConsentScript.src = "/js/cookieConsent.js";
document.head.appendChild(cookieConsentScript);
let cookieConsentStyle = document.createElement("link");
cookieConsentStyle.href = "/js/cookieConsent.css";
cookieConsentStyle.rel = "stylesheet";
document.head.appendChild(cookieConsentStyle);

var GAME_CDN = "";

function gameBase(path) {
	if (path === "sppa") { return ""; }
	var manual = localStorage.getItem("obsidian.gamesBase");
	if (manual) { return manual; }
	if (location.hostname.indexOf("github.io") !== -1) {
		return GAME_CDN;
	}
	return "";
}