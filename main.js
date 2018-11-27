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
        this.words = ["this", "home", "youtube", "yellow", "homeland", "dotted", "gameover", "array", "green", "trump", "simple", "section", "images", "meaningful", "crazy"]
        this.sectionClue = document.querySelector('[data-key="worddivs"]')
        this.indexOfValidLetter = 0;
        this.actualWord;
    }
    getRandomWord() {
        return this.words[Math.floor(Math.random() * this.words.length)]
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
        const divss = document.querySelectorAll('.cluediv')
        for (let i = 0; i < this.actualWord.length; i++) {
            if (letterHited == this.actualWord.charAt(i)) {
                divss[i].textContent = this.actualWord.charAt(i);
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
        this.letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
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

    }
    startGame() {
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
            this.sectionLetters.innerHTML = `<p>Przegrałeś!!! Hasło to: "${this.clue.getActualWord()}"</p>`
        }
        if (this.clue.checkIndexValidLetter()) {
            this.sectionLetters.innerHTML = `<p>Wygrałeś!!! Hasło to faktycznie: "${this.clue.getActualWord()}"</p>`
        }

    }



}

const game = new Game();