const { ipcRenderer } = require("electron");

    async function getPrinters() {
      try {
        const printers = await ipcRenderer.invoke("get-printers"); // Invoke IPC handler
        console.log("Printers:", printers);
        return printers;
      } catch (error) {
        console.error("Error fetching printers:", error);
      }
    }

    export async function printData() {
      const printers = await getPrinters();
      const printerName = printers.length > 0 ? printers[0].name : ""; // Use first printer
      const printData = {
        printerName: printerName,
        data: [
          {
            type: "text",
            style: { border: "1px solid white", fontSize:'20px' },
            value: ["Receipt Id: 69", "", "01/10/2024"],
          },
          {
            type: "table",
            // style the table
            style: { border: "1px solid black" },
            // list of the columns to be rendered in the table header
            tableHeader: ["Qty", "name", "cost"],
            // multi dimensional array depicting the rows and columns of the table body
            tableBody: [
              ["this", "is from", "app"],
              ["1", "Coffeee", 50],
              ["2", "not cofeee", 10],
              ["Time:", "", "69:00"],
            ],
            tableFooter: [{ type: "text", value: "Total:" }, "", "60"],
            // custom style for the table header
            tableHeaderStyle: { color: "black", fontSize: "18px" },
            // custom style for the table body
            tableBodyStyle: {
              border: "1px solid black",
              fontSize: "18px",
              color: "black",
            },
            // custom style for the table footer
            tableFooterStyle: {
              backgroundColor: "#000",
              color: "black",
              fontSize: "18px",
            },
          },
          {
            type: "text",
            value: `*CONDITIONS APPLY:`,
            style: { fontSize: "20px", textAlign: "center" },
          },
          {
            type: "text",
            value: `THE ACKNOWLEDGMENT SLIP SHOULD BE RETAINED TO
                            REDEEM THE PRODUCTS AND GIFTS`,
            style: { fontSize: "16px", textAlign: "center" },
          },
          {
            type: "barCode",
            value: "id:1",
            // displayValue: true,
            style: { fontSize: "5px", textAlign: "center" },
          },
        ],
      };

      ipcRenderer.send("print-request", printData); // Send print request to main process
    }

    getPrinters(); // Fetch printers when the page loads