const express = require('express')
const app = express()


app.set('view engine', 'pug')

app.get('/:currency/:boughtCurrency/:boughtAmount', function (request, response) {


  var http = require("https");

  var options = {
    "method": "GET",
    "hostname": "min-api.cryptocompare.com",
    "port": null,
    "path": "/data/price?fsym=ETH&tsyms="+request.params.currency+"%2C"+request.params.boughtCurrency,
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "dd83f174-bf6f-1399-7243-0bf8072b25e4"
    }
  };

  var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);

      var obj = JSON.parse(body.toString());
      var arr = Object.keys(obj).map(function (key) { return obj[key]; });

      var difference = parseFloat(arr[1]) - parseFloat(request.params.boughtAmount)

      if (difference < 0) {
        var message = "You have lost " + request.params.boughtCurrency + " " + Math.abs(parseInt(difference)) + " on your " + request.params.currency + " investment"
        response.render('index', {title: "-"+Math.abs(parseInt(difference))+ " " + request.params.boughtCurrency, message: message})
      } else {
        var message = "You have profited " + request.params.boughtCurrency + " " + Math.abs(parseInt(difference)) + " on your " + request.params.currency + " investment"
        response.render('index', {title: Math.abs(parseInt(difference))+ " " + request.params.boughtCurrency, message: message})

      }

    });
  });

  req.end();

})

app.listen(process.env.PORT || 4000, function () {
  console.log('Example app listening on port 3000!')
})
