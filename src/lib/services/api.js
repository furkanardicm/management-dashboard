// Fake API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Örnek şirketler listesi
const companies = [
  { id: 1, name: 'Teknoloji A.Ş.', contact: 'Ahmet Yılmaz', phone: '555-0101', status: 'active' },
  { id: 2, name: 'Yazılım Çözümleri Ltd.', contact: 'Mehmet Demir', phone: '555-0102', status: 'active' },
  { id: 3, name: 'Dijital Sistemler A.Ş.', contact: 'Ayşe Kaya', phone: '555-0103', status: 'active' },
  { id: 4, name: 'İnovasyon Teknoloji Ltd.', contact: 'Fatma Şahin', phone: '555-0104', status: 'active' },
  { id: 5, name: 'Bilişim Hizmetleri A.Ş.', contact: 'Ali Yıldız', phone: '555-0105', status: 'active' }
];

// Örnek projeler listesi
const projects = [
  { id: 'project1', name: 'E-Ticaret Platformu', company: companies[0].name },
  { id: 'project2', name: 'Mobil Uygulama Geliştirme', company: companies[1].name },
  { id: 'project3', name: 'Bulut Altyapı Projesi', company: companies[2].name }
];

// Kullanıcılar API
export const usersApi = {
  async getUsers() {
    await delay(500);
    return [
      { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@teknoloji.com', role: 'PROJECT_MANAGER', company: companies[0].name },
      { id: 2, name: 'Mehmet Demir', email: 'mehmet@yazilim.com', role: 'ACCOUNTANT', company: companies[1].name },
      { id: 3, name: 'Ayşe Kaya', email: 'ayse@dijital.com', role: 'PROJECT_MANAGER', company: companies[2].name },
      { id: 4, name: 'Fatma Şahin', email: 'fatma@inovasyon.com', role: 'ACCOUNTANT', company: companies[3].name },
      { id: 5, name: 'Ali Yıldız', email: 'ali@bilisim.com', role: 'PROJECT_MANAGER', company: companies[4].name }
    ];
  }
};

// Sponsor Firmalar API
export const sponsorsApi = {
  async getSponsors() {
    await delay(500);
    return companies;
  },

  async createSponsor(data) {
    await delay(500);
    const newSponsor = {
      id: companies.length + 1,
      name: data.name,
      contact: data.contact,
      phone: data.phone,
      status: 'active'
    };
    companies.push(newSponsor);
    return newSponsor;
  }
};

// Siparişler API
let orders = [
  { 
    id: 1, 
    customerName: companies[0].name,
    contact: companies[0].contact,
    phone: companies[0].phone,
    amount: 1500.50, 
    date: '2024-01-15', 
    status: 'pending',
    project: projects[0].id,
    projectName: projects[0].name,
    items: [
      { description: 'Frontend Geliştirme', quantity: 1, unitPrice: 1000.00, amount: 1000.00 },
      { description: 'API Entegrasyonu', quantity: 1, unitPrice: 500.50, amount: 500.50 }
    ]
  },
  { 
    id: 2, 
    customerName: companies[1].name,
    contact: companies[1].contact,
    phone: companies[1].phone,
    amount: 2750.75, 
    date: '2024-01-14', 
    status: 'approved',
    project: projects[1].id,
    projectName: projects[1].name,
    items: [
      { description: 'Mobil Uygulama Tasarımı', quantity: 1, unitPrice: 1500.00, amount: 1500.00 },
      { description: 'Backend Geliştirme', quantity: 1, unitPrice: 1250.75, amount: 1250.75 }
    ]
  },
  { 
    id: 3, 
    customerName: companies[2].name,
    contact: companies[2].contact,
    phone: companies[2].phone,
    amount: 950.25, 
    date: '2024-01-13', 
    status: 'rejected',
    project: projects[2].id,
    projectName: projects[2].name,
    items: [
      { description: 'Sistem Analizi', quantity: 1, unitPrice: 950.25, amount: 950.25 }
    ]
  },
  { 
    id: 4, 
    customerName: companies[3].name,
    contact: companies[3].contact,
    phone: companies[3].phone,
    amount: 3200.00, 
    date: '2024-01-20', 
    status: 'pending',
    project: projects[0].id,
    projectName: projects[0].name,
    items: [
      { description: 'Veritabanı Optimizasyonu', quantity: 1, unitPrice: 1700.00, amount: 1700.00 },
      { description: 'Performans İyileştirme', quantity: 1, unitPrice: 1500.00, amount: 1500.00 }
    ]
  },
  { 
    id: 5, 
    customerName: companies[4].name,
    contact: companies[4].contact,
    phone: companies[4].phone,
    amount: 1800.50, 
    date: '2024-01-18', 
    status: 'approved',
    project: projects[1].id,
    projectName: projects[1].name,
    items: [
      { description: 'UI/UX Tasarım', quantity: 1, unitPrice: 1800.50, amount: 1800.50 }
    ]
  }
];

export const ordersApi = {
  getOrders: async () => {
    await delay(500);
    return [...orders];
  },

  updateOrderStatus: async (orderId, newStatus) => {
    await delay(500);
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Sipariş bulunamadı');
    }
    orders[orderIndex] = { ...orders[orderIndex], status: newStatus };
    return { success: true, message: 'Sipariş durumu güncellendi' };
  },

  getOrderDetails: async (orderId) => {
    await delay(500);
    const order = orders.find(order => order.id === parseInt(orderId));
    if (!order) throw new Error('Sipariş bulunamadı');
    return order;
  },

  createOrder: async (data) => {
    await delay(1000);
    const company = companies.find(c => c.name === data.customerName);
    const project = projects.find(p => p.id === data.project);
    
    const newOrder = {
      id: orders.length + 1,
      customerName: company.name,
      contact: company.contact,
      phone: company.phone,
      amount: data.amount,
      date: new Date().toISOString(),
      status: 'pending',
      project: data.project,
      projectName: project.name,
      items: data.items || []
    };
    orders.push(newOrder);
    return newOrder;
  }
};

// Gider Belgeleri API
let expenses = [
  {
    id: 1,
    amount: 1500,
    description: 'Ofis malzemeleri',
    expenseDate: '2024-03-15',
    documentUrl: '/documents/expense1.pdf',
    status: 'pending',
    project: projects[0].id,
    projectName: projects[0].name,
    company: companies[0].name
  },
  {
    id: 2,
    amount: 2500,
    description: 'Yazılım lisansları',
    expenseDate: '2024-03-14',
    documentUrl: '/documents/expense2.pdf',
    status: 'approved',
    project: projects[1].id,
    projectName: projects[1].name,
    company: companies[1].name
  }
];

export const expensesApi = {
  async getExpenses() {
    await delay(500);
    return [...expenses];
  },
  
  async createExpense(formData) {
    await delay(1000);
    
    const file = formData.get('document');
    if (!file || file.type !== 'application/pdf') {
      throw new Error('Geçersiz dosya formatı');
    }

    const project = projects.find(p => p.id === formData.get('project'));
    const newExpense = {
      id: expenses.length + 1,
      amount: parseFloat(formData.get('amount')),
      description: formData.get('description'),
      expenseDate: formData.get('expenseDate'),
      documentUrl: URL.createObjectURL(file),
      status: 'pending',
      project: formData.get('project'),
      projectName: project.name,
      company: project.company
    };

    expenses.push(newExpense);
    return newExpense;
  },

  async updateExpenseStatus(expenseId, newStatus) {
    await delay(500);
    const expenseIndex = expenses.findIndex(expense => expense.id === expenseId);
    if (expenseIndex === -1) {
      throw new Error('Gider belgesi bulunamadı');
    }
    expenses[expenseIndex] = { ...expenses[expenseIndex], status: newStatus };
    return { success: true, message: 'Gider belgesi durumu güncellendi' };
  }
};

// Ödeme Talepleri API
export const paymentRequestsApi = {
  async getPaymentRequests() {
    await delay(500);
    return [
      {
        id: 1,
        amount: 5000,
        description: 'Tedarikçi Ödemesi',
        requestDate: '2024-03-14',
        status: 'pending'
      },
      // ... diğer talepler
    ];
  },
  
  async createPaymentRequest(data) {
    await delay(500);
    return { id: Date.now(), ...data };
  }
};

// Müşteriler API
export const customersApi = {
  async getCustomers() {
    await delay(500);
    return [
      {
        id: 1,
        name: 'Mehmet Yılmaz',
        email: 'mehmet@example.com',
        phone: '555-0001',
        totalOrders: 5
      },
      // ... diğer müşteriler
    ];
  }
};

// Destek Talepleri API
export const supportApi = {
  async getSupportRequests() {
    await delay(500);
    return [
      {
        id: 1,
        subject: 'Sistem Hatası',
        description: 'Login problemi yaşıyorum',
        status: 'open',
        createdAt: '2024-03-14'
      },
      // ... diğer talepler
    ];
  },
  
  async createSupportRequest(data) {
    await delay(500);
    return { id: Date.now(), ...data };
  }
};

export const calendarApi = {
  getEvents: async (date = new Date()) => {
    await delay(1000);
    
    // Gelen tarihin ay ve yılını al
    const targetMonth = date.getMonth();
    const targetYear = date.getFullYear();
    
    return [
      // Ocak 2025
      {
        id: 1,
        title: 'Yeni Yıl Kutlaması',
        start: new Date(2025, 0, 1),
        end: new Date(2025, 0, 1),
        type: 'congress'
      },
      {
        id: 2,
        title: 'Doğum Günü - Mehmet Demir',
        start: new Date(2025, 0, 15),
        end: new Date(2025, 0, 15),
        type: 'birthday'
      },
      {
        id: 3,
        title: 'Yıllık Planlama Toplantısı',
        start: new Date(2025, 0, 20, 10, 0),
        end: new Date(2025, 0, 20, 12, 0),
        type: 'meeting'
      },
      {
        id: 4,
        title: 'Q1 Hedef Teslim Tarihi',
        start: new Date(2025, 0, 31),
        end: new Date(2025, 0, 31),
        type: 'deadline'
      },
      
      // Şubat 2025
      {
        id: 5,
        title: 'Doğum Günü - Ayşe Yılmaz',
        start: new Date(2025, 1, 5),
        end: new Date(2025, 1, 5),
        type: 'birthday'
      },
      {
        id: 6,
        title: 'Teknoloji Konferansı',
        start: new Date(2025, 1, 12),
        end: new Date(2025, 1, 14),
        type: 'congress'
      },
      {
        id: 7,
        title: 'Proje Değerlendirme',
        start: new Date(2025, 1, 20, 14, 0),
        end: new Date(2025, 1, 20, 16, 0),
        type: 'meeting'
      },
      {
        id: 8,
        title: 'Bütçe Raporu Teslimi',
        start: new Date(2025, 1, 28),
        end: new Date(2025, 1, 28),
        type: 'deadline'
      },
      
      // Mart 2024 (Mevcut ayın etkinlikleri)
      {
        id: 9,
        title: 'Planlama Toplantısı',
        start: new Date(2024, 2, 15, 10, 0),
        end: new Date(2024, 2, 15, 11, 30),
        type: 'meeting'
      },
      {
        id: 10,
        title: 'Doğum Günü - Ahmet Yılmaz',
        start: new Date(2024, 2, 20),
        end: new Date(2024, 2, 20),
        type: 'birthday'
      },
      {
        id: 11,
        title: 'Görev Teslim Tarihi',
        start: new Date(2024, 2, 25),
        end: new Date(2024, 2, 25),
        type: 'deadline'
      },
      {
        id: 12,
        title: 'Kongre',
        start: new Date(2024, 2, 28),
        end: new Date(2024, 2, 30),
        type: 'congress'
      }
    ].filter(event => {
      const eventMonth = event.start.getMonth();
      const eventYear = event.start.getFullYear();
      return eventMonth === targetMonth && eventYear === targetYear;
    });
  }
}; 