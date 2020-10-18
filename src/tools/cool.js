export let randomNumbers = (min, max, limit) =>
  new Promise((res, rej) => {
    try {
      let table = [];
      if (max == 0) throw "max must to be a positive number";
      if (max < min) throw "max must to be great than min";
      if (max < limit - 1) throw "max cannot be less than limit";

      for (let i = 0; i < limit; i++) {
        let x = Math.floor(Math.random() * (max - min + 1) + min);
        if (table.indexOf(x) === -1) table.push(x);
        else i--;
      }
      res(table);
    } catch (e) {
      rej(e);
    }
  });

// To Convert Unix Seconds to Normal HH:MM:SS time
export function Unix_timestamp(t) {
  var dt = new Date(t * 1000);
  var hr = dt.getHours();
  var m = "0" + dt.getMinutes();
  var s = "0" + dt.getSeconds();
  return hr + ":" + m.substr(-2) + ":" + s.substr(-2);
}
