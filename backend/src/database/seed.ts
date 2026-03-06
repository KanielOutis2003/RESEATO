import bcrypt from 'bcryptjs';
import pool from '../config/database';
import { UserRole } from '../../../shared/types';

const seed = async () => {
  const client = await pool.connect();

  try {
    console.log('🌱 Starting seed...');

    // Clear existing data
    await client.query('TRUNCATE TABLE payments, reservations, tables, restaurant_images, restaurants, users CASCADE');

    const passwordHash = await bcrypt.hash('password123', 12);

    // 1. Create Admin and Customer Users
    const baseUsers = [
      {
        email: 'admin@reseato.com',
        password: passwordHash,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        phone: '09123456789'
      },
      {
        email: 'customer@reseato.com',
        password: passwordHash,
        firstName: 'Jane',
        lastName: 'Customer',
        role: UserRole.CUSTOMER,
        phone: '09111111111'
      }
    ];

    for (const user of baseUsers) {
      await client.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role, phone)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [user.email, user.password, user.firstName, user.lastName, user.role, user.phone]
      );
      console.log(`✅ Created user: ${user.email}`);
    }

    // 2. Define Restaurants with their specific Owners
    const restaurantsData = [
      {
        owner: {
          email: 'cabalen@reseato.com',
          firstName: 'Cabalen',
          lastName: 'Manager',
        },
        name: 'Cabalen',
        description: 'All-you-can-eat Filipino buffet featuring Kapampangan specialties.',
        cuisine: 'Filipino',
        cuisine_type: 'Buffet',
        address: 'SM Seaside City, Cebu',
        city: 'Cebu City',
        zip_code: '6000',
        phone: '032-456-7890',
        email: 'inquiry@cabalen.ph',
        opening_time: '10:00:00',
        closing_time: '21:00:00',
        is_active: true,
        rating: 5.0,
        total_reviews: 180,
        latitude: 10.2830,
        longitude: 123.8855,
        image: 'https://static.wixstatic.com/media/382e5f_c8208f93156f478986728e53bd9e331c~mv2.png/v1/fill/w_551,h_551,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/382e5f_c8208f93156f478986728e53bd9e331c~mv2.png'
      },
      {
        owner: {
          email: 'chikaan@reseato.com',
          firstName: 'Chika-an',
          lastName: 'Manager',
        },
        name: 'Chika-an Cebuano Kitchen',
        description: 'Authentic Cebuano dishes served in a homey atmosphere.',
        cuisine: 'Filipino',
        cuisine_type: 'Filipino',
        address: 'SM City Cebu',
        city: 'Cebu City',
        zip_code: '6000',
        phone: '032-233-0350',
        email: 'info@chikaan.com',
        opening_time: '10:00:00',
        closing_time: '21:00:00',
        is_active: true,
        rating: 4.8,
        total_reviews: 150,
        latitude: 10.3115,
        longitude: 123.9180,
        image: 'https://scontent.fcgy2-2.fna.fbcdn.net/v/t39.30808-6/539011713_1198754658955735_5756152376187219456_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=2a1932&_nc_eui2=AeFDtrgY9oHFj7y2tnsqgU60-R1EHHT7obb5HUQcdPuhtqzoh1BLq_Mp6rr6rye00G0Dfn9XteYbpVZeD5ArU6pz&_nc_ohc=b1MwI5EbNIMQ7kNvwFg8FTZ&_nc_oc=AdnJw8ZMZQOLCEtgjRwsB_7ruGlTxnk4ZfZ1drVoepKm148AtSJCTJGSTVFDWjhZObRXA51DCqL6BNHbRtZWT_E5&_nc_zt=23&_nc_ht=scontent.fcgy2-2.fna&_nc_gid=cwHHZEu-07JPRxTEbXEaDw&oh=00_AftCahtssXlyt8feWKxmzVETtI_Y1fcTp6rUJrgDFmmF3g&oe=69A342BE'
      },
      {
        owner: {
          email: 'superbowl@reseato.com',
          firstName: 'Superbowl',
          lastName: 'Manager',
        },
        name: 'Superbowl of China',
        description: 'Serving delicious Chinese favorites and dimsum.',
        cuisine: 'Chinese',
        cuisine_type: 'Chinese',
        address: 'SM City Cebu',
        city: 'Cebu City',
        zip_code: '6000',
        phone: '032-231-1234',
        email: 'info@superbowl.com',
        opening_time: '10:00:00',
        closing_time: '21:00:00',
        is_active: true,
        rating: 4.9,
        total_reviews: 200,
        latitude: 10.3116,
        longitude: 123.9181,
        image: 'https://scontent.fcgy2-1.fna.fbcdn.net/v/t39.30808-6/599622729_1300728905416080_1204480223111860567_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeHHfYk-2Qbk84YXVk2WB9KMWFoWfRVljM5YWhZ9FWWMziKt4HFWEqEW1ZxLSFvNAWowOHY6bOpG1wdQ7i-t_5_8&_nc_ohc=8gVeJSUSPFcQ7kNvwFvuA0S&_nc_oc=Adk1B3QpS922IMkOSdwybBEXhK6RPAIFgB-fuf_NZTdXaxaNqPKBMT-xW4w5Fg_fxTeh9yPctImCM018BssvHy5E&_nc_zt=23&_nc_ht=scontent.fcgy2-1.fna&_nc_gid=6GNBexgGc9XmVj_xhby0jQ&oh=00_AfsOQVZ7Hw7vfrk5RatuKwcr7UBNpdwCTnz1lwOkxsNz9A&oe=69A3325E'
      },
      {
        owner: {
          email: 'sachiramen@reseato.com',
          firstName: 'Sachi',
          lastName: 'Manager',
        },
        name: 'Sachi Ramen',
        description: 'Authentic Japanese Ramen and Asian fusion dishes.',
        cuisine: 'Japanese',
        cuisine_type: 'Ramen',
        address: 'SM City Cebu',
        city: 'Cebu City',
        zip_code: '6000',
        phone: '032-412-4567',
        email: 'info@sachiramen.com',
        opening_time: '11:00:00',
        closing_time: '22:00:00',
        is_active: true,
        rating: 5.0,
        total_reviews: 80,
        latitude: 10.3117,
        longitude: 123.9182,
        image: 'https://images.hive.blog/0x0/https://files.peakd.com/file/peakd-hive/indayclara/EoK5NFgi4KCW5c22sGaZwB392hCmsnycZwK7ECbmB4gr6wW4nbao2wKLGU4y8XsYgR2.jpg'
      },
      {
        owner: {
          email: 'seoulblack@reseato.com',
          firstName: 'Seoul',
          lastName: 'Manager',
        },
        name: 'Seoul Black',
        description: 'Authentic Korean cuisine in the heart of SM Seaside.',
        cuisine: 'Korean',
        cuisine_type: 'Korean',
        address: 'Upper Ground Floor, Cube Wing, SM Seaside City Cebu',
        city: 'Cebu City',
        zip_code: '6000',
        phone: '0927 508 6275',
        email: 'contact@seoulblack.com',
        opening_time: '10:00:00',
        closing_time: '21:00:00',
        is_active: true,
        rating: 4.8,
        total_reviews: 45,
        latitude: 10.2829,
        longitude: 123.8854,
        image: 'https://scontent.fcgy2-1.fna.fbcdn.net/v/t39.30808-6/485876367_694469239918258_9125476005181298509_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeFwsFoVlsljRNeiAWcsYM31CGoaho-QLpUIahqGj5AulXwBKaLL6u-vFc5uLYD0EX6QkjHHgODbzL6YkAaKqgmG&_nc_ohc=FDVrt-HyGUcQ7kNvwHknBc_&_nc_oc=AdkFRAwbfcqrhSEogmmd7RyppKzrCAXKWShNZBLsrBDGopdovZEy-4wnSDqIFjr8qFiL0P2wqcIKR4o9TxhKEptn&_nc_zt=23&_nc_ht=scontent.fcgy2-1.fna&_nc_gid=WWFeXMbuZII_UBTUd2oBAA&oh=00_AftDYdJk3zB6hdBpClptcvC0BhQ6a-mXS-CoJ8e0owh1hg&oe=69A32EA3'
      },
      {
        owner: {
          email: 'seafoodribs@reseato.com',
          firstName: 'Seafood',
          lastName: 'Manager',
        },
        name: 'Seafood & Ribs Warehouse',
        description: 'Fresh Seafood Paluto Restaurant. NO COOKING FEE 💯',
        cuisine: 'Seafood',
        cuisine_type: 'Filipino',
        address: '3F Mountain Wing Skypark, SM Seaside Cebu',
        city: 'Cebu City',
        zip_code: '6000',
        phone: '0917 123 4567',
        email: 'info@seafoodribs.com',
        opening_time: '10:00:00',
        closing_time: '21:00:00',
        is_active: true,
        rating: 4.9,
        total_reviews: 110,
        latitude: 10.2829,
        longitude: 123.8854,
        image: 'https://foods.nowinquire.com/public/img/stores/SM%20City%20North%20EDSA/North%20Tower/Ground%20Level/SOUTH/SEAFOOD%20%26%20RIBS%20WAREHOUSE%20RESTAURANT.webp?v=2025-10-04'
      },
      {
        owner: {
          email: 'kuyaj@reseato.com',
          firstName: 'Kuya',
          lastName: 'J',
        },
        name: 'Kuya J',
        description: 'Crispy Pata, Kare-Kare, and other Filipino favorites.',
        cuisine: 'Filipino',
        cuisine_type: 'Filipino',
        address: '1161-1163 SM Seaside City Cebu',
        city: 'Cebu City',
        zip_code: '6000',
        phone: '0998 962 4273',
        email: 'contact@kuyaj.com',
        opening_time: '10:00:00',
        closing_time: '21:00:00',
        is_active: true,
        rating: 4.8,
        total_reviews: 200,
        latitude: 10.2829,
        longitude: 123.8854,
        image: 'https://d3up48wss6lvj.cloudfront.net/data/uploads/2021/08/KuyaJ0d5b4t8tb1tb.png'
      },
      {
        owner: {
          email: 'somac@reseato.com',
          firstName: 'Somac',
          lastName: 'Manager',
        },
        name: 'Somac Korean Restaurant',
        description: 'Every corner of Somac Buffet is filled with festive cheer and holiday joy!',
        cuisine: 'Korean',
        cuisine_type: 'Buffet',
        address: '3rd Floor, Skypark, SM Seaside',
        city: 'Cebu City',
        zip_code: '6000',
        phone: '0967 093 2546',
        email: 'somacsmseaside@gmail.com',
        opening_time: '11:00:00',
        closing_time: '21:00:00',
        is_active: true,
        rating: 5.0,
        total_reviews: 150,
        latitude: 10.2829,
        longitude: 123.8854,
        image: 'https://scontent.fcgy2-3.fna.fbcdn.net/v/t39.30808-6/469391101_122209032254195669_8038791638466162881_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=2a1932&_nc_eui2=AeEKGkoyNYc4ptK2rDZHDhN3vjBcTljKE9G-MFxOWMoT0b3BFasg3nf1Oi2EZEnKuhFzj_6qESs01P2ryQQrG6TC&_nc_ohc=5ScFNrN-yiwQ7kNvwE7Mf7A&_nc_oc=AdmX21Gg9N6lWQxq-aNUH_CqX13DAEgF8R-PYHCXdSy17tPBQiOmFa_F8yLG-sgpWLMhPicAEqk_eUFQgKsDHf_h&_nc_zt=23&_nc_ht=scontent.fcgy2-3.fna&_nc_gid=jG4Qwkmbjzym4_JXwYUoqg&oh=00_Afuf0xny8GOI8VZwvo3OsgR08wCH9GVSCuxTGL9Wfj4G_w&oe=69A34EA8'
      },
      {
        owner: {
          email: 'mesa@reseato.com',
          firstName: 'Mesa',
          lastName: 'Manager',
        },
        name: 'Mesa Restaurant Philippines',
        description: 'Don\'t be fooled! This deep fried baby squid might be your next favorite!',
        cuisine: 'Filipino',
        cuisine_type: 'Filipino',
        address: 'Upper Ground Floor, Mountain Wing, SM Seaside Cebu',
        city: 'Cebu City',
        zip_code: '6000',
        phone: '0977 032 4649',
        email: 'contact@mesa.ph',
        opening_time: '10:00:00',
        closing_time: '22:00:00',
        is_active: true,
        rating: 4.9,
        total_reviews: 90,
        latitude: 10.2829,
        longitude: 123.8854,
        image: 'https://scontent.fcgy2-3.fna.fbcdn.net/v/t39.30808-6/616782352_1296618849178000_1669063287155888127_n.png?_nc_cat=111&ccb=1-7&_nc_sid=2a1932&_nc_eui2=AeERrTqtZt-UR99t9xnWcFA-m6sLLfgExpWbqwst-ATGlQ0-mar1K3t5hMOZKyRr51o-M5rsGgLKajUVjgIUOIY-&_nc_ohc=2_qGWFV8VlcQ7kNvwG4fcFJ&_nc_oc=AdnYOg1e6CzSrsSqs24t3MJxNg_ZjoUH7B03P9qT-pkLilG-a5IxW-BAXB-W1R6gXwyKuDVt37i_bC4cZjSPWLM1&_nc_zt=23&_nc_ht=scontent.fcgy2-3.fna&_nc_gid=JA1-vP4MrbBtCqYCpXI1IA&oh=00_Afvxfjv9aONRR6N4xkDe4-Q6Cf8sDgJ9bdMlTfCNzDpn8Q&oe=69A339B3'
      },
      {
        owner: {
          email: 'boybelly@reseato.com',
          firstName: 'Boy',
          lastName: 'Belly',
        },
        name: 'Boy Belly',
        description: 'Boy Belly, Happy Ta Diri! Serving Cebu\'s best Lechon Belly.',
        cuisine: 'Filipino',
        cuisine_type: 'Filipino',
        address: '3rd Level, City Wing, The Skypark, SM Seaside',
        city: 'Cebu City',
        zip_code: '6000',
        phone: '032-123-9999',
        email: 'info@boybelly.com',
        opening_time: '10:00:00',
        closing_time: '21:00:00',
        is_active: true,
        rating: 4.8,
        total_reviews: 60,
        latitude: 10.2829,
        longitude: 123.8854,
        image: 'https://scontent.fceb1-3.fna.fbcdn.net/v/t39.30808-6/499178510_670252335901912_5015432747052094833_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeH3z5bxo33F_pj_jCFSzelfEugl2qr4Oc0S6CXaqvg5zVxE8fYJ-yPA8MFO3aVWtiLm_xgEtuKK-OzP6SFyax8L&_nc_ohc=cFe9ktJ3waMQ7kNvwFFwAKo&_nc_oc=AdlAqOUFiGs6L6aAbg4I4i3A9PNjBc_pPoldIWYzEmosO85ip8on8uA1ZrVkag6pJB6Dibunch-vWLYSFLwbo1Jc&_nc_zt=23&_nc_ht=scontent.fceb1-3.fna&_nc_gid=2BqukcnRRSExTy3LVv7lTA&oh=00_AfuER70DUjNlssIDzaUd8GOGdbnshcJUMvpHUtgRuIDfZw&oe=69A4CEDB'
      }
    ];

    for (const rData of restaurantsData) {
      // 3. Create Vendor User for this Restaurant
      const userRes = await client.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role, phone)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [rData.owner.email, passwordHash, rData.owner.firstName, rData.owner.lastName, UserRole.VENDOR, '09000000000']
      );
      const ownerId = userRes.rows[0].id;
      console.log(`✅ Created vendor: ${rData.owner.email}`);

      // 4. Create Restaurant linked to this Owner
      const restaurantRes = await client.query(
        `INSERT INTO restaurants (
          owner_id, name, description, cuisine, cuisine_type, address, city, zip_code, 
          phone, email, opening_time, closing_time, is_active, rating, total_reviews,
          latitude, longitude
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *`,
        [
          ownerId,
          rData.name,
          rData.description,
          rData.cuisine,
          rData.cuisine_type,
          rData.address,
          rData.city,
          rData.zip_code,
          rData.phone,
          rData.email,
          rData.opening_time,
          rData.closing_time,
          rData.is_active,
          rData.rating,
          rData.total_reviews,
          rData.latitude,
          rData.longitude
        ]
      );

      const restaurant = restaurantRes.rows[0];
      console.log(`✅ Created restaurant: ${restaurant.name}`);

      // Add Images
      await client.query(
        `INSERT INTO restaurant_images (restaurant_id, image_url, is_primary)
         VALUES ($1, $2, $3)`,
        [restaurant.id, rData.image, true]
      );

      // Add Tables
      const tables = [
        { number: 'T1', capacity: 2, is_available: true },
        { number: 'T2', capacity: 2, is_available: true },
        { number: 'T3', capacity: 4, is_available: true },
        { number: 'T4', capacity: 4, is_available: true },
        { number: 'T5', capacity: 6, is_available: true },
        { number: 'T6', capacity: 8, is_available: true },
      ];

      for (const table of tables) {
        await client.query(
          `INSERT INTO tables (restaurant_id, table_number, capacity, is_available)
           VALUES ($1, $2, $3, $4)`,
          [restaurant.id, table.number, table.capacity, table.is_available]
        );
      }
    }

    console.log('✨ Seed completed successfully');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

seed();
