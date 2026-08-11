$.getJSON("/data/games.json", function (data) {
	if (document.readyState === "complete") {
		loadGames(data);
	} else {
		let areGamesReady = setInterval(() => {
			if (document.readyState === "complete") {
				loadGames(data);
				clearInterval(areGamesReady);
			}
		}, 50);
	}
});

function loadGames(data) {
	starredgames = JSON.parse(localStorage.getItem("starred") || getCookie("starred") || "[]");
	if (!localStorage.getItem("starred") && getCookie("starred")) {
		localStorage.setItem("starred", JSON.stringify(starredgames));
	}
	$("#gamesearch").prop({
		placeholder: "Click here to search through our " + data.length + " games!",
	});
	data.sort(dynamicSort("name"));
	gamelist = data;
	for (let i = 0; i < data.length; i++) {
		gameCategoryCache[data[i].directory] = getGameCategory(data[i]);
		let $element = $("<a>")
			.attr({
				class: "game",
				id: data[i].directory,
				recommended: data[i].recommended,
				// href: "semag/" + data[i].directory + "/index.html",
				href: "loader.html#" + btoa(encodeURIComponent(JSON.stringify([data[i].directory, data[i].image, data[i].name]))),
			})
			.data("recommended", data[i].recommended)
			.append(
				$("<img>").prop({
					src: "semag/" + data[i].directory + "/" + data[i].image,
					alt: data[i].name + " logo",
					loading: "lazy"
				})
			)
			.append($("<h1>").text(data[i].name))
			.append(
				$("<img>").prop({
					src: "img/star.svg",
					alt: "star",
					class: "star",
				})
			);

		if (starredgames.includes(data[i].directory)) {
			$element.find("img.star").attr("id", "starred");
			$element.find("img.star").attr("src", "img/star-fill.svg");
			let $pinnedelement = $element.clone();
			$("#pinned").append($pinnedelement);
			if ($("#pinnedmessage")) {
				$("#pinnedmessage").hide();
			}
		}

		$("#games").append($element);
	}
	$("#games #message").remove();
	searchGames();
	// starred games
	let starred;
	$(document).on("click", "img.star", function (event) {

	});
	$(document).on("click", ".game", function (event) {
		if ($(event.target).is("img.star")) {
			event.preventDefault();
			event.stopPropagation();
			if (!$(event.target).attr("id")) {
				$(event.target).prop({ id: "starred" });
				$(event.target).prop({ src: "img/star-fill.svg" });
				starred = JSON.parse(localStorage.getItem("starred") || "[]");
				starred.push($(this).attr("id"));
				localStorage.setItem("starred", JSON.stringify(starred));
				$element = $(this).clone();
				$("#pinned").append($element);
				$("#pinnedmessage").hide();
				temp = $("#pinned")[0].childNodes;
				pinnedarray = [...temp];
				pinnedarray.sort(dynamicSort("id"));
				$("#pinned").empty();
				for (let i = 0; i < pinnedarray.length; i++) {
					pinnedarraynodes = pinnedarray[i].childNodes;
					pinnedarraynodes = [...pinnedarraynodes];
					let $element = $("<a>")
						.prop({
							class: "game",
							id: pinnedarray[i].id,
						})
						.attr("href", pinnedarray[i].href)
						.append(
							$("<img>").prop({
								src: pinnedarraynodes[0].src,
								alt: pinnedarraynodes[0].alt,
								class: "gameicon",
							})
						)
						.append($("<h1>").text(pinnedarraynodes[1].innerHTML))
						.append(
							$("<img>").prop({
								src: "img/star-fill.svg",
								alt: "star",
								class: "star",
								id: "starred",
							})
						);
					$("#pinned").append($element);
				}
			} else {
				$(event.target).removeAttr("id");
				$(event.target).attr("src", "img/star.svg");
				$thisdiv = "#" + $(this).attr("id");
				$thisdiv = $thisdiv.replace(".", "\\.");
				starred = JSON.parse(localStorage.getItem("starred") || "[]");
				ourindex = starred.indexOf($(this).attr("id"));
				starred.splice(ourindex, 1);
				localStorage.setItem("starred", JSON.stringify(starred));
				$("#pinned " + $thisdiv).remove();
				if ($("#pinned").is(":empty")) {
					$("#pinnedmessage").show();
				}
				$($thisdiv + " #starred").attr("src", "img/star.svg");
				$($thisdiv + " #starred").removeAttr("id");
			}
		}
	});
	$(document).on("click", "#game img .star", function (event) {
		event.stopPropagation();
		$(this).prop({ class: "material-symbols-outlined fill" });
	});
}

function redirectGame(dir) {
	let g = gamelist.find((x) => x.directory == dir);
	window.location.href =
		"loader.html#" +
		btoa(encodeURIComponent(JSON.stringify([g.directory, g.image, g.name])));
}
function dynamicSort(property) {
	var sortOrder = 1;

	if (property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a, b) {
		if (sortOrder == -1) {
			return b[property].localeCompare(a[property]);
		} else {
			return a[property].localeCompare(b[property]);
		}
	};
}

function selectRandomGame() {
	redirectGame(gamelist[Math.floor(Math.random() * gamelist.length - 1)].directory);
}

let viewrecommended = 0;
function recommendedGames() {
	if (viewrecommended == 0) {
		$("#games .game").hide();
		$("#games .game").each(function () {
			if ($(this).attr("recommended")) {
				$(this).show();
			}
		});
		$("#recommend").text("Click to view all games again!");
		viewrecommended = 1;
	} else {
		$("#games .game").hide();
		$("#games .game").show();
		viewrecommended = 0;
		$("#recommend").text("Click to view recommended games!");
	}
}

const GAME_CATS = [
	{ name: "Papa's", kws: ["papas"] },
	{ name: "Henry Stickmin", kws: ["henry stickmin"] },
	{ name: "FNAF", kws: ["five nights"] },
	{ name: "Minecraft", kws: ["minecraft", "eaglercraft", "mine blocks", "creeper craft", "infinitecraft", "kerosene"] },
	{ name: "Pokemon", kws: ["pokemon"] },
	{ name: "Sonic", kws: ["sonic"] },
	{ name: "Mario", kws: ["mario"] },
	{ name: "Duck Life", kws: ["duck life"] },
	{ name: "Vex", kws: ["vex"] },
	{ name: "Zombies", kws: ["zombie", "zombocalypse", "plants vs. zombies"] },
	{ name: "Horror", kws: ["horror", "baldi", "backrooms", "the black man", "terri-fried", "gloom", "burger and frights"] },
	{ name: "Racing", kws: ["racing", "race", "drift", "kart", "hill climb", "moto x3m", "bike champ", "madalin", "car driver", "turbo racing", "splash dash", "pyongyang", "crazy taxi", "polytrack", "monster tracks", "drive mad", "truck"] },
	{ name: "Sports", kws: ["soccer", "basket", "football", "golf", "tennis", "boxing", "retro bowl", "pool", "1 on 1"] },
	{ name: "Runners", kws: ["subway", "surfers", "temple run", "crossy road", "doodle jump", "flappy", "jetpack", "copter", "run", "tunnel rush", "slope"] },
	{ name: "Shooting", kws: ["shooter", "gun", "tank", "sniper", "time shooter", "doom", "counter strike", "csgo", "quake", "temple of boom", "getaway", "blood tournament", "gta", "grand theft", "goldeneye", "superhot", "skibidi"] },
	{ name: "Fighting", kws: ["smash", "gladihoppers", "guilty gear", "thumb fighter", "brawl", "strike force kitty", "duel"] },
	{ name: "Rhythm", kws: ["friday night", "osu", "a dance of fire", "geometry", "piano"] },
	{ name: "Idle & Clicker", kws: ["clicker", "idle", "cookie", "achievement unlocked", "doge miner", "paperclips", "capitalist", "pickcrafter", "bitlife", "snow rider"] },
	{ name: "Strategy", kws: ["bloons", "tower", "age of war", "mindustry", "super auto pets", "chess", "totally accurate", "tabs", "simcity", "the sims", "pandemic", "plague"] },
	{ name: "Platformers", kws: ["pizza tower", "celeste", "dadish", "red ball", "super meat boy", "obby", "bob the robber", "draw climber", "karlson", "impossible game", "worlds hardest", "this is the only level", "vex"] },
	{ name: "Simulators", kws: ["simulator", "talking tom", "skateboarding", "nut sim", "townscaper", "webgl fluid", "virtual x86", "windows 98", "learn to fly", "theme hotel", "tycoon"] },
	{ name: "Puzzle", kws: ["2048", "sudoku", "solitaire", "minesweeper", "connect four", "mahjong", "puzzle", "little alchemy", "cell machine", "factory balls", "wordle", "riddle", "impossible quiz", "there is no game", "shapez", "shape shipper", "sandboxels", "sand game", "snake", "bubble shooter", "cut the rope", "knife hit", "helix jump", "watermelon"] },
	{ name: ".io & Multiplayer", kws: ["hole.io", "paper.io", "snowball.io", "state.io", "territorial.io", "yohoho.io", "1v1.lol", "justfall.lol", "among us", "fort", "friday night", "multiplayer", "2 player", "two player", "fireboy", "bad ice cream"] },
	{ name: "Retro & Classic", kws: ["pacman", "tetris", "pong", "frogger", "donkey kong", "pinball", "tron", "simon", "hextris", "sandtrix", "snake", "space cadet", "minesweeper", "solitaire"] },
	{ name: "Other", kws: [] }
];
const gameCategoryCache = {};
let currentCategory = "All Games";
let catModal = null;

function getGameCategory(g) {
	const hay = (g.name + " " + g.directory).toLowerCase();
	for (const c of GAME_CATS) {
		if (c.kws.some((k) => hay.includes(k))) return c.name;
	}
	return "Other";
}

function applyCategoryFilter() {
	$("#games .game").each(function () {
		const cat = currentCategory;
		let ok = true;
		if (cat !== "All Games" && gameCategoryCache[$(this).attr("id")] !== cat) ok = false;
		const txt = $("#gamesearch").val() || "";
		if (txt && $(this).text().toUpperCase().indexOf(txt.toUpperCase()) === -1 && $(this).attr("id").toUpperCase().indexOf(txt.toUpperCase()) === -1) ok = false;
		if (ok) $(this).show();
	});
}

function categoryChanger() {
	if (catModal) {
		catModal.remove();
		catModal = null;
	}
	catModal = document.createElement("div");
	catModal.id = "catmodal";
	catModal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:1000;";
	const box = document.createElement("div");
	box.style.cssText = "background:#1a1a2e;border:1px solid #5a189a;border-radius:12px;padding:20px;max-width:560px;width:92%;max-height:80vh;overflow:auto;box-shadow:0 8px 32px rgba(0,0,0,.5);";
	const title = document.createElement("h3");
	title.textContent = "Game Categories";
	title.style.cssText = "margin:0 0 12px;color:#c77dff;";
	const wrap = document.createElement("div");
	wrap.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;";
	const names = ["All Games"].concat(GAME_CATS.map((c) => c.name));
	names.forEach((n) => {
		const b = document.createElement("button");
		b.textContent = n;
		b.style.cssText = "background:#240046;color:#e0aaff;border:1px solid #5a189a;border-radius:8px;padding:8px 12px;cursor:pointer;font-size:14px;";
		if (n === currentCategory) b.style.background = "#7b2cbf";
		b.onmouseover = () => { if (n !== currentCategory) b.style.background = "#3c096c"; };
		b.onmouseout = () => { if (n !== currentCategory) b.style.background = "#240046"; };
		b.onclick = () => {
			currentCategory = n;
			catModal.remove();
			catModal = null;
			searchGames();
		};
		wrap.appendChild(b);
	});
	box.appendChild(title);
	box.appendChild(wrap);
	catModal.appendChild(box);
	catModal.addEventListener("click", (e) => {
		if (e.target === catModal) {
			catModal.remove();
			catModal = null;
		}
	});
	document.body.appendChild(catModal);
}
