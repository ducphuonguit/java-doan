import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import {useAuth} from "@/hooks/useAuth.ts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {AxiosError} from "axios";
import parseError from "@/utils/error-utils.ts";
import {toast} from "sonner";

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(username, password)
      if (success) {
        navigate("/products")
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      if(err instanceof AxiosError){
        const errorMessage = parseError(err.response?.data);
        toast.error(errorMessage)
        return;
      }
      toast.error("Invalid username or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Fruit Market Admin</CardTitle>
            <CardDescription className="text-center">Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                  label="Username"
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
              />

              <div className="space-y-2">
                <div className="relative">
                  <Input
                      label="Password"
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />
                  <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-[32px] h-8 w-8"
                  >
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </Button>

                </div>
              </div>

              <Button type="submit" className="w-full" variant="default" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Button
                    variant="link"
                    className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800"
                    type="button"
                    onClick={() => navigate("/signup")}
                >
                  Sign up here
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  )
}
