import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from "react";
import styles from "./Button.module.css";

type ButtonProps = {
  type?: string;
  variant?: "success" | "error";
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "success", ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className={`${styles.button} ${styles[variant]}`}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
