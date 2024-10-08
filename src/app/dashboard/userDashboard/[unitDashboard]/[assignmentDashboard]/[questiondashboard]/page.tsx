// page.tsx
import ReviewQuestions from "@/app/components/ReviewQuestions";

interface PageProps {
  params: {
    questiondashboard: number;
    projectName: string;
    unitCode: string;
  };
}

export default function Page({ params }: PageProps) {
  const { questiondashboard, projectName, unitCode } = params;

  return (
    <ReviewQuestions
      submissionId={questiondashboard}
      projectName={projectName}
      unitCode={unitCode}
    />
  );
}
