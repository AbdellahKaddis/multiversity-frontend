// src/SignUp/YourPasswordForm.jsx
import { toast } from "react-toastify";
import styles from "../signup.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import applicantApi from "../../../api/applicantApi";

const YourPasswordForm = ({ formData, handleChange, isSubmit, setIsSubmit, prevStep }) => {
  const isPasswordMatch = formData.password === formData.confirmPassword;

  const rules = [
    { test: (p) => p.length >= 8,      message: "At least 8 characters" },
    { test: (p) => /[A-Z]/.test(p),    message: "At least one uppercase letter (A-Z)" },
    { test: (p) => /[a-z]/.test(p),    message: "At least one lowercase letter (a-z)" },
    { test: (p) => /\d/.test(p),       message: "At least one digit (0-9)" },
    { test: (p) => /\W/.test(p),       message: "At least one special character (e.g. !@#$%)" },
  ];
  const [errors, setErrors] = useState({});
  const isPasswordValid = (password) => {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/\d/.test(password)) return false;
    if (!/\W/.test(password)) return false;
    return true;
  };

  const isValid = isPasswordMatch && isPasswordValid(formData.password);
const navigate = useNavigate()
    const handleClick = async () => {
    setIsSubmit(true);
    try {
      if (isValid) {
          const { firstName, lastName, password, email } = formData;
          const { status } = await applicantApi.createApplicant({
            firstName, lastName, password, email,
          });

          if (status === 201) {
            setErrors({});

                toast.success("🎉 Account created successfully. Redirecting...", {
                  onClose: () => {
                    navigate("/login/student");
                  },
                });
              }
            }
    } catch (error) {
      setErrors((prev) => ({ ...prev, netErr: error.message }));
    }
    setIsSubmit(false);
  };
  return (
    <div className={styles.formCard}>
      <h2>Create password</h2>
      <p className={styles.subtitle}>Choose a secure password</p>

      <div className={styles.inputGroup}>
        <label>Password*</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Choose a password"
        />
      </div>

      <ul className={styles.rulesList}>
        {rules.map((rule, index) => {
          const ok = rule.test(formData.password);
          return (
            <li
              key={index}
              className={`${styles.ruleItem} ${ok ? styles.ruleValid : styles.ruleInvalid}`}
            >
              {ok ? "✔" : "✖"} {rule.message}
            </li>
          );
        })}
      </ul>

      <div className={styles.inputGroup}>
        <label>Confirm Password*</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
        />
      </div>

      {!isPasswordMatch && formData.confirmPassword ? (
        <p className={styles.error}>Password does not match.</p>
      ) : null}

   {errors.netErr && <p className={styles.error}>{errors.netErr}</p>}
            <button
              disabled={isSubmit || !isValid}
              className={`${styles.btnContinue} ${isValid ? styles.active : styles.disabled}`}
              onClick={handleClick}
            >
              Complete Registration
            </button>

      <div className={styles.navigationLinks}>
        <button className={styles.linkBtn} onClick={prevStep}>
          Back
        </button>
      </div>
    </div>
  );
};

export default YourPasswordForm;