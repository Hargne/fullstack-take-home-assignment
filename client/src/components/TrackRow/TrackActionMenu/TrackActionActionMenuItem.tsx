import { PropsWithChildren } from "react";
import Icon, { IconProps } from "~/components/Icon/Icon";
import styles from "./TrackActionMenu.module.css";

export type TrackActionMenuItemProps = {
  label: string;
  onClick?: () => void;
  onMouseOver?: () => void;
  icon?: IconProps["variant"];
  variant?: "primary";
  hidden?: boolean;
  selected?: boolean;
};

const TrackActionMenuItem = (
  props: PropsWithChildren<TrackActionMenuItemProps>
) => {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (props.onClick) {
      props.onClick();
    }
  }

  return (
    <li
      className={`${styles.actionMenuItem} ${
        props.variant ? styles[props.variant] : ""
      } ${props.hidden ? styles.hidden : ""}`}
      role="listitem"
      aria-label={props.label}
      aria-selected={props.selected}
    >
      <a href="#" onClick={handleClick} onMouseOver={props.onMouseOver}>
        {props.children ?? props.label}
        {props.icon && (
          <Icon variant={props.icon} indent="right" size="small" />
        )}
      </a>
    </li>
  );
};
TrackActionMenuItem.displayName = "TrackActionMenuItem";
export default TrackActionMenuItem;
