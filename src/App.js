/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect} from 'react';
import BlueCandy from './images/blue.png';
import RedCandy from './images/red.png';
import YellowCandy from './images/yellow.png';
import PurpleCandy from './images/purple.png';
import GreenCandy from './images/green.png';
import OrangeCandy from './images/orange.png';

const width = 8;
const candyColor = [
  BlueCandy,
  RedCandy,
  YellowCandy,
  PurpleCandy,
  GreenCandy,
  OrangeCandy,
];

const App = () => {

  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkForColoumOfThree = () => {
    for(let i=0; i<=47; i++)
    {
      const columnofThree = [i, i+width, i+width*2];
      const decidedColor = currentColorArrangement[i];

      if(columnofThree.every(square => currentColorArrangement[square] === decidedColor))
      {
        columnofThree.forEach(square => currentColorArrangement[square] = '');
        return true;
      }
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkForColoumOfFour = () => {
    for(let i=0; i<=39; i++)
    {
      const columnofFour = [i, i+width, i+width*2, i+width*3];
      const decidedColor = currentColorArrangement[i];

      if(columnofFour.every(square => currentColorArrangement[square] === decidedColor))
      {
        columnofFour.forEach(square => currentColorArrangement[square] = '');
        return true;
      }
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkForRowOfThree = () => {
    for(let i=0; i<62; i++)
    {
      const rowofThree = [i, i+1, i+2];
      const decidedColor = currentColorArrangement[i];

      if(width-(i%width)===1 || width-(i%width)===2)
        continue;
      
      if(rowofThree.every(square => currentColorArrangement[square] === decidedColor))
      {
        rowofThree.forEach(square => currentColorArrangement[square] = '');
        return true;
      }
    }
  }

  const checkForRowOfFour = () => {
    for(let i=0; i<61; i++)
    {
      const rowofFour = [i, i+1, i+2, i+3];
      const decidedColor = currentColorArrangement[i];
      
      if(width-(i%width)===1 || width-(i%width)===2 || width-(i%width)===3)
        continue;

      if(rowofFour.every(square => currentColorArrangement[square] === decidedColor))
      {
        rowofFour.forEach(square => currentColorArrangement[square] = '');
        return true;
      }
    }
  }

  const moveBoard = () => {
    for(let i=0; i<56; i++){
      //console.log(i/width)
      if(currentColorArrangement[i] ==='' && Math.floor(i/width)===0)
      {
        currentColorArrangement[i] = candyColor[Math.floor(Math.random()*candyColor.length)];
      }

      if(currentColorArrangement[i+width] === '')
      {
        currentColorArrangement[i+width] = currentColorArrangement[i];
        currentColorArrangement[i] = '';
      }
    }
  }

  const dragStart = (e) => {
    // console.log(e.target);
    // console.log("drag start");
    setSquareBeingDragged(e.target);
  }

  const dragDrop = (e) => {
    // console.log(e.target);
    // console.log("drag drop");
    setSquareBeingReplaced(e.target);
  }

  const dragEnd = () => {
    // console.log("drag end");
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'));
    const squareBeingReplaceId = parseInt(squareBeingReplaced.getAttribute('data-id'));
    const temp = squareBeingReplaced;
    currentColorArrangement[squareBeingReplaceId] = squareBeingDragged.getAttribute('src');
    currentColorArrangement[squareBeingDraggedId] = temp.getAttribute('src');


    const validMoves = [
      squareBeingDraggedId-1,
      squareBeingDraggedId+1,
      squareBeingDraggedId+width,
      squareBeingDragged-width,
    ]


    const validMove = validMoves.includes(squareBeingReplaceId);
    const isAColumnOfFour = checkForColoumOfFour();
    const isARowOfFour = checkForRowOfFour();
    const isAColumnOFThree = checkForColoumOfThree();
    const isARowOfThree = checkForRowOfThree();

    if(squareBeingReplaceId && validMove &&
      (isAColumnOfFour || isARowOfFour || isAColumnOFThree || isARowOfThree))
    {
      setSquareBeingDragged(null);
      setSquareBeingReplaced(null);
    }

    else 
    {
      currentColorArrangement[squareBeingReplaceId] = squareBeingReplaced.getAttribute('src');
      currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src'); 
      setCurrentColorArrangement([...currentColorArrangement]);
    }
  

  }

  const createBoard = () => {
    const randomColorArrangement = [];
    for(let i=0; i<width*width; i++)
    {
      const randomColor = candyColor[Math.floor(Math.random() * candyColor.length)];
      randomColorArrangement.push(randomColor);
    }
    setCurrentColorArrangement(randomColorArrangement);
  }

  useEffect(() => {
    createBoard();
  },[]);

  useEffect(() => {
    const timers = setInterval(() => {
      checkForRowOfFour();
      checkForRowOfThree();
      checkForColoumOfFour();
      checkForColoumOfThree();
      moveBoard();
      setCurrentColorArrangement([...currentColorArrangement]);
    },100)

    return( () => clearInterval(timers));


    }, [checkForColoumOfThree, checkForColoumOfFour, checkForRowOfThree, checkForRowOfFour, moveBoard, currentColorArrangement]);
  
  // console.log(currentColorArrangement);
  return ( 
    <div className='app'>
      <div className='game'>
        {currentColorArrangement.map((candyColor, index) => (
            <img 
              key={index}
              src={candyColor}
              alt={candyColor}
              data-id={index}
              draggable={true}
              onDragStart={dragStart}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              onDragLeave={(e) => e.preventDefault()}
              onDrop={dragDrop}
              onDragEnd = {dragEnd}
            />
        ))
        }
      </div>
    </div>
  );
}

export default App;
