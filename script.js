(() => {
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const decisionStage = document.getElementById("decisionStage");
  const sparkleLayer = document.getElementById("sparkleLayer");
  const petalLayer = document.getElementById("petalLayer");
  const gloomLayer = document.getElementById("gloomLayer");
  const acceptedPanel = document.getElementById("acceptedPanel");

  if (!yesBtn || !noBtn || !decisionStage) {
    return;
  }

  let gloomLevel = 0;
  let noAttempts = 0;
  let divineMouseThrottle = 0;

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function spawnParticle(layer, className, x, y) {
    const el = document.createElement("span");
    el.className = className;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    if (className === "petal") {
      el.style.setProperty("--drift-x", `${random(-70, 70)}px`);
      el.style.setProperty("--drift-r", `${random(-80, 110)}deg`);
    }
    layer.appendChild(el);
    window.setTimeout(() => {
      el.remove();
    }, 2000);
  }

  function divineBurst(originX, originY, intensity = 22) {
    for (let i = 0; i < intensity; i += 1) {
      const dx = random(-220, 220);
      const dy = random(-130, 120);
      spawnParticle(sparkleLayer, "spark", originX + dx, originY + dy);
      if (i % 2 === 0) {
        spawnParticle(petalLayer, "petal", originX + dx * 0.65, originY + dy * 0.35);
      }
    }
  }

  function activateDivineMode(enable) {
    document.body.classList.toggle("divine", enable);
    if (!enable) {
      return;
    }
    const rect = yesBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    divineBurst(centerX, centerY, 26);
  }

  function puffShadows(x, y, count = 8) {
    for (let i = 0; i < count; i += 1) {
      spawnParticle(
        sparkleLayer,
        "shadow-puff",
        x + random(-90, 90),
        y + random(-60, 60)
      );
    }
  }

  function bumpGloom() {
    noAttempts += 1;
    gloomLevel = Math.min(6, gloomLevel + 1);
    const opacity = Math.min(0.62, 0.12 + gloomLevel * 0.08);

    document.body.classList.add("gloom");
    gloomLayer.style.opacity = String(opacity);

    window.clearTimeout(bumpGloom.timer);
    bumpGloom.timer = window.setTimeout(() => {
      document.body.classList.remove("gloom");
      gloomLayer.style.opacity = "0";
      gloomLevel = Math.max(0, gloomLevel - 1);
    }, 320);
  }

  function placeNoButtonRandomly() {
    const stageRect = decisionStage.getBoundingClientRect();
    const noRect = noBtn.getBoundingClientRect();

    const maxX = Math.max(20, stageRect.width - noRect.width - 20);
    const maxY = Math.max(18, stageRect.height - noRect.height - 20);

    const x = random(12, maxX);
    const y = random(12, maxY);

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
    noBtn.style.transform = "none";
  }

  function rejectNoAction(event) {
    event.preventDefault();
    const rect = noBtn.getBoundingClientRect();
    bumpGloom();
    puffShadows(rect.left + rect.width / 2, rect.top + rect.height / 2);
    placeNoButtonRandomly();

    if (noAttempts >= 4) {
      noBtn.textContent = "Still no?";
    }
    if (noAttempts >= 8) {
      noBtn.textContent = "Nope";
    }
  }

  function acceptYes() {
    activateDivineMode(true);
    const rect = yesBtn.getBoundingClientRect();
    divineBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
    acceptedPanel.classList.remove("hidden");
  }

  yesBtn.addEventListener("mouseenter", () => activateDivineMode(true));
  yesBtn.addEventListener("mouseleave", () => activateDivineMode(false));

  yesBtn.addEventListener("mousemove", (event) => {
    const now = Date.now();
    if (now - divineMouseThrottle < 90) {
      return;
    }
    divineMouseThrottle = now;
    spawnParticle(sparkleLayer, "spark", event.clientX, event.clientY);
    if (Math.random() > 0.58) {
      spawnParticle(petalLayer, "petal", event.clientX + random(-12, 12), event.clientY + random(-8, 8));
    }
  });

  yesBtn.addEventListener("focus", () => activateDivineMode(true));
  yesBtn.addEventListener("blur", () => activateDivineMode(false));
  yesBtn.addEventListener("click", acceptYes);
  yesBtn.addEventListener("touchstart", () => activateDivineMode(true), { passive: true });

  noBtn.addEventListener("mouseenter", rejectNoAction);
  noBtn.addEventListener("pointerdown", rejectNoAction);
  noBtn.addEventListener("click", rejectNoAction);
  noBtn.addEventListener("focus", rejectNoAction);
  noBtn.addEventListener("touchstart", rejectNoAction, { passive: false });

  acceptedPanel.addEventListener("click", () => {
    acceptedPanel.classList.add("hidden");
  });

  window.addEventListener("resize", () => {
    placeNoButtonRandomly();
  });

  placeNoButtonRandomly();
})();
