// Global Variables
let requestInfo = new XMLHttpRequest();
requestInfo.open("GET", "db/database.json", false);
requestInfo.send(null);
let info = JSON.parse(requestInfo.responseText);
let articles = [];
for (let [key, value] of Object.entries(info.articles)) {
    articles.push(...value);
}
articles = articles.sort((a, b) => {
    return b.timestamp - a.timestamp;
});


let darkMode = false;
if (getStorage('darkMode') !== null) {
    if (getStorage('darkMode') === 'true') {
        darkMode = true;
    }
} else {
    darkMode = matchMedia("(prefers-color-scheme: dark)").matches || false;
}

let navFilter = "";
let allTags = [];
info.tags.forEach(tag => {
    tag.name !== "other" ? allTags.push(tag.name) : null;
});
let searchText = ``;
let navigation = {
    subNav: false,
    subFilter: "",
    subURL: ""
};

let mobileBreakPoint = 1000;
let scrollPosition = 0;
let size, color;
let shortcutDrawerOpen;
let shortcutDrawerButton = document.createElement('div');
let shortcutDrawerViewer = document.createElement('div');
let shortcutDrawerWidth = 300;

let acData = [];
articles.forEach((article) => {
    // if (!article.tags.includes('testimonial') && !article.tags.includes('recommendation')) {
    //     let splits = article.title.split(' ');
    //     splits.forEach((text) => {
    //         acData.push(text.toLowerCase());
    //     });
    // }
    // if (article.subtitle) {
    //     let splits = article.subtitle.split(' ');
    //     splits.forEach((text) => {
    //         acData.push(text.toLowerCase());
    //     });
    // }
    article.tags.forEach((tag) => {
        acData.push(tag);
    });
    if (article.tech) {
        article.tech.forEach((item) => {
            acData.push(item);
        });
    }
    acData = acData.filter(onlyUnique);
});

// Supporting functions

function applyCSS(el, styles = {}, setProp = false) {
    for (let property in styles) {
        if (setProp) {
            el.style.setProperty(property, styles[property]);
        } else {
            el.style[property] = styles[property].toString();
        }
    }
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function keyboardInput(e) {
    console.log(e);
    let code = e.code;
    switch (code) {
        case 'KeyD':
            switchDarkMode(e);
            e.stopPropagation();
            break;
        case 'KeyC':
        case 'Digit0':
            clearAll();
            e.stopPropagation();
            break;
        case 'KeyK':
            toggleShortcutDrawer();
            e.stopPropagation();
            break;
        case 'KeyS':
            activateSearch();
            e.stopPropagation();
            break;
        case 'KeyT':
            window.scrollTo(0, 0);
            e.stopPropagation();
            break;
        case 'KeyB':
            window.scrollTo(0, document.body.scrollHeight);
            e.stopPropagation();
            break;
        default:
            info.tags.forEach((tag) => {
                if (tag.code && tag.code === code) {
                    navButtonClick(tag.name);
                }
            });
            e.stopPropagation();
            break;
    }
}

function activateSearch() {
    searchInput.focus();
}

function submitSearch(text) {
    setUrlParameter('search', text.toLowerCase());
    searchText = text.toLowerCase();
    initiate();
    // searchInput.value = text + `E`;
}

function navButtonClick(tag) {
    navFilter = tag;
    scrollPosition = 0;
    setURL();
    initiate();
}

function clearAll() {
    navFilter = "";
    navigation.subNav = false;
    searchText = ``;
    searchInput.value = ``;
    setUrlParameter('search', "");
    setURL("", true);
    initiate();
}

function switchDarkMode() {
    darkMode = !darkMode;
    darkMode ? setStorage('darkMode', 'true') : setStorage('darkMode', 'false');
    initiate();
}

function setStorage(key, value, session = false) {
    session ? sessionStorage.setItem(key, value) : localStorage.setItem(key, value);
}

function removeStorage(key, session = false) {
    session ? sessionStorage.removeItem(key) : localStorage.removeItem(key);
}

function getStorage(key, session = false) {
    return session
        ? sessionStorage.length > 0 ? sessionStorage.getItem(key) : false
        : localStorage.length > 0 ? localStorage.getItem(key) : false;
}

function clearStorage(session = false) {
    return session ? sessionStorage.clear() : localStorage.clear();
}

function toggleShortcutDrawer() {
    if (!shortcutDrawerOpen) {
        shortcutDrawerOpen = true;
        shortcutDrawerButton.innerHTML = `Shortcuts <i class="fas fa-times-circle"></i>`;
        animateSize(shortcutDrawerViewer, 'width', 0, shortcutDrawerWidth, 20);
        animateSize(shortcutDrawerViewer, 'opacity', 0, 1, 0.2, false);
        animateSize(shortcutDrawerButton, 'left', -1 * size.spacing, shortcutDrawerWidth - size.spacing, 20);
    } else {
        shortcutDrawerOpen = false;
        shortcutDrawerButton.innerHTML = `Shortcuts <i class="fas fa-arrow-up"></i>`;
        animateSize(shortcutDrawerViewer, 'width', shortcutDrawerWidth, 0, -20);
        animateSize(shortcutDrawerViewer, 'opacity', 1, 0, -0.2, false);
        animateSize(shortcutDrawerButton, 'left', shortcutDrawerWidth - size.spacing, -1 * size.spacing, -20);
    }
}

function animateSize(elem, prop, init, final, step = 10, pixel = true) {
    let x = init;

    function frame() {
        x += step;
        elem.style[prop] = pixel ? x + 'px' : `${x}`;
        init < final
            ? x >= final ? clearInterval(id) : ''
            : x <= final ? clearInterval(id) : '';
    }

    let id = setInterval(frame, 10);
}

function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele !== value;
    });
}

function findArticlesOBJ(key, val) {
    return articles.find(obj => obj[key] === val);
}

function findInfoOBJ(key, val) {
    return info.tags.find(obj => obj[key] === val);
}

function matchColor(tags) {
    for (var i = 0; i < tags.length; i++) {
        tags[i] = tags[i].toLowerCase();
    }
    let matches = allTags.filter(x => tags.includes(x));
    if (matches[0] && matches[0] !== "") {
        return findInfoOBJ("name", matches[0]).color;
    } else {
        return findInfoOBJ("name", "other").color;
    }
}

function matchIcon(tags) {
    for (var i = 0; i < tags.length; i++) {
        tags[i] = tags[i].toLowerCase();
    }
    let matches = allTags.filter(x => tags.includes(x));
    if (matches[0] && matches[0] !== "") {
        return findInfoOBJ("name", matches[0]).icon;
    } else {
        return findInfoOBJ("name", "other").icon;
    }
}

function parseQuery(queryString) {
    let query = {};
    let pairs = (queryString[0] === "?"
            ? queryString.substr(1)
            : queryString
    ).split("&");
    for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i].split("=");
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
    }
    return query;
}

function setURL(queryURL = "", clear = false) {
    let newURL;
    if (clear) {
        newURL = `#`;
    } else {
        let hashURL = "#";
        if (navFilter !== "") {
            hashURL += navFilter;
            if (navigation.subNav && navigation.subFilter === navFilter) {
                hashURL += "/" + navigation.subURL;
            }
        }
        newURL = queryURL + hashURL;
    }
    history.replaceState({}, info.title, newURL);
}

function setUrlParameter(key, value) {
    let params = new URLSearchParams(location.search);
    if (params.has(key)) {
        params.set(key, value);
    } else {
        params.append(key, value);
    }
    // [...params.entries()];
    setURL("?" + params.toString());
}

function invertColor(hex, bw = true) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    let r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#1A1A1A'
            : '#FFFFFF';
    }
    // invert color components
    // r = (255 - r).toString(16);
    // g = (255 - g).toString(16);
    // b = (255 - b).toString(16);
    // // pad each with zeros and return
    // return "#" + padZero(r) + padZero(g) + padZero(b);
}