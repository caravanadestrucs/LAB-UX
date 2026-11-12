"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ResetUsuarioRequest } from "@/types"
import { addUser, PasswordReset } from "@/services/usuarioService"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"


export default function LoginPage() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [resetEmail, setResetEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      // Nuevo flujo httpOnly: setea cookie via Route Handler, luego backend valida
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const result = await res.json()
      if (res.ok && result.success) {
        // Mantiene compat localStorage hasta eliminar fallback (middleware ya es guard real)
        if (result.usuario) localStorage.setItem("usuario", JSON.stringify(result.usuario))
        window.location.href = "/admin/inicio"
      } else {
        setErrorMessage(result.error || result.message || "Correo o contraseña incorrectos.")
      }
    } catch (error) {
      console.error("Error en login:", error)
      setErrorMessage("Ocurrió un error inesperado.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")
    const loginData: ResetUsuarioRequest = { email: resetEmail}
    try {
      // TODO(auth): verificar que el backend implemente POST /usuarios/reset_password
      // (ENDPOINTS.USUARIOS.RESET_PASSWORD). Si aún no existe, este catch muestra
      // un mensaje accionable en vez de romper el flujo.
      const result = await PasswordReset(loginData)
      if (result.success) {
        setSuccessMessage("Te hemos enviado un correo con instrucciones para restablecer tu contraseña.")
        toast({ title: "Correo enviado", description: "Revisa tu bandeja para restablecer tu contraseña." })
      } else {
        setErrorMessage(result.error || "No se pudo enviar el correo de recuperación.")
      }
    } catch (error) {
      console.error("Error en PasswordReset:", error);
      setErrorMessage("No pudimos procesar tu solicitud. Verifica tu conexión e intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")
    try {
      if (registerPassword !== confirmPassword) {
        setErrorMessage("Las contraseñas no coinciden.")
        return
      }
      // Registro real contra POST /usuarios. Rol mínimo ("alumno") por defecto;
      // un admin puede elevarlo luego desde /admin/usuarios.
      const formData = new FormData()
      formData.append("nombre", firstName.trim())
      formData.append("apellido", lastName.trim())
      formData.append("correo", registerEmail.trim())
      formData.append("password", registerPassword)
      formData.append("tipo_usuario", "alumno")
      const result = await addUser(formData)
      if (result && (result.success !== false)) {
        setSuccessMessage("Cuenta creada. Ya puedes iniciar sesión.")
        toast({ title: "Registro exitoso", description: "Ya puedes iniciar sesión con tu cuenta." })
      } else {
        setErrorMessage(result?.error || result?.message || "No se pudo crear la cuenta.")
      }
    } catch (error) {
      console.error("Error en handleRegister:", error);
      setErrorMessage("No pudimos crear tu cuenta. Verifica los datos e intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-8">
      <h1 className="sr-only">Acceso al Laboratorio de Usabilidad</h1>
      <Toaster />
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a la página principal
        </Link>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
            <TabsTrigger value="reset">Recuperar</TabsTrigger>
          </TabsList>

          {/* Iniciar sesión */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Iniciar Sesión</CardTitle>
                <CardDescription>Ingresa tus credenciales para acceder a tu cuenta.</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm font-normal">
                      Recordarme
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
                      <strong className="font-bold">¡Ups!</strong>
                      <span className="ml-2">{errorMessage}</span>
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Registro */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Crear una cuenta</CardTitle>
                <CardDescription>Completa el formulario para registrarte.</CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input id="firstName" placeholder="Juan" required disabled={isSubmitting} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input id="lastName" placeholder="Pérez" required disabled={isSubmitting} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">Correo electrónico</Label>
                    <Input id="registerEmail" type="email" required disabled={isSubmitting} value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">Contraseña</Label>
                    <Input id="registerPassword" type="password" required disabled={isSubmitting} value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                    <Input id="confirmPassword" type="password" required disabled={isSubmitting} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm font-normal">
                      Acepto los{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        términos y condiciones
                      </Link>
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded" role="alert">
                      {errorMessage}
                    </div>
                  )}
                  {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded" role="alert">
                      {successMessage}
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Registrando..." : "Registrarse"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Recuperar contraseña */}
          <TabsContent value="reset">
            <Card>
              <CardHeader>
                <CardTitle>Recuperar contraseña</CardTitle>
                <CardDescription>
                  Ingresa tu correo electrónico para recibir instrucciones.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordReset}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resetEmail">Correo electrónico</Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      placeholder="tu@ejemplo.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex items-center rounded-md bg-primary/10 p-3 text-sm text-primary">
                    <Mail className="mr-2 h-4 w-4" />
                    Te enviaremos un enlace para restablecer tu contraseña.
                  </div>
                  {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded" role="alert">
                      {errorMessage}
                    </div>
                  )}
                  {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded" role="alert">
                      {successMessage}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Enviar instrucciones"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
