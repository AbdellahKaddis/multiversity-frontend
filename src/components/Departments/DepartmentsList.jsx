import React, { useEffect, useState } from "react";
import styles from "../Faculties/FacultiesList.module.css";
import departmentApi from "../../api/departmentApi";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import AddAndUpdateDepartmentModal from "./AddAndUpdateDepartmentModal";
import Swal from "sweetalert2";

const DepartmentsList = ({ currentFaculty, setStatistics }) => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isAddAndUpdateDepartmentModalOpen, setIsAddAndUpdateDepartmentModalOpen] = useState(false);
  const [departmentToBeUpdated, setDepartmentToBeUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  const faculty = currentFaculty || useSelector((state) => state.faculty.faculty);

  const getDepartments = async (facultyId) => {
    setLoading(true);
    try {
      const { data, status } = await departmentApi.getDepartments(facultyId);
      if (status === 200) {
        setDepartments(data);
        if (setStatistics) {
          setStatistics((prev) => ({
            ...prev,
            numberOfDepartments: data.length,
          }));
        }
      } else {
        toast.error("Something went wrong we could not load departments.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createDepartment = async (data) => {
    try {
      const { status } = await departmentApi.createDepartment(data);
      if (status === 201) toast.success("Department created successfully!");
      else toast.error("Something went wrong!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateDepartment = async (data) => {
    data.departmentId = departmentToBeUpdated.id;
    try {
      const { status } = await departmentApi.updateDepartment(data);
      if (status === 204) {
        toast.success("Department updated successfully!");
        setDepartmentToBeUpdated(null);
      } else toast.error("Something went wrong!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredDepartments = departments.filter(
    (department) =>
      department.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDepartments = [...filteredDepartments].sort((a, b) => {
    switch (sortBy) {
      case "code":
        return (a.code ?? "").localeCompare(b.code ?? "");
      default:
        return (a.name ?? "").localeCompare(b.name ?? "");
    }
  });

  const handleEdit = (department, e) => {
    e.stopPropagation();
    setDepartmentToBeUpdated(department);
    setIsAddAndUpdateDepartmentModalOpen(true);
  };

  const handleDelete = (department, e) => {
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
          const { status } = await departmentApi.deleteDepartment(
            faculty.id,
            department.id
          );
          if (status === 204) {
            toast.success("Department has been deleted successfully!");
            await getDepartments(faculty.id);
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
    submissionData.facultyId = faculty.id;

    if (departmentToBeUpdated === null) await createDepartment(submissionData);
    else await updateDepartment(submissionData);

    await getDepartments(faculty.id);
  };

  useEffect(() => {
    if (faculty?.id) {
      getDepartments(faculty.id);
    } else {
      setLoading(false);
    }
  }, [faculty?.id]);

  const formatDescription = (description) => {
    if (!description) return "No description";
    if (description.length > 25) return description.slice(0, 25) + "...";
    return description;
  };

  return (
    <>
      {isAddAndUpdateDepartmentModalOpen && (
        <AddAndUpdateDepartmentModal
          isOpen={isAddAndUpdateDepartmentModalOpen}
          onClose={() => {
            setIsAddAndUpdateDepartmentModalOpen(false);
            setDepartmentToBeUpdated(null);
          }}
          departmentToBeUpdated={departmentToBeUpdated}
          onSave={save}
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h1 className={styles.pageTitle}>Departments</h1>
          <button
            className={styles.primaryButton}
            onClick={() => setIsAddAndUpdateDepartmentModalOpen(true)}
          >
            ➕ Add Department
          </button>
        </div>

        <div className={styles.headerControls}>
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search departments by name, code"
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
            </select>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Loading departments…</p>
          </div>
        ) : sortedDepartments.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏛️</div>
            <h3>No departments found</h3>
            <p>Try adjusting your search or add a new department.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th>Department Name</th>
                <th>Code</th>
                <th>Department Head</th>
                <th>Email</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedDepartments.map((department) => (
                <tr key={department.id} className={styles.tableRow}>
                  <td className={styles.nameCell}>
                    <div className={styles.facultyName}>{department.name}</div>
                  </td>
                  <td className={styles.codeCell}>
                    <span className={styles.facultyCode}>{department.code}</span>
                  </td>
                  <td className={styles.nameCell}>
                    <div className={styles.facultyName}>
                      {department.departmentHead || "Not set"}
                    </div>
                  </td>
                  <td className={!department.email ? styles.notAssigned : ""}>
                    {department.email ?? "Not set"}
                  </td>
                  <td className={!department.description ? styles.notAssigned : ""}>
                    {formatDescription(department.description)}
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.editButton}
                        onClick={(e) => handleEdit(department, e)}
                        title="Edit Department"
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={(e) => handleDelete(department, e)}
                        title="Delete Department"
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

export default DepartmentsList;