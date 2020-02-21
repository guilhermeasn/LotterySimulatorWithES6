class Lottery {

    constructor(numStart = 1, numCount = 60, numDraw = 6) {
        numStart = parseInt(numStart);
        numCount = parseInt(numCount);
        numDraw  = parseInt(numDraw);
        
        this._numStart = Number.isInteger(numStart) ? numStart : 1;
        this._numCount = Number.isInteger(numCount) ? numCount : 60;
        this._numDraw  = Number.isInteger(numDraw)  ? numDraw  : 6;
    }

    _getRandom(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (++max - min)) + min;
    }

    raffle() {
        let result = new Array(this._numDraw);
        for(let c = 0; c < result.length; c++) {
            let random = this._getRandom(this._numStart, this._numStart + this._numCount);
            (result.indexOf(random) == -1) ? result[c] = random : --c;
        }
        return result.sort((a, b) => a-b);
    }

}
