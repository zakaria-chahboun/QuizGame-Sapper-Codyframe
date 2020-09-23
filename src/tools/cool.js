export let randomNumbers = (min, max, limit) => new Promise((res, rej) => {
    try {
        let table = [];
        if (max == 0) throw "max must to be a positive number";
        if (max < min) throw "max must to be great than min";
        if (max < limit - 1) throw "max cannot be less than limit";

        for (let i = 0; i < limit; i++) {
            let x = Math.floor((Math.random() * (max - min + 1)) + min);
            if (table.indexOf(x) === -1) table.push(x);
            else i--;
        }
        res(table);
    } catch (e) {
        rej(e);
    }
});