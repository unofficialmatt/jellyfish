class jellyfishModals {
  constructor() {
    this.currentModalId = null;
    this.modalTimer = 0;
    this.modalInterval = null;

    // Bind the method to the class as it wasn't working otherwise
    this.incrementTimer = this.incrementTimer.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  /**
   * Increments the this.modalTimer by 1 every second.
   * @returns {void}
   */
  incrementTimer() {
    this.modalTimer += 1;
  }

  /**
   * Toggles the visibility of a modal.
   * @param {string} id - The ID of the modal to toggle.
   * @param {boolean} closeCurrent - Whether to close the current modal before opening the new one.
   * @returns {void}
   */
  toggleModal(id, closeCurrent = false) {
    if (closeCurrent) {
      this.closeModal();
    }

    const dialog = document.getElementById(id);

    if (dialog) {
      if (this.currentModalId === id) {
        this.closeModal();
      } else {
        this.openModal(id);
      }
    }
  }

  /**
   * Closes the currently open modal.
   * @returns {void}
   */
  closeModal() {
    const dialog = document.getElementById(this.currentModalId);

    if (dialog) {
      dialog.close();

      // Fire an event jfModalClosed
      const event = new CustomEvent("jfModalClosed", {
        detail: {
          closedModalId: this.currentModalId,
        },
      });
      document.dispatchEvent(event);

      // Dispatch an Event to the DataLayer
      window.dataLayer = window.dataLayer || [];

      dataLayer.push({
        event: "modalClosed",
        modalId: "#" + this.currentModalId,
        timeOpen: this.modalTimer,
      });

      this.currentModalId = null;

      if (document.body.classList.contains("has-open-modal")) {
        document.body.classList.remove("has-open-modal");
      }
    }
  }

  /**
   * Opens a modal with the specified ID.
   * @param {string} id - The ID of the modal to open.
   * @param {boolean} closeCurrent - Whether to close the current modal before opening the new one.
   * @returns {void}
   */
  openModal(id, closeCurrent = false) {
    if (closeCurrent) {
      this.closeModal();
    }

    const dialog = document.getElementById(id);

    if (dialog) {
      dialog.showModal();
      this.currentModalId = id;

      // Clear the previous interval if it exists
      this.modalTimer = 0;
      if (this.modalInterval) {
        clearInterval(this.modalInterval);
      }
      this.modalInterval = setInterval(this.incrementTimer, 1000);

      // Fire an event jfModalOpened
      const event = new CustomEvent("jfModalOpened", {
        detail: {
          newModalId: id,
        },
      });
      document.dispatchEvent(event);

      // Scroll to the top of the .modal-content element
      dialog.querySelector(".modal-content").scrollTo(0, 0);

      // Close Modal if user clicks on the overlay
      dialog.addEventListener("click", (e) => {
        const dialogDimensions = dialog.getBoundingClientRect();
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          // Get e.target
          const target = e.target;
          // If e.target is not a button, close the modal
          if (target.tagName !== "BUTTON") {
            this.closeModal();
          }
        }
      });

      // Append navigation arrows and close button
      this.initializeModalGroup(dialog);
      this.appendCloseButton(dialog);

      // Dispatch an Event to the DataLayer
      window.dataLayer = window.dataLayer || [];

      dataLayer.push({
        event: "modalOpened",
        modalId: "#" + id,
      });

      // Add has-open-modal class to body
      if (!document.body.classList.contains("has-open-modal")) {
        document.body.classList.add("has-open-modal");
      }
    }
  }

  /**
   * Appends navigation arrows to all modals in the same group as the given element.
   * @param {HTMLElement} element - The modal element.
   * @returns {void}
   */
  initializeModalGroup(element) {
    const modalGroup = element.dataset.modalgroup;

    // If the modal does not belong to a group, or it already has navigation arrows, return
    if (!modalGroup || element.querySelector(".modal-navigation")) {
      return;
    }

    const groupElements = document.querySelectorAll(
      `[data-modalgroup="${modalGroup}"]`
    );

    // Append navigation arrows to each element in the group
    groupElements.forEach((groupElement, index) => {
      this.appendArrows(groupElement, index, groupElements);
    });
  }
  /**
   * Appends a close button to a modal if one does not already exist.
   * This is triggered on the modalOpen element, so that if modals are added dynamically, they will still have a close button.
   * @param {HTMLElement} element - The modal to append a close button to.
   * @returns {void}
   */
  appendCloseButton(element) {
    if (!element.querySelector(".modal-close")) {
      const closeButton = document.createElement("button");
      closeButton.classList.add("modal-close");
      closeButton.addEventListener("click", this.closeModal);
      closeButton.setAttribute("title", "Close this modal");
      element.append(closeButton);
    }
  }

  /**
   * Appends navigation arrows to a modal if it belongs to a group.
   * @param {HTMLElement} element - The modal to append navigation arrows to.
   * @param {number} index - The index of the modal in the group.
   * @param {NodeList} modalGroup - The group of modals.
   * @returns {void}
   */
  appendArrows(element, index, modalGroup) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("modal-navigation");

    // Create the previous button
    const prevLink =
      modalGroup[index === 0 ? modalGroup.length - 1 : index - 1];
    const prevButton = this.createArrow(
      "Previous (Left arrow key)",
      `toggleModal('${prevLink.id}', true);`
    );
    prevButton.classList.add("modal-navigation--prev");
    wrapper.appendChild(prevButton);

    // Create the next button
    const nextLink =
      modalGroup[index === modalGroup.length - 1 ? 0 : index + 1];
    const nextButton = this.createArrow(
      "Next (Right arrow key)",
      `toggleModal('${nextLink.id}', true);`
    );
    nextButton.classList.add("modal-navigation--next");
    wrapper.appendChild(nextButton);

    // Append the wrapper to the modal
    element.appendChild(wrapper);
  }

  /**
   * Creates a navigation button with the specified label and onclick attribute.
   * @param {string} label - The label of the button.
   * @param {string} onclick - The onclick attribute value.
   * @returns {HTMLButtonElement} - The created button element.
   */
  createArrow(label, onclick) {
    const button = document.createElement("button");
    button.classList.add("modal-navigation-button");
    button.setAttribute("onclick", onclick);
    button.setAttribute("title", label);
    return button;
  }

  /**
   * Handles keyDown events
   * @param {object} event - The event object.
   * @returns
   */
  handleKeyDown(event) {
    // Return if there is no open modal
    if (!this.currentModalId) return;

    if (event.repeat) return; // Prevents the event from firing multiple times if the user holds down the key

    if (event.key === "Escape" && this.currentModalId) {
      this.closeModal();
    } else if (event.key === "ArrowLeft" && this.currentModalId) {
      const dialog = document.getElementById(this.currentModalId);
      if (dialog) {
        // Find if it has a .modal-navigation--prev button
        const prevButton = dialog.querySelector(".modal-navigation--prev");
        if (prevButton) {
          prevButton.click();
        }
      }
    } else if (event.key === "ArrowRight" && this.currentModalId) {
      const dialog = document.getElementById(this.currentModalId);
      if (dialog) {
        // Find if it has a .modal-navigation--next button
        const nextButton = dialog.querySelector(".modal-navigation--next");
        if (nextButton) {
          nextButton.click();
        }
      }
    }
  }
}

// Initialize the class
const modalManager = new jellyfishModals();

// Expose toggleModal outside the class
const toggleModal = (id, closeCurrent) =>
  modalManager.toggleModal(id, closeCurrent);

// Add eventListener for keydown
document.addEventListener("keydown", (event) =>
  modalManager.handleKeyDown(event)
);

// TODO: Test that GTag events are firing correctly when modals are opened and closed
