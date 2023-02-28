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
  //hi
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
  const [acePiles, setAcePiles] = useState([[], [], [], []]);

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
    setFirstCardSelected(null);
    console.log(deck.length);
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
    // Handles movement of Ace to the ace pile from deck pile
    if (selectedDeckCard.rank === 0) {
      const suit = selectedDeckCard.suit;
      const acePileIndex = ["♠", "♣", "♥", "♦"].indexOf(suit);
      if (acePiles[acePileIndex].length === 0) {
        let deckCardCopy = [];
        // Remove card from deck cards
        deckCardCopy = deck.filter(
          (card) => card.index !== selectedDeckCard.index
        );
        console.log(
          `the card has been removed in the ace card function and the length of the deck pile is ${deck.length}`
        );

        // Add card to ace pile
        acePiles[acePileIndex].push(selectedDeckCard);
        setDeck(deckCardCopy);
        setAcePiles(acePiles);
        setFirstCardSelected(null);
        console.log(selectedDeckCard);
      }
    }
    // Handles movement of King to an empty array from deck pile
    else if (selectedDeckCard.rank === 12) {
      // Find the index of an empty subarray in dealtCards
      const dealtCardCopy1 = [...dealtCards];
      const emptySubarrayIndex = dealtCardCopy.findIndex(
        (subarray) => subarray.length === 0
      );

      if (emptySubarrayIndex !== -1) {
        //remove card from deck pile
        let deckCardCopy = [];

        // Remove card from deck cards
        deckCardCopy = deck.filter(
          (card) => card.index !== selectedDeckCard.index
        );
        console.log(
          `the card has been removed in the king card function and the length of the deck pile is ${deck.length}`
        );

        // Move the card to the empty subarray
        dealtCardCopy1[emptySubarrayIndex].push(selectedDeckCard);
        selectedDeckCard.selected = false;
        setDeck(deckCardCopy);
        setDealtCards(dealtCardCopy1);
        console.log(selectedDeckCard);
      }
    }

    // Handles movement of other cards to the ace pile
    else if (selectedDeckCard !== 0) {
      const suit = selectedDeckCard.suit;
      const acePileIndex = ["♠", "♣", "♥", "♦"].indexOf(suit);
      if (acePiles[acePileIndex].length !== 0) {
        console.log(
          `the card has been removed in the non-ace card function and the length of the deck pile is ${deck.length}`
        );
        // Check if the selected card can be added to the ace pile
        const lastAceCard =
          acePiles[acePileIndex][acePiles[acePileIndex].length - 1];
        if (selectedDeckCard.rank === lastAceCard.rank + 1) {
          // Add card to ace pile
          acePiles[acePileIndex].push(selectedDeckCard);
          //remove Card from deck pile
          let deckCardCopy = [];
          deckCardCopy = deck.filter(
            (card) => card.index !== selectedDeckCard.index
          );
          setDeck(deckCardCopy);
        }
        console.log(selectedDeckCard);
      }
    }
    console.log(selectedDeckCard.selected);
    console.log(deck.length);
    setFirstCardSelected(selectedDeckCard);
    setSecondCardSelected(null);
    setDealtCards([...dealtCardCopy]);

    //console.log(firstCardSelected);
  };
  const handleCardClick = (selectedDealtCard) => {
    let dealtCardCopy = [...dealtCards];
    const deckCardCopy = [...deck];

    //resets the selected card red border
    for (let i = 0; i < deck.length; i++) {
      deckCardCopy[i].selected = false;
    }

    //if the card clicked is the first card to be clicked
    //then we can set it in state to compare with the next card
    if (firstCardSelected === null) {
      setFirstCardSelected(selectedDealtCard);
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
        //Removes card from deck pile
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
        let deckSplice = [];
        let z = false;
        for (let i = 0; i < dealtCardCopy.length; i++) {
          if (dealtCardCopy[i].includes(firstCardSelected)) {
            let indexOfRemovedCard =
              dealtCardCopy[i].indexOf(firstCardSelected);
            //Splices to the end of the deck
            if (indexOfRemovedCard > 0) {
              dealtCardCopy[i][indexOfRemovedCard - 1].flipped = false;
            }
            if (indexOfRemovedCard < dealtCardCopy[i].length - 1) {
              for (
                let x = indexOfRemovedCard;
                x < dealtCardCopy[i].length;
                x++
              ) {
                deckSplice.push(dealtCardCopy[i][x]);
                z = true;
              }
            }

            dealtCardCopy[i].splice(
              indexOfRemovedCard,
              dealtCardCopy[i].length - indexOfRemovedCard
            );
            if (indexOfRemovedCard === dealtCardCopy[i].length - 1) {
            }
            // handles error of single card array not pushing
            if (dealtCardCopy[i][dealtCardCopy[i].length - 1] !== undefined) {
              if (
                dealtCardCopy[i][dealtCardCopy[i].length - 1].flipped === true
              ) {
                dealtCardCopy[i][dealtCardCopy[i].length - 1].flipped = false;
              }
            }

            //console.log(splicedOutCard)
            for (let j = 0; j < dealtCardCopy.length; j++) {
              if (dealtCardCopy[j].includes(selectedDealtCard)) {
                if (z) {
                  dealtCardCopy[j].push(...deckSplice);
                  for (
                    let v = indexOfRemovedCard;
                    v < dealtCardCopy[i].length;
                    v++
                  ) {
                    dealtCardCopy[i].pop();
                  }
                  break;
                }
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
        // Handles logic for movement to ace pile from dealtCards
      } else if (
        selectedDealtCard.rank === 0 &&
        selectedDealtCard.flipped === false
      ) {
        const suit = selectedDealtCard.suit;
        const acePileIndex = ["♠", "♣", "♥", "♦"].indexOf(suit);
        if (acePiles[acePileIndex].length === 0) {
          const dealtCardCopy = [...dealtCards];
          const deckCardCopy = [...deck];
          // Remove card from dealt cards
          for (let i = 0; i < dealtCardCopy.length; i++) {
            const index = dealtCardCopy[i].indexOf(selectedDealtCard);
            if (index !== -1) {
              if (dealtCardCopy[i].length > 1) {
                dealtCardCopy[i][index - 1].flipped = false;
                console.log(suit);
                dealtCardCopy[i].splice(index, 1);
              } else {
                dealtCardCopy[i].splice(index, 1);
              }
              break;
            }
          }
          // Add card to ace pile
          acePiles[acePileIndex].push(selectedDealtCard);
          setDealtCards(dealtCardCopy);
          setAcePiles(acePiles);
          setFirstCardSelected(null);
        }
        // Handles movement of King to an empty array from dealtCards array
      } else if (
        selectedDealtCard.rank === 12 &&
        selectedDealtCard.flipped === false
      ) {
        let dealtCardCopy = [...dealtCards];

        // Find the index of the subarray that contains the selected card
        const selectedSubarrayIndex = dealtCards.findIndex((subarray) =>
          subarray.includes(selectedDealtCard)
        );

        // Find the empty array index
        const emptySubarrayIndex = dealtCards.findIndex(
          (subarray) => subarray.length === 0
        );

        if (emptySubarrayIndex !== -1) {
          const selectedCardIndex =
            dealtCards[selectedSubarrayIndex].indexOf(selectedDealtCard);

          // Create a new array containing all the cards on top of the selected card
          const cardsToMove =
            dealtCards[selectedSubarrayIndex].splice(selectedCardIndex);

          // Flip the card before the selected card in the old subarray
          const cardBeforeSelectedIndex = selectedCardIndex - 1;
          if (cardBeforeSelectedIndex >= 0) {
            dealtCards[selectedSubarrayIndex][
              cardBeforeSelectedIndex
            ].flipped = false;
          }

          // Move the cards to the empty subarray
          dealtCardCopy[emptySubarrayIndex].push(...cardsToMove);
          setDealtCards([...dealtCards]);
        }
      } else if (
        selectedDealtCard.rank !== 0 &&
        selectedDealtCard.flipped === false
      ) {
        const suit = selectedDealtCard.suit;
        const acePileIndex = ["♠", "♣", "♥", "♦"].indexOf(suit);
        let acePilesCopy = [...acePiles];
        let dealtCardCopy = [...dealtCards];
        if (acePiles[acePileIndex].length !== 0) {
          const lastCard = acePiles[acePileIndex].slice(-1)[0];
          if (
            lastCard.rank === selectedDealtCard.rank - 1 &&
            lastCard.suit === selectedDealtCard.suit
          ) {
            // Add card to Ace Pile
            acePilesCopy[acePileIndex].push(selectedDealtCard);
            // Remove card from Dealt Cards
            for (let i = 0; i < dealtCardCopy.length; i++) {
              const index = dealtCardCopy[i].indexOf(selectedDealtCard);
              if (index !== -1) {
                if (dealtCardCopy[i].length > 1) {
                  dealtCardCopy[i][index - 1].flipped = false;
                  console.log(suit);
                  dealtCardCopy[i].splice(index, 1);
                } else {
                  dealtCardCopy[i].splice(index, 1);
                }
                break;
              }
            }
          }
        }
        setDealtCards(dealtCardCopy);
        setAcePiles(acePilesCopy);
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
        console.log(firstCardSelected);
        console.log(secondCardSelected);
      }
      setDealtCards([...dealtCards]);
    }
    //console.log(dealtCards);
    console.log(selectedDealtCard.selected);
    console.log(selectedDealtCard.cn)
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
          {deck.length > 0 && deck[currentCardIndex] && (
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

      <div className="solitaire__ace-pile">
        <div className="solitaire__ace-pile-piles">
          {acePiles.map((pile, index) => (
            <div key={index} className="solitaire__ace-pile-cards">
              {pile.length > 0 && (
                <Card
                  suit={pile[pile.length - 1].suit}
                  value={pile[pile.length - 1].value}
                  rank={pile[pile.length - 1].rank}
                  flipped={false}
                  selected={false}
                  cn="solitaire__card"
                  onClick={() => handleCardClick(pile[pile.length - 1])}
                />
              )}
            </div>
          ))}
        </div>
        <div className="solitaire__tableau-pile">
          {dealtCards.map((pile, i) => (
            <div className="solitaire__tableau-pile-cards" key={i}>
              <div className="solitaire__empty-card">
              {pile.map((card, j) => {
                return (
                  <Card
                    key={j}
                    suit={card.suit}
                    value={card.value}
                    flipped={card.flipped}
                    selected={card.selected}
                    className="solitaire__card-tableau_cards"
                    onClick={() => handleCardClick(card)}
                    tableau={true}
                  />
                );
              })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Deck;
