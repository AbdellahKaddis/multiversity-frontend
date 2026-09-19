
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ApplicationWizard.module.css";
import { Link, useNavigate } from "react-router-dom";
import academicProgramApi from "../../api/academicProgramApi";
import admissionApi from "../../api/admissionApi";
import { toast, ToastContainer } from "react-toastify";
import universityApi from "../../api/universityApi";
import facultyApi from "../../api/facultyApi";
import uploadApi from "../../api/uploadApi";
import { useDispatch, useSelector } from "react-redux";
import applicationApi from "../../api/applicationApi";
import { setApplicant } from "../../features/applicant/applicantSlice";

const STEPS = [
  { key: "personal",  label: "Personal"  },
  { key: "academic",  label: "Academic"  },
  { key: "photo",     label: "Photo"     },
  { key: "documents", label: "Documents" },
  { key: "review",    label: "Review"    },
];

const ApplicationWizard = () => {
  const toDateInputValue = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const year  = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day   = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [stepIndex, setStepIndex] = useState(0);
  const applicant = useSelector(state => state.applicant.applicant);
  const [formData, setFormData] = useState({
    universityId: "", facultyId: "", programId: "",
    dob: toDateInputValue(applicant?.dob),
    placeOfBirth: applicant?.placeOfBirth,
    gender: applicant?.gender,
    cin: applicant?.cin,
    massarCode: applicant?.massarCode,
    phone: applicant?.phone,
    bacSerie: "", bacYear: "", bacMention: "", grade: "",
    photo: null,
    document: null,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stepRef = useRef(null);

  const [programs, setPrograms] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [instututeData, setInstututeData] = useState({
    universityName: "",
    FacultyName: "",
    ProgramName: "",
  });
  const [isAccept, setIsAccept] = useState(false);

  // ── Loading flags for dropdowns ──
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [loadingFaculties, setLoadingFaculties] = useState(false);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [loadingAdmission, setLoadingAdmission] = useState(false);
  const [checkingAlreadyApplied, setCheckingAlreadyApplied] = useState(false);

  const getPrograms = async (facultyId = null, departmentId = null, universityId = null) => {
    setLoadingPrograms(true);
    try {
      const { data, status } = await academicProgramApi.getAcademicPrograms(
        facultyId, departmentId, universityId
      );
      if (status === 200) setPrograms(data);
      else toast.error("Something went wrong we could not load programs.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingPrograms(false);
    }
  };

  const getUniversities = async () => {
    setLoadingUniversities(true);
    try {
      const { data, status } = await universityApi.getUniversities();
      if (status === 200) setUniversities(data);
      else toast.error("Something went wrong we could not load universities.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingUniversities(false);
    }
  };

  const getFaculties = async (universityId) => {
    setLoadingFaculties(true);
    try {
      const { data, status } = await facultyApi.getFaculties(universityId);
      if (status === 200) setFaculties(data);
      else toast.error("Something went wrong we could not load faculties.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingFaculties(false);
    }
  };

  useEffect(() => {
    stepRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stepIndex]);

  useEffect(() => {
    if (universities.length === 0) getUniversities();

    if (!formData.universityId) {
      setFaculties([]);
      setPrograms([]);
      setField("facultyId", "");
      setField("programId", "");
      return;
    }

    getFaculties(formData.universityId);

    if (!formData.facultyId) {
      setPrograms([]);
      setField("programId", "");
      return;
    }

    getPrograms(formData.facultyId);
  }, [formData.facultyId, formData.universityId]);

  const [currentAdmission, setCurrentAdmission] = useState(null);
  const [admissionStatus, setAdmissionStatus] = useState("idle");

  const getAdmissions = async (universityId, facultyId, programId) => {
    setAdmissionStatus("loading");
    setLoadingAdmission(true);
    try {
      const { data, status } = await admissionApi.getAdmissions(universityId, facultyId, programId);
      if (status !== 200) {
        toast.error("Something went wrong — we could not load admissions.");
        setCurrentAdmission(null);
        setAdmissionStatus("idle");
        return;
      }
      const active = data.find(a => new Date(a.endDate) > new Date()) ?? null;
      setCurrentAdmission(active);
      setAdmissionStatus("loaded");
    } catch (error) {
      toast.error(error.message);
      setCurrentAdmission(null);
      setAdmissionStatus("idle");
    } finally {
      setLoadingAdmission(false);
    }
  };

  useEffect(() => {
    const { universityId, facultyId, programId } = formData;
    if (!universityId || !facultyId || !programId) {
      setCurrentAdmission(null);
      setAdmissionStatus("idle");
      return;
    }
    getAdmissions(universityId, facultyId, programId);
  }, [formData.universityId, formData.facultyId, formData.programId]);

  const [applications, setApplications] = useState([]);

  const getApplicantApplications = async (applicantId, programId) => {
    setCheckingAlreadyApplied(true);
    try {
      const { data, status } = await applicationApi.getApplications({ applicantId, programId });
      if (status === 200) setApplications(data);
      else {
        toast.error("Something went wrong — we could not load applications.");
        setApplications([]);
      }
    } catch (error) {
      toast.error(error.message);
      setApplications([]);
    } finally {
      setCheckingAlreadyApplied(false);
    }
  };

  useEffect(() => {
    if (applicant?.id && formData.programId) {
      getApplicantApplications(applicant.id, formData.programId);
    } else {
      setApplications([]);
    }
  }, [applicant?.id, formData.programId]);

  const getApplicant = async (applicantId) => {
    try {
      const { data, status } = await applicationApi.getApplicant(applicantId);
      if (status === 200) dispatch(setApplicant(data));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const hasAlreadyApplied = applications.length > 0;

  const validateStep = (key, data, currentAdmission, admissionStatus, hasAlreadyApplied) => {
    const e = {};
    if (key === "personal") {
      if (!data.universityId) e.universityId = "University is required.";
      if (!data.facultyId)  e.facultyId  = "Faculty is required.";
      if (!data.programId)  e.programId  = "Program is required.";
      if (data.programId && admissionStatus === "loaded" && currentAdmission === null) {
        e.programId = "This program is not open for applications.";
      }
      if (data.programId && hasAlreadyApplied) {
        e.programId = "You have already applied to this program.";
      }
      if (!data.dob) e.dob = "Date of birth is required.";
      if (!data.placeOfBirth?.trim()) e.placeOfBirth = "Place of birth is required.";
      if (!data.gender) e.gender = "Gender is required.";
      if (!/^[A-Za-z]{1,2}\d{6}[A-Za-z]?$/.test(data.cin?.trim()))
        e.cin = "CIN format: 1-2 letters + 6 digits (e.g., A123456 or AB123456).";
      if (!/^[A-Za-z0-9]{9,12}$/.test(data.massarCode?.trim()))
        e.massarCode = "Invalid Massar code.";
      if (!/^[0-9+\s]{8,}$/.test(data.phone?.trim()))
        e.phone = "Invalid phone number.";
    }
    if (key === "academic") {
      if (!data.bacSerie)  e.bacSerie = "Bac serie is required.";
      if (!data.bacYear)    e.bacYear   = "Bac year is required.";
      if (!data.bacMention) e.bacMention = "Mention is required.";
      if (data.grade === "" || data.grade === null || data.grade === undefined) {
        e.grade = "Grade is required.";
      } else {
        const g = Number(data.grade);
        if (isNaN(g) || g < 0 || g > 20) e.grade = "Grade must be between 0 and 20.";
      }
    }
    if (key === "photo" && !data.photo) e.photo = "Profile photo is required.";
    if (key === "documents" && !data.document) e.document = "Document is required";
    return e;
  };

  const currentStep = STEPS[stepIndex];
  const stepErrors = useMemo(
    () => validateStep(currentStep.key, formData, currentAdmission, admissionStatus, hasAlreadyApplied),
    [currentStep.key, formData, currentAdmission, admissionStatus, hasAlreadyApplied]
  );
  const stepValid = Object.keys(stepErrors).length === 0;

  const setField = (name, value) =>
    setFormData(prev => ({ ...prev, [name]: value }));

  const handleBlur = (name) => setTouched(prev => ({ ...prev, [name]: true }));

  const handleNext = () => {
    if (!stepValid) {
      setErrors(stepErrors);
      setTouched(prev => ({ ...prev, ...Object.fromEntries(Object.keys(stepErrors).map(k => [k, true])) }));
      return;
    }
    setErrors({});
    setStepIndex(i => Math.min(i + 1, STEPS.length - 1));
  };

  const handleBack = () => setStepIndex(i => Math.max(i - 1, 0));

  const handleSubmit = async () => {
    if (!stepValid) return;
    setIsSubmitting(true);
    try {
      await createApplication(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const createApplication = async (submissionData) => {
    try {
      const photoUrl = await uploadApi.uploadPhoto(submissionData.photo);
      const fileUrl  = await uploadApi.uploadPdf(submissionData.document);

      const { photo, document, universityId, ...rest } = formData;

      const applicationPayload = {
        applicantId: applicant.id,
        programId: rest.programId,
        grade: Number(rest.grade),
        bacSerie: rest.bacSerie,
        bacYear: Number(rest.bacYear),
        bacMention: rest.bacMention,
        fileUrl,
        applicant: {
          dob: rest.dob,
          placeOfBirth: rest.placeOfBirth,
          gender: rest.gender,
          cin: rest.cin,
          massarCode: rest.massarCode,
          phone: rest.phone,
          status: "applicant",
          photoUrl,
          facultyId: rest.facultyId,
        },
      };

      const { status } = await applicationApi.createApplication(applicationPayload);
      if (status === 201) {
        toast.success("Application submitted successfully.");
        getApplicant(applicant?.id);
        navigate("/student/applications");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePhotoChange = (file) => {
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setErrors(e => ({ ...e, photo: "Only JPG or PNG allowed." }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors(e => ({ ...e, photo: "Max size 2 MB." }));
      return;
    }
    setField("photo", file);
    setErrors(e => ({ ...e, photo: undefined }));
  };

  const handleDocumentChange = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setErrors(e => ({ ...e, document: "Only PDF allowed." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(e => ({ ...e, document: "Max size 5 MB." }));
      return;
    }
    setField("document", file);
    setErrors(e => ({ ...e, document: undefined }));
  };

  const showError = (name) => touched[name] && (errors[name] || stepErrors[name]);
  const errorText = (name) => errors[name] || stepErrors[name];

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.wizard}>
        <header className={styles.wizardHeader}>
          <Link to={"/student/applications"}>
            <button className={styles.exitButton} aria-label="Exit wizard">←</button>
          </Link>
        </header>

        <nav className={styles.stepper} aria-label="Application progress">
          {STEPS.map((s, i) => {
            const state = i < stepIndex ? "done" : i === stepIndex ? "active" : "upcoming";
            return (
              <div key={s.key} className={`${styles.step} ${styles[state]}`}>
                <span className={styles.stepDot}>{state === "done" ? "✓" : i + 1}</span>
                <span className={styles.stepLabel}>{s.label}</span>
                {i < STEPS.length - 1 && <span className={styles.stepLine} />}
              </div>
            );
          })}
        </nav>

        <main className={styles.wizardBody} ref={stepRef} tabIndex={-1}>
          {currentStep.key === "personal" && (
            <section className={styles.stepPane}>
              <h3 className={styles.paneTitle}>Personal information</h3>
              <p className={styles.paneHint}>
                Enter your details exactly as they appear on your official documents.
              </p>

              <div className={styles.grid2}>
                <Field label="University" required error={showError("universityId") && errorText("universityId")}>
                  <select
                    className={`${styles.input} ${showError("universityId") ? styles.inputError : ""}`}
                    value={formData.universityId}
                    disabled={loadingUniversities}
                    onChange={e => {
                      setField("universityId", e.target.value);
                      setInstututeData(prev => ({ ...prev, universityName: e.target.selectedOptions[0].text }));
                    }}
                    onBlur={() => handleBlur("universityId")}
                  >
                    <option value="">
                      {loadingUniversities ? "Loading universities…" : "Select…"}
                    </option>
                    {universities.map((university) => (
                      <option value={university.id} key={university.id}>{university.name}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Faculty" required error={showError("facultyId") && errorText("facultyId")}>
                  <select
                    className={`${styles.input} ${showError("facultyId") ? styles.inputError : ""}`}
                    value={formData.facultyId}
                    disabled={!formData.universityId || loadingFaculties}
                    onChange={e => {
                      setField("facultyId", e.target.value);
                      setInstututeData(prev => ({ ...prev, FacultyName: e.target.selectedOptions[0].text }));
                    }}
                    onBlur={() => handleBlur("facultyId")}
                  >
                    <option value="">
                      {loadingFaculties
                        ? "Loading faculties…"
                        : !formData.universityId
                        ? "Select a university first"
                        : "Select…"}
                    </option>
                    {faculties.map((faculty) => (
                      <option value={faculty.id} key={faculty.id}>{faculty.name}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Program" required error={showError("programId") && errorText("programId")}>
                  <select
                    className={`${styles.input} ${showError("programId") ? styles.inputError : ""}`}
                    value={formData.programId}
                    disabled={!formData.facultyId || loadingPrograms || checkingAlreadyApplied}
                    onChange={e => {
                      setField("programId", e.target.value);
                      setInstututeData(prev => ({ ...prev, ProgramName: e.target.selectedOptions[0].text }));
                    }}
                    onBlur={() => handleBlur("programId")}
                  >
                    <option value="">
                      {loadingPrograms
                        ? "Loading programs…"
                        : !formData.facultyId
                        ? "Select a faculty first"
                        : "Select…"}
                    </option>
                    {programs.map((program) => (
                      <option value={program.id} key={program.id}>{program.name}</option>
                    ))}
                  </select>

                  {loadingAdmission && formData.programId && (
                    <p className={styles.hint}>Checking admission availability…</p>
                  )}
                  {checkingAlreadyApplied && formData.programId && (
                    <p className={styles.hint}>Checking your applications…</p>
                  )}
                </Field>

                <Field label="Date of birth" required error={showError("dob") && errorText("dob")}>
                  <input
                    type="date"
                    max={new Date().toISOString().slice(0, 10)}
                    className={`${styles.input} ${showError("dob") ? styles.inputError : ""}`}
                    value={formData.dob}
                    onChange={e => setField("dob", e.target.value)}
                    onBlur={() => handleBlur("dob")}
                  />
                </Field>

                <Field label="Place of birth" required error={showError("placeOfBirth") && errorText("placeOfBirth")}>
                  <input
                    className={`${styles.input} ${showError("placeOfBirth") ? styles.inputError : ""}`}
                    value={formData.placeOfBirth}
                    onChange={e => setField("placeOfBirth", e.target.value)}
                    onBlur={() => handleBlur("placeOfBirth")}
                  />
                </Field>

                <Field label="Gender" required error={showError("gender") && errorText("gender")}>
                  <select
                    className={`${styles.input} ${showError("gender") ? styles.inputError : ""}`}
                    value={formData.gender}
                    onChange={e => setField("gender", e.target.value)}
                    onBlur={() => handleBlur("gender")}
                  >
                    <option value="">Select…</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </Field>

                <Field label="National ID (CIN)" required error={showError("cin") && errorText("cin")}>
                  <input
                    className={`${styles.input} ${showError("cin") ? styles.inputError : ""}`}
                    placeholder="A123456"
                    value={formData.cin}
                    onChange={e => setField("cin", e.target.value.toUpperCase())}
                    onBlur={() => handleBlur("cin")}
                  />
                </Field>

                <Field label="Massar code" required error={showError("massarCode") && errorText("massarCode")}>
                  <input
                    className={`${styles.input} ${showError("massarCode") ? styles.inputError : ""}`}
                    placeholder="R130012345"
                    value={formData.massarCode}
                    onChange={e => setField("massarCode", e.target.value.toUpperCase())}
                    onBlur={() => handleBlur("massarCode")}
                  />
                </Field>

                <Field label="Phone" required error={showError("phone") && errorText("phone")}>
                  <input
                    className={`${styles.input} ${showError("phone") ? styles.inputError : ""}`}
                    placeholder="+212 6XX XXX XXX"
                    value={formData.phone}
                    onChange={e => setField("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    autoComplete="tel"
                  />
                </Field>
              </div>
            </section>
          )}

          {currentStep.key === "academic" && (
            <section className={styles.stepPane}>
              <h3 className={styles.paneTitle}>Academic information</h3>
              <p className={styles.paneHint}>
                Your Bac results determine your eligibility for this program.
              </p>
              <div className={styles.grid2}>
                <Field label="Bac serie" required error={showError("bacSerie") && errorText("bacSerie")}>
                  <select
                    className={`${styles.input} ${showError("bacSerie") ? styles.inputError : ""}`}
                    value={formData.bacSerie}
                    onChange={e => setField("bacSerie", e.target.value)}
                    onBlur={() => handleBlur("bacSerie")}
                  >
                    <option value="">Select…</option>
                    <option>SM</option><option>SVT</option><option>PC</option>
                    <option>SGC</option><option>Lettres</option><option>Sciences Humaines</option>
                    <option>Économie</option><option>Autre</option>
                  </select>
                </Field>

                <Field label="Bac year" required error={showError("bacYear") && errorText("bacYear")}>
                  <input
                    type="number" min="1990" max={new Date().getFullYear()}
                    className={`${styles.input} ${showError("bacYear") ? styles.inputError : ""}`}
                    value={formData.bacYear}
                    onChange={e => setField("bacYear", e.target.value)}
                    onBlur={() => handleBlur("bacYear")}
                  />
                </Field>

                <Field label="Mention" required error={showError("bacMention") && errorText("bacMention")}>
                  <select
                    className={`${styles.input} ${showError("bacMention") ? styles.inputError : ""}`}
                    value={formData.bacMention}
                    onChange={e => setField("bacMention", e.target.value)}
                    onBlur={() => handleBlur("bacMention")}
                  >
                    <option value="">Select…</option>
                    <option>Très Bien</option><option>Bien</option>
                    <option>Assez Bien</option><option>Passable</option>
                  </select>
                </Field>

                <Field
                  label="Grade (out of 20)"
                  required
                  error={showError("grade") && errorText("grade")}
                  hint="Average of your Bac — e.g., 15.75"
                >
                  <input
                    type="number" step="0.01" min="0" max="20"
                    className={`${styles.input} ${showError("grade") ? styles.inputError : ""}`}
                    value={formData.grade}
                    onChange={e => setField("grade", e.target.value)}
                    onBlur={() => handleBlur("grade")}
                  />
                </Field>
              </div>
            </section>
          )}

          {currentStep.key === "photo" && (
            <section className={styles.stepPane}>
              <h3 className={styles.paneTitle}>Profile photo</h3>
              <p className={styles.paneHint}>
                Clear, front-facing, white background. JPG or PNG, max 2 MB.
              </p>

              <div className={styles.photoArea}>
                <div className={styles.photoPreview}>
                  {formData.photo
                    ? <img src={URL.createObjectURL(formData.photo)} alt="Preview" />
                    : <div className={styles.photoPlaceholder}>📷</div>}
                </div>

                <label className={styles.fileInput}>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={e => handlePhotoChange(e.target.files?.[0])}
                  />
                  <span>{formData.photo ? "Replace photo" : "Choose photo"}</span>
                </label>

                {showError("photo") && <p className={styles.error}>{errorText("photo")}</p>}
              </div>
            </section>
          )}

          {currentStep.key === "documents" && (
            <section className={styles.stepPane}>
              <h3 className={styles.paneTitle}>Required documents</h3>
              <p className={styles.paneHint}>
                Upload all your documents in a single PDF (max 5 MB).
              </p>

              <div className={styles.photoArea}>
                <div className={styles.photoPreview}>
                  <div className={styles.photoPlaceholder}>📄</div>
                </div>

                <label className={styles.fileInput}>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={e => handleDocumentChange(e.target.files?.[0])}
                  />
                  <span>{formData.document ? "Replace PDF" : "Choose PDF"}</span>
                </label>

                {formData.document && (
                  <span className={styles.docFile}>📄 {formData.document.name}</span>
                )}

                {showError("document") && <p className={styles.error}>{errorText("document")}</p>}
              </div>
            </section>
          )}

          {currentStep.key === "review" && (
            <section className={styles.stepPane}>
              <h3 className={styles.paneTitle}>Review & submit</h3>
              <p className={styles.paneHint}>
                Check everything carefully. You can't edit after submitting.
              </p>

              <ReviewBlock title="Personal information" onEdit={() => setStepIndex(0)}>
                <Row label="University" value={`${instututeData.universityName}`} />
                <Row label="Faculty" value={`${instututeData.FacultyName}`} />
                <Row label="Program" value={`${instututeData.ProgramName}`} />
                <Row label="Date of birth" value={formData.dob} />
                <Row label="Place of birth" value={formData.placeOfBirth} />
                <Row label="Gender" value={formData.gender === "M" ? "Male" : "Female"} />
                <Row label="CIN" value={formData.cin} />
                <Row label="Massar code" value={formData.massarCode} />
                <Row label="Phone" value={formData.phone} />
              </ReviewBlock>

              <ReviewBlock title="Academic information" onEdit={() => setStepIndex(1)}>
                <Row label="Bac serie" value={formData.bacSerie} />
                <Row label="Bac year" value={formData.bacYear} />
                <Row label="Mention" value={formData.bacMention} />
                <Row label="Grade" value={`${formData.grade} / 20`} />
              </ReviewBlock>

              <ReviewBlock title="Photo" onEdit={() => setStepIndex(2)}>
                <Row label="File" value={formData.photo?.name ?? "—"} />
              </ReviewBlock>

              <ReviewBlock title="Documents" onEdit={() => setStepIndex(3)}>
                <Row label="Documents PDF" value={formData.document?.name ?? "—"} />
              </ReviewBlock>

              <div className={styles.confirmBox}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={isAccept}
                    onChange={e => setIsAccept(e.target.checked)}
                  />
                  <span>
                    I confirm that the information I've provided is accurate and complete.
                  </span>
                </label>
              </div>
            </section>
          )}
        </main>

        <footer className={styles.wizardFooter}>
          <div className={styles.footerLeft}>
            {stepIndex > 0 && (
              <button className={styles.secondaryButton} onClick={handleBack} disabled={isSubmitting}>
                ← Back
              </button>
            )}
          </div>

          <div className={styles.footerRight}>
            <span className={styles.stepCounter}>
              Step {stepIndex + 1} of {STEPS.length}
            </span>
            {currentStep.key !== "review" ? (
              <button
                className={styles.primaryButton}
                onClick={handleNext}
                disabled={!stepValid}
              >
                Continue →
              </button>
            ) : (
              <button
                className={styles.primaryButton}
                onClick={handleSubmit}
                disabled={!stepValid || isSubmitting || !isAccept}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinnerSmall} />
                    Submitting…
                  </>
                ) : (
                  "Submit application"
                )}
              </button>
            )}
          </div>
        </footer>
      </div>
    </>
  );
};

/* ---------- Small presentational helpers ---------- */
const Field = ({ label, required, error, hint, children }) => (
  <div className={styles.field}>
    <label className={styles.label}>
      {label} {required && <span className={styles.required}>*</span>}
    </label>
    {children}
    {hint && !error && <p className={styles.hint}>{hint}</p>}
    {error && <p className={styles.error}>{error}</p>}
  </div>
);

const ReviewBlock = ({ title, onEdit, children }) => (
  <div className={styles.reviewBlock}>
    <div className={styles.reviewHeader}>
      <h4>{title}</h4>
      <button className={styles.linkButton} onClick={onEdit}>Edit</button>
    </div>
    <div className={styles.reviewBody}>{children}</div>
  </div>
);

const Row = ({ label, value }) => (
  <div className={styles.reviewRow}>
    <span className={styles.reviewLabel}>{label}</span>
    <span className={styles.reviewValue}>{value}</span>
  </div>
);

export default ApplicationWizard;