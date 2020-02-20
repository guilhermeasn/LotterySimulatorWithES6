class Bet {

    constructor(...numbers) {
        this._nums = new Array();

        numbers.forEach(num=>{
            num = parseInt(num);
            if(Number.isInteger(num) && (this._nums.indexOf(num) == -1)) {
                this._nums.push(num);
            }
        });
    }


    match(raffle) {
        var matches = 0;

        raffle.forEach(num => {
            if(this._nums.includes(num)) matches++;
        });

        return matches;
    }

    
    get nums() {
        return this._nums.sort((a, b) => a-b);
    }


    get count() {
        return this._nums.length;
    }

}
