import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Props for the AuthForm component.
 */
export interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The source URL or base64 string for the company logo.
   */
  logoSrc: string;
  /**
   * Alt text for the company logo for accessibility.
   */
  logoAlt?: string;
  /**
   * The main title of the form.
   */
  title: string;
  /**
   * A short description or subtitle displayed below the title.
   */
  description?: string;
  /**
   * The primary call-to-action button (e.g., social login).
   */
  primaryAction: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  };
  /**
   * An array of secondary action buttons.
   */
  secondaryActions?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }[];
  /**
   * An optional custom children block (e.g. email input, alerts)
   */
  children?: React.ReactNode;
  /**
   * An optional action for skipping the login process.
   */
  skipAction?: {
    label: string;
    onClick: () => void;
  };
  /**
   * Custom content to be displayed in the footer area.
   */
  footerContent?: React.ReactNode;
}

/**
 * A reusable authentication form component built with shadcn/ui.
 * It supports various providers, a customizable header, and animations.
 */
const AuthForm = React.forwardRef<HTMLDivElement, AuthFormProps>(
  (
    {
      className,
      logoSrc,
      logoAlt = "Company Logo",
      title,
      description,
      primaryAction,
      secondaryActions,
      children,
      skipAction,
      footerContent,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("flex flex-col items-center justify-center w-full", className)}>
        <Card
          ref={ref}
          className={cn(
            "w-full max-w-sm border-neutral-800 bg-[#161616] text-neutral-100 shadow-2xl rounded-3xl overflow-hidden",
            // Entrance Animation from tailwindcss-animate / tw-animate-css
            "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-500"
          )}
          {...props}
        >
          <CardHeader className="text-center pb-2 pt-6">
            {/* Logo rendered from src */}
            <div className="mb-4 flex justify-center">
              <img src={logoSrc} alt={logoAlt} className="h-12 w-12 object-contain rounded-xl shadow-md border border-white/10" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">{title}</CardTitle>
            {description && <CardDescription className="text-xs text-neutral-400 mt-1">{description}</CardDescription>}
          </CardHeader>
          <CardContent className="grid gap-3.5 px-6 pt-2 pb-6">
            {/* Custom Children (e.g. Email/Password fields or alerts) */}
            {children}

            {/* Primary Action Button */}
            <Button 
              onClick={primaryAction.onClick} 
              disabled={primaryAction.disabled}
              className="w-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs py-5 rounded-xl transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {primaryAction.icon}
              <span className="ml-2">{primaryAction.label}</span>
            </Button>

            {/* "OR" separator */}
            {secondaryActions && secondaryActions.length > 0 && (
              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-mono">
                  <span className="bg-[#161616] px-2 text-neutral-500 font-semibold">or</span>
                </div>
              </div>
            )}

            {/* Secondary Action Buttons */}
            <div className="grid gap-2">
              {secondaryActions?.map((action, index) => (
                <Button 
                  key={index} 
                  variant="secondary" 
                  disabled={action.disabled}
                  className="w-full bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 font-medium text-xs py-5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer" 
                  onClick={action.onClick}
                >
                  {action.icon}
                  <span className="ml-2">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>

          {/* Skip Action Button */}
          {skipAction && (
            <CardFooter className="flex flex-col px-6 pb-6 pt-0">
              <Button 
                variant="outline" 
                className="w-full bg-transparent hover:bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800 text-xs py-5 rounded-xl transition-all hover:scale-[1.02] cursor-pointer" 
                onClick={skipAction.onClick}
              >
                {skipAction.label}
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Footer */}
        {footerContent && (
          <div className="mt-6 w-full max-w-sm px-6 text-center text-xs text-neutral-500 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-500 [animation-delay:200ms]">
            {footerContent}
          </div>
        )}
      </div>
    );
  }
);
AuthForm.displayName = "AuthForm";

export { AuthForm };
export default AuthForm;
