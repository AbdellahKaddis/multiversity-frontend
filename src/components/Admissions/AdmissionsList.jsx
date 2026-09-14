import React, { useEffect, useState } from 'react';
import styles from '../Faculties/FacultiesList.module.css';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import AddAndUpdateAdmissionModal from './AddAndUpdateAdmissionModal';
import { useSelector } from 'react-redux';
import admissionApi from '../../api/admissionApi';
import styles2 from './AdmissionsList.module.css';
const AdmissionsList =()=> {
      const [searchTerm, setSearchTerm] = useState("");

    const [admissions,setAdmissions] = useState([]);
    const [isAddAndUpdateAdmissionModalOpen, setIsAddAndUpdateAdmissionModalOpen] = useState(false);
    const [admissionToBeUpdated, setAdmissionToBeUpdated] = useState(null);
       const faculty = useSelector(state => state.faculty.faculty);
         const filteredAdmissions = admissions.filter(
    (admission) =>
      admission.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.academicYear.toLowerCase().includes(searchTerm.toLowerCase())
  );

 
    const getAdmissions = async(universityId, facultyId, programId)=>{
        try{
          const { data, status } = await admissionApi.getAdmissions(universityId, facultyId, programId);
          if(status === 200)
            setAdmissions(data);
          else
            toast.error("Something went wrong we could not load admissions.");
        }catch(error){
          toast.error(error.message);
        }
    };
    const createAdmission =async(data)=>{
      try{
        const { status } = await admissionApi.createAdmission(data);
        if(status === 201)
          toast.success("Admission created successfully!");
        else
          toast.error("Something went wrong!");
        }catch(error){
          toast.error(error.message);
        }
    };
    const updateAdmission =async(data)=>{
      data.admissionId = admissionToBeUpdated.id;
      try{
        const { status } = await admissionApi.updateAdmission(data);
        if(status === 204){
          toast.success("Admission updated successfully!");
          setAdmissionToBeUpdated(null);
        }
        else
          toast.error("Something went wrong!");
        }catch(error){
          toast.error(error.message);
        }
    };

  const handleEdit = (admission, e)=>{
    e.stopPropagation();
    setAdmissionToBeUpdated(admission);
    setIsAddAndUpdateAdmissionModalOpen(true);
  };

  const handleDelete = (admission, e)=>{
    e.stopPropagation();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async(result) => {
      if (result.isConfirmed) {
        try{
          const { status } = await admissionApi.deleteAdmission(admission.id);
        if(status === 204){
          toast.success("Admission has been deleted successfully!");
          await getAdmissions(faculty.universityId, faculty.id, null);
        }else{
          toast.error("Something went wrong!");
        }
        }catch(error){
          toast.error(error.message)
        }
      }
    });
  };
  const save =async(submissionData)=>{

    if(admissionToBeUpdated === null)
      await createAdmission(submissionData);
    else
      await updateAdmission(submissionData);

    await getAdmissions(faculty.universityId, faculty.id, null);
  };
    useEffect(()=>{
        getAdmissions(faculty.universityId, faculty.id, null);
    },[faculty]);
    const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

    return (

  <>
    {isAddAndUpdateAdmissionModalOpen && (
      <AddAndUpdateAdmissionModal
        isOpen={isAddAndUpdateAdmissionModalOpen}
        onClose={() => {
          setIsAddAndUpdateAdmissionModalOpen(false);
          setAdmissionToBeUpdated(null);
        }}
        admissionToBeUpdated={admissionToBeUpdated}
        onSave={save}
      />
    )}
    <ToastContainer position="top-right" autoClose={3000} />

    <div className={styles.header}>
      <div className={styles.headerMain}>
        <h1 className={styles.pageTitle}>Admissions</h1>
        <button
          className={styles.primaryButton}
          onClick={() => setIsAddAndUpdateAdmissionModalOpen(true)}
        >
          ➕ Add Admission
        </button>
      </div>

      <div className={styles.headerControls}>
                <div className={styles.searchBar}>
                  <span className={styles.searchIcon}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search admissions by title, program, academic year..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
      
                
              </div>
    </div>

    <div className={styles2.cardsGrid}>
      {filteredAdmissions.map((a) => (
        <div key={a.id} className={styles2.admissionCard}>
          <div className={styles2.cardHeader}>
            <div>
              <h3 className={styles2.cardTitle}>{a.programName}</h3>
              <p className={styles2.cardSubtitle}>{a.title}</p>
            </div>
            <span className={styles2.yearBadge}>{a.academicYear}</span>
          </div>

          <div className={styles2.cardDates}>
            <span>📅 {formatDate(a.startDate)}</span>
            <span className={styles2.dateSeparator}>→</span>
            <span>{formatDate(a.endDate)}</span>
          </div>

          <div className={styles2.cardProcess}>
            <span className={styles2.processLabel}>Process</span>
            <p className={styles2.processText}>{a.process}</p>
          </div>

          <details className={styles2.requirements}>
            <summary className={styles2.requirementsSummary}>
              Requirements ({a.requirements.length})
            </summary>
            <ul className={styles2.requirementsList}>
              {a.requirements.map((r) => (
                <li key={r.id} className={styles2.requirementItem}>
                  {r.name}
                </li>
              ))}
            </ul>
          </details>

          <div className={styles2.actionButtons}>
            <button
              className={styles2.editButton}
              title="Edit"
              onClick={(e) => handleEdit(a, e)}
            >
              ✏️
            </button>
            <button
              className={styles2.deleteButton}
              title="Delete"
              onClick={(e) => handleDelete(a, e)}
            >
              🗑️
            </button>
          </div>
        </div>
      ))}

      
    </div>
    {filteredAdmissions.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏛️</div>
          <h3>No Admissions found</h3>
          <p>Try adjusting your search or add a new admission.</p>
        </div>
      )}
  </>
    )
};

export default AdmissionsList;