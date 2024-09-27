import React from 'react';
import Link from 'next/link'; // Import Link from Next.js for routing
import '@/app/styles/UnitCard.css';

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
    <Link href={`/dashboard/userDashboard/${unit.unit_code}`} passHref>
      <div className="unit-card">
        <h3>{unit.unit_code}</h3>
        <p>{unit.unit_name}</p>
        <p>{unit.year} - {unit.session}</p>
      </div>
    </Link>
  );
};

export default UnitCard;
