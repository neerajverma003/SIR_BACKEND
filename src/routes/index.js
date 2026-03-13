const express = require('express');

const authRoutes = require('./auth');
const termsRoutes = require('./terms');
const paymentPolicyRoutes = require('./paymentPolicy');
const cancellationPolicyRoutes = require('./cancellationPolicy');
const testimonialsRoutes = require('./testimonials');
const videoTestimonialsRoutes = require('./videoTestimonials');
const galleryRoutes = require('./gallery');
const blogsRoutes = require('./blogs');
const floorAndRoomRoutes = require('./floorAndRoom');
const bookingsRoutes = require('./bookings');
const guestsRoutes = require('./guests');
const publishRoomRoutes = require('./publishroom.routes');
const reservationRoutes = require('./reservation');
const contactRoutes = require('./contacts');
const suggestionsRoutes = require('./suggestions');
const consultationRoutes = require('./consultations');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/terms', termsRoutes);
router.use('/payment-policy', paymentPolicyRoutes);
router.use('/cancellation-policy', cancellationPolicyRoutes);
router.use('/testimonials', testimonialsRoutes);
router.use('/video-testimonials', videoTestimonialsRoutes);
router.use('/gallery', galleryRoutes);
router.use('/blogs', blogsRoutes);
router.use('/floor-and-rooms', floorAndRoomRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/guests', guestsRoutes);
router.use('/publishrooms', publishRoomRoutes);
router.use('/reservations', reservationRoutes);
router.use('/contacts', contactRoutes);
router.use('/suggestions', suggestionsRoutes);
router.use('/consultations', consultationRoutes);

module.exports = router;