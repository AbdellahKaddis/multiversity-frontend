import React, { useEffect, useState } from "react";
import styles from "../Faculties/FacultiesList.module.css";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import academicProgramApi from "../../api/academicProgramApi";
import AddAndUpdateProgramModal from "./AddAndUpdateProgramModal";
import ProgramCourses from "../ProgramCourses/ProgramCourses";
const ProgramsList = ({ currentFaculty }) => {
  const [programs, setPrograms] = useState([]);
  const faculty =
    currentFaculty || useSelector((state) => state.faculty.faculty);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isAddAndUpdateProgramModalOpen, setIsAddAndUpdateProgramModalOpen] =
    useState(false);
  const [programToBeUpdated, setProgramToBeUpdated] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const getPrograms = async (facultyId = null, departmentId = null,universityId=null) => {
    try {
      const { data, status } = await academicProgramApi.getAcademicPrograms(
        facultyId,
        departmentId,
        universityId
      );
      if (status === 200) setPrograms(data);
      else toast.error("Something went wrong we could not load programs.");
    } catch (error) {
      toast.error(error.message);
    }
  };
  const createProgram = async (data) => {
    try {
      const { status } = await academicProgramApi.createAcademicProgram(data);
      if (status === 201) toast.success("Program created successfully!");
      else toast.error("Something went wrong!");
    } catch (error) {
      toast.error(error.message);
    }
  };
  const updateProgram = async (data) => {
    data.programId = programToBeUpdated.id;
    try {
      const { status } = await academicProgramApi.updateAcademicProgram(data);
      if (status === 204) {
        toast.success("Program updated successfully!");
        setProgramToBeUpdated(null);
      } else toast.error("Something went wrong!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredPrograms = programs.filter(
    (program) =>
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.degreeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPrograms = [...filteredPrograms].sort((a, b) => {
    switch (sortBy) {
      case "code":
        return a.code.localeCompare(b.code);
      case "degreeName":
        return a.degreeName.localeCompare(b.degreeName);
      case "departmentName":
        return a.departmentName.localeCompare(b.departmentName);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleEdit = (program, e) => {
    e.stopPropagation();
    setProgramToBeUpdated(program);
    setIsAddAndUpdateProgramModalOpen(true);
  };

  const handleDelete = (program, e) => {
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
          const { status } = await academicProgramApi.deleteAcademicProgram(
            program.id
          );
          if (status === 204) {
            toast.success("Program has been deleted successfully!");
            await getPrograms(faculty.id);
          } else {
            toast.error("Something went wrong!");
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    });
  };
  const save = async (submissionData) => {
    if (programToBeUpdated === null) await createProgram(submissionData);
    else await updateProgram(submissionData);

    await getPrograms(faculty.id);
  };
  useEffect(() => {
    getPrograms(faculty.id);
  }, []);
  const formatDescription = (description) => {
    if (description.length > 25) return description.slice(0, 25) + "...";
    else return description;
  };
  if (selectedProgram) {
    return (
      <ProgramCourses
        program={selectedProgram}
        onBack={() => setSelectedProgram(null)}
      />
    );
  }
  return (
    <>
      {isAddAndUpdateProgramModalOpen && (
        <AddAndUpdateProgramModal
          isOpen={isAddAndUpdateProgramModalOpen}
          onClose={() => {
            setIsAddAndUpdateProgramModalOpen(false);
            setProgramToBeUpdated(null);
          }}
          programToBeUpdated={programToBeUpdated}
          faculty={faculty}
          onSave={save}
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h1 className={styles.pageTitle}>Programs</h1>
          <button
            className={styles.primaryButton}
            onClick={() => setIsAddAndUpdateProgramModalOpen(true)}
          >
            ➕ Add Program
          </button>
        </div>

        <div className={styles.headerControls}>
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search programs by name, code, degree, department"
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
              <option value="code">Sort by Code</option>
              <option value="degreeName">Sort by Degree</option>
              <option value="departmentName">Sort by Department</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Program Name</th>
              <th>Code</th>
              <th>Degree</th>
              <th>Department </th>
              <th>Duration (Years) </th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPrograms.map((program) => (
              <tr
                key={program.id}
                className={styles.tableRow}
                onClick={() => setSelectedProgram(program)}
              >
                <td className={styles.nameCell}>
                  <div className={styles.facultyName}>{program.name}</div>
                </td>
                <td className={styles.codeCell}>
                  <span className={styles.facultyCode}>{program.code}</span>
                </td>
                <td>{program.degreeName}</td>
                <td>{program.departmentName}</td>
                <td>{program.durationInYears}</td>
                <td className={!program.description ? styles.notAssigned : ""}>
                  {program.description === null
                    ? "No description"
                    : formatDescription(program.description)}
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.editButton}
                      onClick={(e) => handleEdit(program, e)}
                      title="Edit Program"
                    >
                      ✏️
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => handleDelete(program, e)}
                      title="Delete Program"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedPrograms.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏛️</div>
            <h3>No programs found</h3>
            <p>Try adjusting your search or add a new program.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProgramsList;
