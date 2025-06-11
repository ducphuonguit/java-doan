import {useState, type FormEvent} from "react"
import {useNavigate} from "react-router-dom"
import {Eye, EyeOff} from "lucide-react"
import {useAuth} from "@/hooks/useAuth.ts"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Input} from "@/components/ui/input.tsx"
import {Button} from "@/components/ui/button.tsx"
import parseError from "@/utils/error-utils.ts";
import {toast} from "sonner";
import {AxiosError} from "axios";

export default function SignupPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()
    const {signup} = useAuth()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        // Validate passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        // Validate password length
        if (password.length < 6) {
            setError("Password must be at least 6 characters long")
            return
        }

        setIsLoading(true)

        try {
            const success = await signup(username, password)
            if (success) {
                navigate("/products")
            } else {
                setError("Failed to create account. Username may already exist.")
            }
        } catch (err) {
            if(err instanceof AxiosError){
                const errorMessage = parseError(err.response?.data);
                toast.error(errorMessage)
                return;
            }
            toast.error("An error occurred while creating your account")

        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Fruit Market Admin</CardTitle>
                    <CardDescription className="text-center">Create your account</CardDescription>
                </CardHeader>
                <CardContent>
                    {error &&
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">{error}</div>}

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

                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    label="Confirm Password"
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-2 top-[32px] h-8 w-8"
                                >
                                    {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </Button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" variant="default" disabled={isLoading}>
                            {isLoading ? "Creating account..." : "Sign Up"}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Button
                            variant="link"
                            className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800"
                            type="submit"
                            onClick={() => navigate("/login")}
                        >
                            Sign in here
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
