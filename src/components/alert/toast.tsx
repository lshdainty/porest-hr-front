
import { Toaster as Sonner } from "sonner";
import { toast as sonnerToast } from "sonner";
import { useTheme } from "@/components/shadcn/themeProvider";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-card-foreground group-[.toast]:opacity-90",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

const toast = {
  success: (message: string) => {
    sonnerToast.success("성공", {
      description: message,
    });
  },
  error: (message: string) => {
    sonnerToast.error("오류", {
      description: message,
    });
  },
  info: (message: string) => {
    sonnerToast.info("정보", {
        description: message,
    });
  },
  message: (title: string, message: string) => {
    sonnerToast.message(title, {
        description: message,
    })
  }
};

export { Toaster, toast };
