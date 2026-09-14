import React, { useEffect, useState } from "react";
import styles from "./FacultiesList.module.css";
import FacultyDetail from "./FacultyDetail";
import { useSelector } from "react-redux";
import facultyApi from "../../api/facultyApi";
import AddFacultyModal from "./AddFacultyModal";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import CreateFacultyDeanModal from "./CreateFacultyDeanModal";
import authApi from "../../api/authApi";

const FacultiesList = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isAddFacultyModelOpen, setIsAddFacultyModalOpen] = useState(false);
  const [isCreateFacultyDeanModalOpen, setIsCreateFacultyDeanModalOpen] =
    useState(false);
  const university = useSelector((state) => state.university.university);
  const getFaculties = async (universityId) => {
    try{
      const { data, status } = await facultyApi.getFaculties(universityId);
    if (status === 200) {
      setFaculties(data);
    } else {
      toast.error("Something went wrong we could not load faculties.");
    }
    }catch(error){
      toast.error(error.message)
    }
  };
  const [faculties, setFaculties] = useState([]);
  // Mock data - in real app, this would come from API
  // const faculties = [
  //   {
  //     id: 1,
  //     code: 'ENG',
  //     name: 'Faculty of Engineering',
  //     university: 'University of Technology',
  //     dean: 'Dr. Sarah Johnson',
  //     city: 'New York',
  //     departments: 8,
  //     programs: 12,
  //     students: 2500,
  //     established: 1985,
  //     email: 'engineering@unitech.edu',
  //     phone: '+1 (555) 123-4567',
  //     logo: '🏛️'
  //   },
  //   {
  //     id: 2,
  //     code: 'MED',
  //     name: 'Faculty of Medicine',
  //     university: 'University of Health Sciences',
  //     dean: 'Dr. Michael Chen',
  //     city: 'Boston',
  //     departments: 6,
  //     programs: 8,
  //     students: 1800,
  //     established: 1972,
  //     email: 'medicine@uhs.edu',
  //     phone: '+1 (555) 987-6543',
  //     logo: '⚕️'
  //   },
  //   {
  //     id: 3,
  //     code: 'BUS',
  //     name: 'Faculty of Business',
  //     university: 'University of Technology',
  //     dean: 'Prof. Emma Wilson',
  //     city: 'New York',
  //     departments: 5,
  //     programs: 10,
  //     students: 3200,
  //     established: 1990,
  //     email: 'business@unitech.edu',
  //     phone: '+1 (555) 456-7890',
  //     logo: '💼'
  //   }
  // ];
  const [facultyToBeUpdated, setFacultyToBeUpdated] = useState(null);
  useEffect(() => {
    getFaculties(university.id);
  }, []);
  const filteredFaculties = faculties.filter(
    (faculty) =>
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedFaculties = [...filteredFaculties].sort((a, b) => {
    switch (sortBy) {
      case "city":
        return a.city.localeCompare(b.city);
      case "established":
        return a.established - b.established;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleEdit = (faculty, e) => {
    e.stopPropagation();
    setFacultyToBeUpdated(faculty);
    setIsAddFacultyModalOpen(true);
  };

  const handleAssignDean = (faculty, e) => {
    e.stopPropagation();
    setFacultyToBeUpdated(faculty);
    setIsCreateFacultyDeanModalOpen(true);
  };
  const handleDeactivateDean = (faculty, e) => {
    e.stopPropagation();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, deactivate it!",
    }).then(async (result) => {
      if (result.isConfirmed) {


        try {
    const { data, status } =
        await facultyApi.endDeanAssignment(faculty.id);

    if (status === 204) {
        toast.success("Dean assignment ended successfully.");
        await getFaculties(university.id);
    }else
      toast.error(data.message)
} catch (error) {
    toast.error(error.message);
}
      }
    });
  };

  const handleDelete = (faculty, e) => {
    e.stopPropagation();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { status } = await facultyApi.deleteFaculty(
            faculty.universityId,
            faculty.id
          );
          if (status === 204) {
            toast.success("Faculty has been deleted successfully!");
            await getFaculties(university.id);
          }
          else
            toast.error("Something went wrong.");
        } catch (error) {
          toast.error(error.message);
        }
      }
    });
  };

  if (selectedFaculty) {
    return (
      <FacultyDetail
        faculty={selectedFaculty}
        onBack={() => setSelectedFaculty(null)}
      />
    );
  }
  const save = async (submissionData) => {
    submissionData.universityId = university.id;

    try {
      if (facultyToBeUpdated == null) {
        //creation mode
        const { status } = await facultyApi.createFaculty(submissionData);
        if (status === 201) {
          toast.success("Faculty created successfully!");
        }
      } else {
        //update mode
        submissionData.facultyId = facultyToBeUpdated.id;
        const status = await facultyApi.updateFaculty(submissionData);

        if (status === 204) {
          setFacultyToBeUpdated(null);
          toast.success("Faculty updated successfully!");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
    await getFaculties(university.id);
  };

  const createAndAssignDeanToFaculty = async (submissionData) => {
    try {
      const { data, status } = await facultyApi.createAndAssignDean(facultyToBeUpdated.id, submissionData);

if (status === 201) {
    const { status: emailStatus } = await authApi.forgotPassword(submissionData.email);

    if (emailStatus === 200) {
        toast.success(`Dean created and assigned to ${facultyToBeUpdated.name}. An email was sent with instructions to set up their password.`);
    } else {
        toast.warn("Dean created and assigned successfully, but the password setup email could not be sent."
        );
    }
    await getFaculties(university.id);
}
else
  toast.error(data.message)

    } catch (error) {
      toast.error(error.message);
    }
   finally {
        setFacultyToBeUpdated(null);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {isAddFacultyModelOpen && (
        <AddFacultyModal
          isOpen={isAddFacultyModelOpen}
          onClose={() => {
            setIsAddFacultyModalOpen(false);
            setFacultyToBeUpdated(null);
          }}
          onSave={save}
          facultyToBeUpdated={facultyToBeUpdated}
        />
      )}
      {isCreateFacultyDeanModalOpen && (
        <CreateFacultyDeanModal
          isOpen={isCreateFacultyDeanModalOpen}
          onClose={() => setIsCreateFacultyDeanModalOpen(false)}
          onSave={createAndAssignDeanToFaculty}
        />
      )}
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h1 className={styles.pageTitle}>Faculties</h1>
          <button
            className={styles.primaryButton}
            onClick={() => setIsAddFacultyModalOpen(true)}
          >
            ➕ Add Faculty
          </button>
        </div>

        <div className={styles.headerControls}>
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search faculties by name, code, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterDropdown}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="name">Sort by Name</option>
              <option value="city">Sort by City</option>
              <option value="established">Sort by Established Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Faculties Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Faculty Code</th>
              <th>Faculty Name</th>
              <th>Type</th>
              <th>City</th>
              <th>Dean</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedFaculties.map((faculty) => (
              <tr
                key={faculty.id}
                className={styles.tableRow}
                onClick={() => setSelectedFaculty(faculty)}
              >
                <td className={styles.codeCell}>
                  <span className={styles.facultyCode}>{faculty.code}</span>
                </td>
                <td className={styles.nameCell}>
                  <div className={styles.facultyName}>
                    <span className={styles.facultyLogo}>{faculty.logo}</span>
                    {faculty.name}
                  </div>
                </td>
                <td>{faculty.type}</td>
                <td>{faculty.city}</td>
                <td className={!faculty.deanName ? styles.notAssigned : ""}>
                  {faculty.deanName === null
                    ? "Not assigned"
                    : faculty.deanName}
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.editButton}
                      onClick={(e) => handleEdit(faculty, e)}
                      title="Edit Faculty"
                    >
                      ✏️
                    </button>
                    {faculty.deanName === null && <button
                      className={styles.assignButton}
                      onClick={(e) => handleAssignDean(faculty, e)}
                      title="Assign Dean"
                    >
                      👤
                    </button>}
                    {faculty.deanName !== null && <button
                      className={styles.assignButton}
                      onClick={(e) => handleDeactivateDean(faculty, e)}
                      title="Deactivate Dean"
                    >
                    🚫
                    </button>}
                                        
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => handleDelete(faculty, e)}
                      title="Delete Faculty"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedFaculties.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏛️</div>
            <h3>No faculties found</h3>
            <p>Try adjusting your search or add a new faculty.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default FacultiesList;
