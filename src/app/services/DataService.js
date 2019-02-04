import moment from 'moment';

const DEFAULTS = {
  'revenue': {
    'smartphone': {
      'mimimal': 0,
      'random': 6000
    },
    'tablet': {
      'mimimal': 0,
      'random': 6000
    }
  },
  'impressions': {
    'smartphone': {
      'mimimal': 0,
      'random': 3000
    },
    'tablet': {
      'mimimal': 0,
      'random': 6000
    }
  },
  'visits': {
    'smartphone': {
      'mimimal': 900,
      'random': 6000
    },
    'tablet': {
      'mimimal': 0,
      'random': 6000
    }
  },
  'timer': {
    'minimal': 1500,
    'random': 1500
  }
};


/**
 * Data Service class.
 *
 * ATM is a mock class that return data
 */
class DataService {

  /**
   * Constructor (empty at the moment)
   */
  constructor() {}

  /**
   * Mocked method that returns a Promise with the Revenue Data
   * @returns {Promise<any>}
   */
  getRevenue() {
    return new Promise((done, reject) =>  {

      let startDate = moment('2013-01-01');

      let data = [];

      for(let i = 0; i < 50; i++) {
        data.push({
          'date': startDate.add(i, 'days').toDate(),
          'tablet': parseFloat((Math.random() * 4000).toFixed(2)),
          'smartphone': parseFloat((Math.random() * 6000).toFixed(2))
        });
      }

      setTimeout(() => {
        done(data);
      }, Math.round(Math.random() * DEFAULTS.timer.random) + DEFAULTS.timer.minimal);
    });
  }

  /**
   * Mocked method that returns a Promise with the Impressions Data
   * @returns {Promise<any>}
   */
  getImpressions() {
    return new Promise((done, reject) =>  {

      let startDate = moment('2013-01-01');

      let data = [];

      for(let i = 0; i < 50; i++) {

        let tabletValue = (Math.random() * DEFAULTS.impressions.tablet.random) + DEFAULTS.impressions.tablet.mimimal;
        let smartphoneValue = (Math.random() * DEFAULTS.impressions.smartphone.random) + DEFAULTS.impressions.smartphone.mimimal;

        data.push({
          'date': startDate.add(i, 'days').toDate(),
          'tablet': Math.round(tabletValue),
          'smartphone': Math.round(smartphoneValue)
        });
      }

      setTimeout(() => {
        done(data);
      }, Math.round(Math.random() * DEFAULTS.timer.random) + DEFAULTS.timer.minimal);
    });
  }
  
  /**
   * Mocked method that returns a Promise with the visits Data
   * @returns {Promise<any>}
   */
  getVisits() {
    return new Promise((done, reject) =>  {

      let startDate = moment('2013-01-01');

      let data = [];

      for(let i = 0; i < 50; i++) {

        let tabletValue = (Math.random() * DEFAULTS.visits.tablet.random) + DEFAULTS.visits.tablet.mimimal;
        let smartphoneValue = (Math.random() * DEFAULTS.visits.tablet.random) + DEFAULTS.visits.tablet.mimimal;

        data.push({
          'date': startDate.add(i, 'days').toDate(),
          'tablet': Math.round(tabletValue),
          'smartphone': Math.round(smartphoneValue)
        });
      }

      setTimeout(() => {
        done(data);
      }, Math.round(Math.random() * DEFAULTS.timer.random) + DEFAULTS.timer.minimal);
    });
  }

}


export default DataService;