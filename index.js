let canvas;
let ctx;

let start = null;

function init() {
    canvas = document.getElementById("image-canvas");
    ctx = canvas.getContext("2d");

    canvas.addEventListener("mousedown", function(event) {
        console.log("mousedown", event);
        start = getRelativeCoordinates(event, canvas);
    });

    canvas.addEventListener("mouseup", function(event) {
        console.log("mouseup", event);
        let end = getRelativeCoordinates(event, canvas);

        strokeRect(start, end);

        start = null;

    });

    canvas.addEventListener("mousemove", function(event) {
        if (start === null) return;

        console.log("mousemove", event);

        clear();

        let end = getRelativeCoordinates(event, canvas);
        strokeRect(start, end);
    });

    document.addEventListener("keydown", function(event) {
        console.log("keypress", event);
        if (event.key == "Escape") {
            clear();
        }
    });
}

function getRelativeCoordinates(event, element) {
    const rect = element.getBoundingClientRect();
    const x = event.x - rect.left;
    const y = event.y - rect.top;
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