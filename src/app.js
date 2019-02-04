import './sass/main.scss';
import 'format-unicorn';

import DonutPieChart from './app/components/DonutPieChart';
import DataService from './app/services/DataService';

/**
 * When DOM is Loaded
 */
document.addEventListener('DOMContentLoaded', () => {

  let dataService = new DataService();

  let revenueItems = _locateItems(document.getElementsByClassName('revenues')[0]);
  let impresionsItems = _locateItems(document.getElementsByClassName('impresions')[0]);
  let visitsItems = _locateItems(document.getElementsByClassName('visits')[0]);

  let revenueChart = new DonutPieChart(revenueItems.chart);
  let impresionsChart = new DonutPieChart(impresionsItems.chart);
  let visitsChart = new DonutPieChart(visitsItems.chart);


  dataService.getRevenue().then(function($$data) {
    revenueChart.setSeries($$data);

    let total = $$data.map(x => x.smartphone + x.tablet).reduce((acc, x) => acc + x);
    let smartphone = $$data.map(x => x.smartphone).reduce((acc, x) => acc + x);
    let tablet = $$data.map(x => x.tablet).reduce((acc, x) => acc + x);

    let smartphonePercentage = Math.round(smartphone * 100 / total);
    let tabletPercentage = Math.round(tablet * 100 / total);

    revenueItems.tablet.value.innerText = tablet.toLocaleString() + '€';
    revenueItems.tablet.percent.innerText = tabletPercentage + '%';

    revenueItems.smartPhone.value.innerText = smartphone.toLocaleString() + '€';
    revenueItems.smartPhone.percent.innerText = smartphonePercentage + '%';

    revenueItems.parent.classList.add('loaded');
  });

  dataService.getImpressions().then(function($$data) {
    impresionsChart.setSeries($$data);

    let total = $$data.map(x => x.smartphone + x.tablet).reduce((acc, x) => acc + x);
    let smartphone = $$data.map(x => x.smartphone).reduce((acc, x) => acc + x);
    let tablet = $$data.map(x => x.tablet).reduce((acc, x) => acc + x);

    let smartphonePercentage = Math.round(smartphone * 100 / total);
    let tabletPercentage = Math.round(tablet * 100 / total);

    impresionsItems.tablet.value.innerText = tablet.toLocaleString();
    impresionsItems.tablet.percent.innerText = tabletPercentage + '%';

    impresionsItems.smartPhone.value.innerText = smartphone.toLocaleString();
    impresionsItems.smartPhone.percent.innerText = smartphonePercentage + '%';

    impresionsItems.parent.classList.add('loaded');
  });

  dataService.getVisits().then(function($$data) {
    visitsChart.setSeries($$data);

    let total = $$data.map(x => x.smartphone + x.tablet).reduce((acc, x) => acc + x);
    let smartphone = $$data.map(x => x.smartphone).reduce((acc, x) => acc + x);
    let tablet = $$data.map(x => x.tablet).reduce((acc, x) => acc + x);

    let smartphonePercentage = Math.round(smartphone * 100 / total);
    let tabletPercentage = Math.round(tablet * 100 / total);

    visitsItems.tablet.value.innerText = tablet.toLocaleString();
    visitsItems.tablet.percent.innerText = tabletPercentage + '%';

    visitsItems.smartPhone.value.innerText = smartphone.toLocaleString();
    visitsItems.smartPhone.percent.innerText = smartphonePercentage + '%';

    visitsItems.parent.classList.add('loaded');
  });

  function _locateItems(mainItem) {
    let results = {
      'parent': mainItem,
      'chart': mainItem.getElementsByClassName('chart')[0],
      'tablet': {
        'parent': mainItem.getElementsByClassName('tablet-values')[0],
        'title': null,
        'percent': null,
        'value': null,
      },
      'smartPhone': {
        'parent': mainItem.getElementsByClassName('smartphone-values')[0],
        'title': null,
        'percent': null,
        'value': null,
      }
    };

    results.tablet.title = results.tablet.parent.getElementsByClassName('title')[0];
    results.tablet.percent = results.tablet.parent.getElementsByClassName('percent')[0];
    results.tablet.value = results.tablet.parent.getElementsByClassName('value')[0];

    results.smartPhone.title = results.smartPhone.parent.getElementsByClassName('title')[0];
    results.smartPhone.percent = results.smartPhone.parent.getElementsByClassName('percent')[0];
    results.smartPhone.value = results.smartPhone.parent.getElementsByClassName('value')[0];

    return results;
  }
});



