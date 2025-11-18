let isDragging = false;
let activeObj = null;

canvas.addEventListener("mousedown", (e) => {
    const { x, y } = getPosition(e);

    window.textObjects.forEach(obj => {
        if (isInsideText(obj, x, y)) {
            activeObj = obj;
            isDragging = true;
        }
    });

    window.stickers.forEach(s => {
        if (s.contains(x, y)) {
            activeObj = s;
            isDragging = true;
        }
    });
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDragging || !activeObj) return;

    const { x, y } = getPosition(e);

    activeObj.x = x;
    activeObj.y = y;

    drawMeme();
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
    activeObj = null;
});

function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

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
canvas.addEventListener("wheel", (e) => {
    if (!activeObj) return;

    e.preventDefault();
    
    const delta = e.deltaY < 0 ? 5 : -5; // scroll up increases size
    if (activeObj instanceof Sticker) {
        activeObj.resize(delta);
    }
});

canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    const { x, y } = getPosition(e);

    // check for sticker
    for (let i = stickers.length - 1; i >= 0; i--) {
        if (stickers[i].contains(x, y)) {
            stickers.splice(i, 1);
            drawMeme();
            return;
        }
    }
});
