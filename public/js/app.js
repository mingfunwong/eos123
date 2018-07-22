document.getElementById('content').innerHTML = template('tpl-site', data);
AOS.init({
  disable: 'mobile',
  once: true
});

zb();
okex();
bitfinex();

var ticker = {};

setInterval(function (){
  var length = 0;
  for (var val in ticker) {
    length++;
  }
  var i = 0;
  var time = 6000 / length;
  for (var val in ticker) {
    var name = val;
    var price = ticker[val];
    setTimeout(function (name, price){
      document.title = price + " USD (" + name + ") | EOS 导航"
    }, i * time, name, price)
    i++;
  }
}, 6000);

function zb(){
  var ws = new WebSocket('wss://api.zb.com:9999/websocket');
  ws.addEventListener('open', function (event) {
    ws.send("{'event':'addChannel','channel':'eosusdt_ticker'}");
  });
  ws.addEventListener("message", function(event) {
    var data = JSON.parse(event.data);
    var last = data.ticker.last;
    if (last) {
      ticker['ZB'] = last;
    }
  });
}

function okex(){
  var ws = new WebSocket('wss://real.okex.com:10441/websocket');
  ws.addEventListener('open', function (event) {
    ws.send("{'event':'addChannel','channel':'ok_sub_spot_eos_usdt_ticker'}");
  });
  ws.addEventListener("message", function(event) {
    var data = JSON.parse(event.data);
    var last = data[0].data.last;
    if (last) {
      ticker['OKEX'] = last;
    }
  });
}

function bitfinex(){
  var ws = new WebSocket('wss://api.bitfinex.com/ws/2');
  ws.addEventListener('open', function (event) {
    ws.send(JSON.stringify({ event: 'subscribe', channel: 'ticker', symbol: 'tEOSUSD' }));
  });
  ws.addEventListener("message", function(event) {
    var data = JSON.parse(event.data);
    last = (data[1]) ? data[1][6] : 0;
    if (last) {
      ticker['BITFINEX'] = last;
    }
  });
}
