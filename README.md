# PrepDeck 🎯

**PrepDeck** is a modern, full-featured web application designed to make **interview preparation** structured, engaging, and insightful.
Built with the **MERN stack (MongoDB, Express, React, Node.js)**, it allows users to practice through **flashcards** or **MCQ tests**, track their progress, and visualize performance with dynamic analytics — all in one place.

---

## ✨ Features

This project blends interactive learning with data visualization and smooth UI design to create a complete preparation experience.

### **Frontend (React)**

* **Responsive Design:** A clean, accessible UI built with React and Tailwind CSS for all devices.
* **Interactive Practice Modes:** Users can switch between *Flashcards* for conceptual learning and *MCQ Tests* for evaluation.
* **Dashboard Overview:** Displays total accuracy, completed decks %, and mastered decks % with live visual feedback.
* **Dynamic Pie Chart:** Built using the **Recharts** library to show progress across four categories — *Completed Tests*, *Completed Flashcards*, *Mastered Flashcards*, and *Mastered Tests.*
* **Progress Overview Section:**

  * *Favorites* – decks marked by the user for easy access
  * *Completed* – decks with scores below 90%
  * *Mastered* – decks with scores of 90% and above
* **Integrated To-Do List:** Helps users organize preparation tasks directly within the platform.
* **Smooth Animations:** Powered by Framer Motion for clean transitions and an engaging interface.

---

### **Backend (Node.js & Express)**

* **User Authentication:** Secure registration and login implemented with JWT (JSON Web Tokens).
* **RESTful API:** Manages user data, test results, and deck progress seamlessly.
* **Database Integration:** MongoDB with Mongoose schemas for users, decks, and results.
* **Data Tracking:** Stores and updates user accuracy, completion, and mastery metrics in real time.

---

## 🛠️ Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Framer Motion, Axios, Recharts

**Backend:** Node.js, Express.js

**Database:** MongoDB (Mongoose)

---


## 💡 Summary

**PrepDeck** transforms interview preparation into a focused, measurable, and visually engaging experience — helping users progress from practice to mastery with every session.


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
