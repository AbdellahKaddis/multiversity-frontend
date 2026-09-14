import React, { useState } from 'react';
import styles from './style.module.css';
import { FaTachometerAlt, FaGraduationCap, FaBuilding, FaBook, FaUserGraduate, FaChalkboardTeacher, FaCalendarAlt, FaCog, FaSearch, FaBell, FaChevronDown, FaArrowUp, FaArrowDown, FaMapMarkerAlt } from 'react-icons/fa';

const UniversityAdminDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(20);
  
  // Stats data
  const stats = [
    { title: "Total Students", value: "12,345", icon: <FaUserGraduate />, change: 5.2, positive: true },
    { title: "Faculty Members", value: "245", icon: <FaChalkboardTeacher />, change: 2.1, positive: true },
    { title: "Active Courses", value: "89", icon: <FaBook />, change: 1.3, positive: false },
    { title: "Upcoming Events", value: "12", icon: <FaCalendarAlt />, change: 3.7, positive: true }
  ];
  
  // Recent activities
  const activities = [
    { 
      user: { name: "Michael Johnson", initials: "MJ" },
      activity: "Updated course syllabus",
      details: "CSC101 - Introduction to Programming",
      time: "10 min ago",
      status: "Completed"
    },
    { 
      user: { name: "Sarah Davis", initials: "SD" },
      activity: "Added new student",
      details: "Computer Science Department",
      time: "25 min ago",
      status: "Completed"
    },
    { 
      user: { name: "Robert Parker", initials: "RP" },
      activity: "Scheduled new lecture",
      details: "PHY201 - Advanced Physics",
      time: "1 hour ago",
      status: "Pending"
    },
    { 
      user: { name: "Emma Smith", initials: "ES" },
      activity: "Submitted grades",
      details: "MAT301 - Linear Algebra",
      time: "2 hours ago",
      status: "In Review"
    },
    { 
      user: { name: "Thomas Wilson", initials: "TW" },
      activity: "Created new course",
      details: "ENG401 - Advanced Engineering",
      time: "3 hours ago",
      status: "Completed"
    }
  ];
  
  // Calendar data
  const days = [
    ['Mon', 26], ['Tue', 27], ['Wed', 28], ['Thu', 29], ['Fri', 30], ['Sat', 1], ['Sun', 2],
    [3], [4], [5], [6], [7], [8], [9],
    [10], [11], [12], [13, true], [14, true], [15], [16],
    [17], [18], [19], [20, true], [21, true], [22], [23],
    [24], [25], [26], [27], [28], [29], [30]
  ];
  
  const events = [
    { time: "10:00 AM - 11:30 AM", title: "Faculty Meeting", location: "Administration Building, Room 305" },
    { time: "2:00 PM - 4:00 PM", title: "Curriculum Review Session", location: "Library Conference Room" },
    { time: "4:30 PM - 6:00 PM", title: "Student Orientation", location: "Main Auditorium" }
  ];
  
  const getStatusClass = (status) => {
    switch(status) {
      case "Completed": return "success";
      case "Pending": return "warning";
      case "In Review": return "info";
      default: return "";
    }
  };

  return (
          <>
          <h1 className={styles["dashboard-title"]}>Dashboard Overview</h1>
          
          {/* Stats Cards */}
          <div className={styles["stats-grid"]}>
            {stats.map((stat, index) => (
              <div className={styles["stat-card"]} key={index}>
                <div className={styles["stat-header"]}>
                  <div className={styles["stat-title"]}>{stat.title}</div>
                  <div className={styles["stat-icon"]}>
                    {stat.icon}
                  </div>
                </div>
                <div className={styles["stat-value"]}>{stat.value}</div>
                <div className={`${styles["stat-change"]} ${stat.positive ? '' : styles.negative}`}>
                  {stat.positive ? <FaArrowUp /> : <FaArrowDown />}
                  <span>{stat.change}% from last month</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Main Content Grid */}
          <div className={styles["content-grid"]}>
            {/* Left Column - Recent Activities */}
            <div className={styles["main-content-col"]}>
              <div className={styles.card}>
                <div className={styles["card-header"]}>
                  <div className={styles["card-title"]}>Recent Activities</div>
                  <div className={styles["view-all"]}>View All</div>
                </div>
                
                <div className={styles["activity-table"]}>
                  <table>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Activity</th>
                        <th>Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((activity, index) => (
                        <tr key={index}>
                          <td>
                            <div className={styles["activity-user"]}>
                              <div className={styles["user-avatar-sm"]}>{activity.user.initials}</div>
                              <div>{activity.user.name}</div>
                            </div>
                          </td>
                          <td>
                            <div className={styles["activity-detail"]}>{activity.activity}</div>
                            <div className={styles["activity-time"]}>{activity.details}</div>
                          </td>
                          <td>{activity.time}</td>
                          <td>
                            <div className={`${styles["status-badge"]} ${getStatusClass(activity.status)}`}>
                              {activity.status}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Right Column - Calendar */}
            <div className={styles["sidebar-col"]}>
              <div className={styles.card}>
                <div className={styles["card-header"]}>
                  <div className={styles["card-title"]}>Academic Calendar</div>
                  <div className={styles["view-all"]}>View All</div>
                </div>
                
                <div className={styles.calendar}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className={styles["calendar-header"]}>{day}</div>
                  ))}
                  
                  {days.map((day, index) => {
                    const isEvent = Array.isArray(day) && day.length > 1 && day[1];
                    const dayValue = Array.isArray(day) ? day[0] : day;
                    
                    return (
                      <div 
                        key={index}
                        className={`${styles["calendar-day"]} ${selectedDate === dayValue ? 'active' : ''} ${isEvent ? 'event' : ''}`}
                        onClick={() => setSelectedDate(dayValue)}
                      >
                        {dayValue}
                      </div>
                    );
                  })}
                </div>
                
                <div className={styles["calendar-events"]}>
                  {events.map((event, index) => (
                    <div key={index} className={styles["event-item"]}>
                      <div className={styles["event-time"]}>{event.time}</div>
                      <div className={styles["event-title"]}>{event.title}</div>
                      <div className={styles["event-location"]}>
                        <FaMapMarkerAlt /> {event.location}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
  );
};

export default UniversityAdminDashboard;