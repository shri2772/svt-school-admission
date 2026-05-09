import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './' }))

// ─── Registration Form ────────────────────────────────────────────────────────
app.get('/', (c) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Std 11th Admission 2026-27 | Shri Tuljabhavani Sainiki School</title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css"/>
<style>
  body { background: linear-gradient(135deg,#0f2c6b 0%,#1a4199 50%,#b8860b 100%); min-height:100vh; }
  .card { background:rgba(255,255,255,0.97); border-radius:16px; box-shadow:0 20px 60px rgba(0,0,0,0.3); }
  .section-header { background:linear-gradient(90deg,#0f2c6b,#1a4199); color:#fff; padding:10px 20px; border-radius:8px; margin-bottom:16px; }
  .field-label { font-weight:600; color:#1e3a8a; font-size:0.875rem; margin-bottom:4px; display:block; }
  .field-input { width:100%; border:1.5px solid #cbd5e1; border-radius:8px; padding:10px 12px; font-size:0.9rem; transition:all 0.2s; outline:none; }
  .field-input:focus { border-color:#1a4199; box-shadow:0 0 0 3px rgba(26,65,153,0.15); }
  .req { color:#dc2626; }
  .fee-card { border:2px solid #e2e8f0; border-radius:10px; padding:12px; cursor:pointer; transition:all 0.2s; }
  .fee-card:hover,.fee-card.selected { border-color:#1a4199; background:#eff6ff; }
  .upload-box { border:2px dashed #94a3b8; border-radius:10px; padding:20px; text-align:center; cursor:pointer; transition:all 0.2s; }
  .upload-box:hover { border-color:#1a4199; background:#f0f9ff; }
  .progress-step { display:flex; align-items:center; gap:8px; }
  .step-circle { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.875rem; }
  .step-active { background:#1a4199; color:#fff; }
  .step-done { background:#16a34a; color:#fff; }
  .step-pending { background:#e2e8f0; color:#64748b; }
  .btn-primary { background:linear-gradient(90deg,#0f2c6b,#1a4199); color:#fff; padding:12px 32px; border-radius:10px; font-weight:700; font-size:1rem; border:none; cursor:pointer; transition:all 0.2s; width:100%; }
  .btn-primary:hover { transform:translateY(-1px); box-shadow:0 8px 25px rgba(26,65,153,0.4); }
  .preview-img { width:100px; height:100px; object-fit:cover; border-radius:8px; border:2px solid #1a4199; margin-top:8px; }
  #toast { position:fixed; top:20px; right:20px; z-index:9999; display:none; }
</style>
</head>
<body class="py-8 px-4">

<!-- Toast -->
<div id="toast" class="bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl text-sm font-semibold"></div>

<!-- Header -->
<div class="max-w-4xl mx-auto mb-6">
  <div class="card p-6 flex flex-col md:flex-row items-center gap-4">
    <div class="flex items-center gap-4">
      <div class="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-3xl shadow-lg">🏛️</div>
      <div>
        <p class="text-xs text-gray-500 uppercase tracking-widest">Shri Tuljabhavani Temple Trust's</p>
        <h1 class="text-xl md:text-2xl font-extrabold text-blue-900 leading-tight">Shri Tuljabhavani Sainiki Sec. &<br/>Higher Sec. School, Tuljapur</h1>
        <p class="text-xs text-gray-500 mt-1">Affiliated to CBSE | Sainiki (Military) School</p>
      </div>
    </div>
    <div class="md:ml-auto text-center md:text-right">
      <div class="inline-block bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 py-2 rounded-lg">
        <p class="text-xs uppercase tracking-widest">Admission 2026-27</p>
        <p class="text-lg font-bold">Std 11th Registration</p>
      </div>
    </div>
  </div>
</div>

<!-- Progress Bar -->
<div class="max-w-4xl mx-auto mb-6">
  <div class="card px-6 py-4">
    <div class="flex items-center justify-between">
      <div class="progress-step">
        <div class="step-circle step-active" id="s1">1</div>
        <span class="text-sm font-semibold text-blue-900">Personal Details</span>
      </div>
      <div class="flex-1 h-1 bg-gray-200 mx-2"><div id="prog1" class="h-1 bg-blue-700 transition-all" style="width:0%"></div></div>
      <div class="progress-step">
        <div class="step-circle step-pending" id="s2">2</div>
        <span class="text-sm font-semibold text-gray-400" id="sl2">Academic & Exam</span>
      </div>
      <div class="flex-1 h-1 bg-gray-200 mx-2"><div id="prog2" class="h-1 bg-blue-700 transition-all" style="width:0%"></div></div>
      <div class="progress-step">
        <div class="step-circle step-pending" id="s3">3</div>
        <span class="text-sm font-semibold text-gray-400" id="sl3">Documents & Pay</span>
      </div>
    </div>
  </div>
</div>

<!-- Form -->
<form id="regForm" enctype="multipart/form-data" class="max-w-4xl mx-auto space-y-6">

  <!-- STEP 1: Personal Details -->
  <div id="step1" class="card p-6 md:p-8">
    <div class="section-header flex items-center gap-3">
      <i class="fas fa-user-circle text-xl"></i>
      <span class="font-bold text-lg">Section A – Personal Details</span>
      <span class="ml-auto text-xs bg-white text-blue-900 px-3 py-1 rounded-full font-semibold">Step 1 of 3</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label class="field-label">Surname <span class="req">*</span></label>
        <input type="text" name="surname" id="surname" class="field-input" placeholder="e.g. Patil" required/>
      </div>
      <div>
        <label class="field-label">First Name <span class="req">*</span></label>
        <input type="text" name="first_name" id="first_name" class="field-input" placeholder="e.g. Rahul" required/>
      </div>
      <div>
        <label class="field-label">Middle Name</label>
        <input type="text" name="middle_name" id="middle_name" class="field-input" placeholder="Father's first name"/>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label class="field-label">Father's Name <span class="req">*</span></label>
        <input type="text" name="father_name" id="father_name" class="field-input" placeholder="Full father's name" required/>
      </div>
      <div>
        <label class="field-label">Mother's Name <span class="req">*</span></label>
        <input type="text" name="mother_name" id="mother_name" class="field-input" placeholder="Full mother's name" required/>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label class="field-label">Date of Birth <span class="req">*</span></label>
        <input type="date" name="dob" id="dob" class="field-input" required/>
        <p class="text-xs text-gray-500 mt-1">Born between 01-Jun-2014 & 31-May-2016</p>
      </div>
      <div>
        <label class="field-label">Aadhaar Number <span class="req">*</span></label>
        <input type="text" name="aadhar" id="aadhar" class="field-input" placeholder="12-digit Aadhaar" maxlength="12" required/>
      </div>
      <div>
        <label class="field-label">Gender <span class="req">*</span></label>
        <div class="field-input bg-blue-50 border-blue-300 flex items-center gap-3 cursor-not-allowed select-none">
          <i class="fas fa-mars text-blue-700 text-lg"></i>
          <span class="font-bold text-blue-900">Male</span>
          <span class="ml-auto text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-semibold">👦 Boys Only School</span>
        </div>
        <input type="hidden" name="gender" id="gender" value="Male"/>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label class="field-label">WhatsApp Number <span class="req">*</span></label>
        <input type="tel" name="whatsapp" id="whatsapp" class="field-input" placeholder="10-digit mobile" maxlength="10" required/>
      </div>
      <div>
        <label class="field-label">Alternate Number</label>
        <input type="tel" name="alt_number" class="field-input" placeholder="Optional" maxlength="10"/>
      </div>
      <div>
        <label class="field-label">Email ID <span class="req">*</span></label>
        <input type="email" name="email" id="email" class="field-input" placeholder="parent@email.com" required/>
      </div>
    </div>

    <div class="mb-4">
      <label class="field-label">Full Address <span class="req">*</span></label>
      <textarea name="address" id="address" class="field-input" rows="3" placeholder="Village / Town, Taluka, District, State, PIN" required></textarea>
    </div>

    <!-- Admission Category -->
    <div class="mb-4">
      <label class="field-label">Admission Category <span class="req">*</span></label>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
        ${['Open','OBC','SEBC','SC','ST','VJ','NT-B','NT-C','NT-D','SBC'].map(cat=>`
        <label class="flex items-center gap-2 border-2 rounded-lg p-2 cursor-pointer hover:border-blue-600 transition-all has-[:checked]:border-blue-700 has-[:checked]:bg-blue-50">
          <input type="radio" name="category" value="${cat}" class="accent-blue-700" required/>
          <span class="text-sm font-semibold">${cat}</span>
        </label>`).join('')}
      </div>
    </div>

    <!-- Fee Category -->
    <div class="mb-6">
      <label class="field-label">Fee Category & Amount <span class="req">*</span></label>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="fee-card" id="feeA" onclick="selectFee('A',300)">
          <div class="flex items-center gap-3">
            <input type="radio" name="fee_category" value="A" id="fcA" class="accent-blue-700"/>
            <div>
              <p class="font-bold text-blue-900">Category A – ₹300</p>
              <p class="text-xs text-gray-500">Open / OBC / SEBC</p>
            </div>
          </div>
        </div>
        <div class="fee-card" id="feeB" onclick="selectFee('B',200)">
          <div class="flex items-center gap-3">
            <input type="radio" name="fee_category" value="B" id="fcB" class="accent-blue-700"/>
            <div>
              <p class="font-bold text-blue-900">Category B – ₹200</p>
              <p class="text-xs text-gray-500">SC / ST / VJ / NT / SBC</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <button type="button" onclick="goStep(2)" class="btn-primary" style="width:auto;padding:12px 40px;">
        Next: Academic Details <i class="fas fa-arrow-right ml-2"></i>
      </button>
    </div>
  </div>

  <!-- STEP 2: Academic & Exam -->
  <div id="step2" class="card p-6 md:p-8 hidden">
    <div class="section-header flex items-center gap-3">
      <i class="fas fa-graduation-cap text-xl"></i>
      <span class="font-bold text-lg">Section A (contd.) – Academic Details</span>
      <span class="ml-auto text-xs bg-white text-blue-900 px-3 py-1 rounded-full font-semibold">Step 2 of 3</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label class="field-label">Present School Name <span class="req">*</span></label>
        <input type="text" name="present_school" id="present_school" class="field-input" placeholder="Current school name" required/>
      </div>
      <div>
        <label class="field-label">Previous Standard <span class="req">*</span></label>
        <select name="prev_std" class="field-input" required>
          <option value="">Select</option>
          <option value="10th">10th</option>
          <option value="11th">11th (Repeater)</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label class="field-label">Previous Board <span class="req">*</span></label>
        <select name="prev_board" class="field-input" required>
          <option value="">Select Board</option>
          <option>Maharashtra State Board</option>
          <option>CBSE</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label class="field-label">Preferred Exam Language <span class="req">*</span></label>
        <select name="exam_language" class="field-input" required>
          <option value="">Select Language</option>
          <option>English</option>
          <option>Marathi</option>
        </select>
      </div>
    </div>

    <!-- Section B -->
    <div class="section-header flex items-center gap-3 mt-6">
      <i class="fas fa-map-marker-alt text-xl"></i>
      <span class="font-bold text-lg">Section B – Exam Centre Preference</span>
    </div>

    <div class="mb-4">
      <label class="field-label">Preferred Exam Centre <span class="req">*</span></label>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${['Tuljapur','Solapur'].map(c=>`
        <label class="flex items-center gap-3 border-2 rounded-lg p-4 cursor-pointer hover:border-blue-600 transition-all has-[:checked]:border-blue-700 has-[:checked]:bg-blue-50">
          <input type="radio" name="exam_centre" value="${c}" class="accent-blue-700" required/>
          <div>
            <p class="font-bold text-blue-900">${c} Centre</p>
            <p class="text-xs text-gray-500">${c === 'Tuljapur' ? 'Main Campus, Tuljapur' : 'Solapur City Centre'}</p>
          </div>
        </label>`).join('')}
      </div>
    </div>

    <!-- Ex-Servicemen Question -->
    <div class="mb-4">
      <label class="field-label">Is the student a child of an Ex-Serviceman? <span class="req">*</span></label>
      <p class="text-xs text-gray-400 mb-2">Select Yes if father / guardian has served in the Indian Armed Forces</p>
      <div class="grid grid-cols-2 gap-4">
        <label class="flex items-center gap-3 border-2 border-gray-200 rounded-xl p-4 cursor-pointer hover:border-green-500 transition-all has-[:checked]:border-green-600 has-[:checked]:bg-green-50">
          <input type="radio" name="ex_serviceman" value="Yes" class="accent-green-600" required/>
          <div>
            <p class="font-bold text-gray-800 flex items-center gap-2"><i class="fas fa-shield-alt text-green-600"></i> Yes</p>
            <p class="text-xs text-gray-500">Child of Ex-Serviceman</p>
          </div>
        </label>
        <label class="flex items-center gap-3 border-2 border-gray-200 rounded-xl p-4 cursor-pointer hover:border-gray-400 transition-all has-[:checked]:border-gray-500 has-[:checked]:bg-gray-50">
          <input type="radio" name="ex_serviceman" value="No" class="accent-gray-600" required/>
          <div>
            <p class="font-bold text-gray-700 flex items-center gap-2"><i class="fas fa-times-circle text-gray-400"></i> No</p>
            <p class="text-xs text-gray-500">Not applicable</p>
          </div>
        </label>
      </div>
    </div>

    <div class="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-4">
      <p class="text-sm text-amber-800 font-semibold"><i class="fas fa-info-circle mr-2"></i>Important Note</p>
      <ul class="text-xs text-amber-700 mt-1 list-disc ml-4 space-y-1">
        <li>Candidates must undergo a Medical Fitness Test (मेडिकल फिटनेस टेस्ट)</li>
        <li>This school is exclusively for Boys</li>
        <li>Incomplete forms will be rejected</li>
      </ul>
    </div>

    <div class="flex justify-between">
      <button type="button" onclick="goStep(1)" class="btn-primary" style="width:auto;background:linear-gradient(90deg,#64748b,#475569);padding:12px 32px;">
        <i class="fas fa-arrow-left mr-2"></i> Back
      </button>
      <button type="button" onclick="goStep(3)" class="btn-primary" style="width:auto;padding:12px 40px;">
        Next: Documents <i class="fas fa-arrow-right ml-2"></i>
      </button>
    </div>
  </div>

  <!-- STEP 3: Documents & Submit -->
  <div id="step3" class="card p-6 md:p-8 hidden">
    <div class="section-header flex items-center gap-3">
      <i class="fas fa-file-upload text-xl"></i>
      <span class="font-bold text-lg">Section B – Document Upload & Payment</span>
      <span class="ml-auto text-xs bg-white text-blue-900 px-3 py-1 rounded-full font-semibold">Step 3 of 3</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- Student Photo -->
      <div>
        <label class="field-label">Student Photo <span class="req">*</span></label>
        <div class="upload-box" onclick="document.getElementById('photo').click()">
          <i class="fas fa-camera text-3xl text-blue-300 mb-2"></i>
          <p class="text-xs text-gray-500">Click to upload</p>
          <p class="text-xs text-gray-400">JPG/PNG max 2MB</p>
          <img id="photoPreview" class="preview-img mx-auto hidden"/>
        </div>
        <input type="file" id="photo" name="photo" accept="image/*" class="hidden" onchange="previewFile(this,'photoPreview')" required/>
      </div>

      <!-- Bonafide Certificate -->
      <div>
        <label class="field-label">Bonafide Certificate <span class="req">*</span></label>
        <div class="upload-box" onclick="document.getElementById('bonafide').click()">
          <i class="fas fa-file-alt text-3xl text-green-300 mb-2"></i>
          <p class="text-xs text-gray-500">Click to upload</p>
          <p class="text-xs text-gray-400">PDF/JPG max 2MB</p>
          <p id="bonafideName" class="text-xs text-blue-700 mt-2 font-semibold"></p>
        </div>
        <input type="file" id="bonafide" name="bonafide" accept=".pdf,image/*" class="hidden" onchange="showFileName(this,'bonafideName')" required/>
      </div>

      <!-- Aadhaar Card -->
      <div>
        <label class="field-label">Student's Aadhaar Card <span class="req">*</span></label>
        <div class="upload-box" onclick="document.getElementById('aadhar_doc').click()">
          <i class="fas fa-id-card text-3xl text-purple-300 mb-2"></i>
          <p class="text-xs text-gray-500">Click to upload</p>
          <p class="text-xs text-gray-400">PDF/JPG max 2MB</p>
          <p id="aadharName" class="text-xs text-blue-700 mt-2 font-semibold"></p>
        </div>
        <input type="file" id="aadhar_doc" name="aadhar_doc" accept=".pdf,image/*" class="hidden" onchange="showFileName(this,'aadharName')" required/>
      </div>
    </div>

    <!-- Summary Card -->
    <div class="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-xl p-5 mb-6">
      <h3 class="font-bold text-lg mb-3 flex items-center gap-2"><i class="fas fa-receipt"></i> Application Summary</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        <div><span class="text-blue-200 text-xs">Student Name</span><p id="sumName" class="font-semibold">—</p></div>
        <div><span class="text-blue-200 text-xs">Father's Name</span><p id="sumFather" class="font-semibold">—</p></div>
        <div><span class="text-blue-200 text-xs">Date of Birth</span><p id="sumDob" class="font-semibold">—</p></div>
        <div><span class="text-blue-200 text-xs">Category</span><p id="sumCat" class="font-semibold">—</p></div>
        <div><span class="text-blue-200 text-xs">Exam Centre</span><p id="sumCentre" class="font-semibold">—</p></div>
        <div><span class="text-blue-200 text-xs">Fee Amount</span><p id="sumFee" class="font-bold text-yellow-300 text-lg">—</p></div>
      </div>
    </div>

    <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div class="flex items-center gap-3">
        <i class="fab fa-google-pay text-4xl text-green-600"></i>
        <div>
          <p class="font-bold text-green-800">Secure Payment via Razorpay</p>
          <p class="text-xs text-gray-500">UPI / Debit Card / Credit Card / Net Banking accepted</p>
        </div>
        <div class="ml-auto">
          <img src="https://cdn.razorpay.com/logo.svg" alt="Razorpay" class="h-8"/>
        </div>
      </div>
    </div>

    <div class="flex justify-between">
      <button type="button" onclick="goStep(2)" class="btn-primary" style="width:auto;background:linear-gradient(90deg,#64748b,#475569);padding:12px 32px;">
        <i class="fas fa-arrow-left mr-2"></i> Back
      </button>
      <button type="button" id="payBtn" onclick="submitForm()" class="btn-primary" style="width:auto;padding:12px 40px;">
        <i class="fas fa-lock mr-2"></i> Submit & Pay <span id="payAmount" class="ml-1 bg-yellow-400 text-blue-900 px-2 rounded font-bold"></span>
      </button>
    </div>
  </div>

</form>

<script>
let feeAmount = 0;
let feeCat = '';

function selectFee(cat, amount) {
  feeAmount = amount;
  feeCat = cat;
  document.getElementById('fcA').checked = cat === 'A';
  document.getElementById('fcB').checked = cat === 'B';
  document.getElementById('feeA').classList.toggle('selected', cat === 'A');
  document.getElementById('feeB').classList.toggle('selected', cat === 'B');
  document.getElementById('payAmount').textContent = '₹' + amount;
}

function showToast(msg, isErr=true) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = isErr ? '#dc2626' : '#16a34a';
  t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 4000);
}

function previewFile(input, previewId) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast('File too large. Max 2MB.'); input.value=''; return; }
  const reader = new FileReader();
  reader.onload = e => {
    const img = document.getElementById(previewId);
    img.src = e.target.result;
    img.classList.remove('hidden');
    img.previousElementSibling.previousElementSibling.previousElementSibling.textContent = '✅ ' + file.name;
  };
  reader.readAsDataURL(file);
}

function showFileName(input, labelId) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast('File too large. Max 2MB.'); input.value=''; return; }
  document.getElementById(labelId).textContent = '✅ ' + file.name;
}

function goStep(step) {
  if (step > 1 && !validateStep1()) return;
  if (step > 2 && !validateStep2()) return;

  ['step1','step2','step3'].forEach((s,i) => {
    document.getElementById(s).classList.toggle('hidden', i !== step - 1);
    const circle = document.getElementById('s' + (i+1));
    if (i + 1 < step) { circle.className = 'step-circle step-done'; circle.innerHTML = '<i class="fas fa-check text-xs"></i>'; }
    else if (i + 1 === step) { circle.className = 'step-circle step-active'; circle.textContent = i+1; }
    else { circle.className = 'step-circle step-pending'; circle.textContent = i+1; }
    const sl = document.getElementById('sl'+(i+1));
    if (sl) sl.className = 'text-sm font-semibold ' + (i+1 <= step ? 'text-blue-900' : 'text-gray-400');
  });

  document.getElementById('prog1').style.width = step > 1 ? '100%' : '0%';
  document.getElementById('prog2').style.width = step > 2 ? '100%' : '0%';

  if (step === 3) updateSummary();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep1() {
  const required = ['surname','first_name','father_name','mother_name','dob','aadhar','whatsapp','email','address'];
  for (const f of required) {
    const el = document.getElementById(f);
    if (!el || !el.value.trim()) { showToast('Please fill: ' + f.replace('_',' ')); el?.focus(); return false; }
  }
  const dob = new Date(document.getElementById('dob').value);
  const min = new Date('2014-06-01'), max = new Date('2016-05-31');
  if (dob < min || dob > max) { showToast('Date of Birth must be between 01-Jun-2014 and 31-May-2016'); return false; }
  const aad = document.getElementById('aadhar').value;
  if (!/^[0-9]{12}$/.test(aad)) { showToast('Aadhaar must be exactly 12 digits'); return false; }
  const ph = document.getElementById('whatsapp').value;
  if (!/^[0-9]{10}$/.test(ph)) { showToast('WhatsApp number must be 10 digits'); return false; }
  if (!document.querySelector('input[name="category"]:checked')) { showToast('Please select Admission Category'); return false; }
  if (!document.querySelector('input[name="fee_category"]:checked')) { showToast('Please select Fee Category'); return false; }
  return true;
}

function validateStep2() {
  const ps = document.querySelector('[name="present_school"]').value;
  if (!ps.trim()) { showToast('Please enter Present School Name'); return false; }
  if (!document.querySelector('input[name="ex_serviceman"]:checked')) { showToast('Please select whether the student is a child of Ex-Serviceman'); return false; }
  if (!document.querySelector('[name="prev_std"]').value) { showToast('Please select Previous Standard'); return false; }
  if (!document.querySelector('[name="prev_board"]').value) { showToast('Please select Previous Board'); return false; }
  if (!document.querySelector('[name="exam_language"]').value) { showToast('Please select Exam Language'); return false; }
  if (!document.querySelector('input[name="exam_centre"]:checked')) { showToast('Please select Exam Centre'); return false; }
  return true;
}

function updateSummary() {
  const sn = document.getElementById('surname').value + ' ' + document.getElementById('first_name').value;
  document.getElementById('sumName').textContent = sn || '—';
  document.getElementById('sumFather').textContent = document.getElementById('father_name').value || '—';
  document.getElementById('sumDob').textContent = document.getElementById('dob').value || '—';
  const cat = document.querySelector('input[name="category"]:checked');
  document.getElementById('sumCat').textContent = cat ? cat.value : '—';
  const centre = document.querySelector('input[name="exam_centre"]:checked');
  document.getElementById('sumCentre').textContent = centre ? centre.value : '—';
  document.getElementById('sumFee').textContent = feeAmount ? '₹' + feeAmount : '—';
  document.getElementById('payAmount').textContent = feeAmount ? '₹' + feeAmount : '';
}

async function submitForm() {
  if (!validateStep1() || !validateStep2()) return;
  if (!document.getElementById('photo').files[0]) { showToast('Please upload Student Photo'); return; }
  if (!document.getElementById('bonafide').files[0]) { showToast('Please upload Bonafide Certificate'); return; }
  if (!document.getElementById('aadhar_doc').files[0]) { showToast('Please upload Aadhaar Card'); return; }
  if (!feeAmount) { showToast('Please select a fee category'); return; }

  const btn = document.getElementById('payBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving Details...';

  try {
    // ── STEP 1: Save form data first (PENDING status), get registration_id back ──
    const fd = new FormData(document.getElementById('regForm'));
    fd.append('fee_amount', feeAmount);

    const saveRes = await fetch('/api/pre-register', { method: 'POST', body: fd });
    const saved = await saveRes.json();
    if (!saved.success) throw new Error(saved.error || 'Failed to save registration');

    const registrationId = saved.registration_id;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creating Payment...';

    // ── STEP 2: Create Razorpay order ─────────────────────────────────────────
    const orderRes = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: feeAmount,
        registration_id: registrationId,
        name: document.getElementById('first_name').value + ' ' + document.getElementById('surname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('whatsapp').value
      })
    });
    const order = await orderRes.json();
    if (!order.id) throw new Error(order.error || 'Order creation failed');

    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Redirecting to Payment...';

    // ── STEP 3: Build hidden form and POST-redirect to Razorpay ──────────────
    // Razorpay Standard Checkout redirect — user lands on Razorpay's hosted page
    const rzpForm = document.createElement('form');
    rzpForm.method = 'POST';
    rzpForm.action = 'https://api.razorpay.com/v1/checkout/embedded';
    rzpForm.style.display = 'none';

    const fields = {
      key_id:          order.key_id,
      order_id:        order.id,
      name:            'Shri Tuljabhavani Sainiki School',
      description:     'Std 11th Admission 2026-27',
      image:           'https://via.placeholder.com/80/0f2c6b/ffffff?text=SVT',
      prefill_name:    document.getElementById('first_name').value + ' ' + document.getElementById('surname').value,
      prefill_email:   document.getElementById('email').value,
      prefill_contact: document.getElementById('whatsapp').value,
      notes_reg_id:    registrationId,
      // After payment success Razorpay will redirect here
      callback_url:    window.location.origin + '/payment/callback',
      // On cancel, go back to form
      cancel_url:      window.location.origin + '/?cancelled=1&reg=' + registrationId,
    };

    Object.entries(fields).forEach(([k, v]) => {
      const inp = document.createElement('input');
      inp.type = 'hidden';
      inp.name = k;
      inp.value = v;
      rzpForm.appendChild(inp);
    });

    document.body.appendChild(rzpForm);
    rzpForm.submit(); // ← Full page redirect to Razorpay

  } catch (err) {
    showToast('Error: ' + err.message);
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-lock mr-2"></i>Submit & Pay ₹' + feeAmount;
  }
}
</script>
</body>
</html>`
  return c.html(html)
})

// ─── API: Pre-Register (save PENDING before payment) ─────────────────────────
app.post('/api/pre-register', async (c) => {
  try {
    const formData = await c.req.formData()

    const photoFile  = formData.get('photo')      as File
    const bonFile    = formData.get('bonafide')    as File
    const aadharFile = formData.get('aadhar_doc')  as File

    const toBase64 = async (file: File): Promise<string> => {
      if (!file || !file.size) return ''
      const ab = await file.arrayBuffer()
      const bytes = new Uint8Array(ab)
      let binary = ''
      bytes.forEach(b => binary += String.fromCharCode(b))
      return `data:${file.type};base64,${btoa(binary)}`
    }

    const photoB64      = await toBase64(photoFile)
    const bonafideB64   = await toBase64(bonFile)
    const aadharDocB64  = await toBase64(aadharFile)

    const registrationId = `SVT${Date.now()}`

    const hostingerApiUrl = c.env.HOSTINGER_API_URL
    if (!hostingerApiUrl) {
      return c.json({ error: 'Database API not configured' }, 500)
    }

    const payload = {
      registration_id:    registrationId,
      surname:            formData.get('surname'),
      first_name:         formData.get('first_name'),
      middle_name:        formData.get('middle_name'),
      father_name:        formData.get('father_name'),
      mother_name:        formData.get('mother_name'),
      dob:                formData.get('dob'),
      aadhar:             formData.get('aadhar'),
      gender:             formData.get('gender'),
      whatsapp:           formData.get('whatsapp'),
      alt_number:         formData.get('alt_number'),
      email:              formData.get('email'),
      address:            formData.get('address'),
      category:           formData.get('category'),
      fee_category:       formData.get('fee_category'),
      fee_amount:         formData.get('fee_amount'),
      present_school:     formData.get('present_school'),
      prev_std:           formData.get('prev_std'),
      prev_board:         formData.get('prev_board'),
      exam_language:      formData.get('exam_language'),
      exam_centre:        formData.get('exam_centre'),
      ex_serviceman:      formData.get('ex_serviceman'),
      course:             '11th',
      academic_year:      '2026-27',
      payment_status:     'PENDING',        // ← PENDING until Razorpay confirms
      payment_id:         '',
      order_id:           '',
      razorpay_signature: '',
      photo:              photoB64,
      bonafide_doc:       bonafideB64,
      aadhar_doc:         aadharDocB64,
    }

    const dbRes    = await fetch(`${hostingerApiUrl}/save_registration.php`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
    const dbResult = await dbRes.json()

    if (!dbResult.success) {
      return c.json({ error: dbResult.error || 'DB save failed' }, 500)
    }

    return c.json({ success: true, registration_id: registrationId })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// ─── API: Create Razorpay Order ───────────────────────────────────────────────
app.post('/api/create-order', async (c) => {
  try {
    const body = await c.req.json()
    const { amount, name, email, phone, registration_id } = body

    const keyId    = c.env.RAZORPAY_KEY_ID
    const keySecret = c.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      return c.json({ error: 'Payment gateway not configured' }, 500)
    }

    const auth = btoa(`${keyId}:${keySecret}`)
    const res  = await fetch('https://api.razorpay.com/v1/orders', {
      method:  'POST',
      headers: {
        'Authorization':  `Basic ${auth}`,
        'Content-Type':   'application/json',
      },
      body: JSON.stringify({
        amount:   amount * 100,         // paise
        currency: 'INR',
        receipt:  registration_id || `reg_${Date.now()}`,
        notes:    { name, email, phone, registration_id },
      }),
    })
    const order = await res.json()
    return c.json({ ...order, key_id: keyId })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// ─── Payment Callback (Razorpay redirects here after payment) ────────────────
// Razorpay POST-redirects with: razorpay_payment_id, razorpay_order_id,
//   razorpay_signature (success) OR razorpay_payment_link_status=cancelled
app.post('/payment/callback', async (c) => {
  try {
    const body     = await c.req.parseBody()
    const paymentId  = body['razorpay_payment_id']  as string
    const orderId    = body['razorpay_order_id']    as string
    const signature  = body['razorpay_signature']   as string

    // Verify signature using HMAC-SHA256
    const keySecret  = c.env.RAZORPAY_KEY_SECRET || ''
    const message    = `${orderId}|${paymentId}`

    // Web Crypto API (available in Cloudflare Workers)
    const encoder    = new TextEncoder()
    const keyData    = encoder.encode(keySecret)
    const msgData    = encoder.encode(message)
    const cryptoKey  = await crypto.subtle.importKey(
      'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    )
    const sigBuffer  = await crypto.subtle.sign('HMAC', cryptoKey, msgData)
    const sigHex     = Array.from(new Uint8Array(sigBuffer))
      .map(b => b.toString(16).padStart(2, '0')).join('')

    const isValid    = sigHex === signature

    if (!isValid) {
      // Signature mismatch – suspicious request
      return c.html(`<html><body><script>window.location.href='/?payment=failed';</script></body></html>`)
    }

    // ── Fetch order details from Razorpay to get registration_id ─────────────
    const keyId   = c.env.RAZORPAY_KEY_ID || ''
    const auth    = btoa(`${keyId}:${keySecret}`)
    const orderRes = await fetch(`https://api.razorpay.com/v1/orders/${orderId}`, {
      headers: { 'Authorization': `Basic ${auth}` },
    })
    const orderData    = await orderRes.json() as any
    const registrationId = orderData?.notes?.registration_id || ''

    // ── Update registration in Hostinger DB: PENDING → PAID ──────────────────
    const hostingerApiUrl = c.env.HOSTINGER_API_URL || ''
    if (hostingerApiUrl && registrationId) {
      await fetch(`${hostingerApiUrl}/update_registration.php`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_id:    registrationId,
          payment_id:         paymentId,
          order_id:           orderId,
          razorpay_signature: signature,
          payment_status:     'PAID',
        }),
      })
    }

    // ── Redirect to receipt page ──────────────────────────────────────────────
    const redirectId = registrationId || orderId
    return c.redirect(`/receipt/${redirectId}`, 302)

  } catch (e: any) {
    return c.html(`<html><body><h2>Payment Error</h2><p>${e.message}</p><a href="/">Go Back</a></body></html>`)
  }
})

// GET callback (some browsers redirect via GET)
app.get('/payment/callback', async (c) => {
  const paymentId = c.req.query('razorpay_payment_id') || ''
  const orderId   = c.req.query('razorpay_order_id')   || ''
  if (paymentId && orderId) {
    return c.redirect(`/receipt/${orderId}`, 302)
  }
  return c.redirect('/?payment=cancelled', 302)
})

// ─── (old /api/register removed – replaced by /api/pre-register + /payment/callback) ───

// ─── Receipt Page ─────────────────────────────────────────────────────────────
app.get('/receipt/:id', async (c) => {
  const id = c.req.param('id')
  const hostingerApiUrl = c.env.HOSTINGER_API_URL

  let student: any = null
  if (hostingerApiUrl) {
    try {
      const res = await fetch(`${hostingerApiUrl}/get_registration.php?id=${id}`)
      student = await res.json()
    } catch (e) {}
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Payment Receipt | Shri Tuljabhavani Sainiki School</title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css"/>
<style>
  body { background:linear-gradient(135deg,#0f2c6b,#b8860b); min-height:100vh; }
  @media print { body { background:#fff; } .no-print { display:none; } }
</style>
</head>
<body class="py-8 px-4 flex items-center justify-center">
<div class="w-full max-w-2xl">

  <!-- Success Banner -->
  <div class="bg-green-500 text-white rounded-t-xl p-4 text-center no-print">
    <i class="fas fa-check-circle text-4xl mb-2"></i>
    <h2 class="text-xl font-bold">Payment Successful!</h2>
    <p class="text-sm opacity-90">Your registration has been confirmed</p>
  </div>

  <!-- Receipt Card -->
  <div id="receiptCard" class="bg-white rounded-b-xl shadow-2xl overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 text-center">
      <div class="flex items-center justify-center gap-3 mb-2">
        <div class="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-2xl">🏛️</div>
        <div class="text-left">
          <p class="text-xs text-blue-200">Shri Tuljabhavani Temple Trust's</p>
          <h1 class="font-bold text-sm leading-tight">Shri Tuljabhavani Sainiki Sec. & Higher Sec. School</h1>
          <p class="text-xs text-blue-200">Tuljapur | CBSE Affiliated</p>
        </div>
      </div>
      <div class="border-t border-blue-500 mt-3 pt-3">
        <p class="text-lg font-bold tracking-widest">PAYMENT RECEIPT</p>
        <p class="text-xs text-blue-200">Academic Year 2026-27 | Std 11th Admission</p>
      </div>
    </div>

    <div class="p-6">
      <!-- Status Badge -->
      <div class="flex justify-center mb-4">
        <span class="bg-green-100 text-green-700 border border-green-300 px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2">
          <i class="fas fa-check-circle"></i> PAID – Registration Confirmed
        </span>
      </div>

      <!-- Registration ID -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-center">
        <p class="text-xs text-gray-500">Registration Number</p>
        <p class="text-2xl font-extrabold text-blue-900" id="regId">${id}</p>
        <p class="text-xs text-gray-400">Keep this for future reference</p>
      </div>

      <!-- Student & Payment Details -->
      <div id="studentDetails" class="space-y-3">
        ${student ? `
        <div class="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
          ${student.photo ? `<img src="${student.photo}" class="w-20 h-20 object-cover rounded-lg border-2 border-blue-300 flex-shrink-0"/>` : '<div class="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0"><i class="fas fa-user text-2xl"></i></div>'}
          <div class="flex-1">
            <h3 class="text-lg font-bold text-blue-900">${student.first_name || ''} ${student.surname || ''}</h3>
            <p class="text-sm text-gray-500">Father: ${student.father_name || '—'}</p>
            <p class="text-sm text-gray-500">Mother: ${student.mother_name || '—'}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-sm">
          <div class="bg-gray-50 rounded p-2"><span class="text-xs text-gray-400">Date of Birth</span><p class="font-semibold">${student.dob || '—'}</p></div>
          <div class="bg-gray-50 rounded p-2"><span class="text-xs text-gray-400">Aadhaar</span><p class="font-semibold">${student.aadhar || '—'}</p></div>
          <div class="bg-gray-50 rounded p-2"><span class="text-xs text-gray-400">Category</span><p class="font-semibold">${student.category || '—'}</p></div>
          <div class="bg-gray-50 rounded p-2"><span class="text-xs text-gray-400">Exam Centre</span><p class="font-semibold">${student.exam_centre || '—'}</p></div>
          <div class="bg-gray-50 rounded p-2"><span class="text-xs text-gray-400">School</span><p class="font-semibold">${student.present_school || '—'}</p></div>
          <div class="bg-gray-50 rounded p-2"><span class="text-xs text-gray-400">Exam Language</span><p class="font-semibold">${student.exam_language || '—'}</p></div>
        </div>

        <div class="bg-green-50 border border-green-200 rounded-lg p-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500">Payment ID</p>
              <p class="font-mono text-sm font-bold text-green-700">${student.payment_id || '—'}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500">Amount Paid</p>
              <p class="text-2xl font-extrabold text-green-700">₹${student.fee_amount || '—'}</p>
            </div>
          </div>
          <p class="text-xs text-gray-400 mt-1">Paid on ${new Date().toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})}</p>
        </div>
        ` : `
        <div class="text-center py-6">
          <i class="fas fa-check-circle text-5xl text-green-500 mb-3"></i>
          <p class="font-bold text-blue-900 text-lg">Registration Successful!</p>
          <p class="text-gray-500 text-sm">Registration ID: <strong>${id}</strong></p>
        </div>
        `}
      </div>

      <!-- Footer Note -->
      <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4 text-xs text-amber-700">
        <p class="font-semibold mb-1"><i class="fas fa-info-circle mr-1"></i>Important:</p>
        <ul class="list-disc ml-4 space-y-1">
          <li>Save / print this receipt for your records</li>
          <li>Carry this receipt on the day of examination</li>
          <li>Medical Fitness Test is mandatory</li>
        </ul>
      </div>
    </div>

    <!-- Print & New Registration Buttons -->
    <div class="border-t p-4 flex gap-3 no-print">
      <button onclick="window.print()" class="flex-1 bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition flex items-center justify-center gap-2">
        <i class="fas fa-print"></i> Print Receipt
      </button>
      <button onclick="window.location.href='/'" class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2">
        <i class="fas fa-plus"></i> New Registration
      </button>
    </div>
  </div>
</div>
</body>
</html>`
  return c.html(html)
})

// ─── Admin Auth ───────────────────────────────────────────────────────────────
app.get('/admin', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Admin Login | SVT School</title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css"/>
<style>body{background:linear-gradient(135deg,#0f2c6b 0%,#1a4199 50%,#b8860b 100%);min-height:100vh;}</style>
</head>
<body class="flex items-center justify-center min-h-screen p-4">
<div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
  <div class="text-center mb-8">
    <div class="w-20 h-20 bg-gradient-to-br from-blue-900 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🏛️</div>
    <h1 class="text-2xl font-extrabold text-blue-900">Admin Login</h1>
    <p class="text-gray-500 text-sm">Sainiki Vidyalaya Tuljapur</p>
  </div>
  <div id="errMsg" class="hidden bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 mb-4 text-sm"></div>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-1">Username</label>
      <input type="text" id="username" class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-600 outline-none" placeholder="admin"/>
    </div>
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
      <div class="relative">
        <input type="password" id="password" class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-600 outline-none pr-12" placeholder="••••••••" onkeypress="if(event.key==='Enter')doLogin()"/>
        <button onclick="togglePwd()" class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"><i class="fas fa-eye" id="eyeIcon"></i></button>
      </div>
    </div>
    <button onclick="doLogin()" class="w-full bg-gradient-to-r from-blue-900 to-blue-700 text-white py-3 rounded-xl font-bold text-lg hover:opacity-90 transition">
      <i class="fas fa-sign-in-alt mr-2"></i>Login
    </button>
  </div>
</div>
<script>
function togglePwd(){
  const inp=document.getElementById('password');
  const ic=document.getElementById('eyeIcon');
  if(inp.type==='password'){inp.type='text';ic.className='fas fa-eye-slash';}
  else{inp.type='password';ic.className='fas fa-eye';}
}
async function doLogin(){
  const u=document.getElementById('username').value;
  const p=document.getElementById('password').value;
  const res=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})});
  const d=await res.json();
  if(d.success){window.location.href='/admin/dashboard';}
  else{const e=document.getElementById('errMsg');e.textContent=d.error||'Invalid credentials';e.classList.remove('hidden');}
}
</script>
</body>
</html>`)
})

app.post('/api/admin/login', async (c) => {
  const { username, password } = await c.req.json()
  const adminUser = c.env.ADMIN_USERNAME || 'admin'
  const adminPass = c.env.ADMIN_PASSWORD || 'admin@123'
  if (username === adminUser && password === adminPass) {
    return c.json({ success: true })
  }
  return c.json({ success: false, error: 'Invalid credentials' }, 401)
})

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
app.get('/admin/dashboard', async (c) => {
  const hostingerApiUrl = c.env.HOSTINGER_API_URL
  let stats = { total: 0, paid: 0, pending: 0, failed: 0, revenue: 0, today_revenue: 0 }
  let registrations: any[] = []

  if (hostingerApiUrl) {
    try {
      const r = await fetch(`${hostingerApiUrl}/get_all_registrations.php`)
      const data = await r.json()
      registrations = data.registrations || []
      stats.total = registrations.length
      stats.paid = registrations.filter((r: any) => r.payment_status === 'PAID').length
      stats.pending = registrations.filter((r: any) => r.payment_status === 'PENDING').length
      stats.failed = registrations.filter((r: any) => r.payment_status === 'FAILED').length
      stats.revenue = registrations.filter((r: any) => r.payment_status === 'PAID').reduce((s: number, r: any) => s + Number(r.fee_amount || 0), 0)
      const today = new Date().toISOString().slice(0, 10)
      stats.today_revenue = registrations.filter((r: any) => r.payment_status === 'PAID' && r.created_at?.slice(0, 10) === today).reduce((s: number, r: any) => s + Number(r.fee_amount || 0), 0)
    } catch (e) {}
  }

  const successRate = stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0

  const tableRows = registrations.map((r: any, i: number) => `
    <tr class="hover:bg-blue-50 transition-colors border-b border-gray-100" id="row-${r.registration_id}">
      <td class="py-3 px-3 text-gray-500 text-sm">${i + 1}</td>
      <td class="py-3 px-3 text-sm font-mono text-blue-600">${r.id || i + 1}</td>
      <td class="py-3 px-3">
        <div class="flex items-center gap-2">
          ${r.photo ? `<img src="${r.photo}" class="w-8 h-8 rounded-full object-cover border border-gray-200"/>` : '<div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500"><i class="fas fa-user"></i></div>'}
          <div>
            <p class="font-semibold text-sm text-gray-800">${r.first_name || ''} ${r.surname || ''}</p>
            <p class="text-xs text-gray-400">${r.email || ''}</p>
          </div>
        </div>
      </td>
      <td class="py-3 px-3 text-sm font-mono">${r.aadhar || '—'}</td>
      <td class="py-3 px-3 text-sm">${r.whatsapp || '—'}</td>
      <td class="py-3 px-3 text-sm font-semibold text-blue-700">${r.course || '11th'}</td>
      <td class="py-3 px-3 text-sm">${r.exam_centre || '—'}</td>
      <td class="py-3 px-3 text-sm font-bold">₹${r.fee_amount || '—'}</td>
      <td class="py-3 px-3">
        <span class="px-2 py-1 rounded-full text-xs font-bold ${r.payment_status === 'PAID' ? 'bg-green-100 text-green-700' : r.payment_status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}">
          ${r.payment_status || 'PENDING'}
        </span>
      </td>
      <td class="py-3 px-3 text-xs text-gray-500">${r.created_at ? r.created_at.slice(0, 10) : '—'}</td>
      <td class="py-3 px-3">
        <div class="flex items-center gap-1">
          <button onclick="viewStudent('${r.registration_id}')" class="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition">View</button>
          <button onclick="editStudent('${r.registration_id}')" class="bg-yellow-400 text-gray-900 px-2 py-1 rounded text-xs font-semibold hover:bg-yellow-500 transition">Edit</button>
          ${r.payment_status === 'PAID' ? `<button onclick="printReceipt('${r.registration_id}')" class="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-green-700 transition">Receipt</button>` : `<button onclick="markPaid('${r.registration_id}')" class="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-orange-600 transition">Mark Paid</button>`}
        </div>
      </td>
    </tr>
  `).join('')

  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Admin Dashboard | Sainiki Vidyalaya Tuljapur</title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css"/>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
  body{background:#f1f5f9;}
  .stat-card{background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,0.06);transition:transform 0.2s;}
  .stat-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.1);}
  .nav-btn{padding:8px 16px;border-radius:8px;font-weight:600;font-size:0.8rem;cursor:pointer;transition:all 0.2s;}
  .sidebar{width:260px;background:linear-gradient(180deg,#0f2c6b,#1a4199);min-height:100vh;flex-shrink:0;}
  .main-content{flex:1;overflow:hidden;}
  #toast2{position:fixed;top:20px;right:20px;z-index:9999;display:none;padding:12px 20px;border-radius:10px;font-weight:600;font-size:0.875rem;box-shadow:0 4px 20px rgba(0,0,0,0.2);}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:none;align-items:center;justify-content:center;padding:16px;}
  .modal-overlay.active{display:flex;}
  @media print{.no-print{display:none;}}
</style>
</head>
<body>

<div id="toast2"></div>

<!-- View Modal -->
<div class="modal-overlay" id="viewModal">
  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
    <div class="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
      <h3 class="font-bold text-lg flex items-center gap-2"><i class="fas fa-user"></i> Student Details</h3>
      <button onclick="closeModal('viewModal')" class="text-white hover:text-gray-200 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <div id="viewContent" class="p-6"></div>
  </div>
</div>

<!-- Edit Modal -->
<div class="modal-overlay" id="editModal">
  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-screen overflow-y-auto">
    <div class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
      <h3 class="font-bold text-lg flex items-center gap-2"><i class="fas fa-edit"></i> Edit Registration</h3>
      <button onclick="closeModal('editModal')" class="text-white hover:text-gray-200 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <div id="editContent" class="p-6"></div>
  </div>
</div>

<div class="flex">
  <!-- Sidebar -->
  <div class="sidebar no-print text-white flex flex-col py-6">
    <div class="px-6 mb-8 text-center">
      <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">🏛️</div>
      <p class="text-xs text-blue-200 uppercase tracking-widest">Sainiki Vidyalaya</p>
      <h2 class="font-extrabold text-sm leading-tight">Tuljapur – Admin</h2>
      <div class="mt-2 text-xs text-blue-300 bg-blue-800 rounded px-2 py-1">Mode: ALL ATTEMPTS</div>
    </div>

    <nav class="flex-1 px-4 space-y-1">
      <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/20 text-white font-semibold text-sm">
        <i class="fas fa-tachometer-alt w-5"></i> Dashboard
      </a>
      <a href="#tableSection" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-blue-100 text-sm transition">
        <i class="fas fa-list w-5"></i> Applications List
      </a>
      <a href="#" onclick="filterTable('PAID')" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-blue-100 text-sm transition">
        <i class="fas fa-check-circle w-5 text-green-400"></i> Paid Students
      </a>
      <a href="#" onclick="filterTable('PENDING')" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-blue-100 text-sm transition">
        <i class="fas fa-clock w-5 text-yellow-400"></i> Pending Students
      </a>
      <a href="#" onclick="filterTable('FAILED')" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-blue-100 text-sm transition">
        <i class="fas fa-times-circle w-5 text-red-400"></i> Failed Students
      </a>
    </nav>

    <div class="px-4 mt-4">
      <button onclick="window.location.href='/admin'" class="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2">
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    </div>
  </div>

  <!-- Main Content -->
  <div class="main-content p-6 overflow-y-auto h-screen">

    <!-- Top Bar -->
    <div class="flex items-center justify-between mb-6 no-print">
      <div>
        <h1 class="text-2xl font-extrabold text-blue-900">Admin Dashboard</h1>
        <p class="text-gray-500 text-sm">Std 11th Admission 2026-27 | Shri Tuljabhavani Sainiki School</p>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="filterTable('PAID')" class="nav-btn bg-green-100 text-green-700 hover:bg-green-200"><i class="fas fa-check mr-1"></i>Paid</button>
        <button onclick="filterTable('PENDING')" class="nav-btn bg-yellow-100 text-yellow-700 hover:bg-yellow-200"><i class="fas fa-clock mr-1"></i>Pending</button>
        <button onclick="filterTable('FAILED')" class="nav-btn bg-red-100 text-red-700 hover:bg-red-200"><i class="fas fa-times mr-1"></i>Failed</button>
        <button onclick="filterTable('')" class="nav-btn bg-gray-200 text-gray-700 hover:bg-gray-300"><i class="fas fa-list mr-1"></i>All</button>
        <button onclick="window.location.href='/admin'" class="nav-btn bg-red-600 text-white hover:bg-red-700"><i class="fas fa-sign-out-alt"></i></button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-4 no-print">
      <button onclick="filterTable('')" class="tab-btn px-4 py-2 rounded-full text-sm font-semibold bg-blue-900 text-white">All ${stats.total}</button>
      <button onclick="filterTable('PAID')" class="tab-btn px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-green-100">Paid ${stats.paid}</button>
      <button onclick="filterTable('PENDING')" class="tab-btn px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-yellow-100">Pending ${stats.pending}</button>
      <button onclick="filterTable('FAILED')" class="tab-btn px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-red-100">Failed ${stats.failed}</button>
    </div>
    <p class="text-xs text-gray-400 mb-4">Unique mode: Prefers PAID record per Aadhaar (recommended)</p>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <div class="stat-card col-span-1">
        <p class="text-xs text-gray-400 uppercase tracking-widest">Total Applications</p>
        <p class="text-4xl font-black text-blue-900 mt-1">${stats.total}</p>
        <p class="text-xs text-gray-400 mt-1">Today: 0</p>
      </div>
      <div class="stat-card col-span-1">
        <p class="text-xs text-gray-400 uppercase tracking-widest">Paid</p>
        <p class="text-4xl font-black text-green-600 mt-1">${stats.paid}</p>
        <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2"><div class="bg-green-500 h-1.5 rounded-full" style="width:${successRate}%"></div></div>
        <p class="text-xs text-gray-400 mt-1">Success rate: ${successRate}%</p>
      </div>
      <div class="stat-card col-span-1">
        <p class="text-xs text-gray-400 uppercase tracking-widest">Pending</p>
        <p class="text-4xl font-black text-yellow-500 mt-1">${stats.pending}</p>
        <p class="text-xs text-gray-400 mt-1">Attempts pending payment</p>
      </div>
      <div class="stat-card col-span-1">
        <p class="text-xs text-gray-400 uppercase tracking-widest">Failed</p>
        <p class="text-4xl font-black text-red-500 mt-1">${stats.failed}</p>
        <p class="text-xs text-gray-400 mt-1">Need follow-up</p>
      </div>
      <div class="stat-card col-span-1">
        <p class="text-xs text-gray-400 uppercase tracking-widest">Total Revenue (Paid)</p>
        <p class="text-3xl font-black text-blue-900 mt-1">₹${stats.revenue.toLocaleString('en-IN')}</p>
        <p class="text-xs text-gray-400 mt-1">Expected: ₹${(stats.total * 300).toLocaleString('en-IN')}</p>
      </div>
      <div class="stat-card col-span-1">
        <p class="text-xs text-gray-400 uppercase tracking-widest">Today Revenue</p>
        <p class="text-3xl font-black text-purple-600 mt-1">₹${stats.today_revenue.toLocaleString('en-IN')}</p>
        <p class="text-xs text-gray-400 mt-1">Paid today: ${stats.today_revenue > 0 ? Math.floor(stats.today_revenue / 300) : 0}</p>
      </div>
    </div>

    <!-- Charts & Recent -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <!-- Recent Registrations -->
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h3 class="font-bold text-blue-900 mb-4 flex items-center gap-2"><i class="fas fa-clock text-blue-400"></i> Recent Registrations</h3>
        <div class="space-y-3" id="recentList">
          ${registrations.slice(0, 5).map((r: any) => `
          <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition">
            <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${r.payment_status === 'PAID' ? 'bg-green-100' : r.payment_status === 'PENDING' ? 'bg-yellow-100' : 'bg-red-100'}">
              <i class="fas fa-${r.payment_status === 'PAID' ? 'check text-green-600' : r.payment_status === 'PENDING' ? 'clock text-yellow-600' : 'times text-red-600'} text-xs"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm truncate">${r.first_name || ''} ${r.surname || ''} <span class="text-xs font-bold px-1.5 py-0.5 rounded ${r.payment_status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">${r.payment_status}</span></p>
              <p class="text-xs text-gray-400">₹${r.fee_amount || '—'} · ${r.exam_centre || '—'} · ${r.whatsapp || ''}</p>
            </div>
            <div class="flex gap-1 flex-shrink-0">
              <button onclick="viewStudent('${r.registration_id}')" class="bg-blue-600 text-white px-2 py-1 rounded text-xs">View</button>
              <button onclick="editStudent('${r.registration_id}')" class="bg-yellow-400 text-gray-900 px-2 py-1 rounded text-xs">Edit</button>
              ${r.payment_status === 'PAID' ? `<button onclick="printReceipt('${r.registration_id}')" class="bg-green-600 text-white px-2 py-1 rounded text-xs">Receipt</button>` : ''}
            </div>
          </div>`).join('')}
        </div>
      </div>

      <!-- Chart -->
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h3 class="font-bold text-blue-900 mb-4 flex items-center gap-2"><i class="fas fa-chart-line text-blue-400"></i> Last 7 Days Trend</h3>
        <canvas id="trendChart" height="200"></canvas>
      </div>
    </div>

    <!-- Applications Table -->
    <div class="bg-white rounded-xl shadow-sm" id="tableSection">
      <div class="p-4 border-b flex items-center justify-between flex-wrap gap-3">
        <h3 class="font-bold text-blue-900 text-lg flex items-center gap-2"><i class="fas fa-table text-blue-400"></i> Applications List</h3>
        <div class="flex items-center gap-2 flex-wrap">
          <button onclick="exportExcel()" class="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition flex items-center gap-1"><i class="fas fa-file-excel"></i> Export Excel</button>
          <button onclick="exportPDF()" class="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition flex items-center gap-1"><i class="fas fa-file-pdf"></i> Export PDF</button>
          <button onclick="window.print()" class="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-1"><i class="fas fa-print"></i> Print</button>
          <button onclick="copyTable()" class="bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition flex items-center gap-1"><i class="fas fa-copy"></i> Copy</button>
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-2.5 text-gray-400 text-sm"></i>
            <input type="text" id="searchInput" onkeyup="searchTable()" placeholder="Search..." class="border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:border-blue-500 outline-none w-48"/>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full" id="appTable">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th class="py-3 px-3 text-left">Sr</th>
              <th class="py-3 px-3 text-left cursor-pointer hover:text-blue-700" onclick="sortTable(1)">ID <i class="fas fa-sort text-gray-300 ml-1"></i></th>
              <th class="py-3 px-3 text-left cursor-pointer hover:text-blue-700" onclick="sortTable(2)">Student <i class="fas fa-sort text-gray-300 ml-1"></i></th>
              <th class="py-3 px-3 text-left">Aadhar</th>
              <th class="py-3 px-3 text-left">WhatsApp</th>
              <th class="py-3 px-3 text-left">Course</th>
              <th class="py-3 px-3 text-left cursor-pointer hover:text-blue-700" onclick="sortTable(6)">Centre <i class="fas fa-sort text-gray-300 ml-1"></i></th>
              <th class="py-3 px-3 text-left cursor-pointer hover:text-blue-700" onclick="sortTable(7)">Fee <i class="fas fa-sort text-gray-300 ml-1"></i></th>
              <th class="py-3 px-3 text-left cursor-pointer hover:text-blue-700" onclick="sortTable(8)">Status <i class="fas fa-sort text-gray-300 ml-1"></i></th>
              <th class="py-3 px-3 text-left cursor-pointer hover:text-blue-700" onclick="sortTable(9)">Created <i class="fas fa-sort text-gray-300 ml-1"></i></th>
              <th class="py-3 px-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody id="tableBody">
            ${tableRows || '<tr><td colspan="11" class="text-center py-8 text-gray-400"><i class="fas fa-inbox text-4xl mb-2 block"></i>No registrations yet</td></tr>'}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="p-4 border-t flex items-center justify-between text-sm text-gray-500 flex-wrap gap-2">
        <span id="tableInfo">Showing all ${stats.total} entries</span>
        <div class="flex gap-1" id="pagination"></div>
      </div>
    </div>

  </div><!-- end main-content -->
</div><!-- end flex -->

<script>
const HOSTINGER_API = '';
let allStudents = ${JSON.stringify(registrations)};

// ─── Chart ────────────────────────────────────────────────────────────────────
(function() {
  const ctx = document.getElementById('trendChart')?.getContext('2d');
  if (!ctx) return;
  const labels = [], total = [], paid = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    labels.push(d.toLocaleDateString('en-IN', { month: 'short', day: '2-digit' }));
    total.push(allStudents.filter(r => r.created_at?.slice(0, 10) === ds).length);
    paid.push(allStudents.filter(r => r.payment_status === 'PAID' && r.created_at?.slice(0, 10) === ds).length);
  }
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Total', data: total, borderColor: '#1a4199', backgroundColor: 'rgba(26,65,153,0.1)', fill: true, tension: 0.4 },
        { label: 'Paid', data: paid, borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.1)', fill: true, tension: 0.4 }
      ]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }
  });
})();

// ─── Filter Table ─────────────────────────────────────────────────────────────
function filterTable(status) {
  const rows = document.getElementById('tableBody').querySelectorAll('tr');
  rows.forEach(row => {
    if (!status) { row.style.display = ''; return; }
    const statusCell = row.querySelector('td:nth-child(9)');
    if (statusCell) {
      row.style.display = statusCell.textContent.trim() === status ? '' : 'none';
    }
  });
}

function searchTable() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const rows = document.getElementById('tableBody').querySelectorAll('tr');
  rows.forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

function sortTable(col) {
  const tbody = document.getElementById('tableBody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  rows.sort((a, b) => {
    const ta = a.querySelectorAll('td')[col]?.textContent.trim() || '';
    const tb = b.querySelectorAll('td')[col]?.textContent.trim() || '';
    return ta.localeCompare(tb);
  });
  rows.forEach(r => tbody.appendChild(r));
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function showToast2(msg, ok=false) {
  const t = document.getElementById('toast2');
  t.textContent = msg;
  t.style.background = ok ? '#16a34a' : '#dc2626';
  t.style.color = '#fff';
  t.style.display = 'block';
  setTimeout(() => t.style.display='none', 4000);
}

// ─── View Student ─────────────────────────────────────────────────────────────
async function viewStudent(regId) {
  const s = allStudents.find(r => r.registration_id === regId) || {};
  const html = \`
    <div class="flex items-start gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
      \${s.photo ? \`<img src="\${s.photo}" class="w-24 h-24 object-cover rounded-xl border-2 border-blue-300"/>\` : '<div class="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400"><i class="fas fa-user text-3xl"></i></div>'}
      <div>
        <h3 class="text-xl font-extrabold text-blue-900">\${s.first_name||''} \${s.surname||''}</h3>
        <p class="text-gray-500 text-sm">Father: \${s.father_name||'—'} | Mother: \${s.mother_name||'—'}</p>
        <span class="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold \${s.payment_status==='PAID'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}">\${s.payment_status||'—'}</span>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3 text-sm">
      \${[['Registration ID',s.registration_id],['Date of Birth',s.dob],['Gender',s.gender],['Aadhaar',s.aadhar],['WhatsApp',s.whatsapp],['Email',s.email],['Address',s.address],['Category',s.category],['Fee Amount','₹'+(s.fee_amount||'—')],['Exam Centre',s.exam_centre],['Exam Language',s.exam_language],['Present School',s.present_school],['Previous Board',s.prev_board],['Previous Std',s.prev_std],['Payment ID',s.payment_id||'—'],['Registered',s.created_at?.slice(0,10)||'—']].map(([k,v])=>\`<div class="bg-gray-50 rounded-lg p-2"><p class="text-xs text-gray-400">\${k}</p><p class="font-semibold break-all">\${v||'—'}</p></div>\`).join('')}
    </div>
    <div class="flex gap-3 mt-4">
      <button onclick="printReceipt('\${s.registration_id}')" class="flex-1 bg-blue-900 text-white py-2 rounded-lg font-bold text-sm hover:bg-blue-800"><i class="fas fa-print mr-1"></i>Print Receipt</button>
      \${s.payment_status!=='PAID'?\`<button onclick="markPaid('\${s.registration_id}');closeModal('viewModal');" class="flex-1 bg-orange-500 text-white py-2 rounded-lg font-bold text-sm hover:bg-orange-600"><i class="fas fa-check mr-1"></i>Mark as Paid</button>\`:''}
    </div>
  \`;
  document.getElementById('viewContent').innerHTML = html;
  document.getElementById('viewModal').classList.add('active');
}

// ─── Edit Student ─────────────────────────────────────────────────────────────
async function editStudent(regId) {
  const s = allStudents.find(r => r.registration_id === regId) || {};
  const html = \`
    <div class="space-y-3 text-sm">
      <div class="grid grid-cols-2 gap-3">
        \${[['first_name','First Name',s.first_name],['surname','Surname',s.surname],['father_name','Father Name',s.father_name],['mother_name','Mother Name',s.mother_name],['dob','Date of Birth',s.dob,'date'],['aadhar','Aadhaar',s.aadhar],['whatsapp','WhatsApp',s.whatsapp],['email','Email',s.email]].map(([n,l,v,t='text'])=>\`
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">\${l}</label>
          <input type="\${t}" name="\${n}" value="\${v||''}" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"/>
        </div>\`).join('')}
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1">Address</label>
        <textarea name="address" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" rows="2">\${s.address||''}</textarea>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Exam Centre</label>
          <select name="exam_centre" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none">
            <option \${s.exam_centre==='Tuljapur'?'selected':''}>Tuljapur</option>
            <option \${s.exam_centre==='Solapur'?'selected':''}>Solapur</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Payment Status</label>
          <select name="payment_status" id="editStatusSel" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none">
            <option \${s.payment_status==='PAID'?'selected':''}>PAID</option>
            <option \${s.payment_status==='PENDING'?'selected':''}>PENDING</option>
            <option \${s.payment_status==='FAILED'?'selected':''}>FAILED</option>
          </select>
        </div>
      </div>
      <button onclick="saveEdit('\${regId}')" class="w-full bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition mt-2">
        <i class="fas fa-save mr-2"></i>Save Changes
      </button>
    </div>
  \`;
  document.getElementById('editContent').innerHTML = html;
  document.getElementById('editModal').classList.add('active');
}

async function saveEdit(regId) {
  const modal = document.getElementById('editContent');
  const inputs = modal.querySelectorAll('input,select,textarea');
  const payload = { registration_id: regId };
  inputs.forEach(inp => { if (inp.name) payload[inp.name] = inp.value; });

  const res = await fetch('/api/admin/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const d = await res.json();
  if (d.success) {
    showToast2('Registration updated successfully!', true);
    closeModal('editModal');
    setTimeout(() => location.reload(), 1500);
  } else {
    showToast2('Update failed: ' + (d.error || 'Unknown error'));
  }
}

// ─── Mark as Paid ─────────────────────────────────────────────────────────────
async function markPaid(regId) {
  if (!confirm('Mark this registration as PAID?')) return;
  const res = await fetch('/api/admin/mark-paid', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ registration_id: regId })
  });
  const d = await res.json();
  if (d.success) {
    showToast2('Marked as PAID!', true);
    setTimeout(() => location.reload(), 1200);
  } else {
    showToast2('Failed: ' + (d.error || 'Unknown'));
  }
}

// ─── Print Receipt ────────────────────────────────────────────────────────────
function printReceipt(regId) {
  window.open('/receipt/' + regId, '_blank');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

// ─── Export Excel ─────────────────────────────────────────────────────────────
function exportExcel() {
  const rows = [['Sr','ID','Name','Aadhaar','WhatsApp','Email','Category','Fee','Status','Centre','Date']];
  allStudents.forEach((s, i) => {
    rows.push([i+1, s.id||'', (s.first_name||'')+' '+(s.surname||''), s.aadhar||'', s.whatsapp||'', s.email||'', s.category||'', s.fee_amount||'', s.payment_status||'', s.exam_centre||'', s.created_at?.slice(0,10)||'']);
  });
  const csv = rows.map(r => r.map(v => '"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'registrations.csv'; a.click();
}

function exportPDF() { window.print(); }
function copyTable() {
  const rows = allStudents.map(s => [s.first_name, s.surname, s.aadhar, s.whatsapp, s.payment_status].join('\\t')).join('\\n');
  navigator.clipboard.writeText(rows).then(() => showToast2('Table copied!', true));
}
</script>
</body>
</html>`)
})

// ─── Admin API: Mark as Paid ──────────────────────────────────────────────────
app.post('/api/admin/mark-paid', async (c) => {
  try {
    const { registration_id } = await c.req.json()
    const hostingerApiUrl = c.env.HOSTINGER_API_URL
    if (!hostingerApiUrl) return c.json({ error: 'API not configured' }, 500)

    const res = await fetch(`${hostingerApiUrl}/update_status.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registration_id, payment_status: 'PAID' })
    })
    const result = await res.json()
    return c.json(result)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// ─── Admin API: Update Registration ──────────────────────────────────────────
app.post('/api/admin/update', async (c) => {
  try {
    const payload = await c.req.json()
    const hostingerApiUrl = c.env.HOSTINGER_API_URL
    if (!hostingerApiUrl) return c.json({ error: 'API not configured' }, 500)

    const res = await fetch(`${hostingerApiUrl}/update_registration.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const result = await res.json()
    return c.json(result)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

export default app
