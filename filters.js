window.activeFilter = "none";

document.getElementById("apply-filter").addEventListener("click", () => {
    const filters = [
        "none",
        "grayscale(100%)",
        "sepia(100%)",
        "contrast(150%)",
        "brightness(150%)",
        "blur(3px)"
    ];

    let index = filters.indexOf(window.activeFilter);
    index = (index + 1) % filters.length;

    window.activeFilter = filters[index];

    drawMeme();
});
