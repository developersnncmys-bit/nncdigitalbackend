const Lead = require('../models/Lead');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/website-enquiry   (PUBLIC — called by https://nncdigital.co.in)
//
// The website's "Tell us about your business" form posts:
//   { name, phone, email, company, teamsize / teamSize, requirements?, site?, landingPage? }
// We store each submission as a "website" lead in the admin panel's list.
exports.createWebsiteEnquiry = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    mobileNumber,
    email,
    company,
    teamsize,
    teamSize,
    requirements,
    site,
    landingPage,
  } = req.body;

  if (!name && !phone && !email) {
    return res.status(400).json({ message: 'Please provide at least a name, phone, or email.' });
  }

  const notes = [];
  if (requirements) {
    notes.push({ text: requirements, author: 'Website', createdAt: new Date().toISOString() });
  }

  const lead = await Lead.create({
    name: name || 'Website visitor',
    email: email || '',
    mobileNumber: mobileNumber || phone || '',
    company: company || '',
    teamSize: teamSize || teamsize || '',
    status: 'new',
    leadType: 'website',
    // Leads captured from any website form are tagged simply as "Website".
    source: 'Website',
    date: new Date().toISOString().slice(0, 10),
    notes,
  });

  res.status(201).json({ message: 'Enquiry received', id: lead.id });
});
