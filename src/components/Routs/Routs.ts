import { ArrowBigUp, CircleDollarSign, CircleSlash2Icon, CircleSlashIcon, CircleUser, DatabaseZapIcon, PcCase } from "lucide-react";

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
    title: "Pyment",
    url: "#",
    icon: CircleSlashIcon,
    isActive: false,
    items: [
      featureAccess["admin"]?.includes(1) && {
        title: "Admission Fees",
        url: "/admission-payment",
        isShow: true,
      },
      featureAccess["admin"]?.includes(1) && {
        title: "Monthly Fees",
        url: "/monthly-payment",
        isShow: true,
      },
      featureAccess["admin"]?.includes(1) && {
        title: "Payment History",
        url: "/payment-status",
        isShow: true,
      },
      
    ].filter(Boolean), // Remove false values
  },
  {
    title: "Class",
    url: "#",
    icon: PcCase,
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
    icon: DatabaseZapIcon,
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
