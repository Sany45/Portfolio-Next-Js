import AdminSidebar from "@/components/AdminSidebar"
import ClientLayout from "./ClientLayout"


const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  )
}

export default layout