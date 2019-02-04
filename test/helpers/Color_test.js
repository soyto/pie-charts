import Color from '../../src/app/helpers/Color';

describe('helpers', () => {
  describe('Color', () => {

    it('Should exists', () => {
      expect(Color).toBeDefined();
      expect(Color).not.toBeNull();
    });

    describe('method#darken', () => {

      it('Should exists', () => {
        let color = new Color(255, 255, 255);

        expect(color.darken).toBeDefined();
      });

      it('25% white', () => {
        let color = new Color(255, 255, 255);
        let darkenColor = color.darken(.25);

        expect(darkenColor.red).toEqual(191);
        expect(darkenColor.green).toEqual(191);
        expect(darkenColor.blue).toEqual(191);
      });

      it('50% white', () => {
        let color = new Color(255, 255, 255);
        let darkenColor = color.darken(.5);

        expect(darkenColor.red).toEqual(128);
        expect(darkenColor.green).toEqual(128);
        expect(darkenColor.blue).toEqual(128);
      });

      it('75% white', () => {
        let color = new Color(255, 255, 255);
        let darkenColor = color.darken(.75);

        expect(darkenColor.red).toEqual(64);
        expect(darkenColor.green).toEqual(64);
        expect(darkenColor.blue).toEqual(64);
      });

      it('100% white', () => {
        let color = new Color(255, 255, 255);
        let darkenColor = color.darken(1);

        expect(darkenColor.red).toEqual(0);
        expect(darkenColor.green).toEqual(0);
        expect(darkenColor.blue).toEqual(0);
      });

      it('Black cannot be more dark', () => {
        let color = new Color(0, 0, 0);
        let darkenColor = color.darken(.5);

        expect(darkenColor.red).toEqual(0);
        expect(darkenColor.green).toEqual(0);
        expect(darkenColor.blue).toEqual(0);
      });

      it('Negative values lighten the color', () => {
        let color = new Color(0, 0, 0);
        let darkenColor = color.darken(- .5);

        expect(darkenColor.red).toEqual(128);
        expect(darkenColor.green).toEqual(128);
        expect(darkenColor.blue).toEqual(128);
      });
    });

    describe('method#ligthen', () => {

      it('Should exists', () => {
        let color = new Color(0, 0, 0);

        expect(color.lighten).toBeDefined();
      });

      it('25% black', () => {
        let color = new Color(0, 0, 0);
        let lightenColor = color.lighten(.25);

        expect(lightenColor.red).toEqual(64);
        expect(lightenColor.green).toEqual(64);
        expect(lightenColor.blue).toEqual(64);
      });

      it('50% black', () => {
        let color = new Color(0, 0, 0);
        let lightenColor = color.lighten(.5);

        expect(lightenColor.red).toEqual(128);
        expect(lightenColor.green).toEqual(128);
        expect(lightenColor.blue).toEqual(128);
      });

      it('75% black', () => {
        let color = new Color(0, 0, 0);
        let lightenColor = color.lighten(.75);

        expect(lightenColor.red).toEqual(191);
        expect(lightenColor.green).toEqual(191);
        expect(lightenColor.blue).toEqual(191);
      });

      it('100% black', () => {
        let color = new Color(0, 0, 0);
        let lightenColor = color.lighten(1);

        expect(lightenColor.red).toEqual(255);
        expect(lightenColor.green).toEqual(255);
        expect(lightenColor.blue).toEqual(255);
      });

      it('White cannot be more lighten', () => {
        let color = new Color(255, 255, 255);
        let lightenColor = color.lighten(.5);

        expect(lightenColor.red).toEqual(255);
        expect(lightenColor.green).toEqual(255);
        expect(lightenColor.blue).toEqual(255);
      });

      it('Negative values lighten the color', () => {
        let color = new Color(255, 255, 255);
        let lightenColor = color.lighten(- .5);

        expect(lightenColor.red).toEqual(128);
        expect(lightenColor.green).toEqual(128);
        expect(lightenColor.blue).toEqual(128);
      });
    });

    describe('method#toString', () => {

      it('Should exists', () => {
        let color = new Color(0, 0, 0);

        expect(color.toString).toBeDefined();
      });

      it('black test', () => {
        let color = new Color(0, 0, 0);

        expect(color.toString()).toBe('rgb(0, 0, 0)');
      });

      it('white test', () => {
        let color = new Color(255, 255, 255);

        expect(color.toString()).toBe('rgb(255, 255, 255)');
      });
    });

    describe('method#toHexString', () => {

      it('Should exists', () => {
        let color = new Color(0, 0, 0);

        expect(color.toHexString).toBeDefined();
      });

      it('black test', () => {
        let color = new Color(0, 0, 0);

        expect(color.toHexString()).toBe('#000000');
      });

      it('white test', () => {
        let color = new Color(255, 255, 255);

        expect(color.toHexString()).toBe('#FFFFFF');
      });

      it('Olive test', () => {
        let color = new Color(128, 128, 0);
        expect(color.toHexString()).toBe('#808000');
      });
      
    });

    describe('static method#fromHex', () => {

      it('Should exists', () => {
        expect(Color.fromHex).toBeDefined();
      });

      it('Black color test', () => {
        let color = Color.fromHex('#000000');

        expect(color.red).toBe(0);
        expect(color.blue).toBe(0);
        expect(color.green).toBe(0);
      });

      it('White color test', () => {
        let color = Color.fromHex('#FFFFFF');

        expect(color.red).toBe(255);
        expect(color.blue).toBe(255);
        expect(color.green).toBe(255);
      });

      it('Olive color test', () => {
        let color = Color.fromHex('#808000');

        expect(color.red).toBe(128);
        expect(color.green).toBe(128);
        expect(color.blue).toBe(0);
      });
    });

  });
});