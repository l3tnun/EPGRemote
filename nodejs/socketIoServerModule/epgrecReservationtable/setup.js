var cancelReservation = require(__dirname + '/cancelReservation');

module.exports = function(io, socket) {
    cancelReservation(io, socket); //録画予約一覧 削除部分
}

