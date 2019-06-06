import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import calculateWinner from './helpers/calculateWinner';


//test branch 
function Square(props) {

    return (
      <button className={props.contains ? 'square highlighted': 'square'} onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i,winningPositions=[]) {
      if (winningPositions === null)
         winningPositions=[];

      return (
        <Square
          contains = {winningPositions.includes(i)}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }


    // komentar iznad renderGameTable
    renderGameTable = () => {
      let table = [];
      let current = 0;
  
      for (let i = 0; i < 3; i++) {
        let children = [];
        
        for (let j = 0; j < 3; j++) {
          children.push(this.renderSquare(current,this.props.winingPositions))
          current++;
        }
        
        table.push(<div className="board-row">{children}</div>);
      }

      return table;
    }
  
    render() {
      return (
        <div>
         {this.renderGameTable()}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null)
          }
        ],
        stepNumber: 0,
        xIsNext: true,
        position:""
      };
    }

    calcPosition(position){
        if (position>=0 && position<=2) {
            return `(${position+1},1)`;
        } else if (position >=3 && position<=5){
            return `(${position-3+1},2)`;
        } else {
            return `(${position-6+1},3)`;
        }
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
 
      const winResult = calculateWinner(squares);
      if (winResult || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O";
      const positionNew = this.calcPosition(i);
      this.setState({
        history: history.concat([
          {
            squares: squares
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        position:positionNew
      });
    }
  
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }
  
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

  
      const moves = history.map((step, move) => {

        const desc = move ?
          'Go to move #' + move + this.state.position :
          'Go to game start';

        return (
          <li key={move}>
            <button className={move+1 === this.state.history.length ? 'isCurrentStep': ''} 
            onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
  
      let status;
      if (winner) {
        status = "Winner: " + winner.squareRes;
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              winingPositions = {winner ? (winner.winingPos || []) : (null)}
              squares={current.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(<Game />, document.getElementById("root"));
  
