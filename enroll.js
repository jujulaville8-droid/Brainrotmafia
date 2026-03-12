// ========================================
// ENROLL PAGE — Checkbox Gate + Stripe Embedded Checkout
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('acknowledge-checkbox');
    const ctaButton = document.getElementById('enroll-cta');
    const checkoutContainer = document.getElementById('checkout-container');
    let checkoutInitiated = false;

    // Toggle button disabled state based on checkbox
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            ctaButton.classList.remove('btn-disabled');
            ctaButton.disabled = false;
        } else {
            ctaButton.classList.add('btn-disabled');
            ctaButton.disabled = true;
        }
    });

    // Handle CTA click — initialize Stripe Embedded Checkout
    ctaButton.addEventListener('click', async () => {
        if (!checkbox.checked || checkoutInitiated) return;
        checkoutInitiated = true;

        // Update button state
        ctaButton.textContent = 'Loading checkout...';
        ctaButton.classList.add('btn-disabled');
        ctaButton.disabled = true;

        try {
            // Create checkout session via serverless function
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const { clientSecret } = await response.json();

            // Initialize Stripe
            const publishableKey = document.querySelector('meta[name="stripe-key"]')?.content;
            if (!publishableKey) {
                throw new Error('Stripe publishable key not configured');
            }

            const stripe = Stripe(publishableKey);

            // Mount Embedded Checkout
            const checkout = await stripe.initEmbeddedCheckout({ clientSecret });

            // Hide the enrollment form content above checkout
            document.querySelector('.enroll-includes').style.display = 'none';
            document.querySelector('.enroll-price-row').style.display = 'none';
            document.querySelector('.enroll-checkbox-row').style.display = 'none';
            document.querySelector('.enroll-digital-note').style.display = 'none';
            document.querySelector('.pricing-guarantee').style.display = 'none';
            ctaButton.style.display = 'none';

            // Show checkout container and mount
            checkoutContainer.style.display = 'block';
            checkout.mount('#checkout-container');

        } catch (err) {
            console.error('Checkout error:', err);
            ctaButton.innerHTML = 'Pay Now <i class="fa-solid fa-lock"></i>';
            ctaButton.classList.remove('btn-disabled');
            ctaButton.disabled = false;
            checkoutInitiated = false;

            // Show error message
            const existingError = document.querySelector('.enroll-error');
            if (existingError) existingError.remove();

            const errorMsg = document.createElement('p');
            errorMsg.className = 'enroll-error';
            errorMsg.textContent = 'Something went wrong. Please try again.';
            ctaButton.parentNode.insertBefore(errorMsg, ctaButton.nextSibling);
        }
    });
});
