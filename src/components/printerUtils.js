const { ipcRenderer } = require("electron");

let data = [];
const SP = 11; // Example value for SP

async function getPrinters() {
  try {
    const printers = await ipcRenderer.invoke("get-printers"); // Invoke IPC handler
    console.log("Printers:", printers);
    return printers;
  } catch (error) {
    console.error("Error fetching printers:", error);
  }
}

function populateData(cards) {
  return new Promise((resolve) => {
    data = cards.map((card) => [
      card.qty, // First element: card quantity
      card.name, // Second element: card name
      card.qty * SP, // Third element: card quantity multiplied by SP
    ]);
    console.log("Data populated:", data);
    resolve(); // Resolve the promise once data is populated
  });
}

// Function to print data
// Function to print data
export async function printParchi(receipt) {
  try {
    const printers = await getPrinters();

    // Ensure data is populated before proceeding to print
    await populateData(receipt.cards);

    const printerName = printers.length > 0 ? printers[0].name : ""; // Use first printer
    const printParchi = {
      printerName: printerName,
      data: [
        {
          type: "text",
          style: { border: "1px solid white", fontSize: "20px" },
          value: `Receipt Id: ${receipt.id}`,
        },
        {
          type: "text",
          style: { border: "1px solid white", fontSize: "20px" },
          value: `Date: ${receipt.date}`,
        },
        {
          type: "table",
          style: { border: "1px solid black" },
          tableHeader: ["Qty", "name", "cost"],
          tableBody: data,
          tableFooter: [{ type: "text", value: "Total:" }, "", `${receipt.total}`],
          tableHeaderStyle: { color: "black", fontSize: "16px" },
          tableBodyStyle: {
            border: "1px solid black",
            fontSize: "16px",
            color: "black",
          },
          tableFooterStyle: {
            backgroundColor: "#000",
            color: "black",
            fontSize: "16px",
          },
        },
        {
          type: "text",
          value: `Time : ${receipt.cashOutTime}`,
          style: { fontSize: "16px", textAlign: "center" },
        },
        {
          type: "text",
          value: `*CONDITIONS APPLY:`,
          style: { fontSize: "16px", textAlign: "center" },
        },
        {
          type: "text",
          value: `THE ACKNOWLEDGMENT SLIP SHOULD BE RETAINED TO
                        REDEEM THE PRODUCTS AND GIFTS`,
          style: { fontSize: "10px", textAlign: "center" },
        },
        {
          type: 'barCode',
          value: `${receipt.id}`,
          height: 22, // height of barcode, applicable only to bar and QR codes
          width: 2, // width of barcode, applicable only to bar and QR codes
          displayValue: true, // Display value below barcode
          fontSize: 12,
        },
      ],
    };
    // Send print request to main process
    ipcRenderer.send("print-request", printParchi);
  } catch (error) {
    console.error("Error in printing:", error);
  }
}

export async function printDaybill(receipt) {
  try {
    const printers = await getPrinters();

    const printerName = printers.length > 0 ? printers[0].name : ""; // Use first printer
    const printParchi = {
      printerName: printerName,
      data: [
        {
          type: "text",
          style: { border: "1px solid white", fontSize: "20px" },
          value: `User Id: ${receipt.user_id}`,
        },
        {
          type: "text",
          style: { border: "1px solid white", fontSize: "20px" },
          value: `Sales: ${receipt.sales}`,
        },
        {
          type: "text",
          style: { border: "1px solid white", fontSize: "20px" },
          value: `Qty: ${receipt.qty}`,
        },
        {
          type: "text",
          style: { border: "1px solid white", fontSize: "20px" },
          value: `Expenditure: ${receipt.expenditure}`,
        },
        {
          type: "text",
          value: `Time : ${receipt.createdAt}`,
          style: { fontSize: "16px", textAlign: "center" },
        },
      ],
    };
    // Send print request to main process
    ipcRenderer.send("print-request", printParchi);
  } catch (error) {
    console.error("Error in printing:", error);
  }
}

// Call getPrinters when the page loads if necessary
getPrinters();
