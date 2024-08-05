let canvas;
let ctx;
let coords;

let drawing = false;
let square = null;
let scale = 1;

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
            ctx.translate(0, -10);
            draw();
        }
        else if (event.key === "ArrowDown") {
            ctx.translate(0, 10);
            draw();
        }
        else if (event.key === "ArrowLeft") {
            ctx.translate(-10, 0);
            draw();
        }
        else if (event.key === "ArrowRight") {
            ctx.translate(10, 0);
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
    const x = eventX / scale;
    const y = eventY / scale;
    return { x, y };
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

    ctx.fillStyle = "rgb(200 0 0)";
    ctx.strokeRect(x, y, width, height);

    console.log("strokeRect", x, y, width, height);
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener("load", init);