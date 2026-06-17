const WHATSAPP_NUMBER = "244930225191";

const defaultMessage =
  "Olá, Clínica Backson. Gostaria de pedir informações sobre consultas.";

const bookingState = {
  step: 1,
  service: "",
  date: "",
  time: "",
  patientName: "",
  patientPhone: "",
  notes: "",
};

const form = document.querySelector("#booking-form");
const message = document.querySelector("#form-message");
const prevButton = document.querySelector("#prev-step");
const nextButton = document.querySelector("#next-step");
const confirmLink = document.querySelector("#whatsapp-confirm");
const dateInput = document.querySelector("#appointment-date");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

function buildWhatsAppUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function setDefaultWhatsAppLinks() {
  document.querySelectorAll("[data-whatsapp-default]").forEach((link) => {
    link.href = buildWhatsAppUrl(defaultMessage);
  });
}

function localDateValue(date) {
  const copy = new Date(date);
  copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
  return copy.toISOString().slice(0, 10);
}

function setInitialDate() {
  if (!dateInput) return;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  dateInput.min = localDateValue(today);
  dateInput.value = localDateValue(tomorrow);
  bookingState.date = dateInput.value;
}

function selectedServiceInput() {
  return form?.querySelector('input[name="service"]:checked');
}

function formatDate(dateValue) {
  if (!dateValue) return "-";
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-AO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function collectState() {
  if (!form) return;
  const data = new FormData(form);
  bookingState.service = data.get("service")?.toString() || "";
  bookingState.date = data.get("date")?.toString() || "";
  bookingState.patientName = data.get("patientName")?.toString().trim() || "";
  bookingState.patientPhone = data.get("patientPhone")?.toString().trim() || "";
  bookingState.notes = data.get("notes")?.toString().trim() || "";
}

function showMessage(text = "") {
  if (message) message.textContent = text;
}

function validateStep(step) {
  collectState();

  if (step === 1 && !bookingState.service) {
    showMessage("Escolha um serviço para continuar.");
    return false;
  }

  if (step === 2) {
    if (!bookingState.date) {
      showMessage("Escolha a data preferida.");
      return false;
    }
    if (!bookingState.time) {
      showMessage("Escolha um horário preferido.");
      return false;
    }
  }

  if (step === 3) {
    if (bookingState.patientName.length < 3) {
      showMessage("Preencha o nome completo.");
      return false;
    }
    if (bookingState.patientPhone.length < 7) {
      showMessage("Preencha um número de telemóvel válido.");
      return false;
    }
  }

  showMessage("");
  return true;
}

function buildBookingMessage() {
  const notes = bookingState.notes || "Sem notas adicionais";
  return [
    "Olá, Clínica Backson!",
    "",
    "Gostaria de marcar uma consulta com os seguintes detalhes:",
    `Serviço: ${bookingState.service}`,
    `Data: ${formatDate(bookingState.date)}`,
    `Hora: ${bookingState.time}`,
    `Nome: ${bookingState.patientName}`,
    `Telefone: ${bookingState.patientPhone}`,
    `Notas: ${notes}`,
    "",
    "Por favor, confirme a disponibilidade. Obrigado/a!",
  ].join("\n");
}

function updateReview() {
  collectState();
  const values = {
    service: bookingState.service || "-",
    datetime:
      bookingState.date && bookingState.time
        ? `${formatDate(bookingState.date)}, ${bookingState.time}`
        : "-",
    patient: bookingState.patientName || "-",
    phone: bookingState.patientPhone || "-",
    notes: bookingState.notes || "Sem notas adicionais",
  };

  Object.entries(values).forEach(([key, value]) => {
    const node = document.querySelector(`[data-review="${key}"]`);
    if (node) node.textContent = value;
  });

  if (confirmLink) {
    confirmLink.href = buildWhatsAppUrl(buildBookingMessage());
  }
}

function updateWizard() {
  document.querySelectorAll(".booking-step").forEach((step) => {
    step.classList.toggle("is-active", Number(step.dataset.step) === bookingState.step);
  });

  document.querySelectorAll("[data-progress-step]").forEach((step) => {
    const stepNumber = Number(step.dataset.progressStep);
    step.classList.toggle("is-active", stepNumber === bookingState.step);
    step.classList.toggle("is-complete", stepNumber < bookingState.step);
  });

  if (prevButton) {
    prevButton.style.visibility = bookingState.step === 1 ? "hidden" : "visible";
  }

  if (nextButton) {
    nextButton.hidden = bookingState.step === 4;
  }

  document.querySelector(".wizard-actions")?.classList.toggle("is-review", bookingState.step === 4);

  if (bookingState.step === 4) {
    updateReview();
  }
}

function goToStep(step) {
  bookingState.step = Math.min(Math.max(step, 1), 4);
  updateWizard();
  form?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function bindWizard() {
  if (!form) return;

  prevButton?.addEventListener("click", () => {
    showMessage("");
    goToStep(bookingState.step - 1);
  });

  nextButton?.addEventListener("click", () => {
    if (validateStep(bookingState.step)) {
      goToStep(bookingState.step + 1);
    }
  });

  form.querySelectorAll("[data-time]").forEach((button) => {
    button.addEventListener("click", () => {
      bookingState.time = button.dataset.time || "";
      form.querySelectorAll("[data-time]").forEach((slot) => {
        slot.classList.toggle("is-selected", slot === button);
      });
      showMessage("");
    });
  });

  form.addEventListener("change", () => {
    collectState();
    showMessage("");
  });

  document.querySelectorAll("[data-book-service]").forEach((link) => {
    link.addEventListener("click", () => {
      const service = link.dataset.bookService;
      const input = form.querySelector(`input[name="service"][value="${CSS.escape(service)}"]`);
      if (input) {
        input.checked = true;
        bookingState.service = service;
        bookingState.step = 1;
        updateWizard();
      }
    });
  });
}

function bindMobileNav() {
  if (!menuToggle || !primaryNav) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    document.body.classList.toggle("nav-open", !isOpen);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    });
  });
}

function bindHeaderState() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const setScrolled = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });
}

setDefaultWhatsAppLinks();
setInitialDate();
bindWizard();
bindMobileNav();
bindHeaderState();
updateWizard();
