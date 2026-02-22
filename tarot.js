const CARD_BACK_URL = "https://static.wixstatic.com/media/e50044_51e5fb1f7c6d4e67afbf883dbbe77f6a~mv2.png";

let deck = [];

document.addEventListener("DOMContentLoaded", () => {
  loadDeck().then(() => {
    setupControls();
  });
});

async function loadDeck() {
  try {
    const res = await fetch("deck.json");
    deck = await res.json();
    console.log("Deck loaded:", deck.length, "cards");
  } catch (e) {
    console.error("Error loading deck.json:", e);
  }
}

function setupControls() {
  const btnOne = document.getElementById("btnOne");
  const btnThree = document.getElementById("btnThree");
  const btnCeltic = document.getElementById("btnCeltic");
  const btnFan = document.getElementById("btnFan");
  const questionInput = document.getElementById("questionInput");
  const questionDisplay = document.getElementById("questionDisplay");

  function updateQuestionDisplay() {
    const q = questionInput.value.trim();
    questionDisplay.textContent = q ? `Question: ${q}` : "";
  }

  btnOne.addEventListener("click", () => {
    updateQuestionDisplay();
    showSpread("one");
  });

  btnThree.addEventListener("click", () => {
    updateQuestionDisplay();
    showSpread("three");
  });

  btnCeltic.addEventListener("click", () => {
    updateQuestionDisplay();
    showSpread("celtic");
  });

  btnFan.addEventListener("click", () => {
    updateQuestionDisplay();
    showSpread("fan");
  });
}

function showSpread(type) {
  document.getElementById("oneCardSpread").style.display = "none";
  document.getElementById("threeCardSpread").style.display = "none";
  document.getElementById("celticSpread").style.display = "none";
  document.getElementById("fanSpread").style.display = "none";

  if (!deck || deck.length === 0) return;

  if (type === "one") {
    renderOneCardSpread();
  } else if (type === "three") {
    renderThreeCardSpread();
  } else if (type === "celtic") {
    renderCelticSpread();
  } else if (type === "fan") {
    renderFanSpread();
  }
}

function drawRandomCard() {
  const index = Math.floor(Math.random() * deck.length);
  const base = deck[index];
  const isReversed = Math.random() < 0.5;

  return {
    ...base,
    isReversed,
    image: isReversed ? base.reversedImage : base.uprightImage,
    meaning: isReversed ? base.reversedMeaning : base.uprightMeaning,
    orientation: isReversed ? "Reversed" : "Upright"
  };
}

function drawMultipleUnique(count) {
  const indices = [];
  while (indices.length < count && indices.length < deck.length) {
    const idx = Math.floor(Math.random() * deck.length);
    if (!indices.includes(idx)) indices.push(idx);
  }
  return indices.map(i => {
    const base = deck[i];
    const isReversed = Math.random() < 0.5;
    return {
      ...base,
      isReversed,
      image: isReversed ? base.reversedImage : base.uprightImage,
      meaning: isReversed ? base.reversedMeaning : base.uprightMeaning,
      orientation: isReversed ? "Reversed" : "Upright"
    };
  });
}

/* One card */

function renderOneCardSpread() {
  const container = document.getElementById("oneCardSpread");
  container.innerHTML = "";
  container.style.display = "flex";

  const card = drawRandomCard();
  const slot = createCardSlot(card);
  container.appendChild(slot);
}

/* Three cards */

function renderThreeCardSpread() {
  const container = document.getElementById("threeCardSpread");
  container.innerHTML = "";
  container.style.display = "flex";

  const cards = drawMultipleUnique(3);
  cards.forEach(card => {
    const slot = createCardSlot(card);
    container.appendChild(slot);
  });
}

/* Celtic Cross */

function renderCelticSpread() {
  const container = document.getElementById("celticSpread");
  container.innerHTML = "";
  container.style.display = "block";

  const cards = drawMultipleUnique(10);

  cards.forEach((card, i) => {
    const pos = i + 1;
    const slot = createCardSlot(card);
    slot.id = `celtic-pos-${pos}`;
    slot.classList.add("card-slot");
    container.appendChild(slot);
  });
}

/* Fan spread */

function renderFanSpread() {
  const container = document.getElementById("fanSpread");
  container.innerHTML = "";
  container.style.display = "block";

  const count = Math.min(deck.length, 15); // show up to 15 in fan
  const centerIndex = Math.floor(count / 2);
  const maxAngle = 40;

  for (let i = 0; i < count; i++) {
    const base = deck[i];
    const slot = document.createElement("div");
    slot.className = "card-slot";

    const angle = ((i - centerIndex) / centerIndex) * maxAngle;
    slot.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

    const cardElem = document.createElement("div");
    cardElem.className = "card";

    const inner = document.createElement("div");
    inner.className = "card-inner";

    const back = document.createElement("div");
    back.className = "card-face card-back";
    const backImg = document.createElement("img");
    backImg.src = CARD_BACK_URL;
    back.appendChild(backImg);

    const front = document.createElement("div");
    front.className = "card-face card-front";
    const frontImg = document.createElement("img");
    frontImg.src = base.uprightImage;
    front.appendChild(frontImg);

    inner.appendChild(back);
    inner.appendChild(front);
    cardElem.appendChild(inner);
    slot.appendChild(cardElem);
    container.appendChild(slot);

    cardElem.addEventListener("click", () => {
      const isReversed = Math.random() < 0.5;
      const chosen = {
        ...base,
        isReversed,
        image: isReversed ? base.reversedImage : base.uprightImage,
        meaning: isReversed ? base.reversedMeaning : base.uprightMeaning,
        orientation: isReversed ? "Reversed" : "Upright"
      };
      showSpread("one");
      renderChosenCard(chosen);
    });
  }
}

function renderChosenCard(card) {
  const container = document.getElementById("oneCardSpread");
  container.innerHTML = "";
  container.style.display = "flex";

  const slot = createCardSlot(card);
  container.appendChild(slot);
}

/* Card creation */

function createCardSlot(card) {
  const slot = document.createElement("div");
  slot.className = "card-slot";

  const cardElem = document.createElement("div");
  cardElem.className = "card";

  const inner = document.createElement("div");
  inner.className = "card-inner";

  const back = document.createElement("div");
  back.className = "card-face card-back";
  const backImg = document.createElement("img");
  backImg.src = CARD_BACK_URL;
  back.appendChild(backImg);

  const front = document.createElement("div");
  front.className = "card-face card-front";
  const frontImg = document.createElement("img");
  frontImg.src = card.image;
  front.appendChild(frontImg);

  inner.appendChild(back);
  inner.appendChild(front);
  cardElem.appendChild(inner);
  slot.appendChild(cardElem);

  const info = document.createElement("div");
  info.className = "card-info";

  const nameEl = document.createElement("div");
  nameEl.className = "card-name";
  nameEl.textContent = card.name;

  const orientEl = document.createElement("div");
  orientEl.className = "card-orientation";
  orientEl.textContent = card.orientation;

  const meaningEl = document.createElement("div");
  meaningEl.className = "card-meaning";
  meaningEl.textContent = card.meaning;

  info.appendChild(nameEl);
  info.appendChild(orientEl);
  info.appendChild(meaningEl);
  slot.appendChild(info);

  let flipped = false;
  cardElem.addEventListener("click", () => {
    flipped = !flipped;
    if (flipped) {
      cardElem.classList.add("flipped");
    } else {
      cardElem.classList.remove("flipped");
    }
  });

  return slot;
}
