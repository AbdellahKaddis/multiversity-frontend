import {createBrowserRouter} from "react-router-dom";
import SignUp from "../components/auth/SignUp";
import Home from "../components/Home/Home";
import Login from "../components/auth/Login";
import UniversityAdminDashboard from "../components/UniversityAdmin/UniversityAdminDashboard";
import ResetPassword from "../components/auth/ResetPassword";
import AdminDashboardLayout from "../Layouts/AdminDashboardLayout";
import FacultyDeanDashboard from "../components/FacultyDean/FacultyDeanDashboard";
import FacultiesList from "../components/Faculties/FacultiesList";
export const router = createBrowserRouter([
    {
        path:'/',
        element:<Home/>
    },
    {
        path:'/signup',
        element:<SignUp/>
    },
    {
        path:'/login',
        element:<Login/>
    },
    {
        element: <AdminDashboardLayout/>,
        children:[
            {
                path:'/university-admin-dashboard',
                element:<UniversityAdminDashboard/>
            },
            {
                path:'/university-admin-dashboard/faculties',
                element:<FacultiesList/>
            },
            {
                path:'/faculty-dean-dashboard',
                element:<FacultyDeanDashboard/>
            }
        ]
        
    },
    {
        path:'/reset-password',
        element:<ResetPassword/>
    }
]);
