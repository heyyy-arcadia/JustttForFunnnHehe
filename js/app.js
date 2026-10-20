document.addEventListener("DOMContentLoaded", () => {
  const welcome = document.getElementById("welcome-screen");
  const home = document.getElementById("home-screen");
  const enterButton = document.getElementById("enter-button");
  const musicButton = document.getElementById("music-button");
  const music = document.getElementById("background-music");

  const overlay = document.getElementById("reveal-overlay");
  const closeButton = document.getElementById("close-button");
  const cardsContainer = document.getElementById("cards-container");
  const cardCount = document.getElementById("card-count");
  const form = document.getElementById("password-form");
  const passwordInput = document.getElementById("password-input");
  const passwordError = document.getElementById("password-error");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const reveal = document.getElementById("secret-reveal");

  let selectedCard = null;
  let musicEnabled = false;

  function renderCards() {
    const cards = Array.isArray(window.secretCards) ? window.secretCards : [];
    cardCount.textContent = `${String(cards.length).padStart(2, "0")} CHAPTERS`;

    cardsContainer.replaceChildren();

    cards.forEach((card, index) => {
      const element = document.createElement("article");
      element.className = "secret-card";
      element.tabIndex = 0;
      element.setAttribute("role", "button");
      element.setAttribute("aria-label", `Open ${card.title}`);

      const number = document.createElement("span");
      number.className = "card-number";
      number.textContent = `CHAPTER ${String(index + 1).padStart(2, "0")}`;

      const symbol = document.createElement("span");
      symbol.className = "card-symbol";
      symbol.textContent = card.symbol || "⚜";

      const title = document.createElement("h4");
      title.textContent = card.title;

      const description = document.createElement("p");
      description.textContent = card.description;

      const link = document.createElement("span");
      link.className = "card-link";
      link.textContent = "Open chapter ↗";

      element.append(number, symbol, title, description, link);
      element.addEventListener("click", () => openCard(card));
      element.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openCard(card);
        }
      });
      cardsContainer.append(element);
    });
  }

  function openCard(card) {
    selectedCard = card;
    modalTitle.textContent = card.title;
    modalDescription.textContent = card.description;
    passwordInput.value = "";
    passwordError.textContent = "";
    reveal.textContent = "";
    reveal.classList.add("hidden");
    form.classList.remove("hidden");
    overlay.classList.remove("hidden");
    passwordInput.focus();
  }

  function closeModal() {
    overlay.classList.add("hidden");
    selectedCard = null;
  }

  enterButton.addEventListener("click", async () => {
    welcome.classList.add("hidden");
    home.classList.remove("hidden");

    if (musicEnabled) return;
  
    music.src = "assets/audio/background-music.mp3";
    music.volume = 0.35;

    try {
      await music.play();
      musicEnabled = true;
      musicButton.textContent = "♫ Don't dare turning this song off";
    } catch {
      musicButton.textContent = "♫ You pathetic idiot";
    }
  });

  musicButton.addEventListener("click", async () => {
    if (!music.paused) {
      music.pause();
      musicButton.textContent = "♫ You pathetic idiot";
      return;
    }

    try {
      await music.play();
      musicEnabled = true;
      musicButton.textContent = "♫ Don't dare turning the song off";
    } catch {
      musicButton.textContent = "♫ Add music file";
    }
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!selectedCard) return;

    if (passwordInput.value === selectedCard.password) {
      form.classList.add("hidden");
      reveal.textContent = selectedCard.reveal;
      reveal.classList.remove("hidden");
      modalDescription.textContent = "Unlocked ... This little piece is yours to read";
      return;
    }

    passwordError.textContent = "Not quite ... Take another guess (ik you will)";
    passwordInput.select();
  });

  closeButton.addEventListener("click", closeModal);

  overlay.addEventListener("click", event => {
    if (event.target === overlay) closeModal();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
  });
 
  renderCards();
 
  const sparkleLayer = document.createElement("div");
  sparkleLayer.className = "sparkle-layer";
  sparkleLayer.setAttribute("aria-hidden", "true");
  document.body.appendChild(sparkleLayer);

  
  for (let i = 0; i < 32; i++) {
    const particle = document.createElement("span");
    particle.className = "sparkle";

    particle.style.left = `${Math.random() * 100}%`;
    particle.style.setProperty("--size", `${1 + Math.random() * 3}px`);
    particle.style.setProperty("--duration", `${9 + Math.random() * 13}s`);
    particle.style.setProperty("--delay", `${-Math.random() * 20}s`);
    particle.style.setProperty("--drift", `${Math.random() * 80 - 40}px`);

    sparkleLayer.appendChild(particle);
  }
  
  for (let i = 0; i < 12; i++) {
    const star = document.createElement("span");
    star.className = "twinkle";

    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty("--duration", `${3 + Math.random() * 4}s`);
    star.style.setProperty("--delay", `${-Math.random() * 7}s`);

    sparkleLayer.appendChild(star);
  }

  const cards = document.querySelectorAll(".secret-card");

  if ("IntersectionObserver" in window) {
    const cardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    });

    cards.forEach(card => cardObserver.observe(card));
  } else {
    cards.forEach(card => card.classList.add("is-visible"));
  }
;

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
  ).matches;

  if (finePointer) {
    const cursor = document.createElement("div");
    cursor.className = "gold-cursor";
    document.body.appendChild(cursor);

    let lastTrailTime = 0;

    document.addEventListener("pointermove", event => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;

      const now = performance.now();
    
      if (now - lastTrailTime < 55) return;
      lastTrailTime = now;

      const particle = document.createElement("span");
      particle.className = "gold-trail";
      particle.style.left = `${event.clientX + (Math.random() - .5) * 10}px`;
      particle.style.top = `${event.clientY + (Math.random() - .5) * 10}px`;
      particle.style.setProperty("--trail-size", `${2 + Math.random() * 5}px`);

      document.body.appendChild(particle);
      particle.addEventListener("animationend", () => particle.remove(), { once: true });
    });
  }

  const whispers = [
    "Oh, how very inoccent of you !!! Bruh ...",
    "You thought nobody would notice ???",
    "Such secrets ... Such terrible hiding places.",
    "Go on darling. ... Pretend you're innocent",
    "Curiosity looks rather good on you ...",
    "A locked door ? How original ...",
    "Careful what you go looking for ...",
    "Someone has been keeping things interesting , hehe ",
    "Do try not to look so 'inncocent' ... ",
    "Someone call the police ???",
    "Oh dear ... Another little obsession ?",
    "Photograph this creep ...",
    "Even the shadows are judging you ...",
    "Still here ? Persistent little idiot ...",
    "Some pages bite back, yk ...",
    "Don't mind me ... I'm merely observing ...",
    "A little drama never hurts anyone ...",
    "Surely you didn't expect an easy answer ???"
  ];

  let whisperTimer = null;

  function showWhisper() {
  
    const modal = document.getElementById("reveal-overlay");
    const home = document.getElementById("home-screen");

    if (!home || home.classList.contains("hidden") ||
        (modal && !modal.classList.contains("hidden"))) {
      scheduleWhisper();
      return;
    }

    const note = document.createElement("div");
    note.className = "gothic-note";
    note.setAttribute("aria-hidden", "true");
    note.textContent = whispers[Math.floor(Math.random() * whispers.length)];

    const maxX = Math.max(12, window.innerWidth - 270);
    const maxY = Math.max(100, window.innerHeight - 160);

    note.style.left = `${12 + Math.random() * Math.max(1, maxX - 12)}px`;
    note.style.top = `${100 + Math.random() * Math.max(1, maxY - 100)}px`;

    document.body.appendChild(note);
    note.addEventListener("animationend", () => note.remove(), { once: true });
    scheduleWhisper();
  }

  function scheduleWhisper() {
    clearTimeout(whisperTimer);
    whisperTimer = setTimeout(showWhisper, 7000 + Math.random() * 9000);
  }

  const enterForWhispers = document.getElementById("enter-button");

  if (enterForWhispers) {
    enterForWhispers.addEventListener("click", () => {
      clearTimeout(whisperTimer);
      whisperTimer = setTimeout(showWhisper, 4000 + Math.random() * 4000);
    });
  }

});
