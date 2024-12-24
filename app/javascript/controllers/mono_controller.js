import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["debugToggle"];

  connect() {
    console.log("Mono controller connected");

    // Adjust media padding on load and resize
    this.adjustMediaPadding();
    window.addEventListener("load", this.adjustMediaPadding.bind(this));
    window.addEventListener("resize", this.adjustMediaPadding.bind(this));

    // Handle debug toggle if the target exists
    if (this.hasDebugToggleTarget) {
      this.debugToggleTarget.addEventListener(
        "change",
        this.onDebugToggle.bind(this)
      );
      this.onDebugToggle(); // Initialize the debug mode
    }
  }

  disconnect() {
    // Clean up event listeners
    window.removeEventListener("load", this.adjustMediaPadding.bind(this));
    window.removeEventListener("resize", this.adjustMediaPadding.bind(this));

    if (this.hasDebugToggleTarget) {
      this.debugToggleTarget.removeEventListener(
        "change",
        this.onDebugToggle.bind(this)
      );
    }
  }

  gridCellDimensions() {
    const element = document.createElement("div");
    element.style.position = "fixed";
    element.style.height = "var(--line-height)";
    element.style.width = "1ch";
    document.body.appendChild(element);
    const rect = element.getBoundingClientRect();
    document.body.removeChild(element);
    return { width: rect.width, height: rect.height };
  }

  adjustMediaPadding() {
    const cell = this.gridCellDimensions();

    const setHeightFromRatio = (media, ratio) => {
      const rect = media.getBoundingClientRect();
      const realHeight = rect.width / ratio;
      const diff = cell.height - (realHeight % cell.height);
      media.style.setProperty("padding-bottom", `${diff}px`);
    };

    const setFallbackHeight = (media) => {
      const rect = media.getBoundingClientRect();
      const height = Math.round(rect.width / 2 / cell.height) * cell.height;
      media.style.setProperty("height", `${height}px`);
    };

    const onMediaLoaded = (media) => {
      let width, height;
      switch (media.tagName) {
        case "IMG":
          width = media.naturalWidth;
          height = media.naturalHeight;
          break;
        case "VIDEO":
          width = media.videoWidth;
          height = media.videoHeight;
          break;
      }
      if (width > 0 && height > 0) {
        setHeightFromRatio(media, width / height);
      } else {
        setFallbackHeight(media);
      }
    };

    const medias = document.querySelectorAll("img, video");
    medias.forEach((media) => {
      if (media.tagName === "IMG") {
        if (media.complete) {
          onMediaLoaded(media);
        } else {
          media.addEventListener("load", () => onMediaLoaded(media));
          media.addEventListener("error", () => setFallbackHeight(media));
        }
      } else if (media.tagName === "VIDEO") {
        switch (media.readyState) {
          case HTMLMediaElement.HAVE_CURRENT_DATA:
          case HTMLMediaElement.HAVE_FUTURE_DATA:
          case HTMLMediaElement.HAVE_ENOUGH_DATA:
            onMediaLoaded(media);
            break;
          default:
            media.addEventListener("loadeddata", () => onMediaLoaded(media));
            media.addEventListener("error", () => setFallbackHeight(media));
            break;
        }
      }
    });
  }

  checkOffsets() {
    const ignoredTagNames = new Set([
      "THEAD",
      "TBODY",
      "TFOOT",
      "TR",
      "TD",
      "TH",
    ]);
    const cell = this.gridCellDimensions();
    const elements = document.querySelectorAll(
      "body :not(.debug-grid, .debug-toggle)"
    );

    elements.forEach((element) => {
      if (ignoredTagNames.has(element.tagName)) return;

      const rect = element.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;

      const top = rect.top + window.scrollY;
      const offset = top % (cell.height / 2);
      if (offset > 0) {
        element.classList.add("off-grid");
        console.error(
          "Incorrect vertical offset for",
          element,
          "with remainder",
          top % cell.height,
          "when expecting divisible by",
          cell.height / 2
        );
      } else {
        element.classList.remove("off-grid");
      }
    });
  }

  onDebugToggle() {
    document.body.classList.toggle("debug", this.debugToggleTarget.checked);
  }
}
