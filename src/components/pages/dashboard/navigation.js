export const navLinks = {
  manufacturer: [
    // {
    //   name: "Payments",
    //   link: "payments",
    //   icon: "fa-credit-card",
    // },
    {
      name: "Settings",
      link: "settings",
      icon: "fa-cogs",
    },
  ],
  recycler: [
    {
      name: "Centres",
      link: "centres",
      icon: "fa-building-user",
    },
    {
      name: "Settings",
      link: "settings",
      icon: "fa-cogs",
    },
  ],
  collector: [
    {
      name: "Pickups",
      link: "requests",
      icon: "fa-truck",
    },
    {
      name: "Settings",
      link: "settings",
      icon: "fa-cogs",
    },
  ],
  epron: [
    {
      name: "All Equipment",
      link: "equipment",
      icon: "fa-list",
    },
    {
      name: "All E-wastes",
      link: "ewastes",
      icon: "fa-trash",
    },
    {
      name: "Recycle Logs",
      link: "recycle-logs",
      icon: "fa-recycle",
    },
    {
      name: "Pickups",
      link: "pickups",
      icon: "fa-truck",
    },
    {
      name: "Users",
      link: "users",
      icon: "fa-users",
    },
    // {
    //   name: "Payments",
    //   link: "payments",
    //   icon: "fa-credit-card",
    // },
    {
      name: "Settings",
      link: "settings",
      icon: "fa-cogs",
    },
  ],
};

export const cardInfo = {
  manufacturer: [
    "Equipment logged",
    "Weight logged (tons)",
    "Amount paid (₦)",
    "Logs paid",
    "Logs not paid",
    "Amount not paid (₦)"
  ],
  recycler: [
    "Total volume of E-wastes received",
    "Count of recycle logs",
    // "Total payments received",
  ],
  collector: [
    "Count of E-waste logged",
    "Total weight logged (tons)",
    "Count of logs recycled"
  ],
  epron_collector: [
    "Count of E-waste logged",
    "Total weight logged (tons)",
    "Count of logs recycled",
    "Ready for recycle",
    "Not ready for recycle",
    "Not recycled",
  ],
  epron: [
    "Equipment logged",
    "Weight logged (tons)",
    "Amount paid (₦)",
    "Logs paid",
    "Logs not paid",
    "Amount not paid (₦)"
  ],
};

export const cardData = {
  manufacturer: {
    count: "12",
    weight: "30",
    amount: "140350",
  },
  recycler: {
    volume: "45",
    request: "5",
    amount: "50350",
  },
  collector: {
    volume: "45",
    request: "5",
    amount: "50350",
  },
  epron: {
    payment: "0",
    payment1: "0",
    payment2: "0",
    payment3: "0",
    payment4: "0",
    payment5: "0",
    payment6: "0",
    payment7: "0",
    payment8: "0",
  }
};
