import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function LoginBanner() {
  return (
    <Alert variant="default" className="max-w-2xl mx-auto mt-[33vh]">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Authentication Required</AlertTitle>
      <AlertDescription>
        Please log in to your GitHub account using the button in the top right corner to access your repositories.
      </AlertDescription>
    </Alert>
  )
}

