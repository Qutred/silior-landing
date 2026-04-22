// Initialize AOS Animation
AOS.init({
  duration: 1000,
  once: true,
});

// Sticky Header Logic
window.addEventListener('scroll', function () {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Accordion (FAQ) Logic
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach((item) => {
  item.addEventListener('click', function () {
    const body = this.querySelector('.accordion-body');
    const isOpen = body.style.display === 'block';

    // Close all other items
    accordionItems.forEach((otherItem) => {
      otherItem.querySelector('.accordion-body').style.display = 'none';
    });

    // Toggle current item
    body.style.display = isOpen ? 'none' : 'block';
  });
});

// Dynamic Price Animation (Optional simple enhancement)
document.querySelectorAll('.product-card').forEach((card) => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-10px)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
  });
});
