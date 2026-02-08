(() => {
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const decisionStage = document.getElementById("decisionStage");
  const sparkleLayer = document.getElementById("sparkleLayer");
  const petalLayer = document.getElementById("petalLayer");
  const gloomLayer = document.getElementById("gloomLayer");
  const flashLayer = document.getElementById("flashLayer");
  const shockLayer = document.getElementById("shockLayer");
  const acceptedPanel = document.getElementById("acceptedPanel");
  const nopePanel = document.getElementById("nopePanel");
  const nopeLine = document.getElementById("nopeLine");

  if (!yesBtn || !noBtn || !decisionStage || !sparkleLayer || !petalLayer) {
    return;
  }

  const noMessages = [
    "No, why? But I love you so much because you are so beautiful.",
    "I love how caring you are.",
    "I love how safe you make me feel.",
    "I love how expressive you are.",
    "I love how stunning your smile is.",
    "I love how you are improving your skin.",
    "I love how great your humor is.",
    "I love how you laugh things out.",
    "I am trying to love your drama also."
  ];

  const noLabels = ["No", "Nope", "Still no?", "Really?", "Choose Yes", "No escape"];

  let gloomLevel = 0;
  let noAttempts = 0;
  let noMessageIndex = 0;
  let divineMouseThrottle = 0;
  let divineRainTimer = 0;
  let divineFlashTimer = 0;

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function pulseLayer(layer, className) {
    if (!layer) {
      return;
    }
    layer.classList.remove(className);
    void layer.offsetWidth;
    layer.classList.add(className);
  }

  function spawnParticle(layer, className, x, y) {
    const el = document.createElement("span");
    el.className = className;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    if (className === "petal") {
      el.style.setProperty("--drift-x", `${random(-120, 120)}px`);
      el.style.setProperty("--drift-r", `${random(-140, 190)}deg`);
    }

    if (className === "dark-shard") {
      el.style.setProperty("--shard-x", `${random(-120, 120)}px`);
      el.style.setProperty("--shard-y", `${random(-130, 85)}px`);
    }

    if (className === "ember") {
      el.style.setProperty("--ember-x", `${random(-110, 110)}px`);
      el.style.setProperty("--ember-y", `${random(-95, 70)}px`);
    }

    layer.appendChild(el);
    window.setTimeout(() => {
      el.remove();
    }, 2300);
  }

  function divineBurst(originX, originY, intensity = 75) {
    for (let i = 0; i < intensity; i += 1) {
      const dx = random(-300, 300);
      const dy = random(-180, 150);
      spawnParticle(sparkleLayer, "spark", originX + dx, originY + dy);
      if (i % 2 === 0) {
        spawnParticle(petalLayer, "petal", originX + dx * 0.7, originY + dy * 0.45);
      }
      if (i % 7 === 0) {
        spawnParticle(sparkleLayer, "starburst", originX + dx * 0.4, originY + dy * 0.25);
      }
    }
    pulseLayer(flashLayer, "active");
  }

  function darkBurst(originX, originY, intensity = 34) {
    for (let i = 0; i < intensity; i += 1) {
      spawnParticle(sparkleLayer, "dark-shard", originX + random(-90, 90), originY + random(-60, 60));
      if (i % 2 === 0) {
        spawnParticle(sparkleLayer, "ember", originX + random(-80, 80), originY + random(-55, 55));
      }
      if (i % 3 === 0) {
        spawnParticle(sparkleLayer, "shadow-puff", originX + random(-100, 100), originY + random(-70, 70));
      }
    }
    pulseLayer(shockLayer, "active");
  }

  function startDivineRain() {
    document.body.classList.add("divine");

    if (!divineRainTimer) {
      divineRainTimer = window.setInterval(() => {
        const width = window.innerWidth;
        for (let i = 0; i < 16; i += 1) {
          spawnParticle(petalLayer, "petal", random(0, width), random(-30, 40));
        }
        for (let i = 0; i < 9; i += 1) {
          spawnParticle(sparkleLayer, "spark", random(0, width), random(0, window.innerHeight * 0.55));
        }
        if (Math.random() > 0.48) {
          spawnParticle(sparkleLayer, "starburst", random(width * 0.22, width * 0.78), random(20, window.innerHeight * 0.38));
        }
      }, 170);
    }

    if (!divineFlashTimer) {
      divineFlashTimer = window.setInterval(() => {
        pulseLayer(flashLayer, "active");
      }, 540);
    }
  }

  function stopDivineRain() {
    document.body.classList.remove("divine");
    if (divineRainTimer) {
      window.clearInterval(divineRainTimer);
      divineRainTimer = 0;
    }
    if (divineFlashTimer) {
      window.clearInterval(divineFlashTimer);
      divineFlashTimer = 0;
    }
  }

  function bumpGloom() {
    noAttempts += 1;
    gloomLevel = Math.min(9, gloomLevel + 1);
    const opacity = Math.min(0.84, 0.2 + gloomLevel * 0.08);

    document.body.classList.add("gloom");
    gloomLayer.style.opacity = String(opacity);

    decisionStage.classList.remove("shake");
    void decisionStage.offsetWidth;
    decisionStage.classList.add("shake");

    window.clearTimeout(bumpGloom.timer);
    bumpGloom.timer = window.setTimeout(() => {
      document.body.classList.remove("gloom");
      gloomLayer.style.opacity = "0";
      gloomLevel = Math.max(0, gloomLevel - 2);
    }, 420);
  }

  function showNopeMessage() {
    if (!nopePanel || !nopeLine) {
      return;
    }
    nopePanel.classList.remove("hidden");
    nopeLine.textContent = noMessages[noMessageIndex % noMessages.length];
    noMessageIndex += 1;
  }

  function placeNoButtonRandomly() {
    const stageRect = decisionStage.getBoundingClientRect();
    const noRect = noBtn.getBoundingClientRect();
    const yesRect = yesBtn.getBoundingClientRect();

    const yesCenterX = yesRect.left - stageRect.left + yesRect.width / 2;
    const yesCenterY = yesRect.top - stageRect.top + yesRect.height / 2;

    const maxX = Math.max(20, stageRect.width - noRect.width - 20);
    const maxY = Math.max(18, stageRect.height - noRect.height - 18);

    let chosenX = random(12, maxX);
    let chosenY = random(12, maxY);

    for (let i = 0; i < 25; i += 1) {
      const x = random(12, maxX);
      const y = random(12, maxY);
      const centerX = x + noRect.width / 2;
      const centerY = y + noRect.height / 2;
      const distance = Math.hypot(centerX - yesCenterX, centerY - yesCenterY);
      if (distance > 120) {
        chosenX = x;
        chosenY = y;
        break;
      }
    }

    noBtn.style.left = `${chosenX}px`;
    noBtn.style.top = `${chosenY}px`;
    noBtn.style.transform = "none";
  }

  function rejectNoAction(event) {
    event.preventDefault();
    event.stopPropagation();

    stopDivineRain();

    const rect = noBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    bumpGloom();
    darkBurst(centerX, centerY, 36 + Math.min(noAttempts * 2, 20));
    showNopeMessage();
    placeNoButtonRandomly();

    noBtn.textContent = noLabels[Math.min(noAttempts, noLabels.length - 1)];
  }

  function acceptYes() {
    const rect = yesBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    startDivineRain();
    divineBurst(centerX, centerY, 130);

    window.setTimeout(() => {
      divineBurst(centerX, centerY, 90);
    }, 450);

    acceptedPanel.classList.remove("hidden");
  }

  yesBtn.addEventListener("mouseenter", () => {
    startDivineRain();
    const rect = yesBtn.getBoundingClientRect();
    divineBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 65);
  });

  yesBtn.addEventListener("mouseleave", () => {
    if (acceptedPanel.classList.contains("hidden")) {
      stopDivineRain();
    }
  });

  yesBtn.addEventListener("mousemove", (event) => {
    const now = Date.now();
    if (now - divineMouseThrottle < 45) {
      return;
    }
    divineMouseThrottle = now;
    spawnParticle(sparkleLayer, "spark", event.clientX, event.clientY);
    spawnParticle(sparkleLayer, "starburst", event.clientX + random(-10, 10), event.clientY + random(-8, 8));
    if (Math.random() > 0.35) {
      spawnParticle(petalLayer, "petal", event.clientX + random(-16, 16), event.clientY + random(-8, 8));
    }
  });

  yesBtn.addEventListener("focus", () => startDivineRain());
  yesBtn.addEventListener("blur", () => {
    if (acceptedPanel.classList.contains("hidden")) {
      stopDivineRain();
    }
  });

  yesBtn.addEventListener("click", acceptYes);

  yesBtn.addEventListener(
    "touchstart",
    () => {
      startDivineRain();
      const rect = yesBtn.getBoundingClientRect();
      divineBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 80);
    },
    { passive: true }
  );

  noBtn.addEventListener("mouseenter", rejectNoAction);
  noBtn.addEventListener("pointerdown", rejectNoAction);
  noBtn.addEventListener("click", rejectNoAction);
  noBtn.addEventListener("focus", rejectNoAction);
  noBtn.addEventListener("touchstart", rejectNoAction, { passive: false });

  acceptedPanel.addEventListener("click", () => {
    acceptedPanel.classList.add("hidden");
    stopDivineRain();
  });

  window.addEventListener("resize", () => {
    placeNoButtonRandomly();
  });

  placeNoButtonRandomly();
})();
