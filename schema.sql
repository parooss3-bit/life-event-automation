-- ============================================
-- FLOORING DIRECTORY DATABASE SCHEMA
-- ============================================

-- Suppliers Table
CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  website VARCHAR(255),
  description TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  logo_url VARCHAR(255),
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 5)
);

-- Contractors Table
CREATE TABLE contractors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  phone VARCHAR(20),
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  profile_image_url VARCHAR(255),
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  supplier_id INT NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  price_per_unit DECIMAL(10, 2),
  unit VARCHAR(50),
  stock_quantity INT DEFAULT 0,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Discount Tiers Table
CREATE TABLE discount_tiers (
  id SERIAL PRIMARY KEY,
  supplier_id INT NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  min_quantity INT NOT NULL,
  max_quantity INT,
  discount_percent DECIMAL(5, 2) NOT NULL,
  discount_amount DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT discount_range CHECK (discount_percent >= 0 AND discount_percent <= 100)
);

-- Special Offers Table
CREATE TABLE special_offers (
  id SERIAL PRIMARY KEY,
  supplier_id INT NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_percent DECIMAL(5, 2),
  discount_amount DECIMAL(10, 2),
  coupon_code VARCHAR(50),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  min_order_amount DECIMAL(10, 2),
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id INT NOT NULL,
  sender_type VARCHAR(20) NOT NULL,
  recipient_id INT NOT NULL,
  recipient_type VARCHAR(20) NOT NULL,
  subject VARCHAR(255),
  content TEXT NOT NULL,
  attachment_url VARCHAR(255),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversations Table
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  supplier_id INT NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  contractor_id INT NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  supplier_unread_count INT DEFAULT 0,
  contractor_unread_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(supplier_id, contractor_id)
);

-- Orders Table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  contractor_id INT NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  supplier_id INT NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  final_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  shipping_address TEXT,
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(50),
  shipping_zip VARCHAR(10),
  tracking_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  discount_percent DECIMAL(5, 2) DEFAULT 0,
  line_total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  supplier_id INT NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  contractor_id INT NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  rating INT NOT NULL,
  title VARCHAR(255),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5)
);

-- Email Campaigns Table
CREATE TABLE email_campaigns (
  id SERIAL PRIMARY KEY,
  supplier_id INT NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  campaign_name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  html_content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  recipient_count INT DEFAULT 0,
  open_count INT DEFAULT 0,
  click_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email Campaign Recipients Table
CREATE TABLE email_campaign_recipients (
  id SERIAL PRIMARY KEY,
  campaign_id INT NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
  contractor_id INT NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Events Table
CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  user_id INT,
  user_type VARCHAR(20),
  supplier_id INT REFERENCES suppliers(id),
  contractor_id INT REFERENCES contractors(id),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Referrals Table
CREATE TABLE referrals (
  id SERIAL PRIMARY KEY,
  referrer_id INT NOT NULL,
  referrer_type VARCHAR(20) NOT NULL,
  referred_id INT NOT NULL,
  referred_type VARCHAR(20) NOT NULL,
  commission_percent DECIMAL(5, 2),
  commission_amount DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Users Table
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_suppliers_email ON suppliers(email);
CREATE INDEX idx_suppliers_city_state ON suppliers(city, state);
CREATE INDEX idx_suppliers_rating ON suppliers(rating DESC);
CREATE INDEX idx_suppliers_is_premium ON suppliers(is_premium);

CREATE INDEX idx_contractors_email ON contractors(email);
CREATE INDEX idx_contractors_city_state ON contractors(city, state);

CREATE INDEX idx_products_supplier_id ON products(supplier_id);
CREATE INDEX idx_products_category ON products(category);

CREATE INDEX idx_discount_tiers_supplier_id ON discount_tiers(supplier_id);
CREATE INDEX idx_discount_tiers_is_active ON discount_tiers(is_active);

CREATE INDEX idx_special_offers_supplier_id ON special_offers(supplier_id);
CREATE INDEX idx_special_offers_is_active ON special_offers(is_active);
CREATE INDEX idx_special_offers_dates ON special_offers(start_date, end_date);

CREATE INDEX idx_messages_sender ON messages(sender_id, sender_type);
CREATE INDEX idx_messages_recipient ON messages(recipient_id, recipient_type);
CREATE INDEX idx_messages_is_read ON messages(is_read);

CREATE INDEX idx_conversations_supplier_id ON conversations(supplier_id);
CREATE INDEX idx_conversations_contractor_id ON conversations(contractor_id);

CREATE INDEX idx_orders_contractor_id ON orders(contractor_id);
CREATE INDEX idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

CREATE INDEX idx_reviews_supplier_id ON reviews(supplier_id);
CREATE INDEX idx_reviews_contractor_id ON reviews(contractor_id);
CREATE INDEX idx_reviews_is_approved ON reviews(is_approved);

CREATE INDEX idx_email_campaigns_supplier_id ON email_campaigns(supplier_id);
CREATE INDEX idx_email_campaigns_status ON email_campaigns(status);

CREATE INDEX idx_email_campaign_recipients_campaign_id ON email_campaign_recipients(campaign_id);
CREATE INDEX idx_email_campaign_recipients_status ON email_campaign_recipients(status);

CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_supplier_id ON analytics_events(supplier_id);
CREATE INDEX idx_analytics_events_contractor_id ON analytics_events(contractor_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id, referrer_type);
CREATE INDEX idx_referrals_referred ON referrals(referred_id, referred_type);
CREATE INDEX idx_referrals_status ON referrals(status);

CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);
