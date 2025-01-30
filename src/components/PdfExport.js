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

  // Font boyutunu ayarla
  doc.setFontSize(fontSize + 4);

  // Başlık ekleme
  const titleWidth = doc.getStringUnitWidth(title) * (fontSize + 4) / doc.internal.scaleFactor;
  const pageWidth = doc.internal.pageSize.getWidth();
  const titleX = (pageWidth - titleWidth) / 2;
  doc.text(title, titleX, 15);

  // Türkçe karakterleri düzeltme fonksiyonu
  const fixTurkishChars = (text) => {
    return text.toString()
      .replace(/ğ/g, 'g')
      .replace(/Ğ/g, 'G')
      .replace(/ü/g, 'u')
      .replace(/Ü/g, 'U')
      .replace(/ş/g, 's')
      .replace(/Ş/g, 'S')
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'I')
      .replace(/ö/g, 'o')
      .replace(/Ö/g, 'O')
      .replace(/ç/g, 'c')
      .replace(/Ç/g, 'C');
  };

  // Verileri Türkçe karakter düzeltmesi ile hazırlama
  const processedData = data.map(row => 
    row.map(cell => fixTurkishChars(cell))
  );

  const processedHeaders = headers.map(header => fixTurkishChars(header));

  // Tabloyu oluşturma
  doc.autoTable({
    head: [processedHeaders],
    body: processedData,
    startY: 25,
    styles: {
      fontSize: fontSize,
      cellPadding: 3,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      textColor: [0, 0, 0]
    },
    headStyles: {
      fillColor: [75, 85, 99],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'center' }, // Sipariş No
      3: { halign: 'right' },  // Tutar
      4: { halign: 'center' }, // Tarih
      5: { halign: 'center' }  // Durum
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { top: 25 },
    theme: 'grid'
  });

  // PDF'i indirme
  doc.save(filename);
};

export default exportToPdf; 