let canvas;
let ctx;
let coords;

let drawing = false;
let square = null;
let image = null;
let scale = 1;
let translateX = 0;
let translateY = 0;

window.addEventListener("load", pageLoaded);

function pageLoaded() {
    image = new Image();
    image.addEventListener("load", init);
    image.src = "cat.jpg";
}

function init() {
    coords = document.getElementById("coords");
    canvas = document.getElementById("image-canvas");
    ctx = canvas.getContext("2d");

    canvas.addEventListener("mousedown", function(event) {
        console.log("mousedown", event);
        ctx.restore();
        const start = getRelativeCoordinates(event, canvas);
        square = { start, end: start };
        drawing = true;
    });

    canvas.addEventListener("mouseup", function(event) {
        if (!drawing) return;

        console.log("mouseup", event);
        square.end = getRelativeCoordinates(event, canvas);
        draw();
        drawing = false;
    });

    canvas.addEventListener("mousemove", function(event) {
        updateCoordinates(event);

        if (!drawing) return;

        console.log("mousemove", event);
        square.end = getRelativeCoordinates(event, canvas);
        draw();
    });

    document.addEventListener("keydown", function(event) {
        console.log("keypress", event);
        if (event.key === "Escape") {
            clear();
        }
        else if (event.key === "ArrowUp") {
            translateY += 10;
            draw();
        }
        else if (event.key === "ArrowDown") {
            translateY -= 10;
            draw();
        }
        else if (event.key === "ArrowLeft") {
            translateX += 10;
            draw();
        }
        else if (event.key === "ArrowRight") {
            translateX -= 10;
            draw();
        }
    });

    draw();
}

function updateCoordinates(mouseEvent) {
    const mouseCoords = { x: mouseEvent.x, y: mouseEvent.y };
    const canvasCoords = { x: mouseCoords.x - canvas.offsetLeft, y: mouseCoords.y - canvas.offsetTop };
    const scaledCoords = { x: canvasCoords.x / scale, y: canvasCoords.y / scale };
    coords.innerText =
        "Global: (" + mouseCoords.x + ", " + mouseCoords.y + "); " + 
        "Canvas: (" + canvasCoords.x + ", " + canvasCoords.y + ")" + "; " +
        "Scaled: (" + scaledCoords.x + ", " + scaledCoords.y + ")";
}

function draw() {
    clear();
    drawImage();
    strokeRect({ x: 5, y: 5 }, { x: canvas.width - 5, y: canvas.height - 5 });
    if (square) {
        strokeRect(square.start, square.end);
    }
}

function zoomIn() {
    scale = scale * 2;
    ctx.scale(2, 2);
    draw();
    console.log("zoomIn");
}

function zoomOut() {
    scale = scale * 0.5;
    ctx.scale(0.5, 0.5);
    draw();
    console.log("zoomOut");
}

function getRelativeCoordinates(event) {
    const eventX = event.x - canvas.offsetLeft;
    const eventY = event.y - canvas.offsetTop;
    const x = eventX / scale - translateX;
    const y = eventY / scale - translateY;
    return { x, y };
}

function drawImage() {
    ctx.save();
    const x = (canvas.clientWidth - image.width) / 2 + translateX;
    const y  = (canvas.clientHeight - image.height) / 2 + translateY;
    ctx.translate(x, y);
    ctx.drawImage(image, 0, 0);
    ctx.restore();
}

function strokeRect(start, end) {
    let x, y;
    if (start.x < end.x) {
        x = start.x;
    } else {
        x = end.x;
    }

    if (start.y < end.y) {
        y = start.y;
    } else {
        y = end.y;
    }

    width = Math.abs(end.x - start.x);
    height = Math.abs(end.y- start.y);

    ctx.save();
    ctx.translate(translateX, translateY);
    ctx.fillStyle = "rgb(200 0 0)";
    ctx.strokeRect(x, y, width, height);
    ctx.restore();

    console.log("strokeRect", x, y, width, height);
}

function clear() {
    ctx.save();
    // This is a hack to clear the canvas when zoomed out
    ctx.scale(1 / scale, 1 / scale);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}
