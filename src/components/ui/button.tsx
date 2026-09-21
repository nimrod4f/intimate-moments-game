import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary"|"secondary"|"ghost"|"category" };
export function Button({ className, variant="primary", ...props }: Props) {
 return <button className={cn("button-base", `button-${variant}`, className)} {...props} />;
}
