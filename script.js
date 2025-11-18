// ============================
// CANVAS + VARIABLES
// ============================

const canvas = document.getElementById("meme-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

let currentImage = null;

// text objects for drag support
let topTextObj = {
    text: "",
    x: canvas.width / 2,
    y: 50,
    size: 30,
    color: "#FFFFFF"
};

let bottomTextObj = {
    text: "",
    x: canvas.width / 2,
    y: canvas.height - 30,
    size: 30,
    color: "#FFFFFF"
};

// allow dragManager.js to use these:
window.textObjects = [topTextObj, bottomTextObj];


// ============================
// IMAGE UPLOAD
// ============================

document.getElementById("image-upload").addEventListener("change", (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
            currentImage = img;
            drawMeme();
        };
    };
    reader.readAsDataURL(e.target.files[0]);
});


// ============================
// MAIN DRAW FUNCTION
// ============================

function drawMeme() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!currentImage) return;

    // apply active filter (from filters.js)
    ctx.filter = window.activeFilter;

    // draw main image
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);

    drawTextObject(topTextObj);
    drawTextObject(bottomTextObj);
}


// ============================
// DRAW TEXT OBJECT
// ============================

function drawTextObject(obj) {
    ctx.font = `${obj.size}px Impact`;
    ctx.textAlign = "center";
    ctx.fillStyle = obj.color;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;

    ctx.strokeText(obj.text, obj.x, obj.y);
    ctx.fillText(obj.text, obj.x, obj.y);
}


// ============================
// INPUT EVENTS FOR TEXT
// ============================

document.getElementById("top-text").addEventListener("input", (e) => {
    topTextObj.text = e.target.value.toUpperCase();
    drawMeme();
});

document.getElementById("bottom-text").addEventListener("input", (e) => {
    bottomTextObj.text = e.target.value.toUpperCase();
    drawMeme();
});

// font size
document.getElementById("font-size").addEventListener("input", (e) => {
    topTextObj.size = Number(e.target.value);
    bottomTextObj.size = Number(e.target.value);
    drawMeme();
});

// text color
document.getElementById("text-color").addEventListener("input", (e) => {
    topTextObj.color = e.target.value;
    bottomTextObj.color = e.target.value;
    drawMeme();
});


// ============================
// TEMPLATE CLICK HANDLER
// ============================

document.querySelectorAll(".template-img")?.forEach(img => {
    img.addEventListener("click", () => {
        currentImage = img;
        drawMeme();
    });
});


// ============================
// DOWNLOAD
// ============================

document.getElementById("download-btn").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});


// ============================
// RESET
// ============================

document.getElementById("reset-btn").addEventListener("click", () => {
    window.activeFilter = "none";
    topTextObj.text = "";
    bottomTextObj.text = "";
    
    drawMeme();
});

