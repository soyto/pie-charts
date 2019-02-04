import 'format-unicorn';

/**
 * Color class that helps
 */
class Color {

  /**
   * Constructor, expects that red green and blue params
   * @param red
   * @param green
   * @param blue
   */
  constructor(red, green, blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  /**
   * Returns new color with a darken value as the percent set
   * @param percent
   * @returns {Color}
   */
  darken(percent) {

    let acc = 0;

    //If percent is less than 0, use absolute value and acc will be 0
    if(percent < 0 ){
      acc = 255;
      percent *= -1;
    }

    let red = Math.round(((acc - this.red) * percent) + this.red);
    let green = Math.round(((acc - this.green) * percent) + this.green);
    let blue = Math.round(((acc - this.blue) * percent) + this.blue);

    red = Math.max(Math.min(red, 255), 0);
    green = Math.max(Math.min(green, 255), 0);
    blue = Math.max(Math.min(blue, 255), 0);

    return new Color(red, green, blue);
  }

  /**
   * Returns new color with a lighten value as the percent set
   * @param percent
   * @returns {Color}
   */
  lighten(percent) {
    return this.darken(percent * -1);
  }


  /**
   * To String method
   */
  toString() {
    return 'rgb({red}, {green}, {blue})'.formatUnicorn(this);
  }

  /**
   * Converts a color to a hexString
   * @returns {String}
   */
  toHexString() {

    let red = this.red.toString(16);
    let green = this.green.toString(16);
    let blue = this.blue.toString(16);

    return '#{red}{green}{blue}'.formatUnicorn({
      'red': (red.length == 1 ? '0': '') + red,
      'green': (green.length == 1 ? '0': '') + green,
      'blue': (blue.length == 1 ? '0': '') + blue,
    }).toUpperCase();
  }
}

/**
 * Retrieves a color from a hexColor
 * @param hexColor
 * @returns {Color}
 */
Color.fromHex = function(hexColor) {
  let results =  /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);

  return new Color(
      parseInt(results[1], 16),
      parseInt(results[2], 16),
      parseInt(results[3], 16));

};

export default Color;