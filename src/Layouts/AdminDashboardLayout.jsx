import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../components/UniversityAdmin/style.module.css";
import {
  FaTachometerAlt,
  FaGraduationCap,
  FaBuilding,
  FaBook,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaCog,
  FaBell,
  FaChevronDown,
  FaScroll,
  FaUniversity,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";

import universityApi from "../api/universityApi";
import facultyApi from "../api/facultyApi";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { set } from "../features/university/universitySlice";
import { toast } from "react-toastify";
import { setFaculty } from "../features/faculty/facultySlice";
import professorApi from "../api/professorApi";
import { setProfessor } from "../features/Professor/professorSlice";
import applicantApi from "../api/applicantApi";
import { setApplicant } from "../features/applicant/applicantSlice";
import { apiUrl } from "../utils/apiUrl";
import { logout } from "../features/auth/authSlice";

const AdminDashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);
  const university = useSelector((state) => state.university.university);
  const faculty = useSelector((state) => state.faculty.faculty);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [contextLoading, setContextLoading] = useState(true);

  const dropdownRef = useRef(null);

  // ── Click outside + Escape to close dropdown ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // ── Fetch context (university / faculty / professor / applicant) by role ──
  const loadUserContext = async (user) => {
    try {
      switch (user.role) {
        case "UniversityAdmin": {
          const { data, status } = await universityApi.getUniversityByAdminId(user.id);
          if (status === 200) dispatch(set(data));
          break;
        }
        case "Dean": {
          const { data, status } = await facultyApi.getFacultyByDeanId(user.id);
          if (status === 200) dispatch(setFaculty(data));
          break;
        }
        case "Professor": {
          const { data, status } = await professorApi.getProfessor(user.id);
          if (status === 200) {
            dispatch(setFaculty(data.faculty));
            dispatch(setProfessor(data));
          }
          break;
        }
        case "Applicant":
        case "Student": {
          const { data, status } = await applicantApi.getApplicant(user.id);
          if (status === 200) dispatch(setApplicant(data));
          break;
        }
        default:
          break;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!auth.user?.role) {
      setContextLoading(false);
      return;
    }
    const load = async () => {
      setContextLoading(true);
      try {
        await loadUserContext(auth.user);
      } finally {
        setContextLoading(false);
      }
    };
    load();
  }, [auth.user?.role]);

  const handleLogout = () => {
    dispatch(logout());
    const path = window.location.pathname;
    navigate(path.startsWith("/student") ? "/login/student" : "/login");
  };

  const clearNotifications = () => setNotifications(0);

  // ── Nav items by role ──
  const navItems = [
    {
      role: "UniversityAdmin",
      navItems: [
        { name: "Dashboard", icon: <FaTachometerAlt />, link: "/university-admin-dashboard" },
        { name: "Faculties", icon: <FaGraduationCap />, link: "/university-admin-dashboard/faculties" },
        { name: "Degrees", icon: <FaScroll />, link: "/university-admin-dashboard/degrees" },
        { name: "University Profile", icon: <FaUniversity />, link: "/university-admin-dashboard/university-profile" },
      ],
    },
    {
      role: "Dean",
      navItems: [
        { name: "Dashboard", icon: <FaTachometerAlt />, link: "/faculty-dean-dashboard" },
        { name: "Departments", icon: <FaBuilding />, link: "/faculty-dean-dashboard/departments" },
        { name: "Programs", icon: <FaGraduationCap />, link: "/faculty-dean-dashboard/programs" },
        { name: "Courses", icon: <FaBook />, link: "/faculty-dean-dashboard/courses" },
        { name: "Professors", icon: <FaChalkboardTeacher />, link: "/faculty-dean-dashboard/professors" },
        { name: "Professor Courses", icon: <FaChalkboardTeacher />, link: "/faculty-dean-dashboard/professorCourses" },
        { name: "Admissions", icon: <FaBook />, link: "/faculty-dean-dashboard/admissions" },
        { name: "Applications", icon: <FaBook />, link: "/faculty-dean-dashboard/applications" },
        { name: "Enrollments", icon: <FaBook />, link: "/faculty-dean-dashboard/enrollments" },
        { name: "Students", icon: <FaUserGraduate />, link: "/faculty-dean-dashboard/students" },
      ],
    },
    {
      role: "Professor",
      navItems: [
        { name: "My Courses", icon: <FaBook />, link: "/professor-dashboard/courses" },
        { name: "Grades", icon: <FaTachometerAlt />, link: "/professor-dashboard/grades" },
      ],
    },
    {
      role: "Applicant",
      navItems: [
        { name: "Applications", icon: <FaTachometerAlt />, link: "/student/applications" },
      ],
    },
    {
      role: "Student",
      navItems: [
        { name: "Applications", icon: <FaTachometerAlt />, link: "/student/applications" },
        { name: "Grades", icon: <FaTachometerAlt />, link: "/student/grades" },
      ],
    },
  ];

  const currentNavItems = navItems.find((n) => n.role === auth.user?.role)?.navItems ?? [];

  const initials = (() => {
    const name = auth.user?.name ?? "";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const second = parts[1]?.[0] ?? "";
    return (first + second).toUpperCase() || "?";
  })();

  // ── Loading gate — no dashboard until we know who the user is ──
  if (!auth.user) {
    return (
      <div className={styles["dashboard-container"]}>
        <div className={styles["main-content"]}>
          <div className={styles["dashboard-content"]}>
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div className={styles.spinner} />
              <p>Loading dashboard…</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["dashboard-container"]}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${sidebarOpen ? "" : styles.collapsed}`}>
        <div className={styles["sidebar-header"]}>
          <div className={styles["university-logo"]}>
            {university?.logoUrl ? (
              <img src={apiUrl(university.logoUrl)} alt="University Logo" />
            ) : (
              <div className={styles.photoPlaceholder}>📷</div>
            )}
          </div>
          {sidebarOpen && (
            <h1>{university?.name ?? faculty?.name ?? ""}</h1>
          )}
          <button
            className={styles["toggle-btn"]}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "«" : "»"}
          </button>
        </div>

        <div className={styles["nav-links"]}>
          {currentNavItems.map((item, index) => (
            <Link
              key={index}
              className={`${styles["nav-item"]} ${
                item.name === activeSection ? styles.active : ""
              }`}
              to={item.link}
              onClick={() => setActiveSection(item.name)}
            >
              <div className={styles["nav-icon"]}>{item.icon}</div>
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={`${styles["main-content"]} ${sidebarOpen ? "" : styles["sidebar-collapsed"]}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles["header-left"]}>
            <button
              className={styles["mobile-menu-btn"]}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
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

            <div
              className={styles["user-profile"]}
              ref={dropdownRef}
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <div className={styles["user-avatar"]}>{initials}</div>

              <div className={styles["user-info"]}>
                <h4>{auth.user.name}</h4>
                <p>{auth.user.role}</p>
              </div>

              <FaChevronDown
                className={`${styles["dropdown-icon"]} ${
                  dropdownOpen ? styles["dropdown-icon-open"] : ""
                }`}
              />

              {dropdownOpen && (
                <div className={styles["user-dropdown"]}>
                  <div className={styles["dropdown-header"]}>
                    <span className={styles["dropdown-name"]}>{auth.user.name}</span>
                    <span className={styles["dropdown-role"]}>{auth.user.role}</span>
                  </div>

                  <div className={styles["dropdown-divider"]} />

                  <button
                    className={styles["dropdown-item"]}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(false);
                    }}
                  >
                    <FaUser className={styles["dropdown-item-icon"]} />
                    My Profile
                  </button>

                  <button
                    className={`${styles["dropdown-item"]} ${styles["dropdown-item-danger"]}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    <FaSignOutAlt className={styles["dropdown-item-icon"]} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className={styles["dashboard-content"]}>
          {contextLoading ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div className={styles.spinner} />
              <p>Loading…</p>
            </div>
          ) : (
            <Outlet />
          )}

          <div className={styles.footer}>
            <p>© 2025 MutiVersity. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;