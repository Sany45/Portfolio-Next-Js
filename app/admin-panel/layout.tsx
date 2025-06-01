import AdminSidebar from "@/components/AdminSidebar"


const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex w-full justify-between">
      <AdminSidebar />
      <div className="flex-grow">
        {children}
      </div>
    </div>
  )
}

export default layout