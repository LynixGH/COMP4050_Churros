import Menu from "@/app/components/Menu";
import NavBar from "@/app/components/NavBar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="h-screen flex">
    {/*LEFT*/}
    <div className='w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4'>
      <Link href ="/" className="flex items-center justify-center lg:justify-start gap-2">
      <Image src="/mqlogo_S.png" alt="logo" width={32} height={32}/>
      <span className="hidden lg:block">VivaMQ</span>
      </Link>
      <Menu/>
    </div>
    {/*RIGHT*/}
    <div className='w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%]'>
      <NavBar />
      {children}
    </div>
  </div>;
}
