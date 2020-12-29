"use strict";

google.charts.load('current', {
  packages: ['corechart', 'geochart'],
  // Note: you will need to get a mapsApiKey for your project.
  // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
  mapsApiKey: 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
});

function drawRegionsMap(allData) {
  var database = [['Country', 'Jumlah Kasus']];
  allData.forEach(function (e) {
    database.push([e.CountryCode, e.TotalConfirmed]);
  });
  var data = google.visualization.arrayToDataTable(database);
  var options = {
    backgroundColor: '#f8f9fa',
    colorAxis: {
      colors: ['#ffffff', '#DFFF00', '#FFBF00', '#e31b23', '#C70039']
    }
  };
  var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
  chart.draw(data, options);
} // Mengisi data dan menampilkan chart global vs indonesia
// sesuai dengan data yang diterima


function indovsglobal(global, indo) {
  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Tipe Kasus');
  data.addColumn('number', 'jumlah');
  data.addRows([['Dunia', global.TotalConfirmed], ['Indonesia', indo.TotalConfirmed]]); // Set chart options

  var options = {
    title: 'Perbandingan Kasus Indonesia di Dunia',
    width: '700',
    height: '600',
    backgroundColor: '#f8f9fa'
  };
  var chart = new google.visualization.ColumnChart(document.getElementById('indovsglobal'));
  chart.draw(data, options);
} // Mengisi data dan menampilkan chart covid di dunia
// sesuai dengan data yang diterima


function global(global) {
  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Tipe Kasus');
  data.addColumn('number', 'Jumlah');
  data.addRows([['Sembuh', global.TotalRecovered], ['Meninggal', global.TotalDeaths], ['Kasus Aktif', global.TotalConfirmed - global.TotalRecovered - global.TotalDeaths]]); // Set chart options

  var options = {
    title: 'Data Kasus Corona Virus di Dunia',
    width: '700',
    height: '600',
    backgroundColor: '#f8f9fa'
  }; // Instantiate and draw our chart, passing in some options.

  var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  chart.draw(data, options);
} // Mengambil data dari API


function getData() {
  axios.get('https://api.covid19api.com/summary').then(function (res) {
    global(res.data.Global);
    isiGlobal(res.data.Global);
    var indo = res.data.Countries.find(function (e) {
      return e.Country === 'Indonesia';
    });
    indovsglobal(res.data.Global, indo);
    drawRegionsMap(res.data.Countries);
  })["catch"](function (err) {
    console.log(err);
  });
} // Mengisi data ke class yang sudah di sediakan


var isiGlobal = function isiGlobal(data) {
  $('.total_konfirmasi').html(data.TotalConfirmed);
  $('.total_meninggal').html(data.TotalDeaths);
  $('.total_sembuh').html(data.TotalRecovered);
  $('.total_dirawat').html(data.TotalConfirmed - data.TotalRecovered - data.TotalDeaths);
  $('.new_konfirmasi').html("+".concat(data.NewConfirmed, " Kasus"));
  $('.persen_meninggal').html("".concat((data.TotalDeaths / data.TotalConfirmed * 100).toFixed(2), "%"));
  $('.persen_sembuh').html("".concat((data.TotalRecovered / data.TotalConfirmed * 100).toFixed(2), "%"));
  $('.persen_dirawat').html("".concat(((data.TotalConfirmed - data.TotalRecovered - data.TotalDeaths) / data.TotalConfirmed * 100).toFixed(2), "%"));
}; // Memanggil function getData() ketika window load


window.onload = function () {
  getData();
};