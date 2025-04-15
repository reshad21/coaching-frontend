const featureAccess = {admin:[1] };

export const navMain = [
    {
        title: "User",
        url: "#",
        icon: "",
        isActive: false,
        items: [
            featureAccess["admin"]?.includes(1) && {
                title: "Test",
                url: "/test",
                isShow: true,
            },
        
        ].filter(Boolean), // Remove false values
    },
    
];
