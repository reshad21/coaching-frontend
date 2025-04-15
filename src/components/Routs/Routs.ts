import { CircleUser } from "lucide-react";

const featureAccess = {admin:[1] };

export const navMain = [
    {
        title: "User",
        url: "#",
        icon: CircleUser,
        isActive: false,
        items: [
            featureAccess["admin"]?.includes(1) && {
                title: "Student",
                url: "/view-student",
                isShow: true,
            },
            featureAccess["admin"]?.includes(1) && {
                title: "Create Student",
                url: "/create-student",
                isShow: true,
            },
        
        ].filter(Boolean),
    },
    
    
];
