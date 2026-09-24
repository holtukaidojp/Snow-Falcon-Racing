/* =========================================================
   SNOW FALCON RACING
   Official Website - script.js
   ========================================================= */


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initScrollReveal();
    initSmoothScroll();
    initMobileMenu();
    initHeader();
    initCounters();
    initHeroParallax();
    initHoverEffects();
    initKeyboardNavigation();
    initDynamicYear();

    console.log(
        "%cSNOW FALCON RACING",
        "font-size:20px;font-weight:900;color:#0066ff;"
    );

    console.log(
        "%cSFR OFFICIAL WEBSITE",
        "font-size:12px;color:#666;"
    );

});


/* =========================================================
   SCROLL REVEAL
========================================================= */

function initScrollReveal() {

    const elements = document.querySelectorAll(
        ".section, .about-card, .race-card, .stat-card, .member-card, .sponsor-item, .social-link"
    );

    if (!elements.length) return;


    /*
        Intersection Observer
        要素が画面に入ったら .visible を追加
    */

    const observer = new IntersectionObserver(
        (entries, observerInstance) => {

            entries.forEach((entry, index) => {

                if (!entry.isIntersecting) return;

                /*
                    少しずつ時間をずらして表示
                */

                entry.target.style.setProperty(
                    "--reveal-delay",
                    `${(index % 4) * 100}ms`
                );

                entry.target.classList.add("visible");

                observerInstance.unobserve(entry.target);

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -60px 0px"
        }
    );


    elements.forEach(element => {

        element.classList.add("reveal");

        observer.observe(element);

    });

}


/* =========================================================
   SMOOTH SCROLL
========================================================= */

function initSmoothScroll() {

    const links = document.querySelectorAll(
        'a[href^="#"]'
    );


    links.forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }


            const target = document.querySelector(targetId);

            if (!target) return;


            event.preventDefault();


            const header = document.querySelector(".site-header");

            const headerHeight =
                header ? header.offsetHeight : 0;


            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;


            window.scrollTo({

                top: targetPosition,

                behavior: "smooth"

            });


            /*
                モバイルメニューを閉じる
            */

            closeMobileMenu();

        });

    });

}


/* =========================================================
   MOBILE MENU
========================================================= */

function initMobileMenu() {

    const button =
        document.querySelector(".menu-button");

    const menu =
        document.querySelector(".mobile-menu");


    if (!button || !menu) return;


    button.addEventListener("click", () => {

        const isOpen =
            menu.classList.contains("active");


        if (isOpen) {

            closeMobileMenu();

        } else {

            openMobileMenu();

        }

    });


    /*
        メニュー外をクリックしたら閉じる
    */

    document.addEventListener("click", (event) => {

        if (
            !menu.classList.contains("active")
        ) {
            return;
        }


        if (
            !menu.contains(event.target) &&
            !button.contains(event.target)
        ) {

            closeMobileMenu();

        }

    });


    /*
        ESCキーで閉じる
    */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            closeMobileMenu();

        }

    });

}


function openMobileMenu() {

    const button =
        document.querySelector(".menu-button");

    const menu =
        document.querySelector(".mobile-menu");


    if (!button || !menu) return;


    button.classList.add("active");

    menu.classList.add("active");

    document.body.classList.add("menu-open");

}


function closeMobileMenu() {

    const button =
        document.querySelector(".menu-button");

    const menu =
        document.querySelector(".mobile-menu");


    if (!button || !menu) return;


    button.classList.remove("active");

    menu.classList.remove("active");

    document.body.classList.remove("menu-open");

}


/* =========================================================
   HEADER
========================================================= */

function initHeader() {

    const header =
        document.querySelector(".site-header");


    if (!header) return;


    let ticking = false;


    function updateHeader() {

        if (window.scrollY > 40) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }


        ticking = false;

    }


    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                window.requestAnimationFrame(
                    updateHeader
                );

                ticking = true;

            }

        },
        {
            passive: true
        }
    );


    updateHeader();

}


/* =========================================================
   NUMBER COUNTER
========================================================= */

function initCounters() {

    const counters =
        document.querySelectorAll(".number[data-target]");


    if (!counters.length) return;


    const counterObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;


                    const element =
                        entry.target;


                    animateCounter(element);


                    observer.unobserve(element);

                });

            },
            {
                threshold: 0.5
            }
        );


    counters.forEach(counter => {

        counterObserver.observe(counter);

    });

}


function animateCounter(element) {

    const target =
        parseInt(
            element.dataset.target,
            10
        );


    if (
        Number.isNaN(target) ||
        target <= 0
    ) {
        return;
    }


    const duration = 1800;

    const startTime =
        performance.now();


    function update(currentTime) {

        const elapsed =
            currentTime - startTime;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        /*
            easeOutCubic
        */

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const value =
            Math.floor(
                target * eased
            );


        element.textContent =
            value.toLocaleString("ja-JP");


        if (progress < 1) {

            requestAnimationFrame(update);

        } else {

            element.textContent =
                target.toLocaleString("ja-JP");

        }

    }


    requestAnimationFrame(update);

}


/* =========================================================
   HERO PARALLAX
========================================================= */

function initHeroParallax() {

    const hero =
        document.querySelector(".hero");


    if (!hero) return;


    /*
        モバイルでは負荷軽減のため無効
    */

    const isMobile =
        window.matchMedia(
            "(max-width: 768px)"
        ).matches;


    if (isMobile) return;


    let ticking = false;


    function updateHero() {

        const scrollY =
            window.scrollY;


        const heroHeight =
            hero.offsetHeight;


        if (
            scrollY <= heroHeight
        ) {

            /*
                背景グリッドを少し動かす
            */

            hero.style.setProperty(
                "--hero-scroll",
                `${scrollY * 0.15}px`
            );

        }


        ticking = false;

    }


    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                requestAnimationFrame(
                    updateHero
                );

                ticking = true;

            }

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   HOVER EFFECTS
========================================================= */

function initHoverEffects() {

    /*
        Member cards
    */

    const members =
        document.querySelectorAll(
            ".member-card"
        );


    members.forEach(card => {

        card.addEventListener(
            "mouseenter",
            () => {

                card.classList.add("hovered");

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.classList.remove("hovered");

            }
        );

    });


    /*
        Sponsor cards
    */

    const sponsors =
        document.querySelectorAll(
            ".sponsor-item"
        );


    sponsors.forEach(item => {

        item.addEventListener(
            "mouseenter",
            () => {

                item.classList.add("hovered");

            }
        );


        item.addEventListener(
            "mouseleave",
            () => {

                item.classList.remove("hovered");

            }
        );

    });

}


/* =========================================================
   KEYBOARD NAVIGATION
========================================================= */

function initKeyboardNavigation() {

    document.addEventListener(
        "keydown",
        event => {

            /*
                入力欄ではショートカットを無効化
            */

            const tag =
                document.activeElement?.tagName;


            if (
                tag === "INPUT" ||
                tag === "TEXTAREA" ||
                tag === "SELECT"
            ) {
                return;
            }


            /*
                H = Home
            */

            if (
                event.key === "h" ||
                event.key === "H"
            ) {

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }


            /*
                A = About
            */

            if (
                event.key === "a" ||
                event.key === "A"
            ) {

                scrollToSection(
                    "#about"
                );

            }


            /*
                R = Racing
            */

            if (
                event.key === "r" ||
                event.key === "R"
            ) {

                scrollToSection(
                    "#racing"
                );

            }


            /*
                T = Team
            */

            if (
                event.key === "t" ||
                event.key === "T"
            ) {

                scrollToSection(
                    "#members"
                );

            }

        }
    );

}


/* =========================================================
   SECTION SCROLL HELPER
========================================================= */

function scrollToSection(selector) {

    const target =
        document.querySelector(selector);


    if (!target) return;


    const header =
        document.querySelector(".site-header");


    const headerHeight =
        header ? header.offsetHeight : 0;


    const position =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;


    window.scrollTo({

        top: position,

        behavior: "smooth"

    });

}


/* =========================================================
   DYNAMIC YEAR
========================================================= */

function initDynamicYear() {

    const year =
        new Date().getFullYear();


    /*
        フッターの2026を現在年に変更
    */

    const footer =
        document.querySelector("footer");


    if (!footer) return;


    const footerText =
        footer.querySelector(
            ".footer-bottom span:first-child"
        );


    if (!footerText) return;


    footerText.textContent =
        `© ${year} Snow Falcon Racing`;

}


/* =========================================================
   PAGE LOAD EFFECT
========================================================= */

window.addEventListener(
    "load",
    () => {

        document.body.classList.add(
            "page-loaded"
        );

    }
);


/* =========================================================
   REDUCED MOTION
========================================================= */

const reducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


if (reducedMotion.matches) {

    document.documentElement.style
        .scrollBehavior = "auto";

}


/* =========================================================
   RESIZE HANDLER
========================================================= */

let resizeTimer;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(resizeTimer);


        resizeTimer = setTimeout(() => {

            /*
                PCへ戻ったときに
                メニュー状態をリセット
            */

            if (
                window.innerWidth > 768
            ) {

                closeMobileMenu();

            }

        }, 150);

    }
);


/* =========================================================
   SFR WEBSITE READY
========================================================= */

console.log(
    "%c⚡ SFR website initialized",
    "font-weight:bold;color:#0066ff;"
);
