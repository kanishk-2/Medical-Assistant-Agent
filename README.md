# Medical-Assistant-Agent

## 🏥 Symptom Checker Web App

A simple, user-friendly web application that leverages the power of the **Google Gemini API** to classify symptoms into categories such as **General**, **Emergency**, or **Mental Health**. It provides safe next-step recommendations and possible causes, all within a clean and responsive interface.

---

## ✨ Features
-   **Symptom Classification:** Quickly determines whether a symptom falls under General, Emergency, or Mental Health. 
-   **Next Steps Guidance:** Offers safe, actionable next steps based on classification. 
-   **Possible Causes:** Suggests common possible causes for the given symptom. 
-   **Clean and Responsive UI:** Built with **Tailwind CSS** for a modern and mobile-friendly design. 
-   **Custom Notifications:** Uses a custom message box for user feedback, replacing default browser alerts.

---

## 🧠 Agentic AI Summary
This project uses the Gemini model in an agent-like manner. Each button click triggers a specialized AI action: one for classification, another for showing safe next steps, and a third for suggesting possible causes. This modular design makes the AI act like a multi-purpose health assistant under direct user control.

---

## 🛠️ Tech Stack
-   **HTML5:** For the application's structure. 
-   **Tailwind CSS:** For fast and efficient styling. 
-   **JavaScript (ES6+):** For the core logic and API interactions. 
-   **Google Gemini API:** The generative AI model powering symptom classification and guidance.

---

## ⚙️ Installation & Setup
To get a local copy up and running, follow these steps:

### Prerequisites
-   A **Google Gemini API Key** (get one from [Google AI Studio](https://aistudio.google.com/app/apikey)) 

## Setup
1.  Clone the repository (if applicable):
    ```bash
    git clone [https://github.com/your-username/symptom-checker-app.git](https://github.com/your-username/symptom-checker-app.git)
    ```
2.  Navigate into the project directory:
    ```bash
    cd symptom-checker-app
    ```
3.  Open the `index.html` file in your favorite code editor.
4.  Replace `" your_api_key_here "` with your actual Gemini API key. The line should look like this:
    ```javascript
    const apiKey = "YOUR_API_KEY_HERE";
    ```
5.  Open the `index.html` file in your browser.

---

## 💻 Usage
1.  Enter your symptom in the input box (example: "I have a fever and a cough").
2.  Click **Check Symptom**.
3.  The app will classify the symptom as: General, Emergency, or Mental Health.
4.  After classification, you can click:
    -   **Get Next Steps** → Shows safe, general next steps.
    -   **What are the possible causes?** → Shows common possible causes.

---

## 🤝 Contributing
Contributions are welcome!
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

---

## Outputs-

### output img:

<img width="1302" height="642" alt="output-1" src="https://github.com/user-attachments/assets/cc98be15-ac6e-4171-81a8-a21cd8e1637f" />

---

### 📜 License
This project is licensed under the MIT License.
Feel free to use and modify it for personal or educational purposes.
