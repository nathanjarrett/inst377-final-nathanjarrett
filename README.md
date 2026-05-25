# Ingredle!

## Description of Project:
Ingredle is a fun interactive game that gives players the opportunity to see the see the ingredients in common household food items. This game spins off the idea of wordle, a daily word guessing game, but focused on healthy eating. By having users attempt to identify the food item by its ingredients, it forces users to think critically about what ingredients are in the food products they consume on a regular basis. 

## Description of Target Browsers:
This website is intended for all webbrowsing platforms (chrome, firefox, safari) and all device types (PC, iOS, phone, tablet).


## Developer Manual

### Project Overview
Ingredle is built as a full-stack web application using:

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js with Express
- Database: Supabase
- External API: Open Food Facts API
- Visualization: Chart.js
- Alerts: SweetAlert2

The backend serves API routes for food data and score management. The frontend communicates with the backend using Fetch API.

## Installation

### 1. Clone the repository
git clone https://github.com/nathanjarrett/inst377-final-nathanjarrett.git


### 2. Install dependencies
npm install @supabase/supabase-js express body-parser dotenv

### 3. Create environment variables

Create a .env file in the root directory:

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

## Running the Application

### Start server locally
npm start

Server runs on:
http://localhost:5000

### Vercel deployment
Live site:
https://inst377-final-nathanjarrett.vercel.app

## API Documentation
API from https://world.openfoodfacts.org/

### GET /food
Returns a list of food products with ingredients.

[
  {
    "product_name": "string",
    "ingredients_text": "string"
  }
]

### POST /score
Creates or updates a user score.

### GET /scores
Returns leaderboard data sorted by highest score.

## Known Bugs
- External API may occasionally fail or return empty data


## Roadmap
- Add difficulty levels
- Add daily challenge mode
- Improve scoring system with streaks
- Improve caching for API calls
