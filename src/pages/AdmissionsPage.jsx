import {useState, useEffect} from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { AdmissionCard } from '../components/university/AdmissionCard';
import { Button } from '../components/common/Button';
import { ADMISSIONS } from '../data/data';
import { useSelector } from 'react-redux';
import admissionApi from '../api/admissionApi.js'
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { EmptyState } from '../components/common/EmptyState';
export function AdmissionsPage() {
    const university = useSelector(
    state => state.university.university
  );
  const { universityId } = useParams();
      const [admissions,setAdmissions] = useState([]);
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
    useEffect(()=>{
      getAdmissions(universityId, null, null)
    },[universityId])
  
  return (
    <>
      <PageHeader title="Admissions" subtitle={`Find your path to ${university?.name}. Explore our programs and start your application.`} />
      <section className="section">
        <div className="container">
          {admissions.length > 0 ? (
  <>
    <div className="admissions-grid">
      {admissions.map(a => <AdmissionCard key={a.id} admission={a} />)}
    </div>
   
  </>
): <EmptyState title="No admissions" description="No admissions found for this university." />}
        </div>
      </section>
    </>
  );
}