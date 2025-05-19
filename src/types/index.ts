
import { ReactNode } from "react";

export interface MainNavItem {
  title: string;
  href?: string;
  icon?: ReactNode;
  disabled?: boolean;
  external?: boolean;
}
