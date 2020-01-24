
# React-Chess
A Chess game implemented in React from scratch


Motivation for the project:
===========================
Until this point most of the things I've built were focused on design and the most complex logic was some back-end code.
In this project, I wanted to build something a little more logic focused and practice React design principles I learned.
In addition, a major goal I've set is to come up with my own implementation from scratch without using any logic libraries 
or looking at other existing implementation because that would hinder the learning process.


IMPLEMENTATION
====================================
My implementation consists of a few large functions that make everything work:
Select: The select function selects a clicked unit and shows all possible movement/kill options for the unit in that turn.
Unselect: Bound to the context-menu on-right-click button, unselects a unit.
UpdateBoard: Injects the changes into the board to show the new board, also updates the stats of the daughter components.
Step: The function responsible for the actual movement of the pieces.

Every unit has it's own select function, except for the Queen which is a combination of Rook and Bishop to not repeat code.


Challenges, things I learned and dev process:
=============================================
The biggest challenge in this project was when I learned that it's impossible to interact with the state the same way you'd
interact with a matrix in java or similar (i.e matrix[i][j] = ...). Hence, it was an interesting challenge to figure how to 
implement such a function elegantly.
Secondly, learned about some of the technical limitations of lifecycle methods and additional React design principles. Most notably
since lifecycle methods have to be pure I opted for moving some of the wrapper functions into the turn functions.
Lastly, learned about ways to improve preformance and prevent un-needed re-renders in a component, somethign most courses don't 
touch upon.


Features not implemented and reasoning:
=======================================
Pawn promotion panel, basic AI.
At this point when the game was pretty much done, I still wanted to implement basic AI (i.e a function that will run in two-player
mode and will evaluate kill/move turns basic on a numeric generated score) and the promotion panel for the Pawn. I've decided against 
this since I felt there is no significant learning value to be taken from implementing these features and that I'm ready to move
to my next project.



-----------------------------------------------------------------------------------------------------------------------------



## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.


