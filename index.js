// load data untuk chart
google.charts.load('current', {
  // Created By Moh Ihsan Budiman
  packages: ['corechart', 'geochart'],
  mapsApiKey: 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY', // Created By Moh Ihsan Budiman
});

// function untuk memasukan data kepada maps
function drawRegionsMap(datas) {
  let o = [['Country', 'Jumlah Kasus']]; // Created By Moh Ihsan Budiman
  datas.forEach((a) => {
    o.push([a.CountryCode, a.TotalConfirmed]); // Created By Moh Ihsan Budiman
  });
  let e = google.visualization.arrayToDataTable(o); // Created By Moh Ihsan Budiman
  new google.visualization.GeoChart(
    document.getElementById('regions_div'), // Created By Moh Ihsan Budiman
  ).draw(e, {
    backgroundColor: '#f8f9fa',
    colorAxis: {
      // Created By Moh Ihsan Budiman
      colors: ['#ffffff', '#DFFF00', '#FFBF00', '#e31b23', '#C70039'],
    },
  }); // Created By Moh Ihsan Budiman
}

// function untuk memasukan data kepada column chart
function indovsglobal(a, o) {
  let e = new google.visualization.DataTable();
  e.addColumn('string', 'Tipe Kasus'), // Created By Moh Ihsan Budiman
    e.addColumn('number', 'jumlah'),
    e.addRows([
      ['Dunia', a.TotalConfirmed], // Created By Moh Ihsan Budiman
      ['Indonesia', o.TotalConfirmed],
    ]);
  new google.visualization.ColumnChart(
    document.getElementById('indovsglobal'), // Created By Moh Ihsan Budiman
  ).draw(e, {
    title: 'Perbandingan Kasus Indonesia di Dunia', // Created By Moh Ihsan Budiman
    width: '590',
    height: '500',
    backgroundColor: '#f8f9fa',
  }); // Created By Moh Ihsan Budiman
}

// function untuk memasukan data kepada pie chart
function global(a) {
  let o = new google.visualization.DataTable();
  o.addColumn('string', 'Tipe Kasus'), // Created By Moh Ihsan Budiman
    o.addColumn('number', 'Jumlah'),
    o.addRows([
      // Created By Moh Ihsan Budiman
      ['Sembuh', a.TotalRecovered],
      ['Meninggal', a.TotalDeaths],
      ['Kasus Aktif', a.TotalConfirmed - a.TotalRecovered - a.TotalDeaths], // Created By Moh Ihsan Budiman
    ]);
  new google.visualization.PieChart(document.getElementById('chart_div')).draw(
    o,
    {
      // Created By Moh Ihsan Budiman
      title: 'Data Kasus Corona Virus di Dunia',
      width: '590', // Created By Moh Ihsan Budiman
      height: '500',
      backgroundColor: '#f8f9fa',
    }, // Created By Moh Ihsan Budiman
  );
}

// mengambil data // Created By Moh Ihsan Budiman
function getData() {
  axios
    .get('https://api.covid19api.com/summary')
    .then((a) => {
      global(a.data.Global), isiGlobal(a.data.Global);
      let o = a.data.Countries.find((a) => 'Indonesia' === a.Country);
      indovsglobal(a.data.Global, o), drawRegionsMap(a.data.Countries);
    })
    .catch((a) => {
      console.log(a);
    });
}

// function untuk mengisi informasi corona di dunia
let isiGlobal = (a) => {
  // Created By Moh Ihsan Budiman
  $('.total_konfirmasi').html(a.TotalConfirmed),
    $('.total_meninggal').html(a.TotalDeaths),
    $('.total_sembuh').html(a.TotalRecovered), // Created By Moh Ihsan Budiman
    $('.total_dirawat').html(
      // Created By Moh Ihsan Budiman
      a.TotalConfirmed - a.TotalRecovered - a.TotalDeaths,
    ),
    $('.new_konfirmasi').html(`+${a.NewConfirmed} Kasus`),
    $('.persen_meninggal').html(
      // Created By Moh Ihsan Budiman
      `${((a.TotalDeaths / a.TotalConfirmed) * 100).toFixed(2)}%`,
    ),
    $('.persen_sembuh').html(
      `${((a.TotalRecovered / a.TotalConfirmed) * 100).toFixed(2)}%`, // Created By Moh Ihsan Budiman
    ),
    $('.persen_dirawat').html(
      `${(
        ((a.TotalConfirmed - a.TotalRecovered - a.TotalDeaths) /
          a.TotalConfirmed) *
        100
      ).toFixed(2)}%`,
    );
};

// melakukan sesuatu ketika window load
let dataSet = [];
let dataProvinsi = []; // Created By Moh Ihsan Budiman
$(document).ready(function () {
  // Created By Moh Ihsan Budiman
  google.charts.setOnLoadCallback(getData); // Created By Moh Ihsan Budiman
  $('.listProvinsi').select2({
    // Created By Moh Ihsan Budiman
    placeholder: 'Pilih Provinsi', // Created By Moh Ihsan Budiman
    allowClear: true, // Created By Moh Ihsan Budiman
  }); // Created By Moh Ihsan Budiman
  axios // Created By Moh Ihsan Budiman
    .get(
      // Created By Moh Ihsan Budiman
      'https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/COVID19_Indonesia_per_Provinsi/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json', // Created By Moh Ihsan Budiman
    ) // Created By Moh Ihsan Budiman
    .then((res) => {
      // Created By Moh Ihsan Budiman
      let data = res.data.features.filter(
        // Created By Moh Ihsan Budiman
        (e) => e.attributes.Provinsi !== 'Indonesia', // Created By Moh Ihsan Budiman
      ); // Created By Moh Ihsan Budiman
      let dataSort = data.sort(
        // Created By Moh Ihsan Budiman
        (a, b) => b.attributes.Kasus_Posi - a.attributes.Kasus_Posi, // Created By Moh Ihsan Budiman
      ); // Created By Moh Ihsan Budiman
      // Created By Moh Ihsan Budiman
      dataSort.forEach((e) => {
        // Created By Moh Ihsan Budiman
        let a = e.attributes; // Created By Moh Ihsan Budiman
        dataSet.push([
          // Created By Moh Ihsan Budiman
          a.Provinsi, // Created By Moh Ihsan Budiman
          a.Kasus_Posi, // Created By Moh Ihsan Budiman
          a.Kasus_Semb, // Created By Moh Ihsan Budiman
          a.Kasus_Posi - a.Kasus_Semb - a.Kasus_Meni, // Created By Moh Ihsan Budiman
          a.Kasus_Meni, // Created By Moh Ihsan Budiman
        ]); // Created By Moh Ihsan Budiman
        dataProvinsi.push({
          // Created By Moh Ihsan Budiman
          provinsi: a.Provinsi,
          positif: a.Kasus_Posi,
          sembuh: a.Kasus_Semb,
          dirawat: a.Kasus_Posi - a.Kasus_Semb - a.Kasus_Meni,
          meninggal: a.Kasus_Meni, // Created By Moh Ihsan Budiman
          kode: a.Kode_Provi,
        });
        $('.listProvinsi').append(`
          <option value="${a.Kode_Provi}">${a.Provinsi}</option>
        `); // Created By Moh Ihsan Budiman
      });
      $('.listProvinsi').trigger('change');
      $('#example').DataTable({
        data: dataSet,
        columns: [
          {
            title: 'Provinsi',
          },
          {
            title: 'Terkonfirmasi',
          },
          {
            title: 'Sembuh',
          },
          {
            title: 'Dirawat',
          },
          {
            title: 'Meninggal',
          },
        ],
        order: [1, 'desc'],
      });
    })
    .catch((err) => {
      // Created By Moh Ihsan Budiman
      console.error(err);
    });
});
// Created By Moh Ihsan Budiman
$('.listProvinsi').change(function () {
  let data; // Created By Moh Ihsan Budiman
  let id = $('.listProvinsi').val();
  data = dataProvinsi.find((e) => e.kode == id);
  setTimeout(function () {
    provinsiChart(data); // Created By Moh Ihsan Budiman
  }, 400);
});
// Created By Moh Ihsan Budiman
function provinsiChart(a) {
  // Created By Moh Ihsan Budiman
  let o = new google.visualization.DataTable();
  o.addColumn('string', 'Tipe Kasus'),
    o.addColumn('number', 'Jumlah'), // Created By Moh Ihsan Budiman
    o.addRows([
      ['Sembuh', a.sembuh], // Created By Moh Ihsan Budiman
      ['Meninggal', a.meninggal],
      ['Kasus Aktif', a.dirawat], // Created By Moh Ihsan Budiman
    ]);
  new google.visualization.PieChart(
    document.getElementById('chart_provinsi'),
  ).draw(o, {
    title: `Data Kasus Corona Provinsi ${a.provinsi}`,
    width: '800', // Created By Moh Ihsan Budiman
    height: '500',
    backgroundColor: '#f8f9fa',
  }); // Created By Moh Ihsan Budiman
}
// Created By Moh Ihsan Budiman
