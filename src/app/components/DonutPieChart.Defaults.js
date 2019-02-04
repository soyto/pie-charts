
const DEFAULT_VALUES = {
  'color': '#82d53d', //DEFAULT COLOR
  'inner_paths': {
    'length_percent': 2 //Percent of the radius that will be used for the inner paths
  },
  'label_text': {
    'color': '#999', //Font color of the label text
    'fontFamily': 'Arial', //Font family
    'fontSize': 12, //Font size
    'offsetY': -16 //Offset to set ip up
  },
  'label_value': {
    'color': '#444', //Font color of the label value
    'fontFamily': 'Arial', //Font family
    'fontSize': 18, //Font size
    'offsetY': 5 //Offset to set ot up
  },
  'circle': {
    'margin_percent': 0, //Margin percentage from radius
    'stroke_percent': 4.6 //Percentage of stroke givent he radius
  },
  'circle_path': {
    'maxAnimationTime': 500, //Max animation time when setting up the value
    'loading_angle': 90 //Which angle have while loading
  },
  'innerGraph': {
    'startAngle': -60, //Start angle
    'endAngle': 60, //End angle
    'maxPoints': 25, //Num max of points used
    'lineStrokeWidth': 2, //Stroke of the line
    'topMargin': 10, //Pixels of margin to center
    'innerGraphAlpha': .25 //Alpha used on the graph
  }
};

export default DEFAULT_VALUES;