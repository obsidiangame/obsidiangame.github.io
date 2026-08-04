let cloaklist;
function cloakExceptions(url) {
	if (url.includes("harrisonburg.instructure.com") == true) {
		return "learn.canvas.net";
	}
	return url;
}

function setCloakCookie(name, url) {
	console.log(name + url);
	if (!(url == null)) {
		localStorage.setItem("obsidian.tabicon", url);
		localStorage.setItem("obsidian.tabname", name);
	} else {
		url = cloakExceptions($("#webicon").val());
		localStorage.setItem("obsidian.tabicon", "https://s2.googleusercontent.com/s2/favicons?domain_url=" + url);
		localStorage.setItem("obsidian.tabname", $("#webname").val());
	}
	document.cookie = "tabicon=" + encodeURIComponent(localStorage.getItem("obsidian.tabicon")) + "; path=/";
	document.cookie = "tabname=" + encodeURIComponent(localStorage.getItem("obsidian.tabname")) + "; path=/";
	setCloak();
}

function clearCloak() {
	localStorage.removeItem("obsidian.tabicon");
	localStorage.removeItem("obsidian.tabname");
	document.cookie = "tabicon=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	document.cookie = "tabname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	var link = document.querySelector("link[rel~='icon']");
	link.remove();
	document.title = "Settings | Obsidian";
	link = document.createElement("link");
	link.rel = "icon";
	document.head.appendChild(link);
	link.href = "/favicon.ico";
}
async function loadCloaks() {
  const response = await fetch("/data/cloaks.json");
  cloaklist = await response.json();
	if (typeof populateIconPicker === "function") populateIconPicker();
	var presetCloaks = document.getElementById("presetCloaks");
	presetCloaks.onchange = (event) => {
		if (event.target.value == "reset") {
			clearCloak();
			return;
		}
		console.log(event.target.value);
		console.log(cloaklist[event.target.value]);
		setCloakCookie(cloaklist[event.target.value][0], cloaklist[event.target.value][1]);
	};
}
document.addEventListener("DOMContentLoaded", function () {
	loadCloaks();
});
