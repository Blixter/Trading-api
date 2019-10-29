var stock = {
    getNewSeries: function (data, newDate, yrange) {
        data.push({
            x: newDate,
            y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
        })

        return data
    },
}

module.exports = stock;