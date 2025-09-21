# Daurama - Recycling Just Got Fun

Daurama is a smart, interactive web application that transforms the confusing chore of recycling into a fun and rewarding experience. Developed as a final project for the Hacktiv8 x IBM bootcamp, Daurama uses AI to identify waste and gamifies the process of learning proper waste management.

## Key Features

  * **AI-Powered Recognition:** Instantly identify waste items by uploading a photo, powered by **IBM Granite AI**.
  * **Interactive Learning:** A dynamic mini-game challenges you to sort waste into the correct bins, making the learning process engaging and effective.
  * **Personalized Profile:** Track your progress and watch your pixel pet companion level up and evolve as you make an impact.
  * **Eco-Impact Report:** See your personal contributions, including CO2, energy, and water saved, in a comprehensive report dashboard.
  * **Community Leaderboard:** Compete with other users on a local leaderboard to become the ultimate Eco-Hero.

## The Tech Stack

This project was built with a modern and robust technology stack:

  * **Frontend:** HTML, CSS, and **Pure JavaScript**
  * **Backend:** Node.js with Express.js
  * **AI Integration:** **Google Gemini API** for visual recognition
  * **Data Management:** User data (history, points, levels) is stored locally using `localStorage`—a strategic choice to maintain a lightweight, serverless-style architecture.

## Installation & Setup

Follow these steps to get a local copy of the project up and running.

### Prerequisites

  * Node.js (v14 or higher)
  * npm (v6 or higher)

### Steps

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/[GitHub_Username]/Daurama.git
    cd Daurama
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up the environment variables:**

      * Create a `.env` file in the `backend/` directory.
      * Add your Gemini API Key:
        ```
        GEMINI_API_KEY=[API_KEY_Anda_di_sini]
        ```

4.  **Run the server:**

    ```bash
    npm start
    ```

    The app will be running at `http://localhost:3000`.

## Deployment

This project is configured for easy deployment on **Vercel**. Simply connect your GitHub repository and set the `GEMINI_API_KEY` as an environment variable in your Vercel project settings.

## Author

**Muhammad Rajif Raditya**

  * https://github.com/Chartzh
  * www.linkedin.com/in/rajifraditya

## Acknowledgements

  * Hacktiv8 x IBM Bootcamp
  * Google Gemini AI for the powerful API
