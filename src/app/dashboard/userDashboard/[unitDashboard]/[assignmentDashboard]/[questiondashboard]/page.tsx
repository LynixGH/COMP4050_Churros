// page.tsx
import ReviewQuestions from '@/app/components/ReviewQuestions';

interface PageProps {
  params: {
    unitDashboard: string;
    assignmentDashboard: string;
    questionDashboard: string;
  };
}

export default function Page({ params }: PageProps) {
  const { unitDashboard, assignmentDashboard, questionDashboard } = params;

  return (
    <ReviewQuestions
      unitCode={unitDashboard}
      projectName={assignmentDashboard}
    />
  );
}
