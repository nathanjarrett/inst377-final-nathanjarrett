let products = []; // stores cached products to run w/o reload
let answer = "";
let currentCategory = "";
let score = 0;
let scoreChart = null;


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

// save score to backend
async function saveScore() {
    const username = document
        .getElementById('username')
        .value
        .trim();

    if (username === '') {
        Swal.fire({
            title: 'Username Required',
            text: 'Please enter a username.',
            icon: 'warning'
        });
        return;
    }

    await fetch('/score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            score: score
        })
    });
}

// load scores from backend
async function loadScores() {

    const res = await fetch('/scores');
    const data = await res.json();

    console.log(data);

    const names = data.map(x => x.username);
    const scores = data.map(x => x.score);

    const ctx = document
        .getElementById('scoreChart')
        .getContext('2d');

    // destroy old chart before creating new one
    if (scoreChart) {
        scoreChart.destroy();
    }

    scoreChart = new Chart(ctx, {
        type: 'bar',
        data: {

            labels: names,

            datasets: [{
                label: 'Scores',
                data: scores
            }]
        },
        options: {
            responsive: true
        }
    });
}

load();