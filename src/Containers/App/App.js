import React from 'react';
import Board from '../../Components/Board/Board';
import GameOver from '../../Components/GameOver/GameOver';
import './App.css';

let initialState = {
	rows: 15,
	columns: 20,
	board: [],
	fruitType: '',
	snake: [],
	moveSnakeIntervalID: null,
	prevDirection: null,
	snakeSpeed: 150, // milliseconds
	gameOver: false,
	score: -1, // (snake length) - 1
	bestScore: 0
};
const fruitTypes = ['apple', 'banana', 'cherry', 'coconut', 'orange', 'strawberry', 'watermelon'];

class App extends React.Component {
	constructor() {
		super();
		this.state = initialState;
	}	

	PlayAgain = () => {
		initialState.bestScore = this.state.bestScore;
		this.setState(initialState);
	}

	ChangeDirection = (event) => {
		const { snake, gameOver, moveSnakeIntervalID, prevDirection } = this.state;
		const direction = event.keyCode;
		if (gameOver && (direction === 13)) { // press 'Enter' to re-start the game
			this.PlayAgain();
		}
		if ((!gameOver) &&
			 (direction === 37 || direction === 38 || direction === 39 || direction === 40) && // is a real direction, an arrow press
			 (direction !== prevDirection) && // is not same direction
			 (direction+2 !== prevDirection || snake.length === 1) && // is not the opposite direction or is it but 1 square length snake
			 (direction-2 !== prevDirection || snake.length === 1)) { // is not the opposite direction or is it but 1 square length snake
			clearInterval(moveSnakeIntervalID);
			this.MoveSnake(direction);
		}
	}

	MoveSnake = (direction=null) => {
		const { snakeSpeed } = this.state;
		const directions = [37,38,39,40];
		let nextSquare = {};
		if (!direction) { // first MoveSnake()
			direction = directions[Math.floor(Math.random()*directions.length)];
		}
		let moveSnake = setInterval(() => {
			const { columns, snake, score, bestScore } = this.state;

			// find next square to move
			const directionsIDs = [snake[0] - 1, snake[0] - (columns+2), snake[0] + 1, snake[0] + (columns+2)]; // [37,38,39,40]
			nextSquare.id = directionsIDs[directions.findIndex(element => element === direction)];
			nextSquare.status = this.CheckSquareStatus(nextSquare.id);

			// stop snake
			if (nextSquare.status === 'boardBorder' || nextSquare.status === 'snakeBody') {
				this.setState(this.UpdateStatusInBoard('failed', nextSquare.id));
				if (score > bestScore) {
					this.setState({ gameOver: true, bestScore: score });
				} else {
					this.setState({ gameOver: true });
				}
				clearInterval(moveSnake);
			} 

			// continue to move
			else { 
				if (nextSquare.status === 'fruit') {
					this.ChangeFruitSquare();
				}
				this.setState(this.UpdateStatusInBoard('emptyCell', snake[snake.length-1]));
				this.setState(this.UpdateStatusInBoard('snakeBody', nextSquare.id));
				let newSnake = snake;
				newSnake.unshift(nextSquare.id);
				if (nextSquare.status === 'emptyCell') {
					newSnake.pop();
				}
				this.setState({ snake: newSnake });
			}
		}, snakeSpeed);
		this.setState({ moveSnakeIntervalID: moveSnake, prevDirection: direction });
	}

	UpdateStatusInBoard = (status, id) => {
		return prevState => ({
			board: prevState.board.map(boardRow => {
				return boardRow.map(
					square => ((square.id === id) ? Object.assign(square, { status: status }) : square)
				);
			})
		});
	}

	CheckSquareStatus = (id) => {
		let status = "ID doesn't found";
		this.state.board.forEach(boardRow => {
			boardRow.forEach(square => {
				if (square.id === id) {
					status = square.status;
				}
			});
		});
		return status;
	}

	SelectRandomEmptyCell = () => {
		const { rows, columns } = this.state;
		const highestID = (rows+2) * (columns+2) - 1;
		let randomID = Math.floor(Math.random() * highestID) + 1;
		while (this.CheckSquareStatus(randomID) !== 'emptyCell') { // change if the randomID is on the border/snake/fruit
			randomID = Math.floor(Math.random() * highestID) + 1;
		}
		return randomID;
	}

	CreateSnake = () => {
		let randomID = this.SelectRandomEmptyCell();
		this.setState({ snake: [...this.state.snake, randomID] });
		this.setState(
			this.UpdateStatusInBoard('snakeBody', randomID),
			() => this.MoveSnake()
		);
	}

	SelectRandomFruit = () => {
		return fruitTypes[Math.floor(fruitTypes.length * Math.random())];
	}

	ChangeFruitSquare = () => {
		const { snake, snakeSpeed, score } = this.state;
		let randomID = this.SelectRandomEmptyCell();
		this.setState({ fruitType: this.SelectRandomFruit(), snakeSpeed: snakeSpeed-3, score: score+1 });
		this.setState(
			this.UpdateStatusInBoard('fruit', randomID),
			() => { // if there is no previous fruit --> create snake immediately with Sync for handle conflict 'snake' and 'fruit' statuses
				if (!snake.length) {
					this.CreateSnake();
				}
			}
		);
	}

	CheckInitialSquareStatus = (i, j) => {
		const { rows, columns } = this.state;
 		if (j===0 || j===columns+1 || i===0 || i===rows+1) {
			return 'boardBorder';
		}
		return 'emptyCell';
	}

	CreateBoard = () => {
		const { rows, columns } = this.state;
		let board = [], boardRow = [];
		let square = {};
		let squareID = 0;
		for (let i = 0; i < rows+2; i++) {
			boardRow = [];
			for (let j = 0; j < columns+2; j++) {
				square = {
					id: squareID,
					status: this.CheckInitialSquareStatus(i, j, squareID)
				};
				boardRow.push(square);
				squareID++;
			}
			board.push(boardRow);
		}
		this.setState(
			{ board: board },
			() => this.ChangeFruitSquare()
		);
	}

	componentDidUpdate() {
		if (!this.state.board.length) { // if re-start game
			this.CreateBoard();
		}
	}

	componentDidMount() {
		this.CreateBoard();
		document.onkeydown = this.ChangeDirection;
	}

	render() {
		const { board, fruitType, gameOver, score, bestScore } = this.state;
	  return (
	    <div className="App">
	    	<h1>Smart Snake !</h1>
	    	<div className='gameStatistics'>
	    		<h2>Score: {score}</h2>
	    		<h2>Best: {bestScore}</h2>
	    	</div>
	    	<GameOver status={gameOver} PlayAgain={this.PlayAgain}>
		    	<Board 
		    		board={board}
		    		fruitType={fruitType}
		    	/>
	    	</GameOver>
	    </div>
	  );
  }
}

export default App;
