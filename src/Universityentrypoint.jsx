import React, { useEffect } from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import './styles/index.css';

import { useDispatch } from 'react-redux';
import { set, setFaculties } from './features/university/universitySlice';

import universityApi from './api/universityApi';
import facultyApi from './api/facultyApi';

import { toast, ToastContainer } from 'react-toastify';

function Universityentrypoint() {
  const { universityId } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();

  const getUniversity = async (id) => {
    try {
      const { data, status } = await universityApi.getUniversity(id);

      if (status === 200) {
        dispatch(set(data));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getFaculties = async (id) => {
    try {
      const { data, status } = await facultyApi.getFaculties(id);

      if (status === 200) {
        dispatch(setFaculties(data));
      } else {
        toast.error(
          'Something went wrong. We could not load faculties.'
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!universityId) return;

    getUniversity(universityId);
    getFaculties(universityId);
  }, [universityId]);

  return (
    <>
      <Header
        onSearchOpen={() => {}}
        onPortalClick={() => {}}
      />

      <main>
        <Outlet />
      </main>

      <Footer />
      
      <ToastContainer />
    </>
  );
}

export default Universityentrypoint;