export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    supabaseUrl: 'https://banpsoevrpyhncgjhglz.supabase.co',
    supabaseAnonKey: 'sb_publishable_ZtXkeXO1wGAv5iauqIGY2Q_KYyftrZe',
  });
}
