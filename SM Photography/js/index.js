// Smooth Scroll for Navigation Links
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1); // Remove # from href
        document.getElementById(targetId).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Form Validation
const form = document.getElementById('booking-form');
form.addEventListener('submit', function (event) {
    // Prevent form submission if any required field is empty
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    let valid = true;

    requiredFields.forEach(field => {
        if (!field.value) {
            field.style.borderColor = 'red'; // Highlight missing fields
            valid = false;
        } else {
            field.style.borderColor = ''; // Reset border color
        }
    });

    if (!valid) {
        event.preventDefault(); // Prevent form submission if validation fails
        alert("Please fill out all required fields.");
    }
});

// Gallery Scroll Animation
const galleryImagesWrapper = document.querySelector('.gallery-images-wrapper');
let scrollAmount = 0;
const scrollSpeed = 2; // Adjust this value for faster/slower scrolling

function autoScrollGallery() {
    if (scrollAmount < galleryImagesWrapper.scrollWidth) {
        scrollAmount += scrollSpeed;
    } else {
        scrollAmount = 0; // Reset scroll
    }
    galleryImagesWrapper.style.transform = `translateX(-${scrollAmount}px)`;
}

setInterval(autoScrollGallery, 30); // Change interval for speed control

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// POST route for booking form submission
app.post('/submit-form', async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        contactNumber,
        eventType,
        packageType,
        eventDate,
        venue,
        details,
        source
    } = req.body;

    // Create Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Booking Details');

    // Add headers
    worksheet.columns = [
        { header: 'First Name', key: 'firstName', width: 20 },
        { header: 'Last Name', key: 'lastName', width: 20 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Contact Number', key: 'contactNumber', width: 15 },
        { header: 'Event Type', key: 'eventType', width: 20 },
        { header: 'Package Type', key: 'packageType', width: 20 },
        { header: 'Event Date', key: 'eventDate', width: 15 },
        { header: 'Venue', key: 'venue', width: 30 },
        { header: 'Details', key: 'details', width: 50 },
        { header: 'Source', key: 'source', width: 20 }
    ];

    // Add data
    worksheet.addRow({
        firstName,
        lastName,
        email,
        contactNumber,
        eventType,
        packageType,
        eventDate,
        venue,
        details,
        source
    });

    // Save Excel file
    const filePath = './BookingDetails.xlsx';
    await workbook.xlsx.writeFile(filePath);

    // Send confirmation email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Booking Confirmation - SM Photography',
        text: `Thank you for contacting SM Photography, ${firstName}! Here are your booking details:\n
        - Event Type: ${eventType}
        - Package: ${packageType}
        - Event Date: ${eventDate}
        - Venue: ${venue}\n
        We will get back to you soon with further details.`,
        attachments: [
            {
                filename: 'BookingDetails.xlsx',
                path: filePath
            }
        ]
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
            return res.status(500).send('Error sending email.');
        }
        console.log('Email sent:', info.response);
        res.status(200).send('Booking details submitted successfully.');
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

