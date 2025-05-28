"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ILoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

export default function LoadingButton  ({
  children,
  isLoading = false,
  loadingText = "Loading...",
  disabled,
  ...props
}: ILoadingButtonProps) {
  return (
    <Button disabled={isLoading || disabled} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};
