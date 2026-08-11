(function () {
	if (window.__obsidianContextMenu) return;
	window.__obsidianContextMenu = true;

	var ICONS = {
		reload: '<path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>',
		reload2: '<path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 13c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 8.74A7.93 7.93 0 0 0 4 13c0 4.42 3.58 8 8 8v4l5-5-5-5v4z"/>',
		back: '<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>',
		forward: '<path d="M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4v-2z"/>',
		link: '<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>',
		open: '<path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zM19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z"/>',
		copy: '<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>',
		cut: '<path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"/>',
		paste: '<path d="M19 2h-4.18C14.4.84 13.3 0 12 0S9.6.84 9.18 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/>',
		home: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
		apps: '<path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>',
		games: '<path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z"/>'
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

	function copySelection() {
		var sel = window.getSelection();
		if (!sel || !sel.toString().trim()) return;
		copyText(sel.toString());
	}

	function hasSelection() {
		var sel = window.getSelection();
		return !!(sel && sel.toString().trim());
	}

	function addItem(menu, item) {
		var row = document.createElement("div");
		row.className = "ob-item";
		row.innerHTML = icon(item.icon) + '<span class="ob-label">' + item.label + "</span>";
		(function (fn) {
			row.addEventListener("mousedown", function (e) {
				e.preventDefault();
				e.stopPropagation();
				closeMenu();
				fn();
			});
		})(item.fn);
		menu.appendChild(row);
		return row;
	}

	function addSep(menu) {
		var sep = document.createElement("div");
		sep.className = "ob-sep";
		menu.appendChild(sep);
	}

	function showMenu(x, y, opts) {
		closeMenu();
		menu = document.createElement("div");
		menu.id = "obmenu";

		if (opts.editable) {
			addItem(menu, { icon: ICONS.cut, label: "Cut", fn: function () { document.execCommand("cut"); } });
			addItem(menu, { icon: ICONS.copy, label: "Copy", fn: function () { document.execCommand("copy"); } });
			addItem(menu, { icon: ICONS.paste, label: "Paste", fn: function () { document.execCommand("paste"); } });
			addSep(menu);
		}

		addItem(menu, { icon: ICONS.reload, label: "Reload Page", fn: function () { location.reload(); } });
		addItem(menu, { icon: ICONS.reload2, label: "Hard Reload", fn: function () { location.reload(true); } });
		addItem(menu, { icon: ICONS.back, label: "Back", fn: function () { history.back(); } });
		addItem(menu, { icon: ICONS.forward, label: "Forward", fn: function () { history.forward(); } });

		if (opts.linkHref) {
			addSep(menu);
			addItem(menu, { icon: ICONS.link, label: "Copy Link", fn: function () { copyText(opts.linkHref); } });
			addItem(menu, { icon: ICONS.open, label: "Open in New Tab", fn: function () { window.open(opts.linkHref, "_blank", "noopener"); } });
		}
		if (opts.selection) {
			addSep(menu);
			addItem(menu, { icon: ICONS.copy, label: "Copy Text", fn: copySelection });
		}
		addSep(menu);

		addItem(menu, { icon: ICONS.home, label: "Open Home", fn: function () { location.href = "/"; } });
		addItem(menu, { icon: ICONS.apps, label: "Open Browse", fn: function () { location.href = "/browse.html"; } });
		addItem(menu, { icon: ICONS.games, label: "Open Games", fn: function () { location.href = "/projects.html"; } });

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
		var t = e.target;
		if (t && t.closest && t.closest("#obmenu")) return;
		e.preventDefault();
		closeMenu();
		var opts = { linkHref: null, selection: hasSelection(), editable: false };
		if (t && t.closest) {
			var a = t.closest("a[href]");
			if (a) opts.linkHref = a.href;
			opts.editable = !!t.closest("input, textarea, select, [contenteditable=true]");
		}
		showMenu(e.clientX, e.clientY, opts);
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