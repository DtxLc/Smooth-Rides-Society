// Main Js file

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
  // Add active class to current nav item
  const currentLocation = window.location.pathname
  const navLinks = document.querySelectorAll(".main-nav a")

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href")

    // Check if the current path starts with the link path (for nested routes)
    if (currentLocation === linkPath || (linkPath !== "/" && currentLocation.startsWith(linkPath))) {
      link.classList.add("active")
    }
  })

  // Auto-dismiss alerts after 5 seconds
  const alerts = document.querySelectorAll(".alert")
  if (alerts.length > 0) {
    setTimeout(() => {
      alerts.forEach((alert) => {
        alert.style.opacity = "0"
        setTimeout(() => {
          alert.style.display = "none"
        }, 300)
      })
    }, 5000)
  }
})
