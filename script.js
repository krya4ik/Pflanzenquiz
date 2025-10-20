let plants = [];
let currentIndex = 0;

function handleFile() {
  const fileInput = document.getElementById('excel-file');
      const file = fileInput.files[0];

	if (!file) {
			alert('Будь ласка, виберіть файл Excel');
			return;
		  }
	const reader = new FileReader();
	
  reader.onload = function(evt) {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    plants = XLSX.utils.sheet_to_json(sheet);

    shuffle(plants);
    currentIndex = 0;
    renderPlant();
  };

  reader.readAsArrayBuffer(file);
}

function renderPlant() {
  if (plants.length === 0) return;
  const plant = plants[currentIndex];
  const container = document.getElementById("quiz-container");
  container.innerHTML = `
    <img src="${plant.Image}" alt="Plant">
    <div class="question">Gattung: <input id="gattung"></div>
    <div class="question">Art: <input id="art"></div>
    <div class="question">Familie: <input id="familie"></div>
    <div class="question">Deutscher Name: <input id="deutscherName"></div>
  `;
  document.getElementById("result").innerText = "";
}

function checkAnswers() {
  if (plants.length === 0) return;
  const plant = plants[currentIndex];
  let score = 0;

  if (document.getElementById("gattung").value.trim().toLowerCase() === (plant.Gattung || "").toLowerCase()) score++;
  if (document.getElementById("art").value.trim().toLowerCase() === (plant.Art || "").toLowerCase()) score++;
  if (document.getElementById("familie").value.trim().toLowerCase() === (plant.Familie || "").toLowerCase()) score++;
  if (document.getElementById("deutscherName").value.trim().toLowerCase() === (plant["Deutscher Name"] || "").toLowerCase()) score++;

  document.getElementById("result").innerText = `Ergebnis: ${score}/4 richtig`;
}

function showCorrectAnswers() {
  if (plants.length === 0) return;
  const plant = plants[currentIndex];
  document.getElementById("result").innerHTML = `
    Richtige Antworten:<br>
    Gattung: <span class="correct">${plant.Gattung}</span><br>
    Art: <span class="correct">${plant.Art}</span><br>
    Familie: <span class="correct">${plant.Familie}</span><br>
    Deutscher Name: <span class="correct">${plant["Deutscher Name"]}</span>
  `;
}

function nextPlant() {
  if (plants.length === 0) return;
  currentIndex = (currentIndex + 1) % plants.length;
  renderPlant();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
