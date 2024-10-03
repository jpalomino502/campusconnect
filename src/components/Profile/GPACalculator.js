import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa'; // Importa el icono de basura

const GPACalculator = () => {
  const [subjects, setSubjects] = useState([{ name: '', credits: '', grade: '' }]);
  const [pga, setPga] = useState(0);

  const handleChange = (index, event) => {
    const newSubjects = [...subjects];
    newSubjects[index][event.target.name] = event.target.value;

    if (event.target.name === 'credits') {
      const creditsValue = parseFloat(event.target.value);
      if (creditsValue < 0) {
        newSubjects[index][event.target.name] = '';
      }
    }

    if (event.target.name === 'grade') {
      const gradeValue = parseFloat(event.target.value);
      if (gradeValue < 0.0 || gradeValue > 5.0) {
        newSubjects[index][event.target.name] = '';
      }
    }

    if ((event.target.name === 'credits' || event.target.name === 'grade') && newSubjects[index][event.target.name]) {
      if (index === subjects.length - 1) {
        newSubjects.push({ name: '', credits: '', grade: '' });
      }
    }

    setSubjects(newSubjects);
    calculatePGA(newSubjects);
  };

  const calculatePGA = (subjectsList) => {
    let totalCredits = 0;
    let totalPoints = 0;

    subjectsList.forEach(({ credits, grade }) => {
      if (credits && grade) {
        totalCredits += parseFloat(credits);
        totalPoints += parseFloat(credits) * parseFloat(grade);
      }
    });

    setPga(totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0);
  };

  const handleRemoveSubject = (index) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(newSubjects);
    calculatePGA(newSubjects);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg mx-auto w-full max-w-lg">
      <h3 className="text-2xl font-bold mb-2 text-center text-gray-800">Calculadora de PGA</h3>
      <p className="text-gray-600 text-sm mb-4">
        La calculadora de PGA permite calcular el promedio ponderado de tus calificaciones. 
        Para calcular el PGA, se multiplican los créditos de cada materia por la calificación obtenida en ella. 
        Luego, se suman todos los puntos obtenidos y se dividen entre el total de créditos. 
        Este método asegura que las materias con más créditos tengan un mayor impacto en el GPA final.
      </p>
      {subjects.map((subject, index) => (
        <div key={index} className="flex mb-2 items-center">
          <input
            type="number"
            name="credits"
            placeholder="Créditos"
            value={subject.credits}
            onChange={(event) => handleChange(index, event)}
            className="flex-1 p-2 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300 mx-2"
          />
          <input
            type="number"
            name="grade"
            placeholder="Calificación"
            value={subject.grade}
            onChange={(event) => handleChange(index, event)}
            className="flex-1 p-2 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300 mx-2"
          />
          {subjects.length > 1 && index > 0 && (
            <button
              onClick={() => handleRemoveSubject(index)}
              className="ml-2 p-2 bg-red-500 text-white rounded-md"
            >
              <FaTrash />
            </button>
          )}
        </div>
      ))}
      <h4 className="text-center mt-4 text-lg font-semibold text-gray-800">PGA: {pga}</h4>
      <h4 className="text-center mt-4 text-lg font-semibold text-gray-800">Resultados por Materia:</h4>
      <div className="mt-2">
        {subjects.map((subject, index) => {
          const points = (parseFloat(subject.credits) * parseFloat(subject.grade)).toFixed(2);
          return (
            <div key={index} className="flex justify-between p-2 border-b">
              <span>{subject.name || 'Materia'}</span>
              <span>{points || 0} puntos</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GPACalculator;
