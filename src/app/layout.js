import { Provider } from "@/components/ui/provider"
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  )
}