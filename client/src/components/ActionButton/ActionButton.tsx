import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from "react";
import Icon, { IconProps } from "~/components/Icon/Icon";
import styles from "./ActionButton.module.css";

type ActionButtonProps = {
  icon: IconProps["variant"];
  variant?: "default" | "no-background";
  inverted?: boolean;
  active?: boolean;
  size?: "small" | "medium" | "large";
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    {
      icon,
      inverted,
      variant = "default",
      active,
      size = "medium",
      ...buttonProps
    },
    ref
  ) => {
    return (
      <button
        {...buttonProps}
        className={`${styles.actionButton} ${styles[variant]} ${
          active ? styles.active : ""
        } ${inverted ? styles.inverted : ""}`}
        ref={ref}
      >
        <Icon variant={icon} size={size} />
      </button>
    );
  }
);
ActionButton.displayName = "ActionButton";
export default ActionButton;
