import { createBrowserRouter } from "react-router-dom";
import SignUp from "../components/auth/SignUp";
import Home from "../components/Home/Home";
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
import ProfessorDashboard from "../components/Professors/ProfessorDashboard";
import ProfessorCourseList from "../components/ProfessorCourses/ProfessorCourseList";
import Universityentrypoint from "../Universityentrypoint";
import { FacultyDetailsPage } from "../pages/FacultyDetailsPage";
import { HomePage } from "../pages/HomePage";
import { FacultiesPage } from "../pages/FacultiesPage";
import { SearchPage } from "../pages/SearchPage";
import { ContactPage } from "../pages/ContactPage";

import { AdmissionsPage } from "../pages/AdmissionsPage";
import { ProfessorDetailsPage } from "../pages/ProfessorDetailsPage";
import { ProfessorsPage } from "../pages/ProfessorsPage";
import { CourseDetailsPage } from "../pages/CourseDetailsPage";
import { ProgramDetailsPage } from "../pages/ProgramDetailsPage";
import { ProgramsPage } from "../pages/ProgramsPage";
import AdmissionsList from "../components/Admissions/AdmissionsList";
import ApplicationWizard from "../components/ApplicationWizard/ApplicationWizard";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
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
      {
        path: "/professor-dashboard",
        element: <ProfessorDashboard />,
      },
      { path: "/faculty-dean-dashboard/admissions",
        element: <AdmissionsList />,
      },
       { path: "/faculty-dean-dashboard/applications",
        element: <ApplicationWizard />,
      },
    ],
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
   
  {
  path: "/universities/:universityId",
  element: <Universityentrypoint />,
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
    },
    {
      path: "/universities/:universityId/search",
      element: <SearchPage />,
    },
  ],
},
]);
