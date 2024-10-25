import ReviewQuestions from "@/app/components/ReviewQuestions";

// Interface for the parameters expected in the dynamic route
interface PageProps {
  params: Promise<{
    questiondashboard: number;
    assignmentDashboard: string;
    unitDashboard: string;
  }>;
}

// Asynchronous page component
export default async function Page({ params }: PageProps) {
  // Await the resolved params object
  const { questiondashboard, assignmentDashboard, unitDashboard } = await params;

  return (
    <ReviewQuestions
      submissionId={questiondashboard}
      projectName={assignmentDashboard}
      unitCode={unitDashboard}
    />
  );
}
