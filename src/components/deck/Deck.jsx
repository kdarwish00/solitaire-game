import { useState, useEffect } from "react";
import Card from "../card/Card";
import "./deck.css";

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function Deck() {
  const [dealtCards, setDealtCards] = useState([[], [], [], [], [], [], []]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const suits = ["♠", "♣", "♥", "♦"];
  const values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  let cards = [];
  let index = 0;
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < values.length; j++) {
      cards.push({ index: index, suit: suits[i], value: values[j], rank: j });
      index++;
    }
  }
  const [shuffledDeck, setShuffledDeck] = useState([]);
  const [deck, setDeck] = useState(cards);
  const [firstCardSelected, setFirstCardSelected] = useState(null);

  // const shuffleDeck = () => {
  //   const shuffledCards = shuffle([...deck]);
  //   setDeck(shuffledCards);
  //   setCurrentCardIndex(0);
  //   dealCards();
  // };

  const dealCards = () => {
    const deckCardCopy = [...deck];
    let dealtCards = [[], [], [], [], [], [], []];
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < i + 1; j++) {
        let card = deckCardCopy.splice(0, 1)[0];
        card.flipped = j !== i;
        card.selected = false;
        dealtCards[i].push(card);
      }
    }

    setDeck([...deckCardCopy]);
    setDealtCards(dealtCards);
  };

  useEffect(() => {
    setShuffledDeck(shuffle(deck));
    dealCards()
    // shuffleDeck(cards);
  }, []);

  const nextCard = () => {
    if (currentCardIndex >= deck.length - 1) {
      setCurrentCardIndex(0);
    } else {
      setCurrentCardIndex((currentCardIndex) => currentCardIndex + 1);
    }
  };

  const handleDeckPileClick = (selectedDeckCard) => {
    for (let i = 0; i < deck.length; i++) {
      if (deck[i] === selectedDeckCard) {
        deck[i].selected = true;
      } else {
        deck[i].selected = false;
      }
    }

    const dealtCardCopy = [...dealtCards];
    for (let i = 0; i < dealtCardCopy.length; i++) {
      for (let j = 0; j < dealtCardCopy[i].length; j++) {
        dealtCardCopy[i][j].selected = false;
      }
    }
    if (firstCardSelected) {
      console.log(firstCardSelected.rank);
    }

    setFirstCardSelected(selectedDeckCard);
    setDealtCards([...dealtCardCopy]);
    setDeck([...deck]);
    console.log(firstCardSelected);
  };

  const handleCardClick = (selectedDealtCard) => {
    const deckCardCopy1 = [...deck];
    for (let i = 0; i < deck.length; i++) {
      deckCardCopy1[i].selected = false;
    }
    if (firstCardSelected === null) {
      setFirstCardSelected(selectedDealtCard);
      console.log();
    } else {
      if (selectedDealtCard.rank === firstCardSelected.rank + 1) {
        let removedCard = firstCardSelected;
        let deckCardCopy = [];
        if (deck.some((card) => card.index === firstCardSelected.index)) {
          deckCardCopy = deck.filter(
            (card) => card.index !== firstCardSelected.index
          );
        } else {
          deckCardCopy = [...deck];
        }
//code that is not working properly
        let dealtCardCopy = [...dealtCards];
        for (let i = 0; i < dealtCardCopy.length; i++) {
          if (dealtCardCopy[i].includes(selectedDealtCard)) {
            let indexOfRemovedCard =
              dealtCardCopy[i].indexOf(selectedDealtCard);
            let splicedOutCard = dealtCardCopy[i].splice(
              indexOfRemovedCard,
              1
            )[0];
            for (let j = 0; j < dealtCardCopy.length; j++) {
              if (dealtCardCopy[j].includes(firstCardSelected)) {
                dealtCardCopy[j].push(splicedOutCard);
                break;
              }
            }
            break;
          }
        }
        setDealtCards(dealtCardCopy);
        setDeck(deckCardCopy);
        setFirstCardSelected(null);
      } else {
        setFirstCardSelected(null);
      }
    }

    for (let i = 0; i < dealtCards.length; i++) {
      for (let j = 0; j < dealtCards[i].length; j++) {
        dealtCards[i][j].selected = false;
      }
      let lastCardIndex = dealtCards[i].length - 1;
      if (dealtCards[i][lastCardIndex] === selectedDealtCard) {
        dealtCards[i][lastCardIndex].selected = true;
      }
      setDealtCards([...dealtCards]);
    }
    if (firstCardSelected) {
      console.log(firstCardSelected.rank);
    }
    console.log(dealtCards);
  };

  return (
    <div className="solitaire">
      <div className="solitaire__button" onClick={nextCard}>
        <img
          src="https://i.pinimg.com/originals/8b/87/4a/8b874ac3b63e483339cbdb05a15fb716.jpg"
          alt="Next Card"
        />
      </div>

      <div className="solitaire__deck">
        <div className="solitaire__deck-pile">
          {deck.length > 0 && (
            <Card
              key={currentCardIndex}
              suit={deck[currentCardIndex].suit}
              value={deck[currentCardIndex].value}
              selected={deck[currentCardIndex].selected}
              onClick={() => handleDeckPileClick(deck[currentCardIndex])}
            />
          )}
        </div>
      </div>

      <div className="solitaire__tableau-pile">
        {dealtCards.map((pile, i) => (
          <div className="solitaire__tableau-pile-cards" key={i}>
            {pile.map((card, j) => (
              <Card
                key={j}
                suit={card.suit}
                value={card.value}
                flipped={card.flipped}
                selected={card.selected}
                className="solitaire__card"
                onClick={() => handleCardClick(card)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Deck;
