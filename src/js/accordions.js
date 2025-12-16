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
  }

  // Loop through each accordion item and set it up
  loopItems() {
    let sections = this.accordion.querySelectorAll(".accordion-item");
    // Bail if no sections found
    if (sections.length === 0) return;

    let count = 0;
    sections.forEach((section) => {
      // If isCollapsedAtStart != false, we need to make sure the first item is open
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

    // Bail if missing heading or content
    if (!panelHeading || !panelContent) return;

    // Set the panel ID, this will forcibly override any existing ID on the content to ensure uniqueness based on the accordion index and panel index
    let panelId = `accordion-panel-${this.accordionIndex}-${index}`;
    panelContent.id = panelId;

    this.setupHeading(panelHeading, panelId, isCollapsedAtStart);
    this.setupContent(panelContent, panelId, isCollapsedAtStart);
  }

  // Setup the accordion heading
  setupHeading(heading, contentId, isCollapsedAtStart) {
    // Check if this heading already has a button?
    let button = heading.querySelector("button");
    if (!button) {
      // Create a button to wrap the heading content
      button = document.createElement("button");
      // Move existing heading content into button
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
  // Setup the accordion content
  setupContent(content, contentId, isCollapsedAtStart) {
    content.id = contentId;

    if (!isCollapsedAtStart) {
      content.removeAttribute("hidden");
    } else {
      content.setAttribute("hidden", "until-found");
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

    // If allowMultiple is false, close all other panels first
    if (!this.allowMultiple) {
      this.closeAllPanels(panelId); // Pass the current panel ID to exclude it
    }

    // Toggle the clicked panel
    if (isCurrentlyOpen) {
      this.closePanel(button, panel);
    } else {
      this.openPanel(button, panel);
    }
  }

  // Close all panels in this accordion except the specified one
  closeAllPanels(exceptPanelId = null) {
    const buttons = this.accordion.querySelectorAll(".accordion-button");
    buttons.forEach((button) => {
      const panelId = button.getAttribute("aria-controls");
      if (panelId !== exceptPanelId) {
        // Skip the panel we're opening
        const panel = document.getElementById(panelId);
        this.closePanel(button, panel);
      }
    });
  }

  // Close a specific panel
  closePanel(button, panel) {
    button.setAttribute("aria-expanded", "false");
    panel.setAttribute("hidden", "until-found");
  }

  // Open a specific panel
  openPanel(button, panel) {
    button.setAttribute("aria-expanded", "true");
    panel.removeAttribute("hidden");
  }
}

// Initialize all accordions on the page
document.addEventListener("DOMContentLoaded", function () {
  const accordionElements = document.querySelectorAll(".accordion");

  let count = 0;
  accordionElements.forEach((element) => {
    new jellyfishAccordion(element, count);
    count++;
  });
});
