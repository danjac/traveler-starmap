import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';


const HEIGHT = 51.96152422706631;
const WIDTH = 51.96152422706631;
const MAP_HEIGHT = 560;
const MAP_WIDTH = 360;
const SIDE = 30.0;


const travelZoneColors = {
  Green: '#00ff00',
  Red: '#ff0000',
  Amber: '#FFBF00',
};

function pad(num) {
  let s = num + '';
  if (s.length === 1) {
    s = '0' + num;
  }
  return s;
}

function makeHexId(col, row) {
  const firstDigit = col + 1;
  let secondDigit = row;

  if (col % 2 === 0) {
    secondDigit = (row / 2) + 1;
  } else {
    secondDigit = ((row - (row % 2)) / 2) + 1;
  }

  return pad(firstDigit) + pad(secondDigit);
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Hexagon {
  constructor(id, world, isSelected, x, y) {
    this.id = id;
    this.world = world;
    this.isSelected = isSelected;

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

    this.x = x;
    this.y = y;
    this.x1 = x1;
    this.y1 = y1;

    this.topLeft = new Point(this.x, this.y);
    this.bottomRight = new Point(this.x + WIDTH, this.y + HEIGHT);
    this.middle = new Point(this.x + (WIDTH / 2), this.y + (HEIGHT / 2));
  }

  contains(x, y) {
    return (this.topLeft.x < x &&
      this.topLeft.y < y &&
      x < this.bottomRight.x &&
      y < this.bottomRight.y);
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
    if (this.isSelected) {
      ctx.fillStyle = '#D9EDF7';
      ctx.fill();
    }
    ctx.stroke();

    // add text. Right now just coordinates
    ctx.fillStyle = 'black';
    ctx.font = 'bolder 6pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseLine = 'middle';
    ctx.fillText(this.id, this.middle.x, this.middle.y - 10);

    if (this.world) {
      const zoneColor = travelZoneColors[this.world.travelZone];
      ctx.beginPath();
      ctx.fillText(this.world.starport, this.middle.x, this.middle.y);
      ctx.arc(this.middle.x, this.middle.y + 10, 5, 2 * Math.PI, false);
      // we'll make some amber/red later
      if (this.world.isSubsectorCapital) {
        ctx.fillStyle = '#000';
      } else {
        ctx.fillStyle = zoneColor;
      }
      ctx.fill();
      if (this.world.isSubsectorCapital) {
        ctx.strokeStyle = zoneColor;
        ctx.lineWidth = 1.5;
      } else {
        ctx.strokeStyle = '#003300';
        ctx.lineWidth = 0.5;
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
}


function createHexes(worlds, selected) {
  const hexes = [];
  const worldsDict = {};

  worlds.forEach(world => worldsDict[world.coords] = world);

  let row = 0;
  let y = 0.0;

  while (y + HEIGHT <= MAP_HEIGHT) {
    let col = 0;
    let offset = 0.0;
    if (row % 2 === 1) {
      offset = (WIDTH - SIDE) / 2 + SIDE;
      col = 1;
    }
    let x = offset;
    while (x + WIDTH <= MAP_WIDTH) {
      const hexId = makeHexId(col, row);
      const world = worldsDict[hexId];
      const isSelected = selected && world && selected.id === world.id;
      const hex = new Hexagon(hexId, world, isSelected, x, y);

      hexes.push(hex);
      col += 2;
      x += WIDTH + SIDE;
    }
    row++;
    y += HEIGHT / 2;
  }
  return hexes;
}


class Starmap extends React.Component {

  static propTypes = {
    worlds: PropTypes.array.isRequired,
    selected: PropTypes.object,
    onSelectWorld: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.state = {
      hexes: createHexes(this.props.worlds, this.props.selected),
    };
  }

  componentDidMount() {
    this.paint();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      hexes: createHexes(nextProps.worlds, nextProps.selected),
    });
  }

  componentDidUpdate() {
    this.paint();
  }

  onClick(event) {
    let totalOffsetX = 0;
    let totalOffsetY = 0;
    let element = event.currentTarget;

    while (element) {
      totalOffsetX += element.offsetLeft - element.scrollLeft;
      totalOffsetY += element.offsetTop - element.scrollTop;
      element = element.offsetParent;
    }

    const x = event.pageX - totalOffsetX - document.body.scrollLeft;
    const y = event.pageY - totalOffsetY - document.body.scrollTop;

    const hex = this.getHexByXY(x, y);
    if (hex && hex.world) {
      this.props.onSelectWorld(hex.world);
    }
  }

  getHexByXY(x, y) {
    for (let i = 0; i < this.state.hexes.length; i++) {
      const hex = this.state.hexes[i];
      if (hex.contains(x, y)) {
        return hex;
      }
    }
    return null;
  }

  getDOMNode() {
    return ReactDOM.findDOMNode(this);
  }

  paint() {
    const canvas = this.getDOMNode();
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.state.hexes.forEach(hex => hex.draw(ctx));
    ctx.restore();
  }

  render() {
    return (
      <canvas width={360} height={555} onClick={this.onClick} />
    );
  }

}

export default Starmap;
