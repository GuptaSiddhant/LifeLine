class Article {
    constructor(article) {
        // title, static, subtitle, icon, date, tags, description, role, tech, attachments, actions
        this.title = article.title;
        this.subtitle = article.subtitle;
        this.icon = article.icon;
        this.logo = article.logo;
        this.date = article.date;
        this.timestamp = article.timestamp;
        this.tags = article.tags;
        this.summary = article.summary;
        this.role = article.role;
        this.tech = article.tech;
        this.attachments = article.attachments;
        this.actions = article.actions;
        this.starred = article.tags.some(r => 'favourite' === r);
        this.spacing = size.spacing;
        this.size = size.widthMain - 4 * size.spacing;
        this.radius = size.radius;
        this.isMobile = size.isMobile;
        this.colorAccent = matchColor(article.tags);
        this.colorPrimary = color.primary;
        this.colorSecondary = color.secondary;
        this.colorInverse = color.inverse;
        this.colorCard = color.card;
        this.file = article.file; //Viewer
        this.filetype = article.filetype; //Viewer

        this.quotation =
            this.tags.includes("testimonial") || this.tags.includes("recommendation") || this.tags.includes("quote");
    }

    buildFullArticle() {
        let title = document.getElementById("app-title");
        let titleOG = document.getElementById("og-title");
        let titleTwitter = document.getElementById("twitter-title");
        title.innerText += " / " + this.title;
        titleOG.content += " / " + this.title;
        titleTwitter.content += " / " + this.title;

        let descOG = document.getElementById("og-desc");
        let descTwitter = document.getElementById("twitter-desc");
        descOG.content = this.summary;
        descTwitter.content = this.summary;

        let imageOG = document.getElementById("og-image");
        let imageTwitter = document.getElementById("twitter-image");
        imageOG.content = this.attachments[0].image;
        imageTwitter.content = this.attachments[0].image;

        let fullArticle = document.createElement("div");
        applyCSS(fullArticle, {position: 'relative'});
        if (this.isMobile) {
            applyCSS(fullArticle, {
                position: 'fixed',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                zIndex: 70,
                backgroundColor: 'rgba(0,0,0,0.75)',
            });
        }

        let card = document.createElement("div");
        fullArticle.appendChild(card);
        applyCSS(card, {
            position: 'absolute',
            backgroundColor: this.colorCard,
            margin: this.isMobile ? "60px 0 0 0" : `0px ${this.spacing}px`,
            borderRadius: this.isMobile ? 0 : 2 * this.radius + "px",
            boxShadow: `0 0 ${this.spacing}px 0 rgba(0,0,0,0.1)`,
            width: this.isMobile
                ? "auto"
                : this.size + 2 * this.spacing + "px",
            zIndex: "75",
            height: this.isMobile
                ? "auto"
                : `calc(100vh - ${size.spacing * 2}px)`,
        });
        if (size.isMobile) {
            applyCSS(card, {
                top: 0, right: 0, bottom: 0, left: 0
            });
        }

        // applyCSS Start
        const root = document.documentElement;
        applyCSS(root, {
            "--colorAccent": this.colorAccent,
            "--colorPrimary": this.colorPrimary,
            "--colorSecondary": this.colorSecondary,
            "--colorCard": this.colorCard,
            "--colorInverse": this.colorInverse,
        }, true);
        // applyCSS End

        let closeButton = document.createElement("i");
        card.appendChild(closeButton);
        // noinspection JSValidateTypes
        closeButton.classList = `fas fa-times-circle`;
        applyCSS(closeButton, {
            position: "absolute",
            top: "-10px",
            right: this.isMobile ? "10px" : "-10px",
            color: this.isMobile ? "#f2f2f2" : this.colorSecondary,
            zIndex: 80,
            cursor: "pointer",
            fontSize: "20px",
            textShadow: `0 0 ${this.spacing / 2}px rgba(0,0,0,0.5)`,
        });
        closeButton.onclick = function () {
            navigation.subNav = false;
            setURL();
            buildDOM();
        };

        card.appendChild(this.buildCardIcon());
        card.appendChild(this.buildViewer());

        return fullArticle;
    }

    buildViewer() {
        let viewer = document.createElement("div");
        viewer.id = "article-showdown";
        applyCSS(viewer, {
            position: "absolute",
            backgroundColor: this.colorCard,
            right: `${this.radius}px`,
            top: `${this.radius}px`,
            bottom: `${this.radius}px`,
            left: `${this.radius}px`,
            opacity: "1",
            padding: "16px",
            webkitOverflowScrolling: "touch",
            "-webkit-overflow-scrolling": "touch",
        });

        if (this.filetype === "html") {
            let frame = document.createElement("iframe");
            viewer.appendChild(frame);
            applyCSS(viewer, {
                overflow: 'hidden',
                padding: 0
            });
            applyCSS(frame, {
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                border: 'none',
            });
            frame.src = this.file;
        } else {
            applyCSS(viewer, {overflow: 'scroll'});

            let converter = new showdown.Converter({extensions: ["youtube"]});
            converter.setOption("parseImgDimensions", true);
            converter.setOption("simplifiedAutoLink", true);
            converter.setOption("tables", true);
            converter.setOption("openLinksInNewWindow", true);
            converter.setOption("emoji", true);

            let request = new XMLHttpRequest();
            request.addEventListener("load", function () {
                viewer.innerHTML = converter.makeHtml(this.responseText);
            });
            request.open("GET", this.file);
            request.send();
        }
        return viewer;
    }

    buildSummaryCard() {
        let fullImg = document.createElement("div");
        let closeButton = document.createElement("i");

        let card = document.createElement("article");
        card.id = "article-card-" + this.timestamp;
        applyCSS(card, {
            fontSize: '1rem',
            backgroundColor: this.colorCard,
            margin: this.spacing + "px",
            borderRadius: 2 * this.radius + "px",
            padding: this.spacing + "px",
            boxShadow: `0 0 ${this.spacing}px 0 rgba(0,0,0,0.1)`,
            width: this.size + "px",
            position: "relative",
            zIndex: 2,
            height: navigation.subNav ? `calc(100vh - ${size.spacing * 6}px)` : "auto",
            marginBottom: this.isMobile ? `${this.spacing * 2}px` : this.spacing + "px",
        });
        if (this.attachments && this.attachments.length > 0 && this.isMobile) {
            applyCSS(card, {paddingBottom: `${this.spacing + 120}px`});
        }
        if (this.attachments && this.attachments.length > 0 && !this.isMobile) {
            applyCSS(card, {paddingRight: this.spacing + 80 + "px", width: this.size - 80 + "px"});
        }

        card.appendChild(this.buildCardIcon());
        if (this.starred) {
            card.appendChild(this.buildCardStarIcon());
        }
        card.appendChild(this.buildHeading());
        card.appendChild(this.buildDescription());
        card.appendChild(this.buildActions());
        card.appendChild(fullImg);
        card.appendChild(closeButton);
        card.appendChild(this.buildAttachments(card, fullImg, closeButton));
        return card;
    }

    buildCardIcon() {
        let iconSize = 20;
        let cardIcon = document.createElement("icon");
        cardIcon.id = "article-icon";
        applyCSS(cardIcon, {
            position: "absolute",
            left: this.isMobile ? this.spacing + "px" : "-20px",
            top: this.isMobile ? "-20px" : "34px",
            width: iconSize * 2 + "px",
            height: iconSize * 2 + "px",
            borderRadius: this.radius + "px",
            boxShadow: "0 0 20px 0 rgba(0,0,0,0.2)",
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: iconSize * 2 + "px",
            fontSize: iconSize + "px",
            zIndex: 10,
            backgroundColor: this.colorAccent
        });
        if (this.logo && this.logo !== "") {
            let logoImage = document.createElement("img");
            cardIcon.appendChild(logoImage);
            logoImage.src = this.logo;
            applyCSS(logoImage, {
                margin: '5px 0',
                height: iconSize * 1.5 + "px",
                width: iconSize * 1.5 + "px",
                objectFit: 'contain',
                borderRadius: 0
            });
        } else if (this.icon && this.icon !== "") {
            cardIcon.className = this.icon;
        } else if (this.quotation) {
            cardIcon.className = "fas fa-quote-left";
        } else {
            cardIcon.className = matchIcon(this.tags);
        }

        return cardIcon;
    }

    buildCardStarIcon() {
        let iconSize = 20;
        let cardIcon = document.createElement("icon");
        cardIcon.id = "article-star-icon";
        cardIcon.className = "fas fa-heart";
        cardIcon.alt = 'Favourite';
        cardIcon.title = 'Favourite';
        applyCSS(cardIcon, {
            position: "absolute",
            left: this.isMobile ? this.spacing + 3 * iconSize + "px" : "-20px",
            top: this.isMobile ? "-20px" : 34 + 3 * iconSize + "px",
            width: iconSize * 2 + "px",
            height: iconSize * 2 + "px",
            borderRadius: this.radius + "px",
            boxShadow: "0 0 20px 0 rgba(0,0,0,0.2)",
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: iconSize * 2 + "px",
            fontSize: iconSize + "px",
            zIndex: 10,
            backgroundColor: "#F74F9E"
        });
        return cardIcon;
    }

    buildHeading() {
        let heading = document.createElement("div");
        heading.id = "article-heading";

        let title = document.createElement("div");
        heading.appendChild(title);
        title.id = "article-title";
        title.innerText = this.title;
        title.translate = false;
        title.classList.add('notranslate');
        applyCSS(title, {
            fontFamily: "Kameron, serif",
            fontWeight: this.quotation ? "normal" : "bold",
            fontSize: this.quotation ? "20px" : "24px",
            color: this.colorPrimary,
            lineHeight: this.quotation ? "26px" : "30px",
            marginBottom: "4px",
        });

        if (this.subtitle) {
            let subtitle = document.createElement("div");
            heading.appendChild(subtitle);
            subtitle.id = "article-subtitle";
            subtitle.innerText = this.subtitle;
            subtitle.translate = false;
            subtitle.classList.add('notranslate');
            applyCSS(subtitle, {
                fontWeight: "500",
                fontSize: "16px",
                color: this.colorAccent,
                letterSpacing: "0.5px",
                lineHeight: "20px",
                textTransform: "uppercase",
                marginBottom: "8px",
            });
        }

        if (this.tags && this.tags.length > 0) {
            let subtitle2 = document.createElement("div");
            heading.appendChild(subtitle2);
            subtitle2.id = "article-subtitle2";
            subtitle2.innerText = "";
            applyCSS(subtitle2, {
                fontSize: "16px",
                color: this.colorSecondary,
                lineHeight: "20px",
                textTransform: "capitalize",
                marginBottom: "8px",
            });

            if (this.date) {
                subtitle2.innerText += this.date;
            }
            if (this.date && this.tags) {
                subtitle2.innerText += " • ";
            }
            if (this.tags) {
                this.tags.forEach((tag, index) => {
                    let tagSpan = document.createElement('span');
                    subtitle2.appendChild(tagSpan);
                    tagSpan.innerText = tag.toString();
                    applyCSS(tagSpan, {cursor: 'pointer'});
                    if (index + 1 !== this.tags.length) {
                        let commaSpace = document.createElement('span');
                        commaSpace.innerText = `, `;
                        subtitle2.appendChild(commaSpace);
                    }
                    tagSpan.onclick = function () {
                        submitSearch(tag.toString());
                    };
                    tagSpan.onmouseover = () => {
                        applyCSS(tagSpan, {color: color.primary});
                    };
                    tagSpan.onmouseleave = () => {
                        applyCSS(tagSpan, {color: color.secondary});
                    };
                });
            }
        }
        return heading;
    }

    buildDescription() {
        let description = document.createElement("div");
        description.id = "article-description";
        applyCSS(description, {
            fontSize: "14px",
            color: this.colorSecondary,
            lineHeight: "20px",
            marginBottom: "4px",
        });

        if (this.summary) {
            let summary = document.createElement("div");
            description.appendChild(summary);
            summary.id = "article-summary";
            summary.innerHTML = this.summary;
            applyCSS(summary, {marginBottom: '8px'});
        }

        if (this.role) {
            let role = document.createElement("div");
            description.appendChild(role);
            role.id = "article-role";
            applyCSS(role, {marginBottom: '4px'});

            let field = document.createElement("span");
            role.appendChild(field);
            field.innerText = "Role: ";
            applyCSS(field, {fontWeight: '500', textTransform: 'uppercase'});

            let value = document.createElement("span");
            role.appendChild(value);
            value.innerText = this.role;
        }

        if (this.tech) {
            let tech = document.createElement("div");
            tech.id = "article-tech";
            description.appendChild(tech);
            applyCSS(tech, {marginBottom: '4px', textTransform: 'capitalize'});

            let field = document.createElement("span");
            tech.appendChild(field);
            field.innerText = "Tech: ";
            applyCSS(field, {fontWeight: '500', textTransform: 'uppercase'});

            let value = document.createElement("span");
            tech.appendChild(value);

            this.tech.forEach((item, index) => {
                let itemSpan = document.createElement('span');
                value.appendChild(itemSpan);
                itemSpan.innerText = item.toString();
                applyCSS(itemSpan, {cursor: 'pointer'});
                if (index + 1 !== this.tech.length) {
                    let commaSpace = document.createElement('span');
                    value.appendChild(commaSpace);
                    commaSpace.innerText = `, `;
                }
                itemSpan.onclick = function () {
                    submitSearch(item.toString());
                };
                itemSpan.onmouseover = () => {
                    applyCSS(itemSpan, {color: color.primary});
                };
                itemSpan.onmouseleave = () => {
                    applyCSS(itemSpan, {color: color.secondary});
                };
            });
        }

        return description;
    }

    buildActions() {
        let actionButtons = document.createElement("div");
        actionButtons.id = "article-actions";

        if (this.actions && this.actions.length !== 0) {
            applyCSS(actionButtons, {
                display: "flex",
                flexWrap: "wrap",
                color: this.colorPrimary,
                cursor: "pointer",
            });

            this.actions.forEach(action => {
                let button = document.createElement("div");
                actionButtons.appendChild(button);
                button.id = "article-actionButton";
                button.title = action.link;
                applyCSS(button, {
                    marginTop: `${this.radius}px`,
                    marginRight: `${this.radius}px`,
                    padding: `${this.radius / 2}px ${this.radius}px`,
                    borderRadius: `${this.radius / 2}px`,
                    border: "1px solid " + this.colorPrimary,
                    transition: "background-color 0.2s ease",
                });

                let buttonIcon = document.createElement("i");
                button.appendChild(buttonIcon);
                buttonIcon.alt = action.name;
                buttonIcon.title = action.name;
                buttonIcon.className =
                    action.target === "_self"
                        ? "fas fa-align-left fa-flip-vertical"
                        : "fas fa-external-link-square-alt";
                if (action.icon && action.icon !== "") {
                    buttonIcon.className = action.icon;
                }
                if (action.name && action.name !== "") {
                    applyCSS(buttonIcon, {marginRight: '0.5rem'});
                    let buttonText = document.createElement("span");
                    button.appendChild(buttonText);
                    buttonText.innerText = action.name;
                    buttonText.classList.add('notranslate');
                    buttonText.translate = false;
                }

                let article = this;
                button.onmouseover = function () {
                    button.classList.add("hover");
                    applyCSS(button, {
                        backgroundColor: article.colorAccent,
                        border: "1px solid " + article.colorAccent,
                        color: "#FFFFFF",
                    });
                };
                button.onmouseleave = function () {
                    button.classList.remove("hover");
                    applyCSS(button, {
                        backgroundColor: "transparent",
                        border: "1px solid " + article.colorPrimary,
                        color: article.colorPrimary,
                    });
                };

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
        }
        return actionButtons;
    }

    buildAttachments(card, fullImg, closeButton) {
        let imageSize = 100;
        let attachImages = document.createElement("div");
        attachImages.id = "article-attachments";

        if (this.attachments && this.attachments.length > 0) {
            applyCSS(attachImages, {
                position: 'absolute',
            });

            if (this.isMobile) {
                applyCSS(attachImages, {
                    left: this.spacing + 'px',
                    bottom: '20px',
                });
            } else {
                applyCSS(attachImages, {
                    right: '-20px',
                    top: '20px',
                    bottom: '20px',
                });
            }
            applyCSS(attachImages, {
                display: "flex",
                flexDirection: this.isMobile ? "row" : "column",
                justifyContent: "space-around",
                alignItems: 'flex-end',
                zIndex: 10,
            });

            this.attachments.forEach(item => {
                let thumbnail = document.createElement("div");
                attachImages.appendChild(thumbnail);
                thumbnail.id = "article-thumbnail";
                thumbnail.alt = item.name;
                thumbnail.title = item.name;
                applyCSS(thumbnail, {
                    position: 'relative',
                    backgroundColor: this.colorCard,
                    margin: this.isMobile ? `0 ${this.radius}px 0 0` : this.radius + "px 0",
                    width: imageSize + "px",
                    height: imageSize + "px",
                    borderRadius: this.radius + "px",
                    border: "none",
                    objectFit: "cover",
                    boxShadow: `0 0 ${this.spacing}px 0 rgba(0,0,0,0.25)`,
                    transition: "width 0.2s ease, height 0.2s ease, box-shadow 0.2s ease-in",
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: `cover`,
                    backgroundPosition: `center`,
                });

                if (item.full !== false) {
                    let thumbOverlay = document.createElement('div');
                    thumbnail.appendChild(thumbOverlay);
                    applyCSS(thumbOverlay, {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: thumbnail.style.borderRadius,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        opacity: 0,
                        color: '#FFFFFF',
                        fontSize: '20px',
                        textAlign: 'right',
                        padding: '10px',
                        lineHeight: '20px',
                    });
                    thumbOverlay.onclick = function () {
                        window.open(item.image, "_blank");
                    };
                    let thumbOverlayIcon = document.createElement('i');
                    thumbOverlay.appendChild(thumbOverlayIcon);
                    thumbOverlayIcon.className = 'fas fa-external-link-square-alt';
                    thumbOverlayIcon.title = 'Open in New Tab';

                    fullImg.id = "article-fullImg";
                    applyCSS(fullImg, {
                        backgroundColor: this.colorCard,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        position: "absolute",
                        borderRadius: `${this.radius}px`,
                        right: `${this.radius}px`,
                        width: "0",
                        bottom: `${this.radius}px`,
                        height: "0",
                        opacity: "0",
                        transition: "opacity 0.2s ease",
                    });

                    let a = this;
                    const closeImg = function () {
                        applyCSS(fullImg, {
                            backgroundImage: `none`,
                            zIndex: 1,
                            right: `${a.radius}px`,
                            width: 0,
                            bottom: `${a.radius}px`,
                            height: 0,
                            opacity: 0,
                        });
                        applyCSS(closeButton, {
                            fontSize: "1px",
                            opacity: 0,
                            boxShadow: `0 0 0 0 rgba(0,0,0,0.25)`,
                        });
                        applyCSS(thumbOverlay, {opacity: 0});
                    };

                    fullImg.onclick = closeImg;

                    if (this.isMobile) {
                        applyCSS(closeButton, {
                            position: "absolute",
                            top: this.spacing + "px",
                            right: this.spacing + "px",
                            color: "#FFFFFF",
                            zIndex: "10",
                            fontSize: "1px",
                            opacity: "0",
                            textShadow: `0 0 ${this.spacing / 2}px rgba(0,0,0,0.5)`,
                        });
                        closeButton.classList = "fas fa-times-circle";
                        closeButton.onclick = closeImg;
                    }

                    thumbnail.onmouseover = function () {
                        applyCSS(fullImg, {
                            backgroundImage: `url(${item.image})`,
                            zIndex: 5,
                            right: `${a.radius}px`,
                            top: `${a.radius}px`,
                            bottom: `${a.radius}px`,
                            left: `${a.radius}px`,
                            width: "calc(100% - 16px)",
                            height: "calc(100% - 16px)",
                            opacity: 1,
                        });
                        applyCSS(closeButton, {
                            fontSize: "20px",
                            opacity: 1,
                            boxShadow: `0 0 ${a.spacing}px 0 rgba(0,0,0,0.25)`,
                        });
                        applyCSS(thumbOverlay, {opacity: 1});
                    };
                    if (!this.isMobile) {
                        thumbnail.onmousemove = function (evt) {
                            let IMG = new Image();
                            IMG.src = item.image;
                            let ratio = IMG.height / IMG.width;
                            let renderWidth = a.size; //a
                            let renderHeight = ratio * renderWidth; //b
                            let clientHeight = card.clientHeight - 16; //c
                            // let clientWidth = card.clientWidth;
                            if (renderHeight > clientHeight) {
                                let hiddenHeight = renderHeight - clientHeight;
                                let offsetHeight = hiddenHeight / 2;
                                let moveRatio = offsetHeight / 40;
                                applyCSS(fullImg, {backgroundPositionY: -1 * moveRatio * evt.offsetY + "px"});
                            }
                        };
                    }

                    thumbnail.onmouseleave = closeImg;
                } else {
                    thumbnail.onmouseover = function () {
                        applyCSS(thumbnail, {
                            width: "110px",
                            height: "110px",
                            boxShadow: "0 0 40px 0 rgba(0,0,0,0.5)",
                        });
                    };
                    thumbnail.onmouseleave = function () {
                        applyCSS(thumbnail, {
                            width: "100px",
                            height: "100px",
                            boxShadow: "0 0 40px 0 rgba(0,0,0,0.25)",
                        });
                    };
                }
            });
        }
        return attachImages;
    }
}
