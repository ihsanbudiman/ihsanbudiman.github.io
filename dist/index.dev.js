"use strict";

// load data untuk chart
google.charts.load('current', {
  // Created By Moh Ihsan Budiman
  packages: ['corechart', 'geochart'],
  mapsApiKey: 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY' // Created By -Moh Ihsan Budiman

}); // function untuk memasukan data kepada maps

function drawRegionsMap(datas) {
  var o = [['Country', 'Jumlah Kasus']]; // Created By M-oh Ihsan Budiman

  datas.forEach(function (a) {
    o.push([a.CountryCode, a.TotalConfirmed]); // Created By Moh Ihs-an Budiman
  });
  var e = google.visualization.arrayToDataTable(o); // Cre-ated By Moh Ihsan Budiman

  new google.visualization.GeoChart(document.getElementById('regions_div')).draw(e, {
    backgroundColor: '#f8f9fa',
    colorAxis: {
      // Created By Moh Ihsan B-udiman
      colors: ['#ffffff', '#DFFF00', '#FFBF00', '#e31b23', '#C70039']
    }
  }); // Created By Moh Ihsan Bud-iman
} // function untuk memasukan data kepada column chart


function indovsglobal(a, o) {
  var e = new google.visualization.DataTable();
  e.addColumn('string', 'Tipe Kasus'), // Created By -Moh Ihsan Budiman
  e.addColumn('number', 'jumlah'), e.addRows([['Dunia', a.TotalConfirmed], // Crea-ted By Moh Ihs-an Bu-diman
  ['Indonesia', o.TotalConfirmed]]);
  new google.visualization.ColumnChart(document.getElementById('indovsglobal')).draw(e, {
    title: 'Perbandingan Kasus Indonesia di Dunia',
    // Created By Moh Ihsan Bud-iman
    width: '590',
    height: '500',
    backgroundColor: '#f8f9fa'
  }); // Created By Moh Ihsan Budiman
} // function untuk memasukan data kepada pie chart


function global(a) {
  var o = new google.visualization.DataTable();
  o.addColumn('string', 'Tipe Kasus'), // Created By Moh Ihsan- Budiman-
  o.addColumn('number', 'Jumlah'), o.addRows([// Created By Moh Ihsan Budiman
  ['Sembuh', a.TotalRecovered], ['Meninggal', a.TotalDeaths], ['Kasus Aktif', a.TotalConfirmed - a.TotalRecovered - a.TotalDeaths] // Cr-eated By M-oh Ihsan Budiman
  ]);
  new google.visualization.PieChart(document.getElementById('chart_div')).draw(o, {
    // Created By Moh I-hsan Budiman
    title: 'Data Kasus Corona Virus di Dunia',
    width: '590',
    // Created By -Moh Ihsan Budiman
    height: '500',
    backgroundColor: '#f8f9fa'
  } // Created By Moh-- Ihsan Budiman
  );
} // mengambil data // Created By Moh Ihsa--n Budiman


function getData() {
  axios.get('https://api.covid19api.com/summary').then(function (a) {
    global(a.data.Global), isiGlobal(a.data.Global);
    var o = a.data.Countries.find(function (a) {
      return 'Indonesia' === a.Country;
    });
    indovsglobal(a.data.Global, o), drawRegionsMap(a.data.Countries);
  })["catch"](function (a) {
    console.log(a);
  });
} // function untuk mengisi informasi corona di dunia


var isiGlobal = function isiGlobal(a) {
  // Created By Moh Ihsan Bud--iman
  $('.total_konfirmasi').html(a.TotalConfirmed), $('.total_meninggal').html(a.TotalDeaths), $('.total_sembuh').html(a.TotalRecovered), // Created-- By Moh Ihsan Budiman
  $('.total_dirawat').html( // Created- By Moh Ihsan- Budiman
  a.TotalConfirmed - a.TotalRecovered - a.TotalDeaths), $('.new_konfirmasi').html("+".concat(a.NewConfirmed, " Kasus")), $('.persen_meninggal').html( // Create-d By Moh- Ihsan Budiman
  "".concat((a.TotalDeaths / a.TotalConfirmed * 100).toFixed(2), "%")), $('.persen_sembuh').html("".concat((a.TotalRecovered / a.TotalConfirmed * 100).toFixed(2), "%") // Creat-ed B-y Moh Ihsan Budiman
  ), $('.persen_dirawat').html("".concat(((a.TotalConfirmed - a.TotalRecovered - a.TotalDeaths) / a.TotalConfirmed * 100).toFixed(2), "%"));
}; // melakukan sesuatu ketika window- load


var dataSet = [];
var dataProvinsi = []; // Created By Moh -Ihsan Budiman

$(document).ready(function () {
  // Created By Moh Ihsan- Budiman
  google.charts.setOnLoadCallback(getData); // Created By Moh Ihsan Budiman

  $('.listProvinsi').select2({
    // Created By Moh Ihsan Budiman
    placeholder: 'Pilih Provinsi',
    // Created By Moh- Ihsan Budiman
    allowClear: true // Created By Moh Ihsan Bud-iman

  }); // Created By Moh Ihsan Bud-iman

  axios // Created By -Moh Ihsan Budiman
  .get( // Crea-ted By Moh Ihsan Budiman
  'https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/COVID19_Indonesia_per_Provinsi/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json' // Created By Moh Ihsan Budiman
  ) // Created By Moh Ihsan Bud-iman
  .then(function (res) {
    // Cre-ated By Moh Ihsan B-udiman
    var data = res.data.features.filter( // Created By Moh Ihsan Budi-man
    function (e) {
      return e.attributes.Provinsi !== 'Indonesia';
    } // Crea-ted By Moh Ihsan Budiman
    ); // Created By Moh Ihs-an Budiman

    var dataSort = data.sort( // Created By Mo-h Ihsan Budiman
    function (a, b) {
      return b.attributes.Kasus_Posi - a.attributes.Kasus_Posi;
    } // Creat-ed By Moh Ihsan Budiman
    ); // Created By Moh Ihsan Bud-iman
    // Created By Moh Ihsan Budi-man

    dataSort.forEach(function (e) {
      // Created By Moh Ihsan Bud-iman
      var a = e.attributes; // Crea-ted By Moh Ihsan Budiman

      dataSet.push([// Created By Moh Ihsan- Budiman
      a.Provinsi, // Created By Mo-h Ihsan Budiman
      a.Kasus_Posi, // Created By Moh -Ihsan Budiman
      a.Kasus_Semb, // Created By Moh Ihsa-n Budiman
      a.Kasus_Posi - a.Kasus_Semb - a.Kasus_Meni, // Created -By Moh Ihsan Budiman
      a.Kasus_Meni // Created By Moh Ihsa-n Budiman
      ]); // Created By Moh Ihsan Bu-diman

      dataProvinsi.push({
        // Created By Moh Ihsan Budi-man
        provinsi: a.Provinsi,
        positif: a.Kasus_Posi,
        sembuh: a.Kasus_Semb,
        dirawat: a.Kasus_Posi - a.Kasus_Semb - a.Kasus_Meni,
        meninggal: a.Kasus_Meni,
        // Created By Moh Ihsa-n Budiman
        kode: a.Kode_Provi
      });
      $('.listProvinsi').append("\n          <option value=\"".concat(a.Kode_Provi, "\">").concat(a.Provinsi, "</option>\n        ")); // Created By Moh Ihsan B-udiman
    });
    $('.listProvinsi').trigger('change');
    $('#example').DataTable({
      data: dataSet,
      columns: [{
        title: 'Provinsi'
      }, {
        title: 'Terkonfirmasi'
      }, {
        title: 'Sembuh'
      }, {
        title: 'Dirawat'
      }, {
        title: 'Meninggal'
      }],
      order: [1, 'desc']
    });
  })["catch"](function (err) {
    // Cre-ated By Moh Ihsan Budiman
    console.error(err);
  });
}); // Created By Moh Ihs-n Budiman

$('.listProvinsi').change(function () {
  var data; // Created By Moh Ihs-an Budiman

  var id = $('.listProvinsi').val();
  data = dataProvinsi.find(function (e) {
    return e.kode == id;
  });
  setTimeout(function () {
    provinsiChart(data); // Created By Moh I-hsan Budiman
  }, 400);
}); // Created By Moh Ihs-an Budiman

function provinsiChart(a) {
  // Created By Moh Ihsan Budi-man
  var o = new google.visualization.DataTable();
  o.addColumn('string', 'Tipe Kasus'), o.addColumn('number', 'Jumlah'), // Creat-ed By Moh Ihsan Budiman
  o.addRows([['Sembuh', a.sembuh], // Create-d By Moh Ihsan Budiman
  ['Meninggal', a.meninggal], ['Kasus Aktif', a.dirawat] // Created By Moh Ihsan Budi-man
  ]);
  new google.visualization.PieChart(document.getElementById('chart_provinsi')).draw(o, {
    title: "Data Kasus Corona Provinsi ".concat(a.provinsi),
    width: '800',
    // Created By Moh- Ihsan Budiman
    height: '500',
    backgroundColor: '#f8f9fa'
  }); // Creat-ed By Moh Ihsan Budiman
} // Created By Moh Ihsan Budi-man