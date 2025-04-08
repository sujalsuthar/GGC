"use client"

import { useEffect, useRef } from "react"
import { shopDetails } from "@/lib/shop-data"

interface PrintBillProps {
  billData: {
    invoiceNumber: string
    date: string
    customer: {
      name: string
      phone: string
      address: string
    }
    worker: string
    paymentMethod: string
    items: any[]
    subtotal: number
    gst: number
    total: number
  }
}

export function PrintBill({ billData }: PrintBillProps) {
  const printFrameRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Auto-print when component mounts
    const timer = setTimeout(() => {
      if (printFrameRef.current?.contentWindow) {
        printFrameRef.current.contentWindow.print()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bill - ${billData.invoiceNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #000;
        }
        .bill-container {
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid #000;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .header p {
          margin: 5px 0;
          font-size: 14px;
        }
        .info-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .info-section div {
          width: 48%;
        }
        .info-section p {
          margin: 5px 0;
          font-size: 14px;
        }
        .right-align {
          text-align: right;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #000;
          padding: 8px;
          text-align: left;
          font-size: 14px;
        }
        th {
          background-color: #f2f2f2;
        }
        .totals {
          width: 300px;
          margin-left: auto;
        }
        .totals table {
          margin-bottom: 0;
        }
        .totals td {
          padding: 5px;
        }
        .totals .total-row {
          font-weight: bold;
          font-size: 16px;
        }
        .footer {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
        }
        .terms {
          width: 60%;
          font-size: 12px;
        }
        .terms h4 {
          margin: 0 0 5px 0;
        }
        .terms ol {
          margin: 0;
          padding-left: 20px;
        }
        .signature {
          width: 30%;
          text-align: center;
        }
        .signature-line {
          margin-top: 50px;
          border-top: 1px solid #000;
          padding-top: 5px;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="bill-container">
        <div class="header">
          <h1>GANESH GLASS CENTER</h1>
          <p>${shopDetails.address}</p>
          <p>Phone: ${shopDetails.phone}</p>
          <p>GST: ${shopDetails.gstNumber}</p>
          <h2>TAX INVOICE</h2>
        </div>
        
        <div class="info-section">
          <div>
            <p><strong>Customer:</strong> ${billData.customer.name || "N/A"}</p>
            <p><strong>Phone:</strong> ${billData.customer.phone || "N/A"}</p>
            <p><strong>Address:</strong> ${billData.customer.address || "N/A"}</p>
          </div>
          <div class="right-align">
            <p><strong>Bill No:</strong> ${billData.invoiceNumber}</p>
            <p><strong>Date:</strong> ${new Date(billData.date).toLocaleDateString()}</p>
            <p><strong>Worker:</strong> ${billData.worker || "N/A"}</p>
            <p><strong>Payment:</strong> ${billData.paymentMethod.charAt(0).toUpperCase() + billData.paymentMethod.slice(1)}</p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Item</th>
              <th>Size</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Area</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${billData.items
              .map(
                (item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.productName}</td>
                <td>${item.width} × ${item.height} ${item.unit}</td>
                <td>${item.quantity}</td>
                <td>₹${item.pricePerSqFt}/sq.ft</td>
                <td>${item.area.toFixed(2)} sq.ft</td>
                <td>₹${item.totalPrice.toFixed(2)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="totals">
          <table>
            <tr>
              <td>Subtotal:</td>
              <td>₹${billData.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td>GST (18%):</td>
              <td>₹${billData.gst.toFixed(2)}</td>
            </tr>
            <tr class="total-row">
              <td>Total Amount:</td>
              <td>₹${billData.total.toFixed(2)}</td>
            </tr>
          </table>
        </div>
        
        <div class="footer">
          <div class="terms">
            <h4>Terms & Conditions:</h4>
            <ol>
              <li>Goods once sold will not be taken back.</li>
              <li>All disputes are subject to Ahmedabad jurisdiction.</li>
              <li>Payment to be made on delivery.</li>
            </ol>
          </div>
          <div class="signature">
            <p class="signature-line">Authorized Signature</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  return <iframe ref={printFrameRef} style={{ display: "none" }} title="Print Bill" srcDoc={printContent} />
}
