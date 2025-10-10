import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../components/UniversityAdmin/style.module.css';
import { FaTachometerAlt, FaGraduationCap, FaBuilding, FaBook, FaUserGraduate, FaChalkboardTeacher, FaCalendarAlt, FaCog, FaSearch, FaBell, FaChevronDown, FaArrowUp, FaArrowDown, FaMapMarkerAlt } from 'react-icons/fa';
import universityApi from '../api/universityApi';
import { Link, Outlet } from 'react-router-dom';
import { set } from '../features/university/universitySlice';
const AdminDashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notifications, setNotifications] = useState(3);
    const dispatch = useDispatch();
  // Navigation items
    const navItems = [{
        role:"UniversityAdmin",
        navItems:[
            { name: "Dashboard", icon: <FaTachometerAlt />, link: "/university-admin-dashboard" },
            { name: "Faculties", icon: <FaGraduationCap />, link: "/university-admin-dashboard/faculties" },
            { name: "Settings", icon: <FaCog />, link: ""}
            ]
        },
        {
        role:"Dean",
        navItems:[
            { name: "Dashboard", icon: <FaTachometerAlt /> },
            { name: "Departments", icon: <FaBuilding /> },
            { name: "Courses", icon: <FaBook /> },
            { name: "Students", icon: <FaUserGraduate /> },
            { name: "Professors", icon: <FaChalkboardTeacher /> },
            { name: "Schedule", icon: <FaCalendarAlt /> },
            { name: "Settings", icon: <FaCog /> }           
            ]
        }
    ];
    const getCurrentUserNavItems = ()=> navItems.find(item => item.role === auth.user.role);
    
    const clearNotifications = () => {
    setNotifications(0);
};

    const [university,setUniversity] = useState(null);
    const auth = useSelector(state => state.auth);

    useEffect(()=>{
        const getUniversityForAdmin = async()=>{
          // if it's not an admin get faculty not a university
            const {data, status} = await universityApi.getUniversityByAdminId(auth.user.id);
            if(status === 200)
            {
                console.log(data);
                setUniversity(data);
                dispatch(set(data));
            }
        }
    getUniversityForAdmin();
},[]);

    return (
    <div className={styles["dashboard-container"]}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${sidebarOpen ? '' : styles.collapsed}`}>
        <div className={styles["sidebar-header"]}>
          <div className={styles["university-logo"]}>U</div>
          {sidebarOpen && <h1>{university?.name}</h1>}
          <button className={styles["toggle-btn"]} onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '«' : '»'}
          </button>
        </div>
        
        <div className={styles["nav-links"]}>
          {getCurrentUserNavItems().navItems.map((item, index) => (
            <Link 
              key={index}
              className={`${styles["nav-item"]} ${index === 0 ? styles.active : ''}`}
              to={`${item.link}`}
            >
              <div className={styles["nav-icon"]}>{item.icon}</div>
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`${styles["main-content"]} ${sidebarOpen ? '' : styles["sidebar-collapsed"]}`}>
        {/* Header */}
        <div className={styles["header"]}>
          <div className={styles["header-left"]}>
            <button className={styles["mobile-menu-btn"]} onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            <div className={styles["search-bar"]}>
              <FaSearch className={styles["search-icon"]} />
              <input type="text" placeholder="Search..." />
            </div>
          </div>
          
          <div className={styles["user-actions"]}>
            <div className={styles["notification-btn"]} onClick={clearNotifications}>
              <FaBell />
              {notifications > 0 && <span className={styles.badge}>{notifications}</span>}
            </div>
            
            <div className={styles["user-profile"]}>
              <div className={styles["user-avatar"]}>{auth.user.name[0].toUpperCase()+auth.user.name.split(" ")[1][0].toUpperCase()}</div>
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
        <Outlet/>
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