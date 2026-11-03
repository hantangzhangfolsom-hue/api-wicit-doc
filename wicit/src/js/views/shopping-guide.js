import { t } from "../i18n/index.js";
import { apiUrl } from "../lib/config.js";
import { escapeHtml } from "../lib/utility.js";

const GUIDE_SLUGS = ["milk", "infant-fruits"];

function renderList(items = []) {
  if (!items.length) return "";

  return `<ul>${items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("")}</ul>`;
}

function safeUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function renderImages(images = []) {
  return images
    .filter((image) => safeUrl(image.url))
    .map((image) => `
      <img
        src="${escapeHtml(safeUrl(image.url))}"
        alt="${escapeHtml(image.alt ?? "")}"
        width="180"
        loading="lazy"
        style="max-width: 100%; height: auto;"
      />
    `)
    .join("");
}

function renderBrands(brands = []) {
  if (!brands.length) return "";

  const cards = brands
    .map((brand) => {
      const logoUrl = safeUrl(brand.logoUrl);

      return `
        <figure style="margin: 0; padding: 12px; width: 180px;">
          ${
            logoUrl
              ? `<img
                  src="${escapeHtml(logoUrl)}"
                  alt="${escapeHtml(brand.name)} logo"
                  loading="lazy"
                  style="max-width: 150px; height: 80px; object-fit: contain;"
                />`
              : ""
          }
          <figcaption>${escapeHtml(brand.name)}</figcaption>
        </figure>
      `;
    })
    .join("");

  return `
    <div style="display: flex; flex-wrap: wrap; gap: 12px;">
      ${cards}
    </div>
  `;
}

function renderGuide(guide) {
  const conditional = guide.conditionalPurchases;

  return `
    <hr />
    <h3>${escapeHtml(guide.name)} — ${t("shoppingGuide.title")}</h3>
    ${renderImages(guide.images)}

    <h4>${t("shoppingGuide.canBuy")}</h4>
    <p>${escapeHtml(guide.canBuy.description)}</p>
    ${renderList(guide.canBuy.items)}
    ${renderBrands(guide.brands)}

    ${
      conditional
        ? `
          <h4>${t("shoppingGuide.conditionalPurchases")}</h4>
          <p>${escapeHtml(conditional.condition)}</p>
          ${renderList(conditional.items)}
        `
        : ""
    }

    <h4>${t("shoppingGuide.cannotBuy")}</h4>
    ${renderList(guide.cannotBuy)}

    ${
      guide.helpfulHints
        ? `
          <h4>${t("shoppingGuide.helpfulHints")}</h4>
          <p>${escapeHtml(guide.helpfulHints.description)}</p>
          ${renderList(guide.helpfulHints.items)}
          <p><strong>${escapeHtml(guide.helpfulHints.note)}</strong></p>
        `
        : ""
    }

    <p>
      <a
        href="${escapeHtml(safeUrl(guide.sourceUrl))}"
        target="_blank"
        rel="noopener noreferrer"
      >${t("shoppingGuide.source")}</a>
    </p>
    <p>
      ${t("shoppingGuide.updated")}
      ${escapeHtml(guide.sourceLastUpdated)}
    </p>
  `;
}

export function ShoppingGuideView() {
  return `
    <div id="shopping-guide">
      ${GUIDE_SLUGS.map((slug) => `
        <section
          id="shopping-guide-${slug}"
          lang="en"
          aria-live="polite"
        >
          <p>${t("shoppingGuide.loading")}</p>
        </section>
      `).join("")}
    </div>
  `;
}

async function loadGuide(slug) {
  const container = document.querySelector(`#shopping-guide-${slug}`);
  if (!container) return;

  try {
    const response = await fetch(
      apiUrl(`/api/shopping-guide/${encodeURIComponent(slug)}`),
      {
        headers: { Accept: "application/json" },
      },
    );

    if (!response.ok) {
      throw new Error(`Shopping guide request failed: ${response.status}`);
    }

    const guide = await response.json();
    container.innerHTML = renderGuide(guide);
  } catch (error) {
    console.error(`Shopping guide failed for ${slug}:`, error);
    container.innerHTML = `
      <p role="alert">${t("shoppingGuide.error")}</p>
    `;
  }
}

export async function initShoppingGuide() {
  await Promise.all(GUIDE_SLUGS.map(loadGuide));
}