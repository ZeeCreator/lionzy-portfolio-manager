
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getShortLinkByCode, incrementClickCount } from "@/utils/shortLinkService";
import { toast } from "@/components/ui/sonner";

const ShortLinkRedirect = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!shortCode) {
      toast.error("Invalid short link");
      navigate("/");
      return;
    }

    const shortLink = getShortLinkByCode(shortCode);
    
    if (!shortLink) {
      toast.error("Short link not found");
      navigate("/");
      return;
    }

    if (!shortLink.active) {
      toast.error("This short link is no longer active");
      navigate("/");
      return;
    }

    // Increment click count
    incrementClickCount(shortCode);
    
    // Redirect to the original URL
    window.location.href = shortLink.originalUrl;
  }, [shortCode, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Redirecting...</h2>
        <p className="text-muted-foreground">Please wait while we redirect you to your destination.</p>
      </div>
    </div>
  );
};

export default ShortLinkRedirect;
