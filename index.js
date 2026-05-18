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

        const data = await response.json();

        // loads one type of prodcuct to use for one session
        const products = data.products.filter(p => p && p.product_name && p.ingredients_text); // filters out just name and ingredients

        res.json(products);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error retrieving food data'
        });
    }
});

// fetch 2 - post score to db
app.post('/score', async (req, res) => {
    const username = req.body.username;

    // first get the current score
    const { data: existing } = await supabase
        .from('scores')
        .select('score')
        .eq('username', username)
        .single();

    const newScore = (existing?.score || 0) + 1;

    // keeps score associated with username using upsert
    const { data, error } = await supabase
        .from('scores')
        .upsert(
            { username: username, score: newScore },
            { onConflict: 'username' }
        )
        .select();

    if (error) {
        console.log(error);
        res.status(500).send(error);
    } else {
        res.json(data);
    }
});

// fetch 3 - get scores from db
app.get('/scores', async (req, res) => {
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

app.listen(port, () => {
    console.log(`App is available on port: ${port}`);
});

