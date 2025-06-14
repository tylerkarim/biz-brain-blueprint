
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface GoBackButtonProps {
  to?: string;
  label?: string;
}

export const GoBackButton = ({ to = "/dashboard", label = "Go Back" }: GoBackButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      onClick={() => navigate(to)}
      className="mb-6 text-gray-600 hover:text-gray-900 font-medium"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
};
