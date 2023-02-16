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
  //sets values of props for each card
  //rank 0-12
  //index 0-51
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < values.length; j++) {
      cards.push({ index: index, suit: suits[i], value: values[j], rank: j });
      index++;
    }
  }
  const [shuffledDeck, setShuffledDeck] = useState([]);
  const [deck, setDeck] = useState(cards);
  const [firstCardSelected, setFirstCardSelected] = useState(null);
  const [secondCardSelected, setSecondCardSelected] = useState(null);
  const [aceCardPile, setAceCardPile] = useState([
    { suit: "♥", cards: [] },
    { suit: "♦", cards: [] },
    { suit: "♣", cards: [] },
    { suit: "♠", cards: [] },
  ]);

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
    dealCards();
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
    // if a dealt card has already been selected, set it back to false as move never valid
    const dealtCardCopy = [...dealtCards];
    for (let i = 0; i < dealtCardCopy.length; i++) {
      for (let j = 0; j < dealtCardCopy[i].length; j++) {
        dealtCardCopy[i][j].selected = false;
      }
    }
    if (firstCardSelected) {
    }
    setFirstCardSelected(selectedDeckCard);
    setSecondCardSelected(null);
    setDealtCards([...dealtCardCopy]);
    setDeck([...deck]);
    //console.log(firstCardSelected);
  };

  const handleCardClick = (selectedDealtCard) => {
    let dealtCardCopy = [...dealtCards];
    const deckCardCopy1 = [...deck];

    //resets the selected card red border
    for (let i = 0; i < deck.length; i++) {
      deckCardCopy1[i].selected = false;
    }
    //if the card clicked is the first card to be clicked
    //then we can set it in state to compare with the next card
    if (firstCardSelected === null) {
      setFirstCardSelected(selectedDealtCard);
      console.log(firstCardSelected.index);
    } else {
      setSecondCardSelected(selectedDealtCard);
      //to ensure cards are picked in order with the correct coresponding suits, handles dealt card to dealt
      //card movement
      if (
        selectedDealtCard.rank === firstCardSelected.rank + 1 &&
        ((firstCardSelected.suit === "♠" &&
          ["♥", "♦"].includes(selectedDealtCard.suit)) ||
          (firstCardSelected.suit === "♣" &&
            ["♥", "♦"].includes(selectedDealtCard.suit)) ||
          (firstCardSelected.suit === "♥" &&
            ["♠", "♣"].includes(selectedDealtCard.suit)) ||
          (firstCardSelected.suit === "♦" &&
            ["♠", "♣"].includes(selectedDealtCard.suit)))
      ) {
        let deckCardCopy = [];
        if (deck.some((card) => card.index === firstCardSelected.index)) {
          deckCardCopy = deck.filter(
            (card) => card.index !== firstCardSelected.index
          );
          for (let i = 0; i < dealtCardCopy.length; i++) {
            if (dealtCardCopy[i].includes(selectedDealtCard)) {
              dealtCardCopy[i].push(firstCardSelected);
            }
          }
        } else {
          deckCardCopy = [...deck];
        }

        for (let i = 0; i < dealtCardCopy.length; i++) {
          if (dealtCardCopy[i].includes(firstCardSelected)) {
            let indexOfRemovedCard =
              dealtCardCopy[i].indexOf(firstCardSelected);
            let splicedOutCard = dealtCardCopy[i].splice(
              indexOfRemovedCard,
              1
            )[0];
            if (indexOfRemovedCard === dealtCardCopy[i].length - 1) {
              console.log('hello')
            }
             console.log(dealtCardCopy[i].length)
             console.log(indexOfRemovedCard)
            if (
              dealtCardCopy[i][dealtCardCopy[i].length - 1].flipped === true
            ) {
              dealtCardCopy[i][dealtCardCopy[i].length - 1].flipped = false;
            }
            //console.log(splicedOutCard)
            for (let j = 0; j < dealtCardCopy.length; j++) {
              if (dealtCardCopy[j].includes(selectedDealtCard)) {
                dealtCardCopy[j].push(firstCardSelected);
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
    // sets card if move is not valid and only allows the last card to be selected
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
    //console.log(dealtCards);
  };

  const handleAcePileClick = (selectedCard) => {
    const cardSuit = selectedCard.suit;
    const cardRank = selectedCard.rank;
    const suitIndex = aceCardPile.findIndex((obj) => obj.suit === cardSuit);

    // Find the suit object in the acePile state that matches the card suit
    const suitObj = aceCardPile.find((obj) => obj.suit === cardSuit);
    if (suitObj) {
      // Check if the selected card is the next card in the acePile array for its suit
      const lastCardIndex = suitObj.cards.length - 1;
      const lastCardRank =
        lastCardIndex >= 0 ? suitObj.cards[lastCardIndex].rank : 0;

      if (
        cardRank === lastCardRank + 1 ||
        (lastCardRank === null && cardRank === 0)
      ) {
      }
    }
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
              onDoubleClick={() => handleAcePileClick(deck[currentCardIndex])}
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
                onDoubleClick={() => handleAcePileClick(card)}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="ace-piles">
        {aceCardPile.map((obj, index) => (
          <div className="ace-pile" key={index}>
            <div className="ace-pile-title">{obj.suit}</div>
            <div className="ace-pile-cards">
              {obj.cards.map((card, cardIndex) => (
                <Card
                  key={cardIndex}
                  card={card}
                  onClick={() => handleAcePileClick(card)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Deck;
