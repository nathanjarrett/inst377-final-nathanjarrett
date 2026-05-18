let products = []; // stores cached products to run w/o reload
let answer = "";
let currentCategory = "";
let score = 0;


async function load(c) {
    const res = await fetch(`/food`);
    const data = await res.json();
    
    products = data;
    next();
    loadScores();
}

function next() {
    const p = products[Math.floor(Math.random() * products.length)]; // chooses random product from cached products
    answer = p.product_name.toLowerCase(); // sets all to lowercase to match user input

    // resets text areas to empty
    document.getElementById("ingredients").textContent = p.ingredients_text;
    document.getElementById("result").textContent = "";
    document.getElementById("answer").textContent = "";
    document.getElementById("hintText").textContent = "";
    document.getElementById("guess").value = "";
}

async function check() {
    const guess = document.getElementById("guess").value.toLowerCase(); // sets user guess to lowercase to increase matches

    // allows for flexibility in user guess
    // if guess is contained in answer then its correct
    if (answer.includes(guess)) {
        score++;
        document.getElementById("result").textContent = "Correct";
        document.getElementById("answer").textContent = answer;

        // sweet alert 2'
        Swal.fire({
            title: 'Correct!',
            text: 'You guessed the food item.',
            icon: 'success'
        });

        await saveScore();

        loadScores();

    } else {
        document.getElementById("result").textContent = "Try again";

        Swal.fire({
            title: 'Incorrect',
            text: 'Try another guess.',
            icon: 'error'
        });
    }

}

function giveUp() {
    document.getElementById("answer").textContent = answer;
}

function hint(){
    // prints search category from API link
    document.getElementById("hintText").textContent = "Hint: " + cat;
}

// save score to backend
async function saveScore() {

    await fetch('/score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: 'Player',
            score: score
        })
    });
}

// load scores from backend
async function loadScores() {
    const res = await fetch('/scores');

    const data = await res.json();

    const names = data.map(x => x.username);
    const scores = data.map(x => x.score);

    const ctx = document
        .getElementById('scoreChart')
        .getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                label: 'Scores',
                data: scores
            }]
        }
    });
}

load();