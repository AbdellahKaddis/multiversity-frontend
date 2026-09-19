import React, { useEffect, useState } from "react";
import { Outlet, useParams, useLocation } from "react-router-dom";
import { Header } from "../components/Layout/Header";
import { Footer } from "../components/Layout/Footer";
import "../styles/index.css";

import { useDispatch } from "react-redux";
import { set, setFaculties } from "../features/university/universitySlice";

import universityApi from "../api/universityApi";
import facultyApi from "../api/facultyApi";

import { toast, ToastContainer } from "react-toastify";

function UniversityLayout() {
  const { universityId } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const getUniversity = async (id) => {
    try {
      const { data, status } = await universityApi.getUniversity(id);
      if (status === 200) dispatch(set(data));
      else toast.error(data?.message ?? "Something went wrong.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getFaculties = async (id) => {
    try {
      const { data, status } = await facultyApi.getFaculties(id);
      if (status === 200) dispatch(setFaculties(data));
      else toast.error("Something went wrong. We could not load faculties.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!universityId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        await Promise.all([
          getUniversity(universityId),
          getFaculties(universityId),
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [universityId]);

  return (
    <>
      <Header onSearchOpen={() => {}} onPortalClick={() => {}} />

      <main>
        {loading ? (
          <div className="page-loading">
            <div className="spinner" />
            <p>Loading university…</p>
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      <Footer />

      <ToastContainer />
    </>
  );
}

export default UniversityLayout;