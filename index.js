const express = require('express');
const bodyParser = require('body-parser');
const supabaseClient = require('@supabase/supabase-js');
const dotenv = require('dotenv');


const app = express();
const port = 5000;
dotenv.config();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

// home page
app.get('/', (req, res) => {
    res.sendFile('public/ingredle.html', { root: __dirname});
});


// fetch 1 - access API
app.get('/food', async (req, res) => {

    try {
        // creates random categories to reduce  size of call
        const categories = ["snacks","candy","chips","nabisco","pepsico"];

        const cat = categories[Math.floor(Math.random() * categories.length)];

        const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${cat}&search_simple=1&action=process&json=1&page_size=20&fields=product_name,ingredients_text&lc=en&countries=United%20States`);

        if (!response.ok) {
            return res.status(500).json({
                message: "Open Food Facts failed",
                status: response.status
            });
        }

        const data = await response.json();

        if (!data.products || data.products.length === 0) {
            return res.status(500).json({
                message: "No products returned"
            });
        }

        // loads one type of prodcuct to use for one session
        const products = data.products.filter(p => p && p.product_name && p.ingredients_text); // filters out just name and ingredients


        if (products.length === 0) {
            return res.status(500).json({
                message: "No valid products after filtering"
            });
        }

        res.json(products);

    } catch (error) {
        console.log("Food route error:", error);
        res.status(500).json({
            message: "Server error in /food route"
        });
    }
});

// fetch 2 - post score to db
app.post('/score', async (req, res) => {

    console.log('Saving score');

    const username = req.body.username;
    const score = req.body.score;

    // checks for unique usernames
    const { data, error } = await supabase.from('scores')
        .upsert({
            username: username, 
            score: score
            },
            {
                onConflict: 'username'
            }
        ).select();

    if (error) {
        console.log(error);
        res.status(500).send(error);
    } else {
        res.json(data);
    }
});

// fetch 3 - get scores from db
app.get('/scores', async (req, res) => {

    console.log('Getting scores');

    const { data, error } = await supabase.from('scores').select()
        .order('score', {
            ascending: false
        });

    if (error) {
        console.log(error);
        res.status(500).send(error);
    } else {
        res.json(data);
    }
});

// fetch 4 - keeps score with username
app.get('/score/:username', async (req, res) => {

    const username = req.params.username;

    const { data, error } = await supabase
        .from('scores')
        .select()
        .eq('username', username)
        .single();

    res.json(data || { username, score: 0 });
});

app.listen(port, () => {
    console.log(`App is available on port: ${port}`);
});

