import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .insert({
      shop_name: 'test02',
      address: 'Alem 1510',
      whatsapp_phone: '3496656770',
      delivery_price: 2500
    })
    .select('id')
    .single();

  if (shopError) {
    console.error('Error creating shop:', shopError.message);
    process.exit(1);
  }

  console.log('Shop created with id:', shop.id);

  const { error: itemsError } = await supabase.from('shop_items').insert([
    {
      shop_id: shop.id,
      name: 'Hamburguesa Clásica',
      price: 10,
      category: 'hamburguesas',
      description:
        'Pan brioche, medallón de carne 150g, lechuga, tomate, queso cheddar'
    },
    {
      shop_id: shop.id,
      name: 'Pizza Muzzarella',
      price: 50,
      category: 'pizzas',
      description: 'Salsa de tomate casera, muzzarella y aceitunas'
    }
  ]);

  if (itemsError) {
    console.error('Error creating items:', itemsError.message);
    process.exit(1);
  }

  console.log('2 items created successfully');
}

seed();
