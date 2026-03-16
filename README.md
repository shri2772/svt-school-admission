# Shri Tuljabhavani Sainiki Sec. & Higher Sec. School
## Std 6th Admission Portal 2026-27

## 🌐 Live URLs
- **Registration Form**: `https://<your-project>.pages.dev/`
- **Admin Dashboard**: `https://<your-project>.pages.dev/admin/dashboard`
- **Admin Login**: `https://<your-project>.pages.dev/admin`

## ✅ Completed Features
- **Multi-step Registration Form** (3 steps) with full validation
- **Razorpay Payment Gateway** (UPI / Card / Net Banking)
- **Payment Receipt Page** (printable) with student photo & details
- **Admin Dashboard** with statistics, charts, search, sort, filter
- **Mark Unpaid → Paid** functionality for admins
- **Export Excel / PDF / Print / Copy** for registrations
- **View & Edit** student registrations
- **Hostinger MySQL** backend via PHP API

## 📋 Registration Form Fields
### Section A – Personal Details
- Surname, First Name, Middle Name
- Father's Name, Mother's Name
- Date of Birth (01-Jun-2014 to 31-May-2016)
- Aadhaar Number, Gender
- WhatsApp Number, Alternate Number, Email
- Full Address
- Admission Category: Open/OBC/SEBC/SC/ST/VJ/NT-B/NT-C/NT-D/SBC
- Fee Category: A (₹300 – Open/OBC/SEBC) or B (₹200 – SC/ST/VJ/NT/SBC)

### Section B – Academic & Exam
- Present School Name, Previous Standard (5th/6th)
- Previous Board (Maharashtra State Board / CBSE / Other)
- Preferred Exam Language (English / Marathi)
- Exam Centre Preference (Tuljapur / Solapur)

### Documents Uploaded
- Student Photo (JPG/PNG, max 2MB)
- Bonafide Certificate (PDF/JPG, max 2MB)
- Student Aadhaar Card (PDF/JPG, max 2MB)

## 🔑 Environment Variables (Cloudflare Secrets)
```
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
HOSTINGER_API_URL=https://yourdomain.com/api
ADMIN_USERNAME=admin
ADMIN_PASSWORD=svt@admin2026
```

## 🗄️ Hostinger PHP Backend (upload to public_html/api/)
| File | Purpose |
|------|---------|
| `config.php` | DB config & helpers |
| `save_registration.php` | Save new registration |
| `get_registration.php` | Get single registration |
| `get_all_registrations.php` | List all registrations |
| `update_status.php` | Update payment status |
| `update_registration.php` | Edit registration fields |

## 🛠️ Tech Stack
- **Frontend/Backend**: Hono (TypeScript) on Cloudflare Pages/Workers
- **Payment**: Razorpay
- **Database**: Hostinger MySQL (via PHP REST API)
- **Styling**: TailwindCSS CDN + FontAwesome
- **Charts**: Chart.js

## 🚀 Deployment
```bash
# 1. Deploy to Cloudflare Pages
npm run build && wrangler pages deploy dist --project-name svt-school-admission

# 2. Set secrets
wrangler pages secret put RAZORPAY_KEY_ID --project-name svt-school-admission
wrangler pages secret put RAZORPAY_KEY_SECRET --project-name svt-school-admission
wrangler pages secret put HOSTINGER_API_URL --project-name svt-school-admission
wrangler pages secret put ADMIN_USERNAME --project-name svt-school-admission
wrangler pages secret put ADMIN_PASSWORD --project-name svt-school-admission

# 3. Upload PHP files to Hostinger
# Upload all files from hostinger-php/ to public_html/api/ on Hostinger
# Update DB credentials in config.php
```

## 📅 Last Updated: 2026-03-16
