document.addEventListener('DOMContentLoaded', () => {
    let introStep = 0;
    let introActive = true;

    const introScript = [
        {
            text: "Blackjack is one of the most popular card games in the world.The goal is to beat the dealer without exceeding 21 points..",
            avatar: "dealer-idle.svg"
        },
        {
            text: "Face cards are worth 10. Aces are 1 or 11.",
            avatar: "dealer-dealing.svg"
        },
        {
            text: "In this game, you are dealt two cards and can choose to \"hit\" (take another card) or \"stand\" (keep your current hand).",
            avatar: "dealer-idle.svg"
        },
        {
            text: "The dealer also receives two cards, but one of them is face down.",
            avatar: "dealer-dealing.svg"
        },
        {
            text: "The best hand is an Ace and a 10-point card, which is called a \"blackjack\".",
            avatar: "dealer-idle.svg"
        },
        {
            text: "If you get a blackjack, you win! Unless the dealer also has a blackjack, in which case it's a tie (Push).",
            avatar: "dealer-dealing.svg"
        },
        {
            text: "If you exceed 21 points, you lose. The dealer must hit until they have at least 17 points.",
            avatar: "dealer-idle.svg"
        }
    ];

    
    let deck = []
    let playerHand = [];
    let dealerHand = [];
    let gameOver = false;

    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = [
        { value: '2', score: 2 },
        { value: '3', score: 3 },
        { value: '4', score: 4 },
        { value: '5', score: 5 },
        { value: '6', score: 6 },
        { value: '7', score: 7 },
        { value: '8', score: 8 },
        { value: '9', score: 9 },
        { value: '10', score: 10 },
        { value: 'J', score: 10 },
        { value: 'Q', score: 10 },
        { value: 'K', score: 10 },
        { value: 'A', score: 11 }
    ];

    function showIntroStep() {
    const messageBox = document.getElementById("game-message");
    const avatar = document.getElementById("dealer-avatar");
    hitButton.style.display = "none";
    standButton.style.display = "none";

    messageBox.textContent = introScript[introStep].text;
    avatar.src = introScript[introStep].avatar;
    }

    document.getElementById("next-intro").addEventListener("click", () => {
    introStep++;

    if (introStep < introScript.length) {
        showIntroStep();
    } 
    
    else {
        // Intro finished
        document.getElementById("next-intro").style.display = "none";
        document.getElementById("start-game").style.display = "inline-block";
        document.getElementById("game-message").textContent =
            "Ready to play?";
        document.getElementById("dealer-avatar").src = "dealer-win.svg";
    }
});

document.getElementById("start-game").addEventListener("click", () => {
    introActive = false;

    document.getElementById("intro-controls").style.display = "none";

    hitButton.style.display = "inline-block";
    standButton.style.display = "inline-block";

    startGame();
});


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function startGame() {
        document.getElementById("dealer-cards").innerHTML = "";
        document.getElementById("dealer-score").textContent = "";
        document.getElementById("dealer-avatar").src = "dealer-idle.svg";
        deck = [];
        playerHand = [];
        dealerHand = [];
        setMessage("");

        document.getElementById("player-cards").innerHTML = "";
        document.getElementById("player-score").textContent = "";

        createDeck();
        shuffle(deck);
        gameOver = false;
        hitButton.disabled = false;
        standButton.disabled = false;  

        dealCard(playerHand, "player-cards");
        dealCard(dealerHand, "dealer-cards");

        const dealerContainer = document.getElementById("dealer-cards");
        const hiddenDiv = document.createElement("div");
        hiddenDiv.classList.add("card");
        hiddenDiv.setAttribute("id", "hidden-card");
        hiddenDiv.style.backgroundImage = "url('cards/hidden.svg')";

        dealerContainer.appendChild(hiddenDiv);

        dealCard(playerHand, "player-cards");
        dealCard(dealerHand);

        document.getElementById("player-score").textContent = 
            "Score: " + calculateScore(playerHand);

        const playerScore = calculateScore(playerHand);
        if (playerScore === 21) {
        await dealerTurn()
    }


    }

    function renderCard(card, containerId) {
        const container = document.getElementById(containerId);

        const cardDiv = document.createElement("div");

        cardDiv.classList.add("card");
        cardDiv.style.backgroundImage = 
            `url("cards/${card.value}-${card.suit}.svg")`;
        cardDiv.style.backgroundSize = "cover";
        cardDiv.style.backgroundRepeat = "no-repeat";
        


        container.appendChild(cardDiv);
    }

    function setMessage(text) {
        document.getElementById("game-message").textContent = text;
        
    }

    function dealCard(hand, containerId = null) {
        let card = deck.pop();
        hand.push(card);

        if (containerId) {
            renderCard(card, containerId);
        }

        return card;
    }


    function createDeck() {
        for (let suit of suits) {
            for (let i = 0; i < values.length; i++) {
                deck.push({ 
                suit,
                value: values[i].value, 
                score: values[i].score });
        }
    }

    }

    function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[randomIndex]] = [deck[randomIndex], deck[i]];
    }
    }

    function calculateScore(hand) {
    let total = 0;
    let aceCount = 0;

    for (let card of hand) {
        total += card.score;

        if (card.value === "A") {
        aceCount++;
        }
    }

    while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount--;
    }

    return total;
}

    async function dealerTurn() {
        let dealerScore = calculateScore(dealerHand);
        document.getElementById("dealer-avatar").src = "dealer-dealing.svg";

        // Reveal hidden card
        const hiddenDiv = document.getElementById("hidden-card");
        hiddenDiv.style.backgroundImage =
         `url("cards/${dealerHand[dealerHand.length - 1].value}-${dealerHand[dealerHand.length - 1].suit}.svg")`;

        hiddenDiv.style.backgroundSize = "cover";
        hiddenDiv.textContent = "";

        while (dealerScore < 17) {
            await sleep(600);

            dealCard(dealerHand, "dealer-cards");
            dealerScore = calculateScore(dealerHand);
        }

        document.getElementById("dealer-score").textContent =
        "Score: " + dealerScore;

            determineWinner();
    }

    function determineWinner() {
        let playerScore = calculateScore(playerHand);
        let dealerScore = calculateScore(dealerHand);

        if (dealerScore > 21) {
            setMessage("Dealer busts! You win!");
            document.getElementById("dealer-avatar").src = "dealer-lose.svg";
            hitButton.disabled = true;
            standButton.disabled = true;
            playAgainButton.style.display = "inline-block";

        } 
        
        else if (playerScore > dealerScore) {
            if (playerScore === 21 && playerHand.length === 2) {
                setMessage("Blackjack! You win!");
                hitButton.disabled = true;
                standButton.disabled = true;
                playAgainButton.style.display = "inline-block";
            }
            
            else{
            setMessage(playerScore + " beats " + dealerScore + ", You win!");
            document.getElementById("dealer-avatar").src = "dealer-lose.svg";
            hitButton.disabled = true;
            standButton.disabled = true;
            playAgainButton.style.display = "inline-block";
            }

        } 
        
        else if (dealerScore > playerScore) {
            setMessage(dealerScore + " beats " + playerScore + ", Dealer wins!");
            document.getElementById("dealer-avatar").src = "dealer-win.svg";
                            hitButton.disabled = true;
                standButton.disabled = true;
                playAgainButton.style.display = "inline-block";

        } 
        
        else {
            setMessage("Push!");                
            hitButton.disabled = true;
            standButton.disabled = true;
            playAgainButton.style.display = "inline-block";
        }

        gameOver = true;
        hitButton.disabled = true;
        standButton.disabled = true;
        playAgainButton.style.display = "inline-block";
    }
    const playAgainButton = document.getElementById("play-again");
    playAgainButton.style.display = "none";

    
    const hitButton = document.getElementById("hit");

    hitButton.addEventListener("click", function() {

    if(gameOver) return;

    dealCard(playerHand, "player-cards");

    let score = calculateScore(playerHand);

    document.getElementById("player-score").textContent =
        "Score: " + score;


        if (score > 21) {
        setMessage("Bust! You lose.");
        document.getElementById("dealer-avatar").src = "dealer-win.svg";
        gameOver = true;
        hitButton.disabled = true;
        standButton.disabled = true;
        playAgainButton.style.display = "inline-block";
    }
        if (score === 21) {
            dealerTurn()
    }
    });

    playAgainButton.addEventListener("click", function() {
    startGame();
    hitButton.disabled = false;
    standButton.disabled = false;
    playAgainButton.style.display = "none";

    });

    const standButton = document.getElementById("stand");

    standButton.addEventListener("click", async function() {
        if (gameOver) return;

        gameOver = true;

        hitButton.disabled = true;
        standButton.disabled = true;

        await dealerTurn();

        playAgainButton.style.display = "inline-block";
        });
    

showIntroStep();
});
