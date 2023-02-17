
class MixOrMatch {
    constructor(totalTime, cards) //se creează un nou obiect
    {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining')
        this.ticker = document.getElementById('flips');
        
    }

    startGame() {//de fiecare dată când se începe un joc se resetează parametrii
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;//cartea de joc căreia i se caută perechea
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500)
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }
    startCountdown() {
        return setInterval(() => {//se începe numărătoare inversă a celor 100 de secunde
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0)//când se termină timpul jocul este pierdut 
                this.gameOver();
        }, 1000);
    }
    gameOver() {//Această funcție afișează animația de Game over.
        clearInterval(this.countdown);
        document.getElementById('game-over-text').classList.add('visible');
        this.hideCards();//după trecerea timpului se întorc cărțile la loc
    }
    victory() {//Această funcție afișează animația asociată victoriei.
        clearInterval(this.countdown);
        document.getElementById('victory-text').classList.add('visible');
        this.hideCards();//după victorie se întorc cărțile din nou
    }
    hideCards() {//În cazul în care 2 cărți de joc nu sunt identice se apelează această funcție.
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;//se actualizează numărul de mișcări
            card.classList.add('visible');//se întoarce cartea

            if(this.cardToCheck) {//se verifică dacă sunt 2 cărți sau e doar una
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }
    checkForCardMatch(card) {//Această funcție verifică dacă cele 2 cărți de joc sunt identice.
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else 
            this.cardMismatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');//se execută animația din CSS când se găsesc 2 cărți asemenea
        card2.classList.add('matched');
        if(this.matchedCards.length === this.cardsArray.length)
        //când s-au găsit toate perechile de cărți se execută funcția ”victory”
            this.victory();
    }
    cardMismatch(card1, card2) {//cazul în care cărțile de joc selectate sunt diferite
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);//se acordă timp jucătorului pentru a reține desenele de pe cărți
    }
    shuffleCards(cardsArray) { // Algoritmul Fisher-Yates Shuffle (amestecă cele 16 cărți de joc)
        for (let i = cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
        }
    }
    getCardType(card) {//tipul cărții de joc(imaginea de pe interior)
        return card.getElementsByClassName('card-value')[0].src;
    }
    canFlipCard(card) {//se verifică dacă se poate întoarce cartea
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
        /*sunt trei cazuri în care nu se poate da click:
        1) se execută o animație
        2) cărțile selectate au deja perechea găsită
        3) nu se poate întoarce cartea căreia i se caută perechea
        */
    }
}

if (document.readyState == 'loading') 
//JavaScript se va încărca după ce se încarcă HTML și CSS în pagina web
{
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(100, cards);

    overlays.forEach(overlay => {//se trece de la ecranul de pornire și se începe jocul
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);//se întoarce cartea
        });
    });
}