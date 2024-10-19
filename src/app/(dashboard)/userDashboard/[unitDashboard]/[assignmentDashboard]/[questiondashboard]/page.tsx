// page.tsx
import ReviewQuestions from "@/app/components/ReviewQuestions";
import UnitDashboard from "../../page";

interface PageProps {
  params: {
    questiondashboard: number;
    assignmentDashboard: string;
    unitDashboard: string;
  };
}

export default function Page({ params }: PageProps) {
  const { questiondashboard, assignmentDashboard, unitDashboard } = params;

  return (
    <ReviewQuestions
      submissionId={questiondashboard}
      projectName={assignmentDashboard}
      unitCode={unitDashboard}
    />
  );
}
