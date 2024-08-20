# Thyroid Research Calculator Readme

## Step 1: VS Code
  Install [Visual Studio Code]([url](https://code.visualstudio.com/)) this is the IDE we will be using to develop and run the project
## Step 2: Node.js
  Install [Node.js]([url](https://nodejs.org/en/download/package-manager)). Node.js is widely used in web development for building backend services, APIs, and even full-stack applications when combined with frontend frameworks like React or Angular. In this case we will use Node.js to make our react project. Type the following in a terminal window.
  ### For Mac:
    # installs nvm (Node Version Manager)
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
    
    # download and install Node.js (you may need to restart the terminal)
    nvm install 20
    
    # verifies the right Node.js version is in the environment
    node -v # should print `v20.16.0`
    
    # verifies the right npm version is in the environment
    npm -v # should print `10.8.1`
  
## Step 3: Clone github Repository:
  1. Open a new window in VS Code and under the Start menu click "clone git repository"
  2. Paste https://github.com/crucial-rushil/thyroidResearch.git at the top of the screen
  3. Select where you want to locally save your project
     
## Step 4: Running the Project: 
  Paste the following commands into your terminal window on VS Code (at bottom of screen)
  1. cd my-app
  2. npm start
  3. Visit http://localhost:3000/ to view the calculator. Type '^C' to quit the project

## Saving Changes to the Remote Repository
  The following commands will save your changes onto the repository for everyone to see.
  1. git add .
  2. git commit -m "Insert Commit Message"
  3. git push

