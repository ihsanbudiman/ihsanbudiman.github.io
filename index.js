// load data untuk chart
google.charts.load('current', {
  packages: ['corechart', 'geochart'],
  mapsApiKey: 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY',
});

// function untuk memasukan data kepada maps
function drawRegionsMap(datas) {
  let o = [['Country', 'Jumlah Kasus']];
  datas.forEach((a) => {
    o.push([a.CountryCode, a.TotalConfirmed]);
  });
  let e = google.visualization.arrayToDataTable(o);
  new google.visualization.GeoChart(
    document.getElementById('regions_div'),
  ).draw(e, {
    backgroundColor: '#f8f9fa',
    colorAxis: {
      colors: ['#ffffff', '#DFFF00', '#FFBF00', '#e31b23', '#C70039'],
    },
  });
}

// function untuk memasukan data kepada column chart
function indovsglobal(a, o) {
  let e = new google.visualization.DataTable();
  e.addColumn('string', 'Tipe Kasus'),
    e.addColumn('number', 'jumlah'),
    e.addRows([
      ['Dunia', a.TotalConfirmed],
      ['Indonesia', o.TotalConfirmed],
    ]);
  new google.visualization.ColumnChart(
    document.getElementById('indovsglobal'),
  ).draw(e, {
    title: 'Perbandingan Kasus Indonesia di Dunia',
    width: '590',
    height: '500',
    backgroundColor: '#f8f9fa',
  });
}

// function untuk memasukan data kepada pie chart
function global(a) {
  let o = new google.visualization.DataTable();
  o.addColumn('string', 'Tipe Kasus'),
    o.addColumn('number', 'Jumlah'),
    o.addRows([
      ['Sembuh', a.TotalRecovered],
      ['Meninggal', a.TotalDeaths],
      ['Kasus Aktif', a.TotalConfirmed - a.TotalRecovered - a.TotalDeaths],
    ]);
  new google.visualization.PieChart(document.getElementById('chart_div')).draw(
    o,
    {
      title: 'Data Kasus Corona Virus di Dunia',
      width: '590',
      height: '500',
      backgroundColor: '#f8f9fa',
    },
  );
}

// mengambil data
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
  $('.total_konfirmasi').html(a.TotalConfirmed),
    $('.total_meninggal').html(a.TotalDeaths),
    $('.total_sembuh').html(a.TotalRecovered),
    $('.total_dirawat').html(
      a.TotalConfirmed - a.TotalRecovered - a.TotalDeaths,
    ),
    $('.new_konfirmasi').html(`+${a.NewConfirmed} Kasus`),
    $('.persen_meninggal').html(
      `${((a.TotalDeaths / a.TotalConfirmed) * 100).toFixed(2)}%`,
    ),
    $('.persen_sembuh').html(
      `${((a.TotalRecovered / a.TotalConfirmed) * 100).toFixed(2)}%`,
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
let dataProvinsi = [];
$(document).ready(function () {
  google.charts.setOnLoadCallback(getData);
  $('.listProvinsi').select2({
    placeholder: 'Pilih Provinsi',
    allowClear: true,
  });
  axios
    .get(
      'https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/COVID19_Indonesia_per_Provinsi/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json',
    )
    .then((res) => {
      let data = res.data.features.filter(
        (e) => e.attributes.Provinsi !== 'Indonesia',
      );
      let dataSort = data.sort(
        (a, b) => b.attributes.Kasus_Posi - a.attributes.Kasus_Posi,
      );

      dataSort.forEach((e) => {
        let a = e.attributes;
        dataSet.push([
          a.Provinsi,
          a.Kasus_Posi,
          a.Kasus_Semb,
          a.Kasus_Posi - a.Kasus_Semb - a.Kasus_Meni,
          a.Kasus_Meni,
        ]);
        dataProvinsi.push({
          provinsi: a.Provinsi,
          positif: a.Kasus_Posi,
          sembuh: a.Kasus_Semb,
          dirawat: a.Kasus_Posi - a.Kasus_Semb - a.Kasus_Meni,
          meninggal: a.Kasus_Meni,
          kode: a.Kode_Provi,
        });
        $('.listProvinsi').append(`
          <option value="${a.Kode_Provi}">${a.Provinsi}</option>
        `);
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
      console.error(err);
    });
});

$('.listProvinsi').change(function () {
  let data;
  let id = $('.listProvinsi').val();
  data = dataProvinsi.find((e) => e.kode == id);
  setTimeout(function () {
    provinsiChart(data);
  }, 400);
});

function provinsiChart(a) {
  let o = new google.visualization.DataTable();
  o.addColumn('string', 'Tipe Kasus'),
    o.addColumn('number', 'Jumlah'),
    o.addRows([
      ['Sembuh', a.sembuh],
      ['Meninggal', a.meninggal],
      ['Kasus Aktif', a.dirawat],
    ]);
  new google.visualization.PieChart(
    document.getElementById('chart_provinsi'),
  ).draw(o, {
    title: `Data Kasus Corona Provinsi ${a.provinsi}`,
    width: '800',
    height: '500',
    backgroundColor: '#f8f9fa',
  });
}
