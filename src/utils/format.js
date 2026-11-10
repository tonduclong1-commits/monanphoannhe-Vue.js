export function formatVND(value) {
  if (typeof value !== 'number') return '0 đ'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value).replace('₫', 'đ')
}
