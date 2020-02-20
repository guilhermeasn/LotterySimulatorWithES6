class Controller {

    constructor(formSelector) {
        this._count = 1;
        this._form  = document.querySelector(formSelector);
        this._to    = document.querySelector(this._form.getAttribute('to'));

        this._loadPreferences();
        this._addEventListeners();
    }


    _addEventListeners() {
        this._form.addEventListener('submit', event => {
            event.preventDefault();
            this._savePreferences();

            let lottery = new Lottery(
                this._form.start.value,
                this._form.count.value,
                this._form.draw.value
            );

            let bet = new Bet(...this._form.bet.value.replace(' ','').split(','));

            this._form.btnSubmit.classList.add('d-none');
            this._form.btnStop.classList.remove('d-none');
            
            let maxMatches = (bet.count <= this._form.draw.value) ? bet.count : this._form.draw.value;
            console.log(maxMatches);
            this._interval = setInterval(() => {
                let raffle = lottery.raffle();
                this._printResult(
                    this._count,
                    raffle,
                    bet.match(raffle),
                    maxMatches
                );
                (this._count >= this._form.quantity.value) ? this._stop() : ++this._count;
            });
        });

        this._form.btnClean.addEventListener('click', () => {
            if(confirm('Tem certeza que deseja apagar todo o resultado da(s) simulação(ões)?')) {
                this._form.btnClean.disabled = true;
                this._to.innerHTML = null;
                this._count = 1;
            }
        });

        this._form.btnStop.addEventListener('click', () => {
            this._stop();
        });
    }


    _stop() {
        if(this._count >= this._form.quantity.value) {
            this._form.quantity.value = this._form.quantity.value * 2;
        }
        clearInterval(this._interval);
        this._form.btnClean.disabled = false;
        this._form.btnStop.classList.add('d-none');
        this._form.btnSubmit.classList.remove('d-none');
    }


    _printResult(count, result, matches, maxMatches) {
        let p = document.createElement('p');
        let r = document.createTextNode('Sorteio nº. ' + count + ': ' + result.join(', ') + ' (ACERTOU: ' + matches + ' DE ' + maxMatches + ')');
        p.appendChild(r);
        matches    = parseInt(matches);
        maxMatches = parseInt(maxMatches);
        switch(matches) {
            case (maxMatches):
                this._stop();
                p.classList.add('bg-dark', 'text-light');
                break;
            case (maxMatches-1):
                p.classList.add('bg-secondary', 'text-light');
                break;
            case 0:
                p.classList.add('text-muted');
                break;
        }
        this._to.prepend(p);
    }


    _savePreferences() {
        localStorage.setItem('start',    this._form.start.value);
        localStorage.setItem('count',    this._form.count.value);
        localStorage.setItem('draw',     this._form.draw.value);
        localStorage.setItem('quantity', this._form.quantity.value);
        localStorage.setItem('bet',      this._form.bet.value);
    }


    _loadPreferences() {
        this._form.start.value    = localStorage.getItem('start')    ? localStorage.getItem('start')    : 1;
        this._form.count.value    = localStorage.getItem('count')    ? localStorage.getItem('count')    : 60;
        this._form.draw.value     = localStorage.getItem('draw')     ? localStorage.getItem('draw')     : 6;
        this._form.quantity.value = localStorage.getItem('quantity') ? localStorage.getItem('quantity') : 1000;
        this._form.bet.value      = localStorage.getItem('bet')      ? localStorage.getItem('bet')      : null;
    }

}
