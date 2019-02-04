import is from 'is_js';
import Color from '../helpers/Color';
import 'format-unicorn';
import DEFAULTS from './DonutPieChart.Defaults';

import {requestAnimationFrameHookInstance} from '../helpers/RequestAnimationFrameHook';

const svgNS = "http://www.w3.org/2000/svg";

/**
 * Class intended to build a canvas with the chart,
 *
 * Expects a DOM Element as constructor with some specified attributes:
 * - data-color: Hex value with the base color from the chart
 * - data-label: Label that will be used for the chart
 * - data-width: Width if wanted to override parent width
 * - data-currency: If setted up, specifies what's the currency that must be used for text
 *
 */
class DonutPieChart {

  /**
   * Chart constructor, receives the element where should hook the chart
   * @param element
   */
  constructor(element) {
    let $this = this;

    if(is.undefined(element) || is.null(element)) { throw new Error('element should not be null'); }
    if(!(element instanceof Element)) { throw new Error('element should be a DOMElement node'); }

    //Register node element
    this.node = element;

    //Data is null at the moment
    this.data = {
      'total': null,
      'smartphone': null,
      'tablet': null,
      'series': null
    };

    //Just to store the positions
    this.$$sizes = {
      'circle': {
        'stroke': {
          'width': null,
          'color': null
        },
        'center': {
          'x': null,
          'y': null
        },
        'radius': null,
        'margin': null
      },
      'circle_path': {
        'start_angle': null,
        'end_angle': null,
        'color': null,
        'start': {
          'x': null,
          'y': null
        },
        'end': {
          'x': null,
          'y': null
        }
      },
      'inner_paths': {
        'length': null,
        'color': null,
        'top': {
          'start': {
            'x': null,
            'y': null
          },
          'end': {
            'x': null,
            'y': null
          }
        },
        'right': {
          'start': {
            'x': null,
            'y': null
          },
          'end': {
            'x': null,
            'y': null
          }
        },
        'bottom': {
          'start': {
            'x': null,
            'y': null
          },
          'end': {
            'x': null,
            'y': null
          }
        },
        'left': {
          'start': {
            'x': null,
            'y': null
          },
          'end': {
            'x': null,
            'y': null
          }
        }
      },
      'inner_graph': {
        'values': [],
        'points': [],
        'radius': null,
        'maxHeight': null,
        'lineLenght': null
      }
    };

    //On state we will store current chart state
    this.$$state = {
      'loading': false,
      'angle': {
        'value': DEFAULTS.circle_path.loading_angle / 2
      },
      'animation': {
        'animating': false,
        'angleValue': null,
        'time': {
          'start': null,
          'end': null
        }
      }
    };

    //Extract properties
    _extractProperties.apply(this);

    //Set up the svg Item with the circle and so
    _setUpSVGItems.apply(this);

    //Chart should be loading till have the data
    _startLoading.apply(this);

    //Call to positionElements
    _positionElements.apply(this);
  }

  /**
   * Sets the series
   * @param series
   */
  setSeries(series) {

    this.$$state.loading = false;

    this.data.series = series;
    this.data.total = this.data.series.map(x => x.tablet + x.smartphone).reduce((acc, x) => acc + x);
    this.data.smartphone = this.data.series.map(x => x.smartphone).reduce((acc, x) => acc + x);
    this.data.tablet = this.data.series.map(x => x.tablet).reduce((acc, x) => acc + x);

    //Set the values
    _setValue_circle_path.apply(this);
    _setValue_label_value.apply(this);
    _setValue_innerGraph.apply(this);

    //Subscribe this to update each frame
    requestAnimationFrameHookInstance.subscribe(this, _onUpdate);

    //Indicate that should stop loading
    _stopLoading.apply(this);
  }
}

/**
 * Indicates that the pie should start loading
 * @private
 */
function _startLoading() {
  this.$$state.loading = true;
  this._elements.svg.classList.add('loading');
}

/**
 * Indicates that the pie chart must stop loading
 * @private
 */
function _stopLoading() {
  this.$$state.loading = false;
  this._elements.svg.classList.remove('loading');
}

/**
 * Extract properties
 * @private
 */
function _extractProperties() {

  this.color = DEFAULTS.color;
  this.accentColor = Color.fromHex(DEFAULTS.color).darken(.5).toHexString();
  this.label = null;
  this.width = this.node.offsetWidth;
  this.currency = null;

  //Has specified a color
  if(this.node.dataset.color) {
    this.color = this.node.dataset.color;
  }

  //Has specified accent color
  if(this.node.dataset.accentColor) {
    this.accentColor = this.node.dataset.accentColor;
  }

  //Has specified a label
  if(this.node.dataset.label) {
    this.label = this.node.dataset.label;
  }

  //has specified a width through data-width
  if(this.node.dataset.width) {
    let value = parseInt(this.node.dataset.width);

    if(!isNaN(value) && value != 0) {
      this.width = value;
    }
  }

  //Has specified a currency?
  if(this.node.dataset.currency) {
    this.currency = this.node.dataset.currency;
  }
}

/**
 * Set up SVG item
 * @private
 */
function _setUpSVGItems() {

  this._elements = {
    'svg': document.createElementNS(svgNS, 'svg'),
    'g_group': document.createElementNS(svgNS,'g'), //G-Group stands as graphic group
    'circle': document.createElementNS(svgNS, 'circle'),
    'circle_path': document.createElementNS(svgNS, 'path'),
    'innerPaths': {
      'group': document.createElementNS(svgNS,'g'),
      'top':  document.createElementNS(svgNS, 'path'),
      'left':  document.createElementNS(svgNS, 'path'),
      'right':  document.createElementNS(svgNS, 'path'),
      'bottom':  document.createElementNS(svgNS, 'path'),
    },
    'tc_group': document.createElementNS(svgNS, 'g'), //tc_group Stands as Text Center group

    'label_text': document.createElementNS(svgNS, 'text'),
    'label_value': document.createElementNS(svgNS, 'text'),
    'innerGraph': {
      'g': document.createElementNS(svgNS, 'g'),
      'path': document.createElementNS(svgNS, 'path'),
      'lines': []
    }
  };

  //Set up svg size
  this._elements.svg.style.width = '{0}px'.formatUnicorn(this.width);
  this._elements.svg.style.height = '{0}px'.formatUnicorn(this.width);
  this._elements.svg.classList.add('pie-chart');

  //Set up classNames
  this._elements.circle.classList.add('pie-circle');
  this._elements.circle_path.classList.add('pie-circle-path');
  this._elements.label_text.classList.add('pie-label');
  this._elements.label_value.classList.add('pie-value');
  this._elements.innerGraph.g.classList.add('pie-graph');

  //Append each inner path to it's group
  this._elements.innerPaths.group.appendChild(this._elements.innerPaths.top);
  this._elements.innerPaths.group.appendChild(this._elements.innerPaths.right);
  this._elements.innerPaths.group.appendChild(this._elements.innerPaths.bottom);
  this._elements.innerPaths.group.appendChild(this._elements.innerPaths.left);

  //Append elements to group
  this._elements.g_group.appendChild(this._elements.circle);
  this._elements.g_group.appendChild(this._elements.circle_path);
  this._elements.g_group.appendChild(this._elements.innerPaths.group);

  //Append innerGraph
  this._elements.innerGraph.g.appendChild(this._elements.innerGraph.path);

  //Loop for create 50 rects on innerGrahp
  for(let i = 0; i < DEFAULTS.innerGraph.maxPoints - 1; i++) {
    let rect = document.createElementNS(svgNS, 'path');
    this._elements.innerGraph.lines.push(rect);
    this._elements.innerGraph.g.appendChild(rect);
  }

  //Append elements to text center group
  this._elements.tc_group.appendChild(this._elements.label_text);
  this._elements.tc_group.appendChild(this._elements.label_value);

  //Append groups to the SVG
  this._elements.svg.appendChild(this._elements.g_group);
  this._elements.svg.appendChild(this._elements.tc_group);
  this._elements.svg.appendChild(this._elements.innerGraph.g);

  //Append svg to node
  this.node.appendChild(this._elements.svg);
}

/**
 * Set the position of the elements
 * @private
 */
function _positionElements() {
  _position_circle.apply(this);
  _position_circle_path.apply(this);
  _position_circle_innerPaths.apply(this);
  _position_label_text.apply(this);
  _position_label_value.apply(this);
  _position_innerGraph.apply(this);
}

/**
 * Sets the position of the circle
 * @private
 */
function _position_circle() {

  let circle = this._elements.circle;
  let circleSizes = this.$$sizes.circle;

  //Set stroke of the circle
  circleSizes.stroke.width = this.width * DEFAULTS.circle.stroke_percent * 0.01;
  circleSizes.stroke.color = this.color;
  circleSizes.margin = this.width * DEFAULTS.circle.margin_percent * 0.01;
  circleSizes.center.x = this.width / 2;
  circleSizes.center.y = this.width / 2;
  circleSizes.radius = (this.width / 2) - circleSizes.stroke.width - circleSizes.margin;


  //Set the circle properties
  circle.setAttribute('fill', 'none');
  circle.setAttribute('stroke', circleSizes.stroke.color);
  circle.setAttribute('stroke-width', circleSizes.stroke.width);
  circle.setAttribute('cx', circleSizes.center.x);
  circle.setAttribute('cy', circleSizes.center.y);
  circle.setAttribute('r', circleSizes.radius);
}

/**
 * Sets the position of the circle path
 * @private
 */
function _position_circle_path() {

  let circlePath = this._elements.circle_path;
  let circlePathSizes = this.$$sizes.circle_path;
  let circleSizes = this.$$sizes.circle;

  //If it's loading
  if(this.$$state.loading) {
    circlePathSizes.start_angle = (this.$$state.angle.value + 180) * (Math.PI / 180);
    circlePathSizes.end_angle = (this.$$state.angle.value - DEFAULTS.circle_path.loading_angle + 180) * (Math.PI / 180);
  }
  else {
    circlePathSizes.start_angle = 180 * (Math.PI / 180);
    circlePathSizes.end_angle = (360 - (this.$$state.angle.value + 180)) * (Math.PI / 180);
  }

  circlePathSizes.start.x = circleSizes.radius * Math.sin(circlePathSizes.start_angle) + circleSizes.center.x;
  circlePathSizes.start.y = circleSizes.radius * Math.cos(circlePathSizes.start_angle) + circleSizes.center.y;
  circlePathSizes.end.x = circleSizes.radius * Math.sin(circlePathSizes.end_angle) + circleSizes.center.x;
  circlePathSizes.end.y = circleSizes.radius * Math.cos(circlePathSizes.end_angle) + circleSizes.center.y;
  circlePathSizes.color = this.accentColor;

  let d = 'M{startX},{startY}A{radius},{radius},0,{biggerThan180},1,{endX},{endY}'.formatUnicorn({
    'startX': circlePathSizes.start.x,
    'startY': circlePathSizes.start.y,
    'radius': circleSizes.radius,
    'biggerThan180': this.$$state.angle.value > 180 ? 1 : 0,
    'endX': circlePathSizes.end.x,
    'endY': circlePathSizes.end.y,
  });

  //Indicate through css where is the transform origin
  circlePath.style.transformOrigin = '{0}px {1}px'.formatUnicorn(
      this.$$sizes.circle.center.x,
      this.$$sizes.circle.center.y
  );

  //Set the path
  circlePath.setAttribute('d', d);
  circlePath.setAttribute('fill', 'none');
  circlePath.setAttribute('stroke', circlePathSizes.color);
  circlePath.setAttribute('stroke-width', circleSizes.stroke.width);
}

/**
 * Position circle inner paths
 * @private
 */
function _position_circle_innerPaths() {

  let top = this._elements.innerPaths.top;
  let right = this._elements.innerPaths.right;
  let bottom = this._elements.innerPaths.bottom;
  let left = this._elements.innerPaths.left;

  let innerPathsSize = this.$$sizes.inner_paths;
  let topSize = this.$$sizes.inner_paths.top;
  let rightSize = this.$$sizes.inner_paths.right;
  let bottomSize = this.$$sizes.inner_paths.bottom;
  let leftSize = this.$$sizes.inner_paths.left;
  let circleSize = this.$$sizes.circle;

  innerPathsSize.length = this.width * DEFAULTS.inner_paths.length_percent * 0.01;
  innerPathsSize.color = Color.fromHex(this.color).darken(.5).toHexString();

  topSize.start.x = circleSize.center.x;
  topSize.start.y = circleSize.center.y - circleSize.radius + circleSize.stroke.width - 1;
  topSize.end.x = circleSize.center.x;
  topSize.end.y = circleSize.center.y - circleSize.radius + circleSize.stroke.width - 1 + innerPathsSize.length;

  rightSize.start.x = circleSize.center.x - circleSize.radius + circleSize.stroke.width - 1;
  rightSize.start.y = circleSize.center.y;
  rightSize.end.x = circleSize.center.x - circleSize.radius + circleSize.stroke.width - 1 + innerPathsSize.length;
  rightSize.end.y = circleSize.center.y;

  bottomSize.start.x = circleSize.center.x;
  bottomSize.start.y = circleSize.center.y + circleSize.radius - circleSize.stroke.width - 1;
  bottomSize.end.x = circleSize.center.x;
  bottomSize.end.y = circleSize.center.y + circleSize.radius - circleSize.stroke.width - 1 - innerPathsSize.length;

  leftSize.start.x = circleSize.center.x + circleSize.radius - circleSize.stroke.width - 1;
  leftSize.start.y = circleSize.center.y;
  leftSize.end.x = circleSize.center.x + circleSize.radius - circleSize.stroke.width - 1 - innerPathsSize.length;
  leftSize.end.y = circleSize.center.y;


  top.setAttribute('fill', 'none');
  top.setAttribute('stroke', innerPathsSize.color);
  top.setAttribute('stroke-width', '1');
  top.setAttribute('d', 'M{startX},{startY}L{endX},{endY}'.formatUnicorn({
    'startX': topSize.start.x,
    'startY': topSize.start.y,
    'endX': topSize.end.x,
    'endY': topSize.end.y
  }));

  right.setAttribute('fill', 'none');
  right.setAttribute('stroke', innerPathsSize.color);
  right.setAttribute('stroke-width', '1');
  right.setAttribute('d', 'M{startX},{startY}L{endX},{endY}'.formatUnicorn({
    'startX': rightSize.start.x,
    'startY': rightSize.start.y,
    'endX': rightSize.end.x,
    'endY': rightSize.end.y
  }));

  bottom.setAttribute('fill', 'none');
  bottom.setAttribute('stroke', innerPathsSize.color);
  bottom.setAttribute('stroke-width', '1');
  bottom.setAttribute('d', 'M{startX},{startY}L{endX},{endY}'.formatUnicorn({
    'startX': bottomSize.start.x,
    'startY': bottomSize.start.y,
    'endX': bottomSize.end.x,
    'endY': bottomSize.end.y
  }));

  left.setAttribute('fill', 'none');
  left.setAttribute('stroke', innerPathsSize.color);
  left.setAttribute('stroke-width', '1');
  left.setAttribute('d', 'M{startX},{startY}L{endX},{endY}'.formatUnicorn({
    'startX': leftSize.start.x,
    'startY': leftSize.start.y,
    'endX': leftSize.end.x,
    'endY': leftSize.end.y
  }));

}

/**
 * Sets the position of the label text
 * @private
 */
function _position_label_text() {

  let label_text = this._elements.label_text;

  let x = this.$$sizes.circle.center.x;
  let y = this.$$sizes.circle.center.y;

  y += DEFAULTS.label_text.offsetY;

  label_text.setAttribute('x', x);
  label_text.setAttribute('y', y);
  label_text.setAttribute('text-anchor', 'middle');
  label_text.setAttribute('font-family', DEFAULTS.label_text.fontFamily);
  label_text.setAttribute('font-size', DEFAULTS.label_text.fontSize);
  label_text.setAttribute('stroke', 'none');
  label_text.setAttribute('stroke-width', '0');
  label_text.setAttribute('fill', DEFAULTS.label_text.color);
  label_text.appendChild(document.createTextNode(this.label));
}

/**
 * Sets the position of the label value
 * @private
 */
function _position_label_value() {
  let label_value = this._elements.label_value;

  let x = this.$$sizes.circle.center.x;
  let y = this.$$sizes.circle.center.y;
  let width = label_value.getComputedTextLength();

  x -= width / 2;
  y += DEFAULTS.label_value.offsetY;

  label_value.setAttribute('x', x);
  label_value.setAttribute('y', y);
  label_value.setAttribute('text-anchor', 'start');
  label_value.setAttribute('font-family', DEFAULTS.label_value.fontFamily);
  label_value.setAttribute('font-size', DEFAULTS.label_value.fontSize);
  label_value.setAttribute('stroke', 'none');
  label_value.setAttribute('stroke-width', '0');
  label_value.setAttribute('fill', DEFAULTS.label_value.color);
  label_value.appendChild(document.createTextNode(''));
}

/**
 * Set's the position of the innerpath
 * @private
 */
function _position_innerGraph() {

  let color = Color.fromHex(this.color).lighten(.5);
  let innerGraph = this._elements.innerGraph;
  let innerPath = innerGraph.path;

  for(let i = 0; i < innerGraph.lines.length; i++) {
    innerGraph.lines[i].setAttribute('stroke', this.color);
    innerGraph.lines[i].setAttribute('stroke-width', DEFAULTS.innerGraph.lineStrokeWidth);
  }

  innerPath.setAttribute('fill', 'rgba({red},{green},{blue},{alpha})'.formatUnicorn({
    'red': color.red,
    'green': color.green,
    'blue': color.blue,
    'alpha': DEFAULTS.innerGraph.innerGraphAlpha
  }));

  innerPath.setAttribute('stroke-width', 0);

  //Set up the transform origin on the center of the circle
  innerGraph.g.style.transformOrigin = '{0}px {1}px'.formatUnicorn(
      this.$$sizes.circle.center.x,
      this.$$sizes.circle.center.y
  );
}

/**
 * Sets the value to the circle path
 * @private
 */
function _setValue_circle_path() {

  let percent = this.data.tablet * 100 / this.data.total;

  //Set animating values
  this.$$state.animation.time.start = null;
  this.$$state.animation.time.end = null;

  this.$$state.animation.angleValue = 360 * percent * 0.01;
  this.$$state.animation.animating = true;
  this.$$state.angle.value = 0;

  _position_circle_path.apply(this);
}

/**
 * Sets the value to the label value
 * @private
 */
function _setValue_label_value() {

  let strValue = null;

  //If there is a currency
  if(this.currency) {
    strValue = this.data.total.toLocaleString(navigator.language, {
      'style': 'currency',
      'currency': this.currency
    });
  }
  else {
    strValue = this.data.total.toLocaleString();
  }

  //Set the text content
  this._elements.label_value.firstChild.textContent = strValue;

  //Should reposition it cuz it's text has changed
  _position_label_value.apply(this);
}

/**
 * Sets the inner graph value
 * @private
 */
function _setValue_innerGraph() {

  let totalValues = this.data.series.map(x => x.tablet + x.smartphone);
  let maxValue = totalValues.reduce((acc, x) => Math.max(acc, x));

  let circleSize = this.$$sizes.circle;
  let innerPathsSize = this.$$sizes.inner_paths;
  let innerGraph = this._elements.innerGraph;
  let innerPath = innerGraph.path;

  //Calculate start and end angle in radians
  let startAngle = DEFAULTS.innerGraph.startAngle * (Math.PI / 180);
  let endAngle = DEFAULTS.innerGraph.endAngle * (Math.PI / 180);

  //What's the radius that we can use
  let radius = circleSize.radius - circleSize.stroke.width - innerPathsSize.length - 2;

  //Which is the start
  let start = {
    'x': radius * Math.sin(startAngle) + circleSize.center.x,
    'y': radius * Math.cos(startAngle) + circleSize.center.y
  };

  //Which is the end
  let end = {
    'x': radius * Math.sin(endAngle) + circleSize.center.x,
    'y': radius * Math.cos(endAngle) + circleSize.center.y
  };

  //What is the max height
  let maxHeight = start.y - circleSize.center.y - DEFAULTS.innerGraph.topMargin;

  //What is the length of each line
  let lineLength = (end.x - start.x) / (DEFAULTS.innerGraph.maxPoints - 1);

  //We need to reduce from 50 elements to xxx elements
  let values = _reduceDataSeries.apply(this, [totalValues, DEFAULTS.innerGraph.maxPoints]);

  //Extract what are the points
  let points = values.map((x, index) => {
    return {
      'x': start.x + (lineLength * (index)),
      'y': start.y - (x * maxHeight / maxValue)
    };
  });

  //Store values
  this.$$sizes.inner_graph.radius = radius;
  this.$$sizes.inner_graph.values = values;
  this.$$sizes.inner_graph.points = points;
  this.$$sizes.inner_graph.maxHeight = maxHeight;
  this.$$sizes.inner_graph.lineLenght = lineLength;

  //Set up the line paths
  for(let i = 0; i < innerGraph.lines.length; i++) {
    let startPoint = points[i];
    let endPoint = points[i + 1];

    let d = 'M{startX},{startY}L{endX},{endY}'.formatUnicorn({
      'startX': startPoint.x,
      'startY': startPoint.y,
      'endX': endPoint.x,
      'endY': endPoint.y
    });

    innerGraph.lines[i].setAttribute('d', d);
  }

  //Graph lines
  let linesD = points.map(x => 'L{endX},{endY}'.formatUnicorn({
    'endX': x.x,
    'endY': x.y
  })).join();

  //Set up the path
  let d = ('M{startX},{startY}' +
      'L{firstPointX},{firstPointY}' +
      '{linesD}' +
      'L{endX},{endY}' +
      'A{radius},{radius},0,0,1,{startX},{startY}').formatUnicorn({
    'startX': start.x,
    'startY': start.y,
    'firstPointX': points[0].x,
    'firstPointY': points[0].y,
    'endX': end.x,
    'endY': end.y,
    'linesD': linesD,
    'radius': radius,
  });

  innerPath.setAttribute('d', d);
}

/**
 * Reduces the data serie
 * @param serie
 * @param maxElements
 * @returns {Array}
 * @private
 */
function _reduceDataSeries(serie, maxElements) {

  let numAvgElements = Math.floor(serie.length / maxElements);

  let values = [];
  for(let i = 0; i < maxElements; i++) {

    //On the last element we add the restant elements
    if(i + 1 === maxElements) {
      let sum = 0;
      for(let j =  numAvgElements * i; j < serie.length; j++) {
        sum += serie[j];
      }
      values[i] = sum / (serie.length - (numAvgElements * i));
    }
    else {
      let sum = 0;
      for(let j= numAvgElements * i; j < numAvgElements * (i + 1); j++) {
        sum += serie[j];
      }
      values[i] = sum / numAvgElements;
    }
  }

  return values;
}

/**
 * Update function
 * @param timestamp
 * @private
 */
function _onUpdate(timestamp) {

  //If isn't animating, don't do nothing
  if(!this.$$state.animation.animating) { return; }

  //If we don't have timers set, on this update we will not do nothing
  if(!this.$$state.animation.time.start) {
    this.$$state.animation.time.start = timestamp;
    this.$$state.animation.time.end = timestamp + DEFAULTS.circle_path.maxAnimationTime;

    return;
  }

  //If we have passed our end, stop animating and reset values
  if(this.$$state.animation.time.end < timestamp) {
    this.$$state.animation.animating = false;
    this.$$state.angle.value = this.$$state.animation.angleValue;

    _position_circle_path.apply(this);

    //Also unsuscribe to avoid receive more updates
    requestAnimationFrameHookInstance.unsubscribe(this);
    return;
  }

  let deltaTotal = this.$$state.animation.time.end - this.$$state.animation.time.start;
  let currentDelta = timestamp - this.$$state.animation.time.start;
  this.$$state.angle.value = currentDelta * this.$$state.animation.angleValue / deltaTotal;

  //Update circle path
  _position_circle_path.apply(this);
}


export default DonutPieChart;