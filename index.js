const express = require('express')
const app = express()

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
        response.send("You have lost " + request.params.boughtCurrency + " " + Math.abs(parseInt(difference)) + " on your " + request.params.currency + " investment")
      } else {
        response.send("You have profited " + request.params.boughtCurrency + " " + Math.abs(parseInt(difference)) + " on your " + request.params.currency + " investment")

      }

    });
  });

  req.end();

})

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port 3000!')
})
