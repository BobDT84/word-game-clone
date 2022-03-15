class Game{
    constructor(){
        this.word = '';
        this.wordsArray = [];
        this.randomIndex ;
        this.attempts;
        this.currentAttempt = '0';
        this.attemptID;
        this.letters;
        this.guess = [];
    }
    isCorrectLetterSetup(){
        if(this.letters < 4 || this.letters > 8){
            alert('letter count not set properly');
            return false;
        }
        return true;
    }
    isCorrectAttemptSetup(){
        if(this.attempts < 2 || this.attempts > 10){
            alert('Attempt count not set properly');
            return false;
        }
        return true;
    }
    setRandomIndex(max = this.wordsArray.length){
        if(max > 0){
            this.randomIndex = Math.floor(Math.random() * max);
        }
    }
    setArray() {
        if(this.isCorrectLetterSetup() && this.isCorrectAttemptSetup()){
            let array,string;
            let path = './words/words' + this.letters.toString() + '.csv'
            let xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', path, false);
            xmlhttp.send();
            if (xmlhttp.status==200) {
                string = xmlhttp.responseText;
            }
            array = string.split(',');
            this.wordsArray = array;
        } else {
            alert('did not set array');
        }
    }
    setWord(i=0){
        if(this.wordsArray.length > 0 && this.randomIndex > -1){
            console.log('RandomIndex is ' + this.randomIndex);
            this.word = this.wordsArray[this.randomIndex].toUpperCase();
        } else if(i < 10){
            this.setRandomIndex();
            this.setArray();
            console.log('setWord attempts - ' + i);
            i++;
            this.setWord(i);
            //console.log('is setWord() stuck in a loop?');
        } else {
            alert('word not set');
        }
    }
    setupGameBoard(){
        if(this.isCorrectLetterSetup() && this.isCorrectAttemptSetup()){
            let gameBoard = document.querySelector('#game');
            this.clearBoard(gameBoard);
            let attempt,letter;
            for(let i = 0; i<this.attempts; i++){
                let attemptID = 'attempt' + i.toString();
                attempt = document.createElement('div');
                attempt.id = attemptID;
                attempt.className = 'attempt';
                for(let j = 0; j<this.letters; j++){
                    letter = document.createElement('div');
                    letter.id = attemptID + ' l' + j.toString();
                    letter.className = 'letter-block';
                    attempt.appendChild(letter);
                }
                gameBoard.appendChild(attempt);
            }
        }
    }
    setupKeyboard(){
        let keyboard = document.querySelector('#keyboard');
        this.clearBoard(keyboard);
        let rows = {
            row1:'QWERTYUIOP',
            row2:'ASDFGHJKL',
            row3:'ZXCVBNM',
        };
        for(let row in rows){
            let div = document.createElement('div');
            div.id = row;
            div.className = 'keyRow';
            for(let letter of rows[row]){
                let key = document.createElement('div');
                key.className = 'key';
                key.innerText = letter;
                div.appendChild(key);
            }
            keyboard.appendChild(div);
        }
    }
    setupEnterDelete(){
        let row3 = document.querySelector('#row3');
        let key = document.createElement('div');

        key.className = 'enter';
        key.innerText = 'Enter';
        key.onclick = () => {this.submitGuess();};
        row3.appendChild(key);

        key = document.createElement('div');
        key.className = 'delete';
        key.innerText = 'Del';
        key.onclick = () => {
            this.guess.pop();
            this.clearGuessDisplay();
            this.displayGuess();
        };
        row3.appendChild(key);
    }
    setupGame(){
        this.setupGameBoard();
        this.setupKeyboard();
        this.setupEnterDelete();
        this.addKeyboardListeners();
        this.setWord();
        this.setAttemptID();
        this.test();
    }
    addKeyboardListeners(){
        let keys = document.getElementsByClassName('key');
        for(let key of keys){
            key.onclick = (e) => {
                let letter = e.path[0].innerText;
                this.addToGuess(letter);
            };
        }
    }
    addToGuess(text){
        if(this.guess.length < this.letters){
            this.guess.push(text);
            console.log(this.guess);
            this.displayGuess();
        }
    }
    setAttemptID(){
        this.attemptID = 'attempt' + this.currentAttempt;
    }
    displayGuess(){
        let attempt = document.getElementById(this.attemptID);
        for(let i=0; i<this.guess.length; i++){
            let letter = document.getElementById(this.attemptID + ' l' + i);
            letter.innerText = this.guess[i];
        }
    }
    clearGuessDisplay(){
        let guessBoxes = document.getElementById(this.attemptID).childNodes;
        for(let box of guessBoxes){ box.innerText = ''; }
    }
    clearBoard(element){
        while(element.firstChild){
            element.removeChild(element.firstChild);
        }
    }
    submitGuess(){
        let guess = this.guess;
        for(let i=0; i<guess.length; i++){
            let boxID = this.attemptID + ' l' + i.toString();
            let box = document.getElementById(boxID);
            if(this.isCorrectLetter(guess[i],i)){
                box.classList.add('correct');
            } else if( this.isClose(guess[i])){
                box.classList.add('close');
            } else {
                box.classList.add('incorrect');
            }
        }
        this.nextAttempt();
        console.log('Guess: ' + this.guess);
        console.log('Word: ' + this.word);
    }
    isCorrectLetter(guess, index){
        let word = this.word.split('');
        if(guess == word[index]){return true;} else {return false;}
    }
    isClose(guess){
        let word = this.word.split('');
        return word.includes(guess);
    }
    nextAttempt(){
        if(this.currentAttempt < this.attempts){
            this.currentAttempt++;
            this.setAttemptID();
            this.guess = [];
        }
    }
    test(){
        //run in setup to test current method that is work in progress
    }
}


function newGame(e){
    let letters = document.getElementById('letters').value;
    let attempts = document.getElementById('attempts').value;
    let guess = document.getElementById('guess');
    let game = new Game();
    game.letters = letters
    game.attempts = attempts;
    //guess.addEventListener()  How to know when this element is updated?
    game.setupGame();
    return game;
}


let newGameButton = document.getElementById('newGame');
newGameButton.addEventListener('click', newGame);
