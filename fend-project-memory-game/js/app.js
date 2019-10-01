//I used Mathew Cranford's page to help guide me through logic and organization for this game. It was extremely helpful: https://matthewcranford.com/memory-game-walkthrough-part-1-setup/

/*
 * Create a list that holds all of your cards
 */
const deck = document.querySelector('.deck');
let toggledCards = [];
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;
const allMatched = 8;


writeModalStats();
toggleModal();
resetCards();
shuffleDeck();

function writeModalStats() {
    const timeStat = document.querySelector('.modal_time');//creates var for modal-time element.
    const clockTime = document.querySelector('.clock').innerHTML;//creates var for clock's innerHTMl which records time from our displayTime function.
    const movesStat = document.querySelector('.modal_moves');//creates var for modal-moves element.
    const starsStat = document.querySelector('.modal_stars');//creates var for modal-moves element.
    const stars = getStars();//retrieves # of stars from a new function.
    
    timeStat.innerHTML = `Time = ${clockTime}`;//Copies recorded time into modal's time element.
    movesStat.innerHTML = `Moves = ${moves+1}`;//Copies moves into modal's moves element.Accounted for additional move.
    starsStat.innerHTML = `Stars = ${stars}`;//Copies star into modal's stars element.
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
//My shuffle cards function

function shuffleDeck() {
    const cardsToShuffle = Array.from(document.querySelectorAll('.deck li')); //var holding li items in my deck. Important thing to note here - w/o array.from, we observed that this prints out as a nodeList and not an array like the shuffle function provided below, expects.  

    const shuffledCards = shuffle(cardsToShuffle);
    for(card of shuffledCards) {
        deck.appendChild(card);
    }
}


// Shuffle function from http://stackoverflow.com/a/2450976 - takes an array parameter and returns the array shuffled. 
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */




//flipping over logic
deck.addEventListener('click', event => {
    const clickTarget = event.target;
    if (isClickValid(clickTarget)) { //if card target passes conditionals from the seperated isClickedValid function. 
        if (clockOff) {
            startClock();
            clockOff = false;
        }
        toggleCard(clickTarget);//perform the toggleCard function
        addToggleCard(clickTarget);//perform the addToggleCard function
        if (toggledCards.length === 2) {// if theres two cards in the list..
            checkForMatch(clickTarget);//perform the checkformatch function
            addMove();//perform the addmove function
        }
    }
});


//seperated valid click function that checks if card target is clicked and there isn't more than two in the toggledcards list, and it's not already in toggledCards, and it hasn't been toggled matched..

function isClickValid(clickTarget) {
    return (
    clickTarget.classList.contains('card') && !clickTarget.classList.contains('match') && toggledCards.length < 2 && !toggledCards.includes(clickTarget)
    );
}



//Clock-start function 

function startClock() { 
    clockId = setInterval(() => {//sets up second-interval timing
        time++; //increases time var
        displayTime(); //runs time logic function below
    }, 1000); // time count increased 1000ms 
}



//Time display function 

function displayTime() {
    const clock = document.querySelector('.clock');
    const minutes = Math.floor(time / 60); //calc min
    const seconds = Math.floor(time % 60); //calc sec
    if (seconds < 10) {
        clock.innerHTML = `${minutes}:0${seconds}`; //adds 0 before single-digit 
    } else {
        clock.innerHTML = `${minutes}:${seconds}`; //removes the zero on double-digit
    }
}


//Clock-stop function 

function stopClock() {
    clearInterval(clockId);//pass clearinterval method on ClockId-interval to stop-clock
}


//flip toggle function 
function toggleCard(card) {
    card.classList.toggle('open');//when clicked, toggles open and unopen
    card.classList.toggle('show');//when clicked, toggles show and unshow
}


//adding the card to toggle card array function

function addToggleCard(clickTarget) {
    toggledCards.push(clickTarget);//add this card into the toggled cards array
    console.log(toggledCards);//print the list
}

// card-matching function/logic

function checkForMatch() {
    if (toggledCards[0].firstElementChild.className === toggledCards[1].firstElementChild.className) 
    {//if both cards match
        toggledCards[0].classList.toggle('match');//toggle first card to match
        toggledCards[1].classList.toggle('match');//toggle second card to match
        toggledCards = [];//empty out our toggled list 
        matched++; //increments the matched global variable #
        console.log(matched);
        checkForWin();
    }else {
        setTimeout(() => {
        toggleCard(toggledCards[0]); //toggle card 1
        toggleCard(toggledCards[1]); //toggle card 2
        toggledCards = []; //empty out our toggled list. This statements order is !
        }, 1000); //allows cards to briefly appear before turning them back over 
    }
}

//win-condition function 
function checkForWin() {
    if (matched === allMatched) {
        gameOver();
    }
}


//game over function 

function gameOver () {
    stopClock();
    writeModalStats();
    toggleModal();
    resetGame();
}

// My Moves function

function addMove() {
    moves++; //add another to the count
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves; //update move's HTML text
    checkScore();//fixed the hidestar bug. It wouldnt remove stars at the appropriate time before. 
}


//My score-checking function for stars

function checkScore() {
    if (moves === 16 || moves === 24) {
        hideStar();
    }
}


//Star function

function hideStar() {
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        if (star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }
    }
}



//Modal toggling function 

function toggleModal () {
    const modal = document.querySelector('.modal_background');
    modal.classList.toggle('hide');
}

toggleModal();


//Stars tally function for stats-purpose.

function getStars () {
    const starList = document.querySelectorAll('.stars li');
    starCount = 0; 
    for (star of starList) {
        if (star.style.display !== 'none') {
            starCount++;
        }
    
    }
    return starCount;
}


// Game reset functions 

function resetGame() {
    matched = 0;
    shuffleDeck();
    resetClockandTime();
    resetMoves();
    resetStars();
    resetCards();
}

function resetClockandTime() {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}


function resetMoves() {
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}


function resetStars() {
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
    }
}


//Reset game button event
document.querySelector('.restart').addEventListener('click', resetGame);

//Modal buttons events
document.querySelector('.modal_button_replay').addEventListener('click', replayGame);
document.querySelector('.modal_button_cancel').addEventListener('click', toggleModal);
document.querySelector('.modal_close').addEventListener('click', toggleModal);



//replay-button function 
function replayGame() {
    resetGame();
    toggleModal();
    //removed resetCards() from here because it's already stated in restartGame
}


//resetting the cards - turns them over

function resetCards() {
    toggledCards = [];//clears the toggled cards to fix weird last unmatched card on restart flipping over.
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
}
