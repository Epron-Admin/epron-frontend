export const equipment_data = [
    {
        category: 'Screens & Monitors',
        type: 'Laptops',
        quantity: 20,
        weight: 2,
        amount: 237840,
        status: 'pending',
        log_time: '23-07-2022/08:00',
    },
    {
        category: 'Large Equipment',
        type: 'Large Printing Machines',
        quantity: '18',
        weight: 2.5,
        amount: 237840,
        status: 'paid',
        log_time: '12-07-2022/20:30',
    },
    {
        category: 'Cooling & Freezing',
        type: 'Freezers',
        quantity: '10',
        weight: 3,
        amount: 237840,
        status: 'pending',
        log_time: '06-07-2022/14:00',
    },
    {
        category: 'Small IT',
        type: 'Phones',
        quantity: '16',
        weight: 4,
        amount: 237840,
        status: 'paid',
        log_time: '29-07-2022/10:00',
    },
    {
        category: 'Lamps',
        type: 'LED lamps',
        quantity: '20',
        weight: 2,
        amount: 2370,
        status: 'pending',
        log_time: '23-07-2022/18:30',
    },
]

export const equipment_headers = ['Equipment Category', 'Equipment Type', 'Quantity', 'Weight (Tons)', "Amount (₦)", 'Payment Status', 'Date logged']

export const payment_data = [
    {
        invoice_number: 'EPRON34875',
        total: 10000,
        description: 'Samsung Televisions',
        time: '12-09-2022/10:00',
        paid: true,
    },
    {
        invoice_number: 'EPRON89756',
        total: 1500,
        description: 'Washing Machine',
        time: '18-10-2022/21:20',
        paid: false,
    },
    {
        invoice_number: 'EPRON09847',
        total: 2000,
        description: 'Vacuum Cleaner',
        time: '25-02-2022/09:30',
        paid: false,
    },
    {
        invoice_number: 'EPRON98753',
        total: 18000,
        description: 'Samsung LED Monitor',
        time: '13-01-2023/16:40',
        paid: true,
    },
    {
        invoice_number: 'EPRON09321',
        total: 1000,
        description: 'Samsung Galaxy s5',
        time: '16-12-2022/18:50',
        paid: false,
    }
]

export const payment_headers  = ['Invoice Number', 'Amount (NGN)', 'Description', 'Date/Time Created', 'Status']


export const user_data = [
    {
        name: "Christian Madufor",
        email: "chris@epron.com",
        phone: "08099192345",
        created: "Nov 01, 2022",
        status: "active"
    },
    {
        name: "Hope Aguonye",
        email: "hope@epron.com",
        phone: "09054199873",
        created: "Nov 01, 2022",
        status: "active"
    },
    {
        name: "Charles Amos",
        email: "charles@epron.com",
        phone: "07028756342",
        created: "Nov 02, 2022",
        status: "active"
    },
    {
        name: "Adebisi Saheed",
        email: "bisi@epron.com",
        phone: "09028736539",
        created: "Nov 02, 2022",
        status: "inactive"
    },
]