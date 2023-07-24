
class LinearGradientHelper {
    
    context = null
    
    constructor(gradientColors) { // [ [color, % ie 0, 0.5, 1], [ ... ], ... ]
    const WIDTH = 101 // 0 to 100
    const HEIGHT = 1
    // Canvas
    const canvasElement = document.createElement("CANVAS");
    canvasElement.width = WIDTH;
    canvasElement.height = HEIGHT;
  
    this.context = canvasElement.getContext("2d",{willReadFrequently:true});
    
    // Gradient
    const gradient =this.context.createLinearGradient(0, 0, WIDTH, 0); // x0, y0, x1, y1
    
    gradientColors.forEach(val => {
      gradient.addColorStop(val[1], val[0]);
    });
  
    // Fill with gradient
    this.context.fillStyle = gradient;
    this.context.fillRect(0, 0, WIDTH, HEIGHT); // x, y, width, height
  }
  
  getColor(percent) // percent [0..100]
  {
    const color = this.context.getImageData(parseInt(percent), 0, 1, 1); // x, y, width, height
    const rgba = color.data;
    
    return `rgb(${ rgba[0] }, ${ rgba[1] }, ${ rgba[2] })`;
  }
}

// background: linear-gradient(90deg, #386657 0%, #85B87A 24.48%, #FFE600 51.56%, #BA4F1A 80.21%, #940023 100%);
const grad = new LinearGradientHelper([
  ['#00FF00', 0],
  ['#880000', .5],
  ['#220000', 1],
])


const container = document.querySelector('.container')
let size = 30

function populate(size) {
  container.style.setProperty('--size', size)
  for (let i = 0; i < size * size; i++) {
    const div = document.createElement('div')
    div.classList.add('pixel')

    container.appendChild(div)
  }
}


populate(size)


// PING

/**
 * Creates a Ping instance.
 * @returns {Ping}
 * @constructor
 */
var Ping = function(opt) {
    this.opt = opt || {};
    this.favicon = this.opt.favicon || "/favicon.ico";
    this.timeout = this.opt.timeout || 0;
    this.logError = this.opt.logError || false;
};

/**
 * Pings source and triggers a callback when completed.
 * @param {string} source Source of the website or server, including protocol and port.
 * @param {Function} callback Callback function to trigger when completed. Returns error and ping value.
 * @returns {Promise|undefined} A promise that both resolves and rejects to the ping value. Or undefined if the browser does not support Promise.
 */
Ping.prototype.ping = function(source, callback) {
    var promise, resolve, reject;
    if (typeof Promise !== "undefined") {
        promise = new Promise(function(_resolve, _reject) {
            resolve = _resolve;
            reject = _reject;
        });
    }

    var self = this;
    self.wasSuccess = false;
    self.img = new Image();
    self.img.onload = onload;
    self.img.onerror = onerror;

    var timer;
    var start = new Date();

    function onload(e) {
        self.wasSuccess = true;
        pingCheck.call(self, e);
    }

    function onerror(e) {
        self.wasSuccess = false;
        pingCheck.call(self, e);
    }

    if (self.timeout) {
        timer = setTimeout(function() {
            pingCheck.call(self, undefined);
    }, self.timeout); }


    /**
     * Times ping and triggers callback.
     */
    function pingCheck() {
        if (timer) { clearTimeout(timer); }
        var pong = new Date() - start;

        if (!callback) {
            if (promise) {
                return this.wasSuccess ? resolve(pong) : reject(pong);
            } else {
                throw new Error("Promise is not supported by your browser. Use callback instead.");
            }
        } else if (typeof callback === "function") {
            // When operating in timeout mode, the timeout callback doesn't pass [event] as e.
            // Notice [this] instead of [self], since .call() was used with context
            if (!this.wasSuccess) {
                if (self.logError) { console.error("error loading resource"); }
                if (promise) { reject(pong); }
                return callback("error", pong);
            }
            if (promise) { resolve(pong); }
            return callback(null, pong);
        } else {
            throw new Error("Callback is not a function.");
        }
    }

    console.log(source + self.favicon + "?" + (+new Date()));
    self.img.src = source + self.favicon + "?"+ "no-cache="+ (+new Date()); // Trigger image load with cache buster
    return promise;
};

if (typeof exports !== "undefined") {
    if (typeof module !== "undefined" && module.exports) {
        module.exports = Ping;
    }
} else {
    window.Ping = Ping;
}


// PING END


//pinging 


var settings = {
    timeout: 1000, // Optional.
    logError: true // Optional.
  }
  var p = new Ping(settings);

  let i = 0

  

  const printPing = (url) => {
    setInterval(()=>{
      p.ping(url, function(err, data) {
        if (err) {
          document.querySelectorAll(".pixel")[i].style.background = '#000'
        } else {
          document.querySelectorAll(".pixel")[i].style.background = grad.getColor(data/10)
        }
        i++
        if(i == size*size) i = 0
      });
    }, 1000)
  }
  
  printPing("./");
  