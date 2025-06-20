# 📘 ReasonCare – Developer PRD Template

## 🔧 Overview
**ReasonCare** is a dual-mode (Patient/Provider) web application that simulates a multi-agent AI diagnostic assistant with support for transitioning from simulated demo data to production-grade API integrations.

---

## ✨ Tagline
**Explainable AI for Confident Medical Decisions**

---

## ✨ Goals
- Deliver an interactive demo of AI-powered diagnosis workflows
- Support seamless switching between simulated data and real APIs
- Provide a clear onboarding path for developers via Welcome Modal and code structure

---

## 🛍 App Structure

### 🗺 Tabs:
| Tab | Mode | Description |
|------|------|-------------|
| 1. Patient Intake | Patient | Voice/chat symptom intake with clarifying questions |
| 2. EHR View | Both | Review/edit patient medical history |
| 3. Diagnosis Generation | System | AI generates diagnosis from EHR/symptoms |
| 4. Resident Review | Provider | Review/edit diagnosis before final sign-off |
| 5. Senior Review | Provider | Final approval or feedback to regenerate |
| 6. Feedback & Guideline Update | System | Update internal guidelines with doctor feedback |

---

## 🗂 Demo Mode vs. Real Mode

- Use `REACT_APP_DEMO_MODE=true/false` to toggle
- Simulated data lives in `/mock/`
- Real APIs should be added in `/services/*.ts`

### Example Environment Toggle
```env
REACT_APP_DEMO_MODE=true
REACT_APP_API_BASE_URL=https://api.reasoncare.io
```

---

## ❓ Welcome Modal

- Activated on load and by clicking `?` icon in upper-right corner
- Modal includes:
  - Overview of app purpose and modes
  - Explanation of each tab's function
  - Data requirements for real APIs
  - Link to dev docs (if available)

### Suggested Copy:
```markdown
### 👋 Welcome to ReasonCare Developer Mode

This app simulates a multi-agent diagnostic workflow. You can use it in two ways:
1. **Demo Mode** — Load mock data for quick demos
2. **Production Mode** — Plug into real APIs

#### 🔍 Tab-by-Tab Breakdown:
- **Patient Intake**: Sends voice/text to `/api/intake/voice`. Needs NLP pipeline or voice transcription.
- **EHR View**: Fetch patient record via `GET /api/ehr/:patientId`. Save with `PUT /api/ehr/:patientId`.
- **Diagnosis Generation**: Send symptoms + EHR to `POST /api/diagnosis/generate`. Receives Markdown.
- **Resident Review**: Submit edits to `PUT /api/diagnosis/update`.
- **Senior Review**: Approve (`POST /api/diagnosis/approve`) or Reject (`POST /api/diagnosis/reject`).
- **Feedback**: Append feedback to guideline with `POST /api/guidelines/update`.

Use the mode toggle in settings to switch between mock and real APIs.
``` 

---

## 📦 API Placeholder Specs

### Patient Intake
```ts
POST /api/intake/voice
{
  text: "Patient describes chest pain for 3 days..."
}
```

### EHR Data
```ts
GET /api/ehr/:patientId
PUT /api/ehr/:patientId
```

### Diagnosis Generation
```ts
POST /api/diagnosis/generate
{
  patientId: "abc123",
  symptoms: {...},
  ehr: {...}
}
```

### Doctor Review
```ts
PUT /api/diagnosis/update
POST /api/diagnosis/approve
POST /api/diagnosis/reject
```

### Feedback Loop
```ts
POST /api/guidelines/update
{
  diagnosisId: "xyz456",
  feedback: "Patient risk factors were not considered in prior output"
}
```

---

## 📁 Simulated Files
| File | Description |
|------|-------------|
| `symptoms_input.json` | Mock symptom data |
| `ehr_data.json` | Patient history and labs |
| `diagnosis_v1.md` | Initial AI-generated report |
| `diagnosis_v2.md` | Reviewed and updated report |
| `doctor_feedback.md` | Feedback from senior cardiologist |
| `updated_guidelines.md` | Updated rules post-feedback |

---

## 💠 Developer Notes
- All API calls should be abstracted in `/services` with toggle logic
- Use `localStorage` to persist demo-mode edits
- Use `.env` variables for deploy configs

---

## 📌 Next Steps
- [ ] Set up Welcome Modal with tab guide
- [ ] Build `services/intakeService.ts`, etc.
- [ ] Implement toggle-aware API layer
- [ ] Write unit tests for simulated data fallbacks
