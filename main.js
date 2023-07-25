const log = (error) => {
  const div = document.createElement("div");
  div.style.color = "red";
  div.innerHTML = error;
  document.body.appendChild(div);
};
function createLinearGradientHelper(gradientColors) {
  try {
    const WIDTH = 101; // 0 to 100
    const HEIGHT = 1;

    // Canvas
    const canvasElement = document.createElement("CANVAS");
    canvasElement.width = WIDTH;
    canvasElement.height = HEIGHT;

    const context = canvasElement.getContext("2d", {
      willReadFrequently: true,
    });

    // Gradient
    const gradient = context.createLinearGradient(0, 0, WIDTH, 0); // x0, y0, x1, y1

    gradientColors.forEach((val) => {
      gradient.addColorStop(val[1], val[0]);
    });

    // Fill with gradient
    context.fillStyle = gradient;
    context.fillRect(0, 0, WIDTH, HEIGHT); // x, y, width, height

    function getColor(percent) {
      const color = context.getImageData(parseInt(percent), 0, 1, 1); // x, y, width, height
      const rgba = color.data;

      return `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`;
    }

    return {
      getColor,
    };
  } catch (error) {
    log(error);
  }
}

const grad = createLinearGradientHelper([
  ["#000", 0],
  ["#FFF", 1],
]);

let size = 60;

function populate(size) {
  try {
    const container = document.querySelector(".container");
    for (let i = 0; i < size * size; i++) {
      const div = document.createElement("div");
      div.classList.add("pixel");

      container.appendChild(div);
    }
  } catch (error) {
    log(error);
  }
}

populate(size);

async function fetchWithTimeout(resource, options = {}) {
  try {
    const { timeout = 1000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    log(error);
  }
}

async function checkResponseTime(testURL, options) {
  try {
    let time1 = performance.now();
    const res = await fetchWithTimeout(testURL, options);
    if (!res.ok) {
      return 0;
    }
    let time = performance.now() - time1;
    const timeout = options?.timeout || 1000;
    return time > timeout ? timeout : time;
  } catch (error) {
    log(error);
    return 0;
  }
}

let i = 0;

const printPing = (host) => {
  try {
    const timeout = 1000;
    setInterval(async () => {
      const url = host + "/favicon.ico?no-cache=" + +new Date();
      const data = await checkResponseTime(url, { timeout });
      const elements = document.querySelectorAll(".pixel");
      if (data === 0) {
        elements[i].style.background = "#a00";
      } else {
        elements[i].style.background = grad.getColor((data / timeout) * 100);
      }
      i++;
      if (i == size * size) i = 0;
      elements[i].style.background = "rgb(61, 61, 61)";
    }, timeout);
  } catch (error) {
    log(error);
  }
};

printPing(".");
// printPing("https://www.google.com");
