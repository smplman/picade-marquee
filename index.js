const ws281x = require('@gbkwiatt/node-rpi-ws281x-native');

// on / off
const state = process.argv[2];

console.log('setting state: ', state);
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
    if (i <= 8 || i > 24 && i < 32 || i >= 32 && i <= 40) {
      colorsArray[i] = 0xff0000;
    } else {
      // set right side to blue
      colorsArray[i] = 0x0000ff;
    }
  }
}

ws281x.render();
