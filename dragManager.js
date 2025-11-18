// dragManager.js handles moving text around the canvas

let isDragging = false;
let activeObj = null;

canvas.addEventListener("mousedown", (e) => {
    const { x, y } = getPosition(e);

    // check if clicked on text
    window.textObjects.forEach(obj => {
        if (isInsideText(obj, x, y)) {
            activeObj = obj;
            isDragging = true;
        }
    });
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDragging || !activeObj) return;

    const { x, y } = getPosition(e);

    // Move text to new position
    activeObj.x = x;
    activeObj.y = y;

    drawMeme();
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
    activeObj = null;
});


// ============================
// HELPERS
// ============================

function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

// Detect if mouse is on text
function isInsideText(obj, x, y) {
    const width = obj.text.length * obj.size * 0.6;
    const height = obj.size;

    return (
        x >= obj.x - width / 2 &&
        x <= obj.x + width / 2 &&
        y >= obj.y - height &&
        y <= obj.y
    );
}
