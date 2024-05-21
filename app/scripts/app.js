var client;

init();

async function init() {
    client = await app.initialized();
    client.events.on('app.activated', renderCustomerInfo);
}

async function renderCustomerInfo() {
    const textElement = document.getElementById('apptext');
    const contactData = await client.data.get('contact');

    if (contactData && contactData.contact && contactData.contact.email) {
        console.log("Contact Data incoming:");
        console.info(contactData);

        const email = contactData.contact.email;
        console.log("Email:", email);
        const url = utils.get('domainName')
        const requestBody = JSON.stringify({ customer: { email: email } });
        const signature = generateSignature(requestBody, utils.get('apiKey'));
        console.log("Generated Signature:", signature);

        const response = await fetch(url + '/customer-info', {
            method: 'POST', // Use POST to match typical signature verification patterns
            headers: {
                'Content-Type': 'application/json',
                'X-Freshdesk-Signature': signature
            },
            body: requestBody // Include the request body
        });

        if (response.ok) {
            const data = await response.json();
            console.info('Successfully got data from backend:');
            console.info(data);

            if (data.html) {
                textElement.innerHTML = data.html;
            } else {
                textElement.innerText = "No HTML content available";
            }
        } else {
            textElement.innerText = "Failed to fetch customer info";
        }
    } else {
        textElement.innerText = "No contact data available";
    }
}

function generateSignature(body, secret) {
    return CryptoJS.HmacSHA256(body, secret).toString(CryptoJS.enc.Hex);
}
