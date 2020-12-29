google.charts.load('current', {
  packages: ['corechart', 'geochart'],
  // Note: you will need to get a mapsApiKey for your project.
  // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
  mapsApiKey: 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY',
});

function drawRegionsMap(allData) {
  let database = [['Country', 'Jumlah Kasus']];

  allData.forEach((e) => {
    database.push([e.CountryCode, e.TotalConfirmed]);
  });

  let data = google.visualization.arrayToDataTable(database);

  let options = {
    backgroundColor: '#f8f9fa',
    colorAxis: {
      colors: ['#ffffff', '#DFFF00', '#FFBF00', '#e31b23', '#C70039'],
    },
  };

  let chart = new google.visualization.GeoChart(
    document.getElementById('regions_div'),
  );

  chart.draw(data, options);
}

// Mengisi data dan menampilkan chart global vs indonesia
// sesuai dengan data yang diterima
function indovsglobal(global, indo) {
  // Create the data table.
  let data = new google.visualization.DataTable();
  data.addColumn('string', 'Tipe Kasus');
  data.addColumn('number', 'jumlah');
  data.addRows([
    ['Dunia', global.TotalConfirmed],
    ['Indonesia', indo.TotalConfirmed],
  ]);

  // Set chart options
  let options = {
    title: 'Perbandingan Kasus Indonesia di Dunia',
    width: '700',
    height: '600',
    backgroundColor: '#f8f9fa',
  };

  let chart = new google.visualization.ColumnChart(
    document.getElementById('indovsglobal'),
  );

  chart.draw(data, options);
}

// Mengisi data dan menampilkan chart covid di dunia
// sesuai dengan data yang diterima
function global(global) {
  // Create the data table.
  let data = new google.visualization.DataTable();
  data.addColumn('string', 'Tipe Kasus');
  data.addColumn('number', 'Jumlah');
  data.addRows([
    ['Sembuh', global.TotalRecovered],
    ['Meninggal', global.TotalDeaths],
    [
      'Kasus Aktif',
      global.TotalConfirmed - global.TotalRecovered - global.TotalDeaths,
    ],
  ]);

  // Set chart options
  let options = {
    title: 'Data Kasus Corona Virus di Dunia',
    width: '700',
    height: '600',
    backgroundColor: '#f8f9fa',
  };

  // Instantiate and draw our chart, passing in some options.
  let chart = new google.visualization.PieChart(
    document.getElementById('chart_div'),
  );
  chart.draw(data, options);
}

// Mengambil data dari API
function getData() {
  axios
    .get('https://api.covid19api.com/summary')
    .then((res) => {
      global(res.data.Global);
      isiGlobal(res.data.Global);
      let indo = res.data.Countries.find((e) => e.Country === 'Indonesia');
      indovsglobal(res.data.Global, indo);
      drawRegionsMap(res.data.Countries);
    })
    .catch((err) => {
      console.log(err);
    });
}

// Mengisi data ke class yang sudah di sediakan
let isiGlobal = (data) => {
  $('.total_konfirmasi').html(data.TotalConfirmed);
  $('.total_meninggal').html(data.TotalDeaths);
  $('.total_sembuh').html(data.TotalRecovered);
  $('.total_dirawat').html(
    data.TotalConfirmed - data.TotalRecovered - data.TotalDeaths,
  );
  $('.new_konfirmasi').html(`+${data.NewConfirmed} Kasus`);
  $('.persen_meninggal').html(
    `${((data.TotalDeaths / data.TotalConfirmed) * 100).toFixed(2)}%`,
  );
  $('.persen_sembuh').html(
    `${((data.TotalRecovered / data.TotalConfirmed) * 100).toFixed(2)}%`,
  );
  $('.persen_dirawat').html(
    `${(
      ((data.TotalConfirmed - data.TotalRecovered - data.TotalDeaths) /
        data.TotalConfirmed) *
      100
    ).toFixed(2)}%`,
  );
};

// Memanggil function getData() ketika window load
window.onload = () => {
  getData();
};
