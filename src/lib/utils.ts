import { api } from './api';

export async function logAudit(
  action: string,
  entityType: string,
  entityId: string,
  oldValues?: Record<string, unknown>,
  newValues?: Record<string, unknown>
) {
  try {
    // Note: In a real implementation, you might need to get the current user
    // from your authentication context or localStorage
    // For now, we'll log without user_id or handle it server-side
    
    // If your API requires authentication, make sure the token is set
    // The API client will handle the authorization header
    
    // You can add user_id from localStorage or context if available
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const userId = user?.id || 'system';

    // Since your API doesn't have a direct audit log endpoint,
    // you might want to:
    // 1. Create an audit log endpoint in your backend
    // 2. Log audits on the server side automatically
    // 3. Or use a client-side logging service
    
    console.log('Audit Log:', {
      action,
      entityType,
      entityId,
      oldValues,
      newValues,
      userId,
      timestamp: new Date().toISOString(),
    });

    // If you add an audit log endpoint to your API, uncomment this:
    // await api.logAudit({
    //   user_id: userId,
    //   action,
    //   entity_type: entityType,
    //   entity_id: entityId,
    //   old_values: oldValues,
    //   new_values: newValues,
    // });

  } catch (error) {
    console.error('Error logging audit:', error);
  }
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}${day}-${random}`;
}

export function generatePatientCode(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PAT-${year}${month}-${random}`;
}

export function generateTreatmentCode(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TRT-${year}${month}-${random}`;
}

export function generatePackageCode(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PKG-${year}${month}-${random}`;
}

export function generateItemCode(category: string): string {
  const prefix = category.substring(0, 3).toUpperCase();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${random}`;
}

export function formatCurrency(amount: number): string {
  // Format for Nigerian Naira using NGN and replace "NGN" with "₦"
  let formatted = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  // For some browsers/locales "NGN" may be shown as "NGN", replace with symbol if so
  if (formatted.includes('NGN')) {
    formatted = formatted.replace('NGN', '₦').replace(/\s/, '');
  }
  return formatted;
}

export function formatDate(date: string | Date, includeTime: boolean = false): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (includeTime) {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function calculateLineTotal(
  quantity: number,
  unitPrice: number,
  taxRate: number
): number {
  const subtotal = quantity * unitPrice;
  const tax = subtotal * (taxRate / 100);
  return parseFloat((subtotal + tax).toFixed(2));
}

export function calculateInvoiceTotals(items: Array<{
  quantity: number;
  unit_price: number;
  tax_rate: number;
}>, discountPercentage: number = 0) {
  let subtotal = 0;
  let taxAmount = 0;

  items.forEach(item => {
    const itemSubtotal = item.quantity * item.unit_price;
    const itemTax = itemSubtotal * (item.tax_rate / 100);
    subtotal += itemSubtotal;
    taxAmount += itemTax;
  });

  const discountAmount = subtotal * (discountPercentage / 100);
  const totalAmount = subtotal + taxAmount - discountAmount;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    totalAmount: parseFloat(totalAmount.toFixed(2)),
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}