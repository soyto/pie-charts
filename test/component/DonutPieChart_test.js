import DonutPieChart from '../../src/app/components/DonutPieChart';
import DEFAULTS from '../../src/app/components/DonutPieChart.Defaults';

describe('components', () => {
  describe('DonutPieChart', () => {

    let domElement = document.createElement('div');
    let mainNode = null;
    document.body.append(domElement);

    beforeEach(() => {
      mainNode = document.createElement('div');
      domElement.appendChild(mainNode);
    });

    //After each remove domElement node childs
    afterEach(() => {
      while(domElement.firstChild) {
        domElement.removeChild(domElement.firstChild);
      }
    });

    it('Should exists', () => expect(DonutPieChart).toBeDefined());

    describe('#constructor', () => {

      it('should throw Error if no argument', () => expect(() => new DonutPieChart()).toThrowError());

      it('should throw Error if argument isn\'t an Element', () => {
        expect(() => new DonutPieChart('asdasd')).toThrowError();
      });

      it('should go fine if argument is an Element and register as own property', () => {
        let chart = new DonutPieChart(mainNode);
        expect(chart.node).toBe(mainNode);
      });

      describe('width', () => {

        describe('should be the same as the nodeElement', () => {

          //TODO: Jasmine has some troubles to set up width and height of element, that's why this 2 tests are commented

          /*it('specified as width attribute', () => {
            let width = 100;
            mainNode.setAttribute('width', width + 'px');
            let chart = new DonutPieChart(mainNode);
            expect(chart.width).toBe(width);
          });

          it('specified as style', () => {
            let width = 100;
            mainNode.style.width = width + 'px';

            let chart = new DonutPieChart(mainNode);
            expect(chart.width).toBe(width);
          }); */
        });

        describe('specified as data-width attribute', () => {

          it('if is not integer, should take parent width', () => {
            let width = 'asdasd';
            mainNode.dataset.width = width;
            let chart = new DonutPieChart(mainNode);

            //TODO As explained above, jasmine has some troubles setting width
            expect(chart.width).toBe(0);
          });

          it('if is integer, should take it', () => {
            let width = 100;
            mainNode.dataset.width = width;
            let chart = new DonutPieChart(mainNode);
            expect(chart.width).toBe(width);
          });

        });
      });

      describe('color', () => {

        it('should have a default color', () => {

          let chart = new DonutPieChart(mainNode);
          expect(chart.color).toBe('#82d53d');
        });

        describe('data-color is set must register as property', () => {
          it('as attribute', () => {
            let color = '#FF0000';
            mainNode.setAttribute('data-color', color);
            let chart = new DonutPieChart(mainNode);
            expect(chart.color).toBe(color);
          });

          it('as dataset', () => {
            let color = '#FF0000';
            mainNode.dataset.color = color;
            let chart = new DonutPieChart(mainNode);
            expect(chart.color).toBe(color);
          });
        });
      });

      describe('data-label is set must register as property', () => {
        it('as attribute', () => {
          let label = 'Revenues';
          mainNode.setAttribute('data-label', label);
          let chart = new DonutPieChart(mainNode);
          expect(chart.label).toBe(label);
        });

        it('as dataset', () => {
          let label = 'Revenues';
          mainNode.dataset.label = label;
          let chart = new DonutPieChart(mainNode);
          expect(chart.label).toBe(label);
        });
      });
    });

    describe('#setSeries', () => {

      let data = [];

      for(let i = 0; i < 50; i++) { data[i] = {
        'smartphone': 100,
        'tablet': 100
      }; }

      describe('should average values', () => {

        it('must have the specified length', () => {
          let chart = new DonutPieChart(mainNode);
          chart.setSeries(data);

          expect(chart.$$sizes.inner_graph.values.length).toBe(DEFAULTS.innerGraph.maxPoints);
        });

        it('must have the same value', () => {
          let chart = new DonutPieChart(mainNode);
          chart.setSeries(data);

          for(let value of chart.$$sizes.inner_graph.values) {
            expect(value).toBe(200);
          }
        });

        it('if there are less than 50 items, should have same average', ()=> {
          let chart = new DonutPieChart(mainNode);
          chart.setSeries(data.slice(0, 30));

          for(let value of chart.$$sizes.inner_graph.values) {
            expect(value).toBe(200);
          }
        });
      });

    });

    document.body.removeChild(domElement);
  });
});