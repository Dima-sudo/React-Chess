import React from 'react';
import './Tile.css'


const Tile = (props) => {

    const select = () => {
        props.select(props.tileState)
    }

    const unSelect = () => {
            props.unSelect();
    }

    const step = () => {
        props.step(props.tileState)
    }

    // Main move function which consists of the select, step and unselect functions passed from the main board component and effectively
    // make the controls for the game.
    const move = (e) => {
        if (e.type === 'click') {
            // If a tile is highlighted (Selected by the player), make the actual movement
            if(props.tileState.potentialPath === true){
                step();
            }
            // If not then show the player the options for the unit they click
            else if(props.tileState.potentialPath === false){
            unSelect()
            select()
            }
            // Cancel the whole thing if mouse right click is triggered
          } else if (e.type === 'contextmenu'){
            e.preventDefault();
            unSelect()
          }
    }
    
    // Conditional tile rendering
    if(props.tileState.potentialKill === true && props.tileState.potentialPath === true){
        return <td className="board-tile-canKill" onClick={move} onContextMenu={move}>{props.children}</td>
    }
    else if(props.tileState.potentialPath === true){
        return <td className="board-tile-selected" onClick={move} onContextMenu={move}>{props.children}</td>
    }
    else if(props.isFilled === true){
        return <td className="board-tile-filled" onClick={move} onContextMenu={move}>{props.children}</td>
    }
    else if (props.isFilled === false){
        return <td className="board-tile-empty" onClick={move} onContextMenu={move}>{props.children}</td>
    }
    
    // Shouldn't be reachable
    else{
       return <td className="board-tile-empty" onClick={move} onContextMenu={move}>err(tile)</td>
    }
    
    
}


export default Tile;