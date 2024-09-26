import React from 'react';
import '@/app/styles/UnitCard.css'; // Import the UnitCard styles
interface UnitProps {
  unit: {
    unit_code: string;
    unit_name: string;
    year: string;
    session: string;
  };
}
const UnitCard: React.FC<UnitProps> = ({ unit }) => {
  return (
    <div className="unit-card">
      <h3>{unit.unit_code}</h3>
      <p>{unit.unit_name}</p>
      <p>
        {unit.year} - {unit.session}
      </p>
    </div>
  );
};
export default UnitCard;