import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["tabButton", "tabContent"];

  connect() {
    console.log("Tabs controller connected");

    // Activate the first tab by default
    this.activateTab(this.tabButtonTargets[0]);
  }

  activateTab(button) {
    const targetId = button.dataset.tab;

    // Deactivate all tabs
    this.tabButtonTargets.forEach((btn) => {
      btn.classList.remove("active");
    });
    this.tabContentTargets.forEach((content) => {
      content.hidden = content.id !== targetId;
    });

    // Activate the clicked tab
    button.classList.add("active");
  }

  changeTab(event) {
    const button = event.currentTarget;
    this.activateTab(button);
  }
}
