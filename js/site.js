document.addEventListener("DOMContentLoaded", () => {
    const revealItems = document.querySelectorAll(".reveal");
    const counterItems = document.querySelectorAll("[data-count]");
    const scrollButtons = document.querySelectorAll("[data-scroll-target]");
    const mediaButtons = document.querySelectorAll("[data-media-type]");
    const hoverDropdowns = document.querySelectorAll(".navbar .dropdown");
    const mediaModalElement = document.getElementById("mediaModal");
    const mediaModalTitle = document.getElementById("mediaModalTitle");
    const mediaModalContent = document.getElementById("mediaModalContent");
    let mediaModal;

    if (mediaModalElement && window.bootstrap) {
        mediaModal = new bootstrap.Modal(mediaModalElement);
    }

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

    if (window.bootstrap) {
        hoverDropdowns.forEach((dropdown) => {
            const toggle = dropdown.querySelector(".dropdown-toggle");

            if (!toggle) {
                return;
            }

            const dropdownInstance = bootstrap.Dropdown.getOrCreateInstance(toggle);
            let closeTimer;

            function clearCloseTimer() {
                if (closeTimer) {
                    window.clearTimeout(closeTimer);
                    closeTimer = null;
                }
            }

            function shouldUseHover() {
                return window.matchMedia("(min-width: 992px)").matches;
            }

            dropdown.addEventListener("mouseenter", () => {
                if (!shouldUseHover()) {
                    return;
                }

                clearCloseTimer();
                dropdown.classList.add("is-hover-open");
                dropdownInstance.show();
            });

            dropdown.addEventListener("mouseleave", () => {
                if (!shouldUseHover()) {
                    return;
                }

                closeTimer = window.setTimeout(() => {
                    dropdown.classList.remove("is-hover-open");
                    dropdownInstance.hide();
                }, 120);
            });
        });
    }

    mediaButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (!mediaModal) {
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

            mediaModal.show();
        });
    });

    if (mediaModalElement) {
        mediaModalElement.addEventListener("hidden.bs.modal", () => {
            mediaModalContent.innerHTML = "";
        });
    }
});
