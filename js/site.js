document.addEventListener("DOMContentLoaded", () => {
    const revealItems = document.querySelectorAll(".reveal");
    const counterItems = document.querySelectorAll("[data-count]");
    const scrollButtons = document.querySelectorAll("[data-scroll-target]");
    const mediaButtons = document.querySelectorAll("[data-media-type]");
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    const navbarMenu = document.getElementById("navbarMenu");
    const navbarToggler = document.querySelector('.navbar-toggler[data-bs-toggle="collapse"]');
    const dropdowns = document.querySelectorAll(".navbar .dropdown");
    const accordionButtons = document.querySelectorAll('.accordion-button[data-bs-toggle="collapse"]');
    const mediaModalElement = document.getElementById("mediaModal");
    const mediaModalTitle = document.getElementById("mediaModalTitle");
    const mediaModalContent = document.getElementById("mediaModalContent");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.2 });

        revealItems.forEach((item) => revealObserver.observe(item));

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.7 });

        counterItems.forEach((item) => counterObserver.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
        counterItems.forEach((item) => animateCounter(item));
    }

    function animateCounter(element) {
        const rawValue = Number(element.dataset.count);

        if (!Number.isFinite(rawValue)) {
            return;
        }

        const suffix = element.textContent.replace(/[0-9]/g, "");
        const duration = 1400;
        const startTime = performance.now();

        function updateCounter(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(rawValue * eased);
            element.textContent = `${current}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = `${rawValue}${suffix}`;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    scrollButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const target = document.querySelector(button.dataset.scrollTarget);

            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    phoneLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (typeof window.gtag !== "function") {
                return;
            }

            window.gtag("event", "conversion", {
                send_to: "AW-17724601583/f6KuCOSCia0cEO_p34NC",
                value: 1.0,
                currency: "VND",
                transport_type: "beacon"
            });
        });
    });

    function closeAllDropdowns(exceptDropdown) {
        dropdowns.forEach((dropdown) => {
            if (dropdown === exceptDropdown) {
                return;
            }

            dropdown.classList.remove("show", "is-hover-open");
            const menu = dropdown.querySelector(".dropdown-menu");
            const toggle = dropdown.querySelector(".dropdown-toggle");

            if (menu) {
                menu.classList.remove("show");
            }

            if (toggle) {
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    function setNavbarOpen(isOpen) {
        if (!navbarMenu || !navbarToggler) {
            return;
        }

        navbarMenu.classList.toggle("show", isOpen);
        navbarToggler.setAttribute("aria-expanded", String(isOpen));

        if (!isOpen) {
            closeAllDropdowns();
        }
    }

    if (navbarToggler && navbarMenu) {
        navbarToggler.addEventListener("click", () => {
            const isOpen = !navbarMenu.classList.contains("show");
            setNavbarOpen(isOpen);
        });

        navbarMenu.querySelectorAll("a.nav-link:not(.dropdown-toggle), a.dropdown-item").forEach((link) => {
            link.addEventListener("click", () => {
                if (!window.matchMedia("(min-width: 992px)").matches) {
                    setNavbarOpen(false);
                }
            });
        });
    }

    dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector(".dropdown-toggle");
        const menu = dropdown.querySelector(".dropdown-menu");

        if (!toggle || !menu) {
            return;
        }

        let closeTimer;

        function clearCloseTimer() {
            if (closeTimer) {
                window.clearTimeout(closeTimer);
                closeTimer = null;
            }
        }

        function setDropdownState(isOpen, isHover) {
            dropdown.classList.toggle("show", isOpen);
            menu.classList.toggle("show", isOpen);
            dropdown.classList.toggle("is-hover-open", Boolean(isOpen && isHover));
            toggle.setAttribute("aria-expanded", String(isOpen));
        }

        function shouldUseHover() {
            return window.matchMedia("(min-width: 992px)").matches;
        }

        toggle.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            const isOpen = !dropdown.classList.contains("show");
            closeAllDropdowns(dropdown);
            setDropdownState(isOpen, false);
        });

        dropdown.addEventListener("mouseenter", () => {
            if (!shouldUseHover()) {
                return;
            }

            clearCloseTimer();
            closeAllDropdowns(dropdown);
            setDropdownState(true, true);
        });

        dropdown.addEventListener("mouseleave", () => {
            if (!shouldUseHover()) {
                return;
            }

            closeTimer = window.setTimeout(() => {
                setDropdownState(false, false);
            }, 120);
        });
    });

    document.addEventListener("click", (event) => {
        if (!event.target.closest(".navbar .dropdown")) {
            closeAllDropdowns();
        }
    });

    accordionButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetSelector = button.getAttribute("data-bs-target");
            const target = targetSelector ? document.querySelector(targetSelector) : null;

            if (!target) {
                return;
            }

            const isOpen = target.classList.contains("show");
            const parentSelector = target.getAttribute("data-bs-parent");

            if (!isOpen && parentSelector) {
                const parentElement = document.querySelector(parentSelector);

                if (parentElement) {
                    parentElement.querySelectorAll(".accordion-collapse.show").forEach((openItem) => {
                        if (openItem === target) {
                            return;
                        }

                        openItem.classList.remove("show");
                        const openButton = parentElement.querySelector(
                            `.accordion-button[data-bs-target="#${openItem.id}"]`
                        );

                        if (openButton) {
                            openButton.classList.add("collapsed");
                            openButton.setAttribute("aria-expanded", "false");
                        }
                    });
                }
            }

            target.classList.toggle("show", !isOpen);
            button.classList.toggle("collapsed", isOpen);
            button.setAttribute("aria-expanded", String(!isOpen));
        });
    });

    function openMediaModal() {
        if (!mediaModalElement) {
            return;
        }

        mediaModalElement.classList.add("show");
        mediaModalElement.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
    }

    function closeMediaModal() {
        if (!mediaModalElement || !mediaModalElement.classList.contains("show")) {
            return;
        }

        mediaModalElement.classList.remove("show");
        mediaModalElement.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");

        if (mediaModalContent) {
            mediaModalContent.innerHTML = "";
        }
    }

    mediaButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (!mediaModalElement || !mediaModalTitle || !mediaModalContent) {
                return;
            }

            const type = button.dataset.mediaType;
            const src = button.dataset.mediaSrc;
            const title = button.dataset.mediaTitle || "Thư viện công trình";
            const poster = button.dataset.mediaPoster || "";

            mediaModalTitle.textContent = title;
            mediaModalContent.innerHTML = "";

            if (type === "video") {
                const video = document.createElement("video");
                video.controls = true;
                video.autoplay = true;
                video.playsInline = true;
                video.preload = "none";
                if (poster) {
                    video.poster = poster;
                }

                const source = document.createElement("source");
                source.src = src;
                source.type = "video/mp4";
                video.appendChild(source);
                mediaModalContent.appendChild(video);
            } else {
                const image = document.createElement("img");
                image.src = src;
                image.alt = title;
                mediaModalContent.appendChild(image);
            }

            openMediaModal();
        });
    });

    if (mediaModalElement) {
        mediaModalElement.querySelectorAll('[data-bs-dismiss="modal"]').forEach((closeButton) => {
            closeButton.addEventListener("click", closeMediaModal);
        });

        mediaModalElement.addEventListener("click", (event) => {
            if (event.target === mediaModalElement) {
                closeMediaModal();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeAllDropdowns();
            closeMediaModal();
        }
    });

    if (document.body.getAttribute("data-bs-spy") === "scroll") {
        const navSelector = document.body.getAttribute("data-bs-target");
        const navElement = navSelector ? document.querySelector(navSelector) : null;
        const offset = Number(document.body.getAttribute("data-bs-offset")) || 110;

        if (navElement) {
            const spyItems = Array.from(navElement.querySelectorAll('a.nav-link[href^="#"]'))
                .map((link) => {
                    const href = link.getAttribute("href");
                    const section = href && href.length > 1 ? document.querySelector(href) : null;
                    return section ? { link, section } : null;
                })
                .filter(Boolean);

            if (spyItems.length > 0) {
                let ticking = false;

                function updateScrollSpy() {
                    ticking = false;
                    const scrollPosition = window.scrollY + offset + 12;
                    let activeItem = spyItems[0];

                    spyItems.forEach((item) => {
                        if (item.section.offsetTop <= scrollPosition) {
                            activeItem = item;
                        }
                    });

                    spyItems.forEach((item) => {
                        item.link.classList.toggle("active", item === activeItem);
                    });
                }

                window.addEventListener("scroll", () => {
                    if (!ticking) {
                        ticking = true;
                        requestAnimationFrame(updateScrollSpy);
                    }
                }, { passive: true });

                updateScrollSpy();
            }
        }
    }
});
