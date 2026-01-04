  //pdf download handler
  const pdfGenerator = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    /* ---------- HEADER ---------- */
    if (logo) {
      // Try to detect image type from base64 string, fallback to PNG
      const imageType = logo.startsWith("data:image/jpeg") ? "JPEG" : "PNG";
      doc.addImage(logo, imageType, 14, 10, 20, 20);
    }

    doc.setFontSize(16);
    doc.text(brandName || "School Name", pageWidth / 2, 18, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.text("Student Information Report", pageWidth / 2, 25, {
      align: "center",
    });

    const date = new Date().toLocaleDateString();
    doc.text(`Generated: ${date}`, pageWidth - 14, 15, { align: "right" });

    /* ---------- TABLE ---------- */
    const tableColumn = [
      "SL",
      "Name",
      "Student ID",
      "Class",
      "Shift",
      "Phone",
      "Batch",
    ];

    const tableRows = students.map((student: any, index: number) => [
      index + 1,
      `${student?.firstName || ""} ${student?.lastName || ""}`,
      student?.studentId || "N/A",
      student?.Class?.className || "N/A",
      student?.shiftName || "N/A",
      student?.phone || "N/A",
      student?.Batch?.batchName || "N/A",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [255, 76, 48],
        textColor: 255,
      },
      didDrawPage: (data) => {
        /* ---------- FOOTER ---------- */
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(9);
        doc.text(`Page ${pageCount}`, pageWidth / 2, pageHeight - 10, {
          align: "center",
        });
      },
    });

    doc.save("student-list.pdf");
  };

  export default pdfGenerator