import React from 'react';
import Select from 'react-select';
import { careers } from './careers';

const CareerSelect = ({ career, setCareer }) => {
  const options = careers.map((careerOption) => ({
    value: careerOption,
    label: careerOption,
  }));

  return (
    <Select
      options={options}
      value={options.find(option => option.value === career)}
      onChange={(selectedOption) => setCareer(selectedOption.value)}
      placeholder="Selecciona tu carrera"
    />
  );
};

export default CareerSelect;
