EVRION HUB V2 FIX

The previous build used fetch(games.json), which browsers can block when index.html is opened directly from your phone/PC. This version uses games.js, so the library loads without a server.

TO ADD A GAME:
Open games.js, copy an object, edit its details and URL, save it, and upload games.js. The HTML does not need to be changed.

Example URL:
"url": "https://your-game-site.example/"

For your existing quiz, replace YOUR_QUIZ_URL_HERE with the quiz's public URL.

For a game stored inside the Hub:
"url": "games/game-004/index.html"
