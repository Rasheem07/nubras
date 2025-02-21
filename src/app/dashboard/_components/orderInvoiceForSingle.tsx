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
  order: Order;
}

const styles = StyleSheet.create({
  page: {
    padding: 48,
    backgroundColor: '#f9fafb', // Slight off-white background
    color: '#1a1a1a',
    border: '2px solid #000000', // Dark border around the page
  },
  header: {
    marginBottom: 32,
    borderBottomWidth: 2,   // Black border at the bottom of the header
    borderBottomColor: '#000000',
    paddingBottom: 16,      // Padding for spacing
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#4b5563',
    letterSpacing: 0.2,
  },
  divider: {
    borderBottomWidth: 2,   // Dark border for the divider
    borderBottomColor: '#000000',
    marginVertical: 32,
  },
  section: {
    marginBottom: 36,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 48,
  },
  infoBlock: {
    flex: 1,
  },
  infoRow: {
    marginBottom: 10,
  },
  value: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 1.5,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    fontSize: 13,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  totals: {
    marginLeft: 'auto',
    width: '35%',
    marginTop: 24,
    borderTopWidth: 2,        // Black border for the top of the totals section
    borderTopColor: '#000000',
    paddingTop: 16,           // Padding for spacing
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    fontSize: 13,
    color: '#4b5563',
  },
  totalRowBold: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 2,        // Black border for the top of the totals section
    borderTopColor: '#000000',
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    left: 48,
    right: 48,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 11,
    paddingTop: 24,
    borderTopWidth: 2,        // Black border at the top of the footer
    borderTopColor: '#000000',
  },
});



const getStatusStyle = (status: string) => {
  switch(status.toUpperCase()) {
    case 'COMPLETED':
      return { backgroundColor: '#dcfce7', color: '#15803d' };
    case 'PENDING':
      return { backgroundColor: '#fef9c3', color: '#a16207' };
    case 'PROCESSING':
      return { backgroundColor: '#dbeafe', color: '#1d4ed8' };
    default:
      return { backgroundColor: '#f8fafc', color: '#475569' };
  }
};

const OrderPDF = ({ order }: OrderInvoicePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page} >
      <View style={styles.header}>
        <Text style={styles.title}>Invoice</Text>


        <Text style={styles.subtitle}>#{order.InvoiceId} • {new Date(order.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <View style={styles.infoGrid}>
          <View style={styles.infoBlock}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={[styles.value, { fontWeight: 'bold', marginBottom: 4 }]}>{order.customerName}</Text>
            <Text style={styles.value}>{order.customerLocation}</Text>
            <Text style={[styles.value, { marginTop: 8 }]}>Branch: {order.branch}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.sectionTitle}>Order Details</Text>
            <Text style={[styles.statusBadge, getStatusStyle(order.status)]}>{order.status}</Text>
            <Text style={styles.value}>Payment: {order.paymentStatus}</Text>
            <Text style={styles.value}>Sales Rep: {order.salesPersonName}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Details</Text>
        <Text style={styles.value}>Product: {order.productName}</Text>
        <Text style={styles.value}>Quantity: {order.quantity}</Text>
        <Text style={styles.value}>Unit Price: ${order.productPrice.toFixed(2)}</Text>
        <Text style={styles.value}>Total Amount: ${order.totalAmount.toFixed(2)}</Text>
      </View>

      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text>Subtotal</Text>
          <Text>${order.totalAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>Tax (0%)</Text>
          <Text>$0.00</Text>
        </View>
        <View style={styles.totalRowBold}>
          <Text>Total Due</Text>
          <Text>${order.totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>Thank you for your business!</Text>
        {order.orderRegisteredBy && (
          <Text style={{ marginTop: 8, fontSize: 10 }}>
            Order processed by: {order.orderRegisteredBy}
          </Text>
        )}
      </View>
    </Page>
  </Document>
);

export default OrderPDF;
