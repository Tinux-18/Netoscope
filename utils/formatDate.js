// // Split timestamp into [ Y, M, D, h, m, s ]
// var t = sqlTime.split(/[- :]/);
// var d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));

// console.log(d.toLocaleString());

exports.formatDate = sqlDate => {
    let dateParams = sqlDate.split(/[- :]/);
    let dateObj = new Date(
        Date.UTC(
            dateParams[0],
            dateParams[1] - 1,
            dateParams[2],
            dateParams[3],
            dateParams[4],
            dateParams[5]
        )
    );
    return dateObj.toLocaleString();
};
