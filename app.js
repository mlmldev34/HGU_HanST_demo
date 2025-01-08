fetch("text.json")
  .then((response) => response.json())
  .then((data) => {
    const container = document.getElementById("hanst-container");
    const body = document.body;

    // HEX 색상을 기반으로 대비 색상을 계산
    function getContrastColor(hexColor) {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 128 ? "#000000" : "#FFFFFF";
    }

    // 색상을 필터링하여 회색 계열(#808080 ~ #BFBFBF) 제외
    function isNotGray(hexColor) {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);

      const tolerance = 10; // 허용 오차
      return !(
        Math.abs(r - g) <= tolerance &&
        Math.abs(g - b) <= tolerance &&
        Math.abs(r - b) <= tolerance
      );
    }

    // 색상 배열 섞기
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    const colors = []; // 학번별 색상을 저장할 배열

    data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";

      if (item.color && isNotGray(item.color)) {
        card.style.backgroundColor = item.color;
        colors.push(item.color);
      }

      const contrastColor = getContrastColor(item.color);

      const year = document.createElement("h2");
      year.textContent = item.year;
      year.style.color = contrastColor;

      const generation = document.createElement("h3");
      generation.textContent = item.name;
      generation.style.color = contrastColor;

      const logoContainer = document.createElement("div");
      logoContainer.className = "logo-container";
      if (item.logo && item.logo !== "?") {
        const logo = document.createElement("img");
        logo.src = item.logo;
        logo.alt = `${item.year} 로고`;
        logoContainer.appendChild(logo);
      }

      const sloganContainer = document.createElement("div");
      sloganContainer.className = "slogan-container";
      if (Array.isArray(item.slogan)) {
        sloganContainer.innerHTML = item.slogan.join("<br>");
      } else {
        const slogan = document.createElement("p");
        slogan.textContent = item.slogan;
        slogan.style.color = contrastColor;
        sloganContainer.appendChild(slogan);
      }

      const bibleContainer = document.createElement("div");
      bibleContainer.className = "bible-container";
      if (item.bibleText || item.bibleReference) {
        const bible = document.createElement("blockquote");
        bible.style.color = contrastColor;
        if (item.bibleText) {
          bible.textContent = item.bibleText;
        }
        if (item.bibleReference) {
          const reference = document.createElement("div");
          reference.textContent = item.bibleReference;
          reference.style.fontWeight = "bold";
          reference.style.textAlign = "center";
          reference.style.color = contrastColor;
          bible.appendChild(reference);
        }
        bibleContainer.appendChild(bible);
      }

      card.appendChild(year);
      card.appendChild(generation);
      card.appendChild(logoContainer);
      card.appendChild(sloganContainer);
      card.appendChild(bibleContainer);

      container.appendChild(card);
    });
  })
  .catch((error) => console.error("Error", error));
