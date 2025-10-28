import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "admin" && password === "1234") {
      setError("");
      navigate("/dashboard");
    } else {
      setError("Invalid credentials. Try admin / 1234");
    }
  };

  const handleForgotPassword = () => {
    alert("Forgot password request sent! (Demo only)");
  };

  const handleAppealAdmin = () => {
    alert("Your appeal to admin has been submitted! (Demo only)");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 font-sans">
      <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-10 w-full max-w-md border border-blue-100">
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 tracking-tight">
            MEROBase
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            MERO Foundation Database Collection
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Email / Username
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter 1234"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 active:scale-[0.98] transition-transform shadow-md"
          >
            Login
          </button>
        </form>

        {/* Options */}
        <div className="flex justify-between mt-6 text-sm text-blue-900">
          <button onClick={handleForgotPassword} className="hover:underline">
            Forgot Password?
          </button>
          <button onClick={handleAppealAdmin} className="hover:underline">
            Appeal to Admin
          </button>
        </div>

        <p className="text-center text-gray-500 mt-8 text-xs">
          © 2025 MERO Foundation | All Rights Reserved
        </p>
      </div>
    </div>
  );
}
