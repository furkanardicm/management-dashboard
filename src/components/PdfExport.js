import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToPdf = ({
  title = 'Rapor',
  filename = 'rapor.pdf',
  headers = [],
  data = [],
  orientation = 'portrait',
  fontSize = 10,
}) => {
  const doc = new jsPDF(orientation, 'mm', 'a4');

  // Türkçe karakter desteği için font ekleme
  doc.setFont("helvetica");

  // Başlık alanı
  doc.setFillColor(63, 81, 181); // Indigo renk
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(fontSize + 10);
  doc.text(title, 10, 15);
  
  doc.setFontSize(fontSize);
  doc.text(`Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, doc.internal.pageSize.getWidth() - 60, 15);

  // Türkçe karakterleri düzeltme fonksiyonu
  const fixTurkishChars = (text) => {
    const charMap = {
      'ğ': 'g', 'Ğ': 'G',
      'ü': 'u', 'Ü': 'U',
      'ş': 's', 'Ş': 'S',
      'ı': 'i', 'İ': 'I',
      'ö': 'o', 'Ö': 'O',
      'ç': 'c', 'Ç': 'C'
    };
    return text.toString().replace(/[ğĞüÜşŞıİöÖçÇ]/g, match => charMap[match] || match);
  };

  // Para birimi formatını düzeltme fonksiyonu
  const fixCurrency = (text) => {
    if (typeof text === 'string' && text.includes('₺')) {
      return text.replace('₺', '').trim() + ' TL';
    }
    return text;
  };

  // Verileri Türkçe karakter ve para birimi düzeltmesi ile hazırlama
  const processedData = data.map(row => 
    row.map(cell => fixCurrency(fixTurkishChars(cell || '-')))
  );

  const processedHeaders = headers.map(header => fixTurkishChars(header));

  // Tabloyu oluşturma
  doc.autoTable({
    head: [processedHeaders],
    body: processedData,
    startY: 35,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: fontSize,
      cellPadding: 5,
      lineColor: [233, 236, 239],
      lineWidth: 0.1,
      textColor: [45, 55, 72],
      valign: 'middle',
      halign: 'center' // Tüm hücreleri varsayılan olarak ortala
    },
    headStyles: {
      fillColor: [243, 244, 246],
      textColor: [45, 55, 72],
      fontStyle: 'bold',
      lineColor: [209, 213, 219],
      lineWidth: 0.2,
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'left' }, // İlk sütun sola hizalı ve kalın
      1: { halign: 'center' }, // İkinci sütun ortalı
      2: { halign: 'center' } // Üçüncü sütun ortalı
    },
    margin: { top: 35, left: 10, right: 10 },
    didDrawPage: (data) => {
      // Sayfa numarası
      doc.setFontSize(fontSize - 2);
      doc.setTextColor(156, 163, 175);
      doc.text(
        `Sayfa ${data.pageNumber}`,
        data.settings.margin.left,
        doc.internal.pageSize.getHeight() - 10
      );

      // Alt bilgi
      doc.setFontSize(fontSize - 2);
      doc.setTextColor(156, 163, 175);
      doc.text(
        'Bu rapor otomatik olarak oluşturulmuştur.',
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
  });

  // PDF'i indirme
  doc.save(filename);
};

export default exportToPdf; 