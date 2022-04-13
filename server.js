const express = require('express');
const data = require('./data.json');
const app = express();
const port = 3800;

// app.get("/api", (req, res) => {
//   // entry point for all our apis.
//   // res.send("Hello World!");
// });

app.get('/api/visitors', (req, res) => {
  // check the params.
  const { date, ignore } = req.query;
  console.log('params: ', date, ignore);
  const parsedDate = new Date(+date);
  const month = parsedDate.getMonth() + 1;
  const year = parsedDate.getFullYear();
  const dateString =
    year.toString() + '-' + month.toString().padStart(2, 0) + '-' + '01';
  let queryDate = new Date(dateString).toISOString();
  queryDate = queryDate.slice(0, queryDate.length - 1);

  const result = data.find((el) => {
    if (el.month === queryDate) {
      return el;
    }
  });

  let highest;
  let max = -1;

  let lowest;
  let min = Number.MAX_SAFE_INTEGER;

  let total = 0;

  Object.keys(result).forEach((el) => {
    if (el !== 'month' && ignore !== el) {
      const attendance = parseInt(result[el]);
      if (attendance > max) {
        max = attendance;
        highest = {
          museum: el,
          visitors: attendance,
        };
      }

      if (attendance < min) {
        min = attendance;
        lowest = {
          museum: el,
          visitors: attendance,
        };
      }

      total += attendance;
    }
  });
  console.log('check: ', highest, result);

  let resData = {};

  if (result) {
    resData = {
      attendance: {
        month: month,
        year: year,
        highest,
        lowest,
        total,
      },
    };

    if (ignore) {
      resData['attendance']['ignored'] = {
        museum: ignore,
        visitors: result[ignore],
      };
    }
  }

  res.send(JSON.stringify(resData));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// response
/* 


{
  "attendance": {
    "month": "Jul",
    "year": "2014",

    "highest": {
      "museum": "america_tropical_interpretive_center",
      "visitors": 13490
    },

    "lowest": {
      "museum": "hellman_quon",
      "visitors": 120
    },

    "ignored": {
      "museum": "avila_adobe",
      "visitors": 32378
    },

    "total": 28157
  }
}


*/
