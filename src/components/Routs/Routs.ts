import { ArrowBigUp, BadgeDollarSign, CircleUser, DatabaseZapIcon, MessagesSquare, School } from "lucide-react";

const featureAccess = { admin: [1] };

export const navMain = [
  {
    title: "User",
    url: "#",
    icon: CircleUser,
    isActive: false,
    items: [
      featureAccess["admin"]?.includes(1) && {
        title: "All Students",
        url: "/view-student",
        isShow: true,
        parent: "User",
      },
      featureAccess["admin"]?.includes(1) && {
        title: "Create Student",
        url: "/create-student",
        isShow: true,
        parent: "User",
      },
      featureAccess["admin"]?.includes(1) && {
        title: "Update Student",
        url: "/update-student/:id",
        isShow: false,
        parent: "User",
      },
      featureAccess["admin"]?.includes(1) && {
        title: "Student Details",
        url: "/view-student/:id",
        isShow: false,
        parent: "User",
      },
    ].filter(Boolean),
  },

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
        isShow: false,
      },
      featureAccess["admin"]?.includes(1) && {
        title: "Update Shift",
        url: "/shift",
        isShow: false,
      },
    ].filter(Boolean), // Remove false values
  },

  {
    title: "Payment",
    url: "#",
    icon: BadgeDollarSign,
    isActive: false,
    items: [
      featureAccess["admin"]?.includes(1) && {
        title: "Payment Details",
        url: "/payment/:id",
        isShow: false,
        parent: "Payment",
      },
      featureAccess["admin"]?.includes(1) && {
        title: "Monthly Fees",
        url: "/monthly-payment",
        isShow: true,
        parent: "Payment",
      },
      featureAccess["admin"]?.includes(1) && {
        title: "Payment History",
        url: "/payment-status",
        isShow: true,
        parent: "Payment",
      },

    ].filter(Boolean), // Remove false values
  },

  {
    title: "Expense",
    url: "#",
    icon: BadgeDollarSign,
    isActive: false,
    items: [
      featureAccess["admin"]?.includes(1) && {
        title: "Expense Details",
        url: "/expense/:id",
        isShow: false,
        parent: "Expense",
      },
      featureAccess["admin"]?.includes(1) && {
        title: "Create Expense",
        url: "/create-expense",
        isShow: true,
        parent: "Expense",
      },
      featureAccess["admin"]?.includes(1) && {
        title: "Show Expense",
        url: "/show-expense",
        isShow: true,
        parent: "Expense",
      },

    ].filter(Boolean), // Remove false values
  },

  {
    title: "Class",
    url: "#",
    icon: School,
    isActive: false,
    items: [
      featureAccess["admin"]?.includes(1) && {
        title: "Class",
        url: "/class",
        isShow: true,
      },
      featureAccess["admin"]?.includes(1) && {
        title: "Create Class",
        url: "/class-create",
        isShow: false,
      },
      featureAccess["admin"]?.includes(1) && {
        title: "Update Class",
        url: "/update-class/:id",
        isShow: false,
      },
    ].filter(Boolean), // Remove false values
  },
  {
    title: "Batch",
    url: "#",
    icon: DatabaseZapIcon,
    isActive: false,
    items: [
      featureAccess["admin"]?.includes(1) && {
        title: "Batch",
        url: "/batch",
        isShow: true,
      },
      featureAccess["admin"]?.includes(1) && {
        title: "Create Batch",
        url: "/class-batch",
        isShow: false,
      },
      featureAccess["admin"]?.includes(1) && {
        title: "Update Batch",
        url: "/update-batch/:id",
        isShow: false,
      },
    ].filter(Boolean), // Remove false values
  },
  {
    title: "Message",
    url: "#",
    icon: MessagesSquare,
    isActive: false,
    items: [
      featureAccess["admin"]?.includes(1) && {
        title: "Message",
        url: "/message",
        isShow: true,
      },
    ].filter(Boolean), // Remove false values
  },
];
