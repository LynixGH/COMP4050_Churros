import Image from "next/image";
import Link from "next/link";

const menuItems = [
    {
      title: "",
      items: [
        {
          icon: "/home.png",
          label: "Home",
          href: "http://localhost:3000/dashboard/userDashboard",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/assignment.png",
          label: "Rubric",
          href: "http://localhost:3000/dashboard/rubricGen",
          visible: ["admin", "teacher", "student", "parent"],
        },
      ],
    },
    {
        title: "",
      items: [
        
        { //CHANGE FOR DARKMODE TOGGLE BUTTON
            
          icon: "/Dark Mode.png",
          label: "Placeholder for DarkMode",
          href: "/settings",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/logout.png",
          label: "Logout",
          href: "/logout",
          visible: ["admin", "teacher", "student", "parent"],
        },
      ],
    },
  ];

const Menu = () => {
    return (
        <div className=''>
            {menuItems.map((i) => (
                <div className='flex flex-col gap-2' key={i.title}>
                    <span className="hidden lg:block text-gray-700 font-light mg-4">{i.title}</span>
                    {i.items.map((item) => (
                        <Link href={item.href} key={item.label} className="flex items-center justify-center lg:justify-start gap-4 text-gray-700 py-2">
                            <Image src={item.icon} alt="" width={20} height={20}/>
                            <span className="hidden lg:block">{item.label}</span>
                        </Link>
                    ))}
                    </div>
            )
            )}
        </div>
    )
}

export default Menu