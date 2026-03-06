import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const users = [
  { email: 'admin@example.com', role: 'admin', first_name: 'Admin', last_name: 'User', phone: '09123456789' },
  { email: 'cabalen@reseato.com', role: 'vendor', first_name: 'Cabalen', last_name: 'Manager', phone: '09000000000' },
  { email: 'chikaan@reseato.com', role: 'vendor', first_name: 'Chika-an', last_name: 'Manager', phone: '09000000001' },
  { email: 'superbowl@reseato.com', role: 'vendor', first_name: 'Superbowl', last_name: 'Manager', phone: '09000000002' },
  { email: 'sachiramen@reseato.com', role: 'vendor', first_name: 'Sachi', last_name: 'Manager', phone: '09000000003' },
  { email: 'seoulblack@reseato.com', role: 'vendor', first_name: 'Seoul', last_name: 'Manager', phone: '09000000004' },
  { email: 'seafoodribs@reseato.com', role: 'vendor', first_name: 'Seafood', last_name: 'Manager', phone: '09000000005' },
  { email: 'kuyaj@reseato.com', role: 'vendor', first_name: 'Kuya', last_name: 'J', phone: '09000000006' },
  { email: 'somac@reseato.com', role: 'vendor', first_name: 'Somac', last_name: 'Manager', phone: '09000000007' },
  { email: 'mesa@reseato.com', role: 'vendor', first_name: 'Mesa', last_name: 'Manager', phone: '09000000008' },
  { email: 'boybelly@reseato.com', role: 'vendor', first_name: 'Boy', last_name: 'Belly', phone: '09000000009' },
]

const restaurants = [
  {
    name: 'Cabalen',
    description: 'All-you-can-eat Filipino buffet featuring Kapampangan specialties.',
    cuisine_type: 'Filipino',
    address: 'SM Seaside City, Cebu',
    phone: '032-456-7890',
    email: 'inquiry@cabalen.ph',
    opening_time: '10:00:00',
    closing_time: '21:00:00',
    rating: 4.3,
    owner_email: 'cabalen@reseato.com',
    image_url:
      'https://static.wixstatic.com/media/382e5f_c8208f93156f478986728e53bd9e331c~mv2.png/v1/fill/w_551,h_551,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/382e5f_c8208f93156f478986728e53bd9e331c~mv2.png',
  },
  {
    name: 'Chika-an Cebuano Kitchen',
    description: 'Authentic Cebuano dishes served in a homey atmosphere.',
    cuisine_type: 'Filipino',
    address: 'SM City Cebu',
    phone: '032-233-0350',
    email: 'info@chikaan.com',
    opening_time: '10:00:00',
    closing_time: '21:00:00',
    rating: 4.6,
    owner_email: 'chikaan@reseato.com',
    image_url:
      'https://scontent.fcgy2-2.fna.fbcdn.net/v/t39.30808-6/539011713_1198754658955735_5756152376187219456_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=2a1932&_nc_eui2=AeFDtrgY9oHFj7y2tnsqgU60-R1EHHT7obb5HUQcdPuhtqzoh1BLq_Mp6rr6rye00G0Dfn9XteYbpVZeD5ArU6pz&_nc_ohc=b1MwI5EbNIMQ7kNvwFg8FTZ&_nc_oc=AdnJw8ZMZQOLCEtgjRwsB_7ruGlTxnk4ZfZ1drVoepKm148AtSJCTJGSTVFDWjhZObRXA51DCqL6BNHbRtZWT_E5&_nc_zt=23&_nc_ht=scontent.fcgy2-2.fna&_nc_gid=cwHHZEu-07JPRxTEbXEaDw&oh=00_AftCahtssXlyt8feWKxmzVETtI_Y1fcTp6rUJrgDFmmF3g&oe=69A342BE',
  },
  {
    name: 'Superbowl of China',
    description: 'Serving delicious Chinese favorites and dimsum.',
    cuisine_type: 'Chinese',
    address: 'SM City Cebu',
    phone: '032-231-1234',
    email: 'info@superbowl.com',
    opening_time: '10:00:00',
    closing_time: '21:00:00',
    rating: 4.4,
    owner_email: 'superbowl@reseato.com',
    image_url:
      'https://scontent.fcgy2-1.fna.fbcdn.net/v/t39.30808-6/599622729_1300728905416080_1204480223111860567_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeHHfYk-2Qbk84YXVk2WB9KMWFoWfRVljM5YWhZ9FWWMziKt4HFWEqEW1ZxLSFvNAWowOHY6bOpG1wdQ7i-t_5_8&_nc_ohc=8gVeJSUSPFcQ7kNvwFvuA0S&_nc_oc=Adk1B3QpS922IMkOSdwybBEXhK6RPAIFgB-fuf_NZTdXaxaNqPKBMT-xW4w5Fg_fxTeh9yPctImCM018BssvHy5E&_nc_zt=23&_nc_ht=scontent.fcgy2-1.fna&_nc_gid=6GNBexgGc9XmVj_xhby0jQ&oh=00_AfsOQVZ7Hw7vfrk5RatuKwcr7UBNpdwCTnz1lwOkxsNz9A&oe=69A3325E',
  },
  {
    name: 'Sachi Ramen',
    description: 'Authentic Japanese Ramen and Asian fusion dishes.',
    cuisine_type: 'Japanese',
    address: 'SM City Cebu',
    phone: '032-412-4567',
    email: 'info@sachiramen.com',
    opening_time: '11:00:00',
    closing_time: '22:00:00',
    rating: 4.7,
    owner_email: 'sachiramen@reseato.com',
    image_url:
      'https://images.hive.blog/0x0/https://files.peakd.com/file/peakd-hive/indayclara/EoK5NFgi4KCW5c22sGaZwB392hCmsnycZwK7ECbmB4gr6wW4nbao2wKLGU4y8XsYgR2.jpg',
  },
  {
    name: 'Seoul Black',
    description: 'Authentic Korean cuisine in the heart of SM Seaside.',
    cuisine_type: 'Korean',
    address: 'Upper Ground Floor, Cube Wing, SM Seaside City Cebu',
    phone: '0927 508 6275',
    email: 'contact@seoulblack.com',
    opening_time: '10:00:00',
    closing_time: '21:00:00',
    rating: 4.5,
    owner_email: 'seoulblack@reseato.com',
    image_url:
      'https://scontent.fcgy2-1.fna.fbcdn.net/v/t39.30808-6/485876367_694469239918258_9125476005181298509_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeFwsFoVlsljRNeiAWcsYM31CGoaho-QLpUIahqGj5AulXwBKaLL6u-vFc5uLYD0EX6QkjHHgODbzL6YkAaKqgmG&_nc_ohc=FDVrt-HyGUcQ7kNvwHknBc_&_nc_oc=AdkFRAwbfcqrhSEogmmd7RyppKzrCAXKWShNZBLsrBDGopdovZEy-4wnSDqIFjr8qFiL0P2wqcIKR4o9TxhKEptn&_nc_zt=23&_nc_ht=scontent.fcgy2-1.fna&_nc_gid=WWFeXMbuZII_UBTUd2oBAA&oh=00_AftDYdJk3zB6hdBpClptcvC0BhQ6a-mXS-CoJ8e0owh1hg&oe=69A32EA3',
  },
  {
    name: 'Seafood & Ribs Warehouse',
    description: 'Fresh Seafood Paluto Restaurant. NO COOKING FEE 💯',
    cuisine_type: 'Seafood',
    address: '3F Mountain Wing Skypark, SM Seaside Cebu',
    phone: '0917 123 4567',
    email: 'info@seafoodribs.com',
    opening_time: '10:00:00',
    closing_time: '21:00:00',
    rating: 4.6,
    owner_email: 'seafoodribs@reseato.com',
    image_url:
      'https://foods.nowinquire.com/public/img/stores/SM%20City%20North%20EDSA/North%20Tower/Ground%20Level/SOUTH/SEAFOOD%20%26%20RIBS%20WAREHOUSE%20RESTAURANT.webp?v=2025-10-04',
  },
  {
    name: 'Kuya J',
    description: 'Crispy Pata, Kare-Kare, and other Filipino favorites.',
    cuisine_type: 'Filipino',
    address: '1161-1163 SM Seaside City Cebu',
    phone: '0998 962 4273',
    email: 'contact@kuyaj.com',
    opening_time: '10:00:00',
    closing_time: '21:00:00',
    rating: 4.4,
    owner_email: 'kuyaj@reseato.com',
    image_url:
      'https://d3up48wss6lvj.cloudfront.net/data/uploads/2021/08/KuyaJ0d5b4t8tb1tb.png',
  },
  {
    name: 'Somac Korean Restaurant',
    description: 'Korean buffet and grilled dishes.',
    cuisine_type: 'Korean',
    address: '3rd Floor, Skypark, SM Seaside',
    phone: '0967 093 2546',
    email: 'somacsmseaside@gmail.com',
    opening_time: '11:00:00',
    closing_time: '21:00:00',
    rating: 4.8,
    owner_email: 'somac@reseato.com',
    image_url:
      'https://scontent.fcgy2-3.fna.fbcdn.net/v/t39.30808-6/469391101_122209032254195669_8038791638466162881_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=2a1932&_nc_eui2=AeEKGkoyNYc4ptK2rDZHDhN3vjBcTljKE9G-MFxOWMoT0b3BFasg3nf1Oi2EZEnKuhFzj_6qESs01P2ryQQrG6TC&_nc_ohc=5ScFNrN-yiwQ7kNvwE7Mf7A&_nc_oc=AdmX21Gg9N6lWQxq-aNUH_CqX13DAEgF8R-PYHCXdSy17tPBQiOmFa_F8yLG-sgpWLMhPicAEqk_eUFQgKsDHf_h&_nc_zt=23&_nc_ht=scontent.fcgy2-3.fna&_nc_gid=jG4Qwkmbjzym4_JXwYUoqg&oh=00_Afuf0xny8GOI8VZwvo3OsgR08wCH9GVSCuxTGL9Wfj4G_w&oe=69A34EA8',
  },
  {
    name: 'Mesa Restaurant Philippines',
    description: 'Modern Filipino dishes with a twist.',
    cuisine_type: 'Filipino',
    address: 'Upper Ground Floor, Mountain Wing, SM Seaside Cebu',
    phone: '0977 032 4649',
    email: 'contact@mesa.ph',
    opening_time: '10:00:00',
    closing_time: '22:00:00',
    rating: 4.5,
    owner_email: 'mesa@reseato.com',
    image_url:
      'https://scontent.fcgy2-3.fna.fbcdn.net/v/t39.30808-6/616782352_1296618849178000_1669063287155888127_n.png?_nc_cat=111&ccb=1-7&_nc_sid=2a1932&_nc_eui2=AeERrTqtZt-UR99t9xnWcFA-m6sLLfgExpWbqwst-ATGlQ0-mar1K3t5hMOZKyRr51o-M5rsGgLKajUVjgIUOIY-&_nc_ohc=2_qGWFV8VlcQ7kNvwG4fcFJ&_nc_oc=AdnYOg1e6CzSrsSqs24t3MJxNg_ZjoUH7B03P9qT-pkLilG-a5IxW-BAXB-W1R6gXwyKuDVt37i_bC4cZjSPWLM1&_nc_zt=23&_nc_ht=scontent.fcgy2-3.fna&_nc_gid=JA1-vP4MrbBtCqYCpXI1IA&oh=00_Afvxfjv9aONRR6N4xkDe4-Q6Cf8sDgJ9bdMlTfCNzDpn8Q&oe=69A339B3',
  },
  {
    name: 'Boy Belly',
    description: "Cebu's best Lechon Belly.",
    cuisine_type: 'Filipino',
    address: '3rd Level, City Wing, The Skypark, SM Seaside',
    phone: '032-123-9999',
    email: 'info@boybelly.com',
    opening_time: '10:00:00',
    closing_time: '21:00:00',
    rating: 4.2,
    owner_email: 'boybelly@reseato.com',
    image_url:
      'https://orangemagazine.ph/wp-content/uploads/2025/02/SM-Seaside-City-Cebu.png',
  },
]

async function ensureUser(u) {
  const password = u.role === 'admin' ? 'AdminPass123!' : 'VendorPass123!'
  const created = await supabase.auth.admin.createUser({
    email: u.email,
    password,
    email_confirm: true,
    user_metadata: {
      role: u.role,
      first_name: u.first_name,
      last_name: u.last_name,
      phone: u.phone || '',
    },
  })
  if (!created.error && created.data?.user) return created.data.user
  const list = await supabase.auth.admin.listUsers({ perPage: 1000 })
  const found = list.data?.users?.find((x) => x.email === u.email)
  if (found) {
    await supabase.auth.admin.updateUserById(found.id, {
      user_metadata: {
        role: u.role,
        first_name: u.first_name,
        last_name: u.last_name,
        phone: u.phone || '',
      },
      email_confirm: true,
    })
    return found
  }
  throw created.error || new Error('Failed to upsert user')
}

async function upsertRestaurant(r, ownerId) {
  const existing = await supabase.from('restaurants').select('id').eq('name', r.name).maybeSingle()
  if (existing.data?.id) return existing.data.id
  const inserted = await supabase
    .from('restaurants')
    .insert({
      owner_id: ownerId,
      name: r.name,
      description: r.description,
      cuisine_type: r.cuisine_type,
      address: r.address,
      phone: r.phone,
      email: r.email,
      opening_time: r.opening_time,
      closing_time: r.closing_time,
      rating: r.rating,
      is_active: true,
    })
    .select('id')
    .single()
  if (inserted.error) throw inserted.error
  return inserted.data.id
}

async function ensurePrimaryImage(restaurantId, url) {
  const got = await supabase
    .from('restaurant_images')
    .select('id')
    .eq('restaurant_id', restaurantId)
    .eq('is_primary', true)
    .maybeSingle()
  if (got.data?.id) return
  await supabase.from('restaurant_images').insert({
    restaurant_id: restaurantId,
    image_url: url,
    is_primary: true,
  })
}

async function ensureTables(restaurantId) {
  const existing = await supabase.from('tables').select('id').eq('restaurant_id', restaurantId).limit(1)
  if (existing.data && existing.data.length > 0) return
  const rows = []
  for (let n = 1; n <= 10; n++) {
    rows.push({
      restaurant_id: restaurantId,
      table_number: `T${n}`,
      capacity: n <= 4 ? 2 : n <= 8 ? 4 : 6,
      is_available: true,
    })
  }
  await supabase.from('tables').insert(rows)
}

async function main() {
  const createdUsers = {}
  for (const u of users) {
    const user = await ensureUser(u)
    createdUsers[u.email] = user.id
  }
  for (const r of restaurants) {
    const ownerId = createdUsers[r.owner_email]
    if (!ownerId) continue
    const restaurantId = await upsertRestaurant(r, ownerId)
    await ensurePrimaryImage(restaurantId, r.image_url)
    await ensureTables(restaurantId)
  }
  console.log('Done')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
