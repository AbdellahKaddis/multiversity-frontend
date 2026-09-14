import React, { useEffect, useState } from 'react';
import styles from '../Faculties/FacultiesList.module.css';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import degreeApi from '../../api/degreeApi';
import AddAndUpdateDegreeModal from './AddAndUpdateDegreeModal';
import { useSelector } from 'react-redux';
const DegreesList =()=> {
    const [degrees,setDegrees] = useState([]);
    const [isAddAndUpdateDegreeModalOpen, setIsAddAndUpdateDegreeModalOpen] = useState(false);
    const [degreeToBeUpdated, setDegreeToBeUpdated] = useState(null);
    const university = useSelector(state => state.university.university);
    const getDegrees = async(universityId)=>{
        try{
          const { data, status } = await degreeApi.getDegrees(universityId);
          if(status === 200)
            setDegrees(data);
          else
            toast.error("Something went wrong we could not load degrees.");
        }catch(error){
          toast.error(error.message);
        }
    };
    const createDegree =async(data)=>{
      try{
        const { status } = await degreeApi.createDegree(data);
        if(status === 201)
          toast.success("Degree created successfully!");
        else
          toast.error("Something went wrong!");
        }catch(error){
          toast.error(error.message);
        }
    };
    const updateDegree =async(data)=>{
      data.degreeId = degreeToBeUpdated.id;
      try{
        const { status } = await degreeApi.updateDegree(data);
        if(status === 204){
          toast.success("Degree updated successfully!");
          setDegreeToBeUpdated(null);
        }
        else
          toast.error("Something went wrong!");
        }catch(error){
          toast.error(error.message);
        }
    };

  const handleEdit = (degree, e)=>{
    e.stopPropagation();
    setDegreeToBeUpdated(degree);
    setIsAddAndUpdateDegreeModalOpen(true);
  };

  const handleDelete = (degree, e)=>{
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
          const { status } = await degreeApi.deleteDegree(degree.id);
        if(status === 204){
          toast.success("Degree has been deleted successfully!");
          await getDegrees(university.id);
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
    submissionData.universityId = university.id;

    if(degreeToBeUpdated === null)
      await createDegree(submissionData);
    else
      await updateDegree(submissionData);

    await getDegrees(university.id);
  };
    useEffect(()=>{
        getDegrees(university.id);
    },[]);

    return (
        <>
        {isAddAndUpdateDegreeModalOpen && <AddAndUpdateDegreeModal isOpen={isAddAndUpdateDegreeModalOpen} onClose={()=>{setIsAddAndUpdateDegreeModalOpen(false);setDegreeToBeUpdated(null);}} degreeToBeUpdated={degreeToBeUpdated} onSave={save}/>}
            <ToastContainer position="top-right" autoClose={3000}/>
                  <div className={styles.header}>
                    <div className={styles.headerMain}>
                      <h1 className={styles.pageTitle}>Degrees</h1>
                      <button className={styles.primaryButton} onClick={()=> setIsAddAndUpdateDegreeModalOpen(true)}>
                        ➕ Add Degree
                      </button>
                    </div>
                  </div>
            
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead className={styles.tableHeader}>
                        <tr>
                          <th>Name</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {degrees.map(degree => (
                          <tr 
                            key={degree.id} 
                            className={styles.tableRow}
                          >
                            <td className={styles.nameCell}>
                              <div className={styles.facultyName}>
                                {degree.name}
                              </div>
                            </td>
                            <td>
                              <div className={styles.actionButtons}>
                                <button 
                                  className={styles.editButton}
                                  onClick={(e) => handleEdit(degree, e)}
                                  title="Edit Degree"
                                >
                                  ✏️
                                </button>
                                <button 
                                  className={styles.deleteButton}
                                  onClick={(e) => handleDelete(degree, e)}
                                  title="Delete Degree"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {degrees.length === 0 && (
                      <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>🏛️</div>
                        <h3>No degrees found</h3>
                        <p>add a new department.</p>
                      </div>
                    )}
                  </div>
        </>
    )
};

export default DegreesList;