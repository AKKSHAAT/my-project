import receiptline from "receiptline";

export function generateReceipt(parchi) {
  // Create a string for the items in the parchi.cards array
  const items = parchi.cards
    .map(card => `${card.qty}x ${card.name.padEnd(20)} ₹ ${card.cost.toFixed(2)}`)
    .join("\n"); // Join all items with a newline
 
  // Template for the receipt
  const text = `
    ^Receipt
    Receipt Id: ${parchi.id}    01/10/2024    
-
    "Qty  name              cost 
    -----------------------------
    ${items}
    ------------------------------
    Time                 ${parchi.cashOutTime}
    ------------------------------
    Total              ₹ ${parchi.total.toFixed(2)}   
-
    *CONDITIONS APPLY:
    THE ACKNOWLEDGMENT SLIP SHOULD BE RETAINED TO 
    REDEEM THE PRODUCTS AND GIFTS
    {code:id:${parchi.id} ; option:code128,2,72,nohri}
  `;
  
  // Configure receipt options, e.g., characters per line (cpl)
  const options = { cpl: 42 };
  
  console.log(text);
  // Transform the receipt text using receiptline
  const result = receiptline.transform(text, options);
  
  return result;
}
