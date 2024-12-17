// src/components/Slider.tsx
import React from 'react';
import "./styles/Slider.css";

interface SliderProps {
  numSteps: number;
  setNumSteps: React.Dispatch<React.SetStateAction<number>>;
}

const Slider: React.FC<SliderProps> = ({ numSteps, setNumSteps }) => {
  const handleIncrement = () => {
    if (numSteps < 15) {
      setNumSteps(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (numSteps > 3) {
      setNumSteps(prev => prev - 1);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumSteps(Number(e.target.value));
  };

  return (
    <div className="slider-container">
      {/* Minus button */}
      <button onClick={handleDecrement}>-</button>

      {/* Box with the current number of steps */}
      <div className="steps-box">
        <span>{numSteps}</span>
      </div>
      
      {/* Plus button */}
      <button onClick={handleIncrement}>+</button>

      {/* Slider */}
      <input
        type="range"
        min="3"
        max="15"
        value={numSteps}
        onChange={handleSliderChange}
      />

      
    </div>
  );
};

export default Slider;
