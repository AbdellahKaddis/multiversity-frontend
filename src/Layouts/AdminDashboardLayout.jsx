import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../components/UniversityAdmin/style.module.css";
import {
  FaTachometerAlt,
  FaGraduationCap,
  FaBuilding,
  FaBook,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaCog,
  FaSearch,
  FaBell,
  FaChevronDown,
  FaArrowUp,
  FaArrowDown,
  FaMapMarkerAlt,
  FaScroll,
} from "react-icons/fa";
import { TfiAnnouncement } from "react-icons/tfi";
import { MdAssignmentAdd } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { PiStudentFill } from "react-icons/pi";
import universityApi from "../api/universityApi";
import facultyApi from "../api/facultyApi";
import { Link, Outlet } from "react-router-dom";
import { set } from "../features/university/universitySlice";
import { toast } from "react-toastify";
import { setFaculty } from "../features/faculty/facultySlice";
import professorApi from "../api/professorApi";
import { setProfessor } from "../features/Professor/professorSlice";
import applicantApi from "../api/applicantApi";
import {setApplicant} from "../features/applicant/applicantSlice";
const AdminDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const dispatch = useDispatch();
  // Navigation items
  const navItems = [
    {
      role: "UniversityAdmin",
      navItems: [
        {
          name: "Dashboard",
          icon: <FaTachometerAlt />,
          link: "/university-admin-dashboard",
        },
        {
          name: "Faculties",
          icon: <FaGraduationCap />,
          link: "/university-admin-dashboard/faculties",
        },
        {
          name: "Degrees",
          icon: <FaScroll />,
          link: "university-admin-dashboard/degrees",
        },
        { name: "Settings", icon: <FaCog />, link: "" },
      ],
    },
    {
      role: "Dean",
      navItems: [
        {
          name: "Dashboard",
          icon: <FaTachometerAlt />,
          link: "faculty-dean-dashboard",
        },
        {
          name: "Departments",
          icon: <FaBuilding />,
          link: "faculty-dean-dashboard/departments",
        },
        {
          name: "Programs",
          icon: <FaGraduationCap />,
          link: "faculty-dean-dashboard/programs",
        },
        {
          name: "Courses",
          icon: <FaBook />,
          link: "faculty-dean-dashboard/courses",
        },
        { name: "Professors", icon: <FaChalkboardTeacher />,  link: "faculty-dean-dashboard/professors", },
        { name: "Professor Courses", icon: <FaChalkboardTeacher />,  link: "faculty-dean-dashboard/professorCourses", },
        { name: "Admissions", icon: <FaBook />,  link: "faculty-dean-dashboard/admissions", },
          { name: "Applications", icon: <FaBook />,  link: "faculty-dean-dashboard/applications", },
             { name: "Enrollments", icon: <FaBook />,  link: "faculty-dean-dashboard/enrollments", },
          
        { name: "Students", icon: <FaUserGraduate />,  link: "faculty-dean-dashboard/students",  },

        { name: "Schedule", icon: <FaCalendarAlt /> },
        { name: "Settings", icon: <FaCog /> },
      ],
    },
    {
      role : "Professor",
      navItems : [
       
                 {
          name: "My Courses",
          icon: <FaBook />,
          link: "professor-dashboard/courses",
        },
         
                 {
          name: "Grades",
          icon: <FaTachometerAlt />,// not found
          link: "/professor-dashboard/grades",
        }
      ]
    },
      {
      role : "Applicant",
      navItems : [
         {
          name: "Applications",
          icon: <FaTachometerAlt />,
          link: "/student/applications",
        },]},
        {
      role : "Student",
      navItems : [
         {
          name: "Applications",
          icon: <FaTachometerAlt />,
          link: "/student/applications",
        },]}
  ];
  const getCurrentUserNavItems = () =>
    navItems.find((item) => item.role === auth.user.role);

  const clearNotifications = () => {
    setNotifications(0);
  };

  const auth = useSelector((state) => state.auth);
  const university = useSelector((state) => state.university.university);
  const faculty = useSelector((state) => state.faculty.faculty);
  const getUniversityForAdmin = async () => {
    try {
      const { data, status } = await universityApi.getUniversityByAdminId(
        auth.user.id
      );
      if (status === 200) {
        console.log(data);
        dispatch(set(data));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const getFacultyForDean = async () => {
    try {
      const { data, status } = await facultyApi.getFacultyByDeanId(
        auth.user.id
      );
      if (status === 200) {
        console.log(data);
        dispatch(setFaculty(data));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
    const getProfessor = async () => {
    try {
      const { data, status } = await professorApi.getProfessor(auth.user.id);
      if (status === 200) {
        dispatch(setFaculty(data.faculty));
        dispatch(setProfessor(data))
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const getApplicant = async () => {
    try {
      const { data, status } = await applicantApi.getApplicant(auth.user.id);
      if (status === 200) {
        dispatch(setApplicant(data));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    switch (auth.user.role) {
      case "UniversityAdmin":
        getUniversityForAdmin();
        break;
      case "Dean":
        getFacultyForDean();
        break;
      case "Professor":
        getProfessor();
        break;
      case "Applicant":
        getApplicant();
        break;
      case "Student":
        getApplicant();
        break;
    }
  }, []);
const [activeSection, setActiveSection] = useState('Dashboard')
  return (
    <div className={styles["dashboard-container"]}>
      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${sidebarOpen ? "" : styles.collapsed}`}
      >
        <div className={styles["sidebar-header"]}>
          <div className={styles["university-logo"]}>U</div>
          {sidebarOpen && (
            <h1>
              {university?.name}
              {faculty?.name}
            </h1>
          )}
          <button
            className={styles["toggle-btn"]}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "«" : "»"}
          </button>
        </div>

        <div className={styles["nav-links"]}>
          {getCurrentUserNavItems().navItems.map((item, index) => (
            <Link
              key={index}
              className={`${styles["nav-item"]} ${
                item.name === activeSection ? styles.active : ""
              }`}
              to={`${item.link}`}
              onClick={e => setActiveSection(item.name)}
            >
              <div className={styles["nav-icon"]}>{item.icon}</div>
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`${styles["main-content"]} ${
          sidebarOpen ? "" : styles["sidebar-collapsed"]
        }`}
      >
        {/* Header */}
        <div className={styles["header"]}>
          <div className={styles["header-left"]}>
            <button
              className={styles["mobile-menu-btn"]}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <div className={styles["search-bar"]}>
              <FaSearch className={styles["search-icon"]} />
              <input type="text" placeholder="Search..." />
            </div>
          </div>

          <div className={styles["user-actions"]}>
            <div
              className={styles["notification-btn"]}
              onClick={clearNotifications}
            >
              <FaBell />
              {notifications > 0 && (
                <span className={styles.badge}>{notifications}</span>
              )}
            </div>

            <div className={styles["user-profile"]}>
              <div className={styles["user-avatar"]}>
                {auth.user.name[0].toUpperCase() +
                  auth.user.name.split(" ")[1][0].toUpperCase()}
              </div>
              <div className={styles["user-info"]}>
                <h4>{auth.user.name}</h4>
                <p>{auth.user.role}</p>
              </div>

              <FaChevronDown className={styles["dropdown-icon"]} />
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className={styles["dashboard-content"]}>
          <Outlet />
          {/* Footer  */}
          <div className={styles.footer}>
            <p>© 2025 MutiVersity. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
