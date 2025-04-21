import { Bill } from "@/types";

export const mockBills: Bill[] = [
  {
    id: "bill-1",
    userId: "user-123",
    amount: 24.99,
    dueDate: "2023-07-15",
    isPaid: true,
    paidDate: "2023-07-10",
    invoiceNumber: "INV-2023-001",
    items: [
      { name: "Standard Mobile Package", amount: 24.99 }
    ]
  },
  {
    id: "bill-2",
    userId: "user-123",
    amount: 24.99,
    dueDate: "2023-08-15",
    isPaid: false,
    invoiceNumber: "INV-2023-002",
    items: [
      { name: "Standard Mobile Package", amount: 24.99 }
    ]
  },
  {
    id: "bill-3",
    userId: "user-123",
    amount: 49.98,
    dueDate: "2023-06-15",
    isPaid: true,
    paidDate: "2023-06-12",
    invoiceNumber: "INV-2023-000",
    items: [
      { name: "Standard Mobile Package", amount: 24.99 },
      { name: "Additional Data (5GB)", amount: 24.99 }
    ]
  },
  {
    id: "bill-4",
    userId: "user-123",
    amount: 24.99,
    dueDate: "2023-05-15",
    isPaid: true,
    paidDate: "2023-05-14",
    invoiceNumber: "INV-2022-012",
    items: [
      { name: "Standard Mobile Package", amount: 24.99 }
    ]
  },
  {
    id: "bill-5",
    userId: "user-123",
    amount: 24.99,
    dueDate: "2023-04-15",
    isPaid: true,
    paidDate: "2023-04-10",
    invoiceNumber: "INV-2022-011",
    items: [
      { name: "Standard Mobile Package", amount: 24.99 }
    ]
  }
];