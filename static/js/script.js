// Keep the live app URL in one place; every attendance CTA reads this value.
const APP_URL = "https://snapclass-smart-ai.streamlit.app/";

document.querySelectorAll("[data-app-link]").forEach((link) => {
    link.href = APP_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
});

const navLinks = [...document.querySelectorAll(".nav-links a")];
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

// Reveal content as it enters the viewport and track the current nav section.
if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

    const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => {
                const active = link.getAttribute("href") === `#${entry.target.id}`;
                link.classList.toggle("active", active);
                if (active) link.setAttribute("aria-current", "location");
                else link.removeAttribute("aria-current");
            });
        });
    }, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });

    sections.forEach((section) => activeObserver.observe(section));
} else {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

const journeyTabs = [...document.querySelectorAll(".journey-tab")];
const journeyPanels = [...document.querySelectorAll(".journey-panel")];

// The journey tabs swap panels in place and support left/right keyboard control.
function selectJourney(tab) {
    journeyTabs.forEach((item) => {
        const selected = item === tab;
        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
    });

    journeyPanels.forEach((panel) => {
        panel.hidden = panel.id !== tab.getAttribute("aria-controls");
    });
}

journeyTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectJourney(tab));
    tab.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const nextTab = journeyTabs[(index + direction + journeyTabs.length) % journeyTabs.length];
        selectJourney(nextTab);
        nextTab.focus();
    });
});
