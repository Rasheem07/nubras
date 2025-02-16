import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface Order {
  InvoiceId: string;
  date: Date;
  branch: string;
  status: string;
  orderedFrom: string;
  customerName: string;
  customerLocation: string;
  paymentStatus: string;
  productName: string;
  productPrice: number;
  salesPersonName: string;
  quantity: number;
  totalAmount: number;
  deliveryDate?: Date;
  paymentDate?: Date;
  orderRegisteredBy?: string;
}

interface OrderInvoicePDFProps {
  orders: Order[];
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
    minHeight: 30,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    padding: 6,
    fontSize: 9,
  },
  total: {
    marginTop: 20,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default function OrderInvoicePDF({ orders }: OrderInvoicePDFProps) {
  const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Order Invoice</Text>
        
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Invoice ID</Text>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>Customer</Text>
            <Text style={styles.tableCell}>Location</Text>
            <Text style={styles.tableCell}>Product</Text>
            <Text style={styles.tableCell}>Price</Text>
            <Text style={styles.tableCell}>Quantity</Text>
            <Text style={styles.tableCell}>Total</Text>
            <Text style={styles.tableCell}>Status</Text>
          </View>

          {orders.map((order) => (
            <View key={order.InvoiceId} style={styles.tableRow}>
              <Text style={styles.tableCell}>{order.InvoiceId}</Text>
              <Text style={styles.tableCell}>{new Date(order.date).toLocaleDateString()}</Text>
              <Text style={styles.tableCell}>{order.customerName}</Text>
              <Text style={styles.tableCell}>{order.customerLocation}</Text>
              <Text style={styles.tableCell}>{order.productName}</Text>
              <Text style={styles.tableCell}>${order.productPrice.toFixed(2)}</Text>
              <Text style={styles.tableCell}>{order.quantity}</Text>
              <Text style={styles.tableCell}>${order.totalAmount.toFixed(2)}</Text>
              <Text style={styles.tableCell}>{order.status}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.total}>
          Total Amount: ${totalAmount.toFixed(2)}
        </Text>
      </Page>
    </Document>
  );
}