import DataService from './../../src/app/services/DataService';

describe('services', () => {
  describe('DataService', () => {

    it('Should exists', () => {
      expect(DataService).toBeDefined();
    });

    describe('method#getRevenue', () => {

      it('Should Exists', () => {
        let dataService = new DataService();

        expect(dataService.getRevenue).toBeDefined();
      });

      it('Should return a Promise', () => {
        let dataService = new DataService();
        let promise = dataService.getRevenue();

        expect(promise).toEqual(jasmine.any(Promise));
      });

      describe('When is resolved', () => {
        let dataService = new DataService();

        it('should return an array', async () => {
          let results = await dataService.getRevenue();

          expect(results).toEqual(jasmine.any(Array));
        });
      });
    });

    describe('method#getImpressions', () => {

      it('Should Exists', () => {
        let dataService = new DataService();

        expect(dataService.getImpressions).toBeDefined();
      });

      it('Should return a Promise', () => {
        let dataService = new DataService();
        let promise = dataService.getImpressions();

        expect(promise).toEqual(jasmine.any(Promise));
      });

      describe('When is resolved', () => {
        let dataService = new DataService();

        it('should return an array', async () => {
          let results = await dataService.getImpressions();

          expect(results).toEqual(jasmine.any(Array));
        });
      });
    });

    describe('method#getVisits', () => {

      it('Should Exists', () => {
        let dataService = new DataService();

        expect(dataService.getVisits).toBeDefined();
      });

      it('Should return a Promise', () => {
        let dataService = new DataService();
        let promise = dataService.getVisits();

        expect(promise).toEqual(jasmine.any(Promise));
      });

      describe('When is resolved', () => {
        let dataService = new DataService();

        it('should return an array', async () => {
          let results = await dataService.getVisits();

          expect(results).toEqual(jasmine.any(Array));
        });
      });
    });


  });
});