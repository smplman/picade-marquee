const ws281x = require('@gbkwiatt/node-rpi-ws281x-native');
const gpio = require('rpi-gpio');
// on / off
const state = process.argv[2];

console.log('setting state: ', state);

// Button RGB
gpio.setup(16, gpio.DIR_OUT, write);

function write(err) {
    if (err) throw err;
    gpio.write(16, state === 'on' ? true : false, function(err) {
        if (err) throw err;
        console.log('Gpio 16 Buttons', state);
	return;
    });
}

// RGB Marquee
const color = state === 'on' ? 0xffffff : 0x00;

const options = {
  dma: 10,
  freq: 800000,
  gpio: 12,
  invert: false,
  brightness: 255,
  stripType: ws281x.stripType.WS2812
};

// 48 leds, 16 per row, 3 rows
const numLeds = 48;

const channel = ws281x(numLeds, options);

//console.log(channel);

const colorsArray = channel.array;

for (let i = 0; i < channel.count; i++) {
  if (state === 'off') {
    colorsArray[i] = color;
  } else {
    // set left side to red
    if (i < 8 || i > 23 && i < 32 || i >= 32 && i <= 40) {
      colorsArray[i] = 0xff0000;
    } else {
      // set right side to blue
      colorsArray[i] = 0x0000ff;
    }
  }
}

ws281x.render();
console.log('done');
// we need to manually exit after some time due to how rpi-gpio works
setTimeout(() => {
	process.exit();
}, 1000);
