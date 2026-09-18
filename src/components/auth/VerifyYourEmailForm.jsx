
import { useEffect, useRef, useState } from "react";
import authApi from "../../api/authApi";
import styles from "./signup.module.css";

const VerifyYourEmailForm = ({
  email,
  formData,
  handleChange,
  nextStep,
  prevStep,
  isSubmit,
  setIsSubmit
}) => {
  const isComplete = formData.verificationCode.length === 6;
  const [error, setError] = useState(null);

  const inputRefs = useRef([]);

  // Focus first input when component appears
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleClick = async () => {
    setIsSubmit(true);
    let isCodeValid;

    try {
      if (isComplete) {
        isCodeValid = await authApi.isVerificationCodeValid(
          formData.email,
          formData.verificationCode
        );

        setError(!isCodeValid ? `Code expired or not found.` : null);
        isCodeValid ? nextStep() : undefined;
      }
    } catch (error) {
      setError(error.message);
    }

    setIsSubmit(false);
  };

  const sendVerificationCode = async () => {
    try {
      await authApi.sendVerificationCode(formData.email);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCodeChange = (e, index) => {
    const value = e.target.value;

    // Only allow one digit
    if (!/^\d?$/.test(value)) return;

    const newCode = formData.verificationCode.split("");

    newCode[index] = value;

    handleChange({
      target: {
        name: "verificationCode",
        value: newCode.join("")
      }
    });

    // Move focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      // If current input has a value, clear it first
      if (formData.verificationCode[index]) {
        const newCode = formData.verificationCode.split("");

        newCode[index] = "";

        handleChange({
          target: {
            name: "verificationCode",
            value: newCode.join("")
          }
        });

        return;
      }

      // If current input is empty, move to previous input
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedCode = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedCode) return;

    handleChange({
      target: {
        name: "verificationCode",
        value: pastedCode
      }
    });

    // Focus the input after the pasted code
    const nextIndex = Math.min(pastedCode.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={styles.formCard}>
      <h2>Verify your email</h2>

      <p className={styles.subtitle}>
        We sent a code to {email || "your email"}
      </p>

      <div className={styles.verificationInput}>
        {[...Array(6)].map((_, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            name="verificationCode"
            value={formData.verificationCode[i] || ""}
            onChange={(e) => handleCodeChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
          />
        ))}
      </div>

      <p className={styles.resendLink}>
        Didn't get a code?{" "}
        <button onClick={sendVerificationCode}>
          Click to resend
        </button>
      </p>

      {error && <p className={styles.error}>{error}</p>}

      <button
        disabled={isSubmit || !isComplete}
        className={`${styles.btnContinue} ${
          isComplete ? styles.active : styles.disabled
        }`}
        onClick={handleClick}
      >
        Continue
      </button>

      <div className={styles.navigationLinks}>
        <button className={styles.linkBtn} onClick={prevStep}>
          Back
        </button>
      </div>
    </div>
  );
};

export default VerifyYourEmailForm;
