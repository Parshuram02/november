// ============================
// CANVAS + VARIABLES
// ============================

const canvas = document.getElementById("meme-canvas");
const ctx = canvas.getContext("2d");

window.canvas = canvas;
window.ctx = ctx;

canvas.width = 800;
canvas.height = 500;

let currentImage = null;

// text objects
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
// DRAW FUNCTION (MAIN ENGINE)
// ============================

function drawMeme() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!currentImage) return;

    ctx.filter = window.activeFilter;

    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);

    drawTextObject(topTextObj);
    drawTextObject(bottomTextObj);

    stickers.forEach(s => s.draw());
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

document.getElementById("font-size").addEventListener("input", (e) => {
    topTextObj.size = Number(e.target.value);
    bottomTextObj.size = Number(e.target.value);
    drawMeme();
});

document.getElementById("text-color").addEventListener("input", (e) => {
    topTextObj.color = e.target.value;
    bottomTextObj.color = e.target.value;
    drawMeme();
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
    stickers.length = 0;
    drawMeme();
});


// ============================
// STICKERS
// ============================

let stickers = [];
window.stickers = stickers;

class Sticker {
    constructor(content, x, y, size = 100, isImage = false) {
        this.content = content;
        this.x = x;
        this.y = y;
        this.size = size;
        this.isImage = isImage;

        if (isImage) {
            this.img = new Image();
            this.img.src = content;
        }
    }

    draw() {
        if (this.isImage) {
            ctx.drawImage(
                this.img,
                this.x - this.size / 2,
                this.y - this.size / 2,
                this.size,
                this.size
            );
        } else {
            ctx.font = `${this.size}px serif`;
            ctx.fillText(this.content, this.x, this.y);
        }
    }

    contains(mx, my) {
        return (
            mx >= this.x - this.size / 2 &&
            mx <= this.x + this.size / 2 &&
            my >= this.y - this.size / 2 &&
            my <= this.y + this.size / 2
        );
    }

    resize(amount) {
        this.size = Math.min(Math.max(this.size + amount, 20), 400); 
        drawMeme();
    }
}


document.querySelectorAll(".sticker-item").forEach(item => {
    item.addEventListener("click", () => {
        let st = new Sticker(item.textContent, canvas.width/2, canvas.height/2);
        stickers.push(st);
        drawMeme();
    });
});


// ============================
// SAVE PROJECT
// ============================

document.getElementById("save-btn").addEventListener("click", () => {
    if (!currentImage) return alert("Upload an image first!");

    const saved = {
        image: currentImage.src,
        topTextObj,
        bottomTextObj,
        stickers,
        filter: window.activeFilter || "none"
    };

    localStorage.setItem("savedMeme", JSON.stringify(saved));
    alert("Project saved!");
});


// ============================
// LOAD PROJECT
// ============================

document.getElementById("load-btn").addEventListener("click", () => {
    const data = localStorage.getItem("savedMeme");
    if (!data) return alert("No saved project found!");

    const project = JSON.parse(data);

    const img = new Image();
    img.src = project.image;

    img.onload = () => {
        currentImage = img;

        topTextObj = project.topTextObj;
        bottomTextObj = project.bottomTextObj;

        stickers.length = 0;
        project.stickers.forEach(s => {
            stickers.push(new Sticker(s.emoji, s.x, s.y, s.size));
        });

        window.textObjects = [topTextObj, bottomTextObj];
        window.stickers = stickers;
        window.activeFilter = project.filter;

        drawMeme();
    };
});
