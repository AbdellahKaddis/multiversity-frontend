import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { FacultyCard } from '../components/university/FacultyCard';
import { FACULTIES } from '../data/data';
import { toast, ToastContainer } from 'react-toastify';
import facultyApi from '../api/facultyApi';
import { useParams } from 'react-router-dom';


import { EmptyState } from '../components/common/EmptyState';
export function FacultiesPage() {
    const {universityId} = useParams();
    const [faculties, setFaculties] = useState([])
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
  useEffect(()=>{
    getFaculties(universityId)
  },[universityId])
  return (
    <>
     <ToastContainer position="top-right" autoClose={3000} />
      <PageHeader title="Our Faculties" subtitle="Explore our academic faculties and discover your passion." />
      <section className="section">
        <div className="container">
          {faculties.length > 0 ? (<div className="faculties-grid">
            {faculties.map(f => <FacultyCard key={f.id} faculty={f} />)}
          </div>): <EmptyState title="No faculties" description="No faculties found for this university." />}
        </div>
      </section>
    </>
  );
}