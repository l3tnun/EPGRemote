module.exports = function(num, limit) {
    if(typeof num == "undefined") { num = 1; } else { num = Number(num); }
    if(num <= 1) { return 0; } else { return (num - 1) * limit; }
}

