// filters.js controls the active canvas filter

// default filter
window.activeFilter = "none";

// when user clicks the "Apply Filter" button
document.getElementById("apply-filter").addEventListener("click", () => {

    // cycle filters every click
    const filters = [
        "none",
        "grayscale(100%)",
        "sepia(100%)",
        "contrast(150%)",
        "brightness(150%)",
        "blur(3px)"
    ];

    // pick next filter
    let index = filters.indexOf(window.activeFilter);
    index = (index + 1) % filters.length;

    window.activeFilter = filters[index];

    drawMeme(); // re-render with new filter
});
