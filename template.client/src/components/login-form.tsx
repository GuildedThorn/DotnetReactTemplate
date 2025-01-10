import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Link, useNavigate} from "react-router-dom";

export function LoginForm() {
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      navigate('/');
      // Add any login handler here, e.g., redirect to a dashboard
    } else {
      alert("Login failed");
    }
  };

  return (
      <div className="login-container"> {/* Centering container */}
        <Card className="mx-auto max-w-sm">
          <form onSubmit={handleSubmit}> {/* Wrap the form around the input fields */}
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your username and password below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      type="text"
                      placeholder="Username"
                      required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link to="#" className="ml-auto inline-block text-sm underline">
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      placeholder="Password"
                      required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
  );
}
