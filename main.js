var log = function(error) {
  // const div = document.createElement("div");
  // div.style.color = "red";
  // div.innerHTML = error;
  // document.body.appendChild(div);
  co1nsole.error(error);
};

var createLinearGradientHelper = function(gradientColors) {
  try {
    var WIDTH = 101; // 0 to 100
    var HEIGHT = 1;

    // Canvas
    var canvasElement = document.createElement('CANVAS');
    canvasElement.width = WIDTH;
    canvasElement.height = HEIGHT;

    var context = canvasElement.getContext('2d', {
      willReadFrequently: true,
    });

    // Gradient
    var gradient = context.createLinearGradient(0, 0, WIDTH, 0); // x0, y0, x1, y1

    gradientColors.forEach(function(val) {
      gradient.addColorStop(val[1], val[0]);
    });

    // Fill with gradient
    context.fillStyle = gradient;
    context.fillRect(0, 0, WIDTH, HEIGHT); // x, y, width, height

    var getColor = function(percent) {
      var color = context.getImageData(parseInt(percent), 0, 1, 1); // x, y, width, height
      var rgba = color.data;

      return 'rgb(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ')';
    };

    return {
      getColor: getColor,
    };
  } catch (error) {
    log(error);
  }
};

var grad = createLinearGradientHelper([
  ['#000', 0],
  ['#FFF', 1],
]);

var size = 60;

var populate = function(size) {
  try {
    var container = document.querySelector('.container');
    for (var i = 0; i < size * size; i++) {
      var div = document.createElement('div');
      div.classList.add('pixel');
      container.appendChild(div);
    }
  } catch (error) {
    log(error);
  }
};

populate(size);

var fetchWithTimeout = function(resource, options) {
  if (options === void 0) {
    options = {};
  }

  return new Promise(function(resolve, reject) {
    var timeout = options.timeout || 1000;
    var controller = new AbortController();
    var id = setTimeout(function() {
      controller.abort();
    }, timeout);

    fetch(resource, Object.assign({}, options, { signal: controller.signal }))
      .then(function(response) {
        clearTimeout(id);
        resolve(response);
      })
      .catch(function(error) {
        clearTimeout(id);
        reject(error);
      });
  }).catch(function(error) {
    log(error);
  });
};

var checkResponseTime = function(testURL, options) {
  try {
    var time1 = performance.now();
    return fetchWithTimeout(testURL, options)
      .then(function(res) {
        if (!res.ok) {
          return 0;
        }
        var time = performance.now() - time1;
        var timeout = (options && options.timeout) || 1000;
        return time > timeout ? timeout : time;
      })
      .catch(function(error) {
        log(error);
        return 0;
      });
  } catch (error) {
    log(error);
  }
};

var i = 0;

var printPing = function(host) {
  try {
    var timeout = 1000;
    setInterval(function() {
      var url = host + '/favicon.ico?no-cache=' + +new Date();
      checkResponseTime(url, { timeout: timeout }).then(function(data) {
        var elements = document.querySelectorAll('.pixel');
        if (data === 0) {
          elements[i].style.background = '#a00';
        } else {
          elements[i].style.background = grad.getColor((data / timeout) * 100);
        }
        i++;
        if (i == size * size) i = 0;
        elements[i].style.background = 'rgb(61, 61, 61)';
      });
    }, timeout);
  } catch (error) {
    log(error);
  }
};

//printPing('.');
printPing('https://www.google.com');
