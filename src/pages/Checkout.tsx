import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online'>('online');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    entrance: '',
    floor: '',
    apartment: '',
    comment: ''
  });

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryType === 'delivery' ? (subtotal >= 3000 ? 0 : 300) : 0;
  const discountAmount = Math.floor(subtotal * (discount / 100));
  const total = subtotal + deliveryFee - discountAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuantityChange = (id: number, change: number) => {
    const newCart = cart.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleRemoveItem = (id: number) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const applyPromoCode = () => {
    if (promoCode === 'SWEET10') {
      setDiscount(10);
      alert('Промокод применён! Скидка 10%');
    } else if (promoCode === 'FIRST20') {
      setDiscount(20);
      alert('Промокод применён! Скидка 20%');
    } else {
      alert('Неверный промокод');
      setDiscount(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert('Корзина пуста');
      return;
    }

    if (!formData.name || !formData.phone) {
      alert('Пожалуйста, заполните обязательные поля');
      return;
    }

    if (deliveryType === 'delivery' && !formData.address) {
      alert('Укажите адрес доставки');
      return;
    }

    alert('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.');
    localStorage.removeItem('cart');
    navigate('/');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4 text-center">
          <Icon name="ShoppingCart" size={64} className="mx-auto text-muted-foreground mb-4" />
          <h1 className="text-3xl font-serif font-bold mb-4">Корзина пуста</h1>
          <p className="text-muted-foreground mb-8">Добавьте товары в корзину, чтобы оформить заказ</p>
          <Button onClick={() => navigate('/')}>
            Вернуться к покупкам
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
            >
              <Icon name="ArrowLeft" size={24} />
            </Button>
            <h1 className="text-3xl font-serif font-bold">Оформление заказа</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    Контактная информация
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Имя *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ваше имя"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+7 (999) 123-45-67"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@mail.ru"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      На этот адрес придёт подтверждение заказа
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    Способ получения
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('delivery')}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        deliveryType === 'delivery'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon name="Truck" size={24} className="text-primary" />
                        <span className="font-semibold">Доставка</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Доставим в удобное время
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        deliveryType === 'pickup'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon name="Store" size={24} className="text-primary" />
                        <span className="font-semibold">Самовывоз</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Бесплатно, г. Москва, ул. Пушкина, 10
                      </p>
                    </button>
                  </div>

                  {deliveryType === 'delivery' && (
                    <div className="space-y-4 pt-4 border-t">
                      <div>
                        <Label htmlFor="address">Адрес доставки *</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Улица, дом"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="entrance">Подъезд</Label>
                          <Input
                            id="entrance"
                            name="entrance"
                            value={formData.entrance}
                            onChange={handleInputChange}
                            placeholder="1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="floor">Этаж</Label>
                          <Input
                            id="floor"
                            name="floor"
                            value={formData.floor}
                            onChange={handleInputChange}
                            placeholder="5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="apartment">Квартира</Label>
                          <Input
                            id="apartment"
                            name="apartment"
                            value={formData.apartment}
                            onChange={handleInputChange}
                            placeholder="42"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <Label htmlFor="deliveryDate">Дата {deliveryType === 'delivery' ? 'доставки' : 'самовывоза'}</Label>
                      <Input
                        id="deliveryDate"
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryTime">Время</Label>
                      <select
                        id="deliveryTime"
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Выберите время</option>
                        <option value="10:00-12:00">10:00 - 12:00</option>
                        <option value="12:00-14:00">12:00 - 14:00</option>
                        <option value="14:00-16:00">14:00 - 16:00</option>
                        <option value="16:00-18:00">16:00 - 18:00</option>
                        <option value="18:00-20:00">18:00 - 20:00</option>
                        <option value="20:00-22:00">20:00 - 22:00</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    Способ оплаты
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('online')}
                      className={`p-4 border-2 rounded-lg text-center transition-colors ${
                        paymentMethod === 'online'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Icon name="CreditCard" size={24} className="mx-auto mb-2 text-primary" />
                      <span className="font-semibold block">Онлайн</span>
                      <span className="text-xs text-muted-foreground">Картой на сайте</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 border-2 rounded-lg text-center transition-colors ${
                        paymentMethod === 'card'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Icon name="Smartphone" size={24} className="mx-auto mb-2 text-primary" />
                      <span className="font-semibold block">Картой</span>
                      <span className="text-xs text-muted-foreground">При получении</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-4 border-2 rounded-lg text-center transition-colors ${
                        paymentMethod === 'cash'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Icon name="Wallet" size={24} className="mx-auto mb-2 text-primary" />
                      <span className="font-semibold block">Наличные</span>
                      <span className="text-xs text-muted-foreground">Курьеру</span>
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="MessageSquare" size={20} />
                    Комментарий к заказу
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder="Укажите особые пожелания или дополнительную информацию..."
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Ваш заказ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-3 pb-3 border-b">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.price} ₽</p>
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, -1)}
                                className="w-6 h-6 rounded border flex items-center justify-center hover:bg-secondary"
                              >
                                <Icon name="Minus" size={12} />
                              </button>
                              <span className="text-sm w-6 text-center">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.id, 1)}
                                className="w-6 h-6 rounded border flex items-center justify-center hover:bg-secondary"
                              >
                                <Icon name="Plus" size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="ml-auto text-destructive hover:text-destructive/80"
                              >
                                <Icon name="Trash2" size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Товары ({cart.reduce((sum, item) => sum + item.quantity, 0)} шт.)</span>
                        <span className="font-semibold">{subtotal} ₽</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Доставка</span>
                        <span className="font-semibold">
                          {deliveryFee === 0 ? 'Бесплатно' : `${deliveryFee} ₽`}
                        </span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Скидка {discount}%</span>
                          <span>-{discountAmount} ₽</span>
                        </div>
                      )}
                      {deliveryType === 'delivery' && subtotal < 3000 && (
                        <p className="text-xs text-muted-foreground">
                          Бесплатная доставка от 3000 ₽
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Input
                        placeholder="Промокод"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      />
                      <Button type="button" variant="outline" onClick={applyPromoCode}>
                        <Icon name="Tag" size={16} />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Попробуйте: SWEET10 или FIRST20
                    </p>

                    <div className="flex justify-between items-center text-xl font-bold pt-4 border-t">
                      <span>Итого:</span>
                      <span className="text-accent">{total} ₽</span>
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg">
                      Оформить заказ
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Icon name="Info" size={20} className="text-primary mt-0.5" />
                      <div className="text-sm space-y-1">
                        <p className="font-semibold">Важная информация:</p>
                        <ul className="text-muted-foreground space-y-1">
                          <li>• Минимальный заказ: 500 ₽</li>
                          <li>• Доставка в день заказа до 14:00</li>
                          <li>• Мы свяжемся для подтверждения</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
