# Clínica Backson Website

Static Portuguese website for Clínica Backson in Tombwa, Namibe, Angola. The site uses the Stitch design direction from `stitch_cl_nica_backson_digital_platform/`, the clinic details from `docs/`, and local assets for the logo and hero image.

## What is included

- `index.html` - one-page clinic website with hero, services, booking, contact, trust, and footer sections.
- `styles.css` - responsive design system based on the Backson green palette.
- `script.js` - mobile navigation, appointment wizard, and WhatsApp deep-link generation.
- `assets/backson-logo-transparent.png` - transparent-background logo derived from the provided JPG.
- `assets/hero-clinic.png` - generated clinic reception hero image for the landing section.
- `schema/site-content.json` - structured clinic content and booking message template.

## Run locally

This is dependency-free. Open `index.html` directly in a browser, or serve the folder locally:

```powershell
python -m http.server 4173
```

Then visit `http://localhost:4173`.

## Clinic details

- Address: Tombwa, Rua Che Guevara, Namibe - Angola
- Phone: `+244 930 225 181`
- WhatsApp: `+244 930 225 191`
- Email: `clinicabeckson@gmail.com`, `consultoriobeckson@gmail.com`
- Hours: Monday-Friday `07:30 - 19:00`, Saturday `08:00 - 17:00`

## Notes

The booking flow does not store patient data. It builds a pre-filled WhatsApp message and opens the clinic's official WhatsApp link when the patient confirms.
