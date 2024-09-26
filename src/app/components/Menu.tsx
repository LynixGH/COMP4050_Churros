import Image from "next/image";
import Link from "next/link";

const menuItems = [
    {
      title: "",
      items: [
        {
          icon: "/home.png",
          label: "Home",
          href: "/dashboard/admin",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/subject.png",
          label: "Subjects",
          href: "/list/subjects",
          visible: ["admin"],
        },
        {
          icon: "/assignment.png",
          label: "Assignments",
          href: "/list/assignments",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/calendar.png",
          label: "Events",
          href: "/list/events",
          visible: ["admin", "teacher", "student", "parent"],
        },
      ],
    },
    {
        title: "",
      items: [
        
        { //CHANGE FOR DARKMODE TOGGLE BUTTON
            
          icon: "/setting.png",
          label: "Settings",
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
                    <span className="hidden lg:block text-gray-200 font-light mg-4">{i.title}</span>
                    {i.items.map((item) => (
                        <Link href={item.href} key={item.label} className="flex items-center justify-center lg:justify-start gap-4 text-gray-100 py-2">
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