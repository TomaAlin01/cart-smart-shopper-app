
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/lists");
  }, [navigate]);

  return <div>Redirecting to shopping lists...</div>;
};

export default Index;
