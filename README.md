# 🚀 Stinky-Spacesurfer 🏄🌌

**(apparently, naming things is hard, and we're all just going with the vibe anyway, right?)**

![build-status](https://img.shields.io/badge/build-probably%20broken-red.svg)
![license](https://img.shields.io/badge/license-do%20whatever%20the%20fuck%20you%20want-brightgreen.svg)
![dependencies](https://img.shields.io/badge/dependencies-way%20too%20many-yellow.svg)

## TL;DR; (For the Zoomers and ADHD people out there)

You want to find some HuggingFace Spaces, but you're too lazy to, you know, *actually look*?  This abomination of code lets you do just that.  It's like Tinder, but for AI demos, and instead of disappointment, you get... well, probably also disappointment, but at least it's *AI-powered* disappointment.

We've got:

*   **Filters:**  who has time to scroll through *all* the garbage?  Filter by category, Space type, SDK... you know, the usual suspects.
*   **Swiping:**  Yeah, we ripped off Tinder.  Sue us.  Swipe right if you like it (you won't), swipe left if you hate it (you will).
*   **History:**  A chronological record of your poor life choices.  Revisit the Spaces you *thought* were cool, only to realize they were just as stinky as the rest.
*   **Dark Mode:**  staring at a bright screen is for normies.
* **A fuckton of UI components:** Thanks to the magic of `shadcn/ui`, we have more components that anyone needs, behold the sheer unoriginality.

## Tech Stack

*   **Frontend:**
    *   React (everyone else is doing it)
    *   Vite (it's fast, or so they say)
    *   Tailwind CSS (writing CSS is for masochists)
    *   shadcn/ui (we're too busy to design our own components)
    *   React Query (for fetching data and caching, we're not *completely* incompetent)
    *   Wouter (React Router is too mainstream)
    *   Framer Motion (for animations to distract you from the shitty code)

*   **Backend:**
    *   Express (it's the least worst option)
    *   Drizzle ORM (too scared to write raw SQL)
    *   Zod (for validation, we don't trust ourselves)
    *   Neon (serverless)
* **Deployment:**
	* Replit (it's free and easy, like me.)

## Getting Started (Good Luck, You'll Need It)

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/stinkyyyyy/SpaceSurfer
    ```
    (You did fork it first, right? ... Right?)

2.  **Install dependencies:**
    ```bash
    cd stinkyyyyy-spacesurfer
    npm install
    ```

3.  **Create a `.env` file:**.
   You'll need a `DATABASE_URL` for your Postgres database (if you're not running it on replit). Good luck figuring that out.

4.  **Run the dev server:**
    ```bash
    npm run dev
    ```
    This will start both the front-end and back-end dev servers.

5. **Build and start:**
	```bash
	npm run build
	npm run start
	```

## Contributing

if you *really* insist, fork the repo, make your changes, and submit a pull request.  I'll probably approve it, but don't expect me to know how to fix things.

## License (Do Whatever the Fuck You Want)

This project is licensed under the "Do Whatever the Fuck You Want" license. Sell it, steal it, run it on your smart fridge... I'm just happy to build somethin.

## Disclaimer

This project is provided "as is," without warranty of any kind.  If it breaks your computer, sets your house on fire, or causes a divorce, that's your problem, not mine.  Have fun :3
