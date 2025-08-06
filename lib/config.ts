if (!process.env.ADMIN_EMAIL) {
    throw new Error('ADMIN_EMAIL is not defined in environment variables');
}

export const EMAIL_CONFIG = {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    SUBJECTS: {
        NEW_BOOKING: process.env.EMAIL_SUBJECT_NEW_BOOKING || 'New Booking'
    }
} as const;