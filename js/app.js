var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/*
  FilmFlow — общая логика для всех страниц.
  Исправлен менеджер плейлистов (Коллекция).
*/
(function () {
    var DB = window.FILMFLOW_DB || [];
    var CHANNELS = window.FILMFLOW_CHANNELS || [];
    // ===== helpers =====
    var getOne = function (sel, root) {
        if (root === void 0) { root = document; }
        return root.querySelector(sel);
    };
    var getAll = function (sel, root) {
        if (root === void 0) { root = document; }
        return Array.from(root.querySelectorAll(sel));
    };
    var esc = function (s) {
        if (s === void 0) { s = ""; }
        return String(s).replace(/[&<>"']/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]); });
    };
    var qs = function (key) { return new URLSearchParams(location.search).get(key); };
    // ===== storage / несколько переносимых профилей =====
    var LS = {
        profiles: "filmflow_profiles_v2",
        activeProfile: "filmflow_active_profile_v2",
        profile: "filmflow_profile",
        fav: "filmflow_favorites",
        wl: "filmflow_watchlater",
        prog: "filmflow_progress",
        last: "filmflow_lastwatch",
        hist: "filmflow_history",
        playlists: "filmflow_playlists"
    };
    var rawLoad = function (k, def) {
        var _a;
        try { return (_a = JSON.parse(localStorage.getItem(k))) !== null && _a !== void 0 ? _a : def; }
        catch (_b) { return def; }
    };
    var rawSave = function (k, v) {
        try { localStorage.setItem(k, JSON.stringify(v)); }
        catch (e) { console.warn("Ошибка сохранения (".concat(k, ")"), e); }
    };
    var makeId = function () { return "p_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8); };
    var emptyProfile = function (name) { return ({
        id: makeId(), name: name || "Гость", favorites: [], watchlater: [], progress: {},
        lastWatch: null, history: [], playlists: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    }); };
    var profiles = rawLoad(LS.profiles, []);
    var activeProfileId = localStorage.getItem(LS.activeProfile) || "";

    // Однократный перенос данных старой версии сайта.
    if (!Array.isArray(profiles) || profiles.length === 0) {
        var legacy = emptyProfile((rawLoad(LS.profile, { name: "Гость" }) || {}).name || "Гость");
        legacy.favorites = rawLoad(LS.fav, []);
        legacy.watchlater = rawLoad(LS.wl, []);
        legacy.progress = rawLoad(LS.prog, {});
        legacy.lastWatch = rawLoad(LS.last, null);
        legacy.history = rawLoad(LS.hist, []);
        legacy.playlists = rawLoad(LS.playlists, []);
        profiles = [legacy];
        activeProfileId = legacy.id;
        rawSave(LS.profiles, profiles);
        localStorage.setItem(LS.activeProfile, activeProfileId);
    }
    var activeRecord = profiles.find(function (p) { return p.id === activeProfileId; }) || profiles[0];
    activeProfileId = activeRecord.id;
    localStorage.setItem(LS.activeProfile, activeProfileId);

    var profile = { id: activeRecord.id, name: activeRecord.name || "Гость" };
    var favorites = Array.isArray(activeRecord.favorites) ? activeRecord.favorites : [];
    var watchlater = Array.isArray(activeRecord.watchlater) ? activeRecord.watchlater : [];
    var progress = activeRecord.progress || {};
    var lastWatch = activeRecord.lastWatch || null;
    var history = Array.isArray(activeRecord.history) ? activeRecord.history : [];
    var playlists = Array.isArray(activeRecord.playlists) ? activeRecord.playlists : [];

    function persistActiveProfile() {
        var idx = profiles.findIndex(function (p) { return p.id === activeProfileId; });
        var record = {
            id: activeProfileId, name: profile.name || "Гость", favorites: favorites,
            watchlater: watchlater, progress: progress, lastWatch: lastWatch,
            history: history, playlists: playlists,
            createdAt: (idx >= 0 && profiles[idx].createdAt) || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        if (idx >= 0) profiles[idx] = record; else profiles.push(record);
        rawSave(LS.profiles, profiles);
        localStorage.setItem(LS.activeProfile, activeProfileId);
    }
    var load = function (k, def) {
        if (k === LS.profile) return profile;
        if (k === LS.fav) return favorites;
        if (k === LS.wl) return watchlater;
        if (k === LS.prog) return progress;
        if (k === LS.last) return lastWatch;
        if (k === LS.hist) return history;
        if (k === LS.playlists) return playlists;
        return rawLoad(k, def);
    };
    var save = function (k, v) {
        if (k === LS.profile) profile = v || { name: "Гость" };
        else if (k === LS.fav) favorites = v || [];
        else if (k === LS.wl) watchlater = v || [];
        else if (k === LS.prog) progress = v || {};
        else if (k === LS.last) lastWatch = v || null;
        else if (k === LS.hist) history = v || [];
        else if (k === LS.playlists) playlists = v || [];
        else { rawSave(k, v); return; }
        persistActiveProfile();
    };

    function switchProfile(id) {
        if (!profiles.some(function (p) { return p.id === id; })) return;
        persistActiveProfile();
        localStorage.setItem(LS.activeProfile, id);
        location.reload();
    }
    function createProfile(name) {
        persistActiveProfile();
        var p = emptyProfile(name);
        profiles.push(p);
        rawSave(LS.profiles, profiles);
        localStorage.setItem(LS.activeProfile, p.id);
        location.reload();
    }
    function deleteCurrentProfile() {
        if (profiles.length <= 1) return alert("Нельзя удалить единственный профиль. Сначала создайте другой.");
        if (!confirm("Удалить профиль «" + (profile.name || "Гость") + "» и все его данные?")) return;
        profiles = profiles.filter(function (p) { return p.id !== activeProfileId; });
        rawSave(LS.profiles, profiles);
        localStorage.setItem(LS.activeProfile, profiles[0].id);
        location.reload();
    }
    function encodeProfile(record) {
        var json = JSON.stringify({ version: 2, app: "FilmFlow", profile: record });
        var bytes = new TextEncoder().encode(json), bin = "";
        bytes.forEach(function (b) { bin += String.fromCharCode(b); });
        return "FF2-" + btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }
    function decodeProfile(code) {
        var clean = String(code || "").trim().replace(/^FF2-/, "").replace(/-/g, "+").replace(/_/g, "/");
        while (clean.length % 4) clean += "=";
        var bin = atob(clean), bytes = Uint8Array.from(bin, function (c) { return c.charCodeAt(0); });
        var payload = JSON.parse(new TextDecoder().decode(bytes));
        if (!payload || payload.app !== "FilmFlow" || !payload.profile) throw new Error("Неверный код");
        return payload.profile;
    }

    // ===== общие функции =====
    function setActiveNav() {
        var page = document.body.dataset.page || "";
        getAll(".navlink").forEach(function (a) { return a.classList.toggle("active", a.dataset.nav === page); });
        var nameEl = getOne("#navName");
        if (nameEl)
            nameEl.textContent = (profile === null || profile === void 0 ? void 0 : profile.name) || "Гость";
        var avatarEl = getOne("#navAvatar");
        if (avatarEl)
            avatarEl.textContent = ((profile === null || profile === void 0 ? void 0 : profile.name) || "Г")[0].toUpperCase();
    }
    function isFav(id) { return favorites.includes(id); }
    function isWL(id) { return watchlater.includes(id); }
    function toggleFav(id) {
        favorites = isFav(id) ? favorites.filter(function (x) { return x !== id; }) : __spreadArray(__spreadArray([], favorites, true), [id], false);
        save(LS.fav, favorites);
    }
    function toggleWL(id) {
        watchlater = isWL(id) ? watchlater.filter(function (x) { return x !== id; }) : __spreadArray(__spreadArray([], watchlater, true), [id], false);
        save(LS.wl, watchlater);
    }
    function resetAllData(resetProfile) {
        if (resetProfile === void 0) { resetProfile = false; }
        if (!confirm("Сбросить данные FilmFlow (избранное, смотреть позже, прогресс" + (resetProfile ? ", профиль" : "") + ")?"))
            return;
        favorites = [];
        watchlater = [];
        progress = {};
        lastWatch = null;
        history = [];
        playlists = [];
        save(LS.fav, favorites);
        save(LS.wl, watchlater);
        save(LS.prog, progress);
        save(LS.last, lastWatch);
        save(LS.hist, history);
        save(LS.playlists, playlists);
        if (resetProfile) {
            profile = { name: "Гость" };
            save(LS.profile, profile);
        }
        alert("Данные сброшены.");
        location.reload();
    }

    // ===== DB access =====
    var byId = function (id) { return DB.find(function (x) { return x.id === id; }); };
    function metaLine(item) {
        if (item.type === "movie") {
            return "".concat(item.year, " \u2022 ").concat(item.country, " \u2022 ").concat(item.duration, " \u043C\u0438\u043D \u2022 ").concat(item.age);
        }
        return "".concat(item.year, " \u2022 ").concat(item.country, " \u2022 \u0441\u0435\u0440\u0438\u0430\u043B \u2022 ").concat(item.age);
    }
    function makeCard(item, mode) {
        var _a;
        if (mode === void 0) { mode = "grid"; }
        var el = document.createElement("div");
        el.className = mode === "mini" ? "mini" : "card";
        el.tabIndex = 0;
        el.setAttribute("role", "button");
        el.setAttribute("aria-label", "\u041E\u0442\u043A\u0440\u044B\u0442\u044C: ".concat(item.title));
        var posterStyle = "";
        if (item.poster) {
            posterStyle = "background-image: url('".concat(esc(item.poster), "'); background-size: cover; background-position: center;");
        }
        else {
            posterStyle = "background: linear-gradient(135deg, rgba(255,45,85,.35), rgba(255,214,10,.18)), radial-gradient(500px 200px at 30% 10%, rgba(255,255,255,.22), transparent 50%), rgba(255,255,255,.03);";
        }
        el.innerHTML = "\n      <div class=\"poster\" style=\"".concat(posterStyle, "\" aria-label=\"").concat(esc(item.title), "\">\n        <div class=\"poster-title\">").concat(esc(item.title), "</div>\n      </div>\n      <div class=\"meta\">\n        <div class=\"row\">\n          <span class=\"tag\">").concat(esc(((_a = item.genres) === null || _a === void 0 ? void 0 : _a[0]) || "—"), "</span>\n          <span class=\"tag\">").concat(esc(String(item.year)), "</span>\n          <span class=\"rating\">").concat(Number(item.rating).toFixed(1), "</span>\n        </div>\n        <div class=\"small\">").concat(esc(metaLine(item)), "</div>\n      </div>\n    ");
        var go = function () { return location.href = "title.html?id=".concat(encodeURIComponent(item.id)); };
        el.addEventListener("click", go);
        el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ")
            go(); });
        return el;
    }

    // ===== page: home =====
    function initHome() {
        var rowNew = getOne("#rowNew"), rowHot = getOne("#rowHot"), rowTop = getOne("#rowTop");
        var btnContinue = getOne("#btnContinue");
        var btnRandom = getOne("#btnRandom");
        var btnClear = getOne("#btnClearAll");
        var byNew = __spreadArray([], DB, true).sort(function (a, b) { return b.year - a.year || b.pop - a.pop; }).slice(0, 8);
        var byHot = __spreadArray([], DB, true).sort(function (a, b) { return b.pop - a.pop; }).slice(0, 8);
        var byTop = __spreadArray([], DB, true).sort(function (a, b) { return b.rating - a.rating; }).slice(0, 8);
        if (rowNew) {
            rowNew.innerHTML = "";
            byNew.forEach(function (x) { return rowNew.appendChild(makeCard(x, "mini")); });
        }
        if (rowHot) {
            rowHot.innerHTML = "";
            byHot.forEach(function (x) { return rowHot.appendChild(makeCard(x, "mini")); });
        }
        if (rowTop) {
            rowTop.innerHTML = "";
            byTop.forEach(function (x) { return rowTop.appendChild(makeCard(x, "mini")); });
        }
        if (btnContinue)
            btnContinue.addEventListener("click", function () {
                if (!lastWatch)
                    return alert("Пока нет сохранённого просмотра.");
                if (lastWatch.type === "movie")
                    location.href = "watch.html?id=".concat(encodeURIComponent(lastWatch.id));
                else
                    location.href = "watch.html?id=".concat(encodeURIComponent(lastWatch.id), "&s=").concat(lastWatch.s, "&e=").concat(lastWatch.e);
            });
        if (btnRandom)
            btnRandom.addEventListener("click", function () {
                var x = DB[Math.floor(Math.random() * DB.length)];
                location.href = "title.html?id=".concat(encodeURIComponent(x.id));
            });
        if (btnClear)
            btnClear.addEventListener("click", function () { return resetAllData(false); });
    }

    // ===== page: catalog (фильтрация) =====
    function initCatalog() {
        var q = getOne("#q");
        var grid = getOne("#grid");
        var count = getOne("#count");
        var fGenre = getOne("#fGenre");
        var fCountry = getOne("#fCountry");
        var fAge = getOne("#fAge");
        var fSort = getOne("#fSort");
        var fYearMin = getOne("#fYearMin");
        var fYearMax = getOne("#fYearMax");
        var fRatingMin = getOne("#fRatingMin");
        var btnReset = getOne("#btnReset");
        var genres = __spreadArray([], new Set(DB.flatMap(function (x) { return x.genres || []; })), true).sort(function (a, b) { return a.localeCompare(b, "ru"); });
        var countries = __spreadArray([], new Set(DB.map(function (x) { return x.country; })), true).sort(function (a, b) { return a.localeCompare(b, "ru"); });
        if (fGenre)
            genres.forEach(function (g) { return fGenre.insertAdjacentHTML("beforeend", "<option value=\"".concat(esc(g), "\">").concat(esc(g), "</option>")); });
        if (fCountry)
            countries.forEach(function (c) { return fCountry.insertAdjacentHTML("beforeend", "<option value=\"".concat(esc(c), "\">").concat(esc(c), "</option>")); });
        function apply() {
            var text = ((q === null || q === void 0 ? void 0 : q.value) || "").trim().toLowerCase();
            var genre = (fGenre === null || fGenre === void 0 ? void 0 : fGenre.value) || "";
            var country = (fCountry === null || fCountry === void 0 ? void 0 : fCountry.value) || "";
            var age = (fAge === null || fAge === void 0 ? void 0 : fAge.value) || "";
            var sort = (fSort === null || fSort === void 0 ? void 0 : fSort.value) || "pop";
            var yMin = Number((fYearMin === null || fYearMin === void 0 ? void 0 : fYearMin.value) || 0);
            var yMax = Number((fYearMax === null || fYearMax === void 0 ? void 0 : fYearMax.value) || 9999);
            var rMin = Number((fRatingMin === null || fRatingMin === void 0 ? void 0 : fRatingMin.value) || 0);
            var list = DB.filter(function (x) {
                var hitText = !text ||
                    x.title.toLowerCase().includes(text) ||
                    (x.genres || []).some(function (g) { return g.toLowerCase().includes(text); }) ||
                    x.country.toLowerCase().includes(text) ||
                    x.type.toLowerCase().includes(text);
                var hitGenre = !genre || (x.genres || []).includes(genre);
                var hitCountry = !country || x.country === country;
                var hitAge = !age || x.age === age;
                var hitYear = x.year >= yMin && x.year <= yMax;
                var hitRating = x.rating >= rMin;
                return hitText && hitGenre && hitCountry && hitAge && hitYear && hitRating;
            });
            if (sort === "pop")
                list.sort(function (a, b) { return b.pop - a.pop; });
            if (sort === "rating")
                list.sort(function (a, b) { return b.rating - a.rating; });
            if (sort === "new")
                list.sort(function (a, b) { return b.year - a.year || b.pop - a.pop; });
            if (grid) {
                grid.innerHTML = "";
                list.forEach(function (x) { return grid.appendChild(makeCard(x, "grid")); });
            }
            if (count)
                count.textContent = "\u041D\u0430\u0439\u0434\u0435\u043D\u043E: ".concat(list.length);
        }
        function reset() {
            if (q)
                q.value = "";
            if (fGenre)
                fGenre.value = "";
            if (fCountry)
                fCountry.value = "";
            if (fAge)
                fAge.value = "";
            if (fSort)
                fSort.value = "pop";
            if (fYearMin)
                fYearMin.value = "";
            if (fYearMax)
                fYearMax.value = "";
            if (fRatingMin)
                fRatingMin.value = "";
            apply();
        }
        btnReset === null || btnReset === void 0 ? void 0 : btnReset.addEventListener("click", reset);
        q === null || q === void 0 ? void 0 : q.addEventListener("input", apply);
        apply();
    }
    //Начало_Обработчик формы каталога
    function handleCatalogSubmit(event, form) {
        var _a, _b, _c;
        event.preventDefault();
        var yearMin = (_a = form.elements.yearMin) === null || _a === void 0 ? void 0 : _a.value;
        var yearMax = (_b = form.elements.yearMax) === null || _b === void 0 ? void 0 : _b.value;
        var ratingMin = (_c = form.elements.ratingMin) === null || _c === void 0 ? void 0 : _c.value;
        var fail = "";
        if (yearMin && (yearMin < 1950 || yearMin > 2030)) {
            fail = "Год «от» должен быть от 1950 до 2030";
        }
        else if (yearMax && (yearMax < 1950 || yearMax > 2030)) {
            fail = "Год «до» должен быть от 1950 до 2030";
        }
        else if (yearMin && yearMax && Number(yearMin) > Number(yearMax)) {
            fail = "Год «от» не может быть больше года «до»";
        }
        else if (ratingMin && (ratingMin < 0 || ratingMin > 10)) {
            fail = "Рейтинг должен быть от 0 до 10";
        }
        var errorDiv = document.getElementById("error");
        if (fail !== "") {
            if (errorDiv)
                errorDiv.innerHTML = fail;
        }
        else {
            if (errorDiv)
                errorDiv.innerHTML = "";
            var q = getOne("#q");
            var fGenre = getOne("#fGenre");
            var fCountry = getOne("#fCountry");
            var fAge = getOne("#fAge");
            var fSort = getOne("#fSort");
            var fYearMin = getOne("#fYearMin");
            var fYearMax = getOne("#fYearMax");
            var fRatingMin = getOne("#fRatingMin");
            var grid_1 = getOne("#grid");
            var count = getOne("#count");
            var text_1 = ((q === null || q === void 0 ? void 0 : q.value) || "").trim().toLowerCase();
            var genre_1 = (fGenre === null || fGenre === void 0 ? void 0 : fGenre.value) || "";
            var country_1 = (fCountry === null || fCountry === void 0 ? void 0 : fCountry.value) || "";
            var age_1 = (fAge === null || fAge === void 0 ? void 0 : fAge.value) || "";
            var sort = (fSort === null || fSort === void 0 ? void 0 : fSort.value) || "pop";
            var yMin_1 = Number((fYearMin === null || fYearMin === void 0 ? void 0 : fYearMin.value) || 0);
            var yMax_1 = Number((fYearMax === null || fYearMax === void 0 ? void 0 : fYearMax.value) || 9999);
            var rMin_1 = Number((fRatingMin === null || fRatingMin === void 0 ? void 0 : fRatingMin.value) || 0);
            var list = DB.filter(function (x) {
                var hitText = !text_1 ||
                    x.title.toLowerCase().includes(text_1) ||
                    (x.genres || []).some(function (g) { return g.toLowerCase().includes(text_1); }) ||
                    x.country.toLowerCase().includes(text_1) ||
                    x.type.toLowerCase().includes(text_1);
                var hitGenre = !genre_1 || (x.genres || []).includes(genre_1);
                var hitCountry = !country_1 || x.country === country_1;
                var hitAge = !age_1 || x.age === age_1;
                var hitYear = x.year >= yMin_1 && x.year <= yMax_1;
                var hitRating = x.rating >= rMin_1;
                return hitText && hitGenre && hitCountry && hitAge && hitYear && hitRating;
            });
            if (sort === "pop")
                list.sort(function (a, b) { return b.pop - a.pop; });
            if (sort === "rating")
                list.sort(function (a, b) { return b.rating - a.rating; });
            if (sort === "new")
                list.sort(function (a, b) { return b.year - a.year || b.pop - a.pop; });
            if (grid_1) {
                grid_1.innerHTML = "";
                list.forEach(function (x) { return grid_1.appendChild(makeCard(x, "grid")); });
            }
            if (count)
                count.textContent = "\u041D\u0430\u0439\u0434\u0435\u043D\u043E: ".concat(list.length);
        }
    }
    //Конец обработчика форм.

    // ===== page: title (с поддержкой постера) =====
    function initTitle() {
        var _a;
        var id = qs("id");
        var item = byId(id);
        if (!item)
            return;
        getOne("#tTitle").textContent = item.title;
        getOne("#tMeta").textContent = metaLine(item);
        getOne("#tRating").textContent = Number(item.rating).toFixed(1);
        getOne("#tDesc").textContent = item.desc;
        var posterDiv = getOne("#tPoster");
        if (posterDiv && item.poster) {
            posterDiv.style.backgroundImage = "url('".concat(esc(item.poster), "')");
            posterDiv.style.backgroundSize = "cover";
            posterDiv.style.backgroundPosition = "center";
            posterDiv.style.display = "block";
        }
        else if (posterDiv) {
            posterDiv.style.display = "none";
        }
        var tags = getOne("#tTags");
        if (tags) {
            tags.innerHTML = "";
            (item.genres || []).forEach(function (g) {
                var s = document.createElement("span");
                s.className = "tag";
                s.textContent = g;
                tags.appendChild(s);
            });
            var s2 = document.createElement("span");
            s2.className = "tag";
            s2.textContent = item.type === "series" ? "Сериал" : "Фильм";
            tags.appendChild(s2);
        }
        var btnFav = getOne("#btnFav");
        var btnWL = getOne("#btnWL");
        var btnWatch = getOne("#btnWatch");
        function syncButtons() {
            btnFav.textContent = isFav(item.id) ? "❤ Убрать из избранного" : "❤ В избранное";
            btnWL.textContent = isWL(item.id) ? "🕒 Убрать из “Смотреть позже”" : "🕒 Смотреть позже";
        }
        syncButtons();
        btnFav === null || btnFav === void 0 ? void 0 : btnFav.addEventListener("click", function () { toggleFav(item.id); syncButtons(); });
        btnWL === null || btnWL === void 0 ? void 0 : btnWL.addEventListener("click", function () { toggleWL(item.id); syncButtons(); });
        var seasonsBox = getOne("#seasonsBox");
        var episodesBox = getOne("#episodesBox");
        var epHint = getOne("#epHint");
        var continueBtn = getOne("#btnContinueSeries");
        function onContinueSeries() {
            if (lastWatch && lastWatch.type === "series" && lastWatch.id === item.id) {
                location.href = "watch.html?id=".concat(encodeURIComponent(item.id), "&s=").concat(lastWatch.s, "&e=").concat(lastWatch.e);
            }
        }
        if (item.type === "series") {
            seasonsBox.style.display = "";
            episodesBox.style.display = "";
            epHint.style.display = "";
            var seasons_1 = item.seasons || [];
            var curSeason_1 = Number(qs("s") || ((_a = seasons_1[0]) === null || _a === void 0 ? void 0 : _a.season) || 1);
            var curEp_1 = Number(qs("e") || 1);
            function renderSeasons() {
                seasonsBox.innerHTML = "";
                seasons_1.forEach(function (s) {
                    var a = document.createElement("a");
                    a.href = "javascript:void(0)";
                    a.className = "pill" + (s.season === curSeason_1 ? " accent" : "");
                    a.textContent = "\u0421\u0435\u0437\u043E\u043D ".concat(s.season);
                    a.addEventListener("click", function () { curSeason_1 = s.season; curEp_1 = 1; renderSeasons(); renderEpisodes(); });
                    seasonsBox.appendChild(a);
                });
            }
            function renderEpisodes() {
                episodesBox.innerHTML = "";
                var seasonObj = seasons_1.find(function (s) { return s.season === curSeason_1; }) || seasons_1[0];
                ((seasonObj === null || seasonObj === void 0 ? void 0 : seasonObj.episodes) || []).forEach(function (ep) {
                    var key = "".concat(item.id, "|").concat(curSeason_1, "|").concat(ep.ep);
                    var t = progress[key] || 0;
                    var a = document.createElement("a");
                    a.href = "javascript:void(0)";
                    a.className = (ep.ep === curEp_1 ? "active" : "");
                    a.innerHTML = "<strong>\u0421".concat(curSeason_1, " \u2022 \u0421\u0435\u0440\u0438\u044F ").concat(ep.ep, ":</strong> ").concat(esc(ep.title), "\n                         <div class=\"small\">\u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C: ").concat(ep.duration, " \u043C\u0438\u043D \u2022 \u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441: ").concat(Math.floor(t), " \u0441\u0435\u043A</div>");
                    a.addEventListener("click", function () { curEp_1 = ep.ep; getAll(".list a", episodesBox).forEach(function (x) { return x.classList.remove("active"); }); a.classList.add("active"); });
                    episodesBox.appendChild(a);
                });
            }
            renderSeasons();
            renderEpisodes();
            btnWatch.addEventListener("click", function () {
                location.href = "watch.html?id=".concat(encodeURIComponent(item.id), "&s=").concat(curSeason_1, "&e=").concat(curEp_1);
            });
            if (continueBtn) {
                var can = lastWatch && lastWatch.type === "series" && lastWatch.id === item.id;
                continueBtn.style.display = can ? "" : "none";
                if (continueBtn._listener)
                    continueBtn.removeEventListener("click", continueBtn._listener);
                continueBtn._listener = onContinueSeries;
                continueBtn.addEventListener("click", continueBtn._listener);
            }
        }
        else {
            seasonsBox.style.display = "none";
            episodesBox.style.display = "none";
            epHint.style.display = "none";
            if (continueBtn) {
                continueBtn.style.display = "none";
                if (continueBtn._listener)
                    continueBtn.removeEventListener("click", continueBtn._listener);
                continueBtn._listener = null;
            }
            btnWatch === null || btnWatch === void 0 ? void 0 : btnWatch.addEventListener("click", function () { location.href = "watch.html?id=".concat(encodeURIComponent(item.id)); });
        }
    }

    // ===== КАСТОМНЫЙ ПЛЕЕР =====
    function initCustomPlayer(video, seekBar, playPauseBtn, stopBtn, rewindBtn, forwardBtn, currentTimeEl, durationEl, muteBtn, volumeSlider, fullscreenBtn, speedSelect) {
        if (!video)
            return;
        function formatTime(seconds) {
            if (isNaN(seconds))
                return "0:00";
            var h = Math.floor(seconds / 3600);
            var m = Math.floor((seconds % 3600) / 60);
            var s = Math.floor(seconds % 60);
            if (h > 0)
                return "".concat(h, ":").concat(m.toString().padStart(2, '0'), ":").concat(s.toString().padStart(2, '0'));
            return "".concat(m, ":").concat(s.toString().padStart(2, '0'));
        }
        function updateTime() {
            if (seekBar) {
                var percent = (video.currentTime / video.duration) * 100 || 0;
                seekBar.value = percent;
                var playedBar = document.querySelector('.progress-bar-played');
                if (playedBar)
                    playedBar.style.width = percent + '%';
            }
            if (currentTimeEl)
                currentTimeEl.textContent = formatTime(video.currentTime);
        }
        function updateBuffer() {
            if (video.buffered.length > 0) {
                var bufferedEnd = video.buffered.end(video.buffered.length - 1);
                var percent = (bufferedEnd / video.duration) * 100 || 0;
                var bufferBar = document.querySelector('.progress-bar-buffer');
                if (bufferBar)
                    bufferBar.style.width = percent + '%';
            }
        }
        video.addEventListener('loadedmetadata', function () {
            if (durationEl)
                durationEl.textContent = formatTime(video.duration);
            if (seekBar)
                seekBar.max = 100;
        });
        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('progress', updateBuffer);
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', function () {
                if (video.paused)
                    video.play();
                else
                    video.pause();
            });
            video.addEventListener('play', function () { playPauseBtn.textContent = '⏸'; });
            video.addEventListener('pause', function () { playPauseBtn.textContent = '▶'; });
        }
        if (stopBtn) {
            stopBtn.addEventListener('click', function () {
                video.pause();
                video.currentTime = 0;
            });
        }
        if (rewindBtn)
            rewindBtn.addEventListener('click', function () { video.currentTime -= 10; });
        if (forwardBtn)
            forwardBtn.addEventListener('click', function () { video.currentTime += 10; });
        if (seekBar) {
            seekBar.addEventListener('input', function () {
                var time = (seekBar.value / 100) * video.duration;
                video.currentTime = time;
            });
        }
        if (volumeSlider) {
            volumeSlider.addEventListener('input', function () {
                video.volume = volumeSlider.value;
                if (muteBtn)
                    muteBtn.textContent = video.volume === 0 ? '🔇' : '🔊';
            });
        }
        if (muteBtn) {
            muteBtn.addEventListener('click', function () {
                video.muted = !video.muted;
                muteBtn.textContent = video.muted ? '🔇' : '🔊';
                if (volumeSlider)
                    volumeSlider.value = video.muted ? 0 : video.volume;
            });
        }
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', function () {
                var container = video.closest('.video-container');
                if (!container)
                    return;
                if (document.fullscreenElement) {
                    if (document.exitFullscreen)
                        document.exitFullscreen();
                    else if (document.webkitExitFullscreen)
                        document.webkitExitFullscreen();
                    else if (document.msExitFullscreen)
                        document.msExitFullscreen();
                }
                else {
                    if (container.requestFullscreen)
                        container.requestFullscreen();
                    else if (container.webkitRequestFullscreen)
                        container.webkitRequestFullscreen();
                    else if (container.msRequestFullscreen)
                        container.msRequestFullscreen();
                }
            });
        }
        if (speedSelect) {
            speedSelect.addEventListener('change', function () {
                video.playbackRate = parseFloat(speedSelect.value);
            });
        }
        function handleKey(e) {
            if (e.target.matches('input, textarea, select, [contenteditable]'))
                return;
            if (!video)
                return;
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    if (video.paused)
                        video.play();
                    else
                        video.pause();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    video.currentTime -= 10;
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    video.currentTime += 10;
                    break;
                case 'Escape':
                    if (document.fullscreenElement) {
                        if (document.exitFullscreen)
                            document.exitFullscreen();
                    }
                    break;
            }
        }
        document.addEventListener('keydown', handleKey);
        return {
            updateTime: updateTime,
            destroy: function () {
                document.removeEventListener('keydown', handleKey);
            }
        };
    }

    // ===== page: watch =====
    function initWatch() {
        var _a;
        var id = qs("id");
        if (!id) {
            var empty = getOne("#watchEmpty");
            if (empty)
                empty.style.display = "";
            var panel = getOne("#watchPanel");
            if (panel)
                panel.style.display = "none";
            return;
        }
        var item = byId(id);
        if (!item)
            return;
        var video = getOne("#video");
        var titleEl = getOne("#wTitle");
        var metaEl = getOne("#wMeta");
        var ratingEl = getOne("#wRating");
        var descEl = getOne("#wDesc");
        titleEl.textContent = item.title;
        metaEl.textContent = metaLine(item);
        ratingEl.textContent = Number(item.rating).toFixed(1);
        descEl.textContent = item.desc;
        var btnSave = getOne("#btnSave");
        var btnStartOver = getOne("#btnStartOver");
        var btnFav = getOne("#btnFavFromPlayer");
        var btnWL = getOne("#btnWLFromPlayer");
        function syncButtons() {
            btnFav.textContent = isFav(item.id) ? "❤ Убрать из избранного" : "❤ В избранное";
            btnWL.textContent = isWL(item.id) ? "🕒 Убрать из “Смотреть позже”" : "🕒 Смотреть позже";
        }
        syncButtons();
        btnFav === null || btnFav === void 0 ? void 0 : btnFav.addEventListener("click", function () { toggleFav(item.id); syncButtons(); });
        btnWL === null || btnWL === void 0 ? void 0 : btnWL.addEventListener("click", function () { toggleWL(item.id); syncButtons(); });
        var key = item.id;
        var curSeason = null, curEp = null;
        var seekBar = getOne("#seekBar");
        var playPauseBtn = getOne("#playPauseBtn");
        var stopBtn = getOne("#stopBtn");
        var rewindBtn = getOne("#rewindBtn");
        var forwardBtn = getOne("#forwardBtn");
        var currentTimeEl = getOne("#currentTime");
        var durationEl = getOne("#duration");
        var muteBtn = getOne("#muteBtn");
        var volumeSlider = getOne("#volumeSlider");
        var fullscreenBtn = getOne("#fullscreenBtn");
        var speedSelect = getOne("#playbackSpeed");
        var episodeSelector = getOne("#episodeSelector");
        var prevSeasonBtn = getOne("#prevSeasonBtn");
        var nextSeasonBtn = getOne("#nextSeasonBtn");
        var seasonDisplay = getOne("#seasonDisplay");
        var prevEpisodeBtn = getOne("#prevEpisodeBtn");
        var nextEpisodeBtn = getOne("#nextEpisodeBtn");
        var episodeDisplay = getOne("#episodeDisplay");
        var playerControls = initCustomPlayer(video, seekBar, playPauseBtn, stopBtn, rewindBtn, forwardBtn, currentTimeEl, durationEl, muteBtn, volumeSlider, fullscreenBtn, speedSelect);
        var epPanel = getOne("#episodePanel");
        var seasonsBox = getOne("#wSeasons");
        var episodesBox = getOne("#wEpisodes");
        var epNow = getOne("#epNow");
        function setVideoSource(src) {
            var source = getOne("#source");
            if (src) {
                source.src = src;
                video.load();
                getOne("#noSrc").style.display = "none";
            }
            else {
                source.removeAttribute("src");
                video.load();
                getOne("#noSrc").style.display = "";
            }
        }
        function restoreVideoPosition(pos) {
            if (!pos)
                return;
            var onLoaded = function () {
                video.currentTime = pos;
                video.removeEventListener("loadedmetadata", onLoaded);
            };
            video.addEventListener("loadedmetadata", onLoaded);
            if (video.readyState >= 1)
                video.currentTime = pos;
        }
        function updateEpisodeSelector() {
            if (item.type !== "series")
                return;
            var seasons = item.seasons || [];
            var currentSeasonObj = seasons.find(function (s) { return s.season === curSeason; });
            var totalEpisodes = (currentSeasonObj === null || currentSeasonObj === void 0 ? void 0 : currentSeasonObj.episodes.length) || 0;
            if (seasonDisplay)
                seasonDisplay.textContent = "\u0421\u0435\u0437\u043E\u043D ".concat(curSeason);
            if (episodeDisplay)
                episodeDisplay.textContent = "\u0421\u0435\u0440\u0438\u044F ".concat(curEp, " / ").concat(totalEpisodes);
            if (prevSeasonBtn) {
                var hasPrevSeason = seasons.some(function (s) { return s.season === curSeason - 1; });
                prevSeasonBtn.disabled = !hasPrevSeason;
            }
            if (nextSeasonBtn) {
                var hasNextSeason = seasons.some(function (s) { return s.season === curSeason + 1; });
                nextSeasonBtn.disabled = !hasNextSeason;
            }
            if (prevEpisodeBtn)
                prevEpisodeBtn.disabled = curEp <= 1;
            if (nextEpisodeBtn)
                nextEpisodeBtn.disabled = curEp >= totalEpisodes;
        }
        function selectEpisode(s, e, updateUrl) {
            if (updateUrl === void 0) { updateUrl = true; }
            if (item.type !== "series")
                return;
            key = "".concat(item.id, "|").concat(s, "|").concat(e);
            var ep = getEpisode(s, e);
            epNow.textContent = ep ? "\u0421\u0435\u0437\u043E\u043D ".concat(s, ", \u0441\u0435\u0440\u0438\u044F ").concat(e, ": ").concat(ep.title) : "\u0421\u0435\u0437\u043E\u043D ".concat(s, ", \u0441\u0435\u0440\u0438\u044F ").concat(e);
            var src = (ep === null || ep === void 0 ? void 0 : ep.src) || null;
            setVideoSource(src);
            video.dataset.progressKey = key;
            var t = Number(progress[key] || 0);
            restoreVideoPosition(t);
            lastWatch = { type: "series", id: item.id, s: s, e: e, key: key };
            save(LS.last, lastWatch);
            pushHistory(key);
            if (updateUrl) {
                var u = new URL(location.href);
                u.searchParams.set("s", String(s));
                u.searchParams.set("e", String(e));
                history.replaceState(null, "", u.toString());
            }
            getAll(".list a", episodesBox).forEach(function (x) { return x.classList.remove("active"); });
            var activeLink = Array.from(episodesBox.children).find(function (a) {
                var html = a.innerHTML;
                return html.includes("\u0421\u0435\u0440\u0438\u044F ".concat(e, ":</strong>")) && a.innerHTML.includes("\u0421".concat(s, " \u2022"));
            });
            if (activeLink)
                activeLink.classList.add("active");
            updateEpisodeSelector();
        }
        function getEpisode(s, e) {
            if (item.type !== "series")
                return null;
            var sObj = (item.seasons || []).find(function (x) { return x.season === s; });
            return ((sObj === null || sObj === void 0 ? void 0 : sObj.episodes) || []).find(function (x) { return x.ep === e; }) || null;
        }
        if (item.type === "series") {
            epPanel.style.display = "";
            var seasons_2 = item.seasons || [];
            curSeason = Number(qs("s") || ((_a = seasons_2[0]) === null || _a === void 0 ? void 0 : _a.season) || 1);
            curEp = Number(qs("e") || 1);
            if (episodeSelector)
                episodeSelector.style.display = "flex";
            function renderSeasons() {
                seasonsBox.innerHTML = "";
                seasons_2.forEach(function (s) {
                    var a = document.createElement("a");
                    a.href = "javascript:void(0)";
                    a.className = "pill" + (s.season === curSeason ? " accent" : "");
                    a.textContent = "\u0421\u0435\u0437\u043E\u043D ".concat(s.season);
                    a.addEventListener("click", function () {
                        curSeason = s.season;
                        curEp = 1;
                        renderSeasons();
                        renderEpisodes();
                        selectEpisode(curSeason, curEp, true);
                    });
                    seasonsBox.appendChild(a);
                });
            }
            function renderEpisodes() {
                episodesBox.innerHTML = "";
                var sObj = seasons_2.find(function (s) { return s.season === curSeason; }) || seasons_2[0];
                ((sObj === null || sObj === void 0 ? void 0 : sObj.episodes) || []).forEach(function (ep) {
                    var a = document.createElement("a");
                    a.href = "javascript:void(0)";
                    a.className = (ep.ep === curEp ? "active" : "");
                    var k = "".concat(item.id, "|").concat(curSeason, "|").concat(ep.ep);
                    var t = progress[k] || 0;
                    a.innerHTML = "<strong>\u0421".concat(curSeason, " \u2022 \u0421\u0435\u0440\u0438\u044F ").concat(ep.ep, ":</strong> ").concat(esc(ep.title), "\n                         <div class=\"small\">\u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C: ").concat(ep.duration, " \u043C\u0438\u043D \u2022 \u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441: ").concat(Math.floor(t), " \u0441\u0435\u043A</div>");
                    a.addEventListener("click", function () {
                        curEp = ep.ep;
                        selectEpisode(curSeason, curEp, true);
                        getAll(".list a", episodesBox).forEach(function (x) { return x.classList.remove("active"); });
                        a.classList.add("active");
                    });
                    episodesBox.appendChild(a);
                });
            }
            renderSeasons();
            renderEpisodes();
            selectEpisode(curSeason, curEp, false);
            if (prevSeasonBtn) {
                prevSeasonBtn.addEventListener("click", function () {
                    var newSeason = curSeason - 1;
                    var seasons = item.seasons || [];
                    if (seasons.some(function (s) { return s.season === newSeason; })) {
                        curSeason = newSeason;
                        curEp = 1;
                        renderSeasons();
                        renderEpisodes();
                        selectEpisode(curSeason, curEp, true);
                    }
                });
            }
            if (nextSeasonBtn) {
                nextSeasonBtn.addEventListener("click", function () {
                    var newSeason = curSeason + 1;
                    var seasons = item.seasons || [];
                    if (seasons.some(function (s) { return s.season === newSeason; })) {
                        curSeason = newSeason;
                        curEp = 1;
                        renderSeasons();
                        renderEpisodes();
                        selectEpisode(curSeason, curEp, true);
                    }
                });
            }
            if (prevEpisodeBtn) {
                prevEpisodeBtn.addEventListener("click", function () {
                    if (curEp > 1) {
                        curEp--;
                        selectEpisode(curSeason, curEp, true);
                        renderEpisodes();
                    }
                });
            }
            if (nextEpisodeBtn) {
                nextEpisodeBtn.addEventListener("click", function () {
                    var sObj = (item.seasons || []).find(function (s) { return s.season === curSeason; });
                    var maxEp = (sObj === null || sObj === void 0 ? void 0 : sObj.episodes.length) || 0;
                    if (curEp < maxEp) {
                        curEp++;
                        selectEpisode(curSeason, curEp, true);
                        renderEpisodes();
                    }
                });
            }
            updateEpisodeSelector();
        }
        else {
            epPanel.style.display = "none";
            if (episodeSelector)
                episodeSelector.style.display = "none";
            key = item.id;
            setVideoSource(item.src || null);
            video.dataset.progressKey = key;
            var t = Number(progress[key] || 0);
            restoreVideoPosition(t);
            lastWatch = { type: "movie", id: item.id, key: item.id };
            save(LS.last, lastWatch);
            pushHistory(key);
        }
        function pushHistory(k) {
            history = __spreadArray([k], history.filter(function (x) { return x !== k; }), true).slice(0, 12);
            save(LS.hist, history);
        }
        var lastSavedAt = 0;
        video.addEventListener("timeupdate", function () {
            var now = Date.now();
            if (now - lastSavedAt < 1200)
                return;
            lastSavedAt = now;
            progress[key] = Number(video.currentTime || 0);
            save(LS.prog, progress);
            if (item.type === "series") {
                var active = getOne(".list a.active", getOne("#wEpisodes"));
                if (active) {
                    var small = active.querySelector(".small");
                    if (small)
                        small.textContent = small.textContent.replace(/Прогресс:.*сек/, "\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441: ".concat(Math.floor(progress[key]), " \u0441\u0435\u043A"));
                }
            }
        });
        btnSave === null || btnSave === void 0 ? void 0 : btnSave.addEventListener("click", function () {
            progress[key] = Number(video.currentTime || 0);
            save(LS.prog, progress);
            alert("Прогресс сохранён!");
        });
        btnStartOver === null || btnStartOver === void 0 ? void 0 : btnStartOver.addEventListener("click", function () {
            progress[key] = 0;
            save(LS.prog, progress);
            try {
                video.currentTime = 0;
            }
            catch (_a) { }
            alert("Сброшено на начало.");
        });
    }

    // ===== НОВАЯ СТРАНИЦА "МАГИЯ" (Гарри Поттер) =====
    function initMagic() {
        var grid = getOne("#magicGrid");
        if (!grid)
            return;
        var hpMovies = DB.filter(function (item) { return item.id.startsWith("hp"); })
            .sort(function (a, b) { return a.year - b.year; });
        hpMovies.forEach(function (movie) {
            var card = document.createElement("div");
            card.className = "magic-card";
            card.setAttribute("role", "button");
            card.tabIndex = 0;
            var posterStyle = movie.poster
                ? "background-image: url('".concat(esc(movie.poster), "');")
                : "background: linear-gradient(145deg, #2e1b3c, #1a1025);";
            card.innerHTML = "\n        <div class=\"magic-poster\" style=\"".concat(posterStyle, "\">\n          <span class=\"magic-badge\">\u26A1</span>\n        </div>\n        <div class=\"magic-title\">").concat(esc(movie.title), "</div>\n        <div class=\"magic-year\">").concat(movie.year, " \u2022 ").concat(movie.duration, " \u043C\u0438\u043D</div>\n      ");
            card.addEventListener("click", function () {
                location.href = "title.html?id=".concat(encodeURIComponent(movie.id));
            });
            card.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    location.href = "title.html?id=".concat(encodeURIComponent(movie.id));
                }
            });
            grid.appendChild(card);
        });
    }

    // ===== СТРАНИЦА ТВ =====
    function initTV() {
        var grid = getOne("#tvGrid");
        var catBtns = getAll(".tv-cat-btn");
        var currentCategory = "all";
        var categoryNames = {
            federal: "Федеральный",
            entertainment: "Развлекательный",
            educational: "Познавательный",
            kids: "Детский",
            news: "Новостной",
            sports: "Спортивный"
        };
        function renderChannels(cat) {
            var filtered = cat === "all" ? CHANNELS : CHANNELS.filter(function (c) { return c.category === cat; });
            grid.innerHTML = "";
            if (filtered.length === 0) {
                grid.innerHTML = "<div class=\"empty-message\" style=\"grid-column:1/-1;\">\u041A\u0430\u043D\u0430\u043B\u044B \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B</div>";
                return;
            }
            filtered.forEach(function (ch) {
                var card = document.createElement("div");
                card.className = "channel-card";
                card.dataset.id = ch.id;
                var logoStyle = ch.logo ? "background-image: url('".concat(esc(ch.logo), "');") : "";
                var now = new Date();
                var currentHour = now.getHours();
                var currentMinute = now.getMinutes();
                var currentTimeStr = "".concat(String(currentHour).padStart(2, '0'), ":").concat(String(currentMinute).padStart(2, '0'));
                var currentProgram = null;
                for (var i = 0; i < ch.schedule.length; i++) {
                    var prog = ch.schedule[i];
                    var nextProg = ch.schedule[i + 1];
                    var progTime = prog.time;
                    if (nextProg) {
                        if (currentTimeStr >= progTime && currentTimeStr < nextProg.time) {
                            currentProgram = prog;
                            break;
                        }
                    }
                    else {
                        if (currentTimeStr >= progTime) {
                            currentProgram = prog;
                            break;
                        }
                    }
                }
                if (!currentProgram && ch.schedule.length > 0) {
                    currentProgram = ch.schedule[0];
                }
                var nowTitle = currentProgram ? currentProgram.title : "Нет данных";
                card.innerHTML = "\n          <div class=\"channel-logo\" style=\"".concat(logoStyle, "\"></div>\n          <div class=\"channel-name\">").concat(esc(ch.name), "</div>\n          <div class=\"channel-now\">\u0421\u0435\u0439\u0447\u0430\u0441: ").concat(esc(nowTitle), "</div>\n        ");
                card.addEventListener("click", function () {
                    location.href = "channel.html?id=".concat(encodeURIComponent(ch.id));
                });
                grid.appendChild(card);
            });
        }
        catBtns.forEach(function (btn) {
            btn.addEventListener("click", function () {
                var cat = btn.dataset.cat;
                currentCategory = cat;
                catBtns.forEach(function (b) { return b.classList.remove("active"); });
                btn.classList.add("active");
                renderChannels(cat);
            });
        });
        renderChannels("all");
    }

    // ===== СТРАНИЦА ПРОСМОТРА КАНАЛА =====
    function initChannel() {
        var id = qs("id");
        var channel = CHANNELS.find(function (c) { return c.id === id; });
        if (!channel) {
            getOne("#notFound").style.display = "block";
            return;
        }
        getOne("#channelContainer").style.display = "block";
        var categoryNames = {
            federal: "Федеральный",
            entertainment: "Развлекательный",
            educational: "Познавательный",
            kids: "Детский",
            news: "Новостной",
            sports: "Спортивный"
        };
        getOne("#channelName").textContent = channel.name;
        getOne("#channelCategory").textContent = categoryNames[channel.category] || channel.category;
        if (channel.logo) {
            getOne("#channelLogo").style.backgroundImage = "url('".concat(esc(channel.logo), "')");
        }
        var tabs = getAll(".channel-tab");
        var content = getOne("#tabContent");
        var currentTab = "live";
        function renderTab(tab) {
            content.innerHTML = "";
            var now = new Date();
            var currentHour = now.getHours();
            var currentMinute = now.getMinutes();
            var currentTimeStr = "".concat(String(currentHour).padStart(2, '0'), ":").concat(String(currentMinute).padStart(2, '0'));
            if (tab === "live") {
                if (channel.streamIframe) {
                    var wrapper = document.createElement("div");
                    wrapper.className = "live-player-container";
                    wrapper.innerHTML = channel.streamIframe;
                    content.appendChild(wrapper);
                    if (channel.programUrl) {
                        var link = document.createElement("a");
                        link.href = channel.programUrl;
                        link.target = "_blank";
                        link.className = "pill";
                        link.style.marginTop = "12px";
                        link.textContent = channel.programLabel || "📋 Полная программа на tv.mail.ru";
                        content.appendChild(link);
                    }
                }
                else {
                    content.innerHTML = "<div class=\"empty-message\">\u041F\u0440\u044F\u043C\u043E\u0439 \u044D\u0444\u0438\u0440 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u0434\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u043A\u0430\u043D\u0430\u043B\u0430</div>";
                }
            }
            else if (tab === "today") {
                var schedule_1 = channel.schedule || [];
                if (schedule_1.length === 0) {
                    content.innerHTML = "<div class=\"empty-message\">\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442</div>";
                    return;
                }
                schedule_1.forEach(function (prog, i) {
                    var item = document.createElement("div");
                    item.className = "program-item";
                    var next = schedule_1[i + 1];
                    var isCurrent = false;
                    if (next) {
                        if (currentTimeStr >= prog.time && currentTimeStr < next.time)
                            isCurrent = true;
                    }
                    else {
                        if (currentTimeStr >= prog.time)
                            isCurrent = true;
                    }
                    if (isCurrent)
                        item.classList.add("current");
                    item.innerHTML = "<span class=\"program-time\">".concat(esc(prog.time), "</span><span class=\"program-title\">").concat(esc(prog.title), "</span>");
                    content.appendChild(item);
                });
            }
            else if (tab === "archive") {
                var archive = channel.archive || [];
                if (archive.length === 0) {
                    content.innerHTML = "<div class=\"empty-message\">\u0410\u0440\u0445\u0438\u0432\u043D\u044B\u0445 \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442</div>";
                    return;
                }
                var sorted = __spreadArray([], archive, true).sort(function (a, b) {
                    if (a.date < b.date)
                        return 1;
                    if (a.date > b.date)
                        return -1;
                    return a.time.localeCompare(b.time);
                });
                sorted.forEach(function (rec) {
                    var item = document.createElement("div");
                    item.className = "program-item past";
                    item.innerHTML = "<span class=\"program-time\">".concat(esc(rec.date), " ").concat(esc(rec.time), "</span><span class=\"program-title\">").concat(esc(rec.title), "</span><span class=\"archive-badge\">\u0430\u0440\u0445\u0438\u0432</span>");
                    content.appendChild(item);
                });
            }
        }
        tabs.forEach(function (tab) {
            tab.addEventListener("click", function () {
                tabs.forEach(function (t) { return t.classList.remove("active"); });
                tab.classList.add("active");
                currentTab = tab.dataset.tab;
                renderTab(currentTab);
            });
        });
        if (!channel.streamIframe) {
            var liveTab = getOne('.channel-tab[data-tab="live"]');
            if (liveTab)
                liveTab.style.display = "none";
            if (currentTab === "live") {
                var todayTab = getOne('.channel-tab[data-tab="today"]');
                if (todayTab) {
                    todayTab.click();
                }
                else {
                    renderTab("today");
                }
            }
            else {
                renderTab(currentTab);
            }
        }
        else {
            renderTab("live");
        }
    }

    // ===== НОВАЯ СТРАНИЦА "КОЛЛЕКЦИЯ" (плейлисты) – ИСПРАВЛЕННАЯ =====
    function initCollection() {
        // DOM-элементы
        var listView = document.getElementById("playlistListView");
        var detailView = document.getElementById("playlistDetailView");
        var grid = document.getElementById("playlistGrid");
        var videoGrid = document.getElementById("videoGrid");
        var playlistTitle = document.getElementById("playlistTitle");
        var btnCreate = document.getElementById("btnCreatePlaylist");
        var btnBack = document.getElementById("btnBackToList");
        var btnAddVideo = document.getElementById("btnAddVideo");
        var btnDeletePlaylist = document.getElementById("btnDeletePlaylist");
        var modalOverlay = document.getElementById("modalOverlay");
        var modalClose = document.getElementById("modalClose");
        var modalCancel = document.getElementById("modalCancel");
        var modalForm = document.getElementById("modalForm");
        var modalTitle = document.getElementById("modalTitle");
        var modalLabel1 = document.getElementById("modalLabel1");
        var modalInput1 = document.getElementById("modalInput1");
        var modalField2 = document.getElementById("modalField2");
        var modalLabel2 = document.getElementById("modalLabel2");
        var modalInput2 = document.getElementById("modalInput2");
        var modalSubmit = document.getElementById("modalSubmit");
        var modalError = document.getElementById("modalError");

        var currentPlaylistId = null;

        function savePlaylists() {
            save(LS.playlists, playlists);
        }

        function generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        }

        function renderPlaylists() {
            grid.innerHTML = "";
            if (playlists.length === 0) {
                grid.innerHTML = '<div class="empty-message">У вас пока нет плейлистов. Создайте первый!</div>';
                return;
            }
            playlists.forEach(function (pl) {
                var card = document.createElement("div");
                card.className = "playlist-card";
                card.innerHTML = "\n                    <div class=\"playlist-name\">".concat(esc(pl.name), "</div>\n                    <div class=\"playlist-count\">").concat(pl.videos.length, " \u0432\u0438\u0434\u0435\u043E</div>\n                ");
                card.addEventListener("click", function () {
                    openPlaylist(pl.id);
                });
                grid.appendChild(card);
            });
        }

        function openPlaylist(id) {
            var pl = playlists.find(function (p) { return p.id === id; });
            if (!pl) return;
            currentPlaylistId = id;
            listView.style.display = "none";
            detailView.style.display = "block";
            playlistTitle.textContent = pl.name;
            renderVideos(pl);
        }

        function renderVideos(pl) {
            videoGrid.innerHTML = "";
            if (pl.videos.length === 0) {
                videoGrid.innerHTML = '<div class="empty-message">В этом плейлисте пока нет видео. Добавьте первое!</div>';
                return;
            }
            pl.videos.forEach(function (v, index) {
                var card = document.createElement("div");
                card.className = "video-card";
                var number = index + 1;
                card.innerHTML = "\n                    <div class=\"video-info\">\n                        <div class=\"video-title\"><a href=\"".concat(esc(v.url), "\" target=\"_blank\" rel=\"noopener noreferrer\">").concat(esc(v.title || "\u0412\u0438\u0434\u0435\u043E #" + number), "</a></div>\n                        <div class=\"video-url small\">").concat(esc(v.url), "</div>\n                    </div>\n                    <button class=\"video-remove\" data-video-id=\"").concat(v.id, "\" title=\"\u0423\u0434\u0430\u043B\u0438\u0442\u044C\">&times;</button>\n                ");
                var removeBtn = card.querySelector(".video-remove");
                removeBtn.addEventListener("click", function (e) {
                    e.stopPropagation();
                    removeVideo(pl.id, v.id);
                });
                videoGrid.appendChild(card);
            });
        }

        function removeVideo(playlistId, videoId) {
            var pl = playlists.find(function (p) { return p.id === playlistId; });
            if (!pl) return;
            if (!confirm("Удалить видео \"" + (pl.videos.find(function (v) { return v.id === videoId; })?.title || '') + "\"?")) return;
            pl.videos = pl.videos.filter(function (v) { return v.id !== videoId; });
            savePlaylists();
            var updated = playlists.find(function (p) { return p.id === playlistId; });
            if (updated) renderVideos(updated);
        }

        function backToList() {
            currentPlaylistId = null;
            detailView.style.display = "none";
            listView.style.display = "block";
            renderPlaylists();
        }

        // ===== ИСПРАВЛЕННАЯ ФУНКЦИЯ ОТКРЫТИЯ МОДАЛКИ =====
        function openModal(mode, data) {
            modalOverlay.style.display = "flex";
            modalError.textContent = "";
            modalForm.reset();
            // Явно устанавливаем режим
            modalForm.dataset.mode = mode;
            if (mode === "create") {
                modalTitle.textContent = "Создать плейлист";
                modalLabel1.textContent = "Название плейлиста";
                modalInput1.placeholder = "Введите название";
                modalSubmit.textContent = "Создать";
                modalInput1.required = true;
                modalInput1.type = "text";
                modalField2.style.display = "none";
                modalInput2.required = false;
            } else if (mode === "add") {
                modalTitle.textContent = "Добавить видео в плейлист";
                modalLabel1.textContent = "Название видео";
                modalInput1.placeholder = "Введите название (опционально)";
                modalInput1.required = false;
                modalInput1.type = "text";
                modalField2.style.display = "block";
                modalLabel2.textContent = "Ссылка на видео";
                modalInput2.placeholder = "https://rutube.ru/video/...";
                modalInput2.required = true;
                modalSubmit.textContent = "Добавить";
                // Проверяем, что есть открытый плейлист
                if (!currentPlaylistId) {
                    modalError.textContent = "Ошибка: не выбран плейлист. Закройте и откройте заново.";
                    setTimeout(closeModal, 1500);
                    return;
                }
            }
        }

        function closeModal() {
            modalOverlay.style.display = "none";
        }

        // ===== ИСПРАВЛЕННЫЙ ОБРАБОТЧИК ОТПРАВКИ =====
        modalForm.addEventListener("submit", function (e) {
            e.preventDefault();
            var mode = modalForm.dataset.mode;
            modalError.textContent = "";

            if (mode === "create") {
                var name_1 = modalInput1.value.trim();
                if (!name_1) {
                    modalError.textContent = "Введите название плейлиста";
                    return;
                }
                var newPlaylist = {
                    id: generateId(),
                    name: name_1,
                    videos: []
                };
                playlists.push(newPlaylist);
                savePlaylists();
                closeModal();
                renderPlaylists();
            } else if (mode === "add") {
                // Проверяем, что есть открытый плейлист
                if (!currentPlaylistId) {
                    modalError.textContent = "Ошибка: не выбран плейлист. Попробуйте ещё раз.";
                    return;
                }
                var title = modalInput1.value.trim() || "Видео";
                var url = modalInput2.value.trim();
                if (!url) {
                    modalError.textContent = "Введите ссылку на видео";
                    return;
                }
                // Простая проверка URL
                try {
                    new URL(url);
                } catch (_) {
                    modalError.textContent = "Введите корректный URL (начинается с http:// или https://)";
                    return;
                }
                var pl = playlists.find(function (p) { return p.id === currentPlaylistId; });
                if (!pl) {
                    modalError.textContent = "Плейлист не найден. Возможно, он был удалён.";
                    return;
                }
                pl.videos.push({
                    id: generateId(),
                    title: title,
                    url: url
                });
                savePlaylists();
                closeModal();
                // Перерендерим видео
                var updated = playlists.find(function (p) { return p.id === currentPlaylistId; });
                if (updated) renderVideos(updated);
            } else {
                modalError.textContent = "Неизвестный режим";
            }
        });

        // События
        btnCreate.addEventListener("click", function () { openModal("create"); });
        btnAddVideo.addEventListener("click", function () { 
            if (!currentPlaylistId) {
                alert("Сначала откройте плейлист, в который хотите добавить видео.");
                return;
            }
            openModal("add"); 
        });
        btnBack.addEventListener("click", backToList);
        btnDeletePlaylist.addEventListener("click", function () {
            if (!currentPlaylistId) return;
            var pl = playlists.find(function (p) { return p.id === currentPlaylistId; });
            if (!pl) return;
            if (!confirm("Удалить плейлист \"" + pl.name + "\" и все его видео?")) return;
            playlists = playlists.filter(function (p) { return p.id !== currentPlaylistId; });
            savePlaylists();
            backToList();
        });

        modalClose.addEventListener("click", closeModal);
        modalCancel.addEventListener("click", closeModal);
        modalOverlay.addEventListener("click", function (e) {
            if (e.target === modalOverlay) closeModal();
        });

        renderPlaylists();

        // Если есть параметр ?playlist=id, открыть сразу
        var playlistParam = qs("playlist");
        if (playlistParam) {
            var found = playlists.some(function (p) { return p.id === playlistParam; });
            if (found) {
                openPlaylist(playlistParam);
            }
        }
    }

    // ===== ПРОФИЛЬ =====
    function initProfile() {
        getOne("#pAvatar").textContent = ((profile === null || profile === void 0 ? void 0 : profile.name) || "Г")[0].toUpperCase();
        getOne("#pName").textContent = (profile === null || profile === void 0 ? void 0 : profile.name) || "Гость";
        var favCount = getOne("#favCount");
        var wlCount = getOne("#wlCount");
        var contList = getOne("#continueList");
        var favList = getOne("#favList");
        var wlList = getOne("#wlList");
        favCount.textContent = String(favorites.length);
        wlCount.textContent = String(watchlater.length);
        if (contList) {
            if (!lastWatch)
                contList.innerHTML = "<div class=\"small\">\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u043E\u0433\u043E \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430.</div>";
            else {
                var item = byId(lastWatch.id);
                if (!item)
                    contList.innerHTML = "<div class=\"small\">\u0421\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0439 \u043A\u043E\u043D\u0442\u0435\u043D\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.</div>";
                else {
                    var link = (lastWatch.type === "movie")
                        ? "watch.html?id=".concat(encodeURIComponent(lastWatch.id))
                        : "watch.html?id=".concat(encodeURIComponent(lastWatch.id), "&s=").concat(lastWatch.s, "&e=").concat(lastWatch.e);
                    var text = (lastWatch.type === "movie") ? "".concat(item.title) : "".concat(item.title, " \u2022 \u0421\u0435\u0437\u043E\u043D ").concat(lastWatch.s, ", \u0441\u0435\u0440\u0438\u044F ").concat(lastWatch.e);
                    contList.innerHTML = "<a href=\"".concat(link, "\"><strong>\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C:</strong> ").concat(esc(text), "</a>");
                }
            }
        }
        function listOf(ids) {
            return ids.map(byId).filter(Boolean)
                .map(function (x) { return "<a href=\"title.html?id=".concat(encodeURIComponent(x.id), "\">").concat(esc(x.title), " <span class=\"small\">(").concat(x.year, ")</span></a>"); })
                .join("");
        }
        favList.innerHTML = favorites.length ? listOf(favorites) : "<div class=\"small\">\u041F\u0443\u0441\u0442\u043E.</div>";
        wlList.innerHTML = watchlater.length ? listOf(watchlater) : "<div class=\"small\">\u041F\u0443\u0441\u0442\u043E.</div>";
        var inp = getOne("#inpName");
        inp.value = (profile === null || profile === void 0 ? void 0 : profile.name) || "Гость";

        // Панель нескольких профилей и переноса в другой браузер.
        var grid = getOne(".panel-body .grid");
        if (grid && !getOne("#profileManager")) {
            var manager = document.createElement("div");
            manager.id = "profileManager";
            manager.className = "panel";
            manager.style.gridColumn = "span 12";
            manager.innerHTML = '<div class="panel-head"><strong>Профили и перенос данных</strong></div>' +
                '<div class="panel-body">' +
                '<div class="profile-manager-grid">' +
                '<div class="field"><label for="profileSelect">Активный профиль</label><select id="profileSelect"></select></div>' +
                '<div class="field"><label for="newProfileName">Новый профиль</label><input id="newProfileName" type="text" maxlength="30" placeholder="Имя профиля"></div>' +
                '</div>' +
                '<div class="row" style="margin-top:12px">' +
                '<button class="pill accent" id="btnCreateProfile" type="button">➕ Создать</button>' +
                '<button class="pill" id="btnCopyProfileCode" type="button">📋 Копировать код профиля</button>' +
                '<button class="pill" id="btnImportProfile" type="button">📥 Импортировать код</button>' +
                '<button class="pill danger" id="btnDeleteProfile" type="button">🗑 Удалить профиль</button>' +
                '</div>' +
                '<div class="small" style="margin-top:10px">Код содержит имя, избранное, «смотреть позже», прогресс просмотров, историю и плейлисты. В другом браузере откройте страницу профиля и импортируйте код.</div>' +
                '<textarea id="profileCode" rows="4" placeholder="Здесь появится код или вставьте сюда код из другого браузера" style="width:100%;margin-top:10px"></textarea>' +
                '</div>';
            grid.appendChild(manager);
            var select = getOne("#profileSelect");
            profiles.forEach(function (p) {
                var option = document.createElement("option");
                option.value = p.id;
                option.textContent = p.name || "Гость";
                option.selected = p.id === activeProfileId;
                select.appendChild(option);
            });
            select.addEventListener("change", function () { return switchProfile(select.value); });
            getOne("#btnCreateProfile").addEventListener("click", function () {
                var name = (getOne("#newProfileName").value || "").trim();
                if (!name) return alert("Введите имя нового профиля.");
                if (/[<>'\"]/.test(name)) return alert("Имя содержит недопустимые символы.");
                createProfile(name);
            });
            getOne("#btnCopyProfileCode").addEventListener("click", function () {
                persistActiveProfile();
                var record = profiles.find(function (p) { return p.id === activeProfileId; });
                var code = encodeProfile(record);
                var area = getOne("#profileCode");
                area.value = code;
                area.select();
                if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(code).then(function () { alert("Код профиля скопирован."); }).catch(function () {});
                else document.execCommand("copy");
            });
            getOne("#btnImportProfile").addEventListener("click", function () {
                var area = getOne("#profileCode");
                try {
                    var imported = decodeProfile(area.value);
                    imported.id = makeId();
                    imported.name = (imported.name || "Импортированный профиль") + (profiles.some(function (p) { return p.name === imported.name; }) ? " (копия)" : "");
                    imported.updatedAt = new Date().toISOString();
                    imported.createdAt = imported.createdAt || imported.updatedAt;
                    profiles.push(imported);
                    rawSave(LS.profiles, profiles);
                    localStorage.setItem(LS.activeProfile, imported.id);
                    alert("Профиль импортирован.");
                    location.reload();
                } catch (e) { alert("Не удалось импортировать профиль: неверный или повреждённый код."); }
            });
            getOne("#btnDeleteProfile").addEventListener("click", deleteCurrentProfile);
        }
    }

    function handleProfileSubmit(event, form) {
        var _a;
        event.preventDefault();
        var username = (_a = form.elements.username) === null || _a === void 0 ? void 0 : _a.value.trim();
        var fail = "";
        if (username === "") {
            fail = "Имя не может быть пустым";
        }
        else if (username.length > 30) {
            fail = "Имя не должно превышать 30 символов";
        }
        else if (/[<>'"]/.test(username)) {
            fail = "Имя не должно содержать символы < > ' \"";
        }
        var errorDiv = document.getElementById("error");
        if (fail !== "") {
            if (errorDiv)
                errorDiv.innerHTML = fail;
        }
        else {
            if (errorDiv)
                errorDiv.innerHTML = "";
            profile = __assign(__assign({}, profile), { name: username });
            save(LS.profile, profile);
            alert("Профиль сохранён!");
            location.reload();
        }
    }

    // ===== ИНИЦИАЛИЗАЦИЯ =====
    document.addEventListener("DOMContentLoaded", function () {
        setActiveNav();
        var page = document.body.dataset.page;
        if (page === "home")
            initHome();
        if (page === "catalog") {
            initCatalog();
            var form_1 = document.getElementById("filterForm");
            if (form_1) {
                form_1.addEventListener("submit", function (e) { return handleCatalogSubmit(e, form_1); });
            }
        }
        if (page === "title")
            initTitle();
        if (page === "watch")
            initWatch();
        if (page === "profile") {
            initProfile();
            var form_2 = document.getElementById("profileForm");
            if (form_2) {
                form_2.addEventListener("submit", function (e) { return handleProfileSubmit(e, form_2); });
            }
            var resetBtn = document.getElementById("btnResetAll");
            if (resetBtn)
                resetBtn.addEventListener("click", function () { return resetAllData(true); });
        }
        if (page === "magic")
            initMagic();
        if (page === "tv")
            initTV();
        if (page === "channel")
            initChannel();
        if (page === "collection")
            initCollection();
    });
})();