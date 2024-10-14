//Define the base URL for API
export const BASE_URL = 'http://3.25.103.58';

//Endpoints

//Units
export const POST_UNIT = `${BASE_URL}/units`;
export const GET_UNITS = `${BASE_URL}/units`;
export const DELETE_UNIT = (unitCode: string) => `${BASE_URL}/units/${encodeURIComponent(unitCode)}`;
export const UPDATE_UNIT = (unitCode: string) => `${BASE_URL}/units/${encodeURIComponent(unitCode)}`;
export const GET_ALL_UNITS = (staffEmail: string) =>
    `${BASE_URL}/units?staff_email=${encodeURIComponent(staffEmail)}`;

//Projects
export const POST_PROJECT = (unitCode: string) => `${BASE_URL}/units/${encodeURIComponent(unitCode)}/projects`;
export const GET_PROJECTS = (unitCode: string) => `${BASE_URL}/units/${encodeURIComponent(unitCode)}/projects`;
export const DELETE_PROJECT = (unitCode: string, projectName: string) => `${BASE_URL}/units/${encodeURIComponent(unitCode)}/projects/${encodeURIComponent(projectName)}`;
export const UPDATE_PROJECT = (unitCode: string, projectName: string) => `${BASE_URL}/units/${encodeURIComponent(unitCode)}/projects/${encodeURIComponent(projectName)}`;

//Questions
export const POST_QUESTION_TEMPLATE = (unitCode: string, projectName: string) =>
    `${BASE_URL}/units/${encodeURIComponent(unitCode)}/projects/${encodeURIComponent(projectName)}/template`;
export const GET_QUESTIONS_TEMPLATE = (unitCode: string, projectName: string) =>
    `${BASE_URL}/units/${encodeURIComponent(unitCode)}/projects/${encodeURIComponent(projectName)}/template`;

export const GET_QUESTION_BANK = (unitCode: string, projectName: string) =>
    `${BASE_URL}/units/${(unitCode)}/projects/${(projectName)}/question_bank`;

export const POST_QUESTION_BANK = (unitCode: string, projectName: string) =>
    `${BASE_URL}/units/${encodeURIComponent(unitCode)}/projects/${encodeURIComponent(projectName)}/question_bank`;
export const GENERATE_ALL_QUESTIONS = (unitCode: string, projectName: string) =>
    `${BASE_URL}/units/${encodeURIComponent(unitCode)}/projects/${encodeURIComponent(projectName)}/generate_questions`;
export const GET_GENERATED_QUESTIONS = (submissionId: number) =>
    `${BASE_URL}/questions/${submissionId}`;

export const REGENERATE_QUESTIONS_FOR_ONE = (unitCode: string, projectName: string, submissionId: number) =>
    `${BASE_URL}/units/${encodeURIComponent(unitCode)}/projects/${(projectName)}/re_generate_questions/${(submissionId)}`;


//Rubric Gen
export const GENERATE_RUBRIC = `${BASE_URL}/generate_rubric`;
export const GET_RUBRIC = (rubricId: number) => `${BASE_URL}/rubric/${encodeURIComponent(rubricId)}`;
export const UPDATE_RUBRIC = (rubricId: number) => `${BASE_URL}/rubric/${encodeURIComponent(rubricId)}`;
export const GET_ALL_RUBRICS = (staffEmail: string) => `${BASE_URL}/rubrics?staff_email=${encodeURIComponent(staffEmail)}`;
export const DEL_RUBRIC = (rubricId: number) => `${BASE_URL}/rubric/${encodeURIComponent(rubricId)}`;
export const GET_PDF_RUBRIC = (rubricId: number) => `${BASE_URL}/download_rubric/${encodeURIComponent(rubricId)}/pdf`
export const GET_XLS_RUBRIC = (rubricId: number) => `${BASE_URL}/download_rubric/${encodeURIComponent(rubricId)}/xls`

// Marking Guide Conversion
export const CONVERT_MARKING_GUIDE = (marking_guide_Id: number) => `${BASE_URL}/convert_marking_guide/${encodeURIComponent(marking_guide_Id)}`
export const UPLOAD_MARKING_GUIDE = `${BASE_URL}/marking_guide`;

//Students
export const POST_STUDENTS = (unitCode: string) => `${BASE_URL}/units/${encodeURIComponent(unitCode)}/students`;
export const GET_STUDENTS_LIST = (unitCode: string) =>
    `${BASE_URL}/units/${encodeURIComponent(unitCode)}/students`;

//TA
export const POST_TA = (unitCode: string) => `${BASE_URL}/units/${encodeURIComponent(unitCode)}/collaborators`;
export const GET_ALL_TA = (unitCode: string) => `${BASE_URL}/units/${encodeURIComponent(unitCode)}/collaborators`;
export const DELETE_TA = (unitCode: string, staff_id: number) => `${BASE_URL}/units/${encodeURIComponent(unitCode)}/collaborators/${encodeURIComponent(staff_id)}`
export const GET_ALL_NON_TA = (unitCode: string) => `${BASE_URL}/units/${encodeURIComponent(unitCode)}/non_collaborators`;

//TA & Staff
export const GET_ALL_STAFF = `${BASE_URL}/staffs`;

//Submissions
export const BATCH_UPLOAD_SUBMISSIONS = (unitCode: string, projectName: string) => `${BASE_URL}/units/${encodeURIComponent(unitCode)}/projects/${projectName}/files`;
export const GET_SUBMISSIONS = (unitCode: string, projectName: string) => `${BASE_URL}/units/${encodeURIComponent(unitCode)}/projects/${projectName}/files`;
export const DELETE_ALL_SUBMISSIONS = (unitCode: string, projectName: string) => `${BASE_URL}/units/${encodeURIComponent(unitCode)}/projects/${projectName}/files`;
export const DELETE_SUBMISSION = (unitCode: string, projectName: string, submissionId: number) => `${BASE_URL}/units/${encodeURIComponent(unitCode)}/projects/${projectName}/files/${encodeURIComponent(submissionId)}`;  