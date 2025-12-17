/**
 * Built in class for ARIA accessible accordions
 */
class jellyfishAccordion {
  constructor(element, index) {
    this.accordion = element;
    this.accordionIndex = index;
    this.allowMultiple = this.accordion.hasAttribute("data-allow-multiple");
    this.startCollapsed = this.accordion.hasAttribute("data-start-collapsed");

    this.init();
  }

  init() {
    this.accordion.removeAttribute("data-start-collapsed");
    this.loopItems();
    this.setupEventListeners();
    this.setupResizeHandler();
  }

  setupResizeHandler() {
    jfDebounce("resize", () => this.updateOpenPanelHeights(), 150);
  }

  updateOpenPanelHeights() {
    const openPanels = this.accordion.querySelectorAll(
      ".accordion-panel:not(.is-collapsed)"
    );

    if (openPanels.length === 0) return;

    openPanels.forEach((panel) => {
      panel.style.transition = "none";
      panel.style.setProperty("--accordion-max-height", "none");

      const fullHeight = panel.offsetHeight;
      panel.style.setProperty("--accordion-max-height", `${fullHeight}px`);

      // Force reflow and re-enable transitions to ensure smoothness
      panel.offsetHeight;
      panel.style.transition = "";
    });
  }

  loopItems() {
    let sections = this.accordion.querySelectorAll(".accordion-item");
    if (sections.length === 0) return;

    let count = 0;
    sections.forEach((section) => {
      let panelIsCollapsed = true;
      if (!this.startCollapsed && count === 0) {
        panelIsCollapsed = false;
      }

      this.createPanel(section, count, panelIsCollapsed);
      count++;
    });
  }

  // Create the ARIA accessible panel
  createPanel(section, index, isCollapsedAtStart) {
    let panelHeading = section.querySelector(".accordion-heading");
    let panelContent = section.querySelector(".accordion-panel");

    if (!panelHeading || !panelContent) return;

    // Set the panel ID, this will forcibly override any existing ID on the content to ensure uniqueness based on the accordion index and panel index
    let panelId = `accordion-panel-${this.accordionIndex}-${index}`;
    panelContent.id = panelId;

    this.setupHeading(panelHeading, panelId, isCollapsedAtStart);
    this.setupContent(panelContent, panelId, isCollapsedAtStart);
  }

  // Setup the accordion heading
  setupHeading(heading, contentId, isCollapsedAtStart) {
    let button = heading.querySelector("button");
    if (!button) {
      button = document.createElement("button");
      while (heading.firstChild) {
        button.appendChild(heading.firstChild);
      }
      heading.appendChild(button);
    }

    // In all instances, check that the button has the correct class and attributes
    button.classList.add("accordion-button");
    button.setAttribute("aria-expanded", isCollapsedAtStart ? "false" : "true");
    button.setAttribute("aria-controls", contentId);
    button.type = "button";
    button.id = contentId.replace("panel", "heading");
  }

  // Setup the accordion content
  setupContent(content, contentId, isCollapsedAtStart) {
    content.id = contentId;

    if (!isCollapsedAtStart) {
      content.classList.remove("is-collapsed");
    } else {
      content.classList.add("is-collapsed");
    }

    content.setAttribute("role", "region");
    content.setAttribute(
      "aria-labelledby",
      contentId.replace("panel", "heading")
    );
  }

  // Setup event listeners for all buttons
  setupEventListeners() {
    const buttons = this.accordion.querySelectorAll(".accordion-button");
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => this.handleClick(e));
    });
  }

  // Handle button click
  handleClick(event) {
    const button = event.currentTarget;
    const panelId = button.getAttribute("aria-controls");
    const panel = document.getElementById(panelId);
    const isCurrentlyOpen = button.getAttribute("aria-expanded") === "true";

    if (!this.allowMultiple) {
      this.closeAllPanels(panelId);
    }

    if (isCurrentlyOpen) {
      this.closePanel(button, panel);
    } else {
      this.openPanel(button, panel);
    }
  }

  closeAllPanels(exceptPanelId = null) {
    const buttons = this.accordion.querySelectorAll(".accordion-button");
    buttons.forEach((button) => {
      const panelId = button.getAttribute("aria-controls");
      if (panelId !== exceptPanelId) {
        const panel = document.getElementById(panelId);
        this.closePanel(button, panel);
      }
    });
  }

  closePanel(button, panel) {
    button.setAttribute("aria-expanded", "false");
    panel.classList.add("is-collapsed");
  }

  openPanel(button, panel) {
    button.setAttribute("aria-expanded", "true");

    panel.style.transition = "none";
    panel.classList.remove("is-collapsed");

    const fullHeight = panel.offsetHeight;
    panel.classList.add("is-collapsed");
    panel.offsetHeight;
    panel.style.transition = "";
    panel.style.setProperty("--accordion-max-height", `${fullHeight}px`);
    requestAnimationFrame(() => {
      panel.classList.remove("is-collapsed");
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const accordionElements = document.querySelectorAll(".accordion");

  let count = 0;
  accordionElements.forEach((element) => {
    new jellyfishAccordion(element, count);
    count++;
  });
});
