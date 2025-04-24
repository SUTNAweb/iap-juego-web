// IAP Game Web Version - Envío de resultados a Google Sheets
import { useState } from 'react';

export default function IAPGameWeb() {
  const [gameState, setGameState] = useState("intro");
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [principleInfo, setPrincipleInfo] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState([]);

  const webhookUrl = "https://script.google.com/macros/s/AKfycbxZifefA0T2lzCwSgtbi4DiGgEmrUPchiKWBnkbfdJi_nmeyLj2Mreu5uNRIkwNILZR/exec";

  const scenarios = [/* Aquí deberías pegar tu array de escenarios completo */];

  const startGame = () => {
    setGameState("playing");
  };

  const handleOptionSelect = (optionIndex) => {
    const selectedOption = scenarios[currentScenario].options[optionIndex];
    setFeedback(selectedOption.feedback);

    if (selectedOption.correct) {
      setScore(score + 1);
    }

    setAnswers(prev => [...prev, {
      pregunta: currentScenario + 1,
      correcta: selectedOption.correct
    }]);

    setPrincipleInfo(scenarios[currentScenario].principle);
  };

  const nextScenario = () => {
    setFeedback("");
    setPrincipleInfo(null);

    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      setShowResults(true);
      enviarResultados();
    }
  };

  const enviarResultados = async () => {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          score,
          total: scenarios.length,
          answers
        })
      });
    } catch (error) {
      console.error("Error al enviar los resultados:", error);
    }
  };

  const restartGame = () => {
    setGameState("intro");
    setCurrentScenario(0);
    setScore(0);
    setFeedback("");
    setPrincipleInfo(null);
    setShowResults(false);
    setAnswers([]);
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold">Juego IAP</h1>
      <p>Interfaz mínima: reemplazá este return por tu diseño completo del juego.</p>
      {showResults && <div><strong>Puntaje:</strong> {score} / {scenarios.length}</div>}
    </div>
  );
}