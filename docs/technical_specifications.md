# Technical Specifications – Clínica Backson

## 1. Project Overview

**Clínica Backson** is a modern clinic website targeting new and existing patients in Tombwa, Namibe, Angola. The platform enables patients to learn about the clinic's services, book appointments, and contact the clinic directly via WhatsApp — all in Portuguese.

### Clinic Details
| Field | Value |
|---|---|
| Clinic Name | Clínica Backson |
| Address | Tombwa, Rua Che Guevara, Namibe – Angola |
| Phone | +244 930 225 181 |
| WhatsApp | +244 930 225 191 |
| Email | clinicabeckson@gmail.com / consultoriobeckson@gmail.com |
| Hours (Mon–Fri) | 07:30 – 19:00 |
| Hours (Saturday) | 08:00 – 17:00 |
| Language | Portuguese |

---

## 2. Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | Vite + React | Fast builds, component-based UI, SPA routing |
| Backend / Database | SpacetimeDB | Integrated server-side logic, real-time subscriptions, relational data |
| Messaging | WhatsApp (wa.me deep links) | Primary patient communication channel |
| Styling | CSS Modules or Tailwind CSS | Modern, maintainable design system |
| Language | TypeScript | Type safety across the frontend codebase |

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                  Browser (Patient)               │
│                                                  │
│   Vite React SPA                                 │
│   ┌──────────┐  ┌───────────┐  ┌─────────────┐  │
│   │  Pages   │  │ Components│  │  SpacetimeDB│  │
│   │ (Routes) │  │ (UI)      │  │  Client SDK │  │
│   └────┬─────┘  └─────┬─────┘  └──────┬──────┘  │
└────────┼──────────────┼───────────────┼──────────┘
         │              │               │ WebSocket
         └──────────────┴───────────────┘
                                        │
                         ┌──────────────▼──────────────┐
                         │        SpacetimeDB           │
                         │  ┌───────────────────────┐  │
                         │  │  Tables & Reducers    │  │
                         │  │  - appointments        │  │
                         │  │  - services            │  │
                         │  │  - patients            │  │
                         │  │  - time_slots          │  │
                         │  └───────────────────────┘  │
                         └─────────────────────────────┘
                                        │
                         ┌──────────────▼──────────────┐
                         │       WhatsApp               │
                         │  wa.me deep links +          │
                         │  pre-filled booking messages │
                         └─────────────────────────────┘
```

The frontend communicates with SpacetimeDB via its WebSocket-based client SDK. All appointment, service, and patient data lives in SpacetimeDB. WhatsApp integration uses `wa.me` deep links with pre-filled message templates; no third-party messaging API is required.

---

## 4. SpacetimeDB Data Models

### 4.1 `services` table
```rust
#[spacetimedb::table(name = services, public)]
pub struct Service {
    #[primary_key]
    #[auto_inc]
    pub id: u32,
    pub name: String,           // e.g. "Consulta Geral"
    pub description: String,
    pub duration_minutes: u32,  // e.g. 30
    pub is_active: bool,
}
```

### 4.2 `time_slots` table
```rust
#[spacetimedb::table(name = time_slots, public)]
pub struct TimeSlot {
    #[primary_key]
    #[auto_inc]
    pub id: u32,
    pub date: String,           // ISO 8601, e.g. "2025-06-10"
    pub start_time: String,     // e.g. "09:00"
    pub end_time: String,       // e.g. "09:30"
    pub is_available: bool,
}
```

### 4.3 `appointments` table
```rust
#[spacetimedb::table(name = appointments, public)]
pub struct Appointment {
    #[primary_key]
    #[auto_inc]
    pub id: u32,
    pub patient_name: String,
    pub patient_phone: String,
    pub service_id: u32,
    pub time_slot_id: u32,
    pub status: String,         // "pending" | "confirmed" | "cancelled"
    pub created_at: Timestamp,
    pub notes: String,
}
```

### 4.4 `patients` table
```rust
#[spacetimedb::table(name = patients, public)]
pub struct Patient {
    #[primary_key]
    #[auto_inc]
    pub id: u32,
    pub name: String,
    pub phone: String,
    pub email: String,
    pub created_at: Timestamp,
}
```

---

## 5. Screens & Pages

### 5.1 Home (`/`)
**Purpose:** First impression, clinic overview, quick-action entry points.

**Sections:**
- **Hero banner** – clinic name, tagline, and a prominent "Marcar Consulta" (Book Appointment) CTA button.
- **About the clinic** – short description, trust signals (years of experience, qualified staff).
- **Services preview** – 3–4 highlighted service cards with a "Ver todos os serviços" link.
- **Opening hours** – displayed prominently (Mon–Fri 07:30–19:00 / Sat 08:00–17:00).
- **Contact strip** – phone number, WhatsApp button, address.
- **Testimonials preview** – 2–3 patient quotes in a rotating carousel.

**Key Components:** `HeroBanner`, `ServiceCard`, `OpeningHours`, `ContactStrip`, `TestimonialCarousel`

---

### 5.2 Services (`/servicos`)
**Purpose:** Full listing of all clinic services.

**Sections:**
- **Page header** – title "Os Nossos Serviços".
- **Services grid** – one card per service showing name, description, and duration. Prices are intentionally hidden (per discovery form).
- **Booking CTA on each card** – "Marcar Consulta" button that pre-selects the service in the booking flow.

**Key Components:** `ServiceGrid`, `ServiceDetailCard`

---

### 5.3 Appointment Booking (`/marcar-consulta`)
**Purpose:** Multi-step form for patients to book an appointment.

#### Step 1 – Select Service
- List of active services fetched from SpacetimeDB `services` table.
- Patient selects their desired service.

#### Step 2 – Select Date & Time
- Calendar component showing available dates within clinic opening hours.
- Time-slot grid showing available slots for the selected date (fetched from `time_slots` filtered by `is_available = true`).

#### Step 3 – Patient Details
- Fields: Full name (required), phone number (required), optional notes.
- Client-side validation before proceeding.

#### Step 4 – Review & Confirm
- Summary of: service name, date, time, patient name, phone, notes.
- Two confirmation actions:
  - **"Confirmar via WhatsApp"** – opens `wa.me/244930225191` with a pre-filled message containing all booking details.
  - **"Confirmar"** – writes the appointment directly to SpacetimeDB via the `create_appointment` reducer and proceeds to the success screen.

#### Step 5 – Success Screen
- Booking reference number displayed.
- Reminder to arrive 10 minutes early.
- WhatsApp button to contact the clinic with any questions.

**Key Components:** `BookingWizard`, `ServiceSelector`, `DatePicker`, `TimeSlotGrid`, `PatientDetailsForm`, `BookingSummary`, `SuccessScreen`

---

### 5.4 Contact (`/contacto`)
**Purpose:** All contact details and a direct WhatsApp entry point.

**Sections:**
- **Contact card** – phone, WhatsApp, emails, address.
- **WhatsApp CTA button** – links to `https://wa.me/244930225191` with a default greeting message.
- **Embedded map** – static map image or Google Maps embed for Tombwa, Namibe.
- **Opening hours table** – Mon–Fri and Saturday hours.

**Key Components:** `ContactCard`, `WhatsAppButton`, `MapEmbed`, `OpeningHoursTable`

---

### 5.5 Testimonials (`/depoimentos`)
**Purpose:** Build trust with prospective patients through patient reviews.

**Sections:**
- **Page header** – "O Que Dizem os Nossos Pacientes".
- **Testimonials grid** – cards with patient quote, initials/avatar placeholder, and optional star rating.

**Key Components:** `TestimonialGrid`, `TestimonialCard`

---

### 5.6 Shared Layout Components
| Component | Description |
|---|---|
| `Navbar` | Responsive top navigation: logo, links (Home, Serviços, Contacto, Depoimentos), "Marcar Consulta" CTA |
| `Footer` | Clinic name, quick links, contact info, WhatsApp link |
| `WhatsAppFAB` | Floating action button (bottom-right corner) for instant WhatsApp access on every page |
| `LoadingSpinner` | Shown while SpacetimeDB data is loading |
| `ErrorBoundary` | Graceful error display for failed data fetches |

---

## 6. Appointment Booking Flow (Detailed)

```
Patient lands on any page
        │
        ▼
 Clicks "Marcar Consulta" (navbar CTA or service card button)
        │
        ▼
 /marcar-consulta  →  Step 1: Select Service
        │  (subscribes to SpacetimeDB `services` table)
        ▼
 Step 2: Select Date & Time
        │  (queries `time_slots` filtered by service & selected date)
        ▼
 Step 3: Enter Patient Details
        │  (local form state, client-side validation)
        ▼
 Step 4: Review & Confirm
        │
        ├─── "Confirmar via WhatsApp" ──► Opens WhatsApp with pre-filled text
        │                                 ► Clinic staff confirms manually
        │
        └─── "Confirmar" ──────────────► SpacetimeDB reducer `create_appointment` called
                                          ► `time_slot.is_available` set to `false`
                                          ► New row inserted into `appointments` table
                                          ▼
                                    Step 5: Success Screen
```

### WhatsApp Pre-filled Message Template
```
Olá, Clínica Backson! 👋

Gostaria de marcar uma consulta com os seguintes detalhes:
• Serviço: {service_name}
• Data: {date}
• Hora: {time}
• Nome: {patient_name}
• Telefone: {patient_phone}
• Notas: {notes}

Por favor, confirme a disponibilidade. Obrigado/a!
```
URL-encoding is applied before passing to `wa.me`.

---

## 7. WhatsApp Messaging Integration

WhatsApp is the primary communication channel (per discovery form). The integration uses `wa.me` deep links — no WhatsApp Business API key or third-party service is required.

### Use Cases
| Trigger | WhatsApp Action |
|---|---|
| Patient completes booking form | Opens WhatsApp with pre-filled booking summary |
| Patient wants to ask a question | "Fale connosco" button → opens WhatsApp with blank chat |
| Patient views contact page | Prominent WhatsApp button with clinic number |
| WhatsApp FAB (all pages) | Instant access to WhatsApp on any page |

### Implementation Pattern (React + TypeScript)
```tsx
const WHATSAPP_NUMBER = "244930225191";

function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function buildBookingMessage(booking: BookingDetails): string {
  return (
    `Olá, Clínica Backson! 👋\n\n` +
    `Gostaria de marcar uma consulta:\n` +
    `• Serviço: ${booking.serviceName}\n` +
    `• Data: ${booking.date}\n` +
    `• Hora: ${booking.time}\n` +
    `• Nome: ${booking.patientName}\n` +
    `• Telefone: ${booking.patientPhone}\n` +
    (booking.notes ? `• Notas: ${booking.notes}` : "")
  );
}

// Usage in JSX:
<a
  href={buildWhatsAppUrl(buildBookingMessage(booking))}
  target="_blank"
  rel="noopener noreferrer"
>
  Confirmar via WhatsApp
</a>
```

---

## 8. Services Display

- Services are stored in SpacetimeDB and fetched at runtime via a subscription.
- **Prices are not displayed** (per discovery form — clinic opted to hide pricing).
- Each service card shows: name, description, and appointment duration.
- Admin reducers (`add_service`, `update_service`, `deactivate_service`) allow the clinic to manage services without a frontend admin panel in the initial release.

---

## 9. Localization

The entire UI is in **Portuguese (pt-AO / pt-PT)**.

Key UI strings:
| Key | Portuguese |
|---|---|
| Book Appointment | Marcar Consulta |
| Our Services | Os Nossos Serviços |
| Contact | Contacto |
| Testimonials | Depoimentos |
| Opening Hours | Horário de Funcionamento |
| Confirm via WhatsApp | Confirmar via WhatsApp |
| Name | Nome |
| Phone | Telefone |
| Notes | Notas |
| Back | Voltar |
| Next | Próximo |
| Success | Consulta Marcada! |

---

## 10. Design Requirements

- **Style:** Modern, clean, and trustworthy (medical context).
- **Logo & Colors:** Provided by the clinic — to be integrated as CSS custom properties (design tokens).
- **Responsive:** Mobile-first layout (patients likely on Android smartphones).
- **Accessibility:** Sufficient colour contrast, minimum 16px body text, keyboard-navigable booking flow.
- **Performance:** Vite production build with code splitting; SpacetimeDB subscriptions for real-time data without polling.

---

## 11. SpacetimeDB Reducer Summary

| Reducer | Description |
|---|---|
| `create_appointment` | Inserts a new appointment row and marks the time slot as unavailable |
| `cancel_appointment` | Sets appointment status to "cancelled" and frees the time slot |
| `add_service` | Inserts a new service (admin only) |
| `update_service` | Updates service details (admin only) |
| `deactivate_service` | Soft-deletes a service by setting `is_active = false` (admin only) |
| `add_time_slot` | Inserts a new available time slot (admin only) |
| `bulk_add_time_slots` | Generates a week's worth of time slots based on clinic opening hours (admin helper) |

---

## 12. Next Steps

- [ ] Scaffold Vite React project with TypeScript in `/frontend`.
- [ ] Scaffold SpacetimeDB module in `/backend`.
- [ ] Define and publish SpacetimeDB tables and reducers.
- [ ] Build shared layout components: `Navbar`, `Footer`, `WhatsAppFAB`.
- [ ] Build Home page with all sections.
- [ ] Build Services page and `ServiceCard` component.
- [ ] Build Appointment Booking wizard (5 steps).
- [ ] Build Contact page with WhatsApp integration.
- [ ] Build Testimonials page.
- [ ] Integrate clinic logo and brand colours.
- [ ] Portuguese copy review with the clinic.
- [ ] Deploy to production (hosting TBD).
