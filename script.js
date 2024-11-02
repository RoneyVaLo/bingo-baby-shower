let babyWords = [];
let usedWords = new Set(); // Usaremos un Set para evitar palabras repetidas

const wordDisplay = document.getElementById("word-display");
const wordHistoryList = document.getElementById("word-history");
const newWordButton = document.getElementById("new-word-btn");
const resetButton = document.getElementById("reset-btn");

let wordHistory = [];

// Cargar palabras desde el archivo JSON
async function loadWords() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    babyWords = data.babyWords;

    loadHistoryFromLocalStorage(); // Cargar historial desde localStorage
    updateHistory(); // Mostrar historial en la página
  } catch (error) {
    console.error("Error loading words:", error);
  }
}

// Generar una palabra aleatoria sin repetición
function getRandomWord() {
  const availableWords = babyWords.filter((word) => !usedWords.has(word));

  if (availableWords.length === 0) {
    wordDisplay.textContent = "TODAS LAS PALABRAS HAN SALIDO!";
    newWordButton.disabled = true; // Deshabilitar el botón
    return;
  }

  const randomIndex = Math.floor(Math.random() * availableWords.length);
  const newWord = availableWords[randomIndex];

  usedWords.add(newWord); // Marcar la palabra como usada
  wordDisplay.textContent = newWord;
  wordHistory.push(newWord);
  saveHistoryToLocalStorage(); // Guardar el historial actualizado
  updateHistory();
}

// Restablecer todo
function resetEverything() {
  wordDisplay.textContent = "Presiona el botón!";
  wordHistory = [];
  usedWords.clear(); // Limpiar las palabras usadas
  newWordButton.disabled = false; // Habilitar el botón
  localStorage.removeItem("wordHistory"); // Eliminar el historial del localStorage
  updateHistory();
}

// Actualizar el historial de palabras
function updateHistory() {
  wordHistoryList.innerHTML = "";
  wordHistory.forEach((word) => {
    const li = document.createElement("li");
    li.textContent = word;
    wordHistoryList.appendChild(li);
  });
}

// Guardar el historial en localStorage
function saveHistoryToLocalStorage() {
  localStorage.setItem("wordHistory", JSON.stringify(wordHistory));
}

// Cargar el historial desde localStorage
function loadHistoryFromLocalStorage() {
  const savedHistory = JSON.parse(localStorage.getItem("wordHistory") || "[]");
  wordHistory = savedHistory;
  usedWords = new Set(savedHistory); // Marcar palabras cargadas como usadas
}

// Event Listeners
newWordButton.addEventListener("click", getRandomWord);
resetButton.addEventListener("click", resetEverything);

// Cargar las palabras al iniciar
loadWords();
