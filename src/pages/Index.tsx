import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  weight: string;
  ingredients: string;
  vegan?: boolean;
  sugarFree?: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Шоколадный торт',
    category: 'Торты',
    price: 2500,
    image: '/img/3d8f9caa-ee38-4b28-b75c-589d1da2777e.jpg',
    images: [
      '/img/3d8f9caa-ee38-4b28-b75c-589d1da2777e.jpg',
      '/img/0102c881-a526-4f87-b09e-db8a602b4315.jpg',
      '/img/f7d91e07-7dc9-4ebf-b3ae-135db72491aa.jpg',
      '/img/89776e47-f699-41c9-acfa-c60563a3e1b3.jpg'
    ],
    description: 'Нежный шоколадный бисквит с кремом из бельгийского шоколада',
    weight: '1200г',
    ingredients: 'Мука пшеничная, масло сливочное, шоколад, яйца, сахар'
  },
  {
    id: 2,
    name: 'Французские макаруны',
    category: 'Макаруны',
    price: 450,
    image: '/img/d3f87343-6e9c-4675-9149-de7b105721f3.jpg',
    description: 'Воздушные миндальные пирожные с изысканной начинкой',
    weight: '6 шт',
    ingredients: 'Миндальная мука, сахарная пудра, яичные белки, крем'
  },
  {
    id: 3,
    name: 'Капкейки премиум',
    category: 'Капкейки',
    price: 350,
    image: '/img/732c8b9c-f3a5-4cf6-8a72-3e010acae1af.jpg',
    description: 'Изысканные капкейки с нежным кремом и ягодами',
    weight: '4 шт',
    ingredients: 'Мука, масло, яйца, ванильный крем, свежие ягоды'
  },
  {
    id: 4,
    name: 'Ягодный тарт',
    category: 'Пирожные',
    price: 380,
    vegan: true,
    image: '/img/732c8b9c-f3a5-4cf6-8a72-3e010acae1af.jpg',
    description: 'Хрустящая основа с кремом и сезонными ягодами',
    weight: '180г',
    ingredients: 'Мука, кокосовое масло, ягоды, кокосовый крем'
  },
  {
    id: 5,
    name: 'Чизкейк Нью-Йорк',
    category: 'Торты',
    price: 420,
    image: '/img/3d8f9caa-ee38-4b28-b75c-589d1da2777e.jpg',
    description: 'Классический американский чизкейк на песочной основе',
    weight: '180г',
    ingredients: 'Сливочный сыр, печенье, масло, яйца, сахар'
  },
  {
    id: 6,
    name: 'Веганский брауни',
    category: 'Веганские',
    price: 280,
    vegan: true,
    sugarFree: true,
    image: '/img/3d8f9caa-ee38-4b28-b75c-589d1da2777e.jpg',
    description: 'Насыщенный шоколадный вкус без продуктов животного происхождения',
    weight: '120г',
    ingredients: 'Кокосовая мука, кокосовое масло, какао, финиковый сироп'
  }
];

const categories = [
  { name: 'Торты', icon: 'Cake' },
  { name: 'Капкейки', icon: 'Coffee' },
  { name: 'Макаруны', icon: 'Cookie' },
  { name: 'Пирожные', icon: 'Croissant' },
  { name: 'Веганские', icon: 'Leaf' },
  { name: 'Сезонные', icon: 'Sparkles' }
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<Record<number, number>>({});

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const filteredProducts =
    selectedCategory === 'Все'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/30">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Icon name="Cake" className="text-primary-foreground" size={24} />
            </div>
            <h1 className="text-2xl font-bold font-serif">Sweet Delight</h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#catalog" className="text-sm hover:text-accent transition-colors">
              Каталог
            </a>
            <a href="#about" className="text-sm hover:text-accent transition-colors">
              О нас
            </a>
            <a href="#delivery" className="text-sm hover:text-accent transition-colors">
              Доставка
            </a>
            <a href="#contact" className="text-sm hover:text-accent transition-colors">
              Контакты
            </a>
          </nav>

          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Icon name="ShoppingBag" size={20} />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle className="font-serif text-2xl">Корзина</SheetTitle>
              </SheetHeader>
              <div className="mt-8 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Корзина пуста</p>
                ) : (
                  <>
                    {cart.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.price} ₽</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, -1)}
                                >
                                  <Icon name="Minus" size={14} />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Icon name="Plus" size={14} />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 ml-auto"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Icon name="Trash2" size={14} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <div className="border-t pt-4 mt-6">
                      <div className="flex justify-between mb-4">
                        <span className="font-semibold">Итого:</span>
                        <span className="text-xl font-bold">{totalPrice} ₽</span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Имя</Label>
                          <Input id="name" placeholder="Ваше имя" />
                        </div>
                        <div>
                          <Label htmlFor="phone">Телефон</Label>
                          <Input id="phone" placeholder="+7 (999) 999-99-99" />
                        </div>
                        <div>
                          <Label htmlFor="address">Адрес доставки</Label>
                          <Textarea id="address" placeholder="Улица, дом, квартира" />
                        </div>
                        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                          Оформить заказ
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/img/3d8f9caa-ee38-4b28-b75c-589d1da2777e.jpg')`,
            filter: 'brightness(0.7)'
          }}
        />
        <div className="relative z-10 text-center text-white px-4 animate-fade-in">
          <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6">
            Сладости ручной работы
          </h2>
          <p className="text-xl md:text-2xl mb-8 font-light">
            Из премиальных ингредиентов без консервантов
          </p>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6"
          >
            Смотреть каталог
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16" id="catalog">
        <h2 className="text-4xl font-serif font-bold text-center mb-12">Категории</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {categories.map((cat) => (
            <Card
              key={cat.name}
              className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                selectedCategory === cat.name ? 'ring-2 ring-accent' : ''
              }`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon name={cat.icon as any} size={32} className="text-accent" />
                </div>
                <h3 className="font-semibold">{cat.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-serif font-bold">Каталог</h2>
          <Button
            variant="outline"
            onClick={() => setSelectedCategory('Все')}
            className={selectedCategory === 'Все' ? 'bg-accent text-accent-foreground' : ''}
          >
            Показать все
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-xl transition-shadow animate-scale-in"
            >
              <div className="relative h-64 group">
                <img
                  src={product.images?.[selectedImageIndex[product.id] || 0] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {product.images && product.images.length > 1 && (
                  <>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {product.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageIndex((prev) => ({ ...prev, [product.id]: idx }));
                          }}
                          className={`w-2 h-2 rounded-full transition-all ${
                            (selectedImageIndex[product.id] || 0) === idx
                              ? 'bg-white w-6'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex((prev) => ({
                          ...prev,
                          [product.id]: ((prev[product.id] || 0) - 1 + product.images!.length) % product.images!.length
                        }));
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon name="ChevronLeft" size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex((prev) => ({
                          ...prev,
                          [product.id]: ((prev[product.id] || 0) + 1) % product.images!.length
                        }));
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon name="ChevronRight" size={20} />
                    </button>
                  </>
                )}
                {product.vegan && (
                  <Badge className="absolute top-3 right-3 bg-muted">
                    <Icon name="Leaf" size={14} className="mr-1" />
                    Vegan
                  </Badge>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-serif font-semibold mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.weight}</p>
                  </div>
                  <span className="text-2xl font-bold text-accent">{product.price} ₽</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => addToCart(product)}
                >
                  <Icon name="ShoppingCart" size={18} className="mr-2" />В корзину
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-secondary/50 py-16" id="about">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center mb-12">Почему мы?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                  <Icon name="Heart" size={32} className="text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Ручная работа</h3>
                <p className="text-muted-foreground">
                  Каждый десерт создается вручную нашими мастерами-кондитерами
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                  <Icon name="Sparkles" size={32} className="text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Премиум ингредиенты</h3>
                <p className="text-muted-foreground">
                  Используем только натуральные и качественные продукты
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                  <Icon name="Clock" size={32} className="text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Всегда свежее</h3>
                <p className="text-muted-foreground">
                  Готовим в день заказа, без консервантов и заморозки
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-foreground/5 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif text-xl font-bold mb-4">Sweet Delight</h3>
              <p className="text-sm text-muted-foreground">
                Кондитерская премиум-класса с доставкой по городу
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <p className="text-sm text-muted-foreground mb-2">+7 (999) 123-45-67</p>
              <p className="text-sm text-muted-foreground">info@sweetdelight.ru</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Мы в соцсетях</h4>
              <div className="flex gap-4">
                <Icon name="Instagram" size={24} className="text-muted-foreground hover:text-accent cursor-pointer transition-colors" />
                <Icon name="Facebook" size={24} className="text-muted-foreground hover:text-accent cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 Sweet Delight. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}