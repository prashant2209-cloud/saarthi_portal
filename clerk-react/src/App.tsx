import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/clerk-react";
import { useState } from "react";

export default function App() {
  const { getToken } = useAuth();
  const [userData, setUserData] = useState<any>(null);

  const checkMongoDB = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error(err);
      setUserData({ error: "Failed to fetch" });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <header style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Clerk + MongoDB Test</h1>
        <div>
          <SignedOut>
            <SignInButton forceRedirectUrl="/" />
            <SignUpButton forceRedirectUrl="/" />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      <SignedIn>
        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
          <h2>MongoDB Verification</h2>
          <p>Click the button below to fetch your user profile from the backend (MongoDB).</p>
          <button onClick={checkMongoDB} style={{ padding: "10px 20px", cursor: "pointer" }}>
            Check MongoDB Storage
          </button>

          {userData && (
            <div style={{ marginTop: "20px", background: "#f5f5f5", padding: "10px", borderRadius: "4px" }}>
              <h3>Result:</h3>
              <pre>{JSON.stringify(userData, null, 2)}</pre>
            </div>
          )}
        </div>
      </SignedIn>
    </div>
  )
}
