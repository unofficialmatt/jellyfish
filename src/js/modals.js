class jellyfishModals {
  constructor() {
    this.currentModalId = null;
    this.modalTimer = 0;
    this.modalInterval = null;
    // Snapshot of timeOpen per dialog, taken at the moment we call
    // dialog.close() - the native "close" event fires as a queued task, not
    // synchronously, so by the time it fires, a group-navigation openModal()
    // may already have reset this.modalTimer for the *next* modal.
    this.modalTimeOpenByDialog = new WeakMap();

    // Bind the method to the class as it wasn't working otherwise
    this.incrementTimer = this.incrementTimer.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
  }

  /**
   * Increments the this.modalTimer by 1 every second.
   * @returns {void}
   */
  incrementTimer() {
    this.modalTimer += 1;
  }

  /**
   * Resolves a modal's title, in priority order:
   * 1. A `data-title` attribute on the modal
   * 2. The first heading (h1-h6) found in the modal
   * 3. The first non-empty text content found in the modal
   * @param {HTMLElement} dialog - The modal element.
   * @returns {string} - The modal's title, or an empty string if none of the above is available.
   */
  getModalTitle(dialog) {
    if (dialog.dataset.title) return dialog.dataset.title.trim();

    const heading = dialog.querySelector("h1, h2, h3, h4, h5, h6");
    if (heading && heading.textContent.trim()) return heading.textContent.trim();

    const textElements = dialog.querySelectorAll(
      "p, li, span, blockquote, dd, dt, td, th",
    );
    for (const textElement of textElements) {
      const text = textElement.textContent.trim();
      if (text) return text;
    }

    return "";
  }

  /**
   * Toggles the visibility of a modal.
   * @param {string} id - The ID of the modal to toggle.
   * @param {boolean} closeCurrent - Whether to close the current modal before opening the new one.
   * @returns {void}
   */
  toggleModal(id, closeCurrent = false) {
    // Captured before closeModal() runs below: closeModal() no longer resets
    // this.currentModalId synchronously (the dialog's native "close" event is
    // a queued task, not synchronous), so checking it *after* would see stale
    // state when id is the modal currently open (eg. a single-item
    // data-modalgroup, whose own prev/next arrow targets itself).
    const wasAlreadyOpen = this.currentModalId === id;

    if (closeCurrent) {
      this.closeModal();
    }

    const dialog = document.getElementById(id);

    if (dialog) {
      if (wasAlreadyOpen && !closeCurrent) {
        this.closeModal();
      } else {
        // Either it wasn't already open, or closeCurrent already closed it
        // above (eg. navigating a single-item group back to itself) - (re)open it.
        this.openModal(id);
      }
    }
  }

  /**
   * Closes the currently open modal via the native dialog.close(), which
   * fires the dialog's "close" event where the actual cleanup happens - this
   * keeps state in sync even when the dialog is closed natively (Esc, or a
   * form method="dialog" submit) rather than through this method.
   * @returns {void}
   */
  closeModal() {
    const dialog = document.getElementById(this.currentModalId);

    if (dialog && dialog.open) {
      this.modalTimeOpenByDialog.set(dialog, this.modalTimer);
      dialog.close();
    }
  }

  /**
   * Cleans up state and fires analytics/events whenever a dialog closes,
   * regardless of how it closed (this.closeModal(), native Esc, or a
   * form method="dialog" submit).
   * @param {Event} event - The dialog's native "close" event.
   * @returns {void}
   */
  handleDialogClose(event) {
    const dialog = event.target;
    const closedModalId = dialog.id;

    // Fall back to this.modalTimer for closes that didn't go through
    // this.closeModal() (eg. a form method="dialog" submit)
    const timeOpen = this.modalTimeOpenByDialog.has(dialog)
      ? this.modalTimeOpenByDialog.get(dialog)
      : this.modalTimer;
    this.modalTimeOpenByDialog.delete(dialog);

    const modalTitle = this.getModalTitle(dialog);

    // Fire an event jfModalClosed
    const closeEvent = new CustomEvent("jfModalClosed", {
      detail: {
        closedModalId,
      },
    });
    document.dispatchEvent(closeEvent);

    // Dispatch an Event to the DataLayer
    window.dataLayer = window.dataLayer || [];

    dataLayer.push({
      event: "modalClosed",
      modalId: "#" + closedModalId,
      modalTitle,
      timeOpen,
    });

    // Guard this against group navigation: openModal() for the next modal
    // runs synchronously before this queued "close" event fires, so by the
    // time we get here this.currentModalId/this.modalInterval may already
    // belong to the *next* modal - clearing them unconditionally would kill
    // its freshly-started timer instead of this (already-closed) one's.
    if (this.currentModalId === closedModalId) {
      this.currentModalId = null;

      if (this.modalInterval) {
        clearInterval(this.modalInterval);
        this.modalInterval = null;
      }

      // Same guard: don't strip this off <body> if a newer modal (opened
      // synchronously before this event fired) is the reason it's still set
      document.body.classList.remove("has-open-modal");
    }
  }

  /**
   * Closes the modal if the user clicks on the backdrop (outside the
   * dialog's content box).
   * @param {MouseEvent} event - The dialog's click event.
   * @returns {void}
   */
  handleBackdropClick(event) {
    const dialog = event.currentTarget;
    const dialogDimensions = dialog.getBoundingClientRect();

    const isOutsideDialogBox =
      event.clientX < dialogDimensions.left ||
      event.clientX > dialogDimensions.right ||
      event.clientY < dialogDimensions.top ||
      event.clientY > dialogDimensions.bottom;

    // event.target === dialog confirms this is really a backdrop click, not
    // a native form control (eg. a <select> dropdown in Firefox) reporting
    // click coordinates outside the dialog's box for its own internal
    // reasons - a real backdrop click always has the dialog itself as the
    // target, since ::backdrop isn't a hit-testable DOM node.
    if (isOutsideDialogBox && event.target === dialog) {
      this.closeModal();
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

      const { prevModalId, nextModalId } = this.getModalGroupNeighbours(dialog);

      // Fire an event jfModalOpened
      const event = new CustomEvent("jfModalOpened", {
        detail: {
          newModalId: id,
          prevModalId,
          nextModalId,
        },
      });
      document.dispatchEvent(event);

      // Scroll to the top of the .modal-content element if it exists
      if (dialog.querySelector(".modal-content"))
        dialog.querySelector(".modal-content").scrollTo(0, 0);

      // Attach the backdrop-click and native close listeners once per dialog,
      // not on every open
      if (!dialog.dataset.jfModalInitialized) {
        dialog.addEventListener("click", this.handleBackdropClick);
        dialog.addEventListener("close", this.handleDialogClose);
        dialog.dataset.jfModalInitialized = "true";
      }

      // Append navigation arrows and close button if it's a .modal element
      if (dialog.classList.contains("modal")) {
        this.initializeModalGroup(dialog);
        this.appendCloseButton(dialog);
      }

      // Dispatch an Event to the DataLayer
      window.dataLayer = window.dataLayer || [];

      dataLayer.push({
        event: "modalOpened",
        modalId: "#" + id,
        modalTitle: this.getModalTitle(dialog),
      });

      // Add has-open-modal class to body
      if (!document.body.classList.contains("has-open-modal")) {
        document.body.classList.add("has-open-modal");
      }
    }
  }

  /**
   * Finds the previous/next sibling modal IDs for a modal in a data-modalgroup,
   * using the same wrap-around logic as appendArrows.
   * @param {HTMLElement} dialog - The modal element.
   * @returns {{prevModalId: string|null, nextModalId: string|null}}
   */
  getModalGroupNeighbours(dialog) {
    const modalGroup = dialog.dataset.modalgroup;

    if (!modalGroup) {
      return { prevModalId: null, nextModalId: null };
    }

    const groupElements = Array.from(
      document.querySelectorAll(`[data-modalgroup="${modalGroup}"]`),
    );
    const index = groupElements.indexOf(dialog);

    if (index === -1) {
      return { prevModalId: null, nextModalId: null };
    }

    const prevModalId =
      groupElements[index === 0 ? groupElements.length - 1 : index - 1].id;
    const nextModalId =
      groupElements[index === groupElements.length - 1 ? 0 : index + 1].id;

    return { prevModalId, nextModalId };
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
      `[data-modalgroup="${modalGroup}"]`,
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
      closeButton.setAttribute("type", "button"); // Prevent submitting a form method="dialog" the modal may contain
      closeButton.setAttribute("aria-label", "Close");
      closeButton.setAttribute("title", "Close this modal");
      closeButton.addEventListener("click", this.closeModal);
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
      "Previous",
      "Previous (Left arrow key)",
      prevLink.id,
    );
    prevButton.classList.add("modal-navigation--prev");
    wrapper.appendChild(prevButton);

    // Create the next button
    const nextLink =
      modalGroup[index === modalGroup.length - 1 ? 0 : index + 1];
    const nextButton = this.createArrow(
      "Next",
      "Next (Right arrow key)",
      nextLink.id,
    );
    nextButton.classList.add("modal-navigation--next");
    wrapper.appendChild(nextButton);

    // Append the wrapper to the modal
    element.appendChild(wrapper);
  }

  /**
   * Creates a navigation button that toggles to the given target modal.
   * @param {string} ariaLabel - The accessible name of the button.
   * @param {string} title - The title/tooltip text of the button.
   * @param {string} targetId - The ID of the modal to toggle to on click.
   * @returns {HTMLButtonElement} - The created button element.
   */
  createArrow(ariaLabel, title, targetId) {
    const button = document.createElement("button");
    button.classList.add("modal-navigation-button");
    button.setAttribute("type", "button"); // Prevent submitting a form method="dialog" the modal may contain
    button.setAttribute("aria-label", ariaLabel);
    button.setAttribute("title", title);
    button.addEventListener("click", () => this.toggleModal(targetId, true));
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

    // Don't hijack arrow keys while the user is interacting with a form control
    if (
      (event.key === "ArrowLeft" || event.key === "ArrowRight") &&
      event.target.closest("input, textarea, select, [contenteditable]")
    ) {
      return;
    }

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
  modalManager.handleKeyDown(event),
);
