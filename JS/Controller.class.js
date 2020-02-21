class Controller {

    constructor(formSelector) {
        this._count = 1;
        this._form  = document.querySelector(formSelector);
        this._to    = document.querySelector(this._form.getAttribute('to'));

        this._loadPreferences();
        this._addEventListeners();
    }


    _addEventListeners() {
        document.querySelectorAll('input[to]').forEach(element => {
            document.querySelector(element.getAttribute('to')).innerText = element.value;
            element.addEventListener('change', function() {
                document.querySelector(element.getAttribute('to')).innerText = element.value;
            });
        });

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

            if(this._to.innerHTML.trim()) this._clean();
            
            let maxMatches = (bet.count <= this._form.draw.value) ? bet.count : this._form.draw.value;
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
            this._clean();
        });

        this._form.btnStop.addEventListener('click', () => {
            this._stop();
        });
    }


    _stop() {
        clearInterval(this._interval);
        this._form.btnClean.disabled = false;
        this._form.btnStop.classList.add('d-none');
        this._form.btnSubmit.classList.remove('d-none');
    }


    _clean() {
        this._form.btnClean.disabled = true;
        this._to.innerHTML = null;
        this._count = 1;
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
