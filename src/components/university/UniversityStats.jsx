
import { useSelector } from 'react-redux';
import universityApi from '../../api/universityApi';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
export function UniversityStats() {

const [stats, setStats] = useState([]);
  const university = useSelector((state) => state.university.university);
  // const {id} = useParams();

  const getStats = async (universityId) => {
    try{
      const { data, status } = await universityApi.getUniversityStatistics(universityId);
    if (status === 200) {
      setStats([
        {number: data.numberOfFaculties, label: 'Faculties'},
        { number: data.numberOfPrograms, label: 'Programs' },
    { number: '32,450', label: 'Students' },
    { number: data.numberOfProfessors, label: 'Professors' },
    { number: (new Date().getFullYear() - university?.yearEstablished), label: 'Years of Excellence' },
      ])
    } else {
      toast.error("Something went wrong we could not load faculties.");
    }
    }catch(error){
      toast.error(error.message)
    }
  };
  useEffect(()=>{
    if (university?.id) { getStats(university.id); }
  },[university?.id]);
  return (<>
  <ToastContainer position="top-right" autoClose={3000} />
  <section className="stats">
      <div className="container">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-number">{s.number}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
  );
}