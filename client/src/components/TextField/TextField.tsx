import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";
import styles from "./TextField.module.css";

type TextFieldProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (inputProps, ref) => {
    return <input {...inputProps} ref={ref} className={styles.textField} />;
  }
);
TextField.displayName = "TextField";
export default TextField;
