export const actions = {
    contact: async ({ request }) => {
        const data = await request.formData();
        const firstName = data.get('firstName');
        const lastName = data.get('lastName');
        const email = data.get('email');
        const phone = data.get('phone');
        const subject = data.get('subject');
        const message = data.get('message');
        
        // Validation
        if (!firstName || !lastName || !email || !subject || !message) {
            return {
                error: 'Please fill in all required fields.'
            };
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                error: 'Please enter a valid email address.'
            };
        }
        
        try {
            
            
            console.log('Contact form submission:', {
                firstName,
                lastName,
                email,
                phone,
                subject,
                message,
                timestamp: new Date().toISOString()
            });
            
            // For now, just return success
            return {
                success: true
            };
        } catch (error) {
            console.error('Error processing contact form:', error);
            return {
                error: 'An error occurred. Please try again later.'
            };
        }
    }
};


