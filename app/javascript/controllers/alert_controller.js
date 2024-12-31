import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="alert"
export default class extends Controller {
  static targets = ["alert"];

  connect() {
    console.log("Alert controller connected");

    // Automatically close the alert after 5 seconds
    this.autoDismiss();
  }

  autoDismiss() {
    setTimeout(() => {
      this.close();
    }, 2000); // 2 seconds
  }

  close() {
    this.element.style.transition = "opacity 0.3s ease";
    this.element.style.opacity = "0";

    setTimeout(() => {
      this.element.remove();
    }, 300); // Matches the transition duration
  }
}
