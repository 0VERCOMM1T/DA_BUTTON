# 🧭 Team Prompt for AI Assistants (DA_BUTTON Project)

You are assisting a team of developers building **DA_BUTTON**, a campus-themed guessing game inspired by GeoGuessr. The project setup and goals are as follows:

---

## 🎯 Project Goal
- Build a **web-based game** where a user is shown a random photo of a campus location.  
- The user **drops a pin on a map** (custom campus map image) to guess where the photo was taken.  
- The game calculates **distance between guess and actual location** to score the round.  
- Must be **mobile-friendly and desktop-friendly**.  

---

## 🛠️ Tech Stack
- **Frontend Framework:** React (scaffolded with Vite)  
- **Styling:** Tailwind CSS  
- **Mapping:** Leaflet.js with React-Leaflet (using a campus map image overlay, zoom/pan enabled)  
- **Distance Calculation:** `geolib` (Haversine or pixel distance)  
- **Hosting/Deployment:** Netlify (connected to GitHub repo, CI/CD enabled)  

---

## 📂 Project Structure

DA_BUTTON/
├── public/
│ ├── photos/ # Location photos
│ └── map.jpg # Campus map overlay
├── src/
│ ├── components/
│ │ ├── GameMap.jsx # Leaflet interactive map
│ │ └── PhotoCard.jsx# Random photo + prompt
│ ├── data/
│ │ └── locations.js # Metadata: { name, coords, photo }
│ ├── App.jsx # Main game loop
│ ├── index.css # Tailwind entry
│ └── main.jsx # React entry

---

## 👩‍💻 Dev Workflow
1. Clone repo:  
   ```bash
   git clone https://github.com/our-org/DA_BUTTON.git
   cd DA_BUTTON

    Install deps:

npm install

Run locally:

    npm run dev

    Push branches → Netlify auto-deploys previews for PRs.

    Merge to main → Netlify auto-updates production site.

📜 Licensing & Attribution

    License: MIT (LICENSE file in repo).

    Attribution: Contributors listed in README.md or CONTRIBUTORS.md.

🔧 Things AI Can Help With

    Writing clean, maintainable React components.

    Implementing Leaflet features (pin drops, distance calc).

    Making UI responsive with Tailwind.

    Adding game logic (random photo selection, scoring).

    Improving readability & docs (README, comments, contributor guides).

    Suggesting future expansions (leaderboards, Firebase backend, multiplayer).

📌 AI Assistant Guidelines

    Always generate React + Vite + Tailwind + Leaflet–compatible code.

    Use public/photos/ for large static images, src/assets/ for small icons/logos.

    Assume Node.js v20+ with npm as the package manager.

    All instructions should assume team collaboration (GitHub + Netlify CI/CD).


---

# 📄 `README.md` (with context for humans + AI)
Here’s an updated, polished `README.md`:

```markdown
# DA_BUTTON 🎯

DA_BUTTON is a campus-themed guessing game inspired by GeoGuessr. Players are shown a random photo of a location, then drop a pin on a custom map to guess where the photo was taken. The closer the guess, the higher the score.

---

## 🚀 Features
- Random location photo each round  
- Interactive map with zoom/pan  
- Drop a pin to make your guess  
- Distance-based scoring (using geolib)  
- Mobile and desktop support  
- Automatic deployment with Netlify  

---

## 🛠️ Tech Stack
- [React](https://reactjs.org/) (via Vite)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [Leaflet.js](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/)  
- [Geolib](https://www.npmjs.com/package/geolib)  
- [Netlify](https://www.netlify.com/) for hosting + CI/CD  

---

## 📂 Project Structure

public/
photos/ # Campus location photos
map.jpg # Campus map overlay
src/
components/
GameMap.jsx # Map logic
PhotoCard.jsx # Shows random photo
data/
locations.js # Photo metadata (name, coords, file path)
App.jsx
index.css
main.jsx


---

## 🧑‍💻 Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/our-org/DA_BUTTON.git
cd DA_BUTTON
npm install
npm run dev

Open http://localhost:5173

in your browser.
🌍 Deployment

    Pushed branches → Netlify auto-deploys previews for PRs.

    main branch → auto-deploys to production.

📜 License

This project is licensed under the MIT License

.
🤝 Contributors

See CONTRIBUTORS.md
.