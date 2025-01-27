// Fake API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Kullanıcılar API
export const usersApi = {
  async getUsers() {
    await delay(500);
    return [
      { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', role: 'PROJECT_MANAGER' },
      { id: 2, name: 'Ayşe Demir', email: 'ayse@example.com', role: 'ACCOUNTANT' },
      // ... diğer kullanıcılar
    ];
  }
};

// Sponsor Firmalar API
export const sponsorsApi = {
  async getSponsors() {
    await delay(500);
    return [
      { id: 1, name: 'ABC Şirketi', contact: 'Mehmet Yılmaz', phone: '555-0001', status: 'active' },
      { id: 2, name: 'XYZ Limited', contact: 'Zeynep Kaya', phone: '555-0002', status: 'active' },
      // ... diğer sponsorlar
    ];
  }
};

// Siparişler API
export const ordersApi = {
  async getOrders() {
    await delay(500);
    return [
      { 
        id: 1, 
        customerName: 'ABC Şirketi', 
        amount: 15000, 
        status: 'pending',
        date: '2024-03-15' 
      },
      { 
        id: 2, 
        customerName: 'XYZ Limited', 
        amount: 25000, 
        status: 'approved',
        date: '2024-03-14' 
      },
      { 
        id: 3, 
        customerName: 'DEF A.Ş.', 
        amount: 35000, 
        status: 'rejected',
        date: '2024-03-13' 
      }
    ];
  },

  async createOrder(data) {
    await delay(1000);
    return {
      id: Date.now(),
      ...data,
      status: 'pending',
      date: new Date().toISOString()
    };
  },

  async getOrderById(id) {
    await delay(500);
    return {
      id,
      customerName: 'ABC Şirketi',
      amount: 15000,
      status: 'pending',
      date: '2024-03-15',
      items: [
        {
          description: 'Ürün 1',
          quantity: 2,
          unitPrice: 5000,
          amount: 10000
        },
        {
          description: 'Ürün 2',
          quantity: 1,
          unitPrice: 5000,
          amount: 5000
        }
      ]
    };
  }
};

// Gider Belgeleri API
export const expensesApi = {
  async getExpenses() {
    await delay(500);
    return [
      {
        id: 1,
        amount: 1500,
        description: 'Ofis malzemeleri',
        expenseDate: '2024-03-15',
        documentUrl: '/documents/expense1.pdf',
        status: 'pending'
      },
      // ... diğer giderler
    ];
  },
  
  async createExpense(formData) {
    await delay(1000); // Simüle edilmiş yükleme gecikmesi
    
    // Gerçek bir API'de FormData backend'e gönderilir
    // Burada sadece simüle ediyoruz
    const file = formData.get('document');
    
    if (!file || file.type !== 'application/pdf') {
      throw new Error('Geçersiz dosya formatı');
    }

    return {
      id: Date.now(),
      amount: formData.get('amount'),
      description: formData.get('description'),
      expenseDate: formData.get('expenseDate'),
      documentUrl: URL.createObjectURL(file), // Gerçek uygulamada backend'den dönen URL kullanılır
      status: 'pending'
    };
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