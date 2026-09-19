import { createBrowserRouter } from "react-router-dom";
import SignUp from "../components/auth/SignUp";

import Login from "../components/auth/Login";
import UniversityAdminDashboard from "../components/UniversityAdmin/UniversityAdminDashboard";
import ResetPassword from "../components/auth/ResetPassword";
import AdminDashboardLayout from "../Layouts/AdminDashboardLayout";
import FacultyDeanDashboard from "../components/FacultyDean/FacultyDeanDashboard";
import FacultiesList from "../components/Faculties/FacultiesList";
import DepartmentsList from "../components/Departments/departmentsList";
import ProgramsList from "../components/Programs/ProgramsList";
import DegreesList from "../components/Degrees/DegreesList";
import CoursesList from "../components/Courses/CoursesList";
import ProfessorsList from "../components/Professors/ProfessorsList";

import ProfessorCourseList from "../components/ProfessorCourses/ProfessorCourseList";
import { FacultyDetailsPage } from "../pages/FacultyDetailsPage";
import { HomePage } from "../pages/HomePage";
import { FacultiesPage } from "../pages/FacultiesPage";
import { ContactPage } from "../pages/ContactPage";

import { AdmissionsPage } from "../pages/AdmissionsPage";
import { ProfessorDetailsPage } from "../pages/ProfessorDetailsPage";
import { ProfessorsPage } from "../pages/ProfessorsPage";

import { ProgramDetailsPage } from "../pages/ProgramDetailsPage";
import { ProgramsPage } from "../pages/ProgramsPage";
import AdmissionsList from "../components/Admissions/AdmissionsList";
import ApplicationWizard from "../components/ApplicationWizard/ApplicationWizard";
import ApplicantSignUp from "../components/auth/Applicant/ApplicantSignUp";
import ApplicationsList from "../components/Applications/ApplicationsList";
import ApplicationsReviewList from "../components/Applications/ApplicationsReviewList";
import EnrollmentList from "../components/Enrollments/EnrollmentList";
import StudentList from "../components/Students/StudentList";
import GradeEntryPage from "../components/Grades/GradeEntryPage";
import ProfessorCourses from "../components/Professors/ProfessorCoursesList";
import StudentGradesPage from "../components/Students/StudentGradesPage ";
import UniversityProfilePage from "../components/UniversityAdmin/UniversityProfilePage";
import UniversityLayout from "../Layouts/UniversityLayout";
import LandingPage from "../components/Home/LandingPage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
    {
    path: "/signup/student",
    element: <ApplicantSignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
    {
    path: "/login/student",
    element: <Login />,
  },
  {
    element: <AdminDashboardLayout />,
    children: [
      {
        path: "/university-admin-dashboard",
        element: <UniversityAdminDashboard />,
      },
      {
        path: "/university-admin-dashboard/faculties",
        element: <FacultiesList />,
      },
      {
        path: "/faculty-dean-dashboard",
        element: <FacultyDeanDashboard />,
      },
      {
        path: "/faculty-dean-dashboard/departments",
        element: <DepartmentsList currentFaculty={null} />,
      },
      {
        path: "/faculty-dean-dashboard/programs",
        element: <ProgramsList currentFaculty={null} />,
      },
      {
        path: "/university-admin-dashboard/degrees",
        element: <DegreesList />,
      },
      {
        path: "/faculty-dean-dashboard/courses",
        element: <CoursesList currentFaculty={null} />,
      },
      {
        path: "/faculty-dean-dashboard/professors",
        element: <ProfessorsList />,
      },
      {
        path: "/faculty-dean-dashboard/professorCourses",
        element: <ProfessorCourseList />,
      },
    
      { path: "/faculty-dean-dashboard/admissions",
        element: <AdmissionsList />,
      },

       { path: "/student/applications",
        element: <ApplicationsList />,
      },
      
       { path: "/student/applications/apply",
        element: <ApplicationWizard />,
      },
        { path: "/faculty-dean-dashboard/applications",
        element: <ApplicationsReviewList />,
      },
        { path: "/faculty-dean-dashboard/enrollments",
        element: <EnrollmentList />,
      },
         { path: "/faculty-dean-dashboard/students",
        element: <StudentList />,
      },
       {
      path: "/professor-dashboard/grades",
      element: <GradeEntryPage />,
    },
     { path: "/professor-dashboard/courses",
        element: <ProfessorCourses />,
      },
       { path: "/student/grades",
        element: <StudentGradesPage />,
      },
      {
         path:"/university-admin-dashboard/university-profile",
        element:<UniversityProfilePage />
      }
    ],
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
   
  {
  path: "/universities/:universityId",
  element: <UniversityLayout />,
  children: [
    {
      index: true,
      element: <HomePage />,
    },
    {
      path: "/universities/:universityId/faculties",
      element: <FacultiesPage />,
    },
   {
    path: "/universities/:universityId/faculties/:facultyId",
    element: <FacultyDetailsPage />,
  },
    {
      path: "/universities/:universityId/programs",
      element: <ProgramsPage />,
    },
    {
      path: "/universities/:universityId/faculties/:facultyId/programs/:programId",
      element: <ProgramDetailsPage />,
    },
    {
      path: "/universities/:universityId/professors",
      element: <ProfessorsPage />,
    },
    {
      path: "/universities/:universityId/faculties/:facultyId/professors/:professorId",
      element: <ProfessorDetailsPage />,
    },
    {
      path: "/universities/:universityId/admissions",
      element: <AdmissionsPage />,
    },
    {
      path: "/universities/:universityId/contact",
      element: <ContactPage />,
    }
       
  ],
},
]);
