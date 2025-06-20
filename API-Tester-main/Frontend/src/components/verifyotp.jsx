import React, { useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const email = location.state?.email || "";
  const [secondsLeft, setSecondsLeft] = useState(60);

    useEffect(() => {
    if (secondsLeft === 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || !email) {
      alert("OTP or Email missing");
      return;
    }


    try {
      await API.post("/users/verify-otp", { email, otp });
      alert("OTP verified successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };
 const handleResendOtp = async () => {
  if (!email) return;
  try {
    const res = await API.post("/users/resend-otp", { email }); // ✅ store response
    alert("OTP resent successfully");
    console.log("Resend OTP Success:", res.data); // ✅ now this works
    setSecondsLeft(60); // restart timer
  } catch (err) {
    console.error("Resend OTP Error:", err.response?.data || err.message); // ✅ more clear
    alert(err.response?.data?.msg || "Failed to resend OTP");
  }
};

 
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Verify OTP</h2>
        <form onSubmit={handleVerify} className="space-y-4">
          <p className="text-sm text-gray-600 mb-2">
            Please enter the OTP sent to your email: <strong>{email}</strong>
          </p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Verify OTP
          </button>

          <p className="text-xs text-gray-500 text-center">
            OTP expires in: {secondsLeft}s
          </p>
           <button
            type="button"
            disabled={secondsLeft > 0}
            onClick={handleResendOtp}
            className={`text-sm w-full text-center mt-2 ${
              secondsLeft > 0 ? "text-gray-400 cursor-not-allowed" : "text-indigo-600 hover:underline"
            }`}
          >
            Resend OTP
          </button>

        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
