import React, { Component } from "react";
import Tile from "./Tile";
import uuid from "react-uuid";
import "./Board.css";
import Unit from "./Unit";
import Defeated from "./Defeated";
import History from "./History";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Zoom from "@material-ui/core/Zoom";


class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [],
      // These are sent to the Defeated child component for display
      defeatedWhite: [],
      defeatedBlack: [],
      //
      // Sent to the History child component for display
      history: [],
      // Tracks whether it's the black player's turn. All properties except for board can be organized more elegantly
      // By using playerWhite and playerBlack objects with their respective properties. I decided against this to avoid more
      // Un-needed nesting which React discourages. If this was done in Java/C# or similar that would be a better approach.
      blacksTurn: null,
      hasWon: null
    };
  }

  // Onclick for the 'New Game' Button
  newGame = () => {
    // Generally, forcing a hard refresh when dealing with Single-page applications is in most cases not a good solution.
    // In this specific case I opted for this approach since no data is being stored and there is no danger of unpredictable
    // side effects

    window.location.reload();
  };

  // Updates the defeated unit logs and checks whether win conditions have been met
  updateStats = (tile, kill) => {
    if (tile.occupiedBy.alignment === "black") {
      this.setState(curState => ({
        defeatedBlack: [...curState.defeatedBlack, tile.occupiedBy]
      }));

      // Check for win conditions, whether the killed unit is a king or if all enemy units are killed

      // Kill entry in history log
      kill = `Black player's ${tile.occupiedBy.name} was killed!`;

      if (
        tile.occupiedBy.name === "king" ||
        this.state.defeatedWhite.length === 16
      ) {
        this.setState({
          hasWon: "white"
        });
      }
    } else if (tile.occupiedBy.alignment === "white") {
      this.setState(curState => ({
        defeatedWhite: [...curState.defeatedWhite, tile.occupiedBy]
      }));

      // Kill entry in history log
      kill = `White player's ${tile.occupiedBy.name} was killed!`;

      if (
        tile.occupiedBy.name === "king" ||
        this.state.defeatedBlack.length === 16
      ) {
        this.setState({
          hasWon: "black"
        });
      }
    }

    return kill;
  };

  // Switches the players turn and updates isActive accordingly on individual pieces
  endTurn = () => {
    // End turn and pass it to the other player
    this.setState(curState => ({
      blacksTurn: !curState.blacksTurn
    }));

    // Switches the active pieces on the board according the the current player's turn
    this.setState(({ board }) => ({
      board: board.map(row => {
        let newRow = row.map(tile => {
          if (this.state.blacksTurn === false) {
            if (tile.occupiedBy !== null) {
              if (tile.occupiedBy !== null) {
                if (tile.occupiedBy.alignment === "white") {
                  return { ...tile, isActive: false };
                } else if (tile.occupiedBy.alignment === "black") {
                  return { ...tile, isActive: true };
                }
              }
            }
          } else if (this.state.blacksTurn === true) {
            if (tile.occupiedBy !== null) {
              if (tile.occupiedBy.alignment === "white") {
                return { ...tile, isActive: true };
              } else if (tile.occupiedBy.alignment === "black") {
                return { ...tile, isActive: false };
              }
            }
          }

          return tile;
        });

        // warning said wasn't returning in all cases, so I added this
        return newRow;
      })
    }));
    //
  };

  // Bishop and Rook have their own movement option builder functions because this is reused on the Queen unit
  // to avoid duplicate code (Queen movement is a combination of Bishop and Rook).
  build_Bishop_Options_Array = tileToSelect => {
    // Extract x, y axis for readability
    const x = tileToSelect.coordinatesNumerical[0];
    const y = tileToSelect.coordinatesNumerical[1];

    const tilesToHighlight = [];

    //  forEach shouldn't be used since we need to check for collision and return in a case of collision will not end a forEach loop
    //  These loops iterate in every direction the rook can move in including collision detection with other units.
    //  Each tile that qualifies is then pushed into the tilesToHighlight array that is then merged into the board to show the options
    //  to the player.

    // TOP RIGHT
    let i = 1;
    while (x - i < 8 && y + i < 8 && x - i >= 0 && y + i >= 0) {
      // COLLISION CHECK
      if (this.state.board[x - i][y + i].occupiedBy !== null && i !== x) {
        if (
          this.state.board[x - i][y + i].occupiedBy.alignment ===
          this.state.board[x][y].occupiedBy.alignment
        ) {
          break;
        }

        // This deals with an edge case of jumping over a piece for a kill move, the push into array makes the piece inclusive
        // rather than non-inclusive in the collision check.
        if (
          this.state.board[x - i][y + i].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x - i][y + i],
            potentialPath: true,
            potentialKill: true,
            markedBy: this.state.board[x][y].coordinatesNumerical
          });
          break;
        }
      }
      //

      if (this.state.board[x - i][y + i].occupiedBy === null) {
        tilesToHighlight.push({
          ...this.state.board[x - i][y + i],
          potentialPath: true,
          markedBy: this.state.board[x][y].coordinatesNumerical
        });
      } else if (
        this.state.board[x - i][y + i].occupiedBy !== null &&
        this.state.board[x - i][y + i].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
      ) {
        tilesToHighlight.push({
          ...this.state.board[x - i][y + i],
          potentialPath: true,
          potentialKill: true,
          markedBy: this.state.board[x][y].coordinatesNumerical
        });
      }

      i++;
    }

    // TOP LEFT
    i = 1;
    while (x - i >= 0 && y - i >= 0 && x - i < 8 && y - i < 8) {
      // COLLISION CHECK
      if (this.state.board[x - i][y - i].occupiedBy !== null && i !== x) {
        if (
          this.state.board[x - i][y - i].occupiedBy.alignment ===
          this.state.board[x][y].occupiedBy.alignment
        ) {
          break;
        }

        // This deals with an edge case of jumping over a piece for a kill move, the push into array makes the piece inclusive
        // rather than non-inclusive in the collision check.
        if (
          this.state.board[x - i][y - i].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x - i][y - i],
            potentialPath: true,
            potentialKill: true,
            markedBy: this.state.board[x][y].coordinatesNumerical
          });
          break;
        }
      }
      //

      if (this.state.board[x - i][y - i].occupiedBy === null) {
        tilesToHighlight.push({
          ...this.state.board[x - i][y - i],
          potentialPath: true,
          markedBy: this.state.board[x][y].coordinatesNumerical
        });
      } else if (
        this.state.board[x - i][y - i].occupiedBy !== null &&
        this.state.board[x - i][y - i].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
      ) {
        tilesToHighlight.push({
          ...this.state.board[x - i][y - i],
          potentialPath: true,
          potentialKill: true,
          markedBy: this.state.board[x][y].coordinatesNumerical
        });
      }

      i++;
    }

    // BOTTOM LEFT
    i = 1;
    while (x + i < 8 && y - i < 8 && x + i >= 0 && y - i >= 0) {
      // COLLISION CHECK
      if (this.state.board[x + i][y - i].occupiedBy !== null && i !== x) {
        if (
          this.state.board[x + i][y - i].occupiedBy.alignment ===
          this.state.board[x][y].occupiedBy.alignment
        ) {
          break;
        }

        // This deals with an edge case of jumping over a piece for a kill move, the push into array makes the piece inclusive
        // rather than non-inclusive in the collision check.
        if (
          this.state.board[x + i][y - i].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x + i][y - i],
            potentialPath: true,
            potentialKill: true,
            markedBy: this.state.board[x][y].coordinatesNumerical
          });
          break;
        }
      }
      //

      if (this.state.board[x + i][y - i].occupiedBy === null) {
        tilesToHighlight.push({
          ...this.state.board[x + i][y - i],
          potentialPath: true,
          markedBy: this.state.board[x][y].coordinatesNumerical
        });
      } else if (
        this.state.board[x + i][y - i].occupiedBy !== null &&
        this.state.board[x + i][y - i].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
      ) {
        tilesToHighlight.push({
          ...this.state.board[x + i][y - i],
          potentialPath: true,
          potentialKill: true,
          markedBy: this.state.board[x][y].coordinatesNumerical
        });
      }

      i++;
    }

    // BOTTOM RIGHT
    i = 1;
    while (x + i < 8 && y + i < 8 && x + i >= 0 && y + i >= 0) {
      // COLLISION CHECK
      if (this.state.board[x + i][y + i].occupiedBy !== null && i !== x) {
        if (
          this.state.board[x + i][y + i].occupiedBy.alignment ===
          this.state.board[x][y].occupiedBy.alignment
        ) {
          break;
        }

        // This deals with an edge case of jumping over a piece for a kill move, the push into array makes the piece inclusive
        // rather than non-inclusive in the collision check.
        if (
          this.state.board[x + i][y + i].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x + i][y + i],
            potentialPath: true,
            potentialKill: true,
            markedBy: this.state.board[x][y].coordinatesNumerical
          });
          break;
        }
      }
      //

      if (this.state.board[x + i][y + i].occupiedBy === null) {
        tilesToHighlight.push({
          ...this.state.board[x + i][y + i],
          potentialPath: true,
          markedBy: this.state.board[x][y].coordinatesNumerical
        });
      } else if (
        this.state.board[x + i][y + i].occupiedBy !== null &&
        this.state.board[x + i][y + i].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
      ) {
        tilesToHighlight.push({
          ...this.state.board[x + i][y + i],
          potentialPath: true,
          potentialKill: true,
          markedBy: this.state.board[x][y].coordinatesNumerical
        });
      }

      i++;
    }

    return tilesToHighlight;
  };

  build_Rook_Options_Array = tileToSelect => {
    // Extract x, y axis for readability
    const x = tileToSelect.coordinatesNumerical[0];
    const y = tileToSelect.coordinatesNumerical[1];

    const tilesToHighlight = [];

    //  forEach shouldn't be used since we need to check for collision and return in a case of collision will not end a forEach loop
    //  These loops iterate in every direction the rook can move in including collision detection with other units.
    //  Each tile that qualifies is then pushed into the tilesToHighlight array that is then merged into the board to show the options
    //  to the player.

    // UP
    for (let i = x; i >= 0; i--) {
      // COLLISION CHECK
      if (this.state.board[i][y].occupiedBy !== null && i !== x) {
        if (
          this.state.board[i][y].occupiedBy.alignment ===
          this.state.board[x][y].occupiedBy.alignment
        ) {
          break;
        }

        // This deals with an edge case of jumping over a piece for a kill move, the push into array makes the piece inclusive
        // rather than non-inclusive in the collision check.
        if (
          this.state.board[i][y].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[i][y],
            potentialPath: true,
            potentialKill: true,
            markedBy: this.state.board[x][y].coordinatesNumerical
          });
          break;
        }
      }
      //

      if (this.state.board[i][y].occupiedBy === null) {
        tilesToHighlight.push({
          ...this.state.board[i][y],
          potentialPath: true,
          markedBy: this.state.board[x][y].coordinatesNumerical
        });
      } else if (
        this.state.board[i][y].occupiedBy !== null &&
        this.state.board[i][y].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
      ) {
        tilesToHighlight.push({
          ...this.state.board[i][y],
          potentialPath: true,
          potentialKill: true,
          markedBy: this.state.board[x][y].coordinatesNumerical
        });
      }
    }

    // DOWN
    for (let i = x; i < 8; i++) {
      // COLLISION CHECK
      if (this.state.board[i][y].occupiedBy !== null && i !== x) {
        if (
          this.state.board[i][y].occupiedBy.alignment ===
          this.state.board[x][y].occupiedBy.alignment
        ) {
          break;
        }

        // This deals with an edge case of jumping over a piece for a kill move, the push into array makes the piece inclusive
        // rather than non-inclusive in the collision check.
        if (
          this.state.board[i][y].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[i][y],
            potentialPath: true,
            potentialKill: true,
            markedBy: this.state.board[x][y].coordinatesNumerical
          });
          break;
        }
      }
      //

      if (this.state.board[i][y].occupiedBy === null) {
        tilesToHighlight.push({
          ...this.state.board[i][y],
          potentialPath: true,
          markedBy: this.state.board[x][y].coordinatesNumerical
        });
      } else if (
        this.state.board[i][y].occupiedBy !== null &&
        this.state.board[i][y].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
      ) {
        tilesToHighlight.push({
          ...this.state.board[i][y],
          potentialPath: true,
          potentialKill: true,
          markedBy: this.state.board[x][y].coordinatesNumerical
        });
      }
    }

    // RIGHT
    for (let i = y; i < 8; i++) {
      // COLLISION CHECK
      if (this.state.board[x][i].occupiedBy !== null && i !== y) {
        if (
          this.state.board[x][i].occupiedBy.alignment ===
          this.state.board[x][y].occupiedBy.alignment
        ) {
          break;
        }

        // This deals with an edge case of jumping over a piece for a kill move, the push into array makes the piece inclusive
        // rather than non-inclusive in the collision check.
        if (
          this.state.board[x][i].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x][i],
            potentialPath: true,
            potentialKill: true,
            markedBy: this.state.board[x][y].coordinatesNumerical
          });
          break;
        }
      }
      //

      if (this.state.board[x][i].occupiedBy === null) {
        tilesToHighlight.push({
          ...this.state.board[x][i],
          potentialPath: true,
          markedBy: this.state.board[x][y].coordinatesNumerical
        });
      } else if (
        this.state.board[x][i].occupiedBy !== null &&
        this.state.board[x][i].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
      ) {
        tilesToHighlight.push({
          ...this.state.board[x][i],
          potentialPath: true,
          potentialKill: true,
          markedBy: this.state.board[x][y].coordinatesNumerical
        });
      }
    }

    // LEFT
    for (let i = y; i >= 0; i--) {
      // COLLISION CHECK
      if (this.state.board[x][i].occupiedBy !== null && i !== y) {
        if (
          this.state.board[x][i].occupiedBy.alignment ===
          this.state.board[x][y].occupiedBy.alignment
        ) {
          break;
        }

        // This deals with an edge case of jumping over a piece for a kill move, the push into array makes the piece inclusive
        // rather than non-inclusive in the collision check.
        if (
          this.state.board[x][i].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x][i],
            potentialPath: true,
            potentialKill: true,
            markedBy: this.state.board[x][y].coordinatesNumerical
          });
          break;
        }
      }
      //

      if (this.state.board[x][i].occupiedBy === null) {
        tilesToHighlight.push({
          ...this.state.board[x][i],
          potentialPath: true,
          markedBy: this.state.board[x][y].coordinatesNumerical
        });
      } else if (
        this.state.board[x][i].occupiedBy !== null &&
        this.state.board[x][i].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
      ) {
        tilesToHighlight.push({
          ...this.state.board[x][i],
          potentialPath: true,
          potentialKill: true,
          markedBy: this.state.board[x][y].coordinatesNumerical
        });
      }
    }

    return tilesToHighlight;
  };
  //

  // Takes a bound validated array of potential movement paths/kills and merges into the board to highlight a unit's options
  updateBoard = tilesToHighlight => {
    // To update state need to map over the whole board
    this.setState(({ board }) => ({
      board: board.map((row, i) => {
        let newRow = row.map((tile, j) => {
          let response = null;

          for (let z = 0; z < tilesToHighlight.length; z++) {
            if (tilesToHighlight[z].potentialKill === true) {
              // Check for matching coords, a kill move and a tile that is not empty
              if (
                i === tilesToHighlight[z].coordinatesNumerical[0] &&
                j === tilesToHighlight[z].coordinatesNumerical[1] &&
                tilesToHighlight[z] !== null
              ) {
                response = { ...tilesToHighlight[z] };
              }
            }
            // Else if that's not a kill move check that the tile IS empty
            else if (tilesToHighlight[z].potentialKill === false) {
              if (
                i === tilesToHighlight[z].coordinatesNumerical[0] &&
                j === tilesToHighlight[z].coordinatesNumerical[1] &&
                tilesToHighlight[z].occupiedBy === null
              ) {
                response = { ...tilesToHighlight[z] };
              }
            }
          }

          if (response !== null) {
            return response;
          } else {
            return tile;
          }
        });
        // warning said I wasn't returning in all cases, so I added this
        return newRow;
      })
    }));
  };

  selectKing = tileToSelect => {
    // Extract x, y axis for readability
    const x = tileToSelect.coordinatesNumerical[0];
    const y = tileToSelect.coordinatesNumerical[1];

    // check alignment

    // Creates an empty array and checks based on the Unit's position what tiles to highlight, makes a conditional check with a helper
    // function to see that the tiles are inside the board to prevent arrayOutOfBounds exception, the ones that pass the check
    // are pushed into the array that is later merged into the state. Each highlighted tile receives the coordinates of the tile
    // that highlighted it so later on it knows from where to remove the tile and override onto themselves.

    // NOTE: THIS ARRAY SHOULD BE VALIDATED FOR BOUNDS BEFORE IT GOES INTO MAP
    const tilesToHighlight = [];

    // Check if this is the first turn (Initial movement) of the pawn, where it can move two tiles instead of one

    // The array building is done with if statements since there are a maximum of 8 options. Each statement will check whether the
    // destination tile is within the bounds of the board, whether the destination is a movement/kill and will build the tile
    // object appropriately. Although this section can be refactored to use loops and be syntactically shorter, it will impair
    // readability and make the code more difficult to understand.

    // TOP
    if (this.checkBounds(x - 1, y)) {
      if (this.state.board[x - 1][y].occupiedBy !== null) {
        if (
          this.state.board[x - 1][y].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x - 1][y],
            markedBy: this.state.board[x][y].coordinatesNumerical,
            potentialPath: true,
            potentialKill: true
          });
        }
      } else {
        tilesToHighlight.push({
          ...this.state.board[x - 1][y],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true
        });
      }
    }

    // TOP RIGHT
    if (this.checkBounds(x - 1, y + 1)) {
      if (this.state.board[x - 1][y + 1].occupiedBy !== null) {
        if (
          this.state.board[x - 1][y + 1].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x - 1][y + 1],
            markedBy: this.state.board[x][y].coordinatesNumerical,
            potentialPath: true,
            potentialKill: true
          });
        }
      } else {
        tilesToHighlight.push({
          ...this.state.board[x - 1][y + 1],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true
        });
      }
    }

    // TOP LEFT
    if (this.checkBounds(x - 1, y - 1)) {
      if (this.state.board[x - 1][y - 1].occupiedBy !== null) {
        if (
          this.state.board[x - 1][y - 1].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x - 1][y - 1],
            markedBy: this.state.board[x][y].coordinatesNumerical,
            potentialPath: true,
            potentialKill: true
          });
        }
      } else {
        tilesToHighlight.push({
          ...this.state.board[x - 1][y - 1],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true
        });
      }
    }

    // BOTTOM
    if (this.checkBounds(x + 1, y)) {
      if (this.state.board[x + 1][y].occupiedBy !== null) {
        if (
          this.state.board[x + 1][y].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x + 1][y],
            markedBy: this.state.board[x][y].coordinatesNumerical,
            potentialPath: true,
            potentialKill: true
          });
        }
      } else {
        tilesToHighlight.push({
          ...this.state.board[x + 1][y],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true
        });
      }
    }

    // BOTTOM RIGHT
    if (this.checkBounds(x + 1, y + 1)) {
      if (this.state.board[x + 1][y + 1].occupiedBy !== null) {
        if (
          this.state.board[x + 1][y + 1].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x + 1][y + 1],
            markedBy: this.state.board[x][y].coordinatesNumerical,
            potentialPath: true,
            potentialKill: true
          });
        }
      } else {
        tilesToHighlight.push({
          ...this.state.board[x + 1][y + 1],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true
        });
      }
    }

    // BOTTOM LEFT
    if (this.checkBounds(x + 1, y - 1)) {
      if (this.state.board[x + 1][y - 1].occupiedBy !== null) {
        if (
          this.state.board[x + 1][y - 1].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x + 1][y - 1],
            markedBy: this.state.board[x][y].coordinatesNumerical,
            potentialPath: true,
            potentialKill: true
          });
        }
      } else {
        tilesToHighlight.push({
          ...this.state.board[x + 1][y - 1],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true
        });
      }
    }

    // LEFT
    if (this.checkBounds(x, y - 1)) {
      if (this.state.board[x][y - 1].occupiedBy !== null) {
        if (
          this.state.board[x][y - 1].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x][y - 1],
            markedBy: this.state.board[x][y].coordinatesNumerical,
            potentialPath: true,
            potentialKill: true
          });
        }
      } else {
        tilesToHighlight.push({
          ...this.state.board[x][y - 1],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true
        });
      }
    }

    // RIGHT
    if (this.checkBounds(x, y + 1)) {
      if (this.state.board[x][y + 1].occupiedBy !== null) {
        if (
          this.state.board[x][y + 1].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x][y + 1],
            markedBy: this.state.board[x][y].coordinatesNumerical,
            potentialPath: true,
            potentialKill: true
          });
        }
      } else {
        tilesToHighlight.push({
          ...this.state.board[x][y + 1],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true
        });
      }
    }

    this.updateBoard(tilesToHighlight);
  };

  selectQueen = tileToSelect => {
    let tilesToHighlight = [
      ...this.build_Bishop_Options_Array(tileToSelect),
      ...this.build_Rook_Options_Array(tileToSelect)
    ];

    this.updateBoard(tilesToHighlight);
  };

  selectBishop = tileToSelect => {
    let tilesToHighlight = this.build_Bishop_Options_Array(tileToSelect);

    this.updateBoard(tilesToHighlight);
  };

  // Main Knight function, selects all the the movement options for the unit. Should receieve the knight tile as an argument
  selectKnight = tileToSelect => {
    // Extract x, y axis for readability
    const x = tileToSelect.coordinatesNumerical[0];
    const y = tileToSelect.coordinatesNumerical[1];

    // check alignment

    // Creates an empty array and checks based on the Unit's position what tiles to highlight, makes a conditional check with a helper
    // function to see that the tiles are inside the board to prevent arrayOutOfBounds exception, the ones that pass the check
    // are pushed into the array that is later merged into the state. Each highlighted tile receives the coordinates of the tile
    // that highlighted it so later on it knows from where to remove the tile and override onto themselves.

    // NOTE: THIS ARRAY SHOULD BE VALIDATED FOR BOUNDS BEFORE IT GOES INTO MAP
    const tilesToHighlight = [];

    // Check if this is the first turn (Initial movement) of the pawn, where it can move two tiles instead of one

    // The array building is done with if statements since there are a maximum of 8 options. Each statement will check whether the
    // destination tile is within the bounds of the board, whether the destination is a movement/kill and will build the tile
    // object appropriately. Although this section can be refactored to use loops and be syntactically shorter, it will impair
    // readability and make the code more difficult to understand.

    // TOP RIGHT
    if (this.checkBounds(x - 2, y + 1)) {
      if (this.state.board[x - 2][y + 1].occupiedBy !== null) {
        if (
          this.state.board[x - 2][y + 1].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x - 2][y + 1],
            markedBy: this.state.board[x][y].coordinatesNumerical,
            potentialPath: true,
            potentialKill: true
          });
        }
      } else {
        tilesToHighlight.push({
          ...this.state.board[x - 2][y + 1],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true
        });
      }
    }

    //
    // TOP LEFT
    if (this.checkBounds(x - 2, y - 1)) {
      if (this.state.board[x - 2][y - 1].occupiedBy !== null) {
        if (
          this.state.board[x - 2][y - 1].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x - 2][y - 1],
            markedBy: this.state.board[x][y].coordinatesNumerical,
            potentialPath: true,
            potentialKill: true
          });
        }
      } else {
        tilesToHighlight.push({
          ...this.state.board[x - 2][y - 1],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true
        });
      }
    }

    // RIGHT SIDE TOP
    if (this.checkBounds(x - 1, y + 2)) {
      if (this.state.board[x - 1][y + 2].occupiedBy !== null) {
        if (
          this.state.board[x - 1][y + 2].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x - 1][y + 2],
            markedBy: this.state.board[x][y].coordinatesNumerical,
            potentialPath: true,
            potentialKill: true
          });
        }
      } else {
        tilesToHighlight.push({
          ...this.state.board[x - 1][y + 2],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true
        });
      }
    }

    // RIGHT SIDE LEFT
    if (this.checkBounds(x - 1, y - 2)) {
      if (this.state.board[x - 1][y - 2].occupiedBy !== null) {
        if (
          this.state.board[x - 1][y - 2].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x - 1][y - 2],
            markedBy: this.state.board[x][y].coordinatesNumerical,
            potentialPath: true,
            potentialKill: true
          });
        }
      } else {
        tilesToHighlight.push({
          ...this.state.board[x - 1][y - 2],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true
        });
      }
    }

    // BOTTOM SIDE LEFT
    if (this.checkBounds(x + 1, y - 2)) {
      if (this.state.board[x + 1][y - 2].occupiedBy !== null) {
        if (
          this.state.board[x + 1][y - 2].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x + 1][y - 2],
            markedBy: this.state.board[x][y].coordinatesNumerical,
            potentialPath: true,
            potentialKill: true
          });
        }
      } else {
        tilesToHighlight.push({
          ...this.state.board[x + 1][y - 2],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true
        });
      }
    }

    // BOTTOM SIDE RIGHT
    if (this.checkBounds(x + 1, y + 2)) {
      if (this.state.board[x + 1][y + 2].occupiedBy !== null) {
        if (
          this.state.board[x + 1][y + 2].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x + 1][y + 2],
            markedBy: this.state.board[x][y].coordinatesNumerical,
            potentialPath: true,
            potentialKill: true
          });
        }
      } else {
        tilesToHighlight.push({
          ...this.state.board[x + 1][y + 2],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true
        });
      }
    }

    // BOTTOM LEFT
    if (this.checkBounds(x + 2, y - 1)) {
      if (this.state.board[x + 2][y - 1].occupiedBy !== null) {
        if (
          this.state.board[x + 2][y - 1].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x + 2][y - 1],
            markedBy: this.state.board[x][y].coordinatesNumerical,
            potentialPath: true,
            potentialKill: true
          });
        }
      } else {
        tilesToHighlight.push({
          ...this.state.board[x + 2][y - 1],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true
        });
      }
    }

    // BOTTOM RIGHT
    if (this.checkBounds(x + 2, y + 1)) {
      if (this.state.board[x + 2][y + 1].occupiedBy !== null) {
        if (
          this.state.board[x + 2][y + 1].occupiedBy.alignment !==
          this.state.board[x][y].occupiedBy.alignment
        ) {
          tilesToHighlight.push({
            ...this.state.board[x + 2][y + 1],
            markedBy: this.state.board[x][y].coordinatesNumerical,
            potentialPath: true,
            potentialKill: true
          });
        }
      } else {
        tilesToHighlight.push({
          ...this.state.board[x + 2][y + 1],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true
        });
      }
    }

    this.updateBoard(tilesToHighlight);
  };

  // Main Rook function, selects all the the movement options for the unit. Should receieve the rook tile as an argument
  selectRook = tileToSelect => {
    let tilesToHighlight = this.build_Rook_Options_Array(tileToSelect);

    // Merge movement options of the unit into the board state
    this.updateBoard(tilesToHighlight);
  };

  // Main Pawn function, selects all the the movement options for the unit. Should receieve the pawn tile as an argument
  selectPawn = tileToSelect => {
    // Extract x, y axis for readability
    const x = tileToSelect.coordinatesNumerical[0];
    const y = tileToSelect.coordinatesNumerical[1];

    // check alignment
    if (tileToSelect.occupiedBy.alignment === "white") {
      // Creates an empty array and checks based on the Unit's position what tiles to highlight, makes a conditional check with a helper
      // function to see that the tiles are inside the board to prevent arrayOutOfBounds exception, the ones that pass the check
      // are pushed into the array that is later merged into the state. Each highlighted tile receives the coordinates of the tile
      // that highlighted it so later on it knows from where to remove the tile and override onto themselves.

      // NOTE: THIS ARRAY SHOULD BE VALIDATED FOR BOUNDS BEFORE IT GOES INTO MAP
      const tilesToHighlight = [];

      // Check if this is the first turn (Initial movement) of the pawn, where it can move two tiles instead of one
      if (x === 6) {
        if (this.checkBounds(x - 2, y)) {
          tilesToHighlight.push({
            ...this.state.board[x - 2][y],
            markedBy: this.state.board[x][y].coordinatesNumerical,
            potentialPath: true
          });
        }
      }
      //

      if (this.checkBounds(x - 1, y)) {
        tilesToHighlight.push({
          ...this.state.board[x - 1][y],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true
        });
      }

      // This checks for potential kills of the unit, if the tile's not empty
      if (
        this.checkBounds(x - 1, y - 1) &&
        this.state.board[x - 1][y - 1].occupiedBy !== null &&
        this.state.board[x - 1][y - 1].occupiedBy.alignment !==
          tileToSelect.occupiedBy.alignment
      ) {
        tilesToHighlight.push({
          ...this.state.board[x - 1][y - 1],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true,
          potentialKill: true
        });
      }

      if (
        this.checkBounds(x - 1, y + 1) &&
        this.state.board[x - 1][y + 1].occupiedBy !== null &&
        this.state.board[x - 1][y + 1].occupiedBy.alignment !==
          tileToSelect.occupiedBy.alignment
      ) {
        tilesToHighlight.push({
          ...this.state.board[x - 1][y + 1],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true,
          potentialKill: true
        });
      }

      this.updateBoard(tilesToHighlight);
    } else if (tileToSelect.occupiedBy.alignment === "black") {
      // Creates an empty array and checks based on the Unit's position what tiles to highlight, makes a conditional check with a helper
      // function to see that the tiles are inside the board to prevent arrayOutOfBounds exception, the ones that pass the check
      // are pushed into the array that is later merged into the state. Each highlighted tile receives the coordinates of the tile
      // that highlighted it so later on it knows from where to remove the tile and override onto themselves.

      // NOTE: THIS ARRAY SHOULD BE VALIDATED FOR BOUNDS BEFORE IT GOES INTO MAP
      const tilesToHighlight = [];

      // Check if this is the first turn (Initial movement) of the pawn, where it can move two tiles instead of one
      if (x === 1) {
        if (this.checkBounds(x + 2, y)) {
          tilesToHighlight.push({
            ...this.state.board[x + 2][y],
            markedBy: this.state.board[x][y].coordinatesNumerical,
            potentialPath: true
          });
        }
      }
      //

      if (this.checkBounds(x + 1, y)) {
        tilesToHighlight.push({
          ...this.state.board[x + 1][y],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true
        });
      }

      // This checks for potential kills of the unit, if the tile's not empty
      if (
        this.checkBounds(x + 1, y - 1) &&
        this.state.board[x + 1][y - 1].occupiedBy !== null &&
        this.state.board[x + 1][y - 1].occupiedBy.alignment !==
          tileToSelect.occupiedBy.alignment
      ) {
        tilesToHighlight.push({
          ...this.state.board[x + 1][y - 1],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true,
          potentialKill: true
        });
      }

      if (
        this.checkBounds(x + 1, y + 1) &&
        this.state.board[x + 1][y + 1].occupiedBy !== null &&
        this.state.board[x + 1][y + 1].occupiedBy.alignment !==
          tileToSelect.occupiedBy.alignment
      ) {
        tilesToHighlight.push({
          ...this.state.board[x + 1][y + 1],
          markedBy: this.state.board[x][y].coordinatesNumerical,
          potentialPath: true,
          potentialKill: true
        });
      }

      this.updateBoard(tilesToHighlight);
    }
  };

  // Gets an x and y index and checks if the tile is within the bounds of the board. Used to make sure that no tiles outside
  // board bounds will be highlighted
  checkBounds = (x, y) => {
    if (x > 7 || x < 0 || y > 7 || y < 0) return false;
    return true;
  };

  // Second major function that is responsible for the actual movement of the units and updating the appropriate data
  // Takes a highlighted tile as an argument, moves the unit that marked it to that tile.
  step = highlighted => {
    // Extract x, y axis for readability
    const x = highlighted.markedBy[0];
    const y = highlighted.markedBy[1];
    // Get the unit we want to move
    const getUnit = { ...this.state.board[x][y].occupiedBy };

    // These are Strings used for the creation of the history log array's entries (i.e player moved from x to y)
    // which will later be passed to a child component for display
    let from = ``,
      to = ``,
      kill = ``,
      player = ``;

    // Determines which player color goes into the string
    this.state.blacksTurn === true ? (player = "Black") : (player = "White");

    this.setState(({ board }) => ({
      board: board.map((row, i) => {
        let newRow = row.map((tile, j) => {
          if (i === x && j === y) {
            // Coords for building the turn entry string
            from = `[(${tile.coordinates[0]}, ${tile.coordinates[1]})/(${
              tile.coordinatesNumerical[0]
            }, ${tile.coordinatesNumerical[1]})]`;
            //
            return { ...tile, occupiedBy: null };
          } else if (
            i === highlighted.coordinatesNumerical[0] &&
            j === highlighted.coordinatesNumerical[1]
          ) {
            // Coords for building the turn entry string
            to = `[(${tile.coordinates[0]}, ${tile.coordinates[1]})/(${
              tile.coordinatesNumerical[0]
            }, ${tile.coordinatesNumerical[1]})]`;
            // This is working as intended but not optimal since React conventions discourage using nested setStates and prefers
            // putting this inside componentDidUpdate or similar. Should refactor this when I come up with a more elegant solution.
            if (tile.occupiedBy !== null) {
              // Updates the defeated unit logs, checks whether win conditions have been met and returns a built kill entry for the
              // turn history log
              kill = this.updateStats(tile, kill);
            }
            //

            // Update history log depending on whether a kill was made or not
            if (kill === "") {
              // If kill remained empty then turn was movement only, update with one entry
              this.setState(curState => ({
                history: [
                  `${player} moved from ${from} to ${to}`,
                  ...curState.history
                ]
              }));
            } else {
              // If kill was updated in updateStats function and is not an empty string, push two entries into the log
              this.setState(curState => ({
                history: [
                  kill,
                  `${player} moved from ${from} to ${to}`,
                  ...curState.history
                ]
              }));
            }
            //

            return { ...tile, occupiedBy: getUnit, potentialKill: false };
          } else {
            return tile;
          }
        });

        // warning said wasn't returning in all cases, so I added this
        return newRow;
      })
    }));

    // Removes highlighting after movement is done
    this.unSelect();

    // End turn and switch active units
    this.endTurn();
  };
  
  // Main function that shows movement/kill options for every clicked unit
  select = tileToSelect => {
    // console.log("Selected Unit: ");
    // console.log(tileToSelect.occupiedBy);

    // If the tile has a unit in it, it can be selected
    if (tileToSelect.occupiedBy !== null) {
      // isActive determines the player's turn, so that both players don't move at the same time
      if (tileToSelect.isActive === true) {
        let name = tileToSelect.occupiedBy.name;

        switch (name) {
          case "pawn":
            this.selectPawn(tileToSelect);
            break;
          case "rook":
            this.selectRook(tileToSelect);
            break;
          case "knight":
            this.selectKnight(tileToSelect);
            break;
          case "bishop":
            this.selectBishop(tileToSelect);
            break;
          case "queen":
            this.selectQueen(tileToSelect);
            break;
          case "king":
            this.selectKing(tileToSelect);
            break;

          default:
            console.log("ERR: Default case shouldn't be reachable");
        }
      }
    }
  };

  // Removes highlighting potential movement on right click
  unSelect = () => {
    // To update state need to map over the whole board
    this.setState(({ board }) => ({
      board: board.map((row, i) => {
        let newRow = row.map((tile, j) => {
          // Creates a temp object for the tile to reset the highlighting on turn
          const tempObj = tile;
          tempObj.potentialPath = false;
          tempObj.markedBy = false;
          tempObj.potentialKill = false;
          return tempObj;
        });
        // warning said I wasn't returning in all cases, so I added this
        return newRow;
      })
    }));
  };

  // Creates a unit on the board based on the provided coordinates. Used on board initialization only
  createUnit = (x, y) => {
    let name, alignment;

    // Determines alignment
    if (x === "G" || x === "H") alignment = "white";
    else if (x === "B" || x === "A") alignment = "black";

    // Determines unit
    if ((x === "A" || x === "H") && (y === "0" || y === "7")) name = "rook";
    if (x === "B" || x === "G") name = "pawn";
    if ((x === "H" || x === "A") && (y === "1" || y === "6")) name = "knight";
    if ((x === "H" || x === "A") && (y === "2" || y === "5")) name = "bishop";
    if ((x === "H" || x === "A") && y === "4") name = "queen";
    if ((x === "H" || x === "A") && y === "3") name = "king";

    // If there's no alignment means there's no unit in that tile, returns null
    if (alignment === undefined) return null;

    // Otherwise, if there's an alignment assemble the Unit object and return it.
    return {
      name: name,
      alignment: alignment,
      coordinates: [x, y]
    };
  };

  // Initialize board with default board values before rendering
  // This function initializes the state
  initBoard = () => {
    for (let i = 0; i < 8; i++) {
      // Switch statement to determine the tile's x axis coordinate in accordance to the array loop index.
      // this will go into the tile obj later on
      let TILE_X_AXIS;
      switch (i) {
        case (i = 0):
          TILE_X_AXIS = "A";
          break;
        case (i = 1):
          TILE_X_AXIS = "B";
          break;
        case (i = 2):
          TILE_X_AXIS = "C";
          break;
        case (i = 3):
          TILE_X_AXIS = "D";
          break;
        case (i = 4):
          TILE_X_AXIS = "E";
          break;
        case (i = 5):
          TILE_X_AXIS = "F";
          break;
        case (i = 6):
          TILE_X_AXIS = "G";
          break;
        case (i = 7):
          TILE_X_AXIS = "H";
          break;

        // Should never be reached
        default:
          TILE_X_AXIS = "AXIS_X_DEFAULT";
      }

      // Determines whether the first tile in the column is filled or not, flips in the end of every iteration
      // of the inner loop
      let firstTileInCol;
      i % 2 === 0 ? (firstTileInCol = false) : (firstTileInCol = true);

      // To later push into state to create a 2D array
      const subArr = [];
      for (let j = 0; j < 8; j++) {
        // Inner loop creates the sub-array
        // In chess boards the Y axis is numerical so the index of the loop is used
        let TILE_Y_AXIS = `${j}`;

        // Creates the individual tile object on the board
        let tileObj = {
          isFilled: firstTileInCol,
          occupiedBy: this.createUnit(TILE_X_AXIS, TILE_Y_AXIS), // Will return null if no unit should be created at tile
          coordinates: [TILE_X_AXIS, TILE_Y_AXIS],
          coordinatesNumerical: [i, j],
          // This will be used for flagging potential unit movement paths
          potentialPath: false,
          potentialKill: false,
          // When potentialPath is flipped for movement paths, the sender unit's coordinatesNumerical field will be sent here
          // for moving the piece
          markedBy: null,
          isActive: null
        };

        // Determine whether the tile is active or not at the start of the game. White always starts first
        if (tileObj.occupiedBy !== null) {
          if (tileObj.occupiedBy.alignment === "white") {
            tileObj.isActive = true;
          } else if (tileObj.occupiedBy.alignment === "black") {
            tileObj.isActive = false;
          }
        }
        //

        subArr.push(tileObj);
        firstTileInCol = !firstTileInCol;
      }

      this.setState(curState => ({
        board: [...curState.board, subArr]
      }));
    }
  };

  // Calls init board
  componentDidMount() {
    this.initBoard();
    this.setState({ blacksTurn: false });
    this.setState({
      history: [],
      defeatedBlack: [],
      defeatedWhite: [],
      hasWon: null
    });
  }

  // Maps over the state and renders the board
  renderBoard = () => {
    return (
      <Zoom in={true} timeout={1500}>
        <table className="board">
          <tbody>
            {this.state.board.map(col => (
              <tr key={uuid()}>
                {col.map(tile => (
                  // on click should go here
                  <Tile
                    key={uuid()}
                    isFilled={tile.isFilled}
                    select={this.select}
                    unSelect={this.unSelect}
                    step={this.step}
                    tileState={tile}
                  >
                    {/* {tile.coordinates} */}
                    {/* If the tile is not empty only then render a unit */}
                    {tile.occupiedBy === null ? null : (
                      <Unit
                        name={tile.occupiedBy.name}
                        alignment={tile.occupiedBy.alignment}
                        onClick={this.move}
                      />
                    )}
                  </Tile>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Zoom>
    );
  };

  // Calls the renderBoard function to show board
  render() {
    let player = "";
    this.state.blacksTurn === true ? (player = "Black") : (player = "White");

    return (
      <div>
        <Grid
          container
          spacing={1}
          className="grid"
          direction="row"
          justify="space-between"
        >
          <Grid item xs={12} lg={3}>
            <span>
              <Defeated
                white={this.state.defeatedWhite}
                black={this.state.defeatedBlack}
              />
            </span>
          </Grid>
          <Grid item xs={12} lg={6}>
            <span>
              <Button
                variant="outlined"
                color="default"
                className="button"
                onClick={this.newGame}
              >
                New Game
              </Button>

              {this.state.hasWon !== "black" &&
              this.state.hasWon !== "white" ? (
                this.renderBoard()
              ) : (
                <h1 className="gameover-msg">
                  {this.state.hasWon} won! Play again?
                </h1>
              )}
            </span>
          </Grid>
          <Grid item xs={12} lg={3}>
            <span>
              <History history={this.state.history} player={player} />
            </span>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Board;
