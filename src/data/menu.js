export const CATEGORIES = [
  { id: 'all', name: 'Tất cả món', icon: 'Sparkles', count: 16 },
  { id: 'banh-trang', name: 'Bánh tráng & Cuốn', icon: 'Flame', count: 3 },
  { id: 'chien-nuong', name: 'Chiên & Nướng thơm lừng', icon: 'UtensilsCrossed', count: 4 },
  { id: 'chua-cay', name: 'Chua cay Sốt Thái', icon: 'Zap', count: 2 },
  { id: 'no-nhe', name: 'Ăn nhẹ no bụng', icon: 'Soup', count: 3 },
  { id: 'giai-khat', name: 'Trà & Nước giải khát', icon: 'Coffee', count: 3 },
  { id: 'trang-mieng', name: 'Chè & Tráng miệng', icon: 'CakeSlice', count: 1 }
]

export const MENU_ITEMS = [
  {
    id: 1,
    name: 'Bánh tráng nướng Đà Lạt đặc biệt',
    category: 'banh-trang',
    price: 25000,
    originalPrice: 30000,
    rating: 4.9,
    reviewsCount: 342,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=700&auto=format&fit=crop&q=80',
    description: 'Vỏ bánh giòn rụm nướng trên than hồng, đầy đặn topping trứng cút, khô bò thượng hạng, xúc xích, phô mai Mozzarella dẻo dai và sốt bơ béo ngậy.',
    spicyLevel: 1, // 0-3
    prepTime: '7 - 10 phút',
    tags: ['Best Seller', 'Giòn rụm', 'Nóng hổi'],
    toppings: [
      { id: 't1', name: 'Thêm phô mai sợi kéo dẻo', price: 8000 },
      { id: 't2', name: 'Gấp đôi khô bò cay', price: 7000 },
      { id: 't3', name: 'Thêm trứng cút lòng đào', price: 5000 }
    ]
  },
  {
    id: 2,
    name: 'Bánh tráng trộn khô bò & mực xé',
    category: 'banh-trang',
    price: 28000,
    originalPrice: 32000,
    rating: 4.8,
    reviewsCount: 289,
    badge: 'Món Ruột',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=700&auto=format&fit=crop&q=80',
    description: 'Bánh tráng Tây Ninh dẻo dai trộn đều cùng sa tế tôm cay nồng, khô bò vụn, mực xé tẩm vị, trứng cút chiên giòn, xoài xanh bào sợi chua ngọt và rau răm thơm nồng.',
    spicyLevel: 2,
    prepTime: '5 phút',
    tags: ['Đậm vị', 'Món Ruột'],
    toppings: [
      { id: 't4', name: 'Thêm bơ hột gà béo ngậy', price: 6000 },
      { id: 't5', name: 'Thêm tóp mỡ da heo giòn', price: 8000 },
      { id: 't6', name: 'Sốt me chua ngọt đặc biệt', price: 5000 }
    ]
  },
  {
    id: 3,
    name: 'Cá viên chiên nước mắm tỏi bơ xóc đậu bắp',
    category: 'chien-nuong',
    price: 45000,
    originalPrice: 55000,
    rating: 5.0,
    reviewsCount: 512,
    badge: 'Cực Hot',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&auto=format&fit=crop&q=80',
    description: 'Mẹt chiên thập cẩm gồm cá viên chiên giòn, bò viên gân, xúc xích hồ lô, chả cá cốm, đậu bắp chiên xóc nước mắm tỏi ớt kẹo sệt thơm nức mũi.',
    spicyLevel: 2,
    prepTime: '10 - 12 phút',
    tags: ['Cực Hot', 'Đậm đà', 'Bestseller'],
    toppings: [
      { id: 't7', name: 'Thêm tỏi phi giòn rụm', price: 5000 },
      { id: 't8', name: 'Thêm hồ lô phô mai nướng', price: 12000 },
      { id: 't9', name: 'Sốt trứng muối hoàng kim', price: 10000 }
    ]
  },
  {
    id: 4,
    name: 'Nem chua rán phố cổ Hà Nội (Phần 8 cây)',
    category: 'chien-nuong',
    price: 38000,
    originalPrice: 42000,
    rating: 4.9,
    reviewsCount: 198,
    badge: 'Chuẩn Vị',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80',
    description: 'Nem chua lăn bột chiên vàng ươm bên ngoài, bên trong dẻo dai mềm ngọt thơm mùi thịt và bì lợn, chấm cùng tương ớt cay xè chuẩn phong cách trà chanh vỉa hè Hà Nội.',
    spicyLevel: 1,
    prepTime: '8 phút',
    tags: ['Chuẩn Vị', 'Giòn tan'],
    toppings: [
      { id: 't10', name: 'Đĩa dưa leo & xoài non muối ớt', price: 8000 },
      { id: 't11', name: 'Tương ớt cay đặc chế', price: 4000 }
    ]
  },
  {
    id: 5,
    name: 'Khoai tây lốc xoáy phô mai lắc bơ',
    category: 'chien-nuong',
    price: 22000,
    originalPrice: 25000,
    rating: 4.7,
    reviewsCount: 164,
    badge: '',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=700&auto=format&fit=crop&q=80',
    description: 'Củ khoai tây tươi cắt xoắn ốc giòn rụm từng lát mỏng, rắc ngập tràn bột phô mai cam thơm béo hoặc bột xí muội chua ngọt mê ly.',
    spicyLevel: 0,
    prepTime: '6 phút',
    tags: ['Trẻ em mê', 'Béo ngậy'],
    toppings: [
      { id: 't12', name: 'Lắc thêm xí muội chua ngọt', price: 4000 },
      { id: 't13', name: 'Thêm xốt tương cà mayonaise', price: 4000 }
    ]
  },
  {
    id: 6,
    name: 'Chân gà rút xương sốt Thái cóc non chua cay',
    category: 'chua-cay',
    price: 52000,
    originalPrice: 60000,
    rating: 4.9,
    reviewsCount: 420,
    badge: 'Món Nhậu Đỉnh',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=700&auto=format&fit=crop&q=80',
    description: 'Chân gà tươi rút xương giòn sần sật ngâm sốt Thái sền sệt đậm đà, thơm lừng mùi sả, lá chanh, quất tươi và cóc non ngâm chua giòn đã miệng.',
    spicyLevel: 3,
    prepTime: '5 phút',
    tags: ['Món Nhậu Đỉnh', 'Chua cay', 'Giòn rụm'],
    toppings: [
      { id: 't14', name: 'Gấp đôi cóc non ngâm giòn', price: 7000 },
      { id: 't15', name: 'Muối ớt xanh chấm chân gà', price: 5000 }
    ]
  },
  {
    id: 7,
    name: 'Bánh tráng cuốn bơ sốt me trứng cút',
    category: 'banh-trang',
    price: 26000,
    originalPrice: 30000,
    rating: 4.7,
    reviewsCount: 145,
    badge: '',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=700&auto=format&fit=crop&q=80',
    description: 'Bánh tráng dẻo thơm cuốn chắc tay cùng hành phi, khô bò, trứng cút chiên, chấm ngập ngụa trong nước sốt me đặc quánh kết hợp bơ hột gà béo thơm.',
    spicyLevel: 1,
    prepTime: '6 phút',
    tags: ['Béo bùi', 'Học sinh sinh viên'],
    toppings: [
      { id: 't16', name: 'Thêm chén bơ béo', price: 5000 },
      { id: 't17', name: 'Thêm chén xốt me cay', price: 5000 }
    ]
  },
  {
    id: 8,
    name: 'Bánh mì nướng muối ớt phô mai chà bông',
    category: 'no-nhe',
    price: 25000,
    originalPrice: 28000,
    rating: 4.8,
    reviewsCount: 230,
    badge: 'No Nhanh',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=700&auto=format&fit=crop&q=80',
    description: 'Ổ bánh mì ép dẹp quét đều bơ và sa tế muối ớt nướng giòn tan trên than hồng, phủ chà bông heo xịn sò, mỡ hành xanh mướt, ruốc tép và sốt mayonnaise.',
    spicyLevel: 2,
    prepTime: '8 phút',
    tags: ['No Nhanh', 'Giòn cay'],
    toppings: [
      { id: 't18', name: 'Thêm xúc xích nướng', price: 7000 },
      { id: 't19', name: 'Thêm phô mai lát', price: 6000 }
    ]
  },
  {
    id: 9,
    name: 'Bắp xào bơ tôm khô tép ruốc hành phi',
    category: 'chien-nuong',
    price: 24000,
    originalPrice: 28000,
    rating: 4.6,
    reviewsCount: 177,
    badge: '',
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=700&auto=format&fit=crop&q=80',
    description: 'Hạt bắp nếp dẻo thơm xào nóng hổi cùng bơ thực vật thơm lừng, tép biển rim mặn ngọt và hành lá xắt nhuyễn giòn ngọt đầu lưỡi.',
    spicyLevel: 0,
    prepTime: '7 phút',
    tags: ['Thơm bơ', 'Ăn vặt phố'],
    toppings: [
      { id: 't20', name: 'Thêm tóp mỡ mắm ớt', price: 8000 }
    ]
  },
  {
    id: 10,
    name: 'Gỏi cuốn tôm thịt tai heo chấm tương bơ lạc',
    category: 'no-nhe',
    price: 36000,
    originalPrice: 40000,
    rating: 4.9,
    reviewsCount: 310,
    badge: 'Thanh Mát',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=80',
    description: 'Phần 4 cuốn bự căng tròn với tôm sú tươi luộc ngọt thịt, thịt ba chỉ, bún tươi và các loại rau ghém tươi sạch, chấm cùng tương bơ đậu phộng rang giã mịn.',
    spicyLevel: 0,
    prepTime: '5 phút',
    tags: ['Healthy', 'Thanh mát'],
    toppings: [
      { id: 't21', name: 'Chén tương đậu phộng thêm', price: 5000 },
      { id: 't22', name: 'Nước mắm tỏi ớt chua ngọt', price: 4000 }
    ]
  },
  {
    id: 11,
    name: 'Xôi mặn bát phố thập cẩm lạp xưởng trứng cút',
    category: 'no-nhe',
    price: 32000,
    originalPrice: 35000,
    rating: 4.8,
    reviewsCount: 195,
    badge: 'Ăn No',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=700&auto=format&fit=crop&q=80',
    description: 'Hạt nếp nương đồ dẻo bóng mượt, thơm phức mùi mỡ hành, phủ lạp xưởng Mai Quế Lộ chiên thơm, chà bông gà cay, pate gan bùi béo và hành phi giòn.',
    spicyLevel: 1,
    prepTime: '5 phút',
    tags: ['Ăn No', 'Năng lượng'],
    toppings: [
      { id: 't23', name: 'Thêm pate gan béo', price: 6000 },
      { id: 't24', name: 'Thêm lạp xưởng nướng', price: 8000 }
    ]
  },
  {
    id: 12,
    name: 'Chân gà ngâm sả ớt sốt tắc truyền thống',
    category: 'chua-cay',
    price: 48000,
    originalPrice: 55000,
    rating: 4.8,
    reviewsCount: 260,
    badge: '',
    image: 'https://images.unsplash.com/photo-1527477378407-63e26424c3ce?w=700&auto=format&fit=crop&q=80',
    description: 'Chân gà bóp muối chanh sạch sẽ, ngâm sả tắc ớt tươi nước mắm giấm đường thanh khiết, ngấm đều gia vị giòn sần sật.',
    spicyLevel: 2,
    prepTime: '5 phút',
    tags: ['Chua ngọt', 'Đưa miệng'],
    toppings: [
      { id: 't25', name: 'Cóc bao tử ngâm kèm', price: 6000 }
    ]
  },
  {
    id: 13,
    name: 'Trà mãng cầu xiêm chua ngọt giải nhiệt',
    category: 'giai-khat',
    price: 28000,
    originalPrice: 32000,
    rating: 4.9,
    reviewsCount: 450,
    badge: 'Hot Trend',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=700&auto=format&fit=crop&q=80',
    description: 'Cốt trà lài thơm dịu kết hợp thịt mãng cầu xiêm ủ đường chua chua ngọt ngọt nhai đã miệng, xua tan ngay cái oi bức ngày hè.',
    spicyLevel: 0,
    prepTime: '4 phút',
    tags: ['Hot Trend', 'Giải nhiệt'],
    toppings: [
      { id: 't26', name: 'Thêm thạch trân châu trắng 3Q', price: 6000 },
      { id: 't27', name: 'Gấp đôi thịt mãng cầu', price: 8000 }
    ]
  },
  {
    id: 14,
    name: 'Trà đào cam sả thanh mát hạt chia',
    category: 'giai-khat',
    price: 29000,
    originalPrice: 35000,
    rating: 4.8,
    reviewsCount: 380,
    badge: '',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=700&auto=format&fit=crop&q=80',
    description: 'Trà đen đậm vị ủ cùng sả đập dập thơm the mát, nước cam vàng tươi mọng nước, miếng đào ngâm giòn sựt và hạt chia bổ dưỡng.',
    spicyLevel: 0,
    prepTime: '4 phút',
    tags: ['Thanh lọc', 'Đào giòn'],
    toppings: [
      { id: 't28', name: 'Thêm 2 miếng đào ngâm', price: 8000 },
      { id: 't29', name: 'Thạch nha đam giòn ngọt', price: 6000 }
    ]
  },
  {
    id: 15,
    name: 'Trà sữa trân châu đường đen hoàng kim',
    category: 'giai-khat',
    price: 32000,
    originalPrice: 38000,
    rating: 4.9,
    reviewsCount: 620,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1558857563-b371f30ca6a5?w=700&auto=format&fit=crop&q=80',
    description: 'Trà sữa Đài Loan truyền thống đậm hương lá trà tươi, sữa tươi thanh trùng, trân châu hoàng kim nấu đường mật mía dẻo dai bùi béo.',
    spicyLevel: 0,
    prepTime: '4 phút',
    tags: ['Trà sữa', 'Gây nghiện'],
    toppings: [
      { id: 't30', name: 'Thêm kem cheese béo mặn', price: 9000 },
      { id: 't31', name: 'Thêm pudding trứng mềm tan', price: 7000 }
    ]
  },
  {
    id: 16,
    name: 'Chè dừa dầm cốt dừa Hải Phòng thạch củ năng',
    category: 'trang-mieng',
    price: 28000,
    originalPrice: 32000,
    rating: 5.0,
    reviewsCount: 275,
    badge: 'Cực Đỉnh',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=700&auto=format&fit=crop&q=80',
    description: 'Cơm dừa non giòn béo, thạch củ năng hạt lựu dai giòn sần sật, trân châu nhân dừa chan ngập nước cốt dừa thơm béo chuẩn gốc Hải Phòng.',
    spicyLevel: 0,
    prepTime: '5 phút',
    tags: ['Cực Đỉnh', 'Ngọt ngào'],
    toppings: [
      { id: 't32', name: 'Thêm dừa khô sấy giòn', price: 5000 },
      { id: 't33', name: 'Thêm thạch hoa đậu biếc', price: 6000 }
    ]
  }
]

export const PROMO_CODES = {
  'PHOANVAT': {
    code: 'PHOANVAT',
    discountPercent: 15,
    maxDiscount: 40000,
    description: 'Giảm 15% tối đa 40k cho tín đồ ăn vặt phố'
  },
  'FREESHIP': {
    code: 'FREESHIP',
    discountAmount: 18000,
    description: 'Miễn phí ship đến 18k cho mọi đơn từ 60k'
  },
  'ANVATHOMNAY': {
    code: 'ANVATHOMNAY',
    discountAmount: 20000,
    description: 'Tặng 20k cho đơn từ 100k'
  }
}
