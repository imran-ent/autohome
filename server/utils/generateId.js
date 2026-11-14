const generateBookingId = () => {
  const prefix = "BK";
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${random}`;
};

const generateInvoiceNumber = () => {
  const prefix = "INV";
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${random}`;
};

const generateRequestId = () => {
  const prefix = "MR";
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${random}`;
};

export { generateBookingId, generateInvoiceNumber, generateRequestId };
