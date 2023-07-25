var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 22.9906, lng: 120.2131} // 台南市的經緯度
  });

  // Load GeoJSON.
  map.data.loadGeoJson('Tainan_County.geojson'); // 替換 'YOURFILE.json' 為您的 GeoJSON 檔案路徑

  // 假設您已經有了以下兩個列表
  var districts = ['中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區', '左鎮區', 
                  '玉井區', '楠西區', '南化區', '仁德區', '關廟區', '龍崎區', '官田區', '麻豆區', '佳里區', '西港區', 
                  '七股區', '將軍區', '學甲區', '北門區', '新營區', '後壁區', '白河區', '東山區', '六甲區', '下營區', 
                  '柳營區', '鹽水區', '善化區', '大內區', '山上區', '新市區', '安定區'];
  var colors = ['#0040FF', '#00A0FF', '#00FFFF', '#00FFBF', '#00FF40', '#00FFA0', '#40FF00', '#80FF00', 
                '#FFFF00', '#FFC000', '#FF8000', '#FF4000', '#FF00BF', '#FF00FF', '#FF4080', '#FF40FF', 
                '#BF00FF', '#8000FF', '#4000FF', '#00BFFF', '#00FF80', '#40FFFF', '#80FFFF', '#C0FFFF', 
                '#FF80FF', '#FF0040', '#C00000', '#808080', '#A0A0A0', '#C0C0C0', '#E0E0E0', '#FFFFFF', 
                '#A0FF00', '#FF00A0', '#0080FF', '#FF8000', '#FFBF00', '#FF00C0'];

  // Set the stroke width, and fill color for each polygon
  map.data.setStyle(function(feature) {  
    var districtName = feature.getProperty('TOWN'); // 取得 "TOWN" 屬性的值
    var fillColor;
  
    // 使用迴圈來匹配行政區名稱與顏色
    for (var i = 0; i < districts.length; i++) {
      if (districtName === districts[i]) {
        fillColor = colors[i];
        break;
      }
    }
  
    // 如果行政區名稱不在列表中，設定預設填充色
    if (!fillColor) {
      fillColor = 'gray'; // 預設填充色，可自行調整
    }
    return {
      fillColor: fillColor,
      strokeWeight: 1.5,
    };
  });

  // 定義紅色標記的圖示
  var redIcon = {
    url: 'png/pin_red.png',
    scaledSize: new google.maps.Size(36, 36),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(16, 32)
  };
  // 定義黃色標記的圖示
  var yellowIcon = {
    url: 'png/pin_yellow.png',
    scaledSize: new google.maps.Size(36, 36),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(16, 32)
  };
  // 定義綠色標記的圖示
  var greenIcon = {
    url: 'png/pin_green.png',
    scaledSize: new google.maps.Size(36, 36),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(16, 32)
  };

  // 標記高風險的地點
  fetch('data_high.json') // 替換成您的 JSON 檔案路徑
  .then(response => response.json())
  .then(data => {
    // 在這裡使用 data 陣列的座標資料
    for (var i = 0; i < data.length; i++) {
      var marker = new google.maps.Marker({
        position: { lat: data[i].lat, lng: data[i].lng },
        map: map,
        title: data[i].name,
        icon: redIcon // 使用紅色圖示
      });
      // 新增標記的標籤
      var infowindow = new google.maps.InfoWindow({
        content: data[i].name,
      });
      // 點擊標記時顯示標籤
      marker.addListener('click', function () {
        infowindow.open(map, this);
      });
    }
  })
  .catch(error => console.error('Error fetching data:', error));

  // 標記中風險的地點
  fetch('data_medium.json') // 替換成您的 JSON 檔案路徑
  .then(response => response.json())
  .then(data => {
    // 在這裡使用 data 陣列的座標資料
    for (var i = 0; i < data.length; i++) {
      var marker = new google.maps.Marker({
        position: { lat: data[i].lat, lng: data[i].lng },
        map: map,
        title: data[i].name,
        icon: yellowIcon // 使用黃色圖示
      });
      // 新增標記的標籤
      var infowindow = new google.maps.InfoWindow({
        content: data[i].name,
      });
      // 點擊標記時顯示標籤
      marker.addListener('click', function () {
        infowindow.open(map, this);
      });
    }
  })
  .catch(error => console.error('Error fetching data:', error));

  // 標記低風險的地點
  fetch('data_low.json') // 替換成您的 JSON 檔案路徑
  .then(response => response.json())
  .then(data => {
    // 在這裡使用 data 陣列的座標資料
    for (var i = 0; i < data.length; i++) {
      var marker = new google.maps.Marker({
        position: { lat: data[i].lat, lng: data[i].lng },
        map: map,
        title: data[i].name,
        icon: greenIcon // 使用綠色圖示
      });
      // 新增標記的標籤
      var infowindow = new google.maps.InfoWindow({
        content: data[i].name,
      });
      // 點擊標記時顯示標籤
      marker.addListener('click', function () {
        infowindow.open(map, this);
      });
    }
  })
  .catch(error => console.error('Error fetching data:', error));
 
  window.initMap = initMap;
}

