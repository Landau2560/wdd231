const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#primary-navigation");

menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute(
        "aria-expanded",
        isOpen.toString()
    );

    menuButton.setAttribute(
        "aria-label",
        isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
    );

    menuButton.querySelector("span").textContent =
        isOpen ? "x" : "=";
});

window.addEventListener("resize", () => {
    if (window.innerWidth >= 700) {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );
        menuButton.querySelector("span").textContent = "=";
    }
});