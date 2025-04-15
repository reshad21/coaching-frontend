import { ArrowBigUp, ArrowRight } from 'lucide-react';

const featureAccess = {admin:[1] };

export const navMain = [
    {
        title: "Shift",
        url: "#",
        icon: ArrowBigUp,
        isActive: false,
        items: [
            featureAccess["admin"]?.includes(1) && {
                title: "Shift",
                url: "/shift",
                isShow: true,
            },
            featureAccess["admin"]?.includes(1) && {
                title: "Create Shift",
                url: "/shift-create",
                isShow: true,
            },
            featureAccess["admin"]?.includes(1) && {
                title: "Update Shift",
                url: "/shift",
                isShow: false,
            },
        
        
        
        ].filter(Boolean), // Remove false values
    },
    
];
