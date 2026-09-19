// UniversityProfilePage.jsx
import React, { useEffect, useState } from "react";
import styles from "./UniversityProfilePage.module.css";
import { toast, ToastContainer } from "react-toastify";
import {
  FaUniversity,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaGlobe,
  FaCopy,
  FaCheck,
  FaEdit,
  FaTimes,
  FaSave,
  FaUpload,
} from "react-icons/fa";
import universityApi from "../../api/universityApi";
import uploadApi from "../../api/uploadApi";
import { useSelector, useDispatch } from "react-redux";
import { set } from "../../features/university/universitySlice";
import { apiUrl } from "../../utils/apiUrl";

const TYPE_OPTIONS = ["Public", "Private"];

const UniversityProfilePage = () => {
  const dispatch = useDispatch();
  const university = useSelector((state) => state.university.university);
  const auth = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    abbreviation: "",
    type: "Public",
    city: "",
    address: "",
    email: "",
    phoneNumber: "",
    yearEstablished: "",
    logoUrl: "",
    description: "",
  });

  // ---------- Hydrate form from Redux ----------
  useEffect(() => {
    if (university) {
      setFormData({
        name: university.name ?? "",
        abbreviation: university.abbreviation ?? "",
        type: university.type ?? "Public",
        city: university.city ?? "",
        address: university.address ?? "",
        email: university.email ?? "",
        phoneNumber: university.phoneNumber ?? "",
        yearEstablished: university.yearEstablished ?? "",
        logoUrl: university.logoUrl ?? "",
        description: university.description ?? "",
      });
    }
  }, [university]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    // Revert to Redux values
    if (university) {
      setFormData({
        name: university.name ?? "",
        abbreviation: university.abbreviation ?? "",
        type: university.type ?? "Public",
        city: university.city ?? "",
        address: university.address ?? "",
        email: university.email ?? "",
        phoneNumber: university.phoneNumber ?? "",
        yearEstablished: university.yearEstablished ?? "",
        logoUrl: university.logoUrl ?? "",
        description: university.description ?? "",
      });
    }
    setIsEditing(false);
  };

  // ---------- Save ----------
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
  ...formData,
  yearEstablished: formData.yearEstablished
    ? Number(formData.yearEstablished)
    : null,
};

      const { data, status } = await universityApi.updateUniversity(
        university.id,
        payload
      );

      if ( status === 204) {
        toast.success("University updated successfully.");
        // Prefer server response; fall back to local formData
        dispatch(set({ ...university, ...(data ?? formData) }));
        setIsEditing(false);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ---------- Logo upload ----------
  const handleLogoUpload = async (file) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/svg+xml"].includes(file.type)) {
      toast.error("Only JPG, PNG, or SVG allowed.");
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      toast.error("Max size 1 MB.");
      return;
    }

    setUploadingLogo(true);
   try {
  const url = await uploadApi.uploadUniversityLogo(file);

  if (url) {
    setFormData((prev) => ({ ...prev, logoUrl: url }));
    toast.success("Logo uploaded. Save to apply changes.");
  } else {
    toast.error("Upload failed.");
  }
} catch (error) {
  toast.error(error.message);
} finally {
  setUploadingLogo(false);
}
  };

  // ---------- Copy public URL ----------
  const publicUrl = `${window.location.origin}/universities/${university?.id ?? ""}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success("URL copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy. Copy it manually.");
    }
  };

  if (!university) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>University Profile</h1>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏛️</div>
          <h3>No university data</h3>
          <p>Unable to load your university information.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h1 className={styles.pageTitle}>University Profile</h1>
        </div>

        <div className={styles.headerActions}>
          {isEditing ? (
            <>
              <button
                className={styles.secondaryButton}
                onClick={handleCancel}
                disabled={saving}
              >
                <FaTimes /> Cancel
              </button>
              <button
                className={styles.primaryButton}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className={styles.spinnerSmall} /> Saving…
                  </>
                ) : (
                  <>
                    <FaSave /> Save Changes
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              className={styles.primaryButton}
              onClick={() => setIsEditing(true)}
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Public URL card */}
      <div className={styles.urlCard}>
        <div className={styles.urlHeader}>
          <FaGlobe className={styles.urlIcon} />
          <div>
            <span className={styles.urlLabel}>Public Profile URL</span>
            <p className={styles.urlHint}>
              Share this link so applicants can view your university
            </p>
          </div>
        </div>

        <div className={styles.urlRow}>
          <code className={styles.urlValue}>{publicUrl}</code>
          <button className={styles.copyButton} onClick={handleCopy}>
            {copied ? <FaCheck /> : <FaCopy />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Logo card */}
      <div className={styles.logoCard}>
        <div className={styles.logoBox}>
          {formData.logoUrl ? (
            <img
              src={apiUrl(formData.logoUrl)}
              alt="University logo"
              className={styles.logoImg}
            />
          ) : (
            <FaUniversity className={styles.logoPlaceholder} />
          )}
        </div>

        <div className={styles.logoInfo}>
          <h4 className={styles.cardTitle}>University Logo</h4>
          <p className={styles.cardHint}>
            Recommended 512×512 px, PNG or SVG, max 1 MB.
          </p>

          {isEditing && (
            <label
              className={`${styles.uploadButton} ${
                uploadingLogo ? styles.uploadButtonDisabled : ""
              }`}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/svg+xml"
                disabled={uploadingLogo}
                onChange={(e) => handleLogoUpload(e.target.files?.[0])}
              />
              {uploadingLogo ? (
                <>
                  <span className={styles.spinnerSmall} /> Uploading…
                </>
              ) : (
                <>
                  <FaUpload /> {formData.logoUrl ? "Replace Logo" : "Upload Logo"}
                </>
              )}
            </label>
          )}
        </div>
      </div>

      {/* Info card */}
      <div className={styles.infoCard}>
        <h4 className={styles.cardTitle}>General Information</h4>

        {isEditing ? (
          <div className={styles.formGrid}>
            <Field label="University Name" required>
              <input
                className={styles.input}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Université Mohammed V de Rabat"
              />
            </Field>

            <Field label="Abbreviation">
              <input
                className={styles.input}
                name="abbreviation"
                value={formData.abbreviation}
                onChange={handleChange}
                placeholder="e.g., UM5"
                maxLength={10}
              />
            </Field>

            <Field label="Type" required>
              <select
                className={styles.input}
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>

            <Field label="Year Established">
              <input
                className={styles.input}
                name="yearEstablished"
                value={formData.yearEstablished}
                onChange={handleChange}
                placeholder="e.g., 1957"
                maxLength={4}
              />
            </Field>

            <Field label="City" required>
              <input
                className={styles.input}
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g., Rabat"
              />
            </Field>

            <Field label="Phone Number">
              <input
                className={styles.input}
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+212 5XX XXX XXX"
              />
            </Field>

            <Field label="Email" required>
              <input
                type="email"
                className={styles.input}
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@university.ma"
              />
            </Field>

            <Field label="Address" fullWidth>
              <input
                className={styles.input}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full street address"
              />
            </Field>

            <Field label="Description" fullWidth>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="A short description of your university"
              />
            </Field>
          </div>
        ) : (
          <div className={styles.displayGrid}>
            <InfoRow
              icon={<FaUniversity />}
              label="Name"
              value={university.name}
            />
            <InfoRow label="Abbreviation" value={university.abbreviation} />
            <InfoRow label="Type" value={university.type} />
            <InfoRow
              icon={<FaCalendarAlt />}
              label="Year Established"
              value={university.yearEstablished}
            />
            <InfoRow
              icon={<FaMapMarkerAlt />}
              label="City"
              value={university.city}
            />
            <InfoRow
              icon={<FaPhone />}
              label="Phone"
              value={university.phoneNumber}
            />
            <InfoRow
              icon={<FaEnvelope />}
              label="Email"
              value={university.email}
            />
            <InfoRow
              icon={<FaMapMarkerAlt />}
              label="Address"
              value={university.address}
              fullWidth
            />
            <InfoRow
              label="Description"
              value={university.description}
              fullWidth
            />
          </div>
        )}
      </div>
    </>
  );
};

const Field = ({ label, required, fullWidth, children }) => (
  <div className={`${styles.field} ${fullWidth ? styles.fieldFull : ""}`}>
    <label className={styles.label}>
      {label} {required && <span className={styles.required}>*</span>}
    </label>
    {children}
  </div>
);

const InfoRow = ({ icon, label, value, fullWidth }) => (
  <div className={`${styles.infoRow} ${fullWidth ? styles.infoRowFull : ""}`}>
    <span className={styles.infoLabel}>
      {icon && <span className={styles.infoIcon}>{icon}</span>}
      {label}
    </span>
    <span className={styles.infoValue}>{value || "—"}</span>
  </div>
);

export default UniversityProfilePage;