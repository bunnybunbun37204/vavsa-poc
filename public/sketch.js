//Created by kusakari
//https://twitter.com/kusakarism

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  setObject();
}

let _minW;
let _maxW;
let _palette0 = ["af3e4d", "2e86ab", "758e4f", "002a32", "f6ae2d", "fac9b8"];
let _count;
let _aryRing = [];
let _aryRotate = [];
let _aryAryRing = [];

// sketch.js

function setObject() {
  _count = 0;
  _minW = min(width, height) * 1;
  _maxW = max(width, height);
  rectMode(CENTER);
  ellipseMode(RADIUS);
  noFill();
  stroke(0, 60, 90);
  strokeWeight((_minW / 400) * pixelDensity()); //600 * pixelDensity());

  let numRing = 100;
  let posXy = createVector(0, 0);
  let posZNoiseInit_0 = [random(10000), random(10000), random(10000)];
  let rNoiseInit_0 = [random(10000), random(10000), random(10000)];
  let posRNoiseInit_0 = [random(10000), random(10000), random(10000)];
  let posZNoiseThetaInit = random(2 * PI);
  let rNoiseThetaInit = random(2 * PI);
  let posRNoiseThetaInit = random(2 * PI);
  let posZNoiseStep = 0.01 / 3;
  let rNoiseStep = 0.01 / 2; //0.2;
  let posRNoiseStep = 0.01 / 4; //0.2;
  let posZNoiseSpeed = (0.004 / 2) * random([-1, 1]);
  let rNoiseSpeed = (0.004 / 2) * random([-1, 1]);
  let posRNoiseSpeed = (0.004 / 3) * random([-1, 1]);
  let hi = _minW / 1; //1.5;
  shuffle(_palette0, true);
  _aryRing = [];
  for (let i = 0; i < numRing; i++) {
    let posZInit = (hi / numRing) * i;
    let posZNoiseInit = [
      posZNoiseInit_0[0],
      posZNoiseInit_0[1],
      posZNoiseInit_0[2] + posZNoiseStep * i,
    ];
    let rNoiseInit = [
      rNoiseInit_0[0],
      rNoiseInit_0[1],
      rNoiseInit_0[2] + rNoiseStep * i,
    ];
    let posRNoiseInit = [
      posRNoiseInit_0[0],
      posRNoiseInit_0[1],
      posRNoiseInit_0[2] + posRNoiseStep * i,
    ];

    _aryRing[i] = new Ring(
      posXy,
      hi,
      posZInit,
      posZNoiseInit,
      posZNoiseThetaInit,
      posZNoiseSpeed,
      rNoiseInit,
      rNoiseThetaInit,
      rNoiseSpeed,
      posRNoiseInit,
      posRNoiseThetaInit,
      posRNoiseSpeed,
      _palette0
    );
  }

  _aryRotate = [
    [random(2 * PI), random(0.01)],
    [random(2 * PI), random(0.01)],
    [random(2 * PI), random(0.01)],
  ];
}

class Ring {
  constructor(
    posXy,
    hi,
    posZInit,
    posZNoiseInit,
    posZNoiseThetaInit,
    posZNoiseSpeed,
    rNoiseInit,
    rNoiseThetaInit,
    rNoiseSpeed,
    posRNoiseInit,
    posRNoiseThetaInit,
    posRNoiseSpeed,
    palette
  ) {
    this.posXy = posXy;
    this.hi = hi;

    this.posZInit = posZInit;
    this.posZNoiseInit = posZNoiseInit;
    this.posZNoiseThetaInit = posZNoiseThetaInit;
    this.rNoiseInit = rNoiseInit;
    this.rNoiseThetaInit = rNoiseThetaInit;
    this.posRNoiseInit = posRNoiseInit;
    this.posRNoiseThetaInit = posRNoiseThetaInit;

    this.posZNoiseSpeed = posZNoiseSpeed;
    this.posZMax = hi / 4; //5;
    this.posZMin = -this.posZMax;
    this.posZGap = this.posZMax - this.posZMin;
    this.posZNoiseFreq = 4;

    this.rNoiseSpeed = rNoiseSpeed;
    this.rMax = _minW / 3;
    this.rMin = this.rMax / 100; //10;
    this.rGap = this.rMax - this.rMin;
    this.rNoiseFreq = 4;

    this.posRNoiseSpeed = posRNoiseSpeed;

    this.colNoiseFreq = 4; //3;

    this.rotZ = random(2 * PI);

    this.palette = palette;
    this.aryCol = [];
    for (let i = 0; i < this.palette.length; i++) {
      this.aryCol[i] = color("#" + this.palette[i]);
    }

    this.numCol = 5;

    this.count = 0;
  }

  draw() {
    let posZNoiseVal =
      sin(
        this.posZNoiseThetaInit +
          2 *
            PI *
            this.posZNoiseFreq *
            noise(
              this.posZNoiseInit[0] + this.posZNoiseSpeed * this.count,
              this.posZNoiseInit[1] + this.posZNoiseSpeed * this.count,
              this.posZNoiseInit[2]
            )
      ) *
        0.5 +
      0.5;
    let posZ = this.posZInit + this.posZMin + this.posZGap * posZNoiseVal;

    let rNoiseVal =
      sin(
        this.rNoiseThetaInit +
          2 *
            PI *
            this.rNoiseFreq *
            noise(
              this.rNoiseInit[0] + this.rNoiseSpeed * this.count,
              this.rNoiseInit[1] + this.rNoiseSpeed * this.count,
              this.rNoiseInit[2]
            )
      ) *
        0.5 +
      0.5;
    let r = this.rMin + this.rGap * rNoiseVal;

    let colNoiseVal =
      sin(
        this.posRNoiseThetaInit +
          2 *
            PI *
            this.colNoiseFreq *
            noise(
              this.posRNoiseInit[0] + this.posRNoiseSpeed * this.count + 1000,
              this.posRNoiseInit[1] + this.posRNoiseSpeed * this.count + 1000,
              this.posRNoiseInit[2] + 1000
            )
      ) *
        0.5 +
      0.5;
    let col_i1 = int(colNoiseVal * this.numCol);
    let col_i2 = (col_i1 + 1) % this.numCol;
    let colAmp = (colNoiseVal - col_i1 / this.numCol) * this.numCol;
    let col = lerpColor(this.aryCol[col_i1], this.aryCol[col_i2], colAmp);

    push();
    stroke(col);
    translate(this.posXy.x, this.posXy.y, posZ - this.hi / 2);
    rotateZ(this.rotZ);
    ellipse(0, 0, r, r, 50); //36);
    pop();

    this.count++;
  }
}

function draw() {
  ortho(-width / 2, width / 2, -height / 2, height / 2, -_maxW * 2, _maxW * 4);
  background((0 / 100) * 255);
  orbitControl();
  rotateX(PI / 3);

  for (let i = 0; i < _aryRing.length; i++) {
    _aryRing[i].draw();
  }
}

window.onresize = function () {
  // assigns new values for width and height variables
  resizeCanvas(window.innerWidth, window.innerHeight);
};
