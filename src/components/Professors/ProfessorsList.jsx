import React, { useEffect, useState } from "react";
import styles from "../Faculties/FacultiesList.module.css";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import professorApi from "../../api/professorApi";
import { useSelector } from "react-redux";
import AddAndUpdateProfessorModalOpen from "./AddAndUpdateProfessorModalOpen";
import authApi from "../../api/authApi";
import ProfessorCourseList from "../ProfessorCourses/ProfessorCourseList";

const ProfessorsList = () => {
  const [professors, setProfessors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("firstName");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [professorToBeUpdated, setProfessorToBeUpdated] = useState(null);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [loading, setLoading] = useState(true);

  const faculty = useSelector((state) => state.faculty.faculty);

  const getAllProfessors = async (facultyId) => {
    setLoading(true);
    try {
      const { data, status } = await professorApi.getAllProfessors(facultyId);
      if (status === 200) setProfessors(data);
      else toast.error("Something went wrong we could not load professors.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createProfessor = async (data) => {
    data.facultyId = faculty.id;
    try {
      const { status } = await professorApi.createProfessor(data);
      if (status === 201) {
        const { status: emailStatus } = await authApi.forgotPassword(data.email);
        if (emailStatus === 200)
          toast.success("Professor created successfully. Password setup email sent.");
        else
          toast.warn("Professor created, but the password setup email could not be sent.");
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateProfessor = async (data) => {
    data.professorId = professorToBeUpdated.id;
    data.facultyId = faculty.id;
    try {
      const { data: responseData, status } = await professorApi.updateProfessor(data);
      if (status === 204) {
        toast.success("Professor updated successfully!");
        setProfessorToBeUpdated(null);
      } else {
        toast.error(responseData?.message ?? "Something went wrong.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredProfessors = professors.filter(
    (professor) =>
      professor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.departmentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProfessors = [...filteredProfessors].sort((a, b) => {
    switch (sortBy) {
      case "lastName":
        return (a.lastName ?? "").localeCompare(b.lastName ?? "");
      case "department":
        return (a.departmentName ?? "").localeCompare(b.departmentName ?? "");
      default:
        return (a.firstName ?? "").localeCompare(b.firstName ?? "");
    }
  });

  const handleEdit = (professor, e) => {
    e.stopPropagation();
    setProfessorToBeUpdated(professor);
    setIsModalOpen(true);
  };

  const handleDelete = (professor, e) => {
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
          const { data, status } = await professorApi.deleteProfessor(professor.id);
          if (status === 204) {
            toast.success("Professor has been deleted successfully!");
            await getAllProfessors(faculty.id);
          } else {
            toast.error(data?.message ?? "Something went wrong.");
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    });
  };

  const save = async (submissionData) => {
    if (professorToBeUpdated === null) await createProfessor(submissionData);
    else await updateProfessor(submissionData);

    await getAllProfessors(faculty.id);
  };

  useEffect(() => {
    if (faculty?.id) {
      getAllProfessors(faculty.id);
    } else {
      setLoading(false);
    }
  }, [faculty?.id]);

  if (selectedProfessor) {
    return (
      <ProfessorCourseList
        professor={selectedProfessor}
        onBack={() => setSelectedProfessor(null)}
      />
    );
  }

  return (
    <>
      {isModalOpen && (
        <AddAndUpdateProfessorModalOpen
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setProfessorToBeUpdated(null);
          }}
          professorToBeUpdated={professorToBeUpdated}
          onSave={save}
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h1 className={styles.pageTitle}>Professors</h1>
          <button
            className={styles.primaryButton}
            onClick={() => setIsModalOpen(true)}
          >
            ➕ Add Professor
          </button>
        </div>

        <div className={styles.headerControls}>
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search professors by first name, last name, department"
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
              <option value="firstName">Sort by First Name</option>
              <option value="lastName">Sort by Last Name</option>
              <option value="department">Sort by Department</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Loading professors…</p>
          </div>
        ) : sortedProfessors.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏛️</div>
            <h3>No professors found</h3>
            <p>Try adjusting your search or add a new professor.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th>Cin</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Grade</th>
                <th>Department</th>
                <th>Head</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProfessors.map((professor) => (
                <tr
                  key={professor.id}
                  className={styles.tableRow}
                  onClick={() => setSelectedProfessor(professor)}
                >
                  <td className={professor.cin ? styles.codeCell : ""}>
                    <span className={professor.cin ? styles.facultyCode : ""}>
                      {professor.cin || "Not set"}
                    </span>
                  </td>

                  <td className={styles.nameCell}>
                    <div className={styles.facultyName}>{professor.firstName}</div>
                  </td>

                  <td className={styles.nameCell}>
                    <div className={styles.facultyName}>{professor.lastName}</div>
                  </td>

                  <td>{professor.grade ?? "—"}</td>

                  <td className={styles.nameCell}>
                    <div className={styles.facultyName}>
                      {professor.departmentName ?? "—"}
                    </div>
                  </td>

                  <td>{professor.isDepartmentHead ? "Yes" : "No"}</td>

                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.editButton}
                        onClick={(e) => handleEdit(professor, e)}
                        title="Edit Professor"
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={(e) => handleDelete(professor, e)}
                        title="Delete Professor"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ProfessorsList;