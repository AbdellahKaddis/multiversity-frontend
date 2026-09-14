import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { ProgramCard } from '../components/university/ProgramCard';
import { EmptyState } from '../components/common/EmptyState';
import { PROGRAMS } from '../data/data';
import { useParams } from 'react-router-dom';
import degreeApi from '../api/degreeApi';
import { toast } from 'react-toastify';
import academicProgramApi from '../api/academicProgramApi';

export function ProgramsPage() {
  const { universityId } = useParams()
  const [filter, setFilter] = useState('all');
  const [degrees, setDegrees]= useState([{name: 'all'}]);
const [programs,setPrograms] = useState([]);
  
    const getDegrees = async(universityId)=>{
        try{
          const { data, status } = await degreeApi.getDegrees(universityId);
          if(status === 200)
            setDegrees(prev => [...prev, ...data]);
          else
            toast.error("Something went wrong we could not load degrees.");
        }catch(error){
          toast.error(error.message);
        }
    };
        const getPrograms = async (universityId) => {
    try {
      const { data, status } = await academicProgramApi.getAcademicPrograms(
        null,
        null,
        universityId
      );

      if (status === 200) setPrograms(data);
      else toast.error("Something went wrong we could not load programs.");
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(()=>{
    getDegrees(universityId);
    getPrograms(universityId)
  },[universityId])
  const filtered = filter === 'all' ? programs : programs.filter(p => p.degreeName === filter);

  return (
    <>
      <PageHeader title="Academic Programs" subtitle="Browse our programs by degree level." />
      <section className="section">
        <div className="container">
          <div className="tabs">
            {degrees.map(d => (
              <button key={d.name} className={`tab-btn ${filter === d.name ? 'active' : ''}`} onClick={() => setFilter(d.name)}>
                {d.name === 'all' ? 'All Programs' : d.name}
              </button>
            ))}
          </div>
          {filtered.length ? (
            <div className="programs-grid">
              {filtered.map(p => <ProgramCard key={p.id} program={p} />)}
            </div>
          ) : <EmptyState title="No programs found" description="Try selecting a different degree level." />}
        </div>
      </section>
    </>
  );
}