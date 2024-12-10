import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { useTheme } from "next-themes"
import DarkModeToggle from "./DarkModeToggle"

export function Header() {
//   const { setTheme } = useTheme()

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-2xl font-bold bg-clip-text from-primary to-primary-foreground">
          GitHub Issue Tracker
        </h1>
        <DarkModeToggle />

      </div>
    </header>
  )
}

