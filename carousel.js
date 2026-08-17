(() => {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll(".slide")];
  const dots = [...carousel.querySelectorAll("[data-slide]")];
  const index = carousel.querySelector(".photo-index");
  const caption = carousel.querySelector(".photo-caption");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let active = 0;
  let paused = false;

  const select = (next) => {
    active = (next + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const selected = slideIndex === active;
      const image = slide.querySelector("img");
      slide.classList.toggle("is-active", selected);
      slide.setAttribute("aria-hidden", String(!selected));
      image.alt = selected ? image.dataset.alt || image.alt : "";
    });

    dots.forEach((dot, dotIndex) => {
      const selected = dotIndex === active;
      dot.classList.toggle("is-active", selected);
      if (selected) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });

    index.textContent = `${String(active + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    caption.textContent = slides[active].dataset.label;
  };

  carousel.querySelector('[data-direction="previous"]').addEventListener("click", () => select(active - 1));
  carousel.querySelector('[data-direction="next"]').addEventListener("click", () => select(active + 1));
  dots.forEach((dot) => dot.addEventListener("click", () => select(Number(dot.dataset.slide))));

  carousel.addEventListener("mouseenter", () => { paused = true; });
  carousel.addEventListener("mouseleave", () => { paused = false; });
  carousel.addEventListener("focusin", () => { paused = true; });
  carousel.addEventListener("focusout", () => { paused = false; });
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") select(active - 1);
    if (event.key === "ArrowRight") select(active + 1);
  });

  if (!reduceMotion) {
    window.setInterval(() => {
      if (!paused) select(active + 1);
    }, 5200);
  }
})();
