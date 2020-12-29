function drawRegionsMap(a){let o=[["Country","Jumlah Kasus"]];a.forEach(a=>{o.push([a.CountryCode,a.TotalConfirmed])});let e=google.visualization.arrayToDataTable(o);new google.visualization.GeoChart(document.getElementById("regions_div")).draw(e,{backgroundColor:"#f8f9fa",colorAxis:{colors:["#ffffff","#DFFF00","#FFBF00","#e31b23","#C70039"]}})}function indovsglobal(a,o){let e=new google.visualization.DataTable;e.addColumn("string","Tipe Kasus"),e.addColumn("number","jumlah"),e.addRows([["Dunia",a.TotalConfirmed],["Indonesia",o.TotalConfirmed]]);new google.visualization.ColumnChart(document.getElementById("indovsglobal")).draw(e,{title:"Perbandingan Kasus Indonesia di Dunia",width:"700",height:"600",backgroundColor:"#f8f9fa"})}function global(a){let o=new google.visualization.DataTable;o.addColumn("string","Tipe Kasus"),o.addColumn("number","Jumlah"),o.addRows([["Sembuh",a.TotalRecovered],["Meninggal",a.TotalDeaths],["Kasus Aktif",a.TotalConfirmed-a.TotalRecovered-a.TotalDeaths]]);new google.visualization.PieChart(document.getElementById("chart_div")).draw(o,{title:"Data Kasus Corona Virus di Dunia",width:"700",height:"600",backgroundColor:"#f8f9fa"})}function getData(){axios.get("https://api.covid19api.com/summary").then(a=>{global(a.data.Global),isiGlobal(a.data.Global);let o=a.data.Countries.find(a=>"Indonesia"===a.Country);indovsglobal(a.data.Global,o),drawRegionsMap(a.data.Countries)}).catch(a=>{console.log(a)})}google.charts.load("current",{packages:["corechart","geochart"],mapsApiKey:"AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY"});let isiGlobal=a=>{$(".total_konfirmasi").html(a.TotalConfirmed),$(".total_meninggal").html(a.TotalDeaths),$(".total_sembuh").html(a.TotalRecovered),$(".total_dirawat").html(a.TotalConfirmed-a.TotalRecovered-a.TotalDeaths),$(".new_konfirmasi").html(`+${a.NewConfirmed} Kasus`),$(".persen_meninggal").html(`${(a.TotalDeaths/a.TotalConfirmed*100).toFixed(2)}%`),$(".persen_sembuh").html(`${(a.TotalRecovered/a.TotalConfirmed*100).toFixed(2)}%`),$(".persen_dirawat").html(`${((a.TotalConfirmed-a.TotalRecovered-a.TotalDeaths)/a.TotalConfirmed*100).toFixed(2)}%`)};window.onload=(()=>{getData()});