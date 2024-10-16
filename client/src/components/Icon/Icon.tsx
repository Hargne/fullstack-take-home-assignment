import styles from "./Icon.module.css";
import { icons } from "./icons";

export type IconProps = {
  variant: keyof typeof icons;
  fill?: string;
  size?: "small" | "medium" | "large";
  indent?: "left" | "right";
};

export default function Icon({
  variant,
  fill,
  size = "medium",
  indent,
}: IconProps) {
  const SVG = icons[variant];
  return (
    <div
      className={`${styles.icon} ${styles[size]} ${
        indent ? styles[`indent-${indent}`] : ""
      }`}
      style={{ fill }}
    >
      <SVG />
    </div>
  );
}
