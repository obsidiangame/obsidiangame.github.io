(function () {
	if (window.__obsidianContextMenu) return;
	window.__obsidianContextMenu = true;

	var ICONS = {
		reload: '<path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>',
		back: '<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>',
		forward: '<path d="M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4v-2z"/>',
		link: '<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>',
		open: '<path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zM19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z"/>',
		copy: '<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>',
		selectall: '<path d="M3 5V3h2v2H3zm4 0V3h2v2H7zm4 0V3h2v2h-2zm4 0V3h2v2h-2zm4 0V3h2v2h-2zM3 9V7h2v2H3zm4 0V7h2v2H7zm4 0V7h2v2h-2zm4 0V7h2v2h-2zm4 0V7h2v2h-2zM3 13v-2h2v2H3zm4 0v-2h2v2H7zm4 0v-2h2v2h-2zm4 0v-2h2v2h-2zm4 0v-2h2v2h-2zM3 17v-2h2v2H3zm4 0v-2h2v2H7zm4 0v-2h2v2h-2zm4 0v-2h2v2h-2zm4 0v-2h2v2h-2zM3 21v-2h2v2H3zm4 0v-2h2v2H7zm4 0v-2h2v2h-2zm4 0v-2h2v2h-2zm4 0v-2h2v2h-2z"/>'
	};

	function icon(path) {
		return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' + path + '</svg>';
	}

	var menu = null;

	function closeMenu() {
		if (menu) {
			menu.remove();
			menu = null;
		}
	}

	function notify(msg) {
		if (typeof toast === "function") toast({ title: "Copied", message: msg });
	}

	function fallbackCopy(text) {
		var ta = document.createElement("textarea");
		ta.value = text;
		ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none;";
		document.body.appendChild(ta);
		ta.select();
		try {
			document.execCommand("copy");
			notify("Copied to clipboard");
		} catch (e) { }
		ta.remove();
	}

	function copyText(text) {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(text).then(function () {
				notify("Copied to clipboard");
			}).catch(function () {
				fallbackCopy(text);
			});
		} else {
			fallbackCopy(text);
		}
	}

	function selectAllText() {
		var sel = window.getSelection();
		var range = document.createRange();
		range.selectNodeContents(document.body);
		sel.removeAllRanges();
		sel.addRange(range);
		closeMenu();
	}

	function copySelection() {
		var sel = window.getSelection();
		if (!sel || !sel.toString().trim()) return;
		copyText(sel.toString());
	}

	function getSelection() {
		var sel = window.getSelection();
		return sel && sel.toString().trim().length > 0;
	}

	function showMenu(x, y, linkHref) {
		closeMenu();
		menu = document.createElement("div");
		menu.id = "obmenu";

		var items = [
			{ icon: ICONS.reload, label: "Reload Page", hint: "Ctrl+R", fn: function () { location.reload(); } },
			{ icon: ICONS.back, label: "Back", hint: "Alt+←", fn: function () { history.back(); } },
			{ icon: ICONS.forward, label: "Forward", hint: "Alt+→", fn: function () { history.forward(); } }
		];

		var sel = getSelection();
		if (linkHref || sel) {
			items.push(null);
			if (linkHref) {
				items.push({
					icon: ICONS.link,
					label: "Copy Link",
					hint: "Ctrl+C",
					fn: function () { copyText(linkHref); }
				});
				items.push({
					icon: ICONS.open,
					label: "Open in New Tab",
					fn: function () { window.open(linkHref, "_blank", "noopener"); }
				});
			}
			if (sel) {
				items.push({
					icon: ICONS.copy,
					label: "Copy Text",
					hint: "Ctrl+C",
					fn: copySelection
				});
			}
			items.push({
				icon: ICONS.selectall,
				label: "Select All",
				hint: "Ctrl+A",
				fn: selectAllText
			});
		}

		for (var i = 0; i < items.length; i++) {
			if (!items[i]) {
				var sep = document.createElement("div");
				sep.className = "ob-sep";
				menu.appendChild(sep);
				continue;
			}
			var it = items[i];
			var row = document.createElement("div");
			row.className = "ob-item";
			row.innerHTML = icon(it.icon) + '<span class="ob-label">' + it.label + '</span>' + (it.hint ? '<span class="ob-hint">' + it.hint + "</span>" : "");
			(function (fn) {
				row.addEventListener("mousedown", function (e) {
					e.preventDefault();
					e.stopPropagation();
					closeMenu();
					fn();
				});
			})(it.fn);
			menu.appendChild(row);
		}

		document.body.appendChild(menu);
		menu.style.left = x + "px";
		menu.style.top = y + "px";

		var rect = menu.getBoundingClientRect();
		var vw = window.innerWidth - 8;
		var vh = window.innerHeight - 8;
		if (rect.right > vw) menu.style.left = Math.max(8, x - rect.width) + "px";
		if (rect.bottom > vh) menu.style.top = Math.max(8, y - rect.height) + "px";
	}

	document.addEventListener("contextmenu", function (e) {
		if (localStorage.getItem("obsidian.rightClick") === "true") {
			e.preventDefault();
			closeMenu();
			return;
		}
		if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;
		var t = e.target;
		if (t && t.closest) {
			if (t.closest("#obmenu")) return;
			var editable = t.closest("input, textarea, select, [contenteditable=true]");
			if (editable) return;
		}
		e.preventDefault();
		closeMenu();
		var linkHref = null;
		if (t && t.closest) {
			var a = t.closest("a[href]");
			if (a) linkHref = a.href;
		}
		showMenu(e.clientX, e.clientY, linkHref);
	});

	document.addEventListener("mousedown", function (e) {
		if (menu && !e.target.closest("#obmenu")) closeMenu();
	});
	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape") closeMenu();
	});
	window.addEventListener("blur", closeMenu);
	window.addEventListener("resize", closeMenu);
	window.addEventListener("scroll", closeMenu, true);
})();