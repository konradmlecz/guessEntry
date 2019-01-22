class Gallows {
    constructor() {
        this.bar = document.querySelector('[data-key="bar"]')
        this.barProgress = 0;
    }
    changeBar() {
        this.barProgress += 10;
        document.documentElement.style.setProperty('--strap', `${this.barProgress}%`)
        if (this.barProgress == 70) this.bar.style.background = "red"
    }
    resetBar() {
        this.barProgress = 0;
        this.bar.style.background = "#4CAF50"
        document.documentElement.style.setProperty('--strap', `${this.barProgress}%`)
    }
    checkBarProgress() {
        if (this.barProgress === 100) return true;
    }
}

class Clue {
    constructor() {

        this.words = ["this", "home", "youtube", "yellow", "homeland", "dotted", "gameover", "array", "green", "trump", "simple", "section", "images", "meaningful", "crazy"];
        this.wordnik;
        this.sectionClue = document.querySelector('[data-key="worddivs"]')
        this.indexOfValidLetter = 0;
        this.actualWord;
    }
    getRandomWordWithWordnik() {
        const that = this;
        fetch(
            'http://api.wordnik.com/v4/words.json/randomWord?api_key=0c89ebb9418402dbb600f0c1318037b282df00fe112e991b4'
        )
            .then(function (response) {
                return response.json();

            })
            .then(function (myJson) {

                const wordName = myJson.word
                that.wordnik = wordName.toLowerCase();

                const regex = /\W/gi;
                if (regex.test(that.wordnik)) {

                    that.getRandomWordWithWordnik()
                } else {

                }

            });

    }

    getRandomWord() {
        if (this.wordnik) {
            return this.wordnik
        } else {
            return this.words[Math.floor(Math.random() * this.words.length)]
        }

    }
    displayWord() {
        this.sectionClue.innerHTML = ""
        this.actualWord = this.getRandomWord();
        for (let i = 0; i < this.actualWord.length; i++) {
            const div = document.createElement("div");
            div.classList.add("cluediv");
            this.sectionClue.appendChild(div);
        }
        this.indexOfValidLetter = 0;
    }
    checkIfCharIs(char) {
        const regex = RegExp(`${char}`, 'gi')
        return regex.test(this.actualWord);
    }
    showLetter(letterHited) {
        const divsClue = document.querySelectorAll('.cluediv')
        for (let i = 0; i < this.actualWord.length; i++) {
            const regex = RegExp(`${letterHited}`, 'gi')
            if (regex.test(this.actualWord.charAt(i))) {
                divsClue[i].textContent = this.actualWord.charAt(i);
                this.indexOfValidLetter++;
            }
        }
    }
    getActualWord() {
        return this.actualWord;
    }

    checkIndexValidLetter() {
        if (this.indexOfValidLetter === this.actualWord.length) return true;
    }

}

class Game {
    constructor() {
        this.start = document.querySelector('[data-key="btnstart"]');
        this.start.addEventListener("click", this.startGame.bind(this));
        this.clue = new Clue();
        this.gallows = new Gallows();
        this.letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "'"]
        this.sectionLetters = document.querySelector('[data-key="letterdivs"]')
        this.createLetter = function () {
            this.sectionLetters.innerHTML = "";
            for (let i = 0; i < this.letters.length; i++) {
                const div = document.createElement("div");
                div.classList.add("letterdiv");
                div.textContent = this.letters[i];
                div.addEventListener("click", this.choiceChar.bind(this), {
                    once: true
                })
                this.sectionLetters.appendChild(div);
            }
        }
        this.startGame();
    }
    startGame() {
        this.clue.getRandomWordWithWordnik()
        this.clue.displayWord();
        this.gallows.resetBar();
        this.createLetter()
    }
    choiceChar(e) {

        const letterClickted = e.target.textContent;
        const hit = this.clue.checkIfCharIs(letterClickted)

        if (hit) {
            this.clue.showLetter(letterClickted)

        }
        if (!(hit)) {
            this.gallows.changeBar()
        }
        e.target.classList.remove("letterdiv")
        e.target.classList.add("clicked")
        if (this.gallows.checkBarProgress()) {
            this.sectionLetters.innerHTML = `<p>LOSS!!! Entry is: "${this.clue.getActualWord()}"</p>`
        }
        if (this.clue.checkIndexValidLetter()) {
            this.sectionLetters.innerHTML = `<p>WIN!!! Entry is obviously: "${this.clue.getActualWord()}"</p>`
        }

    }
}

const game = new Game();