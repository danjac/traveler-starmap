import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';


//const HEIGHT = 91.14378277661477;
//const WIDTH = 91.14378277661477;
//const SIDE = 50.0;
const HEIGHT = 51.96152422706631;
const WIDTH = 51.96152422706631;
const SIDE = 30.0;


function pad(num) {
  let s = num + '';
  if (s.length === 1) {
    s = '0' + num;
  }
  return s;
}


class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Hexagon {
  constructor(row, col, x, y) {
    const x1 = (WIDTH - SIDE) / 2;
    const y1 = HEIGHT / 2;

    this.points = [
      new Point(x1 + x, y),
      new Point(x1 + SIDE + x, y),
      new Point(x + WIDTH, y1 + y),
      new Point(x1 + SIDE + x, HEIGHT + y),
      new Point(x1 + x, HEIGHT + y),
      new Point(x, y1 + y),
    ];

    let firstDigit = col + 1;
    let secondDigit = row;

    if (col % 2 === 0) {
      secondDigit = (row / 2) + 1;
    } else {
      secondDigit = ((row - (row % 2)) / 2) + 1;
    }

    this.id = pad(firstDigit) + pad(secondDigit);

    this.x = x;
    this.y = y;
    this.x1 = x1;
    this.y1 = y1;

    this.topLeft = new Point(this.x, this.y);
    this.bottomRight = new Point(this.x + WIDTH, this.y + HEIGHT);
    this.middle = new Point(this.x + (WIDTH / 2), this.y + (HEIGHT / 2));
  }

  draw(ctx) {
    ctx.strokeStyle = 'grey';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      const point = this.points[i];
      ctx.lineTo(point.x, point.y);
    }
    ctx.closePath();
    ctx.stroke();
    // add text. Right now just coordinates
    ctx.fillStyle = 'black';
    ctx.font = 'bolder 6pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseLine = 'middle';
    ctx.fillText(this.id, this.middle.x, this.middle.y - 10);
  }
}


class Grid {
  // this will take a list of worlds at some point
  // from this we can add the specific data
  constructor(width, height) {
    this.hexes = [];
    // fast look up by x/y coords
    this.hexesDict = {};

    let row = 0;
    let y = 0.0;

    while (y + HEIGHT <= height) {
      let col = 0;
      let offset = 0.0;
      if (row % 2 === 1) {
        offset = (WIDTH - SIDE) / 2 + SIDE;
        col = 1;
      }
      let x = offset;
      while (x + WIDTH <= width) {
        const hex = new Hexagon(row, col, x, y);
        this.hexes.push(hex);
        col += 2;
        x += WIDTH + SIDE;
      }
      row++;
      y += HEIGHT / 2;
    }
  }
  draw(ctx) {
    ctx.clearRect(0, 0, 800, 800);
    this.hexes.forEach(hex => hex.draw(ctx));
  }
}

class Starmap extends React.Component {

  componentDidMount() {
    this.paint(this.getDOMNode().getContext('2d'));
  }

  componentDidUpdate() {
    const ctx = this.getDOMNode().getContext('2d');
    this.paint(ctx);
  }

  getDOMNode() {
    return ReactDOM.findDOMNode(this);
  }

  paint(ctx) {
    this.grid = new Grid(360, 560);
    this.grid.draw(ctx);
  }

  render() {
    return <canvas width={360} height={550} />;
  }

}

Starmap.propTypes = {
};

export default Starmap;
