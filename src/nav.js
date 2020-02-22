let searchInput = document.createElement('input');

// SIDEBAR
function buildSidebar() {
    let sidebar = document.createElement("side");
    applyCSS(sidebar, {
        width: size.widthBody - size.widthMain - 2 * size.spacing + "px",
        position: "fixed",
        top: size.spacing * 1 + "px",
        // height: 200 + allTags.length * 40 + 60 + "px",
        height: window.innerHeight - 4 * size.spacing + 'px',
        left: (size.widthWindow - size.widthBody) / 2 + "px",
        padding: size.spacing + "px",
        textAlign: "right",
    });

    let headingTitle = document.createElement("div");
    sidebar.appendChild(headingTitle);
    headingTitle.innerText = info.title;
    headingTitle.translate = false;
    applyCSS(headingTitle, {
        margin: "0",
        fontFamily: "Kameron, serif",
        fontWeight: "bold",
        color: color.primary,
        fontSize: "2rem",
        lineHeight: "2.5rem",
        letterSpacing: "1px",
        textTransform: "uppercase",
        marginBottom: "1rem",
        cursor: 'pointer',
    });
    headingTitle.onclick = function () {
        clearAll();
        window.scrollTo(0, 0);
    };

    sidebar.appendChild(buildSocialActions());
    sidebar.appendChild(buildSearch());
    sidebar.appendChild(buildNavigation());
    sidebar.appendChild(buildColorToggle());

    return sidebar;
}

function buildSocialActions() {
    let sButtons = document.createElement("div");
    sButtons.id = "social-actions";
    applyCSS(sButtons, {
        display: "flex",
        justifyContent: size.isMobile ? "flex-start" : "flex-end",
        margin: size.radius + "px 0",
        color: color.primary,
        cursor: "pointer",
    });

    info.social.forEach(action => {
        let button = size.isMobile
            ? buildButton(action)
            : buildButton(action, true);
        sButtons.appendChild(button);
        button.id = "social-actionButton";

        button.onclick = function () {
            if (action.type === "top") {
                window.scrollTo(0, 0);
            } else {
                if (action.link.includes("mailto")) {
                    location.href = action.link;
                } else {
                    window.open(action.link, action.target || "_blank");
                }
            }
        };
    });
    return sButtons;
}

function buildButton(action, icon = false, accent = false) {
    let button = document.createElement("div");
    applyCSS(button, {
        marginLeft: size.isMobile ? 0 : size.radius + "px",
        marginRight: size.isMobile ? size.radius + "px" : "0",
        padding: size.radius / 2 + "px " + (size.radius * 3) / 2 + "px",
        borderRadius: size.radius / 2 + "px",
        border: size.isMobile ? "1px solid " + color.primary : '',
        color: color.primary,
        transition: "background-color 0.2s ease",
        cursor: "pointer",
    });

    let buttonCustomColor = '';
    if (action.color && action.color !== '') {
        buttonCustomColor = action.color;
    }

    let buttonIcon = document.createElement("i");
    if (action.icon && action.icon !== "") {
        button.appendChild(buttonIcon);
        buttonIcon.alt = action.name;
        buttonIcon.title = action.name;
        buttonIcon.className = action.icon;
    }
    if (!icon) {
        if (action.name && action.name !== "") {
            applyCSS(buttonIcon, {marginRight: '0.5rem'});
            let buttonText = document.createElement("span");
            button.appendChild(buttonText);
            buttonText.innerText = action.name;
            applyCSS(buttonText, {fontWeight: 500});
        }
    }
    button.onmouseover = function () {
        button.classList.add("hover");
        applyCSS(button, {
            backgroundColor: accent ? matchColor([action.name]) : buttonCustomColor === '' ? color.primary : buttonCustomColor,
            border: size.isMobile ? "1px solid " + color.primary : '',
            color: accent ? "#FFFFFF" : buttonCustomColor === '' ? color.highlight : invertColor(buttonCustomColor),
        });
    };
    button.onmouseleave = function () {
        button.classList.remove("hover");
        if (!button.classList.contains("active")) {
            applyCSS(button, {
                backgroundColor: "transparent",
                border: size.isMobile ? "1px solid " + color.primary : '',
                color: color.primary,
            });
        }
    };
    return button;
}

function buildSearch() {
    let searchHeight = 36;
    let searchWidthInit = size.isMobile ? size.widthBody - 60 : 180;
    let searchWidthFinal = size.isMobile ? size.widthBody - 60 : 200;
    let sInputPaddingLeftInit = size.isMobile ? 40 : 25;
    let sInputPaddingLeftFinal = 40;
    let sIconLeftInit = size.isMobile ? 10 : 4;
    let sIconLeftFinal = 10;
    let sInputWidthInit = searchWidthInit - sInputPaddingLeftInit;
    let sInputWidthFinal = searchWidthFinal - sInputPaddingLeftFinal;

    let searchArea = document.createElement('div');
    applyCSS(searchArea, {
        display: "flex",
        flexDirection: `row`,
        justifyContent: size.isMobile ? "flex-start" : "flex-end",
        marginLeft: size.isMobile ? "8px" : 0,
        marginBottom: size.isMobile ? "16px" : 0,
    });

    let searchForm = document.createElement('form');
    searchArea.appendChild(searchForm);
    applyCSS(searchForm, {
        backgroundColor: color.card,
        width: `${searchWidthInit}px`,
        height: `${searchHeight}px`,
        borderRadius: size.radius / 2 + 'px',
        marginTop: size.isMobile ? `8px` : `20px`,
        position: 'relative',
    });
    searchForm.onsubmit = function (e) {
        e.preventDefault();
    };

    let acDataList = document.createElement('datalist');
    acDataList.id = 'acData';
    acData.forEach((data) => {
        let acDataOption = document.createElement('option');
        acDataList.appendChild(acDataOption);
        acDataOption.value = data;
    });

    searchForm.appendChild(searchInput);
    searchForm.appendChild(acDataList);
    searchInput.id = `autocomplete`;
    searchInput.setAttribute('list', 'acData');
    searchInput.placeholder = size.isMobile ? `Click here to Search` : `Press S to search`;
    if (searchText !== ``) {
        searchInput.value = searchText;
    }
    applyCSS(searchInput, {
        position: `absolute`,
        right: `0`,
        height: `${searchHeight}px`,
        width: `${sInputWidthInit}px`,
        borderRadius: size.radius / 2 + 'px',
        border: size.isMobile ? `1px solid ${color.secondary}` : `none`,
        paddingLeft: sInputPaddingLeftInit + `px`,
        backgroundColor: `transparent`,
        color: color.primary,
        fontSize: `0.75rem`,
        fontFamily: `Poppins, sans-serif`,
    });

    let searchIcon = document.createElement('i');
    searchForm.appendChild(searchIcon);
    searchIcon.className = 'fas fa-search';
    applyCSS(searchIcon, {
        position: 'absolute',
        left: sIconLeftInit + `px`,
        top: size.isMobile ? `12px` : `10px`,
    });

    let searchClearIcon = document.createElement('i');
    if (searchText !== ``) {
        searchForm.appendChild(searchClearIcon);
        searchClearIcon.className = 'fas fa-times-circle';
        applyCSS(searchClearIcon, {
            display: `block`,
            position: 'absolute',
            right: sIconLeftInit + `px`,
            top: size.isMobile ? `12px` : `10px`,
            cursor: 'pointer',
        });
        searchClearIcon.onclick = function () {
            searchText = ``;
            searchInput.value = searchText;
            setUrlParameter('search', searchText);
            initiate();
        };
    }

    searchInput.onfocus = function () {
        if (!size.isMobile) {
            animateSize(searchForm, 'width', searchWidthInit, searchWidthFinal, 5);
        }
        searchInput.placeholder = `Title, Tags, Tech`;
        applyCSS(searchIcon, {left: `${sIconLeftFinal}px`});
        applyCSS(searchInput, {
            fontSize: `1rem`,
            width: `${sInputWidthFinal}px`,
            paddingLeft: sInputPaddingLeftFinal + `px`,
        });
    };

    searchInput.onblur = function () {
        if (!size.isMobile) {
            animateSize(searchForm, 'width', searchWidthFinal, searchWidthInit, -5);
        }
        searchInput.placeholder = size.isMobile ? `Click here to Search` : `Press S to search`;
        applyCSS(searchIcon, {left: `${sIconLeftInit}px`});
        applyCSS(searchInput, {
            fontSize: `0.75rem`,
            width: `${sInputWidthInit}px`,
            paddingLeft: sInputPaddingLeftInit + `px`,
        });
    };

    searchInput.onkeydown = (e) => {
        if (e.code === 'Enter' || e.keyCode === 13) {
            submitSearch(searchInput.value)
        }
    };

    return searchArea;
}

function buildNavigation() {
    let nav = document.createElement("div");
    nav.id = "nav-area";
    nav.innerHTML = "";
    applyCSS(nav, {
        display: "flex",
        flexDirection: size.isMobile ? "row" : "column",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        margin: size.spacing / 2 + "px 0",
        position: "relative",
    });

    let posTop = 0;
    let clearButton = document.createElement("div");
    clearButton.id = "clear-button";
    clearButton.innerHTML = '<i class="far fa-times-circle"></i> Clear All';
    applyCSS(clearButton, {
        position: "absolute",
        top: size.spacing * allTags.length + 20 + "px",
        right: 0,
        width: "140px",
        marginBottom: "0.5rem",
        opacity: "0.7",
        cursor: "pointer",
        display: 'none'
        // display: searchText !== `` ? "block" : "none",//
    });
    clearButton.onclick = function () {
        applyCSS(clearButton, {display: 'none'});
        clearAll();
    };
    if (!size.isMobile) {
        nav.appendChild(clearButton);
    }

    allTags.forEach(tag => {
        let name = tag.charAt(0).toUpperCase() + tag.slice(1);
        let button = buildButton({name: name.toUpperCase()}, false, true);
        nav.appendChild(button);
        applyCSS(button, {
            position: size.isMobile ? "initial" : "absolute",
            top: posTop + "px",
            right: 0,
            width: size.isMobile ? "100px" : "115px",
            marginBottom: "0.5rem",
        });

        posTop += size.spacing;

        if (navFilter === tag) {
            button.classList.add("active");
            applyCSS(button, {
                backgroundColor: matchColor([tag]),
                border: size.isMobile ? "1px solid " + matchColor([tag]) : '',
                color: "#FFFFFF", //color.highlight
            });
            // applyCSS(clearButton, {display: 'block'});
        }

        if (button.classList.contains("active")) {
            let clearIcon = document.createElement('i');
            button.appendChild(clearIcon);
            clearIcon.className = 'fas fa-times-circle';
            size.isMobile
                ? applyCSS(clearIcon, {
                    position: 'absolute',
                    right: '8px',
                    top: "8px",
                    color: darkMode ? `#FFFFFF` : '#000000',
                })
                : applyCSS(clearIcon, {
                    position: 'absolute',
                    left: '8px',
                    top: "8px",
                    color: `#FFFFFF`
                });
        }

        button.onclick = function () {
            if (button.classList.contains("active")) {
                button.classList.remove("active");
                applyCSS(button, {
                    backgroundColor: "transparent",
                    border: size.isMobile ? "1px solid " + color.primary : '',
                    color: color.primary,
                });
                applyCSS(clearButton, {display: 'none'});
                navFilter = "";
                navigation.subNav = false;
                button.onmouseleave = function () {
                    button.classList.remove("hover");
                    applyCSS(button, {
                        backgroundColor: "transparent",
                        border: size.isMobile ? "1px solid " + color.primary : '',
                        color: color.primary,
                    });
                };
            } else {
                button.classList.add("active");
                applyCSS(button, {
                    backgroundColor: matchColor([tag]),
                    border: size.isMobile ? "1px solid " + matchColor([tag]) : '',
                    color: "#FFFFFF",
                });
                navigation.subNav = false;
                navFilter = tag;
                button.onmouseleave = function () {
                };
            }
            scrollPosition = 0;
            setURL();
            initiate();
        };
    });

    return nav;
}

function buildColorToggle() {
    let switcher = document.createElement("div");
    applyCSS(switcher, {
        position: size.isMobile ? "initial" : "absolute",
        bottom: 0,
        right: size.spacing + "px",
        display: "flex",
        flexDirection: "column",
        justifyContent: size.isMobile ? "flex-start" : "flex-end",
        marginTop: size.isMobile ? size.radius + "px" : 0,
    });

    let mode = document.createElement("div");
    switcher.appendChild(mode);
    if (!size.isMobile) {
        let switchLabel = document.createElement("div");
        switcher.appendChild(switchLabel);
        switchLabel.innerHTML = `Dark Mode ${darkMode ? "ON" : "OFF"}`;
        applyCSS(switchLabel, {
            opacity: 0.7,
            fontSize: "0.8rem",
        });
    }

    let modeLabel = document.createElement("label");
    mode.appendChild(modeLabel);
    modeLabel.classList = "switch";

    let modeInput = document.createElement("input");
    modeLabel.appendChild(modeInput);
    modeInput.type = "checkbox";
    modeInput.name = "onoffswitch";
    modeInput.id = "myonoffswitch";
    modeInput.checked = darkMode;

    let modeSpan = document.createElement("span");
    modeLabel.appendChild(modeSpan);
    modeSpan.classList = "slider round";

    switcher.addEventListener('click', function (e) {
        e.preventDefault();
        switchDarkMode();
    });
    return switcher;
}


// HEADBAR
function buildHeadbar() {
    let headbar = document.createElement("header");
    applyCSS(headbar, {
        position: "fixed",
        top: "0px",
        left: "0px",
        right: "0px",
        backgroundColor: color.card,
        height: (size.spacing * 5) / 2 + "px",
        zIndex: "50",
        boxShadow: `0 0 ${size.spacing}px 0 rgba(0,0,0,${darkMode ? 0.5 : 0.2})`,
    });

    let headingTitle = document.createElement("div");
    headbar.appendChild(headingTitle);
    headingTitle.innerText = info.title;
    headingTitle.translate = false;
    applyCSS(headingTitle, {
        position: "fixed",
        top: size.spacing / 2 + "px",
        left: size.spacing + "px",
        margin: "0",
        fontFamily: "Kameron, serif",
        fontWeight: "bold",
        color: color.primary,
        fontSize: "1.5rem",
        lineHeight: "38px",
        letterSpacing: "1px",
        textTransform: "uppercase",
        marginBottom: "1rem",
        cursor: "pointer",
    });
    headingTitle.onclick = function () {
        window.scrollTo(0, 0);
    };

    let menuIcon = document.createElement("div");
    headbar.appendChild(menuIcon);
    applyCSS(menuIcon, {
        position: "fixed",
        top: size.spacing / 2 + "px",
        right: size.spacing + "px",
    });
    menuIcon.appendChild(
        buildButton({icon: "fas fa-bars", name: "Menu"}, true)
    );

    let Menu = buildMenu();
    applyCSS(Menu, {display: 'none'});

    let overlay = document.createElement("div");
    applyCSS(overlay, {
        display: "none",
        position: "fixed",
        top: "50px",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#000000",
        opacity: 0.5,
        zIndex: 20,
    });

    menuIcon.onclick = function () {
        if (Menu.style.display === "none") {
            applyCSS(Menu, {display: 'block'});
            menuIcon.innerHTML = "";
            menuIcon.appendChild(buildButton({icon: "fas fa-times"}, true));
            applyCSS(overlay, {display: 'block'});
        } else {
            applyCSS(Menu, {display: 'none'});
            menuIcon.innerHTML = "";
            menuIcon.appendChild(buildButton({icon: "fas fa-bars"}, true));
            applyCSS(overlay, {display: 'none'});
        }
    };
    headbar.appendChild(overlay);
    headbar.appendChild(Menu);
    return headbar;
}

function buildMenu() {
    let Menu = document.createElement("div");
    Menu.id = "menu";
    applyCSS(Menu, {
        position: "fixed",
        top: "50px",
        left: "0px",
        right: "0px",
        backgroundColor: color.card,
        height: "auto",
        zIndex: "50",
        padding: `${size.spacing / 2}px ${size.spacing}px  ${size.spacing}px`,
    });

    function divider(text) {
        let divider = document.createElement("div");
        divider.innerText = text;
        applyCSS(divider, {
            marginTop: size.radius + "px",
            borderBottom: "1px solid #8c8c8c",
        });
        return divider;
    }

    Menu.appendChild(divider("Contact"));
    Menu.appendChild(buildSocialActions());

    Menu.appendChild(divider("Search"));
    Menu.appendChild(buildSearch());

    Menu.appendChild(divider("Navigate"));
    Menu.appendChild(buildNavigation());

    Menu.appendChild(divider(`Dark Mode - ${darkMode ? "ON" : "OFF"}`));
    Menu.appendChild(buildColorToggle());

    return Menu;
}
