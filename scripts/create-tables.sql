-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  daily_goal INTEGER DEFAULT 120, -- minutes
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create screen_time_logs table
CREATE TABLE IF NOT EXISTS screen_time_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  category TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reward_redemptions table
CREATE TABLE IF NOT EXISTS reward_redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
);

-- Insert sample rewards
INSERT INTO rewards (name, description, points_required, category) VALUES
('Coffee Shop Gift Card', '$5 gift card to local coffee shop', 500, 'Food & Drink'),
('Movie Theater Voucher', 'Free movie ticket', 800, 'Entertainment'),
('Bookstore Credit', '$3 credit at campus bookstore', 300, 'Education'),
('Pizza Slice Coupon', 'Free slice of pizza', 200, 'Food & Drink'),
('Gym Day Pass', 'One day gym access', 400, 'Health & Fitness');

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE screen_time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own logs" ON screen_time_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON screen_time_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view rewards" ON rewards FOR SELECT USING (true);

CREATE POLICY "Users can view own redemptions" ON reward_redemptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own redemptions" ON reward_redemptions FOR INSERT WITH CHECK (auth.uid() = user_id);
