import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva("button-base", {
  variants: {
    variant: {
      default: "button-primary",
      primary: "button-primary",
      secondary: "button-secondary",
      outline: "button-secondary",
      ghost: "button-ghost",
      link: "button-ghost underline",
      destructive: "button-primary",
      category: "button-secondary",
    },
    size: {
      default: "",
      sm: "min-h-9 px-3 text-sm",
      lg: "min-h-14 px-6",
      icon: "h-11 w-11 min-h-0 p-0",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  },
);
Button.displayName = "Button";
