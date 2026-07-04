// seed.js
// Run this (or re-run anytime) to load/update a full catalog of in-depth courses,
// each with multiple lessons, working videos, rich notes, and a final test.
// Usage: node seed.js

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Course = require("./models/Course");

const sampleCourses = [
  // ============================== WEB DEVELOPMENT ==============================
  {
    title: "Introduction to Web Development",
    description: "Learn HTML, CSS and JavaScript basics to build your first website from scratch.",
    category: "Programming",
    price: 0,
    lessons: [
      {
        title: "HTML Basics",
        videoUrl: "https://www.youtube.com/watch?v=UB1O30fR-EE",
        content: "HTML (HyperText Markup Language) is the foundation of every website. It uses 'tags' to define the structure of a page — headings (<h1> to <h6>), paragraphs (<p>), links (<a>), images (<img>), and lists (<ul>, <ol>, <li>). Every HTML document starts with <!DOCTYPE html>, followed by <html>, <head> (metadata, title), and <body> (visible content). Tags are usually written in pairs: an opening tag and a closing tag, e.g. <p>Hello</p>, though some tags like <img> and <br> are self-closing. Attributes add extra information to tags, e.g. <a href=\"https://example.com\">Visit</a>, where 'href' is the attribute."
      },
      {
        title: "Semantic HTML & Forms",
        videoUrl: "https://www.youtube.com/watch?v=UB1O30fR-EE",
        content: "Semantic HTML uses tags that describe their meaning, not just their appearance — e.g. <header>, <nav>, <main>, <article>, <section>, and <footer> instead of generic <div> tags everywhere. This improves accessibility (screen readers understand the page better) and SEO (search engines understand content structure). Forms collect user input using <form>, <input> (with types like text, email, password, checkbox), <textarea>, <select> dropdowns, and <button>. The 'name' attribute on inputs is essential — it's how form data gets identified when submitted to a server, which is exactly how our E-Learning signup form sends data to the backend."
      },
      {
        title: "CSS Fundamentals",
        videoUrl: "https://www.youtube.com/watch?v=1PnVor36_40",
        content: "CSS (Cascading Style Sheets) controls how HTML looks — colors, fonts, spacing, layout. Selectors target elements: by tag (p {}), class (.my-class {}), or id (#my-id {}). The Box Model describes every element as a rectangular box made up of content, padding (space inside the border), border, and margin (space outside the border) — understanding this is essential for layout debugging. Common properties include color, background-color, font-size, margin, padding, and border-radius. CSS can be added inline, in a <style> tag, or (best practice) in a separate .css file linked via <link rel=\"stylesheet\">."
      },
      {
        title: "Flexbox & Responsive Layout",
        videoUrl: "https://www.youtube.com/watch?v=1PnVor36_40",
        content: "Flexbox is a CSS layout system designed for arranging items in a row or column, with easy alignment and spacing control. Setting 'display: flex' on a container turns its direct children into flex items. Key properties include 'justify-content' (alignment along the main axis — e.g. center, space-between) and 'align-items' (alignment along the cross axis). 'flex-wrap: wrap' allows items to move to a new line when space runs out — essential for responsive design. Media queries, e.g. '@media (max-width: 768px) { }', let you apply different CSS rules on smaller screens, which is how our course grid in this project automatically rearranges into a single column on mobile."
      },
      {
        title: "JavaScript Introduction",
        videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
        content: "JavaScript brings interactivity to web pages. Variables are declared with 'let' (can change) or 'const' (cannot be reassigned) — avoid the older 'var'. Data types include strings, numbers, booleans, arrays, and objects. Functions are reusable blocks of code: 'function greet(name) { return \"Hello \" + name; }', or using arrow function syntax: 'const greet = (name) => \"Hello \" + name;'. Conditional logic uses if/else, and loops (for, while) repeat actions. JavaScript runs directly in the browser, making it the only programming language understood natively by every web browser."
      },
      {
        title: "DOM Manipulation & Events",
        videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
        content: "The DOM (Document Object Model) is the browser's in-memory representation of your HTML page, which JavaScript can read and modify. 'document.getElementById(\"id\")' or 'document.querySelector(\".class\")' selects elements, and you can then change their content ('.textContent'), styles ('.style.color'), or attributes. Event listeners respond to user actions: 'button.addEventListener(\"click\", function() { ... })' runs code when a button is clicked. This is exactly how interactive features work — e.g. when you click 'Mark as Complete' on a lesson in this project, a JavaScript event handler sends a request to the backend and updates the page without a full reload (this technique is part of what makes React, which we use in this project, so powerful)."
      }
    ],
    quiz: [
      { question: "Which tag is used to create a hyperlink in HTML?", options: ["<link>", "<a>", "<href>", "<nav>"], correctAnswer: 1 },
      { question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Styling System", "Code Style Syntax"], correctAnswer: 1 },
      { question: "Which CSS display value turns children into flexible row/column items?", options: ["display: block", "display: grid", "display: flex", "display: inline"], correctAnswer: 2 },
      { question: "Which keyword should you avoid using for declaring variables in modern JavaScript?", options: ["let", "const", "var", "function"], correctAnswer: 2 },
      { question: "What does the DOM represent?", options: ["A CSS framework", "The browser's in-memory model of the HTML page", "A JavaScript library", "A database structure"], correctAnswer: 1 },
      { question: "Which HTML element is considered 'semantic'?", options: ["<div>", "<span>", "<header>", "<b>"], correctAnswer: 2 }
    ]
  },

  // ============================== PYTHON ==============================
  {
    title: "Python for Beginners",
    description: "Start coding with Python — variables, loops, functions, data structures, and projects.",
    category: "Programming",
    price: 0,
    lessons: [
      {
        title: "Getting Started with Python",
        videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
        content: "Python is known for its simple, readable syntax, making it a popular first programming language. Unlike many languages, Python doesn't use curly braces { } — it uses indentation (spaces) to define code blocks, so consistent spacing matters a lot. You write your first program with 'print(\"Hello, World!\")'. Python files end in .py and run using the command 'python filename.py'. Comments start with '#' and are ignored by the interpreter — useful for explaining your code to others (or to yourself later)."
      },
      {
        title: "Variables & Data Types",
        videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
        content: "Variables in Python don't need an explicit type declaration — Python figures it out automatically. Common types: int (whole numbers), float (decimals), str (text, written in quotes), bool (True/False), list (an ordered, changeable collection like [1, 2, 3]), and dict (key-value pairs like {\"name\": \"Alice\", \"age\": 25}). You can check a variable's type with 'type(x)'. String formatting with f-strings is very common: 'name = \"Sam\"; print(f\"Hello {name}\")' inserts the variable directly into the text."
      },
      {
        title: "Control Flow",
        videoUrl: "https://www.youtube.com/watch?v=Zp5MuPOtsSY",
        content: "Conditional statements in Python use 'if', 'elif' (else-if), and 'else', e.g. 'if age >= 18: print(\"Adult\") elif age >= 13: print(\"Teen\") else: print(\"Child\")'. Comparison operators include ==, !=, <, >, <=, >=, and logical operators 'and', 'or', 'not' combine conditions. Loops repeat code: a 'for' loop iterates over a sequence, e.g. 'for i in range(5): print(i)' prints 0 through 4, while a 'while' loop repeats as long as a condition stays true. 'break' exits a loop early, and 'continue' skips to the next iteration — essential tools for controlling program flow."
      },
      {
        title: "Functions",
        videoUrl: "https://www.youtube.com/watch?v=9Os0o3wzS_I",
        content: "Functions let you organize code into reusable, named blocks. Defined with 'def function_name(parameters):', e.g. 'def add(a, b): return a + b'. Calling 'add(3, 4)' returns 7. Functions can have default parameter values, e.g. 'def greet(name=\"Guest\"):', and can return multiple values using tuples. Scope matters: variables defined inside a function are local and don't exist outside it, unless explicitly returned. Writing small, well-named functions makes code far easier to read, test, and reuse — a core principle behind the backend functions used throughout this project's API (e.g. a 'signup' function, a 'login' function, etc.)."
      },
      {
        title: "Lists, Dictionaries & Loops Together",
        videoUrl: "https://www.youtube.com/watch?v=9Os0o3wzS_I",
        content: "Lists store ordered collections, accessed by index starting at 0: 'fruits = [\"apple\", \"banana\"]; fruits[0]' gives 'apple'. List methods include .append() (add an item), .remove() (delete an item), and slicing like fruits[0:2]. Dictionaries store key-value pairs and are ideal for structured data, e.g. 'student = {\"name\": \"Sam\", \"grade\": 90}'; access values with student[\"name\"]. You can loop through a list with 'for fruit in fruits:', or through a dictionary's items with 'for key, value in student.items():'. List comprehensions offer a compact way to build lists, e.g. 'squares = [x*x for x in range(5)]'. These data structures are the backbone of almost every real Python program, including data analysis and web applications."
      },
      {
        title: "Mini Project: Putting It Together",
        videoUrl: "https://www.youtube.com/watch?v=9Os0o3wzS_I",
        content: "A great way to solidify these concepts is to build a small project that combines everything: variables to store data, functions to organize logic, conditionals to make decisions, and loops to repeat actions. For example, a simple 'grade calculator' program: take a list of student scores, write a function that loops through them, uses if/elif/else to assign a letter grade to each, and prints a summary using a dictionary to count how many students got each grade. Building small projects like this — rather than only reading theory — is the fastest way to truly understand how these pieces work together in real code."
      }
    ],
    quiz: [
      { question: "How does Python define code blocks (instead of curly braces)?", options: ["Semicolons", "Indentation", "Parentheses", "Square brackets"], correctAnswer: 1 },
      { question: "Which data type represents an ordered, changeable collection?", options: ["int", "list", "bool", "str"], correctAnswer: 1 },
      { question: "What does 'elif' mean in Python?", options: ["else if", "end if", "exit loop if", "else iterate"], correctAnswer: 0 },
      { question: "How do you define a function in Python?", options: ["function name():", "def name():", "func name():", "define name():"], correctAnswer: 1 },
      { question: "What index does the first item in a Python list have?", options: ["1", "-1", "0", "It depends"], correctAnswer: 2 },
      { question: "Which symbol starts a comment in Python?", options: ["//", "#", "<!--", "/*"], correctAnswer: 1 }
    ]
  },

  // ============================== DATA SCIENCE ==============================
  {
    title: "Data Science Fundamentals",
    description: "Learn the basics of data analysis, statistics, visualization, and intro machine learning concepts.",
    category: "Data Science",
    price: 499,
    lessons: [
      {
        title: "Intro to Data Science",
        videoUrl: "https://www.youtube.com/watch?v=X3paOmcrTjQ",
        content: "Data Science combines statistics, programming, and domain knowledge to extract meaningful insights from data. A typical workflow includes: collecting data, cleaning it (handling missing or incorrect values), exploring it (looking for patterns), analyzing it (statistical methods or machine learning), and communicating results (visualizations, reports). Python is the most popular language for data science due to powerful libraries like Pandas (data manipulation), NumPy (numerical computing), Matplotlib/Seaborn (visualization), and Scikit-learn (machine learning). Data scientists work across many industries — finance, healthcare, e-commerce, and education — to help organizations make data-driven decisions instead of guesses."
      },
      {
        title: "Basic Statistics for Data Science",
        videoUrl: "https://www.youtube.com/watch?v=X3paOmcrTjQ",
        content: "Descriptive statistics summarize data: the mean (average), median (middle value, useful when data has outliers), mode (most frequent value), and standard deviation (how spread out values are from the mean). A distribution describes how values are spread — many real-world phenomena follow a 'normal distribution' (bell curve). Correlation measures how two variables move together (ranging from -1 to +1), but importantly, correlation does not imply causation — two things can be related without one causing the other. Understanding these basics is essential before applying any advanced technique, since they help you sanity-check your data and results."
      },
      {
        title: "Working with Pandas",
        videoUrl: "https://www.youtube.com/watch?v=vmEHCJofslg",
        content: "Pandas is Python's primary library for working with structured, tabular data. The core object is a DataFrame — essentially a table with rows and columns, similar to an Excel sheet. You load data with 'pd.read_csv(\"file.csv\")', inspect it with '.head()' (first rows) and '.info()' (column types, missing values). Filtering rows uses boolean conditions, e.g. 'df[df[\"age\"] > 18]'. Common operations include '.groupby()' (aggregate data by category), '.sort_values()' (sort rows), and handling missing data with '.dropna()' or '.fillna()'. Cleaning messy real-world data is often the most time-consuming part of any data science project — frequently said to take up 70-80% of the total project time."
      },
      {
        title: "Data Visualization",
        videoUrl: "https://www.youtube.com/watch?v=vmEHCJofslg",
        content: "Visualizing data helps reveal patterns that are hard to see in raw numbers. A bar chart compares categories (e.g. sales by region), a line chart shows trends over time (e.g. monthly revenue), a scatter plot reveals relationships between two numeric variables, and a histogram shows the distribution/frequency of a single variable. Libraries like Matplotlib and Seaborn (built on top of Matplotlib) make these charts in just a few lines of Python code. A good visualization should have a clear title, labeled axes, and avoid unnecessary clutter ('chart junk') — the goal is to make the insight obvious at a glance, not to make the chart look complicated."
      },
      {
        title: "Intro to Machine Learning Concepts",
        videoUrl: "https://www.youtube.com/watch?v=vmEHCJofslg",
        content: "Machine Learning is a subset of data science where algorithms learn patterns from data rather than following explicitly programmed rules. Supervised learning uses labeled data (input + correct output) to train a model, e.g. predicting house prices from features like size and location. Unsupervised learning finds patterns in unlabeled data, e.g. grouping customers into segments based on purchase behavior (clustering). A typical ML workflow: split data into a training set and a test set, train a model on the training set, then evaluate its accuracy on the unseen test set to check how well it generalizes. This 'train/test split' is crucial — testing a model on the same data it was trained on gives a misleadingly optimistic result."
      }
    ],
    quiz: [
      { question: "Which Python library is primarily used for tabular data manipulation?", options: ["Matplotlib", "Pandas", "Flask", "Django"], correctAnswer: 1 },
      { question: "What does correlation NOT imply?", options: ["Relationship", "Causation", "Pattern", "Trend"], correctAnswer: 1 },
      { question: "Which statistic is most useful when data has extreme outliers?", options: ["Mean", "Mode", "Median", "Standard deviation"], correctAnswer: 2 },
      { question: "Which chart type is best for showing a trend over time?", options: ["Pie chart", "Line chart", "Histogram", "Scatter plot alone"], correctAnswer: 1 },
      { question: "In supervised learning, what does the training data include?", options: ["Only inputs, no outputs", "Inputs and their correct outputs", "Random unrelated numbers", "Only outputs"], correctAnswer: 1 },
      { question: "Why is a train/test split important in machine learning?", options: ["It makes training faster", "It checks how well a model generalizes to unseen data", "It's only for visualization", "It removes the need for cleaning data"], correctAnswer: 1 }
    ]
  },

  // ============================== UI/UX DESIGN ==============================
  {
    title: "UI/UX Design Basics",
    description: "Understand design principles, wireframing, prototyping, and usability for apps and websites.",
    category: "Design",
    price: 299,
    lessons: [
      {
        title: "Design Principles",
        videoUrl: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU",
        content: "Good design is guided by core principles: Hierarchy (guiding the eye to what matters most first, using size/color/position), Contrast (making important elements stand out), Balance (distributing visual weight so a layout doesn't feel lopsided), Consistency (using the same patterns throughout, like consistent button styles), and Whitespace (empty space that helps content breathe and improves readability, rather than something to 'fill up'). These principles apply whether you're designing a mobile app, a website, or even a printed poster — the goal is always to make a design feel intuitive and effortless to use."
      },
      {
        title: "Color & Typography",
        videoUrl: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU",
        content: "Color choices affect mood and usability — a consistent color palette (usually 1 primary, 1-2 secondary, plus neutrals) creates a professional, cohesive look, as seen in this project's purple-based theme. Color contrast also matters for accessibility — text needs sufficient contrast against its background to be readable for everyone, including users with visual impairments. Typography involves choosing readable fonts, appropriate sizes (body text usually 14-16px on the web), and establishing a clear hierarchy (larger/bolder headings, smaller body text). Limiting yourself to 1-2 font families keeps a design looking clean rather than chaotic."
      },
      {
        title: "Wireframing",
        videoUrl: "https://www.youtube.com/watch?v=rLdpn0vHV-M",
        content: "A wireframe is a simplified, low-fidelity sketch of a screen's layout — focusing purely on structure and content placement, not colors, fonts, or images. Wireframes help you and stakeholders agree on layout and user flow before investing time in detailed visual design. They're typically done in grayscale with simple boxes representing images, lines representing text, and basic shapes for buttons. Tools like Figma, Sketch, or even pen and paper work for wireframing. Starting with wireframes (rather than jumping straight to polished visuals) saves significant time, since structural changes are much cheaper to make early."
      },
      {
        title: "Prototyping",
        videoUrl: "https://www.youtube.com/watch?v=rLdpn0vHV-M",
        content: "A prototype is an interactive, clickable version of a design that simulates how the real product will behave — letting users (or testers) click through screens, open menus, and trigger transitions before any code is written. Prototypes range from low-fidelity (simple click-through wireframes) to high-fidelity (pixel-perfect, animated, near-identical to the final product). Tools like Figma allow designers to link multiple screens together to create these flows. Prototyping is valuable because it surfaces usability issues early — it's far cheaper to fix a confusing navigation flow in a prototype than after a developer has already built it in code."
      },
      {
        title: "Usability Testing & Feedback",
        videoUrl: "https://www.youtube.com/watch?v=rLdpn0vHV-M",
        content: "Usability testing involves observing real users as they try to complete tasks using your design (or prototype), to identify confusing or frustrating points. A common approach is the 'think-aloud' method, where users narrate their thoughts while navigating, revealing where they get stuck or confused. Even testing with just 5 users tends to reveal the majority of major usability issues, according to widely cited UX research. Feedback should be gathered objectively — watching what users actually do (not just what they say they'd do) is far more reliable. This iterative cycle of design → test → refine → re-test is core to professional UX practice, ensuring the final product actually works well for real users rather than just looking good to the designer."
      }
    ],
    quiz: [
      { question: "What does a wireframe primarily focus on?", options: ["Final colors and fonts", "Layout and structure", "Marketing copy", "Database design"], correctAnswer: 1 },
      { question: "What is a prototype used for?", options: ["Writing backend code", "Simulating interactive user flow before development", "Storing user data", "Hosting a website"], correctAnswer: 1 },
      { question: "Which design principle refers to guiding the eye to what matters most first?", options: ["Whitespace", "Hierarchy", "Typography", "Contrast"], correctAnswer: 1 },
      { question: "Why is usability testing valuable?", options: ["It replaces the need for design entirely", "It reveals real user confusion before launch", "It only matters after launch", "It is only for large companies"], correctAnswer: 1 },
      { question: "How many test users does UX research suggest can reveal most major usability issues?", options: ["1", "Around 5", "100", "1000"], correctAnswer: 1 },
      { question: "What does limiting font families to 1-2 help achieve?", options: ["Faster page load only", "A clean, non-chaotic look", "Better SEO ranking", "Lower costs"], correctAnswer: 1 }
    ]
  },

  // ============================== DIGITAL MARKETING ==============================
  {
    title: "Digital Marketing 101",
    description: "Learn SEO, content marketing, social media strategy, email marketing, and analytics fundamentals.",
    category: "Marketing",
    price: 199,
    lessons: [
      {
        title: "SEO Basics",
        videoUrl: "https://www.youtube.com/watch?v=xsVTqzratPs",
        content: "SEO (Search Engine Optimization) is the practice of improving a website so it ranks higher in search engine results, driving free ('organic') traffic. On-page SEO includes using relevant keywords naturally in titles, headings, and content, writing descriptive meta titles/descriptions, and using proper heading structure (H1, H2, etc.). Off-page SEO mainly involves backlinks — other reputable websites linking to yours, which signals trustworthiness to search engines. Technical SEO covers site speed, mobile-friendliness, and having a clean URL structure. SEO is a long-term strategy — results typically take weeks to months to show, unlike paid advertising which is instant but stops the moment you stop paying."
      },
      {
        title: "Content Marketing",
        videoUrl: "https://www.youtube.com/watch?v=xsVTqzratPs",
        content: "Content marketing focuses on creating valuable, relevant content (blog posts, videos, guides) to attract and retain an audience, rather than directly advertising a product. The goal is to build trust and authority — when content genuinely helps people, they're more likely to remember and choose your brand later. A content strategy typically starts with understanding your target audience's questions and pain points, then creating content that answers them. Repurposing content across formats (e.g. turning a blog post into a video script or social media posts) maximizes the value of each piece of content you create."
      },
      {
        title: "Social Media Strategy",
        videoUrl: "https://www.youtube.com/watch?v=TrBqVGYQSdU",
        content: "A social media strategy starts with clear goals (brand awareness, engagement, leads, sales) and choosing the right platforms for your target audience — not every brand needs to be on every platform. Consistency matters more than frequency alone: posting regularly with a recognizable brand voice and visual style builds familiarity over time. Engagement (replying to comments, starting conversations) often matters more for algorithm reach than just posting content and walking away. A content calendar helps plan posts in advance, ensuring a steady, organized presence instead of random, inconsistent posting."
      },
      {
        title: "Email Marketing",
        videoUrl: "https://www.youtube.com/watch?v=xsVTqzratPs",
        content: "Email marketing remains one of the highest-ROI digital marketing channels because you're reaching people who've already opted in to hear from you. Building an email list (often via a free incentive like an ebook or discount) is the first step. Effective emails have a compelling subject line (this determines whether the email even gets opened), personalization (using the recipient's name or relevant content), and a single clear call-to-action. Segmentation — sending different emails to different groups based on their interests or behavior — significantly improves engagement compared to sending the same generic email to everyone."
      },
      {
        title: "Marketing Analytics & Measuring Success",
        videoUrl: "https://www.youtube.com/watch?v=xsVTqzratPs",
        content: "You can't improve what you don't measure. Key metrics include: Traffic (how many people visit), Conversion Rate (percentage of visitors who take a desired action, like signing up), Click-Through Rate (CTR — percentage of people who click a link or ad), and Customer Acquisition Cost (CAC — how much it costs to gain one new customer). Tools like Google Analytics track website behavior, while social platforms provide their own native analytics dashboards. Setting up clear goals before launching a campaign (e.g. 'increase signups by 20% this month') lets you objectively evaluate whether your marketing efforts are actually working, rather than relying on gut feeling."
      }
    ],
    quiz: [
      { question: "What does SEO stand for?", options: ["Social Engagement Optimization", "Search Engine Optimization", "Site Editing Operations", "Sales Efficiency Output"], correctAnswer: 1 },
      { question: "What is the main goal of content marketing?", options: ["Direct hard-selling only", "Providing valuable content to build trust and authority", "Sending spam emails", "Buying ads exclusively"], correctAnswer: 1 },
      { question: "Why is email marketing considered high-ROI?", options: ["It's completely free with no effort", "It reaches an audience that already opted in", "It guarantees sales", "It works without any content"], correctAnswer: 1 },
      { question: "What does CTR measure?", options: ["Customer Acquisition Cost", "Click-Through Rate", "Content Total Reach", "Conversion Tracking Ratio"], correctAnswer: 1 },
      { question: "In social media strategy, what often matters more than just posting frequency?", options: ["Using as many platforms as possible", "Consistency and engagement", "Posting only ads", "Avoiding any brand voice"], correctAnswer: 1 },
      { question: "What is 'segmentation' in email marketing?", options: ["Deleting old subscribers", "Sending the same email to everyone", "Sending different emails to different audience groups", "Only emailing once a year"], correctAnswer: 2 }
    ]
  },

  // ============================== MACHINE LEARNING ==============================
  {
    title: "Machine Learning Crash Course",
    description: "An intro to machine learning concepts, model types, training, and evaluation with real-world use cases.",
    category: "Data Science",
    price: 599,
    lessons: [
      {
        title: "What is Machine Learning?",
        videoUrl: "https://www.youtube.com/watch?v=ukzFI9rgwfU",
        content: "Machine Learning (ML) is a field of AI where systems learn patterns from data instead of being explicitly programmed with fixed rules. Instead of writing rules like 'if email contains X, mark as spam', an ML model learns from thousands of labeled examples (spam vs. not spam) what patterns typically indicate spam. ML powers many everyday technologies: recommendation systems (Netflix, YouTube), voice assistants, fraud detection, and self-driving cars. The general workflow is: collect data, prepare/clean it, choose a model, train it on the data, evaluate its performance, and deploy it — very similar in spirit to the data science workflow covered in other courses on this platform."
      },
      {
        title: "Types of Machine Learning",
        videoUrl: "https://www.youtube.com/watch?v=ukzFI9rgwfU",
        content: "Supervised Learning trains on labeled data (input + correct answer) — used for tasks like predicting prices (regression) or classifying emails as spam/not spam (classification). Unsupervised Learning works with unlabeled data, finding hidden structure — e.g. clustering customers into groups based on behavior, without being told what the groups should be in advance. Reinforcement Learning trains an 'agent' to make decisions by rewarding good actions and penalizing bad ones, learning through trial and error — this is how many game-playing AIs (like those that master Chess or Go) are trained. Choosing the right type depends entirely on what data you have and what question you're trying to answer."
      },
      {
        title: "Linear Regression",
        videoUrl: "https://www.youtube.com/watch?v=CtsRRUddV2s",
        content: "Linear Regression is one of the simplest and most foundational ML algorithms, used to predict a continuous numeric value (like house price or temperature) based on one or more input features. It works by fitting a straight line (or plane, in higher dimensions) through the data that minimizes the overall distance between the line and actual data points — this distance is often measured using 'Mean Squared Error'. The equation looks like y = mx + b in its simplest form (one feature), where 'm' is the slope (how much y changes per unit of x) and 'b' is the intercept. Despite its simplicity, linear regression remains widely used in practice because it's fast, interpretable, and surprisingly effective for many real-world problems."
      },
      {
        title: "Classification Basics",
        videoUrl: "https://www.youtube.com/watch?v=ukzFI9rgwfU",
        content: "Classification predicts a category rather than a number — e.g. will a customer churn (yes/no), or what type of flower is this (setosa/versicolor/virginica)? Logistic Regression, despite its name, is actually a classification algorithm — it outputs a probability between 0 and 1, which is then converted to a class using a threshold (commonly 0.5). Decision Trees split data based on feature values (e.g. 'is age > 30?') to arrive at a classification, and are easy to visualize and interpret. More advanced methods like Random Forests combine many decision trees to improve accuracy. Choosing the right algorithm often involves experimentation — there's rarely a single 'best' algorithm for every problem."
      },
      {
        title: "Model Evaluation",
        videoUrl: "https://www.youtube.com/watch?v=CtsRRUddV2s",
        content: "Evaluating a model properly is just as important as building it. For classification, Accuracy (percentage of correct predictions) is a starting point, but can be misleading with imbalanced data (e.g. 99% accuracy sounds great, but is meaningless if 99% of the data is one class anyway). Precision (of all predicted positives, how many were actually correct) and Recall (of all actual positives, how many did the model catch) provide a more complete picture, especially in cases like fraud or disease detection where missing a positive case is costly. For regression, common metrics include Mean Absolute Error (average prediction error) and R² (how much of the variance in the data the model explains). Always evaluating models on unseen test data — not the data they were trained on — is essential for an honest assessment of real-world performance."
      }
    ],
    quiz: [
      { question: "What is the key difference between supervised and unsupervised learning?", options: ["Supervised uses labeled data; unsupervised does not", "Unsupervised is always more accurate", "Supervised learning has no data", "There is no difference"], correctAnswer: 0 },
      { question: "What does Linear Regression predict?", options: ["A category", "A continuous numeric value", "An image", "A random number"], correctAnswer: 1 },
      { question: "What does 'Recall' measure in classification evaluation?", options: ["Of all predicted positives, how many were correct", "Of all actual positives, how many were correctly identified", "Total dataset size", "Model training speed"], correctAnswer: 1 },
      { question: "Why can accuracy alone be misleading?", options: ["It's always 100%", "It can look good even with imbalanced data and a poor model", "It's not a real metric", "It only works for regression"], correctAnswer: 1 },
      { question: "What type of learning uses rewards and penalties to train an agent?", options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Linear Regression"], correctAnswer: 2 },
      { question: "Why should models be evaluated on unseen test data?", options: ["It's faster", "It gives an honest measure of real-world performance", "It's required by law", "It removes the need for training data"], correctAnswer: 1 }
    ]
  },

  // ============================== JAVA ==============================
  {
    title: "Java Programming Fundamentals",
    description: "Learn Java from scratch — variables, control flow, arrays, OOP concepts, and exception handling.",
    category: "Programming",
    price: 0,
    lessons: [
      {
        title: "Java Basics",
        videoUrl: "https://www.youtube.com/watch?v=eIrMbAQSU34",
        content: "Java is a popular, platform-independent, object-oriented programming language used to build everything from Android apps to enterprise backend systems. Every Java program starts with a class, and execution begins from a 'public static void main(String[] args)' method. Java is statically typed, meaning you must declare a variable's type, e.g. 'int age = 25;' or 'String name = \"Alice\";'. Java code is compiled into bytecode by the Java Compiler (javac), which then runs on the Java Virtual Machine (JVM) — this is what makes Java 'write once, run anywhere'. Common data types include int, double, boolean, char, and String. Every statement in Java must end with a semicolon, and code blocks are defined using curly braces { }."
      },
      {
        title: "Control Flow & Loops",
        videoUrl: "https://www.youtube.com/watch?v=eIrMbAQSU34",
        content: "Control flow in Java works similarly to other languages: 'if', 'else if', and 'else' handle decision-making, while 'switch' statements handle multiple fixed cases efficiently. Java offers three main loop types: the 'for' loop (best when you know how many times to repeat), the 'while' loop (repeats while a condition is true), and the 'do-while' loop (always runs at least once before checking the condition). The 'break' keyword exits a loop early, and 'continue' skips to the next iteration — exactly like in many other C-style languages, which makes these concepts transferable once learned."
      },
      {
        title: "Arrays & Strings",
        videoUrl: "https://www.youtube.com/watch?v=eIrMbAQSU34",
        content: "Arrays in Java store multiple values of the same type in a fixed-size container, declared like 'int[] numbers = {1, 2, 3};', and accessed using zero-based indexing ('numbers[0]' gives the first item). The 'length' property (not a method) gives the array's size, e.g. 'numbers.length'. Multi-dimensional arrays (e.g. int[][] grid) represent tables or grids of data. The String class, while technically an object, behaves like text and supports many useful methods: '.length()', '.toUpperCase()', '.substring()', and '.equals()' (always use .equals() rather than == to compare String content, since == compares object references, not content)."
      },
      {
        title: "Object-Oriented Programming Basics",
        videoUrl: "https://www.youtube.com/watch?v=eIrMbAQSU34",
        content: "Java is fundamentally object-oriented, built around four pillars: Encapsulation (bundling data and methods together, often hiding internal details using private fields with public getter/setter methods), Inheritance, Polymorphism, and Abstraction. A class is a blueprint, e.g. 'class Car { String color; void drive() { } }', and an object is an actual instance created with 'Car myCar = new Car();'. Constructors are special methods that run automatically when an object is created, typically used to initialize fields, e.g. 'Car(String color) { this.color = color; }'."
      },
      {
        title: "Inheritance & Polymorphism",
        videoUrl: "https://www.youtube.com/watch?v=eIrMbAQSU34",
        content: "Inheritance lets a class (the subclass/child) reuse and extend the behavior of another class (the superclass/parent) using the 'extends' keyword, e.g. 'class ElectricCar extends Car { }' inherits all of Car's fields and methods. The child class can override a parent method to provide its own specific behavior using the '@Override' annotation. Polymorphism means the same method call can behave differently depending on the actual object type — e.g. calling '.makeSound()' on different Animal subclasses (Dog, Cat) produces different results, even though the method is called the same way. This allows writing flexible code that works with a general type ('Animal') while still getting specific behavior at runtime."
      },
      {
        title: "Exception Handling",
        videoUrl: "https://www.youtube.com/watch?v=eIrMbAQSU34",
        content: "Exceptions represent runtime errors that, if unhandled, crash a program — e.g. dividing by zero, or trying to access an array index that doesn't exist. Java handles these gracefully using try-catch blocks: code that might fail goes inside 'try { }', and the 'catch (ExceptionType e) { }' block handles the error without crashing the whole program. A 'finally { }' block (optional) always runs regardless of whether an exception occurred, often used for cleanup tasks like closing a file. Common exception types include NullPointerException (trying to use an object that doesn't exist) and ArrayIndexOutOfBoundsException. Writing robust programs means anticipating where things could go wrong and handling those cases explicitly, rather than letting the whole program crash."
      }
    ],
    quiz: [
      { question: "What is the JVM responsible for?", options: ["Compiling Java to machine code directly", "Running compiled Java bytecode on any platform", "Writing Java source code", "Designing user interfaces"], correctAnswer: 1 },
      { question: "Which keyword is used for a class to inherit from another class in Java?", options: ["implements", "inherits", "extends", "super"], correctAnswer: 2 },
      { question: "Which loop always executes its body at least once?", options: ["for", "while", "do-while", "switch"], correctAnswer: 2 },
      { question: "How should you compare the content of two Strings in Java?", options: ["Using ==", "Using .equals()", "Using +", "It's not possible"], correctAnswer: 1 },
      { question: "What block always runs in a try-catch structure, regardless of an exception?", options: ["catch", "throw", "finally", "default"], correctAnswer: 2 },
      { question: "What does polymorphism allow in OOP?", options: ["Only one class can ever exist", "The same method call behaves differently based on object type", "Variables can have no type", "Classes cannot have methods"], correctAnswer: 1 }
    ]
  },

  // ============================== SQL ==============================
  {
    title: "Database Management with SQL",
    description: "Learn relational databases and SQL — tables, queries, joins, aggregation, and data manipulation.",
    category: "Programming",
    price: 0,
    lessons: [
      {
        title: "Introduction to Databases & SQL",
        videoUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
        content: "A database is an organized collection of structured data, and a relational database stores data in tables made up of rows and columns — similar to a spreadsheet, but with relationships between tables. SQL (Structured Query Language) is the standard language for creating, reading, updating, and deleting data in relational databases like MySQL, PostgreSQL, and SQL Server. A table has a defined schema: each column has a name and a data type (e.g. INT, VARCHAR, DATE). Every table typically has a Primary Key — a column (or set of columns) that uniquely identifies each row, such as a 'user_id'. Understanding databases is essential for almost every application, including this very E-Learning project, which stores users and courses in a database."
      },
      {
        title: "SELECT, WHERE & Sorting",
        videoUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
        content: "The 'SELECT' statement retrieves data, e.g. 'SELECT name, email FROM users;' to get specific columns, or 'SELECT * FROM users;' for all columns. The 'WHERE' clause filters results based on a condition, e.g. 'SELECT * FROM courses WHERE price = 0;' to find only free courses. You can combine conditions with AND/OR, e.g. 'WHERE price = 0 AND category = \"Programming\"'. Sorting uses 'ORDER BY column_name ASC/DESC', and limiting results uses 'LIMIT 10'. The 'LIKE' operator allows pattern matching in text, e.g. 'WHERE name LIKE \"A%\"' finds names starting with A."
      },
      {
        title: "Joins: Combining Tables",
        videoUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
        content: "The real power of relational databases comes from JOINs, which combine rows from two or more tables based on a related column — for example, joining a 'users' table with an 'orders' table on 'user_id' to see which user placed which order. An INNER JOIN returns only matching rows in both tables. A LEFT JOIN returns all rows from the left table even if there's no match in the right table (with NULLs filling the gaps). A RIGHT JOIN does the opposite. Joins are how relational databases avoid duplicating data — e.g. a course's instructor name doesn't need to be repeated in every row; instead, courses reference a 'instructor_id' which joins back to the users table when needed."
      },
      {
        title: "Aggregate Functions & GROUP BY",
        videoUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
        content: "Aggregate functions summarize data across multiple rows: COUNT() counts rows, SUM() adds values, AVG() calculates the average, and MIN()/MAX() find the smallest/largest value. These are often combined with 'GROUP BY' to get summaries per category — e.g. 'SELECT category, COUNT(*) FROM courses GROUP BY category;' tells you how many courses exist in each category. The 'HAVING' clause filters grouped results (similar to WHERE, but applied after grouping), e.g. 'GROUP BY category HAVING COUNT(*) > 5' shows only categories with more than 5 courses. These tools are essential for building dashboards, reports, and analytics features in real applications."
      },
      {
        title: "Inserting, Updating & Deleting Data",
        videoUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
        content: "Beyond reading data, SQL also modifies it. 'INSERT INTO users (name, email) VALUES (\"Alice\", \"alice@example.com\");' adds a new row. 'UPDATE users SET email = \"new@example.com\" WHERE id = 1;' modifies existing rows — critically, always include a WHERE clause with UPDATE/DELETE, or you risk modifying every row in the table. 'DELETE FROM users WHERE id = 1;' removes a row. These operations, combined with SELECT, form the acronym CRUD (Create, Read, Update, Delete) — the four basic operations every application needs to perform on its data, exactly what our backend's User and Course models do (just using MongoDB's syntax instead of SQL, since MongoDB is a NoSQL database, but the underlying CRUD concept is identical)."
      }
    ],
    quiz: [
      { question: "What does SQL stand for?", options: ["Structured Query Language", "Sequential Query Logic", "Simple Question Language", "Server Query Link"], correctAnswer: 0 },
      { question: "Which clause is used to filter rows based on a condition?", options: ["ORDER BY", "WHERE", "GROUP BY", "SELECT"], correctAnswer: 1 },
      { question: "What uniquely identifies each row in a table?", options: ["Foreign Key", "Index", "Primary Key", "Column Name"], correctAnswer: 2 },
      { question: "Which type of JOIN returns only rows that match in both tables?", options: ["LEFT JOIN", "INNER JOIN", "FULL JOIN", "CROSS JOIN"], correctAnswer: 1 },
      { question: "Which clause filters results AFTER grouping?", options: ["WHERE", "HAVING", "ORDER BY", "LIMIT"], correctAnswer: 1 },
      { question: "What should you always include with an UPDATE or DELETE statement?", options: ["A JOIN", "A WHERE clause", "An ORDER BY", "Nothing extra is needed"], correctAnswer: 1 }
    ]
  },

  // ============================== EXCEL ==============================
  {
    title: "Microsoft Excel for Productivity",
    description: "Master spreadsheets — formulas, formatting, charts, and data analysis basics in Excel.",
    category: "Productivity",
    price: 0,
    lessons: [
      {
        title: "Excel Basics & Navigation",
        videoUrl: "https://www.youtube.com/watch?v=k1VUZEVuDJ8",
        content: "Excel organizes data into a grid of cells, identified by a column letter and row number (e.g. cell A1, B2). A workbook can contain multiple sheets (tabs), useful for organizing related data separately. Basic data entry involves typing into cells, and you can select ranges of cells (e.g. A1:A10) to apply formatting or formulas to multiple cells at once. The Ribbon at the top organizes tools into tabs like Home, Insert, and Formulas. Freezing panes (View > Freeze Panes) keeps header rows visible while scrolling through large datasets — extremely useful when working with long lists of data."
      },
      {
        title: "Formulas & Functions",
        videoUrl: "https://www.youtube.com/watch?v=0tdlR1rBwkM",
        content: "Formulas always start with '=', e.g. '=A1+A2' adds two cells, while '=SUM(A1:A10)' adds a whole range. Common functions include AVERAGE(), MAX(), MIN(), and COUNT(). The IF() function performs conditional logic, e.g. '=IF(A1>50, \"Pass\", \"Fail\")'. Absolute references (using $ signs, e.g. $A$1) keep a reference fixed when a formula is copied to other cells, while relative references shift automatically — understanding this difference prevents many common spreadsheet errors."
      },
      {
        title: "Lookups: VLOOKUP & XLOOKUP",
        videoUrl: "https://www.youtube.com/watch?v=0tdlR1rBwkM",
        content: "VLOOKUP() (or the newer, more flexible XLOOKUP()) searches for a value in one column and returns a related value from another column — extremely useful for matching data between two lists, such as looking up a student's grade by their ID, or a product's price by its name. The syntax for VLOOKUP is '=VLOOKUP(lookup_value, table_range, column_index, FALSE)', where FALSE means an exact match is required. XLOOKUP simplifies this further and can search in any direction (not just left-to-right like VLOOKUP requires). Mastering lookups is one of the most valuable Excel skills for real office work, since it eliminates manually cross-referencing data between sheets."
      },
      {
        title: "Conditional Formatting & Data Validation",
        videoUrl: "https://www.youtube.com/watch?v=0tdlR1rBwkM",
        content: "Conditional Formatting automatically changes a cell's appearance (color, font) based on its value — e.g. highlighting all sales figures below target in red, making outliers instantly visible without manually scanning every row. Data Validation restricts what can be entered into a cell, e.g. only allowing values from a dropdown list, or only numbers within a certain range — this helps prevent data entry errors, especially in shared spreadsheets where multiple people input data. Both features turn a static spreadsheet into a smarter, more error-resistant tool — essential for anything used by a team rather than just one person."
      },
      {
        title: "Charts & PivotTables",
        videoUrl: "https://www.youtube.com/watch?v=0tdlR1rBwkM",
        content: "Charts (Insert > Chart) turn raw numbers into visual insights — bar charts compare categories, line charts show trends over time, and pie charts show proportions of a whole. PivotTables are one of Excel's most powerful features: they let you summarize and reorganize large datasets by dragging and dropping fields, instantly calculating totals, averages, or counts grouped by any category — without writing a single formula. For example, given a sales dataset with thousands of rows, a PivotTable can show total sales per region per month in seconds. Learning PivotTables is often the single biggest jump in Excel productivity for anyone working with real-world data."
      }
    ],
    quiz: [
      { question: "What symbol must every Excel formula start with?", options: ["#", "=", "@", "$"], correctAnswer: 1 },
      { question: "Which function adds up a range of cells?", options: ["AVERAGE()", "SUM()", "COUNT()", "IF()"], correctAnswer: 1 },
      { question: "What does an absolute reference like $A$1 do when a formula is copied?", options: ["It changes automatically", "It stays fixed", "It gets deleted", "It becomes a chart"], correctAnswer: 1 },
      { question: "What is VLOOKUP primarily used for?", options: ["Formatting cells", "Searching for a value and returning related data from another column", "Creating charts", "Sorting rows alphabetically"], correctAnswer: 1 },
      { question: "What does Data Validation help prevent?", options: ["Chart creation", "Data entry errors", "Formula calculation", "File saving issues"], correctAnswer: 1 },
      { question: "What is a key benefit of PivotTables?", options: ["They replace the need for any data", "They summarize large datasets without writing formulas", "They only work with text", "They cannot group data"], correctAnswer: 1 }
    ]
  },

  // ============================== CYBERSECURITY ==============================
  {
    title: "Cybersecurity Fundamentals",
    description: "Understand core cybersecurity concepts, common threats, network security, and incident response basics.",
    category: "Cybersecurity",
    price: 399,
    lessons: [
      {
        title: "Introduction to Cybersecurity",
        videoUrl: "https://www.youtube.com/watch?v=_DVVNOGYtmU",
        content: "Cybersecurity is the practice of protecting systems, networks, and data from digital attacks, unauthorized access, and damage. The core principles are often summarized as the CIA Triad: Confidentiality (ensuring only authorized people can access data), Integrity (ensuring data isn't altered or tampered with), and Availability (ensuring systems and data are accessible when needed). Common threat actors range from individual hackers to organized cybercriminal groups and even nation-states. As more business moves online, cybersecurity has become one of the fastest-growing and most in-demand fields in technology."
      },
      {
        title: "Common Threats: Phishing & Malware",
        videoUrl: "https://www.youtube.com/watch?v=aRbKFCY4tjE",
        content: "Common cyber threats include: Phishing (fraudulent emails/messages tricking users into revealing sensitive information or clicking malicious links), Malware (malicious software including viruses, worms, ransomware, and spyware), and Social Engineering (psychologically manipulating people into breaking normal security procedures). Ransomware specifically encrypts a victim's files and demands payment for the decryption key — one of the most financially damaging attack types for organizations today. Recognizing the warning signs of phishing (urgent language, suspicious sender addresses, unexpected attachments) is one of the most valuable skills anyone — technical or not — can develop."
      },
      {
        title: "Network Security Basics",
        videoUrl: "https://www.youtube.com/watch?v=aRbKFCY4tjE",
        content: "Firewalls act as a barrier between trusted internal networks and untrusted external networks (like the internet), filtering traffic based on defined security rules. VPNs (Virtual Private Networks) encrypt internet traffic and mask a user's real IP address, adding privacy and security especially on public Wi-Fi. HTTPS (versus plain HTTP) encrypts data sent between a browser and a website — the padlock icon in your browser address bar indicates this. Network segmentation (dividing a network into smaller isolated zones) limits how far an attacker can move if they breach one part of a system — a key principle in modern enterprise security design."
      },
      {
        title: "Password & Authentication Security",
        videoUrl: "https://www.youtube.com/watch?v=aRbKFCY4tjE",
        content: "Strong, unique passwords for every account (ideally managed with a password manager) are one of the simplest yet most effective defenses against account compromise. Two-Factor Authentication (2FA) adds a second verification step beyond just a password — typically a code sent to your phone or generated by an app — meaning even a stolen password alone isn't enough to gain access. This project itself demonstrates a foundational authentication security practice: passwords are never stored in plain text, but hashed using bcrypt before being saved to the database, so even if the database were ever exposed, the original passwords couldn't be directly read."
      },
      {
        title: "Incident Response Basics",
        videoUrl: "https://www.youtube.com/watch?v=_DVVNOGYtmU",
        content: "Incident response is the structured process an organization follows when a security breach occurs. The general phases are: Preparation (having a plan and tools ready before an incident happens), Detection & Analysis (identifying that an incident occurred and understanding its scope), Containment (stopping the attack from spreading further), Eradication (removing the threat completely), Recovery (restoring normal operations safely), and Lessons Learned (reviewing what happened to prevent it from happening again). Having a clear incident response plan in advance dramatically reduces both the damage and the recovery time compared to reacting without any plan during a crisis."
      }
    ],
    quiz: [
      { question: "What does the 'C' in the CIA Triad stand for?", options: ["Control", "Confidentiality", "Compliance", "Cryptography"], correctAnswer: 1 },
      { question: "What does ransomware typically do?", options: ["Speeds up your computer", "Encrypts files and demands payment", "Improves network security", "Deletes itself automatically"], correctAnswer: 1 },
      { question: "What does 2FA add beyond a password?", options: ["A second verification step", "A faster login", "A weaker security layer", "Nothing extra"], correctAnswer: 0 },
      { question: "What does HTTPS provide compared to HTTP?", options: ["Faster loading only", "Encrypted communication between browser and website", "Better graphics", "Lower cost hosting"], correctAnswer: 1 },
      { question: "How does this project protect stored passwords?", options: ["Stores them in plain text", "Hashes them with bcrypt before saving", "Emails them to admins", "Doesn't store them at all"], correctAnswer: 1 },
      { question: "Which incident response phase focuses on stopping an attack from spreading?", options: ["Preparation", "Containment", "Lessons Learned", "Recovery"], correctAnswer: 1 }
    ]
  },

  // ============================== CLOUD COMPUTING ==============================
  {
    title: "Cloud Computing Fundamentals",
    description: "Understand what cloud computing is, its service models, deployment models, and major providers.",
    category: "Cloud Computing",
    price: 399,
    lessons: [
      {
        title: "What is Cloud Computing?",
        videoUrl: "https://www.youtube.com/watch?v=RWgW-CgdIk0",
        content: "Cloud computing is the delivery of computing services — servers, storage, databases, networking, and software — over the internet ('the cloud'), instead of owning and maintaining physical hardware yourself. Instead of buying expensive servers, a business can rent computing resources from providers like Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP), paying only for what they use. Key benefits include scalability (easily increase or decrease resources based on demand), cost savings (no upfront hardware investment), and global reach (deploy applications in data centers around the world). This project itself uses cloud services — MongoDB Atlas for the database, and Render/Vercel to host the backend and frontend — all without needing any physical servers of our own."
      },
      {
        title: "Cloud Service Models: IaaS, PaaS, SaaS",
        videoUrl: "https://www.youtube.com/watch?v=woUAswnczQo",
        content: "Cloud services are typically categorized into three models: IaaS (Infrastructure as a Service) provides raw computing resources like virtual machines and storage, giving you the most control (e.g. AWS EC2). PaaS (Platform as a Service) provides a ready-made platform to build and deploy applications without managing the underlying infrastructure (e.g. Render, Heroku — exactly what we used to deploy our backend in this project). SaaS (Software as a Service) delivers complete, ready-to-use software over the internet (e.g. Gmail, Netflix, Google Docs). As you move from IaaS to SaaS, you get less control but also less management responsibility — a tradeoff to consider when choosing services for any project."
      },
      {
        title: "Cloud Deployment Models",
        videoUrl: "https://www.youtube.com/watch?v=woUAswnczQo",
        content: "Cloud deployment models include Public Cloud (shared infrastructure available to anyone, like AWS, Azure, GCP — generally the most cost-effective for most businesses), Private Cloud (dedicated infrastructure for a single organization, offering more control but at higher cost — common in industries with strict regulatory requirements), and Hybrid Cloud (a mix of both, balancing flexibility and control, e.g. keeping sensitive data on a private cloud while running general workloads on a public cloud). Multi-cloud — using services from more than one provider simultaneously — is also increasingly common, often to avoid being locked into a single vendor."
      },
      {
        title: "Cloud Security Basics",
        videoUrl: "https://www.youtube.com/watch?v=RWgW-CgdIk0",
        content: "Cloud security follows a 'shared responsibility model' — the cloud provider secures the underlying infrastructure (physical data centers, hardware), while the customer is responsible for securing what they build on top of it (their application code, access controls, data). Common cloud security practices include using strong Identity and Access Management (IAM) policies (granting only the minimum permissions necessary), encrypting data both at rest and in transit, and configuring network access rules carefully — exactly the kind of IP whitelist/access configuration encountered earlier when setting up MongoDB Atlas in this very project. Misconfigured cloud settings (like an accidentally public database) are, in practice, one of the most common causes of real-world data breaches."
      },
      {
        title: "Popular Cloud Providers & Use Cases",
        videoUrl: "https://www.youtube.com/watch?v=RWgW-CgdIk0",
        content: "Amazon Web Services (AWS) is the largest cloud provider, offering hundreds of services from basic compute/storage to advanced AI tools. Microsoft Azure integrates tightly with Microsoft's enterprise ecosystem (Windows Server, Active Directory, Office 365), making it popular with large corporations. Google Cloud Platform (GCP) is known for strengths in data analytics and machine learning infrastructure. Smaller, developer-focused platforms like Render and Vercel (used in this very project) sit on top of these larger providers, offering simplified, beginner-friendly deployment experiences — which is exactly why they were chosen for deploying this E-Learning application quickly and for free."
      }
    ],
    quiz: [
      { question: "What does PaaS stand for?", options: ["Platform as a Service", "Program as a Software", "Private access as a Service", "Public Application Software"], correctAnswer: 0 },
      { question: "Which of these is an example of SaaS?", options: ["AWS EC2 virtual machine", "Render hosting platform", "Gmail", "A private data center"], correctAnswer: 2 },
      { question: "What does the 'shared responsibility model' in cloud security mean?", options: ["The provider handles everything", "The customer handles everything", "Provider secures infrastructure; customer secures their own application/data", "Security responsibility doesn't exist in the cloud"], correctAnswer: 2 },
      { question: "Which cloud deployment model mixes public and private cloud?", options: ["Public Cloud", "Private Cloud", "Hybrid Cloud", "Personal Cloud"], correctAnswer: 2 },
      { question: "Which service did this project use to host its database?", options: ["AWS S3", "MongoDB Atlas", "Google Drive", "Dropbox"], correctAnswer: 1 },
      { question: "What is one of the most common causes of real-world cloud data breaches?", options: ["Too much encryption", "Misconfigured/public access settings", "Using a password manager", "Using HTTPS"], correctAnswer: 1 }
    ]
  },

  // ============================== COMMUNICATION SKILLS ==============================
  {
    title: "Effective Communication Skills",
    description: "Build essential soft skills — clear speaking, active listening, professional communication and confidence.",
    category: "Soft Skills",
    price: 0,
    lessons: [
      {
        title: "Foundations of Effective Communication",
        videoUrl: "https://www.youtube.com/watch?v=u16EPwFmdis",
        content: "Effective communication is the clear and accurate exchange of information, ideas, and feelings between people. It involves more than just words — a large portion of communication is non-verbal, including tone of voice, facial expressions, and body language. Clarity and conciseness matter — organizing your thoughts before speaking and avoiding unnecessary jargon helps your message land effectively. Communication barriers include distractions, assumptions, emotional reactions, and cultural differences — being aware of these helps you adjust your approach for better mutual understanding."
      },
      {
        title: "Active Listening",
        videoUrl: "https://www.youtube.com/watch?v=u16EPwFmdis",
        content: "Active listening means fully focusing on the speaker, not interrupting, and reflecting back what you heard to confirm understanding, rather than just waiting for your turn to speak. Techniques include paraphrasing ('So what you're saying is...'), asking open-ended clarifying questions, and using appropriate non-verbal cues like nodding and eye contact to show engagement. A common mistake is 'listening to respond' rather than 'listening to understand' — preparing your reply before the other person has even finished speaking. Genuine active listening builds trust and significantly reduces misunderstandings in both personal and professional relationships."
      },
      {
        title: "Professional Communication",
        videoUrl: "https://www.youtube.com/watch?v=pJ7RgUCEd5M",
        content: "In professional settings, communication often needs to be more structured: emails should have a clear subject line, a concise purpose stated early, and a clear call-to-action. In meetings, summarizing key points and asking clarifying questions shows engagement and helps avoid misunderstandings. Tone matters greatly in written communication, since the absence of vocal tone and body language in text/email can easily lead to messages being misread as colder or harsher than intended — re-reading a message before sending, especially when discussing a sensitive topic, helps avoid this."
      },
      {
        title: "Public Speaking & Confidence",
        videoUrl: "https://www.youtube.com/watch?v=pJ7RgUCEd5M",
        content: "Confident communication includes maintaining appropriate eye contact, using a steady tone of voice, and avoiding excessive filler words ('um', 'like'). Structuring a talk with a clear beginning (what you'll cover), middle (the content itself), and end (a summary/call-to-action) helps an audience follow along far more easily than a rambling, unstructured talk. Practicing out loud (not just reading silently) and recording yourself are highly effective ways to identify and fix verbal tics or pacing issues before an actual presentation. Nervousness before speaking is completely normal — even experienced speakers feel it — and proper preparation is the most reliable way to reduce it."
      },
      {
        title: "Giving & Receiving Feedback",
        videoUrl: "https://www.youtube.com/watch?v=pJ7RgUCEd5M",
        content: "Constructive feedback should be specific, focus on observable behavior rather than personality (e.g. 'the report was missing the Q3 numbers' rather than 'you're careless'), and ideally balance what's working well with what could improve. The 'SBI' framework (Situation, Behavior, Impact) is a useful structure: describe the specific situation, the specific behavior observed, and its impact — this keeps feedback objective and actionable rather than vague or personal. Receiving feedback well means listening without immediately becoming defensive, asking clarifying questions if needed, and treating it as useful information for growth rather than a personal attack — a skill that, like the others in this course, improves significantly with conscious practice over time."
      }
    ],
    quiz: [
      { question: "What does 'active listening' primarily involve?", options: ["Interrupting frequently to share opinions", "Fully focusing on the speaker and confirming understanding", "Multitasking while someone talks", "Only listening to the parts you agree with"], correctAnswer: 1 },
      { question: "Which of these is a common communication barrier?", options: ["Active listening", "Clear structure", "Assumptions and distractions", "Asking clarifying questions"], correctAnswer: 2 },
      { question: "What does the SBI feedback framework stand for?", options: ["Speak, Believe, Improve", "Situation, Behavior, Impact", "Strategy, Balance, Insight", "Style, Build, Inform"], correctAnswer: 1 },
      { question: "What is recommended for a professional email?", options: ["A vague subject line", "No clear purpose", "A clear subject line and concise purpose", "As much jargon as possible"], correctAnswer: 2 },
      { question: "What is the most reliable way to reduce public speaking nervousness?", options: ["Avoiding all preparation", "Proper preparation and practice", "Speaking as fast as possible", "Never making eye contact"], correctAnswer: 1 },
      { question: "How should constructive feedback be focused?", options: ["On personality traits", "On specific, observable behavior", "On vague impressions only", "On past unrelated events"], correctAnswer: 1 }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    let instructor = await User.findOne({ email: "demo.instructor@example.com" });
    if (!instructor) {
      const hashedPassword = await bcrypt.hash("123456", 10);
      instructor = await User.create({
        name: "Demo Instructor",
        email: "demo.instructor@example.com",
        password: hashedPassword,
        role: "instructor"
      });
      console.log("✅ Created demo instructor (email: demo.instructor@example.com, password: 123456)");
    }

    for (const courseData of sampleCourses) {
      const existing = await Course.findOne({ title: courseData.title });
      if (existing) {
        existing.lessons = courseData.lessons;
        existing.quiz = courseData.quiz;
        existing.description = courseData.description;
        existing.category = courseData.category;
        existing.price = courseData.price;
        await existing.save();
        console.log(`🔄 Updated: ${courseData.title} (${courseData.lessons.length} lessons, ${courseData.quiz.length} quiz questions)`);
        continue;
      }
      await Course.create({ ...courseData, instructor: instructor._id });
      console.log(`✅ Added: ${courseData.title} (${courseData.lessons.length} lessons, ${courseData.quiz.length} quiz questions)`);
    }

    console.log("🎉 Done seeding courses!");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

seed();
