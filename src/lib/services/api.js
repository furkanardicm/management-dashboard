'use client';

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
  { 
    id: 'project1', 
    name: 'E-Ticaret Platformu', 
    description: 'Online alışveriş platformu geliştirme projesi',
    manager: 'Ahmet Yılmaz',
    company: companies[0].name,
    status: 'active'
  },
  { 
    id: 'project2', 
    name: 'Mobil Uygulama Geliştirme', 
    description: 'iOS ve Android için mobil uygulama geliştirme projesi',
    manager: 'Mehmet Demir',
    company: companies[1].name,
    status: 'active'
  },
  { 
    id: 'project3', 
    name: 'Bulut Altyapı Projesi', 
    description: 'Bulut tabanlı altyapı modernizasyon projesi',
    manager: 'Ayşe Kaya',
    company: companies[2].name,
    status: 'completed'
  }
];

// Örnek kullanıcılar listesi
let users = [
  { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@teknoloji.com', role: 'admin', status: 'active' },
  { id: 2, name: 'Mehmet Demir', email: 'mehmet@yazilim.com', role: 'user', status: 'active' },
  { id: 3, name: 'Ayşe Kaya', email: 'ayse@dijital.com', role: 'user', status: 'active' },
  { id: 4, name: 'Fatma Şahin', email: 'fatma@inovasyon.com', role: 'user', status: 'inactive' },
  { id: 5, name: 'Ali Yıldız', email: 'ali@bilisim.com', role: 'admin', status: 'active' }
];

// Kullanıcılar API
export const usersApi = {
  async getUsers() {
    await delay(500);
    return [...users];
  },

  async getUser(id) {
    await delay(500);
    const user = users.find(u => u.id === parseInt(id));
    if (!user) throw new Error('Kullanıcı bulunamadı');
    return { ...user };
  },

  async createUser(data) {
    await delay(500);
    const newUser = {
      id: users.length + 1,
      ...data
    };
    users.push(newUser);
    return { ...newUser };
  },

  async updateUser(id, data) {
    await delay(500);
    const index = users.findIndex(u => u.id === parseInt(id));
    if (index === -1) throw new Error('Kullanıcı bulunamadı');
    users[index] = { ...users[index], ...data };
    return { ...users[index] };
  },

  async deleteUser(id) {
    await delay(500);
    const index = users.findIndex(u => u.id === parseInt(id));
    if (index === -1) throw new Error('Kullanıcı bulunamadı');
    users.splice(index, 1);
    return true;
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
  },

  async updateSponsor(id, data) {
    await delay(500);
    const index = companies.findIndex(c => c.id === parseInt(id));
    if (index === -1) throw new Error('Sponsor bulunamadı');
    companies[index] = { ...companies[index], ...data };
    return companies[index];
  },

  async deleteSponsor(id) {
    await delay(500);
    const index = companies.findIndex(c => c.id === parseInt(id));
    if (index === -1) throw new Error('Sponsor bulunamadı');
    companies.splice(index, 1);
    return true;
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

  getOrder: async (orderId) => {
    await delay(500);
    const order = orders.find(order => order.id === parseInt(orderId));
    if (!order) throw new Error('Sipariş bulunamadı');
    return { ...order };
  },

  updateOrder: async (orderId, data) => {
    await delay(500);
    const orderIndex = orders.findIndex(order => order.id === parseInt(orderId));
    if (orderIndex === -1) {
      throw new Error('Sipariş bulunamadı');
    }
    
    const project = projects.find(p => p.id === data.project);
    orders[orderIndex] = {
      ...orders[orderIndex],
      ...data,
      projectName: project.name
    };
    
    return orders[orderIndex];
  },

  updateOrderStatus: async (orderId, newStatus) => {
    await delay(500);
    const orderIndex = orders.findIndex(order => order.id === parseInt(orderId));
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
  
  async getExpense(id) {
    await delay(500);
    const expense = expenses.find(e => e.id === parseInt(id));
    if (!expense) {
      throw new Error('Gider belgesi bulunamadı');
    }
    return { ...expense };
  },

  async createExpense(data) {
    await delay(500);
    const newExpense = {
      id: expenses.length + 1,
      ...data,
      status: data.status || 'pending'
    };
    expenses.push(newExpense);
    return newExpense;
  },

  async updateExpense(id, data) {
    await delay(500);
    const index = expenses.findIndex(e => e.id === parseInt(id));
    if (index === -1) {
      throw new Error('Gider belgesi bulunamadı');
    }
    expenses[index] = { ...expenses[index], ...data };
    return expenses[index];
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

// Ödeme Talepleri
let paymentRequests = [
  {
    id: 1,
    amount: 5000,
    description: 'Tedarikçi Ödemesi',
    requestDate: '2024-03-14',
    status: 'pending',
    company: companies[0].name,
    project: projects[0].name
  },
  {
    id: 2,
    amount: 3500,
    description: 'Yazılım Lisans Ödemesi',
    requestDate: '2024-03-15',
    status: 'approved',
    company: companies[1].name,
    project: projects[1].name
  },
  {
    id: 3,
    amount: 2800,
    description: 'Donanım Alımı',
    requestDate: '2024-03-16',
    status: 'rejected',
    company: companies[2].name,
    project: projects[2].name
  }
];

export const paymentRequestsApi = {
  async getPaymentRequests() {
    await delay(500);
    return [...paymentRequests];
  },

  async getPaymentRequest(id) {
    await delay(500);
    const request = paymentRequests.find(r => r.id === parseInt(id));
    if (!request) {
      throw new Error('Ödeme talebi bulunamadı');
    }
    return { ...request };
  },
  
  async createPaymentRequest(data) {
    await delay(500);
    const newRequest = {
      id: paymentRequests.length + 1,
      ...data,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    paymentRequests.push(newRequest);
    return newRequest;
  },

  async updatePaymentRequest(id, data) {
    await delay(500);
    const index = paymentRequests.findIndex(r => r.id === parseInt(id));
    if (index === -1) {
      throw new Error('Ödeme talebi bulunamadı');
    }
    paymentRequests[index] = { ...paymentRequests[index], ...data };
    return paymentRequests[index];
  },

  async updatePaymentRequestStatus(id, newStatus) {
    await delay(500);
    const index = paymentRequests.findIndex(r => r.id === parseInt(id));
    if (index === -1) {
      throw new Error('Ödeme talebi bulunamadı');
    }
    paymentRequests[index] = { ...paymentRequests[index], status: newStatus };
    return { success: true, message: 'Ödeme talebi durumu güncellendi' };
  },

  async deletePaymentRequest(id) {
    await delay(500);
    const index = paymentRequests.findIndex(r => r.id === parseInt(id));
    if (index === -1) {
      throw new Error('Ödeme talebi bulunamadı');
    }
    paymentRequests.splice(index, 1);
    return true;
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

// Sağlık Kurumları
let healthInstitutions = [
  { 
    id: 1, 
    name: 'Özel Medica Hastanesi',
    type: 'Özel Hastane',
    department: 'Radyoloji, Kardiyoloji',
    bedCount: '250',
    contact: 'Prof. Dr. Ahmet Yılmaz',
    title: 'Başhekim',
    phone: '555-0101',
    email: 'ahmet.yilmaz@medicahastanesi.com',
    status: 'active'
  },
  { 
    id: 2, 
    name: 'Şifa Tıp Merkezi',
    type: 'Tıp Merkezi',
    department: 'Dahiliye, Göz, KBB',
    bedCount: '50',
    contact: 'Dr. Ayşe Demir',
    title: 'Merkez Müdürü',
    phone: '555-0102',
    email: 'ayse.demir@sifatip.com',
    status: 'active'
  },
  {
    id: 3,
    name: 'Devlet Eğitim ve Araştırma Hastanesi',
    type: 'Kamu Hastanesi',
    department: 'Tüm Branşlar',
    bedCount: '750',
    contact: 'Doç. Dr. Mehmet Kaya',
    title: 'Başhekim Yardımcısı',
    phone: '555-0103',
    email: 'mehmet.kaya@saglik.gov.tr',
    status: 'active'
  }
];

// Ziyaretler
let visits = [
  { 
    id: 1, 
    institution: 'Özel Medica Hastanesi',
    department: 'Radyoloji',
    contactPerson: 'Prof. Dr. Ahmet Yılmaz',
    visitDate: '2024-04-15',
    visitTime: '14:30',
    visitType: 'Ürün Tanıtımı',
    salesPerson: 'Mehmet Aydın',
    notes: 'PACS sistemi için demo talebi alındı',
    result: 'Olumlu',
    nextVisit: '2024-04-30',
    status: 'completed'
  },
  { 
    id: 2, 
    institution: 'Şifa Tıp Merkezi',
    department: 'Yönetim',
    contactPerson: 'Dr. Ayşe Demir',
    visitDate: '2024-04-20',
    visitTime: '10:00',
    visitType: 'Satış Görüşmesi',
    salesPerson: 'Ayşe Yılmaz',
    notes: 'Hastane bilgi sistemi için fiyat görüşmesi yapıldı',
    result: 'Beklemede',
    nextVisit: '2024-05-05',
    status: 'planned'
  }
];

// Sağlık Kurumları API
const healthApi = {
  getInstitutions: async () => {
    return Promise.resolve(healthInstitutions);
  },

  getInstitutionById: async (id) => {
    const institution = healthInstitutions.find(i => i.id === parseInt(id));
    if (!institution) throw new Error('Kurum bulunamadı');
    return Promise.resolve(institution);
  },

  createInstitution: async (data) => {
    const newInstitution = {
      id: healthInstitutions.length + 1,
      ...data,
      status: 'active'
    };
    healthInstitutions.push(newInstitution);
    return Promise.resolve(newInstitution);
  },

  updateInstitution: async (id, data) => {
    const index = healthInstitutions.findIndex(i => i.id === parseInt(id));
    if (index === -1) throw new Error('Kurum bulunamadı');
    healthInstitutions[index] = { ...healthInstitutions[index], ...data };
    return Promise.resolve(healthInstitutions[index]);
  },

  deleteInstitution: async (id) => {
    const index = healthInstitutions.findIndex(i => i.id === parseInt(id));
    if (index === -1) throw new Error('Kurum bulunamadı');
    healthInstitutions.splice(index, 1);
    return Promise.resolve(true);
  }
};

// Ziyaret API
const visitApi = {
  getVisits: async () => {
    return Promise.resolve(visits);
  },

  getVisitById: async (id) => {
    const visit = visits.find(v => v.id === parseInt(id));
    if (!visit) throw new Error('Ziyaret bulunamadı');
    return Promise.resolve(visit);
  },

  createVisit: async (data) => {
    const newVisit = {
      id: visits.length + 1,
      ...data
    };
    visits.push(newVisit);
    return Promise.resolve(newVisit);
  },

  updateVisit: async (id, data) => {
    const index = visits.findIndex(v => v.id === parseInt(id));
    if (index === -1) throw new Error('Ziyaret bulunamadı');
    visits[index] = { ...visits[index], ...data };
    return Promise.resolve(visits[index]);
  },

  deleteVisit: async (id) => {
    const index = visits.findIndex(v => v.id === parseInt(id));
    if (index === -1) throw new Error('Ziyaret bulunamadı');
    visits.splice(index, 1);
    return Promise.resolve(true);
  }
};

export { healthApi, visitApi };

const tenders = [
  {
    id: 1,
    name: "MR Cihazı Alımı",
    institution: "Özel Medica Hastanesi",
    type: "Donanım İhalesi",
    budget: "2.500.000 TL",
    deadline: "2024-04-15",
    competitors: "ABC Medical, XYZ Healthcare, MediTech",
    ourBid: "2.350.000 TL",
    status: "active"
  },
  {
    id: 2,
    name: "Laboratuvar Sistemleri",
    institution: "Şifa Tıp Merkezi",
    type: "Yazılım İhalesi",
    budget: "750.000 TL",
    deadline: "2024-03-30",
    competitors: "LabSoft, MediLab Systems",
    ourBid: "720.000 TL",
    status: "pending"
  },
  {
    id: 3,
    name: "Hasta Takip Sistemi",
    institution: "Devlet Hastanesi",
    type: "Yazılım + Donanım",
    budget: "1.200.000 TL",
    deadline: "2024-05-01",
    competitors: "Healthcare IT, MediSoft, TechMed",
    ourBid: "1.150.000 TL",
    status: "passive"
  }
];

export const tenderApi = {
  getTenders: async () => {
    await delay(500);
    return tenders;
  },

  createTender: async (tender) => {
    await delay(500);
    const newTender = {
      id: tenders.length + 1,
      ...tender
    };
    tenders.push(newTender);
    return newTender;
  },

  updateTender: async (id, tender) => {
    await delay(500);
    const index = tenders.findIndex(t => t.id === id);
    if (index === -1) throw new Error('İhale bulunamadı');
    tenders[index] = { ...tenders[index], ...tender };
    return tenders[index];
  },

  deleteTender: async (id) => {
    await delay(500);
    const index = tenders.findIndex(t => t.id === id);
    if (index === -1) throw new Error('İhale bulunamadı');
    tenders.splice(index, 1);
    return true;
  }
};

// Rakip Firmalar
let competitors = [
  {
    id: 1,
    name: "ABC Medical",
    type: "Medikal Cihaz",
    products: "MR, Tomografi, Ultrason",
    strengths: "Güçlü servis ağı, Geniş ürün yelpazesi",
    weaknesses: "Yüksek fiyat politikası",
    marketShare: "%25",
    contactPerson: "Ahmet Yılmaz",
    phone: "555-0101",
    email: "ahmet@abcmedical.com",
    status: "active"
  },
  {
    id: 2,
    name: "LabSoft Systems",
    type: "Yazılım",
    products: "HIS, LIS, PACS",
    strengths: "Yenilikçi çözümler, Hızlı destek",
    weaknesses: "Sınırlı müşteri portföyü",
    marketShare: "%15",
    contactPerson: "Ayşe Demir",
    phone: "555-0102",
    email: "ayse@labsoft.com",
    status: "active"
  },
  {
    id: 3,
    name: "MediTech",
    type: "Medikal Cihaz + Yazılım",
    products: "Hasta Takip Sistemleri, Monitörler",
    strengths: "Entegre çözümler",
    weaknesses: "Yavaş teknik destek",
    marketShare: "%20",
    contactPerson: "Mehmet Kaya",
    phone: "555-0103",
    email: "mehmet@meditech.com",
    status: "passive"
  }
];

// Rakip Firma API
export const competitorApi = {
  getCompetitors: async () => {
    await delay(500);
    return competitors;
  },

  getCompetitorById: async (id) => {
    await delay(500);
    const competitor = competitors.find(c => c.id === parseInt(id));
    if (!competitor) throw new Error('Rakip firma bulunamadı');
    return competitor;
  },

  createCompetitor: async (competitor) => {
    await delay(500);
    const newCompetitor = {
      id: competitors.length + 1,
      ...competitor
    };
    competitors.push(newCompetitor);
    return newCompetitor;
  },

  updateCompetitor: async (id, competitor) => {
    await delay(500);
    const index = competitors.findIndex(c => c.id === parseInt(id));
    if (index === -1) throw new Error('Rakip firma bulunamadı');
    competitors[index] = { ...competitors[index], ...competitor };
    return competitors[index];
  },

  deleteCompetitor: async (id) => {
    await delay(500);
    const index = competitors.findIndex(c => c.id === parseInt(id));
    if (index === -1) throw new Error('Rakip firma bulunamadı');
    competitors.splice(index, 1);
    return true;
  }
};

// Kamu Müşterileri
let publicInstitutions = [
  {
    id: 1,
    name: "Ankara Şehir Hastanesi",
    type: "Şehir Hastanesi",
    city: "Ankara",
    district: "Bilkent",
    bedCount: "3810",
    departments: "Tüm Branşlar",
    budget: "Merkezi Bütçe",
    procurementMethod: "DMO + İhale",
    contactPerson: "Prof. Dr. Mehmet Yılmaz",
    title: "Başhekim",
    phone: "312-555-0101",
    email: "mehmet.yilmaz@saglik.gov.tr",
    lastVisitDate: "2024-03-15",
    nextVisitDate: "2024-04-15",
    notes: "Yeni PACS sistemi ihtiyacı var",
    status: "active"
  },
  {
    id: 2,
    name: "İzmir Atatürk Eğitim ve Araştırma Hastanesi",
    type: "Eğitim Araştırma Hastanesi",
    city: "İzmir",
    district: "Karabağlar",
    bedCount: "1200",
    departments: "Tüm Branşlar",
    budget: "Döner Sermaye",
    procurementMethod: "İhale",
    contactPerson: "Doç. Dr. Ayşe Demir",
    title: "Başhekim Yardımcısı",
    phone: "232-555-0102",
    email: "ayse.demir@saglik.gov.tr",
    lastVisitDate: "2024-03-01",
    nextVisitDate: "2024-04-01",
    notes: "HIS yenileme planı var",
    status: "active"
  },
  {
    id: 3,
    name: "İstanbul Eğitim ve Araştırma Hastanesi",
    type: "Eğitim Araştırma Hastanesi",
    city: "İstanbul",
    district: "Fatih",
    bedCount: "750",
    departments: "Tüm Branşlar",
    budget: "Döner Sermaye",
    procurementMethod: "DMO",
    contactPerson: "Dr. Ali Kaya",
    title: "Başhekim",
    phone: "212-555-0103",
    email: "ali.kaya@saglik.gov.tr",
    lastVisitDate: "2024-02-15",
    nextVisitDate: "2024-04-15",
    notes: "Radyoloji cihazları yenileme ihtiyacı",
    status: "passive"
  }
];

// Kamu Müşterileri API
export const publicApi = {
  getInstitutions: async () => {
    await delay(500);
    return publicInstitutions;
  },

  getInstitutionById: async (id) => {
    await delay(500);
    const institution = publicInstitutions.find(i => i.id === parseInt(id));
    if (!institution) throw new Error('Kurum bulunamadı');
    return institution;
  },

  createInstitution: async (institution) => {
    await delay(500);
    const newInstitution = {
      id: publicInstitutions.length + 1,
      ...institution
    };
    publicInstitutions.push(newInstitution);
    return newInstitution;
  },

  updateInstitution: async (id, institution) => {
    await delay(500);
    const index = publicInstitutions.findIndex(i => i.id === parseInt(id));
    if (index === -1) throw new Error('Kurum bulunamadı');
    publicInstitutions[index] = { ...publicInstitutions[index], ...institution };
    return publicInstitutions[index];
  },

  deleteInstitution: async (id) => {
    await delay(500);
    const index = publicInstitutions.findIndex(i => i.id === parseInt(id));
    if (index === -1) throw new Error('Kurum bulunamadı');
    publicInstitutions.splice(index, 1);
    return true;
  }
};

// Tıp Müşterileri
let medicalCustomers = [
  {
    id: 1,
    name: "Özel Medica Hastanesi",
    type: "Özel Hastane",
    city: "İstanbul",
    district: "Kadıköy",
    bedCount: "250",
    departments: "Radyoloji, Kardiyoloji, Nöroloji",
    annualPatientCount: "50000",
    equipmentBudget: "5000000",
    contactPerson: "Prof. Dr. Ahmet Yılmaz",
    title: "Başhekim",
    phone: "216-555-0101",
    email: "ahmet.yilmaz@medicahastanesi.com",
    purchasingManager: "Mehmet Demir",
    purchasingManagerPhone: "216-555-0102",
    purchasingManagerEmail: "mehmet.demir@medicahastanesi.com",
    lastVisitDate: "2024-03-15",
    nextVisitDate: "2024-04-15",
    notes: "Yeni görüntüleme merkezi açılışı planlanıyor",
    status: "active"
  },
  {
    id: 2,
    name: "Şifa Tıp Merkezi",
    type: "Tıp Merkezi",
    city: "Ankara",
    district: "Çankaya",
    bedCount: "50",
    departments: "Dahiliye, Göz, KBB",
    annualPatientCount: "25000",
    equipmentBudget: "2000000",
    contactPerson: "Dr. Ayşe Demir",
    title: "Merkez Müdürü",
    phone: "312-555-0102",
    email: "ayse.demir@sifatip.com",
    purchasingManager: "Ali Yılmaz",
    purchasingManagerPhone: "312-555-0103",
    purchasingManagerEmail: "ali.yilmaz@sifatip.com",
    lastVisitDate: "2024-03-01",
    nextVisitDate: "2024-04-01",
    notes: "Yeni şube açılışı planlanıyor",
    status: "active"
  },
  {
    id: 3,
    name: "Anadolu Sağlık Merkezi",
    type: "Özel Hastane",
    city: "İzmir",
    district: "Karşıyaka",
    bedCount: "150",
    departments: "Genel Cerrahi, Ortopedi, Üroloji",
    annualPatientCount: "35000",
    equipmentBudget: "3000000",
    contactPerson: "Dr. Mehmet Kaya",
    title: "Başhekim Yardımcısı",
    phone: "232-555-0103",
    email: "mehmet.kaya@anadolusaglik.com",
    purchasingManager: "Fatma Şahin",
    purchasingManagerPhone: "232-555-0104",
    purchasingManagerEmail: "fatma.sahin@anadolusaglik.com",
    lastVisitDate: "2024-02-15",
    nextVisitDate: "2024-04-15",
    notes: "Ameliyathane yenileme projesi var",
    status: "passive"
  }
];

// Tıp Müşterileri API
export const medicalApi = {
  getCustomers: async () => {
    await delay(500);
    return medicalCustomers;
  },

  getCustomerById: async (id) => {
    await delay(500);
    const customer = medicalCustomers.find(c => c.id === parseInt(id));
    if (!customer) throw new Error('Müşteri bulunamadı');
    return customer;
  },

  createCustomer: async (customer) => {
    await delay(500);
    const newCustomer = {
      id: medicalCustomers.length + 1,
      ...customer
    };
    medicalCustomers.push(newCustomer);
    return newCustomer;
  },

  updateCustomer: async (id, customer) => {
    await delay(500);
    const index = medicalCustomers.findIndex(c => c.id === parseInt(id));
    if (index === -1) throw new Error('Müşteri bulunamadı');
    medicalCustomers[index] = { ...medicalCustomers[index], ...customer };
    return medicalCustomers[index];
  },

  deleteCustomer: async (id) => {
    await delay(500);
    const index = medicalCustomers.findIndex(c => c.id === parseInt(id));
    if (index === -1) throw new Error('Müşteri bulunamadı');
    medicalCustomers.splice(index, 1);
    return true;
  }
};

// Projeler API
export const projectsApi = {
  async getProjects() {
    await delay(500);
    return [...projects];
  },

  async getProject(id) {
    await delay(500);
    const project = projects.find(p => p.id === id);
    if (!project) throw new Error('Proje bulunamadı');
    return { ...project };
  },

  async createProject(data) {
    await delay(500);
    const newProject = {
      id: `project${projects.length + 1}`,
      ...data,
      status: 'active'
    };
    projects.push(newProject);
    return newProject;
  },

  async updateProject(id, data) {
    await delay(500);
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Proje bulunamadı');
    projects[index] = { ...projects[index], ...data };
    return projects[index];
  },

  async deleteProject(id) {
    await delay(500);
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Proje bulunamadı');
    projects.splice(index, 1);
    return true;
  }
}; 