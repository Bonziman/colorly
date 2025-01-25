# Colorly: A Harmonious Color Palette Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Project Overview

Colorly is a web application designed to empower designers and creatives by providing a user-friendly platform to generate, manipulate, and export harmonious color palettes. The application combines web technologies, color theory, and user interface best practices to create a seamless and innovative experience for color palette creation.

## Features

*   **Color Code Conversion**: Ability to convert between different color codes.
*   **Palette Generation:** Generate color palettes using different methods.
*   **Image Color Extraction:** Extract color palettes directly from uploaded images.
*   **Palette Preivew:** Preview generated palette in real life components.
*   **Customizable Palettes:** Provides different methods of palette generation and allows users to lock specific colors in the palette.
*   **Export Palettes:** Offers functionality to copy the palettes to the clipboard.
*   **User Authentication:** Provides user registration, login, logout, and user profile management.

## Technologies

*   **Frontend:**
    *   React
    *   JavaScript (ES6+)
    *   HTML & CSS
    *   React Router
    *    `react-icons`
    *   `colorthief` and `chroma-js`
*   **Backend:**
    *   Python with Flask
    *   SQLAlchemy
*   **Other Technologies:**
    *   Vite
    *  localStorage
    *   dotenv

## Project Architecture

The application uses a modular structure:

*   **Frontend (`frontend/`):** Contains the React-based user interface components, pages, and client-side logic.
    *   Components are organized within the `src/components` directory.
    *   Styling is primarily done using CSS files within the `src/components/styles` directory.
    *   Routing is managed using `react-router-dom`.
    *   Context API used to manage user authentication status.
*   **Backend (`backend/`):** Implements the API using Flask, managing data persistence with SQLAlchemy, and serving user images.
    *   API endpoints for user authentication and color saving.
    *   Database configuration in `app.py`.

## Setup Instructions

To set up the project locally, follow these steps:

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/Bonziman/colorly.git
    cd colorly
    ```

2.  **Backend Setup:**

    *   Navigate to the `backend` directory.

      ```bash
      cd backend
      ```

    *   Create a Python virtual environment:

      ```bash
      python -m venv venv
      ```

    *   Activate the virtual environment:
        *   On macOS and Linux:

            ```bash
            source venv/bin/activate
            ```

        *   On Windows:

            ```bash
            venv\Scripts\activate
            ```

    *   Install backend dependencies:

        ```bash
        pip install -r requirements.txt
        ```

    *   Create a `.env` file in the `backend` folder, copy the contents of `.env.example` and add your own values. This file includes the `SECRET_KEY` and the `JWT_SECRET_KEY`. You can generate a secure random key using python using these commands:

        ```bash
         python -c 'import secrets; print(secrets.token_hex(32))'
        ```
     * Replace `SECRET_KEY=` and `JWT_SECRET_KEY=` with these generated tokens on the `.env` file.

    *   Run the server:

        ```bash
        python main.py
        ```

3.  **Frontend Setup:**

    *   Open another terminal and navigate to the `frontend` directory.

      ```bash
        cd frontend
      ```

    *   Install frontend dependencies:

        ```bash
        npm install
        ```
         or
       ```bash
       yarn install
        ```

   * Copy `.env.example` to `.env.local` and add your own values for Supabase, Mailgun and SendinBlue (optional), this include the following keys: `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`, `VITE_SENDINBLUE_API_KEY`

    *   Start the frontend development server:

        ```bash
         npm run dev
        ```
         or
       ```bash
       yarn dev
        ```

4.  **Access the Application:**

    *   Open your browser and navigate to the URL provided by the frontend development server (usually `http://localhost:5173`).
    *   The backend API should be running at `http://localhost:5000`.

## Usage Guidelines

1.  **Color Generator:**
    *   Create random color codes by clicking the "Generate" button or pressing the spacebar.
    *   Copy colors by clicking on the copy icon on every color code.

2.  **Palette Generator:**
    *   Create a new color palette by pressing the spacebar or click the button.
    *   Lock or unlock each color on your palette and regenerate it.
    *   Change the colors individually using the color input.
    *  Generate new palettes based on different methods.

3.  **Image Palette Extractor:**
    *   Upload an image by using the "Browse Image" button.
    *   Generate new palettes based on the default and extracted colors by moving the slider.
    *  Drag and drop the circles over the image, and update the colors by the new position of the dots.
    *   Copy the final color palette using the "Export palette" button.

4.   **User Authentication:**
    *   Create a new account using the "Sign up" link.
    *   Log in using the "Login" link.
    *   After login, you can see your username and access your profile settings.

## Known Issues and Future Improvements

*   **Palette Generation Refinement:** Further refine all the generation methods, particularly Analogous, Complementary, Split Complementary, Triadic, and Tetradic to get perfect, harmonious, results.
*   **UI Enhancements:** Implement a more consistent and polished UI.
*    **Image Palette Enhancements**: Enhance the image palette experience to have a better user experience, and add new features.
*    **Testing strategies**: Add more tests, and better testing strategies.
*  **New Features**: Add new functionalities that would improve the user experience of the app.
*   **Colorly Plus:** Implement a viable business model, potentially offering advanced features through a low-fee subscription tier called 'Colorly Plus.'

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
